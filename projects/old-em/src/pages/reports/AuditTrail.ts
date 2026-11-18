// src/pages/reports/AuditTrail.ts — reading "Created By" / "Approved By" wherever Old EM shows them (RPT-036).
//
// Where the names are (Old EM UAT, 2026-11-12):
//   Lists     Invoices - Debit Note (/invoices): Created By only · Recent Receipts: Created By · Unknown Received
//             Allocation: Created By · Recent Outflows (/cash-outflows): Created By + Approved By · Recent Transfers
//             (/cash-transfers): Created By only · apartment Wallet / Deposit tab: ledger without any user column.
//   Detail    Invoice / DN (/invoices/:id): header text "Created By: … Approved By: …".
//             RV (/cash-received/:id), PV (/cash-outflows/:id), JV (/cash-transfers/:id), CN
//             (/reports/credit-notes/:id): read-only form WITHOUT the names, plus a [Voucher] button that opens the
//             voucher (HTML, signed /api/pdf/:id URL) in a new tab: "… Created by <name>. Approved by <name>.".
//   Reports   Invoices · Cash Received (/reports/cash-receipts) · Cash Outflow (/reports/cash-outflow) ·
//             Transactions (/reports/cash-transfers; wallet transfers only with Transaction Type = Wallet
//             Transfer, two rows Out / In) · Credit Note (/reports/credit-notes): columns
//             Created By + Approved By; expanding a row shows a Manage link to the document detail.
//             Newest first; no keyword search: rows are found by their code across pages of 100.
import { expect, type Locator, type Page } from '@playwright/test';
import { findOnPages, waitIdle } from '@pages/collection/common';
import { chooseOption } from '@components/PrimeSelect';
import { pdfText } from '@helpers/pdfText';

/** What one screen shows: undefined = the screen has no such column / field at all. */
export interface AuditFields {
  created?: string;
  approved?: string;
}

/** Header → cell text of a table row (expandable tables have an empty first header for the toggle). */
export async function rowFields(row: Locator): Promise<Record<string, string>> {
  const table = row.locator('xpath=ancestor::table[1]');
  const headers = (await table.getByRole('columnheader').allInnerTexts()).map(t => t.trim());
  const cells = (await row.getByRole('cell').allInnerTexts()).map(t => t.trim());
  return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
}

export function auditOf(fields: Record<string, string>): AuditFields {
  return {
    created: 'Created By' in fields ? fields['Created By'] : undefined,
    approved: 'Approved By' in fields ? fields['Approved By'] : undefined
  };
}

/** "… Created By: A Approved By: B Issue Date …" (invoice / debit note header) or a voucher's "Created by A." */
export function auditInText(text: string): AuditFields {
  const t = text.replace(/\s+/g, ' ');
  const created = t.match(/Created [Bb]y:?\s*(.*?)\s*(?:\.\s|\.$|Approved [Bb]y|Issue Date|$)/);
  const approved = t.match(/Approved [Bb]y:?\s*(.*?)\s*(?:\.\s|\.$|Issue Date|Printed|$)/);
  return { created: created ? created[1] : undefined, approved: approved ? approved[1] : undefined };
}

/**
 * Clicks [Voucher] and returns its text, plus the voucher tab when it is an HTML page (caller closes it).
 * RV / PV / JV / WT vouchers are HTML pages (signed /api/pdf/:id); the credit note voucher is a real PDF
 * (/api/pdf/credit-note/:id, shown as a blob): its text is read from the response with pdfText().
 */
export async function voucherText(page: Page): Promise<{ text: string; popup: Page; pdf: boolean }> {
  const button = page.getByRole('button', { name: 'Voucher' });
  await button.waitFor();
  const voucher = page.context().waitForEvent('response', { predicate: r => /\/api\/pdf\//.test(r.url()), timeout: 60_000 });
  const [popup] = await Promise.all([page.context().waitForEvent('page', { timeout: 30_000 }), button.click()]);
  const response = await voucher;
  if (/pdf/.test(response.headers()['content-type'] ?? '')) {
    // The app fetches the PDF as a blob: Playwright gets an empty body, so fetch it again with the same headers.
    const headers = Object.fromEntries(Object.entries(await response.request().allHeaders()).filter(([k]) => !k.startsWith(':')));
    const again = await page.request.get(response.url(), { headers });
    return { text: pdfText(await again.body()), popup, pdf: true };
  }
  await popup.waitForLoadState('domcontentloaded', { timeout: 30_000 }).catch(() => {});
  await popup.getByText(/Created by/i).first().waitFor({ timeout: 30_000 }).catch(() => {});
  const text = await popup.locator('body').innerText({ timeout: 30_000 });
  return { text, popup, pdf: false };
}

/** Display name of a staff user (Settings › Staff, searched by e-mail). */
export async function staffName(page: Page, email: string): Promise<string> {
  await page.goto('/settings/staffs');
  const search = page.getByRole('textbox', { name: 'Keyword Search' });
  await search.waitFor();
  const row = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row').filter({ hasText: email });
  // The list sometimes ignores a keyword typed while it loads: type again, reloading now and then.
  let tries = 0;
  await expect(async () => {
    if (++tries % 3 === 0) { await page.reload(); await search.waitFor(); }
    await search.fill('');
    await search.fill(email);
    await expect(row.first()).toBeVisible({ timeout: 8_000 });
  }).toPass({ timeout: 90_000 });
  const f = await rowFields(row.first());
  const name = f['Name'] ?? f['Full Name'] ?? Object.values(f).find(v => v && v !== email);
  if (!name) throw new Error(`No name for ${email}`);
  // The Name cell holds the name and, under it, the e-mail.
  return name.split('\n')[0].trim();
}

export const REPORTS = {
  invoices: { path: '/reports/invoices', label: 'Reports › Invoices' },
  cashReceived: { path: '/reports/cash-receipts', label: 'Reports › Cash Received' },
  cashOutflow: { path: '/reports/cash-outflow', label: 'Reports › Cash Outflow' },
  transactions: { path: '/reports/cash-transfers', label: 'Reports › Transactions' },
  creditNote: { path: '/reports/credit-notes', label: 'Reports › Credit Note' }
} as const;
export type ReportKey = keyof typeof REPORTS;

/**
 * Report row of a document code ("PV-100299"), searched on up to 5 pages of 100 (newest first).
 * Returns its fields and the Manage link of its expansion (the document detail), or undefined.
 */
export async function reportRow(page: Page, report: ReportKey, code: string, transactionType?: string): Promise<{ row: Locator; fields?: Record<string, string>; manage?: string }> {
  await page.goto(REPORTS[report].path);
  const rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  await rows.first().waitFor({ timeout: 30_000 });
  await waitIdle(page);
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  // Transactions report: wallet transfers are listed only with Transaction Type = Wallet Transfer.
  if (transactionType) {
    await chooseOption(page, page.getByRole('combobox', { name: 'Transaction Type' }), transactionType);
    await waitIdle(page);
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await expect(rows.filter({ hasText: code }).first()).toBeVisible({ timeout: 20_000 }).catch(() => {});
  }
  const row = await findOnPages(page, rows.filter({ has: page.getByRole('cell', { name: code, exact: true }) }), 5);
  if (!(await row.count())) return { row };
  const fields = await rowFields(row.first());
  let manage: string | undefined;
  const toggle = row.first().getByRole('button', { name: 'Row Collapsed' });
  if (await toggle.count()) {
    await toggle.click();
    const link = row.first().locator('xpath=following-sibling::tr[1]').locator('a[href]').last();
    if (await link.waitFor({ timeout: 5_000 }).then(() => true, () => false)) manage = (await link.getAttribute('href')) ?? undefined;
  }
  return { row: row.first(), fields, manage };
}
