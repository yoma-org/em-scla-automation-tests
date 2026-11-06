// src/pages/accounts/CashTransfersPage.ts — Cash Transfer page (/accounts/transfers): the "New cash transfer" form and the register.
// [Submit] creates a DRAFT; it is posted only after Approve on /accounts/transfers/:id/approve.
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export interface CashTransferInput {
  /** Option label as listed, e.g. 'CASH-0003 — QA-REPRO-EM-94 Cash'. */
  from: string;
  to: string;
  amount: string;
  description?: string;
  remark?: string;
}

export class CashTransfersPage {
  readonly heading: Locator;
  readonly form: Locator;
  readonly transferredFrom: Locator;
  readonly receivedIn: Locator;
  readonly date: Locator;
  readonly amountSent: Locator;
  readonly description: Locator;
  readonly remark: Locator;
  readonly submitButton: Locator;
  /** Hint next to [Submit], e.g. "Choose the account the money leaves." */
  readonly formStatus: Locator;
  readonly register: Locator;
  /** Header badge "JV — 6 Cash transfers pending approval" → draft list (/accounts/transfers?status=DRAFT). */
  readonly pendingApprovalBadge: Locator;
  readonly draftRegister: Locator;

  constructor(private readonly page: Page) {
    this.pendingApprovalBadge = page.getByRole('navigation', { name: 'Pending approvals by document type' })
      .getByRole('link', { name: /Cash transfers? pending approval/ });
    this.draftRegister = page.getByRole('region', { name: 'Draft cash transfers' }).getByRole('table');
    this.heading = page.getByRole('heading', { name: 'Cash Transfer', level: 1 });
    this.form = page.getByRole('form', { name: 'New cash transfer' });
    this.transferredFrom = this.form.getByRole('combobox', { name: 'Transferred From' });
    this.receivedIn = this.form.getByRole('combobox', { name: 'Received In' });
    this.date = this.form.getByRole('textbox', { name: 'Date' });
    this.amountSent = this.form.getByRole('textbox', { name: 'Amount Sent' });
    this.description = this.form.getByRole('textbox', { name: 'Description' });
    this.remark = this.form.getByRole('textbox', { name: 'Remark' });
    this.submitButton = this.form.getByRole('button', { name: 'Submit' });
    this.formStatus = this.form.getByRole('status');
    this.register = page.getByRole('region', { name: 'Cash transfers' }).getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.cashTransfers);
    await this.form.waitFor();
  }

  /** Picks an account in the combobox's listbox. */
  async chooseAccount(combobox: Locator, account: string): Promise<void> {
    await combobox.click();
    await this.page.getByRole('listbox').getByRole('option', { name: account, exact: true }).click();
  }

  async fill(data: CashTransferInput): Promise<void> {
    await this.chooseAccount(this.transferredFrom, data.from);
    await this.chooseAccount(this.receivedIn, data.to);
    await this.amountSent.fill(data.amount);
    if (data.description) await this.description.fill(data.description);
    if (data.remark) await this.remark.fill(data.remark);
  }

  /** Clicks [Submit] and returns the id of the draft the API created. */
  async submit(): Promise<number> {
    const created = this.page.waitForResponse(
      r => r.request().method() === 'POST' && /\/api\/gw\/accounts\/cash\/transfers\/?(\?|$)/.test(r.url())
    );
    await this.submitButton.click();
    const response = await created;
    if (!response.ok()) throw new Error(`Create cash transfer failed: ${response.status()} ${(await response.text()).slice(0, 300)}`);
    const body = await response.json();
    const id = body?.id ?? body?.data?.id;
    if (typeof id !== 'number') throw new Error(`No transfer id in create response: ${JSON.stringify(body).slice(0, 300)}`);
    return id;
  }

  /** Opens the draft list the way a user does: header badge JV. */
  async openDraftList(): Promise<void> {
    await this.pendingApprovalBadge.click();
    await this.draftRegister.waitFor();
  }

  /** Draft list row, found by its description (unique per test run). */
  draftRow(description: string): Locator {
    return this.draftRegister.getByRole('row').filter({ hasText: description });
  }

  /** Manage icon of a draft row: "Open draft transfer 30 to approve" → /accounts/transfers/30/approve. */
  manageDraftLink(row: Locator): Locator {
    return row.getByRole('link', { name: /^Open draft transfer \d+ to approve$/ });
  }

  /** Register row of one posted transfer, found by its voucher (JV-00014). */
  row(voucher: string): Locator {
    return this.register.getByRole('row').filter({ has: this.page.getByRole('link', { name: new RegExp(`^${voucher}\\b`) }) });
  }

  /** Cell of a register row by column. */
  cell(row: Locator, column: 'JV#' | 'Date' | 'Transferred From' | 'Received In' | 'Amount' | 'Description' | 'Created By'): Locator {
    const index = { 'JV#': 0, Date: 1, 'Transferred From': 2, 'Received In': 3, Amount: 4, Description: 5, 'Created By': 6 }[column];
    return row.getByRole('cell').nth(index);
  }
}
