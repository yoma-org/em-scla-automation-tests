// src/data/wallet.ts — wallet / deposit money on OUR apartment, through the Old EM UI.
//
//   rechargeWallet(page, apt, account, amount)  Wallet › Recharge (Cash, location "MO - CL") into our account.
//                                               Posted at once. → { rv } e.g. "RV-102439"
//   addDeposit(page, apt, account, amount)      Deposit › Add Deposit, same fields. → { rv }
//   accountBalance(page, accountName)           Closing balance of our account in the Cash & Bank Account list.
import { expect, type Page } from '@playwright/test';
import { toast } from '@components/Toast';
import { ApartmentWalletPage } from '@pages/wallet/ApartmentWalletPage';
import { ApartmentDepositPage } from '@pages/deposit/ApartmentDepositPage';
import { CashBankAccountsPage } from '@pages/cash-bank-accounts/CashBankAccountsPage';
import { parseAmount } from '@pages/wallet/common';
import type { Apartment, CashAccount } from './builders';

/** Voucher number at the start of a ledger description, e.g. "RV-102439 ( Wallet Cash Received )" → "RV-102439". */
export function voucherOf(rowDescription: string): string {
  const v = rowDescription.match(/\b(RV|PV|WT|WP|CN)-\d+/)?.[0];
  if (!v) throw new Error(`No voucher number in "${rowDescription}"`);
  return v;
}

export async function rechargeWallet(page: Page, apt: Pick<Apartment, 'id'>, account: Pick<CashAccount, 'name'>, amount: number): Promise<{ rv: string }> {
  const wallet = new ApartmentWalletPage(page);
  await wallet.goto(apt.id);
  const before = await wallet.row(/Wallet Cash Received/).count();
  await wallet.doRecharge({ amount, account: account.name, remark: 'QE OLD recharge' });
  await expect(toast(page, 'Wallet Recharge has been created successfully')).toBeVisible();
  await expect(wallet.row(/Wallet Cash Received/)).toHaveCount(before + 1);
  const rv = voucherOf(await wallet.row(/Wallet Cash Received/).last().innerText());
  return { rv };
}

export async function addDeposit(page: Page, apt: Pick<Apartment, 'id'>, account: Pick<CashAccount, 'name'>, amount: number): Promise<{ rv: string }> {
  const deposit = new ApartmentDepositPage(page);
  await deposit.goto(apt.id);
  const before = await deposit.row(/Deposit Received/).count();
  await deposit.doAddDeposit({ amount, account: account.name, remark: 'QE OLD deposit' });
  await expect(toast(page, 'Add Deposit has been created successfully')).toBeVisible();
  await expect(deposit.row(/Deposit Received/)).toHaveCount(before + 1);
  const rv = voucherOf(await deposit.row(/Deposit Received/).last().innerText());
  return { rv };
}

export async function accountBalance(page: Page, accountName: string): Promise<number> {
  const list = new CashBankAccountsPage(page);
  await list.goto();
  // The list can finish loading after the search was typed and then ignores it: wait, and type again if needed.
  await page.waitForLoadState('networkidle');
  await expect(async () => {
    await list.search.fill('');
    await list.search.fill(accountName);
    await expect(list.row(accountName)).toBeVisible({ timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
  const text = await list.closingBalance(accountName).innerText();
  return parseAmount(text.split(':').pop()!);
}
