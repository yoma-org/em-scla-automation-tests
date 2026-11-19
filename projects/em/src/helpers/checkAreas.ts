// src/helpers/checkAreas.ts — reads every "Check area" of an invoice / debit note case for one apartment
// (and its owner), so a test can compare before / after an action. Each area gets an evidence screenshot.
// Global totals (Dashboard AR, AR page total) are shared by everyone on the environment: compare them only
// as "unchanged / changed by", and expect noise when other people work on the same environment.
import { test, type Page } from '@playwright/test';
import { evidence } from '@helpers/evidence';
import { DashboardPage } from '@pages/DashboardPage';
import { ArWorklistPage } from '@pages/receivables/ArWorklistPage';
import { InvoiceDraftsPage, InvoiceRegisterPage, InvoiceReportPage, type FilterType } from '@pages/invoices/InvoiceListPages';
import { ApartmentSummaryTab } from '@pages/apartments/ApartmentSummaryTab';
import { ApartmentInvoicesTab } from '@pages/apartments/ApartmentInvoicesTab';
import { ApartmentSoaTab } from '@pages/apartments/ApartmentSoaTab';
import { ContactSummaryTab } from '@pages/contacts/ContactSummaryTab';
import { PendingApprovals } from '@components/PendingApprovals';
import { type Apartment } from '@api/estates';

/** The check areas, in the order the cases list them. */
export const AREAS = {
  dashboardAr: '1. Dashboard AR amount',
  arTotal: '2a. Account Receivable amount',
  arList: '2b. Account Receivable list (our apartment)',
  invoiceList: '3a. Invoice/Debit Note list (our apartment)',
  draftList: '3b. Inv/DN Draft list (our apartment)',
  pendingInvDn: '3c. Inv/DN pending approval counter',
  apartmentSummary: '4a. Apartment - summary amount',
  apartmentInvoices: '4b. Apartment - Invoices list',
  apartmentSoa: '4c. Apartment - SOA report',
  contactSummary: '5a. Contact - summary amount',
  contactUnpaid: '5b. Contact - Unpaid Invoices list',
  report: '6. Report - Invoices list (our apartment)'
} as const;
export type AreaKey = keyof typeof AREAS;
export type Snapshot = Record<AreaKey, string>;

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** "Accounts Receivable 2,781.00 Ks | Current 0.00 Ks | Total Amount Overdue 2,781.00 Ks | … | > 180 Days 0.00 Ks". */
async function agingText(panel: import('@playwright/test').Locator, accountsReceivable: import('@playwright/test').Locator): Promise<string> {
  const labels = (await panel.getByRole('term').allInnerTexts()).map(clean);
  const amounts = (await panel.getByRole('definition').filter({ hasNotText: '%' }).allInnerTexts()).map(clean);
  const cards = labels.length === amounts.length ? labels.map((l, i) => `${l} ${amounts[i]}`) : [`aging cards unreadable (${labels.length} labels, ${amounts.length} amounts)`];
  return [clean(await accountsReceivable.innerText()), ...cards].join(' | ');
}

/** Amount of one aging card in an apartment / contact summary text (see agingText), e.g. agingAmount(s, '31 Days to 60 Days'). */
export function agingAmount(summary: string, label: string): string | undefined {
  return summary.split(' | ').find(p => p.startsWith(`${label} `))?.slice(label.length + 1);
}
async function rowsText(rows: import('@playwright/test').Locator): Promise<string> {
  const texts = (await rows.allInnerTexts()).map(clean).filter(Boolean);
  return texts.length ? `${texts.length} row(s): ${texts.join(' || ')}` : '0 rows';
}

/**
 * Reads all areas. `tag` ("before" / "after") names the screenshots.
 * `filterType` is the list period that contains the document date (This Month / Last Month).
 * `only` limits the read to some areas (e.g. a validation case that must not create anything).
 */
export async function readCheckAreas(page: Page, apartment: Apartment, filterType: FilterType, tag: string,
  only?: AreaKey[]): Promise<Snapshot> {
  const s = {} as Snapshot;
  const id = test.info().annotations.find(a => a.type === 'tc')?.description ?? 'case';
  const shot = (key: AreaKey) => evidence(page, `${id}_${tag}_${key}`, [page.getByText(/^(Owner|ID|Phone|Email):/)]);
  const read = async (key: AreaKey, fn: () => Promise<string>) => {
    if (only && !only.includes(key)) return; // `only`: the case reads just these areas
    // One stuck page must not use up the whole test: each area gets 60 s, then it is recorded as unreadable.
    // A timed-out step keeps running in the background; `done` stops its late result from overwriting this one.
    let done = false;
    try {
      await test.step(`${tag}: ${AREAS[key]}`, async () => { const v = clean(await fn()); if (!done) s[key] = v; }, { timeout: 60_000 });
    } catch (e) {
      s[key] = `could not read (${String(e).split('\n')[0].slice(0, 150)})`;
    } finally {
      done = true;
    }
  };

  await read('dashboardAr', async () => {
    const d = new DashboardPage(page);
    await d.goto();
    const card = d.card('Accounts Receivable');
    // Loaded once the title gets its date ("Accounts Receivable (as of 19/11/2026)").
    await card.filter({ hasText: /\(as of / }).waitFor({ timeout: 30_000 }).catch(() => {});
    await page.getByRole('main').getByRole('status', { name: /^Loading\b/ }).first().waitFor({ state: 'detached' }).catch(() => {});
    await shot('dashboardAr');
    return card.innerText();
  });

  const ar = new ArWorklistPage(page);
  await read('arTotal', async () => {
    await ar.goto();
    return ar.total.innerText();
  });
  await read('arList', async () => {
    await ar.searchFor(apartment.name);
    await shot('arList');
    return rowsText(ar.rowsWith(apartment.name));
  });

  await read('invoiceList', async () => {
    const list = new InvoiceRegisterPage(page);
    await list.goto();
    await list.filter(filterType, apartment.name);
    await shot('invoiceList');
    return rowsText(list.rowsWith(apartment.name));
  });

  await read('draftList', async () => {
    const list = new InvoiceDraftsPage(page);
    await list.goto();
    await list.filterApartment(apartment.name);
    await shot('draftList');
    return rowsText(list.rowsWith(apartment.name));
  });

  await read('pendingInvDn', async () => String(await new PendingApprovals(page).count('Inv/DN')));

  await read('apartmentSummary', async () => {
    const tab = new ApartmentSummaryTab(page);
    await tab.goto(apartment.id);
    await page.waitForLoadState('networkidle').catch(() => {});
    await shot('apartmentSummary');
    return agingText(tab.panel, tab.accountsReceivable);
  });
  await read('apartmentInvoices', async () => {
    const tab = new ApartmentInvoicesTab(page);
    await page.goto(`/estates/${apartment.id}?tab=invoices`);
    await tab.panel.waitFor();
    await page.waitForLoadState('networkidle').catch(() => {});
    await shot('apartmentInvoices');
    return (await tab.table.isVisible()) ? rowsText(tab.rows) : clean(await tab.panel.innerText()).replace(/^.*?(No invoices[^.]*).*$/, '$1');
  });
  await read('apartmentSoa', async () => {
    const tab = new ApartmentSoaTab(page);
    await tab.goto(apartment.id);
    await shot('apartmentSoa');
    return tab.summary();
  });

  await read('contactSummary', async () => {
    const tab = new ContactSummaryTab(page);
    await tab.goto(apartment.owner.id);
    await page.waitForLoadState('networkidle').catch(() => {});
    await shot('contactSummary');
    return agingText(tab.panel, tab.accountsReceivable);
  });
  await read('contactUnpaid', async () => {
    await page.goto(`/estates/contacts/${apartment.owner.id}?tab=invoices`);
    const tabLink = page.getByRole('tab', { name: /^Unpaid Invoices/ });
    await tabLink.waitFor();
    await page.waitForLoadState('networkidle').catch(() => {});
    await shot('contactUnpaid');
    const panel = page.getByRole('tabpanel');
    const rows = panel.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
    return `${clean(await tabLink.innerText())} | ${(await rows.count()) ? await rowsText(rows) : '0 rows'}`;
  });

  await read('report', async () => {
    const list = new InvoiceReportPage(page);
    await list.goto();
    await list.filter(filterType, apartment.building, apartment.name);
    await shot('report');
    return rowsText(list.rowsWith(apartment.name));
  });

  return s;
}

/** Attaches the before / after table to the report and returns the keys that changed. */
export async function compareCheckAreas(before: Snapshot, after: Snapshot): Promise<AreaKey[]> {
  const keys = (Object.keys(AREAS) as AreaKey[]).filter(k => k in before || k in after);
  const table = keys.map(k => `| ${AREAS[k]} | ${before[k]} | ${after[k]} | ${before[k] === after[k] ? 'same' : '**CHANGED**'} |`);
  await test.info().attach('check-areas.md', {
    body: ['| Check area | Before | After | |', '|---|---|---|---|', ...table].join('\n'),
    contentType: 'text/markdown'
  });
  return keys.filter(k => before[k] !== after[k]);
}
