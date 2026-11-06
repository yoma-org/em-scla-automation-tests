// src/pages/GlobalSearch.ts — Global search in the top bar (contacts, apartments, invoices), on every page
import { type Locator, type Page } from '@playwright/test';

export class GlobalSearch {
  readonly input: Locator;
  readonly banner: Locator;

  constructor(private readonly page: Page) {
    this.banner = page.getByRole('banner');
    this.input = this.banner.getByRole('combobox', { name: 'Global search' });
  }

  async search(text: string): Promise<void> {
    await this.input.fill(text);
  }

  /** Result link that opens a record, e.g. apartment "/estates/32". Its name also holds the status ("… Enable"). */
  result(href: string): Locator {
    return this.banner.locator(`a[href="${href}"]`);
  }
}
