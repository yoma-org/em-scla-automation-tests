// src/pages/wallet/DraftPages.ts — draft lists reached from the top-bar counters, for wallet / deposit money.
//
//   CN  /apartments/wallet/credit-note-draft  "Draft: Credit Note"; Advance Filter (Currency, Zone, Building);
//       Date · Apartment · Category · Description "( Wallet Credit Received ) …" · Remark · Amount · Created By ·
//       Manage (eye → /apartments/wallet/:id/draft). Detail: [Approve] [Remove] + read-only fields.
//   PV  /cash-outflows/draft  "Draft: Cash Outflow"; collapsed rows Date · Payee (apartment) · Currency · Amount ·
//       Withdrawal From · Description ("Wallet Refund" / "Deposit Withdrawal") · Category · Created By.
//       Expanding a row shows Remark and Manage (eye → /cash-outflows/:id/draft). Detail: [Approve] [Remove];
//       approved → "PV-100276" and a [Voucher] link.
// No keyword search on either list: show 100 rows and find our (unique) apartment.
import { expect, type Locator, type Page } from '@playwright/test';
import { showHundredRows } from './common';

export class CreditNoteDraftsPage {
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/apartments/wallet/credit-note-draft');
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await expect(this.page.getByText('Draft: Credit Note').first()).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    await showHundredRows(this.page);
  }

  row(apartment: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: apartment, exact: true }) });
  }

  manageLink(apartment: string): Locator {
    return this.row(apartment).locator('a[href^="/apartments/wallet/"][href$="/draft"]');
  }
}

export class CashOutflowDraftsPage {
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cash-outflows/draft');
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Draft: Cash Outflow' })).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    await showHundredRows(this.page);
  }

  /** Collapsed row of a PV draft, by payee (apartment) and description ("Wallet Refund", "Deposit Withdrawal"). */
  row(payee: string, description: string): Locator {
    return this.table.getByRole('row')
      .filter({ has: this.page.getByRole('cell', { name: payee, exact: true }) })
      .filter({ has: this.page.getByRole('cell', { name: description, exact: true }) });
  }

  /** Expands the row and returns its Manage (eye) link, shown in the expansion row below it. */
  async manageLink(payee: string, description: string): Promise<Locator> {
    const row = this.row(payee, description);
    await row.getByRole('button', { name: 'Row Collapsed' }).click();
    const link = row.locator('xpath=following-sibling::tr[1]').locator('a[href^="/cash-outflows/"][href$="/draft"]');
    await expect(link).toBeVisible();
    return link;
  }
}
