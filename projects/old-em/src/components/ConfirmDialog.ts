// src/components/ConfirmDialog.ts — Old EM "Are you sure?" confirm dialog (PrimeVue ConfirmDialog,
// role alertdialog) shown before Approve / Delete. Buttons: "Cancel" and e.g. "Yes, approve it".
import { type Locator, type Page } from '@playwright/test';

export class ConfirmDialog {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('alertdialog').filter({ hasText: 'Are you sure?' });
  }

  /** Clicks the confirm button, e.g. accept('Yes, approve it'). */
  async accept(button: string | RegExp = /^Yes/): Promise<void> {
    await this.root.getByRole('button', { name: button }).click();
  }
}
