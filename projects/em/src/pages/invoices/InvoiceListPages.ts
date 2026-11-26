// src/pages/invoices/InvoiceListPages.ts — the three invoice / debit note listings of New EM.
//   Register (/receivables/invoices): Details · Code · Co.ref · Apartment · Category · Total · Paid · Due · Date ·
//     Created By · Approved By. Filters: Filter Type (Today … Last Month, default Last 30 Days), Building,
//     Apartment (opens a dialog "Search Apartment"), Currency.
//   Drafts (/receivables/invoices/drafts): Date · Apartment · Type (INVOICE / DEBIT NOTE) · Category · Total · Manage.
//     Filters: Building, Apartment (plain listbox), Category.
//   Report (/reports/invoices): Details · Invoice · Co.ref · Apartment · Category · Total · Paid · Due · Date ·
//     Created By · Approved By. Filters: Filter Type, Invoice Type, Building, Apartment (enabled after Building).
import { type Locator, type Page } from '@playwright/test';

export type FilterType = 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'This Month' | 'Last Month';

/** Filter Type that contains `date` (today or last month). */
export function filterTypeFor(date: Date, today = new Date()): FilterType {
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear() ? 'This Month' : 'Last Month';
}

class InvoiceList {
  readonly rows: Locator;
  readonly status: Locator;

  constructor(protected readonly page: Page, private readonly path: string, readonly heading: Locator) {
    this.rows = page.getByRole('main').getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
    this.status = page.getByRole('main').getByRole('status').filter({ hasText: /^Showing\b/ });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.heading.waitFor();
  }

  /** Rows that mention `text` (e.g. our apartment's name). Empty-state rows never match a unique name. */
  rowsWith(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  /**
   * Opens a filter dropdown and picks an option. The Apartment lists first show a single "Loading apartments…"
   * option (slow on the test env): wait for the real options, and reopen once if the option is not there.
   */
  protected async choose(combobox: Locator, option: string | RegExp): Promise<void> {
    const target = this.page.getByRole('option', { name: option }).first();
    for (let attempt = 1; ; attempt++) {
      await combobox.click();
      await this.page.getByRole('option').filter({ hasNotText: /^Loading\b/ }).first().waitFor({ timeout: 20_000 }).catch(() => {});
      try {
        await target.click({ timeout: 10_000 });
        return;
      } catch (e) {
        if (attempt === 2) throw e;
        await this.page.keyboard.press('Escape');
      }
    }
  }

  /**
   * Waits until the list has settled after a filter change. With no matching rows New EM shows an empty
   * message instead of the table, so wait for the network and the "Showing …" status / table to be stable.
   */
  async settled(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await this.page.getByRole('main').getByRole('table').or(this.page.getByRole('main').getByText(/^No\b/)).first()
      .waitFor({ timeout: 15_000 }).catch(() => {});
  }
}

export class InvoiceRegisterPage extends InvoiceList {
  constructor(page: Page) {
    super(page, '/receivables/invoices', page.getByRole('heading', { name: 'Invoices - Debit Note', level: 1 }));
  }

  /**
   * First row matching `text`, turning pages with "Next" (10 rows a page) until it shows; the newest come first.
   * Returns the row, or null when no page has one.
   */
  async findRow(text: RegExp, maxPages = 20): Promise<Locator | null> {
    const next = this.page.getByRole('navigation', { name: 'Pages' }).getByRole('button', { name: 'Next', exact: true });
    for (let i = 0; i < maxPages; i++) {
      await this.settled();
      const row = this.rows.filter({ hasText: text }).first();
      if (await row.isVisible()) return row;
      if (!(await next.isVisible()) || !(await next.isEnabled())) return null;
      const status = await this.status.innerText().catch(() => '');
      await next.click();
      await this.page.waitForFunction(([s]) => !document.querySelector('main [role="status"]')?.textContent?.includes(s), [status], { timeout: 15_000 }).catch(() => {});
    }
    return null;
  }

  /** The row's document code link ("INV-202611-00050"): opens the detail page. */
  codeLink(row: Locator): Locator {
    return row.getByRole('link', { name: /^(INV|DN)-\d{6}-\d+$/ });
  }

  async filter(type: FilterType, apartment: string): Promise<void> {
    await this.choose(this.page.getByRole('combobox', { name: 'Filter Type' }), type);
    await this.page.getByRole('combobox', { name: 'Apartment', exact: true }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('combobox', { name: 'Search Apartment' }).fill(apartment);
    await dialog.getByRole('listbox', { name: 'Suggestions' }).getByRole('option', { name: apartment }).first().click();
    await this.settled();
  }
}

export class InvoiceDraftsPage extends InvoiceList {
  constructor(page: Page) {
    super(page, '/receivables/invoices/drafts', page.getByRole('heading', { name: 'Draft: Invoices - Debit Note', level: 1 }));
  }

  /**
   * Filters by apartment. On the slow test env the pick can be lost while the filter lists are still loading
   * (the list then shows every draft): the filter is applied once the URL has ?estate=<id>; otherwise reload and retry.
   */
  async filterApartment(apartment: string): Promise<void> {
    for (let attempt = 1; ; attempt++) {
      await this.choose(this.page.getByRole('combobox', { name: 'Apartment', exact: true }), apartment);
      const applied = await this.page.waitForURL(/[?&]estate=\d+/, { timeout: 10_000 }).then(() => true, () => false);
      if (applied) break;
      if (attempt === 2) throw new Error(`Draft list: apartment filter "${apartment}" was not applied`);
      await this.goto();
    }
    await this.settled();
  }

  /** "Manage" cell link of a draft row: "Open draft Invoice #145" / "Open draft Debit note #138". */
  manageLink(row: Locator): Locator {
    return row.getByRole('link', { name: /^Open draft / });
  }
}

export class InvoiceReportPage extends InvoiceList {
  constructor(page: Page) {
    super(page, '/reports/invoices', page.getByRole('heading', { name: 'Invoices - Debit Note Reports', level: 1 }));
  }

  /** Filter Type, then Building (the apartment name starts with it), then Apartment. */
  async filter(type: FilterType, building: string, apartment: string): Promise<void> {
    await this.choose(this.page.getByRole('combobox', { name: 'Filter Type' }), type);
    await this.choose(this.page.getByRole('combobox', { name: 'Building' }), building);
    await this.choose(this.page.getByRole('combobox', { name: 'Apartment', exact: true }), apartment);
    await this.settled();
  }
}
