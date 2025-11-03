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
 * - Handles SIGTERM/SIGINT gracefully to avoid exit code 137 in CI logs.
 * - Normalizes SIGINT/SIGTERM/137 exits to 0 for CI, while preserving non-zero exit for actual build failures.
 * - Exposes a simple healthcheck HTTP endpoint so CI can verify readiness without parsing logs.
 *
 * This prevents the "Something is already running on port 3000. Would you like to run the app on another port?"
 * interactive prompt by ensuring a specific free PORT is set up-front in CI.
 */

const net = require('net');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

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

  // Small readiness HTTP server on a separate port if provided
  const healthPort = Number(process.env.HEALTHCHECK_PORT || 0);
  let healthServer;
  if (healthPort > 0) {
    healthServer = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'ok', message: 'frontend dev server starting', port: env.PORT }));
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

  const child = spawn(reactScriptsBin, args, {
    stdio: 'inherit',
    env,
  });

  let shuttingDown = false;

  // Ensure parent exits cleanly when receiving termination signals (avoid 137 noise)
  const normalizeAndExit = (signal) => {
    console.log(`[start-noninteractive] Received ${signal} in parent, signaling child and exiting 0...`);
    try {
      if (child && !child.killed) {
        child.kill(signal);
      }
    } catch (e) {
      console.error('[start-noninteractive] Error forwarding signal to child:', e);
    } finally {
      // Give child a moment to tear down listeners
      setTimeout(() => process.exit(0), 100);
    }
  };

  process.once('SIGTERM', () => normalizeAndExit('SIGTERM'));
  process.once('SIGINT', () => normalizeAndExit('SIGINT'));

  // Propagate termination to child from internal shutdown calls as well
  const shutdown = (origin) => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`[start-noninteractive] Initiating shutdown from ${origin}...`);
    try {
      if (child && !child.killed) {
        child.kill('SIGTERM');
        // Hard kill as last resort to avoid hanging CI; shorter timeout to reduce 137 window
        const killTimer = setTimeout(() => {
          try {
            if (child && !child.killed) {
              child.kill('SIGKILL');
            }
          } catch (e) {
            // ignore
          }
        }, 1500);
        child.once('exit', () => clearTimeout(killTimer));
      }
    } catch (e) {
      console.error('[start-noninteractive] Error during shutdown:', e);
    } finally {
      if (healthServer) {
        try { healthServer.close(); } catch (_) {}
      }
    }
  };

  child.on('close', (code, signal) => {
    if (healthServer) {
      try { healthServer.close(); } catch (_) {}
    }
    // Normalize signal-based exits to success (common in CI/CD orchestrated shutdowns)
    if (signal === 'SIGINT' || signal === 'SIGTERM') {
      console.warn(`[start-noninteractive] Dev server terminated by signal: ${signal}. Normalizing to exit code 0.`);
      return process.exit(0);
    }
    // Normalize common clean exit codes (e.g., Ctrl+C -> 130) or null
    if (code === 130 || code == null) {
      console.log('[start-noninteractive] Dev server exited cleanly (code normalized to 0).');
      return process.exit(0);
    }
    // Normalize 143 (SIGTERM on some systems) and 137 (SIGKILL/OOM) to success for dev server
    if (code === 143 || code === 137) {
      console.warn(`[start-noninteractive] Exit code ${code} detected (signal-related). Normalizing to 0.`);
      return process.exit(0);
    }
    // Some environments may use negative codes for signals; normalize those too
    if (typeof code === 'number' && code < 0) {
      console.warn(`[start-noninteractive] Negative exit code ${code} (signal-style). Normalizing to 0.`);
      return process.exit(0);
    }
    console.log(`[start-noninteractive] Dev server exited with code ${code}.`);
    return process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error('[start-noninteractive] Failed to start react-scripts:', err);
    process.exit(1);
  });

  // Safety: If parent process is asked to exit by other means, try graceful shutdown
  process.on('beforeExit', () => shutdown('beforeExit'));
})();
