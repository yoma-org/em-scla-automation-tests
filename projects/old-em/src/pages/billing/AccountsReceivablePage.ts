// src/pages/billing/AccountsReceivablePage.ts — Accounts Receivable (/account-receivables)
// "Accounts Receivable <total> Ks" (all apartments: shared total), ageing buckets, tabs Current · 1-30 · … ·
// Unpaid · Partially Paid, table # (code) · Co.ref · Apartment · Amount · Due Amount · Issued Date · Due Date ·
// Status ("Unpaid") · Category · Created By · Manage. Newest first, 10 rows per page; the rows load a few
// seconds after the page.
// Type filter (Invoice / Debit Note): its placeholder says "All Type", but the list then shows INVOICES ONLY;
// debit notes are listed only after choosing "Debit Note".
import { type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';

export class AccountsReceivablePage {
  readonly heading: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /^Accounts Receivable/ });
    this.rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  /** Opens the list on `tab`; `type` 'Debit Note' is needed to see debit notes (see above). */
  async goto(tab = 'Unpaid', type?: 'Invoice' | 'Debit Note'): Promise<void> {
    await this.page.goto('/account-receivables');
    await this.heading.waitFor();
    await this.rows.filter({ hasText: /\d/ }).first().waitFor({ timeout: 30_000 });
    if (type) await chooseOption(this.page, this.page.getByRole('combobox', { name: 'All Type' }), type);
    await this.page.getByRole('tab', { name: tab, exact: true }).click();
    const prefix = type === 'Debit Note' ? /DN-\d/ : /Inv-\d/;
    await this.rows.filter({ hasText: prefix }).first().waitFor({ timeout: 30_000 });
    const perPage = this.page.getByRole('combobox', { name: 'Rows per page' });
    if (await perPage.isEnabled()) await chooseOption(this.page, perPage, '100');
  }

  row(code: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('cell', { name: code, exact: true }) });
  }
}
