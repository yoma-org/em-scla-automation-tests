// src/pages/collection/common.ts — pieces the Collection (Make Payment, Cash Received) and Cash (Outflow,
// Transfer) screens share.
//
// Old EM quirks seen here:
// - A full-page "custom-loading" overlay covers the form while data loads and swallows clicks: waitIdle().
// - Account dropdowns read "[CASH MMK] <name>" / "[YOMA Bank MMK] <name> <account no>" and have a filter box.
// - Unknown Received › Deposit lists BANK accounts only (no CASH account can take an unknown receipt).
// - Paginated lists (Recent Receipts, draft lists, AR) have no keyword search: show 100 rows, then page.
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption, formField } from '@components/PrimeSelect';
import { escapeRegExp } from '@pages/wallet/common';

export { parseAmount, ks, escapeRegExp } from '@pages/wallet/common';

export async function waitIdle(page: Page): Promise<void> {
  await expect(page.locator('.custom-loading')).toBeHidden({ timeout: 60_000 });
}

/** The Dropdown of a labelled form field ("Location*", "Payment Method*", …). */
export function dropdown(page: Page, label: string): Locator {
  return formField(page, label).getByRole('combobox');
}

/** Picks one of OUR cash / bank accounts by its unique name (the filter box narrows the long list). */
export async function chooseAccount(page: Page, combobox: Locator, accountName: string): Promise<void> {
  await chooseOption(page, combobox, new RegExp(`\\]\\s*${escapeRegExp(accountName)}(\\s+\\d+)?$`), accountName);
}

/**
 * Finds a row on a paginated PrimeVue table: shows 100 rows per page, then pages forward until the row
 * shows. Returns the row locator (count 0 when it is on no page).
 */
export async function findOnPages(page: Page, row: Locator, maxPages = 10): Promise<Locator> {
  await waitIdle(page);
  const rpp = page.getByRole('combobox', { name: 'Rows per page' });
  if ((await rpp.count()) && (await rpp.isEnabled()) && (await rpp.innerText()).trim() !== '100') {
    await chooseOption(page, rpp, '100');
    await waitIdle(page);
  }
  const next = page.getByRole('button', { name: 'Next Page' });
  for (let i = 0; i < maxPages; i++) {
    if (await row.count()) return row;
    if (!(await next.count()) || (await next.isDisabled())) break;
    await next.click();
    await waitIdle(page);
  }
  return row;
}

/** Top-bar "Showing 1 to 10 of N entries" style draft counter value, e.g. counter('PV') → 35. */
export async function draftCounter(page: Page, label: 'JV' | 'PV'): Promise<number> {
  const href = label === 'PV' ? '/cash-outflows/draft' : '/cash-transfers/draft';
  const links = page.locator(`a[href="${href}"]`);
  await expect(links.last()).toHaveText(/^\d+$/);
  return Number((await links.last().innerText()).trim());
}

/** "12-11-2026" — the format of Old EM's date inputs. */
export function todayDmy(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}
