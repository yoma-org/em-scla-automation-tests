// Estate Management fee (../em/docs/test-cases/features/07-estate-management-fee.md). Each test bills its own
// new apartment (City Loft / CL1). Old EM turns an approved or imported EM entry into a DEBIT NOTE
// ("DN-YYYYMM-NNNNN", category "Estate Mgmt Fees", due in 45 days).
import { test } from '@fixtures/billing.fixture';
import { expect } from '@fixtures';
import { writeFile } from 'node:fs/promises';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { approveEmDraft, createEmDraft, dmy, emTo, ks, today, setupApartment } from '@data/billing';
import { checkPostedAreas, notChecked } from '@helpers/billing-checks';
import { parseCsv, toCsv } from '@pages/billing/ImportPage';
import { showAllRows } from '@pages/billing/BillingListPages';

const FEE = 30_000;
const EM_HEADER = ['Apartment', 'Monthly Fee', 'No. of Months', 'From  (DD/MM/YYYY)'];

test.describe('EM fee', () => {
  test.describe.configure({ timeout: 300_000 });

  test('EMF-001 Create single EM draft (monthly fee x number of months)',
    testCase({ id: 'EMF-001', source: 'TC_EM_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, emForm: form, emDraftsPage: drafts, draftCounters }) => {
      const months = 5;
      const from = today(); // case: 28-07-2023; Old EM defaults From to today
      const to = emTo(from, months);
      const apartment = await test.step('Setup: own apartment', () => setupApartment(page)); // case: A1-206
      test.info().annotations.push({ type: 'data', description: `${apartment.name}: ${FEE} × ${months} from ${dmy(from)} (case: from 28-07-2023)` });
      const pendingBefore = await draftCounters.read('em');

      await test.step('1-2. EM › New EM Draft', async () => {
        await page.getByRole('menuitem', { name: 'em.menu' }).click();
        await page.getByRole('link', { name: 'New EM Draft' }).click();
        await expect(page).toHaveURL(/\/estate-managements\/new$/);
        await form.submitButton.waitFor();
      });

      await test.step('3-4. Fill; To date filled from From + number of months', async () => {
        await form.apartment.choose(apartment.name);
        await form.fill(FEE, months);
        await expect.soft(form.from, 'From').toHaveValue(dmy(from, '-'));
        await expect.soft(form.to, `To (From + ${months} months − 1 day)`).toHaveValue(dmy(to, '-'));
        await evidence(page, 'EMF-001_em-form');
      });
      notChecked('Step 4 (dates filled from old EM data)', 'new apartment has no earlier EM entry; EMF-007 imports after an earlier EM');

      await test.step('5. Save (Submit) → Expected 1: EM entry created', async () => {
        await form.submitButton.click();
        await expect(toast(page, 'EM Entry saved'), 'EM entry created message').toBeVisible();
        await drafts.goto();
        const r = drafts.row(apartment.name);
        await expect(r.row, 'new draft in EM › Draft Only').toHaveCount(1);
        await expect.soft(r.monthlyFee, 'Monthly Fee').toHaveText(ks(FEE));
        await expect.soft(r.months, 'No. of Months').toHaveText(String(months));
        await expect.soft(r.from, 'From').toHaveText(dmy(from));
        await expect.soft(r.to, 'To').toHaveText(dmy(to));
        await expect.soft(r.amount, 'Amount = monthly fee × months').toHaveText(ks(FEE * months));
        await evidence(page, 'EMF-001_em-draft-list');
      });

      await test.step('Expected 2: approver is notified (EM pending counter lists the draft)', async () => {
        const pending = await draftCounters.read('em');
        test.info().annotations.push({ type: 'observed', description: `EM pending counter ${pendingBefore} → ${pending} (shared UAT: other testers change it too)` });
        expect.soft(pending, 'EM pending counter in the top bar').toBeGreaterThan(0);
        await draftCounters.open('em');
        await showAllRows(page);
        await expect.soft(drafts.row(apartment.name).row, 'new draft in the list behind the EM counter').toHaveCount(1);
      });
      notChecked('Dashboard / AR / Invoice list / Apartment / Contact / Report', 'an EM draft is not posted: the debit note is made on approval (checked in EMF-005)');
    });

  test('EMF-005 Approve EM draft - debit note generated, unpaid in apartment',
    testCase({ id: 'EMF-005', source: 'TC_EM_005', priority: 'P1', smoke: true, critical: true }),
    async ({ page, emDraftsPage: drafts, emListPage: list }) => {
      test.info().annotations.push({ type: 'case issue', description: 'Expected says "invoice (Inv)", but Old EM bills EM with a debit note (source-issues.md); the test expects a DN' });
      const months = 5;
      const amount = FEE * months;
      const apartment = await test.step('Setup: own apartment with an owner', () => setupApartment(page, { owner: true }));
      await test.step('Setup: EM draft', () => createEmDraft(page, apartment, FEE, months));

      await test.step('1-2. EM on the top › the EM entry', async () => {
        await page.getByRole('link', { name: 'EM', exact: true }).click();
        await expect(page).toHaveURL(/\/estate-managements\/draft\/all$/);
        await expect(drafts.row(apartment.name).row).toHaveCount(1);
      });

      await test.step('3-5. Approve → "Are you sure?" → Yes', async () => {
        await drafts.row(apartment.name).row.getByRole('button', { name: 'Approve' }).click();
        await expect(drafts.confirm.root, '"Are you sure?" alert').toBeVisible();
        await drafts.confirm.accept('Yes, approve it');
      });

      let code = '';
      await test.step('Expected 1: EM entry invoiced with ref number', async () => {
        const t = toast(page, /(approved|invoiced) successfully/i);
        await expect(t, 'EM approved / invoiced message').toBeVisible();
        test.info().annotations.push({ type: 'observed', description: `toast "${(await t.innerText()).trim()}" (case wording: "EM Entries with ref number Invoiced Succesfully")` });
        await list.goto();
        await list.show(apartment);
        const row = list.rowsOf(apartment.name);
        await expect(row, 'approved EM in Manage EM').toHaveCount(1);
        await expect(list.docLink(row), 'debit note ref number (DN-YYYYMM-NNNNN) on the EM entry').toBeVisible();
        code = (await list.docLink(row).innerText()).trim();
        await evidence(page, 'EMF-005_em-list');
      });
      test.info().annotations.push({ type: 'data', description: `${apartment.name}: ${code}` });

      await test.step('Expected 2 + check areas: debit note unpaid in the apartment', () =>
        checkPostedAreas(page, 'EMF-005', { code, category: 'Estate Mgmt Fees', amount, apartment, apartmentAR: amount }));
    });

  test('EMF-007 EM bulk import (from date = previous end date + 1) creates entries without approval',
    testCase({ id: 'EMF-007', source: 'TC_EM_007', priority: 'P1', smoke: true, critical: true }),
    async ({ page, emImportPage: importPage, emListPage: list, emDraftsPage: drafts }) => {
      const months = 1;
      const apartment = await test.step('Setup: own apartment with an owner', () => setupApartment(page, { owner: true }));
      await test.step('Setup: old EM data (1 month from today, approved)', async () => {
        await createEmDraft(page, apartment, FEE, 1);
        await approveEmDraft(page, apartment);
      });
      const previousEnd = emTo(today(), 1);
      const from = new Date(previousEnd.getFullYear(), previousEnd.getMonth(), previousEnd.getDate() + 1);
      test.info().annotations.push({ type: 'data', description: `${apartment.name}: old EM ends ${dmy(previousEnd)}; import from ${dmy(from)}` });

      const file = test.info().outputPath('em-import.csv');
      await test.step('1-3. EM › Import › Download CSV Template; fill the apartment\'s row', async () => {
        await page.getByRole('menuitem', { name: 'em.menu' }).click();
        await page.getByRole('link', { name: 'Import' }).click();
        await expect(page).toHaveURL(/\/estate-managements\/import$/);
        await importPage.goto();
        const template = parseCsv(await importPage.downloadTemplate(apartment.zone, apartment.building, test.info().outputPath('em-template.csv')));
        expect(template[0], 'EM template header').toEqual(EM_HEADER);
        expect(template.some(r => r[0] === apartment.name), `${apartment.name} in the EM template`).toBe(true);
        await writeFile(file, toCsv([template[0], [apartment.name, FEE, months, dmy(from)]]));
        await test.info().attach('em-import.csv', { path: file, contentType: 'text/csv' });
      });

      await test.step('4. Upload → Expected 1: EM data created', async () => {
        await importPage.upload(file);
        await expect(importPage.result, 'EM import result message').toBeVisible();
        await expect(importPage.result, 'EM import result').toContainText('1 EM Entry imported');
        await evidence(page, 'EMF-007_import-result');
      });

      let code = '';
      await test.step('Expected 2: imported lines need no approval (debit note at once, no draft)', async () => {
        await list.goto();
        await list.show(apartment);
        const row = list.rowsOf(apartment.name).filter({ hasText: dmy(from) });
        await expect(row, `imported EM from ${dmy(from)} in Manage EM`).toHaveCount(1);
        await expect.soft(row, 'imported EM amount').toContainText(ks(FEE * months));
        await expect(list.docLink(row), 'debit note of the imported EM (no approval)').toBeVisible();
        code = (await list.docLink(row).innerText()).trim();
        await evidence(page, 'EMF-007_em-list');
        await drafts.goto();
        await expect.soft(drafts.row(apartment.name).row, 'no EM draft waiting for approval').toHaveCount(0);
      });
      test.info().annotations.push({ type: 'data', description: `imported debit note ${code}` });

      await test.step('Check areas: imported debit note posted', () =>
        checkPostedAreas(page, 'EMF-007', { code, category: 'Estate Mgmt Fees', amount: FEE * months, apartment, apartmentAR: FEE * 2 }));
    });
});
