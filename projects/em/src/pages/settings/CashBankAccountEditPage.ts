// src/pages/settings/CashBankAccountEditPage.ts — Edit Cash And Bank Account (/settings/accounts/<id>/edit)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

/** Shown after a payment method that is still ticked but has been switched off. */
const DISCONTINUED = /\s*\(no longer offered\)\s*$/;

export class CashBankAccountEditPage {
  readonly heading: Locator;
  readonly form: Locator;
  /** One role=group per field, each starting with its <label>. */
  readonly fieldGroups: Locator;
  readonly name: Locator;
  readonly currency: Locator;
  readonly type: Locator;
  readonly bankName: Locator;
  readonly accountNumber: Locator;
  readonly enableOverdraft: Locator;
  readonly description: Locator;
  /** Closed Payment Method control; its text is the selected method names. */
  readonly paymentMethod: Locator;
  /** Popup the Payment Method control opens. */
  readonly paymentMethodPopup: Locator;
  readonly updateButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Edit Cash And Bank Account', level: 1 });
    this.form = page.getByRole('main').getByRole('form');
    this.fieldGroups = this.form.getByRole('group');
    this.name = this.form.getByRole('textbox', { name: 'Name', exact: true });
    this.currency = this.form.getByRole('textbox', { name: 'Currency' });
    this.type = this.form.getByRole('combobox', { name: 'Type', exact: true });
    this.bankName = this.form.getByRole('combobox', { name: 'Select Bank Name' });
    this.accountNumber = this.form.getByRole('textbox', { name: 'Account Number' });
    this.enableOverdraft = this.form.getByRole('combobox', { name: 'Enable Overdraft' });
    this.description = this.form.getByRole('textbox', { name: 'Description' });
    this.paymentMethod = this.fieldGroups.filter({ hasText: /^Payment Method/ }).getByRole('button').first();
    this.paymentMethodPopup = page.getByRole('dialog');
    this.updateButton = this.form.getByRole('button', { name: 'Update' });
  }

  async goto(id: number | string): Promise<void> {
    await this.page.goto(Routes.cashBankAccountEdit(id));
    await this.heading.waitFor();
  }

  /** Field labels in page order, without the required "*". */
  async fieldLabels(): Promise<string[]> {
    return this.fieldGroups.evaluateAll(groups =>
      groups.map(g => (g.querySelector('label')?.textContent ?? '').replace('*', '').trim()));
  }

  /** Labels of the fields marked required ("*"). */
  async requiredLabels(): Promise<string[]> {
    return this.fieldGroups.evaluateAll(groups =>
      groups.map(g => g.querySelector('label')).filter(l => l?.textContent?.includes('*'))
        .map(l => l!.textContent!.replace('*', '').trim()));
  }

  /** Payment Method checkboxes inside the form itself (a flat checkbox list, as on build -37). */
  get inlinePaymentCheckboxes(): Locator {
    return this.fieldGroups.filter({ hasText: /^Payment Method/ }).getByRole('checkbox');
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

  /** Every method in the open popup (not "Select all"), and whether it is ticked / marked discontinued. */
  async paymentOptions(): Promise<{ name: string; checked: boolean; discontinued: boolean }[]> {
    const boxes = await this.paymentMethodPopup.getByRole('checkbox').evaluateAll(els =>
      els.map(e => ({ label: (e.getAttribute('aria-label') ?? '').trim(), checked: e.getAttribute('aria-checked') === 'true' })));
    return boxes
      .filter(b => b.label !== 'Select all')
      .map(b => ({ name: b.label.replace(DISCONTINUED, ''), checked: b.checked, discontinued: DISCONTINUED.test(b.label) }));
  }
}
