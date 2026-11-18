// tests/seed.spec.ts — starting point for the playwright-test-* agents (start Claude Code with APP=old-em).
// Runs in the `chromium` project, so the page is already logged in as admin.
import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL(/\/login/);
    // generate code here.
  });
});
