// Deposit (../em/docs/test-cases/features/17-deposit.md). Each test creates its own apartment and cash account
// (QE OLD <date>-<rand> …) and checks balances on them only. Old EM has no delete: the data stays on UAT.
// Smoke = base data row only (DEP-001: 100000; never the 12.3-trillion variant, see follow-ups.md).
import { test } from '@fixtures/wallet.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { createApartment, createCashAccount } from '@data/builders';
import { accountBalance, addDeposit, voucherOf } from '@data/wallet';
import { approveDraft, ks, searchApartment, topbarDraftLink } from '@pages/wallet/common';

/** A check area the test leaves out on purpose, shown in the report. */
function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

const SHARED_TOTALS = 'UAT-wide totals move with other testers\' and parallel runs, so a delta cannot be tied to this test';

test.describe('Deposit', () => {
  test.describe.configure({ timeout: 240_000 });

  test('DEP-001 [base] Add deposit (MMK, cash) — deposit balance increases and RV issued',
    testCase({ id: 'DEP-001', source: 'TC_Deposit_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, depositPage: deposit, recentReceiptsPage: receipts }) => {
      const amount = 100000;
      notChecked('Dashboard (Cash & Bank, Net Cash, Deposit)', SHARED_TOTALS);
      notChecked('Report (Account Statement, Transactions, Cash Received)', 'smoke checks the Expected result screens only');
      test.info().annotations.push({ type: 'case issue', description: 'Test data account "[ Cash MMK ] Cash In Hand - Facility" / location "MO - Zone A/B" are shared UAT data (the location does not exist on UAT); the test uses its own cash account and location "MO - CL"' });

      const apt = await createApartment(page, { owner: true });
      const account = await createCashAccount(page);
      const accountBefore = await accountBalance(page, account.name);

      let before = 0;
      await test.step('1-2. Search the apartment, open Deposit', async () => {
        await searchApartment(page, apt.name);
        await expect(page).toHaveURL(new RegExp(`/apartments/${apt.id}/`));
        await page.locator(`a[href="/apartments/${apt.id}/deposit"]`).first().click();
        await expect(page).toHaveURL(new RegExp(`/apartments/${apt.id}/deposit$`));
        await deposit.waitLoaded();
        before = await deposit.balance();
      });

      await test.step('3-4. Add Deposit; currency MMK by default', async () => {
        await deposit.addDepositButton.click();
        await expect(deposit.addDeposit.root).toBeVisible();
        // Given 10 s, so a slow currency list is not mistaken for a missing default.
        const currency = deposit.addDeposit.field('Currency');
        const ok = await expect(currency).toHaveText('MMK', { timeout: 10_000 }).then(() => true, () => false);
        if (!ok) await evidence(page, 'DEP-001_currency-default');
        expect.soft(ok, `Step 4: currency is MMK by default. Old EM shows "${(await currency.innerText()).trim()}"`).toBe(true);
      });

      await test.step('5-7. Required fields, remark; confirm', async () => {
        await deposit.fillAddDeposit({ amount, account: account.name, method: 'Cash', remark: 'QE OLD DEP-001' });
        await deposit.addDeposit.submit();
        await expect(toast(page, 'Add Deposit has been created successfully')).toBeVisible();
      });

      let rv = '';
      await test.step('Expected 1-2: deposit balance up by the amount, RV (Deposit Received) shown', async () => {
        await deposit.waitLoaded();
        const row = deposit.row(/Deposit Received/);
        await expect(row, 'RV ( Deposit Received ) row in the deposit ledger').toHaveCount(1);
        rv = voucherOf(await row.innerText());
        expect.soft(rv, 'Receipt voucher number').toMatch(/^RV-\d+$/);
        await expect.soft(row).toContainText(ks(amount));
        const after = await deposit.balance();
        await evidence(page, 'DEP-001_deposit');
        expect.soft(after, `Deposit current balance: ${before} + ${amount}`).toBe(before + amount);
      });

      await test.step('Check area: Cash Received › Recent Receipts lists the RV', async () => {
        await receipts.goto();
        const row = receipts.row(rv);
        await expect.soft(row, `${rv} in Recent Receipts`).toBeVisible();
        await expect.soft(row).toContainText(account.name);
        await expect.soft(row).toContainText(apt.name);
        await expect.soft(row).toContainText('Deposit Received');
        await expect.soft(row).toContainText(ks(amount));
        if (!(await row.isVisible())) await evidence(page, 'DEP-001_recent-receipts');
      });

      await test.step('Check area: Cash & Bank Account balance up by the amount', async () => {
        const after = await accountBalance(page, account.name);
        await evidence(page, 'DEP-001_account');
        expect.soft(after, `${account.name} closing balance: ${accountBefore} + ${amount}`).toBe(accountBefore + amount);
      });
    });

  test('DEP-012 Approve deposit invoice — DI approved and printable',
    testCase({ id: 'DEP-012', source: 'TC_Deposit_014', priority: 'P1', smoke: true, critical: true }),
    async ({ page, depositInvoiceCreatePage: form, depositInvoiceDraftsPage: drafts, depositInvoiceDetailPage: detail, depositInvoiceListPage: list }) => {
      const amount = 50000;
      test.info().annotations.push({ type: 'case issue', description: 'Steps say "Check the cash outflow draft" (copy-paste): read as "check the deposit invoice draft"; "will be printed" checked as the approved DI offering its PDF (View / Download)' });

      const apt = await createApartment(page);
      await test.step('Precondition: a deposit invoice draft on our apartment', async () => {
        await form.goto(apt.id);
        await form.itemDescription.fill('QE OLD DEP-012 deposit');
        await form.unit.fill('1');
        await form.grossPrice.fill(String(amount));
        if (await form.oldCoRef.isVisible()) {
          // Shown only while a UAT setting asks for the old CoRef number (another tester may switch it on).
          await form.oldCoRef.fill(`QEOLD${Date.now()}`);
        }
        await form.createButton.click();
        await expect(toast(page, 'Deposit Invoice has been created successfully')).toBeVisible();
      });

      await test.step('1-3. DI on the top bar, choose the invoice, Manage', async () => {
        await topbarDraftLink(page, 'DI').click();
        await expect(page).toHaveURL(/\/apartments\/draft$/);
        await drafts.waitLoaded();
        await expect(drafts.row(apt.name), `DI draft of ${apt.name}`).toHaveCount(1);
        await expect.soft(drafts.row(apt.name)).toContainText(ks(amount));
        await drafts.manageLink(apt.name).click();
        await expect(page).toHaveURL(/\/apartments\/deposit-invoice\/\d+$/);
      });

      await test.step('4. Check the draft', async () => {
        await expect.soft(detail.status('DRAFT')).toBeVisible();
        await expect.soft(page.getByText(/Issued to:/).first()).toBeVisible();
        await expect.soft(page.getByText(apt.name, { exact: true }).first(), 'Issued to our apartment').toBeVisible();
        await expect.soft(page.getByRole('heading', { name: `Total: ${ks(amount)}` })).toBeVisible();
      });

      let diNo = '';
      await test.step('5. Approve → Expected 1: invoice approved successfully', async () => {
        const toastSeen = toast(page, 'Deposit Invoice has been approved successfully').waitFor({ timeout: 20_000 }).then(() => true, () => false);
        await approveDraft(page);
        expect.soft(await toastSeen, 'toast "Deposit Invoice has been approved successfully"').toBe(true);
        // "#DI-…", "CoRef : …" and "APPROVED" are separate elements.
        const number = page.getByText(/DI-\d{6}-\d+/).first();
        await expect.soft(number, 'DI number after approval').toBeVisible();
        await expect.soft(page.getByText(/\bAPPROVED\b/).first(), 'APPROVED status').toBeVisible();
        await evidence(page, 'DEP-012_approved');
        if (await number.isVisible()) diNo = (await number.innerText()).match(/DI-\d{6}-\d+/)![0];
      });

      await test.step('Expected 2: the deposit invoice can be printed (PDF)', async () => {
        await expect(detail.pdf, 'PDF menu on the approved DI').toBeVisible();
        await detail.pdf.click();
        const options = page.getByRole('option');
        await expect.soft(options.filter({ hasText: 'View PDF' })).toBeVisible();
        const download = page.waitForEvent('download');
        await options.filter({ hasText: 'Download PDF' }).first().click();
        const file = await download;
        expect.soft(file.suggestedFilename(), 'downloaded deposit invoice').toMatch(/\.pdf$/i);
      });

      await test.step('Check area: Apartment › Deposit › Deposit Invoice lists the approved DI', async () => {
        await list.goto(apt.id);
        const row = diNo ? list.row(diNo) : list.table.getByRole('rowgroup').nth(1).getByRole('row');
        await expect.soft(row, 'approved DI in the apartment\'s Deposit Invoice list').toHaveCount(1);
        await expect.soft(row).toContainText(ks(amount));
        await evidence(page, 'DEP-012_di-list');
      });
    });

  test('DEP-022 Approve withdraw deposit — deposit balance reduced and PV in Cash Outflow',
    testCase({ id: 'DEP-022', source: 'TC_Deposit_026', priority: 'P1', smoke: true, critical: true }),
    async ({ page, depositPage: deposit, cashOutflowDraftsPage: drafts, recentOutflowsPage: outflows }) => {
      const added = 100000;
      const withdraw = 40000;
      notChecked('Dashboard (Cash & Bank, Net Cash, Deposit)', SHARED_TOTALS);
      notChecked('Report (Account Statement, Transactions, Cash Outflow)', 'smoke checks the Expected result screens only');

      const apt = await createApartment(page);
      const account = await createCashAccount(page);
      await addDeposit(page, apt, account, added);

      let depositBefore = 0;
      let accountBefore = 0;
      await test.step('Precondition: a deposit withdrawal PV draft from our account', async () => {
        await deposit.goto(apt.id);
        await deposit.doWithdraw(account.name, withdraw, 'QE OLD DEP-022');
        await expect(toast(page, 'Deposit Withdraw has been created successfully')).toBeVisible();
        await deposit.goto(apt.id);
        depositBefore = await deposit.balance();
        accountBefore = await accountBalance(page, account.name);
      });

      await test.step('1-3. PV on the top bar, choose the payment, Manage', async () => {
        await topbarDraftLink(page, 'PV').click();
        await expect(page).toHaveURL(/\/cash-outflows\/draft$/);
        await drafts.waitLoaded();
        await expect(drafts.row(apt.name, 'Deposit Withdrawal'), `Deposit Withdrawal draft of ${apt.name}`).toHaveCount(1);
        await (await drafts.manageLink(apt.name, 'Deposit Withdrawal')).click();
        await expect(page).toHaveURL(/\/cash-outflows\/\d+\/draft$/);
      });

      await test.step('4. Check the cash outflow draft', async () => {
        await expect.soft(page.getByRole('textbox', { name: 'Payee' })).toHaveValue(apt.name);
        await expect.soft(page.getByRole('textbox', { name: 'Withdrawl from' })).toHaveValue(new RegExp(account.name));
        await expect.soft(page.getByRole('textbox', { name: 'Category' })).toHaveValue('Deposit Withdrawal');
      });

      let pv = '';
      await test.step('5. Approve → Expected 1: cash outflow approved', async () => {
        await approveDraft(page);
        // Old EM goes back to the draft list (opened from the list) or shows "PV-…" (opened by URL).
        await drafts.goto();
        await expect.soft(drafts.row(apt.name, 'Deposit Withdrawal'), 'approved PV left the draft list').toHaveCount(0);
      });

      await test.step('Expected 2: withdrawal subtracted from the deposit', async () => {
        await deposit.goto(apt.id);
        const row = deposit.row(/Deposit Withdraw/);
        await expect.soft(row, 'PV ( Deposit Withdrawal ) row in the deposit ledger').toHaveCount(1);
        if (await row.count() === 1) pv = voucherOf(await row.innerText());
        expect.soft(pv, 'PV number of the withdrawal').toMatch(/^PV-\d+$/);
        const after = await deposit.balance();
        await evidence(page, 'DEP-022_deposit');
        expect.soft(after, `Deposit: ${depositBefore} - ${withdraw}`).toBe(depositBefore - withdraw);
      });

      await test.step('Expected 3: PV shown in Cash Outflow', async () => {
        await outflows.goto();
        const row = pv ? outflows.row(pv) : outflows.table.getByRole('row').filter({ hasText: apt.name });
        await expect.soft(row, 'PV in Recent Outflows').toHaveCount(1);
        await expect.soft(row).toContainText('Deposit Withdrawal');
        await expect.soft(row).toContainText(ks(withdraw));
        await evidence(page, 'DEP-022_cash-outflow');
      });

      await test.step('Check area: Cash & Bank Account balance down by the amount', async () => {
        const after = await accountBalance(page, account.name);
        await evidence(page, 'DEP-022_account');
        expect.soft(after, `${account.name}: ${accountBefore} - ${withdraw}`).toBe(accountBefore - withdraw);
      });
    });
});
