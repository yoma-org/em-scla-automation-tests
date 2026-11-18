// src/pages/apartments/ApartmentDetailPage.ts — Apartment Detail (/apartments/:id/detail and its tabs)
// Tabs (menubar links): Summary · Invoices (/invoice) · S.O.A (/soa) · Wallet · Deposit · Note (/notes) · Edit.
// Summary: "Accounts Receivable <amount>" heading, AR ageing, Owner / Tenant Details.
// Invoices tab: [Add Invoice] [Make Payment], "MMK Total Unpaid Amount: …", table
// # · Co.ref · Category · Amount · Invoice Date · Due Amount · Due Date · Status · Manage (eye → /invoices/:id).
import { type Locator, type Page } from '@playwright/test';

export class ApartmentDetailPage {
  readonly title: Locator;
  readonly ownerDetails: Locator;
  readonly tenantDetails: Locator;
  readonly invoiceRows: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Apartment Detail', { exact: true });
    this.ownerDetails = page.getByRole('heading', { name: 'Owner Details', exact: true });
    this.tenantDetails = page.getByRole('heading', { name: 'Tenant Details', exact: true });
    this.invoiceRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/detail`);
    await this.ownerDetails.waitFor();
  }

  async gotoInvoices(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/invoice`);
    await this.page.getByRole('link', { name: 'Add Invoice' }).waitFor();
  }

  /** Apartment name shown above the tabs. */
  name(name: string): Locator {
    return this.page.getByText(name, { exact: true }).first();
  }

  /** Invoices tab row by category (e.g. 'Utilities'); its eye link opens /invoices/:id. */
  invoiceRow(category: string): Locator {
    return this.invoiceRows.filter({ has: this.page.getByRole('cell', { name: category, exact: true }) });
  }
}
