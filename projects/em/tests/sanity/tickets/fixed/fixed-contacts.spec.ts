// Sanity · Fixed tickets · Contacts
// Cases: docs/sanity-test/tickets/fixed/fixed-contacts.md. Expected results: the ticket takes the other
// New EM Summary pages (Apartment Summary) as the standard here, not Old EM.
// Read-only.
import { type Locator } from '@playwright/test';
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { evidence } from '@helpers/evidence';

const doc = 'docs/sanity-test/tickets/fixed/fixed-contacts.md';

interface RowLayout {
  /** Vertical distance between the centres of the title and the Currency filter. */
  centreGap: number;
  /** Title's left edge from the panel's left edge. */
  titleLeft: number;
  /** Filter's right edge from the panel's right edge. */
  filterRight: number;
}

async function layout(panel: Locator, title: Locator, filter: Locator): Promise<RowLayout> {
  const [p, t, f] = await Promise.all([panel.boundingBox(), title.boundingBox(), filter.boundingBox()]);
  if (!p || !t || !f) throw new Error('Summary panel, title or Currency filter not rendered');
  return {
    centreGap: Math.round(Math.abs((t.y + t.height / 2) - (f.y + f.height / 2))),
    titleLeft: Math.round(t.x - p.x),
    filterRight: Math.round(p.x + p.width - (f.x + f.width))
  };
}

test.describe('Sanity · EM-43 Contact Summary currency filter', () => {
  /** Seed U Aung Kyaw: owns Estate SEED-Z-001, so the Summary has receivables. */
  const contact = { id: 1 };
  /** Apartment Summary is the reference layout (EM-43). */
  const apartment = { id: 1 };

  test('SAN-EM43-001 Contact Summary: Currency filter is aligned with the Accounts Receivable title',
    sanity({ id: 'SAN-EM43-001', priority: 'P3', doc }),
    async ({ page, contactSummaryTab: c, apartmentSummaryTab: a }) => {
      let contactRow: RowLayout;

      await test.step('1. Title "Accounts Receivable <total>" on the left, Currency on the right, same row', async () => {
        await c.goto(contact.id);
        await expect(c.accountsReceivable).toHaveText(/^Accounts Receivable\s+\S/);
        await expect(c.currency, 'Currency filter').toBeVisible();
        contactRow = await layout(c.panel, c.accountsReceivable, c.currency);
        expect.soft(contactRow.centreGap, 'title and filter on the same row (px between centres)').toBeLessThanOrEqual(8);
        expect.soft(contactRow.titleLeft, 'title at the left edge (px)').toBeLessThanOrEqual(8);
        expect.soft(contactRow.filterRight, 'filter at the right edge (px)').toBeLessThanOrEqual(8);
        await evidence(page, '01_NEW_contact-summary', [c.personalData]);
      });

      await test.step('2. Same layout as the Apartment Summary', async () => {
        await a.goto(apartment.id);
        const apartmentRow = await layout(a.panel, a.accountsReceivable, a.currency);
        for (const key of ['centreGap', 'titleLeft', 'filterRight'] as const) {
          expect.soft(Math.abs(contactRow[key] - apartmentRow[key]), `${key}: Contact ${contactRow[key]} vs Apartment ${apartmentRow[key]} px`)
            .toBeLessThanOrEqual(4);
        }
      });
    });
});
