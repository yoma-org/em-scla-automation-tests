// src/pages/LoginPage.ts — confirm labels against the app before use
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
    this.toast = page.locator('.p-toast-message');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.login);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
