// src/pages/collection/UnknownReceivedPage.ts — Cash Received › Unknown Received (/unknown-receipts)
// Tab "Unknown Received": Date* (today) · Currency (MMK) · Amount* · Deposit* (BANK accounts only) · Location* ·
// Remarks · [Submit] → toast "Cash Receipt has been created successfully" (form resets, stays on the page).
// Tab "Unknown Received Allocation": Keyword Search, currency, table (expand) · RV# · Date · Account · Payer ·
// Category · Description · Deposit · Created By. Expanding a row shows "Manage" → /unknown-receipts/:id/edit.
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';
import { chooseAccount, dropdown, waitIdle } from './common';

export class UnknownReceivedPage {
  readonly receivedTab: Locator;
  readonly allocationTab: Locator;
  readonly date: Locator;
  readonly currency: Locator;
  readonly amount: Locator;
  readonly deposit: Locator;
  readonly location: Locator;
  readonly remarks: Locator;
  readonly submitButton: Locator;
  readonly search: Locator;
  readonly allocationRows: Locator;

  constructor(private readonly page: Page) {
    this.receivedTab = page.getByRole('tab', { name: 'Unknown Received', exact: true });
    this.allocationTab = page.getByRole('tab', { name: 'Unknown Received Allocation' });
    const form = page.getByRole('tabpanel', { name: 'Unknown Received', exact: true });
    this.date = form.getByRole('combobox', { name: 'Date' });
    this.currency = dropdown(page, 'Currency');
    this.amount = form.getByRole('textbox', { name: 'Amount*' });
    this.deposit = dropdown(page, 'Deposit*');
    this.location = dropdown(page, 'Location*');
    this.remarks = form.getByRole('textbox', { name: 'Remarks' });
    this.submitButton = form.getByRole('button', { name: 'Submit' });
    const alloc = page.getByRole('tabpanel', { name: 'Unknown Received Allocation' });
    this.search = alloc.getByRole('textbox', { name: 'Keyword Search' });
    this.allocationRows = alloc.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(): Promise<void> {
    await this.page.goto('/unknown-receipts');
    await this.submitButton.waitFor();
    await waitIdle(this.page);
  }

  async fill(input: { amount: number; account: string; location: string; remarks?: string }): Promise<void> {
    await this.amount.fill(String(input.amount));
    await chooseAccount(this.page, this.deposit, input.account);
    await chooseOption(this.page, this.location, input.location);
    if (input.remarks) await this.remarks.fill(input.remarks);
  }

  async openAllocation(): Promise<void> {
    await this.allocationTab.click();
    await expect(this.search).toBeVisible();
    await waitIdle(this.page);
  }

  /** Allocation rows matching a keyword (RV# or account name). */
  async searchAllocation(keyword: string): Promise<void> {
    await this.search.fill(keyword);
    await waitIdle(this.page);
  }

  allocationRow(text: string | RegExp): Locator {
    return this.allocationRows.filter({ hasText: text }).filter({ has: this.page.getByRole('button', { name: /Row (Collapsed|Expanded)/ }) });
  }

  /** Expands the row and returns its Manage link (/unknown-receipts/:id/edit). */
  async manageLink(row: Locator): Promise<Locator> {
    await row.getByRole('button', { name: 'Row Collapsed' }).click();
    const link = this.page.locator('a[href^="/unknown-receipts/"][href$="/edit"]').first();
    await expect(link).toBeVisible();
    return link;
  }
}
