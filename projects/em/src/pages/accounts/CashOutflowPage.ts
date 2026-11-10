// src/pages/accounts/CashOutflowPage.ts — Cash Outflow (/accounts/outflows): the "New cash outflow" form.
import { expect, type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class CashOutflowPage {
  readonly heading: Locator;
  readonly form: Locator;
  readonly fields: Locator;
  readonly paymentMethod: Locator;
  readonly location: Locator;

  constructor(private readonly page: Page) {
    const main = page.getByRole('main');
    this.heading = main.getByRole('heading', { name: 'Cash Outflow', level: 1 });
    this.form = main.getByRole('form', { name: 'New cash outflow' });
    this.fields = this.form.locator('[data-slot="field"]');
    this.paymentMethod = this.form.getByLabel(/Payment Method/i);
    this.location = this.form.getByLabel(/^Location/i);
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.cashOutflows);
    await this.heading.waitFor();
    await this.fields.first().waitFor();
    // Currency shows "Loading currencies…" until its list arrives; wait so shots show the loaded form.
    await expect(this.form.getByText(/^Loading/)).toHaveCount(0, { timeout: 30_000 });
  }

  /** Field labels in page order, without the required "*". */
  async fieldLabels(): Promise<string[]> {
    return this.fields.evaluateAll(fields =>
      fields.map(f => (f.querySelector('label')?.textContent ?? '').replace('*', '').trim()));
  }

  /** Labels of the fields marked required ("*"). */
  async requiredLabels(): Promise<string[]> {
    return this.fields.evaluateAll(fields =>
      fields.map(f => f.querySelector('label')).filter(l => l?.textContent?.includes('*'))
        .map(l => l!.textContent!.replace('*', '').trim()));
  }
}
