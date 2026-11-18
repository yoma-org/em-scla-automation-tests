// Invoice & Debit Note (../em/docs/test-cases/features/04-invoice-debit-note.md). Each test bills its own new
// apartment (City Loft / CL1), with a new owner when the case checks the contact. Old EM cannot delete
// approved documents: they stay on UAT under the QE apartment.
import { test } from '@fixtures/billing.fixture';
import { expect } from '@fixtures';
import { type Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { INV_001, INV_020, createInvoiceDraft, noteOldCoRef, dmy, ks, amountOf, today, setupApartment } from '@data/billing';
import { checkPostedAreas, notChecked } from '@helpers/billing-checks';
import { type InvoiceDraftsPage } from '@pages/billing/InvoiceListsPages';

/** Waits for Old EM's success toast and records its exact text next to the case's wording. */
async function successToast(page: Page, pattern: RegExp, caseWording: string): Promise<void> {
  const t = toast(page, pattern);
  await expect(t, `success message (case: "${caseWording}")`).toBeVisible();
  test.info().annotations.push({ type: 'observed', description: `toast "${(await t.innerText()).trim()}" (case wording: "${caseWording}")` });
}

const DRAFT_CHECK_AREAS = 'a draft is not posted: Old EM posts an invoice / debit note on approval (checked in the approve case)';

async function openDraftFromList(page: Page, drafts: InvoiceDraftsPage, apartment: string, type: string) {
  await drafts.filterApartment(apartment);
  const row = drafts.row(apartment).filter({ hasText: type });
  await expect(row).toHaveCount(1);
  return row;
}

test.describe('Invoices · Invoice', () => {
  test.describe.configure({ timeout: 300_000 });

  test('INV-001 Create generic invoice (MMK, dated last month to today) as draft',
    testCase({ id: 'INV-001', source: 'TC_Inv_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, invoiceForm: form, invoiceDraftsPage: drafts, invoiceDocPage: doc, draftCounters }) => {
      const apartment = await test.step('Setup: own apartment', () => setupApartment(page)); // case: A1-205
      const e = INV_001.expected;
      const pendingBefore = await draftCounters.read('invoice');

      await test.step('1-2. Invoices / Debit Note › Add Invoice', async () => {
        await page.getByRole('menuitem', { name: 'invoices-debit-note.menu' }).click();
        await page.getByRole('link', { name: 'Add Invoice' }).click();
        await expect(page).toHaveURL(/\/invoices\/add-invoice$/);
        await form.description.waitFor();
      });

      await test.step('3. Currency MMK and Date today by default', async () => {
        await expect.soft(form.currency, 'default currency').toHaveText('MMK');
        await expect.soft(form.date, 'default date').toHaveValue(dmy(today(), '-'));
      });

      await test.step('4-5. Fill; Disc. Price, Tax and Total are calculated', async () => {
        noteOldCoRef(await form.fill(apartment.name, INV_001));
        await expect.poll(async () => amountOf(await form.total.inputValue()), 'line Total').toBe(e.total);
        expect.soft(amountOf(await form.discPrice.inputValue()), 'line Disc. Price (1,500 − 10 %)').toBe(e.discPrice);
        expect.soft(amountOf(await form.tax.inputValue()), 'line Tax (3 % of 2,700)').toBe(e.tax);
        const footer = (await form.footer.innerText()).replace(/\s+/g, ' ');
        expect.soft(footer, 'footer totals').toContain(`Gross Total : ${ks(e.gross)}`);
        expect.soft(footer, 'footer discount').toMatch(new RegExp(`Discount : \\(?${ks(e.discount)}\\)?`));
        expect.soft(footer, 'footer commercial tax').toContain(`Commercial Tax : ${ks(e.tax)}`);
        expect.soft(footer, 'footer grand total').toContain(`Grand Total : ${ks(e.grand)}`);
        await evidence(page, 'INV-001_form-totals');
      });

      await test.step('6. Create → Expected 1: success message', async () => {
        await form.createButton.click();
        await successToast(page, /Invoice .*successfully/i, 'Invoice is successfully issued');
      });

      await test.step('Expected 2: saved as draft in Inv/DN', async () => {
        await expect(page).toHaveURL(/\/invoices\/\d+\/draft$/);
        await expect.soft(doc.draftBadge, 'DRAFT badge').toBeVisible();
        await expect.soft(doc.total, 'draft total').toHaveText(`Total: ${ks(e.grand)}`);
        await drafts.goto();
        const row = await openDraftFromList(page, drafts, apartment.name, 'INVOICE');
        await expect.soft(row, 'draft row category / total').toContainText(new RegExp(`Maintenance Services.*${ks(e.grand)}`));
        await evidence(page, 'INV-001_draft-list');
      });

      await test.step('Expected 3: approver is notified (Inv/DN pending counter lists the draft)', async () => {
        const pending = await draftCounters.read('invoice');
        test.info().annotations.push({ type: 'observed', description: `Inv/DN pending counter ${pendingBefore} → ${pending} (shared UAT: other testers change it too)` });
        expect.soft(pending, 'Inv/DN pending counter in the top bar').toBeGreaterThan(0);
        await draftCounters.open('invoice');
        await drafts.filterApartment(apartment.name);
        await expect.soft(drafts.row(apartment.name).filter({ hasText: 'INVOICE' }), 'new draft in the list behind the Inv/DN counter').toHaveCount(1);
      });
      notChecked('Dashboard / AR / Apartment / Contact / Report', DRAFT_CHECK_AREAS);
    });

  test('INV-017 Approve invoice - ref number, tax included, unpaid in apartment',
    testCase({ id: 'INV-017', source: 'TC_Inv_021', priority: 'P1', smoke: true, critical: true }),
    async ({ page, invoiceDraftsPage: drafts, invoiceDocPage: doc }) => {
      const e = INV_001.expected;
      const apartment = await test.step('Setup: own apartment with an owner', () => setupApartment(page, { owner: true }));
      await test.step('Setup: draft invoice (INV-001 data)', () => createInvoiceDraft(page, apartment, 'invoice', INV_001));

      await test.step('1-3. Inv/DN on the top › the invoice › Manage', async () => {
        await page.getByRole('link', { name: 'Inv/DN', exact: true }).click();
        await expect(page).toHaveURL(/\/invoices\/draft$/);
        const row = await openDraftFromList(page, drafts, apartment.name, 'INVOICE');
        await drafts.manageLink(row).click();
        await expect(page).toHaveURL(/\/invoices\/\d+\/draft$/);
        await doc.total.waitFor();
      });

      await test.step('4. Check the data', async () => {
        await expect.soft(doc.draftBadge).toBeVisible();
        await expect.soft(doc.total).toHaveText(`Total: ${ks(e.grand)}`);
      });

      await test.step('5. Approve → Expected 1: approved with ref number', async () => {
        await doc.approveButton.click();
        await successToast(page, /Invoice .*approved successfully/i, 'Invoice approved successfully with ref number');
        await expect(doc.refLine, 'invoice ref number (#Inv-YYYYMM-NNNNN CoRef : …)').toBeVisible();
      });
      const { code } = await doc.ref();
      test.info().annotations.push({ type: 'data', description: `${apartment.name}: ${code}` });

      await test.step('Expected 2: commercial tax included', async () => {
        const footer = (await doc.footer.innerText()).replace(/\s+/g, ' ');
        expect.soft(footer, 'commercial tax on the approved invoice').toMatch(new RegExp(`Comm\\w* Tax ${ks(e.tax)}`));
        expect.soft(footer, 'grand total = gross − discount + tax').toContain(`Grand Total ${ks(e.grand)}`);
        await expect.soft(doc.refLine, 'status on the invoice').toContainText(/Unpaid/i);
        await evidence(page, 'INV-017_approved-invoice');
      });

      await test.step('Expected 3 + check areas: unpaid in the apartment', () =>
        checkPostedAreas(page, 'INV-017', { code, category: INV_001.category, amount: e.grand, apartment, apartmentAR: e.grand }));
    });
});

test.describe('Invoices · Debit note', () => {
  test.describe.configure({ timeout: 300_000 });

  test('INV-020 Create debit note (MMK, dated last month to today) as draft',
    testCase({ id: 'INV-020', source: 'TC_Inv_024', priority: 'P1', smoke: true, critical: true }),
    async ({ page, debitNoteForm: form, invoiceDraftsPage: drafts, invoiceDocPage: doc, draftCounters }) => {
      const apartment = await test.step('Setup: own apartment', () => setupApartment(page)); // case: A1-205
      const total = INV_020.expected.total;
      const pendingBefore = await draftCounters.read('invoice');

      await test.step('1-2. Invoices / Debit Note › Add Debit Note', async () => {
        await page.getByRole('menuitem', { name: 'invoices-debit-note.menu' }).click();
        await page.getByRole('link', { name: 'Add Debit Note' }).click();
        await expect(page).toHaveURL(/\/invoices\/add-debit-note$/);
        await form.description.waitFor();
      });

      await test.step('3-4. Fill; Currency MMK and Date today by default', async () => {
        await expect.soft(form.currency, 'default currency').toHaveText('MMK');
        await expect.soft(form.date, 'default date').toHaveValue(dmy(today(), '-'));
        noteOldCoRef(await form.fill(apartment.name, INV_020));
      });

      await test.step('5. Total = Unit × Gross price, calculated', async () => {
        await expect.poll(async () => amountOf(await form.total.inputValue()), 'line Total (150 × 1,500)').toBe(total);
        expect.soft((await form.footer.innerText()).replace(/\s+/g, ' '), 'footer grand total').toContain(`Grand Total : ${ks(total)}`);
        await evidence(page, 'INV-020_form-totals');
      });

      await test.step('6. Create → Expected 1: success message', async () => {
        await form.createButton.click();
        await successToast(page, /Debit Note .*successfully/i, 'debit note has been create successfully');
      });

      await test.step('Expected 2: saved as draft in Inv/DN', async () => {
        await expect(page).toHaveURL(/\/invoices\/\d+\/draft$/);
        await expect.soft(doc.draftBadge, 'DRAFT badge').toBeVisible();
        await expect.soft(doc.total, 'draft total').toHaveText(`Total: ${ks(total)}`);
        await drafts.goto();
        const row = await openDraftFromList(page, drafts, apartment.name, 'DEBIT NOTE');
        await expect.soft(row, 'draft row category / total').toContainText(new RegExp(`Internet.*${ks(total)}`));
        await evidence(page, 'INV-020_draft-list');
      });

      await test.step('Expected 3: approver is notified (Inv/DN pending counter lists the draft)', async () => {
        const pending = await draftCounters.read('invoice');
        test.info().annotations.push({ type: 'observed', description: `Inv/DN pending counter ${pendingBefore} → ${pending} (shared UAT: other testers change it too)` });
        expect.soft(pending, 'Inv/DN pending counter in the top bar').toBeGreaterThan(0);
        await draftCounters.open('invoice');
        await drafts.filterApartment(apartment.name);
        await expect.soft(drafts.row(apartment.name).filter({ hasText: 'DEBIT NOTE' }), 'new draft in the list behind the Inv/DN counter').toHaveCount(1);
      });
      notChecked('Dashboard / AR / Apartment / Contact / Report', DRAFT_CHECK_AREAS);
    });

  test('INV-031 Approve debit note - ref number, unpaid in apartment',
    testCase({ id: 'INV-031', source: 'TC_Inv_039', priority: 'P1', smoke: true, critical: true }),
    async ({ page, invoiceDraftsPage: drafts, invoiceDocPage: doc }) => {
      const total = INV_020.expected.total;
      const apartment = await test.step('Setup: own apartment with an owner', () => setupApartment(page, { owner: true }));
      await test.step('Setup: draft debit note (INV-020 data)', () => createInvoiceDraft(page, apartment, 'debit-note', INV_020));

      await test.step('1-3. Inv/DN on the top › the debit note › Manage', async () => {
        await page.getByRole('link', { name: 'Inv/DN', exact: true }).click();
        await expect(page).toHaveURL(/\/invoices\/draft$/);
        const row = await openDraftFromList(page, drafts, apartment.name, 'DEBIT NOTE');
        await drafts.manageLink(row).click();
        await expect(page).toHaveURL(/\/invoices\/\d+\/draft$/);
        await doc.total.waitFor();
      });

      await test.step('4. Check the data', async () => {
        await expect.soft(doc.draftBadge).toBeVisible();
        await expect.soft(doc.total).toHaveText(`Total: ${ks(total)}`);
      });

      await test.step('5. Approve → Expected 1: DN approved with ref number', async () => {
        await doc.approveButton.click();
        await successToast(page, /Debit Note .*approved successfully/i, 'Debit note (DN) approved successfully with ref number');
        await expect(doc.refLine, 'debit note ref number (#DN-YYYYMM-NNNNN CoRef : …)').toHaveText(/^#DN-\d{6}-\d+\s*CoRef/);
        await expect.soft(doc.refLine, 'status on the debit note').toContainText(/Unpaid/i);
        await evidence(page, 'INV-031_approved-debit-note');
      });
      const { code } = await doc.ref();
      test.info().annotations.push({ type: 'data', description: `${apartment.name}: ${code}` });

      await test.step('Expected 2 + check areas: DN unpaid in the apartment', () =>
        checkPostedAreas(page, 'INV-031', { code, category: INV_020.category, amount: total, apartment, apartmentAR: total }));
    });
});

