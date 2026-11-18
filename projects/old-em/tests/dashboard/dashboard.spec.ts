// Dashboard (../em/docs/test-cases/features/02-dashboard.md). UAT totals are shared and change while
// other testers work, so these tests check what the case asks to see plus the figures' own arithmetic
// (total = its parts), and reconcile with the AR page only when the Dashboard did not move in between.
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { expectSameAmount, notChecked } from '@helpers/balanceChecks';
import { cents, dmy, fmt, sum, today } from '@pages/balances/money';
import type { ArCard } from '@pages/balances/DashboardWidgets';

test.describe('Dashboard', () => {
  test('DASH-001 [base] Dashboard shows AR total, current and overdue amounts — by currency',
    testCase({ id: 'DASH-001', source: 'TC_AR_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, dashboardWidgets: dash, arPage }) => {
      notChecked('Variants 2-3 (other currency, AR sheet duplicate)', 'smoke runs the base row (MMK) only');

      await test.step('Expected 1: entering the system shows the Dashboard', async () => {
        await page.goto('/');
        await expect(dash.arHeading).toBeVisible();
        await expect(page.getByText('Dashboard', { exact: true }).last()).toBeVisible();
      });

      await test.step('1. Dashboard from the left menu', async () => {
        await arPage.goto();
        await dash.openFromMenu();
        await expect(page).toHaveURL(/\/$/);
        await expect.soft(dash.arHeading, 'AR widget is "as of" today').toHaveText(`Accounts Receivable (as of ${dmy(today())})`);
      });

      let card!: ArCard;
      await test.step('Expected 2-4: MMK receivable total, Current and Overdue', async () => {
        card = await dash.readAr('MMK');
        await evidence(page, 'DASH-001_dashboard-ar');
        await expect(dash.arCard('MMK').locator('h4'), 'MMK total receivable').toHaveText(/^[\d,]+\.\d{2} Ks$/);
        await expect(dash.arCard('MMK').getByText(/^Current: [\d,]+\.\d{2} Ks$/), 'MMK Current').toBeVisible();
        await expect(dash.arCard('MMK').getByText(/^Overdue: [\d,]+\.\d{2} Ks$/), 'MMK Overdue').toBeVisible();
        expectSameAmount(card.total, card.current + card.overdue, `MMK total = Current ${fmt(card.current)} + Overdue ${fmt(card.overdue)}`);
      });

      await test.step('Total receivable "in the system" = Accounts Receivable page (MMK)', async () => {
        // Other testers post invoices / payments: compare only when the Dashboard read before and after the AR page agree.
        let result: { dash: ArCard; ar: { total: bigint; current: bigint; overdue: bigint } } | undefined;
        for (let i = 0; i < 3 && !result; i++) {
          await dash.goto();
          const before = await dash.readAr('MMK');
          await arPage.goto();
          const ar = { total: await arPage.totalCents(), current: await arPage.cardCents('Current'), overdue: await arPage.cardCents('Total Amount Overdue') };
          await dash.goto();
          const after = await dash.readAr('MMK');
          if (before.text === after.text) result = { dash: after, ar };
        }
        if (!result) { notChecked('Dashboard = AR page', 'AR moved during every attempt (other testers)'); return; }
        const { dash: d, ar } = result;
        expectSameAmount(ar.total, d.total, 'AR page total (MMK) = Dashboard AR total');
        expectSameAmount(ar.current, d.current, 'AR page Current = Dashboard Current');
        expectSameAmount(ar.overdue, d.overdue, 'AR page Total Amount Overdue = Dashboard Overdue');
      });
    });

  test('DASH-002 Dashboard shows total Cash & Bank balance — MMK and other currency',
    testCase({ id: 'DASH-002', source: 'TC_Dashboard_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, dashboardWidgets: dash, arPage }) => {
      await arPage.goto();
      await dash.openFromMenu();
      const currencies = await dash.cashBank.read();
      await dash.cashBank.heading.scrollIntoViewIfNeeded();
      await evidence(page, 'DASH-002_cash-bank-balance');

      await test.step('Expected 1: total balance (MMK)', async () => {
        const mmk = currencies.find(c => c.currency === 'MMK');
        expect(mmk, 'Cash & Bank Balance card for MMK').toBeTruthy();
        await expect(dash.cashBank.card('MMK').locator('h5 + p')).toHaveText(/^-?[\d,]+\.\d{2} Ks$/);
      });

      await test.step('Expected 2: total balance (other currency)', async () => {
        const others = currencies.filter(c => c.currency !== 'MMK');
        expect(others.length, `other-currency cards (seen: ${currencies.map(c => c.currency).join(', ')})`).toBeGreaterThan(0);
        await expect(dash.cashBank.card(others[0].currency).locator('h5 + p')).toHaveText(/\d[\d,]*\.\d{2}/);
      });

      await test.step('Each total = its account types; each type = its banks', async () => {
        for (const c of currencies) {
          const types = sum(c.groups.map(g => g.total));
          expectSameAmount(c.total, types, `${c.currency} total = Σ account types (${c.groups.map(g => `${g.type} ${g.totalText}`).join(' + ')})`);
          for (const g of c.groups.filter(g => g.lines.length)) {
            const banks = sum(g.lines.map(l => l.amount));
            expectSameAmount(g.total, banks, `${c.currency} ${g.type} = Σ its banks`);
          }
        }
      });
    });

  test('DASH-005 [base] Dashboard net cash (collection, payment, net) — by currency × period',
    testCase({ id: 'DASH-005', source: 'TC_NetCash_001', priority: 'P1', smoke: true }),
    async ({ page, dashboardWidgets: dash, arPage }) => {
      notChecked('Variants 2-6 (current month, last two months, other currency)', 'smoke runs the base row (MMK, today) only');
      await arPage.goto();
      await dash.openFromMenu();
      const t = await dash.readNetCash('MMK');
      await dash.netCashHeading.scrollIntoViewIfNeeded();
      await evidence(page, 'DASH-005_net-cash');

      await test.step('Today column', async () => {
        expect(t.columns[1], 'first Net Cash column is today').toBe(dmy(today()));
      });
      await test.step('Expected 1-3: total collection, total payment, net cash (MMK) for today', async () => {
        expect(t.collection[0], 'Total Collection today').toMatch(/^[\d,]+\.\d{2} Ks$/);
        expect(t.payment[0], 'Total Payment today').toMatch(/^\(?[\d,]+\.\d{2} Ks\)?$/);
        expect(t.net[0], 'Net Cash today').toMatch(/^\(?-?[\d,]+\.\d{2} Ks\)?$/);
      });
      await test.step('Net Cash = Total Collection − Total Payment', async () => {
        for (let i = 0; i < t.net.length; i++) {
          const collection = cents(t.collection[i]);
          const payment = cents(t.payment[i]); // shown in brackets: (701.00 Ks) → -701.00
          const paid = payment < 0n ? -payment : payment;
          expectSameAmount(cents(t.net[i]), collection - paid, `${t.columns[i + 1]}: Net Cash = Total Collection ${t.collection[i]} − Total Payment ${fmt(paid)}`);
        }
      });
    });
});
