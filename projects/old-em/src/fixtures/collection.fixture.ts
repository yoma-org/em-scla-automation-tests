// src/fixtures/collection.fixture.ts — page objects for the Collection (tests/collection) and Cash (tests/cash)
// specs, on top of base.fixture.
import { test as base } from './base.fixture';
import { MakePaymentPage } from '@pages/collection/MakePaymentPage';
import { ApartmentSoaPage } from '@pages/collection/ApartmentSoaPage';
import { RecentReceiptsPage } from '@pages/collection/RecentReceiptsPage';
import { UnknownReceivedPage } from '@pages/collection/UnknownReceivedPage';
import { UnknownAssignPage } from '@pages/collection/UnknownAssignPage';
import { FundingReceivedPage } from '@pages/collection/FundingReceivedPage';
import { CashOutflowPage, CashOutflowDraftsPage } from '@pages/cash/CashOutflowPage';
import { CashTransferPage, CashTransferDraftsPage } from '@pages/cash/CashTransferPage';
import { ApartmentWalletPage } from '@pages/wallet/ApartmentWalletPage';

type CollectionFixtures = {
  makePaymentPage: MakePaymentPage;
  apartmentSoaPage: ApartmentSoaPage;
  recentReceiptsPage: RecentReceiptsPage;
  unknownReceivedPage: UnknownReceivedPage;
  unknownAssignPage: UnknownAssignPage;
  fundingReceivedPage: FundingReceivedPage;
  cashOutflowPage: CashOutflowPage;
  cashOutflowDraftsPage: CashOutflowDraftsPage;
  cashTransferPage: CashTransferPage;
  cashTransferDraftsPage: CashTransferDraftsPage;
  walletPage: ApartmentWalletPage;
};

export const test = base.extend<CollectionFixtures>({
  makePaymentPage: async ({ page }, use) => { await use(new MakePaymentPage(page)); },
  apartmentSoaPage: async ({ page }, use) => { await use(new ApartmentSoaPage(page)); },
  recentReceiptsPage: async ({ page }, use) => { await use(new RecentReceiptsPage(page)); },
  unknownReceivedPage: async ({ page }, use) => { await use(new UnknownReceivedPage(page)); },
  unknownAssignPage: async ({ page }, use) => { await use(new UnknownAssignPage(page)); },
  fundingReceivedPage: async ({ page }, use) => { await use(new FundingReceivedPage(page)); },
  cashOutflowPage: async ({ page }, use) => { await use(new CashOutflowPage(page)); },
  cashOutflowDraftsPage: async ({ page }, use) => { await use(new CashOutflowDraftsPage(page)); },
  cashTransferPage: async ({ page }, use) => { await use(new CashTransferPage(page)); },
  cashTransferDraftsPage: async ({ page }, use) => { await use(new CashTransferDraftsPage(page)); },
  walletPage: async ({ page }, use) => { await use(new ApartmentWalletPage(page)); }
});
