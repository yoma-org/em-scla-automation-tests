// Reported issue "SOA periodic balances are wrong / OB-CB mismatch (/ backdated transaction)" — OB-SOA-003,
// OB-SOA-010 and OB-SOA-017 (../em/docs/test-cases/features/balances/19-soa-ob-cb.md) on Old EM.
//
// Each test creates its own apartment, so its S.O.A holds only our documents. The expected Opening Balance,
// every row, the closing balance of each transaction day and of each month, the next month's Opening Balance,
// the header "MMK Current Balance" and the All History view are computed from the apartment's documents
// (invoice dates and totals read from the documents themselves, payments as made) — src/helpers/soaPeriods.ts.
import { test } from '@fixtures/balances.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { notChecked, caseIssue } from '@helpers/balanceChecks';
import { checkSoaPeriods, type SoaTxn } from '@helpers/soaPeriods';
import { createCashAccount, type Apartment, type CashAccount } from '@data/builders';
import { createInvoice, makePayment, rechargeWallet } from '@data/balances';
import { createApprovedUo, setupApartment } from '@data/billing';
import { bulkApproveUo, importUo, lastDay, newInvoice, payByWallet, readInvoices, type AptInvoice, type Day } from '@data/soa-issues';
import { dmy, fmt, month, today } from '@pages/balances/money';
import type { Page } from '@playwright/test';

const ISSUE_BACKDATED = 'SOA periodic balances are wrong / OB-CB mismatch / backdated transaction';
const ISSUE = 'SOA periodic balances are wrong / OB-CB mismatch';
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function common(issue: string) {
  test.info().annotations.push({ type: 'reported issue', description: issue });
  notChecked('Apartment SOA PDF / Bulk SOA PDF', 'PDF content is not parsed (no PDF reader in the framework)');
  notChecked('API › Apartment › SOA by Apartment / PDF Printouts', 'tests assert on screens; Old EM API responses are AES-encrypted');
}

/** A payment allocation as the SOA should show it: "RV-… / WP-… ( Payment for <invoice> )" in Payments. */
interface Paid { voucher: 'RV' | 'WP'; invoice: string; amount: bigint; date: Day; label: string }

/** Expected SOA rows: every invoice of the apartment (from its documents) and every payment we made. */
function soaTxns(invoices: AptInvoice[], payments: Paid[]): SoaTxn[] {
  return [
    ...invoices.map(i => ({
      label: `${i.code} (${i.category})`, kind: (/^DN-/.test(i.code) ? 'Debit Note' : 'Invoice') as SoaTxn['kind'],
      date: i.date, details: new RegExp(`^${esc(i.code)}\\b`), amount: i.total
    })),
    ...payments.map(p => ({
      label: p.label, kind: 'Payment Received' as const, date: p.date,
      details: new RegExp(`^${p.voucher}-\\d+.*${esc(p.invoice)}`), amount: p.amount
    }))
  ];
}

/** Checks the invoice we back-dated carries the date we chose. */
function expectDated(invoices: AptInvoice[], code: string, day: Day) {
  const inv = invoices.find(i => i.code === code);
  expect.soft(inv ? dmy(inv.date) : '(not on the Invoices tab)', `${code}: invoice date`).toBe(dmy(day));
}

// ── OB-SOA-003 ───────────────────────────────────────────────────────────────────────────────

const BACKDATED_VARIANTS = [
  { variant: 'base', category: 'Maintenance Services' },
  { variant: 'Category=Utilities; Date=Back date (1st/mid/last day)', category: 'Utilities' },
  { variant: 'Category=Estate Mgmt Fees; Date=Back date (1st/mid/last day)', category: 'Estate Mgmt Fees' }
];

test.describe('Reported issue: SOA periodic balances · back-dated invoice', () => {
  for (const v of BACKDATED_VARIANTS) {
    test(`OB-SOA-003 [${v.variant}] SOA OB/CB continuity after back-dated invoice — by category × date position`,
      testCase({ id: 'OB-SOA-003', source: 'SOA - OB & CB r9', priority: 'P1', critical: true }),
      async ({ page, soaPage: soa }) => {
        test.setTimeout(600_000);
        common(ISSUE_BACKDATED);
        const prev = month(-1);
        const dates: Day[] = [1, 15, lastDay(prev.y, prev.m)].map(d => ({ ...prev, d }));
        test.info().annotations.push({ type: 'data', description: `Existing history first (invoice today, Make Payment 500 today), then ${v.category} invoices back-dated ${dates.map(dmy).join(', ')}, so the back-dated rows land before rows that already exist` });

        const account = await createCashAccount(page);
        const apt = await setupApartment(page);
        const payments: Paid[] = [];
        await test.step('Existing history: invoice today (Maintenance Services 1,000) and Make Payment 500 today', async () => {
          const current = await createInvoice(page, apt, { price: 1000 });
          await makePayment(page, apt, account, 500);
          payments.push({ voucher: 'RV', invoice: current.code, amount: 50_000n, date: today(), label: `Make Payment 500 for ${current.code}` });
        });
        const backdated: string[] = [];
        for (const [i, d] of dates.entries()) {
          await test.step(`Back-dated ${v.category} invoice dated ${dmy(d)}`, async () => {
            backdated.push((await createInvoice(page, apt, { price: 2000 + 1000 * i, category: v.category, date: d })).code);
          });
        }
        const invoices = await readInvoices(page, apt);
        backdated.forEach((code, i) => expectDated(invoices, code, dates[i]));
        await checkSoaPeriods(page, soa, apt.id, soaTxns(invoices, payments), `OB-SOA-003_${v.category.replace(/\W+/g, '-')}`);
      });
  }
});

// ── OB-SOA-010 ───────────────────────────────────────────────────────────────────────────────

test.describe('Reported issue: SOA periodic balances · Wallet Payment', () => {
  for (const v of [{ variant: 'base', multiple: false }, { variant: 'Mode=Multiple', multiple: true }]) {
    test(`OB-SOA-010 [${v.variant}] SOA OB/CB continuity after Wallet Payment (WP) — single / multiple`,
      testCase({ id: 'OB-SOA-010', source: 'SOA - OB & CB r53', priority: 'P1', critical: true }),
      async ({ page, soaPage: soa }) => {
        test.setTimeout(600_000);
        common(ISSUE);
        const prev = month(-1);
        const lastMonth: Day = { ...prev, d: 15 };
        test.info().annotations.push({ type: 'data', description: `Invoice dated ${dmy(lastMonth)} and invoice today; wallet recharged 100,000; one Wallet Payment today for ${v.multiple ? 'both invoices' : 'last month\'s invoice'}` });
        const account = await createCashAccount(page);
        const apt = await setupApartment(page);
        const old = await createInvoice(page, apt, { price: 2000, date: lastMonth });
        const current = await createInvoice(page, apt, { price: 1000 });
        await rechargeWallet(page, apt, account, 100_000);
        const targets = v.multiple ? [old, current] : [old];
        const payments: Paid[] = [];
        await test.step(`Wallet Payment for ${targets.map(t => t.code).join(' and ')}`, async () => {
          const paid = await payByWallet(page, apt, targets.map(t => t.code));
          for (const t of targets) {
            expect.soft(fmt(paid[t.code]), `Make Payment (Wallet): pay-in-full amount of ${t.code}`).toBe(fmt(t.total));
            payments.push({ voucher: 'WP', invoice: t.code, amount: paid[t.code], date: today(), label: `Wallet Payment for ${t.code}` });
          }
        });
        const invoices = await readInvoices(page, apt);
        expectDated(invoices, old.code, lastMonth);
        await checkSoaPeriods(page, soa, apt.id, soaTxns(invoices, payments), `OB-SOA-010_${v.multiple ? 'multiple' : 'single'}`);
      });
  }
});

// ── OB-SOA-017 ───────────────────────────────────────────────────────────────────────────────

type Step = 'Invoice (Inv)' | 'UO (import)' | 'UO(manual)' | 'UO(bulk approve)' | 'Make Payment (RV)' | 'Wallet Payment (WP)';

const PAIRS: [Step, Step][] = [
  ['Invoice (Inv)', 'UO (import)'],
  ['UO (import)', 'Make Payment (RV)'],
  ['UO (import)', 'Wallet Payment (WP)'],
  ['UO(manual)', 'UO (import)'],
  ['UO(bulk approve)', 'Wallet Payment (WP)'],
  ['Make Payment (RV)', 'Wallet Payment (WP)'],
  ['Wallet Payment (WP)', 'Invoice (Inv)'],
  ['Wallet Payment (WP)', 'UO (import)']
];

interface PairCtx {
  page: Page;
  apt: Apartment;
  account?: CashAccount;
  /** Our invoices in creation order: [code, outstanding cents]. */
  open: { code: string; outstanding: bigint }[];
  payments: Paid[];
  uoUnits: number;
}

async function accountOf(ctx: PairCtx): Promise<CashAccount> {
  ctx.account ??= await createCashAccount(ctx.page);
  return ctx.account;
}

async function addUoInvoice(ctx: PairCtx, run: () => Promise<unknown>): Promise<void> {
  const before = await readInvoices(ctx.page, ctx.apt);
  await run();
  const inv = await newInvoice(ctx.page, ctx.apt, before, 'Utilities');
  ctx.open.push({ code: inv.code, outstanding: inv.total });
}

/** Approved manual UO reading (0 → 5) dated the 5th of last month; its Utilities invoice is dated today (approval). */
async function manualUoLastMonth(ctx: PairCtx): Promise<void> {
  ctx.uoUnits = 5;
  return addUoInvoice(ctx, () => createApprovedUo(ctx.page, ctx.apt, Object.fromEntries(
    ['Electricity (YESC)', 'Electricity (Generator)', 'Treated Water', 'Raw Water'].map(k => [k, { previous: 0, current: 5 }])), { monthsBack: 1, day: 5 }));
}

async function runStep(ctx: PairCtx, step: Step): Promise<void> {
  const { page, apt } = ctx;
  switch (step) {
    case 'Invoice (Inv)': {
      const inv = await createInvoice(page, apt, { price: 1500 });
      ctx.open.push({ code: inv.code, outstanding: inv.total });
      return;
    }
    case 'UO (import)':
      // Import must be a later reading than the last one (UO(manual) puts 5 last month).
      ctx.uoUnits += 7;
      return addUoInvoice(ctx, () => importUo(page, apt, ctx.uoUnits, n => test.info().outputPath(n)));
    case 'UO(manual)':
      // One UO per apartment per month: the manual reading is dated the 5th of last month (invoice = approval date).
      caseIssue('UO(manual) followed by UO (import): Old EM takes one UO reading per apartment per month, so the manual reading is dated the 5th of last month and the import is today\'s reading (both invoices are dated their approval day, today)');
      return manualUoLastMonth(ctx);
    case 'UO(bulk approve)':
      ctx.uoUnits += 6;
      return addUoInvoice(ctx, () => bulkApproveUo(page, apt, ctx.uoUnits));
    case 'Make Payment (RV)': {
      // Make Payment allocates to the oldest unpaid invoice.
      const oldest = ctx.open.find(o => o.outstanding > 0n)!;
      const amount = 1000;
      await makePayment(page, apt, await accountOf(ctx), amount);
      oldest.outstanding -= BigInt(amount * 100);
      ctx.payments.push({ voucher: 'RV', invoice: oldest.code, amount: BigInt(amount * 100), date: today(), label: `Make Payment 1,000 for ${oldest.code}` });
      return;
    }
    case 'Wallet Payment (WP)': {
      // Pays the newest unpaid invoice in full.
      const target = [...ctx.open].reverse().find(o => o.outstanding > 0n)!;
      await rechargeWallet(page, apt, await accountOf(ctx), 100_000);
      const paid = await payByWallet(page, apt, [target.code]);
      expect.soft(fmt(paid[target.code]), `Make Payment (Wallet): pay-in-full amount of ${target.code} = its outstanding balance`).toBe(fmt(target.outstanding));
      ctx.payments.push({ voucher: 'WP', invoice: target.code, amount: paid[target.code], date: today(), label: `Wallet Payment for ${target.code}` });
      target.outstanding -= paid[target.code];
      return;
    }
  }
}

test.describe('Reported issue: SOA periodic balances · type-pair matrix', () => {
  for (const [first, second] of PAIRS) {
    const variant = `1st=${first}; 2nd=${second}`;
    test(`OB-SOA-017 [${variant}] SOA OB/CB after one transaction type followed by another — type-pair matrix`,
      testCase({ id: 'OB-SOA-017', source: 'SOA - OB & CB r170', priority: 'P1', critical: true }),
      async ({ page, soaPage: soa }) => {
        test.setTimeout(720_000);
        common(ISSUE);
        const prev = month(-1);
        const history: Day = { ...prev, d: 15 };
        test.info().annotations.push({ type: 'data', description: `Precondition: invoice dated ${dmy(history)} (Maintenance Services 2,000), so the current month opens with a balance and a payment has an invoice to pay; then ${first}, then ${second}` });
        const apt = await setupApartment(page);
        const ctx: PairCtx = { page, apt, open: [], payments: [], uoUnits: 0 };
        await test.step(`Precondition: invoice dated ${dmy(history)}`, async () => {
          const h = await createInvoice(page, apt, { price: 2000, date: history });
          ctx.open.push({ code: h.code, outstanding: h.total });
        });
        if ((first === 'UO (import)' || second === 'UO (import)') && first !== 'UO(manual)') {
          // Old EM rejects an import for an apartment without an earlier reading ("<apt> has no previous record.").
          await test.step('Precondition for UO (import): approved manual UO reading (0 → 5) dated the 5th of last month', () => manualUoLastMonth(ctx));
          test.info().annotations.push({ type: 'data', description: 'UO import needs an earlier reading (Old EM: "<apartment> has no previous record."): a manual UO reading dated the 5th of last month was approved first; its Utilities invoice (dated today) is part of the expected SOA' });
        }
        await test.step(`1st: ${first}`, () => runStep(ctx, first));
        await test.step(`2nd: ${second}`, () => runStep(ctx, second));
        const invoices = await readInvoices(page, apt);
        expectDated(invoices, ctx.open[0].code, history);
        await checkSoaPeriods(page, soa, apt.id, soaTxns(invoices, ctx.payments), `OB-SOA-017_${first}_${second}`.replace(/[^\w-]+/g, '-'));
      });
  }
});
