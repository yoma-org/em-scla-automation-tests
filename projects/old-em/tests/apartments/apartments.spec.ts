// Apartments (../em/docs/test-cases/features/08-apartments.md). Each test creates its own apartment:
// unit "QE<mmdd><rand>" in City Loft / CL1 (the case's zone and building). Old EM cannot delete it.
import { test, expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { uniqueUnit } from '@data/builders';

function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

test.describe('Apartments · Create', () => {
  test('APT-001 Create new apartment (zone, building, unit)',
    testCase({ id: 'APT-001', source: 'TC_NewApartment_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, apartmentsListPage: list, apartmentCreatePage: form, invoiceCreatePage, uoCreatePage, emCreatePage }) => {
      const zone = 'City Loft';
      const building = 'CL1';
      const unit = uniqueUnit(); // case: 101 (exists already)
      const name = `${building}-${unit}`;
      notChecked('Cash Received › Unknown to apartment search box', 'needs an unassigned unknown receipt; creating one posts money');

      await test.step('1-2. Apartments › New', async () => {
        await list.goto();
        await page.getByRole('link', { name: 'New' }).click();
        await expect(page).toHaveURL(/\/apartments\/new$/);
      });

      await test.step('3-6. Zone, Building, Unit, Create', async () => {
        await form.selectZone(zone);
        await form.selectBuilding(building);
        await form.unit.fill(unit);
        await expect(form.fullName).toHaveValue(name);
        await form.createButton.click();
        await expect(toast(page, 'Estate created successfully')).toBeVisible();
      });

      await test.step('Expected: apartment in the Apartment listing', async () => {
        await list.goto();
        await list.show(zone, building, name);
        await expect(list.nameLink(name), `${name} in Apartments (${zone} / ${building})`).toBeVisible();
        await evidence(page, 'APT-001_apartment-list');
      });

      const pickers = [
        ['Invoice / Debit Note create', invoiceCreatePage],
        ['UO create', uoCreatePage],
        ['EM create', emCreatePage]
      ] as const;
      for (const [area, form] of pickers) {
        await test.step(`Check area: ${area} › apartment search box`, async () => {
          await form.goto();
          const option = await form.apartment.search(name);
          await expect.soft(option, `${name} in ${area} apartment search`).toBeVisible();
          if (await option.isVisible()) {
            // An open overlay does not survive the screenshot: pick the apartment so the shot shows it.
            await option.click();
            await expect(form.apartment.combobox).toHaveText(name);
          }
          await evidence(page, `APT-001_${area.split(' ')[0].toLowerCase()}-apartment-search`);
        });
      }
    });
});
