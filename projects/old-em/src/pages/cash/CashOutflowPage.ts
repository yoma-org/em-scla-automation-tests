// src/pages/cash/CashOutflowPage.ts — Cash Outflow (/cash-outflows) and its draft list / detail.
// Form: Payee* · Date* (today) · Currency (MMK) · Amount* · Category* (expense categories) · Withdraw From* ·
// Description* · Remarks · [Submit] → toast "Cash Outflow has been created successfully"; the PV is a DRAFT
// (top-bar "PV" counter +1, /cash-outflows/draft) until approved.
// "Recent Outflows" table (approved only): (expand) · PV · Date · Account · Payee · Category · Description ·
// Withdrawal · Created By · Approved By.
// Draft list (/cash-outflows/draft): oldest first, no search; expand a row → Manage → /cash-outflows/:id/draft
// with [Approve] [Remove] (no confirm dialog for either: Remove deletes at once).
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';
import { chooseAccount, dropdown, findOnPages, waitIdle } from '@pages/collection/common';

export interface OutflowInput {
  payee: string;
  amount: number;
  category: string;
  account: string;
  description: string;
}

export class CashOutflowPage {
  readonly payee: Locator;
  readonly date: Locator;
  readonly currency: Locator;
  readonly amount: Locator;
  readonly category: Locator;
  readonly withdrawFrom: Locator;
  readonly description: Locator;
  readonly submitButton: Locator;
  readonly recentRows: Locator;

  constructor(private readonly page: Page) {
    this.payee = page.getByRole('textbox', { name: 'Payee*' });
    this.date = page.getByRole('combobox', { name: 'Select Date' });
    this.currency = dropdown(page, 'Currency');
    this.amount = page.getByRole('textbox', { name: 'Amount*' });
    this.category = dropdown(page, 'Category*');
    this.withdrawFrom = dropdown(page, 'Withdraw From*');
    this.description = page.getByRole('textbox', { name: 'Description *' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.recentRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cash-outflows');
    await this.submitButton.waitFor();
    await waitIdle(this.page);
  }

  async fill(input: OutflowInput): Promise<void> {
    await this.payee.fill(input.payee);
    await this.amount.fill(String(input.amount));
    await chooseOption(this.page, this.category, input.category);
    await chooseAccount(this.page, this.withdrawFrom, input.account);
    await this.description.fill(input.description);
  }

  recentRow(payee: string): Locator {
    return this.recentRows.filter({ has: this.page.getByRole('cell', { name: payee, exact: true }) });
  }
}

export class CashOutflowDraftsPage {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly approveButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Draft: Cash Outflow' });
    this.rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/cash-outflows/draft');
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await waitIdle(this.page);
  }

  /** Draft row by payee, searched across pages. */
  async find(payee: string): Promise<Locator> {
    return findOnPages(this.page, this.rows.filter({ has: this.page.getByRole('cell', { name: payee, exact: true }) }));
  }

  /** Expands the row and opens its Manage link (/cash-outflows/:id/draft). Returns the PV id. */
  async openManage(row: Locator): Promise<string> {
    await row.getByRole('button', { name: 'Row Collapsed' }).click();
    const link = this.page.locator('a[href^="/cash-outflows/"][href$="/draft"]').filter({ has: this.page.getByRole('button') }).first();
    const href = (await link.getAttribute('href'))!;
    await link.click();
    await expect(this.page).toHaveURL(new RegExp(`${href}$`));
    await expect(this.approveButton).toBeVisible();
    await waitIdle(this.page);
    return href.match(/\/(\d+)\/draft$/)![1];
  }

  /** Read-only field on the draft detail page by its label. */
  detailField(label: string): Locator {
    return this.page.locator('div').filter({ has: this.page.getByText(label, { exact: true }) }).last().getByRole('textbox');
  }
}
