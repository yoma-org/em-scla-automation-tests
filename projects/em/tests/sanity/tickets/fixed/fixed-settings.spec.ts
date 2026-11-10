// Sanity · Fixed tickets · Settings
// Cases: docs/sanity-test/tickets/fixed/fixed-settings.md. Expected results are Old EM behaviour.
// Read-only except SAN-EM56-001: it clicks [Create] on a duplicate building name, which New EM must block.
// If EM-56 comes back, that click saves a duplicate building on UAT (the test then fails and names it).
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { evidence } from '@helpers/evidence';
import { getAreas, type Area } from '@api/areas';

const doc = 'docs/sanity-test/tickets/fixed/fixed-settings.md';

test.describe('Sanity · EM-34 General Settings', () => {
  test('SAN-EM34-001 General Settings shows only Old CoRef No.',
    sanity({ id: 'SAN-EM34-001', priority: 'P1', doc }),
    async ({ page, generalSettingsPage: p }) => {
      await test.step('1. The configuration form opens', async () => {
        await p.goto();
        await expect(p.heading).toBeVisible();
      });

      await test.step('2. Only 1 field "Old CoRef No." (Enable/Disable) and Submit', async () => {
        await expect.soft(p.oldCoRefNo, 'Old CoRef No.').toBeVisible();
        await expect.soft(p.oldCoRefNo.getByRole('option'), 'Old CoRef No. options').toHaveText(['Enable', 'Disable']);
        await expect.soft(p.submit, '[Submit]').toBeVisible();
        expect.soft(await p.fieldLabels(), 'fields on the page').toEqual(['Old CoRef No.']);
        await evidence(page, '01_NEW_general-settings');
      });

      await test.step('3. No other CoRef field (prefix / format / next no.)', async () => {
        await expect.soft(p.main.getByText(/co\.?\s?ref.*(prefix|format|next|start|digit|length)/i), 'other CoRef fields').toHaveCount(0);
      });
    });
});

/** Old EM: the 4 fixed UO Pricing types (order not checked). */
const UO_PRICING_TYPES = ['Electricity (YESC)', 'Electricity (Generator)', 'Treated Water', 'Raw Water'];

test.describe('Sanity · EM-35 UO Pricing allows extra records', () => {
  // Read-only: opens Settings › UO Pricing; never clicks Edit.
  test('SAN-EM35-001 UO Pricing has only the 4 fixed types and no New button',
    sanity({ id: 'SAN-EM35-001', priority: 'P1', doc }),
    async ({ page, uoPricingPage: uo }) => {
      await test.step('1. The UO Pricing list opens', async () => {
        await uo.goto();
        await expect(uo.table).toBeVisible();
        await evidence(page, '01_NEW_uo-pricing-list');
      });

      await test.step('2. No [New] button', async () => {
        await expect.soft(uo.newButton, 'no [New] button on UO Pricing').toHaveCount(0);
      });

      await test.step('3. Exactly 4 rows: Electricity (YESC), Electricity (Generator), Treated Water, Raw Water; each with Edit only', async () => {
        const items = await uo.items();
        expect.soft(items.map(i => i.name).sort(), 'UO Pricing rows').toEqual([...UO_PRICING_TYPES].sort());
        for (const i of items) {
          expect.soft(i.actions, `"${i.name}" Manage actions`).toEqual([`Edit ${i.name}`]);
        }
      });
    });
});

test.describe('Sanity · EM-56 Duplicate building', () => {
  test.beforeEach(async ({ browserName }) => {
    // Both browsers would add a duplicate each if the bug is back; one run is enough.
    test.skip(browserName !== 'chromium', 'may write shared UAT data; runs in Chromium only');
  });

  test('SAN-EM56-001 Duplicate building name in the same zone is blocked',
    sanity({ id: 'SAN-EM56-001', priority: 'P1', doc }),
    async ({ page, buildingsPage: p }) => {
      const areas = await getAreas(page.request);
      const sameAs = (b: Area) => (a: Area) => a.type === 'BUILDING' && a.name === b.name && a.parent_id === b.parent_id;
      // Step 1 of the case (save the first building) was done on 11-01: reuse an existing Enable building of an Enable zone.
      const zones = new Map(areas.filter(a => a.type === 'ZONE' && a.status === 'ACTIVE').map(z => [z.id, z.name]));
      const existing = areas.find(a => a.type === 'BUILDING' && a.status === 'ACTIVE' && zones.has(a.parent_id ?? -1)
        && areas.filter(sameAs(a)).length === 1);
      if (!existing) throw new Error('UAT needs an Enable building, with a unique name, in an Enable zone');
      const zone = zones.get(existing.parent_id!)!;

      await test.step(`1. Building "${existing.name}" (${zone}) exists`, async () => {
        await p.goto();
        await expect(p.newButton).toBeVisible();
      });

      await test.step('2. The same Name and Zone is blocked with "Building Name Already Exists."', async () => {
        await p.fillNew(existing.name, zone);
        await expect(p.createButton).toBeEnabled();
        await p.createButton.click();
        await expect.soft(page.getByText(/Building Name Already Exists/i).first(), 'duplicate message').toBeVisible();
        await expect.soft(p.panel, 'Create Building stays open').toBeVisible();
        await evidence(page, '01_NEW_duplicate-blocked');

        const after = (await getAreas(page.request)).filter(sameAs(existing));
        expect.soft(after.map(b => b.id), `buildings named "${existing.name}" in ${zone}`).toEqual([existing.id]);
      });
    });
});

test.describe('Sanity · EM-60 Account Classification', () => {
  test('SAN-EM60-001 Account Classification has a Manage Type section',
    sanity({ id: 'SAN-EM60-001', priority: 'P1', doc }),
    async ({ page, accountClassificationPage: p }) => {
      await test.step('1. Manage Currency, Manage Payment Method, Manage Type, Manage Bank', async () => {
        await p.goto();
        for (const section of ['Manage Currency', 'Manage Payment Method', 'Manage Type', 'Manage Bank'] as const) {
          await expect.soft(p.section(section), section).toBeVisible();
        }
      });

      await test.step('2. Manage Type: New, the list and Edit are available', async () => {
        await expect.soft(p.newAccountType, '[New] account type').toBeVisible();
        await expect(p.accountTypeRows.first(), 'account type list').toBeVisible();
        const names = (await p.accountTypeRows.locator('td:first-child').allInnerTexts()).map(s => s.trim());
        for (const type of ['BANK', 'CASH']) expect.soft(names, 'account types').toContain(type);
        for (const type of names) await expect.soft(p.editAccountType(type), `Edit ${type}`).toBeVisible();
        await p.section('Manage Type').scrollIntoViewIfNeeded();
        await evidence(page, '01_NEW_manage-type');
      });
    });
});
