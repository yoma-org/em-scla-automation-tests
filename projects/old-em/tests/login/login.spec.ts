// Login (../em/docs/test-cases/features/01-login.md). Starts logged out.
import { test, expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { credentials } from '@utils/Environment';
import { toast } from '@components/Toast';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('AUTH-001 Login with valid credentials lands on dashboard',
    testCase({ id: 'AUTH-001', source: 'TC_Login_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, loginPage, dashboardPage }) => {
      const { email, password } = credentials('admin');

      await test.step('1. Go to the website', async () => {
        await page.goto('/');
        await expect(loginPage.emailInput).toBeVisible();
      });

      await test.step('2-4. Type email and password, click Sign in', async () => {
        await loginPage.login(email, password);
      });

      await test.step('Expected 1. "Logged in Successfully" alert', async () => {
        // Old EM writes "Logged in successfully" (lower-case s); the case's capitalisation is not a behaviour.
        await expect(toast(page, /^Logged in successfully$/i), '"Logged in Successfully" alert').toBeVisible();
      });

      await test.step('Expected 2. Lands on the dashboard', async () => {
        await expect(page).not.toHaveURL(/\/login/);
        await expect(page).toHaveURL(/\/$/);
        await expect(dashboardPage.accountsReceivable, 'Dashboard › Accounts Receivable card').toBeVisible();
        await evidence(page, 'AUTH-001_dashboard');
      });
    });
});
