// src/fixtures/base.fixture.ts — one fixture per page object; specs take what they need.
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { ContactsListPage } from '@pages/contacts/ContactsListPage';
import { ContactCreatePage } from '@pages/contacts/ContactCreatePage';
import { ApartmentsListPage } from '@pages/apartments/ApartmentsListPage';
import { ApartmentCreatePage } from '@pages/apartments/ApartmentCreatePage';
import { ApartmentEditPage } from '@pages/apartments/ApartmentEditPage';
import { ApartmentDetailPage } from '@pages/apartments/ApartmentDetailPage';
import { CashBankAccountsPage } from '@pages/cash-bank-accounts/CashBankAccountsPage';
import { CashBankAccountCreatePage } from '@pages/cash-bank-accounts/CashBankAccountCreatePage';
import { UoPricingPage } from '@pages/settings/UoPricingPage';
import { UoCreatePage } from '@pages/uo/UoCreatePage';
import { UoDraftsPage } from '@pages/uo/UoDraftsPage';
import { InvoiceDetailPage } from '@pages/invoices/InvoiceDetailPage';
import { InvoiceCreatePage } from '@pages/invoices/InvoiceCreatePage';
import { EmCreatePage } from '@pages/em/EmCreatePage';

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  contactsListPage: ContactsListPage;
  contactCreatePage: ContactCreatePage;
  apartmentsListPage: ApartmentsListPage;
  apartmentCreatePage: ApartmentCreatePage;
  apartmentEditPage: ApartmentEditPage;
  apartmentDetailPage: ApartmentDetailPage;
  cashBankAccountsPage: CashBankAccountsPage;
  cashBankAccountCreatePage: CashBankAccountCreatePage;
  uoPricingPage: UoPricingPage;
  uoCreatePage: UoCreatePage;
  uoDraftsPage: UoDraftsPage;
  invoiceDetailPage: InvoiceDetailPage;
  invoiceCreatePage: InvoiceCreatePage;
  emCreatePage: EmCreatePage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  dashboardPage: async ({ page }, use) => { await use(new DashboardPage(page)); },
  contactsListPage: async ({ page }, use) => { await use(new ContactsListPage(page)); },
  contactCreatePage: async ({ page }, use) => { await use(new ContactCreatePage(page)); },
  apartmentsListPage: async ({ page }, use) => { await use(new ApartmentsListPage(page)); },
  apartmentCreatePage: async ({ page }, use) => { await use(new ApartmentCreatePage(page)); },
  apartmentEditPage: async ({ page }, use) => { await use(new ApartmentEditPage(page)); },
  apartmentDetailPage: async ({ page }, use) => { await use(new ApartmentDetailPage(page)); },
  cashBankAccountsPage: async ({ page }, use) => { await use(new CashBankAccountsPage(page)); },
  cashBankAccountCreatePage: async ({ page }, use) => { await use(new CashBankAccountCreatePage(page)); },
  uoPricingPage: async ({ page }, use) => { await use(new UoPricingPage(page)); },
  uoCreatePage: async ({ page }, use) => { await use(new UoCreatePage(page)); },
  uoDraftsPage: async ({ page }, use) => { await use(new UoDraftsPage(page)); },
  invoiceDetailPage: async ({ page }, use) => { await use(new InvoiceDetailPage(page)); },
  invoiceCreatePage: async ({ page }, use) => { await use(new InvoiceCreatePage(page)); },
  emCreatePage: async ({ page }, use) => { await use(new EmCreatePage(page)); }
});
