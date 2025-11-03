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
  - BROWSER=none, HOST=0.0.0.0, PORT=3000, CI=true
  - CHOKIDAR_USEPOLLING=false, WATCHPACK_POLLING=false
  - GENERATE_SOURCEMAP=false, FAST_REFRESH=false
  - NODE_OPTIONS=--max-old-space-size=1024
  - Optional REACT_APP_PORT=3000
- The start/build scripts also honor NODE_OPTIONS=--max-old-space-size=1024 to avoid OOM terminations (exit 137) in constrained environments.
- The dev server is started via `start-noninteractive.js`, which enforces:
  - Non-interactive mode (no port prompts) by selecting a free port near REACT_APP_PORT/PORT (default 3000).
  - HOST=0.0.0.0 and BROWSER=none for containerized environments.
  - Disables heavy polling (CHOKIDAR_USEPOLLING=false, WATCHPACK_POLLING=false).
  - Disables fast refresh in CI (FAST_REFRESH=false).
  - Graceful SIGTERM/SIGINT/SIGHUP handling and normalization of exit codes 130/137/143 and signal exits to 0 to avoid misleading CI failures when the server is intentionally stopped or force-terminated.
  - Explicit logs to reflect successful, intentional shutdown.
  - Optional readiness endpoint when `HEALTHCHECK_PORT` is set, returning `{status:"ok"}`.

Post-install:
- A `postinstall` step updates Browserslist DB to silence "browserslist data is old" warnings in CI logs (tolerant of offline CI; non-fatal).

Static assets:
- Images used by the Sign In UI are served by CRA. Ensure any referenced images are inside `public/assets/` and referenced as `/assets/...`.
- Do not import these images via JS imports to keep the bundle minimal; they are static.
