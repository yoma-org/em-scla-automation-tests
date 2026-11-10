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
    // The test env (Vercel) can take ~8 s from [Sign in] to /dashboard.
    await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });

    // Login can succeed while every API call is refused (e.g. ERR_PASSWORD_CHANGE_REQUIRED).
    // Fail here with the reason, instead of letting every test fail on an empty page.
    const res = await page.request.get('/api/gw/dashboard/needs-me');
    const body = await res.text();
    if (body.includes('ERR_PASSWORD_CHANGE_REQUIRED')) {
      throw new Error(`${role} (${email}) must change their password on New EM before tests can run. Update ${role.toUpperCase()}_PASSWORD in .env and in CI secrets.`);
    }
    expect(res.ok(), `${role} cannot call the API after login: ${res.status()} ${body.slice(0, 200)}`).toBeTruthy();

    await page.context().storageState({ path: authFile(role) });
  });
}
