# UI Automation

## Spec Structure

```ts
import { test, expect } from '@fixtures';
import { credentials } from '@utils/Environment';

test.describe('Login & Authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test(
    'AUTH-001 login with valid credentials lands on dashboard',
    {
      tag: ['@smoke', '@P1', '@critical'],
      annotation: [
        { type: 'tc', description: 'AUTH-001' },
        { type: 'source', description: 'TC_Login_001' }
      ]
    },
    async ({ loginPage, dashboardPage }) => {
      await loginPage.goto();
      const { email, password } = credentials('admin');
      await loginPage.login(email, password);

      await expect(loginPage.toast).toContainText('Logged in Successfully');
      await expect(dashboardPage.heading).toBeVisible();
    }
  );
});
```

## Review Cases

```ts
test(
  'AUTH-002 login rejected for unregistered email',
  {
    tag: ['@P2', '@review'],
    annotation: [
      { type: 'tc', description: 'AUTH-002' },
      { type: 'source', description: 'TC_Login_002' },
      { type: 'review', description: 'Expected message "Email is not a valid email address" for a well-formed but unregistered email; confirm intended message' }
    ]
  },
  async ({ loginPage }) => {
    // implement the expected result as written in the case
  }
);
```

Use `test.fixme(true, '<reason>')` only when the case has no usable expected result. Keep the
`@review` tag and the `review` annotation: a `fixme` inside the body is invisible to
`playwright test --list`, so the traceability check relies on the annotation.

## Data Variants

A merged case with a **Data variants** table becomes one data array and one generated test
per row. The base row is labelled `base`; each row keeps its own `source_id` from the catalog.
Read env values inside the test, not at module level, so `playwright test --list` (and the
traceability check) works without a `.env`:

```ts
const variants = [
  { label: 'base', source: 'TC_Login_003', email: undefined, password: 'wrong-pass' }, // registered email, read in the test
  { label: 'Email=invalid; Password=invalid', source: 'TC_Login_004', email: 'nobody@example.com', password: 'wrong-pass' }
];

for (const v of variants) {
  test(`AUTH-003 [${v.label}] login rejected for invalid credentials`, {
    tag: ['@P2'],
    annotation: [
      { type: 'tc', description: 'AUTH-003' },
      { type: 'source', description: v.source }
    ]
  }, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(v.email ?? credentials('admin').email, v.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });
}
```

## Multi-role Scenarios

```ts
test('UO-007 approving a UO reading generates the invoice', { tag: ['@smoke', '@P1', '@critical'], annotation: [{ type: 'tc', description: 'UO-007' }, { type: 'source', description: 'TC_UO_007' }] }, async ({ asRole, apartment }) => {
  const maker = await asRole('uo-operator');
  const checker = await asRole('uo-manager');
  // maker: create draft reading for `apartment`
  // checker: approve
  // assert on screen, then via API (Auto-UI+API)
});
```

## Locator Priority

Prefer:

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`

PrimeVue renders dropdowns, calendars and tables as custom markup. Wrap them once in
Component Objects (`src/components/`) instead of repeating CSS locators in pages. Use
CSS only inside those components and only when a semantic locator is not practical.

## Rules

- assert business outcomes (amounts, statuses, document numbers), not just visibility;
- keep tests independent; each creates its own apartment / contact;
- use API setup when it reduces UI noise (the UI under test still goes through the UI);
- avoid cross-test dependencies; E2E flows are one test with `test.step()` per flow step;
- include the case ID in the title and the `tc` annotation;
- give E2E flows their own timeout (`test.setTimeout`);
- tag suites and priority as described in `references/test-case-conventions.md`.
