// src/pages/balances/AccountsReceivablePage.ts — Manage Account Receivable (/account-receivables).
//
// Header "Accounts Receivable <total>" (h4) · [Bulk SOA] [AR Snapshot] · filters (currency "MMK", "All Type",
// "All Categories") · cards: <h4>amount</h4><h6>label</h6> for Current, Total Amount Overdue,
// 1 Day to 30 Days … 151 Days to 180 Days, > 180 Days ·
// "Invoices / Debit Notes" tabs Current · 1-30 · 31-60 · 61-90 · 91-120 · 121-150 · 151-180 · >180 · Unpaid ·
// Partially Paid, each with a paginated table:
// # · Co.ref · Apartment · Amount · Due Amount · Issued Date · Due Date · Status · Category · Created By · Manage.
import { expect, type Locator, type Page } from '@playwright/test';
import { cents } from './money';

export const AGING_CARDS = ['1 Day to 30 Days', '31 Days to 60 Days', '61 Days to 90 Days', '91 Days to 120 Days',
  '121 Days to 150 Days', '151 Days to 180 Days', '> 180 Days'] as const;

export class AccountsReceivablePage {
  readonly totalHeading: Locator;
  readonly tabs: Locator;
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.totalHeading = page.getByRole('heading', { name: /^Accounts Receivable/, level: 4 });
    this.tabs = page.getByRole('tablist');
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/account-receivables');
    await this.loaded();
  }

  /** The cards render "0.00" before the figures arrive: wait for the requests to settle. */
  async loaded(): Promise<void> {
    await this.card('Current').waitFor();
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.table.getByRole('row').nth(1).waitFor();
  }

  async openFromMenu(): Promise<void> {
    await this.page.getByRole('menuitem', { name: 'accounts-receivable.menu' }).click();
    await expect(this.page).toHaveURL(/\/account-receivables$/);
    await this.loaded();
  }

  /** The amount heading of a card, e.g. card('Current'), card('Total Amount Overdue'). */
  card(label: string): Locator {
    return this.page.locator(`xpath=//h6[normalize-space()="${label}"]/preceding-sibling::h4[1]`);
  }

  async cardCents(label: string): Promise<bigint> {
    return cents(await this.card(label).innerText());
  }

  async totalCents(): Promise<bigint> {
    return cents(await this.totalHeading.innerText());
  }

  tab(name: string): Locator {
    return this.tabs.getByRole('tab', { name, exact: true });
  }

  async openTab(name: string): Promise<void> {
    await this.tab(name).click();
    await expect(this.tab(name)).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.locator('.custom-loading')).toHaveCount(0, { timeout: 60_000 });
    await this.table.getByRole('row').nth(1).waitFor();
  }

  /**
   * Row of an invoice / debit note by its number (e.g. "Inv-202611-00032") in the open tab. Lists are long
   * (Unpaid ≈ 17,000 rows) and newest-created first, so only the first `pages` pages of 100 are searched:
   * a document created by the test minutes ago is there if the tab lists it.
   */
  async findRow(code: string, pages = 3): Promise<Locator | null> {
    const row = this.table.getByRole('row').filter({ has: this.page.getByRole('link', { name: code, exact: true }) });
    const loading = this.page.locator('.custom-loading');
    const perPage = this.page.getByRole('combobox', { name: 'Rows per page' });
    if (await perPage.isVisible() && (await perPage.innerText()).trim() !== '100') {
      await perPage.click();
      await this.page.getByRole('option', { name: '100', exact: true }).click();
      await expect(loading).toHaveCount(0, { timeout: 60_000 });
    }
    const first = this.page.getByRole('button', { name: 'First Page' });
    if (await first.isVisible() && await first.isEnabled()) { await first.click(); await expect(loading).toHaveCount(0, { timeout: 60_000 }); }
    for (let i = 0; i < pages; i++) {
      await this.table.getByRole('row').nth(1).waitFor();
      if (await row.count()) return row.first();
      const next = this.page.getByRole('button', { name: 'Next Page' });
      if (!(await next.isVisible()) || !(await next.isEnabled())) return null;
      await next.click();
      await expect(loading).toHaveCount(0, { timeout: 60_000 });
    }
    return null;
  }

  /** Cells of a row as texts: [#, Co.ref, Apartment, Amount, Due Amount, Issued Date, Due Date, Status, Category, Created By]. */
  async rowTexts(row: Locator): Promise<string[]> {
    return (await row.getByRole('cell').allInnerTexts()).map(t => t.trim());
  }
}
