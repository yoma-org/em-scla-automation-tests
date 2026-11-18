// Utility Operations — manual entry (../em/docs/test-cases/features/05-utility-operations-uo.md).
// Each test reads the meters of its own new apartment (City Loft / CL1): one UO per apartment per month.
// UO unit prices are global settings another suite (SET-003) changes for a short time, so amounts are taken
// from the draft list and compared with the invoice, never computed from prices.
import { test } from '@fixtures/billing.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { createUoDraft } from '@data/builders';
import { amountOf, dmy, today, waitLoaded, setupApartment } from '@data/billing';
import { checkPostedAreas, notChecked } from '@helpers/billing-checks';
import { type UoReadings } from '@pages/uo/UoCreatePage';
import { showAllRows } from '@pages/billing/BillingListPages';

test.describe('UO · Manual entry', () => {
  test.describe.configure({ timeout: 300_000 });

  test('UO-001 Create single UO reading draft (manual)',
    testCase({ id: 'UO-001', source: 'TC_UO_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, uoCreatePage: form, uoDraftsPage: drafts, draftCounters }) => {
      const apartment = await test.step('Setup: own apartment', () => setupApartment(page)); // case: A - 205
      const readings: UoReadings = {
        'Electricity (YESC)': { previous: 6925, current: 7000 },
        'Electricity (Generator)': { previous: 0, current: 100 },
        'Treated Water': { previous: 0, current: 100 },
        'Raw Water': { previous: 0, current: 100 }
      };
      const pendingBefore = await draftCounters.read('uo');

      await test.step('1-2. UO › New UO Draft', async () => {
        await page.getByRole('menuitem', { name: 'uo.menu' }).click();
        await page.getByRole('link', { name: 'New UO Draft' }).click();
        await expect(page).toHaveURL(/\/utility-operations\/new$/);
        await form.submitButton.waitFor();
      });

      notChecked('Step 5 (date later than the last reading)', 'new apartment has no earlier reading; covered by UO-002');

      await test.step('6. Cannot create with a future date (tried on a second new apartment)', async () => {
        const t = today();
        const tomorrow = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
        if (tomorrow.getMonth() !== t.getMonth()) {
          notChecked('Step 6 (future date)', 'today is the last day of the month; tomorrow is not in the open calendar');
          return;
        }
        // A second apartment, so a wrongly accepted future-dated draft does not block the main flow.
        const probe = await setupApartment(page);
        await form.goto();
        await waitLoaded(page);
        await form.selectApartment(probe.name);
        await form.fillReadings(readings);
        await page.getByRole('button', { name: 'Choose Date' }).click();
        const panel = page.getByRole('dialog', { name: 'Choose Date' });
        const day = panel.locator('td:not(.p-datepicker-other-month) > span').getByText(String(tomorrow.getDate()), { exact: true });
        const pickable = (await day.getAttribute('data-p-disabled')) !== 'true';
        if (pickable) {
          await day.click();
          await expect(panel).toBeHidden();
          await expect(page.getByRole('combobox', { name: 'Select Date' })).toHaveValue(dmy(tomorrow, '-'));
          await form.submitButton.click();
          await expect(toast(page)).toBeVisible({ timeout: 10_000 }).catch(() => {});
          const message = (await toast(page).isVisible()) ? (await toast(page).innerText()).trim() : '(no message)';
          test.info().annotations.push({ type: 'observed', description: `future date ${dmy(tomorrow)} on ${probe.name}: date picker allows it; Submit → ${message}` });
          await evidence(page, 'UO-001_future-date');
          expect.soft(message, `UO with a future date (${dmy(tomorrow)}) must not be saved`).not.toMatch(/saved/i);
        } else {
          await evidence(page, 'UO-001_future-date');
          await page.keyboard.press('Escape');
        }
      });

      await test.step('3-4. Fill the readings (current ≥ previous)', async () => {
        await form.goto();
        await waitLoaded(page);
        await form.selectApartment(apartment.name);
        await form.fillReadings(readings);
      });

      await test.step('7. Save (Submit) → Expected 1: UO entry created', async () => {
        await form.submitButton.click();
        await expect(toast(page, 'UO Entry saved'), 'UO entry created message').toBeVisible();
        await drafts.goto();
        await showAllRows(page);
        const cells = drafts.row(apartment.name).getByRole('cell');
        await expect(drafts.row(apartment.name), 'new draft in UO › Draft Only').toHaveCount(1);
        await expect.soft(cells.nth(3), 'Elec.(YESC) reading').toHaveText('7000 - 6925 = 75');
        await expect.soft(cells.nth(4), 'Elec.(GEN) reading').toHaveText('100 - 0 = 100');
        await expect.soft(cells.nth(5), 'Treated Water reading').toHaveText('100 - 0 = 100');
        await expect.soft(cells.nth(6), 'Raw Water reading').toHaveText('100 - 0 = 100');
        await evidence(page, 'UO-001_uo-draft-list');
      });

      await test.step('Expected 2: approver is notified (UO pending counter lists the draft)', async () => {
        const pending = await draftCounters.read('uo');
        test.info().annotations.push({ type: 'observed', description: `UO pending counter ${pendingBefore} → ${pending} (shared UAT: other testers change it too)` });
        expect.soft(pending, 'UO pending counter in the top bar').toBeGreaterThan(0);
        await draftCounters.open('uo');
        await showAllRows(page);
        await expect.soft(drafts.row(apartment.name), 'new draft in the list behind the UO counter').toHaveCount(1);
      });
      notChecked('Dashboard / AR / Invoice list / Apartment / Contact / Report', 'a UO draft is not posted: the invoice is made on approval (checked in UO-007)');
    });

  test('UO-007 Approve UO draft - invoice generated, unpaid in apartment',
    testCase({ id: 'UO-007', source: 'TC_UO_007', priority: 'P1', smoke: true, critical: true }),
    async ({ page, uoDraftsPage: drafts, uoListPage: list }) => {
      const apartment = await test.step('Setup: own apartment with an owner', () => setupApartment(page, { owner: true }));
      await test.step('Setup: UO draft', () => createUoDraft(page, apartment, {
        'Electricity (YESC)': { previous: 0, current: 10 },
        'Electricity (Generator)': { previous: 0, current: 10 },
        'Treated Water': { previous: 0, current: 10 },
        'Raw Water': { previous: 0, current: 10 }
      }));

      let amount = 0;
      await test.step('1-2. UO on the top bar › the UO entry', async () => {
        await page.getByRole('link', { name: 'UO', exact: true }).click();
        await expect(page).toHaveURL(/\/utility-operations\/draft\/all$/);
        await showAllRows(page);
        await expect(drafts.row(apartment.name)).toHaveCount(1);
        amount = amountOf(await drafts.amount(apartment.name).innerText());
      });

      await test.step('3-5. Approve → "Are you sure?" → Yes', async () => {
        await drafts.row(apartment.name).getByRole('button', { name: 'Approve' }).click();
        await expect(drafts.confirm.root, '"Are you sure?" alert').toBeVisible();
        await drafts.confirm.accept('Yes, approve it');
      });

      let code = '';
      await test.step('Expected 1: UO entry invoiced with ref number', async () => {
        const t = toast(page, /Invoiced Successfully/i);
        await expect(t, 'Invoiced Successfully message').toBeVisible();
        test.info().annotations.push({ type: 'observed', description: `toast "${(await t.innerText()).trim()}" (case wording: "UO Entries with ref number Invoiced Succesfully")` });
        await list.goto();
        await list.show(apartment);
        const row = list.rowsOf(apartment.name);
        await expect(row, 'approved UO in Manage UO').toHaveCount(1);
        await expect(list.docLink(row), 'invoice ref number (Inv-YYYYMM-NNNNN) on the UO entry').toBeVisible();
        code = (await list.docLink(row).innerText()).trim();
        await evidence(page, 'UO-007_uo-list');
      });
      test.info().annotations.push({ type: 'data', description: `${apartment.name}: ${code}, ${amount}` });

      await test.step('Expected 2 + check areas: invoice unpaid in the apartment', () =>
        checkPostedAreas(page, 'UO-007', { code, category: 'Utilities', amount, apartment, apartmentAR: amount }));
    });
});
