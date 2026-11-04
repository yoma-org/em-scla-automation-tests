// Sanity · G10 Apartment form
// Cases: docs/sanity-test/tickets/open/g10-apartment-form.md. Expected results are Old EM behaviour.
// The test only fills the form; it never clicks [Create], so it leaves no data behind.
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';

const doc = 'docs/sanity-test/tickets/open/g10-apartment-form.md';

/** Precondition data: building of Zone 1 (created under EM-56) and a building of another zone. */
const zone1 = { name: 'Zone 1', building: 'QA-REPRO-EM-56 Tower' };
const otherZoneBuilding = 'Zone A Commercial Unit'; // in "Commercial Units"

test.describe('Sanity · EM-33 Create Apartment form', () => {
  test.beforeEach(async ({ createApartmentPage }) => {
    await createApartmentPage.goto();
    await expect(createApartmentPage.heading).toBeVisible();
  });

  // Soft assertions: one run reports every check that still differs from Old EM.
  test('SAN-EM33-001 Apartment can only be created in a building of the selected zone',
    sanity({ id: 'SAN-EM33-001', priority: 'P1', doc }),
    async ({ createApartmentPage: p }) => {
      await test.step('1. Building follows the default zone', async () => {
        await expect(p.zone).not.toHaveValue('');
        await expect(p.building).not.toHaveValue('');
      });

      await test.step('2. Building lists only the buildings of Zone 1', async () => {
        await p.zone.selectOption({ label: zone1.name });
        await expect(p.building.locator('option', { hasText: zone1.building })).toHaveCount(1);
        const buildings = await p.optionTexts(p.building);
        expect.soft(buildings, 'Building list of Zone 1').toContain(zone1.building);
        expect.soft(buildings, 'Building list of Zone 1').not.toContain(otherZoneBuilding);
        await expect.soft(p.fullName).toHaveValue(new RegExp(`^${zone1.building}-`));
      });

      await test.step('3. Zone, Building and Unit are marked * and required', async () => {
        for (const field of ['Zone', 'Building', 'Unit'] as const) {
          await expect.soft(p.requiredMark(field), `${field} has *`).toBeVisible();
        }
        await expect.soft(p.createButton, '[Create] locked while Unit is empty').toBeDisabled();
        await p.unit.fill('AT-EM33');
        await expect.soft(p.createButton, '[Create] enabled once Zone, Building and Unit are set').toBeEnabled();
      });

      await test.step('4. The Zone list shows only Enable zones', async () => {
        const zones = await p.optionTexts(p.zone);
        expect.soft(zones.filter(z => /^X0\b/.test(z)), 'Disable ("X0 …") zones in the Zone list').toEqual([]);
      });

      // Retest 2026-11-02 (build -43): EM-33 reopened for checks 5–7.
      await test.step('5. The Zone list has no selectable empty option such as "Zone"', async () => {
        await expect.soft(p.selectableEmptyOptions(p.zone), 'selectable "Zone" placeholder').toHaveCount(0);
      });

      await test.step('6. The Building list has no selectable empty option such as "Building"', async () => {
        await expect.soft(p.selectableEmptyOptions(p.building), 'selectable "Building" placeholder').toHaveCount(0);
      });

      await test.step('7. Status * with [ENABLE] [DISABLE] is on the Create form', async () => {
        await expect.soft(p.statusLabel, 'Status field').toBeVisible();
        await expect.soft(p.statusEnable, '[ENABLE]').toBeVisible();
        await expect.soft(p.statusDisable, '[DISABLE]').toBeVisible();
      });
    });
});
