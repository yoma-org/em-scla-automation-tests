// src/pages/role-permission/DraftActions.ts — approve / remove / bulk approve as a staff user, on the
// draft screens the role-permission cases use. Page objects of the billing / cash areas find the rows; this
// file only adds what those don't have.
//
// - Invoice / DN draft detail (/invoices/:id/draft): [Approve] [Remove]. Either may ask "Are you sure?".
// - UO / EM draft lists: a checkbox per row + [Bulk Approve] above the table (asks "Are you sure?").
// - Cash outflow draft detail (/cash-outflows/:id/draft): [Approve] [Remove].
import { expect, type Locator, type Page } from '@playwright/test';

/** Clicks a button and accepts Old EM's "Are you sure?" dialog when it shows; waits for `done`. */
export async function clickAndConfirm(page: Page, button: Locator, done: Locator): Promise<void> {
  await button.click();
  const yes = page.getByRole('alertdialog').getByRole('button', { name: /^Yes/ });
  await expect(done.or(yes).first()).toBeVisible({ timeout: 30_000 });
  if (await yes.isVisible()) await yes.click();
  await expect(done).toBeVisible({ timeout: 30_000 });
}

export class DraftDetail {
  readonly approveButton: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });
    // Approver: [Remove]; the draft's creator (Create permission): [Delete].
    this.removeButton = page.getByRole('button', { name: /^(Remove|Delete)$/ });
  }
}

/** UO / EM draft list: ticks the rows and clicks Bulk Approve. */
export async function bulkApprove(page: Page, rows: Locator[], done: Locator): Promise<void> {
  for (const row of rows) {
    await expect(row, 'draft row in the list').toHaveCount(1, { timeout: 30_000 });
    const box = row.getByRole('checkbox');
    // PrimeVue: the checkbox input is hidden; click its visible box (input → wrapper → checkbox root).
    await box.locator('xpath=../..').click();
    await expect(box).toBeChecked();
  }
  await clickAndConfirm(page, page.getByRole('button', { name: 'Bulk Approve' }), done);
}
