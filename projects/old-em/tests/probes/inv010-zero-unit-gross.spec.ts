// Probe, not a test case: what Old EM shows for INV-010 (Unit 0 / Gross price 0, then Create), so New EM can be
// compared with it (user request 2026-11-19). Uses the existing QE apartment CL1-QE1119mov6.
import { test } from '@fixtures/billing.fixture';
import { evidence } from '@helpers/evidence';
import { chooseOption } from '@components/PrimeSelect';
import { InvoiceForm } from '@pages/billing/InvoiceForm';

const APT = 'CL1-QE1119mov6';
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

for (const v of [{ field: 'Unit', unit: '0', gross: '1500' }, { field: 'Gross price', unit: '2', gross: '0' }]) {
  test(`PROBE INV-010 ${v.field} 0 (Old EM)`, { tag: '@probe' }, async ({ page }) => {
    test.setTimeout(180_000);
    const popups: string[] = [];
    page.on('dialog', async d => { popups.push(d.message()); await d.dismiss().catch(() => {}); });
    const form = new InvoiceForm(page, 'invoice');
    await form.goto();
    await form.apartment.choose(APT);
    if (await form.oldCoRef.isVisible()) await form.oldCoRef.fill(`QEOLD${Date.now()}`);
    await chooseOption(page, form.category, 'Maintenance Services');
    await chooseOption(page, form.paymentTerms, '+7 days');
    await form.description.fill('Maintenance fees');
    await chooseOption(page, form.taxType, '3% Tax');
    await form.unit.click(); await form.unit.pressSequentially(v.unit);
    await form.grossPrice.click(); await form.grossPrice.pressSequentially(v.gross);
    await page.locator('[data-pc-name="inputswitch"]').first().click(); // Discount % → Ks
    await form.discount.click(); await form.discount.pressSequentially('10');
    await page.getByText('Remarks', { exact: true }).click();
    await page.waitForTimeout(1500);
    console.log(`OLD ${v.field} 0 before Create: unit "${await form.unit.inputValue()}" gross "${await form.grossPrice.inputValue()}" discount "${await form.discount.inputValue()}" | Total ${await form.total.inputValue()}`);
    const urlBefore = page.url();
    await form.createButton.click();
    await page.waitForTimeout(2500);
    const errors = (await page.locator('.p-error, .text-danger, .invalid-feedback, small, [class*="error"]').allInnerTexts()).map(clean).filter(t => t && t !== '*' && !/\*$/.test(t));
    const toasts = (await page.locator('.p-toast-message, [role="alert"], [role="alertdialog"], .swal2-popup').allInnerTexts()).map(clean).filter(Boolean);
    console.log(`OLD ${v.field} 0 after Create: url ${urlBefore === page.url() ? 'unchanged (no invoice)' : page.url()} | messages: ${[...new Set(errors)].join(' | ') || '(none)'} | pop-ups: ${[...popups, ...toasts].join(' | ') || '(none)'}`);
    await evidence(page, `probe_inv010_${v.field.replace(' ', '-')}-0`);
  });
}
