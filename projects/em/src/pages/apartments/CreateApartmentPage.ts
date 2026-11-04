// src/pages/apartments/CreateApartmentPage.ts — Apartments › New (/estates/new)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class CreateApartmentPage {
  readonly heading: Locator;
  readonly form: Locator;
  readonly fullName: Locator;
  /** Native <select>s. Building is reloaded when the Zone changes. */
  readonly zone: Locator;
  readonly building: Locator;
  readonly unit: Locator;
  readonly createButton: Locator;
  /** Status (Enable / Disable) on create, as in Old EM. Missing on New EM build -43. */
  readonly statusLabel: Locator;
  readonly statusEnable: Locator;
  readonly statusDisable: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Create Apartments', level: 1 });
    this.form = page.getByRole('form', { name: 'New apartment' });
    this.fullName = this.form.getByRole('textbox', { name: 'Full Name' });
    this.zone = this.form.getByRole('combobox', { name: 'Zone' });
    this.building = this.form.getByRole('combobox', { name: 'Building' });
    this.unit = this.form.getByRole('textbox', { name: 'Unit' });
    this.createButton = page.getByRole('button', { name: 'Create', exact: true });
    this.statusLabel = this.form.getByText(/^Status\s*\*?$/);
    // Old EM shows two toggle buttons; accept radios too, in case New EM builds it that way.
    this.statusEnable = this.form.getByRole('button', { name: /^enable$/i }).or(this.form.getByRole('radio', { name: /^enable$/i }));
    this.statusDisable = this.form.getByRole('button', { name: /^disable$/i }).or(this.form.getByRole('radio', { name: /^disable$/i }));
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.createApartment);
  }

  /** The "*" after a field label (Zone, Building, Unit). */
  requiredMark(field: 'Zone' | 'Building' | 'Unit'): Locator {
    return this.form.getByRole('group').filter({ has: this.page.getByRole(field === 'Unit' ? 'textbox' : 'combobox', { name: field }) })
      .getByText('*', { exact: true });
  }

  /** Options a user can pick but that carry no value (a placeholder such as "Zone" or "Building"). */
  selectableEmptyOptions(select: Locator): Locator {
    return select.locator('option[value=""]:not([disabled])');
  }

  /** Texts of the options that have a value. */
  async optionTexts(select: Locator): Promise<string[]> {
    return select.locator('option:not([value=""])').allInnerTexts().then(t => t.map(s => s.trim()));
  }
}
