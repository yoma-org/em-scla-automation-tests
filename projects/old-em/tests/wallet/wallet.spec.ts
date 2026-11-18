// Wallet (../em/docs/test-cases/features/16-wallet.md). Each test creates its own apartment(s) and cash account
// (QE OLD <date>-<rand> …) and checks balances on them only. Old EM has no delete: the data stays on UAT.
// Smoke = base data row only (amount 100000).
import { test } from '@fixtures/wallet.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { formField } from '@components/PrimeSelect';
import { createApartment, createCashAccount, createUoInvoice } from '@data/builders';
import { accountBalance, rechargeWallet, voucherOf } from '@data/wallet';
import { approveDraft, ks, parseAmount, searchApartment, topbarDraftLink } from '@pages/wallet/common';

/** A check area the test leaves out on purpose, shown in the report. */
function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

const SHARED_TOTALS = 'UAT-wide totals move with other testers\' and parallel runs, so a delta cannot be tied to this test';

/** Steps 1-2 of the wallet cases: top-bar search → apartment → Wallet tab. */
async function openWalletFromSearch(page: import('@playwright/test').Page, apt: { id: string; name: string }) {
  await searchApartment(page, apt.name);
  await expect(page).toHaveURL(new RegExp(`/apartments/${apt.id}/`));
  await page.locator(`a[href="/apartments/${apt.id}/wallet"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`/apartments/${apt.id}/wallet$`));
}

test.describe('Wallet', () => {
  test.describe.configure({ timeout: 240_000 });

  test('WAL-001 [base] Recharge wallet (MMK, cash) — wallet, RV and received-in account balance increase',
    testCase({ id: 'WAL-001', source: 'TC_Wallet_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, walletPage: wallet, recentReceiptsPage: receipts }) => {
      const amount = 100000;
      notChecked('Dashboard (Cash & Bank, Net Cash, Wallet)', SHARED_TOTALS);
      notChecked('Report (Account Statement, Transactions, Cash Received)', 'smoke checks the Expected result screens only');
      test.info().annotations.push({ type: 'case issue', description: 'Test data account "[ Cash MMK ] Cash in Hand - Utility Operations" / location "Zone A/B" are shared UAT data; the test uses its own cash account and location "MO - CL"' });

      const apt = await createApartment(page, { owner: true });
      const account = await createCashAccount(page);
      const accountBefore = await accountBalance(page, account.name);

      let walletBefore = 0;
      await test.step('1-2. Search the apartment, open Wallet', async () => {
        await page.goto('/apartments');
        await openWalletFromSearch(page, apt);
        await wallet.waitLoaded();
        walletBefore = await wallet.balance();
      });

      await test.step('3-4. Recharge; currency MMK by default', async () => {
        await wallet.rechargeButton.click();
        await expect(wallet.recharge.root).toBeVisible();
        // Given 10 s, so a slow currency list is not mistaken for a missing default.
        const currency = wallet.recharge.field('Currency');
        const ok = await expect(currency).toHaveText('MMK', { timeout: 10_000 }).then(() => true, () => false);
        if (!ok) await evidence(page, 'WAL-001_currency-default');
        expect.soft(ok, `Step 4: currency is MMK by default. Old EM shows "${(await currency.innerText()).trim()}"`).toBe(true);
      });

      await test.step('5-6. Fill the required fields and confirm', async () => {
        await wallet.fillRecharge({ amount, account: account.name, method: 'Cash', remark: 'QE OLD WAL-001' });
        await wallet.recharge.submit();
        await expect(toast(page, 'Wallet Recharge has been created successfully')).toBeVisible();
      });

      let rv = '';
      await test.step('Expected 1-2: wallet balance up by the amount, RV (Wallet Cash Received) shown', async () => {
        await wallet.waitLoaded();
        const row = wallet.row(/Wallet Cash Received/);
        await expect(row, 'RV ( Wallet Cash Received ) row in the wallet ledger').toHaveCount(1);
        rv = voucherOf(await row.innerText());
        expect.soft(rv, 'Receipt voucher number').toMatch(/^RV-\d+$/);
        await expect.soft(row).toContainText(ks(amount));
        const after = await wallet.balance();
        await evidence(page, 'WAL-001_wallet');
        expect.soft(after, `Wallet current balance: ${walletBefore} + ${amount}`).toBe(walletBefore + amount);
      });

      await test.step('Check area: Cash Received › Recent Receipts lists the RV', async () => {
        await receipts.goto();
        const row = receipts.row(rv);
        await expect.soft(row, `${rv} in Recent Receipts`).toBeVisible();
        await expect.soft(row).toContainText(account.name);
        await expect.soft(row).toContainText(apt.name);
        await expect.soft(row).toContainText('Wallet Cash Received');
        await expect.soft(row).toContainText(ks(amount));
        if (!(await row.isVisible())) await evidence(page, 'WAL-001_recent-receipts');
      });

      await test.step('Expected 3: received-in account balance up by the amount', async () => {
        const after = await accountBalance(page, account.name);
        await evidence(page, 'WAL-001_account');
        expect.soft(after, `${account.name} closing balance: ${accountBefore} + ${amount}`).toBe(accountBefore + amount);
      });
    });

  test('WAL-006 [base] Transfer wallet balance to another apartment — both wallets updated, WT created',
    testCase({ id: 'WAL-006', source: 'TC_Wallet_008', priority: 'P1', smoke: true, critical: true }),
    async ({ page, walletPage: wallet }) => {
      const amount = 100000;
      notChecked('Report - Transaction (wallet transfer)', 'smoke checks the Expected result screens only');

      // Precondition "payer and receiver need to own 2 apartments": one owner contact on both apartments.
      const from = await createApartment(page, { owner: true });
      const to = await createApartment(page, { owner: from.owner });
      const account = await createCashAccount(page);
      await rechargeWallet(page, from, account, amount); // precondition: wallet balance > 0

      let fromBefore = 0;
      let toBefore = 0;
      await test.step('Balances before', async () => {
        await wallet.goto(to.id);
        toBefore = await wallet.balance();
      });

      await test.step('1-2. Search the apartment, open Wallet', async () => {
        await openWalletFromSearch(page, from);
        await wallet.waitLoaded();
        fromBefore = await wallet.balance();
        expect(fromBefore, 'precondition: wallet balance > 0').toBeGreaterThan(0);
      });

      await test.step('3-4. Wallet Transfer; currency MMK by default', async () => {
        await wallet.transferButton.click();
        await expect(wallet.transfer.root).toBeVisible();
        // Given 10 s, so a slow currency list is not mistaken for a missing default.
        const currency = wallet.transfer.field('Currency');
        const ok = await expect(currency).toHaveText('MMK', { timeout: 10_000 }).then(() => true, () => false);
        if (!ok) await evidence(page, 'WAL-006_currency-default');
        expect.soft(ok, `Step 4: currency is MMK by default. Old EM shows "${(await currency.innerText()).trim()}"`).toBe(true);
      });

      await test.step('5-8. Apartment, amount, remark; confirm', async () => {
        await wallet.transfer.choose('Transfer to*', to.name, to.name);
        await wallet.transfer.amount.fill(String(amount));
        await wallet.transfer.remark.fill('QE OLD WAL-006');
        await wallet.transfer.submit();
        await expect(toast(page, 'Wallet Transfer has been created successfully')).toBeVisible();
      });

      const wtRow = new RegExp(`WT-\\d+ \\( Wallet Transfer from ${from.name} to ${to.name} \\)`);
      await test.step('Expected 1-2: amount subtracted from the wallet, WT shown', async () => {
        await wallet.waitLoaded();
        const row = wallet.row(wtRow);
        await expect(row, 'WT ( Wallet Transfer from … to … ) row in the payer\'s wallet').toHaveCount(1);
        await expect.soft(row.getByRole('cell').nth(3), 'WT amount in CR').toHaveText(ks(amount));
        const after = await wallet.balance();
        await evidence(page, 'WAL-006_payer-wallet');
        expect.soft(after, `Payer wallet: ${fromBefore} - ${amount}`).toBe(fromBefore - amount);
      });

      await test.step('Expected 3: the receiving apartment\'s wallet is updated', async () => {
        await wallet.goto(to.id);
        const row = wallet.row(wtRow);
        await expect.soft(row, 'WT row in the receiver\'s wallet').toHaveCount(1);
        const after = await wallet.balance();
        await evidence(page, 'WAL-006_receiver-wallet');
        expect.soft(after, `Receiver wallet: ${toBefore} + ${amount}`).toBe(toBefore + amount);
      });
    });

  test('WAL-016 Approve credit note — CN amount added to wallet balance',
    testCase({ id: 'WAL-016', source: 'TC_Wallet_022', priority: 'P1', smoke: true, critical: true }),
    async ({ page, walletPage: wallet, creditNoteDraftsPage: drafts }) => {
      const amount = 100000;
      notChecked('Report - Credit Note', 'smoke checks the Expected result screens only');

      const apt = await createApartment(page);
      let before = 0;
      await test.step('Precondition: a credit note draft on our apartment', async () => {
        await wallet.goto(apt.id);
        before = await wallet.balance();
        await wallet.doCreditNote(amount, 'Others - EM', 'QE OLD WAL-016');
        await expect(toast(page, 'Wallet Credit Note has been drafted successfully')).toBeVisible();
        await wallet.waitLoaded();
        expect(await wallet.balance(), 'a draft credit note does not change the wallet').toBe(before);
      });

      await test.step('1-2. Choose the credit note (top bar CN), click Manage', async () => {
        await topbarDraftLink(page, 'CN').click();
        await expect(page).toHaveURL(/\/apartments\/wallet\/credit-note-draft$/);
        await drafts.waitLoaded();
        await expect(drafts.row(apt.name), `CN draft of ${apt.name}`).toHaveCount(1);
        await expect.soft(drafts.row(apt.name)).toContainText(ks(amount));
        await drafts.manageLink(apt.name).click();
        await expect(page).toHaveURL(/\/apartments\/wallet\/\d+\/draft$/);
      });

      await test.step('3. Check the credit note draft', async () => {
        await expect.soft(page.getByRole('textbox', { name: 'Apartment' })).toHaveValue(apt.name);
        await expect.soft(page.getByRole('textbox', { name: 'Currency' })).toHaveValue('MMK');
        const values = await page.locator('input').evaluateAll(es => es.map(e => (e as HTMLInputElement).value));
        expect.soft(values, 'draft amount').toContain(ks(amount));
      });

      await test.step('4. Approve', async () => {
        await approveDraft(page);
        await evidence(page, 'WAL-016_approved');
      });

      await test.step('Expected 1: credit note approved (no longer a draft)', async () => {
        await drafts.goto();
        await expect.soft(drafts.row(apt.name), 'approved CN left the draft list').toHaveCount(0);
      });

      await test.step('Expected 2: CN (Wallet Credit Received) amount added to the wallet', async () => {
        await wallet.goto(apt.id);
        const row = wallet.row(/Wallet Credit Received/);
        await expect.soft(row, '( Wallet Credit Received ) row in the wallet ledger').toHaveCount(1);
        await expect.soft(row).toContainText(ks(amount));
        const after = await wallet.balance();
        await evidence(page, 'WAL-016_wallet');
        expect.soft(after, `Wallet: ${before} + ${amount}`).toBe(before + amount);
      });
    });

  test('WAL-020 Pay invoice in full with wallet payment method — wallet, SOA and unpaid total updated',
    testCase({ id: 'WAL-020', source: 'TC_Wallet_026', priority: 'P1', smoke: true, critical: true }),
    async ({ page, apartmentInvoicesTab: invoices, makePaymentPage: pay, apartmentSoaTab: soa, walletPage: wallet }) => {
      notChecked('Dashboard (AR, Wallet), Accounts Receivable, Invoice/Debit Note list', SHARED_TOTALS);
      notChecked('Contact summary / Unpaid Invoices, Reports', 'smoke checks the apartment screens only');

      const apt = await createApartment(page, { owner: true });
      const account = await createCashAccount(page);
      await createUoInvoice(page, apt, { 'Electricity (YESC)': { previous: 0, current: 10 } });
      await rechargeWallet(page, apt, account, 100000); // the wallet must cover the invoice

      let invoiceNo = '';
      let invoiceAmount = 0;
      let unpaidBefore = 0;
      let walletBefore = 0;
      await test.step('1-2. Search the apartment, open Invoices', async () => {
        await searchApartment(page, apt.name);
        await expect(page).toHaveURL(new RegExp(`/apartments/${apt.id}/`));
        await page.locator(`a[href="/apartments/${apt.id}/invoice"]`).first().click();
        await invoices.waitLoaded();
        invoiceNo = await invoices.invoiceNo('Utilities');
        unpaidBefore = await invoices.unpaid();
        walletBefore = parseAmount((await invoices.walletBalance.innerText()).split(':').pop()!);
        invoiceAmount = unpaidBefore; // the UO invoice is the apartment's only invoice
        expect(invoiceAmount, 'invoice amount').toBeGreaterThan(0);
        expect(walletBefore, 'wallet covers the invoice').toBeGreaterThanOrEqual(invoiceAmount);
      });

      await test.step('3-6. Make Payment: currency MMK, location, Wallet', async () => {
        await invoices.makePaymentLink.click();
        await expect(page).toHaveURL(new RegExp(`/apartments/${apt.id}/make-payment$`));
        await pay.waitLoaded();
        const currency = (await formField(page, 'Invoice Currency Type').getByRole('combobox').innerText()).trim();
        expect.soft(currency, `Step 4: currency is MMK by default. Old EM shows "${currency}"`).toBe('MMK');
        await pay.chooseLocation('MO - CL');
        await pay.chooseMethod('Wallet');
      });

      await test.step('7-8. Tick Pay: received amount filled automatically', async () => {
        await pay.payInFull(invoiceNo);
        await expect.soft(pay.receivedAmount, 'Received Amount = invoice amount').toHaveValue(ks(invoiceAmount));
        await expect.soft(pay.invoiceRow(invoiceNo).getByRole('textbox')).toHaveValue(ks(invoiceAmount));
      });

      await test.step('9-10. Remark; Confirm', async () => {
        await pay.remark.fill('QE OLD WAL-020');
        await pay.confirmButton.click();
        await expect(page).toHaveURL(new RegExp(`/apartments/${apt.id}/soa$`));
      });

      await test.step('Expected 2: receipt in the SOA', async () => {
        await soa.waitLoaded();
        const row = soa.row(new RegExp(`Payment for ${invoiceNo}`));
        await evidence(page, 'WAL-020_soa');
        await expect.soft(row, `payment row for ${invoiceNo} in the SOA`).toHaveCount(1);
        await expect.soft(row).toContainText(ks(invoiceAmount));
        const voucher = (await row.count()) ? voucherOf(await row.innerText()) : '';
        if (voucher && !voucher.startsWith('RV-')) {
          test.info().annotations.push({ type: 'case issue', description: `Expected 2 says "RV (receipt voucher) will be out in SOA"; Old EM numbers a wallet payment ${voucher} (WP = wallet payment). Checked as "a payment voucher for the invoice is in the SOA".` });
        }
        await expect.soft(soa.balanceDue()).toContainText(ks(unpaidBefore - invoiceAmount));
      });

      await test.step('Expected 1 and 3: wallet balance and total unpaid amount updated', async () => {
        await invoices.goto(apt.id);
        const unpaid = await invoices.unpaid();
        const walletAfter = parseAmount((await invoices.walletBalance.innerText()).split(':').pop()!);
        await evidence(page, 'WAL-020_invoices');
        expect.soft(unpaid, `Total unpaid: ${unpaidBefore} - ${invoiceAmount}`).toBe(unpaidBefore - invoiceAmount);
        expect.soft(walletAfter, `Wallet (Invoices tab): ${walletBefore} - ${invoiceAmount}`).toBe(walletBefore - invoiceAmount);
        await wallet.goto(apt.id);
        expect.soft(await wallet.balance(), `Wallet tab: ${walletBefore} - ${invoiceAmount}`).toBe(walletBefore - invoiceAmount);
      });
    });

  test('WAL-028 Approve wallet refund — wallet and refund-from account reduced, PV issued',
    testCase({ id: 'WAL-028', source: 'TC_Wallet_036', priority: 'P1', smoke: true, critical: true }),
    async ({ page, walletPage: wallet, cashOutflowDraftsPage: drafts, recentOutflowsPage: outflows }) => {
      const recharge = 100000;
      const refund = 40000;
      notChecked('Dashboard (Cash & Bank, Net Cash, Wallet)', SHARED_TOTALS);
      notChecked('Report (Account Statement, Transactions, Cash Outflow)', 'smoke checks the Expected result screens only');

      const apt = await createApartment(page);
      const account = await createCashAccount(page);
      await rechargeWallet(page, apt, account, recharge);

      let walletBefore = 0;
      let accountBefore = 0;
      await test.step('Precondition: a wallet refund PV draft from our account', async () => {
        await wallet.goto(apt.id);
        await wallet.doRefund(account.name, refund, 'QE OLD WAL-028');
        await expect(toast(page, 'Wallet Refund has been created successfully')).toBeVisible();
        await wallet.goto(apt.id);
        walletBefore = await wallet.balance();
        accountBefore = await accountBalance(page, account.name);
      });

      await test.step('1-3. PV on the top bar, choose the payment, Manage', async () => {
        await topbarDraftLink(page, 'PV').click();
        await expect(page).toHaveURL(/\/cash-outflows\/draft$/);
        await drafts.waitLoaded();
        await expect(drafts.row(apt.name, 'Wallet Refund'), `Wallet Refund draft of ${apt.name}`).toHaveCount(1);
        await (await drafts.manageLink(apt.name, 'Wallet Refund')).click();
        await expect(page).toHaveURL(/\/cash-outflows\/\d+\/draft$/);
      });

      await test.step('4. Check the cash outflow draft', async () => {
        await expect.soft(page.getByRole('textbox', { name: 'Payee' })).toHaveValue(apt.name);
        await expect.soft(page.getByRole('textbox', { name: 'Withdrawl from' })).toHaveValue(new RegExp(account.name));
        await expect.soft(page.getByRole('textbox', { name: 'Category' })).toHaveValue('Wallet Refund');
      });

      let pv = '';
      await test.step('5. Approve → Expected 1: cash outflow approved', async () => {
        await approveDraft(page);
        // Old EM goes back to the draft list (opened from the list) or shows "PV-…" (opened by URL).
        await drafts.goto();
        await expect.soft(drafts.row(apt.name, 'Wallet Refund'), 'approved PV left the draft list').toHaveCount(0);
      });

      await test.step('Expected 2: refund subtracted from the wallet', async () => {
        await wallet.goto(apt.id);
        const row = wallet.row(/\( Wallet Refund \)/);
        await expect.soft(row, 'Expected 3: PV ( Wallet Refund ) row in the wallet ledger').toHaveCount(1);
        if (await row.count() === 1) pv = voucherOf(await row.innerText());
        expect.soft(pv, 'Expected 3: PV number of the refund').toMatch(/^PV-\d+$/);
        const after = await wallet.balance();
        await evidence(page, 'WAL-028_wallet');
        expect.soft(after, `Wallet: ${walletBefore} - ${refund}`).toBe(walletBefore - refund);
      });

      await test.step('Expected 2: refund subtracted from the refund-from account', async () => {
        const after = await accountBalance(page, account.name);
        await evidence(page, 'WAL-028_account');
        expect.soft(after, `${account.name}: ${accountBefore} - ${refund}`).toBe(accountBefore - refund);
      });

      await test.step('Check area: Cash Outflow › Recent Outflows lists the PV', async () => {
        await outflows.goto();
        const row = pv ? outflows.row(pv) : outflows.table.getByRole('row').filter({ hasText: apt.name });
        await expect.soft(row, 'PV in Recent Outflows').toHaveCount(1);
        await expect.soft(row).toContainText('Wallet Refund');
        await expect.soft(row).toContainText(ks(refund));
      });
    });
});
