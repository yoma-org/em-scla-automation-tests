// Sanity · Fixed tickets · Cash Outflow
// Cases: docs/sanity-test/tickets/fixed/fixed-cash-outflow.md. Expected results are Old EM behaviour.
// Read-only: opens the New cash outflow form; never fills or submits it.
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { evidence } from '@helpers/evidence';

const doc = 'docs/sanity-test/tickets/fixed/fixed-cash-outflow.md';

test.describe('Sanity · EM-59 Cash Outflow extra Payment Method / Location fields', () => {
  test('SAN-EM59-001 Cash Outflow form has no Payment Method or Location field',
    sanity({ id: 'SAN-EM59-001', priority: 'P1', doc }),
    async ({ page, cashOutflowPage: outflow }) => {
      await outflow.goto();
      await expect(outflow.form).toBeVisible();

      await test.step('1. Payee*, Date*, Currency, Amount*, Category*, Withdraw From*, Description*, Remarks. No Payment Method and no Location', async () => {
        await expect.soft(outflow.paymentMethod, 'no Payment Method field').toHaveCount(0);
        await expect.soft(outflow.location, 'no Location field').toHaveCount(0);
        expect.soft(await outflow.fieldLabels(), 'fields, in order (Old EM)').toEqual(
          ['Payee', 'Date', 'Currency', 'Amount', 'Category', 'Withdraw From', 'Description', 'Remarks']);
        expect.soft(await outflow.requiredLabels(), 'required (*) fields (Old EM)').toEqual(
          ['Payee', 'Date', 'Amount', 'Category', 'Withdraw From', 'Description']);
        await evidence(page, '01_NEW_cash-outflow-form');
      });
    });
});
