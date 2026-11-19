// Probe, not a test case: records what Old EM shows in each INV-001 "Check area" before and after a DRAFT
// invoice is created, so the user can decide the expected check-area results for New EM.
// Nothing is asserted on the check areas; every value goes into the report (annotation "probe" + JSON).
// Run: npx playwright test -c projects/old-em tests/probes/check-areas-draft-invoice.spec.ts
import { test } from '@fixtures/billing.fixture';
import { INV_001, createInvoiceDraft, setupApartment } from '@data/billing';
import { snapshot } from './snapshot';

test('PROBE INV-001 check areas before / after a draft invoice (Old EM)', { tag: '@probe' }, async ({ page }) => {
  test.setTimeout(600_000);
  const apartment = await test.step('Setup: own apartment with an owner', () => setupApartment(page, { owner: true }));
  const before = await test.step('Before: read every check area', () => snapshot(page, apartment, 'before'));
  await test.step('Create the INV-001 draft invoice (today)', () => createInvoiceDraft(page, apartment, 'invoice', INV_001));
  const after = await test.step('After: read every check area', () => snapshot(page, apartment, 'after'));

  const table = Object.keys({ ...before, ...after }).map(k => ({ area: k, before: before[k], after: after[k], changed: before[k] !== after[k] }));
  await test.info().attach('check-areas.json', { body: JSON.stringify({ apartment: apartment.name, table }, null, 2), contentType: 'application/json' });
  for (const r of table) test.info().annotations.push({ type: 'probe', description: `${r.changed ? 'CHANGED' : 'same'} · ${r.area} · before: ${r.before} · after: ${r.after}` });
});
