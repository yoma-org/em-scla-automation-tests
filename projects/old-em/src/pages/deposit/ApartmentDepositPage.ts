// src/pages/deposit/ApartmentDepositPage.ts — Apartment › Deposit tab (/apartments/:id/deposit)
// Buttons: [Add Deposit], plus [Withdraw Deposit] once the balance is above 0. Month filter, Currency (MMK),
// [PDF], link [Deposit Invoice] (/apartments/:id/deposit-invoice). "MMK Deposit Current Balance: …" (hidden at 0).
// Ledger: Date · Description · DR · CR · Balance, e.g. "RV-102442 ( Deposit Received )".
//   Add Deposit → "Add Deposit has been created successfully" (posted at once, no approval)
//   Withdraw Deposit → "Deposit Withdraw has been created successfully" (draft PV, PV counter)
import { expect, type Locator, type Page } from '@playwright/test';
import { SidePanel, optionalAmount } from '@pages/wallet/common';

export interface AddDepositInput {
  amount: number;
  account: string;
  method?: string;
  location?: string;
  remark?: string;
}

export class ApartmentDepositPage {
  readonly addDepositButton: Locator;
  readonly withdrawButton: Locator;
  readonly depositInvoiceLink: Locator;
  readonly balanceParagraph: Locator;
  readonly table: Locator;
  readonly addDeposit: SidePanel;
  readonly withdraw: SidePanel;

  constructor(private readonly page: Page) {
    this.addDepositButton = page.getByRole('button', { name: 'Add Deposit', exact: true });
    this.withdrawButton = page.getByRole('button', { name: 'Withdraw Deposit', exact: true });
    this.depositInvoiceLink = page.getByRole('link', { name: 'Deposit Invoice', exact: true });
    this.balanceParagraph = page.getByRole('paragraph').filter({ hasText: /MMK Deposit Current Balance/ });
    this.table = page.getByRole('table');
    this.addDeposit = new SidePanel(page, 'Add Deposit');
    this.withdraw = new SidePanel(page, 'Withdraw Deposit');
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/deposit`);
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await expect(this.row(/Opening Balance/)).toBeVisible({ timeout: 30_000 });
    await expect(this.addDepositButton).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async balance(): Promise<number> {
    return optionalAmount(this.balanceParagraph);
  }

  row(text: string | RegExp): Locator {
    return this.table.getByRole('row').filter({ hasText: text });
  }

  async doAddDeposit(input: AddDepositInput): Promise<void> {
    await this.addDepositButton.click();
    await expect(this.addDeposit.root).toBeVisible();
    await this.fillAddDeposit(input);
    await this.addDeposit.submit();
  }

  /** Fills the open Add Deposit panel (does not submit). */
  async fillAddDeposit(input: AddDepositInput): Promise<void> {
    if ((await this.addDeposit.field('Currency').innerText()).trim() !== 'MMK') await this.addDeposit.choose('Currency', 'MMK');
    await this.addDeposit.choose('Method*', input.method ?? 'Cash');
    await this.addDeposit.chooseAccount('Received In*', input.account);
    await this.addDeposit.choose('Location*', input.location ?? 'MO - CL');
    await this.addDeposit.amount.fill(String(input.amount));
    if (input.remark) await this.addDeposit.remark.fill(input.remark);
  }

  async doWithdraw(account: string, amount: number, remark?: string): Promise<void> {
    await this.withdrawButton.click();
    await expect(this.withdraw.root).toBeVisible();
    await this.withdraw.chooseAccount('Withdraw From*', account);
    await this.withdraw.amount.fill(String(amount));
    if (remark) await this.withdraw.remark.fill(remark);
    await this.withdraw.submit();
  }
}
