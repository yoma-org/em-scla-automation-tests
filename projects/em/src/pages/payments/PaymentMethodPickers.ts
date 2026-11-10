// src/pages/payments/PaymentMethodPickers.ts — the Payment Method dropdowns a new payment method must appear in
// (Apartment: Make Payment, Wallet Recharge, Add Deposit; Contact: Make Payment). Opens them, never submits.
import { expect, type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class PaymentMethodPickers {
  constructor(private readonly page: Page) {}

  /** Opens a Payment Method combobox and returns the options it lists. */
  private async open(combobox: Locator): Promise<Locator> {
    await combobox.waitFor();
    await combobox.click();
    const listbox = this.page.getByRole('listbox');
    await expect(listbox.getByRole('option').first()).toBeVisible();
    return listbox.getByRole('option');
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.getByRole('listbox').waitFor({ state: 'hidden' });
  }

  /** Apartment › Invoices › Make Payment › Payment Method. */
  async makePayment(apartmentId: string): Promise<Locator> {
    await this.page.goto(Routes.makePayment(apartmentId));
    return this.open(this.page.getByRole('form', { name: 'Make payment' }).getByRole('combobox', { name: 'Payment Method', exact: true }));
  }

  /** Apartment › Wallet › Recharge › Payment method. */
  async walletRecharge(apartmentId: string): Promise<Locator> {
    await this.page.goto(Routes.walletRecharge(apartmentId));
    const dialog = this.page.getByRole('dialog', { name: 'Recharge Wallet' });
    return this.open(dialog.getByRole('combobox', { name: 'Payment method', exact: true }));
  }

  /** Apartment › Deposit › Add Deposit › Method. */
  async addDeposit(apartmentId: string): Promise<Locator> {
    await this.page.goto(Routes.addDeposit(apartmentId));
    const dialog = this.page.getByRole('dialog', { name: 'Add Deposit' });
    return this.open(dialog.getByRole('combobox', { name: 'Method', exact: true }));
  }

  /** Contact › Unpaid Invoices › Make Payment › (first apartment) › Payment Method. */
  async contactMakePayment(contactId: string): Promise<Locator> {
    await this.page.goto(Routes.contactInvoices(contactId));
    await this.page.getByRole('main').getByRole('button', { name: 'Make Payment', exact: true }).click();
    const which = this.page.getByRole('group', { name: 'Which apartment is this payment for?' });
    await which.getByRole('link').first().click();
    await this.page.waitForURL(/\/receivables\/payments\/make-payment/);
    return this.open(this.page.getByRole('form', { name: 'Make payment' }).getByRole('combobox', { name: 'Payment Method', exact: true }));
  }

  /** Id of the first contact in the Contacts list. */
  async firstContactId(): Promise<string> {
    await this.page.goto(Routes.contacts);
    const links = this.page.getByRole('main').locator('a[href^="/estates/contacts/"]');
    await links.first().waitFor();
    // Skip links such as /estates/contacts/new: take the first one that ends in an id.
    const hrefs = await links.evaluateAll(as => as.map(a => a.getAttribute('href') ?? ''));
    const id = hrefs.map(h => /^\/estates\/contacts\/(\d+)$/.exec(h)?.[1]).find(Boolean);
    if (!id) throw new Error('no contact link in the Contacts list');
    return id;
  }
}
