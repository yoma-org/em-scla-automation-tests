// src/pages/apartments/ApartmentsListPage.ts — Apartments (/apartments)
// The list only shows ONE building at a time: Advance Filter Zone → Building (defaults: Zone A / A1).
// Keyword Search filters within that building. Columns: Name (link) · Status · Owner Name · Owner Phone ·
// Owner ID · Tenant · Tenant Phone · Tenant ID · Manage.
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';

export class ApartmentsListPage {
  readonly filter: Locator;
  readonly zone: Locator;
  readonly building: Locator;
  readonly search: Locator;
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.filter = page.getByRole('region', { name: 'Advance Filter' });
    this.zone = this.filter.getByRole('combobox').nth(0);
    this.building = this.filter.getByRole('combobox').nth(1);
    this.search = page.getByPlaceholder('Keyword Search');
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/apartments');
    await this.search.waitFor();
  }

  /** Shows one building's apartments and searches the name. */
  async show(zone: string, building: string, keyword?: string): Promise<void> {
    if ((await this.zone.innerText()).trim() !== zone) await chooseOption(this.page, this.zone, zone);
    await expect(this.building).not.toHaveText(/Select/);
    if ((await this.building.innerText()).trim() !== building) await chooseOption(this.page, this.building, building);
    if (keyword) await this.search.fill(keyword);
  }

  row(name: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('link', { name, exact: true }) });
  }

  nameLink(name: string): Locator {
    return this.table.getByRole('link', { name, exact: true });
  }
}
