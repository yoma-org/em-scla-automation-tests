// Apartment Statement of Account: APT-021 (features/08-apartments.md) and the SOA OB/CB matrix
// (features/balances/19-soa-ob-cb.md). Each test creates its own apartment, so the SOA holds only our rows.
// "Closing balance" = the last running balance of a month (the "Balance Due" footer); "opening balance" =
// the month's first row "01/mm/yyyy Opening Balance". The next month is selectable in the month picker.
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { expectSameAmount, notChecked, runningBalanceErrors } from '@helpers/balanceChecks';
import { createApartment, createCashAccount } from '@data/builders';
import { createInvoice, makePayment, type Invoice } from '@data/balances';
import { cents, dmy, fmt, month, today } from '@pages/balances/money';
import type { ApartmentLedgerPage } from '@pages/balances/ApartmentLedgerPage';
import type { Page } from '@playwright/test';

const mm = (x: { y: number; m: number }) => `${String(x.m).padStart(2, '0')}/${x.y}`;
// SOA columns: Date · Transactions · Details · Amount (+) · Payments (−) · Balance
const AMOUNT = 3, PAYMENTS = 4;

function soaNotChecked() {
  notChecked('Apartment SOA PDF / Bulk SOA PDF', 'PDF content is not parsed (no PDF reader in the framework)');
  notChecked('API › Apartment › SOA by Apartment / PDF Printouts', 'tests assert on screens; Old EM API responses are AES-encrypted');
}

/** SOA of this month: running balance, Balance Due = closing, header "Current Balance" = closing. */
async function checkMonth(soa: ApartmentLedgerPage, label: string) {
  const rows = await soa.rows();
  for (const e of runningBalanceErrors(rows, AMOUNT, PAYMENTS)) expect.soft(e, `${label}: running balance`).toBe('');
  const closing = rows[rows.length - 1].balance;
  expectSameAmount(cents(await soa.balanceDue.innerText()), closing, `${label}: "Balance Due" = last running balance`);
  return closing;
}

/** Closing balance of this month = Opening Balance of the next month (picked in the month picker). */
async function checkNextMonth(page: Page, soa: ApartmentLedgerPage, closing: bigint, shot: string) {
  const next = month(1);
  await soa.selectMonth(next.y, next.m);
  await evidence(page, shot);
  expectSameAmount(await soa.openingBalance(), closing, `Opening Balance 01/${mm(next)} = closing balance of ${mm(month())}`);
}

test.describe('Apartment SOA', () => {
  test('APT-021 [base] Apartment monthly SOA lists transactions and OB = previous month CB — by currency',
    testCase({ id: 'APT-021', source: 'TC_Apart:SOA_002', priority: 'P1', smoke: true, critical: true }),
    async ({ page, soaPage: soa, apartmentsListPage }) => {
      test.setTimeout(360_000);
      notChecked('Variant 2 (USD SOA)', 'smoke runs the base row (MMK) only');
      const prev = month(-1);
      let backdated!: Invoice, inv!: Invoice, dn!: Invoice;
      let apartment!: Awaited<ReturnType<typeof createApartment>>;
      const paid = 500;
      await test.step('Preconditions: apartment with last-month invoice, this month invoice, debit note and payment', async () => {
        const account = await createCashAccount(page);
        apartment = await createApartment(page);
        backdated = await createInvoice(page, apartment, { price: 2000, date: { y: prev.y, m: prev.m, d: 5 } });
        inv = await createInvoice(page, apartment, { price: 1000 });
        dn = await createInvoice(page, apartment, { kind: 'debit-note', price: 300 });
        await makePayment(page, apartment, account, paid); // allocated to the oldest invoice (last month's)
      });

      await test.step('1-3. Apartments › the apartment › S.O.A', async () => {
        await apartmentsListPage.goto();
        await apartmentsListPage.show(apartment.zone, apartment.building, apartment.name);
        await apartmentsListPage.nameLink(apartment.name).click();
        await page.getByRole('link', { name: /S\.O\.A/ }).first().click();
        await expect(page).toHaveURL(new RegExp(`/apartments/${apartment.id}/soa$`));
        await soa.openingRow().waitFor();
      });

      await test.step('4-5. MMK and this month are selected', async () => {
        await expect.soft(soa.currency, 'balance type').toHaveText('MMK');
        expect.soft(await soa.monthValue(), 'month').toBe(mm(month()));
      });

      const rows = await soa.rows();
      await evidence(page, 'APT-021_soa-this-month');
      await test.step('Expected 1-2: this month\'s MMK SOA lists our invoice, debit note and payment', async () => {
        for (const r of rows) expect.soft(r.date.slice(3), `row "${r.text}" is in ${mm(month())}`).toBe(mm(month()));
        const has = (re: RegExp, what: string) => expect.soft(rows.some(r => re.test(r.text)), `${what} in this month's SOA (rows: ${rows.map(r => r.text).join(' / ')})`).toBe(true);
        has(new RegExp(`^${dmy(today())} \\| Invoice \\| ${inv.code}\\b`), `Invoice ${inv.code}`);
        has(new RegExp(`^${dmy(today())} \\| Debit Note \\| ${dn.code}\\b`), `Debit Note ${dn.code}`);
        has(new RegExp(`^${dmy(today())} \\| Payment Received \\| RV-\\d+ .*${backdated.code}`), `Payment (RV) for ${backdated.code}`);
      });

      await test.step('Expected 3: Opening Balance of this month = closing balance of last month', async () => {
        const opening = await soa.openingBalance();
        await soa.selectMonth(prev.y, prev.m);
        await evidence(page, 'APT-021_soa-last-month');
        const lastClosing = await checkMonth(soa, mm(prev));
        expectSameAmount(lastClosing, backdated.total, `closing ${mm(prev)} = last month's invoice ${backdated.code}`);
        expectSameAmount(opening, lastClosing, `Opening Balance 01/${mm(month())} = closing balance of ${mm(prev)}`);
      });

      await test.step('Expected 3: Opening Balance of next month = closing balance of this month', async () => {
        await soa.selectMonth(month().y, month().m);
        const closing = await checkMonth(soa, mm(month()));
        expectSameAmount(closing, backdated.total + inv.total + dn.total - BigInt(paid * 100), 'this month closing = all invoices − payment');
        await checkNextMonth(page, soa, closing, 'APT-021_soa-next-month');
      });
    });

  test('OB-SOA-001 [base] SOA OB/CB continuity after current-date invoice — by category',
    testCase({ id: 'OB-SOA-001', source: 'SOA - OB & CB r3', priority: 'P1', smoke: true, critical: true }),
    async ({ page, soaPage: soa }) => {
      test.setTimeout(240_000);
      soaNotChecked();
      notChecked('Variants 2-3 (Utilities, Estate Mgmt Fees)', 'smoke runs the base row (normal invoice) only');
      const apartment = await createApartment(page);
      const inv = await createInvoice(page, apartment, { price: 1000, category: 'Maintenance Services' });

      await soa.goto(apartment.id);
      await evidence(page, 'OB-SOA-001_soa');
      const rows = await soa.rows();
      const row = rows.find(r => r.cells[2]?.startsWith(inv.code));
      await test.step('Invoice date and number', async () => {
        expect(row, `${inv.code} in the SOA (rows: ${rows.map(r => r.text).join(' / ')})`).toBeTruthy();
        expect.soft(row!.date, 'invoice row date').toBe(dmy(today()));
        expect.soft(row!.cells[1], 'transaction type').toBe('Invoice');
        await expect.soft(soa.table.getByRole('link', { name: inv.code, exact: true }), 'invoice number links to the invoice').toHaveAttribute('href', inv.url);
        expect.soft(row!.cells[AMOUNT], 'invoice amount').toBe(`${fmt(inv.total)} Ks`);
      });
      let closing = 0n;
      await test.step('Balance calculation and Balance Due', async () => {
        closing = await checkMonth(soa, mm(month()));
        expectSameAmount(closing, (await soa.openingBalance()) + inv.total, 'closing = opening + invoice');
        expectSameAmount(await soa.currentBalanceCents(), closing, '"MMK Current Balance" = SOA closing balance');
      });
      await test.step('Opening Balance of the following month = closing balance', async () => {
        await checkNextMonth(page, soa, closing, 'OB-SOA-001_soa-next-month');
      });
    });

  test('OB-SOA-007 [base] SOA OB/CB continuity after Make Payment RV — by currency × single/multiple/overflow',
    testCase({ id: 'OB-SOA-007', source: 'SOA - OB & CB r25', priority: 'P1', smoke: true, critical: true }),
    async ({ page, soaPage: soa }) => {
      test.setTimeout(300_000);
      soaNotChecked();
      notChecked('Variants 2-8 (multiple, overflow to wallet, other currency)', 'smoke runs the base row (single, same currency) only');
      const account = await createCashAccount(page);
      const apartment = await createApartment(page);
      const inv = await createInvoice(page, apartment, { price: 1000 });
      const amount = Number(inv.total) / 100;
      await makePayment(page, apartment, account, amount);

      await soa.goto(apartment.id);
      await evidence(page, 'OB-SOA-007_soa');
      const rows = await soa.rows();
      const rv = rows.find(r => r.cells[1] === 'Payment Received');
      await test.step('RV date and number', async () => {
        expect(rv, `Payment Received row in the SOA (rows: ${rows.map(r => r.text).join(' / ')})`).toBeTruthy();
        expect.soft(rv!.date, 'RV date').toBe(dmy(today()));
        expect.soft(rv!.cells[2], 'RV number and invoice paid').toMatch(new RegExp(`^RV-\\d+ .*${inv.code}`));
        expect.soft(rv!.cells[PAYMENTS], 'payment amount').toBe(`${fmt(inv.total)} Ks`);
      });
      let closing = 0n;
      await test.step('Balance calculation and Balance Due', async () => {
        closing = await checkMonth(soa, mm(month()));
        expectSameAmount(closing, 0n, 'fully paid: closing balance 0');
        // With nothing outstanding Old EM shows no "MMK Current Balance" header and the currency box reads
        // "Select Currency"; the case's check point (Balance Due on the SOA screen) is the footer, checked above.
        if (await soa.currentBalance.count()) expectSameAmount(await soa.currentBalanceCents(), closing, '"MMK Current Balance" = SOA closing balance');
        else test.info().annotations.push({ type: 'observation', description: 'Fully paid apartment: SOA shows no "MMK Current Balance" header and the currency box shows "Select Currency" (Balance Due footer shows 0.00 Ks)' });
      });
      await test.step('Opening Balance of the following month = closing balance', async () => {
        await checkNextMonth(page, soa, closing, 'OB-SOA-007_soa-next-month');
      });
    });
});
