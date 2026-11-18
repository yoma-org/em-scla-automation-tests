// Cash Received (../em/docs/test-cases/features/11-cash-received.md) and assigning an Unknown Received RV to an
// apartment (PAY-008, 10-make-payment.md). Money goes into OUR accounts and OUR apartment only.
// Old EM: Unknown Received › Deposit lists BANK accounts only, so unknown receipts go into our bank account.
import { test } from '@fixtures/collection.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { uniqueName } from '@helpers/names';
import { toast } from '@components/Toast';
import { dropdownOptions, openDropdown } from '@components/PrimeSelect';
import { createApartment, createCashAccount } from '@data/builders';
import { invoiceStatusBox, accountBalance, apartmentAr, createUnknownReceipt, createUnpaidInvoice, LOCATION } from '@data/collection';
import { ks, todayDmy } from '@pages/collection/common';
import { InvoiceDetailPage } from '@pages/invoices/InvoiceDetailPage';

// Each case builds its own apartment / accounts / invoice through the UI first: give it room.
test.describe.configure({ timeout: 300_000 });

function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}
function caseIssue(description: string) {
  test.info().annotations.push({ type: 'case issue', description });
}

const rvNumber = (rv: string) => Number(rv.replace(/^RV-/, ''));

test.describe('Cash Received · Unknown / Funding', () => {
  test('CR-002 [base] Record Unknown Received (MMK); RV listed for allocation and account balance increases',
    testCase({ id: 'CR-002', source: 'TC_CR_002', priority: 'P1', smoke: true, critical: true }),
    async ({ page, unknownReceivedPage: form, recentReceiptsPage: receipts }) => {
      notChecked('Dashboard, Reports', 'smoke checks the Expected result; shared totals are left to the balances suite');
      caseIssue('Location "MO Zone A/B" does not exist on UAT: "MO - A5" used');
      const amount = 10000;
      const cash = await test.step('Precondition: our MMK cash account (case: "[Cash MMK] 2C2P Account")', () => createCashAccount(page));
      const bank = await test.step('Precondition: our MMK bank account', () => createCashAccount(page, { type: 'BANK' }));
      const balanceBefore = await accountBalance(page, bank.name);
      let lastRv = 0;
      await test.step('Newest RV number before the receipt (Recent Receipts)', async () => {
        await receipts.goto();
        lastRv = rvNumber((await receipts.cells(receipts.rows.first()).rv.innerText()).trim());
      });

      await test.step('1-2. Cash Received › Unknown Received', async () => {
        await form.goto();
        await expect(form.receivedTab).toHaveAttribute('aria-selected', 'true');
      });

      await test.step('3. Date is today and currency MMK by default', async () => {
        await expect.soft(form.date, 'Date default').toHaveValue(todayDmy());
        await expect.soft(form.currency, 'Currency default').toHaveText('MMK');
      });

      await test.step('Test data: a [Cash MMK] account can be the Deposit account', async () => {
        await page.waitForLoadState('networkidle');
        let options: string[] = [];
        await expect(async () => {
          options = await dropdownOptions(page, form.deposit);
          expect(options.length, 'Deposit* list loaded').toBeGreaterThan(1);
        }).toPass({ timeout: 30_000 });
        const cashOffered = options.some(o => o.endsWith(cash.name));
        if (!cashOffered) {
          // Shot with the list OPEN, so the reader sees it offers bank accounts only.
          const list = await openDropdown(page, form.deposit);
          await expect(list.getByRole('option').first()).toBeVisible();
          await evidence(page, 'CR-002_deposit-accounts');
          await page.keyboard.press('Escape');
          await expect(list).toBeHidden();
          // Same list filtered on our cash account's name: nothing found.
          await openDropdown(page, form.deposit, cash.name);
          await evidence(page, 'CR-002_deposit-search-cash');
          await page.keyboard.press('Escape');
        }
        expect.soft(cashOffered, `Deposit* should offer our [CASH MMK] account "${cash.name}" (case data: "[Cash MMK] 2C2P Account"); Old EM lists ${options.filter(o => o.startsWith('[CASH')).length} CASH accounts out of ${options.length} (bank accounts only)`).toBe(true);
      });

      let rv = '';
      await test.step('4-5. Fill the required data (our bank account) and Submit', async () => {
        await form.fill({ amount, account: bank.name, location: LOCATION, remarks: uniqueName('unknown received') });
        await form.submitButton.click();
        await expect(toast(page, 'Cash Receipt has been created successfully')).toBeVisible();
      });

      await test.step('Expected 1: the RV is in Unknown Received Allocation', async () => {
        await form.openAllocation();
        await form.searchAllocation(bank.name);
        const row = form.allocationRow(bank.name);
        await expect(row, `Unknown Received Allocation: RV into ${bank.name}`).toHaveCount(1);
        rv = (await row.getByRole('cell').nth(1).innerText()).trim();
        await expect.soft(row.getByRole('cell').nth(7), 'amount').toHaveText(ks(amount));
        await evidence(page, 'CR-002_allocation');
      });

      await test.step('Expected 2: RV number is the next serial number', async () => {
        expect(rv).toMatch(/^RV-\d+$/);
        expect.soft(rvNumber(rv), `${rv} follows the newest RV before it (RV-${lastRv})`).toBeGreaterThan(lastRv);
      });

      await test.step('Expected 3: the amount is added to the deposit-in account', async () => {
        expect.soft(await accountBalance(page, bank.name), `${bank.name} closing balance`).toBe(balanceBefore + amount);
      });
    });

  test('CR-004 [base] Record Funding Received (MMK); RV in Recent Receipts and account balance increases',
    testCase({ id: 'CR-004', source: 'TC_CR_005', priority: 'P1', smoke: true, critical: true }),
    async ({ page, fundingReceivedPage: form, recentReceiptsPage: receipts }) => {
      notChecked('Dashboard, Reports', 'smoke checks the Expected result; shared totals are left to the balances suite');
      caseIssue('Category "others - EM" and Location "MO - Zone A/B" do not exist on UAT: "Others - Facility" and "MO - A5" used; deposit into our own cash account');
      const amount = 100000;
      const payer = uniqueName('Payer May Myat Thu');
      const acc = await test.step('Precondition: our MMK cash account', () => createCashAccount(page));
      const balanceBefore = await accountBalance(page, acc.name);

      await test.step('1-2. Cash Received › Funding Received', async () => {
        await form.goto();
        await expect(form.payer).toBeVisible();
      });

      await test.step('3-4. Payer; Date is today and Currency MMK by default', async () => {
        await form.payer.fill(payer);
        await expect.soft(form.date, 'Date default').toHaveValue(todayDmy());
        await expect.soft(form.currency, 'Currency default').toHaveText('MMK');
      });

      await test.step('5-7. Required data, Remark, Submit', async () => {
        await form.fill({ payer, amount, category: 'Others - Facility', account: acc.name, location: LOCATION, remarks: 'QE OLD funding' });
        await form.submitButton.click();
        await expect(toast(page, /success/i)).toBeVisible();
      });

      await test.step('Expected 1: the receipt voucher is in Recent Receipts', async () => {
        await receipts.goto();
        const row = await receipts.find(payer);
        await expect(row, `Recent Receipts row for payer "${payer}"`).toHaveCount(1);
        const c = receipts.cells(row);
        await expect.soft(c.rv).toHaveText(/^RV-\d+$/);
        await expect.soft(c.account).toHaveText(acc.name);
        await expect.soft(c.amount).toHaveText(ks(amount));
        await row.scrollIntoViewIfNeeded();
        await evidence(page, 'CR-004_recent-receipts');
      });

      await test.step('Expected 2: the amount is added to the deposit-in account', async () => {
        expect.soft(await accountBalance(page, acc.name), `${acc.name} closing balance`).toBe(balanceBefore + amount);
      });
    });
});

test.describe('Make Payment · Unknown RV assign', () => {
  test('PAY-008 [base] Assign Unknown Received RV to apartment invoices; RV and AR updated',
    testCase({ id: 'PAY-008', source: 'TC_MPM_010', priority: 'P1', smoke: true, critical: true }),
    async ({ page, unknownReceivedPage: list, unknownAssignPage: assign, apartmentSoaPage: soa, recentReceiptsPage: receipts }) => {
      notChecked('Dashboard, Account Receivable list, Contact, Reports (incl. Assign Unknown Received Logs)', 'smoke checks the Expected result');
      const amount = 10000;
      const apt = await test.step('Precondition 1: our apartment with an unpaid invoice', () => createApartment(page));
      const inv = await createUnpaidInvoice(page, apt);
      const bank = await test.step('Our bank account', () => createCashAccount(page, { type: 'BANK' }));
      const { rv } = await test.step('Precondition 2: our unknown cash receipt', () => createUnknownReceipt(page, bank, amount));

      await test.step('1-4. Cash Received › Unknown Received › Allocation › Manage of our RV', async () => {
        await list.goto();
        await list.openAllocation();
        await list.searchAllocation(rv);
        const row = list.allocationRow(rv);
        await expect(row).toHaveCount(1);
        await (await list.manageLink(row)).click();
        await assign.waitLoaded();
        await expect.soft(assign.unknownAmount).toHaveText(new RegExp(ks(amount).replace('.', '\\.')));
      });

      await test.step('5-6. Select the apartment: the amount goes to the first open invoice', async () => {
        await assign.toApartment(apt.name);
        const row = assign.invoiceRow(inv.code);
        await expect(row).toHaveCount(1);
        await expect.soft(row.getByRole('textbox'), 'Pay of the open invoice').toHaveValue(/^10,000\.00/);
        await assign.remark.fill('unknown to apartment');
        await evidence(page, 'PAY-008_assign');
      });

      await test.step('7. Confirm', async () => {
        await assign.confirmButton.click();
        await expect(toast(page)).toBeVisible();
        test.info().annotations.push({ type: 'toast', description: (await toast(page).innerText()).trim() });
      });

      await test.step('Expected: the receipt voucher is updated (no longer unknown, paid to the apartment)', async () => {
        await list.goto();
        await list.openAllocation();
        await list.searchAllocation(rv);
        await expect.soft(list.allocationRow(rv), `${rv} left Unknown Received Allocation`).toHaveCount(0);
        await receipts.goto();
        const row = await receipts.find(rv);
        await expect.soft(row, `${rv} in Recent Receipts`).toHaveCount(1);
        if (await row.count()) {
          await expect.soft(receipts.cells(row).payer, 'Recent Receipts: Payer').toHaveText(apt.name);
          await row.scrollIntoViewIfNeeded();
        }
        await evidence(page, 'PAY-008_recent-receipts');
        await soa.goto(apt.id);
        await expect.soft(soa.paymentRows(inv.code).filter({ hasText: rv }), `S.O.A: ${rv} pays ${inv.code}`).toHaveCount(1);
        await evidence(page, 'PAY-008_soa');
      });

      await test.step('Expected: Account Receivable updated (invoice paid)', async () => {
        expect.soft(await apartmentAr(page, apt), 'Apartment Summary: Accounts Receivable').toBe(0);
        const detail = new InvoiceDetailPage(page);
        await detail.goto(inv.invoiceId);
        await expect.soft(invoiceStatusBox(page, inv), 'invoice status').toHaveText('Paid');
      });

      await test.step('The bank account keeps the receipt (no second posting)', async () => {
        expect.soft(await accountBalance(page, bank.name)).toBe(amount);
      });
    });
});
