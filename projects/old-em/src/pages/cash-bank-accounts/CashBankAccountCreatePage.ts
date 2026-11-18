// src/pages/cash-bank-accounts/CashBankAccountCreatePage.ts — Create Cash And Bank Account (/cash-and-bank-accounts/new)
// Name* · Currency (MMK default) · Initial Balance (InputNumber, shows "100,000.00 Ks") ·
// Payment Method (MultiSelect: Cash, Cheque, Bank Transfer, …) · Payment Method Type* (Dropdown: CASH,
// BANK, …; no default) · BANK only: Bank Name*, Account Number*, Enable Overdraft · Description.
// Create → toast "Account has been created successfully" → back to the list.
import { type Locator, type Page } from '@playwright/test';
import { chooseMulti, chooseOption, formField } from '@components/PrimeSelect';

export class CashBankAccountCreatePage {
  readonly name: Locator;
  readonly currency: Locator;
  readonly initialBalance: Locator;
  readonly paymentMethod: Locator;
  readonly type: Locator;
  readonly bankName: Locator;
  readonly accountNumber: Locator;
  readonly description: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByPlaceholder('Account Name');
    this.currency = formField(page, 'Currency').getByRole('combobox');
    this.initialBalance = page.getByRole('textbox', { name: 'Amount' });
    this.paymentMethod = page.locator('[data-pc-name="multiselect"]');
    this.type = formField(page, 'Type*').getByRole('combobox');
    this.bankName = formField(page, /Bank Name\*$/).getByRole('combobox');
    this.accountNumber = page.getByPlaceholder('Account Number');
    this.description = page.getByPlaceholder('Description');
    this.createButton = page.getByRole('button', { name: 'Create' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/cash-and-bank-accounts/new');
    await this.name.waitFor();
  }

  async selectCurrency(code: string): Promise<void> {
    if ((await this.currency.innerText()).trim() !== code) await chooseOption(this.page, this.currency, code);
  }

  async selectPaymentMethods(methods: string[]): Promise<void> {
    await chooseMulti(this.page, this.paymentMethod, methods);
  }

  async selectType(type: string): Promise<void> {
    await chooseOption(this.page, this.type, type);
  }

  async selectBank(bank: string | RegExp): Promise<void> {
    await chooseOption(this.page, this.bankName, bank);
  }
}
