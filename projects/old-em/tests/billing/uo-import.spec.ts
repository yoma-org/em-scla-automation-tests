// UO Import (../em/docs/test-cases/features/06-uo-import.md). The test downloads Old EM's CSV template for
// City Loft / CL1, keeps the header and its own apartment's row only (other rows belong to other testers),
// fills that row and uploads it. Files go to the test's output folder.
import { test } from '@fixtures/billing.fixture';
import { expect } from '@fixtures';
import { writeFile } from 'node:fs/promises';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { createApprovedUo, dmy, today, setupApartment } from '@data/billing';
import { notChecked } from '@helpers/billing-checks';
import { parseCsv, toCsv } from '@pages/billing/ImportPage';

const UO_HEADER = ['Apartment', 'Reading Date (DD/MM/YYYY)', 'Electricity (YESC)', 'Electricity (Generator)', 'Treated Water', 'Raw Water'];

test.describe('UO import · Single record', () => {
  test.describe.configure({ timeout: 300_000 });

  test('UOI-001 [base] UO import succeeds in month after last reading - by previous reading source',
    testCase({ id: 'UOI-001', source: 'Uo import r3', priority: 'P1', smoke: true, critical: true }),
    async ({ page, uoImportPage: importPage, uoListPage: list }) => {
      notChecked('Variants 2 (previous = meter reset) and 3 (previous = bulk upload)', 'smoke runs the base row only');
      const apartment = await test.step('Setup: own apartment', () => setupApartment(page)); // case: A1-101
      const last = 10; // case: 10 on 05/01/2025
      const units = 15; // case: 15 on 20/02/2025
      const lastDate = await test.step('Pre-existing data: manual UO reading (10) on the 5th of last month, approved', () =>
        createApprovedUo(page, apartment, {
          'Electricity (YESC)': { previous: 0, current: last },
          'Electricity (Generator)': { previous: 0, current: last },
          'Treated Water': { previous: 0, current: last },
          'Raw Water': { previous: 0, current: last }
        }, { monthsBack: 1, day: 5 }));
      const readingDate = dmy(today());
      test.info().annotations.push({ type: 'data', description: `${apartment.name}: last reading ${dmy(lastDate)} (manual, ${last}); import ${readingDate} (${units})` });

      const file = test.info().outputPath('uo-import.csv');
      await test.step('Download the CSV template (City Loft / CL1) and fill the apartment\'s row', async () => {
        await importPage.goto();
        const template = parseCsv(await importPage.downloadTemplate(apartment.zone, apartment.building, test.info().outputPath('uo-template.csv')));
        expect(template[0], 'UO template header').toEqual(UO_HEADER);
        expect(template.some(r => r[0] === apartment.name), `${apartment.name} in the UO template`).toBe(true);
        await writeFile(file, toCsv([template[0], [apartment.name, readingDate, units, units, units, units]]));
        await test.info().attach('uo-import.csv', { path: file, contentType: 'text/csv' });
      });

      await test.step('Import the file → Expected: import successfully', async () => {
        await importPage.upload(file);
        await expect(importPage.result, 'UO import result message').toBeVisible();
        await expect(importPage.result, 'UO import result').toContainText('1 UO Entry imported');
        await evidence(page, 'UOI-001_import-result');
      });

      await test.step('The imported reading is in Manage UO (previous 10 → 15) with its invoice', async () => {
        await list.goto();
        await list.show(apartment);
        const row = list.rowsOf(apartment.name).filter({ hasText: readingDate });
        await expect(row, `imported reading ${readingDate} in Manage UO`).toHaveCount(1);
        const cells = row.getByRole('cell');
        for (const [i, item] of ['Elec.(YESC)', 'Elec.(GEN)', 'Treated Water', 'Raw Water'].entries()) {
          await expect.soft(cells.nth(2 + i), `${item}: ${units} - ${last} = ${units - last}`).toHaveText(`${units} - ${last} = ${units - last}`);
        }
        await expect.soft(list.docLink(row), 'invoice of the imported reading').toBeVisible();
        await evidence(page, 'UOI-001_uo-list');
      });
    });
});
