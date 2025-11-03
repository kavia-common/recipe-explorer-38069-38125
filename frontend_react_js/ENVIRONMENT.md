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
- `.env.development.local` is included solely to reduce dev server memory usage in CI (disables source maps and polling, lowers Node max memory). It does not contain secrets.
- The start/build scripts also set NODE_OPTIONS=--max-old-space-size=1024 to avoid OOM terminations in constrained environments.
- The dev server is started via `start-noninteractive.js`, which enforces:
  - Non-interactive mode (no port prompts) by setting PORT from REACT_APP_PORT/PORT or defaulting to 3000
  - HOST=0.0.0.0 and BROWSER=none for containerized environments
  - Disables heavy polling (CHOKIDAR_USEPOLLING=false, WATCHPACK_POLLING=false)
  - Disables fast refresh in CI (FAST_REFRESH=false)
  - Graceful SIGTERM/SIGINT handling to exit with code 0 in CI when the process is intentionally stopped (prevents exit 137 noise)
- A `postinstall` step updates Browserslist DB to silence "browserslist data is old" warnings in CI logs (tolerant of offline CI; non-fatal).
- Graceful shutdown: start-noninteractive.js maps SIGTERM/SIGKILL exits to 0, preventing misleading exit 137 failures when CI stops the dev server intentionally.
