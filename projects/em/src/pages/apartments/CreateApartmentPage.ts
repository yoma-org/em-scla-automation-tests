// src/pages/apartments/CreateApartmentPage.ts — Apartments › New (/estates/new)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class CreateApartmentPage {
  readonly heading: Locator;
  readonly form: Locator;
  readonly fullName: Locator;
  /**
   * Zone and Building are button comboboxes (since build -62) that open a "Suggestions" listbox.
   * The button text is the selected option ("Loading zones…" / "Choose a zone first" before that).
   * Building is reloaded when the Zone changes.
   */
  readonly zone: Locator;
  readonly building: Locator;
  readonly unit: Locator;
  readonly createButton: Locator;
  /** Status (Enable / Disable) on create, as in Old EM. Missing on build -43, back on build -62. */
  readonly statusLabel: Locator;
  readonly statusEnable: Locator;
  readonly statusDisable: Locator;
  readonly suggestions: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Create Apartments', level: 1 });
    this.form = page.getByRole('form', { name: 'New apartment' });
    this.fullName = this.form.getByRole('textbox', { name: 'Full Name' });
    this.zone = this.form.getByRole('combobox', { name: 'Zone' });
    this.building = this.form.getByRole('combobox', { name: 'Building' });
    this.unit = this.form.getByRole('textbox', { name: 'Unit' });
    this.createButton = page.getByRole('button', { name: 'Create', exact: true });
    this.statusLabel = this.form.getByRole('group').filter({ has: page.getByRole('group', { name: 'Status' }) }).getByText(/^Status/);
    // Old EM shows two toggle buttons; accept radios too, in case New EM builds it that way.
    this.statusEnable = this.form.getByRole('button', { name: /^enable$/i }).or(this.form.getByRole('radio', { name: /^enable$/i }));
    this.statusDisable = this.form.getByRole('button', { name: /^disable$/i }).or(this.form.getByRole('radio', { name: /^disable$/i }));
    this.suggestions = page.getByRole('listbox', { name: 'Suggestions' });
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.createApartment);
  }

  /** Text shown in a combobox: the selected option or its placeholder. */
  async selected(combobox: Locator): Promise<string> {
    return (await combobox.innerText()).trim();
  }

  async open(combobox: Locator): Promise<void> {
    await combobox.click();
    await this.suggestions.getByRole('option').first().waitFor();
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.suggestions.waitFor({ state: 'detached' });
  }

  /** Opens a combobox, reads its option texts, closes it again. */
  async optionTexts(combobox: Locator): Promise<string[]> {
    await this.open(combobox);
    const texts = (await this.suggestions.getByRole('option').allInnerTexts()).map(s => s.trim());
    await this.close();
    return texts;
  }

  /** Picks an option of a combobox by its exact text. */
  async choose(combobox: Locator, option: string): Promise<void> {
    await combobox.click();
    await this.suggestions.getByRole('option', { name: option, exact: true }).first().click();
    await this.suggestions.waitFor({ state: 'detached' });
  }

  /** The "*" after a field label (Zone, Building, Unit). */
  requiredMark(field: 'Zone' | 'Building' | 'Unit'): Locator {
    return this.form.getByRole('group').filter({ has: this.page.getByRole(field === 'Unit' ? 'textbox' : 'combobox', { name: field }) })
      .getByText('*', { exact: true });
  }

  /** Options a user can pick that are not a real record: blank, the field name itself ("Zone"), or "Select …"/"Choose …". */
  static placeholderOptions(options: string[], field: 'Zone' | 'Building'): string[] {
    return options.filter(o => o === '' || o.toLowerCase() === field.toLowerCase() || /^(select|choose)\b/i.test(o));
  }
}
