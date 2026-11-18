// src/pages/invoices/InvoiceCreatePage.ts — Create Invoice (/invoices/add-invoice). Only the apartment
// picker so far: Apartment* · Income Categories* · Currency · Date · Payment Terms · item lines · [Create].
import { type Page } from '@playwright/test';
import { ApartmentPicker } from '@components/ApartmentPicker';
import { formField } from '@components/PrimeSelect';

export class InvoiceCreatePage {
  readonly apartment: ApartmentPicker;

  constructor(private readonly page: Page) {
    this.apartment = new ApartmentPicker(page, formField(page, 'Apartment*').getByRole('combobox'));
  }

  async goto(): Promise<void> {
    await this.page.goto('/invoices/add-invoice');
    await this.page.getByRole('button', { name: 'Create' }).waitFor();
  }
}
