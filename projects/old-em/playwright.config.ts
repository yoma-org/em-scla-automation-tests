import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { authFile } from './src/utils/Environment';

// Old EM UAT (https://www.uat.ted.synergy.yomaland360.com), the baseline the New EM rebuild copies.
// The test cases are the em app's (projects/em/docs/test-cases/); see PROJECT.md.
const envFile = path.join(__dirname, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

/**
 * See https://playwright.dev/docs/test-configuration.
 * Paths are absolute (__dirname) so this config works both directly
 * (`npx playwright test -c projects/old-em`) and through the root playwright.config.ts.
 *
 * One worker: the cases share one UAT that other testers use, and the money flows of one
 * area read balances another area changes.
 */
export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  outputDir: path.join(__dirname, 'test-results'),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }],
    // Read by scripts/build-report.mjs to write report/old-em-issues.md.
    ['json', { outputFile: path.join(__dirname, 'test-results', 'results.json') }]
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000
  },
  projects: [
    // No trace for the login: it records the typed password.
    { name: 'setup', testMatch: /auth\.setup\.ts/, use: { trace: 'off' } },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, storageState: authFile('admin') },
      dependencies: ['setup']
    }
  ]
});
