// src/pages/billing/EmPages.ts — Add EM Entry form and the EM draft list.
// Add EM Entry (/estate-managements/new): Apartment* · Monthly Fee* ("30,000.00 Ks", type it) · No. of Month* (1) ·
//   From* (today, dd-mm-yyyy) · To (disabled, From + N months − 1 day) · Remark · [Submit] → toast "1 EM Entry saved."
//   → /estate-managements.
// EM drafts (/estate-managements/draft/all): checkbox · Date · Apartment · Monthly Fee · No. of Months · From · To ·
//   Amount · [Approve] · edit / delete. Approve → "Are you sure?" → "Yes, approve it" → toast
//   "EM has been approved successfully" and a debit note (DN-…, category "Estate Mgmt Fees", due in 45 days).
import { type Locator, type Page } from '@playwright/test';
import { EmCreatePage } from '@pages/em/EmCreatePage';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { formField } from '@components/PrimeSelect';
import { showAllRows } from '@pages/billing/BillingListPages';

export class EmForm extends EmCreatePage {
  readonly monthlyFee: Locator;
  readonly months: Locator;
  readonly from: Locator;
  readonly to: Locator;
  readonly submitButton: Locator;
  private readonly remarkLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.remarkLabel = page.getByText('Remark', { exact: true });
    this.monthlyFee = page.getByRole('textbox', { name: 'Monthly Fee*' });
    this.months = formField(page, 'No. of Month*').getByRole('spinbutton');
    this.from = formField(page, 'From*').getByRole('combobox');
    this.to = formField(page, 'To*').getByRole('combobox');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async fill(monthlyFee: number, months: number): Promise<void> {
    await this.monthlyFee.click();
    await this.monthlyFee.pressSequentially(String(monthlyFee));
    await this.months.fill(String(months));
    // Click outside instead of Tab: Tab focuses From and opens its calendar over the Submit button.
    await this.remarkLabel.click();
  }
}

export class EmDraftsPage {
  readonly rows: Locator;
  readonly confirm: ConfirmDialog;

  constructor(private readonly page: Page) {
    this.rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
    this.confirm = new ConfirmDialog(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/estate-managements/draft/all');
    await this.page.getByRole('button', { name: 'Bulk Approve' }).waitFor();
    await this.rows.first().waitFor();
    await showAllRows(this.page);
  }

  /** Cells: 1 Date · 2 Apartment · 3 Monthly Fee · 4 No. of Months · 5 From · 6 To · 7 Amount. */
  row(apartment: string) {
    const row = this.rows.filter({ has: this.page.getByRole('cell', { name: apartment, exact: true }) });
    const c = row.getByRole('cell');
    return { row, monthlyFee: c.nth(3), months: c.nth(4), from: c.nth(5), to: c.nth(6), amount: c.nth(7) };
  }

  async approve(apartment: string): Promise<void> {
    await this.row(apartment).row.getByRole('button', { name: 'Approve' }).click();
    await this.confirm.accept('Yes, approve it');
  }
}
