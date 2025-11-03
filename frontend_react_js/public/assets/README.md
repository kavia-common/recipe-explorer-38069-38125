This folder serves static assets for the React dev server.
Place images referenced by React components here and reference them using absolute paths like /assets/your-image.png.

Notes:
- Images used by src/SignIn.js are expected at /assets/figma_image_*.png.
- Do not import these via JS to keep the bundle minimal; serve statically from /public/assets.
- Keep filenames stable to avoid unnecessary cache busting in development.
