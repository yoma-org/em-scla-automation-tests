// src/pages/collection/ApartmentSoaPage.ts — Apartment › S.O.A tab (/apartments/:id/soa)
// Currency (MMK), "All History" switch, month (current), [PDF]. Table Date · Transactions · Details · Amount ·
// Payments · Balance. Rows: "Opening Balance", "Invoice | Inv-… - due on …", "Payment Received |
// RV-102440 ( Payment for Inv-202611-00027 ) | | 10,000.00 Ks | 0.00 Ks"; footer "Balance Due: …".
import { expect, type Locator, type Page } from '@playwright/test';
import { waitIdle } from './common';

export class ApartmentSoaPage {
  readonly rows: Locator;
  readonly balanceDue: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.getByRole('table').getByRole('row');
    this.balanceDue = page.getByRole('row').filter({ hasText: 'Balance Due:' }).getByRole('cell').last();
  }

  async goto(apartmentId: string | number): Promise<void> {
    await this.page.goto(`/apartments/${apartmentId}/soa`);
    await this.waitLoaded();
  }

  async waitLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/soa$/);
    await expect(this.rows.filter({ hasText: 'Opening Balance' })).toBeVisible({ timeout: 30_000 });
    await waitIdle(this.page);
  }

  /** "Payment Received" row(s) for an invoice code. */
  paymentRows(invoiceCode: string): Locator {
    return this.rows.filter({ hasText: 'Payment Received' }).filter({ hasText: invoiceCode });
  }

  /** Payments cell (amount paid) of a row. */
  paymentsCell(row: Locator): Locator {
    return row.getByRole('cell').nth(4);
  }
}
