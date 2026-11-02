# Fixtures and Dependency Injection

## Purpose

Provide each test with the dependencies it needs while preserving isolation and cleanup.

## Public Import Boundary

Tests import only from:

```ts
import { test, expect } from '@fixtures';
```

`src/fixtures/index.ts`:

```ts
import { mergeTests } from '@playwright/test';
import { test as baseTest } from './base.fixture';
import { test as roleTest } from './role.fixture';

export const test = mergeTests(baseTest, roleTest);
export { expect } from '@playwright/test';
```

## Base Fixture Example

```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  }
});
```

Page fixtures only construct objects. Navigation belongs in the test (`await loginPage.goto()`)
so the scenario stays readable.

## Usage

```ts
import { test, expect } from '@fixtures';
import { credentials } from '@utils/Environment';

test('AUTH-001 login with valid credentials lands on dashboard', async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  const { email, password } = credentials('admin');
  await loginPage.login(email, password);

  await expect(dashboardPage.heading).toBeVisible();
});
```

## Role Fixtures (maker–checker)

Each role gets its own browser context from its saved storage state:

```ts
import { test as base, type Page } from '@playwright/test';
import { authFile, type Role } from '@utils/Environment';

type RoleFixtures = {
  asRole: (role: Role) => Promise<Page>;
};

export const test = base.extend<RoleFixtures>({
  asRole: async ({ browser }, use) => {
    const contexts: Awaited<ReturnType<typeof browser.newContext>>[] = [];

    await use(async role => {
      const context = await browser.newContext({ storageState: authFile(role) });
      contexts.push(context);
      return context.newPage();
    });

    await Promise.all(contexts.map(c => c.close()));
  }
});
```

```ts
test('UO-007 approving a UO reading generates the invoice', async ({ asRole }) => {
  const maker = await asRole('uo-operator');
  const checker = await asRole('uo-manager');
  // maker creates the draft, checker approves …
});
```

## Lifecycle Fixture

Data fixtures create isolated records through the API. Approved financial documents cannot be
deleted, so isolation comes from unique data, not teardown (see the app's `PROJECT.md`).

```ts
type DataFixtures = {
  apartment: Apartment;
};

export const test = base.extend<DataFixtures>({
  apartment: async ({ apiAs }, use, testInfo) => {
    const apartmentsApi = new ApartmentsApi(await apiAs('admin'));
    const apartment = await apartmentsApi.create(buildApartment({ workerIndex: testInfo.workerIndex }));
    await use(apartment);
    // No delete: the apartment will hold approved documents.
  }
});
```

Use `try/finally` cleanup only for resources the API can really delete (drafts, settings
changed for one test).

## Scope Rules

### Test-scoped

Use for:

- Page Objects
- API clients using test context
- per-test data
- mutable resources

### Worker-scoped

Use only for resources safe to share across tests in one worker:

- API tokens per role, fetched once per worker (`tokenFor` in `templates/role.fixture.ts`)
- expensive read-only setup
- worker-specific environment allocation

## Fixture Dependency

Fixtures may depend on other fixtures:

```ts
invoicesApi: async ({ apiAs }, use) => {
  await use(new InvoicesApi(await apiAs('finance-operator')));
}
```

Avoid hiding the entire test scenario inside fixtures.

## Anti-patterns

- one “god fixture” containing every dependency;
- fixture setup with no cleanup or isolation strategy;
- static shared data modified by parallel tests;
- business assertions inside fixture setup;
- creating Page Objects manually in every test;
- fixture dependencies that create test-order coupling.
