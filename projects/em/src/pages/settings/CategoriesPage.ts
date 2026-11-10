// src/pages/settings/CategoriesPage.ts — Settings › Income / Expense Categories (/settings/<kind>-categories)
import { type Locator, type Page } from '@playwright/test';
import { Routes, type CategoryKind } from '@constants/Routes';

const title: Record<CategoryKind, string> = { income: 'Income', expense: 'Expense' };

export class CategoriesPage {
  readonly heading: Locator;
  readonly newName: Locator;
  readonly submit: Locator;
  /** Message under the form ("… has been created …" or a validation error). */
  readonly flash: Locator;
  /** Manage Categories: one row per category; data-depth "0" for a parent, "1" for a child. */
  readonly list: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page, readonly kind: CategoryKind) {
    const main = page.getByRole('main');
    this.heading = main.getByRole('heading', { name: `${title[kind]} Categories`, level: 1 });
    this.newName = main.getByRole('textbox', { name: `New ${title[kind]} Category` });
    this.submit = main.getByRole('button', { name: 'Submit', exact: true });
    this.flash = main.getByTestId('category-flash');
    this.list = main.getByRole('list', { name: `${title[kind]} categories` });
    this.rows = this.list.getByTestId('category-row');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.categories(this.kind));
    await this.heading.waitFor();
  }

  /** Types a name in the create form, submits it and waits for the save (slow on the test env). */
  async create(name: string): Promise<void> {
    await this.newName.fill(name);
    const saved = this.page.waitForResponse(r =>
      r.url().includes('/api/gw/categories') && r.request().method() === 'POST', { timeout: 30_000 });
    await this.submit.click();
    const res = await saved;
    if (!res.ok()) throw new Error(`create category "${name}" → ${res.status()} ${(await res.text()).slice(0, 300)}`);
  }

  row(name: string): Locator {
    return this.rows.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  /** Children shown under a parent: the indented rows (data-depth > 0) right after it, in list order. */
  async childrenOf(parent: string): Promise<string[]> {
    const rows = await this.rows.evaluateAll(els => els.map(e => ({
      depth: Number(e.getAttribute('data-depth') ?? 0),
      // Row text is "<number><name>"; the name is the span that is not the number.
      name: [...e.querySelectorAll('span')].find(s => s.getAttribute('data-testid') !== 'category-number')?.textContent?.trim() ?? ''
    })));
    const at = rows.findIndex(r => r.name === parent);
    if (at < 0) return [];
    const children: string[] = [];
    for (const r of rows.slice(at + 1)) {
      if (r.depth <= rows[at].depth) break;
      children.push(r.name);
    }
    return children;
  }

  edit(name: string): Locator {
    return this.row(name).getByRole('link', { name: `Edit ${name}`, exact: true });
  }
}
