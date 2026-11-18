// src/pages/balances/ApartmentLedgerPage.ts — an apartment's monthly ledgers: S.O.A (/apartments/:id/soa),
// Wallet (/wallet) and Deposit (/deposit).
//
// Common: month picker (input "11/2026" + "Choose Date" → month grid with Previous/Next Year), currency
// dropdown, [PDF], a table whose first row is "01/mm/yyyy Opening Balance …".
// S.O.A: currency dropdown's aria-label is always "Select Currency" (read its text), "All History" switch,
//   "MMK Current Balance: X" paragraph; columns Date · Transactions · Details · Amount · Payments · Balance;
//   footer row "Balance Due: X". Invoice rows: "Invoice | Inv-YYYYMM-NNNNN - due on dd/mm/yyyy".
// Wallet: [Recharge] [Wallet Transfer] [Add Credit Note] [Refund], "MMK Wallet Current Balance: X".
// Deposit: [Add Deposit] [Withdraw Deposit], "MMK Deposit Current Balance: X".
// Wallet / Deposit columns: Date · Description ("RV-102443 ( Wallet Cash Received )") · DR · CR · Balance.
import { expect, type Locator, type Page } from '@playwright/test';
import { cents } from './money';

export type Ledger = 'soa' | 'wallet' | 'deposit';

export interface LedgerRow { date: string; cells: string[]; balance: bigint; text: string }

export class ApartmentLedgerPage {
  readonly table: Locator;
  readonly bodyRows: Locator;
  readonly currentBalance: Locator;
  readonly monthInput: Locator;
  readonly currency: Locator;
  readonly balanceDue: Locator;
  readonly pdfButton: Locator;

  constructor(private readonly page: Page, readonly ledger: Ledger) {
    this.table = page.getByRole('table');
    this.bodyRows = this.table.getByRole('rowgroup').nth(1).getByRole('row');
    this.currentBalance = page.getByRole('paragraph').filter({ hasText: /Current Balance:/ });
    this.monthInput = page.locator('.p-calendar input').first();
    this.currency = page.locator('.p-dropdown').first();
    this.balanceDue = this.table.getByRole('row').filter({ has: page.getByRole('cell', { name: 'Balance Due:', exact: true }) }).getByRole('cell').last();
    this.pdfButton = page.getByRole('button', { name: 'PDF' });
  }

  async goto(apartmentId: string): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/${this.ledger}`);
    await this.openingRow().waitFor();
  }

  /** "11/2026" as the month box shows it. */
  async monthValue(): Promise<string> {
    return this.monthInput.inputValue();
  }

  /** Picks a month in the month picker and waits for its Opening Balance row (01/mm/yyyy). */
  async selectMonth(y: number, m: number): Promise<void> {
    await this.page.getByRole('button', { name: 'Choose Date' }).click();
    const panel = this.page.getByRole('dialog', { name: 'Choose Date' });
    await panel.waitFor();
    for (let i = 0; i < 20; i++) {
      const shown = Number((await panel.getByRole('button', { name: 'Choose Year' }).innerText()).trim());
      if (shown === y) break;
      await panel.getByRole('button', { name: shown < y ? 'Next Year' : 'Previous Year' }).click();
    }
    await panel.locator('.p-monthpicker-month').nth(m - 1).click();
    await expect(panel).toBeHidden();
    await this.openingRow(`01/${String(m).padStart(2, '0')}/${y}`).waitFor();
  }

  /** The Opening Balance row (optionally of a given 01/mm/yyyy). */
  openingRow(date?: string): Locator {
    const r = this.bodyRows.filter({ hasText: /Opening Balance/ });
    return date ? r.filter({ has: this.page.getByRole('cell', { name: date, exact: true }) }) : r;
  }

  async rows(): Promise<LedgerRow[]> {
    const texts = await this.bodyRows.evaluateAll(rs => rs.map(r => [...r.querySelectorAll('td')].map(c => (c.textContent ?? '').replace(/\s+/g, ' ').trim())));
    return texts.filter(c => c.length > 1).map(c => ({ date: c[0], cells: c, balance: cents(c[c.length - 1]), text: c.join(' | ') }));
  }

  async openingBalance(): Promise<bigint> {
    const cells = await this.openingRow().first().getByRole('cell').allInnerTexts();
    return cents(cells[cells.length - 1]);
  }

  /** Last running balance in the table (the month's closing balance). */
  async closingBalance(): Promise<bigint> {
    const rows = await this.rows();
    return rows[rows.length - 1].balance;
  }

  async currentBalanceCents(): Promise<bigint> {
    return cents((await this.currentBalance.innerText()).split(':').pop());
  }
}
