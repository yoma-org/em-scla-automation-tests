// src/pages/wallet/ApartmentWalletPage.ts — Apartment › Wallet tab (/apartments/:id/wallet)
// Buttons: [Recharge] [Add Credit Note], plus [Wallet Transfer] [Refund] once the balance is above 0.
// Month filter (current month), Currency (MMK), [PDF]. "MMK Wallet Current Balance: 100,000.00 Ks" (hidden at 0).
// Ledger: Date · Description · DR · CR · Balance. Rows: "Opening Balance 1 November 2026",
// "RV-102439 ( Wallet Cash Received )" (recharge, in DR), "WT-100121 ( Wallet Transfer from A to B )",
// "PV-100276 ( Wallet Refund )". Forms open in a side panel; see common.ts for the quirks.
//   Recharge → "Wallet Recharge has been created successfully" (posted at once, no approval)
//   Wallet Transfer → "Wallet Transfer has been created successfully" (posted at once)
//   Add Credit Note → "Wallet Credit Note has been drafted successfully" (draft, CN counter)
//   Refund → "Wallet Refund has been created successfully" (draft PV, PV counter)
import { expect, type Locator, type Page } from '@playwright/test';
import { SidePanel, optionalAmount } from './common';

export interface RechargeInput {
  amount: number;
  /** Our cash / bank account name. */
  account: string;
  method?: string;
  location?: string;
  remark?: string;
}

export class ApartmentWalletPage {
  readonly rechargeButton: Locator;
  readonly transferButton: Locator;
  readonly creditNoteButton: Locator;
  readonly refundButton: Locator;
  readonly balanceParagraph: Locator;
  readonly table: Locator;
  readonly recharge: SidePanel;
  readonly transfer: SidePanel;
  readonly creditNote: SidePanel;
  readonly refund: SidePanel;

  constructor(private readonly page: Page) {
    this.rechargeButton = page.getByRole('button', { name: 'Recharge', exact: true });
    this.transferButton = page.getByRole('button', { name: 'Wallet Transfer', exact: true });
    this.creditNoteButton = page.getByRole('button', { name: 'Add Credit Note', exact: true });
    this.refundButton = page.getByRole('button', { name: 'Refund', exact: true });
    this.balanceParagraph = page.getByRole('paragraph').filter({ hasText: /MMK Wallet Current Balance/ });
    this.table = page.getByRole('table');
    this.recharge = new SidePanel(page, 'Recharge Wallet');
    this.transfer = new SidePanel(page, 'Wallet Transfer');
    this.creditNote = new SidePanel(page, 'Add Credit Note');
    this.refund = new SidePanel(page, 'Wallet Refund');
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/wallet`);
    await this.waitLoaded();
  }

  /** The ledger and the balance are loaded once the "Opening Balance" row shows. */
  async waitLoaded(): Promise<void> {
    await expect(this.row(/Opening Balance/)).toBeVisible({ timeout: 30_000 });
    await expect(this.rechargeButton).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  /** MMK wallet balance (0 when Old EM hides the line). */
  async balance(): Promise<number> {
    return optionalAmount(this.balanceParagraph);
  }

  row(text: string | RegExp): Locator {
    return this.table.getByRole('row').filter({ hasText: text });
  }

  async doRecharge(input: RechargeInput): Promise<void> {
    await this.rechargeButton.click();
    await expect(this.recharge.root).toBeVisible();
    await this.fillRecharge(input);
    await this.recharge.submit();
  }

  /** Fills the open Recharge Wallet panel (does not submit). */
  async fillRecharge(input: RechargeInput): Promise<void> {
    if ((await this.recharge.field('Currency').innerText()).trim() !== 'MMK') await this.recharge.choose('Currency', 'MMK');
    await this.recharge.choose('Method*', input.method ?? 'Cash');
    await this.recharge.chooseAccount('Received In*', input.account);
    await this.recharge.choose('Location*', input.location ?? 'MO - CL');
    await this.recharge.amount.fill(String(input.amount));
    if (input.remark) await this.recharge.remark.fill(input.remark);
  }

  async doTransfer(to: string, amount: number, remark?: string): Promise<void> {
    await this.transferButton.click();
    await expect(this.transfer.root).toBeVisible();
    await this.transfer.choose('Transfer to*', to, to);
    await this.transfer.amount.fill(String(amount));
    if (remark) await this.transfer.remark.fill(remark);
    await this.transfer.submit();
  }

  async doCreditNote(amount: number, category: string, description: string): Promise<void> {
    await this.creditNoteButton.click();
    await expect(this.creditNote.root).toBeVisible();
    await this.creditNote.amount.fill(String(amount));
    await this.creditNote.choose('Category*', category);
    await this.creditNote.root.getByRole('textbox', { name: 'Description Remarks' }).fill(description);
    await this.creditNote.submit();
  }

  async doRefund(account: string, amount: number, remark?: string): Promise<void> {
    await this.refundButton.click();
    await expect(this.refund.root).toBeVisible();
    await this.refund.chooseAccount('Refund From*', account);
    await this.refund.amount.fill(String(amount));
    if (remark) await this.refund.remark.fill(remark);
    await this.refund.submit();
  }
}
