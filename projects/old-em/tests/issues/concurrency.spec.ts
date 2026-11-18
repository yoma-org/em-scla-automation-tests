// Reported issue "Balance issue: concurrency" — do two users acting at the same moment pay an invoice twice,
// or debit a wallet / account below zero, on Old EM?
//   CONC-001 / 003 / 004   ../em/docs/test-cases/features/12-payment-concurrency.md
//   OB-WAL-012             ../em/docs/test-cases/features/balances/20-wallet-ob-cb.md
//   OB-ACS-010             ../em/docs/test-cases/features/balances/22-account-statement-ob-cb.md
// Old EM API responses are encrypted, so each race is two real UI sessions (src/helpers/race.ts): both forms filled,
// the final clicks fired together and the write requests held until both are sent. Every test builds its own
// apartment / cash account / invoices (QE OLD <date>-<rand> …) and reads the money afterwards: invoice status / due,
// apartment S.O.A and AR, wallet, account balance and statement. Payments cannot be undone: the data stays on UAT.
import { test } from '@fixtures/collection.fixture';
import { expect } from '@fixtures';
import { type Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { uniqueName } from '@helpers/names';
import { caseIssue, notChecked } from '@helpers/balanceChecks';
import { describeOutcome, outcome, race, secondSession, type Outcome, type RaceResult } from '@helpers/race';
import { createApartment, createCashAccount, type Apartment, type CashAccount } from '@data/builders';
import { accountBalance, apartmentAr, createUnpaidInvoice, invoiceStatusBox, LOCATION, rechargeWallet, type UnpaidInvoice } from '@data/collection';
import { MakePaymentPage } from '@pages/collection/MakePaymentPage';
import { ApartmentSoaPage } from '@pages/collection/ApartmentSoaPage';
import { ApartmentDetailPage } from '@pages/apartments/ApartmentDetailPage';
import { InvoiceDetailPage } from '@pages/invoices/InvoiceDetailPage';
import { ApartmentWalletPage } from '@pages/wallet/ApartmentWalletPage';
import { CashOutflowPage, CashOutflowDraftsPage } from '@pages/cash/CashOutflowPage';
import { AccountStatementPage } from '@pages/balances/AccountStatementPage';
import { ks, parseAmount, waitIdle } from '@pages/collection/common';
import { fmt, today, ymd } from '@pages/balances/money';

test.describe.configure({ timeout: 900_000 });

const ISSUE = 'Balance issue: concurrency';
const ATTEMPTS = Number(process.env.CONC_ATTEMPTS ?? 3);

function reportedIssue(): void {
  test.info().annotations.push({ type: 'reported issue', description: ISSUE });
  caseIssue('The case says "2 users": UAT has no second account (APPROVER_* empty), so the second user is a second browser session of the same admin');
}

function note(type: string, description: string): void {
  test.info().annotations.push({ type, description });
}

function recordRace(attempt: string, r: RaceResult, outcomes: Outcome[]): void {
  note('race method', `${attempt}: ${r.method}`);
  note('observed', `${attempt}: writes ${r.writes.map(w => `S${w.session} ${w.method} ${w.url} → ${w.status ?? 'no response'}`).join('; ') || 'none'}; ` +
    outcomes.map((o, i) => `S${i + 1} saw ${describeOutcome(o)}`).join('; '));
}

/**
 * Test data built through the UI (apartment, UO invoice, account, recharge). Tried twice; when UAT still fails it
 * is an environment problem: BLOCKED on the first attempt, otherwise the attempts stop (null) and are noted.
 */
async function precondition<T>(n: number, title: string, build: () => Promise<T>): Promise<T | null> {
  let last: unknown;
  for (let i = 1; i <= 2; i++) {
    try {
      return await test.step(`Attempt ${n} · Precondition: ${title}${i > 1 ? ' (retry)' : ''}`, build);
    } catch (e) { last = e; }
  }
  const why = `test data could not be built on UAT (${title}): ${String((last as Error)?.message ?? last).split('\n')[0].slice(0, 200)}`;
  if (n === 1) test.skip(true, `BLOCKED: ${why}`);
  note('blocked attempt', `attempt ${n}: ${why}; attempts stopped`);
  return null;
}

const PAID_IN_FULL = 'This invoice has already been paid in full. No further payments are required.';
const PARTIALLY_PAID = 'This invoice has already been partially paid. Please refresh and try again.';

// ── Invoice payment races (CONC-001 / 003 / 004) ─────────────────────────────────────────────────

interface Money { status: string; due: number; payments: number[]; balanceDue: number; ar: number; account: number; wallet: number }

/** Everything the payment cases check after the race, read on the first session. */
async function readMoney(page: Page, apt: Apartment, acc: CashAccount, inv: UnpaidInvoice, tag: string): Promise<Money> {
  const detail = new InvoiceDetailPage(page);
  await detail.goto(inv.invoiceId);
  const status = (await invoiceStatusBox(page, inv).innerText()).trim();
  await evidence(page, `${tag}_invoice`);

  const tab = new ApartmentDetailPage(page);
  await tab.gotoInvoices(apt.id);
  const row = tab.invoiceRows.filter({ hasText: inv.code });
  await expect(row).toHaveCount(1);
  const due = parseAmount(await row.getByRole('cell').nth(5).innerText());
  await evidence(page, `${tag}_invoices-tab`);

  const soa = new ApartmentSoaPage(page);
  await soa.goto(apt.id);
  const rows = soa.paymentRows(inv.code);
  const payments: number[] = [];
  for (let i = 0; i < await rows.count(); i++) payments.push(parseAmount(await soa.paymentsCell(rows.nth(i)).innerText()));
  const balanceDue = parseAmount(await soa.balanceDue.innerText());
  await evidence(page, `${tag}_soa`);

  const ar = await apartmentAr(page, apt);
  await evidence(page, `${tag}_summary-ar`);
  const account = await accountBalance(page, acc.name);
  const wallet = new ApartmentWalletPage(page);
  await wallet.goto(apt.id);
  const walletBalance = await wallet.balance();
  return { status, due, payments, balanceDue, ar, account, wallet: walletBalance };
}

/** Opens Make Payment on the apartment and fills it (Cash into our account), ready to Confirm. */
async function fillPayment(page: Page, apt: Apartment, acc: CashAccount, inv: UnpaidInvoice, amount: number): Promise<MakePaymentPage> {
  const form = new MakePaymentPage(page);
  await form.goto(apt.id);
  await form.fill({ location: LOCATION, method: 'Cash', account: acc.name, amount });
  await expect(form.payBox(inv.code)).toHaveValue(ks(amount));
  await expect(form.confirmButton).toBeEnabled();
  return form;
}

interface PayAttempt { amounts: [number, number]; outcomes: Outcome[]; landed: boolean[]; money: Money; accountBefore: number }

async function paymentRace(page: Page, second: Page, acc: CashAccount, amounts: [number, number], tag: string, n: number): Promise<({ inv: UnpaidInvoice } & PayAttempt) | null> {
  const data = await precondition(n, 'new apartment with an approved UO invoice of 1,000 Ks', async () => {
    const apt = await createApartment(page);
    const inv = await createUnpaidInvoice(page, apt, 10);
    expect(inv.total, 'invoice amount 1,000 as in the case').toBe(1000);
    return { apt, inv };
  });
  if (!data) return null;
  const { apt, inv } = data;
  const accountBefore = await accountBalance(page, acc.name);

  const forms = await test.step(`Attempt ${n} · Both users open Make Payment and fill RV = ${amounts[0]} / ${amounts[1]}`, async () =>
    [await fillPayment(page, apt, acc, inv, amounts[0]), await fillPayment(second, apt, acc, inv, amounts[1])]);

  const outcomes = await test.step(`Attempt ${n} · Both users Confirm at the same time`, async () => {
    const r = await race([page, second], forms.map(f => () => f.confirmButton.click()));
    const o = await Promise.all([outcome(page, /\/soa$/), outcome(second, /\/soa$/)]);
    recordRace(`attempt ${n} (${inv.code}, ${apt.name})`, r, o);
    await evidence(page, `${tag}_a${n}_session1`);
    await evidence(second, `${tag}_a${n}_session2`);
    return o;
  });
  const landed = outcomes.map(o => /\/soa$/.test(o.url));

  const money = await test.step(`Attempt ${n} · Read invoice, S.O.A, AR, account and wallet`, () => readMoney(page, apt, acc, inv, `${tag}_a${n}`));
  note('money', `attempt ${n} ${inv.code}: status "${money.status}", due ${money.due}, S.O.A payments [${money.payments.join(', ')}], ` +
    `Balance Due ${money.balanceDue}, AR ${money.ar}, account ${accountBefore} → ${money.account} (+${money.account - accountBefore}), wallet ${money.wallet}`);
  return { inv, amounts, outcomes, landed, money, accountBefore };
}

const sumOf = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const hasMessage = (o: Outcome, text: string) => o.messages.some(m => m.includes(text));

test.describe('Payment concurrency · 1 invoice × 2 RV', () => {
  test('CONC-001 [base] 1 invoice, 2 concurrent full payments: 2nd rejected as paid in full (matrix)',
    testCase({ id: 'CONC-001', source: '1Inv 2RV r4', priority: 'P1', critical: true }),
    async ({ page, browser }) => {
      reportedIssue();
      notChecked('Variants 2-12', 'base row only (make payment × make payment, same currency); unknown assign, wallet payment, SCLA and different-currency rows not run');
      notChecked('Dashboard, Accounts Receivable list, Reports', 'shared totals; the apartment AR / S.O.A / invoice are checked instead');
      const second = await secondSession(browser);
      const acc = (await precondition(1, 'our MMK cash account', () => createCashAccount(page)))!;
      let problems = 0;
      let run = 0;
      for (let n = 1; n <= ATTEMPTS; n++) {
        run = n;
        const a = await paymentRace(page, second, acc, [1000, 1000], 'CONC-001', n);
        if (!a) { run--; break; }
        const accepted = a.landed.filter(Boolean).length;
        const refused = a.outcomes.filter(o => hasMessage(o, PAID_IN_FULL)).length;
        const paid = sumOf(a.money.payments);
        const bad = accepted !== 1 || refused !== 1 || paid !== 1000 || a.money.account - a.accountBefore !== 1000 || a.money.due !== 0 || a.money.wallet !== 0;
        if (bad) problems++;
        await test.step(`Attempt ${n} · Expected: one payment accepted, the other told "${PAID_IN_FULL}"; paid once`, async () => {
          expect.soft(accepted, `attempt ${n}: sessions whose payment went through (S.O.A reached). Expected 1, got ${accepted}: ${a.outcomes.map(describeOutcome).join(' | ')}`).toBe(1);
          expect.soft(refused, `attempt ${n}: sessions shown "${PAID_IN_FULL}". Expected 1, got ${refused}: ${a.outcomes.map(describeOutcome).join(' | ')}`).toBe(1);
          expect.soft(a.money.payments, `attempt ${n}: S.O.A "Payment Received" rows for ${a.inv.code} — expected one of 1,000, got [${a.money.payments.join(', ')}]`).toEqual([1000]);
          expect.soft(a.money.status, `attempt ${n}: invoice status`).toBe('Paid');
          expect.soft(a.money.due, `attempt ${n}: invoice due amount`).toBe(0);
          expect.soft(a.money.balanceDue, `attempt ${n}: S.O.A Balance Due (negative = paid twice)`).toBe(0);
          expect.soft(a.money.ar, `attempt ${n}: apartment AR`).toBe(0);
          expect.soft(a.money.account - a.accountBefore, `attempt ${n}: money received into ${acc.name} (expected 1,000 once, got ${a.money.account - a.accountBefore})`).toBe(1000);
          expect.soft(a.money.wallet, `attempt ${n}: wallet (a second payment must not be credited to the wallet)`).toBe(0);
        });
        // CONC_UNTIL_OVERPAID=1: keep racing past an "Internal Server Error" until a double payment is caught (for evidence).
        if (process.env.CONC_UNTIL_OVERPAID ? paid > 1000 : problems) break;
      }
      note('attempts', `${problems} of ${run} attempt(s) showed the problem`);
      await second.context().close();
    });

  test('CONC-003 [base] 1 invoice, 2 concurrent partial payments within balance: both accepted (matrix)',
    testCase({ id: 'CONC-003', source: '1Inv 2RV r18', priority: 'P1', critical: true }),
    async ({ page, browser }) => {
      reportedIssue();
      notChecked('Variants 2-22', 'base row only (make payment 500 × make payment 400, same currency); other combinations not run');
      notChecked('Dashboard, Accounts Receivable list, Reports', 'shared totals; the apartment AR / S.O.A / invoice are checked instead');
      const second = await secondSession(browser);
      const acc = (await precondition(1, 'our MMK cash account', () => createCashAccount(page)))!;
      let problems = 0;
      let run = 0;
      for (let n = 1; n <= ATTEMPTS; n++) {
        run = n;
        const a = await paymentRace(page, second, acc, [500, 400], 'CONC-003', n);
        if (!a) { run--; break; }
        const accepted = a.landed.filter(Boolean).length;
        const sorted = [...a.money.payments].sort((x, y) => x - y);
        const bad = accepted !== 2 || sorted.join() !== '400,500' || a.money.due !== 100 || a.money.account - a.accountBefore !== 900;
        if (bad) problems++;
        await test.step(`Attempt ${n} · Expected: UI lets both users pay (500 + 400); due 100`, async () => {
          expect.soft(accepted, `attempt ${n}: sessions whose payment went through. Expected 2, got ${accepted}: ${a.outcomes.map(describeOutcome).join(' | ')}`).toBe(2);
          expect.soft(sorted, `attempt ${n}: S.O.A payments for ${a.inv.code}`).toEqual([400, 500]);
          expect.soft(a.money.status, `attempt ${n}: invoice status`).toMatch(/^Partial(ly)?[ _]Paid$/i);
          expect.soft(a.money.due, `attempt ${n}: invoice due amount (1,000 − 900)`).toBe(100);
          expect.soft(a.money.balanceDue, `attempt ${n}: S.O.A Balance Due`).toBe(100);
          expect.soft(a.money.ar, `attempt ${n}: apartment AR`).toBe(100);
          expect.soft(a.money.account - a.accountBefore, `attempt ${n}: money received into ${acc.name}`).toBe(900);
          expect.soft(a.money.wallet, `attempt ${n}: wallet`).toBe(0);
        });
        // CONC_UNTIL_OVERPAID=1: keep racing past an "Internal Server Error" until both payments land with a wrong due (for evidence).
        if (process.env.CONC_UNTIL_OVERPAID ? accepted === 2 && a.money.due !== 100 : problems) break;
      }
      note('attempts', `${problems} of ${run} attempt(s) showed the problem`);
      await second.context().close();
    });

  test('CONC-004 [base] 1 invoice, 2 concurrent partials exceeding balance: 2nd asked to refresh (matrix)',
    testCase({ id: 'CONC-004', source: '1Inv 2RV r20', priority: 'P1', critical: true }),
    async ({ page, browser }) => {
      reportedIssue();
      notChecked('Variants 2-11', 'base row only (make payment 500 × make payment 600, same currency); other combinations not run');
      notChecked('Dashboard, Accounts Receivable list, Reports', 'shared totals; the apartment AR / S.O.A / invoice are checked instead');
      const second = await secondSession(browser);
      const acc = (await precondition(1, 'our MMK cash account', () => createCashAccount(page)))!;
      let problems = 0;
      let run = 0;
      for (let n = 1; n <= ATTEMPTS; n++) {
        run = n;
        const a = await paymentRace(page, second, acc, [500, 600], 'CONC-004', n);
        if (!a) { run--; break; }
        const accepted = a.landed.filter(Boolean).length;
        const refused = a.outcomes.filter(o => hasMessage(o, PARTIALLY_PAID)).length;
        const paid = sumOf(a.money.payments);
        const bad = accepted !== 1 || refused !== 1 || a.money.payments.length !== 1 || paid > 1000 || a.money.account - a.accountBefore !== paid || a.money.wallet !== 0;
        if (bad) problems++;
        await test.step(`Attempt ${n} · Expected: one payment accepted, the other told "${PARTIALLY_PAID}"; never over 1,000`, async () => {
          expect.soft(accepted, `attempt ${n}: sessions whose payment went through. Expected 1, got ${accepted}: ${a.outcomes.map(describeOutcome).join(' | ')}`).toBe(1);
          expect.soft(refused, `attempt ${n}: sessions shown "${PARTIALLY_PAID}". Expected 1, got ${refused}: ${a.outcomes.map(describeOutcome).join(' | ')}`).toBe(1);
          expect.soft(a.money.payments.length, `attempt ${n}: S.O.A payments for ${a.inv.code} — expected one (500 or 600), got [${a.money.payments.join(', ')}]`).toBe(1);
          expect.soft(paid, `attempt ${n}: total paid on the 1,000 invoice must not exceed 1,000`).toBeLessThanOrEqual(1000);
          expect.soft(a.money.due, `attempt ${n}: invoice due amount = 1,000 − paid (${1000 - paid})`).toBe(Math.max(0, 1000 - paid));
          expect.soft(a.money.balanceDue, `attempt ${n}: S.O.A Balance Due (negative = overpaid)`).toBeGreaterThanOrEqual(0);
          expect.soft(a.money.ar, `attempt ${n}: apartment AR`).toBe(Math.max(0, 1000 - paid));
          expect.soft(a.money.account - a.accountBefore, `attempt ${n}: money received into ${acc.name} = what the S.O.A shows paid`).toBe(paid);
          expect.soft(a.money.wallet, `attempt ${n}: wallet (excess must not be credited)`).toBe(0);
        });
        if (problems) break;
      }
      note('attempts', `${problems} of ${run} attempt(s) showed the problem`);
      await second.context().close();
    });
});

// ── Wallet / account overdraw races (OB-WAL-012, OB-ACS-010) ─────────────────────────────────────

/**
 * Expands every PV draft row of a payee (paged list, oldest first: searched over the pages) and returns their
 * draft URLs (/cash-outflows/:id/draft). `description` narrows to e.g. "Wallet Refund".
 */
async function draftUrls(page: Page, payee: string, description?: string): Promise<string[]> {
  const drafts = new CashOutflowDraftsPage(page);
  await drafts.goto();
  let rows = await drafts.find(payee);
  if (description) rows = rows.filter({ has: page.getByRole('cell', { name: description, exact: true }) });
  const urls: string[] = [];
  const n = await rows.count();
  for (let i = 0; i < n; i++) {
    const row = rows.nth(i);
    await row.getByRole('button', { name: 'Row Collapsed' }).click();
    const link = row.locator('xpath=following-sibling::tr[1]').locator('a[href^="/cash-outflows/"][href$="/draft"]');
    await expect(link).toBeVisible();
    urls.push((await link.getAttribute('href'))!);
  }
  return urls;
}

/** Opens each draft in its own session and clicks Approve in both at once (no confirm dialog on PV approve). */
async function approveRace(pages: Page[], urls: string[], label: string): Promise<Outcome[]> {
  for (let i = 0; i < pages.length; i++) {
    await pages[i].goto(urls[i]);
    await expect(pages[i].getByRole('button', { name: 'Approve', exact: true })).toBeVisible();
    await waitIdle(pages[i]);
  }
  const r = await race(pages, pages.map(p => () => p.getByRole('button', { name: 'Approve', exact: true }).click()));
  const o = await Promise.all(pages.map(p => outcome(p)));
  recordRace(label, r, o);
  return o;
}

const succeeded = (o: Outcome, text: RegExp) => o.messages.some(m => text.test(m));
const refusedInsufficient = (o: Outcome) => o.messages.some(m => /insufficient/i.test(m));

/** Account Statement for today: PV rows of the payee text and the closing balance. */
async function statementToday(page: Page, acc: CashAccount, match: RegExp, tag: string): Promise<{ pvRows: string[]; closing: bigint; negativeRows: string[] }> {
  const st = new AccountStatementPage(page);
  const d = ymd(today());
  await st.open(acc.id, d, d);
  const rows = await st.rows();
  await evidence(page, tag);
  return {
    pvRows: rows.filter(r => /PV-\d+/.test(r.description) && match.test(r.text)).map(r => r.text),
    closing: rows[rows.length - 1].balance,
    negativeRows: rows.filter(r => r.balance < 0n).map(r => r.text)
  };
}

test.describe('Wallet / account concurrency · overdraw protection', () => {
  test('OB-WAL-012 [base] Wallet: 2 users debit full/over balance concurrently — second is refused',
    testCase({ id: 'OB-WAL-012', source: 'Wallet - OB & CB r128', priority: 'P1', critical: true }),
    async ({ page, browser }) => {
      reportedIssue();
      notChecked('Variants 2-6', 'base row only (Wallet Refund draft × Wallet Refund draft, 100,000 each); over-balance sums, wallet payment and wallet transfer rows not run');
      const WALLET = 100000;
      const second = await secondSession(browser);
      let problems = 0;
      let run = 0;
      for (let n = 1; n <= ATTEMPTS; n++) {
        run = n;
        const data = await precondition(n, `our apartment, wallet recharged ${ks(WALLET)} into our cash account`, async () => {
          const apt = await createApartment(page);
          const acc = await createCashAccount(page);
          await rechargeWallet(page, apt, acc, WALLET);
          return { apt, acc };
        });
        if (!data) { run--; break; }
        const { apt, acc } = data;
        const remark = uniqueName(`OB-WAL-012 a${n}`);

        const sessions = [page, second];
        const outcomes = await test.step(`Attempt ${n} · Both users fill Wallet Refund ${ks(WALLET)} and Submit at the same time`, async () => {
          const wallets = sessions.map(p => new ApartmentWalletPage(p));
          for (const w of wallets) {
            await w.goto(apt.id);
            expect(await w.balance(), 'wallet balance before the race').toBe(WALLET);
            await w.refundButton.click();
            await expect(w.refund.root).toBeVisible();
            await w.refund.chooseAccount('Refund From*', acc.name);
            await w.refund.amount.fill(String(WALLET));
            await w.refund.remark.fill(remark);
            await w.refund.amount.press('Tab');
            await expect(w.refund.submitButton).toBeEnabled();
          }
          await page.waitForTimeout(500); // the side panel ignores a Submit sent while it is still validating
          const r = await race(sessions, wallets.map(w => () => w.refund.submitButton.click()));
          const o = await Promise.all(sessions.map(p => outcome(p)));
          recordRace(`attempt ${n} refund drafts (${apt.name})`, r, o);
          await evidence(page, `OB-WAL-012_a${n}_session1`);
          await evidence(second, `OB-WAL-012_a${n}_session2`);
          return o;
        });

        const created = outcomes.filter(o => succeeded(o, /Wallet Refund has been created successfully/i)).length;
        const urls = await draftUrls(page, apt.name, 'Wallet Refund');
        await evidence(page, `OB-WAL-012_a${n}_drafts`);
        note('observed', `attempt ${n}: ${created} success toast(s); ${urls.length} Wallet Refund draft(s) for ${apt.name}`);

        // Money check: approve what was drafted (both at once when two exist) and see whether the wallet goes below 0.
        let approveOutcomes: Outcome[] = [];
        await test.step(`Attempt ${n} · Approve the refund draft(s) (at the same time when there are two)`, async () => {
          if (urls.length >= 2) approveOutcomes = await approveRace([page, second], urls.slice(0, 2), `attempt ${n} approve both refund drafts`);
          else if (urls.length === 1) {
            await page.goto(urls[0]);
            await page.getByRole('button', { name: 'Approve', exact: true }).click();
            approveOutcomes = [await outcome(page)];
          }
        });

        const wallet = new ApartmentWalletPage(page);
        await wallet.goto(apt.id);
        const walletAfter = await wallet.balance();
        const refundRows = await wallet.row(/\( Wallet Refund \)/).count();
        await evidence(page, `OB-WAL-012_a${n}_wallet`);
        const accountAfter = await accountBalance(page, acc.name);
        const st = await statementToday(page, acc, /Wallet Refund|Refund/i, `OB-WAL-012_a${n}_statement`);
        note('money', `attempt ${n}: wallet ${WALLET} → ${walletAfter} (${refundRows} refund row(s)); account ${WALLET} → ${accountAfter}; ` +
          `statement closing ${fmt(st.closing)}, PV rows ${st.pvRows.length}; approve: ${approveOutcomes.map(describeOutcome).join(' | ') || 'none'}`);

        const bad = urls.length !== 1 || walletAfter < 0 || accountAfter < 0 || refundRows > 1;
        if (bad) problems++;
        await test.step(`Attempt ${n} · Expected: second refund refused "Insufficient Balance in 'Withdraw From' Account"; nothing debited twice`, async () => {
          expect.soft(urls.length, `attempt ${n}: Wallet Refund drafts created for the ${ks(WALLET)} wallet. Expected 1 (second refused), got ${urls.length}; ` +
            `sessions saw: ${outcomes.map(describeOutcome).join(' | ')}`).toBe(1);
          expect.soft(outcomes.filter(refusedInsufficient).length, `attempt ${n}: sessions shown "Insufficient Balance in 'Withdraw From' Account"`).toBe(1);
          expect.soft(refundRows, `attempt ${n}: refund rows in the wallet ledger (debited ${refundRows}×)`).toBeLessThanOrEqual(1);
          expect.soft(walletAfter, `attempt ${n}: wallet balance after approving (must not go below 0)`).toBeGreaterThanOrEqual(0);
          expect.soft(walletAfter, `attempt ${n}: wallet balance = ${WALLET} − one refund`).toBe(0);
          expect.soft(accountAfter, `attempt ${n}: ${acc.name} balance (must not go below 0)`).toBeGreaterThanOrEqual(0);
          expect.soft(st.negativeRows, `attempt ${n}: Account Statement rows with a negative running balance`).toEqual([]);
        });
        if (problems) break;
      }
      note('attempts', `${problems} of ${run} attempt(s) showed the problem`);
      await second.context().close();
    });

  test('OB-ACS-010 [base] Account: 2 users debit full/over balance concurrently — second is refused',
    testCase({ id: 'OB-ACS-010', source: 'Acc Statement - OB & CB r225', priority: 'P1', critical: true }),
    async ({ page, browser }) => {
      reportedIssue();
      notChecked('Variants 2-8', 'base row only (Cash Outflow 100,000 × Cash Outflow 100,000, approved); over-balance sums, wallet refund, deposit withdraw and cash transfer rows not run');
      const BALANCE = 100000;
      const second = await secondSession(browser);
      let problems = 0;
      let run = 0;
      for (let n = 1; n <= ATTEMPTS; n++) {
        run = n;
        const acc = await precondition(n, `our MMK cash account with ${ks(BALANCE)}`, () => createCashAccount(page, { initialBalance: BALANCE }));
        if (!acc) { run--; break; }
        expect(await accountBalance(page, acc.name), 'account balance before the race').toBe(BALANCE);
        const payees = [uniqueName('Payee U1'), uniqueName('Payee U2')];
        const sessions = [page, second];

        const draftOutcomes = await test.step(`Attempt ${n} · Both users fill Cash Outflow ${ks(BALANCE)} and Submit at the same time`, async () => {
          const forms = sessions.map(p => new CashOutflowPage(p));
          for (let i = 0; i < 2; i++) {
            await forms[i].goto();
            await forms[i].fill({ payee: payees[i], amount: BALANCE, category: 'Landscaping Expenses', account: acc.name, description: uniqueName('OB-ACS-010 outflow') });
          }
          const r = await race(sessions, forms.map(f => () => f.submitButton.click()));
          const o = await Promise.all(sessions.map(p => outcome(p)));
          recordRace(`attempt ${n} outflow drafts`, r, o);
          return o;
        });

        const urls: string[] = [];
        for (const payee of payees) urls.push(...await draftUrls(page, payee));
        note('observed', `attempt ${n}: ${urls.length} outflow draft(s) created`);

        let approveOutcomes: Outcome[] = [];
        await test.step(`Attempt ${n} · Both users approve their outflow at the same time`, async () => {
          if (urls.length >= 2) {
            approveOutcomes = await approveRace(sessions, urls.slice(0, 2), `attempt ${n} approve both outflows`);
            await evidence(page, `OB-ACS-010_a${n}_session1`);
            await evidence(second, `OB-ACS-010_a${n}_session2`);
          } else if (urls.length === 1) {
            await page.goto(urls[0]);
            await page.getByRole('button', { name: 'Approve', exact: true }).click();
            approveOutcomes = [await outcome(page)];
          }
        });

        const accountAfter = await accountBalance(page, acc.name);
        await evidence(page, `OB-ACS-010_a${n}_account`);
        const st = await statementToday(page, acc, /OB-ACS-010 outflow/, `OB-ACS-010_a${n}_statement`);
        const approved = approveOutcomes.filter(o => succeeded(o, /approv|success/i) && !refusedInsufficient(o)).length;
        note('money', `attempt ${n}: account ${BALANCE} → ${accountAfter}; statement closing ${fmt(st.closing)}, PV rows ${st.pvRows.length}; ` +
          `drafts: ${draftOutcomes.map(describeOutcome).join(' | ')}; approve: ${approveOutcomes.map(describeOutcome).join(' | ') || 'none'}`);

        const bad = accountAfter < 0 || st.pvRows.length > 1 || st.closing < 0n || approveOutcomes.filter(refusedInsufficient).length + (2 - urls.length) < 1;
        if (bad) problems++;
        await test.step(`Attempt ${n} · Expected: second outflow refused "Insufficient balance"; account never below 0`, async () => {
          expect.soft(approveOutcomes.filter(refusedInsufficient).length + (2 - urls.length),
            `attempt ${n}: second outflow refused with "Insufficient balance" (at draft or approval). Drafts: ${draftOutcomes.map(describeOutcome).join(' | ')}; ` +
            `approvals: ${approveOutcomes.map(describeOutcome).join(' | ')}`).toBe(1);
          expect.soft(approved, `attempt ${n}: outflows approved`).toBe(1);
          expect.soft(st.pvRows.length, `attempt ${n}: PV rows in the Account Statement (debited ${st.pvRows.length}×): ${st.pvRows.join(' ;; ')}`).toBe(1);
          expect.soft(accountAfter, `attempt ${n}: ${acc.name} balance (expected 0, must not go below 0)`).toBe(0);
          expect.soft(fmt(st.closing), `attempt ${n}: Account Statement closing balance`).toBe(fmt(0n));
          expect.soft(st.negativeRows, `attempt ${n}: Account Statement rows with a negative running balance`).toEqual([]);
        });
        if (problems) break;
      }
      note('attempts', `${problems} of ${run} attempt(s) showed the problem`);
      await second.context().close();
    });
});
