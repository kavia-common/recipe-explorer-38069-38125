# Frontend Environment Variables

Do not commit a `.env` file. Use the orchestrator to provide these values.

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

Local development defaults:
- `.env.development.local` is committed to reduce dev server memory usage in CI (disables source maps and polling, lowers Node max memory). It does not contain secrets. Variables:
  - CHOKIDAR_USEPOLLING=false
  - WATCHPACK_POLLING=false
  - GENERATE_SOURCEMAP=false
  - FAST_REFRESH=false
  - NODE_OPTIONS=--max-old-space-size=1024
  - HOST=0.0.0.0, PORT=3000, CI=true, BROWSER=none
- The start/build scripts also set NODE_OPTIONS=--max-old-space-size=1024 to avoid OOM terminations in constrained environments.
- The dev server is started via `start-noninteractive.js`, which enforces:
  - Non-interactive mode (no port prompts) by setting PORT from REACT_APP_PORT/PORT or defaulting to 3000, automatically selecting a free port.
  - HOST=0.0.0.0 and BROWSER=none for containerized environments.
  - Disables heavy polling (CHOKIDAR_USEPOLLING=false, WATCHPACK_POLLING=false).
  - Disables fast refresh in CI (FAST_REFRESH=false).
  - Graceful SIGTERM/SIGINT handling to exit with code 0 in CI when the process is intentionally stopped.
  - Normalizes child termination by signal or exit code 137/143 or negative signal codes to exit(0) to avoid misleading CI failures when the server is forcibly stopped.
  - Handles SIGINT/SIGTERM from orchestrators (like CI or docker stop) and ensures the parent process exits with code 0 after forwarding signals to the child dev server.
  - Logs explicit normalization messages so CI logs reflect a successful, intentional shutdown.
- A `postinstall` step updates Browserslist DB to silence "browserslist data is old" warnings in CI logs (tolerant of offline CI; non-fatal).

Static assets:
- Images used by the Sign In UI are served by CRA. Ensure any referenced images are inside `public/assets/` and referenced as `/assets/...`.
- Do not import these images via JS imports to keep the bundle minimal; they are static.
