// src/pages/settings/CashBankAccountCreatePage.ts — Create Cash And Bank Account (/settings/accounts/new)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class CashBankAccountCreatePage {
  readonly heading: Locator;
  readonly form: Locator;
  /** One per field; Initial Balance has inner groups (input + currency addon) that are not fields. */
  readonly fields: Locator;
  readonly name: Locator;
  readonly currency: Locator;
  readonly initialBalance: Locator;
  readonly type: Locator;
  readonly bankName: Locator;
  readonly accountNumber: Locator;
  readonly enableOverdraft: Locator;
  readonly description: Locator;
  /** Closed Payment Method control; shows "Select Payment Method" until a method is ticked. */
  readonly paymentMethod: Locator;
  /** Popup the Payment Method control opens. */
  readonly paymentMethodPopup: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Create Cash And Bank Account', level: 1 });
    this.form = page.getByRole('main').getByRole('form', { name: 'Create Account' });
    this.fields = this.form.locator('[data-slot="field"]');
    this.name = this.form.getByRole('textbox', { name: 'Name', exact: true });
    this.currency = this.form.getByRole('combobox', { name: 'Currency' });
    this.initialBalance = this.form.getByRole('textbox', { name: 'Initial Balance' });
    this.type = this.form.getByRole('combobox', { name: 'Type', exact: true });
    this.bankName = this.form.getByRole('combobox', { name: 'Select Bank Name' });
    this.accountNumber = this.form.getByRole('textbox', { name: 'Account Number' });
    this.enableOverdraft = this.form.getByRole('combobox', { name: 'Enable Overdraft' });
    this.description = this.form.getByRole('textbox', { name: 'Description' });
    this.paymentMethod = this.fields.filter({ hasText: /^Payment Method/ }).getByRole('button').first();
    this.paymentMethodPopup = page.getByRole('dialog');
    this.createButton = this.form.getByRole('button', { name: 'Create', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.cashBankAccountNew);
    await this.heading.waitFor();
  }

  /** Picks a Type in the form; nothing is saved until [Create]. */
  async selectType(name: string): Promise<void> {
    await this.type.click();
    await this.page.getByRole('option', { name, exact: true }).click();
  }

  /** Field labels in page order, without the required "*". */
  async fieldLabels(): Promise<string[]> {
    return this.fields.evaluateAll(fields =>
      fields.map(f => (f.querySelector('label')?.textContent ?? '').replace('*', '').trim()));
  }

  /** Labels of the fields marked required ("*"). */
  async requiredLabels(): Promise<string[]> {
    return this.fields.evaluateAll(fields =>
      fields.map(f => f.querySelector('label')).filter(l => l?.textContent?.includes('*'))
        .map(l => l!.textContent!.replace('*', '').trim()));
  }

  /** Payment Method checkboxes inside the form itself (a flat checkbox list, as on build -37). */
  get inlinePaymentCheckboxes(): Locator {
    return this.fields.filter({ hasText: /^Payment Method/ }).getByRole('checkbox');
  }

  async openPaymentMethod(): Promise<void> {
    await this.paymentMethod.click();
    await this.paymentMethodPopup.waitFor();
  }

  /** Closes the popup with Escape, so no tick is changed. */
  async closePaymentMethod(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.paymentMethodPopup.waitFor({ state: 'hidden' });
  }

  /** Every method in the open popup (not "Select all") and whether it is ticked. */
  async paymentOptions(): Promise<{ name: string; checked: boolean }[]> {
    const boxes = await this.paymentMethodPopup.getByRole('checkbox').evaluateAll(els =>
      els.map(e => ({ name: (e.getAttribute('aria-label') ?? '').trim(), checked: e.getAttribute('aria-checked') === 'true' })));
    return boxes.filter(b => b.name !== 'Select all');
  }
}
