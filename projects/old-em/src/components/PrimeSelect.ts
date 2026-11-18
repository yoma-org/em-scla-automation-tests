// src/components/PrimeSelect.ts — PrimeVue Dropdown / MultiSelect helpers for Old EM.
//
// Old EM quirks:
// - A Dropdown's accessible name is its CURRENT VALUE (e.g. "Zone A"), not its label, so find the
//   combobox by field (formField) or by its wrapper id (#zone, #building, #prefix, #town, #type).
// - The open list is the element named in the combobox's aria-controls. Several overlays can be in
//   the DOM at once (closing animation), so never use a bare getByRole('listbox').
// - Some dropdowns have a filter box in the overlay (apartment / owner pickers): type to search.
// - A MultiSelect's combobox is a hidden input: click its [data-pc-name=multiselect] root instead.
import { expect, type Locator, type Page } from '@playwright/test';

/** The innermost element that holds the label text and the field's control (label → input layout). */
export function formField(scope: Page | Locator, label: string | RegExp): Locator {
  // `has` is resolved inside each candidate div, so it must not repeat the scope's own chain.
  const page = 'page' in scope ? scope.page() : scope;
  return scope.locator('div').filter({ has: page.getByText(label, { exact: true }) }).last();
}

async function listOf(page: Page, combobox: Locator): Promise<Locator> {
  await expect(combobox).toHaveAttribute('aria-controls', /.+/);
  const id = await combobox.getAttribute('aria-controls');
  return page.locator(`[id="${id}"]`);
}

/** Opens a Dropdown and returns its option list (call close() or choose an option afterwards). */
export async function openDropdown(page: Page, combobox: Locator, search?: string): Promise<Locator> {
  await combobox.click();
  const list = await listOf(page, combobox);
  await expect(list).toBeVisible();
  if (search !== undefined) {
    const filter = page.locator('[data-pc-section="panel"]').filter({ has: list }).locator('input').first();
    await filter.fill(search);
  }
  return list;
}

/**
 * Picks an option in a PrimeVue Dropdown. `option` is the exact option text (string) or a pattern;
 * `search` types into the overlay's filter box first (lists with hundreds of items).
 */
export async function chooseOption(page: Page, combobox: Locator, option: string | RegExp, search?: string): Promise<void> {
  const list = await openDropdown(page, combobox, search);
  const item = typeof option === 'string'
    ? list.getByRole('option', { name: option, exact: true })
    : list.getByRole('option').filter({ hasText: option });
  await item.first().click();
  await expect(list).toBeHidden();
}

/** All option texts of a Dropdown (closes it again). */
export async function dropdownOptions(page: Page, combobox: Locator): Promise<string[]> {
  const list = await openDropdown(page, combobox);
  const texts = (await list.getByRole('option').allInnerTexts()).map(t => t.trim());
  await page.keyboard.press('Escape');
  await expect(list).toBeHidden();
  return texts;
}

/** Ticks options in a PrimeVue MultiSelect (root = the [data-pc-name=multiselect] element). */
export async function chooseMulti(page: Page, root: Locator, options: string[]): Promise<void> {
  await root.click();
  const list = await listOf(page, root.getByRole('combobox'));
  await expect(list).toBeVisible();
  for (const o of options) {
    const item = list.getByRole('option', { name: o, exact: true });
    if ((await item.getAttribute('aria-selected')) !== 'true') await item.click();
  }
  await page.keyboard.press('Escape');
  await expect(list).toBeHidden();
}
