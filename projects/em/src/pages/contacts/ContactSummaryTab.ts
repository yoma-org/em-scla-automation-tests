// src/pages/contacts/ContactSummaryTab.ts — Contact › Summary tab (/estates/contacts/:id)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class ContactSummaryTab {
  readonly panel: Locator;
  /** "Accounts Receivable 120,173.50 Ks" on the left of the row. */
  readonly accountsReceivable: Locator;
  /** Currency dropdown on the right of the same row (EM-43). */
  readonly currency: Locator;
  /** Full Name / ID / Phone lines and apartment links: personal data, mask it in shared screenshots. */
  readonly personalData: Locator;

  constructor(private readonly page: Page) {
    this.panel = page.getByRole('tabpanel', { name: 'Summary' });
    this.accountsReceivable = this.panel.getByText(/^Accounts Receivable\b/);
    this.currency = this.panel.getByRole('combobox', { name: 'Currency' });
    this.personalData = page.getByRole('main').getByRole('listitem')
      .filter({ hasText: /^(Full Name|ID|Phone \(primary\)|Phone \(secondary\)|Email|Secondary Email):/ })
      .or(page.getByRole('main').locator('[data-testid="profile-chip"]'));
  }

  async goto(contactId: number | string): Promise<void> {
    await this.page.goto(Routes.contact(contactId));
    await this.accountsReceivable.waitFor();
  }
}
