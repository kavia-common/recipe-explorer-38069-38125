#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Simple healthcheck script to be used by CI to verify the dev server is responding.
 * Exits 0 if the frontend host:port is reachable (2xx-4xx), non-zero otherwise.
 * Reads HOST/PORT from env; defaults to 0.0.0.0:3000.
 * If HEALTHCHECK_PATH is provided, it will request that path, otherwise GET /.
 */
const http = require('http');

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || process.env.REACT_APP_PORT || 3000);
const path = process.env.REACT_APP_HEALTHCHECK_PATH || process.env.HEALTHCHECK_PATH || '/';

const options = {
  host,
  port,
  path,
  timeout: 1500,
};

const req = http.request(options, (res) => {
  if (res.statusCode >= 200 && res.statusCode < 500) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.on('error', () => process.exit(1));

req.end();
