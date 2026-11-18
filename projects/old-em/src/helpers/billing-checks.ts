// src/helpers/billing-checks.ts — the "Check areas" every billing case lists, for one posted (approved or
// imported) invoice / debit note on the test's own apartment:
//   Invoice/Debit Note list · Accounts Receivable list · Apartment summary / Invoices tab / SOA ·
//   Contact (owner) summary / Unpaid Invoices · Report › Invoices.
// Each area is a soft check with an evidence screenshot, so one run lists every difference.
// Dashboard AR and the AR page total are shared totals: other testers (and parallel suites) post to the same
// UAT while the test runs, so a before/after delta cannot be attributed to the test → recorded as not checked.
import { expect, type Page } from '@playwright/test';
import { test } from '@playwright/test';
import { evidence } from '@helpers/evidence';
import { ks } from '@data/billing';
import { type Apartment } from '@data/builders';
import { InvoicesListPage, InvoiceReportPage } from '@pages/billing/InvoiceListsPages';
import { AccountsReceivablePage } from '@pages/billing/AccountsReceivablePage';
import { ApartmentLedger, ContactLedger } from '@pages/billing/Ledgers';

export function notChecked(area: string, why: string): void {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

export interface PostedDoc {
  /** "Inv-202611-00028" / "DN-202611-00010". */
  code: string;
  category: string;
  amount: number;
  apartment: Apartment;
  /** The apartment's AR after posting (sum of its unpaid documents; the test's apartment only). */
  apartmentAR: number;
}

export async function checkPostedAreas(page: Page, caseId: string, doc: PostedDoc): Promise<void> {
  const { code, amount, apartment } = doc;
  notChecked('Dashboard AR amount', 'shared total; other testers and suites post to the same UAT during the run, so a delta cannot be attributed');

  await test.step(`Check area: Invoice/Debit Note list shows ${code}`, async () => {
    const list = new InvoicesListPage(page);
    await list.goto();
    await list.filterApartment(apartment.name);
    const row = list.row(code);
    await expect.soft(row, `${code} in Invoices - Debit Note list`).toHaveCount(1);
    await expect.soft(row, `${code} total in Invoices - Debit Note list`).toContainText(ks(amount));
    await evidence(page, `${caseId}_invoice-list`);
  });

  await test.step(`Check area: Accounts Receivable list shows ${code} unpaid`, async () => {
    const ar = new AccountsReceivablePage(page);
    const isDn = code.startsWith('DN-');
    await ar.goto('Unpaid', isDn ? 'Debit Note' : 'Invoice');
    if (isDn) test.info().annotations.push({ type: 'observed', description: 'Accounts Receivable list: with the type filter on its "All Type" placeholder only invoices are listed; the debit note shows after choosing Type = Debit Note' });
    const row = ar.row(code);
    await expect.soft(row, `${code} in Accounts Receivable › Unpaid`).toHaveCount(1);
    await expect.soft(row, `${code} due amount / status in Accounts Receivable`).toContainText(new RegExp(`${ks(amount)}.*Unpaid`, 'i'));
    await evidence(page, `${caseId}_accounts-receivable`);
  });

  const ledger = new ApartmentLedger(page);
  await test.step('Check area: Apartment summary amount', async () => {
    await ledger.goto(apartment.id);
    await expect.soft(ledger.accountsReceivable, 'Apartment › Summary › Accounts Receivable').toHaveText(`Accounts Receivable ${ks(doc.apartmentAR)}`);
    await evidence(page, `${caseId}_apartment-summary`);
  });

  await test.step(`Check area: Apartment Invoices list shows ${code} unpaid`, async () => {
    await ledger.gotoInvoices(apartment.id);
    const r = ledger.docRow(code);
    await expect.soft(r.row, `${code} in Apartment › Invoices`).toHaveCount(1);
    await expect.soft(r.category, `${code} category`).toHaveText(doc.category);
    await expect.soft(r.amount, `${code} amount`).toHaveText(ks(amount));
    await expect.soft(r.dueAmount, `${code} due amount`).toHaveText(ks(amount));
    await expect.soft(r.status, `${code} status in Apartment › Invoices`).toHaveText(/^unpaid$/i);
    await evidence(page, `${caseId}_apartment-invoices`);
  });

  await test.step(`Check area: Apartment SOA shows ${code}`, async () => {
    await ledger.gotoSoa(apartment.id);
    await expect.soft(ledger.soaRow(code), `${code} in Apartment › S.O.A`).toHaveCount(1);
    await expect.soft(ledger.soaRow(code), `${code} amount in S.O.A`).toContainText(ks(amount));
    await expect.soft(ledger.balanceDue, 'S.O.A Balance Due').toContainText(ks(doc.apartmentAR));
    await evidence(page, `${caseId}_apartment-soa`);
  });

  if (apartment.owner) {
    const contact = new ContactLedger(page);
    const owner = apartment.owner;
    await test.step('Check area: Contact (owner) summary amount', async () => {
      await contact.goto(owner.id);
      await expect.soft(contact.current, 'Contact › Summary › Current').toHaveText(ks(doc.apartmentAR));
      await evidence(page, `${caseId}_contact-summary`, [page.getByText(/Full Name:/)]);
    });
    await test.step(`Check area: Contact Unpaid Invoices shows ${code}`, async () => {
      await contact.gotoUnpaid(owner.id);
      await expect.soft(contact.row(code), `${code} in Contact › Unpaid Invoices`).toHaveCount(1);
      await evidence(page, `${caseId}_contact-unpaid`);
    });
  } else {
    notChecked('Contact summary / Unpaid Invoices', 'apartment has no owner');
  }

  await test.step(`Check area: Report › Invoices shows ${code}`, async () => {
    const report = new InvoiceReportPage(page);
    await report.goto();
    await report.filterApartment(apartment.name);
    await expect.soft(report.row(code), `${code} in Reports › Invoices`).toHaveCount(1);
    await expect.soft(report.row(code), `${code} total in Reports › Invoices`).toContainText(ks(amount));
    await evidence(page, `${caseId}_report-invoices`);
  });
}
