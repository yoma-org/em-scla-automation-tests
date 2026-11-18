// src/pages/settings/PaymentMethodsPage.ts — Settings › Account Classification (/settings/account-classification):
// "Manage Payment Method" table (Name · Status · Manage, 10 per page, newest first) with [New]
// → /settings/payment-methods/new (Name* · Status* Enable/Disable · [Cancel] [Create]); edit
// /settings/payment-methods/:id/edit (same fields, [Update]). "Manage Type" (account types) is the second table.
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption, formField } from '@components/PrimeSelect';

export class PaymentMethodsPage {
  readonly heading: Locator;
  readonly newLink: Locator;
  readonly name: Locator;
  readonly status: Locator;
  readonly createButton: Locator;
  readonly updateButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Manage Payment Method' });
    this.newLink = page.locator('a[href="/settings/payment-methods/new"]');
    this.name = page.getByRole('textbox', { name: 'Name*' });
    this.status = formField(page, 'Status*').getByRole('combobox');
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/settings/account-classification');
    await this.heading.waitFor();
    await expect(this.page.locator('a[href^="/settings/payment-methods/"][href$="/edit"]').first()).toBeVisible({ timeout: 30_000 });
  }

  /** Payment method row (any page of the table: pages forward until found). */
  async find(name: string): Promise<Locator> {
    const row = this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name, exact: true }) })
      .filter({ has: this.page.locator('a[href^="/settings/payment-methods/"]') });
    const next = this.page.getByRole('button', { name: 'Next Page' }).first();
    for (let i = 0; i < 10 && !(await row.count()); i++) {
      if (await next.isDisabled()) break;
      await next.click();
      await this.page.waitForTimeout(1500);
    }
    return row;
  }

  async disable(id: string): Promise<void> {
    await this.page.goto(`/settings/payment-methods/${id}/edit`);
    await expect(this.name).not.toHaveValue('', { timeout: 30_000 });
    await chooseOption(this.page, this.status, 'Disable');
    await this.updateButton.click();
    await expect(this.page).toHaveURL(/\/settings\/account-classification$/, { timeout: 60_000 });
  }
}
