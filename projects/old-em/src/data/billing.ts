// src/data/billing.ts — billing test data through the Old EM UI (invoices, debit notes, EM, UO).
//
//   ks(n), uoKs(n), dmy(date), emTo(from, months)   formatting / date helpers as Old EM shows them
//   INV_001 / INV_020                              the cases' invoice / debit note data
//   createInvoiceDraft(page, apt, kind, data)      Create Invoice / Create Debit Note → draft
//                                                  → { draftId, draftUrl }
//   createEmDraft(page, apt, fee, months)          Add EM Entry (From = today) → draft "1 EM Entry saved."
//   approveEmDraft(page, apt)                      EM drafts › Approve → debit note
//   createApprovedUo(page, apt, readings, opts)    UO draft dated `monthsBack` months ago (day `day`), approved
//
// Every builder waits for Old EM's success toast. Use them on an apartment the test created.
import { expect, test, type Locator, type Page } from '@playwright/test';
import { toast } from '@components/Toast';
import { createApartment, type Apartment, type ApartmentOptions } from '@data/builders';
import { InvoiceForm, type DocKind, type InvoiceInput } from '@pages/billing/InvoiceForm';
import { EmForm, EmDraftsPage } from '@pages/billing/EmPages';
import { UoCreatePage, type UoReadings } from '@pages/uo/UoCreatePage';
import { UoDraftsPage } from '@pages/uo/UoDraftsPage';
import { showAllRows } from '@pages/billing/BillingListPages';

/** "2,781.00 Ks" as the documents show amounts. */
export const ks = (n: number) => `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ks`;
/** "1,015.00Ks" as the UO lists show amounts (no space). */
export const uoKs = (n: number) => ks(n).replace(' ', '');
/** Amount text → number ("2,781.00 Ks" → 2781). */
export const amountOf = (text: string) => Number(text.replace(/[^\d.-]/g, ''));

/** dd/mm/yyyy (lists, CSV) or dd-mm-yyyy (date pickers) with sep '-'. */
export function dmy(d: Date, sep = '/'): string {
  return [String(d.getDate()).padStart(2, '0'), String(d.getMonth() + 1).padStart(2, '0'), d.getFullYear()].join(sep);
}

/** EM "To": From + months − 1 day. */
export function emTo(from: Date, months: number): Date {
  return new Date(from.getFullYear(), from.getMonth() + months, from.getDate() - 1);
}

export function today(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Waits for Old EM's full-page "custom-loading" overlay to go (it can take long on a busy UAT). */
export async function waitLoaded(page: Page): Promise<void> {
  await expect(page.locator('.custom-loading')).toBeHidden({ timeout: 60_000 });
}

/**
 * createApartment with one retry: its owner step (shared DatePicker.pickToday) sometimes clicks the calendar
 * while it is still animating and times out. A retry makes a new apartment; the half-made one stays on UAT.
 */
export async function setupApartment(page: Page, opts: ApartmentOptions = {}): Promise<Apartment> {
  try {
    return await createApartment(page, opts);
  } catch (e) {
    test.info().annotations.push({ type: 'environment', description: `apartment setup retried: ${String(e).split('\n')[0]}` });
    return createApartment(page, opts);
  }
}

// ── Invoice / debit note ────────────────────────────────────────────────────────────────────

/** INV-001 test data: 2 × 1,500, 10 % discount, 3 % tax → 2,700 + 81 = 2,781. */
export const INV_001: InvoiceInput & { expected: { discPrice: number; tax: number; total: number; gross: number; discount: number; grand: number } } = {
  category: 'Maintenance Services',
  paymentTerms: '+7 days',
  line: { description: 'Maintenance fees', taxType: '3% Tax', unit: 2, grossPrice: 1500, discountPercent: 10 },
  expected: { discPrice: 1350, tax: 81, total: 2700, gross: 3000, discount: 300, grand: 2781 }
};

/** INV-020 test data: 150 × 1,500 = 225,000, no tax. */
export const INV_020: InvoiceInput & { expected: { total: number } } = {
  category: 'Internet',
  paymentTerms: '+15 days',
  line: { description: 'To pay bill', unit: 150, grossPrice: 1500 },
  expected: { total: 225_000 }
};

export const DOC_TOAST = {
  invoice: { created: 'Invoice has been successfully created', approved: 'Invoice has been approved successfully' },
  'debit-note': { created: 'Debit Note has been successfully created', approved: 'Debit Note has been approved successfully' }
} as const;

/** Records that the global "Old CoRef No." setting was on (another tester's change) and what was filled. */
export function noteOldCoRef(value: string | undefined): void {
  if (value) test.info().annotations.push({ type: 'environment', description: `Settings › General › "Old CoRef No." was Enabled on UAT (not by this test); the form required it, filled "${value}"` });
}

export async function createInvoiceDraft(page: Page, apartment: Pick<Apartment, 'name'>, kind: DocKind, data: InvoiceInput): Promise<{ draftId: string; draftUrl: string }> {
  const form = new InvoiceForm(page, kind);
  await form.goto();
  noteOldCoRef(await form.fill(apartment.name, data));
  await form.createButton.click();
  await expect(toast(page, DOC_TOAST[kind].created)).toBeVisible();
  await expect(page).toHaveURL(/\/invoices\/\d+\/draft$/);
  const draftId = page.url().match(/\/invoices\/(\d+)\/draft/)![1];
  return { draftId, draftUrl: `/invoices/${draftId}/draft` };
}

// ── EM ──────────────────────────────────────────────────────────────────────────────────────

export async function createEmDraft(page: Page, apartment: Pick<Apartment, 'name'>, monthlyFee: number, months: number): Promise<void> {
  const form = new EmForm(page);
  await form.goto();
  await form.apartment.choose(apartment.name);
  await form.fill(monthlyFee, months);
  await form.submitButton.click();
  await expect(toast(page, 'EM Entry saved')).toBeVisible();
}

export async function approveEmDraft(page: Page, apartment: Pick<Apartment, 'name'>): Promise<void> {
  const drafts = new EmDraftsPage(page);
  await drafts.goto();
  await drafts.approve(apartment.name);
  await expect(toast(page, 'EM has been approved successfully')).toBeVisible();
}

// ── UO ──────────────────────────────────────────────────────────────────────────────────────

/** Picks `day` of the month `monthsBack` months before the current one in a PrimeVue calendar. */
export async function pickPastDay(page: Page, chooseDateButton: Locator, monthsBack: number, day: number): Promise<void> {
  await chooseDateButton.click();
  const panel = page.getByRole('dialog', { name: 'Choose Date' });
  for (let i = 0; i < monthsBack; i++) await panel.getByRole('button', { name: 'Previous Month' }).click();
  await panel.locator('td:not(.p-datepicker-other-month) > span').getByText(String(day), { exact: true }).click();
  await expect(panel).toBeHidden();
}

/** A manual UO reading dated `day` of `monthsBack` months ago, approved (→ Utilities invoice). */
export async function createApprovedUo(page: Page, apartment: Pick<Apartment, 'name'>, readings: UoReadings, opts: { monthsBack: number; day: number }): Promise<Date> {
  const form = new UoCreatePage(page);
  await form.goto();
  await waitLoaded(page);
  await form.selectApartment(apartment.name);
  await form.fillReadings(readings);
  await pickPastDay(page, page.getByRole('button', { name: 'Choose Date' }), opts.monthsBack, opts.day);
  const t = today();
  const date = new Date(t.getFullYear(), t.getMonth() - opts.monthsBack, opts.day);
  await expect(page.getByRole('combobox', { name: 'Select Date' })).toHaveValue(dmy(date, '-'));
  await form.submitButton.click();
  await expect(toast(page, 'UO Entry saved')).toBeVisible();
  const drafts = new UoDraftsPage(page);
  await drafts.goto();
  await showAllRows(page);
  await drafts.approve(apartment.name);
  await expect(toast(page, 'UO Entry Invoiced Successfully')).toBeVisible();
  return date;
}
