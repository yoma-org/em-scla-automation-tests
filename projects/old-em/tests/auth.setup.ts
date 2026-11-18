// tests/auth.setup.ts — logs in every role once and saves its storage state
import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { authFile, credentials, loginRoles } from '@utils/Environment';

for (const role of loginRoles()) {
  setup(`authenticate ${role}`, async ({ page }) => {
    const { email, password } = credentials(role);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(email, password);
    try {
      await expect(page, `${role} (${email}) could not sign in to Old EM; check projects/old-em/.env`)
        .not.toHaveURL(/\/login/, { timeout: 30_000 });
    } catch (error) {
      // The failure snapshot and trace would otherwise keep the password in plain text.
      await loginPage.passwordInput.clear();
      throw error;
    }

    await page.context().storageState({ path: authFile(role) });
  });
}
