// Sanity · Fixed tickets · Apartments
// Cases: docs/sanity-test/tickets/fixed/fixed-apartments.md. Expected results are Old EM behaviour.
// Read-only except SAN-EM47-002, which saves owners/tenants on QA apartment 32 and removes them again.
// No test clicks [Create] on the Create Apartment form.
// Zones and buildings come from the areas API at run time: UAT data changes (Zone 1 was disabled on 11-05).
import { type Locator, type Page } from '@playwright/test';
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { getAreas, type Area } from '@api/areas';
import { CreateApartmentPage } from '@pages/apartments/CreateApartmentPage';

const doc = 'docs/sanity-test/tickets/fixed/fixed-apartments.md';

/** Screenshot attached to the report (and to the Jira comment as evidence). */
async function evidence(page: Page, name: string, mask: Locator[] = []) {
  // animations: 'disabled' finishes the dropdown's open animation, so an open list shows in the shot.
  // mask: blacks out personal data (names, NRC, phone) so the shot can go on Jira.
  const body = await page.screenshot({ animations: 'disabled', mask, maskColor: '#000' });
  await test.info().attach(name, { body, contentType: 'image/png' });
}

test.describe('Sanity · EM-33 Create Apartment form', () => {
  let areas: Area[] = [];

  test.beforeEach(async ({ page, createApartmentPage }) => {
    await createApartmentPage.goto();
    await expect(createApartmentPage.heading).toBeVisible();
    await expect(createApartmentPage.zone).not.toHaveText(/Loading/);
    areas = await getAreas(page.request);
  });

  // Soft assertions: one run reports every check that still differs from Old EM.
  test('SAN-EM33-001 Apartment can only be created in a building of the selected zone',
    sanity({ id: 'SAN-EM33-001', priority: 'P1', doc }),
    async ({ page, createApartmentPage: p }) => {
      const activeZones = areas.filter(a => a.type === 'ZONE' && a.status === 'ACTIVE');
      const inactiveZones = areas.filter(a => a.type === 'ZONE' && a.status === 'INACTIVE').map(z => z.name);
      const buildingsOf = (zone: Area) => areas.filter(a => a.type === 'BUILDING' && a.parent_id === zone.id);
      let defaultZone = '';

      await test.step('1. Building follows the default zone', async () => {
        defaultZone = await p.selected(p.zone);
        expect(CreateApartmentPage.placeholderOptions([defaultZone], 'Zone'), `default Zone "${defaultZone}"`).toEqual([]);
        await expect(p.building).toBeEnabled();
        await expect(p.building).not.toHaveText(/Choose a zone first/);
      });

      // An Enable zone other than the default one, with at least one Enable building.
      const zone = activeZones.find(z => z.name !== defaultZone && buildingsOf(z).some(b => b.status === 'ACTIVE'));
      if (!zone) throw new Error('UAT needs a second Enable zone with an Enable building for this case');
      const ownBuildings = buildingsOf(zone).filter(b => b.status === 'ACTIVE').map(b => b.name);
      const otherBuildings = areas
        .filter(a => a.type === 'BUILDING' && a.status === 'ACTIVE' && a.parent_id !== zone.id && !ownBuildings.includes(a.name))
        .map(b => b.name);

      await test.step(`2. Building lists only the buildings of ${zone.name}`, async () => {
        await p.choose(p.zone, zone.name);
        await expect(p.zone).toHaveText(zone.name);
        const buildings = await p.optionTexts(p.building);
        for (const b of ownBuildings) expect.soft(buildings, `Building list of ${zone.name}`).toContain(b);
        expect.soft(buildings.filter(b => otherBuildings.includes(b)), `buildings of other zones in ${zone.name}`).toEqual([]);
        await expect.soft(p.fullName).toHaveValue(`${await p.selected(p.building)}-`);
        await evidence(page, `01_NEW_zone-${zone.name}_buildings`);
      });

      await test.step('3. Zone, Building and Unit are marked * and required', async () => {
        for (const field of ['Zone', 'Building', 'Unit'] as const) {
          await expect.soft(p.requiredMark(field), `${field} has *`).toBeVisible();
        }
        await expect.soft(p.createButton, '[Create] locked while Unit is empty').toBeDisabled();
        await p.unit.fill('AT-EM33');
        await expect.soft(p.createButton, '[Create] enabled once Zone, Building and Unit are set').toBeEnabled();
      });

      let zones: string[] = [];
      await test.step('4. The Zone list shows only Enable zones', async () => {
        zones = await p.optionTexts(p.zone);
        expect.soft(zones.filter(z => inactiveZones.includes(z)), 'Disable zones in the Zone list').toEqual([]);
      });

      // Retest 2026-11-02 (build -43): EM-33 reopened for checks 5–7.
      await test.step('5. The Zone list has no selectable empty option such as "Zone"', async () => {
        expect.soft(CreateApartmentPage.placeholderOptions(zones, 'Zone'), 'selectable "Zone" placeholder').toEqual([]);
        await p.open(p.zone);
        await evidence(page, '02_NEW_zone-list');
        await p.close();
      });

      await test.step('6. The Building list has no selectable empty option such as "Building"', async () => {
        const buildings = await p.optionTexts(p.building);
        expect.soft(CreateApartmentPage.placeholderOptions(buildings, 'Building'), 'selectable "Building" placeholder').toEqual([]);
        await p.open(p.building);
        await evidence(page, '03_NEW_building-list');
        await p.close();
      });

      await test.step('7. Status * with [ENABLE] [DISABLE] is on the Create form', async () => {
        await expect.soft(p.statusLabel, 'Status field').toBeVisible();
        await expect.soft(p.statusEnable, '[ENABLE]').toBeVisible();
        await expect.soft(p.statusDisable, '[DISABLE]').toBeVisible();
        await evidence(page, '04_NEW_status-enable-disable');
      });
    });
});

// Read-only: adds rows and picks a contact on the Edit tab but never clicks [Save], so nothing is stored.
test.describe('Sanity · EM-47 Add Owner / Tenant on the Edit tab', () => {
  /** Apartment created under EM-32. Seed Jane Doe is a seed contact on UAT. */
  const apartment = { id: 32, name: 'QA-REPRO-EM-56 Tower-R32-101' };
  const contactSearch = 'Jane Doe';
  const parties = ['owner', 'tenant'] as const;

  test('SAN-EM47-001 Add Owner / Tenant to an apartment works as on Old EM',
    sanity({ id: 'SAN-EM47-001', priority: 'P1', doc }),
    async ({ page, apartmentEditTab: e }) => {
      // Contact names / NRC on screen: mask them in the evidence.
      const mask = [e.form.getByRole('combobox', { name: /^Select (Owner|Tenant)$/ }), e.contactDialog];

      await test.step('1. Account Name, Enable, tabs Owners/Tenants, Current/Previous, Add More, Save', async () => {
        await e.goto(apartment.id);
        await expect(e.accountName).toHaveValue(apartment.name);
        await expect.soft(e.enable, 'Enable').toBeVisible();
        await expect.soft(e.saveButton, '[Save]').toBeVisible();
        for (const party of parties) {
          await expect.soft(e.partyTab(party), `${party}s tab`).toBeVisible();
        }
        for (const party of parties) {
          await e.partyTab(party).click();
          for (const period of ['current', 'previous'] as const) {
            await expect.soft(e.section(party, period).getByRole('heading', { level: 3 }), `${period} ${party}s heading`)
              .toHaveText(period === 'current' ? 'Current' : 'Previous');
            await expect.soft(e.addMore(party, period), `Add More ${period} ${party}`).toBeVisible();
          }
        }
        // Old EM has no Delete apartment button on this tab (seen on New EM build -37).
        await expect.soft(e.deleteApartmentButton, 'no [Delete apartment] (not on Old EM)').toHaveCount(0);
        await e.partyTab('owner').click();
        await evidence(page, '01_NEW_edit-tab', mask);
      });

      for (const [i, party] of parties.entries()) {
        const date = party === 'owner' ? 'Ownership' : 'Tenancy';

        await test.step(`2${'ab'[i]}. Current › Add More: Select ${party} + ${date} Start Date + ☑ Current + delete`, async () => {
          await e.partyTab(party).click();
          const n = (await e.rows(party, 'current').count()) + 1;
          await e.addMore(party, 'current').click();
          const row = e.row(party, 'current', n);
          await expect(row, `Current ${party} ${n} row added`).toBeVisible();
          const f = e.rowFields(row, party);
          await expect.soft(f.contact, `Select ${party}`).toBeVisible();
          await expect.soft(f.startDate, `${date} Start Date`).toBeVisible();
          await expect.soft(f.startDate).toHaveAttribute('placeholder', 'DD-MM-YYYY');
          await expect.soft(f.current, '☑ Current').toBeChecked();
          await expect.soft(f.endDate, 'no End Date on a current row').toHaveCount(0);
          await expect.soft(f.remove, 'delete button').toBeVisible();

          // Select <party> searches contacts by name, as on Old EM.
          const picked = await e.pickContact(f.contact, contactSearch);
          await expect.soft(f.contact, 'picked contact shown in the row').toContainText(picked);
          await evidence(page, `0${2 + i * 2}_NEW_${party}-current-row`, mask);
        });

        await test.step(`3${'ab'[i]}. Previous › Add More: Select ${party} + Start + End Date`, async () => {
          const n = (await e.rows(party, 'previous').count()) + 1;
          await e.addMore(party, 'previous').click();
          const row = e.row(party, 'previous', n);
          await expect(row, `Previous ${party} ${n} row added`).toBeVisible();
          const f = e.rowFields(row, party);
          await expect.soft(f.contact, `Select ${party}`).toBeVisible();
          await expect.soft(f.startDate, `${date} Start Date`).toBeVisible();
          await expect.soft(f.endDate, `${date} End Date`).toBeVisible();
          await expect.soft(f.current, 'no Current checkbox on a previous row').toHaveCount(0);
          await expect.soft(f.remove, 'delete button').toBeVisible();
          await evidence(page, `0${3 + i * 2}_NEW_${party}-previous-row`, mask);
        });
      }
    });
});

// WRITES DATA: saves owners and tenants on apartment 32 (QA-REPRO-EM-56 Tower-R32-101, a QA apartment),
// then removes them again. The apartment is cleared before and after the test, so a failed run is undone next time.
test.describe('Sanity · EM-47 Save Owner / Tenant', () => {
  const apartment = { id: 32, name: 'QA-REPRO-EM-56 Tower-R32-101' };
  // Seed contacts on UAT. Dates are DD-MM-YYYY on the form, DD/MM/YYYY on Summary.
  const rows = [
    { party: 'owner', period: 'current', search: 'Jane Doe', start: '01-11-2026', card: 'Owner Details', label: 'Owner:' },
    { party: 'owner', period: 'previous', search: 'John Smith', start: '01-01-2025', end: '31-10-2026', card: 'Previous Owner Details', label: 'Owner:' },
    { party: 'tenant', period: 'current', search: 'Mya Thida', start: '01-11-2026', card: 'Tenant Details', label: 'Tenant:' },
    { party: 'tenant', period: 'previous', search: 'Aung Kyaw', start: '01-01-2025', end: '31-10-2026', card: 'Previous Tenant Details', label: 'Tenant:' }
  ] as const;
  const slash = (d: string) => d.replaceAll('-', '/');

  test.beforeEach(async ({ apartmentEditTab, browserName }) => {
    // Browsers run in parallel and would overwrite each other's rows on the same apartment.
    test.skip(browserName !== 'chromium', 'writes shared UAT data; runs in Chromium only');
    await apartmentEditTab.clearContacts(apartment.id);
  });

  test.afterEach(async ({ apartmentEditTab, browserName }) => {
    if (browserName !== 'chromium') return;
    await apartmentEditTab.clearContacts(apartment.id);
  });

  test('SAN-EM47-002 Saved Owner / Tenant show on Summary and Edit',
    sanity({ id: 'SAN-EM47-002', priority: 'P1', doc }),
    async ({ page, apartmentEditTab: e, apartmentSummaryTab: s }) => {
      const picked: string[] = [];

      await test.step('1. [Save] stores current and previous owners and tenants and opens Summary', async () => {
        await e.goto(apartment.id);
        for (const r of rows) {
          picked.push(await e.addRow(r.party, r.period, r.search, r.start, 'end' in r ? r.end : undefined));
        }
        const put = page.waitForResponse(res => /\/api\/gw\/estates\/\d+\/contacts$/.test(res.url()) && res.request().method() === 'PUT');
        await e.save();
        expect((await put).ok(), 'PUT contacts succeeds').toBe(true);
        await expect(s.panel).toBeVisible();
      });

      await test.step('2. Summary shows each contact in its card with the dates', async () => {
        for (const [i, r] of rows.entries()) {
          const card = s.details(r.card);
          const name = picked[i].replace(/\s*\[.*\]$/, '');
          await expect.soft(card, `${r.card}: name`).toContainText(`${r.label} ${name}`);
          await expect.soft(card, `${r.card}: ID`).toContainText('ID:');
          await expect.soft(card, `${r.card}: Phone`).toContainText('Phone:');
          const dates = 'end' in r ? `${slash(r.start)} - ${slash(r.end)}` : slash(r.start);
          await expect.soft(card, `${r.card}: dates`).toContainText(dates);
        }
        await s.details('Previous Tenant Details').scrollIntoViewIfNeeded();
        await evidence(page, '06_NEW_summary-after-save', [s.contactValues]);
      });

      await test.step('3. The Edit tab shows the saved rows again', async () => {
        await e.goto(apartment.id);
        for (const [i, r] of rows.entries()) {
          await e.partyTab(r.party).click();
          const f = e.rowFields(e.row(r.party, r.period, 1), r.party);
          await expect.soft(f.contact, `${r.period} ${r.party}: contact`).toContainText(picked[i]);
          await expect.soft(f.startDate, `${r.period} ${r.party}: start`).toHaveValue(r.start);
          if ('end' in r) await expect.soft(f.endDate, `${r.period} ${r.party}: end`).toHaveValue(r.end);
          else await expect.soft(f.current, `${r.period} ${r.party}: ☑ Current`).toBeChecked();
        }
        await e.partyTab('owner').click();
        await evidence(page, '07_NEW_edit-after-save', [e.form.getByRole('combobox', { name: /^Select (Owner|Tenant)$/ })]);
      });
    });
});

// Read-only: only switches the Summary currency filter, so it leaves no data behind.
test.describe('Sanity · EM-41 Apartment Summary currency filter', () => {
  /** Estate SEED-Z-001 has MMK receivables (unpaid invoices, see EM-48), so a switch visibly changes the cards. */
  const apartment = { id: 1, name: 'Estate SEED-Z-001' };
  const symbol = { MMK: /Ks$/, USD: /^\$/ } as const;

  test('SAN-EM41-001 Apartment Summary shows a Currency filter',
    sanity({ id: 'SAN-EM41-001', priority: 'P2', doc }),
    async ({ page, apartmentSummaryTab: s }) => {
      let mmkTotal = '';

      await test.step('1. Summary shows "Accounts Receivable <total>" with a Currency dropdown on the right', async () => {
        await s.goto(apartment.id);
        await expect(s.accountsReceivable).toHaveText(/^Accounts Receivable\s+\S/);
        await expect(s.currency, 'Currency dropdown').toBeVisible();
        await expect(s.currency, 'default currency').toHaveText('MMK');
        mmkTotal = await s.totalText();
        expect(mmkTotal, 'MMK total').toMatch(symbol.MMK);
        expect(mmkTotal, `${apartment.name} needs MMK receivables for the switch to show`).not.toMatch(/^0\.00/);
        await expect(s.agingLabels.first()).toHaveText('Current');
        await evidence(page, '01_NEW_summary-currency-MMK', [s.contactDetails]);
      });

      await test.step('2. The dropdown lists currencies and the aging cards follow the selection', async () => {
        const codes = await s.currencyCodes();
        for (const c of ['MMK', 'USD']) expect.soft(codes, 'Currency list').toContain(c);

        await s.chooseCurrency('USD');
        await expect(s.currency).toHaveText('USD');
        await expect.soft(s.accountsReceivable, 'total in USD').toHaveText(/^Accounts Receivable\s+\$/);
        const amounts = await s.agingAmounts.allInnerTexts();
        expect.soft(amounts.length, 'one amount per aging card').toBe(await s.agingLabels.count());
        expect.soft(amounts.filter(a => !symbol.USD.test(a.trim())), 'aging cards not in USD').toEqual([]);
        await evidence(page, '02_NEW_summary-currency-USD', [s.contactDetails]);

        await s.chooseCurrency('MMK');
        await expect(s.currency).toHaveText('MMK');
        await expect.soft(s.accountsReceivable, 'back to the MMK total').toHaveText(`Accounts Receivable ${mmkTotal}`);
      });
    });
});

/** QA apartment created under EM-32 (Enable). Read-only in the tests below. */
const qaApartment = { id: 32, name: 'QA-REPRO-EM-56 Tower-R32-101', unit: 'R32-101' };

/** An Enable zone (not `except`) that has at least one Enable building, with those buildings. */
function zoneWithBuildings(areas: Area[], except = ''): { zone: Area; buildings: string[] } {
  for (const zone of areas.filter(a => a.type === 'ZONE' && a.status === 'ACTIVE' && a.name !== except)) {
    const buildings = areas.filter(a => a.type === 'BUILDING' && a.status === 'ACTIVE' && a.parent_id === zone.id).map(b => b.name);
    if (buildings.length) return { zone, buildings };
  }
  throw new Error(`UAT needs an Enable zone${except ? ` other than ${except}` : ''} with an Enable building`);
}

// Read-only: types a unit on Create Apartment but never clicks [Create]; reads apartment 32 everywhere else.
test.describe('Sanity · EM-32 Apartment full name', () => {
  test('SAN-EM32-001 Apartment shows its full name (Building-Unit) everywhere',
    sanity({ id: 'SAN-EM32-001', priority: 'P1', doc }),
    async ({ page, createApartmentPage: p, apartmentDetailPage: detail, globalSearch, createInvoicePage: invoice }) => {
      await test.step('1. Full Name = Building-Unit', async () => {
        await p.goto();
        await expect(p.zone).not.toHaveText(/Loading/);
        const { zone, buildings } = zoneWithBuildings(await getAreas(page.request));
        await p.choose(p.zone, zone.name);
        await p.choose(p.building, buildings[0]);
        await p.unit.fill(qaApartment.unit);
        await expect.soft(p.fullName).toHaveValue(`${buildings[0]}-${qaApartment.unit}`);
        await evidence(page, '01_NEW_create-form-full-name');
      });

      await test.step('2. The detail page title is <Building>-<Unit>', async () => {
        await detail.goto(qaApartment.id);
        await expect.soft(detail.title).toHaveText(qaApartment.name);
        await evidence(page, '02_NEW_detail-title');
      });

      await test.step('3. Global Search shows the full name', async () => {
        await globalSearch.search(qaApartment.unit);
        const result = globalSearch.result(`/estates/${qaApartment.id}`);
        await expect.soft(result, 'search result for the unit').toContainText(qaApartment.name);
        await evidence(page, '03_NEW_global-search');
      });

      await test.step('4. The Create Invoice Apartment dropdown shows the full name', async () => {
        await invoice.goto();
        await expect(invoice.heading).toBeVisible();
        await invoice.apartment.click();
        await invoice.apartmentSearch.fill(qaApartment.unit);
        await expect.soft(invoice.apartmentOptions.filter({ hasText: qaApartment.unit }), 'options for the unit')
          .toHaveText([qaApartment.name]);
        await evidence(page, '04_NEW_create-invoice-apartment');
      });
    });
});

// Read-only: reads the buttons of the Invoices tab, clicks none of them.
test.describe('Sanity · EM-42 Apartment Invoices tab actions', () => {
  test('SAN-EM42-001 Apartment Invoices tab offers Add Invoice but no Debit Note',
    sanity({ id: 'SAN-EM42-001', priority: 'P1', doc }),
    async ({ page, apartmentDetailPage: detail, apartmentInvoicesTab: tab }) => {
      await tab.goto(qaApartment.id);
      // A Disable apartment shows no buttons at all (Old EM A1-00), which would hide the bug.
      await expect(detail.header, `${qaApartment.name} must be Enable`).not.toContainText('Disable');

      await test.step('1. Buttons: Add Invoice + Make Payment', async () => {
        await expect.soft(tab.addInvoice, '[Add Invoice]').toBeVisible();
        await expect.soft(tab.makePayment, '[Make Payment]').toBeVisible();
      });

      await test.step('2. No Add Debit Note / Debit Note', async () => {
        await expect.soft(tab.debitNoteActions, 'Debit Note action on the tab').toHaveCount(0);
        await evidence(page, '01_NEW_invoices-tab-actions');
      });
    });
});

// Read-only: adds an owner row on the Edit tab but never clicks [Save].
test.describe('Sanity · EM-44 Apartment forms at 100% zoom', () => {
  // The screen from the ticket: 1568×776 at 100% zoom.
  test.use({ viewport: { width: 1568, height: 776 } });

  /** No horizontal scroll bar on the window or the content frame. */
  async function noHorizontalOverflow(page: Page, what: string) {
    const overflow = await page.evaluate(() => {
      const frame = document.querySelector('#main-content') ?? document.scrollingElement!;
      return { page: document.scrollingElement!.scrollWidth - window.innerWidth, frame: frame.scrollWidth - frame.clientWidth };
    });
    expect.soft(overflow, `${what}: content wider than the screen (px)`).toEqual({ page: 0, frame: 0 });
  }

  /** Every edge of each element is inside the screen. (toBeInViewport also counts the 1–2 px a date input is clipped by its own wrapper.) */
  async function fullyOnScreen(page: Page, fields: Record<string, Locator>) {
    const screen = page.viewportSize()!;
    for (const [name, field] of Object.entries(fields)) {
      await expect.soft(field, `${name} visible`).toBeVisible();
      const box = await field.boundingBox();
      const inside = !!box && box.x >= 0 && box.y >= 0 && box.x + box.width <= screen.width && box.y + box.height <= screen.height;
      expect.soft(inside, `${name} fully on screen: ${JSON.stringify(box)} in ${screen.width}×${screen.height}`).toBe(true);
    }
  }

  test('SAN-EM44-001 Apartments create and edit forms are fully visible at 100% zoom',
    sanity({ id: 'SAN-EM44-001', priority: 'P1', doc }),
    async ({ page, createApartmentPage: p, apartmentEditTab: e }) => {
      await test.step('1. Apartments › New: all fields and buttons are visible', async () => {
        await p.goto();
        await expect(p.heading).toBeVisible();
        await expect(p.zone).not.toHaveText(/Loading/);
        await fullyOnScreen(page, { 'Full Name': p.fullName, Zone: p.zone, Building: p.building, Unit: p.unit,
          ENABLE: p.statusEnable, DISABLE: p.statusDisable, '[Create]': p.createButton });
        await noHorizontalOverflow(page, 'Create Apartment');
        await evidence(page, '01_NEW_create-form-1568x776');
      });

      await test.step('2. Edit tab: all fields and buttons are visible', async () => {
        await e.goto(qaApartment.id);
        await fullyOnScreen(page, { 'Account Name': e.accountName, Enable: e.enable,
          Owners: e.partyTab('owner'), Tenants: e.partyTab('tenant'), '[Save]': e.saveButton });
        await noHorizontalOverflow(page, 'Edit tab');
      });

      await test.step('3. Owners › Add More: the new row is fully displayed', async () => {
        await e.partyTab('owner').click();
        const n = (await e.rows('owner', 'current').count()) + 1;
        await e.addMore('owner', 'current').click();
        const row = e.row('owner', 'current', n);
        await row.scrollIntoViewIfNeeded();
        const f = e.rowFields(row, 'owner');
        await fullyOnScreen(page, { 'Select Owner': f.contact, 'Ownership Start Date': f.startDate,
          Current: f.current, delete: f.remove });
        await noHorizontalOverflow(page, 'Edit tab with a new owner row');
        await evidence(page, '02_NEW_edit-owner-row-1568x776');
      });
    });
});

// Read-only: reads the tab count and toggles the Unpaid Only filter.
test.describe('Sanity · EM-48 Apartment Invoices tab count', () => {
  /** Has Unpaid, Partially paid and Paid invoices (5 + 1 + 2 on 11-06). Disable since 11-06, which does not change the count. */
  const apartment = { id: 1, name: 'Estate SEED-Z-001' };
  const unpaid = ['Unpaid', 'Partially paid'];

  test('SAN-EM48-001 Invoices tab count shows only unpaid invoices, immediately on open',
    sanity({ id: 'SAN-EM48-001', priority: 'P2', doc }),
    async ({ page, apartmentDetailPage: detail, apartmentInvoicesTab: tab }) => {
      let count: number | null = null;

      await test.step('1. The number appears immediately (on the Summary tab, before opening Invoices)', async () => {
        await detail.goto(apartment.id);
        await expect.soft(detail.invoicesTab, 'Invoices tab has a number').toHaveText(/^Invoices \(\d+\)$/);
        count = await detail.invoicesCount();
        await evidence(page, '01_NEW_tab-count-on-open', [page.getByRole('tabpanel', { name: 'Summary' })]);
      });

      await test.step('2. Only Unpaid (+ Partially paid) invoices are counted', async () => {
        await tab.goto(apartment.id);
        await tab.unpaidOnly.uncheck();
        const statuses = await tab.statuses();
        expect(statuses.filter(s => s === 'Paid').length, `${apartment.name} needs a Paid invoice for this check`).toBeGreaterThan(0);
        expect.soft(count, 'tab number = Unpaid + Partially paid rows').toBe(statuses.filter(s => unpaid.includes(s)).length);
        await evidence(page, '02_NEW_all-invoices');
      });

      await test.step('3. The tab number does not include Paid invoices', async () => {
        const all = await tab.rows.count();
        expect.soft(count, 'tab number is lower than all rows').toBeLessThan(all);
        await tab.unpaidOnly.check();
        await expect.soft(tab.rows, 'Unpaid Only rows = tab number').toHaveCount(count ?? -1);
        await evidence(page, '03_NEW_unpaid-only');
      });
    });
});

// Read-only: opens the Zone filter, picks nothing.
test.describe('Sanity · EM-52 Apartments Zone filter', () => {
  test('SAN-EM52-001 Apartments Zone filter does not list Disable zones',
    sanity({ id: 'SAN-EM52-001', priority: 'P2', doc }),
    async ({ page, apartmentsListPage: list }) => {
      const areas = await getAreas(page.request);
      const zones = areas.filter(a => a.type === 'ZONE');
      const active = zones.filter(z => z.status === 'ACTIVE').map(z => z.name);
      // A Disable zone with the same name as an Enable one cannot be told apart in the list.
      const disabled = zones.filter(z => z.status === 'INACTIVE' && !active.includes(z.name)).map(z => z.name);
      expect(disabled.length, 'UAT needs a Disable zone for this check').toBeGreaterThan(0);

      await test.step('1. Only Enable zones are listed', async () => {
        await list.goto();
        await list.openZoneFilter();
        const options = await list.zoneOptions();
        expect.soft(options.filter(o => disabled.includes(o)), 'Disable zones in the Zone filter').toEqual([]);
        expect.soft(options.filter(o => !active.includes(o)), 'options that are not an Enable zone').toEqual([]);
        await evidence(page, '01_NEW_zone-filter');
      });
    });
});

// Read-only: fills Zone, Building and Unit but never clicks [Create].
test.describe('Sanity · EM-66 Create Apartment Full Name', () => {
  test('SAN-EM66-001 Full Name updates from Zone, Building and Unit',
    sanity({ id: 'SAN-EM66-001', priority: 'P2', doc }),
    async ({ page, createApartmentPage: p }) => {
      await p.goto();
      await expect(p.zone).not.toHaveText(/Loading/);
      const areas = await getAreas(page.request);

      await test.step('1. Full Name = <default Building>-', async () => {
        await expect(p.building).toBeEnabled();
        await expect.soft(p.fullName).toHaveValue(`${await p.selected(p.building)}-`);
        await expect.soft(p.fullName, 'Full Name is generated, not typed').not.toBeEditable();
      });

      let building = '';
      await test.step('2. Full Name changes with the Building', async () => {
        const target = zoneWithBuildings(areas, await p.selected(p.zone));
        building = target.buildings.at(-1)!;
        await p.choose(p.zone, target.zone.name);
        await p.choose(p.building, building);
        await expect.soft(p.fullName).toHaveValue(`${building}-`);
      });

      await test.step('3. Full Name = <Building>-<Unit>', async () => {
        await p.unit.fill(qaApartment.unit);
        await expect.soft(p.fullName).toHaveValue(`${building}-${qaApartment.unit}`);
        await evidence(page, '01_NEW_full-name');
      });
    });
});

// Read-only: lists the Create Apartment fields.
test.describe('Sanity · EM-67 Create Apartment fields', () => {
  test('SAN-EM67-001 Create Apartment form has no "Name (optional)" field',
    sanity({ id: 'SAN-EM67-001', priority: 'P2', doc }),
    async ({ page, createApartmentPage: p }) => {
      await p.goto();
      await expect(p.heading).toBeVisible();

      await test.step('1. Full Name, Zone*, Building*, Unit*, Status* (Enable/Disable)', async () => {
        for (const [name, field] of Object.entries({ 'Full Name': p.fullName, Zone: p.zone, Building: p.building, Unit: p.unit })) {
          await expect.soft(field, name).toBeVisible();
        }
        await expect.soft(p.form.getByRole('textbox'), 'text fields: Full Name and Unit only').toHaveCount(2);
        for (const field of ['Zone', 'Building', 'Unit'] as const) {
          await expect.soft(p.requiredMark(field), `${field} has *`).toBeVisible();
        }
        await expect.soft(p.statusLabel, 'Status field').toBeVisible();
        await expect.soft(p.statusEnable, '[ENABLE]').toBeVisible();
        await expect.soft(p.statusDisable, '[DISABLE]').toBeVisible();
      });

      await test.step('2. No "Name (optional)" field', async () => {
        await expect.soft(p.form.getByText(/Name \(optional\)/i), '"Name (optional)" label').toHaveCount(0);
        await expect.soft(p.form.getByRole('textbox', { name: /^Name\b/ }), 'Name textbox').toHaveCount(0);
        await evidence(page, '01_NEW_create-form-fields');
      });
    });
});
