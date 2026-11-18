// src/pages/DashboardPage.ts — Dashboard (/), the landing page after login.
import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly title: Locator;
  readonly accountsReceivable: Locator;
  readonly sidebarDashboard: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Dashboard', { exact: true }).last();
    this.accountsReceivable = page.getByRole('heading', { name: /^Accounts Receivable \(as of/ });
    this.sidebarDashboard = page.getByRole('menuitem', { name: 'dashboard.menu' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.accountsReceivable.waitFor();
  }
}
