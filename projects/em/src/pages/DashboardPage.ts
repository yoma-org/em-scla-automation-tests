// src/pages/DashboardPage.ts — Dashboard (/dashboard)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export interface ScrollArea {
  element: string;
  scrollHeight: number;
  clientHeight: number;
}

export class DashboardPage {
  readonly heading: Locator;
  /** Cards that load data: each shows status "Loading …" until it is ready. */
  readonly cards: Locator;
  readonly loading: Locator;
  /** The frame New EM scrolls (Old EM scrolls the whole page). */
  readonly content: Locator;
  readonly footer: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard', level: 1 });
    this.cards = page.getByRole('main').getByRole('region');
    this.loading = page.getByRole('main').getByRole('status', { name: /^Loading\b/ });
    this.content = page.locator('#main-content');
    this.footer = page.getByRole('contentinfo');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.dashboard);
    await this.heading.waitFor();
  }

  /** A card by its title; once loaded the AR title gets a date, e.g. "Accounts Receivable (as of 06/11/2026)". */
  card(name: 'Accounts Receivable' | 'Cash & Bank Balance' | 'Net Cash' | 'Wallet & Deposits' | 'What needs me'): Locator {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('main').getByRole('region', { name: new RegExp(`^${escaped}( \\(as of [\\d/]+\\))?$`) });
  }

  /** Every element that can scroll vertically right now: overflow-y auto/scroll and content longer than its frame. */
  async scrollAreas(): Promise<ScrollArea[]> {
    return this.page.evaluate(() => [...document.querySelectorAll('*')]
      .filter(e => {
        const o = getComputedStyle(e).overflowY;
        return (o === 'auto' || o === 'scroll') && e.scrollHeight > e.clientHeight + 1;
      })
      .map(e => ({
        element: `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ''}`,
        scrollHeight: e.scrollHeight,
        clientHeight: e.clientHeight
      })));
  }

  /** Is the window itself scrollable (a second, outer scroll bar)? */
  async documentScrolls(): Promise<boolean> {
    return this.page.evaluate(() => document.scrollingElement!.scrollHeight > window.innerHeight + 1);
  }

  /** Scrolls the content frame to the very bottom. */
  async scrollToBottom(): Promise<void> {
    await this.content.evaluate(e => e.scrollTo(0, e.scrollHeight));
  }

  /** Pixels between the footer's bottom edge and the bottom of the visible frame (white space below the footer). */
  async spaceBelowFooter(): Promise<number> {
    const frame = await this.content.boundingBox();
    const footer = await this.footer.boundingBox();
    if (!frame || !footer) throw new Error('content frame or footer not rendered');
    return Math.round(frame.y + frame.height - (footer.y + footer.height));
  }
}
