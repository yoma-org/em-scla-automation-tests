// src/pages/settings/CategoryEditPage.ts — Income / Expense Category › Edit (/settings/<kind>-categories/<id>/edit)
import { type Locator, type Page } from '@playwright/test';
import { type CategoryKind } from '@constants/Routes';

const title: Record<CategoryKind, string> = { income: 'Income', expense: 'Expense' };

export class CategoryEditPage {
  readonly heading: Locator;
  readonly form: Locator;
  readonly name: Locator;
  readonly parentCategory: Locator;
  /** Income only. */
  readonly fund: Locator;
  readonly status: Locator;
  readonly sort: Locator;
  readonly submit: Locator;

  constructor(private readonly page: Page, kind: CategoryKind) {
    const main = page.getByRole('main');
    this.heading = main.getByRole('heading', { name: `${title[kind]} Category / Edit`, level: 1 });
    this.form = main.getByRole('form');
    this.name = this.form.getByRole('textbox', { name: 'Name', exact: true });
    this.parentCategory = this.form.getByRole('combobox', { name: 'Parent Category', exact: true });
    this.fund = this.form.getByRole('switch', { name: 'Fund' });
    this.status = this.form.getByRole('combobox', { name: 'Status', exact: true });
    this.sort = this.form.getByRole('spinbutton', { name: 'Sort' });
    this.submit = this.form.getByRole('button', { name: 'Submit', exact: true });
  }

  async waitFor(): Promise<void> {
    await this.heading.waitFor();
    await this.name.waitFor();
  }

  /**
   * Parent Category is a plain select: its options open in a listbox (no search dialog).
   * With a long list (UAT) the new category is at the bottom, under the select's scroll arrow,
   * so a click does not reach it; focus + Enter picks it the way a keyboard user would.
   */
  async selectParent(name: string): Promise<void> {
    await this.parentCategory.click();
    const option = this.page.getByRole('listbox').getByRole('option', { name, exact: true });
    await option.focus();
    await this.page.keyboard.press('Enter');
    await this.page.getByRole('listbox').waitFor({ state: 'hidden' });
  }

  /** Submit, wait for the PATCH (slow on the test env) and the redirect back to the list. */
  async save(): Promise<void> {
    const saved = this.page.waitForResponse(r =>
      /\/api\/gw\/categories\/\d+$/.test(r.url()) && r.request().method() === 'PATCH', { timeout: 30_000 });
    await this.submit.click();
    const res = await saved;
    if (!res.ok()) throw new Error(`save category → ${res.status()} ${(await res.text()).slice(0, 300)}`);
    // The app lands on …-categories?saved=updated, then replaces it with the clean URL; wait for both,
    // or the next page.goto collides with that second navigation (NS_BINDING_ABORTED in Firefox).
    await this.page.waitForURL(url => /-categories$/.test(url.pathname) && !url.search.includes('saved'));
  }
}
