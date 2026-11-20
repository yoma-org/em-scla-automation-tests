// src/pages/invoices/CreateInvoicePage.ts — Receivables › Invoices - Debit Note › Create Invoice
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export type TaxType = '5% Tax' | '3% Tax' | 'No Tax' | 'Incl. 5% Tax' | 'Incl. 3% Tax';

export interface InvoiceLineInput {
  description?: string;
  taxType: TaxType;
  unit: string;
  grossPrice: string;
  /** Leave out for Incl. tax lines: Discount is locked there. */
  discount?: string;
}

/** One item line of the invoice form (index is 0-based, the UI label is "Line <n>"). */
export class InvoiceLine {
  readonly root: Locator;
  readonly description: Locator;
  readonly taxType: Locator;
  readonly unit: Locator;
  readonly grossPrice: Locator;
  readonly discount: Locator;
  /** Incl. tax lines only: locked "Gross Price before tax" value next to the Gross Price input. */
  readonly grossPriceBeforeTax: Locator;
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
    this.grossPriceBeforeTax = this.root.getByTestId(`line-net-unit-price-${index}`).locator('span').last();
    this.discPrice = this.root.getByTestId(`line-figure-discount-${index}`);
    this.tax = this.root.getByTestId(`line-figure-tax-${index}`);
    this.total = this.root.getByTestId(`line-figure-total-${index}`);
  }

  async selectTaxType(taxType: TaxType): Promise<void> {
    await this.taxType.click();
    await this.page.getByRole('option', { name: taxType, exact: true }).click();
  }

  /** Fills the line and leaves the last field: the figures are calculated on blur. */
  async fill(line: InvoiceLineInput): Promise<void> {
    await this.selectTaxType(line.taxType);
    if (line.description !== undefined) await this.description.fill(line.description);
    await this.unit.fill(line.unit);
    await this.grossPrice.fill(line.grossPrice);
    if (line.discount === undefined) {
      await this.grossPrice.blur();
      return;
    }
    await this.discount.fill(line.discount);
    await this.discount.blur();
  }
}

export class CreateInvoicePage {
  readonly heading: Locator;
  readonly paymentTermsLabel: Locator;
  readonly paymentTerms: Locator;
  readonly totals: Locator;
  /** Apartment* dropdown; opens dialog "Apartments for Apartment" with a search box and a "Suggestions" listbox. */
  readonly apartment: Locator;
  readonly apartmentSearch: Locator;
  readonly apartmentOptions: Locator;
  /** Form-level % / Ks switch for line discounts (on = Ks). */
  readonly discountInKs: Locator;
  readonly category: Locator;
  readonly currency: Locator;
  /** "Date *" on screen; accessible name "Date" since build v0.4.1-158 (the "*" is aria-hidden). DD-MM-YYYY; defaults to today. */
  readonly date: Locator;
  /** "Choose date" button next to Date; opens a dialog with a month grid ("November 2026"). */
  readonly chooseDate: Locator;
  readonly calendar: Locator;
  readonly nextMonth: Locator;
  readonly createButton: Locator;
  /** "Add blank line": adds the next item line (group "Line <n>"). */
  readonly addLineButton: Locator;
  /** "Old CoRef No. *": only shown (and required) while Settings › General › "Old CoRef No." is enabled. */
  readonly oldCoRef: Locator;

  constructor(private readonly page: Page) {
    this.category = page.getByRole('combobox', { name: 'Income Categories' });
    this.currency = page.getByRole('combobox', { name: 'Currency' });
    this.date = page.getByRole('textbox', { name: /^Date( \*)?$/ });
    this.chooseDate = page.getByRole('button', { name: 'Choose date' });
    this.calendar = page.getByRole('dialog').filter({ has: page.getByRole('grid') });
    this.nextMonth = this.calendar.getByRole('button', { name: 'Go to the Next Month' });
    this.createButton = page.getByRole('button', { name: 'Create', exact: true });
    this.oldCoRef = page.getByRole('textbox', { name: /^Old CoRef No/ });
    this.addLineButton = page.getByRole('button', { name: 'Add blank line' });
    this.heading = page.getByRole('heading', { name: 'Create Invoice', level: 1 });
    this.paymentTermsLabel = page.locator('label[for="invoice-payment-term"]');
    this.paymentTerms = page.getByRole('combobox', { name: 'Payment Terms' });
    this.totals = page.getByTestId('paper-totals');
    this.apartment = page.getByRole('combobox', { name: 'Apartment', exact: true });
    const apartmentDialog = page.getByRole('dialog', { name: 'Apartments for Apartment' });
    this.apartmentSearch = apartmentDialog.getByRole('combobox', { name: 'Search apartments' });
    this.apartmentOptions = apartmentDialog.getByRole('listbox', { name: 'Suggestions' }).getByRole('option');
    this.discountInKs = page.getByRole('switch', { name: 'Discount in Ks' });
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.createInvoice);
  }

  async chooseApartment(name: string): Promise<void> {
    await this.apartment.click();
    await this.apartmentSearch.fill(name);
    await this.apartmentOptions.filter({ hasText: name }).first().click();
  }

  /**
   * Fills "Old CoRef No." when the environment setting shows it (another tester may turn it on).
   * Returns the value filled, or undefined when the field is not shown.
   */
  async fillOldCoRefIfShown(): Promise<string | undefined> {
    // The field comes with the settings request, a moment after the form: give it time to appear.
    if (!(await this.oldCoRef.waitFor({ timeout: 5_000 }).then(() => true, () => false))) return undefined;
    const value = `QENEW${Date.now()}`;
    await this.oldCoRef.fill(value);
    return value;
  }

  async chooseCategory(name: string): Promise<void> {
    await this.category.click();
    await this.page.getByRole('option', { name, exact: true }).click();
  }

  /** e.g. '+7 days'; the list shows "Loading payment terms…" first. */
  async choosePaymentTerms(term: string | RegExp): Promise<void> {
    await this.paymentTerms.click();
    await this.page.getByRole('option', { name: term }).first().click();
  }

  /**
   * Day button in the open calendar, named like "Thursday, November 19th, 2026" (today: "Today, …, selected").
   * Moves to later months with "Go to the Next Month" until the day is shown.
   */
  async calendarDay(date: Date): Promise<Locator> {
    const ord = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
    const name = `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${date.toLocaleDateString('en-US', { month: 'long' })} ${ord(date.getDate())}, ${date.getFullYear()}`;
    const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    for (let i = 0; i < 24 && !(await this.calendar.getByRole('grid', { name: month }).isVisible()); i++) {
      if (!(await this.nextMonth.isEnabled())) break; // the picker may stop at the current month
      await this.nextMonth.click();
    }
    return this.calendar.getByRole('grid', { name: month }).getByRole('button', { name: new RegExp(`\\b${name}\\b`) });
  }

  line(index = 0): InvoiceLine {
    return new InvoiceLine(this.page, index);
  }

  /** Value cell of a row in the invoice totals box: 'Gross Total', 'Discount', 'Commercial Tax', 'Grand Total'. */
  total(name: 'Gross Total' | 'Discount' | 'Commercial Tax' | 'Grand Total'): Locator {
    return this.totals.locator('div').filter({ has: this.page.locator('dt', { hasText: name }) }).locator('dd');
  }
}
