// src/pages/settings/ApiAccessPage.ts — Settings › API Access (/settings/api-key)
//
// "Application URL" (disabled textbox: the partner API host, e.g. https://www.uat.ted-api.synergy.yomaland360.com) ·
// "Add API Access": Label* + [Create] · table Client · API Key · Manage ([Re Generate Key] [Permission] [Delete]).
// Permission page (/settings/api-key/:id/permissions): rows Contact / Apartment · Invoice · Summary · Soa ·
// Wallet · Deposit · Receipt · Payment · Zone & Building · Location; columns View · Create · PDF Access
// (InputSwitch). The rows load a few seconds after the page.
import { expect, type Locator, type Page } from '@playwright/test';

export class ApiAccessPage {
  readonly applicationUrl: Locator;
  readonly label: Locator;
  readonly createButton: Locator;
  readonly table: Locator;
  readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.applicationUrl = page.getByRole('heading', { name: 'Application URL' }).locator('xpath=following::input[1]');
    this.label = page.getByRole('heading', { name: 'Add API Access' }).locator('xpath=following::input[1]');
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.table = page.getByRole('table');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/settings/api-key');
    await expect(this.table.getByRole('row').nth(1)).toBeVisible({ timeout: 30_000 });
  }

  row(label: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: label, exact: true }) });
  }

  keyCell(label: string): Locator {
    return this.row(label).getByRole('cell').nth(1);
  }

  async gotoPermissions(id: string): Promise<void> {
    await this.page.goto(`/settings/api-key/${id}/permissions`);
    await this.permissionRow('Soa').waitFor({ timeout: 60_000 });
  }

  permissionRow(module: string): Locator {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name: module, exact: true }) });
  }

  async switchOnAll(module: string): Promise<void> {
    const switches = this.permissionRow(module).locator('[data-pc-name="inputswitch"]');
    for (let i = 0; i < await switches.count(); i++) {
      const sw = switches.nth(i);
      if (!(await sw.getByRole('switch').isChecked())) await sw.click();
      await expect(sw.getByRole('switch')).toBeChecked();
    }
  }
}
