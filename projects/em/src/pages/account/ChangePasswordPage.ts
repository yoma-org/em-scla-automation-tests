// src/pages/account/ChangePasswordPage.ts — Account menu › Change Password (/change-password)
import { type Locator, type Page } from '@playwright/test';

export class ChangePasswordPage {
  readonly accountMenu: Locator;
  readonly changePasswordItem: Locator;
  readonly heading: Locator;
  readonly current: Locator;
  readonly newPassword: Locator;
  readonly confirm: Locator;
  readonly submit: Locator;
  /** EM-28: the removed "Log out everywhere" action and its "Log out of every device?" dialog. */
  readonly logOutEverywhere: Locator;
  readonly logOutDialog: Locator;

  constructor(private readonly page: Page) {
    this.accountMenu = page.getByRole('button', { name: /^Account menu\b/ });
    this.changePasswordItem = page.getByRole('menuitem', { name: /^Change Password\b/ });
    this.heading = page.getByRole('heading', { name: 'Change Password', level: 1 });
    this.current = page.getByRole('textbox', { name: 'Current Password' });
    this.newPassword = page.getByRole('textbox', { name: 'New Password' });
    this.confirm = page.getByRole('textbox', { name: 'Confirm Password' });
    this.submit = page.getByRole('main').getByRole('button', { name: 'Submit' });
    this.logOutEverywhere = page.getByRole('button', { name: /log out (everywhere|of every device)/i })
      .or(page.getByRole('menuitem', { name: /log out (everywhere|of every device)/i }));
    this.logOutDialog = page.getByRole('dialog').or(page.getByRole('alertdialog')).filter({ hasText: /every device/i });
  }

  /** Opens the page from the account menu, as a user would. */
  async openFromAccountMenu(): Promise<void> {
    await this.accountMenu.click();
    await this.changePasswordItem.click();
    await this.heading.waitFor();
  }
}
