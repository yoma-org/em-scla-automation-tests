// Probe, not a test case: records what Old EM shows in each INV-003 "Check area" before and after an invoice
// dated the 1st of last month (+7 days) is created AND approved, so the user can decide the expected check-area results
// for New EM (user request 2026-11-19). Nothing is asserted on the check areas; values go into the report.
// Run: npx playwright test -c projects/old-em tests/probes/check-areas-approved-invoice.spec.ts
import { test } from '@fixtures/billing.fixture';
import { expect } from '@fixtures';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { INV_001, DOC_TOAST, noteOldCoRef, pickPastDay, setupApartment, dmy } from '@data/billing';
import { InvoiceForm } from '@pages/billing/InvoiceForm';
import { InvoiceDocPage } from '@pages/billing/InvoiceDocPage';
import { snapshot } from './snapshot';

// Case INV-003 says 1.6.2025 (+7 days → 8.6.2025), but both EMs only allow last month to today: the user chose
// the 1st of last month (2026-11-19).
const now0 = new Date();
const DATE = new Date(now0.getFullYear(), now0.getMonth() - 1, 1);

test('PROBE INV-003 check areas before / after an approved invoice dated the 1st of last month (Old EM)', { tag: '@probe' }, async ({ page }) => {
  test.setTimeout(600_000);
  const apartment = await test.step('Setup: own apartment with an owner', () => setupApartment(page, { owner: true }));
  const before = await test.step('Before: read every check area', () => snapshot(page, apartment, 'inv003-before'));

  await test.step('Create the INV-003 draft dated the 1st of last month', async () => {
    const form = new InvoiceForm(page, 'invoice');
    await form.goto();
    noteOldCoRef(await form.fill(apartment.name, INV_001));
    const now = new Date();
    const monthsBack = (now.getFullYear() - DATE.getFullYear()) * 12 + now.getMonth() - DATE.getMonth();
    const field = form.date.locator('xpath=ancestor::*[.//button][1]');
    await pickPastDay(page, field.getByRole('button').first(), monthsBack, DATE.getDate());
    await expect(form.date).toHaveValue(dmy(DATE, '-'));
    await evidence(page, 'probe_inv003_form');
    await form.createButton.click();
    await expect(toast(page, DOC_TOAST.invoice.created)).toBeVisible();
    await expect(page).toHaveURL(/\/invoices\/\d+\/draft$/);
  });

  const doc = new InvoiceDocPage(page);
  await test.step('Approve', async () => {
    await doc.total.waitFor();
    test.info().annotations.push({ type: 'probe', description: `draft header: ${(await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 300)}` });
    await doc.approveButton.click();
    await expect(toast(page, DOC_TOAST.invoice.approved)).toBeVisible();
    await expect(doc.refLine).toBeVisible();
    await page.waitForLoadState('networkidle').catch(() => {});
    const header = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
    test.info().annotations.push({ type: 'probe', description: `approved invoice: ${header.slice(0, 500)}` });
    await evidence(page, 'probe_inv003_approved');
  });

  const after = await test.step('After: read every check area', () => snapshot(page, apartment, 'inv003-after'));
  const table = Object.keys({ ...before, ...after }).map(k => ({ area: k, before: before[k], after: after[k], changed: before[k] !== after[k] }));
  await test.info().attach('check-areas.json', { body: JSON.stringify({ apartment: apartment.name, table }, null, 2), contentType: 'application/json' });
  for (const r of table) test.info().annotations.push({ type: 'probe', description: `${r.changed ? 'CHANGED' : 'same'} · ${r.area} · before: ${r.before} · after: ${r.after}` });
});
