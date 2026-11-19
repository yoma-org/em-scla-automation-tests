// Probe, not a test case: what Old EM shows for INV-009's three variants (one required field left empty, then
// Create), so New EM can be compared with it (user request 2026-11-19). Read-only unless Old EM accepts the form.
// Uses the existing QE apartment CL1-QE1119mov6 (made by the INV-003 probe).
import { test } from '@fixtures/billing.fixture';
import { evidence } from '@helpers/evidence';
import { chooseOption } from '@components/PrimeSelect';
import { InvoiceForm } from '@pages/billing/InvoiceForm';

const APT = 'CL1-QE1119mov6';
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

for (const missing of ['apartment', 'item description', 'income category'] as const) {
  test(`PROBE INV-009 missing ${missing} (Old EM)`, { tag: '@probe' }, async ({ page }) => {
    test.setTimeout(180_000);
    const form = new InvoiceForm(page, 'invoice');
    await form.goto();
    if (missing !== 'apartment') await form.apartment.choose(APT);
    if (await form.oldCoRef.isVisible()) await form.oldCoRef.fill(`QEOLD${Date.now()}`);
    if (missing !== 'income category') await chooseOption(page, form.category, 'Maintenance Services');
    await chooseOption(page, form.paymentTerms, '+7 days');
    if (missing !== 'item description') await form.description.fill('Maintenance fees');
    await chooseOption(page, form.taxType, '3% Tax');
    await form.unit.click(); await form.unit.pressSequentially('2');
    await form.grossPrice.click(); await form.grossPrice.pressSequentially('1500');
    await page.locator('[data-pc-name="inputswitch"]').first().click(); // Discount % → Ks (PrimeVue InputSwitch root, as InvoiceCalcForm)
    await form.discount.click(); await form.discount.pressSequentially('10');
    await page.getByText('Remarks', { exact: true }).click();
    await page.waitForTimeout(1500);
    const figs = async () => `Disc ${await form.discPrice.inputValue()} | Tax ${await form.tax.inputValue()} | Total ${await form.total.inputValue()} | footer ${clean(await form.footer.innerText()).replace(/.*Gross Total/, 'Gross Total')}`;
    console.log(`OLD missing ${missing} before Create: discount "${await form.discount.inputValue()}" | ${await figs()}`);
    const urlBefore = page.url();
    await form.createButton.click();
    await page.waitForTimeout(2000);
    const errors = await page.locator('.p-error, .text-danger, .invalid-feedback, small.p-invalid, [class*="error"]').allInnerTexts();
    const toasts = await page.locator('.p-toast-message, [role="alert"]').allInnerTexts();
    console.log(`OLD missing ${missing}: url ${urlBefore === page.url() ? 'unchanged (no invoice)' : page.url()} | field errors: ${errors.map(clean).filter(Boolean).join(' | ') || '(none)'} | toasts/alerts: ${toasts.map(clean).filter(Boolean).join(' | ') || '(none)'}`);
    console.log(`OLD missing ${missing} after Create: ${await figs()}`);
    await evidence(page, `probe_inv009_${missing.replace(' ', '-')}`);
  });
}
