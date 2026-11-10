// src/pages/reports/ReportCategoryFilter.ts — "Select a Category" in the Advance Filter of the
// Transactions, Cash Received and Cash Outflow reports. It is a native <select> listing every category.
import { type Locator, type Page } from '@playwright/test';
import { Routes, type ReportName } from '@constants/Routes';

export class ReportCategoryFilter {
  readonly category: Locator;

  constructor(private readonly page: Page) {
    this.category = page.getByRole('main').getByRole('combobox', { name: 'Select a Category' });
  }

  async goto(report: ReportName): Promise<void> {
    await this.page.goto(Routes.reports[report]);
    await this.category.waitFor();
  }

  option(name: string): Locator {
    return this.category.getByRole('option', { name, exact: true });
  }
}
