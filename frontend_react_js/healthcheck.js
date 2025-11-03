#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Simple healthcheck script to be used by CI to verify the dev server is responding.
 * Exits 0 if the frontend host:port is reachable (2xx-4xx), non-zero otherwise.
 * Reads HOST/PORT from env; defaults to 0.0.0.0:3000.
 * If HEALTHCHECK_PATH is provided, it will request that path, otherwise GET /.
 * Example: HOST=127.0.0.1 PORT=3000 HEALTHCHECK_PATH=/ node healthcheck.js
 */
const http = require('http');

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || process.env.REACT_APP_PORT || 3000);
// Support both REACT_APP_HEALTHCHECK_PATH and HEALTHCHECK_PATH
const path = process.env.REACT_APP_HEALTHCHECK_PATH || process.env.HEALTHCHECK_PATH || '/'; // default to root

const options = {
  host,
  port,
  path,
  method: 'GET',
  timeout: 2000,
  headers: {
    'User-Agent': 'frontend-healthcheck/1.0'
  }
};

const req = http.request(options, (res) => {
  if (res.statusCode >= 200 && res.statusCode < 500) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('timeout', () => {
  try { req.destroy(); } catch (_) {}
  process.exit(1);
});

req.on('error', () => process.exit(1));

req.end();
