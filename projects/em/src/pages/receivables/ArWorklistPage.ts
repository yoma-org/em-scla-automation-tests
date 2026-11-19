// src/pages/receivables/ArWorklistPage.ts — Accounts Receivable › Manage Account Receivable (/receivables/worklist).
// "Accounts Receivable <total> Ks" (shared total of all apartments, per Currency), aging cards, then the
// "Outstanding receivables" table: # · Co.ref · Apartment · Amount · Due Amount · Issued Date · Due Date · Status ·
// Category · Created By · Manage, with a "Keyword Search" box.
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class ArWorklistPage {
  readonly heading: Locator;
  readonly total: Locator;
  readonly search: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Manage Account Receivable', level: 1 });
    this.total = page.getByRole('main').getByRole('paragraph').filter({ hasText: /^Accounts Receivable\b/ });
    this.search = page.getByRole('searchbox', { name: 'Keyword Search' });
    this.rows = page.getByRole('region', { name: 'Outstanding receivables' }).getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.arWorklist);
    // The total first shows "— No open receivables total" while it loads.
    await this.total.filter({ hasText: /\d/ }).waitFor();
  }

  /** Types the apartment name into Keyword Search and waits for the table. */
  async searchFor(text: string): Promise<void> {
    await this.search.fill(text);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  rowsWith(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }
}
