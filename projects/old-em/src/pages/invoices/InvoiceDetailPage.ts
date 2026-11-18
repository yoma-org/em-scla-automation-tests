// src/pages/invoices/InvoiceDetailPage.ts — Invoice / Debit Note detail (/invoices/:id)
// Header "#Inv-YYYYMM-NNNNN CoRef : … <status>", "Issued to: <apartment>", Created/Approved By, dates,
// "Total: … Ks"; lines table # · Item · Unit · Gross Price · Total; footer Gross Total / Commerical Tax / Grand Total.
// UO invoices: title "UTILITY OPERATION", one line per service item ("Electricity (YESC)" + readings).
import { type Locator, type Page } from '@playwright/test';

export class InvoiceDetailPage {
  readonly total: Locator;
  readonly lines: Locator;

  constructor(private readonly page: Page) {
    this.total = page.getByRole('heading', { name: /^Total:/ });
    this.lines = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(invoiceId: string | number): Promise<void> {
    await this.page.goto(`/invoices/${invoiceId}`);
    await this.total.waitFor();
  }

  /** Line whose Item cell starts with `item`, with its Unit / Gross Price / Total cells. */
  line(item: string) {
    const row = this.lines.filter({ has: this.page.getByRole('paragraph').filter({ hasText: new RegExp(`^${item.replace(/[()]/g, '\\$&')}$`) }) });
    const c = row.getByRole('cell');
    return { row, unit: c.nth(2), grossPrice: c.nth(3), total: c.nth(4) };
  }
}
