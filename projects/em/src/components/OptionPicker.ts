// src/components/OptionPicker.ts — a Category combobox and the option list it opens. Two kinds exist:
//   - search dialog "Options for <label>" with a listbox (Accounts Receivable filter, Cash Outflow form);
//   - plain select whose listbox opens directly (Funding Received form).
// Only one listbox is open at a time, so both are found as the page's listbox.
// Parent categories are rendered as a group around their children.
import { expect, type Locator, type Page } from '@playwright/test';

export class OptionPicker {
  readonly combobox: Locator;
  readonly listbox: Locator;

  constructor(private readonly page: Page, scope: Locator, label: string) {
    this.combobox = scope.getByRole('combobox', { name: label, exact: true });
    this.listbox = page.getByRole('listbox');
  }

  async open(): Promise<void> {
    await this.combobox.click();
    await this.listbox.waitFor();
    // The options load after the list opens ("Loading categories…"); slow on the test env.
    await expect(this.listbox.getByRole('option', { name: /^Loading/ })).toHaveCount(0, { timeout: 30_000 });
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.listbox.waitFor({ state: 'hidden' });
  }

  option(name: string): Locator {
    return this.listbox.getByRole('option', { name, exact: true });
  }

  /** The group a parent category forms; its children are options inside it. */
  group(name: string): Locator {
    return this.listbox.getByRole('group', { name, exact: true });
  }

  async optionNames(): Promise<string[]> {
    return (await this.listbox.getByRole('option').allInnerTexts()).map(s => s.trim());
  }
}
