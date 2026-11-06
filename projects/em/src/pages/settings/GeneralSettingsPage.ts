// src/pages/settings/GeneralSettingsPage.ts — Settings › General Settings (/settings/general)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class GeneralSettingsPage {
  readonly heading: Locator;
  readonly main: Locator;
  /** Enable / Disable select; the only setting on Old EM. */
  readonly oldCoRefNo: Locator;
  readonly submit: Locator;
  /** Every form control on the page (inputs, selects, comboboxes, checkboxes, switches). */
  readonly fields: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'General Settings', level: 1 });
    this.main = page.getByRole('main');
    this.oldCoRefNo = this.main.getByRole('combobox', { name: 'Old CoRef No.' });
    this.submit = this.main.getByRole('button', { name: 'Submit' });
    this.fields = this.main.locator('input:not([type=hidden]), select, textarea, [role=combobox], [role=switch], [role=checkbox]');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.generalSettings);
    await this.oldCoRefNo.waitFor();
  }

  /** Label (or name/id) of every field, for the failure message. */
  async fieldLabels(): Promise<string[]> {
    return this.fields.evaluateAll(els => els.map(e =>
      (e.getAttribute('aria-label') || (e.id && document.querySelector(`label[for="${e.id}"]`)?.textContent) || e.getAttribute('name') || e.id || e.tagName).trim()));
  }
}
