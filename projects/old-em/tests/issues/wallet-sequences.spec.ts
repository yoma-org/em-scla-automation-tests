// Reported Old EM wallet issues (people were not sure they are real): each test runs the em case that targets the
// issue on Old EM and checks its Expected result exactly, on its own apartments / accounts (QE OLD <date>-<rand> …).
//
//   OB-WAL-011  (features/balances/20-wallet-ob-cb.md) one wallet transaction followed by another (5 variants)
//   OB-WAL-002  back-dated wallet RV from an unknown receipt (all 4 variants; 1st / mid / last day of last month)
//   WAL-017     delete a draft credit note (features/16-wallet.md)
//   WAL-033     removing a draft credit note leaves no wallet transaction behind (docs/test-cases/extra-cases.md, Old EM only)
//
// Wallet ledger = Apartment › Wallet: Date · Description · DR (+) · CR (−) · Balance, one month at a time, first row
// "Opening Balance". Old EM has no delete for posted documents: the data stays on UAT.
import { test } from '@fixtures/wallet.fixture';
import { expect } from '@fixtures';
import type { Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { caseIssue, notChecked, runningBalanceErrors } from '@helpers/balanceChecks';
import { toast } from '@components/Toast';
import { chooseOption, formField } from '@components/PrimeSelect';
import { createApartment, createCashAccount, type Apartment, type CashAccount } from '@data/builders';
import { rechargeWallet } from '@data/wallet';
import { createUnpaidInvoice, LOCATION } from '@data/collection';
import { createInvoice, pickDay, typeAmount } from '@data/balances';
import { approveDraft, ks, topbarDraftLink } from '@pages/wallet/common';
import { ApartmentWalletPage } from '@pages/wallet/ApartmentWalletPage';
import { CreditNoteDraftsPage } from '@pages/wallet/DraftPages';
import { ApartmentLedgerPage, type LedgerRow } from '@pages/balances/ApartmentLedgerPage';
import { MakePaymentPage, ApartmentSoaTab } from '@pages/wallet/MoneyPages';
import { UnknownReceivedPage } from '@pages/collection/UnknownReceivedPage';
import { waitIdle } from '@pages/collection/common';
import { UnknownAssignPage } from '@pages/collection/UnknownAssignPage';
import { dmy, fmt, month, today } from '@pages/balances/money';

// Wallet ledger columns: Date · Description · DR (+) · CR (−) · Balance
const DR = 2, CR = 3;
type Day = { y: number; m: number; d: number };
const mm = (x: { y: number; m: number }) => `${String(x.m).padStart(2, '0')}/${x.y}`;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function reportedIssue(description: string) {
  test.info().annotations.push({ type: 'reported issue', description });
}

function walletNotChecked() {
  notChecked('Apartment Wallet PDF', 'PDF content is not parsed (no PDF reader in the framework)');
  notChecked('API › Wallet by Apartment / Wallet PDF', 'tests assert on screens; Old EM API responses are AES-encrypted');
}

/** A wallet ledger line the test expects: description pattern, date, DR (+) or CR (−) amount in Ks. */
interface Expected { what: string; desc: RegExp; date: Day; dr?: number; cr?: number }

/**
 * Checks one month of an apartment's wallet ledger against the expected lines (in order): each line once, with
 * its date, number and amount; no other line; running balance; opening as given. Returns the month's closing.
 */
async function checkWalletMonth(page: Page, ledger: ApartmentLedgerPage, id: string, label: string,
  opening: number, lines: Expected[]): Promise<bigint> {
  const rows: LedgerRow[] = await ledger.rows();
  const body = rows.slice(1);
  const shown = rows.map(r => r.text).join(' / ');
  await evidence(page, `${id}_${label}`);
  expect.soft(rows[0]?.cells[1] ?? '', `${label}: first row is the Opening Balance`).toMatch(/^Opening Balance/);
  expect.soft(fmt(rows[0]?.balance ?? 0n), `${label}: Opening Balance`).toBe(fmt(BigInt(opening * 100)));
  let index = -1;
  for (const e of lines) {
    const found = body.map((r, i) => ({ r, i })).filter(x => e.desc.test(x.r.cells[1]));
    expect.soft(found.length, `${label}: one "${e.what}" line (${e.desc}); rows: ${shown}`).toBe(1);
    if (found.length !== 1) continue;
    const { r, i } = found[0];
    expect.soft(i, `${label}: "${e.what}" comes after the previous transaction`).toBeGreaterThan(index);
    index = i;
    expect.soft(r.date, `${label}: "${e.what}" date`).toBe(dmy(e.date));
    expect.soft(r.cells[DR] || '', `${label}: "${e.what}" DR`).toBe(e.dr ? ks(e.dr) : '');
    expect.soft(r.cells[CR] || '', `${label}: "${e.what}" CR`).toBe(e.cr ? ks(e.cr) : '');
  }
  expect.soft(body.length, `${label}: only the expected ${lines.length} transaction line(s); rows: ${shown}`).toBe(lines.length);
  for (const err of runningBalanceErrors(rows, DR, CR)) expect.soft(err, `${label}: running balance`).toBe('');
  const expected = opening + lines.reduce((s, e) => s + (e.dr ?? 0) - (e.cr ?? 0), 0);
  const closing = rows.length ? rows[rows.length - 1].balance : 0n;
  expect.soft(fmt(closing), `${label}: closing balance = ${opening} + DR − CR`).toBe(fmt(BigInt(expected * 100)));
  return closing;
}

/** "Current Balance" header (hidden while 0) = the ledger's closing balance and the expected amount. */
async function checkCurrentBalance(ledger: ApartmentLedgerPage, label: string, expected: number) {
  const shown = (await ledger.currentBalance.count()) ? await ledger.currentBalanceCents() : 0n;
  expect.soft(fmt(shown), `${label}: "MMK Wallet Current Balance"`).toBe(fmt(BigInt(expected * 100)));
}

/** Opening Balance of the month after `closingMonth` = its closing balance. */
async function checkNextMonthOpening(page: Page, ledger: ApartmentLedgerPage, id: string, label: string,
  closingMonth: { y: number; m: number }, closing: bigint) {
  const i = closingMonth.y * 12 + closingMonth.m; // next month, 1-based → index
  const next = { y: Math.floor(i / 12), m: (i % 12) + 1 };
  await ledger.selectMonth(next.y, next.m);
  await evidence(page, `${id}_${label}-next-month`);
  expect.soft(fmt(await ledger.openingBalance()), `${label}: Opening Balance 01/${mm(next)} = closing balance of ${mm(closingMonth)}`).toBe(fmt(closing));
}

/** Wallet tab of an apartment: it can take well over 15 s to load on UAT, so wait (and reload once) for the ledger. */
async function openWallet(page: Page, ledger: ApartmentLedgerPage, apartmentId: string) {
  await expect(async () => {
    await page.goto(`/apartments/${apartmentId}/wallet`);
    await ledger.openingRow().first().waitFor({ timeout: 45_000 });
  }).toPass({ timeout: 120_000 });
  await page.waitForLoadState('networkidle');
}

// ── Wallet actions on our apartments ──────────────────────────────────────────────────────

/** Add Credit Note (draft) then approve it from the CN draft list. */
async function creditNote(page: Page, apt: Apartment, amount: number) {
  const wallet = new ApartmentWalletPage(page);
  await wallet.goto(apt.id);
  await wallet.doCreditNote(amount, 'Others - EM', 'QE OLD credit note');
  await expect(toast(page, 'Wallet Credit Note has been drafted successfully')).toBeVisible();
  const drafts = new CreditNoteDraftsPage(page);
  await drafts.goto();
  await expect(drafts.row(apt.name), `CN draft of ${apt.name}`).toHaveCount(1);
  await drafts.manageLink(apt.name).click();
  await expect(page).toHaveURL(/\/apartments\/wallet\/\d+\/draft$/);
  await page.getByRole('textbox', { name: 'Apartment' }).waitFor();
  await page.waitForLoadState('networkidle');
  await approveDraft(page);
}

async function walletTransfer(page: Page, from: Apartment, to: Apartment, amount: number) {
  const wallet = new ApartmentWalletPage(page);
  await wallet.goto(from.id);
  await wallet.doTransfer(to.name, amount, 'QE OLD wallet transfer');
  await expect(toast(page, 'Wallet Transfer has been created successfully')).toBeVisible();
}

/** Make Payment with the Wallet method, paying the invoice in full. Returns the WP number shown in the SOA. */
async function walletPayment(page: Page, id: string, apt: Apartment, invoice: { code: string; total: number }): Promise<string> {
  const pay = new MakePaymentPage(page);
  await page.goto(`/apartments/${apt.id}/make-payment`);
  await pay.waitLoaded();
  await expect(pay.invoiceRow(invoice.code)).toHaveCount(1);
  await pay.chooseLocation('MO - CL');
  await pay.chooseMethod('Wallet');
  await pay.payInFull(invoice.code);
  await expect.soft(pay.receivedAmount, 'WP: Received Amount = invoice amount').toHaveValue(ks(invoice.total));
  await pay.remark.fill('QE OLD wallet payment');
  await pay.confirmButton.click();
  const ok = await expect(page).toHaveURL(new RegExp(`/apartments/${apt.id}/soa$`), { timeout: 30_000 }).then(() => true, () => false);
  if (!ok) {
    await evidence(page, `${id}_wallet-payment-refused`);
    const t = (await toast(page).count()) ? (await toast(page).innerText()).trim() : '(no message)';
    expect(ok, `Wallet Payment of ${ks(invoice.total)} for ${invoice.code} should be accepted; Old EM stays on Make Payment: ${t}`).toBe(true);
  }
  const soa = new ApartmentSoaTab(page);
  await soa.waitLoaded();
  const row = soa.row(new RegExp(`Payment for ${esc(invoice.code)}`));
  await expect.soft(row, `SOA: payment row for ${invoice.code}`).toHaveCount(1);
  const wp = (await row.count()) ? ((await row.first().innerText()).match(/\bWP-\d+/)?.[0] ?? '') : '';
  expect.soft(wp, 'SOA: the payment is a wallet payment WP-…').toMatch(/^WP-\d+$/);
  await expect.soft(row.first(), 'SOA: WP amount').toContainText(ks(invoice.total));
  await expect.soft(soa.balanceDue(), 'SOA: Balance Due after paying the invoice in full').toContainText(ks(0));
  await evidence(page, `${id}_soa`);
  return wp;
}

// ── OB-WAL-011 ────────────────────────────────────────────────────────────────────────────

type Kind = 'RV' | 'CN' | 'WTin' | 'WTout' | 'WP';
interface SeqVariant { label: string; source: string; issue: string; first: Kind; second: Kind }

const SEQ: SeqVariant[] = [
  { label: '1st=Credit Note(CN); then 2nd=Wallet Payment(WP)', source: 'Wallet - OB & CB r124', issue: 'Wallet: Wallet Payment after Credit Note (can reproduce)', first: 'CN', second: 'WP' },
  { label: '1st=Wallet Transfer WT (Cash In); then 2nd=Wallet Payment(WP)', source: 'Wallet - OB & CB r112', issue: 'Wallet: Wallet Payment after Wallet Transfer (cannot reproduce)', first: 'WTin', second: 'WP' },
  { label: '1st=Wallet Transfer WT (Cash out); then 2nd=Wallet Payment(WP)', source: 'Wallet - OB & CB r118', issue: 'Wallet: Wallet Payment after Wallet Transfer (cannot reproduce)', first: 'WTout', second: 'WP' },
  { label: '1st=Wallet Recharge(RV); then 2nd=Wallet Transfer WT (Cash In)', source: 'Wallet - OB & CB r94', issue: 'Wallet: Wallet Transfer after RV (cannot reproduce)', first: 'RV', second: 'WTin' },
  { label: '1st=Wallet Recharge(RV); then 2nd=Wallet Transfer WT (Cash out)', source: 'Wallet - OB & CB r95', issue: 'Wallet: Wallet Transfer after RV (cannot reproduce)', first: 'RV', second: 'WTout' }
];

const AMOUNT: Record<Kind, number> = { RV: 50_000, CN: 50_000, WTin: 30_000, WTout: 20_000, WP: 10_000 };

test.describe('Reported wallet issues · OB-WAL-011 sequences', () => {
  for (const v of SEQ) {
    test(`OB-WAL-011 [${v.label}] Wallet OB/CB continuity — one transaction type followed by another`,
      testCase({ id: 'OB-WAL-011', source: v.source, priority: 'P1', critical: true }),
      async ({ page }) => {
        test.setTimeout(600_000);
        reportedIssue(v.issue);
        walletNotChecked();
        notChecked('Test way: time of the transactions', 'both transactions are made today, one after the other');
        const id = `OB-WAL-011_${v.first}-${v.second}`; // evidence names, one set per variant
        const t = today();
        const kinds = [v.first, v.second];
        const needsOther = kinds.some(k => k === 'WTin' || k === 'WTout');

        // X = the apartment under test; Y = the other side of a wallet transfer.
        // Wallet Transfer lists every apartment (no owner needed), so no owner is set up: the owner step of the
        // apartment builder is flaky on UAT (Edit tab resets the added row while it loads).
        const x = await test.step('Precondition: our apartment', () => createApartment(page));
        const y = needsOther ? await test.step('Precondition: second apartment (other side of the transfer)', () => createApartment(page)) : undefined;
        let account: CashAccount | undefined;
        const needsAccount = kinds.includes('RV') || kinds.includes('WTin') || kinds.includes('WTout');
        if (needsAccount) account = await test.step('Precondition: our cash account', () => createCashAccount(page));
        const invoice = kinds.includes('WP') ? await test.step('Precondition: unpaid invoice (10,000 Ks + 5% tax), approved', async () => {
          const inv = await createInvoice(page, x, { price: 10_000 });
          return { code: inv.code, total: Number(inv.total) / 100 };
        }) : undefined;

        const lines: Expected[] = [];
        const yLines: Expected[] = [];
        if (v.first === 'WTout') {
          // A transfer out needs a wallet balance first.
          await test.step('Precondition: recharge 50,000 Ks so the wallet can transfer out', async () => {
            const { rv } = await rechargeWallet(page, x, account!, 50_000);
            lines.push({ what: `recharge ${rv}`, desc: new RegExp(`^${rv} \\( Wallet Cash Received \\)`), date: t, dr: 50_000 });
          });
          caseIssue('1st transaction is a transfer out: the wallet is recharged with 50,000 Ks first (precondition, not in the case)');
        }

        let wp = '';
        for (const [n, k] of kinds.entries()) {
          const amount = k === 'WP' ? invoice!.total : AMOUNT[k];
          await test.step(`${n === 0 ? '1st' : '2nd'}: ${k} ${ks(amount)}`, async () => {
            if (k === 'RV') {
              const { rv } = await rechargeWallet(page, x, account!, amount);
              lines.push({ what: `recharge ${rv}`, desc: new RegExp(`^${rv} \\( Wallet Cash Received \\)`), date: t, dr: amount });
            } else if (k === 'CN') {
              await creditNote(page, x, amount);
              lines.push({ what: 'approved credit note', desc: /^CN-\d+ \( Wallet Credit Received \)/, date: t, dr: amount });
            } else if (k === 'WTin') {
              const { rv } = await rechargeWallet(page, y!, account!, amount);
              yLines.push({ what: `recharge ${rv}`, desc: new RegExp(`^${rv} \\( Wallet Cash Received \\)`), date: t, dr: amount });
              await walletTransfer(page, y!, x, amount);
              const wt = new RegExp(`^WT-\\d+ \\( Wallet Transfer from ${esc(y!.name)} to ${esc(x.name)} \\)`);
              lines.push({ what: 'wallet transfer in', desc: wt, date: t, dr: amount });
              yLines.push({ what: 'wallet transfer out', desc: wt, date: t, cr: amount });
            } else if (k === 'WTout') {
              await walletTransfer(page, x, y!, amount);
              const wt = new RegExp(`^WT-\\d+ \\( Wallet Transfer from ${esc(x.name)} to ${esc(y!.name)} \\)`);
              lines.push({ what: 'wallet transfer out', desc: wt, date: t, cr: amount });
              yLines.push({ what: 'wallet transfer in', desc: wt, date: t, dr: amount });
            } else {
              wp = await walletPayment(page, `${id}_${n + 1}-WP`, x, invoice!);
              lines.push({ what: `wallet payment ${wp || 'WP'}`, desc: wp ? new RegExp(`^${wp}\\b`) : /^WP-\d+/, date: t, cr: amount });
            }
          });
        }

        const ledger = new ApartmentLedgerPage(page, 'wallet');
        const expectedBalance = lines.reduce((s, e) => s + (e.dr ?? 0) - (e.cr ?? 0), 0);
        await test.step(`Check area: Apartment Wallet page of ${x.name} (transaction dates, numbers, balance)`, async () => {
          await openWallet(page, ledger, x.id);
          const closing = await checkWalletMonth(page, ledger, id, 'wallet', 0, lines);
          await checkCurrentBalance(ledger, 'wallet', expectedBalance);
          await test.step('Opening Balance of the following month = closing balance of the transaction month', () =>
            checkNextMonthOpening(page, ledger, id, 'wallet', month(), closing));
        });
        if (y) {
          await test.step(`Check area: Apartment Wallet page of the other apartment ${y.name}`, async () => {
            await openWallet(page, ledger, y.id);
            const closing = await checkWalletMonth(page, ledger, id, 'other-wallet', 0, yLines);
            await checkCurrentBalance(ledger, 'other wallet', yLines.reduce((s, e) => s + (e.dr ?? 0) - (e.cr ?? 0), 0));
            await checkNextMonthOpening(page, ledger, id, 'other-wallet', month(), closing);
          });
        }
      });
  }
});

// ── OB-WAL-002 ────────────────────────────────────────────────────────────────────────────

interface BackVariant { label: string; source: string; currency: 'MMK' | 'USD'; overflow: boolean }
const BACK: BackVariant[] = [
  { label: 'base', source: 'Wallet - OB & CB r10', currency: 'MMK', overflow: false },
  { label: 'Type=Convert other currency unknown RV to wallet RV direct to wallet; Date=Back date (1st/mid/last day of month)', source: 'Wallet - OB & CB r11', currency: 'USD', overflow: false },
  { label: 'Type=When assigning the unknown RV, it overflows and goes into the wallet.; Date=Back date (1st/mid/last day of month)', source: 'Wallet - OB & CB r12', currency: 'MMK', overflow: true },
  { label: 'Type=When assigning the other currency unknown RV, it overflows and goes into the wallet.; Date=Back date (1st/mid/last day of month)', source: 'Wallet - OB & CB r13', currency: 'USD', overflow: true }
];

/**
 * Unknown Received Allocation row: the list (and its server-side keyword search / currency filter) reloads after
 * it renders and can drop what was typed, so open, filter and search again until the row shows.
 */
async function allocationRow(page: Page, currency: 'MMK' | 'USD', keyword: string, also?: string) {
  const form = new UnknownReceivedPage(page);
  let row = form.allocationRow(keyword);
  if (also) row = row.filter({ hasText: also });
  await expect(async () => {
    await form.goto();
    await form.openAllocation();
    if (currency !== 'MMK') {
      await chooseOption(page, page.getByRole('tabpanel', { name: 'Unknown Received Allocation' }).getByRole('combobox').first(), currency);
      await waitIdle(page);
    }
    await page.waitForLoadState('networkidle');
    await form.searchAllocation(keyword);
    await page.waitForLoadState('networkidle');
    await waitIdle(page);
    await expect(row).toHaveCount(1, { timeout: 10_000 });
  }).toPass({ timeout: 120_000 });
  return row;
}

/** Unknown Received (back-dated) into our bank account. Returns the RV number. */
async function unknownReceipt(page: Page, bank: CashAccount, currency: 'MMK' | 'USD', amount: number, day: Day): Promise<string> {
  const form = new UnknownReceivedPage(page);
  await form.goto();
  if (currency !== 'MMK') await chooseOption(page, form.currency, currency);
  await pickDay(page, page.getByRole('tabpanel', { name: 'Unknown Received', exact: true }).getByRole('button', { name: 'Choose Date' }), day);
  await expect(form.date).toHaveValue(dmy(day).replaceAll('/', '-'));
  await form.fill({ amount, account: bank.name, location: LOCATION, remarks: 'QE OLD back-dated unknown receipt' });
  await form.submitButton.click();
  await expect(toast(page, 'Cash Receipt has been created successfully')).toBeVisible();
  const row = await allocationRow(page, currency, bank.name, dmy(day));
  const rv = (await row.getByRole('cell').nth(1).innerText()).trim();
  expect(rv).toMatch(/^RV-\d+$/);
  return rv;
}

/**
 * Assigns our unknown RV to the apartment with "Credit To Wallet" (the switch left off; on = Deposit). A USD RV is
 * converted: Invoice Currency Type MMK and "Received Amount (MMK)" typed. Checks the overflow shown before Confirm.
 */
async function assignToWallet(page: Page, id: string, bank: CashAccount, currency: 'MMK' | 'USD', rv: string, apt: Apartment,
  received: number, overflow: number) {
  const form = new UnknownReceivedPage(page);
  const assign = new UnknownAssignPage(page);
  const row = await allocationRow(page, currency, rv);
  await waitIdle(page);
  await (await form.manageLink(row)).click();
  await assign.waitLoaded();
  await assign.apartmentSwitch.click();
  await expect(page.getByRole('switch').first()).toBeChecked();
  await assign.apartment.choose(apt.name);
  await page.waitForLoadState('networkidle');
  if (currency !== 'MMK') {
    await chooseOption(page, formField(page, 'Invoice Currency Type').getByRole('combobox'), 'MMK');
    await typeAmount(page, page.getByRole('textbox', { name: /^Received Amount \(MMK\)/ }), received);
  }
  const creditTo = page.getByRole('switch').nth(1);
  await expect(creditTo, '"Credit To Wallet" (off) — on means Deposit').not.toBeChecked();
  const rest = page.getByText('Deposit', { exact: true }).locator('xpath=following::input[1]');
  await expect.soft(rest, `amount credited to the wallet before Confirm (received ${received} − invoices)`).toHaveValue(new RegExp(`^${overflow.toLocaleString('en-US').replace(/,/g, ',?')}\\.00$`));
  await assign.remark.fill('QE OLD to wallet');
  await evidence(page, `${id}_assign-${rv}`);
  await assign.confirmButton.click();
  await expect(toast(page, 'Unknown Payment successfully assigned')).toBeVisible();
}

function lastDayOf(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

test.describe('Reported wallet issues · OB-WAL-002 back-dated wallet RV', () => {
  for (const v of BACK) {
    test(`OB-WAL-002 [${v.label}] Wallet OB/CB continuity after back-dated wallet recharge RV — by source × day`,
      testCase({ id: 'OB-WAL-002', source: v.source, priority: 'P1', critical: true }),
      async ({ page }) => {
        test.setTimeout(900_000);
        reportedIssue('Balance issue: backdated transaction');
        walletNotChecked();
        const id = `OB-WAL-002_${v.currency}${v.overflow ? '-overflow' : ''}`; // evidence names, one set per variant
        const prev = month(-1);
        const days: Day[] = [1, 15, lastDayOf(prev.y, prev.m)].map(d => ({ y: prev.y, m: prev.m, d }));
        test.info().annotations.push({ type: 'test data', description: `back dates ${days.map(dmy).join(', ')} (1st / mid / last day of last month), one RV each; ${v.currency}${v.currency === 'USD' ? ' RV converted to MMK (2,000 Ks a dollar)' : ''}${v.overflow ? '; each RV first pays a back-dated invoice of the same day, the rest overflows to the wallet' : ''}` });

        const apt = await test.step('Precondition: our apartment', () => createApartment(page));
        const bank = await test.step(`Precondition: our ${v.currency} bank account (Unknown Received takes bank accounts only)`, () =>
          createCashAccount(page, { type: 'BANK', currency: v.currency }));

        const toWallet = [1_000, 2_000, 4_000];
        const lines: Expected[] = [];
        for (const [i, day] of days.entries()) {
          await test.step(`Back date ${dmy(day)}: unknown RV → wallet ${ks(toWallet[i])}`, async () => {
            let invoiceTotal = 0;
            if (v.overflow) {
              const inv = await createInvoice(page, apt, { price: 1000, date: day });
              invoiceTotal = Number(inv.total) / 100;
            }
            const received = invoiceTotal + toWallet[i]; // MMK reaching the apartment
            const usd = received / 2000;
            const rv = await unknownReceipt(page, bank, v.currency, v.currency === 'USD' ? usd : received, day);
            await assignToWallet(page, `${id}_${i + 1}`, bank, v.currency, rv, apt, received, toWallet[i]);
            lines.push({ what: `wallet RV ${rv} of ${dmy(day)}`, desc: new RegExp(`^${rv}\\b`), date: day, dr: toWallet[i] });
          });
        }
        const total = toWallet.reduce((a, b) => a + b, 0);

        const ledger = new ApartmentLedgerPage(page, 'wallet');
        await openWallet(page, ledger, apt.id);
        let closingPrev = 0n;
        await test.step(`Wallet ${mm(prev)}: RV dates and numbers, balance calculation, closing balance of each transaction date`, async () => {
          await ledger.selectMonth(prev.y, prev.m);
          closingPrev = await checkWalletMonth(page, ledger, id, 'wallet-back-month', 0, lines);
        });
        await test.step(`Opening Balance of the following month (${mm(month())}) = closing balance of ${mm(prev)}; no line in ${mm(month())}`, async () => {
          await ledger.selectMonth(month().y, month().m);
          await evidence(page, `${id}_wallet-this-month`);
          expect.soft(fmt(await ledger.openingBalance()), `Opening Balance 01/${mm(month())} = closing balance of ${mm(prev)}`).toBe(fmt(closingPrev));
          const rows = await ledger.rows();
          expect.soft(rows.length - 1, `no wallet line in ${mm(month())} (the RVs are back-dated); rows: ${rows.map(r => r.text).join(' / ')}`).toBe(0);
          expect.soft(fmt(rows[rows.length - 1].balance), `closing balance ${mm(month())}`).toBe(fmt(BigInt(total * 100)));
        });
        await test.step('Balance Amount in Apartment > Wallet screen = sum of the RVs', () => checkCurrentBalance(ledger, 'wallet', total));
        await test.step('Opening Balance of next month = closing balance of this month', () =>
          checkNextMonthOpening(page, ledger, id, 'wallet', month(), BigInt(total * 100)));
      });
  }
});

// ── WAL-017 / WAL-033: removing a draft credit note ──────────────────────────────────────

const CN_ISSUE = 'Incomplete deletion on rejection (credit note)';

async function cnCounter(page: Page): Promise<number> {
  const link = page.locator('a[href="/apartments/wallet/credit-note-draft"]').filter({ hasText: /^\d+$/ }).first();
  if (!(await link.count())) return 0; // Old EM hides the counter at 0
  return Number((await link.innerText()).trim());
}

test.describe('Reported wallet issues · credit note removal', () => {
  test('WAL-017 Delete draft credit note',
    testCase({ id: 'WAL-017', source: 'TC_Wallet_023', priority: 'P2' }),
    async ({ page, walletPage: wallet, creditNoteDraftsPage: drafts }) => {
      test.setTimeout(300_000);
      reportedIssue(CN_ISSUE);
      const apt = await createApartment(page);
      await test.step('Precondition: a credit note draft on our apartment', async () => {
        await wallet.goto(apt.id);
        await wallet.doCreditNote(100_000, 'Others - EM', 'QE OLD WAL-017');
        await expect(toast(page, 'Wallet Credit Note has been drafted successfully')).toBeVisible();
      });

      await test.step('1-2. Choose the credit note (top bar CN), click Manage', async () => {
        await topbarDraftLink(page, 'CN').click();
        await expect(page).toHaveURL(/\/apartments\/wallet\/credit-note-draft$/);
        await drafts.waitLoaded();
        await expect(drafts.row(apt.name), `CN draft of ${apt.name}`).toHaveCount(1);
        await drafts.manageLink(apt.name).click();
        await expect(page).toHaveURL(/\/apartments\/wallet\/\d+\/draft$/);
        await page.waitForLoadState('networkidle');
      });

      await test.step('3. Click delete', async () => {
        const del = page.getByRole('button', { name: 'Delete', exact: true });
        const remove = page.getByRole('button', { name: 'Remove', exact: true });
        await expect(del.or(remove).first()).toBeVisible();
        if (!(await del.isVisible())) caseIssue('The draft credit note page has [Approve] [Remove], no "Delete" button (admin is creator and approver): "Remove" used');
        await (await del.isVisible() ? del : remove).click();
        const yes = page.getByRole('alertdialog').getByRole('button', { name: /^Yes/ });
        if (await yes.waitFor({ timeout: 2_000 }).then(() => true, () => false)) await yes.click();
      });

      await test.step('Expected 1: transaction deleted successfully', async () => {
        const t = toast(page);
        await expect(t).toBeVisible();
        const text = (await t.innerText()).trim();
        test.info().annotations.push({ type: 'toast', description: text });
        await evidence(page, 'WAL-017_deleted');
        expect.soft(text, 'success message').toMatch(/deleted successfully/i);
        await drafts.goto();
        await expect.soft(drafts.row(apt.name), 'the draft left the CN draft list').toHaveCount(0);
        await wallet.goto(apt.id);
        await expect.soft(wallet.row(/Wallet Credit Received/), 'no credit note line in the wallet').toHaveCount(0);
        expect.soft(await wallet.balance(), 'wallet balance unchanged (0)').toBe(0);
      });
    });

  test('WAL-033 Removing a draft credit note leaves no wallet or account transaction behind',
    testCase({ id: 'WAL-033', priority: 'P1', critical: true }),
    async ({ page, walletPage: wallet, creditNoteDraftsPage: drafts }) => {
      test.setTimeout(600_000);
      reportedIssue(CN_ISSUE);
      notChecked('Dashboard - Wallet & Deposits', 'UAT-wide total moves with other testers\' runs, so a delta cannot be tied to this test');
      notChecked('Precondition 3 (a second user)', 'no APPROVER account for Old EM in .env: admin, who can approve, removes the draft');
      const id = 'WAL-033';
      const t = today();
      const apt = await createApartment(page);
      const account = await createCashAccount(page);
      const invoice = await test.step('Precondition: unpaid UO invoice of 50,000 Ks (paid in step 5)', () => createUnpaidInvoice(page, apt, 500));
      const { rv } = await test.step('Precondition 2: wallet balance 50,000 Ks from a wallet recharge', () => rechargeWallet(page, apt, account, 50_000));
      const rvLine: Expected = { what: `recharge ${rv}`, desc: new RegExp(`^${rv} \\( Wallet Cash Received \\)`), date: t, dr: 50_000 };
      const ledger = new ApartmentLedgerPage(page, 'wallet');

      let before = 0;
      await test.step('1. Note the wallet balance and this month\'s wallet transactions', async () => {
        await openWallet(page, ledger, apt.id);
        await checkWalletMonth(page, ledger, id, 'wallet-step1', 0, [rvLine]);
        before = (await ledger.currentBalance.count()) ? Number(await ledger.currentBalanceCents()) / 100 : 0;
        expect(before, 'wallet balance before').toBe(50_000);
      });

      let counterWithDraft = 0;
      await test.step('2. Add a credit note of 10,000 Ks (draft)', async () => {
        await wallet.goto(apt.id);
        await wallet.doCreditNote(10_000, 'Others - EM', 'QE OLD WAL-033');
        await expect(toast(page, 'Wallet Credit Note has been drafted successfully')).toBeVisible();
        await wallet.waitLoaded();
        counterWithDraft = await cnCounter(page);
      });

      await test.step('3. As approver: CN draft list from the top bar › Manage › Remove', async () => {
        await topbarDraftLink(page, 'CN').click();
        await expect(page).toHaveURL(/\/apartments\/wallet\/credit-note-draft$/);
        await drafts.waitLoaded();
        await expect(drafts.row(apt.name), `CN draft of ${apt.name}`).toHaveCount(1);
        await expect.soft(drafts.row(apt.name)).toContainText(ks(10_000));
        await drafts.manageLink(apt.name).click();
        await expect(page).toHaveURL(/\/apartments\/wallet\/\d+\/draft$/);
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Remove', exact: true }).click();
        const yes = page.getByRole('alertdialog').getByRole('button', { name: /^Yes/ });
        if (await yes.waitFor({ timeout: 2_000 }).then(() => true, () => false)) await yes.click();
        await expect(toast(page, /deleted successfully|removed successfully/i)).toBeVisible();
      });

      await test.step('Expected 1: draft gone from the CN draft list; top-bar CN counter back down', async () => {
        await drafts.goto();
        await expect.soft(drafts.row(apt.name), 'removed draft left the CN draft list').toHaveCount(0);
        const counter = await cnCounter(page);
        await evidence(page, `${id}_cn-draft-list`);
        // Shared counter: other testers can add / approve CN drafts meanwhile, so allow it to be lower, never higher.
        expect.soft(counter, `top-bar CN counter after removal (was ${counterWithDraft} with our draft)`).toBeLessThanOrEqual(counterWithDraft - 1);
      });

      await test.step('Expected 2: wallet balance as in step 1; no credit note line; Opening / Closing Balance', async () => {
        await openWallet(page, ledger, apt.id);
        const closing = await checkWalletMonth(page, ledger, id, 'wallet-after-remove', 0, [rvLine]);
        await checkCurrentBalance(ledger, 'wallet after removal', before);
        await checkNextMonthOpening(page, ledger, id, 'wallet-after-remove', month(), closing);
      });

      await test.step('Check area: SOA has no credit note line', async () => {
        const soa = new ApartmentSoaTab(page);
        await soa.goto(apt.id);
        await expect.soft(soa.row(/Credit|CN-\d+/), 'SOA: no credit note line').toHaveCount(0);
        await evidence(page, `${id}_soa-after-remove`);
      });

      await test.step('Expected 3: Report › Credit Note does not list the removed credit note', async () => {
        await page.goto('/reports/credit-notes');
        const table = page.getByRole('table');
        await table.getByRole('row').nth(1).waitFor();
        await page.waitForLoadState('networkidle');
        const rpp = page.getByRole('combobox', { name: 'Rows per page' });
        if (await rpp.count()) await chooseOption(page, rpp, '100');
        await page.waitForLoadState('networkidle');
        const rows = table.getByRole('row').filter({ has: page.getByRole('cell', { name: apt.name, exact: true }) });
        await evidence(page, `${id}_report-credit-note`);
        await expect.soft(rows, `Credit Note report rows of ${apt.name}`).toHaveCount(0);
        notChecked('Report › Credit Note beyond its first 100 rows', 'the report is newest first (last 30 days); a removed draft would be on the first page');
      });

      await test.step('5 / Expected 4: wallet payment of the full step-1 balance succeeds and leaves the wallet at 0.00', async () => {
        expect(invoice.total, 'invoice amount = step-1 wallet balance').toBe(before);
        const wp = await walletPayment(page, `${id}_5-WP`, apt, invoice);
        await openWallet(page, ledger, apt.id);
        const closing = await checkWalletMonth(page, ledger, id, 'wallet-after-payment', 0,
          [rvLine, { what: `wallet payment ${wp}`, desc: wp ? new RegExp(`^${wp}\\b`) : /^WP-\d+/, date: t, cr: before }]);
        expect.soft(fmt(closing), 'wallet closing balance after paying the full balance').toBe(fmt(0n));
        await checkCurrentBalance(ledger, 'wallet after payment', 0);
      });
    });
});
