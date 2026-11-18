// src/pages/settings/RolesPage.ts — Settings › Roles (/settings/roles, /settings/roles/new, /settings/roles/:id/edit)
//
// Form: Role Name* · permission table (one row per module; columns Menu · View · Edit · Create · Approve ·
// Delete; a cell without a switch means the module has no such permission) · [Save].
// "Assign Categories" (MultiSelect of income + expense categories) is on the EDIT page only.
// Old EM quirks:
// - Old EM rewrites the role name: "QE OLD 20261112-k3x9 RBAC" is saved as "Qe Old 20261112 K3x9 Rbac"
//   (title case, dashes → spaces). Find a role by its random part.
// - Save takes 5-30 s on UAT; the page goes back to /settings/roles when done.
// - The switches are PrimeVue InputSwitch: the role=switch input is hidden, click the [data-pc-name=inputswitch] root.
import { expect, type Locator, type Page } from '@playwright/test';

export const PERMISSION_COLUMNS = ['Menu', 'View', 'Edit', 'Create', 'Approve', 'Delete'] as const;
export type Permission = (typeof PERMISSION_COLUMNS)[number];
/** Module row as the table shows it ("UO", "Invoice / Debit Notes", "Cash Outflows", …) → permissions to switch on. */
export type PermissionSet = Record<string, Permission[]>;

export class RolesPage {
  readonly search: Locator;
  readonly table: Locator;
  readonly roleName: Locator;
  readonly saveButton: Locator;
  readonly assignCategories: Locator;

  constructor(private readonly page: Page) {
    this.search = page.getByRole('textbox', { name: 'Keyword Search' });
    this.table = page.getByRole('table');
    this.roleName = page.locator('input#name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.assignCategories = page.locator('div').filter({ has: page.getByText('Assign Categories', { exact: true }) })
      .locator('[data-pc-name="multiselect"]').last();
  }

  async gotoList(): Promise<void> {
    await this.page.goto('/settings/roles');
    await this.search.waitFor();
  }

  async gotoNew(): Promise<void> {
    await this.page.goto('/settings/roles/new');
    await this.switchCell('UO', 'Menu').waitFor();
  }

  async gotoEdit(id: string): Promise<void> {
    await this.page.goto(`/settings/roles/${id}/edit`);
    await expect(this.roleName).not.toHaveValue('', { timeout: 30_000 });
  }

  permissionRow(module: string): Locator {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name: module, exact: true }) });
  }

  switchCell(module: string, permission: Permission): Locator {
    return this.permissionRow(module).getByRole('cell').nth(1 + PERMISSION_COLUMNS.indexOf(permission))
      .locator('[data-pc-name="inputswitch"]');
  }

  async setPermissions(perms: PermissionSet): Promise<void> {
    for (const [module, list] of Object.entries(perms)) {
      for (const p of list) {
        const sw = this.switchCell(module, p);
        if (!(await sw.getByRole('switch').isChecked())) await sw.click();
        await expect(sw.getByRole('switch'), `${module} › ${p}`).toBeChecked();
      }
    }
  }

  /** Row in the list, found by a unique part of the name (Old EM rewrites names, see above). */
  async find(part: string): Promise<Locator> {
    const row = this.table.getByRole('row').filter({ hasText: new RegExp(part, 'i') });
    // The list's first load can land after the search and undo it: type the search again until it filters.
    await expect(async () => {
      await this.search.fill('');
      await this.search.fill(part);
      await expect(row).toHaveCount(1, { timeout: 8_000 });
    }).toPass({ timeout: 60_000 });
    return row;
  }
}
