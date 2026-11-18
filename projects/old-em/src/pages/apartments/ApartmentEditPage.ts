// src/pages/apartments/ApartmentEditPage.ts — Apartment › Edit tab (/apartments/:id/edit)
// Owners / Tenants tabs, each with "Current" and "Previous" sections and an [Add More] button.
// A row: Select Owner|Tenant (dropdown with a search box; options "<name> [ <ID numbers> ]") +
// start date (PrimeVue Calendar, required: "does not match the format Y-m-d" when empty) + Current.
// [Save] posts owners and tenants together → toast "Owners and Tenants have been updated successfully".
import { type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';
import { pickToday } from '@components/DatePicker';

export type PartyRole = 'Owner' | 'Tenant';

export class ApartmentEditPage {
  readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/edit`);
    await this.page.getByRole('tab', { name: 'Owners' }).waitFor();
  }

  tab(role: PartyRole): Locator {
    return this.page.getByRole('tabpanel', { name: `${role}s` });
  }

  /** Adds a current owner / tenant row with today's start date (not saved yet). */
  async addCurrent(role: PartyRole, contactName: string): Promise<void> {
    await this.page.getByRole('tab', { name: `${role}s` }).click();
    const panel = this.tab(role);
    const pickers = panel.getByRole('combobox', { name: `Select ${role}` });
    const before = await panel.getByRole('button', { name: 'Remove' }).count();
    await panel.getByRole('button', { name: 'Add More' }).first().click();
    const picker = pickers.first();
    await chooseOption(this.page, picker, new RegExp(`^${escape(contactName)} \\[`), contactName);
    await pickToday(this.page, panel.getByRole('button', { name: 'Choose Date' }).nth(before));
  }
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
