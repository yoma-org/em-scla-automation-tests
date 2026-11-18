// src/pages/balances/DashboardWidgets.ts — the Dashboard's figures (/), read as numbers.
//
// Accounts Receivable (as of dd/mm/yyyy): one card per currency → <h4>total</h4><span>MMK</span>,
//   "Current: …", "Overdue: …".
// Cash & Bank Balance: see CashBankSummary.
// Net Cash: one table per currency (h5 "MMK" before it), columns "" · dd/mm/yyyy (today) · "Nov 2026" ·
//   "Oct 2026" · "Sep 2026"; rows Total Collection · Total Payment "(… Ks)" · Net Cash.
import { type Locator, type Page } from '@playwright/test';
import { CashBankSummary } from './CashBankSummary';
import { cents } from './money';

export interface ArCard { currency: string; total: bigint; current: bigint; overdue: bigint; text: string }
export interface NetCashTable { currency: string; columns: string[]; collection: string[]; payment: string[]; net: string[] }

export class DashboardWidgets {
  readonly arHeading: Locator;
  readonly netCashHeading: Locator;
  readonly cashBank: CashBankSummary;

  constructor(private readonly page: Page) {
    this.arHeading = page.getByRole('heading', { name: /^Accounts Receivable \(as of/ });
    this.netCashHeading = page.getByRole('heading', { name: 'Net Cash', exact: true });
    this.cashBank = new CashBankSummary(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.arHeading.waitFor();
    await this.netCashHeading.waitFor();
  }

  /** Opens the Dashboard from the left menu (the case's step). */
  async openFromMenu(): Promise<void> {
    await this.page.getByRole('menuitem', { name: 'dashboard.menu' }).click();
    await this.arHeading.waitFor();
    await this.netCashHeading.waitFor();
  }

  /** The AR card of a currency (by its code under the amount, e.g. "MMK"). */
  arCard(currency: string): Locator {
    return this.page.locator('.card').filter({ has: this.page.getByText(currency, { exact: true }) })
      .filter({ hasText: /Current:/ });
  }

  async readAr(currency: string): Promise<ArCard> {
    const card = this.arCard(currency);
    await card.waitFor();
    const total = await card.locator('h4').innerText();
    const current = await card.getByText(/^Current:/).innerText();
    const overdue = await card.getByText(/^Overdue:/).innerText();
    return { currency, total: cents(total), current: cents(current), overdue: cents(overdue), text: `${total} | ${current} | ${overdue}` };
  }

  /** Net Cash table of one currency (the table after its h5 heading). */
  netCashTable(currency: string): Locator {
    return this.page.locator(`xpath=//h5[normalize-space()="Net Cash"]/following::h5[normalize-space()="${currency}"][1]/following::table[1]`);
  }

  async readNetCash(currency: string): Promise<NetCashTable> {
    const table = this.netCashTable(currency);
    await table.waitFor();
    const columns = (await table.getByRole('columnheader').allInnerTexts()).map(t => t.trim());
    const row = async (label: string) =>
      (await table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: label, exact: true }) }).getByRole('cell').allInnerTexts())
        .map(t => t.trim()).slice(1);
    return { currency, columns, collection: await row('Total Collection'), payment: await row('Total Payment'), net: await row('Net Cash') };
  }
}
