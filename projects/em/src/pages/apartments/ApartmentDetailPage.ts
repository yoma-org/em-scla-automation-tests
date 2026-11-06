// src/pages/apartments/ApartmentDetailPage.ts — Apartment detail header and tabs (/estates/:id)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class ApartmentDetailPage {
  /** Apartment name chip above the tabs, e.g. "QA-REPRO-EM-56 Tower-R32-101". */
  readonly title: Locator;
  /** Name chip plus a "Disable" chip for a Disable apartment (an Enable one shows no status). */
  readonly header: Locator;
  readonly tabs: Locator;
  /** "Invoices (6)": the number is the unpaid + partially paid count (EM-48). */
  readonly invoicesTab: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('profile-chip');
    this.header = page.getByTestId('profile-header');
    this.tabs = page.getByRole('tablist', { name: 'Apartment sections' });
    this.invoicesTab = this.tabs.getByRole('tab', { name: /^Invoices\b/ });
  }

  async goto(apartmentId: number | string): Promise<void> {
    await this.page.goto(Routes.apartment(apartmentId));
    await this.title.waitFor();
  }

  /** The number on the Invoices tab, or null while it has none. */
  async invoicesCount(): Promise<number | null> {
    const m = /\((\d+)\)/.exec(await this.invoicesTab.innerText());
    return m ? Number(m[1]) : null;
  }
}
