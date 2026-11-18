// Reported issues "UO invoice duplication when bulk upload" (IT solution manager) and "UO Bulk Issue" (tester):
// the UO import and bulk-approve cases, run on Old EM to confirm or rule out duplicate UO entries / invoices.
//   UOI-029 Duplicate upload · UOI-028 Concurrent upload · UOI-013 Multi-record import (../em/docs/test-cases/features/06-uo-import.md)
//   UO-008  Bulk approve UO drafts (../em/docs/test-cases/features/05-utility-operations-uo.md)
// The key check of every test: after the uploads / approval, the test's own apartments have exactly one UO entry
// and one invoice per accepted reading (Manage UO list, apartment Invoices tab, apartment S.O.A).
//
// Old EM API responses are encrypted, so concurrent uploads go through the UI: two pages choose their file at
// the same moment (Promise.all of setInputFiles; choosing the file uploads it at once). "Same user" = two tabs of
// one browser context; "different user" = a second, freshly logged-in session of the admin account in another
// context (no second account on Old EM UAT: APPROVER_* is empty).
import { test } from '@fixtures/billing.fixture';
import { expect } from '@fixtures';
import { type Browser, type Page, type Request } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { notChecked, checkPostedAreas } from '@helpers/billing-checks';
import { toast } from '@components/Toast';
import { type Apartment } from '@data/builders';
import { amountOf, createApprovedUo, dmy, today, setupApartment, waitLoaded } from '@data/billing';
import { ImportPage, toCsv } from '@pages/billing/ImportPage';
import { UoListPage, showAllRows } from '@pages/billing/BillingListPages';
import { ApartmentLedger } from '@pages/billing/Ledgers';
import { UoDraftsPage } from '@pages/uo/UoDraftsPage';
import { UoCreatePage, type UoReadings } from '@pages/uo/UoCreatePage';
import { LoginPage } from '@pages/LoginPage';
import { credentials } from '@utils/Environment';

const ISSUE = 'UO invoice duplication when bulk upload / UO Bulk Issue';
const UO_HEADER = ['Apartment', 'Reading Date (DD/MM/YYYY)', 'Electricity (YESC)', 'Electricity (Generator)', 'Treated Water', 'Raw Water'];
/** Pre-existing reading (case: 10 on 01/01) — Old EM refuses an import for an apartment with no previous record. */
const LAST = 10;
const all = (n: number): UoReadings => ({
  'Electricity (YESC)': { previous: 0, current: n },
  'Electricity (Generator)': { previous: 0, current: n },
  'Treated Water': { previous: 0, current: n },
  'Raw Water': { previous: 0, current: n }
});

function note(type: 'reported issue' | 'case issue' | 'observed' | 'counts' | 'data', description: string): void {
  test.info().annotations.push({ type, description });
  if (type === 'counts' || type === 'observed') console.log(`[${test.info().title.split(' ')[0]}] ${type}: ${description}`);
}

/** createUoDraft after the form's loading overlay has gone (the apartment picker ignores clicks under it). */
async function uoDraft(page: Page, apartment: Apartment, readings: UoReadings): Promise<void> {
  const form = new UoCreatePage(page);
  await form.goto();
  await waitLoaded(page);
  await form.selectApartment(apartment.name);
  await form.fillReadings(readings);
  await form.submitButton.click();
  await expect(toast(page, 'UO Entry saved')).toBeVisible();
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── Setup ─────────────────────────────────────────────────────────────────────────────────────

/** Own apartment with an approved manual reading of 10 on the 1st of last month (its own invoice). */
async function apartmentWithLastReading(page: Page): Promise<Apartment> {
  const apartment = await setupApartment(page);
  const last = await createApprovedUo(page, apartment, all(LAST), { monthsBack: 1, day: 1 });
  note('data', `${apartment.name} (id ${apartment.id}): last reading ${dmy(last)} (manual, ${LAST}, approved → 1 invoice)`);
  return apartment;
}

type Row = [apartment: string, date: string, units: number];

async function uoCsv(name: string, rows: Row[]): Promise<string> {
  const file = test.info().outputPath(name);
  await writeFile(file, toCsv([UO_HEADER, ...rows.map(([a, d, u]) => [a, d, u, u, u, u])]));
  await test.info().attach(name, { path: file, contentType: 'text/csv' });
  return file;
}

// ── Upload ────────────────────────────────────────────────────────────────────────────────────

const isImportPost = (r: Request) => r.method() === 'POST' && /\/api\/utility-operations\/import(\?|$)/.test(r.url());

interface Upload { page: Page; label: string; sentAt: number; doneAt: number; status: number; message: string }

/** The inline result ("1 UO Entry imported." / errors) or a toast, whichever Old EM shows after the upload. */
async function uploadMessage(page: Page): Promise<string> {
  const result = new ImportPage(page, 'uo').result;
  const t = toast(page);
  await expect(result.or(t).first()).toBeVisible({ timeout: 30_000 }).catch(() => {});
  if (await result.isVisible()) return (await result.innerText()).replace(/\s+/g, ' ').trim();
  if (await t.isVisible()) return (await t.innerText()).replace(/\s+/g, ' ').trim();
  return '(no message)';
}

/** Opens Import UO Entry on each page, then all pages choose their file at the same moment. */
async function uploadTogether(jobs: { page: Page; file: string; label: string }[]): Promise<Upload[]> {
  for (const j of jobs) await new ImportPage(j.page, 'uo').goto();
  const t0 = Date.now();
  const runs = jobs.map(async j => {
    let sentAt = -1;
    j.page.on('request', r => { if (isImportPost(r) && sentAt < 0) sentAt = Date.now() - t0; });
    const response = j.page.waitForResponse(r => isImportPost(r.request()), { timeout: 120_000 });
    await new ImportPage(j.page, 'uo').upload(j.file);
    const r = await response;
    const doneAt = Date.now() - t0;
    return { page: j.page, label: j.label, sentAt, doneAt, status: r.status(), message: await uploadMessage(j.page) };
  });
  const uploads = await Promise.all(runs);
  for (const u of uploads) note('observed', `${u.label}: POST import sent at +${u.sentAt} ms, answered at +${u.doneAt} ms (HTTP ${u.status}) → "${u.message}"`);
  return uploads;
}

const overlapped = (a: Upload, b: Upload) => a.sentAt < b.doneAt && b.sentAt < a.doneAt;
const imported = (u: Upload) => /\b1 UO Entr(y|ies) imported/i.test(u.message);

/** A second, freshly logged-in session of the admin account (Old EM UAT has no second account). */
async function secondSession(browser: Browser): Promise<Page> {
  note('case issue', '"Different user": Old EM UAT has no second account (APPROVER_* empty), so user 2 is a second, separately logged-in session of the same admin account in another browser context');
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  const login = new LoginPage(page);
  await login.goto();
  const { email, password } = credentials('admin');
  await login.login(email, password);
  try {
    await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });
  } catch {
    test.skip(true, 'BLOCKED: the second admin session could not sign in to Old EM');
  }
  return page;
}

// ── Counts (the reported-issue check) ───────────────────────────────────────────────────────

interface Counts { uoEntries: number; uoCodes: string[]; uoYesc: string[]; invoices: number; invoiceCodes: string[]; soaInvoices: number }

/** Polls a list until it shows its data for the apartment (or its empty message), then counts. */
async function settled(read: () => Promise<string[]>, ok: (texts: string[]) => boolean): Promise<string[]> {
  let texts: string[] = [];
  await expect.poll(async () => ok(texts = await read()), { timeout: 45_000, intervals: [1000, 2000] }).toBe(true).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));
  return read();
}

async function countFor(page: Page, apartment: Apartment, tag: string): Promise<Counts> {
  const code = /(?:Inv|DN)-\d{6}-\d+/g;

  const list = new UoListPage(page);
  await list.goto();
  await list.show(apartment);
  // The search reloads the list behind "Loading UO data. Please wait." while showing the old rows / "No UO found."
  await expect(page.getByText('Loading UO data')).toBeVisible({ timeout: 5_000 }).catch(() => {});
  await expect(page.getByText('Loading UO data')).toBeHidden({ timeout: 60_000 });
  const uoTexts = await settled(() => list.rows.allInnerTexts(),
    t => t.length > 0 && (t.every(x => x.includes(apartment.name)) || (t.length === 1 && !/CL1-|A1-/.test(t[0]))));
  const uoRows = uoTexts.filter(t => t.includes(apartment.name));
  await evidence(page, `${tag}_uo-list_${apartment.unit}`);

  const ledger = new ApartmentLedger(page);
  await ledger.gotoInvoices(apartment.id);
  const invTexts = await settled(() => ledger.invoiceRows.allInnerTexts(),
    t => t.length > 0 && (t.some(x => /Inv-/.test(x)) || /no invoice/i.test(t.join(' '))));
  const invoiceCodes = invTexts.filter(t => /Utilities/.test(t)).flatMap(t => t.match(code)?.slice(0, 1) ?? []);
  await evidence(page, `${tag}_apartment-invoices_${apartment.unit}`);

  await ledger.gotoSoa(apartment.id);
  const soaTexts = await ledger.soaRows.allInnerTexts();
  const soaInvoices = soaTexts.filter(t => /Inv-\d{6}-\d+/.test(t)).length;
  await evidence(page, `${tag}_apartment-soa_${apartment.unit}`);

  const counts = {
    uoEntries: uoRows.length,
    uoCodes: uoRows.flatMap(t => t.match(code) ?? []),
    uoYesc: uoRows.map(r => r.split(/\t|\n/).map(s => s.trim()).filter(Boolean)[2] ?? ''),
    invoices: invoiceCodes.length,
    invoiceCodes,
    soaInvoices
  };
  note('counts', `${apartment.name}: Manage UO (this month) ${counts.uoEntries} entr${counts.uoEntries === 1 ? 'y' : 'ies'} [${counts.uoCodes.join(', ')}]; ` +
    `Invoices tab ${counts.invoices} Utilities invoice(s) [${invoiceCodes.join(', ')}]; S.O.A ${soaInvoices} invoice row(s)`);
  return counts;
}

/**
 * The reported-issue check: `entries` UO entries this month for the apartment, each with its own invoice, and
 * `entries + earlier` Utilities invoices on the Invoices tab and the S.O.A (`earlier` = the pre-existing reading's).
 */
async function expectOneInvoicePerReading(page: Page, apartment: Apartment, entries: number, earlier: number, tag: string): Promise<Counts> {
  const c = await test.step(`Count ${apartment.name}'s UO entries and invoices (UO list, Invoices tab, S.O.A)`, () => countFor(page, apartment, tag));
  const invoices = entries + earlier;
  expect.soft(c.uoEntries, `${apartment.name}: UO entries this month — expected ${entries}, actual ${c.uoEntries} [${c.uoCodes.join(', ')}]`).toBe(entries);
  expect.soft(new Set(c.uoCodes).size, `${apartment.name}: each UO entry has its own invoice — expected ${c.uoEntries} invoice link(s), actual ${c.uoCodes.length}`).toBe(c.uoEntries);
  expect.soft(c.invoices, `${apartment.name}: Utilities invoices on the Invoices tab — expected ${invoices} (${earlier} earlier + ${entries} new), actual ${c.invoices} [${c.invoiceCodes.join(', ')}]`).toBe(invoices);
  expect.soft(c.soaInvoices, `${apartment.name}: invoice rows on the S.O.A — expected ${invoices}, actual ${c.soaInvoices}`).toBe(invoices);
  return c;
}

// ── Tests ─────────────────────────────────────────────────────────────────────────────────────

// The "different user" variants type the admin password in a second context: no trace for this file.
test.use({ trace: 'off' });

test.describe('Reported issue · UO bulk upload duplication', () => {
  test.describe.configure({ timeout: 600_000 });
  test.beforeEach(() => note('reported issue', ISSUE));

  // UOI-029 · Duplicate upload ─────────────────────────────────────────────────────────────────
  const UOI_029 = [
    { label: 'base', source: 'Uo import r50', user2: 'same', timing: 'after' },
    { label: 'Different user; 1st in progress', source: 'Uo import r53', user2: 'other', timing: 'together' },
    { label: 'Different user; 1st completed', source: 'Uo import r54', user2: 'other', timing: 'after' }
  ] as const;
  for (const v of UOI_029) {
    test(`UOI-029 [${v.label}] Duplicate upload - re-uploading the same file is rejected`,
      testCase({ id: 'UOI-029', source: v.source, priority: 'P1', critical: true }),
      async ({ page, browser }) => {
        const tag = `UOI-029_${slug(v.label)}`;
        const apartment = await test.step('Setup: own apartment with a last reading last month', () => apartmentWithLastReading(page));
        const file = await uoCsv('uo-import.csv', [[apartment.name, dmy(today()), 15]]);
        const page2 = v.user2 === 'other' ? await test.step('User 2: second admin session', () => secondSession(browser)) : page;

        let uploads: Upload[];
        if (v.timing === 'after') {
          const first = await test.step('1st upload of the file → successful', () => uploadTogether([{ page, file, label: '1st upload (user 1)' }]));
          await test.step('Pre-existing: 1st upload is successful', async () => {
            expect(first[0].message, '1st upload result').toMatch(/1 UO Entry imported/);
          });
          const second = await test.step(`Upload the same file again (${v.user2 === 'same' ? 'same user' : 'user 2'})`, () =>
            uploadTogether([{ page: page2, file, label: `2nd upload (${v.user2 === 'same' ? 'user 1' : 'user 2'})` }]));
          uploads = [...first, ...second];
        } else {
          uploads = await test.step('User 1 and user 2 upload the same file at the same moment', () =>
            uploadTogether([{ page, file, label: 'upload user 1' }, { page: page2, file, label: 'upload user 2' }]));
          if (!overlapped(uploads[0], uploads[1])) test.skip(true, 'BLOCKED: the two uploads did not run at the same time (1st was not in progress)');
        }

        await test.step('Expected: the second upload fails (only one import accepted)', async () => {
          const ok = uploads.filter(imported).length;
          if (ok !== 1) {
            for (const u of uploads) await evidence(u.page, `${tag}_upload-results_${uploads.indexOf(u) + 1}`);
            expect.soft(ok, `uploads reported as imported — expected 1, actual ${ok}: ${uploads.map(u => `${u.label} "${u.message}"`).join(' / ')}`).toBe(1);
          } else {
            await evidence(page2, `${tag}_second-upload`);
          }
        });
        await expectOneInvoicePerReading(page, apartment, 1, 1, tag);
      });
  }

  // UOI-028 · Concurrent upload ────────────────────────────────────────────────────────────────
  const UOI_028 = [
    { label: 'base', source: 'Uo import r49', files: 'same' },
    { label: 'Same user; different file', source: 'Uo import r51', files: 'different' }
  ] as const;
  for (const v of UOI_028) {
    test(`UOI-028 [${v.label}] Concurrent upload - 2nd upload blocked while user's 1st upload in progress`,
      testCase({ id: 'UOI-028', source: v.source, priority: 'P1', critical: true }),
      async ({ page }) => {
        const tag = `UOI-028_${slug(v.label)}`;
        const a = await test.step('Setup: own apartment with a last reading last month', () => apartmentWithLastReading(page));
        const b = v.files === 'different' ? await test.step('Setup: second apartment for the different file', () => apartmentWithLastReading(page)) : undefined;
        const fileA = await uoCsv('uo-import-1.csv', [[a.name, dmy(today()), 15]]);
        const fileB = b ? await uoCsv('uo-import-2.csv', [[b.name, dmy(today()), 15]]) : fileA;
        note('case issue', 'Same user = two tabs of one logged-in browser; the file is the 1-row CSV of the test\'s own apartment (a large file would need other testers\' apartments)');

        const page2 = await page.context().newPage();
        const uploads = await test.step(`Same user uploads ${v.files === 'same' ? 'the same file' : 'a different file'} in a 2nd tab while the 1st upload is in progress`, () =>
          uploadTogether([{ page, file: fileA, label: '1st upload (tab 1)' }, { page: page2, file: fileB, label: '2nd upload (tab 2)' }]));
        if (!overlapped(uploads[0], uploads[1])) test.skip(true, 'BLOCKED: the 2nd upload was not sent while the 1st was in progress');

        await test.step('Expected: 2nd upload fails (blocked until the 1st finishes)', async () => {
          const ok = uploads.filter(imported).length;
          if (ok !== 1) {
            for (const u of uploads) await evidence(u.page, `${tag}_upload-results_${uploads.indexOf(u) + 1}`);
            expect.soft(ok, `uploads reported as imported — expected 1 (2nd blocked), actual ${ok}: ${uploads.map(u => `${u.label} "${u.message}"`).join(' / ')}`).toBe(1);
          } else {
            await evidence(uploads.find(u => !imported(u))!.page, `${tag}_blocked-upload`);
          }
        });

        if (!b) {
          await expectOneInvoicePerReading(page, a, 1, 1, tag);
        } else {
          // Which of the two files is blocked is not fixed (both start together): check each apartment for one
          // invoice per entry, and the two together for one accepted file.
          const [ca, cb] = [await countFor(page, a, `${tag}_file1`), await countFor(page, b, `${tag}_file2`)];
          for (const [apt, c] of [[a, ca], [b, cb]] as const) {
            expect.soft(c.uoEntries, `${apt.name}: at most one UO entry this month — actual ${c.uoEntries}`).toBeLessThanOrEqual(1);
            expect.soft(c.invoices - c.uoEntries, `${apt.name}: one invoice per UO entry plus the earlier one — entries ${c.uoEntries}, invoices ${c.invoices}`).toBe(1);
            expect.soft(c.soaInvoices, `${apt.name}: S.O.A invoice rows = Invoices tab — expected ${c.invoices}, actual ${c.soaInvoices}`).toBe(c.invoices);
          }
          expect.soft(ca.uoEntries + cb.uoEntries, `UO entries imported from the two concurrent files — expected 1 (2nd file blocked), actual ${ca.uoEntries + cb.uoEntries} (${a.name} ${ca.uoEntries}, ${b.name} ${cb.uoEntries})`).toBe(1);
        }
        await page2.close();
      });
  }

  // UOI-013 · Multi-record import ──────────────────────────────────────────────────────────────
  const UOI_013 = [
    { label: 'base', source: 'Uo import r20', first: 'today', second: 'today', units: [15, 15] },
    { label: 'Same reading date, different data', source: 'Uo import r22', first: 'today', second: 'today', units: [15, 18] },
    { label: 'Same month, different dates', source: 'Uo import r32', first: 'first', second: 'today', units: [15, 15] },
    { label: 'Same month 25/02, different units', source: 'Uo import r33', first: 'first', second: 'today', units: [15, 18] }
  ] as const;
  for (const v of UOI_013) {
    test(`UOI-013 [${v.label}] Multi-record import - second record in same month/date rejected (first saved)`,
      testCase({ id: 'UOI-013', source: v.source, priority: 'P2' }),
      async ({ page }) => {
        const tag = `UOI-013_${slug(v.label)}`;
        const t = today();
        const first = new Date(t.getFullYear(), t.getMonth(), 1);
        if ((v.first === 'first') && t.getDate() === 1) test.skip(true, 'BLOCKED: today is the 1st; two different dates in this month up to today do not exist');
        const d1 = dmy(v.first === 'first' ? first : t);
        const d2 = dmy(t);
        note('case issue', `Case dates (last 01/01/2025, import 01/02 and 25/02/2025) moved to now: last reading 1st of last month, import ${d1} and ${d2}; units ${v.units.join(' then ')} (case shows one data row; the variant's second row was derived from its label)`);

        const apartment = await test.step('Pre-existing: own apartment with an old UO record (10, last month)', () => apartmentWithLastReading(page));
        const file = await uoCsv('uo-import.csv', [[apartment.name, d1, v.units[0]], [apartment.name, d2, v.units[1]]]);

        const [u] = await test.step('Import the 2-record file', () => uploadTogether([{ page, file, label: '2-record import' }]));
        await test.step('Expected: 1st record successful, 2nd record failed', async () => {
          const okCount = Number(u.message.match(/(\d+) UO Entr(?:y|ies) imported/i)?.[1] ?? 0);
          const failed = u.message.includes(apartment.name);
          if (okCount !== 1 || !failed) await evidence(page, `${tag}_import-result`);
          expect.soft(okCount, `records imported — expected 1 (1st only), actual ${okCount}: "${u.message}"`).toBe(1);
          expect.soft(failed, `a failure message for the 2nd record of ${apartment.name} — actual "${u.message}"`).toBe(true);
        });
        const c = await expectOneInvoicePerReading(page, apartment, 1, 1, tag);
        const used = v.units[0] - LAST;
        expect.soft(c.uoYesc, `the saved record is the 1st one (${v.units[0]} on ${d1}) — Elec.(YESC) expected ["${v.units[0]} - ${LAST} = ${used}"], actual ${JSON.stringify(c.uoYesc)}`).toEqual([`${v.units[0]} - ${LAST} = ${used}`]);
      });
  }

  // UO-008 · Bulk approve ──────────────────────────────────────────────────────────────────────
  test('UO-008 Bulk approve UO drafts - invoices generated',
    testCase({ id: 'UO-008', source: 'TC_UO_008', priority: 'P1', critical: true }),
    async ({ page, uoDraftsPage: drafts, uoListPage: list }) => {
      const a = await test.step('Setup: own apartment with an owner', () => setupApartment(page, { owner: true }));
      const b = await test.step('Setup: second own apartment', () => setupApartment(page));
      await test.step('Precondition: two UO drafts in the listing', async () => {
        await uoDraft(page, a, all(10));
        await uoDraft(page, b, all(20));
      });

      const amounts: Record<string, number> = {};
      await test.step('1-2. UO on the top bar · "Draft Only" checked → Bulk Approve button', async () => {
        await page.getByRole('link', { name: 'UO', exact: true }).click();
        await expect(page).toHaveURL(/\/utility-operations\/draft\/all$/);
        await expect(page.getByRole('checkbox', { name: 'Draft Only' })).toBeChecked();
        await expect(page.getByRole('button', { name: 'Bulk Approve' })).toBeVisible();
        await showAllRows(page);
        for (const apt of [a, b]) {
          await expect(drafts.row(apt.name), `${apt.name} draft`).toHaveCount(1);
          amounts[apt.name] = amountOf(await drafts.amount(apt.name).innerText());
        }
      });

      await test.step('3. Select the two drafts → Bulk Approve', async () => {
        for (const apt of [a, b]) await drafts.row(apt.name).locator('.p-checkbox').first().click();
        const approve = page.waitForResponse(r => r.request().method() !== 'GET' && /\/api\/utility-operations/.test(r.url()), { timeout: 60_000 });
        await page.getByRole('button', { name: 'Bulk Approve' }).click();
        // Old EM asks nothing here (unlike the single Approve).
        if (await drafts.confirm.root.isVisible({ timeout: 2_000 }).catch(() => false)) await drafts.confirm.accept(/^Yes/);
        const r = await approve;
        const t = toast(page);
        await expect(t).toBeVisible({ timeout: 20_000 }).catch(() => {});
        const message = (await t.isVisible()) ? (await t.innerText()).replace(/\s+/g, ' ').trim() : '(no message)';
        note('observed', `Bulk Approve: no confirm dialog; ${r.request().method()} ${new URL(r.url()).pathname} → HTTP ${r.status()}; message "${message}" (case: "UO Entries with ref number Invoiced Succesfully")`);
        await evidence(page, 'UO-008_bulk-approve');
        expect.soft(message, 'Expected 2: "UO Entries … Invoiced Successfully" message').toMatch(/Invoiced Succes/i);
      });

      await test.step('Expected 1: the selected drafts left the draft list', async () => {
        await drafts.goto();
        await showAllRows(page);
        for (const apt of [a, b]) await expect.soft(drafts.row(apt.name), `${apt.name} no longer a draft`).toHaveCount(0);
      });

      const codes: Record<string, string> = {};
      for (const apt of [a, b]) {
        const c = await expectOneInvoicePerReading(page, apt, 1, 0, `UO-008_${apt.unit === a.unit ? 'apt1' : 'apt2'}`);
        codes[apt.name] = c.uoCodes[0] ?? c.invoiceCodes[0] ?? '';
      }
      note('data', `${a.name}: ${codes[a.name]} ${amounts[a.name]}; ${b.name}: ${codes[b.name]} ${amounts[b.name]}`);

      await test.step('Expected 2 (UO record list): each UO entry has its invoice ref number', async () => {
        await list.goto();
        for (const apt of [a, b]) {
          await list.show(apt);
          await expect.soft(list.docLink(list.rowsOf(apt.name)), `${apt.name}: invoice ref number on the UO entry`).toHaveCount(1);
        }
      });

      await test.step('Check area 8: Created By and Approved By user names on the invoices', async () => {
        const ledger = new ApartmentLedger(page);
        for (const apt of [a, b]) {
          await ledger.gotoInvoices(apt.id);
          const row = ledger.docRow(codes[apt.name]);
          await expect.soft(row.status, `${apt.name} ${codes[apt.name]} status`).toHaveText(/^unpaid$/i);
          const href = await row.row.locator('a[href^="/invoices/"]').first().getAttribute('href');
          await page.goto(href!);
          await page.getByRole('heading', { name: /^Total:/ }).waitFor();
          // The header renders empty ("Total: 0.00") first; the data comes with the document number.
          await page.getByText(`#${codes[apt.name]}`).first().waitFor({ timeout: 30_000 });
          await waitLoaded(page);
          const createdBy = (await page.getByText(/^Created By:/).innerText()).replace('Created By:', '').trim();
          const approvedBy = (await page.getByText(/^Approved By:/).innerText().catch(() => '')).replace('Approved By:', '').trim();
          note('observed', `${codes[apt.name]}: Created By "${createdBy}", Approved By "${approvedBy}" (admin made and approved the drafts)`);
          if (!createdBy || !approvedBy || createdBy !== approvedBy) await evidence(page, `UO-008_created-approved-by_${apt.unit}`);
          expect.soft(createdBy, `${codes[apt.name]} Created By — expected the admin's name`).not.toBe('');
          expect.soft(approvedBy, `${codes[apt.name]} Approved By — expected the admin's name (same user as Created By), actual "${approvedBy}"`).toBe(createdBy);
        }
      });

      await test.step(`Expected 3 + check areas for ${a.name}`, () =>
        checkPostedAreas(page, 'UO-008', { code: codes[a.name], category: 'Utilities', amount: amounts[a.name], apartment: a, apartmentAR: amounts[a.name] }));
      notChecked(`Check areas 1-3, 6-7 for ${b.name}`, `same flow as ${a.name}; the second apartment is checked on UO list, Invoices tab (unpaid), S.O.A and Created/Approved By only`);
    });
});
