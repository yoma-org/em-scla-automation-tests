// Account Statement OB/CB (features/balances/22-account-statement-ob-cb.md). Each test creates its own cash
// account (initial balance 10,000), records one RV / PV today and checks the statement: row date and
// number, running balance, closing = the account's "Balance (Closing Balance)" in Cash & Bank Account,
// and day continuity yesterday → today → tomorrow (closing of a day = Opening Balance of the next).
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { checkDayContinuity, expectSameAmount, notChecked, runningBalanceErrors } from '@helpers/balanceChecks';
import { createCashAccount, type CashAccount } from '@data/builders';
import { createCashOutflow, createFundingReceived } from '@data/balances';
import { cents, dmy, today, ymd } from '@pages/balances/money';
import type { AccountStatementPage } from '@pages/balances/AccountStatementPage';
import type { CashBankAccountsPage } from '@pages/cash-bank-accounts/CashBankAccountsPage';
import type { Page } from '@playwright/test';

// Statement columns: Date · Description · DR (+) · CR (−) · Balance
const DR = 2, CR = 3;
const INITIAL = 10_000;

function acsNotChecked() {
  notChecked('Account Statement PDF / Excel', 'file content is not parsed (no PDF / Excel reader in the framework)');
  notChecked('Test way: first / mid / last time of the day', 'a test cannot choose the time of day it runs');
}

async function checkStatement(page: Page, id: string, acs: AccountStatementPage, list: CashBankAccountsPage, account: CashAccount,
  row: { label: RegExp; number: RegExp; column: number; amount: number }) {
  const t = today();
  await acs.open(account.id, ymd(t), ymd(t));
  await evidence(page, `${id}_statement-today`);
  const rows = await acs.rows();
  const r = rows.find(x => row.label.test(x.description));
  await test.step('Transaction date and number', async () => {
    expect(r, `transaction row in the statement (rows: ${rows.map(x => x.text).join(' / ')})`).toBeTruthy();
    expect.soft(r!.date, 'transaction date').toBe(dmy(t));
    expect.soft(r!.description, 'voucher number').toMatch(row.number);
    expect.soft(r!.text.split(' | ')[row.column], 'amount').toBe(`${row.amount.toLocaleString('en-US')}.00 Ks`);
  });
  let closing = 0n;
  await test.step('Balance calculation', async () => {
    for (const e of runningBalanceErrors(rows.map(x => ({ cells: x.text.split(' | '), balance: x.balance })), DR, CR)) expect.soft(e, 'running balance').toBe('');
    closing = rows[rows.length - 1].balance;
    const signed = BigInt(row.amount * 100) * (row.column === DR ? 1n : -1n);
    expectSameAmount(closing, BigInt(INITIAL * 100) + signed, `closing = initial balance ${INITIAL} ${row.column === DR ? '+' : '−'} ${row.amount}`);
  });
  await test.step('Balance in Cash & Bank Account = statement closing balance', async () => {
    await list.goto();
    await list.search.fill(account.name);
    await expect(list.row(account.name)).toBeVisible();
    await evidence(page, `${id}_cash-bank-account`);
    expectSameAmount(cents((await list.closingBalance(account.name).innerText()).split(':').pop()), closing, 'Cash & Bank Account "Balance (Closing Balance)" = statement closing');
  });
  await test.step('Opening Balance of the following day = closing balance of the transaction date (and yesterday → today)', async () => {
    const days = [today(-1), t, today(1)];
    const closings = await checkDayContinuity(acs, account.id, days);
    await evidence(page, `${id}_statement-tomorrow`);
    expectSameAmount(closings[1], closing, 'single-day statement closing = statement closing');
  });
}

test.describe('Account Statement OB/CB', () => {
  test('OB-ACS-001 [base] Account statement OB/CB continuity after cash received RV (current date) — by RV type',
    testCase({ id: 'OB-ACS-001', source: 'Acc Statement - OB & CB r3', priority: 'P1', smoke: true, critical: true }),
    async ({ page, accountStatementPage: acs, cashBankAccountsPage: list }) => {
      test.setTimeout(240_000);
      acsNotChecked();
      notChecked('Variants 2-9 (unknown received, assign, wallet, deposit, payment, SCLA)', 'smoke runs the base row (Funding Received) only');
      const account = await createCashAccount(page, { initialBalance: INITIAL });
      await createFundingReceived(page, account, 600);
      await checkStatement(page, 'OB-ACS-001', acs, list, account, { label: /^RV-\d+/, number: /^RV-\d+ \(/, column: DR, amount: 600 });
    });

  test('OB-ACS-003 [base] Account statement OB/CB continuity after cash outflow PV (current date) — by PV type',
    testCase({ id: 'OB-ACS-003', source: 'Acc Statement - OB & CB r19', priority: 'P1', smoke: true, critical: true }),
    async ({ page, accountStatementPage: acs, cashBankAccountsPage: list }) => {
      test.setTimeout(240_000);
      acsNotChecked();
      notChecked('Variants 2-3 (wallet refund, deposit withdraw)', 'smoke runs the base row (Cash Outflow) only');
      const account = await createCashAccount(page, { initialBalance: INITIAL });
      const pv = await createCashOutflow(page, account, 200);
      await checkStatement(page, 'OB-ACS-003', acs, list, account,
        { label: new RegExp(`\\(${pv.description}\\)$`), number: /^PV-\d+ \(/, column: CR, amount: 200 });
    });
});
