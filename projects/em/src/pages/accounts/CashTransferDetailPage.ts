// src/pages/accounts/CashTransferDetailPage.ts — one Cash Transfer:
//   draft  → /accounts/transfers/:id/approve (heading "Approve", buttons Approve / Delete / Reject)
//   posted → /accounts/transfers/:id         (heading "Detail", voucher JV-… as h2)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export type CashTransferField =
  | 'Transferred From' | 'Received In' | 'Date' | 'Currency' | 'Amount Sent' | 'Description'
  | 'Remarks' | 'Status' | 'Journal entry' | 'Created By';

export class CashTransferDetailPage {
  readonly main: Locator;
  readonly approveHeading: Locator;
  readonly detailHeading: Locator;
  readonly approveButton: Locator;
  readonly rejectButton: Locator;
  readonly deleteButton: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.approveHeading = this.main.getByRole('heading', { name: 'Approve', level: 1 });
    this.detailHeading = this.main.getByRole('heading', { name: 'Detail', level: 1 });
    this.approveButton = this.main.getByRole('button', { name: 'Approve', exact: true });
    this.rejectButton = this.main.getByRole('button', { name: 'Reject', exact: true });
    this.deleteButton = this.main.getByRole('button', { name: 'Delete', exact: true });
  }

  async gotoApprove(id: number): Promise<void> {
    await this.page.goto(Routes.cashTransferApprove(id));
    await this.approveHeading.waitFor();
  }

  async gotoDetail(id: number): Promise<void> {
    await this.page.goto(Routes.cashTransfer(id));
    await this.detailHeading.waitFor();
  }

  /** The confirm dialog that [Approve] opens. */
  get confirmDialog(): Locator {
    return this.page.getByRole('dialog').or(this.page.getByRole('alertdialog'));
  }

  /** [Approve] › [Confirm approve]. */
  async approve(): Promise<void> {
    await this.approveButton.click();
    await this.confirmDialog.getByRole('button', { name: /^Confirm approve$/i }).click();
  }

  /** Toast or inline message after an action, e.g. "Cash Transfer has been approved successfully." */
  message(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }

  /** Voucher shown as the h2 on the posted detail page, e.g. "JV-00014". */
  get voucher(): Locator {
    return this.main.getByRole('heading', { level: 2, name: /^JV-\d+$/ });
  }

  /** Value (definition) of a term in the detail list. */
  field(term: CashTransferField): Locator {
    return this.main.getByRole('term').filter({ hasText: new RegExp(`^${term}$`) }).locator('xpath=following-sibling::*[1]');
  }
}
