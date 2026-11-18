// src/pages/collection/UnknownAssignPage.ts — Unknown Received Allocation › Manage (/unknown-receipts/:id/edit)
// "Unknown Amount: 10,000.00 Ks". An "Apartment" switch (off: Payer* · Category* · Remarks, i.e. re-type it
// as a funding receipt). On: Select Apartment* · Invoice Currency Type · Remark · "Balance: …" · invoice table
// (# · Category · Amount · Pay · Balance; the amount is put on the oldest open invoices) · Credit To Wallet
// switch · Deposit (overflow) · [Confirm].
import { expect, type Locator, type Page } from '@playwright/test';
import { ApartmentPicker } from '@components/ApartmentPicker';
import { dropdown, waitIdle } from './common';

export class UnknownAssignPage {
  readonly unknownAmount: Locator;
  readonly apartmentSwitch: Locator;
  readonly apartment: ApartmentPicker;
  readonly remark: Locator;
  readonly invoiceRows: Locator;
  readonly confirmButton: Locator;

  constructor(private readonly page: Page) {
    this.unknownAmount = page.getByRole('heading', { name: /^Unknown Amount:/ });
    // PrimeVue InputSwitch: the role=switch input is hidden, click its root.
    this.apartmentSwitch = page.locator('[data-pc-name="inputswitch"]').first();
    this.apartment = new ApartmentPicker(page, dropdown(page, 'Select Apartment*'));
    this.remark = page.getByRole('textbox', { name: 'Remark', exact: true });
    this.invoiceRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
  }

  async waitLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/unknown-receipts\/\d+\/edit$/);
    await expect(this.unknownAmount).toBeVisible();
    await waitIdle(this.page);
  }

  async toApartment(apartment: string): Promise<void> {
    await this.apartmentSwitch.click();
    await expect(this.page.getByRole('switch').first()).toBeChecked();
    await this.apartment.choose(apartment);
    await expect(this.invoiceRows.first()).toBeVisible();
    await waitIdle(this.page);
  }

  invoiceRow(code: string): Locator {
    return this.invoiceRows.filter({ hasText: code });
  }
}
