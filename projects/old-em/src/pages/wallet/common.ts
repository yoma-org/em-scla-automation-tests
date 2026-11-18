// src/pages/wallet/common.ts — pieces the wallet / deposit screens share.
//
// Old EM quirks seen here:
// - Wallet / Deposit tabs load slowly: until the currency list arrives the currency filter shows "Select
//   Currency" and the action buttons (Recharge, Add Deposit, …) are missing. Wait for the "Opening Balance"
//   row of the ledger before reading anything.
// - "<CUR> Wallet Current Balance: …" / "Deposit Current Balance" is NOT shown while the balance is 0.
// - The action forms open in a right-hand side panel (role complementary) with a "Submit" button.
// - Approving a wallet credit note, a cash outflow (PV) or a deposit invoice draft has NO confirm dialog.
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';

/** "100,000.00 Ks" / "Balance: 1,000.00 Ks" → 100000 / 1000. */
export function parseAmount(text: string): number {
  const m = text.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  if (!m) throw new Error(`No amount in "${text}"`);
  return Number(m[0]);
}

/** "100,000.00 Ks" as Old EM prints MMK amounts. */
export function ks(amount: number): string {
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ks`;
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Reads an optional "… Current Balance: 1,000.00 Ks" paragraph: absent means 0. */
export async function optionalAmount(paragraph: Locator): Promise<number> {
  if ((await paragraph.count()) === 0) return 0;
  return parseAmount((await paragraph.first().innerText()).split(':').pop()!);
}

/** The right-hand form panel (Recharge Wallet, Wallet Transfer, Add Deposit, …). */
export class SidePanel {
  readonly root: Locator;
  readonly amount: Locator;
  readonly remark: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page, heading: string) {
    this.root = page.getByRole('complementary').filter({ has: page.getByRole('heading', { name: heading, exact: true }) });
    this.amount = this.root.getByRole('textbox', { name: 'Amount' });
    this.remark = this.root.getByRole('textbox', { name: 'Remark' });
    this.submitButton = this.root.getByRole('button', { name: 'Submit' });
  }

  /**
   * Leaves the amount box (Old EM formats it on blur) and clicks Submit once it is enabled: a click while the
   * form is still validating is ignored by Old EM.
   */
  async submit(): Promise<void> {
    await this.amount.press('Tab');
    await expect(this.submitButton).toBeEnabled();
    await this.page.waitForTimeout(300); // let the formatted amount settle before posting
    await this.submitButton.click();
  }

  /** The dropdown of a field, by its label text as shown ("Method*", "Received In*", "Currency"). */
  field(label: string): Locator {
    // formField(scope) needs a Page scope: a `has` locator is matched relative to the candidate div.
    return this.root.locator('div').filter({ has: this.page.getByText(label, { exact: true }) }).last().getByRole('combobox');
  }

  async choose(label: string, option: string | RegExp, search?: string): Promise<void> {
    await chooseOption(this.page, this.field(label), option, search);
  }

  /** Picks a cash / bank account by its (unique) name: options read "[CASH MMK] <name>". */
  async chooseAccount(label: string, accountName: string): Promise<void> {
    await this.choose(label, new RegExp(`\\]\\s*${escapeRegExp(accountName)}$`));
  }
}

/** Approve on a draft detail page; confirms if Old EM asks "Are you sure?". */
export async function approveDraft(page: Page): Promise<void> {
  const approve = page.getByRole('button', { name: 'Approve', exact: true });
  await approve.click();
  const confirm = page.getByRole('alertdialog').filter({ hasText: 'Are you sure?' });
  if (await confirm.waitFor({ timeout: 2_000 }).then(() => true, () => false)) {
    await confirm.getByRole('button', { name: /^Yes/ }).click();
  }
  await expect(approve).toBeHidden();
}

/** Top-bar draft counters: "DI" → deposit invoices, "CN" → credit notes, "PV" → cash outflows. */
export function topbarDraftLink(page: Page, label: 'UO' | 'MR' | 'EM' | 'Inv/DN' | 'DI' | 'CN' | 'JV' | 'PV'): Locator {
  return page.getByRole('link', { name: label, exact: true });
}

/** The top-bar "Search ..." box: types the apartment name and opens the matching result. */
export async function searchApartment(page: Page, apartment: string): Promise<void> {
  const box = page.getByRole('combobox', { name: 'Search ...' });
  await box.click();
  await box.pressSequentially(apartment, { delay: 30 });
  await expect(box).toHaveAttribute('aria-controls', /.+/);
  const list = page.locator(`[id="${await box.getAttribute('aria-controls')}"]`);
  await list.getByRole('option', { name: apartment, exact: true }).click();
}

/** Shows up to 100 rows on a paginated list (draft lists have no keyword search). */
export async function showHundredRows(page: Page): Promise<void> {
  const rpp = page.getByRole('combobox', { name: 'Rows per page' });
  if ((await rpp.innerText()).trim() === '100') return;
  await chooseOption(page, rpp, '100');
}
