// Accounts Receivable (../em/docs/test-cases/features/03-accounts-receivable.md). The AR totals are shared
// and move while other testers work: AR-001 checks the cards and their own arithmetic; AR-003 creates its
// own apartment and invoices (one back-dated so it is overdue) and finds them in the aging tabs.
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { expectSameAmount, notChecked } from '@helpers/balanceChecks';
import { createApartment, createCashAccount } from '@data/builders';
import { createInvoice, makePayment, type Invoice } from '@data/balances';
import { AGING_CARDS } from '@pages/balances/AccountsReceivablePage';
import { dmy, fmt, sum, today } from '@pages/balances/money';

test.describe('Accounts Receivable', () => {
  test('AR-001 [base] AR page summary cards show current and total overdue amounts',
    testCase({ id: 'AR-001', source: 'TC_AR_002', priority: 'P1', smoke: true, critical: true }),
    async ({ page, arPage, dashboardWidgets }) => {
      notChecked('Variant 2 (Total overdue card on its own)', 'smoke runs the base row; the overdue card is still read for the arithmetic');
      await dashboardWidgets.goto();
      await arPage.openFromMenu();
      await expect(page.locator('.p-dropdown').filter({ hasText: /^MMK$/ }).first(), 'currency filter defaults to MMK').toBeVisible();
      await evidence(page, 'AR-001_ar-cards');

      await test.step('Expected: Current card shows the amount owed (MMK)', async () => {
        await expect(arPage.card('Current'), 'Current card amount').toHaveText(/[\d,]+\.\d{2} Ks$/);
        await expect(arPage.card('Total Amount Overdue'), 'Total Amount Overdue card amount').toHaveText(/[\d,]+\.\d{2} Ks$/);
      });

      await test.step('Header total = Current + Total Amount Overdue; Total Overdue = Σ aging buckets', async () => {
        const total = await arPage.totalCents();
        const current = await arPage.cardCents('Current');
        const overdue = await arPage.cardCents('Total Amount Overdue');
        const buckets = await Promise.all(AGING_CARDS.map(b => arPage.cardCents(b)));
        expectSameAmount(total, current + overdue, `Accounts Receivable total = Current ${fmt(current)} + Total Amount Overdue ${fmt(overdue)}`);
        expectSameAmount(overdue, sum(buckets), `Total Amount Overdue = Σ ${AGING_CARDS.map((b, i) => `${b} ${fmt(buckets[i])}`).join(' + ')}`);
      });
    });

  test('AR-003 AR list shows invoices/debit notes by aging with paid status',
    testCase({ id: 'AR-003', source: 'TC_AR_011', priority: 'P1', smoke: true, critical: true }),
    async ({ page, arPage }) => {
      test.setTimeout(360_000);
      // Our data: C (today, partly paid) → Current / Partially Paid; A (today, unpaid) → Current / Unpaid;
      // B (40 days ago, due on receipt) → 31-60 / Unpaid; D (debit note, today) → Current / Unpaid. The payment goes to the oldest open invoice, so it
      // is made before A and B exist.
      let a!: Invoice, b!: Invoice, c!: Invoice, d!: Invoice;
      const paid = 500;
      await test.step('Preconditions: apartment, invoices and a part payment of our own', async () => {
        const account = await createCashAccount(page);
        const apartment = await createApartment(page);
        c = await createInvoice(page, apartment, { price: 1000 });
        await makePayment(page, apartment, account, paid);
        a = await createInvoice(page, apartment, { price: 2000 });
        b = await createInvoice(page, apartment, { price: 3000, date: today(-40) });
        d = await createInvoice(page, apartment, { kind: 'debit-note', price: 300 });
      });

      await test.step('1. Accounts Receivable from the left menu', async () => {
        await page.goto('/');
        await arPage.openFromMenu();
      });

      const expectRow = async (tab: string, inv: Invoice, status: string, due: bigint) => {
        await arPage.openTab(tab);
        const row = await arPage.findRow(inv.code);
        expect.soft(row, `${inv.code} listed in AR tab "${tab}"`).not.toBeNull();
        if (!row) { await evidence(page, `AR-003_${tab.replace(/\W+/g, '')}-${inv.code}-missing`); return; }
        await row.scrollIntoViewIfNeeded();
        await evidence(page, `AR-003_${tab.replace(/\W+/g, '')}-${inv.code}`);
        const cells = await arPage.rowTexts(row);
        expect.soft(cells[7], `${inv.code} status in tab "${tab}"`).toBe(status);
        expect.soft(cells[4], `${inv.code} Due Amount in tab "${tab}"`).toBe(`${fmt(due)} Ks`);
      };

      await test.step('Expected 1: invoices and debit notes listed by aging category (Current / 31-60)', async () => {
        await expectRow('Current', a, 'Unpaid', a.total);
        await expectRow('Current', c, 'Partially Paid', c.total - BigInt(paid * 100));
        await expectRow('Current', d, 'Unpaid', d.total);
        await expectRow('31-60', b, 'Unpaid', b.total);
        await arPage.openTab('31-60');
        const bRow = await arPage.findRow(b.code);
        if (bRow) expect.soft((await arPage.rowTexts(bRow))[6], `${b.code} due date (40 days ago)`).toBe(dmy(today(-40)));
      });

      await test.step('Expected 2: partially paid vs fully unpaid', async () => {
        await expectRow('Unpaid', a, 'Unpaid', a.total);
        await expectRow('Unpaid', b, 'Unpaid', b.total);
        await expectRow('Partially Paid', c, 'Partially Paid', c.total - BigInt(paid * 100));
        // A partly paid invoice must not show in the Unpaid list, and vice versa.
        await arPage.openTab('Unpaid');
        expect.soft(await arPage.findRow(c.code), `${c.code} (partially paid) not in the Unpaid tab`).toBeNull();
        await arPage.openTab('Partially Paid');
        expect.soft(await arPage.findRow(a.code), `${a.code} (unpaid) not in the Partially Paid tab`).toBeNull();
      });
    });
});
