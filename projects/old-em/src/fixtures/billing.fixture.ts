// src/fixtures/billing.fixture.ts — billing page objects (tests/billing/), on top of base.fixture.
import { test as base } from './base.fixture';
import { InvoiceForm } from '@pages/billing/InvoiceForm';
import { InvoiceDocPage } from '@pages/billing/InvoiceDocPage';
import { InvoiceDraftsPage, InvoicesListPage } from '@pages/billing/InvoiceListsPages';
import { UoListPage, EmListPage } from '@pages/billing/BillingListPages';
import { EmForm, EmDraftsPage } from '@pages/billing/EmPages';
import { ImportPage } from '@pages/billing/ImportPage';
import { DraftCounters } from '@pages/billing/DraftCounters';
import { ApartmentLedger } from '@pages/billing/Ledgers';

type BillingFixtures = {
  invoiceForm: InvoiceForm;
  debitNoteForm: InvoiceForm;
  invoiceDocPage: InvoiceDocPage;
  invoiceDraftsPage: InvoiceDraftsPage;
  invoicesListPage: InvoicesListPage;
  uoListPage: UoListPage;
  emListPage: EmListPage;
  emForm: EmForm;
  emDraftsPage: EmDraftsPage;
  uoImportPage: ImportPage;
  emImportPage: ImportPage;
  draftCounters: DraftCounters;
  apartmentLedger: ApartmentLedger;
};

export const test = base.extend<BillingFixtures>({
  invoiceForm: async ({ page }, use) => { await use(new InvoiceForm(page, 'invoice')); },
  debitNoteForm: async ({ page }, use) => { await use(new InvoiceForm(page, 'debit-note')); },
  invoiceDocPage: async ({ page }, use) => { await use(new InvoiceDocPage(page)); },
  invoiceDraftsPage: async ({ page }, use) => { await use(new InvoiceDraftsPage(page)); },
  invoicesListPage: async ({ page }, use) => { await use(new InvoicesListPage(page)); },
  uoListPage: async ({ page }, use) => { await use(new UoListPage(page)); },
  emListPage: async ({ page }, use) => { await use(new EmListPage(page)); },
  emForm: async ({ page }, use) => { await use(new EmForm(page)); },
  emDraftsPage: async ({ page }, use) => { await use(new EmDraftsPage(page)); },
  uoImportPage: async ({ page }, use) => { await use(new ImportPage(page, 'uo')); },
  emImportPage: async ({ page }, use) => { await use(new ImportPage(page, 'em')); },
  draftCounters: async ({ page }, use) => { await use(new DraftCounters(page)); },
  apartmentLedger: async ({ page }, use) => { await use(new ApartmentLedger(page)); }
});
