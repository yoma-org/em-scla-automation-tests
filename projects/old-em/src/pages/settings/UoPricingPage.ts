// src/pages/settings/UoPricingPage.ts — Settings › UO Pricing (/settings/service-items)
// Table Name · Unit Price ("100.00 Ks") · Manage (pencil). No [New] / delete in Old EM.
// Pencil opens a side panel "Edit Pricing Item": Service Item Name (disabled) · Unit Price (Ks)* · Cancel / Update.
import { type Locator, type Page } from '@playwright/test';

export class UoPricingPage {
  readonly heading: Locator;
  readonly table: Locator;
  readonly editPanel: Locator;
  readonly editName: Locator;
  readonly editUnitPrice: Locator;
  readonly updateButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'UO Pricing' });
    this.table = page.getByRole('table');
    this.editPanel = page.getByRole('complementary').filter({ has: page.getByRole('heading', { name: 'Edit Pricing Item' }) });
    this.editName = this.editPanel.getByRole('textbox', { name: 'Service Item Name' });
    this.editUnitPrice = this.editPanel.getByRole('spinbutton', { name: /Unit Price/ });
    this.updateButton = this.editPanel.getByRole('button', { name: 'Update' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/settings/service-items');
    await this.heading.waitFor();
    await this.table.getByRole('rowgroup').nth(1).getByRole('row').first().waitFor();
  }

  row(item: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: item, exact: true }) });
  }

  unitPriceCell(item: string): Locator {
    return this.row(item).getByRole('cell').nth(1);
  }

  /** Current unit price as a number (cell "1,250.00 Ks"). */
  async unitPrice(item: string): Promise<number> {
    return Number((await this.unitPriceCell(item).innerText()).replace(/[^\d.]/g, ''));
  }

  async openEdit(item: string): Promise<void> {
    await this.row(item).getByRole('button').click();
    await this.editPanel.waitFor();
  }
}
