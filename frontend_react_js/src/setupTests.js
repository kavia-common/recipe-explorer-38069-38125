/* jest-dom adds custom jest matchers for asserting on DOM nodes.
   allows you to do things like:
   expect(element).toHaveTextContent(/react/i)
   learn more: https://github.com/testing-library/jest-dom */
import '@testing-library/jest-dom';

// Mock static asset imports for stability in CI (images in JSX)
Object.defineProperty(global.Image.prototype, 'src', {
  set() {
    // no-op to prevent real network requests in JSDOM
  },
});
