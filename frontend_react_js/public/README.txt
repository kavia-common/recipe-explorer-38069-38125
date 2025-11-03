This folder contains public assets served by the CRA dev server.

- index.html: Root HTML template with <div id="root"> for React mount.
- manifest.json: Minimal web app manifest.
- assets/: Static images referenced by components using /assets/... paths.

Dev server notes:
- The app uses a non-interactive starter (start-noninteractive.js) that:
  - Picks a free port near PORT/REACT_APP_PORT (default 3000)
  - Forces HOST=0.0.0.0, BROWSER=none for containers
  - Disables heavy watcher polling and sourcemaps in CI to reduce CPU/memory
  - Caps Node memory via NODE_OPTIONS=--max-old-space-size=1024
  - Normalizes SIGINT/SIGTERM/SIGHUP/143/137 exits to code 0 during teardown

These settings avoid false CI failures when the orchestrator stops the dev server.
