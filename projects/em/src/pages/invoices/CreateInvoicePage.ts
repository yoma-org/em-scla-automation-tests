// src/pages/invoices/CreateInvoicePage.ts — Receivables › Invoices - Debit Note › Create Invoice
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export type TaxType = '5% Tax' | '3% Tax' | 'No Tax' | 'Incl. 5% Tax' | 'Incl. 3% Tax';

export interface InvoiceLineInput {
  description?: string;
  taxType: TaxType;
  unit: string;
  grossPrice: string;
  discount: string;
}

/** One item line of the invoice form (index is 0-based, the UI label is "Line <n>"). */
export class InvoiceLine {
  readonly root: Locator;
  readonly description: Locator;
  readonly taxType: Locator;
  readonly unit: Locator;
  readonly grossPrice: Locator;
  readonly discount: Locator;
  /** Read-only figures; each shows "Not calculated yet" until the line is calculated. */
  readonly discPrice: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  constructor(private readonly page: Page, index: number) {
    this.root = page.getByRole('group', { name: `Line ${index + 1}`, exact: true });
    this.description = this.root.getByRole('textbox', { name: 'Item Description' });
    this.taxType = this.root.getByRole('combobox', { name: 'Tax Type' });
    this.unit = this.root.getByRole('textbox', { name: 'Unit' });
    this.grossPrice = this.root.getByRole('textbox', { name: 'Gross Price' });
    this.discount = this.root.getByRole('textbox', { name: 'Discount value' });
    this.discPrice = this.root.getByTestId(`line-figure-discount-${index}`);
    this.tax = this.root.getByTestId(`line-figure-tax-${index}`);
    this.total = this.root.getByTestId(`line-figure-total-${index}`);
  }

  async selectTaxType(taxType: TaxType): Promise<void> {
    await this.taxType.click();
    await this.page.getByRole('option', { name: taxType, exact: true }).click();
  }

  /** Fills the line and leaves the Discount field: the figures are calculated on blur. */
  async fill(line: InvoiceLineInput): Promise<void> {
    await this.selectTaxType(line.taxType);
    if (line.description !== undefined) await this.description.fill(line.description);
    await this.unit.fill(line.unit);
    await this.grossPrice.fill(line.grossPrice);
    await this.discount.fill(line.discount);
    await this.discount.blur();
  }
}

export class CreateInvoicePage {
  readonly heading: Locator;
  readonly paymentTermsLabel: Locator;
  readonly paymentTerms: Locator;
  readonly totals: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Create Invoice', level: 1 });
    this.paymentTermsLabel = page.locator('label[for="invoice-payment-term"]');
    this.paymentTerms = page.getByRole('combobox', { name: 'Payment Terms' });
    this.totals = page.getByTestId('paper-totals');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.createInvoice);
  }

  line(index = 0): InvoiceLine {
    return new InvoiceLine(this.page, index);
  }

  /** Value cell of a row in the invoice totals box: 'Gross Total', 'Discount', 'Commercial Tax', 'Grand Total'. */
  total(name: 'Gross Total' | 'Discount' | 'Commercial Tax' | 'Grand Total'): Locator {
    return this.totals.locator('div').filter({ has: this.page.locator('dt', { hasText: name }) }).locator('dd');
  }
}
