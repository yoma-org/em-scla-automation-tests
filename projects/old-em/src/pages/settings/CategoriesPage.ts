// src/pages/settings/CategoriesPage.ts — Settings › Income / Expense Categories.
//
// List (/settings/categories/income | expense): "New Income Category *" / "New Expense Category *" textbox +
// [Submit] (name only), then "Manage Categories": drag & drop chips. A parent is a [data-pc-name=chip] in a
// .cursor-move block; its children are the chips with class ml-4 in the same block. Each chip has a pencil
// link /settings/categories/:id/edit.
// Edit (/settings/categories/:id/edit): Name* · Parent Category (Dropdown, filter box) · Fund (InputSwitch,
// income only; switching it on sets Status to Enable and disables Status) · Status* (Enable / Disable) ·
// Sort* · [Cancel] [Submit] → back to the list.
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption, formField } from '@components/PrimeSelect';

export type CategoryKind = 'income' | 'expense';

export class CategoriesPage {
  readonly newName: Locator;
  readonly submitButton: Locator;
  readonly manageHeading: Locator;

  constructor(private readonly page: Page, readonly kind: CategoryKind) {
    this.newName = page.getByRole('textbox', { name: kind === 'income' ? 'New Income Category *' : 'New Expense Category *' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.manageHeading = page.getByRole('heading', { name: 'Manage Categories' });
  }

  async goto(): Promise<void> {
    await this.page.goto(`/settings/categories/${this.kind}`);
    await this.manageHeading.waitFor();
    await expect(this.page.locator('.cursor-move').first()).toBeVisible({ timeout: 30_000 });
    // The chips render in batches: wait until the count stops changing.
    let last = -1;
    await expect.poll(async () => {
      const n = await this.page.locator('[data-pc-name="chip"]').count();
      const stable = n === last;
      last = n;
      return stable;
    }, { timeout: 30_000, intervals: [1_000] }).toBe(true);
  }

  chip(name: string): Locator {
    return this.page.locator('[data-pc-name="chip"]').filter({ has: this.page.getByText(name, { exact: true }) });
  }

  /** Top-level chip (a parent, or a category without parent). */
  topLevel(name: string): Locator {
    return this.page.locator('.cursor-move > [data-pc-name="chip"]').filter({ has: this.page.getByText(name, { exact: true }) });
  }

  /** The .cursor-move block whose own (top-level) chip is `parent`. */
  block(parent: string): Locator {
    return this.page.locator('.cursor-move').filter({
      has: this.page.locator(':scope > [data-pc-name="chip"]').filter({ has: this.page.getByText(parent, { exact: true }) })
    });
  }

  /** `child` shown under `parent` (indented chip in the parent's block). */
  childUnder(parent: string, child: string): Locator {
    return this.block(parent).locator('[data-pc-name="chip"].ml-4').filter({ has: this.page.getByText(child, { exact: true }) });
  }

  /** Names of the categories listed under `parent` (active and inactive). */
  async childrenOf(parent: string): Promise<string[]> {
    const chips = this.block(parent).locator('[data-pc-name="chip"].ml-4 span.font-medium');
    return (await chips.allInnerTexts()).map(t => t.trim());
  }

  /** Parent of a child category (name of the top-level chip of its block). */
  async parentOf(child: string): Promise<string> {
    const block = this.page.locator('.cursor-move').filter({ has: this.page.locator('[data-pc-name="chip"].ml-4').filter({ has: this.page.getByText(child, { exact: true }) }) });
    return (await block.locator(':scope > [data-pc-name="chip"] span.font-medium').first().innerText()).trim();
  }

  async idOf(name: string): Promise<string> {
    const href = await this.chip(name).locator('a[href$="/edit"]').getAttribute('href');
    const id = href?.match(/categories\/(\d+)\/edit/)?.[1];
    if (!id) throw new Error(`No edit link for category ${name}`);
    return id;
  }
}

export class CategoryEditPage {
  readonly name: Locator;
  readonly parent: Locator;
  readonly fund: Locator;
  readonly status: Locator;
  readonly sort: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByRole('textbox', { name: 'Name*' });
    this.parent = page.locator('#parent_id').getByRole('combobox');
    this.fund = formField(page, 'Fund').locator('[data-pc-name="inputswitch"]');
    this.status = formField(page, 'Status*').getByRole('combobox');
    this.sort = page.getByRole('textbox', { name: 'Sort*' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto(id: string): Promise<void> {
    await this.page.goto(`/settings/categories/${id}/edit`);
    await expect(this.name).not.toHaveValue('', { timeout: 30_000 });
  }

  async setFund(on: boolean): Promise<void> {
    const sw = this.fund.getByRole('switch');
    if ((await sw.isChecked()) !== on) await this.fund.click();
    await expect(sw).toBeChecked({ checked: on });
  }

  async selectParent(name: string): Promise<void> {
    await chooseOption(this.page, this.parent, name, name);
  }

  async selectStatus(status: 'Enable' | 'Disable'): Promise<void> {
    if ((await this.status.innerText()).trim() !== status) await chooseOption(this.page, this.status, status);
  }
}
