// src/pages/apartments/ApartmentWalletTab.ts — Apartment › Wallet tab (/estates/:id?tab=wallet)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';
import { parseAmount } from '@helpers/money';

export class ApartmentWalletTab {
  readonly panel: Locator;
  readonly walletTransferLink: Locator;
  /** "MMK Wallet Current Balance: 961.99 Ks" */
  readonly currentBalance: Locator;
  /** "Available: 961.99 Ks" (balance minus pending drafts) */
  readonly available: Locator;
  readonly transactions: Locator;

  constructor(private readonly page: Page) {
    this.panel = page.getByRole('tabpanel', { name: 'Wallet' });
    this.walletTransferLink = this.panel.getByRole('link', { name: 'Wallet Transfer' });
    this.currentBalance = this.panel.getByText(/Wallet Current Balance:/);
    this.available = this.panel.getByText(/^Available:/);
    this.transactions = this.panel.getByRole('region', { name: 'Wallet transactions' }).getByRole('table');
  }

  async goto(apartmentId: number | string): Promise<void> {
    await this.page.goto(Routes.apartmentWallet(apartmentId));
    await this.currentBalance.waitFor();
  }

  /** Current balance as a decimal string, e.g. "961.99". */
  async currentBalanceAmount(): Promise<string> {
    return parseAmount(afterColon(await this.currentBalance.innerText()));
  }

  async availableAmount(): Promise<string> {
    return parseAmount(afterColon(await this.available.innerText()));
  }

  /** The "Transfer out" row of one wallet transfer. */
  transferOutRow(ref: string): Locator {
    return this.transactions.getByRole('row').filter({ hasText: /Transfer out/ }).filter({ hasText: `#${ref}` });
  }

  /** Cell of a transactions row by column: Date, Description, DR, CR, Balance. */
  cell(row: Locator, column: 'Date' | 'Description' | 'DR' | 'CR' | 'Balance'): Locator {
    const index = { Date: 0, Description: 1, DR: 2, CR: 3, Balance: 4 }[column];
    return row.getByRole('cell').nth(index);
  }
}

function afterColon(text: string): string {
  return text.slice(text.indexOf(':') + 1).trim();
}
