// src/pages/wallet/WalletTransfersPage.ts — Wallet Transfers register and the "Wallet Transfer" dialog (/wallet/transfers)
// The dialog posts a journal entry at once: there is no approval step and no undo.
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class WalletTransfersPage {
  readonly heading: Locator;
  readonly register: Locator;
  readonly dialog: Locator;
  readonly form: Locator;
  readonly currency: Locator;
  readonly fromApartment: Locator;
  readonly transferTo: Locator;
  readonly amount: Locator;
  readonly remark: Locator;
  /** Label follows the amount: "Post 10.00 Ks". */
  readonly postButton: Locator;
  /** Hint next to [Post], e.g. "Choose the apartment to transfer to." */
  readonly formStatus: Locator;
  /** Shown in the form after a post: "Posted as WT-00008 — 10.00 Ks". The dialog stays open and resets. */
  readonly postedMessage: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Wallet Transfers', level: 1 });
    this.register = page.getByRole('main').getByRole('table');
    this.dialog = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Wallet Transfer', level: 2 }) });
    this.form = page.getByRole('form', { name: 'New wallet transfer' });
    this.currency = this.form.getByRole('combobox', { name: 'Currency' });
    this.fromApartment = this.form.getByRole('textbox', { name: 'From apartment' });
    this.transferTo = this.form.getByRole('combobox', { name: 'Transfer to' });
    this.amount = this.form.getByRole('textbox', { name: 'Amount' });
    this.remark = this.form.getByRole('textbox', { name: 'Remark' });
    this.postButton = this.form.getByRole('button', { name: /^Post\b/ });
    this.formStatus = this.form.getByRole('status');
    this.postedMessage = this.form.getByText(/^Posted as WT-\d+/);
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.walletTransfers);
    await this.heading.waitFor();
  }

  /** Opens the register with the New dialog for a source apartment, as the Wallet tab link does. */
  async gotoNew(fromApartmentId: number | string): Promise<void> {
    await this.page.goto(`${Routes.walletTransfers}?from_estate_id=${fromApartmentId}&new=1`);
    await this.form.waitFor();
  }

  /** Reads "Posted as WT-00008 — 10.00 Ks" → { ref: 'WT-00008', amount: '10.00 Ks' }. */
  async posted(): Promise<{ ref: string; amount: string }> {
    const text = await this.postedMessage.innerText();
    const m = /Posted as (WT-\d+)\s*[—-]\s*(.+)$/.exec(text.trim());
    if (!m) throw new Error(`Unexpected post message: "${text}"`);
    return { ref: m[1], amount: m[2] };
  }

  /** Picks the destination in the "Apartments for Transfer to" search popup. */
  async chooseTransferTo(apartment: string): Promise<void> {
    await this.transferTo.click();
    const popup = this.page.getByRole('dialog', { name: 'Apartments for Transfer to' });
    await popup.getByRole('combobox', { name: /Search apartments/ }).fill(apartment);
    await popup.getByRole('option', { name: apartment, exact: true }).click();
  }

  async fill(data: { to: string; amount: string; remark?: string }): Promise<void> {
    await this.chooseTransferTo(data.to);
    await this.amount.fill(data.amount);
    if (data.remark) await this.remark.fill(data.remark);
  }

  /** Register row of one transfer, found by its reference (WT-00006). */
  row(ref: string): Locator {
    return this.register.getByRole('row').filter({ has: this.page.getByRole('link', { name: new RegExp(`^${ref}\\b`) }) });
  }

  /** Cell of a register row by column: Reference, Status, From, To, Amount, Location, Journal entry. */
  cell(row: Locator, column: 'Reference' | 'Status' | 'From' | 'To' | 'Amount' | 'Location' | 'Journal entry'): Locator {
    const index = { Reference: 0, Status: 1, From: 2, To: 3, Amount: 4, Location: 5, 'Journal entry': 6 }[column];
    return row.getByRole('cell').nth(index);
  }
}
