// src/pages/apartments/ApartmentsListPage.ts — Apartments list with Advance Filter (/estates)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class ApartmentsListPage {
  readonly heading: Locator;
  readonly filters: Locator;
  /** Searchable dropdown; opens a dialog with a "Suggestions" listbox. */
  readonly zoneFilter: Locator;
  readonly suggestions: Locator;
  readonly table: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Apartments', level: 1 });
    this.filters = page.getByRole('group', { name: 'Narrow the apartment register' });
    this.zoneFilter = this.filters.getByRole('combobox', { name: 'Zone' });
    this.suggestions = page.getByRole('listbox', { name: 'Suggestions' });
    this.table = page.getByRole('region', { name: 'Apartments' }).getByRole('table');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.apartments);
    await this.heading.waitFor();
  }

  /** Opens the Zone filter. Throws if New EM shows "Zones could not be loaded" (the zones request failed). */
  async openZoneFilter(): Promise<void> {
    const loadError = this.filters.getByText('Zones could not be loaded');
    await this.zoneFilter.click();
    await this.suggestions.getByRole('option').first().or(loadError).waitFor();
    if (await loadError.isVisible()) throw new Error('New EM shows "Zones could not be loaded" under the Zone filter');
  }

  /** Id of the first apartment in the register (for checks that only open a form and never submit). */
  async firstApartmentId(): Promise<string> {
    const link = this.table.locator('a[href^="/estates/"]').filter({ hasNotText: /^$/ }).first();
    await link.waitFor();
    const id = /^\/estates\/(\d+)/.exec((await link.getAttribute('href')) ?? '')?.[1];
    if (!id) throw new Error('no apartment link in the Apartments register');
    return id;
  }

  async zoneOptions(): Promise<string[]> {
    return (await this.suggestions.getByRole('option').allInnerTexts()).map(s => s.trim());
  }
}
