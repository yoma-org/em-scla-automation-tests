// src/data/balances.ts — money movements for the balance / reporting tests (Dashboard, AR, SOA, Wallet,
// Deposit, Account Statement). Minimal UI flows of our own, so this area does not wait for the payment /
// cash-received / wallet / deposit page objects other areas are building.
//
//   createInvoice(page, apt, opts)        Invoices › Add Invoice (or Add Debit Note) → draft → Approve
//                                         (no confirm dialog; toast "… has been approved successfully").
//                                         opts.date back-dates it (Old EM allows past dates).
//                                         → { id, code ("Inv-202611-00032"), total (cents), url }
//   makePayment(page, apt, account, amt)  Apartment › Make Payment, Cash, auto-allocated to the oldest invoice.
//   rechargeWallet(page, apt, acc, amt)   Apartment › Wallet › Recharge (sidebar) → RV "( Wallet Cash Received )".
//   addDeposit(page, apt, acc, amt)       Apartment › Deposit › Add Deposit (sidebar) → RV "( Deposit Received )".
//   createFundingReceived(page, acc, amt) Cash Received › Funding Received → RV (shown "(Unknown)" in the
//                                         account statement). → { payer }
//   createCashOutflow(page, acc, amt)     Cash Outflow → PV draft → approve. → { description, id }
//
// Accounts are picked by name in "[CASH MMK] <name>" lists; categories / locations are grouped lists where
// group headers are also role=option, so only li.p-dropdown-item is clickable.
import { expect, type Locator, type Page } from '@playwright/test';
import { toast } from '@components/Toast';
import { formField } from '@components/PrimeSelect';
import { uniqueName } from '@helpers/names';
import type { Apartment, CashAccount } from '@data/builders';
import { cents } from '@pages/balances/money';

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Picks an option of a (possibly grouped) PrimeVue Dropdown; `search` types in the overlay filter box when it has one. */
export async function pickItem(page: Page, combobox: Locator, option: string | RegExp, search?: string): Promise<void> {
  await combobox.click();
  const list = page.locator(`[id="${await combobox.getAttribute('aria-controls')}"]`);
  await expect(list).toBeVisible();
  if (search) {
    const box = page.locator('[data-pc-section="panel"]').filter({ has: list }).getByRole('searchbox');
    if (await box.count()) await box.fill(search);
  }
  const items = list.locator('li.p-dropdown-item');
  await items.first().waitFor();
  const item = typeof option === 'string' ? items.filter({ hasText: new RegExp(`^${esc(option)}$`) }) : items.filter({ hasText: option });
  await item.first().click();
  await expect(list).toBeHidden();
}

/** Account option "[CASH MMK] <name>". */
const accountOption = (name: string) => new RegExp(`\\] ${esc(name)}$`);

/** Types into a vue-number-format amount box (fill() is ignored) and leaves it. */
export async function typeAmount(page: Page, box: Locator, amount: number): Promise<void> {
  // Clearing with keys leaves "0.00 Ks" with the caret after "Ks", where digits are dropped: start empty.
  // The invoice form sometimes re-renders and wipes the box right after typing: retype until it sticks.
  const shown = new RegExp(amount.toLocaleString('en-US').replace(/[.]/g, '\\.'));
  await expect(async () => {
    if (await box.inputValue()) await box.fill('');
    await box.click();
    await box.pressSequentially(String(amount), { delay: 80 });
    await page.keyboard.press('Tab');
    await expect(box).toHaveValue(shown, { timeout: 2_000 });
    await page.waitForTimeout(500);
    await expect(box).toHaveValue(shown, { timeout: 500 });
  }).toPass({ timeout: 30_000 });
}

type Day = { y: number; m: number; d: number };
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Picks a day in a PrimeVue Calendar opened by its "Choose Date" button. */
export async function pickDay(page: Page, chooseDate: Locator, day: Day): Promise<void> {
  await chooseDate.click();
  const panel = page.getByRole('dialog', { name: 'Choose Date' });
  await panel.waitFor();
  for (let i = 0; i < 36; i++) {
    const m = MONTH_NAMES.indexOf((await panel.getByRole('button', { name: 'Choose Month' }).innerText()).trim()) + 1;
    const y = Number((await panel.getByRole('button', { name: 'Choose Year' }).innerText()).trim());
    const diff = (day.y * 12 + day.m) - (y * 12 + m);
    if (diff === 0) break;
    await panel.getByRole('button', { name: diff > 0 ? 'Next Month' : 'Previous Month' }).click();
  }
  await panel.locator('td:not(.p-datepicker-other-month) > span').filter({ hasText: new RegExp(`^${day.d}$`) }).first().click();
  await expect(panel).toBeHidden();
}

/** Some actions ask "Are you sure?" first, others go straight to the toast: handle both. */
async function confirmIfAsked(page: Page, done: Locator): Promise<void> {
  const yes = page.getByRole('alertdialog').getByRole('button', { name: /^Yes/ });
  await expect(done.or(yes).first()).toBeVisible();
  if (await yes.isVisible()) await yes.click();
  await expect(done).toBeVisible();
}

// ── Invoice / Debit Note ───────────────────────────────────────────────────────────────────

export interface Invoice { id: string; code: string; total: bigint; url: string }

export interface InvoiceOptions {
  kind?: 'invoice' | 'debit-note';
  /** Gross price of the single line (5% tax is added by the default tax type). */
  price?: number;
  /** Income category; default "Maintenance Services" (not Utilities / Estate Mgmt Fees). */
  category?: string;
  /** Invoice date; default today. */
  date?: Day;
  approve?: boolean;
}

export async function createInvoice(page: Page, apartment: Pick<Apartment, 'name'>, opts: InvoiceOptions = {}): Promise<Invoice> {
  const kind = opts.kind ?? 'invoice';
  await page.goto(kind === 'invoice' ? '/invoices/add-invoice' : '/invoices/add-debit-note');
  const create = page.getByRole('button', { name: 'Create' });
  await create.waitFor();
  await pickItem(page, formField(page, 'Apartment*').getByRole('combobox'), apartment.name, apartment.name);
  await pickItem(page, formField(page, /^Income Categories\*?$/).getByRole('combobox'), opts.category ?? 'Maintenance Services');
  if (opts.date) await pickDay(page, page.getByRole('button', { name: 'Choose Date' }).first(), opts.date);
  await page.getByPlaceholder('Item Description').first().fill(uniqueName('item'));
  const unit = page.getByRole('spinbutton').first();
  await unit.click();
  await unit.pressSequentially('1');
  await typeAmount(page, page.getByRole('textbox', { name: 'Gross Price' }).first(), opts.price ?? 1000);
  // "Old CoRef No.*" shows (required) only while a General Setting asks for it; other testers toggle it.
  const coref = page.getByPlaceholder('Old CoRef No');
  if (await coref.isVisible()) await coref.fill(`QE${Date.now()}`);
  await create.click();
  await expect(page).toHaveURL(/\/invoices\/\d+\/draft$/);
  const id = page.url().match(/\/invoices\/(\d+)\/draft/)![1];
  await page.getByRole('heading', { name: /^Total:/ }).waitFor(); // Approve does nothing before the draft has loaded
  if (opts.approve ?? true) {
    // A click right after the page renders is sometimes lost: retry while the draft still offers Approve.
    const approve = page.getByRole('button', { name: 'Approve' });
    const done = toast(page, /approved successfully/i);
    await expect(async () => {
      if (await approve.isVisible()) await approve.click();
      await expect(done).toBeVisible({ timeout: 8_000 });
    }).toPass({ timeout: 40_000 });
  }
  await page.goto(`/invoices/${id}`);
  const totalHeading = page.getByRole('heading', { name: /^Total:/ });
  await totalHeading.waitFor();
  // Header "#Inv-202611-00034" (invoice) / "#DN-202611-00013" (debit note).
  const number = page.getByText(/^#[A-Za-z]+-\d{6}-\d{5}$/).first();
  await number.waitFor();
  const code = (await number.innerText()).trim().slice(1);
  return { id, code, total: cents(await totalHeading.innerText()), url: `/invoices/${id}` };
}

// ── Apartment receipts ─────────────────────────────────────────────────────────────────────

const location = /\S/; // any location: the reports here do not filter by it

/** Make Payment (MMK, Cash) of `amount`; Old EM allocates it to the apartment's unpaid invoices. */
export async function makePayment(page: Page, apartment: Pick<Apartment, 'id'>, account: Pick<CashAccount, 'name'>, amount: number): Promise<void> {
  await page.goto(`/apartments/${apartment.id}/make-payment`);
  await page.getByRole('textbox', { name: 'Received Amount (MMK)' }).waitFor();
  await page.getByRole('table').getByRole('row').nth(1).waitFor();
  await pickItem(page, formField(page, 'Location*').getByRole('combobox'), location);
  await pickItem(page, formField(page, 'Payment Method*').getByRole('combobox'), 'Cash');
  await pickItem(page, formField(page, 'Received In*').getByRole('combobox'), accountOption(account.name), account.name);
  await typeAmount(page, page.getByRole('textbox', { name: 'Received Amount (MMK)' }), amount);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await confirmIfAsked(page, toast(page, /success/i));
}

async function sidebarReceipt(page: Page, path: string, open: string, account: string, amount: number, done: RegExp): Promise<void> {
  await page.goto(path);
  await page.getByRole('button', { name: open }).click();
  const bar = page.getByRole('complementary');
  // Labels here are "Method<span>*</span>": find the field by its leading text.
  const field = (label: RegExp) => bar.locator('.field').filter({ hasText: label }).getByRole('combobox');
  await pickItem(page, field(/^Method/), 'Cash');
  await pickItem(page, field(/^Received In/), accountOption(account), account);
  await pickItem(page, field(/^Location/), location);
  await typeAmount(page, bar.getByRole('textbox', { name: 'Amount' }), amount);
  await bar.getByRole('button', { name: 'Submit' }).click();
  await expect(toast(page, done)).toBeVisible();
}

export async function rechargeWallet(page: Page, apartment: Pick<Apartment, 'id'>, account: Pick<CashAccount, 'name'>, amount: number): Promise<void> {
  await sidebarReceipt(page, `/apartments/${apartment.id}/wallet`, 'Recharge', account.name, amount, /Wallet Recharge has been created successfully/);
}

export async function addDeposit(page: Page, apartment: Pick<Apartment, 'id'>, account: Pick<CashAccount, 'name'>, amount: number): Promise<void> {
  await sidebarReceipt(page, `/apartments/${apartment.id}/deposit`, 'Add Deposit', account.name, amount, /Add Deposit has been created successfully/);
}

// ── Cash received / outflow ────────────────────────────────────────────────────────────────

export async function createFundingReceived(page: Page, account: Pick<CashAccount, 'name'>, amount: number): Promise<{ payer: string }> {
  const payer = uniqueName('Payer');
  await page.goto('/inter-company');
  await page.getByPlaceholder('Payer Name').fill(payer);
  await typeAmount(page, page.getByPlaceholder('Amount'), amount);
  await pickItem(page, formField(page, 'Category*').getByRole('combobox'), /\S/);
  await pickItem(page, formField(page, 'Deposit*').getByRole('combobox'), accountOption(account.name), account.name);
  await pickItem(page, formField(page, 'Location*').getByRole('combobox'), location);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(toast(page, /Cash Receipt has been created successfully/)).toBeVisible();
  return { payer };
}

/** Cash Outflow (PV) from `account`, then approves the draft (admin approves its own). */
export async function createCashOutflow(page: Page, account: Pick<CashAccount, 'name'>, amount: number): Promise<{ description: string; id: string }> {
  const description = uniqueName('PV');
  await page.goto('/cash-outflows');
  await page.getByPlaceholder('Payee Name').fill(uniqueName('Payee'));
  await typeAmount(page, page.getByPlaceholder('Amount'), amount);
  await pickItem(page, formField(page, 'Category*').getByRole('combobox'), /\S/);
  await pickItem(page, formField(page, 'Withdraw From*').getByRole('combobox'), accountOption(account.name), account.name);
  await page.getByPlaceholder('Description').fill(description);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(toast(page, /success/i)).toBeVisible();

  // Draft list is oldest first and paginated: ours is on the last page.
  await page.goto('/cash-outflows/draft');
  await page.getByRole('heading', { name: 'Draft: Cash Outflow' }).waitFor();
  const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: description, exact: true }) });
  const last = page.getByRole('button', { name: 'Last Page' });
  // The list renders, then reloads and jumps back to page 1: keep going to the last page until our row shows.
  await expect(async () => {
    if (!(await row.count()) && await last.isEnabled()) await last.click();
    await expect(row).toHaveCount(1, { timeout: 2_000 });
  }).toPass({ timeout: 45_000 });
  await row.getByRole('button', { name: 'Row Collapsed' }).click();
  const href = await page.locator('a[href^="/cash-outflows/"][href$="/draft"]').filter({ visible: true }).last().getAttribute('href');
  const id = href!.match(/\/cash-outflows\/(\d+)\/draft/)![1];
  await page.goto(href!);
  await page.getByRole('button', { name: 'Approve' }).click();
  await confirmIfAsked(page, toast(page, /approved/i));
  return { description, id };
}
