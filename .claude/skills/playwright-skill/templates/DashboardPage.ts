// src/pages/DashboardPage.ts — confirm the heading against the app before use
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class DashboardPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.dashboard);
  }
}
