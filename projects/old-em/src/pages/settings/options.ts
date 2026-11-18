// src/pages/settings/options.ts — all option texts of a PrimeVue Dropdown once its list has loaded.
// Old EM fills category lists after the list opens (first one empty-message row), so wait for a stable count.
import { expect, type Locator, type Page } from '@playwright/test';

export async function loadedOptions(page: Page, combobox: Locator): Promise<string[]> {
  await combobox.click();
  await expect(combobox).toHaveAttribute('aria-controls', /.+/);
  const list = page.locator(`[id="${await combobox.getAttribute('aria-controls')}"]`);
  await expect(list).toBeVisible();
  let last = -1;
  await expect.poll(async () => {
    const n = await list.getByRole('option').count();
    const stable = n > 1 && n === last;
    last = n;
    return stable;
  }, { message: 'option list loaded', timeout: 30_000, intervals: [1_000] }).toBe(true);
  const texts = (await list.getByRole('option').allInnerTexts()).map(t => t.trim()).filter(Boolean);
  await page.keyboard.press('Escape');
  await expect(list).toBeHidden();
  return texts;
}
