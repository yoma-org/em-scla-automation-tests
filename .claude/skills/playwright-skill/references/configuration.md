# Playwright Configuration

Each app has its own `projects/<app>/playwright.config.ts`. The root `playwright.config.ts`
only picks one by `APP`, so paths in an app config are built from `__dirname` (they must
resolve the same way whether the root config or `-c projects/<app>` loads it).

```ts
import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

const envFile = path.join(__dirname, '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);
const auth = (role: string) => path.join(__dirname, 'playwright', '.auth', `${role}.json`);

export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  outputDir: path.join(__dirname, 'test-results'),
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(__dirname, 'playwright-report'), open: 'never' }]
  ],

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
      use: { ...devices['Desktop Chrome'], storageState: auth('admin') },
      dependencies: ['setup']
    },
    {
      name: 'serial-global-totals',
      testMatch: /.*\.serial\.spec\.ts/,
      fullyParallel: false,
      use: { ...devices['Desktop Chrome'], storageState: auth('admin') },
      dependencies: ['setup']
    }
  ]
});
```

Only add the serial project when a case must assert an absolute global total.
`fullyParallel: false` keeps tests in one file in order; also run this project alone with
`--workers=1` (or `--project serial-global-totals --workers=1` as its own CI step) so no
other test changes the totals meanwhile.

## Rules

- Chromium only, unless a case requires another browser.
- Do not hardcode environment values; read them from `projects/<app>/.env` / CI variables.
- Apps do not share a config: different base URLs, roles and env vars stay separate.
- Retries collect evidence (trace on the retry), not hide flaky tests. A test that passes only
  on retry is reported as flaky and fixed.
- Projects may represent browsers, roles, setup dependencies, or serial groups.
- `webServer` is not used: the app runs on a deployed test environment.
- API clients do not use `use.baseURL` when the API has its own host; they build their own
  request context from `API_BASE_URL` (see the app's `PROJECT.md`).
