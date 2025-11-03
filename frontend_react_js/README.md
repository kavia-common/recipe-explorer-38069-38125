# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

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
- Gracefully handles SIGTERM/SIGINT and normalizes exit codes 130/137/143 to 0 for CI when shutdown is intentional
- Optional: set `HEALTHCHECK_PORT` to expose a simple JSON readiness endpoint

Open http://localhost:3000 to view it in your browser.

### `npm run healthcheck`

Performs a simple HTTP request to the configured HOST/PORT (or defaults) and exits 0 if reachable. You can also set `HEALTHCHECK_PATH` to adjust the path.

### `npm test`

Launches the test runner in non-watch CI mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### Environment and CI

- `.env.development.local` is included to reduce dev server memory and CPU footprint in CI (disables sourcemaps/polling, caps Node memory).
- A `postinstall` step updates Browserslist DB to avoid "browserslist data is X months old" warnings.

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
