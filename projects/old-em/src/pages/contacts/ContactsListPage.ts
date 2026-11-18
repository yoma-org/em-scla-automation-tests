// src/pages/contacts/ContactsListPage.ts — Contacts (/contacts): Keyword Search + table
// Columns: Name · Type · ID · Phone · Email · Manage (detail / edit / delete icons).
import { type Locator, type Page } from '@playwright/test';

export class ContactsListPage {
  readonly search: Locator;
  readonly newButton: Locator;
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.search = page.getByPlaceholder('Keyword Search');
    this.newButton = page.getByRole('link', { name: 'New' });
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/contacts');
    await this.search.waitFor();
  }

  /** Data row whose Name cell is exactly `name`. */
  row(name: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell', { name, exact: true }) });
  }

  /** Cells of a row by column: name, type, id, phone, email. */
  cells(name: string) {
    const c = this.row(name).getByRole('cell');
    return { name: c.nth(0), type: c.nth(1), id: c.nth(2), phone: c.nth(3), email: c.nth(4) };
  }

  detailLink(name: string): Locator {
    return this.row(name).locator('a[href$="/detail"]');
  }

  async find(name: string): Promise<void> {
    await this.search.fill(name);
  }
}
