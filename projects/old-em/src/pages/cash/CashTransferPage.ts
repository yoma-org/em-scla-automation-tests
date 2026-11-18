// src/pages/cash/CashTransferPage.ts — Cash Transfer (/cash-transfers) and its draft list / approve page.
// Form: Transferred From* · Received In* · Date* (today) · Amount Sent* · Description* · Remark · [Submit] →
// toast "Cash Transfer successfully". The JV is a DRAFT (top-bar "JV" counter, /cash-transfers/draft) and only
// shows in the Recent Transfers table (JV# · Date · Transferred From · Received In · Amount · Description ·
// Created By · Manage) once approved (source-issues D2).
// Draft list: Date · From · To · Amount · Description · Created By · Manage (→ /cash-transfers/:id/approve with
// [Approve] [Delete]).
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseAccount, dropdown, findOnPages, waitIdle } from '@pages/collection/common';

export class CashTransferPage {
  readonly from: Locator;
  readonly to: Locator;
  readonly date: Locator;
  readonly amountSent: Locator;
  readonly description: Locator;
  readonly remark: Locator;
  readonly submitButton: Locator;
  readonly recentRows: Locator;

  constructor(private readonly page: Page) {
    this.from = dropdown(page, 'Transferred From*');
    this.to = dropdown(page, 'Received In*');
    this.date = page.getByRole('combobox', { name: 'Select Date' });
    this.amountSent = page.getByRole('textbox', { name: 'Amount Sent' });
    this.description = page.getByRole('textbox', { name: 'Description*' });
    this.remark = page.getByRole('textbox', { name: 'Remark' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.recentRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cash-transfers');
    await this.submitButton.waitFor();
    await waitIdle(this.page);
  }

  async fill(input: { from: string; to: string; amount: number; description: string }): Promise<void> {
    await chooseAccount(this.page, this.from, input.from);
    await chooseAccount(this.page, this.to, input.to);
    await this.amountSent.fill(String(input.amount));
    await this.description.fill(input.description);
  }

  recentRow(description: string): Locator {
    return this.recentRows.filter({ has: this.page.getByRole('cell', { name: description, exact: true }) });
  }
}

export class CashTransferDraftsPage {
  readonly heading: Locator;
  readonly rows: Locator;
  readonly approveButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Draft: Cash Transfer' });
    this.rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/cash-transfers/draft');
    await expect(this.heading).toBeVisible();
    await waitIdle(this.page);
  }

  async find(description: string): Promise<Locator> {
    return findOnPages(this.page, this.rows.filter({ has: this.page.getByRole('cell', { name: description, exact: true }) }));
  }

  async openApprove(row: Locator): Promise<void> {
    await row.locator('a[href$="/approve"]').click();
    await expect(this.page).toHaveURL(/\/cash-transfers\/\d+\/approve$/);
    await expect(this.approveButton).toBeVisible();
    await waitIdle(this.page);
  }
}
