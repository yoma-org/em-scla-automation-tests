// Settings: income / expense categories and payment methods (../em/docs/test-cases/features/23-settings.md).
// Each test adds its own QE OLD categories / payment method (global lists other testers use) and disables
// them again at the end, so they do not stay in everybody's dropdowns. Old EM has no delete for them.
import { test, expect } from '@fixtures/access.fixture';
import { type Locator, type Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { uniqueName } from '@helpers/names';
import { formField } from '@components/PrimeSelect';
import { CategoriesPage, CategoryEditPage, type CategoryKind } from '@pages/settings/CategoriesPage';
import { PaymentMethodsPage } from '@pages/settings/PaymentMethodsPage';
import { loadedOptions } from '@pages/settings/options';

function note(type: 'not checked' | 'case issue' | 'data', description: string) {
  test.info().annotations.push({ type, description });
}

/** Form / filter dropdowns where a category can show up. */
const CATEGORY_DROPDOWNS = {
  fundingReceived: { path: '/inter-company', label: 'Cash Received › Funding Received form' },
  invoiceCreate: { path: '/invoices/add-invoice', label: 'Invoice / Debit Note create form' },
  cashOutflow: { path: '/cash-outflows', label: 'Cash Outflow create form' },
  cashReceivedReport: { path: '/reports/cash-receipts', label: 'Reports › Cash Received category filter' },
  cashOutflowReport: { path: '/reports/cash-outflow', label: 'Reports › Cash Outflow category filter' },
  arFilter: { path: '/account-receivables', label: 'Accounts Receivable categories filter' }
} as const;
type Where = keyof typeof CATEGORY_DROPDOWNS;

async function categoryOptions(page: Page, where: Where): Promise<string[]> {
  await page.goto(CATEGORY_DROPDOWNS[where].path);
  const box = where === 'arFilter'
    ? page.getByRole('combobox', { name: 'All Categories' })
    : where === 'invoiceCreate'
      ? formField(page, 'Income Categories*').getByRole('combobox')
      : page.getByRole('combobox', { name: 'Select a Category' }).first();
  await box.waitFor({ timeout: 30_000 });
  return loadedOptions(page, box);
}

/** Expect `name` listed (or not) in a form / filter; screenshot of the open list when it differs. */
async function expectListed(page: Page, where: Where, name: string, listed: boolean): Promise<void> {
  const options = await categoryOptions(page, where);
  const found = options.includes(name);
  if (found !== listed) {
    // Re-open so the screenshot shows the list (animations disabled in evidence()).
    const box = page.getByRole('combobox', { name: where === 'arFilter' ? 'All Categories' : 'Select a Category' }).first();
    if (await box.isVisible()) await box.click();
    await evidence(page, `${test.info().title.split(' ')[0]}_${where}`);
    await page.keyboard.press('Escape');
  }
  expect.soft(found, `${CATEGORY_DROPDOWNS[where].label}: "${name}" ${listed ? 'expected in' : 'expected NOT in'} the category list`).toBe(listed);
}

/** New category through the list's "New … Category" box → its id. Checks it shows without a reload first. */
async function addCategory(page: Page, kind: CategoryKind, name: string): Promise<string> {
  const list = new CategoriesPage(page, kind);
  await list.goto();
  await list.newName.fill(name);
  await list.submitButton.click();
  await expect(list.newName, 'form cleared after Submit').toHaveValue('', { timeout: 60_000 });
  await expect.soft(list.chip(name), `"${name}" in the ${kind} category list right after Submit (no reload)`).toHaveCount(1, { timeout: 30_000 });
  await list.goto();
  await expect(list.topLevel(name), `"${name}" in the ${kind} category list as a parent (top level)`).toHaveCount(1);
  return list.idOf(name);
}

/** Cleanup: Disable our own category (Fund off first: a fund category's status is locked to Enable). */
async function disableCategory(page: Page, id: string): Promise<void> {
  const edit = new CategoryEditPage(page);
  await edit.goto(id);
  if (await edit.fund.count()) await edit.setFund(false);
  await edit.selectStatus('Disable');
  await edit.submitButton.click();
  await expect(page).toHaveURL(/\/settings\/categories\/(income|expense)$/, { timeout: 60_000 });
}

async function cleanup(page: Page, ids: string[]): Promise<void> {
  for (const id of ids) {
    await disableCategory(page, id).catch(e => note('data', `cleanup: category ${id} not disabled (${(e as Error).message.split('\n')[0]})`));
  }
}

test.describe('Settings · Categories', () => {
  test.describe.configure({ timeout: 360_000 });

  test('SET-007 Create Fund-type income category; verify it appears only in Funding Received form',
    testCase({ id: 'SET-007', source: 'TC_Setting_07', priority: 'P1', smoke: true }),
    async ({ page }) => {
      const name = uniqueName('Fund Category');
      const created: string[] = [];
      note('case issue', 'Step 2 has "Fund" on the New Income Category form; Old EM\'s New form takes only the name and has Fund / Status / Sort on the Edit form. The test creates the category, then sets Fund on Edit.');
      note('not checked', 'Unknown Received › assign to funding form: needs an unknown receipt; the Funding Received form is checked instead');
      note('not checked', 'Accounts Receivable categories filter: the case does not say whether a fund category belongs there (Old EM lists every income, expense and fund category in it)');
      try {
        const id = await test.step('1. Income Categories › New: add the category', () => addCategory(page, 'income', name));
        created.push(id);

        await test.step('2-5. Edit: Fund on → Status bound to Enable; Sort 1; Submit', async () => {
          const edit = new CategoryEditPage(page);
          await edit.goto(id);
          await edit.setFund(true);
          await expect.soft(edit.status, 'Step 3: Status bound automatically').toHaveText('Enable');
          await expect.soft(edit.status, 'Step 3: Status locked for a fund category').toBeDisabled();
          await edit.sort.fill('1');
          await edit.submitButton.click();
          await expect(page).toHaveURL(/\/settings\/categories\/income$/, { timeout: 60_000 });
        });

        await test.step('Expected 1. Funding category created', async () => {
          const list = new CategoriesPage(page, 'income');
          await list.goto();
          await expect(list.chip(name)).toHaveCount(1);
          const edit = new CategoryEditPage(page);
          await edit.goto(id);
          await expect(edit.fund.getByRole('switch'), 'Fund saved').toBeChecked();
        });

        await test.step('Expected 2. Listed in the Funding Received form only', async () => {
          await expectListed(page, 'fundingReceived', name, true);
          await expectListed(page, 'invoiceCreate', name, false);
          await expectListed(page, 'cashOutflow', name, false);
        });

        await test.step('Check area 3. Reports › Cash Received category filter', async () => {
          await expectListed(page, 'cashReceivedReport', name, true);
        });
      } finally {
        await cleanup(page, created);
      }
    });

  test('SET-008 Add child income category under a parent category',
    testCase({ id: 'SET-008', source: 'TC_Setting_08', priority: 'P1', smoke: true }),
    async ({ page }) => {
      const parent = uniqueName('Parent Category');
      const child = uniqueName('Testing Income Categories');
      const created: string[] = [];
      note('not checked', 'Apartment credit note form and Funding Received forms: smoke checks the list plus the invoice form and AR filter');
      try {
        created.push(await test.step('Precondition: own parent income category', () => addCategory(page, 'income', parent)));
        const id = await test.step('1-3. New category added to the list as a parent', () => addCategory(page, 'income', child));
        created.push(id);

        await test.step('4-8. Edit: Parent Category, Status Enabled, Sort 1, Submit', async () => {
          const edit = new CategoryEditPage(page);
          await edit.goto(id);
          await edit.selectParent(parent);
          await edit.selectStatus('Enable');
          await edit.sort.fill('1');
          await edit.submitButton.click();
          await expect(page).toHaveURL(/\/settings\/categories\/income$/, { timeout: 60_000 });
        });

        await test.step('Expected 1. The child is shown under its parent', async () => {
          const list = new CategoriesPage(page, 'income');
          await list.goto();
          await list.chip(child).waitFor({ timeout: 30_000 }).catch(() => {});
          const under = await list.childUnder(parent, child).count();
          if (under !== 1) await evidence(page, 'SET-008_category-list');
          expect(under, `"${child}" listed under "${parent}"`).toBe(1);
          await expect.soft(list.topLevel(child), 'no longer a top-level category').toHaveCount(0);
          await list.chip(child).scrollIntoViewIfNeeded();
          await evidence(page, 'SET-008_child-under-parent');
        });

        await test.step('Check areas 1-2. Invoice create form and AR categories filter list the child', async () => {
          await expectListed(page, 'invoiceCreate', child, true);
          await expectListed(page, 'arFilter', child, true);
        });
      } finally {
        await cleanup(page, created.reverse());
      }
    });

  test('SET-013 Add parent expense category and verify it appears in Cash Outflow form only',
    testCase({ id: 'SET-013', source: 'TC_Setting_14', priority: 'P1', smoke: true }),
    async ({ page }) => {
      const name = uniqueName('Payment - Testing');
      const created: string[] = [];
      note('not checked', 'Accounts Receivable categories filter: the case does not say whether an expense category belongs there (Old EM lists every income, expense and fund category in it)');
      try {
        const id = await test.step('1-3. Expense Categories › New: add the category', () => addCategory(page, 'expense', name));
        created.push(id);

        await test.step('Expected 2. Listed in the Cash Outflow form only', async () => {
          await expectListed(page, 'cashOutflow', name, true);
          await expectListed(page, 'invoiceCreate', name, false);
          await expectListed(page, 'fundingReceived', name, false);
        });

        await test.step('Check area 3. Reports › Cash Outflow category filter', async () => {
          await expectListed(page, 'cashOutflowReport', name, true);
        });
      } finally {
        await cleanup(page, created);
      }
    });

  test('SET-014 Add child expense category under a parent category',
    testCase({ id: 'SET-014', source: 'TC_Setting_15', priority: 'P1', smoke: true }),
    async ({ page }) => {
      const parent = uniqueName('Payment - Testing');
      const child = uniqueName('Expense test category');
      const created: string[] = [];
      note('not checked', 'Accounts Receivable categories filter: the case does not say whether an expense category belongs there');
      try {
        created.push(await test.step('Precondition: own parent expense category', () => addCategory(page, 'expense', parent)));
        const id = await test.step('1-3. New category added to the list as a parent', () => addCategory(page, 'expense', child));
        created.push(id);

        await test.step('4-8. Edit: Parent Category, Status Enabled, Sort 0, Submit', async () => {
          const edit = new CategoryEditPage(page);
          await edit.goto(id);
          await edit.selectParent(parent);
          await edit.selectStatus('Enable');
          await edit.sort.fill('0');
          await edit.submitButton.click();
          await expect(page).toHaveURL(/\/settings\/categories\/expense$/, { timeout: 60_000 });
        });

        await test.step('Expected 1. The child is shown under its parent', async () => {
          const list = new CategoriesPage(page, 'expense');
          await list.goto();
          await list.chip(child).waitFor({ timeout: 30_000 }).catch(() => {});
          const under = await list.childUnder(parent, child).count();
          if (under !== 1) await evidence(page, 'SET-014_category-list');
          expect(under, `"${child}" listed under "${parent}"`).toBe(1);
          await expect.soft(list.topLevel(child), 'no longer a top-level category').toHaveCount(0);
          await list.chip(child).scrollIntoViewIfNeeded();
          await evidence(page, 'SET-014_child-under-parent');
        });

        await test.step('Check area 2. Cash Outflow create form lists the child', async () => {
          await expectListed(page, 'cashOutflow', child, true);
        });
      } finally {
        await cleanup(page, created.reverse());
      }
    });
});

test.describe('Settings · Payment method', () => {
  test.describe.configure({ timeout: 240_000 });

  test('SET-021 Add payment method and verify it appears in bank account create form',
    testCase({ id: 'SET-021', source: 'TC_Setting_28', priority: 'P1', smoke: true }),
    async ({ page }) => {
      const methods = new PaymentMethodsPage(page);
      const name = uniqueName('Wave Money');
      let id: string | undefined;
      note('not checked', 'Apartment / Contact Make payment, Wallet recharge, Add deposit: smoke checks the Expected result (list + Cash & Bank account form)');
      try {
        await test.step('1-2. Account Classification › Manage Payment Method › New', async () => {
          await methods.goto();
          await methods.newLink.click();
          await expect(page).toHaveURL(/\/settings\/payment-methods\/new$/);
          await expect(methods.name).toBeVisible();
        });

        await test.step('5. Submit without a name → required-field error', async () => {
          await methods.createButton.click();
          const error = page.locator('.p-error, small.p-invalid, .p-invalid + small').filter({ hasText: /required/i });
          const shown = await error.first().isVisible({ timeout: 10_000 }).catch(() => false)
            || await expect(error.first()).toBeVisible({ timeout: 10_000 }).then(() => true, () => false);
          if (!shown) await evidence(page, 'SET-021_no-required-error');
          expect.soft(shown, 'Step 5: error message for the empty required Name').toBe(true);
          await expect(page, 'nothing created without a name').toHaveURL(/\/settings\/payment-methods\/new$/);
        });

        await test.step('3-4. Fill the payment method and Create', async () => {
          await methods.name.fill(name);
          await methods.createButton.click();
          await expect(page).toHaveURL(/\/settings\/account-classification$/, { timeout: 60_000 });
        });

        await test.step('Expected 1. The new payment method is in the list', async () => {
          await methods.goto();
          const row = await methods.find(name);
          await expect(row, `"${name}" in Manage Payment Method`).toHaveCount(1);
          await expect.soft(row.getByRole('cell').nth(1), 'Status').toHaveText('Enable');
          id = (await row.locator('a[href^="/settings/payment-methods/"]').getAttribute('href'))?.match(/payment-methods\/(\d+)\/edit/)?.[1];
          await row.scrollIntoViewIfNeeded();
          await evidence(page, 'SET-021_payment-method-list');
        });

        await test.step('Expected 2. Offered in the Cash & Bank Account create form', async () => {
          await page.goto('/cash-and-bank-accounts/new');
          const multi = page.locator('[data-pc-name="multiselect"]').first();
          await multi.waitFor({ timeout: 30_000 });
          await multi.click();
          const list = page.locator(`[id="${await multi.getByRole('combobox').getAttribute('aria-controls')}"]`);
          await expect(list).toBeVisible();
          const option = list.getByRole('option', { name, exact: true });
          if (!(await option.count())) await evidence(page, 'SET-021_bank-account-form');
          await expect(option, `"${name}" in the Payment Method select of the Cash & Bank Account form`).toHaveCount(1);
          await page.keyboard.press('Escape');
        });
      } finally {
        if (id) await methods.disable(id).catch(e => note('data', `cleanup: payment method ${name} not disabled (${(e as Error).message.split('\n')[0]})`));
      }
    });
});
