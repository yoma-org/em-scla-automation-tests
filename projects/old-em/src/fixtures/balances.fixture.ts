// src/fixtures/balances.fixture.ts — page objects of the balances / reporting area (Dashboard figures, AR,
// apartment SOA / Wallet / Deposit, Account Statement), on top of base.fixture.
import { test as base } from './base.fixture';
import { DashboardWidgets } from '@pages/balances/DashboardWidgets';
import { AccountsReceivablePage } from '@pages/balances/AccountsReceivablePage';
import { ApartmentLedgerPage } from '@pages/balances/ApartmentLedgerPage';
import { AccountStatementPage } from '@pages/balances/AccountStatementPage';

type BalancesFixtures = {
  dashboardWidgets: DashboardWidgets;
  arPage: AccountsReceivablePage;
  soaPage: ApartmentLedgerPage;
  walletLedgerPage: ApartmentLedgerPage;
  depositLedgerPage: ApartmentLedgerPage;
  accountStatementPage: AccountStatementPage;
};

export const test = base.extend<BalancesFixtures>({
  dashboardWidgets: async ({ page }, use) => { await use(new DashboardWidgets(page)); },
  arPage: async ({ page }, use) => { await use(new AccountsReceivablePage(page)); },
  soaPage: async ({ page }, use) => { await use(new ApartmentLedgerPage(page, 'soa')); },
  walletLedgerPage: async ({ page }, use) => { await use(new ApartmentLedgerPage(page, 'wallet')); },
  depositLedgerPage: async ({ page }, use) => { await use(new ApartmentLedgerPage(page, 'deposit')); },
  accountStatementPage: async ({ page }, use) => { await use(new AccountStatementPage(page)); }
});
