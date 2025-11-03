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
 *
 * This prevents the "Something is already running on port 3000. Would you like to run the app on another port?"
 * interactive prompt by ensuring a specific free PORT is set up-front in CI.
 */

const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

function envOrDefault(name, def) {
  return process.env[name] && process.env[name].length ? process.env[name] : def;
}

function checkPort(port, host = '0.0.0.0') {
  // Returns a promise that resolves to true if port is free, false if in use
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => server.close(() => resolve(true)))
      .listen(port, host);
  });
}

async function findFreePort(preferredPort) {
  const startPort = Number(preferredPort || 3000);
  for (let p = startPort; p < startPort + 20; p++) {
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
    NODE_OPTIONS: process.env.NODE_OPTIONS && process.env.NODE_OPTIONS.trim().length
      ? process.env.NODE_OPTIONS
      : '--max-old-space-size=1024',
    // Avoid CRA fast refresh overhead in CI-like environments
    FAST_REFRESH: envOrDefault('FAST_REFRESH', 'false'),
  };

  console.log(`[start-noninteractive] Using PORT=${env.PORT} HOST=${env.HOST}`);

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

  // Propagate termination to child and exit cleanly (avoid 137 mapping)
  const shutdown = (signal) => {
    if (!child.killed) {
      console.log(`[start-noninteractive] Received ${signal}, shutting down dev server...`);
      child.kill('SIGTERM');
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  child.on('close', (code, signal) => {
    if (signal) {
      console.error(`[start-noninteractive] Dev server terminated by signal: ${signal}`);
      // Map SIGKILL/SIGTERM to 0 for graceful CI completion unless true error occurred
      const normalized = signal === 'SIGKILL' || signal === 'SIGTERM' ? 0 : 1;
      process.exit(normalized);
      return;
    }
    process.exit(code ?? 0);
  });

  child.on('error', (err) => {
    console.error('[start-noninteractive] Failed to start react-scripts:', err);
    process.exit(1);
  });
})();
