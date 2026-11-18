// src/helpers/balanceChecks.ts — shared checks for ledgers (SOA, wallet, deposit, account statement).
import { expect, test } from '@playwright/test';
import { cents, dmy, fmt, ymd } from '@pages/balances/money';

/**
 * Rows whose running balance is not previous balance + plus − minus. `cells` are the row's cell texts,
 * `plus` / `minus` the indexes of the increasing / decreasing amount columns, the balance is the last cell.
 * The first row (Opening Balance) only sets the start. Returns readable differences ([] when all add up).
 */
export function runningBalanceErrors(rows: { cells: string[]; balance: bigint }[], plus: number, minus: number): string[] {
  const errors: string[] = [];
  for (let i = 1; i < rows.length; i++) {
    const c = rows[i].cells;
    const add = c[plus] ? cents(c[plus]) : 0n;
    const sub = c[minus] ? cents(c[minus]) : 0n;
    const expected = rows[i - 1].balance + add - sub;
    if (expected !== rows[i].balance) {
      errors.push(`row "${c.join(' | ')}": expected balance ${fmt(rows[i - 1].balance)} + ${fmt(add)} − ${fmt(sub)} = ${fmt(expected)}, shown ${fmt(rows[i].balance)}`);
    }
  }
  return errors;
}

export function notChecked(area: string, why: string): void {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

export function caseIssue(description: string): void {
  test.info().annotations.push({ type: 'case issue', description });
}

/**
 * Soft-asserts two amounts are equal. UAT holds absurd figures (AR ≈ 1.15 × 10^17 Ks) that Old EM sums as
 * floating point, so above ~10^13 Ks the last digits are rounding noise: there a difference of up to one
 * part in 10^15 is accepted. Below that, amounts must match to the cent. Messages show formatted amounts.
 */
export function expectSameAmount(actual: bigint, expected: bigint, message: string): void {
  const diff = actual > expected ? actual - expected : expected - actual;
  const big = (actual > expected ? actual : expected);
  const noise = (big < 0n ? -big : big) / 1_000_000_000_000_000n;
  if (diff !== 0n && diff <= noise) {
    test.info().annotations.push({ type: 'float noise', description: `${message}: ${fmt(actual)} vs ${fmt(expected)} (accepted, beyond float precision)` });
    return;
  }
  expect.soft(fmt(actual), message).toBe(fmt(expected));
}

/**
 * Account Statement day continuity: for each day and the next, closing balance of the day's statement =
 * Opening Balance of the next day's statement. Statements are opened by URL (/reports/account-statements/
 * :id/:from/:to), which also allows tomorrow (the picker does not). Returns the closing balance of each day.
 */
export async function checkDayContinuity(
  statement: { open(id: string, from: string, to: string): Promise<void>; openingBalance(): Promise<bigint>; closingBalance(): Promise<bigint> },
  accountId: string, days: { y: number; m: number; d: number }[]
): Promise<bigint[]> {
  const closings: bigint[] = [];
  for (let i = 0; i < days.length; i++) {
    await statement.open(accountId, ymd(days[i]), ymd(days[i]));
    const opening = await statement.openingBalance();
    if (i > 0) expectSameAmount(opening, closings[i - 1], `Opening Balance ${dmy(days[i])} = closing balance ${dmy(days[i - 1])}`);
    closings.push(await statement.closingBalance());
  }
  return closings;
}
