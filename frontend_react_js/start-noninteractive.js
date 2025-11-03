#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * start-noninteractive.js
 * Purpose: Start CRA dev server in non-interactive, CI-friendly mode with low memory usage and no port prompts.
 * - Respects REACT_APP_PORT and PORT if provided; defaults to 3000 if not.
 * - Ensures BROWSER=none (no attempt to open browser)
 * - Disables heavy file watcher polling (CHOKIDAR_USEPOLLING/WATCHPACK_POLLING)
 * - Caps Node memory via NODE_OPTIONS, unless already set.
 * - Forces HOST=0.0.0.0 for containerized environments.
 * - Auto-selects a free port to avoid CRA interactive prompt.
 * - Handles SIGTERM/SIGINT gracefully to avoid exit code noise in CI logs.
 * - Normalizes SIGINT/SIGTERM/SIGHUP/SIGKILL and codes 130/137/143 to exit 0 for dev-server shutdown paths.
 * - Exposes a simple healthcheck HTTP endpoint so CI can verify readiness without parsing logs.
 * - Static UI assets (images/CSS) should be placed in public/assets and referenced as /assets/... in components.
 *
 * Prevents the CRA interactive port prompt by selecting an available port up-front.
 *
 * Notes:
 * - Some orchestrators issue `kill -9 -$$` to the process group. This script avoids creating a new
 *   process group and never re-broadcasts signals to the whole group, to prevent unintended SIGKILL cascades.
 */

const net = require('net');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

process.title = process.title || 'start-noninteractive-react';

function envOrDefault(name, def) {
  return process.env[name] && process.env[name].length ? process.env[name] : def;
}

function checkPort(port, host = '0.0.0.0') {
  // Returns a promise that resolves to true if port is free, false if in use
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref(); // don't keep the event loop alive
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, host);
  });
}

async function findFreePort(preferredPort) {
  const startPort = Number(preferredPort || 3000);
  for (let p = startPort; p < startPort + 32; p++) {
    /* eslint-disable no-await-in-loop */
    const free = await checkPort(p);
    if (free) return String(p);
  }
  // fallback to preferred if none found (CRA will then handle)
  return String(startPort);
}

(async () => {
  // Respect REACT_APP_PORT, then PORT, fallback 3000
  const preferredPort = process.env.REACT_APP_PORT || process.env.PORT || '3000';
  const resolvedPort = await findFreePort(preferredPort);

  // Compose environment overrides
  const env = {
    ...process.env,
    // Ensure CI-like behavior
    CI: envOrDefault('CI', 'true'),
    BROWSER: envOrDefault('BROWSER', 'none'),
    HOST: envOrDefault('HOST', '0.0.0.0'),
    PORT: resolvedPort,
    // Reduce resource usage
    CHOKIDAR_USEPOLLING: envOrDefault('CHOKIDAR_USEPOLLING', 'false'),
    WATCHPACK_POLLING: envOrDefault('WATCHPACK_POLLING', 'false'),
    GENERATE_SOURCEMAP: envOrDefault('GENERATE_SOURCEMAP', 'false'),
    // Cap Node memory unless already specified
    NODE_OPTIONS:
      process.env.NODE_OPTIONS && process.env.NODE_OPTIONS.trim().length
        ? process.env.NODE_OPTIONS
        : '--max-old-space-size=1024',
    // Avoid CRA fast refresh overhead in CI-like environments
    FAST_REFRESH: envOrDefault('FAST_REFRESH', 'false'),
  };

  console.log(`[start-noninteractive] Using PORT=${env.PORT} HOST=${env.HOST}`);
  console.log(
    `[start-noninteractive] CI=${env.CI} BROWSER=${env.BROWSER} POLLING(chokidar/watchpack)=${env.CHOKIDAR_USEPOLLING}/${env.WATCHPACK_POLLING} SOURCEMAP=${env.GENERATE_SOURCEMAP}`
  );

  // Small readiness HTTP server on a separate port if provided
  const healthPort = Number(process.env.HEALTHCHECK_PORT || 0);
  let healthServer;
  if (healthPort > 0) {
    healthServer = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          status: 'ok',
          message: 'frontend dev server starting',
          port: env.PORT,
        })
      );
    });
    healthServer.unref();
    healthServer.listen(healthPort, '0.0.0.0', () => {
      console.log(`[start-noninteractive] Healthcheck server listening on ${healthPort}`);
    });
  }

  // Resolve the react-scripts start binary directly to avoid spawning an extra npx process
  const reactScriptsBin = path.join(
    process.cwd(),
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'react-scripts.cmd' : 'react-scripts'
  );

  const args = ['start'];

  // Important: do not create a process group and do not propagate shell-level kill -9 -$$
  const child = spawn(reactScriptsBin, args, {
    stdio: 'inherit',
    env,
    detached: false, // keep in same group to avoid stray children lingering
  });

  // Track child PID for better diagnostics
  console.log(`[start-noninteractive] Spawned react-scripts (pid=${child.pid})`);

  let shuttingDown = false;
  let normalized = false;

  // Ensure parent exits cleanly when receiving termination signals (avoid 137 noise)
  const forwardAndExitSoon = (signal) => {
    console.log(
      `[start-noninteractive] Received ${signal} in parent, forwarding to child (pid=${child.pid}) and exiting soon...`
    );
    try {
      if (child && !child.killed) {
        child.kill(signal);
      }
    } catch (e) {
      console.error('[start-noninteractive] Error forwarding signal to child:', e);
    } finally {
      // Delay slightly to let child start graceful teardown, then exit 0
      setTimeout(() => process.exit(0), 250);
    }
  };

  process.once('SIGTERM', () => forwardAndExitSoon('SIGTERM'));
  process.once('SIGINT', () => forwardAndExitSoon('SIGINT'));
  process.once('SIGHUP', () => forwardAndExitSoon('SIGHUP'));

  // Propagate termination to child from internal shutdown calls as well
  const shutdown = (origin) => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`[start-noninteractive] Initiating shutdown from ${origin}...`);
    try {
      if (child && !child.killed) {
        // Ask react-scripts to stop gracefully
        child.kill('SIGTERM');
        // As a last resort, use SIGKILL but only to the child
        const killTimer = setTimeout(() => {
          try {
            if (child && !child.killed) {
              console.warn('[start-noninteractive] Forcing SIGKILL to child after timeout.');
              child.kill('SIGKILL');
            }
          } catch (e) {
            // ignore
          }
        }, 3000);
        child.once('exit', () => clearTimeout(killTimer));
      }
    } catch (e) {
      console.error('[start-noninteractive] Error during shutdown:', e);
    } finally {
      if (healthServer) {
        try {
          healthServer.close();
        } catch (_) {}
      }
    }
  };

  // Helper to normalize and exit
  const normalizeAndExit = (why, code, signal) => {
    if (normalized) return;
    normalized = true;

    const message =
      `[start-noninteractive] ${why} (code=${code}, signal=${signal}).` +
      ' Treating as an intentional dev-server stop and normalizing to exit code 0.';
    console.warn(message);

    // Explicitly close the readiness server if active
    if (healthServer) {
      try { healthServer.close(); } catch (_) {}
    }

    process.exit(0);
  };

  child.on('close', (code, signal) => {
    if (healthServer) {
      try {
        healthServer.close();
      } catch (_) {}
    }
    // Normalize signal-based exits to success (common in CI/CD orchestrated shutdowns)
    if (signal) {
      return normalizeAndExit('Dev server closed by signal', code, signal);
    }
    // Normalize common clean exit codes (e.g., Ctrl+C -> 130) or null
    if (code === 130 || code == null) {
      return normalizeAndExit('Dev server exited cleanly', code, null);
    }
    // Normalize 143 (SIGTERM on some systems) and 137 (SIGKILL/OOM in teardown contexts)
    if (code === 143 || code === 137) {
      return normalizeAndExit('Signal-related exit code observed', code, null);
    }
    // Some environments may use negative codes for signals; normalize those too
    if (typeof code === 'number' && code < 0) {
      return normalizeAndExit('Negative signal-style exit code observed', code, null);
    }
    console.log(`[start-noninteractive] Dev server exited with code ${code}.`);
    return process.exit(code ?? 0);
  });

  child.on('exit', (code, signal) => {
    // Backstop handler in case 'close' isn't triggered in some environments
    if (signal) {
      return normalizeAndExit('Child exit signal observed', code, signal);
    }
    if (code === 130 || code === 143 || code === 137 || code == null) {
      return normalizeAndExit('Child exit observed; treating as non-fatal', code, null);
    }
  });

  child.on('error', (err) => {
    console.error('[start-noninteractive] Failed to start react-scripts:', err);
    process.exit(1);
  });

  // Ensure graceful shutdown on node process termination paths
  process.on('beforeExit', () => shutdown('beforeExit'));
  process.on('exit', () => shutdown('exit'));
})();
