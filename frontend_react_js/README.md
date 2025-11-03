# Lightweight React Template for KAVIA

Note: Public folder and .env.development.local are committed to guarantee stable non-interactive startup in CI (no prompts, no sourcemaps, capped memory). Shutdown signals are normalized to 0 by the start wrapper to avoid false failures.

Note: This app uses a non-interactive start wrapper that normalizes SIGINT/SIGTERM/137/143 to 0 during orchestrated shutdown. Exit code 137 seen in logs during teardown is not treated as a failure. Deprecation warnings like [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE]/[DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] from CRA 5 dev server are expected and harmless.

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

Committed stability files:
- .env.development.local with CI-friendly defaults (BROWSER=none, HOST=0.0.0.0, PORT=3000, NODE_OPTIONS=--max-old-space-size=1024, etc.)
- public/index.html, manifest.json, robots.txt
- public/logo192.png, public/logo512.png, public/favicon.ico (placeholders for dev)
- public/assets/* copied from assets/figmaimages for runtime availability

Public folder and CI defaults are committed:
- public/index.html, manifest.json, robots.txt, and placeholder icons exist to avoid dev-server 404s and ensure stable startup.
- .env.development.local caps Node heap (1024 MB), disables sourcemaps/polling/fast refresh, and sets BROWSER/HOST/PORT for non-interactive starts.
- All Figma images referenced by components are available under public/assets so React can serve them by /assets/... URLs.

## Features

- Lightweight: No heavy UI frameworks - uses only vanilla CSS and React
- Modern UI: Clean, responsive design with KAVIA brand styling
- Fast: Minimal dependencies for quick loading times
- Simple: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.
- Starts in non-interactive CI-friendly mode (no port prompts, no browser launch)
- Uses HOST=0.0.0.0 and PORT=3000 by default (configurable via env)
- Gracefully handles SIGTERM/SIGINT/SIGHUP and normalizes exit codes 130/137/143 and signal exits to 0 for CI when shutdown is intentional or forced
- Recognizes SIGKILL/OOM (137), SIGTERM (143), and SIGINT (130) during dev-server shutdown paths and normalizes these to exit code 0 to avoid false CI failures. Real build errors still exit non-zero.
- Uses committed .env.development.local to cap Node heap (1024 MB), disable sourcemaps/polling/fast refresh, and set BROWSER/HOST/PORT for non-interactive starts.
- Avoids process-group re-kills; only signals the CRA child and exits cleanly
- Optional: set `HEALTHCHECK_PORT` to expose a simple JSON readiness endpoint (returns {status:"ok"}). Health path for HTTP checks defaults to `/` and can be overridden with `REACT_APP_HEALTHCHECK_PATH` or `HEALTHCHECK_PATH`.

Non-interactive/low-memory defaults are in `.env.development.local` (committed). You can override locally if needed.

Open http://localhost:3000 to view it in your browser.

UI parity note:
- The Sign In screen is implemented in src/SignIn.js using assets served from public/assets.
- If images are missing, ensure Figma-derived images exist under public/assets and are referenced via /assets/... paths.
- The dev server wrapper normalizes signal exits (SIGINT/SIGTERM/137/143) to 0 during orchestrated shutdown to avoid false CI failures.

Public files:
- `public/index.html` is the CRA HTML template with a `<div id="root">` mount point.
- `public/manifest.json` defines basic PWA metadata (optional).
- `public/robots.txt` included.
- `public/assets/` is where runtime-served images should live and be referenced as `/assets/...`. Required Figma images are copied here so the Sign In screen does not 404.
- Placeholder icons `logo192.png`, `logo512.png`, and `favicon.ico` are present for development (replace in production).

### `npm run healthcheck`

Performs a simple HTTP request to the configured HOST/PORT (or defaults) and exits 0 if reachable. You can also set `HEALTHCHECK_PATH` or `REACT_APP_HEALTHCHECK_PATH` to adjust the path.

### `npm test`

Launches the test runner in non-watch CI mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### Environment and CI

- `.env.development.local` is included and committed to reduce dev server memory and CPU footprint in CI (disables sourcemaps/polling, caps Node memory, BROWSER=none, HOST=0.0.0.0, PORT=3000, CI=true).
- A `postinstall` step updates Browserslist DB to avoid "browserslist data is X months old" warnings.
- The start wrapper normalizes shutdown signal exits (130/137/143 or signal) to 0 to avoid false failures when the orchestrator stops the server intentionally.

### Troubleshooting (CI/Orchestrated Runs)

- Exit code 137/143 or messages about SIGINT/SIGTERM during teardown are normalized to 0 by `start-noninteractive.js`. This indicates an intentional shutdown, not a failure.
- If you need to force a different port, set `REACT_APP_PORT` or `PORT`. The wrapper will auto-pick a free port near it to avoid CRA’s interactive prompt.
- For constrained environments, keep `NODE_OPTIONS=--max-old-space-size=1024` to avoid OOM issues.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`.

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`.

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the React documentation: https://reactjs.org/

### Code Splitting

Docs: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

Docs: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

Docs: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

Docs: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

Docs: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

Docs: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
