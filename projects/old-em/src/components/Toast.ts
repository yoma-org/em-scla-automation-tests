// src/components/Toast.ts — PrimeVue toast (top right). Old EM sometimes renders a toast twice
// (two toast containers, e.g. "Logged in successfully"), so match the first one.
import { type Locator, type Page } from '@playwright/test';

export function toast(page: Page, text?: string | RegExp): Locator {
  const alerts = page.locator('.p-toast').getByRole('alert');
  return (text ? alerts.filter({ hasText: text }) : alerts).first();
}
