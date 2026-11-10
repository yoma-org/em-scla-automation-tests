import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { authFile } from './src/utils/Environment';

// Each app loads its own env file (git-ignored, see .env.example). TARGET_ENV picks which one:
//   (unset)          → .env       UAT, used to check Jira issues (sanity)
//   TARGET_ENV=test  → .env.test  separate test environment (smoke, e2e, regression)
// In CI the same values come from the GitHub environment's secrets as plain env vars.
const target = process.env.TARGET_ENV;
const envFile = path.join(__dirname, target ? `.env.${target}` : '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);
else if (target && !process.env.CI) {
  throw new Error(`TARGET_ENV=${target} but ${envFile} is missing. Copy .env.example to .env.${target} and fill it in.`);
}

const adminState = authFile('admin');

/**
 * See https://playwright.dev/docs/test-configuration.
 * Paths are absolute (__dirname) so this config works both directly
 * (`npx playwright test -c projects/em`) and through the root playwright.config.ts.
 *
 * Suites are chosen by tag, e.g. sanity: `APP=em npx playwright test --grep @sanity`.
 */
export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  outputDir: path.join(__dirname, 'test-results'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    // In CI, show each failing test and its error on the run's Summary page.
    ...(process.env.CI ? [['github'] as ['github']] : []),
    ['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }],
    ['junit', { outputFile: path.join(__dirname, 'test-results', 'junit.xml') }],
    // Read by scripts/jira-tests.mjs to comment results on Jira tickets.
    ['json', { outputFile: path.join(__dirname, 'test-results', 'results.json') }]
  ],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, storageState: adminState },
      dependencies: ['setup']
    },
    // Tests run on Chrome only. Firefox is there only when asked for: BROWSER=firefox
    // (CI sets it from the "browser" input of em-tests.yml).
    ...(process.env.BROWSER === 'firefox' ? [{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 }, storageState: adminState },
      dependencies: ['setup']
    }] : [])
  ]
});
