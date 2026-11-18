// src/pages/billing/InvoiceDocPage.ts — an invoice / debit note document.
// Draft: /invoices/:id/draft — "INVOICE" / "DEBIT NOTE", [Approve] [Remove], "DRAFT", "Issued to: … Created By: …
//   Issue Date: dd/mm/yyyy Due Date: dd/mm/yyyy", "Total: 2,781.00 Ks", lines, footer.
// Approved: /invoices/:id — "#Inv-202611-00028 CoRef : Inv0125277 Unpaid" (DN: "#DN-… CoRef : DN… Unpaid"),
//   "Approved By: …", footer "Gross Total … Discount (…) Commerical Tax … Grand Total …".
// Approve has NO confirm dialog for invoices / debit notes: toast "Invoice has been approved successfully" /
// "Debit Note has been approved successfully", then the page becomes /invoices/:id.
import { type Locator, type Page } from '@playwright/test';

export class InvoiceDocPage {
  readonly approveButton: Locator;
  readonly draftBadge: Locator;
  /** "#Inv-YYYYMM-NNNNN CoRef : Inv0000000 Unpaid". */
  readonly refLine: Locator;
  readonly total: Locator;
  readonly footer: Locator;
  readonly lines: Locator;

  constructor(private readonly page: Page) {
    this.approveButton = page.getByRole('button', { name: 'Approve' });
    this.draftBadge = page.getByText('DRAFT', { exact: true });
    this.refLine = page.getByText(/^#(Inv|DN)-\d{6}-\d+\s*CoRef/);
    this.total = page.getByRole('heading', { name: /^Total:/ });
    this.footer = page.locator('div').filter({ hasText: /Gross Total[\s\S]*Grand Total/ }).last();
    this.lines = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row');
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.total.waitFor();
  }

  /** Code ("Inv-202611-00028") and co-ref ("Inv0125277") from the approved header. */
  async ref(): Promise<{ code: string; coRef: string }> {
    const text = await this.refLine.innerText();
    const m = text.match(/#((?:Inv|DN)-\d{6}-\d+)\s*CoRef\s*:\s*(\S+)/);
    if (!m) throw new Error(`No ref number in "${text}"`);
    return { code: m[1], coRef: m[2] };
  }
}
