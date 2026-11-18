// src/pages/billing/BillingListPages.ts — Manage UO (/utility-operations) and Manage EM (/estate-managements).
// Both: [Draft Only] checkbox · month picker (current month) · [New … Draft] [Import] · Keyword Search · Zone ·
// Building (defaults Zone A / A1; choosing a zone selects its first building, City Loft → CL1).
// UO rows: Reading Date · Apartment · Elec.(YESC) "cur - prev = used" · Elec.(GEN) · Treated Water · Raw Water ·
//   Amount ("1,015.00Ks") · Invoice (link "Inv-YYYYMM-NNNNN" → /invoices/:id) · Manage.
// EM rows: Date · Apartment · Monthly Fee · No. of Months · From · To · Amount · Debit Note (link "DN-…") · Manage.
// Keyword Search filters these lists (unlike the UO draft list).
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';

/**
 * Sets the list's "Rows per page" to 100. The UO / EM draft lists cannot be searched (keyword does not filter)
 * and hold every tester's pending drafts, so a new draft can be on page 2.
 */
export async function showAllRows(page: Page): Promise<void> {
  const perPage = page.getByRole('combobox', { name: 'Rows per page' });
  await perPage.waitFor();
  // Disabled until the rows have loaded (and stays disabled when the list is empty).
  await expect(perPage).toBeEnabled({ timeout: 15_000 }).catch(() => {});
  if (await perPage.isEnabled()) await chooseOption(page, perPage, '100');
}

export class BillingListPage {
  readonly search: Locator;
  readonly zone: Locator;
  readonly building: Locator;
  readonly rows: Locator;

  constructor(protected readonly page: Page, private readonly path: string) {
    this.search = page.getByRole('textbox', { name: 'Keyword Search' });
    this.zone = this.search.locator('xpath=following::*[@role="combobox"][1]');
    this.building = this.search.locator('xpath=following::*[@role="combobox"][2]');
    this.rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.getByRole('button', { name: 'Import' }).waitFor();
  }

  /** Shows the apartment's building (zone City Loft → CL1 by default) and searches the unit. */
  async show(apartment: { zone: string; building: string; unit: string }): Promise<void> {
    await expect(this.zone).not.toHaveText('');
    await chooseOption(this.page, this.zone, apartment.zone);
    await expect(this.building).toHaveText(new RegExp(`^${apartment.building}$`, 'i'));
    await this.search.fill(apartment.unit);
  }

  rowsOf(apartment: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('cell', { name: apartment, exact: true }) });
  }

  /** The document link (Invoice / Debit Note column) of a row. */
  docLink(row: Locator): Locator {
    return row.getByRole('link', { name: /^(Inv|DN)-\d{6}-\d+$/ });
  }
}

export class UoListPage extends BillingListPage {
  constructor(page: Page) { super(page, '/utility-operations'); }
}

export class EmListPage extends BillingListPage {
  constructor(page: Page) { super(page, '/estate-managements'); }
}
