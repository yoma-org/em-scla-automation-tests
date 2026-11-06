// Sanity · Fixed tickets · Dashboard
// Cases: docs/sanity-test/tickets/fixed/fixed-dashboard.md. Expected results are Old EM behaviour.
// Read-only.
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { evidence } from '@helpers/evidence';

const doc = 'docs/sanity-test/tickets/fixed/fixed-dashboard.md';

test.describe('Sanity · EM-31 Dashboard scrolling', () => {
  test('SAN-EM31-001 Dashboard has one scroll bar and no white space when scrolled to the bottom',
    sanity({ id: 'SAN-EM31-001', priority: 'P2', doc }),
    async ({ page, dashboardPage: d }) => {
      await test.step('1. The page loads the AR, Cash & Bank and Wallet/Deposit cards', async () => {
        await d.goto();
        for (const card of ['Accounts Receivable', 'Cash & Bank Balance', 'Wallet & Deposits'] as const) {
          await expect.soft(d.card(card), `${card} card`).toBeVisible();
        }
        await expect(d.loading, 'cards still loading').toHaveCount(0, { timeout: 30_000 });
      });

      await test.step('2. There is 1 scrollable area', async () => {
        const areas = await d.scrollAreas();
        // Precondition: with content shorter than the screen there is nothing to scroll and nothing to check.
        expect(areas.length, 'dashboard must be longer than the screen').toBeGreaterThan(0);
        expect.soft(areas.map(a => a.element), 'scrollable areas').toHaveLength(1);
        expect.soft(await d.documentScrolls(), 'window has its own (second) scroll bar').toBe(false);
      });

      await test.step('3. Content ends at the footer "© 2026 Star City" with no white area', async () => {
        await d.scrollToBottom();
        await expect(d.footer).toBeInViewport();
        await expect.soft(d.footer).toHaveText(/Star City/);
        // Below the footer there is only the frame's bottom padding.
        expect.soft(await d.spaceBelowFooter(), 'white space below the footer (px)').toBeLessThanOrEqual(24);
        await evidence(page, '01_NEW_dashboard-bottom');
      });
    });
});
