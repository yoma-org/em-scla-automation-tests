// Apartment Wallet and Deposit OB/CB (features/balances/20-wallet-ob-cb.md, 21-deposit-ob-cb.md).
// Each test creates its own apartment and cash account, records one RV today and checks the ledger:
// RV row (date, number), running balance, "Current Balance" header, next month's Opening Balance.
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { expectSameAmount, notChecked, runningBalanceErrors } from '@helpers/balanceChecks';
import { createApartment, createCashAccount } from '@data/builders';
import { addDeposit, rechargeWallet } from '@data/balances';
import { dmy, month, today } from '@pages/balances/money';
import type { ApartmentLedgerPage } from '@pages/balances/ApartmentLedgerPage';
import type { Page } from '@playwright/test';

// Wallet / Deposit columns: Date · Description · DR (+) · CR (−) · Balance
const DR = 2, CR = 3;
const mm = (x: { y: number; m: number }) => `${String(x.m).padStart(2, '0')}/${x.y}`;

async function checkLedger(page: Page, ledger: ApartmentLedgerPage, id: string, amount: number, rvLabel: RegExp, header: RegExp) {
  const rows = await ledger.rows();
  const rv = rows.find(r => rvLabel.test(r.cells[1]));
  await test.step('RV date and number', async () => {
    expect(rv, `RV row in the ${ledger.ledger} (rows: ${rows.map(r => r.text).join(' / ')})`).toBeTruthy();
    expect.soft(rv!.date, 'RV date').toBe(dmy(today()));
    expect.soft(rv!.cells[1], 'RV number').toMatch(/^RV-\d+ /);
    expect.soft(rv!.cells[DR], 'DR amount').toBe(`${amount.toLocaleString('en-US')}.00 Ks`);
  });
  let closing = 0n;
  await test.step('Balance calculation', async () => {
    for (const e of runningBalanceErrors(rows, DR, CR)) expect.soft(e, 'running balance').toBe('');
    closing = rows[rows.length - 1].balance;
    expectSameAmount(closing, (await ledger.openingBalance()) + BigInt(amount * 100), 'closing = opening + RV');
    await expect.soft(ledger.currentBalance, 'Current Balance header').toHaveText(header);
    expectSameAmount(await ledger.currentBalanceCents(), closing, '"Current Balance" = closing balance');
  });
  await test.step('Opening Balance of the following month = closing balance of the transaction month', async () => {
    const next = month(1);
    await ledger.selectMonth(next.y, next.m);
    await evidence(page, `${id}_next-month`);
    expectSameAmount(await ledger.openingBalance(), closing, `Opening Balance 01/${mm(next)} = closing balance of ${mm(month())}`);
  });
}

test.describe('Wallet & Deposit OB/CB', () => {
  test('OB-WAL-001 [base] Wallet OB/CB continuity after wallet recharge RV (current date) — by source',
    testCase({ id: 'OB-WAL-001', source: 'Wallet - OB & CB r3', priority: 'P1', smoke: true, critical: true }),
    async ({ page, walletLedgerPage: wallet }) => {
      test.setTimeout(240_000);
      notChecked('Apartment Wallet PDF', 'PDF content is not parsed (no PDF reader in the framework)');
      notChecked('API › Wallet by Apartment / Wallet PDF', 'tests assert on screens; Old EM API responses are AES-encrypted');
      notChecked('Variants 2-6 (unknown RV conversions, overflow)', 'smoke runs the base row (manual recharge) only');
      const account = await createCashAccount(page);
      const apartment = await createApartment(page);
      await rechargeWallet(page, apartment, account, 300);
      await wallet.goto(apartment.id);
      await evidence(page, 'OB-WAL-001_wallet');
      await checkLedger(page, wallet, 'OB-WAL-001', 300, /\( Wallet Cash Received \)/, /^MMK Wallet Current Balance: 300\.00 Ks$/);
    });

  test('OB-DEP-001 [base] Deposit OB/CB continuity after current-date add deposit (RV) — by source',
    testCase({ id: 'OB-DEP-001', source: 'Deposit - OB & CB r3', priority: 'P1', smoke: true, critical: true }),
    async ({ page, depositLedgerPage: deposit }) => {
      test.setTimeout(240_000);
      notChecked('Apartment Deposit PDF', 'PDF content is not parsed (no PDF reader in the framework)');
      notChecked('API › Deposit by Apartment / Deposit PDF', 'tests assert on screens; Old EM API responses are AES-encrypted');
      notChecked('Variants 2-5 (unknown RV conversions, overflow)', 'smoke runs the base row (manual add deposit) only');
      const account = await createCashAccount(page);
      const apartment = await createApartment(page);
      await addDeposit(page, apartment, account, 400);
      await deposit.goto(apartment.id);
      await evidence(page, 'OB-DEP-001_deposit');
      await checkLedger(page, deposit, 'OB-DEP-001', 400, /\( Deposit Received \)/, /^MMK Deposit Current Balance: 400\.00 Ks$/);
    });
});
