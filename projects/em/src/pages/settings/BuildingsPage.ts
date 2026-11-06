// src/pages/settings/BuildingsPage.ts — Settings › Buildings List (/settings/buildings) and its Create Building panel
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class BuildingsPage {
  readonly heading: Locator;
  readonly newButton: Locator;
  /** Create Building side panel: Name*, Zone*, Status*, [Cancel] [Create]. */
  readonly panel: Locator;
  readonly name: Locator;
  readonly zone: Locator;
  readonly status: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Buildings List', level: 1 });
    this.newButton = page.getByRole('button', { name: 'New building' });
    this.panel = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Create Building' }) });
    this.name = this.panel.getByRole('textbox', { name: 'Name' });
    this.zone = this.panel.getByRole('combobox', { name: 'Zone' });
    this.status = this.panel.getByRole('combobox', { name: 'Status' });
    this.createButton = this.panel.getByRole('button', { name: 'Create', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.buildings);
    await this.heading.waitFor();
  }

  /** Opens Create Building and fills Name and Zone (Status stays Enable). Does not click [Create]. */
  async fillNew(name: string, zone: string): Promise<void> {
    await this.newButton.click();
    await this.name.fill(name);
    await this.zone.click();
    await this.page.getByRole('listbox').getByRole('option', { name: zone, exact: true }).click();
  }
}
