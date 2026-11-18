// Role & Permission (../em/docs/test-cases/features/24-role-permission.md), smoke cases.
// Each test creates its own QE OLD role with exactly the case's permissions (Settings › Roles), a QE OLD staff
// with that role (Settings › Staff, password set on the form, changed at the first sign-in), and signs in as
// that staff in a second browser context. Admin (`page`) creates the drafts the staff acts on, on the test's
// own apartments / cash account. Roles and staff stay on UAT (Old EM has no delete for a used role).
import { test, expect } from '@fixtures/access.fixture';
import { type Locator, type Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { assignCategories, signIn } from '@data/access';
import { uniqueName } from '@helpers/names';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { createApartment, createCashAccount, createUoDraft, type Apartment } from '@data/builders';
import { createEmDraft } from '@data/billing';
import { createOutflowDraft } from '@data/collection';
import { InvoiceForm, type InvoiceInput } from '@pages/billing/InvoiceForm';
import { InvoiceDraftsPage } from '@pages/billing/InvoiceListsPages';
import { EmDraftsPage } from '@pages/billing/EmPages';
import { UoDraftsPage } from '@pages/uo/UoDraftsPage';
import { CashOutflowDraftsPage, CashOutflowPage } from '@pages/cash/CashOutflowPage';
import { loadedOptions } from '@pages/settings/options';
import { CategoriesPage } from '@pages/settings/CategoriesPage';
import { DraftDetail, bulkApprove, clickAndConfirm } from '@pages/role-permission/DraftActions';

/**
 * "Assign Categories" on a role lists parent categories only; the role then gets their children on the
 * invoice form. Assigned: Revenue - Estate Management; the invoices use its child Maintenance Services.
 */
const ASSIGNED = 'Revenue - Estate Management';
const CATEGORY = 'Maintenance Services';
/** Expense category createOutflowDraft (src/data/collection.ts) uses. */
const OUTFLOW_CATEGORY = 'Landscaping Expenses';
const INVOICE: InvoiceInput = { category: CATEGORY, line: { description: 'QE OLD RBAC item', taxType: 'No Tax', unit: 1, grossPrice: 1000 } };

/** Create Invoice as `page` (admin or staff) → the draft id. Fills "Old CoRef No.*" when Old EM asks for it. */
async function createInvoiceDraft(page: Page, apartment: Apartment): Promise<string> {
  const form = new InvoiceForm(page, 'invoice');
  await form.goto();
  await form.fill(apartment.name, INVOICE);
  const coRef = page.getByRole('textbox', { name: 'Old CoRef No.*' });
  if (await coRef.isVisible()) await coRef.fill(`QEOLD${Date.now().toString(36)}`);
  await form.createButton.click();
  await expect(toast(page, 'Invoice has been successfully created')).toBeVisible({ timeout: 30_000 });
  await expect(page).toHaveURL(/\/invoices\/\d+\/draft$/);
  return page.url().match(/\/invoices\/(\d+)\/draft/)![1];
}

/** Invoice / DN drafts of the apartment in the Draft List (as admin). */
async function invoiceDraftRows(page: Page, apartment: Apartment): Promise<Locator> {
  const drafts = new InvoiceDraftsPage(page);
  await drafts.goto();
  await drafts.filterApartment(apartment.name);
  return drafts.row(apartment.name);
}

test.describe('Role & Permission', () => {
  test.describe.configure({ timeout: 480_000 });

  test('RBAC-005 Invoice/DN create permission limited to assigned income categories',
    testCase({ id: 'RBAC-005', source: 'TC_Role&Permission_005', priority: 'P1', smoke: true, critical: true }),
    async ({ page, asStaff }) => {
      const apartment = await test.step('Setup: own apartment', () => createApartment(page));
      const staff = await test.step('Setup: role Invoice / Debit Notes Menu+View+Create, category assigned; staff signed in',
        () => asStaff('RBAC005', { 'Invoice / Debit Notes': ['Menu', 'View', 'Create'] },
          { categories: [ASSIGNED], landing: '/invoices/add-invoice', ready: p => p.getByRole('button', { name: 'Create' }) }));
      const sp = staff.page;
      let draftId = '';

      await test.step('Expected 1. Create Invoice offers only the assigned income categories', async () => {
        const settings = new CategoriesPage(page, 'income');
        await settings.goto();
        const allowed = [ASSIGNED, ...(await settings.childrenOf(ASSIGNED))];
        const form = new InvoiceForm(sp, 'invoice');
        await form.goto();
        const options = await loadedOptions(sp, form.category);
        const outside = options.filter(o => !allowed.includes(o));
        if (outside.length || !options.includes(CATEGORY)) await evidence(sp, 'RBAC-005_categories');
        expect.soft(options, `Income Categories offered to the staff include ${CATEGORY} (child of the assigned ${ASSIGNED})`).toContain(CATEGORY);
        expect.soft(outside, `Income Categories outside the assigned "${ASSIGNED}" (${allowed.join(', ')})`).toEqual([]);
      });

      await test.step('Expected 1. Staff creates an invoice with the assigned category', async () => {
        draftId = await createInvoiceDraft(sp, apartment);
        await expect(sp.getByText('DRAFT', { exact: true })).toBeVisible();
      });

      await test.step('Expected 2. Staff can delete (Remove) its own draft', async () => {
        const detail = new DraftDetail(sp);
        await sp.goto(`/invoices/${draftId}/draft`);
        await expect(sp.getByText('DRAFT', { exact: true })).toBeVisible({ timeout: 30_000 });
        if (!(await detail.removeButton.isVisible())) await evidence(sp, 'RBAC-005_no-remove');
        await expect(detail.removeButton, 'Delete / Remove button on the staff\'s own draft').toBeVisible();
        await clickAndConfirm(sp, detail.removeButton, toast(sp, /remov|delet|success/i));
        await expect(await invoiceDraftRows(page, apartment), 'Draft removed from the Draft List').toHaveCount(0);
      });
    });

  test('RBAC-006 Invoice/DN approve permission allows approve/remove of draft',
    testCase({ id: 'RBAC-006', source: 'TC_Role&Permission_006', priority: 'P1', smoke: true, critical: true }),
    async ({ page, asStaff }) => {
      const apartment = await test.step('Setup: own apartment', () => createApartment(page));
      const [toApprove, toRemove] = await test.step('Precondition: two invoice drafts (admin)', async () =>
        [await createInvoiceDraft(page, apartment), await createInvoiceDraft(page, apartment)]);
      const staff = await test.step('Setup: role Invoice / Debit Notes Menu+View+Approve, category assigned; staff signed in',
        () => asStaff('RBAC006', { 'Invoice / Debit Notes': ['Menu', 'View', 'Approve'] },
          { categories: [ASSIGNED], landing: '/invoices/draft', ready: p => p.getByRole('region', { name: 'Advance Filter' }) }));
      const sp = staff.page;
      const detail = new DraftDetail(sp);

      await test.step('Expected 1. Staff approves a draft', async () => {
        await sp.goto(`/invoices/${toApprove}/draft`);
        await expect(sp.getByText('DRAFT', { exact: true })).toBeVisible({ timeout: 30_000 });
        if (!(await detail.approveButton.isVisible())) await evidence(sp, 'RBAC-006_no-approve');
        await expect(detail.approveButton, 'Approve button for the staff').toBeVisible();
        await clickAndConfirm(sp, detail.approveButton, toast(sp, 'Invoice has been approved successfully'));
      });

      await test.step('Expected 1. Staff removes a draft', async () => {
        await sp.goto(`/invoices/${toRemove}/draft`);
        await expect(sp.getByText('DRAFT', { exact: true })).toBeVisible({ timeout: 30_000 });
        if (!(await detail.removeButton.isVisible())) await evidence(sp, 'RBAC-006_no-remove');
        await expect(detail.removeButton, 'Remove button for the staff').toBeVisible();
        await clickAndConfirm(sp, detail.removeButton, toast(sp, /remov|delet|success/i));
      });

      await test.step('Both drafts left the Draft List', async () => {
        await expect(await invoiceDraftRows(page, apartment)).toHaveCount(0);
      });
    });

  test('RBAC-010 UO approve permission allows single and bulk approve of drafts',
    testCase({ id: 'RBAC-010', source: 'TC_Role&Permission_010', priority: 'P1', smoke: true, critical: true }),
    async ({ page, asStaff }) => {
      const apartments = await test.step('Precondition: three own apartments with a UO draft each (admin)', async () => {
        const list: Apartment[] = [];
        for (let i = 0; i < 3; i++) {
          const a = await createApartment(page);
          await createUoDraft(page, a, { 'Electricity (YESC)': { previous: 0, current: 1 } });
          list.push(a);
        }
        return list;
      });
      const staff = await test.step('Setup: role UO Menu+View+Approve; staff signed in',
        () => asStaff('RBAC010', { UO: ['Menu', 'View', 'Approve'] },
          { landing: '/utility-operations/draft/all', ready: p => p.getByRole('button', { name: 'Bulk Approve' }) }));
      const sp = staff.page;
      const drafts = new UoDraftsPage(sp);
      await drafts.goto();
      for (const a of apartments) await expect(drafts.row(a.name), `UO draft of ${a.name} visible to the staff`).toHaveCount(1, { timeout: 30_000 });

      await test.step('Expected 1. Staff approves one UO draft', async () => {
        await drafts.approve(apartments[0].name);
        await expect(toast(sp, 'UO Entry Invoiced Successfully')).toBeVisible({ timeout: 30_000 });
        await drafts.goto();
        await expect(drafts.row(apartments[0].name)).toHaveCount(0);
      });

      await test.step('Expected 2. Staff bulk-approves two UO drafts', async () => {
        await bulkApprove(sp, [drafts.row(apartments[1].name), drafts.row(apartments[2].name)], toast(sp, /success/i));
        await evidence(sp, 'RBAC-010_bulk-approved');
        await drafts.goto();
        await expect.soft(drafts.row(apartments[1].name), 'bulk-approved draft left the list').toHaveCount(0);
        await expect.soft(drafts.row(apartments[2].name), 'bulk-approved draft left the list').toHaveCount(0);
      });
    });

  test('RBAC-020 EM approve permission allows single and bulk approve of drafts',
    testCase({ id: 'RBAC-020', source: 'TC_Role&Permission_020', priority: 'P1', smoke: true, critical: true }),
    async ({ page, asStaff }) => {
      const apartments = await test.step('Precondition: three own apartments with an EM draft each (admin)', async () => {
        const list: Apartment[] = [];
        for (let i = 0; i < 3; i++) {
          const a = await createApartment(page);
          await createEmDraft(page, a, 1000, 1);
          list.push(a);
        }
        return list;
      });
      const staff = await test.step('Setup: role EM Menu+View+Approve; staff signed in',
        () => asStaff('RBAC020', { EM: ['Menu', 'View', 'Approve'] },
          { landing: '/estate-managements/draft/all', ready: p => p.getByRole('button', { name: 'Bulk Approve' }) }));
      const sp = staff.page;
      const drafts = new EmDraftsPage(sp);
      await drafts.goto();
      for (const a of apartments) await expect(drafts.row(a.name).row, `EM draft of ${a.name} visible to the staff`).toHaveCount(1, { timeout: 30_000 });

      await test.step('Expected 1. Staff approves one EM draft', async () => {
        await drafts.approve(apartments[0].name);
        await expect(toast(sp, 'EM has been approved successfully')).toBeVisible({ timeout: 30_000 });
        await drafts.goto();
        await expect(drafts.row(apartments[0].name).row).toHaveCount(0);
      });

      await test.step('Expected 2. Staff bulk-approves two EM drafts', async () => {
        await bulkApprove(sp, [drafts.row(apartments[1].name).row, drafts.row(apartments[2].name).row], toast(sp, /success/i));
        await evidence(sp, 'RBAC-020_bulk-approved');
        await drafts.goto();
        await expect.soft(drafts.row(apartments[1].name).row, 'bulk-approved draft left the list').toHaveCount(0);
        await expect.soft(drafts.row(apartments[2].name).row, 'bulk-approved draft left the list').toHaveCount(0);
      });
    });

  test('RBAC-061 Cash Outflow approve permission allows approve/remove of draft',
    testCase({ id: 'RBAC-061', source: 'TC_Role&Permission_065', priority: 'P1', smoke: true, critical: true }),
    async ({ page, asStaff, browser, baseURL }) => {
      const [toApprove, toRemove] = await test.step('Precondition: own cash account (100,000) and two cash outflow drafts (admin)', async () => {
        const name = uniqueName('Cash');
        // The builder's last step (finding the row via the list search) is slow on UAT; the account only needs its name.
        const account = await createCashAccount(page, { name, initialBalance: 100_000 }).catch(async e => {
          if (!/\/cash-and-bank-accounts$/.test(page.url())) throw e;
          return { name };
        });
        return [await createOutflowDraft(page, account, 1000), await createOutflowDraft(page, account, 2000)];
      });
      const staff = await test.step('Setup: role Cash Outflows Menu+View+Approve; staff signed in',
        () => asStaff('RBAC061', { 'Cash Outflows': ['Menu', 'View', 'Approve'] },
          { landing: '/cash-outflows/draft', ready: p => p.getByRole('heading', { name: 'Draft: Cash Outflow' }) }));
      let sp = staff.page;
      let drafts = new CashOutflowDraftsPage(sp);
      let detail = new DraftDetail(sp);

      await test.step('The staff sees the drafts (Cash Outflows permission only, as the case sets it)', async () => {
        await drafts.goto();
        if (await (await drafts.find(toApprove.payee)).count()) return;
        await evidence(sp, 'RBAC-061_drafts-hidden');
        // Old EM filters cash outflow drafts by the role's "Assign Categories": assign the drafts' expense parent.
        const settings = new CategoriesPage(page, 'expense');
        await settings.goto();
        const parent = await settings.parentOf(OUTFLOW_CATEGORY);
        expect.soft(false, `Old EM: with Cash Outflows Menu+View+Approve the staff's draft list hides the "${OUTFLOW_CATEGORY}" ` +
          `drafts; they show only after the role is assigned the expense category "${parent}" (Assign Categories), a ` +
          'dependency the case does not list').toBe(true);
        await assignCategories(page, staff.role, [parent]);
        // Saving the role signs its users out: sign in again (the context closes with the test).
        sp = (await signIn(browser, staff.staff, baseURL!)).page;
        drafts = new CashOutflowDraftsPage(sp);
        detail = new DraftDetail(sp);
        await drafts.goto();
        await expect(await drafts.find(toApprove.payee), 'draft visible after assigning the category').toHaveCount(1);
      });

      await test.step('Expected 1. Staff approves a cash outflow draft', async () => {
        await drafts.goto();
        await drafts.openManage(await drafts.find(toApprove.payee));
        await clickAndConfirm(sp, detail.approveButton, toast(sp, /approved|success/i));
      });

      await test.step('Expected 1. Staff removes a cash outflow draft', async () => {
        await drafts.goto();
        await drafts.openManage(await drafts.find(toRemove.payee));
        if (!(await detail.removeButton.isVisible())) await evidence(sp, 'RBAC-061_no-remove');
        await expect(detail.removeButton, 'Remove button for the staff').toBeVisible();
        await clickAndConfirm(sp, detail.removeButton, toast(sp, /remov|delet|success/i));
      });

      await test.step('The approved outflow is in Recent Outflows', async () => {
        const outflows = new CashOutflowPage(page);
        await outflows.goto();
        await expect.soft(outflows.recentRow(toApprove.payee), `${toApprove.payee} approved (Recent Outflows)`).toHaveCount(1);
        await expect.soft(outflows.recentRow(toRemove.payee), `${toRemove.payee} removed, not approved`).toHaveCount(0);
      });
    });
});
