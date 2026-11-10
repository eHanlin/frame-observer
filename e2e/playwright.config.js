const { defineConfig, devices } = require('@playwright/test');

const PORT = Number(process.env.PORT || 4173);

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  // unit.spec.js needs the internals exposed by entry.js, which dist/ does not export.
  testIgnore: process.env.FO_TARGET === 'dist' ? ['**/unit.spec.js'] : [],
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
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node server.js',
    url: `http://127.0.0.1:${PORT}/parent.html`,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
  },
});
