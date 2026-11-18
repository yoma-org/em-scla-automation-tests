// src/pages/billing/InvoiceForm.ts — Create Invoice (/invoices/add-invoice) and Create Debit Note
// (/invoices/add-debit-note). Same header on both: Apartment* · Income Categories* · Currency (MMK) · Date*
// (today, dd-mm-yyyy) · Payment Terms (Due On Receipt / +7 / +15 / +30 / +45 / +60 / +90 days) · [Create].
// Invoice line: Item Description* · Tax Type* (5% Tax / 3% Tax / No Tax / Incl. 5% Tax / Incl. 3% Tax) · Unit ·
//   Gross Price · Discount (% / Ks switch) · Disc. Price · Tax · Total (last three read-only).
// Debit note line: "Item Descritpion*" (sic) · Unit · Gross Price · Total (read-only). No tax, no discount.
// Footer: "Gross Total : … Discount : … Commercial Tax : … Grand Total : …" (DN: "Commerical Tax", sic).
//
// Old EM quirk: the read-only totals are only recalculated on key input, so type numbers with
// pressSequentially (fill() leaves the totals stale even though the saved document is right).
// Settings › General Settings › "Old CoRef No." = Enable (a GLOBAL setting other testers switch) adds a required
// "Old CoRef No.*" textbox to both forms; fill() fills it with a unique value when it is shown.
// Create → toast "Invoice has been successfully created" / "Debit Note has been successfully created" →
// the draft's detail page /invoices/:id/draft.
import { type Locator, type Page } from '@playwright/test';
import { ApartmentPicker } from '@components/ApartmentPicker';
import { chooseOption, formField } from '@components/PrimeSelect';

export type DocKind = 'invoice' | 'debit-note';

export interface InvoiceLineInput {
  description: string;
  /** Invoice only, e.g. '3% Tax'. */
  taxType?: string;
  unit: number;
  grossPrice: number;
  /** Invoice only: percentage discount. */
  discountPercent?: number;
}

export interface InvoiceInput {
  category: string;
  paymentTerms?: string;
  line: InvoiceLineInput;
}

export class InvoiceForm {
  readonly apartment: ApartmentPicker;
  readonly category: Locator;
  readonly currency: Locator;
  readonly date: Locator;
  readonly paymentTerms: Locator;
  readonly oldCoRef: Locator;
  readonly description: Locator;
  readonly taxType: Locator;
  readonly unit: Locator;
  readonly grossPrice: Locator;
  readonly discount: Locator;
  /** Invoice: Disc. Price · Tax · Total. Debit note: Total. */
  readonly computed: Locator;
  readonly footer: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page, readonly kind: DocKind) {
    this.apartment = new ApartmentPicker(page, formField(page, 'Apartment*').getByRole('combobox'));
    this.category = formField(page, 'Income Categories*').getByRole('combobox');
    this.currency = formField(page, 'Currency').getByRole('combobox');
    this.date = formField(page, 'Date*').getByRole('combobox');
    this.paymentTerms = formField(page, 'Payment Terms').getByRole('combobox');
    this.oldCoRef = page.getByRole('textbox', { name: 'Old CoRef No.*' });
    this.description = page.getByRole('textbox', { name: /^Item Desc/ });
    this.taxType = page.getByRole('combobox', { name: /^(Incl\. )?\d+% Tax$|^No Tax$/ });
    this.unit = page.getByRole('spinbutton').nth(0);
    this.grossPrice = page.getByRole('textbox', { name: 'Gross Price' });
    this.discount = page.getByRole('spinbutton').nth(1);
    this.computed = page.getByRole('textbox', { disabled: true });
    this.footer = page.locator('div').filter({ hasText: /Gross Total :[\s\S]*Grand Total :/ }).last();
    this.createButton = page.getByRole('button', { name: 'Create' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.kind === 'invoice' ? '/invoices/add-invoice' : '/invoices/add-debit-note');
    await this.createButton.waitFor();
    await this.description.waitFor();
  }

  /** Disc. Price / Tax / Total (invoice) — the read-only line fields. */
  get discPrice(): Locator { return this.computed.nth(0); }
  get tax(): Locator { return this.computed.nth(1); }
  get total(): Locator { return this.kind === 'invoice' ? this.computed.nth(2) : this.page.getByRole('textbox', { name: 'Total' }); }

  private async type(field: Locator, value: number): Promise<void> {
    await field.click();
    await field.pressSequentially(String(value));
  }

  /**
   * Fills the header (apartment first) and one line; does not click Create.
   * Returns the Old CoRef No. it had to fill (see header), or undefined when the field is not shown.
   */
  async fill(apartment: string, data: InvoiceInput): Promise<string | undefined> {
    await this.apartment.choose(apartment);
    let oldCoRef: string | undefined;
    if (await this.oldCoRef.isVisible()) {
      oldCoRef = `QEOLD${Date.now()}`;
      await this.oldCoRef.fill(oldCoRef);
    }
    await chooseOption(this.page, this.category, data.category);
    if (data.paymentTerms) await chooseOption(this.page, this.paymentTerms, data.paymentTerms);
    await this.description.fill(data.line.description);
    if (this.kind === 'invoice' && data.line.taxType) await chooseOption(this.page, this.taxType, data.line.taxType);
    await this.type(this.unit, data.line.unit);
    await this.type(this.grossPrice, data.line.grossPrice);
    if (this.kind === 'invoice' && data.line.discountPercent !== undefined) await this.type(this.discount, data.line.discountPercent);
    // Click outside so the last value is committed. (Tab instead leaves the read-only totals empty.)
    await this.page.getByText('Remarks', { exact: true }).click();
    return oldCoRef;
  }
}
