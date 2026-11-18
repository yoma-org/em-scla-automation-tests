// Cash and Bank Account (../em/docs/test-cases/features/15-cash-bank-account.md). Each test creates its
// own account (QE OLD <date>-<rand> …). Old EM has no delete for an account with a balance: it stays on UAT.
import { test, expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { uniqueName } from '@helpers/names';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';

/** A check area the test leaves out on purpose, shown in the report. */
function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

test.describe('Cash and Bank Account · Create', () => {
  // Data variant 2 is not run in smoke: base row only.
  test('CBA-001 [base] Create Cash account with initial balance; balance shown in account list',
    testCase({ id: 'CBA-001', source: 'TC_Cash_Bank_Acc_001', priority: 'P1', smoke: true }),
    async ({ page, cashBankAccountsPage: list, cashBankAccountCreatePage: form }) => {
      const name = uniqueName('2C2P Account');
      notChecked('Dashboard and Account Statement report', 'smoke checks the Expected result (account list) only');

      await test.step('1-2. Cash and Bank Account › New', async () => {
        await list.goto();
        await list.newButton.click();
        await expect(page).toHaveURL(/\/cash-and-bank-accounts\/new$/);
        await expect(form.name).toBeVisible();
      });

      await test.step('3. Currency is MMK by default', async () => {
        await expect.soft(form.currency, 'Currency default').toHaveText('MMK');
      });

      await test.step('4-5. Fill the required fields; Type is Cash by default', async () => {
        await form.name.fill(name);
        await form.initialBalance.fill('100000');
        await form.selectPaymentMethods(['Cash']);
        const typeDefault = (await form.type.innerText()).trim();
        if (typeDefault.toUpperCase() !== 'CASH') await evidence(page, 'CBA-001_type-default');
        expect.soft(typeDefault, `Case step 5: Type is "Cash" by default. Old EM shows "${typeDefault}" (no default)`).toMatch(/^cash$/i);
        if (typeDefault.toUpperCase() !== 'CASH') await form.selectType('CASH');
      });

      await test.step('6. Create', async () => {
        await form.createButton.click();
        await expect(toast(page, 'Account has been created successfully')).toBeVisible();
      });

      await test.step('Expected: account with Initial Balance and Closing Balance in the list', async () => {
        await expect(page).toHaveURL(/\/cash-and-bank-accounts$/);
        await list.search.fill(name);
        await expect(list.row(name), `"${name}" in Cash and Bank Account List`).toBeVisible();
        await expect.soft(list.accountCell(name), 'type and currency').toContainText(/CASH\s*MMK/);
        await expect.soft(list.initialBalance(name)).toHaveText(/Initial Balance\s*:\s*100,000\.00 Ks/);
        await expect.soft(list.closingBalance(name)).toHaveText(/Balance\s*\(Closing Balance\)\s*:\s*100,000\.00 Ks/);
        await evidence(page, 'CBA-001_account-list');
      });
    });
});
