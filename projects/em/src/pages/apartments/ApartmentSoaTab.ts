// src/pages/apartments/ApartmentSoaTab.ts — Apartment › S.O.A tab (/estates/:id?tab=soa).
// Statement currency, All History switch, Month (yyyy-mm), PDF; table "Statement of account":
// Date · Transactions · Details · Amount · Payments · Balance, first row "Opening Balance", last "Balance Due: <amount>".
import { type Locator, type Page } from '@playwright/test';

export class ApartmentSoaTab {
  readonly panel: Locator;
  readonly allHistory: Locator;
  readonly rows: Locator;
  readonly balanceDue: Locator;
  /** With All History on and nothing posted, the table is replaced by "No statement lines yet". */
  readonly empty: Locator;

  constructor(private readonly page: Page) {
    this.panel = page.getByRole('tabpanel', { name: 'S.O.A' });
    this.empty = this.panel.getByText('No statement lines yet');
    this.allHistory = this.panel.getByRole('switch', { name: 'All History' });
    const table = this.panel.getByRole('region', { name: 'Statement of account' }).getByRole('table');
    this.rows = table.getByRole('rowgroup').nth(1).getByRole('row');
    this.balanceDue = table.getByRole('row', { name: /^Balance Due:/ });
  }

  /** Opens the tab with All History on, so documents of any month are listed. */
  async goto(apartmentId: number | string): Promise<void> {
    await this.page.goto(`/estates/${apartmentId}?tab=soa`);
    await this.balanceDue.waitFor();
    if ((await this.allHistory.getAttribute('aria-checked')) !== 'true') await this.allHistory.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.balanceDue.or(this.empty).first().waitFor();
  }

  /** "n row(s): … | Balance Due: …", or the empty-state text. */
  async summary(): Promise<string> {
    if (await this.empty.isVisible()) return 'No statement lines yet';
    const rows = (await this.rows.allInnerTexts()).map(t => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
    return `${rows.length} row(s): ${rows.join(' || ')} | ${(await this.balanceDue.innerText()).replace(/\s+/g, ' ').trim()}`;
  }
}
