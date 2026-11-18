// src/helpers/soaPeriods.ts — expected SOA balances computed from the apartment's own documents, compared with
// what the apartment's S.O.A tab shows: month by month (Opening Balance, every row, closing balance of each
// transaction day, closing balance of the month, "Balance Due", next month's Opening Balance) and in
// "All History" mode. Used by tests/issues/soa-balances.spec.ts ("SOA periodic balances are wrong").
//
// The test lists its documents as SoaTxn (invoices add, payments subtract). Expected figures:
//   Opening Balance of month M = Σ signed amounts dated before 01/M
//   closing of day D           = Opening Balance + Σ signed amounts of the month dated ≤ D
//   closing of month M         = Opening Balance + Σ signed amounts of the month = Opening Balance of M+1
// Day closings do not depend on the order of same-day rows; the row-by-row arithmetic is checked separately.
import { expect, test, type Page } from '@playwright/test';
import { evidence } from '@helpers/evidence';
import { expectSameAmount, runningBalanceErrors } from '@helpers/balanceChecks';
import type { ApartmentLedgerPage, LedgerRow } from '@pages/balances/ApartmentLedgerPage';
import { cents, dmy, fmt, month } from '@pages/balances/money';
import type { Day } from '@data/soa-issues';

// SOA columns: Date · Transactions · Details · Amount (+) · Payments (−) · Balance
export const AMOUNT = 3, PAYMENTS = 4;

export interface SoaTxn {
  /** For messages, e.g. "Inv-202611-00032 (Utilities, back-dated)". */
  label: string;
  kind: 'Invoice' | 'Debit Note' | 'Payment Received';
  date: Day;
  /** Matches the row's Details cell, e.g. /^Inv-202611-00032\b/ or /^WP-\d+.*Inv-202611-00032/. */
  details: RegExp;
  /** Positive amount in cents (Amount column for invoices, Payments column for payments). */
  amount: bigint;
}

const signed = (t: SoaTxn) => (t.kind === 'Payment Received' ? -t.amount : t.amount);
const key = (d: { y: number; m: number; d?: number }) => d.y * 10_000 + d.m * 100 + (d.d ?? 0);
const mm = (x: { y: number; m: number }) => `${String(x.m).padStart(2, '0')}/${x.y}`;
const total = (txns: SoaTxn[]) => txns.reduce((a, t) => a + signed(t), 0n);

/** Expected opening balance of month (y, m). */
export function expectedOpening(txns: SoaTxn[], y: number, m: number): bigint {
  return total(txns.filter(t => key(t.date) < key({ y, m, d: 1 })));
}

function rowListing(rows: LedgerRow[]): string {
  return rows.map(r => r.text).join(' / ');
}

/**
 * Compares a list of SOA rows (Opening Balance row first, when `opening` is given) with the expected documents.
 * `label` names the view in messages ("SOA 10/2026", "All History").
 */
async function compareRows(page: Page, shot: string, label: string, rows: LedgerRow[], expectedTx: SoaTxn[], opening: bigint): Promise<void> {
  const body = rows.filter(r => !/Opening Balance/.test(r.text));
  const problems: string[] = [];
  const used = new Set<LedgerRow>();
  for (const t of expectedTx) {
    const row = body.find(r => !used.has(r) && r.cells[1] === t.kind && t.details.test(r.cells[2] ?? ''));
    if (!row) { problems.push(`${t.label}: no "${t.kind}" row matching ${t.details}`); continue; }
    used.add(row);
    if (row.date !== dmy(t.date)) problems.push(`${t.label}: date ${dmy(t.date)} expected, shown ${row.date}`);
    const col = t.kind === 'Payment Received' ? PAYMENTS : AMOUNT;
    const shown = row.cells[col] ? cents(row.cells[col]) : 0n;
    if (shown !== t.amount) problems.push(`${t.label}: amount ${fmt(t.amount)} expected, shown ${row.cells[col] || '(empty)'}`);
  }
  for (const r of body.filter(r => !used.has(r))) problems.push(`unexpected row "${r.text}"`);
  // Rows in date order.
  const dates = body.map(r => r.date.split('/').reverse().join(''));
  for (let i = 1; i < dates.length; i++) if (dates[i] < dates[i - 1]) problems.push(`rows not in date order: ${body[i - 1].date} before ${body[i].date}`);
  const arithmetic = runningBalanceErrors(rows, AMOUNT, PAYMENTS);

  // Closing balance of each transaction day (last row of that date).
  const dayProblems: string[] = [];
  const days = [...new Set(expectedTx.map(t => dmy(t.date)))];
  for (const d of days) {
    const exp = opening + total(expectedTx.filter(t => key(t.date) <= key(dayOf(d))));
    const last = [...body].reverse().find(r => r.date === d);
    if (!last) dayProblems.push(`closing balance of ${d}: ${fmt(exp)} expected, no row on that day`);
    else if (last.balance !== exp) dayProblems.push(`closing balance of ${d}: ${fmt(exp)} expected, shown ${fmt(last.balance)}`);
  }
  if (problems.length || arithmetic.length || dayProblems.length) await evidence(page, `${shot}_rows`);
  expect.soft(problems, `${label}: rows = our documents (shown: ${rowListing(rows)})`).toEqual([]);
  expect.soft(arithmetic, `${label}: running balance = previous balance + Amount − Payments`).toEqual([]);
  expect.soft(dayProblems, `${label}: closing balance of each transaction day`).toEqual([]);
}

function dayOf(dmyText: string): Day {
  const [d, m, y] = dmyText.split('/').map(Number);
  return { y, m, d };
}

/** Selects a month and waits until its figures have loaded (they show 0.00 before). */
async function showMonth(page: Page, soa: ApartmentLedgerPage, y: number, m: number): Promise<void> {
  if ((await soa.monthValue()) === mm({ y, m })) return;
  const loaded = page.waitForResponse(r => /statement-of-account/.test(r.url()) && r.url().includes(`month=${m}&year=${y}`), { timeout: 60_000 });
  await soa.selectMonth(y, m);
  await loaded;
  await page.waitForLoadState('networkidle');
}

export interface MonthResult { opening: bigint; closing: bigint }

/** One month of the SOA against the expected documents. Returns the opening / closing balances shown. */
export async function checkSoaMonth(page: Page, soa: ApartmentLedgerPage, txns: SoaTxn[], y: number, m: number, shot: string): Promise<MonthResult> {
  await showMonth(page, soa, y, m);
  await evidence(page, shot);
  const label = `SOA ${mm({ y, m })}`;
  const rows = (await soa.rows()).filter(r => !/^Balance Due/.test(r.date));
  const openingRow = rows.find(r => /Opening Balance/.test(r.text));
  expect(openingRow, `${label}: Opening Balance row (rows: ${rowListing(rows)})`).toBeTruthy();
  const expOpening = expectedOpening(txns, y, m);
  expectSameAmount(openingRow!.balance, expOpening, `${label}: Opening Balance 01/${mm({ y, m })} (Σ our documents before the month)`);
  const monthTx = txns.filter(t => t.date.y === y && t.date.m === m);
  await compareRows(page, shot, label, rows, monthTx, expOpening);
  const expClosing = expOpening + total(monthTx);
  const closing = rows[rows.length - 1].balance;
  expectSameAmount(closing, expClosing, `${label}: closing balance of the month (last running balance)`);
  const due = (await soa.balanceDue.count()) ? cents(await soa.balanceDue.innerText()) : undefined;
  expect.soft(due === undefined ? '(no Balance Due row)' : fmt(due), `${label}: "Balance Due" = closing balance of the month`).toBe(fmt(expClosing));
  return { opening: openingRow!.balance, closing };
}

/**
 * Every month from the first document's month to the current one, then the next month's Opening Balance; then the
 * header "MMK Current Balance" and the All History view. `id` prefixes the evidence names.
 */
export async function checkSoaPeriods(page: Page, soa: ApartmentLedgerPage, apartmentId: string, txns: SoaTxn[], id: string): Promise<void> {
  await soa.goto(apartmentId);
  await page.waitForLoadState('networkidle');
  const now = month();
  const first = txns.reduce((a, t) => (key(t.date) < key(a) ? { y: t.date.y, m: t.date.m } : a), now);
  test.info().annotations.push({ type: 'expected', description: txns.map(t => `${dmy(t.date)} ${t.kind} ${t.label} ${t.kind === 'Payment Received' ? '−' : '+'}${fmt(t.amount)}`).join('; ') });

  const results: { y: number; m: number; r: MonthResult }[] = [];
  for (let i = (first.y - now.y) * 12 + (first.m - now.m); i <= 1; i++) {
    const p = month(i);
    await test.step(`SOA ${mm(p)}: Opening Balance, rows, day and month closing balances`, async () => {
      if (i === 1) {
        // The month after the current one: only its Opening Balance is checked.
        await showMonth(page, soa, p.y, p.m);
        await evidence(page, `${id}_soa-${p.y}-${String(p.m).padStart(2, '0')}`);
        const opening = await soa.openingBalance();
        expectSameAmount(opening, total(txns), `SOA ${mm(p)}: Opening Balance (Σ all our documents)`);
        results.push({ ...p, r: { opening, closing: opening } });
      } else {
        results.push({ ...p, r: await checkSoaMonth(page, soa, txns, p.y, p.m, `${id}_soa-${p.y}-${String(p.m).padStart(2, '0')}`) });
      }
    });
  }
  await test.step('Closing balance of each month = Opening Balance of the following month (as shown)', async () => {
    for (let i = 1; i < results.length; i++) {
      expectSameAmount(results[i].r.opening, results[i - 1].r.closing, `Opening Balance 01/${mm(results[i])} = closing balance of ${mm(results[i - 1])}`);
    }
  });

  await test.step('Current month: header "MMK Current Balance" = outstanding (Σ our documents)', async () => {
    await showMonth(page, soa, now.y, now.m);
    const outstanding = total(txns);
    if (await soa.currentBalance.count()) expectSameAmount(await soa.currentBalanceCents(), outstanding, '"MMK Current Balance"');
    else {
      if (outstanding !== 0n) await evidence(page, `${id}_no-current-balance`);
      expect.soft(fmt(0n), `"MMK Current Balance" header not shown although ${fmt(outstanding)} is outstanding`).toBe(fmt(outstanding));
    }
  });

  await test.step('All History: every document, running balance, closing balance of each day, final balance', async () => {
    const loaded = page.waitForResponse(r => /statement-of-account/.test(r.url()) && /all_history=true/.test(r.url()), { timeout: 60_000 });
    await page.locator('.p-inputswitch').first().click();
    await loaded;
    await page.waitForLoadState('networkidle');
    await evidence(page, `${id}_soa-all-history`);
    const rows = (await soa.rows()).filter(r => !/^Balance Due/.test(r.date));
    test.info().annotations.push({ type: 'all history rows', description: rowListing(rows) });
    const openingRow = rows.find(r => /Opening Balance/.test(r.text));
    if (openingRow) expectSameAmount(openingRow.balance, 0n, 'All History: Opening Balance (nothing before the first document)');
    await compareRows(page, `${id}_soa-all-history`, 'All History', rows, txns, 0n);
    expectSameAmount(rows[rows.length - 1].balance, total(txns), 'All History: final balance (Σ our documents)');
    const due = (await soa.balanceDue.count()) ? fmt(cents(await soa.balanceDue.innerText())) : '(no Balance Due row)';
    expect.soft(due, 'All History: "Balance Due" = Σ our documents').toBe(fmt(total(txns)));
  });
}
