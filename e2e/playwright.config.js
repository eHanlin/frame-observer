const { defineConfig, devices } = require('@playwright/test');

const PORT = Number(process.env.PORT || 4173);
// FO_BRANDED=1 adds the installed Google Chrome and Microsoft Edge projects.
const BRANDED = process.env.FO_BRANDED === '1';

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  // unit.spec.js needs the internals exposed by entry.js, which dist/ does not export;
  // package.spec.js checks dist/ itself, so it only runs with FO_TARGET=dist.
  testIgnore: process.env.FO_TARGET === 'dist' ? ['**/unit.spec.js'] : ['**/package.spec.js'],
  globalSetup: require.resolve('./global-setup'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  timeout: 10000,
  use: {
    // Parent page runs on localhost; child frames are loaded from 127.0.0.1 (cross-origin).
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
    // Branded browsers must be installed on the machine (preinstalled on GitHub's ubuntu runners).
    ...(BRANDED
      ? [
          { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
          { name: 'msedge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
        ]
      : []),
  ],
  webServer: {
    command: 'node server.js',
    url: `http://127.0.0.1:${PORT}/parent.html`,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
  },
});
