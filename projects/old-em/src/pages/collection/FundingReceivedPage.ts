// src/pages/collection/FundingReceivedPage.ts — Cash Received › Funding Received (/inter-company)
// Payer* · Date* (today) · Currency (MMK) · Amount* · Category* (grouped list of income categories) · Deposit* ·
// Location* · Remarks · [Submit]. Posts at once (no approval): the RV shows in Recent Receipts.
import { type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';
import { chooseAccount, dropdown, waitIdle } from './common';

export class FundingReceivedPage {
  readonly payer: Locator;
  readonly date: Locator;
  readonly currency: Locator;
  readonly amount: Locator;
  readonly category: Locator;
  readonly deposit: Locator;
  readonly location: Locator;
  readonly remarks: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.payer = page.getByRole('textbox', { name: 'Payer*' });
    this.date = page.getByRole('combobox', { name: 'Date' });
    this.currency = dropdown(page, 'Currency');
    this.amount = page.getByRole('textbox', { name: 'Amount*' });
    this.category = dropdown(page, 'Category*');
    this.deposit = dropdown(page, 'Deposit*');
    this.location = dropdown(page, 'Location*');
    this.remarks = page.getByRole('textbox', { name: 'Remarks' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/inter-company');
    await this.submitButton.waitFor();
    await waitIdle(this.page);
  }

  async fill(input: { payer: string; amount: number; category: string; account: string; location: string; remarks?: string }): Promise<void> {
    await this.payer.fill(input.payer);
    await this.amount.fill(String(input.amount));
    await chooseOption(this.page, this.category, input.category);
    await chooseAccount(this.page, this.deposit, input.account);
    await chooseOption(this.page, this.location, input.location);
    if (input.remarks) await this.remarks.fill(input.remarks);
  }
}
