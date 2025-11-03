# Frontend Environment Variables

Do not commit a `.env` file with secrets. Use the orchestrator to provide sensitive values.

The app reads the following variables (as provided in the container metadata):

- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

Local development & CI defaults:
- `.env.development.local` is committed to reduce dev server memory/CPU in CI (disables source maps/polling, caps Node memory, disables fast refresh). It does not contain secrets. Variables include:
  - BROWSER=none, HOST=0.0.0.0, PORT=3000, REACT_APP_PORT=3000, CI=true
  - CHOKIDAR_USEPOLLING=false, WATCHPACK_POLLING=false
  - GENERATE_SOURCEMAP=false, FAST_REFRESH=false
  - NODE_OPTIONS=--max-old-space-size=1024
  - Optional REACT_APP_HEALTHCHECK_PATH=/

- CRA static assets (images/CSS) for the Sign In UI live in `public/assets/` and are referenced as `/assets/...` paths. The required public files (`public/index.html`, `public/manifest.json`, `public/robots.txt`, and placeholder icons) are included and committed to ensure the dev server starts cleanly and avoid 404s on static fetches. All Figma images used by SignIn are copied to `public/assets/`. If additional images are needed, place them under `public/assets/` and reference using `/assets/...` absolute paths. Placeholders for icons are provided for development environments.
- The start/build scripts also honor NODE_OPTIONS=--max-old-space-size=1024 to avoid OOM terminations (exit 137) in constrained environments.
- During orchestrated shutdowns, if the dev server receives SIGINT/SIGTERM/SIGHUP, the start wrapper normalizes these to exit code 0 to prevent false CI failures. Only genuine build/start errors will exit non-zero.

Dev server start wrapper:
- The dev server is started via `start-noninteractive.js`, which enforces:
  - Non-interactive mode (no port prompts) by selecting a free port near REACT_APP_PORT/PORT (default 3000).
  - HOST=0.0.0.0 and BROWSER=none for containerized environments.
  - Disables heavy polling (CHOKIDAR_USEPOLLING=false, WATCHPACK_POLLING=false).
  - Disables fast refresh in CI (FAST_REFRESH=false).
  - Graceful SIGTERM/SIGINT/SIGHUP handling and normalization of exit codes 130/137/143 and signal exits to 0 to avoid misleading CI failures when the server is intentionally stopped or force-terminated.
  - Explicit logs to reflect successful, intentional shutdown.
  - Optional readiness endpoint when `HEALTHCHECK_PORT` is set, returning `{status:"ok"}`.
  - Non-interactive port selection avoids CRA prompts; it auto-picks a free port starting from REACT_APP_PORT/PORT (default 3000).

Post-install:
- A `postinstall` step updates Browserslist DB to silence "browserslist data is old" warnings in CI logs (tolerant of offline CI; non-fatal).

Static assets:
- Images used by the Sign In UI are served by CRA. Ensure any referenced images are inside `public/assets/` and referenced as `/assets/...`.
- Do not import these images via JS imports to keep the bundle minimal; they are static.
- All Figma-derived images have been copied to `public/assets/` to ensure runtime availability.

Notes on CI exit codes:
- When the orchestrator stops the dev server via SIGINT/SIGTERM (or even SIGKILL during teardown), the wrapper normalizes these exits to code 0. This avoids false failures where the server was intentionally terminated (sometimes shown as 137/143). Real build/start failures still exit non-zero.
- The wrapper signals the CRA child directly and exits cleanly, avoiding process-group kill patterns. Orchestrated stops (SIGINT/SIGTERM) are treated as intentional and normalized to exit code 0.

Additional notes:
- For stability, prefer `npm start` (wrapper) over `react-scripts start` directly in CI.
- If you see [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE]/[DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] warnings, they are harmless and expected with CRA 5 dev server.

Public files:
- CRA public folder is provided with `public/index.html`, `public/manifest.json`, and `public/robots.txt`.
- Figma assets are copied to `public/assets/` and referenced as `/assets/...` by React components.
