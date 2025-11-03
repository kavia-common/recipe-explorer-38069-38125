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
 *
 * This prevents the "Something is already running on port 3000. Would you like to run the app on another port?"
 * interactive prompt by ensuring a specific PORT is set up-front in CI.
 */

const { spawn } = require('child_process');

function envOrDefault(name, def) {
  return process.env[name] && process.env[name].length ? process.env[name] : def;
}

// Respect REACT_APP_PORT, then PORT, fallback 3000
const resolvedPort = process.env.REACT_APP_PORT || process.env.PORT || '3000';

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

// Start CRA
const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['react-scripts', 'start'],
  {
    stdio: 'inherit',
    env,
  }
);

child.on('close', (code, signal) => {
  if (signal) {
    console.error(`[start-noninteractive] Dev server terminated by signal: ${signal}`);
    process.exit(137); // map to 137 typical OOM/kill for consistency
  }
  process.exit(code);
});
