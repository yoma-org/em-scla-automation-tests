// src/pages/settings/PaymentMethodCreatePage.ts — Create Payment Method (/settings/classification/payment-methods/new)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class PaymentMethodCreatePage {
  readonly heading: Locator;
  readonly form: Locator;
  readonly name: Locator;
  readonly status: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Create Payment Method', level: 1 });
    this.form = page.getByRole('main').getByRole('form', { name: 'Create Payment Method' });
    this.name = this.form.getByRole('textbox', { name: 'Name', exact: true });
    this.status = this.form.getByRole('combobox', { name: 'Status', exact: true });
    this.createButton = this.form.getByRole('button', { name: 'Create', exact: true });
  }

  /** True when the browser's required check blocks the empty Name field. */
  async nameIsMissing(): Promise<boolean> {
    return this.name.evaluate(e => (e as HTMLInputElement).validity.valueMissing);
  }

  /** [Create], wait for the POST (slow on the test env); fails with the server's answer if it is refused. */
  async create(): Promise<void> {
    const saved = this.page.waitForResponse(r =>
      r.url().includes('/api/gw/payment-methods') && r.request().method() === 'POST', { timeout: 30_000 });
    await this.createButton.click();
    const res = await saved;
    if (!res.ok()) throw new Error(`create payment method → ${res.status()} ${(await res.text()).slice(0, 300)}`);
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.paymentMethodNew);
    await this.heading.waitFor();
  }
}
