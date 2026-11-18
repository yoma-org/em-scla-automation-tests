// src/data/collection.ts — data for the Collection (Make Payment, Cash Received) and Cash (Outflow, Transfer)
// specs, through the Old EM UI. Everything is created on OUR apartment / OUR accounts.
//
//   createUnpaidInvoice(page, apt, units?)  UO invoice (Electricity (YESC) 0 → units, 100 units = 10,000 Ks) approved
//                                           at once. → { invoiceId, invoiceUrl, code ("Inv-YYYYMM-NNNNN"), total }
//   apartmentAr(page, apt)                  "Accounts Receivable …" on the apartment Summary tab.
//   createUnknownReceipt(page, acc, amount) Unknown Received into our BANK account (MO - A5). → { rv, remarks }
//   createOutflowDraft(page, acc, amount)   Cash Outflow draft PV from our account. → { payee, description }
import { expect, type Locator, type Page } from '@playwright/test';
import { uniqueName } from '@helpers/names';
import { toast } from '@components/Toast';
import { createUoInvoice, type Apartment, type CashAccount } from './builders';
import { ApartmentDetailPage } from '@pages/apartments/ApartmentDetailPage';
import { UnknownReceivedPage } from '@pages/collection/UnknownReceivedPage';
import { CashOutflowPage } from '@pages/cash/CashOutflowPage';
import { parseAmount, waitIdle } from '@pages/collection/common';
import { CashBankAccountsPage } from '@pages/cash-bank-accounts/CashBankAccountsPage';

export { rechargeWallet } from './wallet';

/**
 * Closing balance of our account in the Cash & Bank Account list. The list re-renders after it loads and can
 * drop a keyword typed too early, so the search is retried until our row shows.
 */
export async function accountBalance(page: Page, accountName: string): Promise<number> {
  const list = new CashBankAccountsPage(page);
  await list.goto();
  await page.waitForLoadState('networkidle');
  await expect(async () => {
    await list.search.fill('');
    await list.search.fill(accountName);
    await expect(list.row(accountName)).toBeVisible({ timeout: 5_000 });
  }).toPass({ timeout: 45_000 });
  const text = await list.closingBalance(accountName).innerText();
  return parseAmount(text.split(':').pop()!);
}

/** Case test data "MO - A5" exists on UAT; "MO Zone A/B" / "MO - Zone A/B" do not. */
export const LOCATION = 'MO - A5';
/** UO price of Electricity (YESC) on UAT: 100 Ks a unit. */
export const YESC_PRICE = 100;

export interface UnpaidInvoice {
  invoiceId: string;
  invoiceUrl: string;
  code: string;
  total: number;
}

export async function createUnpaidInvoice(page: Page, apt: Pick<Apartment, 'id' | 'name'>, units = 100): Promise<UnpaidInvoice> {
  const { invoiceId, invoiceUrl } = await createUoInvoice(page, apt, { 'Electricity (YESC)': { previous: 0, current: units } });
  const row = new ApartmentDetailPage(page).invoiceRow('Utilities');
  const code = (await row.getByRole('cell').first().innerText()).trim();
  expect(code, 'invoice code on the Invoices tab').toMatch(/^Inv-\d{6}-\d+$/);
  const total = parseAmount(await row.getByRole('cell').nth(3).innerText());
  expect(total, `UO invoice of ${units} units`).toBe(units * YESC_PRICE);
  return { invoiceId, invoiceUrl, code, total };
}

/** Invoice detail header: "#Inv-…" / "CoRef : …" / status box ("Paid", "Unpaid", …) under it. */
export function invoiceStatusBox(page: Page, inv: Pick<UnpaidInvoice, 'code'>): Locator {
  return page.locator('div').filter({ has: page.getByText(`#${inv.code}`, { exact: true }) })
    .filter({ has: page.getByText(/^CoRef :/) }).last().locator(':scope > div').last();
}

export async function apartmentAr(page: Page, apt: Pick<Apartment, 'id'>): Promise<number> {
  const detail = new ApartmentDetailPage(page);
  await detail.goto(apt.id);
  // The Summary shows 0.00 until the AR request answers.
  await page.waitForLoadState('networkidle');
  await waitIdle(page);
  const heading = page.getByRole('heading', { name: /^Accounts Receivable/ });
  await expect(heading).toBeVisible();
  return parseAmount((await heading.innerText()).replace('Accounts Receivable', ''));
}

export async function createUnknownReceipt(page: Page, account: Pick<CashAccount, 'name'>, amount: number): Promise<{ rv: string; remarks: string }> {
  const form = new UnknownReceivedPage(page);
  const remarks = uniqueName('unknown receipt');
  await form.goto();
  await form.fill({ amount, account: account.name, location: LOCATION, remarks });
  await form.submitButton.click();
  await expect(toast(page, 'Cash Receipt has been created successfully')).toBeVisible();
  await form.openAllocation();
  await form.searchAllocation(account.name);
  const row = form.allocationRow(account.name);
  await expect(row).toHaveCount(1);
  const rv = (await row.getByRole('cell').nth(1).innerText()).trim();
  expect(rv).toMatch(/^RV-\d+$/);
  return { rv, remarks };
}

export async function createOutflowDraft(page: Page, account: Pick<CashAccount, 'name'>, amount: number): Promise<{ payee: string; description: string }> {
  const form = new CashOutflowPage(page);
  const payee = uniqueName('Payee');
  const description = uniqueName('to buy tissue');
  await form.goto();
  await form.fill({ payee, amount, category: 'Landscaping Expenses', account: account.name, description });
  await form.submitButton.click();
  await expect(toast(page, 'Cash Outflow has been created successfully')).toBeVisible();
  return { payee, description };
}
