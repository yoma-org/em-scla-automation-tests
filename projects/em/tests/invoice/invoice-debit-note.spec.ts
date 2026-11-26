// Invoice & Debit Note (docs/test-cases/features/04-invoice-debit-note.md), run on the test environment
// (TARGET_ENV=test). Each test bills its own new apartment with a new owner (created through the API), so the
// apartment / contact check areas start from zero. Drafts stay on the environment (nothing is deleted).
//
// Expected results the case does not state come from the Old EM run
// (projects/old-em, probe check-areas-draft-invoice): a DRAFT changes only the Inv/DN draft list and the
// Inv/DN pending counter; every other check area stays the same. Messages must match the case doc's text exactly.
// Test data: category "Maintenance Service" (the test env has no "Maintenance Services").
import { test, expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { amountOrNull, parseAmount } from '@helpers/money';
import { createApartmentWithOwner } from '@api/estates';
import { AREAS, agingAmount, compareCheckAreas, readCheckAreas, type AreaKey } from '@helpers/checkAreas';
import { filterTypeFor, InvoiceDraftsPage, InvoiceRegisterPage } from '@pages/invoices/InvoiceListPages';
import { InvoiceDetailPage } from '@pages/invoices/InvoiceDetailPage';
import { PendingApprovals } from '@components/PendingApprovals';

// One test at a time, in file order, also in CI (fullyParallel, 2 workers): the cases compare shared totals
// (Dashboard AR, AR total, Inv/DN pending counter) before / after, so two tests posting at once would skew them.
test.describe.configure({ mode: 'default' });

const dmy = (d: Date, sep = '-') =>
  [d.getDate(), d.getMonth() + 1].map(n => String(n).padStart(2, '0')).concat(String(d.getFullYear())).join(sep);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
/** Same day last month (clamped to that month's last day). */
const lastMonth = () => {
  const t = today();
  const last = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
  return new Date(t.getFullYear(), t.getMonth() - 1, Math.min(t.getDate(), last));
};

/** Aging card that holds a document `days` overdue (Apartment / Contact summary, AR page). */
const agingBand = (days: number) =>
  days <= 0 ? 'Current' : days <= 30 ? '1 Day to 30 Days' : days <= 60 ? '31 Days to 60 Days' : days <= 90 ? '61 Days to 90 Days'
    : days <= 120 ? '91 Days to 120 Days' : days <= 150 ? '121 Days to 150 Days' : days <= 180 ? '151 Days to 180 Days' : '> 180 Days';

/** INV-001 test data (case) and the figures the user confirmed. */
const INV_001 = {
  category: 'Maintenance Service',
  paymentTerms: /^\+?7 ?days$/i,
  line: { description: 'Maintenance fees', taxType: '3% Tax' as const, unit: '2', grossPrice: '1500', discount: '10' },
  expected: { discPrice: '1350.00', tax: '81.00', lineTotal: '2700.00', gross: '3000.00', discount: '300.00', grand: '2781.00' }
};

type CreateInvoicePage = import('@pages/invoices/CreateInvoicePage').CreateInvoicePage;

/**
 * Another item line for createInvoiceSteps (INV-012, INV-013): filled with the Discount in Ks when `discountInKs`.
 * The case gives no figures for it, so the calculated figures are recorded, not checked.
 */
interface CustomLine { label: string; input: import('@pages/invoices/CreateInvoicePage').InvoiceLineInput; discountInKs?: boolean }

/** INV-012 / INV-013 test data (case): 200 × gross price, 3% Tax, Discount 10 Ks. */
const bigPriceLine = (grossPrice: string): CustomLine => ({
  label: `Unit 200, Gross price ${grossPrice}, 3% Tax, Discount 10 Ks`,
  // Entered without thousands separators, as a user types it (a value with commas is not taken by the field).
  input: { description: 'Maintenance fees', taxType: '3% Tax', unit: '200', grossPrice: grossPrice.replace(/,/g, ''), discount: '10' },
  discountInKs: true
});

/**
 * Steps 1-6 shared by the "create invoice" cases (INV-001, INV-003, …): menu › Add Invoice › defaults › header
 * (apartment, Maintenance Service, +7 days, `date`) › the INV-001 line and its figures › Create.
 * `successMessage`: the case expects a success message after Create (INV-001 Expected 1).
 * Ends on the new draft's detail page.
 */
async function createInvoiceSteps(page: import('@playwright/test').Page, form: CreateInvoicePage, apartment: string, date: Date,
  opts: { tag: string; successMessage?: boolean; line?: CustomLine }): Promise<void> {
  const e = INV_001.expected;
  await test.step('1. Click "Invoices / Debit Note" from left menu', async () => {
    await page.goto('/dashboard');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
    await expect(page).toHaveURL(/\/receivables\/invoices$/);
  });

  await test.step('2. Click "Add invoice" button', async () => {
    await page.getByRole('link', { name: 'Add Invoice' }).click();
    await expect(form.heading).toBeVisible();
  });

  await test.step('3. Currency will be MMK and Date will be today (default)', async () => {
    await expect.soft(form.currency, 'default currency').toHaveText('MMK');
    await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
    await evidence(page, `${opts.tag}_step3-defaults`);
  });

  await test.step(`4. Fill the required fields (apartment, category, payment terms +7 days, date ${dmy(date, '/')})`, async () => {
    await form.chooseApartment(apartment);
    await form.chooseCategory(INV_001.category);
    await form.choosePaymentTerms(INV_001.paymentTerms);
    if (dmy(date) !== dmy(today())) {
      await form.date.fill(dmy(date));
      await form.date.blur();
      await expect(form.date).toHaveValue(dmy(date));
    }
    // Not part of the case: shown only while Settings › General › "Old CoRef No." is enabled on the environment.
    const oldCoRef = await form.fillOldCoRefIfShown();
    if (oldCoRef) test.info().annotations.push({ type: 'environment', description: `Settings › General › "Old CoRef No." is enabled on the environment (not by this test); the form required it, filled "${oldCoRef}"` });
  });

  if (opts.line) {
    const custom = opts.line;
    await test.step(`5. Fill the item (${custom.label}); Discount price, Tax and Total are auto calculated`, async () => {
      const line = form.line(0);
      await line.fill({ ...custom.input, discount: undefined });
      if (custom.discountInKs) await form.discountInKs.check();
      if (custom.input.discount !== undefined) {
        await line.discount.fill(custom.input.discount);
        await line.discount.blur();
      }
      await expect.poll(() => line.total.innerText().then(t => amountOrNull(t.trim(), 3)), 'line Total is calculated').not.toBeNull();
      await expect.soft(line.grossPrice, 'Gross Price is kept as entered').toHaveValue(custom.input.grossPrice.replace(/,/g, ''));
      const text = async (l: import('@playwright/test').Locator) => (await l.innerText()).replace(/\s+/g, ' ').trim();
      test.info().annotations.push({ type: 'observed', description: `form figures: Disc. Price ${await text(line.discPrice)} · Tax ${await text(line.tax)} · Total ${await text(line.total)} | ${await text(form.totals)}` });
      await evidence(page, `${opts.tag}_step5-calculated`);
    });
  } else await test.step('5. Fill the item; Discount price, Tax and Total are auto calculated', async () => {
    const line = form.line(0);
    await line.fill(INV_001.line);
    const amount = async (l: import('@playwright/test').Locator) => parseAmount((await l.innerText()).trim(), 2);
    await expect.poll(() => amount(line.total).catch(() => null), 'line Total (2 × 1,350)').toBe(e.lineTotal);
    expect.soft(await amount(line.discPrice), 'line Disc. Price (1,500 − 10 %)').toBe(e.discPrice);
    expect.soft(await amount(line.tax), 'line Tax (3 % of 2,700)').toBe(e.tax);
    expect.soft(await amount(form.total('Gross Total')), 'Gross Total').toBe(e.gross);
    // The totals box shows the discount in brackets, "(300.00 Ks)": compare the amount, not the sign.
    expect.soft((await amount(form.total('Discount'))).replace(/^-/, ''), 'Discount').toBe(e.discount);
    expect.soft(await amount(form.total('Commercial Tax')), 'Commercial Tax').toBe(e.tax);
    expect.soft(await amount(form.total('Grand Total')), 'Grand Total').toBe(e.grand);
    await evidence(page, `${opts.tag}_step5-calculated`);
  });

  await test.step(`6. Click "Create" button${opts.successMessage ? ' → Expected 1: success message' : ''}`, async () => {
    await form.createButton.click();
    if (opts.successMessage) {
      // Exact text of the case doc's Expected 1.
      const message = page.getByText('Invoice has been successfully created.', { exact: true }).first();
      await expect.soft(message, '"Invoice has been successfully created." message (exact text from the case)').toBeVisible({ timeout: 10_000 });
      test.info().annotations.push({ type: 'observed', description: (await message.isVisible())
        ? `message "${(await message.innerText()).trim()}"`
        : 'no success message; New EM shows only "Creating this draft…" and then opens the invoice detail' });
    }
    await expect(page).toHaveURL(InvoiceDetailPage.URL, { timeout: 30_000 });
    await evidence(page, `${opts.tag}_step6-created`);
  });
}

/**
 * Enters `value` in a line's Discount field, typed key by key or pasted, and leaves the field.
 * Typing stops as soon as the field is cleared: that is the auto-clear; keys typed after it are the user's own new
 * input. Returns what the field shows afterwards.
 */
async function enterDiscount(page: import('@playwright/test').Page, line: ReturnType<CreateInvoicePage['line']>, value: string,
  input: 'typed' | 'pasted'): Promise<string> {
  await line.discount.click();
  if (input === 'typed') {
    const seen: string[] = [];
    for (const ch of value) {
      await page.keyboard.type(ch);
      const v = await line.discount.inputValue();
      seen.push(`${ch}→"${v}"`);
      if (value.includes('.')) expect.soft(v, `the decimal point is never accepted (after "${ch}")`).not.toContain('.');
      if (v === '') break;
    }
    test.info().annotations.push({ type: 'observed', description: `${value} typed key by key until cleared: ${seen.join('  ')}` });
  } else {
    await line.discount.fill(value);
  }
  await line.discount.blur();
  await page.waitForLoadState('networkidle').catch(() => {});
  return line.discount.inputValue();
}

/**
 * Steps 5-6 of the discount validation cases (INV-004, INV-005): fill the required fields, then — only when the
 * discount was NOT cleared — click Create and check that no invoice is created (Expected 1). When it was cleared,
 * Create is not clicked: it would create a valid invoice without the discount.
 */
async function rejectedDiscountCreateSteps(page: import('@playwright/test').Page, form: CreateInvoicePage, apartment: string,
  opts: { tag: string; label: string }): Promise<void> {
  const line = form.line(0);
  await test.step('5. Fill the required fields', async () => {
    await form.chooseApartment(apartment);
    await form.chooseCategory(INV_001.category);
    await form.choosePaymentTerms(INV_001.paymentTerms);
    const oldCoRef = await form.fillOldCoRefIfShown();
    if (oldCoRef) test.info().annotations.push({ type: 'environment', description: `"Old CoRef No." setting enabled; filled "${oldCoRef}"` });
  });
  await test.step(`6. Click "Create" → Expected 1: no invoice with ${opts.label}`, async () => {
    const left = await line.discount.inputValue();
    if (left === '') {
      test.info().annotations.push({ type: 'observed', description: `${opts.label}: cleared, so Create was not clicked (it would create an invoice without discount)` });
      return;
    }
    await form.createButton.click();
    await page.waitForURL(InvoiceDetailPage.URL, { timeout: 30_000 }).catch(() => {});
    await expect.soft(page, `no invoice is created with ${opts.label} (Discount field still "${left}")`).toHaveURL(/\/receivables\/invoices\/new$/);
    const messages = (await page.getByRole('main').getByRole('alert').allInnerTexts()).map(t => t.trim()).filter(Boolean);
    test.info().annotations.push({ type: 'observed', description: `${opts.label}: Discount "${left}", after Create the page is ${new URL(page.url()).pathname}${messages.length ? `; message: ${messages.join(' | ')}` : ''}` });
    await evidence(page, `${opts.tag}_step6-create`);
  });
}

/**
 * Records short texts that appear on the page from now on (toasts, alerts, status lines), so a message that
 * disappears quickly, or uses other words than the case, is still reported. Returns a reader.
 */
async function watchMessages(page: import('@playwright/test').Page): Promise<() => Promise<string[]>> {
  await page.evaluate(() => {
    const w = window as unknown as { __qeMessages: string[]; __qeObserver?: MutationObserver };
    w.__qeObserver?.disconnect();
    w.__qeMessages = [];
    w.__qeObserver = new MutationObserver(records => {
      for (const r of records) for (const n of Array.from(r.addedNodes)) {
        const el = n instanceof Element ? n : n.parentElement;
        const text = el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        if (text && text.length <= 150 && /success|approv|creat|saved|error|fail/i.test(text) && !w.__qeMessages.includes(text)) w.__qeMessages.push(text);
      }
    });
    w.__qeObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
  return () => page.evaluate(() => (window as unknown as { __qeMessages?: string[] }).__qeMessages ?? []).catch(() => []);
}

/** Debit note data for createDebitNoteSteps; `expected` figures as the line Total / Grand Total show them. */
interface DebitNoteData {
  category: string;
  paymentTerms: RegExp;
  terms: string;
  line: { description: string; unit: string; grossPrice: string };
  expected: { lineTotal: string; grand: string; total: string };
}

/** INV-020 test data (case), category "Internet" added on the test env for it. */
const INV_020: DebitNoteData = {
  category: 'Internet',
  paymentTerms: /^\+?15 ?days$/i,
  terms: '+15 days',
  line: { description: 'To pay bill', unit: '150', grossPrice: '1500' },
  expected: { lineTotal: '225000.00', grand: '225000.00', total: '225,000.00 Ks' }
};

/** INV-025 test data (case): the largest gross price, 14 integer digits + 2 decimals. */
const INV_025: DebitNoteData = {
  ...INV_020,
  line: { description: 'To pay bill', unit: '1', grossPrice: '12345678901234.56' },
  expected: { lineTotal: '12345678901234.56', grand: '12345678901234.56', total: '12,345,678,901,234.56 Ks' }
};

/** INV-029 test data (case): "Maintenance Services" (test env: "Maintenance Service"), +7 days, 2 × 1,500. */
const INV_029: DebitNoteData = {
  category: 'Maintenance Service',
  paymentTerms: /^\+?7 ?days$/i,
  terms: '+7 days',
  line: { description: 'Maintenance fees', unit: '2', grossPrice: '1500' },
  expected: { lineTotal: '3000.00', grand: '3000.00', total: '3,000.00 Ks' }
};

const KIND = {
  invoice: { label: 'Invoice', type: 'INVOICE', code: /^#?INV-\d{6}-\d+$/, approved: 'Invoice has been approved successfully.' },
  'debit-note': { label: 'Debit Note', type: 'DEBIT NOTE', code: /^#?DN-\d{6}-\d+$/, approved: 'Debit Note has been approved successfully.' }
} as const;

/**
 * Steps 1-6 of the create debit note cases (INV-020, INV-025, INV-029): menu › Add Debit Note › required fields
 * (apartment, category, payment terms, `date`) › defaults › the line and its Total › Create. `data` defaults to
 * INV-020's (Internet, +15 days, 150 × 1,500). Ends on the new draft's detail page.
 */
async function createDebitNoteSteps(page: import('@playwright/test').Page, form: CreateInvoicePage, apartment: string, date: Date,
  opts: { tag: string; successMessage?: boolean; data?: DebitNoteData }): Promise<void> {
  const d = opts.data ?? INV_020;
  const e = d.expected;
  await test.step('1. Click "Invoices / Debit Note" from left menu', async () => {
    await page.goto('/dashboard');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
    await expect(page).toHaveURL(/\/receivables\/invoices$/);
  });
  await test.step('2. Click "Add Debit Note" button', async () => {
    await page.getByRole('link', { name: 'Add Debit Note' }).click();
    await expect(page).toHaveURL(/\/receivables\/debit-notes\/new$/);
    await expect(form.heading).toBeVisible();
  });
  await test.step(`3. Fill the required fields (apartment, ${d.category}, payment terms ${d.terms}, date ${dmy(date, '/')})`, async () => {
    await form.chooseApartment(apartment);
    await form.chooseCategory(d.category);
    await form.choosePaymentTerms(d.paymentTerms);
    const oldCoRef = await form.fillOldCoRefIfShown();
    if (oldCoRef) test.info().annotations.push({ type: 'environment', description: `Settings › General › "Old CoRef No." is enabled on the environment (not by this test); the form required it, filled "${oldCoRef}"` });
  });
  await test.step('4. Currency will be MMK and Date will be today (default)', async () => {
    await expect.soft(form.currency, 'default currency').toHaveText('MMK');
    await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
    if (dmy(date) !== dmy(today())) {
      await form.date.fill(dmy(date));
      await form.date.blur();
      await expect(form.date).toHaveValue(dmy(date));
    }
  });
  await test.step(`5. Item "${d.line.description}", Unit ${d.line.unit}, Gross price ${d.line.grossPrice} → Total ${e.total} calculated automatically`, async () => {
    const line = form.line(0);
    await line.fill(d.line);
    const amount = async (l: import('@playwright/test').Locator) => parseAmount((await l.innerText()).trim(), 2);
    await expect.poll(() => amount(line.total).catch(() => null), `line Total (${d.line.unit} × ${d.line.grossPrice})`).toBe(e.lineTotal);
    expect.soft(await amount(form.total('Grand Total')), 'Grand Total').toBe(e.grand);
    await evidence(page, `${opts.tag}_step5-calculated`);
  });
  await test.step(`6. Click "Create" button${opts.successMessage ? ' → Expected 1: success message' : ''}`, async () => {
    const messages = await watchMessages(page);
    const message = page.getByText('Debit Note has been successfully created.', { exact: true }).first();
    const shown = message.waitFor({ timeout: 30_000 }).then(() => true, () => false);
    await form.createButton.click();
    await expect(page).toHaveURL(InvoiceDetailPage.URL, { timeout: 30_000 });
    if (opts.successMessage) {
      expect.soft(await shown, '"Debit Note has been successfully created." message (exact text from the case)').toBe(true);
      const seen = await messages();
      test.info().annotations.push({ type: 'observed', description: `after Create: ${seen.length ? seen.map(t => `"${t}"`).join(' | ') : 'no message'}` });
    }
    await evidence(page, `${opts.tag}_step6-created`);
  });
}

/**
 * Steps 1-5 of the approve cases (INV-017, INV-031): "Inv/DN" on the top › our apartment's draft › Manage › check the
 * data › Approve. The success message is Old EM's wording (Old EM is the expected behaviour). Returns the ref number.
 */
async function approveFromDraftsSteps(page: import('@playwright/test').Page, apartment: string, kind: keyof typeof KIND,
  opts: { tag: string; total: string; category: string }): Promise<string> {
  const k = KIND[kind];
  const detail = new InvoiceDetailPage(page);
  await test.step('1. Click "Inv/DN" on the top', async () => {
    await page.goto('/dashboard');
    await new PendingApprovals(page).link('Inv/DN').click();
    await expect(page).toHaveURL(/\/receivables\/invoices\/drafts/);
  });
  const drafts = new InvoiceDraftsPage(page);
  await test.step(`2. Choose the ${k.label.toLowerCase()} (our apartment's draft)`, async () => {
    await drafts.filterApartment(apartment);
    const row = drafts.rowsWith(apartment).filter({ hasText: k.type });
    await expect(row, `one ${k.type} draft for ${apartment}`).toHaveCount(1);
    await expect.soft(row, 'draft row: category and total').toContainText(new RegExp(`${opts.category}.*${opts.total.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  });
  await test.step('3. Click "Manage" button', async () => {
    await drafts.manageLink(drafts.rowsWith(apartment).filter({ hasText: k.type })).click();
    await expect(page).toHaveURL(InvoiceDetailPage.URL);
    await expect(detail.heading).toBeVisible();
  });
  await test.step('4. Check the data', async () => {
    await expect.soft(detail.type, 'document type').toHaveText(k.type);
    await expect.soft(detail.status, 'status').toHaveText('Draft');
    await expect.soft(detail.issuedTo, 'issued to our apartment').toContainText(apartment);
    await expect.soft(detail.field('Total'), 'total').toHaveText(opts.total);
    await evidence(page, `${opts.tag}_step4-draft`);
  });
  let code = '';
  await test.step(`5. Click "Approve" button → Expected 1: ${k.label} approved successfully with ref number`, async () => {
    const messages = await watchMessages(page);
    const message = page.getByText(k.approved, { exact: true }).first();
    const shown = message.waitFor({ timeout: 30_000 }).then(() => true, () => false);
    await detail.approve();
    expect.soft(await shown, `"${k.approved}" message (Old EM wording + full stop)`).toBe(true);
    const seen = await messages();
    test.info().annotations.push({ type: 'observed', description: `after Approve: ${seen.length ? seen.map(t => `"${t}"`).join(' | ') : 'no message'}` });
    code = (await detail.code.innerText()).replace(/^#/, '').trim();
    expect.soft(code, 'ref number').toMatch(k.code);
    await expect.soft(detail.status, 'status after approval').toHaveText(/^Unpaid$/i);
    test.info().annotations.push({ type: 'data', description: `approved ${code} (#${detail.id()})` });
    await evidence(page, `${opts.tag}_step5-approved`);
  });
  return code;
}

/**
 * Check areas after an approval dated today and not yet due (INV-017, INV-031): the document is unpaid and "Current"
 * in AR, the Invoice/DN list, the apartment (summary, Invoices, SOA), the contact (summary, Unpaid) and the Invoices
 * report; the Draft list is back to before. Same areas as INV-003 (from the Old EM run), with no overdue amount.
 */
function approvedAreaChecks(before: Record<AreaKey, string>, after: Record<AreaKey, string>,
  doc: { code: string; date: Date; due: Date; total: string; amount: number; pendingAfterDraft: number }): void {
  const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const C = esc(doc.code), D = esc(dmy(doc.date, '/')), DUE = esc(dmy(doc.due, '/')), T = esc(doc.total);
  const row = (k: AreaKey, re: RegExp) => expect.soft(after[k], AREAS[k]).toMatch(re);
  row('arList', new RegExp(`^1 row\\(s\\): ${C}.*${T} ${T} ${D} ${DUE} Unpaid`));
  for (const k of ['apartmentSummary', 'contactSummary'] as const) {
    expect.soft(agingAmount(after[k], 'Current'), `${AREAS[k]}: Current`).toBe(doc.total);
    expect.soft(agingAmount(after[k], 'Total Amount Overdue'), `${AREAS[k]}: Total Amount Overdue`).toBe('0.00 Ks');
    expect.soft(after[k], `${AREAS[k]}: Accounts Receivable`).toMatch(new RegExp(`^Accounts Receivable ${T}`));
  }
  // Shared totals: others may post at the same time, so a different delta is reported, not proven wrong.
  const mmk = (t: string, re: RegExp) => Number((re.exec(t)?.[1] ?? 'NaN').replace(/,/g, ''));
  const delta = (k: AreaKey, re: RegExp) => Math.round((mmk(after[k], re) - mmk(before[k], re)) * 100) / 100;
  expect.soft(delta('arTotal', /Accounts Receivable ([\d,.]+) Ks/), `${AREAS.arTotal} +${doc.amount} (shared total)`).toBe(doc.amount);
  expect.soft(delta('dashboardAr', /Current ([\d,.]+) Ks/), `${AREAS.dashboardAr}: MMK Current +${doc.amount} (shared total)`).toBe(doc.amount);
  expect.soft(delta('dashboardAr', /Overdue ([\d,.]+) Ks/), `${AREAS.dashboardAr}: MMK Overdue unchanged (shared total)`).toBe(0);
  row('invoiceList', new RegExp(`^1 row\\(s\\): .*${C}.*${T} 0\\.00 Ks ${T} ${D}`));
  expect.soft(after.draftList, `${AREAS.draftList}: back to before (the draft became the document)`).toBe(before.draftList);
  expect.soft(Number(after.pendingInvDn), `${AREAS.pendingInvDn}: −1 after approval (others may add drafts too)`).toBeLessThanOrEqual(doc.pendingAfterDraft - 1);
  row('apartmentInvoices', new RegExp(`^1 row\\(s\\): .*${C}.*${T}.*${DUE}.*Unpaid`, 'i'));
  row('apartmentSoa', new RegExp(`Balance Due:? ${T}`));
  row('contactUnpaid', new RegExp(`^Unpaid Invoices \\(1\\) \\| 1 row\\(s\\): .*${C}.*${T}.*${DUE}.*Unpaid`, 'i'));
  row('report', new RegExp(`^1 row\\(s\\): .*${C}.*${T} 0\\.00 Ks ${T} ${D}`));
}

/**
 * Check areas after approving a document dated the 1st of last month and already overdue (INV-003, INV-029), from the
 * Old EM run (projects/old-em probe check-areas-approved-invoice): unpaid and overdue in AR, the Invoice/DN list, the
 * apartment (summary in the aging `band`, Invoices, SOA), the contact (summary, Unpaid) and the Invoices report; the
 * Draft list is back to before.
 */
function overdueAreaChecks(before: Record<AreaKey, string>, after: Record<AreaKey, string>,
  doc: { code: string; date: Date; due: Date; total: string; amount: number; band: string; pendingAfterDraft: number }): void {
  const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const C = esc(doc.code), D = esc(dmy(doc.date, '/')), DUE = esc(dmy(doc.due, '/')), T = esc(doc.total);
  const row = (k: AreaKey, re: RegExp) => expect.soft(after[k], AREAS[k]).toMatch(re);
  row('arList', new RegExp(`^1 row\\(s\\): ${C}.*${T} ${T} ${D} ${DUE} Unpaid`));
  for (const k of ['apartmentSummary', 'contactSummary'] as const) {
    expect.soft(agingAmount(after[k], 'Current'), `${AREAS[k]}: Current`).toBe('0.00 Ks');
    expect.soft(agingAmount(after[k], 'Total Amount Overdue'), `${AREAS[k]}: Total Amount Overdue`).toBe(doc.total);
    expect.soft(agingAmount(after[k], doc.band), `${AREAS[k]}: ${doc.band}`).toBe(doc.total);
    expect.soft(after[k], `${AREAS[k]}: Accounts Receivable`).toMatch(new RegExp(`^Accounts Receivable ${T}`));
  }
  // Shared totals: others may post at the same time, so a different delta is reported, not proven wrong.
  const mmk = (t: string, re: RegExp) => Number((re.exec(t)?.[1] ?? 'NaN').replace(/,/g, ''));
  const delta = (k: AreaKey, re: RegExp) => Math.round((mmk(after[k], re) - mmk(before[k], re)) * 100) / 100;
  expect.soft(delta('arTotal', /Accounts Receivable ([\d,.]+) Ks/), `${AREAS.arTotal} +${doc.amount} (shared total)`).toBe(doc.amount);
  expect.soft(delta('dashboardAr', /Overdue ([\d,.]+) Ks/), `${AREAS.dashboardAr}: MMK Overdue +${doc.amount} (shared total)`).toBe(doc.amount);
  expect.soft(delta('dashboardAr', /Current ([\d,.]+) Ks/), `${AREAS.dashboardAr}: MMK Current unchanged (shared total)`).toBe(0);
  row('invoiceList', new RegExp(`^1 row\\(s\\): .*${C}.*${T} 0\\.00 Ks ${T} ${D}`));
  expect.soft(after.draftList, `${AREAS.draftList}: back to before (the draft became the document)`).toBe(before.draftList);
  expect.soft(Number(after.pendingInvDn), `${AREAS.pendingInvDn}: −1 after approval (others may add drafts too)`).toBeLessThanOrEqual(doc.pendingAfterDraft - 1);
  row('apartmentInvoices', new RegExp(`^1 row\\(s\\): .*${C}.*${T}.*${DUE}.*Unpaid`, 'i'));
  row('apartmentSoa', new RegExp(`Balance Due:? ${T}`));
  row('contactUnpaid', new RegExp(`^Unpaid Invoices \\(1\\) \\| 1 row\\(s\\): .*${C}.*${T}.*${DUE}.*Unpaid`, 'i'));
  row('report', new RegExp(`^1 row\\(s\\): .*${C}.*${T} 0\\.00 Ks ${T} ${D} test1 test1`));
}

test.describe('Invoices · Invoice', () => {
  test.describe.configure({ timeout: 480_000 });

  // The title's "dated last month to today": the case runs twice in one test, dated today and dated last month,
  // each on its own new apartment. A failure names its run in the step title.
  test('INV-001 Create generic invoice (MMK, dated last month to today) as draft',
    testCase({ id: 'INV-001', source: 'TC_Inv_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, createInvoicePage: form }) => {
      for (const variant of [{ label: 'today', date: today }, { label: 'last month', date: lastMonth }]) await test.step(`Dated ${variant.label}`, async () => {
        const date = variant.date();
        const e = INV_001.expected;
        const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
          createApartmentWithOwner(page.request, test.info(), addDays(date, -30)));
        test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner ${apartment.owner.name} (contact ${apartment.owner.id}), invoice date ${dmy(date, '/')}` });
        const filterType = filterTypeFor(date);
        const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, filterType, `${variant.label.replace(' ', '-')}_before`));

        await createInvoiceSteps(page, form, apartment.name, date, { tag: `INV-001_${variant.label}`, successMessage: true });

        await test.step('Expected 2: invoice is saved as draft in Inv/DN', async () => {
          const detail = new InvoiceDetailPage(page);
          await expect(page).toHaveURL(InvoiceDetailPage.URL);
          await detail.loaded();
          await expect.soft(detail.status, 'status').toHaveText('Draft');
          await expect.soft(detail.field('Total'), 'saved total').toHaveText(/2,781\.00/);
          await expect.soft(detail.field('Issue Date'), 'issue date').toHaveText(dmy(date, '/'));
          await expect.soft(detail.field('Due Date'), 'due date = issue date + 7 days').toHaveText(dmy(addDays(date, 7), '/'));
          test.info().annotations.push({ type: 'data', description: `draft invoice #${detail.id()}` });
          await evidence(page, `INV-001_${variant.label}_expected2-draft`);
        });

        const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, filterType, `${variant.label.replace(' ', '-')}_after`));
        const changed = await compareCheckAreas(before, after);

        await test.step('Expected 3: notification to the approver (Inv/DN pending counter +1, draft listed)', async () => {
          expect.soft(Number(after.pendingInvDn), 'Inv/DN pending counter (others may add drafts too)').toBeGreaterThanOrEqual(Number(before.pendingInvDn) + 1);
          await new PendingApprovals(page).link('Inv/DN').click();
          await expect(page).toHaveURL(/\/receivables\/invoices\/drafts/);
        });

        await test.step('Check areas: a draft changes only the Inv/DN draft list and the pending counter', async () => {
          expect.soft(after.draftList, AREAS.draftList).toMatch(/^1 row\(s\): .*INVOICE.*Maintenance Service.*2,781\.00/);
          const allowed: AreaKey[] = ['draftList', 'pendingInvDn'];
          for (const k of changed.filter(k => !allowed.includes(k))) {
            expect.soft(`${AREAS[k]}: ${after[k]}`, `${AREAS[k]} must not change for a draft (before: ${before[k]})`).toBe(`${AREAS[k]}: ${before[k]}`);
          }
        });
      });
    });

  // INV-003: the case's date 1.6.2025 cannot be chosen (both EMs allow last month to
  // today), so the invoice is dated the 1st of last month; +7 days. Admin approves its own draft. Expected check
  // areas after approval come from the Old EM run (projects/old-em probe check-areas-approved-invoice): the invoice
  // is unpaid and overdue in AR, Invoice/DN list, apartment (summary, Invoices, SOA), contact (summary, Unpaid) and
  // the Invoices report; the draft list is back to before; the overdue amount sits in the aging band of its days.
  test('INV-003 Invoice due date = issue date + payment term; AR overdue based on due date',
    testCase({ id: 'INV-003', source: 'TC_Inv_003', priority: 'P1', critical: true }),
    async ({ page, createInvoicePage: form }) => {
      const now = today();
      const date = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const due = addDays(date, 7);
      const daysOverdue = Math.round((now.getTime() - due.getTime()) / 86_400_000);
      const band = agingBand(daysOverdue);
      const total = '2,781.00 Ks';
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(date, -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner contact ${apartment.owner.id}, invoice date ${dmy(date, '/')}, due ${dmy(due, '/')}, ${daysOverdue} days overdue → "${band}"` });
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'Last Month', 'before'));

      await createInvoiceSteps(page, form, apartment.name, date, { tag: 'INV-003' });
      const draftUrl = page.url();
      const pendingAfterDraft = await new PendingApprovals(page).count('Inv/DN');
      await page.goto(draftUrl);

      const detail = new InvoiceDetailPage(page);
      let code = '';
      await test.step('Approve the draft (Admin) → Expected 1: due date = issue date + 7 days', async () => {
        await expect(page).toHaveURL(InvoiceDetailPage.URL);
        await expect.soft(detail.field('Due Date'), 'draft due date').toHaveText(dmy(due, '/'));
        await detail.approve();
        code = (await detail.code.innerText()).replace(/^#/, '').trim();
        test.info().annotations.push({ type: 'data', description: `approved ${code} (invoice #${detail.id()})` });
        await expect.soft(detail.status, 'status after approval').toHaveText(/^Unpaid$/i);
        await expect.soft(detail.field('Issue Date'), 'issue date').toHaveText(dmy(date, '/'));
        await expect.soft(detail.field('Due Date'), `due date = ${dmy(date, '/')} + 7 days`).toHaveText(dmy(due, '/'));
        await expect.soft(detail.field('Total'), 'total').toHaveText(total);
        await evidence(page, 'INV-003_expected1-approved');
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'Last Month', 'after'));
      await compareCheckAreas(before, after);
      await test.step(`Expected 2 + check areas: AR overdue based on the due date (${daysOverdue} days → "${band}"), unpaid everywhere`, async () =>
        overdueAreaChecks(before, after, { code, date, due, total, amount: 2781, band, pendingAfterDraft }));
    });

  // INV-008: dated today (the case's 1.6.2025 is outside the allowed range); figures are
  // checked: line 1 Incl. 5% (2 × 1,500, as seen in INV-007), line 2 3% Tax (1 × 15,000), totals and the saved draft;
  // check areas as INV-001 (a draft changes only the Inv/DN Draft list and the pending counter).
  test('INV-008 Create invoice with multiple line items',
    testCase({ id: 'INV-008', source: 'TC_Inv_008', priority: 'P1', critical: true }),
    async ({ page, createInvoicePage: form }) => {
      const now = today();
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(now, -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner contact ${apartment.owner.id}` });
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before'));
      const amount3 = async (l: import('@playwright/test').Locator) => {
        const t = (await l.innerText()).trim();
        try { return parseAmount(t, 3); } catch { return t; }
      };
      const amount2 = async (l: import('@playwright/test').Locator) => parseAmount((await l.innerText()).trim(), 2);

      await test.step('1. Click "Invoices / Debit Note" from left menu', async () => {
        await page.goto('/dashboard');
        await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
        await expect(page).toHaveURL(/\/receivables\/invoices$/);
      });
      await test.step('2. Click "Add invoice" button', async () => {
        await page.getByRole('link', { name: 'Add Invoice' }).click();
        await expect(form.heading).toBeVisible();
      });
      await test.step('3. Currency will be MMK and Date will be today (default)', async () => {
        await expect.soft(form.currency, 'default currency').toHaveText('MMK');
        await expect.soft(form.date, 'default date').toHaveValue(dmy(now));
      });
      await test.step('4. Fill the required fields', async () => {
        await form.chooseApartment(apartment.name);
        await form.chooseCategory(INV_001.category);
        await form.choosePaymentTerms(INV_001.paymentTerms);
        const oldCoRef = await form.fillOldCoRefIfShown();
        if (oldCoRef) test.info().annotations.push({ type: 'environment', description: `"Old CoRef No." setting enabled; filled "${oldCoRef}"` });
      });
      await test.step('5. Item 1: Incl. 5% Tax, 2 × 1,500 → Disc. Price 1,428.571 · Tax 142.858 · Total 2,857.142', async () => {
        const line = form.line(0);
        await line.fill({ description: 'Maintenance fees', taxType: 'Incl. 5% Tax', unit: '2', grossPrice: '1500' });
        await expect.poll(() => amount3(line.total), 'item 1 Total').toBe('2857.142');
        expect.soft(await amount3(line.discPrice), 'item 1 Disc. Price (1,500 / 1.05)').toBe('1428.571');
        expect.soft(await amount3(line.tax), 'item 1 Tax').toBe('142.858');
      });
      await test.step('6. Add blank line; item 2: 3% Tax, 1 × 15,000 → Disc. Price 15,000 · Tax 450 · Total 15,000', async () => {
        await form.addLineButton.click();
        const line = form.line(1);
        await expect(line.root).toBeVisible();
        await line.fill({ description: 'Maintenance fees', taxType: '3% Tax', unit: '1', grossPrice: '15000' });
        await expect.poll(() => amount3(line.total), 'item 2 Total').toBe('15000.000');
        expect.soft(await amount3(line.discPrice), 'item 2 Disc. Price').toBe('15000.000');
        expect.soft(await amount3(line.tax), 'item 2 Tax (3 % of 15,000)').toBe('450.000');
      });
      await test.step('7. Totals: Gross 17,857.14 · Discount 0.00 · Commercial Tax 592.86 · Grand Total 18,450.00', async () => {
        await expect.poll(() => amount2(form.total('Grand Total')).catch(() => null), 'Grand Total').toBe('18450.00');
        expect.soft(await amount2(form.total('Gross Total')), 'Gross Total').toBe('17857.14');
        expect.soft((await amount2(form.total('Discount'))).replace(/^-/, ''), 'Discount').toBe('0.00');
        expect.soft(await amount2(form.total('Commercial Tax')), 'Commercial Tax (142.86 + 450.00)').toBe('592.86');
        await evidence(page, 'INV-008_step7-two-lines');
      });
      await test.step('8. Click "Create" button → Expected 1: success message', async () => {
        await form.createButton.click();
        const message = page.getByText('Invoice has been successfully created.', { exact: true }).first();
        await expect.soft(message, '"Invoice has been successfully created." message (exact text from the case)').toBeVisible({ timeout: 10_000 });
        test.info().annotations.push({ type: 'observed', description: (await message.isVisible())
          ? `message "${(await message.innerText()).trim()}"`
          : 'no success message; New EM shows only "Creating this draft…" and then opens the invoice detail' });
        await expect(page).toHaveURL(InvoiceDetailPage.URL, { timeout: 30_000 });
      });
      await test.step('Expected 2: invoice is saved as draft in Inv/DN, with both lines', async () => {
        const detail = new InvoiceDetailPage(page);
        await detail.loaded();
        await expect.soft(detail.status, 'status').toHaveText('Draft');
        await expect.soft(detail.field('Total'), 'saved total').toHaveText(/18,450\.00/);
        await expect.soft(detail.lines, 'two invoice lines').toHaveCount(2);
        test.info().annotations.push({ type: 'data', description: `draft invoice #${detail.id()}` });
        await evidence(page, 'INV-008_expected2-draft');
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after'));
      const changed = await compareCheckAreas(before, after);
      await test.step('Expected 3: notification to the approver (Inv/DN pending counter +1, draft listed)', async () => {
        expect.soft(Number(after.pendingInvDn), 'Inv/DN pending counter (others may add drafts too)').toBeGreaterThanOrEqual(Number(before.pendingInvDn) + 1);
        await new PendingApprovals(page).link('Inv/DN').click();
        await expect(page).toHaveURL(/\/receivables\/invoices\/drafts/);
      });
      await test.step('Check areas: a draft changes only the Inv/DN draft list and the pending counter', async () => {
        expect.soft(after.draftList, AREAS.draftList).toMatch(/^1 row\(s\): .*INVOICE.*Maintenance Service.*18,450\.00/);
        const allowed: AreaKey[] = ['draftList', 'pendingInvDn'];
        for (const k of changed.filter(k => !allowed.includes(k))) {
          expect.soft(`${AREAS[k]}: ${after[k]}`, `${AREAS[k]} must not change for a draft (before: ${before[k]})`).toBe(`${AREAS[k]}: ${before[k]}`);
        }
      });
    });

  // INV-017: the draft to approve is our own, made with the INV-001 data (2,781.00 Ks incl. 81.00 Ks
  // Commercial Tax), dated today, +7 days. Admin approves its own draft (as INV-003). The case's "approved successfully
  // with ref number" uses Old EM's message "Invoice has been approved successfully". Check areas after approval:
  // as INV-003, but not overdue (due in 7 days → "Current").
  test('INV-017 Approve invoice - ref number, tax included, unpaid in apartment',
    testCase({ id: 'INV-017', source: 'TC_Inv_021', priority: 'P1', smoke: true, critical: true }),
    async ({ page, createInvoicePage: form }) => {
      const date = today();
      const due = addDays(date, 7);
      const total = '2,781.00 Ks';
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(date, -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner contact ${apartment.owner.id}, invoice date ${dmy(date, '/')}, due ${dmy(due, '/')}` });
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before'));
      await test.step('Setup: draft invoice with the INV-001 data', () => createInvoiceSteps(page, form, apartment.name, date, { tag: 'INV-017_setup' }));
      const pendingAfterDraft = await new PendingApprovals(page).count('Inv/DN');

      const code = await approveFromDraftsSteps(page, apartment.name, 'invoice', { tag: 'INV-017', total, category: INV_001.category });

      await test.step('Expected 2: Commercial Tax is included in the invoice', async () => {
        const detail = new InvoiceDetailPage(page);
        await expect.soft(detail.field('Total'), 'total').toHaveText(total);
        await expect.soft(detail.summary('Commercial Tax'), 'Commercial Tax (3 % of 2,700)').toHaveText('81.00 Ks');
        await expect.soft(detail.summary('Grand Total'), 'Grand Total = 2,700 + 81 tax').toHaveText(total);
        await evidence(page, 'INV-017_expected2-tax');
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after'));
      await compareCheckAreas(before, after);
      await test.step('Expected 3 + check areas: the invoice is unpaid in the apartment and everywhere', async () =>
        approvedAreaChecks(before, after, { code, date, due, total, amount: 2781, pendingAfterDraft }));
    });

  // INV-012: the largest gross price, 14 integer digits + 2 decimals (12,345,678,901,234.56), × 200, 3% Tax,
  // Discount 10 Ks; dated today. The case gives no figures: they are recorded (annotation "observed"), the gross
  // price must be kept as entered and the invoice created as a draft. Check areas as INV-001 (a draft changes only
  // the Inv/DN Draft list and the pending counter).
  test('INV-012 Invoice accepts max gross price (14 integer digits + 2 decimals)',
    testCase({ id: 'INV-012', source: 'TC_Inv_016', priority: 'P2' }),
    async ({ page, createInvoicePage: form }) => {
      const date = today();
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(date, -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner contact ${apartment.owner.id}` });
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before'));

      await createInvoiceSteps(page, form, apartment.name, date, { tag: 'INV-012', successMessage: true, line: bigPriceLine('12,345,678,901,234.56') });

      await test.step('Expected 2: invoice is saved as draft in Inv/DN', async () => {
        const detail = new InvoiceDetailPage(page);
        await detail.loaded();
        await expect.soft(detail.status, 'status').toHaveText('Draft');
        await expect.soft(detail.lines, 'one invoice line').toHaveCount(1);
        await expect.soft(detail.lines.first(), 'gross price on the saved line').toContainText('12,345,678,901,234.56');
        test.info().annotations.push({ type: 'observed', description: `saved draft #${detail.id()}: Total ${(await detail.field('Total').innerText()).trim()}` });
        await evidence(page, 'INV-012_expected2-draft');
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after'));
      const changed = await compareCheckAreas(before, after);
      await test.step('Expected 3: notification to the approver (Inv/DN pending counter +1, draft listed)', async () => {
        expect.soft(Number(after.pendingInvDn), 'Inv/DN pending counter (others may add drafts too)').toBeGreaterThanOrEqual(Number(before.pendingInvDn) + 1);
        await new PendingApprovals(page).link('Inv/DN').click();
        await expect(page).toHaveURL(/\/receivables\/invoices\/drafts/);
      });
      await test.step('Check areas: a draft changes only the Inv/DN draft list and the pending counter', async () => {
        expect.soft(after.draftList, AREAS.draftList).toMatch(/^1 row\(s\): .*INVOICE.*Maintenance Service/);
        const allowed: AreaKey[] = ['draftList', 'pendingInvDn'];
        for (const k of changed.filter(k => !allowed.includes(k))) {
          expect.soft(`${AREAS[k]}: ${after[k]}`, `${AREAS[k]} must not change for a draft (before: ${before[k]})`).toBe(`${AREAS[k]}: ${before[k]}`);
        }
      });
    });
});

test.describe('Invoices · Debit note', () => {
  test.describe.configure({ timeout: 480_000 });

  // INV-020: as INV-001, the case runs twice ("dated last month to today"), each on its own new
  // apartment. Category "Internet" was added to the test env for it. Message wording is
  // the case's (= Old EM's toast). A draft changes only the Inv/DN Draft list and the pending counter (as INV-001).
  test('INV-020 Create debit note (MMK, dated last month to today) as draft',
    testCase({ id: 'INV-020', source: 'TC_Inv_024', priority: 'P1', smoke: true, critical: true }),
    async ({ page, createDebitNotePage: form }) => {
      for (const variant of [{ label: 'today', date: today }, { label: 'last month', date: lastMonth }]) await test.step(`Dated ${variant.label}`, async () => {
        const date = variant.date();
        const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
          createApartmentWithOwner(page.request, test.info(), addDays(date, -30)));
        test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner contact ${apartment.owner.id}, debit note date ${dmy(date, '/')}` });
        const filterType = filterTypeFor(date);
        const tag = `INV-020_${variant.label.replace(' ', '-')}`;
        const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, filterType, `${variant.label.replace(' ', '-')}_before`));

        await createDebitNoteSteps(page, form, apartment.name, date, { tag, successMessage: true });

        await test.step('Expected 2: debit note is saved as draft in Inv/DN', async () => {
          const detail = new InvoiceDetailPage(page);
          await expect.soft(detail.type, 'document type').toHaveText('DEBIT NOTE');
          await expect.soft(detail.status, 'status').toHaveText('Draft');
          await expect.soft(detail.field('Total'), 'saved total').toHaveText(INV_020.expected.total);
          await expect.soft(detail.field('Issue Date'), 'issue date').toHaveText(dmy(date, '/'));
          await expect.soft(detail.field('Due Date'), 'due date = issue date + 15 days').toHaveText(dmy(addDays(date, 15), '/'));
          test.info().annotations.push({ type: 'data', description: `draft debit note #${detail.id()}` });
          await evidence(page, `${tag}_expected2-draft`);
        });

        const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, filterType, `${variant.label.replace(' ', '-')}_after`));
        const changed = await compareCheckAreas(before, after);
        await test.step('Expected 3: notification to the approver (Inv/DN pending counter +1, draft listed)', async () => {
          expect.soft(Number(after.pendingInvDn), 'Inv/DN pending counter (others may add drafts too)').toBeGreaterThanOrEqual(Number(before.pendingInvDn) + 1);
          await new PendingApprovals(page).link('Inv/DN').click();
          await expect(page).toHaveURL(/\/receivables\/invoices\/drafts/);
        });
        await test.step('Check areas: a draft changes only the Inv/DN draft list and the pending counter', async () => {
          expect.soft(after.draftList, AREAS.draftList).toMatch(/^1 row\(s\): .*DEBIT NOTE.*Internet.*225,000\.00/);
          const allowed: AreaKey[] = ['draftList', 'pendingInvDn'];
          for (const k of changed.filter(k => !allowed.includes(k))) {
            expect.soft(`${AREAS[k]}: ${after[k]}`, `${AREAS[k]} must not change for a draft (before: ${before[k]})`).toBe(`${AREAS[k]}: ${before[k]}`);
          }
        });
      });
    });

  // INV-031: the draft to approve is our own, made with the INV-020 data (225,000.00 Ks, Internet,
  // +15 days), dated today. Admin approves its own draft. Message: Old EM's "Debit Note has been approved
  // successfully". Check areas after approval as INV-017 (unpaid, "Current").
  test('INV-031 Approve debit note - ref number, unpaid in apartment',
    testCase({ id: 'INV-031', source: 'TC_Inv_039', priority: 'P1', smoke: true, critical: true }),
    async ({ page, createDebitNotePage: form }) => {
      const date = today();
      const due = addDays(date, 15);
      const total = INV_020.expected.total;
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(date, -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner contact ${apartment.owner.id}, debit note date ${dmy(date, '/')}, due ${dmy(due, '/')}` });
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before'));
      await test.step('Setup: draft debit note with the INV-020 data', () => createDebitNoteSteps(page, form, apartment.name, date, { tag: 'INV-031_setup' }));
      const pendingAfterDraft = await new PendingApprovals(page).count('Inv/DN');

      const code = await approveFromDraftsSteps(page, apartment.name, 'debit-note', { tag: 'INV-031', total, category: INV_020.category });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after'));
      await compareCheckAreas(before, after);
      await test.step('Expected 2 + check areas: the debit note is unpaid in the apartment and everywhere', async () =>
        approvedAreaChecks(before, after, { code, date, due, total, amount: 225000, pendingAfterDraft }));
    });

  // INV-025: the largest gross price (12,345,678,901,234.56) × 1, Internet, +15 days, dated today. Total =
  // the gross price. Check areas as INV-020 (a draft changes only the Inv/DN Draft list and the pending counter).
  test('INV-025 Debit note accepts max gross price (14 integer digits + 2 decimals)',
    testCase({ id: 'INV-025', source: 'TC_Inv_033', priority: 'P2' }),
    async ({ page, createDebitNotePage: form }) => {
      const date = today();
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(date, -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner contact ${apartment.owner.id}` });
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before'));

      await createDebitNoteSteps(page, form, apartment.name, date, { tag: 'INV-025', successMessage: true, data: INV_025 });

      await test.step('Expected 2: debit note is saved as draft in Inv/DN', async () => {
        const detail = new InvoiceDetailPage(page);
        await expect.soft(detail.type, 'document type').toHaveText('DEBIT NOTE');
        await expect.soft(detail.status, 'status').toHaveText('Draft');
        await expect.soft(detail.field('Total'), 'saved total').toHaveText(INV_025.expected.total);
        await expect.soft(detail.field('Due Date'), 'due date = issue date + 15 days').toHaveText(dmy(addDays(date, 15), '/'));
        test.info().annotations.push({ type: 'data', description: `draft debit note #${detail.id()}` });
        await evidence(page, 'INV-025_expected2-draft');
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after'));
      const changed = await compareCheckAreas(before, after);
      await test.step('Expected 3: notification to the approver (Inv/DN pending counter +1, draft listed)', async () => {
        expect.soft(Number(after.pendingInvDn), 'Inv/DN pending counter (others may add drafts too)').toBeGreaterThanOrEqual(Number(before.pendingInvDn) + 1);
        await new PendingApprovals(page).link('Inv/DN').click();
        await expect(page).toHaveURL(/\/receivables\/invoices\/drafts/);
      });
      await test.step('Check areas: a draft changes only the Inv/DN draft list and the pending counter', async () => {
        expect.soft(after.draftList, AREAS.draftList).toMatch(/^1 row\(s\): .*DEBIT NOTE.*Internet.*12,345,678,901,234\.56/);
        const allowed: AreaKey[] = ['draftList', 'pendingInvDn'];
        for (const k of changed.filter(k => !allowed.includes(k))) {
          expect.soft(`${AREAS[k]}: ${after[k]}`, `${AREAS[k]} must not change for a draft (before: ${before[k]})`).toBe(`${AREAS[k]}: ${before[k]}`);
        }
      });
    });

  // INV-029: as INV-003 for a debit note. The case's date 1.6.2025 cannot be chosen (last month to today only), so
  // the debit note is dated the 1st of last month; +7 days, 2 × 1,500 = 3,000.00 Ks. Admin approves its own draft.
  // Check areas after approval as INV-003: unpaid and overdue everywhere, in the aging band of its days overdue.
  test('INV-029 Debit note due date = issue date + payment term; AR overdue based on due date',
    testCase({ id: 'INV-029', source: 'TC_Inv_037', priority: 'P1', critical: true }),
    async ({ page, createDebitNotePage: form }) => {
      const now = today();
      const date = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const due = addDays(date, 7);
      const daysOverdue = Math.round((now.getTime() - due.getTime()) / 86_400_000);
      const band = agingBand(daysOverdue);
      const total = INV_029.expected.total;
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(date, -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), owner contact ${apartment.owner.id}, debit note date ${dmy(date, '/')}, due ${dmy(due, '/')}, ${daysOverdue} days overdue → "${band}"` });
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'Last Month', 'before'));

      await createDebitNoteSteps(page, form, apartment.name, date, { tag: 'INV-029', data: INV_029 });
      const draftUrl = page.url();
      const pendingAfterDraft = await new PendingApprovals(page).count('Inv/DN');
      await page.goto(draftUrl);

      const detail = new InvoiceDetailPage(page);
      let code = '';
      await test.step('Approve the draft (Admin) → Expected 1: due date = issue date + 7 days', async () => {
        await expect(page).toHaveURL(InvoiceDetailPage.URL);
        await expect.soft(detail.field('Due Date'), 'draft due date').toHaveText(dmy(due, '/'));
        await detail.approve();
        code = (await detail.code.innerText()).replace(/^#/, '').trim();
        test.info().annotations.push({ type: 'data', description: `approved ${code} (debit note #${detail.id()})` });
        expect.soft(code, 'ref number').toMatch(KIND['debit-note'].code);
        await expect.soft(detail.status, 'status after approval').toHaveText(/^Unpaid$/i);
        await expect.soft(detail.field('Issue Date'), 'issue date').toHaveText(dmy(date, '/'));
        await expect.soft(detail.field('Due Date'), `due date = ${dmy(date, '/')} + 7 days`).toHaveText(dmy(due, '/'));
        await expect.soft(detail.field('Total'), 'total').toHaveText(total);
        await evidence(page, 'INV-029_expected1-approved');
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'Last Month', 'after'));
      await compareCheckAreas(before, after);
      await test.step(`Expected 2 + check areas: AR overdue based on the due date (${daysOverdue} days → "${band}")`, async () =>
        overdueAreaChecks(before, after, { code, date, due, total, amount: 3000, band, pendingAfterDraft }));
    });
});

test.describe('Invoices · Listing', () => {
  test.describe.configure({ timeout: 240_000 });

  // INV-037: the precondition's Invoice and Debit Note are the newest approved ones in the register (Last 30 Days).
  // New EM has no "Manage" button in the register: the document code opens its detail. "Full data" = type, code,
  // status, apartment, dates and total as in the list row, with its lines. View PDF must open a PDF; Download PDF
  // must save a .pdf file.
  test('INV-037 View Invoice/Debit Note detail and view/download PDF',
    testCase({ id: 'INV-037', source: 'TC_Inv_045', priority: 'P2' }),
    async ({ page }) => {
      const register = new InvoiceRegisterPage(page);
      const detail = new InvoiceDetailPage(page);
      for (const kind of ['invoice', 'debit-note'] as const) await test.step(KIND[kind].label, async () => {
        const k = KIND[kind];
        const prefix = kind === 'invoice' ? 'INV' : 'DN';
        let code = '';
        let rowText = '';
        await test.step('1. Click "Invoices / Debit Note" from left menu', async () => {
          await page.goto('/dashboard');
          await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
          await expect(page).toHaveURL(/\/receivables\/invoices$/);
          await register.settled();
        });
        await test.step(`2. In Listing, click one of the ${k.label}s`, async () => {
          const found = await register.findRow(new RegExp(`\\b${prefix}-\\d{6}-\\d+`));
          expect(found, `a ${k.label} in the list (Last 30 Days)`).not.toBeNull();
          const row = found!;
          rowText = (await row.innerText()).replace(/\s+/g, ' ').trim();
          code = new RegExp(`${prefix}-\\d{6}-\\d+`).exec(rowText)?.[0] ?? '';
          test.info().annotations.push({ type: 'data', description: `${k.label} ${code}: list row "${rowText}"` });
          await register.codeLink(row).click();
        });
        await test.step('3. Click "Manage" button (New EM: the code opens the detail) → Expected: voucher with full data', async () => {
          await expect(page).toHaveURL(InvoiceDetailPage.URL);
          await detail.loaded();
          await expect.soft(detail.type, 'document type').toHaveText(k.type);
          await expect.soft(detail.code, 'code').toHaveText(new RegExp(`^#?${code}$`));
          await expect.soft(detail.status, 'status').toBeVisible();
          const issuedTo = (await detail.issuedTo.innerText()).replace(/\s+/g, ' ').trim();
          expect.soft(rowText, `apartment "${issuedTo}" as in the list`).toContain(issuedTo);
          const amounts = rowText.match(/[\d,]+\.\d{2} Ks/g) ?? [];
          if (amounts[0]) await expect.soft(detail.field('Total'), 'total as in the list').toHaveText(amounts[0]);
          const date = /\d{2}\/\d{2}\/\d{4}/.exec(rowText)?.[0];
          if (date) await expect.soft(detail.field('Issue Date'), 'issue date as in the list').toHaveText(date);
          await expect.soft(detail.field('Due Date'), 'due date').toHaveText(/\d{2}\/\d{2}\/\d{4}/);
          expect.soft(await detail.lines.count(), 'at least one line').toBeGreaterThan(0);
          await evidence(page, `INV-037_${prefix}_detail`);
        });
        await test.step('Expected: "View PDF" opens the PDF', async () => {
          const pdfResponse = page.context().waitForEvent('response', { predicate: r => /application\/pdf/i.test(r.headers()['content-type'] ?? ''), timeout: 30_000 }).catch(() => null);
          const popup = page.context().waitForEvent('page', { timeout: 30_000 }).catch(() => null);
          await (await detail.pdfMenuItem('View PDF')).click();
          const [response, tab] = await Promise.all([pdfResponse, popup]);
          const where = tab ? `new tab ${tab.url()}` : `same tab ${page.url()}`;
          test.info().annotations.push({ type: 'observed', description: `${code} View PDF: ${where}; PDF response ${response ? `${response.status()} ${response.url()}` : 'none'}` });
          expect.soft(response, 'a PDF is served').not.toBeNull();
          if (response) {
            // The body is gone once the tab shows the PDF: judge by status, type and the file name it is served as.
            expect.soft(response.status(), 'PDF response status').toBe(200);
            expect.soft(decodeURIComponent(response.url()), 'PDF of this document').toContain(`${code}.pdf`);
          }
          if (tab) {
            await evidence(tab, `INV-037_${prefix}_view-pdf`).catch(() => {});
            await tab.close();
          } else {
            await evidence(page, `INV-037_${prefix}_view-pdf`);
            if (!InvoiceDetailPage.URL.test(page.url())) await page.goBack();
            await page.keyboard.press('Escape');
          }
        });
        await test.step('Expected: "Download PDF" saves the PDF file', async () => {
          await expect(page).toHaveURL(InvoiceDetailPage.URL);
          const download = page.waitForEvent('download', { timeout: 30_000 });
          await (await detail.pdfMenuItem('Download PDF')).click();
          const file = await download;
          const path = await file.path();
          const head = (await import('node:fs')).readFileSync(path).subarray(0, 4).toString();
          test.info().annotations.push({ type: 'observed', description: `${code} Download PDF: "${file.suggestedFilename()}"` });
          expect.soft(file.suggestedFilename(), 'file name').toMatch(/\.pdf$/i);
          expect.soft(head, 'file is a PDF').toBe('%PDF');
          await test.info().attach(`INV-037_${prefix}_${file.suggestedFilename()}`, { path, contentType: 'application/pdf' });
        });
      });
    });
});

test.describe('Invoices · Invoice validation', () => {
  test.describe.configure({ timeout: 240_000 });

  // INV-004: dated today (the case's 1.6.2025 is outside the allowed range; the date
  // is not what this case checks). 99 % is checked on the form only (no Create). 100 % / 120 % must be cleared
  // automatically (Expected 2; a message without clearing is still a FAIL); when the value is not cleared, Create is
  // clicked to check Expected 1 (no invoice).
  // Check areas: the Inv/DN Draft list (our apartment) and the pending counter must not change.
  test('INV-004 Invoice percentage discount max 99% (100%/120% rejected)',
    testCase({ id: 'INV-004', source: 'TC_Inv_004', priority: 'P2' }),
    async ({ page, createInvoicePage: form }) => {
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(today(), -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id})` });
      const areas: AreaKey[] = ['draftList', 'pendingInvDn'];
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before', areas));
      const amount = async (l: import('@playwright/test').Locator) => {
        const t = (await l.innerText()).trim();
        try { return parseAmount(t, 2); } catch { return t; } // e.g. "Not calculated yet"
      };

      for (const discount of ['99', '100', '120']) await test.step(`Discount ${discount} %`, async () => {
        await test.step('1-3. Invoices / Debit Note › Add Invoice; Currency MMK, Date today', async () => {
          await page.goto('/dashboard');
          await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
          await page.getByRole('link', { name: 'Add Invoice' }).click();
          await expect(form.heading).toBeVisible();
          await expect.soft(form.currency, 'default currency').toHaveText('MMK');
          await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
        });

        const line = form.line(0);
        await test.step(`4. Fill the item with Discount ${discount} %`, async () => {
          await line.fill({ ...INV_001.line, discount });
          await page.waitForLoadState('networkidle').catch(() => {});
          const kept = await line.discount.inputValue();
          const messages = (await line.root.getByRole('alert').or(page.getByRole('main').getByRole('alert')).allInnerTexts()).map(t => t.trim()).filter(Boolean);
          test.info().annotations.push({ type: 'observed', description: `${discount} %: Discount field shows "${kept}"; Disc. Price "${(await line.discPrice.innerText()).trim()}", Total "${(await line.total.innerText()).trim()}"${messages.length ? `; message: ${messages.join(' | ')}` : ''}` });
          await evidence(page, `INV-004_${discount}_step4-discount`);
          if (discount === '99') {
            await expect.soft(line.discount, '99 % is accepted').toHaveValue('99');
            await expect.poll(() => amount(line.total), 'line Total (2 × 15.00)').toBe('30.00');
            expect.soft(await amount(line.discPrice), 'Disc. Price (1,500 − 99 %)').toBe('15.00');
            expect.soft(await amount(line.tax), 'Tax (3 % of 30.00)').toBe('0.90');
            expect.soft(await amount(form.total('Grand Total')), 'Grand Total').toBe('30.90');
          } else {
            await expect.soft(line.discount, `Expected 2: ${discount} % is cleared automatically`).toHaveValue('');
          }
        });

        if (discount !== '99') await rejectedDiscountCreateSteps(page, form, apartment.name, { tag: `INV-004_${discount}`, label: `${discount} % discount` });
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after', areas));
      await compareCheckAreas(before, after);
      await test.step('Check areas: nothing was created (Draft list and pending counter unchanged)', async () => {
        expect.soft(after.draftList, AREAS.draftList).toBe(before.draftList);
        expect.soft(after.pendingInvDn, `${AREAS.pendingInvDn} (others may add drafts too)`).toBe(before.pendingInvDn);
      });
    });

  // INV-005 (as INV-004): dated today; 15.55 % must be cleared automatically (Expected 2),
  // a value left in the field is a FAIL; when a value is left, Create is clicked to check Expected 1. Two ways in:
  // typed key by key (what a user does) and pasted. Typing stops as soon as the field is cleared: New EM ignores "."
  // and clears "155" at the 3rd digit; keys typed after that are the user's own input, not a defect.
  // Old EM: typing ignores "." → 1,555 → cleared on leaving the field.
  // Check areas: the Inv/DN Draft list (our apartment) and the pending counter must not change.
  test('INV-005 Invoice percentage discount rejects decimal value',
    testCase({ id: 'INV-005', source: 'TC_Inv_005', priority: 'P2' }),
    async ({ page, createInvoicePage: form }) => {
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(today(), -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id})` });
      const areas: AreaKey[] = ['draftList', 'pendingInvDn'];
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before', areas));

      for (const input of ['typed', 'pasted'] as const) await test.step(`Discount 15.55 % ${input}`, async () => {
        await test.step('1-3. Invoices / Debit Note › Add Invoice; Currency MMK, Date today', async () => {
          await page.goto('/dashboard');
          await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
          await page.getByRole('link', { name: 'Add Invoice' }).click();
          await expect(form.heading).toBeVisible();
          await expect.soft(form.currency, 'default currency').toHaveText('MMK');
          await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
        });

        const line = form.line(0);
        await test.step(`4. Fill the item with Discount 15.55 % (${input}) → Expected 2: cleared automatically`, async () => {
          await line.fill({ ...INV_001.line, discount: undefined });
          const kept = await enterDiscount(page, line, '15.55', input);
          test.info().annotations.push({ type: 'observed', description: `15.55 % ${input}: Discount field shows "${kept}"; Disc. Price "${(await line.discPrice.innerText()).trim()}", Total "${(await line.total.innerText()).trim()}"` });
          await evidence(page, `INV-005_${input}_step4-discount`);
          await expect.soft(line.discount, `Expected 2: 15.55 % (${input}) is cleared automatically`).toHaveValue('');
        });

        await rejectedDiscountCreateSteps(page, form, apartment.name, { tag: `INV-005_${input}`, label: `15.55 % discount (${input})` });
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after', areas));
      await compareCheckAreas(before, after);
      await test.step('Check areas: nothing was created (Draft list and pending counter unchanged)', async () => {
        expect.soft(after.draftList, AREAS.draftList).toBe(before.draftList);
        expect.soft(after.pendingInvDn, `${AREAS.pendingInvDn} (others may add drafts too)`).toBe(before.pendingInvDn);
      });
    });

  // INV-006 (as INV-004 / INV-005): dated today; the Discount switch set to Ks; 1,500
  // (= gross price) and 1,600 (> gross price) must be cleared automatically (Expected 2); typed key by key (stops at
  // the clear) and pasted; when a value is left, Create is clicked to check Expected 1. Check areas: the Inv/DN Draft
  // list (our apartment) and the pending counter must not change.
  test('INV-006 Invoice fixed discount cannot be >= gross price',
    testCase({ id: 'INV-006', source: 'TC_Inv_006', priority: 'P2' }),
    async ({ page, createInvoicePage: form }) => {
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(today(), -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id})` });
      const areas: AreaKey[] = ['draftList', 'pendingInvDn'];
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before', areas));

      for (const value of ['1500', '1600']) for (const input of ['typed', 'pasted'] as const) await test.step(`Discount ${value} Ks ${input}`, async () => {
        await test.step('1-3. Invoices / Debit Note › Add Invoice; Currency MMK, Date today', async () => {
          await page.goto('/dashboard');
          await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
          await page.getByRole('link', { name: 'Add Invoice' }).click();
          await expect(form.heading).toBeVisible();
          await expect.soft(form.currency, 'default currency').toHaveText('MMK');
          await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
        });

        const line = form.line(0);
        await test.step(`4. Fill the item with Discount ${value} Ks (${input}; gross price 1,500) → Expected 2: cleared automatically`, async () => {
          await line.fill({ ...INV_001.line, discount: undefined });
          await form.discountInKs.check();
          await expect(form.discountInKs, 'Discount in Ks').toBeChecked();
          const kept = await enterDiscount(page, line, value, input);
          const messages = (await line.root.getByRole('alert').allInnerTexts()).map(t => t.trim()).filter(Boolean);
          test.info().annotations.push({ type: 'observed', description: `${value} Ks ${input}: Discount field shows "${kept}"; Disc. Price "${(await line.discPrice.innerText()).trim()}", Total "${(await line.total.innerText()).trim()}"${messages.length ? `; message: ${messages.join(' | ')}` : ''}`.replace(/\s+/g, ' ') });
          await evidence(page, `INV-006_${value}_${input}_step4-discount`);
          await expect.soft(line.discount, `Expected 2: ${value} Ks (${input}) is cleared automatically`).toHaveValue('');
        });

        await rejectedDiscountCreateSteps(page, form, apartment.name, { tag: `INV-006_${value}_${input}`, label: `${value} Ks discount (${input})` });
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after', areas));
      await compareCheckAreas(before, after);
      await test.step('Check areas: nothing was created (Draft list and pending counter unchanged)', async () => {
        expect.soft(after.draftList, AREAS.draftList).toBe(before.draftList);
        expect.soft(after.pendingInvDn, `${AREAS.pendingInvDn} (others may add drafts too)`).toBe(before.pendingInvDn);
      });
    });

  // INV-007: dated today; form only (no Create); the figures for Incl. 5 % are recorded,
  // not checked (the case gives none). The Discount
  // field must be disabled and take no input, typed or pasted, in % and in Ks. Check areas: the Inv/DN Draft list
  // (our apartment) and the pending counter must not change.
  test('INV-007 Invoice discount field disabled for inclusive tax type',
    testCase({ id: 'INV-007', source: 'TC_Inv_007', priority: 'P2' }),
    async ({ page, createInvoicePage: form }) => {
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(today(), -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id})` });
      const areas: AreaKey[] = ['draftList', 'pendingInvDn'];
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before', areas));

      await test.step('1-3. Invoices / Debit Note › Add Invoice; Currency MMK, Date today', async () => {
        await page.goto('/dashboard');
        await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
        await page.getByRole('link', { name: 'Add Invoice' }).click();
        await expect(form.heading).toBeVisible();
        await expect.soft(form.currency, 'default currency').toHaveText('MMK');
        await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
      });

      await test.step('4. Fill the required fields', async () => {
        await form.chooseApartment(apartment.name);
        await form.chooseCategory(INV_001.category);
        await form.choosePaymentTerms(INV_001.paymentTerms);
        const oldCoRef = await form.fillOldCoRefIfShown();
        if (oldCoRef) test.info().annotations.push({ type: 'environment', description: `"Old CoRef No." setting enabled; filled "${oldCoRef}"` });
      });

      const line = form.line(0);
      await test.step('5. Item with Tax type "Incl. 5% Tax", Unit 2, Gross price 1500 → the Discount field is disabled and takes no amount', async () => {
        await line.fill({ description: INV_001.line.description, taxType: 'Incl. 5% Tax', unit: '2', grossPrice: '1500' });
        // Figures are recorded, not checked: wait for the calculation, then note them.
        await expect.poll(async () => (await line.total.innerText()).trim(), { message: 'line calculated', timeout: 20_000 })
          .not.toMatch(/Not calculated|^—$/).catch(() => {});
        const figure = async (l: import('@playwright/test').Locator) => (await l.innerText()).replace(/\s+/g, ' ').trim();
        test.info().annotations.push({ type: 'observed', description: `Incl. 5% Tax, 2 × 1500: Disc. Price "${await figure(line.discPrice)}", Tax "${await figure(line.tax)}", Total "${await figure(line.total)}"; totals: Gross ${await figure(form.total('Gross Total'))} · Discount ${await figure(form.total('Discount'))} · Commercial Tax ${await figure(form.total('Commercial Tax'))} · Grand ${await figure(form.total('Grand Total'))}` });
        await evidence(page, 'INV-007_step5-discount-disabled');
        for (const mode of ['%', 'Ks'] as const) {
          if (mode === 'Ks') await form.discountInKs.click();
          await expect.soft(line.discount, `Discount field disabled (${mode})`).toBeDisabled();
          // Try to enter an amount anyway, typed and pasted, straight into the Discount field (both need it enabled).
          await line.discount.pressSequentially('10', { timeout: 2_000 }).catch(() => {});
          await line.discount.fill('10', { timeout: 2_000 }).catch(() => {});
          await expect.soft(line.discount, `no amount can be entered (${mode})`).toHaveValue('');
        }
        await evidence(page, 'INV-007_step5-discount-disabled-ks');
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after', areas));
      await compareCheckAreas(before, after);
      await test.step('Check areas: nothing was created (Draft list and pending counter unchanged)', async () => {
        expect.soft(after.draftList, AREAS.draftList).toBe(before.draftList);
        expect.soft(after.pendingInvDn, `${AREAS.pendingInvDn} (others may add drafts too)`).toBe(before.pendingInvDn);
      });
    });

  // INV-009 (variants from the case doc): leave one required field empty, click Create, the field's
  // message shows under it, with the exact text of the case doc. Dated today; Discount 10 Ks.
  // Behaviour compared with Old EM (projects/old-em probe inv009-required-fields): the line is calculated before
  // Create (Disc. Price 1,490 · Tax 89.40 · Total 2,980 · Grand 3,069.40), no invoice is created, the message sits
  // under the field. Expected words: "Apartment is required.", "Item description is required.", "Category is required."
  // Check areas (as INV-004…007): the Inv/DN Draft list (our apartment) and the pending counter must not change.
  // One test per catalog variant ([base] = missing apartment), each on its own new apartment.
  const INV_009 = [
    // Expected texts exactly as in the case doc; pass / fail on the exact text.
    { label: 'base', source: 'TC_Inv_009', missing: 'apartment', field: 'Apartment', expected: 'Apartment is required.' },
    { label: 'Missing field=Item description', source: 'TC_Inv_010', missing: 'item description', field: 'Item Description', expected: 'Item description is required.' },
    { label: 'Missing field=Income category', source: 'TC_Inv_011', missing: 'income category', field: 'Income Categories', expected: 'Category is required.' }
  ] as const;
  for (const v of INV_009) {
    test(`INV-009 [${v.label}] Invoice create - required field validation (apartment / item description / category)`,
      testCase({ id: 'INV-009', source: v.source, priority: 'P3' }),
      async ({ page, createInvoicePage: form }) => {
        const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
          createApartmentWithOwner(page.request, test.info(), addDays(today(), -30)));
        test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id})` });
        const areas: AreaKey[] = ['draftList', 'pendingInvDn'];
        const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before', areas));

        await test.step('1-3. Invoices / Debit Note › Add Invoice; Currency MMK, Date today', async () => {
          await page.goto('/dashboard');
          await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
          await page.getByRole('link', { name: 'Add Invoice' }).click();
          await expect(form.heading).toBeVisible();
          await expect.soft(form.currency, 'default currency').toHaveText('MMK');
          await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
        });
        await test.step(`4. Fill the required fields but not ${v.missing}`, async () => {
          if (v.missing !== 'apartment') await form.chooseApartment(apartment.name);
          if (v.missing !== 'income category') await form.chooseCategory(INV_001.category);
          await form.choosePaymentTerms(INV_001.paymentTerms);
          const oldCoRef = await form.fillOldCoRefIfShown();
          if (oldCoRef) test.info().annotations.push({ type: 'environment', description: `"Old CoRef No." setting enabled; filled "${oldCoRef}"` });
        });
        await test.step(`5. Fill the item${v.missing === 'item description' ? ' without Item Description' : ''} (3% Tax, 2 × 1,500, Discount 10 Ks)`, async () => {
          const line = form.line(0);
          await line.fill({ ...INV_001.line, description: v.missing === 'item description' ? undefined : INV_001.line.description, discount: undefined });
          await form.discountInKs.check();
          await line.discount.fill('10');
          await line.discount.blur();
          // As Old EM (probe inv009-required-fields): the line is calculated before Create.
          const fig = async (l: import('@playwright/test').Locator) => { const t = (await l.innerText()).trim(); try { return parseAmount(t, 3); } catch { return t; } };
          await expect.poll(() => fig(line.total), 'line Total (2 × 1,490)').toBe('2980.000');
          expect.soft(await fig(line.discPrice), 'Disc. Price (1,500 − 10 Ks)').toBe('1490.000');
          expect.soft(await fig(line.tax), 'Tax (3 % of 2,980)').toBe('89.400');
          expect.soft(parseAmount((await form.total('Grand Total').innerText()).trim(), 2), 'Grand Total').toBe('3069.40');
        });
        await test.step(`6. Click "Create" → "${v.expected}" under the ${v.field} box`, async () => {
          await form.createButton.click();
          await page.waitForLoadState('networkidle').catch(() => {});
          await expect.soft(page, 'no invoice is created').toHaveURL(/\/receivables\/invoices\/new$/);
          // Field messages only (role alert): the empty fields' placeholders ("Select Apartment") must not count.
          const alerts = page.getByRole('main').getByRole('alert');
          await alerts.first().waitFor({ timeout: 10_000 }).catch(() => {});
          const all = (await alerts.allInnerTexts()).map(t => t.trim()).filter(Boolean);
          const shown = all.join(' | ') || '(none)';
          expect.soft(all, `"${v.expected}" is shown under the ${v.field} box (exact text from the case)`).toContain(v.expected);
          const line = form.line(0);
          test.info().annotations.push({ type: 'observed', description: `missing ${v.missing}: message(s) "${shown}" (expected "${v.expected}"); after Create: Disc. Price ${(await line.discPrice.innerText()).trim()}, Total ${(await line.total.innerText()).trim()}, Grand ${(await form.total('Grand Total').innerText()).trim()}`.replace(/\s+/g, ' ') });
          await evidence(page, `INV-009_${v.missing.replace(' ', '-')}_step6-message`);
        });

        const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', `after-${v.missing.replace(' ', '-')}`, areas));
        await compareCheckAreas(before, after);
        await test.step('Check areas: nothing was created (Draft list and pending counter unchanged)', async () => {
          expect.soft(after.draftList, AREAS.draftList).toBe(before.draftList);
          expect.soft(after.pendingInvDn, `${AREAS.pendingInvDn} (others may add drafts too)`).toBe(before.pendingInvDn);
        });
      });
  }

  // INV-010: Unit 0 / Gross price 0, click Create → the case's exact message under the field.
  // As INV-009: dated today, Discount 10 Ks, one test per catalog variant, Inv/DN Draft list and counter unchanged.
  // A pop-up alert besides the field message is recorded, not judged (the case does not mention it).
  const INV_010 = [
    { label: 'base', source: 'TC_Inv_012', field: 'Unit', unit: '0', grossPrice: '1500', expected: 'Unit must be greater than 0.' },
    { label: 'Field=Gross price (0)', source: 'TC_Inv_014', field: 'Gross Price', unit: '2', grossPrice: '0', expected: 'Gross Price must be greater than 0.' }
  ] as const;
  for (const v of INV_010) {
    test(`INV-010 [${v.label}] Invoice create - zero Unit / Gross price rejected`,
      testCase({ id: 'INV-010', source: v.source, priority: 'P3' }),
      async ({ page, createInvoicePage: form }) => {
        const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
          createApartmentWithOwner(page.request, test.info(), addDays(today(), -30)));
        test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id})` });
        const areas: AreaKey[] = ['draftList', 'pendingInvDn'];
        const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before', areas));

        await test.step('1-3. Invoices / Debit Note › Add Invoice; Currency MMK, Date today', async () => {
          await page.goto('/dashboard');
          await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
          await page.getByRole('link', { name: 'Add Invoice' }).click();
          await expect(form.heading).toBeVisible();
          await expect.soft(form.currency, 'default currency').toHaveText('MMK');
          await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
        });
        await test.step('4. Fill the required fields', async () => {
          await form.chooseApartment(apartment.name);
          await form.chooseCategory(INV_001.category);
          await form.choosePaymentTerms(INV_001.paymentTerms);
          const oldCoRef = await form.fillOldCoRefIfShown();
          if (oldCoRef) test.info().annotations.push({ type: 'environment', description: `"Old CoRef No." setting enabled; filled "${oldCoRef}"` });
        });
        const line = form.line(0);
        await test.step(`5. Fill the item: 3% Tax, Unit ${v.unit}, Gross price ${v.grossPrice}, Discount 10 Ks`, async () => {
          await line.fill({ description: INV_001.line.description, taxType: '3% Tax', unit: v.unit, grossPrice: v.grossPrice });
          await form.discountInKs.check();
          await line.discount.fill('10');
          await line.discount.blur();
          await page.waitForLoadState('networkidle').catch(() => {});
        });
        await test.step(`6. Click "Create" → "${v.expected}" under the ${v.field} field`, async () => {
          const popups: string[] = [];
          page.on('dialog', async d => { popups.push(`browser dialog: ${d.message()}`); await d.dismiss().catch(() => {}); });
          await form.createButton.click();
          await page.waitForLoadState('networkidle').catch(() => {});
          await expect.soft(page, 'no invoice is created').toHaveURL(/\/receivables\/invoices\/new$/);
          const fieldMessages = line.root.getByRole('alert');
          await fieldMessages.first().waitFor({ timeout: 10_000 }).catch(() => {});
          const shown = (await fieldMessages.allInnerTexts()).map(t => t.trim()).filter(Boolean);
          expect.soft(shown, `"${v.expected}" is shown under the ${v.field} field (exact text from the case)`).toContain(v.expected);
          // Anything else that pops up (dialog / toast / page-level alert outside the line): recorded only.
          const others = (await page.getByRole('alertdialog').or(page.getByRole('dialog')).or(page.getByRole('status')).allInnerTexts())
            .map(t => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
          test.info().annotations.push({ type: 'observed', description: `${v.field} 0: field message(s) "${shown.join(' | ') || '(none)'}" (expected "${v.expected}")${[...popups, ...others].length ? `; also shown: ${[...popups, ...others].join(' | ')}` : '; no pop-up'}; Total ${(await line.total.innerText()).replace(/\s+/g, ' ').trim()}` });
          await evidence(page, `INV-010_${v.field.replace(' ', '-')}-0_step6-message`);
        });

        const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after', areas));
        await compareCheckAreas(before, after);
        await test.step('Check areas: nothing was created (Draft list and pending counter unchanged)', async () => {
          expect.soft(after.draftList, AREAS.draftList).toBe(before.draftList);
          expect.soft(after.pendingInvDn, `${AREAS.pendingInvDn} (others may add drafts too)`).toBe(before.pendingInvDn);
        });
      });
  }

  // INV-013: gross price 99,999,999,999,999 (over the limit), × 200, 3% Tax, Discount 10 Ks; dated today. The form
  // does not calculate the line; after Create the message must show under Gross Price (exact text of the case) and
  // no invoice is created. Check areas: the Inv/DN Draft list (our apartment) and the pending counter must not change.
  test('INV-013 Invoice rejects gross price 99,999,999,999,999 (amount exceeded limit)',
    testCase({ id: 'INV-013', source: 'TC_Inv_017', priority: 'P2' }),
    async ({ page, createInvoicePage: form }) => {
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(today(), -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id})` });
      const areas: AreaKey[] = ['draftList', 'pendingInvDn'];
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before', areas));
      const data = bigPriceLine('99,999,999,999,999');
      const line = form.line(0);

      await test.step('1-3. Invoices / Debit Note › Add Invoice; Currency MMK, Date today', async () => {
        await page.goto('/dashboard');
        await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
        await page.getByRole('link', { name: 'Add Invoice' }).click();
        await expect(form.heading).toBeVisible();
        await expect.soft(form.currency, 'default currency').toHaveText('MMK');
        await expect.soft(form.date, 'default date').toHaveValue(dmy(today()));
      });
      await test.step('4. Fill the required fields', async () => {
        await form.chooseApartment(apartment.name);
        await form.chooseCategory(INV_001.category);
        await form.choosePaymentTerms(INV_001.paymentTerms);
        const oldCoRef = await form.fillOldCoRefIfShown();
        if (oldCoRef) test.info().annotations.push({ type: 'environment', description: `"Old CoRef No." setting enabled; filled "${oldCoRef}"` });
      });
      await test.step(`5. Fill the item (${data.label})`, async () => {
        await line.fill({ ...data.input, discount: undefined });
        await form.discountInKs.check();
        await line.discount.fill(data.input.discount ?? '');
        await line.discount.blur();
        await page.waitForLoadState('networkidle').catch(() => {});
        const text = async (l: import('@playwright/test').Locator) => (await l.innerText()).replace(/\s+/g, ' ').trim();
        test.info().annotations.push({ type: 'observed', description: `before Create: Gross Price "${await line.grossPrice.inputValue()}", Total ${await text(line.total)}, Grand Total ${await text(form.total('Grand Total'))}` });
        await evidence(page, 'INV-013_step5-filled');
      });
      await test.step('6. Click "Create" button → Expected 1 + 2: not created, "Amount exceeded maximum limit." under Gross Price', async () => {
        await form.createButton.click();
        const message = line.root.getByText('Amount exceeded maximum limit.', { exact: true });
        await expect.soft(message, '"Amount exceeded maximum limit." under the Gross Price field (exact text from the case)').toBeVisible({ timeout: 15_000 });
        await page.waitForURL(InvoiceDetailPage.URL, { timeout: 10_000 }).catch(() => {});
        await expect.soft(page, 'Expected 1: no invoice is created').toHaveURL(/\/receivables\/invoices\/new$/);
        const alerts = (await page.getByRole('main').getByRole('alert').allInnerTexts()).map(t => t.trim()).filter(Boolean);
        test.info().annotations.push({ type: 'observed', description: `after Create: page ${new URL(page.url()).pathname}; messages: ${alerts.length ? alerts.join(' | ') : 'none'}` });
        await evidence(page, 'INV-013_step6-create');
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after', areas));
      await compareCheckAreas(before, after);
      await test.step('Check areas: nothing was created (Draft list and pending counter unchanged)', async () => {
        expect.soft(after.draftList, AREAS.draftList).toBe(before.draftList);
        expect.soft(after.pendingInvDn, `${AREAS.pendingInvDn} (others may add drafts too)`).toBe(before.pendingInvDn);
      });
    });

  // INV-002: the date must be blocked both on the calendar (future days disabled) and when
  // typed (the field must not keep a future date). Only the result counts, not how it is blocked. No check areas
  // in the case: read the Inv/DN Draft list (our apartment) and the pending counter to show nothing was created.
  test('INV-002 Invoice date cannot be a future date',
    testCase({ id: 'INV-002', source: 'TC_Inv_002', priority: 'P2' }),
    async ({ page, createInvoicePage: form }) => {
      const now = today();
      const futures = [
        { label: 'tomorrow', date: addDays(now, 1) },
        { label: 'next month', date: new Date(now.getFullYear(), now.getMonth() + 1, Math.min(now.getDate(), 28)) },
        { label: 'next year', date: new Date(now.getFullYear() + 1, now.getMonth(), Math.min(now.getDate(), 28)) }
      ];
      const apartment = await test.step('Setup: own apartment with a new owner (API)', () =>
        createApartmentWithOwner(page.request, test.info(), addDays(now, -30)));
      test.info().annotations.push({ type: 'data', description: `${apartment.name} (estate ${apartment.id}), today ${dmy(now, '/')}` });
      const areas: AreaKey[] = ['draftList', 'pendingInvDn'];
      const before = await test.step('Check areas: before', () => readCheckAreas(page, apartment, 'This Month', 'before', areas));

      await test.step('1. Click "Invoices / Debit Note" from left menu', async () => {
        await page.goto('/dashboard');
        await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Invoices / Debit Note' }).click();
        await expect(page).toHaveURL(/\/receivables\/invoices$/);
      });

      await test.step('2. Click "Add invoice" button', async () => {
        await page.getByRole('link', { name: 'Add Invoice' }).click();
        await expect(form.heading).toBeVisible();
      });

      await test.step('3. Currency will be MMK', async () => {
        await expect(form.currency).toHaveText('MMK');
        // The rest of the test data, so a future date would be the only thing wrong with the invoice.
        await form.chooseApartment(apartment.name);
        await form.chooseCategory(INV_001.category);
        await form.choosePaymentTerms(INV_001.paymentTerms);
        await form.line(0).fill(INV_001.line);
      });

      await test.step('4. Select future date in Date field → future days cannot be selected', async () => {
        for (const f of futures) {
          await test.step(`Calendar: ${f.label} (${dmy(f.date, '/')}) is disabled`, async () => {
            await form.chooseDate.click();
            await expect(form.calendar).toBeVisible();
            const day = await form.calendarDay(f.date);
            // Either the day is shown and disabled, or the calendar cannot reach its month at all.
            if (await day.count()) await expect.soft(day, `${f.label} on the calendar`).toBeDisabled();
            else test.info().annotations.push({ type: 'observed', description: `calendar cannot reach ${f.label}'s month` });
            if (f === futures[0]) await evidence(page, 'INV-002_step4-calendar');
            await page.keyboard.press('Escape');
            await expect(form.date, 'date unchanged after the calendar').toHaveValue(dmy(now));
          });
          await test.step(`Typed: ${dmy(f.date)} (${f.label}) is not kept`, async () => {
            await form.date.fill(dmy(f.date));
            await form.date.blur();
            await expect.soft(form.date, `typed ${f.label} must not stay in Date`).not.toHaveValue(dmy(f.date));
            const kept = await form.date.inputValue();
            test.info().annotations.push({ type: 'observed', description: `typed ${dmy(f.date)} → Date shows "${kept}"` });
            if (f === futures[0]) await evidence(page, 'INV-002_step4-typed');
            await form.date.fill(dmy(now));
            await form.date.blur();
          });
        }
      });

      const after = await test.step('Check areas: after', () => readCheckAreas(page, apartment, 'This Month', 'after', areas));
      await compareCheckAreas(before, after);
      await test.step('Check areas: nothing was created (Draft list and pending counter unchanged)', async () => {
        expect.soft(after.draftList, AREAS.draftList).toBe(before.draftList);
        expect.soft(after.pendingInvDn, `${AREAS.pendingInvDn} (others may add drafts too)`).toBe(before.pendingInvDn);
      });
    });
});
