import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

// Each app loads its own env file: projects/<app>/.env (git-ignored, see .env.example).
// In CI the same values come from secrets as plain env vars.
const envFile = path.join(__dirname, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const adminState = path.join(__dirname, 'playwright', '.auth', 'admin.json');

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
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 }, storageState: adminState },
      dependencies: ['setup']
    }
  ]
});
