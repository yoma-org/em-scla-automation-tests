// src/helpers/evidence.ts — screenshot attached to the test report; these become the Jira retest images.
import { test, type Locator, type Page } from '@playwright/test';

/**
 * animations: 'disabled' finishes open animations, so an open dropdown shows in the shot.
 * mask: blacks out personal data (names, NRC, phone) so the shot can be posted on Jira.
 */
export async function evidence(page: Page, name: string, mask: Locator[] = []): Promise<void> {
  const body = await page.screenshot({ animations: 'disabled', mask, maskColor: '#000' });
  await test.info().attach(name, { body, contentType: 'image/png' });
}
