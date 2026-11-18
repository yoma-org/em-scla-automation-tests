// src/pages/settings/StaffPage.ts — Settings › Staff (/settings/staffs, /settings/staffs/new)
//
// New: Name* · Email* · Phone (+95) · Staff Type* (Dropdown of role names, with a filter box) ·
// Password* · Confirm Password* · [Create] → back to /settings/staffs.
// A new staff must change the password at the first sign-in ("Welcome, to EM! Change password & continue":
// Current Password · New Password · Confirm Password · [Change Password] → /welcome).
import { type Locator, type Page } from '@playwright/test';
import { chooseOption } from '@components/PrimeSelect';

export class StaffPage {
  readonly search: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly staffType: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.search = page.getByRole('textbox', { name: 'Keyword Search' });
    this.name = page.getByRole('textbox', { name: 'Name*' });
    this.email = page.getByRole('textbox', { name: 'Email*' });
    this.staffType = page.locator('div').filter({ has: page.getByText('Staff Type*', { exact: true }) }).getByRole('combobox').last();
    this.password = page.getByRole('textbox', { name: 'Password', exact: true });
    this.confirmPassword = page.getByRole('textbox', { name: 'Confirm Password' });
    this.createButton = page.getByRole('button', { name: 'Create' });
  }

  async gotoNew(): Promise<void> {
    await this.page.goto('/settings/staffs/new');
    await this.name.waitFor();
  }

  /** Picks the role by a unique part of its (rewritten) name. */
  async selectStaffType(part: string): Promise<void> {
    await chooseOption(this.page, this.staffType, new RegExp(part, 'i'), part);
  }
}
