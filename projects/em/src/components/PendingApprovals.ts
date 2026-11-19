// src/components/PendingApprovals.ts — top bar "Pending approvals by document type" (UO · MR · EM · Inv/DN · DI · CN · JV · PV).
// Each is a link whose name carries the count, e.g. "Inv/DN — 6 Invoices pending approval", to the draft list.
// This is New EM's on-screen "notification to the approver" (Old EM: the same counters).
import { type Locator, type Page } from '@playwright/test';

export class PendingApprovals {
  readonly nav: Locator;

  constructor(private readonly page: Page) {
    this.nav = page.getByRole('navigation', { name: 'Pending approvals by document type' });
  }

  link(kind: 'Inv/DN'): Locator {
    return this.nav.getByRole('link', { name: new RegExp(`^${kind.replace('/', '\\/')}\\b`) });
  }

  /** Reloads and reads the count (0 when the link has no number). */
  async count(kind: 'Inv/DN'): Promise<number> {
    await this.page.reload();
    const link = this.link(kind);
    await link.waitFor();
    const name = (await link.getAttribute('aria-label')) ?? (await link.innerText());
    return Number(/(\d+)/.exec(name)?.[1] ?? 0);
  }
}
