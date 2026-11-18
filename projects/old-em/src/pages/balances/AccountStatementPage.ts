// src/pages/balances/AccountStatementPage.ts — Reports › Account Statement.
//
// List (/reports/account-statements): "Advance Filter" — Account* ("Choose an Account", options
// "[CASH MMK] <name>", filter box) · Filter by Date (range picker, default last 30 days to today; days
// after today are disabled) · [View Statement]; then "Cash & Bank Balance (as of dd/mm/yyyy)" [PDF] [Excel]
// with one card per currency (CashBankSummary).
// Detail (/reports/account-statements/:accountId/:from/:to, dates yyyy-mm-dd): "[ CASH MMK ] <name>",
// "Account Statement for dd/mm/yyyy - dd/mm/yyyy", [Excel] [PDF], table Date · Description · DR · CR · Balance;
// first row "dd/mm/yyyy Opening Balance … <balance>", then e.g. "RV-102445 (Unknown)", "PV-100277 (<desc>)",
// "(Initial Balance)". The URL accepts future dates although the picker does not.
import { expect, type Locator, type Page } from '@playwright/test';
import { CashBankSummary } from './CashBankSummary';
import { cents } from './money';

export interface StatementRow { date: string; description: string; dr: string; cr: string; balance: bigint; text: string }

export class AccountStatementPage {
  readonly accountSelect: Locator;
  readonly dateRange: Locator;
  readonly viewButton: Locator;
  readonly summary: CashBankSummary;
  readonly table: Locator;
  readonly period: Locator;

  constructor(private readonly page: Page) {
    this.accountSelect = page.getByRole('combobox', { name: 'Choose an Account' }).or(page.locator('#account [role="combobox"]')).first();
    this.dateRange = page.getByRole('combobox', { name: 'Select Date' });
    this.viewButton = page.getByRole('button', { name: 'View Statement' });
    this.summary = new CashBankSummary(page);
    this.table = page.getByRole('table');
    this.period = page.getByRole('paragraph').filter({ hasText: /^Account Statement for/ });
  }

  async goto(): Promise<void> {
    await this.page.goto('/reports/account-statements');
    await this.summary.heading.waitFor();
  }

  /** Reports › Account Statement from the left menu (the case's step). */
  async openFromMenu(): Promise<void> {
    await this.page.getByRole('menuitem', { name: 'reports.menu' }).click();
    await this.page.locator('a[href="/reports/account-statements"]').filter({ visible: true }).first().click();
    await expect(this.page).toHaveURL(/\/reports\/account-statements$/);
    await this.summary.heading.waitFor();
  }

  async chooseAccount(name: string): Promise<void> {
    await this.accountSelect.click();
    const list = this.page.locator(`[id="${await this.accountSelect.getAttribute('aria-controls')}"]`);
    await list.waitFor();
    await this.page.locator('[data-pc-section="panel"]').filter({ has: list }).getByRole('searchbox').fill(name);
    await list.locator('li.p-dropdown-item').filter({ hasText: new RegExp(`\\] ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).first().click();
    await expect(list).toBeHidden();
  }

  /** Picks from / to in the range picker (both in the month shown or earlier months). */
  async pickRange(from: { y: number; m: number; d: number }, to: { y: number; m: number; d: number }): Promise<void> {
    await this.page.getByRole('button', { name: 'Choose Date' }).click();
    const panel = this.page.getByRole('dialog', { name: 'Choose Date' });
    await panel.waitFor();
    for (const day of [from, to]) {
      await this.showMonth(panel, day.y, day.m);
      await panel.locator('td:not(.p-datepicker-other-month) > span').filter({ hasText: new RegExp(`^${day.d}$`) }).first().click();
    }
    await this.page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  }

  private async showMonth(panel: Locator, y: number, m: number): Promise<void> {
    const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let i = 0; i < 36; i++) {
      const shownM = names.indexOf((await panel.getByRole('button', { name: 'Choose Month' }).innerText()).trim()) + 1;
      const shownY = Number((await panel.getByRole('button', { name: 'Choose Year' }).innerText()).trim());
      const diff = (y * 12 + m) - (shownY * 12 + shownM);
      if (diff === 0) return;
      await panel.getByRole('button', { name: diff > 0 ? 'Next Month' : 'Previous Month' }).click();
    }
  }

  async view(): Promise<void> {
    await this.viewButton.click();
    await expect(this.page).toHaveURL(/\/reports\/account-statements\/\d+\/[\d-]+\/[\d-]+$/);
    await this.openingRow().waitFor();
  }

  /** Detail page straight from its URL (dates yyyy-mm-dd). */
  async open(accountId: string, from: string, to: string): Promise<void> {
    await this.page.goto(`/reports/account-statements/${accountId}/${from}/${to}`);
    await this.openingRow().waitFor();
  }

  openingRow(): Locator {
    return this.table.getByRole('row').filter({ hasText: /Opening Balance/ });
  }

  async rows(): Promise<StatementRow[]> {
    const texts = await this.table.getByRole('rowgroup').nth(1).getByRole('row')
      .evaluateAll(rs => rs.map(r => [...r.querySelectorAll('td')].map(c => (c.textContent ?? '').replace(/\s+/g, ' ').trim())));
    return texts.filter(c => c.length >= 5).map(c => ({ date: c[0], description: c[1], dr: c[2], cr: c[3], balance: cents(c[4]), text: c.join(' | ') }));
  }

  async openingBalance(): Promise<bigint> {
    return (await this.rows())[0].balance;
  }

  async closingBalance(): Promise<bigint> {
    const rows = await this.rows();
    return rows[rows.length - 1].balance;
  }
}
