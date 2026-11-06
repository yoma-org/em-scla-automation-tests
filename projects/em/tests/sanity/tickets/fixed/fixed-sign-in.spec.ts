// Sanity · Fixed tickets · Sign In & Account
// Cases: docs/sanity-test/tickets/fixed/fixed-sign-in.md. Expected results are Old EM behaviour.
// Read-only: opens Change Password but never submits it.
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { evidence } from '@helpers/evidence';

const doc = 'docs/sanity-test/tickets/fixed/fixed-sign-in.md';

test.describe('Sanity · EM-28 Change Password page', () => {
  test('SAN-EM28-001 Change Password page has no Log out everywhere button, so the dialog cannot overflow',
    sanity({ id: 'SAN-EM28-001', priority: 'P2', doc }),
    async ({ page, dashboardPage, changePasswordPage: p }) => {
      await test.step('1. The change password page opens with Current / New / Confirm fields', async () => {
        await dashboardPage.goto();
        await p.openFromAccountMenu();
        for (const [name, field] of Object.entries({ 'Current Password': p.current, 'New Password': p.newPassword,
          'Confirm Password': p.confirm, '[Submit]': p.submit })) {
          await expect.soft(field, name).toBeVisible();
        }
      });

      await test.step('2. No "Log out everywhere" button and no "Log out of every device?" dialog, as in Old EM', async () => {
        await expect.soft(p.logOutEverywhere, '"Log out everywhere" on the page').toHaveCount(0);
        await p.accountMenu.click();
        await expect.soft(p.logOutEverywhere, '"Log out everywhere" in the account menu').toHaveCount(0);
        await page.keyboard.press('Escape');
        await expect.soft(p.logOutDialog, '"Log out of every device?" dialog').toHaveCount(0);
        await evidence(page, '01_NEW_change-password');
      });
    });
});
