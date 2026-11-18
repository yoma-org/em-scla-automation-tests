// src/pages/collection/RecentReceiptsPage.ts — Cash Received › Recent Receipts (/recent-receipts)
// Newest first; no search. Columns: (expand) · RV# · Date · Account · Payer · Category · Description ·
// Deposit · Created By. Apartment payment: Payer = apartment, Category = invoice category,
// Description "Inv-… Payment". Funding: Payer = payer name.
import { type Locator, type Page } from '@playwright/test';
import { findOnPages, waitIdle } from './common';

export class RecentReceiptsPage {
  readonly heading: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Recent Receipts' });
    this.rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(): Promise<void> {
    await this.page.goto('/recent-receipts');
    await this.heading.waitFor();
    await waitIdle(this.page);
    await this.rows.first().waitFor();
  }

  /** Row by its RV# cell (exact) or by any text, searched on up to 3 pages of 100. */
  async find(text: string | RegExp): Promise<Locator> {
    const row = typeof text === 'string' && /^RV-\d+$/.test(text)
      ? this.rows.filter({ has: this.page.getByRole('cell', { name: text, exact: true }) })
      : this.rows.filter({ hasText: text });
    return findOnPages(this.page, row, 3);
  }

  cells(row: Locator) {
    const c = row.getByRole('cell');
    return { rv: c.nth(1), date: c.nth(2), account: c.nth(3), payer: c.nth(4), category: c.nth(5), description: c.nth(6), amount: c.nth(7) };
  }
}
