// src/pages/wallet/MoneyPages.ts — screens the wallet / deposit cases read their results from.
//
//   Make Payment  /apartments/:id/make-payment (Invoices tab › [Make Payment])
//       "Outstanding (MMK): …", "MMK Wallet Amount: …"; Invoice Currency Type · Location* · Payment Method*
//       (Cash … Wallet …) · Received In* (hidden for Wallet) · Received Amount (MMK) (disabled for Wallet, filled
//       from the ticks) · Remark. Invoice rows: # · Category · Amount · Pay (textbox + green tick icon
//       i.ri-checkbox-circle-fill = pay in full) · Balance. [Confirm] appears once something is paid.
//       Confirm (no dialog) → the apartment's S.O.A tab.
//   Invoices tab  /apartments/:id/invoice  "MMK Total Unpaid Amount: …", "MMK Wallet Current Balance: …".
//   S.O.A tab     /apartments/:id/soa  Date · Transactions · Details · Amount · Payments · Balance; a wallet
//       payment shows as "Payment Received  WP-100160 ( Payment for Inv-… )"; footer "Balance Due: …".
//   Recent Receipts /recent-receipts  RV# · Date · Account · Payer · Category · Description · Deposit · Created By.
//   Cash Outflow  /cash-outflows  form + "Recent Outflows": PV · Date · Account · Payee · Category · Description ·
//       Withdrawal · Created By · Approved By.
import { expect, type Locator, type Page } from '@playwright/test';
import { chooseOption, formField } from '@components/PrimeSelect';
import { optionalAmount } from './common';

export class MakePaymentPage {
  readonly location: Locator;
  readonly paymentMethod: Locator;
  readonly receivedAmount: Locator;
  readonly remark: Locator;
  readonly confirmButton: Locator;

  constructor(private readonly page: Page) {
    this.location = formField(page, 'Location*').getByRole('combobox');
    this.paymentMethod = formField(page, 'Payment Method*').getByRole('combobox');
    this.receivedAmount = page.getByRole('textbox', { name: 'Received Amount (MMK)' });
    this.remark = page.getByRole('textbox', { name: 'Remark' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm', exact: true });
  }

  async waitLoaded(): Promise<void> {
    await expect(this.page.getByText(/Outstanding \(MMK\)/).first()).toBeVisible({ timeout: 30_000 });
    await this.page.waitForLoadState('networkidle');
  }

  async chooseLocation(location: string): Promise<void> {
    await chooseOption(this.page, this.location, location);
  }

  async chooseMethod(method: string): Promise<void> {
    await chooseOption(this.page, this.paymentMethod, method);
  }

  invoiceRow(invoiceNo: string): Locator {
    return this.page.getByRole('row').filter({ hasText: invoiceNo });
  }

  /** The green tick beside the Pay box: pays the invoice in full. */
  async payInFull(invoiceNo: string): Promise<void> {
    await this.invoiceRow(invoiceNo).locator('i.ri-checkbox-circle-fill').click();
  }
}

export class ApartmentInvoicesTab {
  readonly totalUnpaid: Locator;
  readonly walletBalance: Locator;
  readonly makePaymentLink: Locator;

  constructor(private readonly page: Page) {
    this.totalUnpaid = page.getByRole('paragraph').filter({ hasText: /MMK Total Unpaid Amount/ });
    this.walletBalance = page.getByRole('paragraph').filter({ hasText: /MMK Wallet Current Balance/ });
    this.makePaymentLink = page.getByRole('link', { name: 'Make Payment' });
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/invoice`);
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await this.makePaymentLink.waitFor();
    await expect(this.page.getByText(/Showing \d+ to \d+ of \d+ entries/)).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  /** Unpaid total; 0 when Old EM hides the line. */
  async unpaid(): Promise<number> {
    return optionalAmount(this.totalUnpaid);
  }

  /** "Inv-202611-00029" of the first row with this category. */
  async invoiceNo(category: string): Promise<string> {
    const row = this.page.getByRole('table').getByRole('row').filter({ has: this.page.getByRole('cell', { name: category, exact: true }) });
    return (await row.first().getByRole('cell').first().innerText()).trim();
  }
}

export class ApartmentSoaTab {
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/soa`);
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await expect(this.row(/Opening Balance/)).toBeVisible({ timeout: 30_000 });
    await this.page.waitForLoadState('networkidle');
  }

  row(text: string | RegExp): Locator {
    return this.table.getByRole('row').filter({ hasText: text });
  }

  balanceDue(): Locator {
    return this.row(/Balance Due/);
  }
}

export class RecentReceiptsPage {
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/recent-receipts');
    await expect(this.page.getByRole('heading', { name: 'Recent Receipts' })).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  row(rv: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: rv, exact: true }) });
  }
}

export class RecentOutflowsPage {
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.table = page.getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cash-outflows');
    await expect(this.page.getByRole('heading', { name: 'Recent Outflows' })).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  row(pv: string): Locator {
    return this.table.getByRole('row').filter({ has: this.page.getByRole('cell', { name: pv, exact: true }) });
  }
}
