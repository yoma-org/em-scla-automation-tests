// Reported Old EM Account Statement issues (features/balances/22-account-statement-ob-cb.md), run on Old EM:
//   OB-ACS-005  cash transfer JV today — "error when Cash Transfer is the first transaction of the day"
//   OB-ACS-006  back-dated cash transfer JV — "Balance issue: backdated transaction"
// Each test transfers between two NEW cash accounts of its own: "from" (initial balance 10,000) and "to" (initial
// balance 0, so the JV is its first transaction of the day — and ever). Both statements are checked: the statement
// opens, JV date / number / amount, running balance, closing = "Balance (Closing Balance)" in Cash & Bank Account,
// and day continuity (closing of a day = Opening Balance of the next) from the day before the JV to tomorrow.
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import type { Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { uniqueName } from '@helpers/names';
import { caseIssue, checkDayContinuity, expectSameAmount, notChecked, runningBalanceErrors } from '@helpers/balanceChecks';
import { toast } from '@components/Toast';
import { createCashAccount, type CashAccount } from '@data/builders';
import { pickDay } from '@data/balances';
import { cents, dmy, fmt, today, ymd } from '@pages/balances/money';
import { CashTransferDraftsPage, CashTransferPage } from '@pages/cash/CashTransferPage';
import { approveDraft } from '@pages/wallet/common';
import type { AccountStatementPage } from '@pages/balances/AccountStatementPage';
import type { CashBankAccountsPage } from '@pages/cash-bank-accounts/CashBankAccountsPage';

// Statement columns: Date · Description · DR (+) · CR (−) · Balance
const DR = 2, CR = 3;
const INITIAL = 10_000;
const AMOUNT = 3_000;
type Day = { y: number; m: number; d: number };

interface Variant { label: string; source: string; direction: 'in' | 'out' }
const VARIANTS: Record<'OB-ACS-005' | 'OB-ACS-006', Variant[]> = {
  'OB-ACS-005': [
    { label: 'base', source: 'Acc Statement - OB & CB r27', direction: 'in' },
    { label: 'Type=Create Cash Transfer JV (Cash Out); Date=Current date; Time=first/mid/last of day', source: 'Acc Statement - OB & CB r28', direction: 'out' }
  ],
  'OB-ACS-006': [
    { label: 'base', source: 'Acc Statement - OB & CB r30', direction: 'in' },
    { label: 'Type=Create Cash Transfer JV (Cash Out); Date=Back date; Time=first/mid/last of day', source: 'Acc Statement - OB & CB r31', direction: 'out' }
  ]
};
const TITLE = {
  'OB-ACS-005': 'Account statement OB/CB continuity after cash transfer JV (current date) — in/out',
  'OB-ACS-006': 'Account statement OB/CB continuity after back-dated cash transfer JV — in/out'
};
const ISSUE = {
  'OB-ACS-005': 'Account Statement: error when Cash Transfer is the first transaction of the day (code fixed, data not corrected)',
  'OB-ACS-006': 'Balance issue: backdated transaction'
};

const addDays = (d: Day, n: number): Day => {
  const x = new Date(Date.UTC(d.y, d.m - 1, d.d + n));
  return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate() };
};

/** Opens the statement by URL; a soft failure (with evidence) when Old EM shows an error instead of the table. */
async function openStatement(page: Page, acs: AccountStatementPage, id: string, label: string, account: CashAccount, from: Day, to: Day): Promise<boolean> {
  await page.goto(`/reports/account-statements/${account.id}/${ymd(from)}/${ymd(to)}`);
  const opened = acs.openingRow().first();
  const error = toast(page, /error|wrong|fail/i);
  await expect(opened.or(error).first()).toBeVisible({ timeout: 45_000 }).catch(() => {});
  const ok = await opened.isVisible();
  const errText = (await error.count()) ? (await error.innerText()).trim() : '';
  if (!ok || errText) {
    await evidence(page, `${id}_${label}-statement-error`);
    expect.soft(`${ok ? 'table shown' : 'no statement table'}${errText ? `; message "${errText}"` : ''}`,
      `${label}: Account Statement ${dmy(from)} - ${dmy(to)} opens without error`).toBe('table shown');
  }
  return ok;
}

async function checkAccount(page: Page, id: string, acs: AccountStatementPage, list: CashBankAccountsPage,
  side: { label: string; account: CashAccount; column: number; final: number; jv: string; jvDay: Day; description: string }) {
  const { label, account, column, jvDay } = side;
  const days: Day[] = [];
  for (let d = addDays(jvDay, -1); ymd(d) <= ymd(today(1)); d = addDays(d, 1)) days.push(d);

  await test.step(`${label}: statement of the JV date ${dmy(jvDay)} opens; JV date, number and amount`, async () => {
    if (!(await openStatement(page, acs, id, `${label}-jv-day`, account, jvDay, jvDay))) return;
    await evidence(page, `${id}_${label}-jv-day`);
    const rows = await acs.rows();
    const shown = rows.map(r => r.text).join(' / ');
    const jvRows = rows.filter(r => /^JV-\d+/.test(r.description));
    expect.soft(jvRows.length, `${label}: one JV line on ${dmy(jvDay)}; rows: ${shown}`).toBe(1);
    const r = jvRows[0];
    if (r) {
      expect.soft(r.date, `${label}: JV date`).toBe(dmy(jvDay));
      expect.soft(r.description, `${label}: JV number (Recent Transfers ${side.jv})`).toMatch(new RegExp(`^${side.jv}\\b`));
      expect.soft(r.text.split(' | ')[column], `${label}: JV amount in ${column === DR ? 'DR' : 'CR'}`).toBe(`${AMOUNT.toLocaleString('en-US')}.00 Ks`);
    }
    for (const e of runningBalanceErrors(rows.map(x => ({ cells: x.text.split(' | '), balance: x.balance })), DR, CR)) expect.soft(e, `${label}: running balance`).toBe('');
  });

  await test.step(`${label}: closing balance (${dmy(days[0])} - ${dmy(today())}) = Cash & Bank Account balance = ${side.final}`, async () => {
    if (!(await openStatement(page, acs, id, `${label}-range`, account, days[0], today()))) return;
    await evidence(page, `${id}_${label}-range`);
    const rows = await acs.rows();
    for (const e of runningBalanceErrors(rows.map(x => ({ cells: x.text.split(' | '), balance: x.balance })), DR, CR)) expect.soft(e, `${label}: running balance`).toBe('');
    const closing = rows[rows.length - 1].balance;
    expectSameAmount(closing, BigInt(side.final * 100), `${label}: statement closing balance (initial ± JV)`);
    await list.goto();
    await expect(async () => {
      await list.search.fill('');
      await list.search.fill(account.name);
      await expect(list.row(account.name)).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: 45_000 });
    await evidence(page, `${id}_${label}-cash-bank-account`);
    expectSameAmount(cents((await list.closingBalance(account.name).innerText()).split(':').pop()), closing, `${label}: Cash & Bank Account "Balance (Closing Balance)" = statement closing`);
  });

  await test.step(`${label}: Opening Balance of each following day = closing balance of the day before (${dmy(days[0])} → ${dmy(days[days.length - 1])})`, async () => {
    // checkDayContinuity waits for the table; if a day errors, report it here instead of timing out.
    for (const d of days) if (!(await openStatement(page, acs, id, `${label}-${ymd(d)}`, account, d, d))) return;
    const closings = await checkDayContinuity(acs, account.id, days);
    await evidence(page, `${id}_${label}-tomorrow`);
    expectSameAmount(closings[closings.length - 1], BigInt(side.final * 100), `${label}: closing balance of tomorrow = account balance`);
    test.info().annotations.push({ type: 'daily closings', description: `${label}: ${days.map((d, i) => `${dmy(d)} ${fmt(closings[i])}`).join(', ')}` });
  });
}

for (const id of ['OB-ACS-005', 'OB-ACS-006'] as const) {
  test.describe(`Reported Account Statement issues · ${id}`, () => {
    for (const v of VARIANTS[id]) {
      test(`${id} [${v.label}] ${TITLE[id]}`,
        testCase({ id, source: v.source, priority: 'P1', critical: true }),
        async ({ page, accountStatementPage: acs, cashBankAccountsPage: list }) => {
          test.setTimeout(600_000);
          test.info().annotations.push({ type: 'reported issue', description: ISSUE[id] });
          notChecked('Account Statement PDF / Excel', 'file content is not parsed (no PDF / Excel reader in the framework)');
          notChecked('Test way: first / mid / last time of the day', 'a test cannot choose the time of day it runs');
          const backDated = id === 'OB-ACS-006';
          const jvDay = backDated ? today(-3) : today();
          test.info().annotations.push({ type: 'test data', description: `JV of ${AMOUNT.toLocaleString('en-US')} Ks dated ${dmy(jvDay)}${backDated ? ' (3 days back)' : ''} between two new cash accounts; the case's subject is the ${v.direction === 'in' ? 'receiving ("to", cash in)' : 'sending ("from", cash out)'} account, both are checked` });
          caseIssue('"to" (initial balance 0) gets the JV as its first transaction of the day and ever; "from" has its "(Initial Balance)" of 10,000 dated today, so for it the JV is the first transaction only when back-dated');

          const from = await test.step('Precondition: our cash account "from" with 10,000 Ks', () => createCashAccount(page, { name: uniqueName('Cash From'), initialBalance: INITIAL }));
          const to = await test.step('Precondition: our new cash account "to" (initial 0)', () => createCashAccount(page, { name: uniqueName('Cash To') }));
          const description = uniqueName('JV');

          const form = new CashTransferPage(page);
          const drafts = new CashTransferDraftsPage(page);
          await test.step(`Cash Transfer ${AMOUNT} Ks dated ${dmy(jvDay)}`, async () => {
            await form.goto();
            if (backDated) {
              await pickDay(page, page.getByRole('button', { name: 'Choose Date' }), jvDay);
            }
            await expect(form.date).toHaveValue(dmy(jvDay).replaceAll('/', '-'));
            await form.fill({ from: from.name, to: to.name, amount: AMOUNT, description });
            await form.submitButton.click();
            await expect(toast(page, /success/i)).toBeVisible();
          });

          await test.step('Approve the JV draft (top-bar JV › Manage › Approve)', async () => {
            caseIssue('Old EM saves the JV as a draft; it is approved (admin) before the statement checks, as only approved transfers post');
            await drafts.goto();
            const row = await drafts.find(description);
            await expect(row, `Draft: Cash Transfer row "${description}"`).toHaveCount(1);
            await drafts.openApprove(row);
            await approveDraft(page);
            await expect(toast(page, /approv|success/i)).toBeVisible();
          });

          let jv = '';
          await test.step('JV number and date in Recent Transfers', async () => {
            await form.goto();
            const row = form.recentRow(description);
            await expect(row).toHaveCount(1);
            jv = (await row.getByRole('cell').nth(0).innerText()).trim();
            expect(jv).toMatch(/^JV-\d+$/);
            await expect.soft(row.getByRole('cell').nth(1), 'Recent Transfers: JV date').toHaveText(dmy(jvDay));
          });

          const sides = [
            { label: 'to', account: to, column: DR, final: AMOUNT },
            { label: 'from', account: from, column: CR, final: INITIAL - AMOUNT }
          ];
          if (v.direction === 'out') sides.reverse();
          for (const s of sides) await checkAccount(page, `${id}_cash-${v.direction}`, acs, list, { ...s, jv, jvDay, description });
        });
    }
  });
}
