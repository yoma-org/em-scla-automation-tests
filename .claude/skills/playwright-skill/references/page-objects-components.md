# Page Objects and Component Objects

## Purpose

Define how UI behavior is modeled without hiding the business intent of tests.

## Page Object Responsibilities

A Page Object should:

- represent one page or a stable page-level domain area;
- own its locators;
- expose business-level actions;
- expose important observable elements;
- optionally provide navigation;
- avoid scenario orchestration.

## Example Page Object

```ts
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
    this.toast = page.locator('.p-toast-message');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.login);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
```

Labels and the toast locator must be confirmed against em-web (snapshot or discovery)
before use. The PrimeVue toast is a shared component; move it to `src/components/Toast.ts`
once a second page needs it.

## Good Method Names

```ts
login()
createDraftReading(apartment, readings)
approveDocument(code)
makePayment({ invoiceCodes, amount, account })
openInvoice(code)
```

## Avoid Low-Level Wrappers

Avoid:

```ts
clickButton()
fillInput()
waitForPage()
```

These only rename Playwright APIs and hide intent.

## Component Objects

Use a Component Object when a reusable UI region:

- appears across pages;
- has multiple related locators;
- has behavior or state of its own.

Example:

```ts
import { type Locator, type Page } from '@playwright/test';

export class Header {
  readonly profileMenu: Locator;
  readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.profileMenu = page.getByRole('button', { name: 'Profile' });
    this.logoutButton = page.getByRole('menuitem', { name: 'Log out' });
  }

  async logout(): Promise<void> {
    await this.profileMenu.click();
    await this.logoutButton.click();
  }
}
```

## Composition

```ts
export class DashboardPage {
  readonly header: Header;

  constructor(private readonly page: Page) {
    this.header = new Header(page);
  }
}
```

Prefer composition over inheritance.

Example (`em` app) candidates for Component Objects: PrimeVue `DataTable` (search, filter, paginate, row by
document number), `Toast`, `ConfirmDialog`, `Dropdown` / `Calendar`, the sidebar menu, and
the approve / reject action bar shared by every maker–checker document.

## BasePage

`BasePage` is optional.

Use it only for meaningful shared application behavior, such as:

```ts
waitForApplicationReady()
openFromSidebar(menu: string)
```

Do not create generic wrappers for every Playwright method.

## Assertions

Keep scenario-specific assertions in the spec:

```ts
await expect(dashboardPage.heading).toBeVisible();
```

A Page Object may expose reusable invariant checks only when they are truly part of the page contract.
