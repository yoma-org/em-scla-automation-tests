// Settings · master data (docs/test-cases/features/23-settings.md)
// Each test creates its own categories / payment method (AT-<date>-<worker>-<rand>); nothing is deleted.
// Smoke cases here guard the Settings Jira issues EM-38, EM-39, EM-40 and EM-58, so they are also
// tagged @sanity (testCase adds it for any case with a jira link) and run in EM Sanity.
import { test, expect } from '@fixtures';
import { type Locator, type Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { uniqueName } from '@helpers/names';
import { evidence } from '@helpers/evidence';
import { findCategory, getCategories } from '@api/categories';
import { type CategoriesPage } from '@pages/settings/CategoriesPage';
import { type CategoryEditPage } from '@pages/settings/CategoryEditPage';
import { type ReportCategoryFilter } from '@pages/reports/ReportCategoryFilter';
import { type ReportName } from '@constants/Routes';

/** Creates a category in the form above the list and waits until it is listed. */
async function createCategory(list: CategoriesPage, name: string) {
  await list.goto();
  await list.create(name);
  await expect(list.row(name), `"${name}" in Manage Categories`).toBeVisible({ timeout: 15_000 });
}

// Each flow saves 2-3 times and then opens up to 8 screens for the check areas.
test.describe.configure({ timeout: 180_000 });

/** Edit page of a listed category → set Parent Category → Submit. */
async function setParent(list: CategoriesPage, edit: CategoryEditPage, child: string, parent: string) {
  await list.edit(child).click();
  await edit.waitFor();
  await expect(edit.name).toHaveValue(child);
  await edit.selectParent(parent);
  await expect(edit.parentCategory).toContainText(parent);
  await edit.save();
}

/** The category is in the "Select a Category" filter of each report. */
async function listedInReports(page: Page, filter: ReportCategoryFilter, reports: ReportName[], name: string, shot: string) {
  for (const report of reports) {
    await filter.goto(report);
    await expect(filter.option(name), `${report} report › Category filter`).toHaveCount(1);
    // A native select cannot be captured open: choose the category (no search is run) so the shot shows it.
    await filter.category.selectOption({ label: name });
    await evidence(page, `${shot}_${report}-report-category-filter`);
  }
}

/** Evidence shot for a ticket; scrolls the item it is about into view first (UAT lists are long). */
async function shot(page: Page, name: string, about?: Locator) {
  await about?.scrollIntoViewIfNeeded();
  await evidence(page, name);
}

/** A check area the test leaves out on purpose, shown in the report. */
function notChecked(area: string, why: string) {
  test.info().annotations.push({ type: 'not checked', description: `${area}: ${why}` });
}

test.describe('Settings · Income category', () => {
  test('SET-007 Create Fund-type income category; verify it appears only in Funding Received form',
    testCase({ id: 'SET-007', source: 'TC_Setting_07', priority: 'P1', smoke: true, jira: ['EM-39'] }),
    async ({ page, incomeCategoriesPage: list, incomeCategoryEditPage: edit, categoryPickers, reportCategoryFilter }, testInfo) => {
      const fund = uniqueName(testInfo, 'Fund');
      notChecked('Cash Received › Unknown to Funding assign form', 'needs an unassigned unknown receipt, and creating one posts money');

      await test.step('1. Create the income category', async () => {
        await createCategory(list, fund);
      });

      await test.step('2-5. Edit: switch on Fund, Submit', async () => {
        await list.edit(fund).click();
        await edit.waitFor();
        await edit.fund.click();
        await expect(edit.fund).toBeChecked();
        await edit.save();
        expect((await findCategory(page.request, fund)).is_fund, 'saved with is_fund (API)').toBe(true);
        // Reopened right after the save, Edit can still show the old value until the page is reloaded.
        await list.edit(fund).click();
        await edit.waitFor();
        await page.reload();
        await edit.waitFor();
        await expect(edit.fund, 'Edit shows Fund on').toBeChecked();

        await shot(page, '01_NEW_fund-switched-on', edit.fund);
      });

      await test.step('Expected 2: Funding Received › Category lists it, and only Fund categories (EM-39)', async () => {
        const picker = await categoryPickers.fundingReceived();
        // Disabled until the Fund categories have loaded.
        await expect(picker.combobox).toBeEnabled({ timeout: 30_000 });
        await picker.open();
        await expect(picker.option(fund)).toBeVisible();
        const nonFund = (await getCategories(page.request, 'INCOME')).filter(c => !c.is_fund).map(c => c.name);
        const listed = await picker.optionNames();
        expect(listed.filter(n => nonFund.includes(n)), 'non-Fund categories in Funding Received').toEqual([]);
        await shot(page, '02_NEW_funding-received-lists-fund', picker.option(fund));
        await picker.close();
      });

      await test.step('Check area: Accounts Receivable › Categories filter lists it', async () => {
        const picker = await categoryPickers.accountsReceivable();
        await picker.open();
        await expect(picker.option(fund)).toBeVisible();
        await shot(page, '03_NEW_ar-category-filter', picker.option(fund));
        await picker.close();
      });

      await test.step('Check area: Reports › Transactions and Cash Received category filters list it', async () => {
        await listedInReports(page, reportCategoryFilter, ['transactions', 'cashReceived'], fund, '04_NEW_reports');
      });

      await test.step('"only": not in the Invoice form (Income Categories)', async () => {
        const picker = await categoryPickers.invoice();
        await picker.open();
        await expect(picker.option(fund)).toHaveCount(0);
        await shot(page, '05_NEW_not-in-invoice-form');
        await picker.close();
      });

      await test.step('"only": not in the Cash Outflow form', async () => {
        const picker = await categoryPickers.cashOutflow();
        await picker.open();
        await expect(picker.option(fund)).toHaveCount(0);
        await shot(page, '06_NEW_not-in-cash-outflow');
        await picker.close();
      });
    });

  test('SET-008 Add child income category under a parent category',
    testCase({ id: 'SET-008', source: 'TC_Setting_08', priority: 'P1', smoke: true, jira: ['EM-38'] }),
    async ({ page, incomeCategoriesPage: list, incomeCategoryEditPage: edit, categoryPickers, reportCategoryFilter, apartmentsListPage }, testInfo) => {
      const parent = uniqueName(testInfo, 'Parent');
      const child = uniqueName(testInfo, 'Child');
      notChecked('Cash Received › Funding Received / Unknown assign', 'only Fund categories are listed there; this child is not a Fund category');

      await test.step('1-3. Create the parent and the future child', async () => {
        await createCategory(list, parent);
        await createCategory(list, child);
      });

      await test.step('4-8. Edit the child: Parent Category = parent, Submit', async () => {
        await setParent(list, edit, child, parent);
      });

      await test.step('Expected: the child is listed under its parent', async () => {
        await list.goto();
        await expect(list.row(parent), 'parent at top level').toHaveAttribute('data-depth', '0', { timeout: 15_000 });
        await expect(list.row(child), 'child indented').toHaveAttribute('data-depth', '1');
        await expect.poll(() => list.childrenOf(parent), 'rows listed under the parent').toContain(child);

        await shot(page, '01_NEW_child-under-parent', list.row(child));
      });

      await test.step('Check area: AR Category filter shows the parent as a group with the child in it (EM-38)', async () => {
        const picker = await categoryPickers.accountsReceivable();
        await picker.open();
        await expect(picker.group(parent).getByRole('option', { name: child, exact: true })).toBeVisible();
        await shot(page, '02_NEW_ar-category-filter-group', picker.group(parent).getByRole('option', { name: child, exact: true }));
        await picker.close();
      });

      await test.step('Check area: Invoice / Debit Note create form groups the child under the parent', async () => {
        const picker = await categoryPickers.invoice();
        await picker.open();
        await expect(picker.group(parent).getByRole('option', { name: child, exact: true })).toBeVisible();
        await shot(page, '03_NEW_invoice-form-group', picker.group(parent).getByRole('option', { name: child, exact: true }));
        await picker.close();
      });

      await test.step('Check area: Apartment › Credit note create form groups the child under the parent', async () => {
        await apartmentsListPage.goto();
        const picker = await categoryPickers.creditNote(await apartmentsListPage.firstApartmentId());
        await picker.open();
        await expect(picker.group(parent).getByRole('option', { name: child, exact: true })).toBeVisible();
        await shot(page, '04_NEW_credit-note-form-group', picker.group(parent).getByRole('option', { name: child, exact: true }));
        await picker.close();
      });

      await test.step('Check area: Reports › Transactions and Cash Received category filters list the child', async () => {
        await listedInReports(page, reportCategoryFilter, ['transactions', 'cashReceived'], child, '05_NEW_reports');
      });
    });
});

test.describe('Settings · Expense category', () => {
  test('SET-013 Add parent expense category and verify it appears in Cash Outflow form only',
    testCase({ id: 'SET-013', source: 'TC_Setting_14', priority: 'P1', smoke: true, jira: ['EM-40'] }),
    async ({ page, expenseCategoriesPage: list, categoryPickers, reportCategoryFilter }, testInfo) => {
      const expense = uniqueName(testInfo, 'Payment - Testing');

      await test.step('1-3. Create the expense category', async () => {
        await createCategory(list, expense);
        await expect(list.row(expense), 'listed as a parent').toHaveAttribute('data-depth', '0');
      });

      await test.step('Expected 2: Cash Outflow › Category lists it', async () => {
        const picker = await categoryPickers.cashOutflow();
        await picker.open();
        await expect(picker.option(expense)).toBeVisible();
        await shot(page, '01_NEW_cash-outflow-lists-it', picker.option(expense));
        await picker.close();
      });

      await test.step('Check area: AR Categories filter lists it (EM-40)', async () => {
        const picker = await categoryPickers.accountsReceivable();
        await picker.open();
        await expect(picker.option(expense)).toBeVisible();
        await shot(page, '02_NEW_ar-category-filter', picker.option(expense));
        await picker.close();
      });

      await test.step('"only": not in the Funding Received form', async () => {
        const picker = await categoryPickers.fundingReceived();
        // Disabled until the Fund categories have loaded (and for good when there are none).
        await expect(picker.combobox, 'Funding Received › Category (needs at least one Fund category)').toBeEnabled({ timeout: 30_000 });
        await picker.open();
        await expect(picker.option(expense)).toHaveCount(0);
        await shot(page, '03_NEW_not-in-funding-received');
        await picker.close();
      });

      await test.step('Check area: Reports › Transactions and Cash Outflow category filters list it', async () => {
        await listedInReports(page, reportCategoryFilter, ['transactions', 'cashOutflow'], expense, '04_NEW_reports');
      });
    });

  test('SET-014 Add child expense category under a parent category',
    testCase({ id: 'SET-014', source: 'TC_Setting_15', priority: 'P1', smoke: true, jira: ['EM-38'] }),
    async ({ page, expenseCategoriesPage: list, expenseCategoryEditPage: edit, categoryPickers, reportCategoryFilter }, testInfo) => {
      const parent = uniqueName(testInfo, 'Payment - Testing');
      const child = uniqueName(testInfo, 'Expense test category');

      await test.step('1-3. Create the parent and the future child', async () => {
        await createCategory(list, parent);
        await createCategory(list, child);
      });

      await test.step('4-8. Edit the child: Parent Category = parent, Submit', async () => {
        await setParent(list, edit, child, parent);
      });

      await test.step('Expected: the child is listed under its parent', async () => {
        await list.goto();
        await expect(list.row(parent), 'parent at top level').toHaveAttribute('data-depth', '0', { timeout: 15_000 });
        await expect(list.row(child), 'child indented').toHaveAttribute('data-depth', '1');
        await expect.poll(() => list.childrenOf(parent), 'rows listed under the parent').toContain(child);

        await shot(page, '01_NEW_child-under-parent', list.row(child));
      });

      await test.step('Check area: AR Category filter shows the parent as a group with the child in it (EM-38)', async () => {
        const picker = await categoryPickers.accountsReceivable();
        await picker.open();
        await expect(picker.group(parent).getByRole('option', { name: child, exact: true })).toBeVisible();
        await shot(page, '02_NEW_ar-category-filter-group', picker.group(parent).getByRole('option', { name: child, exact: true }));
        await picker.close();
      });

      await test.step('Check area: Cash Outflow › Category lists the child', async () => {
        const picker = await categoryPickers.cashOutflow();
        await picker.open();
        await expect(picker.option(child)).toBeVisible();
        await shot(page, '03_NEW_cash-outflow-lists-child', picker.option(child));
        await picker.close();
      });

      await test.step('Check area: Reports › Transactions and Cash Outflow category filters list the child', async () => {
        await listedInReports(page, reportCategoryFilter, ['transactions', 'cashOutflow'], child, '04_NEW_reports');
      });
    });
});

test.describe('Settings · Payment method', () => {
  test('SET-021 Add payment method and verify it appears in bank account create form',
    testCase({ id: 'SET-021', source: 'TC_Setting_28', priority: 'P1', smoke: true, jira: ['EM-58'] }),
    async ({ page, accountClassificationPage: classification, paymentMethodCreatePage: form, cashBankAccountCreatePage: account,
      paymentMethodPickers: pickers, apartmentsListPage }, testInfo) => {
      const method = uniqueName(testInfo, 'Wave Money');

      await test.step('1-2. Account Classification › Manage Payment Method › New', async () => {
        await classification.goto();
        await classification.newPaymentMethod.click();
        await form.heading.waitFor();
      });

      await test.step('5. Submit with no name is blocked as a required field', async () => {
        await form.createButton.click();
        await expect(form.heading, 'stays on Create Payment Method').toBeVisible();
        // New EM uses the browser's own required check ("Please fill out this field."), not a message in the page.
        expect(await form.nameIsMissing(), 'Name reported as missing').toBe(true);

        await shot(page, '01_NEW_empty-name-blocked');
      });

      await test.step('3-4. Fill the name, Create', async () => {
        await form.name.fill(method);
        await expect(form.status).toContainText('Enable');
        await form.create();
        await classification.heading.waitFor();
      });

      await test.step('Expected 1: the new method is in the list', async () => {
        await expect(classification.paymentMethodRow(method)).toBeVisible();
        await expect(classification.paymentMethodRow(method)).toContainText('Enable');

        await shot(page, '02_NEW_payment-method-list', classification.paymentMethodRow(method));
      });

      await test.step('Expected 2: Cash & Bank Account › New › Payment Method lists it (EM-58)', async () => {
        await account.goto();
        await account.openPaymentMethod();
        const options = await account.paymentOptions();
        expect(options.map(o => o.name), 'payment methods').toContain(method);
        await shot(page, '03_NEW_cash-bank-account-form', account.paymentMethodPopup.getByRole('checkbox', { name: method }));
        await account.closePaymentMethod();
        await expect(page).toHaveURL(/\/settings\/accounts\/new/);
      });

      // The payment screens below are only opened; nothing is paid, recharged or deposited.
      await apartmentsListPage.goto();
      const apartment = await apartmentsListPage.firstApartmentId();

      await test.step('Check area: Apartment › Make Payment › Payment Method lists it', async () => {
        await expect((await pickers.makePayment(apartment)).filter({ hasText: method })).toHaveCount(1);
        await shot(page, '04_NEW_apartment-make-payment', page.getByRole('option', { name: method, exact: true }));
        await pickers.close();
      });

      await test.step('Check area: Apartment › Wallet › Recharge › Payment method lists it', async () => {
        await expect((await pickers.walletRecharge(apartment)).filter({ hasText: method })).toHaveCount(1);
        await shot(page, '05_NEW_wallet-recharge', page.getByRole('option', { name: method, exact: true }));
        await pickers.close();
      });

      await test.step('Check area: Apartment › Deposit › Add Deposit › Method lists it', async () => {
        await expect((await pickers.addDeposit(apartment)).filter({ hasText: method })).toHaveCount(1);
        await shot(page, '06_NEW_add-deposit', page.getByRole('option', { name: method, exact: true }));
        await pickers.close();
      });

      await test.step('Check area: Contact › Make Payment › Payment Method lists it', async () => {
        const contact = await pickers.firstContactId();
        await expect((await pickers.contactMakePayment(contact)).filter({ hasText: method })).toHaveCount(1);
        await shot(page, '07_NEW_contact-make-payment', page.getByRole('option', { name: method, exact: true }));
        await pickers.close();
      });
    });
});
