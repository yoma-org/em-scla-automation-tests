// src/pages/billing/InvoiceCalcForm.ts — the Create Invoice form as INV-038 (invoice calculation) uses it:
// typing a line like a user, then WATCHING the line for a while instead of waiting for the expected figures.
//
// How Old EM calculates (NewInvoice chunk of em-web, read 2026-11-12):
//   - Disc. Price / Tax / Total and the footer come from the server: POST /api/invoices/amount with the line.
//   - It is called on every Unit change (watcher), every Discount change (watcher) and on Gross Price blur.
//   - Each response OVERWRITES the line's Gross Price and Discount with the values it was sent. A response to a
//     request sent before Gross Price / Discount were typed therefore wipes them (Gross Price empty → "field is
//     required", Total 0.000) or drops the discount; the overwrite changes Discount, which fires the watcher
//     again, so two request chains can keep flipping the form between right and wiped with no user input.
//   - The read-only line fields show 3 decimals ("299.997"); the footer shows 2.
//   - Discount switch "% / Ks" (role switch): on = fixed amount in Ks; switching clears the discount.
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';
import { InvoiceForm } from './InvoiceForm';
import { amountOf } from '@data/billing';

export interface CalcLine {
  unit: string;
  grossPrice: string;
  discount: string;
  /** Discount in Ks (switch on) instead of %. */
  fixed: boolean;
}

export interface LineSample {
  at: number;
  unit: string;
  grossPrice: string;
  discount: string;
  discPrice: string;
  tax: string;
  total: string;
  /** Footer "Gross Total : … Grand Total : …" as one line. */
  footer: string;
}

export class InvoiceCalcForm extends InvoiceForm {
  readonly discountSwitch: Locator;
  readonly requiredErrors: Locator;
  private amountRequests: number[] = [];

  constructor(private readonly p: Page) {
    super(p, 'invoice');
    this.discountSwitch = p.getByRole('switch');
    this.requiredErrors = p.getByText(/field is required/i);
    p.on('request', r => { if (r.method() === 'POST' && /\/api\/invoices\/amount$/.test(r.url())) this.amountRequests.push(Date.now()); });
  }

  /** Number of POST /invoices/amount requests sent since `since` (ms epoch). */
  amountRequestsSince(since: number): number {
    return this.amountRequests.filter(t => t >= since).length;
  }

  /** Header and Item Description / Tax Type; returns the Old CoRef No. filled (undefined when not shown). */
  async fillHeader(apartment: string, category: string, description: string, taxType: string): Promise<string | undefined> {
    await this.apartment.choose(apartment);
    let oldCoRef: string | undefined;
    if (await this.oldCoRef.isVisible()) {
      oldCoRef = `QEOLD${Date.now()}`;
      await this.oldCoRef.fill(oldCoRef);
    }
    await chooseOption(this.p, this.category, category);
    await this.description.fill(description);
    await chooseOption(this.p, this.taxType, taxType);
    return oldCoRef;
  }

  /** Types Unit, Gross Price and Discount key by key (as a user, 50 ms a key) and clicks outside. */
  async typeLine(line: CalcLine): Promise<void> {
    if (line.fixed && (await this.discountSwitch.getAttribute('aria-checked')) !== 'true') {
      // The role=switch input is hidden: click the PrimeVue InputSwitch root around it.
      await this.discountSwitch.locator('xpath=ancestor::*[@data-pc-name="inputswitch"][1]').click();
      await expect(this.discountSwitch).toHaveAttribute('aria-checked', 'true');
    }
    for (const [field, value] of [[this.unit, line.unit], [this.grossPrice, line.grossPrice], [this.discount, line.discount]] as const) {
      await field.click();
      await field.pressSequentially(value, { delay: 50 });
    }
    await this.p.getByText('Remarks', { exact: true }).click();
  }

  async sample(): Promise<LineSample> {
    const [unit, grossPrice, discount, discPrice, tax, total] = await Promise.all(
      [this.unit, this.grossPrice, this.discount, this.discPrice, this.tax, this.total].map(l => l.inputValue()));
    const body = await this.p.locator('body').innerText();
    const footer = (body.match(/Gross Total :[\s\S]*?Grand Total :\s*[\d,.]+ Ks/)?.[0] ?? '').replace(/\s+/g, ' ');
    return { at: Date.now(), unit, grossPrice, discount, discPrice, tax, total, footer };
  }

  /** Samples the line every `every` ms for `ms` ms (no input meanwhile). */
  async watch(ms: number, every = 250): Promise<LineSample[]> {
    const samples: LineSample[] = [];
    const end = Date.now() + ms;
    while (Date.now() < end) {
      samples.push(await this.sample());
      await this.p.waitForTimeout(every);
    }
    samples.push(await this.sample());
    return samples;
  }
}

/** Footer figures of a sample / document text: "Gross Total : 3,000.00 Ks Discount : (300.00 Ks) …". */
export function footerFigures(text: string): { gross?: number; discount?: number; tax?: number; grand?: number } {
  const pick = (re: RegExp) => { const m = text.match(re); return m ? amountOf(m[1]) : undefined; };
  return {
    gross: pick(/Gross Total\s*:?\s*([\d,.]+) Ks/),
    discount: pick(/Discount\s*:?\s*\(?([\d,.]+) Ks/),
    tax: pick(/Comm\w+ Tax\s*:?\s*([\d,.]+) Ks/),
    grand: pick(/Grand Total\s*:?\s*([\d,.]+) Ks/)
  };
}
