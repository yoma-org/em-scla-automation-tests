// src/components/ApartmentPicker.ts — the "Select Apartment" dropdown of the UO, EM and Invoice / Debit
// Note create forms: a PrimeVue Dropdown with a search box; options are apartment names ("CL1-QE1112k3x9").
import { type Locator, type Page } from '@playwright/test';
import { chooseOption, openDropdown } from '@components/PrimeSelect';

export class ApartmentPicker {
  constructor(private readonly page: Page, readonly combobox: Locator) {}

  async choose(apartment: string): Promise<void> {
    await chooseOption(this.page, this.combobox, apartment, apartment);
  }

  /** Types the name in the search box and returns the matching option (list left open). */
  async search(apartment: string): Promise<Locator> {
    const list = await openDropdown(this.page, this.combobox, apartment);
    return list.getByRole('option', { name: apartment, exact: true });
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
