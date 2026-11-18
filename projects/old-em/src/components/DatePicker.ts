// src/components/DatePicker.ts — PrimeVue Calendar. The input has inputmode="none" and shows
// dd-mm-yyyy; open it with its "Choose Date" button and click a day.
import { expect, type Locator, type Page } from '@playwright/test';

export async function pickToday(page: Page, chooseDateButton: Locator): Promise<void> {
  const panel = page.getByRole('dialog', { name: 'Choose Date' });
  // A click while the panel is still animating open can miss; open it again and retry.
  await expect(async () => {
    if (!(await panel.isVisible())) await chooseDateButton.click();
    await panel.locator('td.p-datepicker-today > span').click({ timeout: 5_000 });
    await expect(panel).toBeHidden({ timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
}
