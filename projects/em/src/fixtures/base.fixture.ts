// src/fixtures/base.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { GlobalSearch } from '@pages/GlobalSearch';
import { ChangePasswordPage } from '@pages/account/ChangePasswordPage';
import { CreateInvoicePage } from '@pages/invoices/CreateInvoicePage';
import { ApartmentsListPage } from '@pages/apartments/ApartmentsListPage';
import { CreateApartmentPage } from '@pages/apartments/CreateApartmentPage';
import { ApartmentDetailPage } from '@pages/apartments/ApartmentDetailPage';
import { ApartmentInvoicesTab } from '@pages/apartments/ApartmentInvoicesTab';
import { ApartmentWalletTab } from '@pages/apartments/ApartmentWalletTab';
import { ApartmentSummaryTab } from '@pages/apartments/ApartmentSummaryTab';
import { ApartmentEditTab } from '@pages/apartments/ApartmentEditTab';
import { ContactSummaryTab } from '@pages/contacts/ContactSummaryTab';
import { WalletTransfersPage } from '@pages/wallet/WalletTransfersPage';
import { CashTransfersPage } from '@pages/accounts/CashTransfersPage';
import { CashTransferDetailPage } from '@pages/accounts/CashTransferDetailPage';
import { GeneralSettingsPage } from '@pages/settings/GeneralSettingsPage';
import { BuildingsPage } from '@pages/settings/BuildingsPage';
import { AccountClassificationPage } from '@pages/settings/AccountClassificationPage';

type PageFixtures = {
  cashTransfersPage: CashTransfersPage;
  cashTransferDetailPage: CashTransferDetailPage;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  globalSearch: GlobalSearch;
  changePasswordPage: ChangePasswordPage;
  createInvoicePage: CreateInvoicePage;
  apartmentsListPage: ApartmentsListPage;
  createApartmentPage: CreateApartmentPage;
  apartmentDetailPage: ApartmentDetailPage;
  apartmentInvoicesTab: ApartmentInvoicesTab;
  apartmentWalletTab: ApartmentWalletTab;
  apartmentSummaryTab: ApartmentSummaryTab;
  apartmentEditTab: ApartmentEditTab;
  contactSummaryTab: ContactSummaryTab;
  walletTransfersPage: WalletTransfersPage;
  generalSettingsPage: GeneralSettingsPage;
  buildingsPage: BuildingsPage;
  accountClassificationPage: AccountClassificationPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  globalSearch: async ({ page }, use) => {
    await use(new GlobalSearch(page));
  },

  changePasswordPage: async ({ page }, use) => {
    await use(new ChangePasswordPage(page));
  },

  createInvoicePage: async ({ page }, use) => {
    await use(new CreateInvoicePage(page));
  },

  apartmentsListPage: async ({ page }, use) => {
    await use(new ApartmentsListPage(page));
  },

  createApartmentPage: async ({ page }, use) => {
    await use(new CreateApartmentPage(page));
  },

  apartmentDetailPage: async ({ page }, use) => {
    await use(new ApartmentDetailPage(page));
  },

  apartmentInvoicesTab: async ({ page }, use) => {
    await use(new ApartmentInvoicesTab(page));
  },

  apartmentWalletTab: async ({ page }, use) => {
    await use(new ApartmentWalletTab(page));
  },

  apartmentSummaryTab: async ({ page }, use) => {
    await use(new ApartmentSummaryTab(page));
  },

  apartmentEditTab: async ({ page }, use) => {
    await use(new ApartmentEditTab(page));
  },

  contactSummaryTab: async ({ page }, use) => {
    await use(new ContactSummaryTab(page));
  },

  walletTransfersPage: async ({ page }, use) => {
    await use(new WalletTransfersPage(page));
  },

  cashTransfersPage: async ({ page }, use) => {
    await use(new CashTransfersPage(page));
  },

  cashTransferDetailPage: async ({ page }, use) => {
    await use(new CashTransferDetailPage(page));
  },

  generalSettingsPage: async ({ page }, use) => {
    await use(new GeneralSettingsPage(page));
  },

  buildingsPage: async ({ page }, use) => {
    await use(new BuildingsPage(page));
  },

  accountClassificationPage: async ({ page }, use) => {
    await use(new AccountClassificationPage(page));
  }
});
