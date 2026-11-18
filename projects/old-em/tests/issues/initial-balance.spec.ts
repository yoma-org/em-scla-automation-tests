// Reported issue "Balance issue: initial balance edit" — CBA-009 / CBA-010 (../em/docs/test-cases/features/
// 15-cash-bank-account.md) on Old EM. Each test creates its own cash account (initial balance 10,000), edits the
// initial balance to the case's 50,000 and checks the Cash & Bank Account list, the Account Statement's
// "Cash & Bank Balance" line of the account, and the statement's Opening / Closing Balance of past days, today and
// tomorrow. Expected figures come from the account's own transactions: the initial balance is dated the day the
// account was created (today), a back-dated receipt on its own date.
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { expectSameAmount, notChecked, runningBalanceErrors } from '@helpers/balanceChecks';
import { createCashAccount, type CashAccount } from '@data/builders';
import { createCashOutflow } from '@data/balances';
import { createFundingReceivedOn, editInitialBalance, type Day } from '@data/soa-issues';
import { cents, dmy, fmt, today, ymd } from '@pages/balances/money';
import type { AccountStatementPage } from '@pages/balances/AccountStatementPage';
import type { CashBankAccountsPage } from '@pages/cash-bank-accounts/CashBankAccountsPage';
import type { Page } from '@playwright/test';

const ISSUE = 'Balance issue: initial balance edit';
const INITIAL = 10_000;
const EDITED = 50_000; // case test data: Initial Balance = "50000MMK"
const UPDATED_TOAST = 'Account has been successfully updated';
// Statement columns: Date · Description · DR (+) · CR (−) · Balance
const DR = 2, CR = 3;

interface CashTx { label: string; date: Day; amount: bigint /* signed cents */; description: RegExp }

const key = (d: Day) => d.y * 10_000 + d.m * 100 + d.d;
const sumUpTo = (txs: CashTx[], d: Day) => txs.filter(t => key(t.date) <= key(d)).reduce((a, t) => a + t.amount, 0n);
const sumBefore = (txs: CashTx[], d: Day) => txs.filter(t => key(t.date) < key(d)).reduce((a, t) => a + t.amount, 0n);

function common() {
  test.info().annotations.push({ type: 'reported issue', description: ISSUE });
  notChecked('Dashboard - Cash & Bank Balance / Total per Bank / per Payment Type', 'shared UAT totals change with other testers\' work, and the Dashboard shows banks and payment types, not single accounts: our account is checked in the Account Statement\'s Cash & Bank Balance instead');
  notChecked('Account Statement PDF / Excel', 'file content is not parsed');
}

async function listBalances(page: Page, list: CashBankAccountsPage, account: CashAccount) {
  await list.goto();
  await page.waitForLoadState('networkidle');
  await expect(async () => {
    await list.search.fill('');
    await list.search.fill(account.name);
    await expect(list.row(account.name)).toBeVisible({ timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
  return {
    initial: cents((await list.initialBalance(account.name).innerText()).split(':').pop()),
    closing: cents((await list.closingBalance(account.name).innerText()).split(':').pop())
  };
}

/** Steps 1-5: list › our account › Edit Initial Balance › amount › Update; Expected 1 (toast). */
async function editFromList(page: Page, list: CashBankAccountsPage, account: CashAccount, id: string) {
  await test.step('1-2. Cash and Bank Account list › our account', async () => {
    await listBalances(page, list, account);
  });
  await test.step('3. Edit Initial Balance', async () => {
    await list.row(account.name).getByText('Edit Initial Balance').click();
    await expect(page).toHaveURL(new RegExp(`/initial-balance/${account.id}/edit$`));
  });
  await test.step(`4-5. Initial Balance ${EDITED.toLocaleString('en-US')} › Update → Expected 1: "${UPDATED_TOAST}"`, async () => {
    // The case writes the message without the full stop Old EM puts at the end.
    const shown = (await editInitialBalance(page, account.id, EDITED)).replace(/\.$/, '');
    if (shown !== UPDATED_TOAST) await evidence(page, `${id}_update-toast`);
    expect.soft(shown, `toast after Update: expected "${UPDATED_TOAST}", shown "${shown}"`).toBe(UPDATED_TOAST);
  });
}

/** Expected 2 + check areas: list, Cash & Bank Balance line, statement of each day / the period. */
async function checkAfterEdit(page: Page, id: string, account: CashAccount, txs: CashTx[], days: Day[],
  list: CashBankAccountsPage, acs: AccountStatementPage) {
  const t = today();
  const final = sumUpTo(txs, t);

  await test.step(`Expected 2: list shows Initial Balance ${EDITED.toLocaleString('en-US')} and Closing Balance ${fmt(final)}`, async () => {
    const shown = await listBalances(page, list, account);
    await evidence(page, `${id}_list-after-edit`);
    expectSameAmount(shown.initial, BigInt(EDITED * 100), 'Cash & Bank Account list: "Initial Balance"');
    expectSameAmount(shown.closing, final, 'Cash & Bank Account list: "Balance (Closing Balance)" = new initial balance + transactions');
  });

  await test.step('Report › Account Statement: "Cash & Bank Balance" line of our account', async () => {
    await acs.goto();
    await page.waitForLoadState('networkidle');
    const lines = (await acs.summary.read()).flatMap(c => c.groups.flatMap(g => g.lines)).filter(l => l.name.includes(account.name));
    await evidence(page, `${id}_cash-bank-balance`);
    expect.soft(lines.map(l => fmt(l.amount)), `Account Statement › Cash & Bank Balance: line "${account.name}"`).toEqual([fmt(final)]);
  });

  await test.step('Report › Account Statement detail: Opening / Closing Balance of every day (past days, today, tomorrow)', async () => {
    let previousClosing: bigint | undefined;
    for (const d of days) {
      await acs.open(account.id, ymd(d), ymd(d));
      await page.waitForLoadState('networkidle');
      const rows = await acs.rows();
      const opening = rows[0].balance;
      const closing = rows[rows.length - 1].balance;
      const expOpening = sumBefore(txs, d);
      const expClosing = sumUpTo(txs, d);
      const ok = opening === expOpening && closing === expClosing && (previousClosing === undefined || opening === previousClosing);
      await evidence(page, `${id}_statement-${ymd(d)}${ok ? '' : '_diff'}`);
      expectSameAmount(opening, expOpening, `Statement ${dmy(d)}: Opening Balance`);
      expectSameAmount(closing, expClosing, `Statement ${dmy(d)}: closing balance`);
      if (previousClosing !== undefined) expectSameAmount(opening, previousClosing, `Statement ${dmy(d)}: Opening Balance = closing balance of the day before (as shown)`);
      for (const e of runningBalanceErrors(rows.map(r => ({ cells: r.text.split(' | '), balance: r.balance })), DR, CR)) expect.soft(e, `Statement ${dmy(d)}: running balance`).toBe('');
      const expectedRows = txs.filter(x => key(x.date) === key(d));
      for (const x of expectedRows) {
        const r = rows.find(row => x.description.test(row.description));
        const cell = r ? (x.amount > 0n ? r.dr : r.cr) : '';
        expect.soft(r ? (/\d/.test(cell) ? fmt(cents(cell)) : `(empty ${x.amount > 0n ? 'DR' : 'CR'})`) : '(no row)', `Statement ${dmy(d)}: ${x.label} row (rows: ${rows.map(r => r.text).join(' / ')})`).toBe(fmt(x.amount < 0n ? -x.amount : x.amount));
      }
      previousClosing = closing;
    }
  });

  await test.step(`Account Statement for the whole period ${dmy(days[0])} - ${dmy(t)}: closing = Cash & Bank Account closing`, async () => {
    await acs.open(account.id, ymd(days[0]), ymd(t));
    await page.waitForLoadState('networkidle');
    await evidence(page, `${id}_statement-period`);
    const rows = await acs.rows();
    expectSameAmount(rows[0].balance, sumBefore(txs, days[0]), `Statement ${dmy(days[0])}-${dmy(t)}: Opening Balance`);
    expectSameAmount(rows[rows.length - 1].balance, final, `Statement ${dmy(days[0])}-${dmy(t)}: closing balance`);
    for (const e of runningBalanceErrors(rows.map(r => ({ cells: r.text.split(' | '), balance: r.balance })), DR, CR)) expect.soft(e, 'period statement: running balance').toBe('');
  });
}

test.describe('Reported issue: initial balance edit (Cash & Bank Account)', () => {
  test('CBA-009 Edit initial balance before transactions; closing balance recalculated',
    testCase({ id: 'CBA-009', source: 'TC_Cash_Bank_Acc_014', priority: 'P1', critical: true }),
    async ({ page, cashBankAccountsPage: list, accountStatementPage: acs }) => {
      test.setTimeout(300_000);
      common();
      notChecked('Check area 3 (transactions earlier / same day / after the account create date)', 'this case is "before transactions": the account has none; CBA-010 covers them');
      const account = await test.step(`Precondition: own cash account, initial balance ${INITIAL.toLocaleString('en-US')}, no transactions`, () =>
        createCashAccount(page, { initialBalance: INITIAL }));
      const before = await listBalances(page, list, account);
      expectSameAmount(before.closing, BigInt(INITIAL * 100), 'before the edit: Closing Balance = initial balance');

      await editFromList(page, list, account, 'CBA-009');
      const t = today();
      const txs: CashTx[] = [{ label: '(Initial Balance)', date: t, amount: BigInt(EDITED * 100), description: /Initial Balance/ }];
      await checkAfterEdit(page, 'CBA-009', account, txs, [today(-1), t, today(1)], list, acs);
    });

  test('CBA-010 Edit initial balance after transactions; closing balance recalculated',
    testCase({ id: 'CBA-010', source: 'TC_Cash_Bank_Acc_015', priority: 'P1', critical: true }),
    async ({ page, cashBankAccountsPage: list, accountStatementPage: acs }) => {
      test.setTimeout(420_000);
      common();
      notChecked('Transactions dated after the account create date', 'the account is created today and Old EM does not allow future dates: "after" = later the same day');
      const t = today();
      const back = today(-3);
      const account = await test.step(`Precondition: own cash account, initial balance ${INITIAL.toLocaleString('en-US')}`, () =>
        createCashAccount(page, { initialBalance: INITIAL }));
      await test.step(`Precondition: Funding Received 600 back-dated ${dmy(back)} (before the account create date)`, () =>
        createFundingReceivedOn(page, account, 600, back));
      await test.step('Precondition: Funding Received 700 today (same date as the account create date)', () =>
        createFundingReceivedOn(page, account, 700));
      const pv = await test.step('Precondition: Cash Outflow 200 today, approved', () => createCashOutflow(page, account, 200));

      const tx = (initial: number): CashTx[] => [
        { label: 'RV 600 (back-dated)', date: back, amount: 60_000n, description: /^RV-\d+/ },
        { label: '(Initial Balance)', date: t, amount: BigInt(initial * 100), description: /Initial Balance/ },
        { label: 'RV 700', date: t, amount: 70_000n, description: /^RV-\d+/ },
        { label: `PV 200 (${pv.description})`, date: t, amount: -20_000n, description: /^PV-\d+/ }
      ];
      await test.step('Before the edit: Closing Balance = 10,000 + 600 + 700 − 200 = 11,100', async () => {
        const before = await listBalances(page, list, account);
        await evidence(page, 'CBA-010_list-before-edit');
        expectSameAmount(before.closing, sumUpTo(tx(INITIAL), t), 'before the edit: list Closing Balance');
      });

      await editFromList(page, list, account, 'CBA-010');
      const days = [today(-4), back, today(-2), today(-1), t, today(1)];
      await checkAfterEdit(page, 'CBA-010', account, tx(EDITED), days, list, acs);
    });
});
