// Cash Outflow (../em/docs/test-cases/features/13-cash-outflow.md). Each test withdraws from its OWN cash account
// (QE OLD <date>-<rand> Cash, opened with 50,000 Ks) and pays its OWN payee, so balances are exact.
// A PV is a draft until approved (admin approves its own on this UAT).
import { test } from '@fixtures/collection.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { uniqueName } from '@helpers/names';
import { toast } from '@components/Toast';
import { createCashAccount } from '@data/builders';
import { accountBalance, createOutflowDraft } from '@data/collection';
import { draftCounter, ks, todayDmy } from '@pages/collection/common';
import { approveDraft } from '@pages/wallet/common';

function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

const OPENING = 50000;
const AMOUNT = 2000;

test.describe('Cash Outflow', () => {
  test('CO-001 [base] Create Cash Outflow PV (MMK) saved as draft and approver notified',
    testCase({ id: 'CO-001', source: 'TC_CO_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, cashOutflowPage: form, cashOutflowDraftsPage: drafts }) => {
      notChecked('Dashboard, Reports', 'smoke checks the Expected result');
      test.info().annotations.push({ type: 'case issue', description: 'Withdraw from "[Bank MMK] Galaxy Tower 1" is shared UAT data: our own cash account used. "Notification to approver" = the top-bar PV draft counter (Old EM has no other approver notification on screen)' });
      const acc = await test.step(`Precondition: our MMK cash account with ${ks(OPENING)}`, () => createCashAccount(page, { initialBalance: OPENING }));
      const payee = uniqueName('Payee Aung Kyaw');
      const description = uniqueName('to buy tissue');
      let counterBefore = 0;

      await test.step('1. Cash Outflow', async () => {
        await form.goto();
        counterBefore = await draftCounter(page, 'PV');
      });

      await test.step('2-3. Required fields; Date is today and currency MMK by default', async () => {
        await expect.soft(form.date, 'Date default').toHaveValue(todayDmy());
        await expect.soft(form.currency, 'Currency default').toHaveText('MMK');
        await form.fill({ payee, amount: AMOUNT, category: 'Landscaping Expenses', account: acc.name, description });
      });

      await test.step('4. Submit', async () => {
        await form.submitButton.click();
        await expect(toast(page, /success/i)).toBeVisible();
        test.info().annotations.push({ type: 'toast', description: (await toast(page).innerText()).trim() });
      });

      await test.step('Expected 1: the PV is saved as a draft (not posted)', async () => {
        await form.goto();
        await expect.soft(form.recentRow(payee), 'not in Recent Outflows before approval').toHaveCount(0);
        await drafts.goto();
        const row = await drafts.find(payee);
        await expect(row, `Draft: Cash Outflow row for ${payee}`).toHaveCount(1);
        await expect.soft(row).toContainText(ks(AMOUNT));
        await expect.soft(row).toContainText(acc.name);
        await row.scrollIntoViewIfNeeded();
        await evidence(page, 'CO-001_draft-list');
        expect.soft(await accountBalance(page, acc.name), 'a draft does not change the balance').toBe(OPENING);
      });

      await test.step('Expected 2: approver is notified (PV draft counter went up)', async () => {
        await form.goto();
        const after = await draftCounter(page, 'PV');
        expect.soft(after, `top-bar PV counter (was ${counterBefore})`).toBeGreaterThan(counterBefore);
      });
    });

  test('CO-010 Approve Cash Outflow; PV in Recent Outflows and account balance reduced',
    testCase({ id: 'CO-010', source: 'TC_CO_013', priority: 'P1', smoke: true, critical: true }),
    async ({ page, cashOutflowPage: form, cashOutflowDraftsPage: drafts }) => {
      notChecked('Dashboard, Reports', 'smoke checks the Expected result');
      const acc = await test.step(`Precondition: our MMK cash account with ${ks(OPENING)}`, () => createCashAccount(page, { initialBalance: OPENING }));
      const { payee, description } = await test.step('Precondition: our cash outflow draft', () => createOutflowDraft(page, acc, AMOUNT));

      await test.step('1-3. Top-bar "PV" › our draft › Manage', async () => {
        await page.getByRole('link', { name: 'PV', exact: true }).click();
        await drafts.waitLoaded();
        const row = await drafts.find(payee);
        await expect(row).toHaveCount(1);
        await drafts.openManage(row);
      });

      await test.step('4. Check the draft', async () => {
        await expect.soft(drafts.detailField('Payee')).toHaveValue(payee);
        await expect.soft(drafts.detailField('Amount')).toHaveValue(ks(AMOUNT));
        await expect.soft(drafts.detailField('Withdrawl from')).toHaveValue(new RegExp(`${acc.name}$`));
        await expect.soft(drafts.detailField('Description')).toHaveValue(description);
      });

      await test.step('5. Approve', async () => {
        await approveDraft(page);
        await expect(toast(page, /approv|success/i)).toBeVisible();
        test.info().annotations.push({ type: 'toast', description: (await toast(page).innerText()).trim() });
      });

      await test.step('Expected 1-2: approved; the PV is in Recent Outflows', async () => {
        await form.goto();
        const row = form.recentRow(payee);
        await expect(row, `Recent Outflows row for ${payee}`).toHaveCount(1);
        const cells = row.getByRole('cell');
        await expect.soft(cells.nth(1), 'PV number').toHaveText(/^PV-\d+$/);
        await expect.soft(cells.nth(3)).toHaveText(acc.name);
        await expect.soft(cells.nth(7)).toHaveText(ks(AMOUNT));
        await expect.soft(cells.nth(9), 'Approved By').not.toBeEmpty();
        await row.scrollIntoViewIfNeeded();
        await evidence(page, 'CO-010_recent-outflows');
      });

      await test.step('Expected 3: the amount is subtracted from the withdraw-from account', async () => {
        expect.soft(await accountBalance(page, acc.name), `${acc.name} closing balance`).toBe(OPENING - AMOUNT);
      });
    });
});
