// tests/seed.spec.ts — starting point for the playwright-test-* agents.
// Runs in the `chromium` project, so the page is already logged in as admin.
import { test, expect } from '@fixtures';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).not.toHaveURL(/\/login/);
    // generate code here.
  });
});
