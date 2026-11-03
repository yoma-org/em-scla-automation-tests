// src/fixtures/base.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { CreateInvoicePage } from '@pages/invoices/CreateInvoicePage';

type PageFixtures = {
  loginPage: LoginPage;
  createInvoicePage: CreateInvoicePage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  createInvoicePage: async ({ page }, use) => {
    await use(new CreateInvoicePage(page));
  }
});
