// Make Payment (../em/docs/test-cases/features/10-make-payment.md) and the apartment payment case APT-016
// (08-apartments.md). Each test pays an approved UO invoice (100 units = 10,000 Ks) on its OWN new apartment
// into its OWN cash account (QE OLD <date>-<rand> …), so every amount is exact. Payments cannot be undone:
// the data stays on UAT.
import { test } from '@fixtures/collection.fixture';
import { expect } from '@fixtures';
import { type Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { createApartment, createCashAccount, type Apartment, type CashAccount } from '@data/builders';
import { accountBalance, apartmentAr, createUnpaidInvoice, rechargeWallet, LOCATION, type UnpaidInvoice } from '@data/collection';
import { findOnPages, ks, parseAmount, waitIdle } from '@pages/collection/common';
import { ApartmentDetailPage } from '@pages/apartments/ApartmentDetailPage';
import { InvoiceDetailPage } from '@pages/invoices/InvoiceDetailPage';
import { invoiceStatusBox } from '@data/collection';

// Each case builds its own apartment / accounts / invoice through the UI first: give it room.
test.describe.configure({ timeout: 300_000 });

function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

const NOT_IN_SMOKE = 'smoke checks the Expected result; shared totals are left to the balances suite';

/** Status word in the invoice detail header "#Inv-… CoRef : … <status>". */
async function invoiceStatus(page: Page, inv: UnpaidInvoice): Promise<string> {
  const detail = new InvoiceDetailPage(page);
  await detail.goto(inv.invoiceId);
  return (await invoiceStatusBox(page, inv).innerText()).trim();
}

/** Apartment › Invoices tab row of the invoice: Due Amount and Status cells. */
async function invoicesTabRow(page: Page, apt: Apartment, inv: UnpaidInvoice) {
  const detail = new ApartmentDetailPage(page);
  await detail.gotoInvoices(apt.id);
  const row = detail.invoiceRows.filter({ hasText: inv.code });
  await expect(row).toHaveCount(1);
  const cells = row.getByRole('cell');
  return { row, due: cells.nth(5), status: cells.nth(7) };
}

async function setup(page: Page): Promise<{ apt: Apartment; acc: CashAccount; inv: UnpaidInvoice }> {
  return test.step('Precondition: our apartment with an approved unpaid UO invoice; our MMK cash account', async () => {
    const apt = await createApartment(page);
    const acc = await createCashAccount(page);
    const inv = await createUnpaidInvoice(page, apt);
    return { apt, acc, inv };
  });
}

test.describe('Make Payment · Apartment invoice', () => {
  test('PAY-001 [base] Make full payment for apartment invoice and verify SOA, RV, invoice status and AR',
    testCase({ id: 'PAY-001', source: 'TC_MPM_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, apartmentDetailPage, makePaymentPage: form, apartmentSoaPage: soa, recentReceiptsPage: receipts }) => {
      notChecked('Dashboard, Account Receivable list, Contact, Reports', NOT_IN_SMOKE);
      test.info().annotations.push({ type: 'case issue', description: 'Received In "CB Bank" is shared UAT data: paid into our own cash account (method Cash) instead' });
      const { apt, acc, inv } = await setup(page);
      const balanceBefore = await accountBalance(page, acc.name);

      await test.step('1-2. Apartment › Invoices › Make Payment', async () => {
        await apartmentDetailPage.gotoInvoices(apt.id);
        await page.getByRole('link', { name: 'Make Payment' }).click();
        await form.waitLoaded();
        await expect(form.invoiceRow(inv.code)).toBeVisible();
      });

      await test.step('3-4. Currency MMK, Location, Payment Method, Received In; received amount = invoice total', async () => {
        await expect.soft(form.currency, 'Invoice Currency Type').toHaveText('MMK');
        await form.fill({ location: LOCATION, method: 'Cash', account: acc.name, amount: inv.total });
        await expect(form.payBox(inv.code), 'Pay box filled from the received amount').toHaveValue(ks(inv.total));
      });

      await test.step('5. Confirm', async () => {
        await form.confirmButton.click();
        await soa.waitLoaded();
      });

      let rv = '';
      await test.step('Expected 1: Payment Received transaction in the apartment S.O.A', async () => {
        const row = soa.paymentRows(inv.code);
        await expect(row, `S.O.A "Payment Received" row for ${inv.code}`).toHaveCount(1);
        rv = (await row.innerText()).match(/RV-\d+/)?.[0] ?? '';
        expect.soft(rv, 'S.O.A payment row names a new RV code').toMatch(/^RV-\d+$/);
        await expect.soft(soa.paymentsCell(row), 'S.O.A Payments').toHaveText(ks(inv.total));
        await expect.soft(soa.balanceDue, 'S.O.A Balance Due').toHaveText(ks(0));
        await evidence(page, 'PAY-001_soa');
      });

      await test.step('Expected 2: the new RV in Cash Received › Recent Receipts', async () => {
        await receipts.goto();
        const row = await receipts.find(rv || `${inv.code} Payment`);
        await expect.soft(row, `${rv} in Recent Receipts`).toHaveCount(1);
        if (await row.count()) {
          const c = receipts.cells(row);
          await expect.soft(c.account).toHaveText(acc.name);
          await expect.soft(c.payer).toHaveText(apt.name);
          await expect.soft(c.amount).toHaveText(ks(inv.total));
          await row.scrollIntoViewIfNeeded();
        }
        await evidence(page, 'PAY-001_recent-receipts');
      });

      await test.step('Expected 3: invoice status Paid, AR updated', async () => {
        const status = await invoiceStatus(page, inv);
        expect.soft(status, 'Invoice detail status').toBe('Paid');
        await evidence(page, 'PAY-001_invoice');

        const tab = await invoicesTabRow(page, apt, inv);
        await expect.soft(tab.due, 'Apartment › Invoices: Due Amount').toHaveText(ks(0));
        const tabStatus = (await tab.status.innerText()).trim();
        if (!/^paid$/i.test(tabStatus)) await evidence(page, 'PAY-001_invoices-tab-status');
        expect.soft(tabStatus, `Apartment › Invoices: Status column shows "${tabStatus || '(empty)'}" for the paid invoice`).toMatch(/^paid$/i);

        expect.soft(await apartmentAr(page, apt), 'Apartment Summary: Accounts Receivable').toBe(0);
      });

      await test.step('Check area: Cash & Bank Account balance increased by the payment', async () => {
        expect.soft(await accountBalance(page, acc.name), `${acc.name} closing balance`).toBe(balanceBefore + inv.total);
      });
    });

  test('PAY-003 Make partial payment; invoice becomes Partial Paid and due/AR reduce',
    testCase({ id: 'PAY-003', source: 'TC_MPM_004', priority: 'P1', smoke: true, critical: true }),
    async ({ page, apartmentDetailPage, makePaymentPage: form, apartmentSoaPage: soa, recentReceiptsPage: receipts }) => {
      notChecked('Dashboard, Account Receivable list, Contact, Reports', NOT_IN_SMOKE);
      test.info().annotations.push({ type: 'case issue', description: 'Received In "CB Bank" is shared UAT data: paid into our own cash account (method Cash) instead' });
      const partial = 1000;
      const { apt, acc, inv } = await setup(page);
      const balanceBefore = await accountBalance(page, acc.name);

      await test.step('1-2. Apartment › Invoices › Make Payment', async () => {
        await apartmentDetailPage.gotoInvoices(apt.id);
        await page.getByRole('link', { name: 'Make Payment' }).click();
        await form.waitLoaded();
      });

      await test.step('3-4. Currency MMK, Location, Payment Method, Received In; received amount 1,000 (partial)', async () => {
        await expect.soft(form.currency, 'Invoice Currency Type').toHaveText('MMK');
        await form.fill({ location: LOCATION, method: 'Cash', account: acc.name, amount: partial });
        await expect(form.payBox(inv.code)).toHaveValue(ks(partial));
      });

      await test.step('5. Confirm', async () => {
        await form.confirmButton.click();
        await soa.waitLoaded();
      });

      let rv = '';
      await test.step('Expected 1: Payment Received transaction in the apartment S.O.A', async () => {
        const row = soa.paymentRows(inv.code);
        await expect(row).toHaveCount(1);
        rv = (await row.innerText()).match(/RV-\d+/)?.[0] ?? '';
        expect.soft(rv, 'S.O.A payment row names a new RV code').toMatch(/^RV-\d+$/);
        await expect.soft(soa.paymentsCell(row)).toHaveText(ks(partial));
        await expect.soft(soa.balanceDue, 'S.O.A Balance Due').toHaveText(ks(inv.total - partial));
        await evidence(page, 'PAY-003_soa');
      });

      await test.step('Expected 2: the new RV in Recent Receipts', async () => {
        await receipts.goto();
        const row = await receipts.find(rv || `${inv.code} Payment`);
        await expect.soft(row, `${rv} in Recent Receipts`).toHaveCount(1);
        if (await row.count()) {
          await expect.soft(receipts.cells(row).amount).toHaveText(ks(partial));
          await row.scrollIntoViewIfNeeded();
        }
        await evidence(page, 'PAY-003_recent-receipts');
      });

      await test.step('Expected 3: invoice status "Partial Paid"', async () => {
        const status = await invoiceStatus(page, inv);
        expect.soft(status, 'Invoice detail status').toMatch(/^Partial(ly)?[ _]Paid$/i);
        await evidence(page, 'PAY-003_invoice');
      });

      await test.step('Expected 4: invoice due amount and AR reduced', async () => {
        const tab = await invoicesTabRow(page, apt, inv);
        await expect.soft(tab.due, 'Apartment › Invoices: Due Amount').toHaveText(ks(inv.total - partial));
        const tabStatus = (await tab.status.innerText()).trim();
        if (!/partial/i.test(tabStatus)) await evidence(page, 'PAY-003_invoices-tab-status');
        expect.soft(tabStatus, `Apartment › Invoices: Status column shows "${tabStatus || '(empty)'}" for the partially paid invoice`).toMatch(/^Partial(ly)?[ _]Paid$/i);
        const ar = await apartmentAr(page, apt);
        if (ar !== inv.total - partial) await evidence(page, 'PAY-003_summary-ar');
        expect.soft(ar, 'Apartment Summary: Accounts Receivable').toBe(inv.total - partial);
      });

      await test.step('Check area: Cash & Bank Account balance increased by the payment', async () => {
        expect.soft(await accountBalance(page, acc.name)).toBe(balanceBefore + partial);
      });
    });

  test('PAY-005 Pay invoice from wallet balance (WP created, wallet and AR updated)',
    testCase({ id: 'PAY-005', source: 'TC_MPM_006', priority: 'P1', smoke: true, critical: true }),
    async ({ page, apartmentDetailPage, makePaymentPage: form, apartmentSoaPage: soa, recentReceiptsPage: receipts, walletPage: wallet }) => {
      notChecked('Dashboard, Account Receivable list, Contact, Reports', NOT_IN_SMOKE);
      const topUp = 20000;
      const { apt, acc, inv } = await setup(page);
      let walletBefore = 0;
      await test.step(`Precondition: wallet recharged with ${ks(topUp)} (Wallet › Recharge, Cash, our account)`, async () => {
        await rechargeWallet(page, apt, acc, topUp);
        await wallet.goto(apt.id);
        walletBefore = await wallet.balance();
        expect(walletBefore, 'wallet balance after the recharge').toBe(topUp);
      });

      await test.step('1-2. Apartment › Invoices › Make Payment', async () => {
        await apartmentDetailPage.gotoInvoices(apt.id);
        await page.getByRole('link', { name: 'Make Payment' }).click();
        await form.waitLoaded();
      });

      await test.step('3-4. Currency MMK, Location, Payment Method = Wallet; pay the invoice', async () => {
        await expect.soft(form.currency).toHaveText('MMK');
        await form.fill({ location: LOCATION, method: 'Wallet' });
        await form.payBox(inv.code).fill(String(inv.total));
        await form.payBox(inv.code).blur();
        await expect(form.payBox(inv.code)).toHaveValue(ks(inv.total));
        await evidence(page, 'PAY-005_form');
      });

      await test.step('5. Confirm', async () => {
        await form.confirmButton.click();
        await soa.waitLoaded();
      });

      let code = '';
      await test.step('Expected 1: transaction in the apartment S.O.A and the wallet', async () => {
        const row = soa.paymentRows(inv.code);
        await expect(row, `S.O.A "Payment Received" row for ${inv.code}`).toHaveCount(1);
        code = (await row.innerText()).match(/\b(RV|WP)-\d+/)?.[0] ?? '';
        await expect.soft(soa.paymentsCell(row)).toHaveText(ks(inv.total));
        await evidence(page, 'PAY-005_soa');
      });

      await test.step('Expected 3-4: new WP code in the Wallet tab; wallet balance reduced', async () => {
        await wallet.goto(apt.id);
        const wp = wallet.row(/WP-\d+/);
        await expect.soft(wp, 'Wallet tab: a WP (wallet payment) row').toHaveCount(1);
        if (await wp.count()) await expect.soft(wp).toContainText(ks(inv.total));
        expect.soft(await wallet.balance(), 'MMK Wallet Current Balance').toBe(walletBefore - inv.total);
        await evidence(page, 'PAY-005_wallet');
      });

      await test.step('Expected 2: new RV code in the Cash Received list', async () => {
        await receipts.goto();
        const row = await receipts.find(code.startsWith('RV-') ? code : `${inv.code} Payment`);
        await row.first().scrollIntoViewIfNeeded().catch(() => {});
        await evidence(page, 'PAY-005_recent-receipts');
        await expect.soft(row, `Recent Receipts: an RV for the wallet payment of ${inv.code} (S.O.A shows "${code}")`).toHaveCount(1);
      });

      await test.step('Expected 4: invoice status Paid and AR updated', async () => {
        const status = await invoiceStatus(page, inv);
        expect.soft(status, 'Invoice detail status').toBe('Paid');
        expect.soft(await apartmentAr(page, apt), 'Apartment Summary: Accounts Receivable').toBe(0);
      });

      await test.step('Wallet payment does not touch the company account', async () => {
        expect.soft(await accountBalance(page, acc.name), `${acc.name}: only the recharge`).toBe(topUp);
      });
    });
});

test.describe('Apartments · Invoice', () => {
  test('APT-016 Make full payment from apartment — SOA, AR and unpaid total updated',
    testCase({ id: 'APT-016', source: 'TC_Apart:Invoice_007', priority: 'P1', smoke: true, critical: true }),
    async ({ page, apartmentDetailPage, makePaymentPage: form, apartmentSoaPage: soa }) => {
      notChecked('Dashboard, Contact, Reports, Cash Received', NOT_IN_SMOKE);
      test.info().annotations.push({ type: 'case issue', description: 'Received in "[Cash MMK] 2C2P account" is shared UAT data: paid into our own cash account instead' });
      const { apt, acc, inv } = await setup(page);
      const unpaid = page.getByRole('paragraph').filter({ hasText: /MMK Total Unpaid Amount/ });

      await test.step('1-2. Apartments › our apartment › Invoices: total unpaid = the invoice', async () => {
        await apartmentDetailPage.gotoInvoices(apt.id);
        await expect(unpaid).toHaveText(new RegExp(`Total Unpaid Amount:\\s*${ks(inv.total).replace(/[.]/g, '\\.')}`));
      });

      await test.step('Before: the invoice is in the Accounts Receivable list', async () => {
        await page.goto('/account-receivables');
        const row = await arRow(page, inv);
        await expect(row, `${inv.code} in Accounts Receivable (Current)`).toHaveCount(1);
      });

      await test.step('3-7. Make Payment: MMK, MO - CL, Cash, our account, received amount = balance; Confirm', async () => {
        await apartmentDetailPage.gotoInvoices(apt.id);
        await page.getByRole('link', { name: 'Make Payment' }).click();
        await form.waitLoaded();
        await form.fill({ location: 'MO - CL', method: 'Cash', account: acc.name, amount: inv.total });
        await expect(form.payBox(inv.code)).toHaveValue(ks(inv.total));
        await form.confirmButton.click();
        await soa.waitLoaded();
      });

      await test.step('Expected 1: Payment Received record in the S.O.A', async () => {
        const row = soa.paymentRows(inv.code);
        await expect(row).toHaveCount(1);
        await expect.soft(soa.paymentsCell(row)).toHaveText(ks(inv.total));
        await evidence(page, 'APT-016_soa');
      });

      await test.step('Expected 2: the invoice is gone from the AR list', async () => {
        await page.goto('/account-receivables');
        const row = await arRow(page, inv);
        await expect.soft(row, `${inv.code} no longer in Accounts Receivable`).toHaveCount(0);
        await evidence(page, 'APT-016_ar-list');
      });

      await test.step('Expected 3: total unpaid amount of the apartment decreased', async () => {
        await apartmentDetailPage.gotoInvoices(apt.id);
        const shown = (await unpaid.count()) ? parseAmount((await unpaid.innerText()).split(':').pop()!) : 0;
        expect.soft(shown, 'MMK Total Unpaid Amount (absent = 0)').toBe(0);
        expect.soft(await apartmentAr(page, apt), 'Apartment Summary: Accounts Receivable').toBe(0);
        await evidence(page, 'APT-016_summary');
      });

      await test.step('Check area: Cash & Bank Account', async () => {
        expect.soft(await accountBalance(page, acc.name)).toBe(inv.total);
      });
    });
});

/** Accounts Receivable list, "Current" tab: the row of the invoice (searched over the pages). */
async function arRow(page: Page, inv: UnpaidInvoice) {
  await expect(page.getByRole('tab', { name: 'Current' })).toBeVisible({ timeout: 30_000 });
  await waitIdle(page);
  const rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  await expect(rows.first()).toBeVisible({ timeout: 30_000 });
  return findOnPages(page, rows.filter({ has: page.getByRole('link', { name: inv.code, exact: true }) }), 20);
}
