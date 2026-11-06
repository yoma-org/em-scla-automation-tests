// src/pages/settings/AccountClassificationPage.ts — Settings › Account Classification (/settings/classification)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export type ClassificationSection = 'Manage Currency' | 'Manage Payment Method' | 'Manage Type' | 'Manage Bank';

export class AccountClassificationPage {
  readonly heading: Locator;
  readonly main: Locator;
  /** Manage Type: [New], table "Account types" and an Edit link per row. */
  readonly newAccountType: Locator;
  readonly accountTypes: Locator;
  readonly accountTypeRows: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Setting / Account Classification', level: 1 });
    this.main = page.getByRole('main');
    this.newAccountType = this.main.getByRole('link', { name: 'New account type' });
    this.accountTypes = this.main.getByRole('region', { name: 'Account types' }).getByRole('table');
    this.accountTypeRows = this.accountTypes.locator('tbody tr');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.accountClassification);
    await this.heading.waitFor();
  }

  /** Section title; New EM renders it as plain text, not a heading. */
  section(name: ClassificationSection): Locator {
    return this.main.getByText(name, { exact: true });
  }

  /** "Edit BANK", "Edit CASH", … */
  editAccountType(name: string): Locator {
    return this.accountTypes.getByRole('link', { name: `Edit ${name}`, exact: true });
  }
}
