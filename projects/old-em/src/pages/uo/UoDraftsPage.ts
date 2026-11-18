// src/pages/uo/UoDraftsPage.ts — Manage UO, Draft Only (/utility-operations/draft/all)
// Rows: checkbox · Reading Date · Apartment · Elec.(YESC) "cur - prev = used" · Elec.(GEN) · Treated Water ·
// Raw Water · Amount ("2,500.00Ks") · [Approve] · edit / delete. Keyword Search does NOT filter this list.
// Approve → "Are you sure?" → "Yes, approve it" → toast "UO Entry Invoiced Successfully." (admin may
// approve its own drafts).
import { type Locator, type Page } from '@playwright/test';
import { ConfirmDialog } from '@components/ConfirmDialog';

export class UoDraftsPage {
  readonly table: Locator;
  readonly confirm: ConfirmDialog;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
    this.confirm = new ConfirmDialog(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/utility-operations/draft/all');
    await this.page.getByRole('button', { name: 'Bulk Approve' }).waitFor();
  }

  row(apartment: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: apartment, exact: true }) });
  }

  amount(apartment: string): Locator {
    return this.row(apartment).getByRole('cell').nth(7);
  }

  async approve(apartment: string): Promise<void> {
    await this.row(apartment).getByRole('button', { name: 'Approve' }).click();
    await this.confirm.accept('Yes, approve it');
  }
}
