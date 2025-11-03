#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Simple healthcheck script to be used by CI to verify the dev server is responding.
 * Exits 0 if the frontend host:port is reachable (2xx-4xx), non-zero otherwise.
 * Reads HOST/PORT from env; defaults to 0.0.0.0:3000 (requests to 127.0.0.1 when HOST is 0.0.0.0). PORT may be provided by REACT_APP_PORT as fallback.
 * If HEALTHCHECK_PATH is provided, it will request that path, otherwise GET /.
 * Example: HOST=127.0.0.1 PORT=3000 HEALTHCHECK_PATH=/ node healthcheck.js
 */
const http = require('http');

const host = process.env.HOST || '0.0.0.0';
if (host === '0.0.0.0') {
  // For local health checks, prefer loopback when host is 0.0.0.0 bind
  process.env._HEALTH_HOST = '127.0.0.1';
}
const port = Number(process.env.PORT || process.env.REACT_APP_PORT || 3000);
// Support both REACT_APP_HEALTHCHECK_PATH and HEALTHCHECK_PATH
const path = process.env.REACT_APP_HEALTHCHECK_PATH || process.env.HEALTHCHECK_PATH || '/'; // default to root
// Normalize double slashes
const normalizedPath = (path.startsWith('/') ? path : `/${path}`).replace(/\/{2,}/g, '/');

const options = {
  host: process.env._HEALTH_HOST || host,
  port,
  path: normalizedPath,
  method: 'GET',
  timeout: 5000,
  headers: {
    'User-Agent': 'frontend-healthcheck/1.0'
  }
};
console.log(`[healthcheck] GET http://${options.host}:${options.port}${options.path}`);
console.log('[healthcheck] Note: Dev-server shutdown by signals (SIGINT/SIGTERM/SIGHUP) or codes (130/137/141/143) is normalized to success (exit 0) by the start wrapper in CI.');

const req = http.request(options, (res) => {
  const ok = res.statusCode >= 200 && res.statusCode < 500;
  console.log(`[healthcheck] status=${res.statusCode} ok=${ok}`);
  if (ok) {
    process.exit(0);
  } else {
    console.error(`[healthcheck] Unhealthy response code: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('timeout', () => {
  try { req.destroy(); } catch (_) {}
  process.exit(1);
});

req.on('error', () => process.exit(1));

req.end();
