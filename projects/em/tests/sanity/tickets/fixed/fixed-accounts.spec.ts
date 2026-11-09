// Sanity · Fixed tickets · Cash & Bank Account
// Cases: docs/sanity-test/tickets/fixed/fixed-accounts.md. Expected results are Old EM behaviour.
// Read-only: opens Manage Type › Edit, the account New/Edit pages and the Payment Method popup;
// never ticks anything or clicks [Create] / [Update].
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { evidence } from '@helpers/evidence';
import { type AccountTypeConfig } from '@pages/settings/AccountTypeEditPage';

const doc = 'docs/sanity-test/tickets/fixed/fixed-accounts.md';

/**
 * Fields the Edit page shows for an account of a type. Select Bank Name, Account Number and
 * Enable Overdraft come from the type's "What accounts of this type carry" settings.
 */
function expectedFields(c: AccountTypeConfig) {
  const fields = [
    'Name', 'Currency', 'Payment Method', 'Type',
    ...(c.bankName ? ['Select Bank Name'] : []),
    ...(c.accountNumber ? ['Account Number'] : []),
    ...(c.enableOverdraft ? ['Enable Overdraft'] : []),
    'Description'
  ];
  const required = ['Name', ...(c.bankName ? ['Select Bank Name'] : []), ...(c.accountNumber ? ['Account Number'] : [])];
  return { fields, required };
}

interface EditAccountCase {
  ticket: string;
  id: string;
  title: string;
  /** Test data from the case (UAT). */
  account: { name: string; id: number };
  type: 'BANK' | 'CASH';
  /** The type's settings as in Old EM; the case is meaningless if UAT differs. */
  typeConfig: AccountTypeConfig;
  /** Expected result 2, word for word from the doc. */
  fieldsTitle: string;
}

const cases: EditAccountCase[] = [
  {
    ticket: 'EM-72',
    id: 'SAN-EM72-001',
    title: 'Edit cash account matches Old EM fields and Payment Method control',
    account: { name: 'PARITY Cash', id: 54 },
    type: 'CASH',
    typeConfig: { bankName: false, accountNumber: false, enableOverdraft: false },
    fieldsTitle: 'Name*, Currency (locked), Payment Method, Type (locked), Description'
  },
  {
    ticket: 'EM-73',
    id: 'SAN-EM73-001',
    title: 'Edit bank account matches Old EM fields and Payment Method control',
    account: { name: '006', id: 41 },
    type: 'BANK',
    typeConfig: { bankName: true, accountNumber: true, enableOverdraft: true },
    fieldsTitle: 'Name*, Currency (locked), Payment Method, Type (locked), Select Bank Name*, Account Number*, Enable Overdraft, Description'
  }
];

const BANK_CONFIG: AccountTypeConfig = { bankName: true, accountNumber: true, enableOverdraft: true };

const carries = (c: AccountTypeConfig) => {
  const on = [c.bankName && 'Bank Name', c.accountNumber && 'Account Number', c.enableOverdraft && 'Enable Overdraft'].filter(Boolean);
  return on.length ? `carries ${on.join(', ')}` : 'carries no Bank Name, Account Number or Enable Overdraft';
};

for (const c of cases) {
  const slug = `${c.type.toLowerCase()}-account`;

  test.describe(`Sanity · ${c.ticket} Edit ${c.type === 'BANK' ? 'Bank' : 'Cash'} Account UI`, () => {
    test(`${c.id} ${c.title}`,
      sanity({ id: c.id, priority: 'P1', doc }),
      async ({ page, accountClassificationPage: classification, accountTypeEditPage: type,
        cashBankAccountsPage: list, cashBankAccountEditPage: edit }) => {
        let config: AccountTypeConfig = c.typeConfig;

        await test.step(`Precondition: Manage Type › ${c.type} ${carries(c.typeConfig)}`, async () => {
          await classification.goto();
          await classification.editAccountType(c.type).click();
          await expect(type.heading).toBeVisible();
          await expect(type.name).toHaveValue(c.type);
          config = await type.config();
          await evidence(page, `00_NEW_account-type-${c.type}`);
          expect(config, `${c.type} type settings (Settings › Account Classification › Manage Type)`).toEqual(c.typeConfig);
        });

        await test.step('1. The page Edit Cash And Bank Account opens', async () => {
          await list.goto();
          await expect(list.editLink(c.account.name)).toBeVisible();
          await list.editLink(c.account.name).scrollIntoViewIfNeeded();
          await evidence(page, `01_NEW_account-list_${c.account.name.replace(/\s+/g, '-')}`);
          await list.editLink(c.account.name).click();
          await expect(page).toHaveURL(new RegExp(`/settings/accounts/${c.account.id}/edit$`));
          await expect(edit.heading).toBeVisible();
          await expect(edit.name).toHaveValue(c.account.name);
          await expect(edit.type, `"${c.account.name}" must be a ${c.type} account`).toHaveText(c.type);
          // Payment Method stays disabled until the payment methods have loaded; wait so shots show the loaded page.
          await expect(edit.paymentMethod).toBeEnabled();
        });

        await test.step(`2. ${c.fieldsTitle}`, async () => {
          const { fields, required } = expectedFields(config);
          expect.soft(await edit.fieldLabels(), `fields, in order, for type ${c.type}`).toEqual(fields);
          expect.soft(await edit.requiredLabels(), 'required (*) fields').toEqual(required);
          await expect.soft(edit.currency, 'Currency is locked').toBeDisabled();
          await expect.soft(edit.type, 'Type is locked').toBeDisabled();
          await evidence(page, `02_NEW_edit-${slug}_fields`);
        });

        await test.step('3. Payment Method is a multiselect dropdown showing the names of the selected payment methods', async () => {
          // Build -37 showed every method as a checkbox list inside the form.
          await expect.soft(edit.inlinePaymentCheckboxes, 'no checkbox list in the form').toHaveCount(0);
          // The control is disabled until the payment methods have loaded.
          await expect(edit.paymentMethod).toBeEnabled();
          await expect(edit.paymentMethod).toHaveAttribute('aria-expanded', 'false');
          const shown = (await edit.paymentMethod.innerText()).trim();
          await edit.paymentMethod.scrollIntoViewIfNeeded();
          await evidence(page, '03_NEW_payment-method-closed');

          await edit.openPaymentMethod();
          const options = await edit.paymentOptions();
          const selected = options.filter(o => o.checked).map(o => o.name);
          expect(options.length, 'the dropdown lists the payment methods').toBeGreaterThan(0);
          expect.soft(shown, 'closed dropdown shows the selected names').toBe(selected.join(', '));
          await evidence(page, '04_NEW_payment-method-open');

          await edit.closePaymentMethod();
          await expect(edit.paymentMethod, 'nothing changed').toHaveText(shown);
        });
      });
  });
}

interface CreateAccountCase {
  ticket: string;
  id: string;
  title: string;
  type: 'BANK' | 'CASH';
  typeConfig: AccountTypeConfig;
  /** Expected result 2, word for word from the doc. */
  fieldsTitle: string;
}

const createCases: CreateAccountCase[] = [
  {
    ticket: 'EM-70',
    id: 'SAN-EM70-001',
    title: 'New account with Type CASH matches Old EM fields and has no Code',
    type: 'CASH',
    typeConfig: { bankName: false, accountNumber: false, enableOverdraft: false },
    fieldsTitle: 'Name*, Currency, Initial Balance, Payment Method, Type*, Description'
  },
  {
    ticket: 'EM-71',
    id: 'SAN-EM71-001',
    title: 'New account with Type BANK matches Old EM fields and has no Code',
    type: 'BANK',
    typeConfig: BANK_CONFIG,
    fieldsTitle: 'Name*, Currency, Initial Balance, Payment Method, Type*, Select Bank Name*, Account Number*, Enable Overdraft, Description'
  }
];

for (const c of createCases) {
  test.describe(`Sanity · ${c.ticket} Create ${c.type === 'BANK' ? 'Bank' : 'Cash'} Account UI`, () => {
    test(`${c.id} ${c.title}`,
      sanity({ id: c.id, priority: 'P1', doc }),
      async ({ page, accountClassificationPage: classification, accountTypeEditPage: type,
        cashBankAccountsPage: list, cashBankAccountCreatePage: create }) => {
        // Read-only: picks the Type in the form but never clicks [Create].
        let config: AccountTypeConfig = c.typeConfig;

        await test.step(`Precondition: Manage Type › ${c.type} ${carries(c.typeConfig)}`, async () => {
          await classification.goto();
          await classification.editAccountType(c.type).click();
          await expect(type.heading).toBeVisible();
          await expect(type.name).toHaveValue(c.type);
          config = await type.config();
          await evidence(page, `00_NEW_account-type-${c.type}`);
          expect(config, `${c.type} type settings (Settings › Account Classification › Manage Type)`).toEqual(c.typeConfig);
        });

        await test.step(`Open Cash & Bank Account › New and select Type = ${c.type}`, async () => {
          await list.goto();
          await list.newButton.click();
          await expect(page).toHaveURL(/\/settings\/accounts\/new$/);
          await expect(create.heading).toBeVisible();
          await create.selectType(c.type);
          await expect(create.type).toHaveText(c.type);
          // Bank fields follow the type; Payment Method is disabled until its list loads.
          await expect(create.bankName).toHaveCount(config.bankName ? 1 : 0);
          await expect(create.paymentMethod).toBeEnabled();
        });

        await test.step('1. No Code field', async () => {
          expect.soft(await create.fieldLabels(), 'no Code field').not.toContain('Code');
          await expect.soft(create.form.getByRole('textbox', { name: /^Code\b/ }), 'no Code input').toHaveCount(0);
        });

        await test.step(`2. ${c.fieldsTitle}`, async () => {
          const bank = [
            ...(config.bankName ? ['Select Bank Name'] : []),
            ...(config.accountNumber ? ['Account Number'] : []),
            ...(config.enableOverdraft ? ['Enable Overdraft'] : [])
          ];
          expect.soft(await create.fieldLabels(), `fields, in order, for Type ${c.type}`).toEqual(
            ['Name', 'Currency', 'Initial Balance', 'Payment Method', 'Type', ...bank, 'Description']);
          expect.soft(await create.requiredLabels(), 'required (*) fields').toEqual(
            ['Name', 'Type', ...(config.bankName ? ['Select Bank Name'] : []), ...(config.accountNumber ? ['Account Number'] : [])]);
          await evidence(page, `01_NEW_new-account-type-${c.type.toLowerCase()}_fields`);
        });

        await test.step('3. Payment Method is the multiselect dropdown "Select Payment Method" as in Old EM', async () => {
          // Build -37 showed every method as a checkbox list inside the form.
          await expect.soft(create.inlinePaymentCheckboxes, 'no checkbox list in the form').toHaveCount(0);
          await expect(create.paymentMethod).toHaveAttribute('aria-expanded', 'false');
          await expect.soft(create.paymentMethod, 'placeholder of the closed dropdown').toHaveText('Select Payment Method');
          await create.paymentMethod.scrollIntoViewIfNeeded();
          await evidence(page, '02_NEW_payment-method-closed');

          await create.openPaymentMethod();
          const options = await create.paymentOptions();
          expect(options.length, 'the dropdown lists the payment methods').toBeGreaterThan(0);
          expect.soft(options.filter(o => o.checked).map(o => o.name), 'nothing ticked on a new account').toEqual([]);
          await evidence(page, '03_NEW_payment-method-open');

          await create.closePaymentMethod();
          await expect(create.paymentMethod, 'nothing changed').toHaveText('Select Payment Method');
        });
      });
  });
}
