// tests/auth.setup.ts — logs in every role once and saves its storage state
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { authFile, credentials, roles } from '@utils/Environment';

for (const role of roles) {
  setup(`authenticate ${role}`, async ({ page }) => {
    const { email, password } = credentials(role);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page).not.toHaveURL(/\/login/);

    await page.context().storageState({ path: authFile(role) });
  });
}
