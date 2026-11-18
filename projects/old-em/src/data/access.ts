// src/data/access.ts — roles, staff users and API keys created through Old EM Settings (role-permission and
// API tests). Everything is named uniqueName(…) and never touches existing roles / staff / keys.
//
//   createRole(page, label, perms, categories?)  Settings › Roles › New (+ Edit for "Assign Categories").
//                                                → { id, name (as Old EM shows it), tag (random part) }
//   createStaff(page, role)                      Settings › Staff › New with that role and a random password.
//                                                → { name, email, password }  (credentials stay in memory)
//   signIn(browser, staff)                       New browser context signed in as the staff (does the forced
//                                                first-login password change). → { context, page }
//   createApiKey(page, label, modules)           Settings › API Access › Create + Permission (all switches of
//                                                the given modules on). → { id, label, key }
//   deleteApiKey(page, label)                    Settings › API Access › Delete (cleanup of our own key).
import { expect, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { randomBytes } from 'node:crypto';
import { uniqueName } from '@helpers/names';
import { chooseMulti } from '@components/PrimeSelect';
import { RolesPage, type Permission, type PermissionSet } from '@pages/settings/RolesPage';
import { StaffPage } from '@pages/settings/StaffPage';
import { ApiAccessPage } from '@pages/settings/ApiAccessPage';
import { LoginPage } from '@pages/LoginPage';
import { authFile } from '@utils/Environment';

/** "QE OLD 20261112-k3x9 …" → "k3x9" (the part Old EM keeps when it rewrites a name). */
const tagOf = (name: string) => name.match(/QE OLD \d{8}-(\w{4})/)![1];

export interface Role { id: string; name: string; tag: string }

export async function createRole(page: Page, label: string, perms: PermissionSet, categories: string[] = []): Promise<Role> {
  const roles = new RolesPage(page);
  const requested = uniqueName(label);
  const tag = tagOf(requested);

  await roles.gotoNew();
  await roles.roleName.fill(requested);
  await roles.setPermissions(perms);
  await roles.saveButton.click();
  await expect(page, 'Role saved (Old EM goes back to the role list)').toHaveURL(/\/settings\/roles$/, { timeout: 60_000 });

  await roles.gotoList();
  const row = await roles.find(tag);
  const name = (await row.getByRole('cell').first().innerText()).trim();
  const href = await row.locator('a[href*="/settings/roles/"]').getAttribute('href');
  const id = href?.match(/roles\/(\d+)\/edit/)?.[1];
  if (!id) throw new Error(`No id for role ${name}`);

  const role = { id, name, tag };
  if (categories.length) await assignCategories(page, role, categories);
  return role;
}

/** Role Edit › "Assign Categories" (parent categories only; the role then gets their children). */
export async function assignCategories(page: Page, role: Role, categories: string[]): Promise<void> {
  const roles = new RolesPage(page);
  await roles.gotoEdit(role.id);
  await chooseMulti(page, roles.assignCategories, categories);
  await roles.saveButton.click();
  await expect(page, 'Role categories saved').toHaveURL(/\/settings\/roles$/, { timeout: 60_000 });
}

/**
 * Saves the role again without changing it (switches one permission off and on, then Save). Old EM only applies
 * a NEW role's permissions on the back end after the role has been saved again (see RBAC tests).
 */
export async function resaveRole(page: Page, role: Role, module: string, permission: Permission): Promise<void> {
  const roles = new RolesPage(page);
  await roles.gotoEdit(role.id);
  const sw = roles.switchCell(module, permission);
  await sw.click();
  await sw.click();
  await expect(sw.getByRole('switch')).toBeChecked();
  await roles.saveButton.click();
  await expect(page, 'Role saved again').toHaveURL(/\/settings\/roles$/, { timeout: 60_000 });
}

export interface Staff { name: string; email: string; password: string }

const secret = () => `Qe${randomBytes(6).toString('base64url')}!9a`;

export async function createStaff(page: Page, role: Role): Promise<Staff> {
  const form = new StaffPage(page);
  const name = uniqueName('Staff');
  const tag = tagOf(name);
  const staff = { name, email: `qe.old.${tag}.${Date.now().toString(36)}@example.com`, password: secret() };

  await form.gotoNew();
  await form.name.fill(staff.name);
  await form.email.fill(staff.email);
  await form.selectStaffType(role.tag);
  await form.password.fill(staff.password);
  await form.confirmPassword.fill(staff.password);
  await form.createButton.click();
  await expect(page, 'Staff created (Old EM goes back to the staff list)').toHaveURL(/\/settings\/staffs$/, { timeout: 60_000 });
  return staff;
}

/** Signs in as the staff in a new context (no admin storage state). Changes the password at first sign-in. */
export async function signIn(browser: Browser, staff: Staff, baseURL: string): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ baseURL, storageState: { cookies: [], origins: [] }, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const login = new LoginPage(page);
  await login.goto();
  await login.login(staff.email, staff.password);

  const current = page.getByRole('textbox', { name: 'Current Password' });
  // First sign-in: "Change password & continue" form; later: the app with its side menu.
  await expect(current.or(page.getByRole('menuitem').first()).first(), 'Staff signed in').toBeVisible({ timeout: 60_000 });
  if (await current.isVisible()) {
    const next = secret();
    await current.fill(staff.password);
    await page.getByRole('textbox', { name: 'New Password' }).fill(next);
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill(next);
    await page.getByRole('button', { name: 'Change Password' }).click();
    staff.password = next;
    await expect(page, 'Staff signed in after the password change').not.toHaveURL(/\/login/, { timeout: 60_000 });
  }
  return { context, page };
}

export interface ApiKey { id: string; label: string; key: string }

export async function createApiKey(page: Page, label: string, modules: string[]): Promise<ApiKey> {
  const api = new ApiAccessPage(page);
  const name = uniqueName(label);
  await api.goto();
  await api.label.fill(name);
  await api.createButton.click();
  const row = api.row(name);
  await expect(row, `API key "${name}" in the API Access list`).toHaveCount(1, { timeout: 60_000 });
  const key = (await api.keyCell(name).innerText()).trim();
  const href = await row.getByRole('link', { name: 'Permission' }).getAttribute('href');
  const id = href?.match(/api-key\/(\d+)\/permissions/)?.[1];
  if (!id) throw new Error(`No id for API key ${name}`);

  await api.gotoPermissions(id);
  for (const m of modules) await api.switchOnAll(m);
  await api.saveButton.click();
  await expect(page, 'API key permissions saved').toHaveURL(/\/settings\/api-key$/, { timeout: 60_000 });
  return { id, label: name, key };
}

export async function deleteApiKey(page: Page, label: string): Promise<void> {
  const api = new ApiAccessPage(page);
  await api.goto();
  await api.row(label).getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: /^Yes/ }).click();
  await expect(api.row(label)).toHaveCount(0, { timeout: 60_000 });
}

/**
 * Runs fn with a page signed in as admin in its own context, then closes it. For beforeAll / afterAll hooks:
 * a context kept open across tests breaks Playwright's per-test trace.
 */
export async function asAdmin<T>(browser: Browser, baseURL: string | undefined, fn: (page: Page) => Promise<T>): Promise<T> {
  const context = await browser.newContext({ baseURL, storageState: authFile('admin'), viewport: { width: 1440, height: 900 } });
  try {
    return await fn(await context.newPage());
  } finally {
    await context.close();
  }
}
