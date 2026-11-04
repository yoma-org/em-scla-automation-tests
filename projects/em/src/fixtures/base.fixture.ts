// src/fixtures/base.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { CreateInvoicePage } from '@pages/invoices/CreateInvoicePage';
import { CreateApartmentPage } from '@pages/apartments/CreateApartmentPage';
import { ApartmentWalletTab } from '@pages/apartments/ApartmentWalletTab';
import { WalletTransfersPage } from '@pages/wallet/WalletTransfersPage';

type PageFixtures = {
  loginPage: LoginPage;
  createInvoicePage: CreateInvoicePage;
  createApartmentPage: CreateApartmentPage;
  apartmentWalletTab: ApartmentWalletTab;
  walletTransfersPage: WalletTransfersPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  createInvoicePage: async ({ page }, use) => {
    await use(new CreateInvoicePage(page));
  },

  createApartmentPage: async ({ page }, use) => {
    await use(new CreateApartmentPage(page));
  },

  apartmentWalletTab: async ({ page }, use) => {
    await use(new ApartmentWalletTab(page));
  },

  walletTransfersPage: async ({ page }, use) => {
    await use(new WalletTransfersPage(page));
  }
});
