// src/pages/balances/CashBankSummary.ts — the "Cash & Bank Balance" block shared by the Dashboard and
// Reports › Account Statement. One .card per currency:
//   <h5>MMK</h5><p>570,157,339,885,586.77 Ks</p>
//   .field (one per account type) → .bg-primary "In BANK | 570,006,219,797,154.09 Ks", then one line per
//   bank (Dashboard) or per bank and account (Account Statement): "<name> | <amount>".
import { type Locator, type Page } from '@playwright/test';
import { cents } from './money';

/** level 'bank': a bank subtotal line; 'account': one account (Account Statement only; Dashboard shows banks only). */
export interface CashBankLine { name: string; amount: bigint; level: 'bank' | 'account' }
export interface CashBankGroup { type: string; total: bigint; totalText: string; lines: CashBankLine[] }
export interface CashBankCurrency { currency: string; total: bigint; totalText: string; groups: CashBankGroup[] }

export class CashBankSummary {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /^Cash & Bank Balance/ });
  }

  /** The currency card, e.g. card('MMK'). */
  card(currency: string): Locator {
    return this.page.locator('.card').filter({ has: this.page.getByRole('heading', { name: currency, exact: true, level: 5 }) })
      .filter({ has: this.page.locator('.field > .bg-primary') });
  }

  async read(): Promise<CashBankCurrency[]> {
    await this.heading.waitFor();
    await this.page.locator('.field > .bg-primary').first().waitFor(); // the heading renders before the figures load
    const raw = await this.page.evaluate(() => {
      // Only the Cash & Bank cards have .field > .bg-primary type headers (Net Cash tables have thead.bg-primary).
      return [...document.querySelectorAll('.card')].filter(c => c.querySelector('.field > .bg-primary') && !c.querySelector('.card')).map(card => ({
        currency: card.querySelector('h5')!.textContent!.trim(),
        total: card.querySelector('h5 + p')!.textContent!.trim(),
        groups: [...card.querySelectorAll('.field')].map(f => {
          const rows = [...f.children].map(r => ({
            account: r.classList.contains('text-color-secondary'),
            spans: [...r.querySelectorAll(':scope > span')].map(s => s.textContent!.replace(/\s+/g, ' ').trim())
          }));
          const [head, ...lines] = rows;
          return {
            type: head?.spans[0] ?? '', total: head?.spans[1] ?? '',
            lines: lines.filter(l => l.spans.length >= 2)
              .map(l => ({ name: l.spans[0], amount: l.spans[l.spans.length - 1], level: l.account ? 'account' as const : 'bank' as const }))
          };
        })
      }));
    });
    return raw.map(c => ({
      currency: c.currency, total: cents(c.total), totalText: c.total,
      groups: c.groups.map(g => ({ type: g.type, total: cents(g.total), totalText: g.total, lines: g.lines.map(l => ({ name: l.name, amount: cents(l.amount), level: l.level })) }))
    }));
  }
}
