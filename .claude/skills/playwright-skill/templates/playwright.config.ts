// projects/<app>/playwright.config.ts — paths from __dirname so it works through the root config too
import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

const envFile = path.join(__dirname, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  outputDir: path.join(__dirname, 'test-results'),
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['list'], ['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/
    },
    {
      name: 'chromium',
      testIgnore: /.*\.serial\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: path.join(__dirname, 'playwright', '.auth', 'admin.json') },
      dependencies: ['setup']
    }
  ]
});
