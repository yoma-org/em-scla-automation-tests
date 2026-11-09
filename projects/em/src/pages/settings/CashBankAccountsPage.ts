// src/pages/settings/CashBankAccountsPage.ts — Cash And Bank Account List (/settings/accounts)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class CashBankAccountsPage {
  readonly heading: Locator;
  readonly main: Locator;
  readonly search: Locator;
  /** [New] → Create Cash And Bank Account. */
  readonly newButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Cash And Bank Account List', level: 1 });
    this.main = page.getByRole('main');
    this.search = this.main.getByRole('searchbox', { name: 'Keyword Search' });
    this.newButton = this.main.getByRole('link', { name: 'New account' });
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.cashBankAccounts);
    await this.heading.waitFor();
  }

  /** Pencil icon of one account row ("Edit 006"). */
  editLink(name: string): Locator {
    return this.main.getByRole('link', { name: `Edit ${name}`, exact: true });
  }
}
