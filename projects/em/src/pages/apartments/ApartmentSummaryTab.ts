// src/pages/apartments/ApartmentSummaryTab.ts — Apartment › Summary tab (/estates/:id)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class ApartmentSummaryTab {
  readonly panel: Locator;
  /** "Accounts Receivable 120,173.50 Ks" (or "$ 0.00" for USD). */
  readonly accountsReceivable: Locator;
  /** Currency dropdown on the right of the Accounts Receivable row (EM-41). Shows the selected code, e.g. "MMK". */
  readonly currency: Locator;
  readonly currencyOptions: Locator;
  /** Aging cards: Current, Total Amount Overdue, 1 Day to 30 Days … > 180 Days. */
  readonly agingLabels: Locator;
  /** One amount per aging card (the percentage definitions are left out). */
  readonly agingAmounts: Locator;
  /** Owner / Tenant (current and previous) cards: names, ID, phone. Mask them in shared screenshots. */
  readonly contactDetails: Locator;

  constructor(private readonly page: Page) {
    this.contactDetails = page.getByRole('tabpanel', { name: 'Summary' }).getByRole('region')
      .filter({ has: page.getByRole('heading', { name: /(Owner|Tenant) Details$/ }) });
    this.panel = page.getByRole('tabpanel', { name: 'Summary' });
    this.accountsReceivable = this.panel.getByText(/^Accounts Receivable\b/);
    this.currency = this.panel.getByRole('combobox', { name: 'Currency' });
    this.currencyOptions = page.getByRole('listbox').getByRole('option');
    this.agingLabels = this.panel.getByRole('term');
    this.agingAmounts = this.panel.getByRole('definition').filter({ hasNotText: '%' });
  }

  /** Name / ID / Phone / Email lines of the contact cards; mask these to keep headings and dates visible. */
  get contactValues(): Locator {
    return this.contactDetails.getByRole('paragraph').filter({ hasText: /^\s*(Owner|Tenant|ID|Phone|Email):/ });
  }

  /** One contact card: "Owner Details", "Tenant Details", "Previous Owner Details", "Previous Tenant Details". */
  details(heading: 'Owner Details' | 'Tenant Details' | 'Previous Owner Details' | 'Previous Tenant Details'): Locator {
    return this.panel.getByRole('region')
      .filter({ has: this.page.getByRole('heading', { name: heading, exact: true }) });
  }

  async goto(apartmentId: number | string): Promise<void> {
    await this.page.goto(Routes.apartment(apartmentId));
    await this.accountsReceivable.waitFor();
  }

  /** The total after "Accounts Receivable", e.g. "120,173.50 Ks". */
  async totalText(): Promise<string> {
    return (await this.accountsReceivable.innerText()).replace(/^Accounts Receivable/, '').trim();
  }

  /** Opens the Currency dropdown, reads the option texts, closes it again. */
  async currencyCodes(): Promise<string[]> {
    await this.currency.click();
    await this.currencyOptions.first().waitFor();
    const codes = (await this.currencyOptions.allInnerTexts()).map(s => s.trim());
    await this.page.keyboard.press('Escape');
    await this.currencyOptions.first().waitFor({ state: 'detached' });
    return codes;
  }

  /** Picks a currency. The aging data reloads; assert on the cards, not on timing. */
  async chooseCurrency(code: string): Promise<void> {
    await this.currency.click();
    await this.page.getByRole('option', { name: code, exact: true }).click();
    await this.currencyOptions.first().waitFor({ state: 'detached' });
  }
}
