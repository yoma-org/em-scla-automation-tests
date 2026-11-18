// Reports › Account Statement (../em/docs/test-cases/features/18-reports.md).
// RPT-001 reads the Cash & Bank summary: it checks the figures add up and that our own new cash and bank
// accounts appear under In HAND / In BANK with their balances (shared totals move while others work).
// RPT-006 views the statement of our own account through the filter and checks day continuity.
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { checkDayContinuity, expectSameAmount, notChecked, runningBalanceErrors } from '@helpers/balanceChecks';
import { createCashAccount } from '@data/builders';
import { createCashOutflow, createFundingReceived } from '@data/balances';
import { dmy, fmt, sum, today } from '@pages/balances/money';

test.describe('Reports · Account Statement', () => {
  test('RPT-001 [base] Account Statement shows total cash in hand and bank — by currency',
    testCase({ id: 'RPT-001', source: 'TC_AccountStatement_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, accountStatementPage: acs }) => {
      test.setTimeout(240_000);
      notChecked('Variant 2 (other currency)', 'smoke runs the base row (MMK) only');
      const cash = await createCashAccount(page, { initialBalance: 12_345 });
      const bank = await createCashAccount(page, { type: 'BANK', initialBalance: 23_456 });

      await page.goto('/');
      await acs.openFromMenu();
      const currencies = await acs.summary.read();
      await evidence(page, 'RPT-001_cash-bank-balance');
      const mmk = currencies.find(c => c.currency === 'MMK');

      await test.step('Expected 1: total MMK amount', async () => {
        expect(mmk, `MMK card (seen: ${currencies.map(c => c.currency).join(', ')})`).toBeTruthy();
        await expect(acs.summary.card('MMK').locator('h5 + p')).toHaveText(/^-?[\d,]+\.\d{2} Ks$/);
        expectSameAmount(mmk!.total, sum(mmk!.groups.map(g => g.total)), `MMK total = Σ account types (${mmk!.groups.map(g => `${g.type} ${g.totalText}`).join(' + ')})`);
      });

      await test.step('Expected 2: total cash in hand', async () => {
        const hand = mmk!.groups.find(g => g.type === 'In HAND');
        expect(hand, `In HAND group (groups: ${mmk!.groups.map(g => g.type).join(', ')})`).toBeTruthy();
        expectSameAmount(hand!.total, sum(hand!.lines.filter(l => l.level === 'account').map(l => l.amount)), 'In HAND = Σ its cash accounts');
        const ours = hand!.lines.find(l => l.name === cash.name);
        expect.soft(ours ? fmt(ours.amount) : 'not listed', `our cash account ${cash.name} under In HAND`).toBe('12,345.00');
      });

      await test.step('Expected 3: total in bank accounts', async () => {
        const inBank = mmk!.groups.find(g => g.type === 'In BANK');
        expect(inBank, `In BANK group (groups: ${mmk!.groups.map(g => g.type).join(', ')})`).toBeTruthy();
        const banks = inBank!.lines.filter(l => l.level === 'bank');
        expectSameAmount(inBank!.total, sum(banks.map(l => l.amount)), 'In BANK = Σ banks');
        // Each bank = Σ the accounts listed under it.
        let current: { name: string; amount: bigint; accounts: bigint[] } | undefined;
        const perBank: { name: string; amount: bigint; accounts: bigint[] }[] = [];
        for (const l of inBank!.lines) {
          if (l.level === 'bank') perBank.push(current = { name: l.name, amount: l.amount, accounts: [] });
          else current?.accounts.push(l.amount);
        }
        for (const b of perBank) expectSameAmount(b.amount, sum(b.accounts), `In BANK › ${b.name} = Σ its accounts`);
        const ours = inBank!.lines.find(l => l.level === 'account' && l.name.startsWith(bank.name));
        expect.soft(ours ? fmt(ours.amount) : 'not listed', `our bank account ${bank.name} under In BANK`).toBe('23,456.00');
      });
    });

  test('RPT-006 Account statement history: day opening balance equals previous closing balance',
    testCase({ id: 'RPT-006', source: 'TC_AccountStatement_009', priority: 'P1', smoke: true, critical: true }),
    async ({ page, accountStatementPage: acs }) => {
      test.setTimeout(300_000);
      const account = await createCashAccount(page, { initialBalance: 10_000 });
      await createFundingReceived(page, account, 600);
      const pv = await createCashOutflow(page, account, 200);
      const from = today(-1), to = today();

      await test.step('1-3. Account Statement › account › from / to › View Statement', async () => {
        await page.goto('/');
        await acs.openFromMenu();
        await acs.chooseAccount(account.name);
        await acs.pickRange(from, to);
        await acs.view();
        await expect.soft(acs.period, 'statement period').toHaveText(`Account Statement for ${dmy(from)} - ${dmy(to)}`);
        await evidence(page, 'RPT-006_statement');
      });

      await test.step('Expected 1: complete history with income, expense and balance', async () => {
        const rows = await acs.rows();
        const all = rows.map(r => r.text).join(' / ');
        expect.soft(rows.some(r => /Initial Balance/.test(r.description) && r.dr === '10,000.00 Ks'), `initial balance row (rows: ${all})`).toBe(true);
        expect.soft(rows.some(r => /^RV-\d+/.test(r.description) && r.dr === '600.00 Ks'), `income RV 600 (rows: ${all})`).toBe(true);
        expect.soft(rows.some(r => r.description.includes(pv.description) && r.cr === '200.00 Ks'), `expense PV 200 (rows: ${all})`).toBe(true);
        for (const e of runningBalanceErrors(rows.map(r => ({ cells: r.text.split(' | '), balance: r.balance })), 2, 3)) expect.soft(e, 'running balance').toBe('');
        expectSameAmount(await acs.closingBalance(), 1_040_000n, 'closing balance = 10,000 + 600 − 200');
      });

      await test.step('Expected 2: opening balance of the next day = closing balance of the previous day', async () => {
        await checkDayContinuity(acs, account.id, [from, to, today(1)]);
        await evidence(page, 'RPT-006_statement-next-day');
      });
    });
});
