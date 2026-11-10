// Packaging checks for dist/frameObserver.js (Node only, no browser page needed).
// Runs with `npm run test:dist` on the chromium project only.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const acorn = require('acorn');
const { test, expect } = require('@playwright/test');

const ROOT = path.join(__dirname, '../..');
const DIST = path.join(ROOT, 'dist/frameObserver.js');
const API = [
  'on',
  'off',
  'trigger',
  'callMethod',
  'registerEvent',
  'unregisterEvent',
  'registerMethods',
  'resolveState',
  'rejectState',
  'readyState',
  'getContext',
];

/** Runs dist in a fresh context with a minimal window. */
const load = (extraGlobals = {}) => {
  const win = { addEventListener() {} };
  win.window = win;
  Object.assign(win, extraGlobals);
  vm.runInNewContext(fs.readFileSync(DIST, 'utf8'), win);
  return win;
};
const apiTypes = (obj) => API.map((name) => typeof (obj && obj[name]));
const ALL_FUNCTIONS = API.map(() => 'function');

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'browser independent');
});

test('package.json main points at dist/frameObserver.js', () => {
  const pkg = require(path.join(ROOT, 'package.json'));
  expect(path.resolve(ROOT, pkg.main)).toBe(DIST);
});

test('dist is ES5', () => {
  expect(() => acorn.parse(fs.readFileSync(DIST, 'utf8'), { ecmaVersion: 5 })).not.toThrow();
});

test('CommonJS export is the frameObserver instance', () => {
  const module = { exports: {} };
  const win = load({ module, exports: module.exports });
  expect(apiTypes(module.exports)).toEqual(ALL_FUNCTIONS);
  expect(module.exports).toBe(win.frameObserver);
});

test('AMD define receives a factory returning the frameObserver instance', () => {
  let deps;
  let exported;
  const define = (d, factory) => {
    deps = d;
    exported = factory();
  };
  define.amd = true;
  const win = load({ define });
  expect(deps).toEqual([]);
  expect(apiTypes(exported)).toEqual(ALL_FUNCTIONS);
  expect(exported).toBe(win.frameObserver);
});

test('script tag exposes window.frameObserver', () => {
  expect(apiTypes(load().frameObserver)).toEqual(ALL_FUNCTIONS);
});

test('source map is referenced and present', () => {
  const code = fs.readFileSync(DIST, 'utf8');
  expect(code).toMatch(/\/\/# sourceMappingURL=frameObserver\.js\.map\s*$/);
  const map = JSON.parse(fs.readFileSync(DIST + '.map', 'utf8'));
  expect(map.file).toBe('frameObserver.js');
  expect(map.sources.length).toBeGreaterThan(0);
});
