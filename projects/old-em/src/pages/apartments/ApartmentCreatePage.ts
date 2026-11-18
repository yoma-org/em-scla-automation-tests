// src/pages/apartments/ApartmentCreatePage.ts — Create Apartments (/apartments/new)
// Zone (#zone) → Building (#building, defaults to the zone's first building) → Unit → Status → Create.
// The disabled "Full Name" shows the apartment name: "<building>-<unit>".
import { type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';

export class ApartmentCreatePage {
  readonly zone: Locator;
  readonly building: Locator;
  readonly unit: Locator;
  readonly fullName: Locator;
  readonly enable: Locator;
  readonly disable: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.zone = page.locator('#zone').getByRole('combobox');
    this.building = page.locator('#building').getByRole('combobox');
    this.unit = page.getByPlaceholder('Unit', { exact: true });
    this.fullName = page.getByRole('textbox', { name: 'Full Name' });
    this.enable = page.getByRole('button', { name: 'ENABLE' });
    this.disable = page.getByRole('button', { name: 'DISABLE' });
    this.createButton = page.getByRole('button', { name: 'Create' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/apartments/new');
    await this.unit.waitFor();
  }

  async selectZone(zone: string): Promise<void> {
    await chooseOption(this.page, this.zone, zone);
  }

  async selectBuilding(building: string): Promise<void> {
    if ((await this.building.innerText()).trim() !== building) await chooseOption(this.page, this.building, building);
  }
}
