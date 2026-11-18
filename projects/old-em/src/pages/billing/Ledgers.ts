// src/pages/billing/Ledgers.ts — where a posted invoice / debit note shows up for one apartment and its owner.
// Apartment: Summary "Accounts Receivable <amount> Ks" (h3) · Invoices tab (ApartmentDetailPage) row
//   # (code) · Co.ref · Category · Amount · Invoice Date · Due Amount · Due Date · Status ("UNPAID") · Manage ·
//   S.O.A (/apartments/:id/soa): Date · Transactions · Details ("Inv-… - due on dd/mm/yyyy") · Amount ·
//   Payments · Balance, last row "Balance Due: <amount> Ks".
// Contact: Summary (/contacts/:id/detail) ageing buckets ("<amount> Ks" over "Current", …) ·
//   Unpaid Invoices tab (/contacts/:id/invoices).
import { type Locator, type Page } from '@playwright/test';
import { ApartmentDetailPage } from '@pages/apartments/ApartmentDetailPage';

/** The amount heading (h4) of an ageing bucket, e.g. bucket(page, 'Current'). */
function bucket(page: Page, name: string): Locator {
  return page.locator('div')
    .filter({ has: page.getByRole('heading', { name, exact: true, level: 6 }) })
    .filter({ has: page.getByRole('heading', { level: 4 }) })
    .last().getByRole('heading', { level: 4 });
}

export class ApartmentLedger extends ApartmentDetailPage {
  readonly accountsReceivable: Locator;
  readonly soaRows: Locator;
  readonly balanceDue: Locator;

  constructor(private readonly p: Page) {
    super(p);
    this.accountsReceivable = p.getByRole('heading', { name: /^Accounts Receivable/, level: 3 });
    this.soaRows = p.getByRole('table').getByRole('row');
    this.balanceDue = p.getByRole('row', { name: /^Balance Due:/ });
  }

  async gotoSoa(apartmentId: string | number): Promise<void> {
    await this.p.goto(`/apartments/${apartmentId}/soa`);
    await this.balanceDue.waitFor();
    // The table renders empty first; the month's "Opening Balance" row comes with the data (slow on UAT).
    await this.soaRows.filter({ hasText: 'Opening Balance' }).first().waitFor({ timeout: 30_000 }).catch(() => {});
  }

  /** Invoices tab row by document code ("Inv-202611-00028"). Cells: 3 Amount · 5 Due Amount · 7 Status. */
  docRow(code: string) {
    const row = this.invoiceRows.filter({ has: this.p.getByRole('cell', { name: code, exact: true }) });
    const c = row.getByRole('cell');
    return { row, category: c.nth(2), amount: c.nth(3), dueAmount: c.nth(5), dueDate: c.nth(6), status: c.nth(7) };
  }

  soaRow(code: string): Locator {
    return this.soaRows.filter({ hasText: code });
  }
}

export class ContactLedger {
  readonly current: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.current = bucket(page, 'Current');
    this.rows = page.getByRole('table').getByRole('row');
  }

  async goto(contactId: string | number): Promise<void> {
    await this.page.goto(`/contacts/${contactId}/detail`);
    await this.page.getByRole('heading', { name: 'Apartments Owned' }).waitFor();
  }

  async gotoUnpaid(contactId: string | number): Promise<void> {
    await this.page.goto(`/contacts/${contactId}/invoices`);
    await this.page.getByRole('table').waitFor();
  }

  row(code: string): Locator {
    return this.rows.filter({ hasText: code });
  }
}
