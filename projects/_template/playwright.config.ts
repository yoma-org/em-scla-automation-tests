import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

// Each app loads its own env file: projects/<app>/.env (git-ignored, see .env.example).
const envFile = path.join(__dirname, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

/**
 * See https://playwright.dev/docs/test-configuration.
 * Paths are absolute (__dirname) so this config works both directly
 * (`npx playwright test -c projects/__APP__`) and through the root playwright.config.ts.
 */
export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  outputDir: path.join(__dirname, 'test-results'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
