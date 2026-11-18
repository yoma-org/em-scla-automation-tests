// src/pages/uo/UoCreatePage.ts — Add UO Entry (/utility-operations/new)
// Apartment* (search dropdown) · Previous / Current readings for the 4 service items · Date* (today) · Remarks.
// ALL eight readings must be filled (empty Previous = Submit does nothing, no message). Choosing the
// apartment reloads the readings (emptying them): use selectApartment(), then fill.
// Submit → toast "1 UO Entry saved." → /utility-operations. The entry is a DRAFT until approved.
import { type Locator, type Page } from '@playwright/test';
import { ApartmentPicker } from '@components/ApartmentPicker';
import { formField } from '@components/PrimeSelect';

export const UO_ITEMS = ['Electricity (YESC)', 'Electricity (Generator)', 'Treated Water', 'Raw Water'] as const;
export type UoItem = (typeof UO_ITEMS)[number];
export type UoReadings = Partial<Record<UoItem, { previous: number; current: number }>>;

export class UoCreatePage {
  readonly apartment: ApartmentPicker;
  readonly remarks: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.apartment = new ApartmentPicker(page, formField(page, 'Apartment*').getByRole('combobox'));
    this.remarks = page.getByRole('textbox', { name: 'Remarks' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/utility-operations/new');
    await this.submitButton.waitFor();
  }

  /**
   * Picks the apartment and waits until Old EM has reloaded the form for it: GET utility-operations/previous/:id
   * and then GET service-items, which re-renders the readings and empties them. Values typed before that are lost.
   */
  async selectApartment(name: string): Promise<void> {
    const previous = this.page.waitForResponse(r => /\/utility-operations\/previous\/\d+/.test(r.url()));
    const items = previous.then(() => this.page.waitForResponse(r => /\/api\/service-items(\?|$)/.test(r.url())));
    await this.apartment.choose(name);
    await items;
  }

  reading(item: UoItem, which: 'Previous' | 'Current'): Locator {
    return formField(this.page, `${item} - ${which}`).getByRole('spinbutton');
  }

  /** Fills every reading; items not given get 0 → 0. */
  async fillReadings(readings: UoReadings): Promise<void> {
    for (const item of UO_ITEMS) {
      const r = readings[item] ?? { previous: 0, current: 0 };
      await this.reading(item, 'Previous').fill(String(r.previous));
      await this.reading(item, 'Current').fill(String(r.current));
    }
  }
}
