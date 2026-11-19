// Shared by the check-area probes: reads every INV "Check area" of one apartment (and its owner) on Old EM.
// Nothing is asserted; values are compared before / after by the probe that calls it.
// Known limits (2026-11-19): the Invoice/DN list and Report keep their default "Last 30 Days" filter, so a document
// dated earlier is not listed (choose Filter Type › Last Month); Apartment / Contact summaries may be read while
// still loading (0.00 everywhere, no owner details). Re-check those before using a value as an expected result.
import { type Page } from '@playwright/test';
import { evidence } from '@helpers/evidence';
import { waitLoaded } from '@data/billing';
import { type Apartment } from '@data/builders';
import { DashboardWidgets } from '@pages/balances/DashboardWidgets';
import { AccountsReceivablePage } from '@pages/billing/AccountsReceivablePage';
import { ApartmentLedger, ContactLedger } from '@pages/billing/Ledgers';
import { InvoiceDraftsPage, InvoiceReportPage, InvoicesListPage } from '@pages/billing/InvoiceListsPages';

export type Snapshot = Record<string, string>;

async function read(label: string, snap: Snapshot, fn: () => Promise<string>): Promise<void> {
  try {
    snap[label] = (await fn()).replace(/\s+/g, ' ').trim();
  } catch (e) {
    snap[label] = `n/a (${String(e).split('\n')[0].slice(0, 120)})`;
  }
}

/** Rows of a list filtered to our apartment, as "n row(s): <texts>". */
async function rowsText(rows: import('@playwright/test').Locator): Promise<string> {
  await rows.first().waitFor({ timeout: 8_000 }).catch(() => {});
  const texts = (await rows.allInnerTexts()).map(t => t.replace(/\s+/g, ' ').trim()).filter(t => t && !/no (data|record)/i.test(t));
  return `${texts.length} row(s)${texts.length ? `: ${texts.join(' || ')}` : ''}`;
}

export async function snapshot(page: Page, apartment: Apartment, tag: string): Promise<Snapshot> {
  const s: Snapshot = {};
  const shot = (name: string) => evidence(page, `probe_${tag}_${name}`).catch(() => {});

  await read('1. Dashboard AR (MMK) total | current | overdue', s, async () => {
    const d = new DashboardWidgets(page);
    await d.goto();
    const ar = await d.readAr('MMK');
    await shot('dashboard');
    return ar.text;
  });

  await read('2a. Accounts Receivable total (page heading)', s, async () => {
    const ar = new AccountsReceivablePage(page);
    await ar.goto('Unpaid', 'Invoice');
    await shot('accounts-receivable');
    const heading = await ar.heading.first().innerText();
    s['2b. Accounts Receivable list rows for our apartment'] = await rowsText(ar.rows.filter({ hasText: apartment.name }));
    return heading;
  });

  await read('3a. Invoice/Debit Note list rows for our apartment', s, async () => {
    const list = new InvoicesListPage(page);
    await list.goto();
    await list.filterApartment(apartment.name);
    await waitLoaded(page);
    await shot('invoice-list');
    return rowsText(list.rows.filter({ hasText: apartment.name }));
  });

  await read('3b. Inv/DN Draft list rows for our apartment', s, async () => {
    const list = new InvoiceDraftsPage(page);
    await list.goto();
    await list.filterApartment(apartment.name);
    await waitLoaded(page);
    await shot('draft-list');
    return rowsText(list.rows.filter({ hasText: apartment.name }));
  });

  const ledger = new ApartmentLedger(page);
  await read('4a. Apartment summary amount', s, async () => {
    await ledger.goto(apartment.id);
    await shot('apartment-summary');
    return ledger.accountsReceivable.innerText();
  });
  await read('4b. Apartment Invoices list', s, async () => {
    await ledger.gotoInvoices(apartment.id);
    await shot('apartment-invoices');
    return rowsText(ledger.invoiceRows);
  });
  await read('4c. Apartment SOA rows | Balance Due', s, async () => {
    await ledger.gotoSoa(apartment.id);
    await shot('apartment-soa');
    return `${await rowsText(ledger.soaRows.filter({ hasNotText: /^Date/ }))} | ${await ledger.balanceDue.innerText()}`;
  });

  const owner = apartment.owner!;
  const contact = new ContactLedger(page);
  await read('5a. Contact summary (Current bucket)', s, async () => {
    await contact.goto(owner.id);
    await shot('contact-summary');
    return contact.current.innerText();
  });
  await read('5b. Contact Unpaid Invoices list', s, async () => {
    await contact.gotoUnpaid(owner.id);
    await shot('contact-unpaid');
    return rowsText(contact.rows.filter({ hasNotText: /^#|Code/ }));
  });

  await read('6. Report › Invoices rows for our apartment', s, async () => {
    const report = new InvoiceReportPage(page);
    await report.goto();
    await report.filterApartment(apartment.name);
    await waitLoaded(page);
    await shot('report-invoices');
    return rowsText(report.rows.filter({ hasText: apartment.name }));
  });

  return s;
}

