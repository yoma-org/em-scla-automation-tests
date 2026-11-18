// Cash Transfer (../em/docs/test-cases/features/14-cash-transfer.md). Transfers between two of OUR MMK cash accounts
// (QE OLD <date>-<rand> Cash), so both balances are exact.
import { test } from '@fixtures/collection.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { uniqueName } from '@helpers/names';
import { toast } from '@components/Toast';
import { createCashAccount } from '@data/builders';
import { accountBalance } from '@data/collection';
import { ks, todayDmy } from '@pages/collection/common';
import { approveDraft } from '@pages/wallet/common';

// Each case builds its own apartment / accounts / invoice through the UI first: give it room.
test.describe.configure({ timeout: 300_000 });

function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

test.describe('Cash Transfer', () => {
  test('CT-001 [base] Transfer between MMK accounts; JV listed and both balances updated',
    testCase({ id: 'CT-001', source: 'TC_CT_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, cashTransferPage: form, cashTransferDraftsPage: drafts }) => {
      notChecked('Dashboard, Reports', 'smoke checks the Expected result');
      test.info().annotations.push({ type: 'case issue', description: 'D2: the case does not mention approval. Old EM saves the JV as a draft; it is approved (admin, top-bar JV) before the Recent Transfers / balance checks, as the business summary says a JV posts on approval' });
      const amount = 100000;
      const from = await test.step('Precondition: our MMK cash account "from" with 200,000 Ks', () => createCashAccount(page, { name: uniqueName('Cash Facility'), initialBalance: 200000 }));
      const to = await test.step('Precondition: our MMK cash account "to"', () => createCashAccount(page, { name: uniqueName('Cash Golf') }));
      const description = uniqueName('For Maintainance cost');

      await test.step('1-5. Cash Transfer: from / to [..MMK], Date today, Amount Sent, Description', async () => {
        await form.goto();
        await expect.soft(form.date, 'Date default').toHaveValue(todayDmy());
        await form.fill({ from: from.name, to: to.name, amount, description });
      });

      await test.step('6. Submit', async () => {
        await form.submitButton.click();
        const t = toast(page);
        await expect(t).toBeVisible();
        const text = (await t.innerText()).trim();
        test.info().annotations.push({ type: 'toast', description: text });
        expect.soft(text, 'Expected 1: "Transaction Added Successfully"').toMatch(/success/i);
      });

      await test.step('Approve the JV draft (top-bar JV › Manage › Approve)', async () => {
        await page.getByRole('link', { name: 'JV', exact: true }).click();
        await expect(drafts.heading).toBeVisible();
        const row = await drafts.find(description);
        await expect(row, `Draft: Cash Transfer row "${description}"`).toHaveCount(1);
        await drafts.openApprove(row);
        await approveDraft(page);
        await expect(toast(page, /approv|success/i)).toBeVisible();
      });

      await test.step('Expected 2: the JV is in Recent Transfers', async () => {
        await form.goto();
        const row = form.recentRow(description);
        await expect(row, `Recent Transfers row "${description}"`).toHaveCount(1);
        const c = row.getByRole('cell');
        await expect.soft(c.nth(0), 'JV#').toHaveText(/^JV-\d+$/);
        await expect.soft(c.nth(2)).toHaveText(from.name);
        await expect.soft(c.nth(3)).toHaveText(to.name);
        await expect.soft(c.nth(4)).toHaveText(ks(amount));
        await row.scrollIntoViewIfNeeded();
        await evidence(page, 'CT-001_recent-transfers');
      });

      await test.step('Expected 3: both balances updated', async () => {
        expect.soft(await accountBalance(page, from.name), `${from.name} (from)`).toBe(200000 - amount);
        expect.soft(await accountBalance(page, to.name), `${to.name} (to)`).toBe(amount);
      });
    });
});
