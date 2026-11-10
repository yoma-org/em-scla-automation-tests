// src/pages/settings/UoPricingPage.ts — Settings › UO Pricing (/settings/service-items)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class UoPricingPage {
  readonly heading: Locator;
  readonly main: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  /** Old EM has no [New]; build -37 still had one (EM-35). */
  readonly newButton: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { name: 'UO Pricing', level: 1 });
    this.table = this.main.getByRole('region', { name: 'UO pricing' }).getByRole('table');
    this.rows = this.table.getByRole('rowgroup').nth(1).getByRole('row');
    this.newButton = this.main.getByRole('button', { name: /^\+?\s*New\b/ }).or(this.main.getByRole('link', { name: /^\+?\s*New\b/ }));
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.uoPricing);
    await this.heading.waitFor();
    await this.rows.first().waitFor();
  }

  /** Each row: its Name and the names of the buttons in its Manage cell. */
  async items(): Promise<{ name: string; actions: string[] }[]> {
    return this.rows.evaluateAll(rows => rows.map(r => {
      const cells = r.querySelectorAll('td');
      return {
        name: (cells[0]?.textContent ?? '').trim(),
        actions: [...(cells[cells.length - 1]?.querySelectorAll('button, a') ?? [])]
          .map(b => (b.getAttribute('aria-label') ?? b.textContent ?? '').trim())
      };
    }));
  }
}
