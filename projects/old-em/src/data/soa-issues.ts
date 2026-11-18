// src/data/soa-issues.ts — money movements for the SOA / initial-balance issue tests (tests/issues/
// soa-balances.spec.ts, tests/issues/initial-balance.spec.ts). Builds on src/data/balances.ts.
//
//   readInvoices(page, apt)                 Apartment › Invoices tab: every invoice of the apartment
//                                           → [{ id, code, category, date, total (cents) }]
//   newInvoice(page, apt, before, cat)      the invoice that appeared since `before` (UO / EM generated)
//   payByWallet(page, apt, codes)           Make Payment, method Wallet, ticks each invoice "pay in full" → WP
//   importUo(page, apt, units, file)        UO › Import: template of the apartment's building, our row only,
//                                           reading date today → invoiced at once ("1 UO Entry imported.")
//   bulkApproveUo(page, apt)                UO draft list: tick our draft → Bulk Approve → confirm
//   createFundingReceivedOn(page, acc, amount, day)
//                                           Cash Received › Funding Received with a chosen Date (back-dating)
//   editInitialBalance(page, accountId, amount)
//                                           Cash & Bank Account › Edit Initial Balance → Update; returns the toast
import { expect, type Page } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { toast } from '@components/Toast';
import { formField } from '@components/PrimeSelect';
import { uniqueName } from '@helpers/names';
import type { Apartment, CashAccount } from '@data/builders';
import { createUoDraft } from '@data/builders';
import { pickDay, pickItem, typeAmount } from '@data/balances';
import { cents, dmy, today } from '@pages/balances/money';
import { ImportPage, parseCsv, toCsv } from '@pages/billing/ImportPage';
import { MakePaymentPage } from '@pages/wallet/MoneyPages';
import { bulkApprove } from '@pages/role-permission/DraftActions';
import { showAllRows } from '@pages/billing/BillingListPages';
import { UoDraftsPage } from '@pages/uo/UoDraftsPage';

export type Day = { y: number; m: number; d: number };

export interface AptInvoice { id: string; code: string; category: string; date: Day; total: bigint }

/** "12/11/2026" → { y: 2026, m: 11, d: 12 } */
export function parseDmy(text: string): Day {
  const m = text.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (!m) throw new Error(`No dd/mm/yyyy date in "${text}"`);
  return { y: Number(m[3]), m: Number(m[2]), d: Number(m[1]) };
}

/** Last day of month m (1-12) of year y. */
export const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/**
 * Every invoice of the apartment, from its Invoices tab (# · Co.ref · Category · Amount · Invoice Date · Due Amount ·
 * Due Date · Status · Manage). The total is read from the invoice page ("Total: …" heading), not the list.
 */
export async function readInvoices(page: Page, apartment: Pick<Apartment, 'id'>): Promise<AptInvoice[]> {
  await page.goto(`/apartments/${apartment.id}/invoice`);
  await page.getByRole('link', { name: 'Add Invoice' }).waitFor();
  await expect(page.getByText(/Showing \d+ to \d+ of \d+ entries|No records? found/i).first()).toBeVisible({ timeout: 30_000 });
  await page.waitForLoadState('networkidle');
  const rows = await page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row').evaluateAll(rs => rs.map(r => ({
    cells: [...r.querySelectorAll('td')].map(c => (c.textContent ?? '').replace(/\s+/g, ' ').trim()),
    href: r.querySelector('a[href^="/invoices/"]')?.getAttribute('href') ?? ''
  })));
  const list: AptInvoice[] = [];
  for (const r of rows.filter(x => x.href && x.cells.length > 5)) {
    const id = r.href.match(/\/invoices\/(\d+)/)![1];
    list.push({ id, code: r.cells[0], category: r.cells[2], date: parseDmy(r.cells[4]), total: 0n });
  }
  for (const inv of list) {
    await page.goto(`/invoices/${inv.id}`);
    const heading = page.getByRole('heading', { name: /^Total:/ });
    await heading.waitFor();
    // The heading shows "Total: 0.00" until the invoice has loaded: wait for its number, then a non-zero total.
    await page.getByText(new RegExp(`^#${inv.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)).first().waitFor();
    await expect.poll(async () => cents(await heading.innerText()), { message: `${inv.code}: total loaded`, timeout: 30_000 }).not.toBe(0n);
    inv.total = cents(await heading.innerText());
  }
  return list;
}

/** The one invoice of `category` that was not in `before`. */
export async function newInvoice(page: Page, apartment: Pick<Apartment, 'id'>, before: AptInvoice[], category: string): Promise<AptInvoice> {
  const all = await readInvoices(page, apartment);
  const fresh = all.filter(i => i.category === category && !before.some(b => b.code === i.code));
  expect(fresh, `one new ${category} invoice on the apartment (all: ${all.map(i => `${i.code} ${i.category}`).join(', ')})`).toHaveLength(1);
  return fresh[0];
}

/**
 * Make Payment with Payment Method = Wallet, each given invoice ticked "pay in full". Returns the amount the form
 * put in each invoice's Pay box (cents), keyed by invoice code. Lands on the apartment's S.O.A.
 */
export async function payByWallet(page: Page, apartment: Pick<Apartment, 'id'>, codes: string[]): Promise<Record<string, bigint>> {
  const form = new MakePaymentPage(page);
  await page.goto(`/apartments/${apartment.id}/make-payment`);
  await form.waitLoaded();
  await form.chooseLocation('MO - CL');
  await form.chooseMethod('Wallet');
  const paid: Record<string, bigint> = {};
  for (const code of codes) {
    await form.payInFull(code);
    const box = form.invoiceRow(code).getByRole('textbox');
    await expect(box).not.toHaveValue(/^(0\.00 Ks)?$/);
    paid[code] = cents(await box.inputValue());
  }
  await form.remark.fill(uniqueName('WP'));
  await form.confirmButton.click();
  await expect(page).toHaveURL(new RegExp(`/apartments/${apartment.id}/soa$`), { timeout: 30_000 });
  return paid;
}

/** UO › Import with the apartment's row only (all four items 0 → `units`, reading date today). */
export async function importUo(page: Page, apartment: Pick<Apartment, 'name' | 'zone' | 'building'>, units: number, dir: (name: string) => string): Promise<void> {
  const importPage = new ImportPage(page, 'uo');
  await importPage.goto();
  const template = parseCsv(await importPage.downloadTemplate(apartment.zone, apartment.building, dir('uo-template.csv')));
  expect(template.some(r => r[0] === apartment.name), `${apartment.name} in the UO template`).toBe(true);
  const file = dir('uo-import.csv');
  await writeFile(file, toCsv([template[0], [apartment.name, dmy(today()), units, units, units, units]]));
  await importPage.upload(file);
  await expect(importPage.result, 'UO import result').toContainText('1 UO Entry imported', { timeout: 60_000 });
}

/** A UO draft (readings 0 → `units`), approved with the draft list's Bulk Approve. */
export async function bulkApproveUo(page: Page, apartment: Pick<Apartment, 'name'>, units: number): Promise<void> {
  const r = { previous: 0, current: units };
  await createUoDraft(page, apartment, { 'Electricity (YESC)': r, 'Electricity (Generator)': r, 'Treated Water': r, 'Raw Water': r });
  const drafts = new UoDraftsPage(page);
  await drafts.goto();
  await showAllRows(page);
  await bulkApprove(page, [drafts.row(apartment.name)], toast(page, /success/i));
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Funding Received (RV) into `account` dated `day` (default today). → { payer } */
export async function createFundingReceivedOn(page: Page, account: Pick<CashAccount, 'name'>, amount: number, day?: Day): Promise<{ payer: string }> {
  const payer = uniqueName('Payer');
  await page.goto('/inter-company');
  await page.getByPlaceholder('Payer Name').fill(payer);
  if (day) {
    await pickDay(page, page.getByRole('button', { name: 'Choose Date' }).first(), day);
    await expect(page.locator('.p-calendar input').first()).toHaveValue(dmy(day).replaceAll('/', '-'));
  }
  await typeAmount(page, page.getByPlaceholder('Amount'), amount);
  await pickItem(page, formField(page, 'Category*').getByRole('combobox'), /\S/);
  await pickItem(page, formField(page, 'Deposit*').getByRole('combobox'), new RegExp(`\\] ${esc(account.name)}$`), account.name);
  await pickItem(page, formField(page, 'Location*').getByRole('combobox'), /\S/);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(toast(page, /Cash Receipt has been created successfully/)).toBeVisible();
  return { payer };
}

/** Edit Initial Balance page (/initial-balance/:id/edit): types the amount, Update; returns the toast text. */
export async function editInitialBalance(page: Page, accountId: string, amount: number): Promise<string> {
  await page.goto(`/initial-balance/${accountId}/edit`);
  const box = page.locator('#initial_balance');
  await box.waitFor();
  await page.waitForLoadState('networkidle');
  await typeAmount(page, box, amount);
  await page.getByRole('button', { name: 'Update' }).click();
  const t = toast(page);
  await expect(t).toBeVisible({ timeout: 30_000 });
  return (await t.innerText()).replace(/\s+/g, ' ').trim();
}
