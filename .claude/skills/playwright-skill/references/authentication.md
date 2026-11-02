# Authentication Strategy

## Choosing the Default

The app's `PROJECT.md` ("Roles and Authentication") decides. When cases need several roles
(maker–checker, approvals), the default is **role-specific storage state**: one setup test
logs in every role the suite uses, and tests open a context per role (`asRole()` in
`references/fixtures.md`).

Example (`em` app): EM uses maker–checker roles, so it uses role-specific storage state.
em-web keeps its token encrypted in localStorage, which `storageState()` captures.

## Other Strategies

### Shared storage state

Use when one role is enough and the test does not depend on another user's actions.

### One account per worker

Use when tests change state tied to the user (profile, settings) and run in parallel.

### API login

Prefer for API tests and for data setup: log in through the back-office API, decrypt the
token, and send it as `Authorization: Bearer <token>`.

## Setup Project Example

```ts
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import { roles, credentials, authFile } from '@utils/Environment';
import { LoginPage } from '@pages/LoginPage';

for (const role of roles) {
  setup(`authenticate ${role}`, async ({ page }) => {
    const { email, password } = credentials(role);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page).not.toHaveURL(/login/);

    await page.context().storageState({ path: authFile(role) });
  });
}
```

Project dependency:

```ts
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/admin.json' },
    dependencies: ['setup']
  }
]
```

Login tests (`AUTH-*`) must start logged out:

```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

## Security Rules

- never commit authentication state (`playwright/.auth/` is git-ignored);
- never hardcode secrets; use `.env` locally and CI secret variables;
- refresh expired state by re-running the setup project;
- never use production accounts or the seeded `superadmin` / `password` account.
