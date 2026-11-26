// src/pages/invoices/InvoiceDetailPage.ts — Invoice / Debit Note detail (/receivables/invoices/:id).
// Header: type ("INVOICE"), PDF · Edit · Approve · Remove, "#<id>" (draft) or the code, status ("Draft"),
// Issued to, Created By, Issue Date, Due Date, Total; then the "Invoice lines" table.
// Approve opens a dialog "Invoice #<id> — <total> · Confirm approval of this draft…" with Cancel · Confirm approve.
// Approved: "#INV-202610-00003 CoRef : Inv0000055 … Unpaid", "Approved By test1", "Journal entry #<n>".
import { type Locator, type Page } from '@playwright/test';

export class InvoiceDetailPage {
  readonly heading: Locator;
  /** Document type above the buttons: "INVOICE" / "DEBIT NOTE". */
  readonly type: Locator;
  readonly status: Locator;
  readonly issuedTo: Locator;
  readonly lines: Locator;
  readonly approveButton: Locator;
  /** Approved document code, e.g. "INV-202610-00003" / "DN-202611-00006" (shown as "#INV-…"). */
  readonly code: Locator;
  /** "PDF" button: opens a menu with "View PDF" and "Download PDF". */
  readonly pdfButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Detail', level: 1 });
    this.type = page.getByRole('main').getByRole('paragraph').filter({ hasText: /^(INVOICE|DEBIT NOTE)$/ });
    this.status = page.getByRole('main').getByRole('paragraph').filter({ hasText: /^(Draft|Approved|Unpaid|Paid|Partially paid|Pending)$/i });
    this.issuedTo = page.getByRole('main').getByRole('link', { name: /^Apartment / });
    this.lines = page.getByRole('table', { name: 'Invoice lines' }).getByRole('rowgroup').nth(1).getByRole('row');
    this.approveButton = page.getByRole('button', { name: 'Approve', exact: true });
    this.code = page.getByRole('main').getByText(/^#?(INV|DN)-\d{6}-\d+$/).first();
    this.pdfButton = page.getByRole('main').getByRole('button', { name: 'PDF', exact: true });
  }

  /** Value of a "Document details" entry (dl data-testid="paper-meta"; the colon on screen is styling). */
  field(term: 'Created By' | 'Approved By' | 'Issue Date' | 'Due Date' | 'Total'): Locator {
    return this.page.getByTestId('paper-meta').locator('div').filter({ has: this.page.getByRole('term').filter({ hasText: new RegExp(`^${term}:?$`) }) })
      .getByRole('definition');
  }

  /** Value under the "Invoice lines" table, e.g. 'Grand Total' or 'Commercial Tax' (a term followed by its definition). */
  summary(term: string): Locator {
    return this.page.getByRole('main').locator('dt').filter({ hasText: new RegExp(`^${term}\\s*:?$`) })
      .locator('xpath=following-sibling::dd[1]');
  }

  /** Item of the PDF menu (opens the menu first). */
  async pdfMenuItem(name: 'View PDF' | 'Download PDF'): Promise<Locator> {
    await this.pdfButton.click();
    const item = this.page.getByRole('menuitem', { name, exact: true });
    await item.waitFor();
    return item;
  }

  /** Approve › Confirm approve (below the dual-approval threshold the document posts at once). */
  async approve(): Promise<void> {
    await this.approveButton.click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Confirm approve' }).click();
    await this.code.waitFor({ timeout: 30_000 });
  }

  /** Detail URL: /receivables/invoices/70, or /receivables/invoices/drafts/70 when opened from the Draft list. */
  static readonly URL = /\/receivables\/invoices\/(?:drafts\/)?\d+$/;

  /** Waits until the document has loaded (its status shows); the test env can be slow. */
  async loaded(): Promise<void> {
    await this.status.waitFor({ timeout: 30_000 }).catch(() => {});
  }

  /** Invoice id from the URL (/receivables/invoices/70 or …/drafts/70 → '70'). */
  id(): string {
    return /\/receivables\/invoices\/(?:drafts\/)?(\d+)/.exec(this.page.url())?.[1] ?? '';
  }
}
