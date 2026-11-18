// src/pages/billing/InvoiceListsPages.ts — the three invoice / debit note listings. Each has an
// "Advance Filter" region with a "Select Apartment" search dropdown; filter by our own apartment.
//   Invoices - Debit Note (/invoices): Code · Co.ref · Apartment · Category · Total · Paid · Due · Date · Created By.
//   Draft list (/invoices/draft): Date · Apartment · Type (INVOICE / DEBIT NOTE) · Category · Total · Created By · Manage
//     (pencil → /invoices/:id/draft).
//   Reports › Invoices (/reports/invoices): Invoice · Co.ref · Apartment · Category · Total · Paid · Due · Date ·
//     Created By · Approved By.
import { type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';

class FilteredInvoiceList {
  readonly filter: Locator;
  readonly rows: Locator;

  constructor(protected readonly page: Page, private readonly path: string) {
    this.filter = page.getByRole('region', { name: 'Advance Filter' });
    this.rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.filter.waitFor();
  }

  async filterApartment(apartment: string): Promise<void> {
    await chooseOption(this.page, this.filter.getByRole('combobox', { name: 'Select Apartment' }), apartment, apartment);
  }

  row(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }
}

export class InvoicesListPage extends FilteredInvoiceList {
  constructor(page: Page) { super(page, '/invoices'); }
}

export class InvoiceDraftsPage extends FilteredInvoiceList {
  constructor(page: Page) { super(page, '/invoices/draft'); }

  manageLink(row: Locator): Locator {
    return row.locator('a[href$="/draft"]');
  }
}

export class InvoiceReportPage extends FilteredInvoiceList {
  constructor(page: Page) { super(page, '/reports/invoices'); }
}
