// src/pages/cash-bank-accounts/CashBankAccountsPage.ts — Cash And Bank Account List (/cash-and-bank-accounts)
// Each row: Account cell (name paragraph + "<TYPE> <bank> <currency>") · Balance cell
// ("Account No: …", "Initial Balance: 100,000.00 Ks", "Balance (Closing Balance) : 100,000.00 Ks") ·
// Manage ([Edit Initial Balance] → /initial-balance/:id/edit, pencil → /cash-and-bank-accounts/:id/edit, delete).
// Names are not unique on UAT (several "Cash In Hand - City Loft"): our names are.
import { type Locator, type Page } from '@playwright/test';

export class CashBankAccountsPage {
  readonly search: Locator;
  readonly newButton: Locator;
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.search = page.getByPlaceholder('Keyword Search');
    this.newButton = page.getByRole('link', { name: 'New' });
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cash-and-bank-accounts');
    await this.search.waitFor();
  }

  row(name: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('paragraph').filter({ hasText: new RegExp(`^${escape(name)}$`) }) });
  }

  accountCell(name: string): Locator {
    return this.row(name).getByRole('cell').nth(0);
  }

  initialBalance(name: string): Locator {
    return this.row(name).getByRole('paragraph').filter({ hasText: /Initial Balance/ });
  }

  closingBalance(name: string): Locator {
    return this.row(name).getByRole('paragraph').filter({ hasText: /Closing Balance/ });
  }

  editLink(name: string): Locator {
    return this.row(name).locator('a[href^="/cash-and-bank-accounts/"][href$="/edit"]');
  }
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
