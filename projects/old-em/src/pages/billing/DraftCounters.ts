// src/pages/billing/DraftCounters.ts — the top bar's pending-approval counters (UO 2 · MR 2 · EM 4 · Inv/DN 34 …).
// Each is two links to the draft list: the label and the count. Old EM has no other approver notification on
// screen (the bell-like icon is "Recent Note"), so a case's "Notification will be sent to approver" is checked
// as "the counter shows pending drafts and its link lists the new draft". Other testers create and approve drafts
// on the same UAT all the time, so a before/after delta of the counter is only recorded, not asserted.
import { type Page } from '@playwright/test';

const HREF = { uo: '/utility-operations/draft/all', em: '/estate-managements/draft/all', invoice: '/invoices/draft' } as const;

export class DraftCounters {
  constructor(private readonly page: Page) {}

  /** Reloads the page and reads the counter (0 when the badge is not shown). */
  async read(kind: keyof typeof HREF): Promise<number> {
    await this.page.reload();
    const links = this.page.locator(`a[href="${HREF[kind]}"]`);
    await links.first().waitFor();
    await links.nth(1).waitFor({ timeout: 5_000 }).catch(() => {});
    if ((await links.count()) < 2) return 0;
    return Number((await links.nth(1).innerText()).trim()) || 0;
  }

  /** Clicks the counter (the approver's way in) and waits for its draft list. */
  async open(kind: keyof typeof HREF): Promise<void> {
    await this.page.locator(`a[href="${HREF[kind]}"]`).last().click();
    await this.page.waitForURL(`**${HREF[kind]}`);
  }
}
