// src/fixtures/access.fixture.ts — role-permission / settings / API fixtures, on top of base.fixture.
//
// asStaff(label, perms, { categories, landing, ready }) creates a QE OLD role with exactly those permissions
// (Settings › Roles, as admin on `page`), a QE OLD staff with that role, signs the staff in in a separate
// browser context, opens `landing` and waits for `ready`. Returns { role, staff, page }. The staff's
// credentials only live in memory; the context closes after the test.
//
// Old EM issue checked on the way: the back end refuses a NEW role's permissions (403 → the app signs the user
// out) until the role is saved once more. When the landing page bounces to /login, the fixture records a soft
// failure with a screenshot, saves the role again (Edit › Save, no change) and signs in again, so the test can
// still check the permission itself.
import { test as base } from './base.fixture';
import { expect, type Locator, type Page } from '@playwright/test';
import { createRole, createStaff, resaveRole, signIn, type Role, type Staff } from '@data/access';
import { type PermissionSet } from '@pages/settings/RolesPage';
import { evidence } from '@helpers/evidence';

export interface StaffSession { role: Role; staff: Staff; page: Page }

export interface StaffOptions {
  categories?: string[];
  /** Page the staff opens first, e.g. '/utility-operations/draft/all'. */
  landing: string;
  /** Element that shows the landing page loaded for the staff. */
  ready: (page: Page) => Locator;
}

type AccessFixtures = {
  asStaff: (label: string, perms: PermissionSet, opts: StaffOptions) => Promise<StaffSession>;
};

export const test = base.extend<AccessFixtures>({
  asStaff: async ({ browser, baseURL, page }, use, testInfo) => {
    const contexts: { close(): Promise<void> }[] = [];
    await use(async (label, perms, { categories = [], landing, ready }) => {
      const role = await createRole(page, label, perms, categories);
      const staff = await createStaff(page, role);
      const permText = Object.entries(perms).map(([m, p]) => `${m}: ${p.join('/')}`).join('; ');
      testInfo.annotations.push({
        type: 'data',
        description: `role "${role.name}" (${permText}${categories.length ? `; categories ${categories.join(', ')}` : ''}), staff ${staff.email}`
      });

      /** Signs in, opens the landing page; returns the page and the back-end calls refused with 403. */
      const open = async (): Promise<{ sp: Page; refused: string[] }> => {
        const session = await signIn(browser, staff, baseURL!);
        contexts.push(session.context);
        const refused: string[] = [];
        session.page.on('response', r => { if (r.status() === 403 && /\/api\//.test(r.url())) refused.push(r.url().split('?')[0]); });
        await session.page.goto(landing);
        await expect(ready(session.page).or(session.page.getByRole('button', { name: 'Sign In' })).first()).toBeVisible({ timeout: 60_000 });
        // The page frame shows before its data: wait for the list calls (a 403 signs the user out).
        await session.page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
        await session.page.waitForTimeout(2_000);
        return { sp: session.page, refused };
      };

      let { sp, refused } = await open();
      if (refused.length || /\/login/.test(sp.url())) {
        await evidence(sp, `${testInfo.title.split(' ')[0]}_new-role-refused`);
        expect.soft(false, `Old EM: the staff with the NEW role "${role.name}" (${permText}) is refused by the back end ` +
          `(403 on ${[...new Set(refused)].join(', ') || landing}) and signed out. The role works only after it is saved ` +
          'again (Settings › Roles › Edit › Save without changes).').toBe(true);
        const [module, list] = Object.entries(perms)[0];
        await resaveRole(page, role, module, list[0]);
        ({ sp, refused } = await open());
        expect(refused, `back-end calls refused after the role was saved again`).toEqual([]);
      }
      await expect(ready(sp), `${landing} loads for the staff`).toBeVisible();
      return { role, staff, page: sp };
    });
    for (const c of contexts) await c.close();
  }
});

export { expect } from '@playwright/test';
