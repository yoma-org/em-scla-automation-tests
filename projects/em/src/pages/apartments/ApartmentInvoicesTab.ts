// src/pages/apartments/ApartmentInvoicesTab.ts — Apartment › Invoices tab (/estates/:id?tab=invoices)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class ApartmentInvoicesTab {
  /** The tab panel is named after the tab, e.g. "Invoices (6)". */
  readonly panel: Locator;
  /** Shown only for an Enable apartment, as on Old EM. */
  readonly addInvoice: Locator;
  readonly makePayment: Locator;
  /** Anything that would add a Debit Note from the apartment (EM-42: must not exist). */
  readonly debitNoteActions: Locator;
  readonly unpaidOnly: Locator;
  readonly table: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.panel = page.getByRole('tabpanel', { name: /^Invoices\b/ });
    this.addInvoice = this.panel.getByRole('link', { name: 'Add Invoice', exact: true });
    this.makePayment = this.panel.getByRole('link', { name: 'Make Payment', exact: true });
    this.debitNoteActions = this.panel.getByRole('link', { name: /debit note/i })
      .or(this.panel.getByRole('button', { name: /debit note/i }));
    this.unpaidOnly = this.panel.getByRole('checkbox', { name: 'Unpaid Only' });
    this.table = this.panel.getByRole('region', { name: 'Invoices for this unit' }).getByRole('table');
    this.rows = this.table.getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(apartmentId: number | string): Promise<void> {
    await this.page.goto(Routes.apartmentInvoices(apartmentId));
    await this.table.waitFor();
  }

  /** Status column of every listed row: "Unpaid", "Partially paid", "Paid", … */
  async statuses(): Promise<string[]> {
    return (await this.rows.locator('td:nth-child(8)').allInnerTexts()).map(s => s.trim());
  }
}
