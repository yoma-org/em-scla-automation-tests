// src/fixtures/wallet.fixture.ts — page objects for the wallet and deposit specs (tests/wallet, tests/deposit).
import { test as base } from './base.fixture';
import { ApartmentWalletPage } from '@pages/wallet/ApartmentWalletPage';
import { CashOutflowDraftsPage, CreditNoteDraftsPage } from '@pages/wallet/DraftPages';
import { ApartmentInvoicesTab, ApartmentSoaTab, MakePaymentPage, RecentOutflowsPage, RecentReceiptsPage } from '@pages/wallet/MoneyPages';
import { ApartmentDepositPage } from '@pages/deposit/ApartmentDepositPage';
import {
  DepositInvoiceCreatePage, DepositInvoiceDetailPage, DepositInvoiceDraftsPage, DepositInvoiceListPage
} from '@pages/deposit/DepositInvoicePages';

type WalletFixtures = {
  walletPage: ApartmentWalletPage;
  depositPage: ApartmentDepositPage;
  creditNoteDraftsPage: CreditNoteDraftsPage;
  cashOutflowDraftsPage: CashOutflowDraftsPage;
  makePaymentPage: MakePaymentPage;
  apartmentInvoicesTab: ApartmentInvoicesTab;
  apartmentSoaTab: ApartmentSoaTab;
  recentReceiptsPage: RecentReceiptsPage;
  recentOutflowsPage: RecentOutflowsPage;
  depositInvoiceCreatePage: DepositInvoiceCreatePage;
  depositInvoiceDraftsPage: DepositInvoiceDraftsPage;
  depositInvoiceDetailPage: DepositInvoiceDetailPage;
  depositInvoiceListPage: DepositInvoiceListPage;
};

export const test = base.extend<WalletFixtures>({
  walletPage: async ({ page }, use) => { await use(new ApartmentWalletPage(page)); },
  depositPage: async ({ page }, use) => { await use(new ApartmentDepositPage(page)); },
  creditNoteDraftsPage: async ({ page }, use) => { await use(new CreditNoteDraftsPage(page)); },
  cashOutflowDraftsPage: async ({ page }, use) => { await use(new CashOutflowDraftsPage(page)); },
  makePaymentPage: async ({ page }, use) => { await use(new MakePaymentPage(page)); },
  apartmentInvoicesTab: async ({ page }, use) => { await use(new ApartmentInvoicesTab(page)); },
  apartmentSoaTab: async ({ page }, use) => { await use(new ApartmentSoaTab(page)); },
  recentReceiptsPage: async ({ page }, use) => { await use(new RecentReceiptsPage(page)); },
  recentOutflowsPage: async ({ page }, use) => { await use(new RecentOutflowsPage(page)); },
  depositInvoiceCreatePage: async ({ page }, use) => { await use(new DepositInvoiceCreatePage(page)); },
  depositInvoiceDraftsPage: async ({ page }, use) => { await use(new DepositInvoiceDraftsPage(page)); },
  depositInvoiceDetailPage: async ({ page }, use) => { await use(new DepositInvoiceDetailPage(page)); },
  depositInvoiceListPage: async ({ page }, use) => { await use(new DepositInvoiceListPage(page)); }
});
