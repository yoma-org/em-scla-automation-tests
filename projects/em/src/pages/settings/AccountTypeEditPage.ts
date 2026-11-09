// src/pages/settings/AccountTypeEditPage.ts — Settings › Account Classification › Manage Type › Edit (/settings/classification/account-types/<id>/edit)
import { type Locator, type Page } from '@playwright/test';

/** Which extra fields accounts of a type carry; fixed once the type is created. */
export interface AccountTypeConfig {
  bankName: boolean;
  accountNumber: boolean;
  enableOverdraft: boolean;
}

export class AccountTypeEditPage {
  readonly heading: Locator;
  readonly form: Locator;
  readonly name: Locator;
  /** "What accounts of this type carry": Bank Name, Account Number, Enable Overdraft (read-only checkboxes). */
  readonly carries: Locator;
  readonly bankName: Locator;
  readonly accountNumber: Locator;
  readonly enableOverdraft: Locator;
  readonly status: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Edit AccountType', level: 1 });
    this.form = page.getByRole('form', { name: 'Edit Account Type' });
    this.name = this.form.getByRole('textbox', { name: 'Name' });
    this.carries = this.form.getByRole('group', { name: 'What accounts of this type carry' });
    this.bankName = this.carries.getByRole('checkbox', { name: 'Bank Name' });
    this.accountNumber = this.carries.getByRole('checkbox', { name: 'Account Number' });
    this.enableOverdraft = this.carries.getByRole('checkbox', { name: 'Enable Overdraft' });
    this.status = this.form.getByRole('combobox', { name: 'Status' });
  }

  async config(): Promise<AccountTypeConfig> {
    return {
      bankName: await this.bankName.isChecked(),
      accountNumber: await this.accountNumber.isChecked(),
      enableOverdraft: await this.enableOverdraft.isChecked()
    };
  }
}
