// src/pages/collection/MakePaymentPage.ts — Apartment › Invoices › [Make Payment] (/apartments/:id/make-payment)
// Heading = apartment name, "Outstanding (MMK): …". Fields: Invoice Currency Type (MMK) · Location* ·
// Pay in $ / ฿ / ₫ · Payment Method* · Received In* (hidden for Wallet) · Received Amount (MMK) (disabled for
// Wallet) · Remark. "Balance: …", invoice table # · Category · Amount · Pay (textbox + tick = pay in full) ·
// Balance, "Credit To Wallet". [Confirm] shows once something is paid.
// Typing a Received Amount fills the Pay boxes from the oldest invoice. Confirm → POST invoices/payment →
// redirects to the apartment's S.O.A tab (no toast seen).
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';
import { chooseAccount, dropdown, waitIdle } from './common';

export interface PaymentInput {
  location: string;
  method: string;
  /** Our account name (not for the Wallet method). */
  account?: string;
  /** Received Amount (MMK); leave out to type into an invoice's Pay box instead. */
  amount?: number;
}

export class MakePaymentPage {
  readonly currency: Locator;
  readonly location: Locator;
  readonly method: Locator;
  readonly receivedIn: Locator;
  readonly receivedAmount: Locator;
  readonly remark: Locator;
  readonly confirmButton: Locator;
  readonly invoiceRows: Locator;

  constructor(private readonly page: Page) {
    this.currency = dropdown(page, 'Invoice Currency Type');
    this.location = dropdown(page, 'Location*');
    this.method = dropdown(page, 'Payment Method*');
    this.receivedIn = dropdown(page, 'Received In*');
    this.receivedAmount = page.getByRole('textbox', { name: 'Received Amount (MMK)' });
    this.remark = page.getByRole('textbox', { name: 'Remark' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.invoiceRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/make-payment`);
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/make-payment$/);
    await expect(this.invoiceRows.first()).toContainText(/Inv-/, { timeout: 30_000 });
    await waitIdle(this.page);
  }

  invoiceRow(code: string): Locator {
    return this.invoiceRows.filter({ hasText: code });
  }

  payBox(code: string): Locator {
    return this.invoiceRow(code).getByRole('textbox');
  }

  async fill(input: PaymentInput): Promise<void> {
    await chooseOption(this.page, this.location, input.location);
    await chooseOption(this.page, this.method, input.method);
    if (input.account) await chooseAccount(this.page, this.receivedIn, input.account);
    if (input.amount !== undefined) {
      await this.receivedAmount.fill(String(input.amount));
      await this.receivedAmount.blur();
    }
  }
}
