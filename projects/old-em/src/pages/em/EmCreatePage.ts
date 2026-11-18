// src/pages/em/EmCreatePage.ts — Add EM Entry (/estate-managements/new). Only the apartment picker so far:
// Apartment* · Monthly Fee* · No. of Month* · From* / To (auto) · Remark · [Submit].
import { type Page } from '@playwright/test';
import { ApartmentPicker } from '@components/ApartmentPicker';
import { formField } from '@components/PrimeSelect';

export class EmCreatePage {
  readonly apartment: ApartmentPicker;

  constructor(private readonly page: Page) {
    this.apartment = new ApartmentPicker(page, formField(page, 'Apartment*').getByRole('combobox'));
  }

  async goto(): Promise<void> {
    await this.page.goto('/estate-managements/new');
    await this.page.getByRole('button', { name: 'Submit' }).waitFor();
  }
}
