// Reported Old EM issue "Missing audit trails (Created By / Approved By)" — RPT-036
// (docs/test-cases/extra-cases.md, an Old EM extra case, not in the EM catalog). One run per document type: the test makes the document on its
// own apartment / accounts (reusing the area builders), approves it when it needs approval, then reads
// "Created By" / "Approved By" on the document's list, its detail / voucher and the matching report.
// No APPROVER_* account on this UAT: admin is maker AND approver, so both names are the admin's.
// Where each screen keeps the names: src/pages/reports/AuditTrail.ts.
import { test } from '@fixtures/collection.fixture';
import { expect } from '@fixtures';
import { type Page } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { uniqueName } from '@helpers/names';
import { toast } from '@components/Toast';
import { createCashAccount, createUoInvoice, type Apartment } from '@data/builders';
import { createInvoiceDraft, createEmDraft, approveEmDraft, setupApartment, INV_001, INV_020 } from '@data/billing';
import { createOutflowDraft, createUnknownReceipt, createUnpaidInvoice, LOCATION } from '@data/collection';
import { rechargeWallet, addDeposit, voucherOf } from '@data/wallet';
import { InvoicesListPage } from '@pages/billing/InvoiceListsPages';
import { InvoiceDocPage } from '@pages/billing/InvoiceDocPage';
import { ApartmentDetailPage } from '@pages/apartments/ApartmentDetailPage';
import { CashOutflowPage, CashOutflowDraftsPage } from '@pages/cash/CashOutflowPage';
import { CashTransferPage, CashTransferDraftsPage } from '@pages/cash/CashTransferPage';
import { MakePaymentPage } from '@pages/collection/MakePaymentPage';
import { ApartmentSoaPage } from '@pages/collection/ApartmentSoaPage';
import { RecentReceiptsPage } from '@pages/collection/RecentReceiptsPage';
import { UnknownReceivedPage } from '@pages/collection/UnknownReceivedPage';
import { waitIdle } from '@pages/collection/common';
import { credentials } from '@utils/Environment';
import { ApartmentWalletPage } from '@pages/wallet/ApartmentWalletPage';
import { CreditNoteDraftsPage, CashOutflowDraftsPage as PvDraftsPage } from '@pages/wallet/DraftPages';
import { ApartmentDepositPage } from '@pages/deposit/ApartmentDepositPage';
import { approveDraft } from '@pages/wallet/common';
import {
  REPORTS, auditInText, auditOf, reportRow, rowFields, staffName, voucherText, type AuditFields, type ReportKey
} from '@pages/reports/AuditTrail';

const ISSUE = 'Missing audit trails (Created By / Approved By)';
const TITLE = 'Created By and Approved By are recorded for every money document — by document type';

/** A document made by the test: its code and where to read it. */
interface Doc {
  code: string;
  /** Detail page (path) when known before the report is read. */
  detail?: string;
  /** Reads the document's list; returns what it shows. */
  list: { name: string; read: () => Promise<AuditFields | 'missing'> };
}

interface Variant {
  label: string;
  approval: boolean;
  report: ReportKey;
  /** Transactions report filter, when the document is not listed without it. */
  transactionType?: string;
  make: (page: Page) => Promise<Doc>;
}

/** True once the row shows (lists load their rows after the page). */
async function present(row: import('@playwright/test').Locator): Promise<boolean> {
  return row.first().waitFor({ timeout: 20_000 }).then(() => true, () => false);
}

/** Wait for a toast and give the page time to settle. */
async function done(page: Page, text: string | RegExp): Promise<void> {
  await expect(toast(page, text)).toBeVisible({ timeout: 30_000 });
}

// ── list readers ───────────────────────────────────────────────────────────────────────────

function invoiceList(page: Page, apartment: Apartment, code: string): Doc['list'] {
  return {
    name: 'Invoices - Debit Note list',
    read: async () => {
      const list = new InvoicesListPage(page);
      await list.goto();
      await list.filterApartment(apartment.name);
      const row = list.row(code);
      if (!(await row.first().waitFor({ timeout: 20_000 }).then(() => true, () => false))) return 'missing';
      return auditOf(await rowFields(row.first()));
    }
  };
}

function walletTab(page: Page, apartmentId: string, voucher: RegExp, which: 'wallet' | 'deposit'): Doc['list'] {
  return {
    name: `Apartment ${which === 'wallet' ? 'Wallet' : 'Deposit'} tab`,
    read: async () => {
      const tab = which === 'wallet' ? new ApartmentWalletPage(page) : new ApartmentDepositPage(page);
      await tab.goto(apartmentId);
      const row = tab.row(voucher);
      if (!(await present(row))) return 'missing';
      return auditOf(await rowFields(row.first()));
    }
  };
}

/** Recent Outflows (/cash-outflows) row by PV. */
function recentOutflows(page: Page, pv: string): Doc['list'] {
  return {
    name: 'Cash Outflow › Recent Outflows',
    read: async () => {
      const form = new CashOutflowPage(page);
      await form.goto();
      const row = form.recentRows.filter({ has: page.getByRole('cell', { name: pv, exact: true }) });
      if (!(await present(row))) return 'missing';
      return auditOf(await rowFields(row.first()));
    }
  };
}

/** Approves the newest PV draft of `payee` with `description` (wallet refund / deposit withdrawal). */
async function approvePvDraft(page: Page, payee: string, description: string): Promise<void> {
  const drafts = new PvDraftsPage(page);
  await drafts.goto();
  await expect(drafts.row(payee, description)).toHaveCount(1);
  await (await drafts.manageLink(payee, description)).click();
  await expect(page).toHaveURL(/\/cash-outflows\/\d+\/draft$/);
  await approveDraft(page);
}

/** Approves an invoice / debit note draft and returns its code and detail path. */
async function approveInvoiceDraft(page: Page, draftUrl: string, kind: 'Invoice' | 'Debit Note'): Promise<{ code: string; detail: string }> {
  const doc = new InvoiceDocPage(page);
  await doc.goto(draftUrl);
  await doc.approveButton.click();
  await done(page, `${kind} has been approved successfully`);
  await expect(page).toHaveURL(/\/invoices\/\d+$/);
  await doc.refLine.waitFor();
  return { code: (await doc.ref()).code, detail: new URL(page.url()).pathname };
}

/** Code and detail path of an apartment's posted document by category (Invoices tab). */
async function postedDoc(page: Page, apartment: Apartment, category: string): Promise<{ code: string; detail: string }> {
  const detail = new ApartmentDetailPage(page);
  await detail.gotoInvoices(apartment.id);
  const row = detail.invoiceRow(category);
  await expect(row).toHaveCount(1);
  const code = (await row.getByRole('cell').first().innerText()).trim();
  const href = (await row.locator('a[href^="/invoices/"]').first().getAttribute('href'))!;
  return { code, detail: href };
}

// ── variants ───────────────────────────────────────────────────────────────────────────────

const VARIANTS: Variant[] = [
  {
    label: 'base', approval: true, report: 'invoices',
    make: async page => {
      const apt = await setupApartment(page);
      const { draftUrl } = await createInvoiceDraft(page, apt, 'invoice', INV_001);
      const { code, detail } = await approveInvoiceDraft(page, draftUrl, 'Invoice');
      return { code, detail, list: invoiceList(page, apt, code) };
    }
  },
  {
    label: 'Document=Debit Note (approved)', approval: true, report: 'invoices',
    make: async page => {
      const apt = await setupApartment(page);
      const { draftUrl } = await createInvoiceDraft(page, apt, 'debit-note', INV_020);
      const { code, detail } = await approveInvoiceDraft(page, draftUrl, 'Debit Note');
      return { code, detail, list: invoiceList(page, apt, code) };
    }
  },
  {
    label: 'Document=UO invoice (approved UO draft)', approval: true, report: 'invoices',
    make: async page => {
      const apt = await setupApartment(page);
      await createUoInvoice(page, apt, { 'Electricity (YESC)': { previous: 0, current: 10 } });
      const { code, detail } = await postedDoc(page, apt, 'Utilities');
      return { code, detail, list: invoiceList(page, apt, code) };
    }
  },
  {
    label: 'Document=EM debit note (approved EM draft)', approval: true, report: 'invoices',
    make: async page => {
      const apt = await setupApartment(page);
      await createEmDraft(page, apt, 30000, 1);
      await approveEmDraft(page, apt);
      const { code, detail } = await postedDoc(page, apt, 'Estate Mgmt Fees');
      return { code, detail, list: invoiceList(page, apt, code) };
    }
  },
  {
    label: 'Document=Make Payment RV', approval: false, report: 'cashReceived',
    make: async page => {
      const apt = await setupApartment(page);
      const acc = await createCashAccount(page);
      const inv = await createUnpaidInvoice(page, apt);
      const form = new MakePaymentPage(page);
      await form.goto(apt.id);
      await form.fill({ location: LOCATION, method: 'Cash', account: acc.name, amount: inv.total });
      await form.confirmButton.click();
      const soa = new ApartmentSoaPage(page);
      await soa.waitLoaded();
      const rv = (await soa.paymentRows(inv.code).first().innerText()).match(/RV-\d+/)?.[0];
      if (!rv) throw new Error(`No RV in the SOA payment row of ${inv.code}`);
      return {
        code: rv,
        list: {
          name: 'Cash Received › Recent Receipts',
          read: async () => {
            const receipts = new RecentReceiptsPage(page);
            await receipts.goto();
            const row = await receipts.find(rv);
            if (!(await present(row))) return 'missing';
            return auditOf(await rowFields(row.first()));
          }
        }
      };
    }
  },
  {
    label: 'Document=Unknown Received RV', approval: false, report: 'cashReceived',
    make: async page => {
      const bank = await createCashAccount(page, { type: 'BANK' });
      const { rv } = await createUnknownReceipt(page, bank, 10000);
      return {
        code: rv,
        list: {
          name: 'Cash Received › Unknown Received Allocation',
          read: async () => {
            const form = new UnknownReceivedPage(page);
            await form.goto();
            await form.openAllocation();
            await form.searchAllocation(bank.name);
            const row = form.allocationRow(rv);
            if (!(await present(row))) return 'missing';
            return auditOf(await rowFields(row.first()));
          }
        }
      };
    }
  },
  {
    label: 'Document=Cash Outflow PV (approved)', approval: true, report: 'cashOutflow',
    make: async page => {
      const acc = await createCashAccount(page, { initialBalance: 50000 });
      const { payee } = await createOutflowDraft(page, acc, 2000);
      const drafts = new CashOutflowDraftsPage(page);
      await drafts.goto();
      const row = await drafts.find(payee);
      await expect(row).toHaveCount(1);
      await drafts.openManage(row);
      await approveDraft(page);
      const form = new CashOutflowPage(page);
      await form.goto();
      const pv = (await form.recentRow(payee).getByRole('cell').nth(1).innerText()).trim();
      return { code: pv, list: recentOutflows(page, pv) };
    }
  },
  {
    label: 'Document=Cash Transfer JV (approved)', approval: true, report: 'transactions',
    make: async page => {
      const from = await createCashAccount(page, { initialBalance: 200000 });
      const to = await createCashAccount(page);
      const description = uniqueName('audit transfer');
      const form = new CashTransferPage(page);
      await form.goto();
      await form.fill({ from: from.name, to: to.name, amount: 1000, description });
      await form.submitButton.click();
      await done(page, /success/i);
      const drafts = new CashTransferDraftsPage(page);
      await drafts.goto();
      const row = await drafts.find(description);
      await expect(row).toHaveCount(1);
      await drafts.openApprove(row);
      await approveDraft(page);
      await form.goto();
      const recent = form.recentRow(description);
      await expect(recent).toHaveCount(1);
      const jv = (await recent.getByRole('cell').first().innerText()).trim();
      const detail = (await recent.locator('a[href^="/cash-transfers/"]').first().getAttribute('href')) ?? undefined;
      return {
        code: jv, detail,
        list: {
          name: 'Cash Transfer › Recent Transfers',
          read: async () => {
            await form.goto();
            const r = form.recentRow(description);
            if (!(await present(r))) return 'missing';
            return auditOf(await rowFields(r.first()));
          }
        }
      };
    }
  },
  {
    label: 'Document=Credit Note CN (approved)', approval: true, report: 'creditNote',
    make: async page => {
      const apt = await setupApartment(page);
      const wallet = new ApartmentWalletPage(page);
      await wallet.goto(apt.id);
      await wallet.doCreditNote(5000, 'Others - EM', uniqueName('audit CN'));
      await done(page, 'Wallet Credit Note has been drafted successfully');
      const drafts = new CreditNoteDraftsPage(page);
      await drafts.goto();
      await expect(drafts.row(apt.name)).toHaveCount(1);
      await drafts.manageLink(apt.name).click();
      await expect(page).toHaveURL(/\/apartments\/wallet\/\d+\/draft$/);
      await approveDraft(page);
      await wallet.goto(apt.id);
      const cn = voucherOf(await wallet.row(/Wallet Credit Received/).first().innerText());
      return { code: cn, list: walletTab(page, apt.id, new RegExp(`${cn}\\b`), 'wallet') };
    }
  },
  {
    label: 'Document=Wallet Transfer WT', approval: false, report: 'transactions', transactionType: 'Wallet Transfer',
    make: async page => {
      const from = await setupApartment(page, { owner: true });
      const to = await setupApartment(page, { owner: from.owner });
      const acc = await createCashAccount(page);
      await rechargeWallet(page, from, acc, 10000);
      const wallet = new ApartmentWalletPage(page);
      await wallet.goto(from.id);
      await wallet.doTransfer(to.name, 4000, 'QE OLD RPT-036');
      await done(page, 'Wallet Transfer has been created successfully');
      await wallet.goto(from.id);
      const wt = voucherOf(await wallet.row(/Wallet Transfer from/).first().innerText());
      return { code: wt, list: walletTab(page, from.id, new RegExp(`${wt}\\b`), 'wallet') };
    }
  },
  {
    label: 'Document=Wallet Refund PV (approved)', approval: true, report: 'cashOutflow',
    make: async page => {
      const apt = await setupApartment(page);
      const acc = await createCashAccount(page);
      await rechargeWallet(page, apt, acc, 10000);
      const wallet = new ApartmentWalletPage(page);
      await wallet.goto(apt.id);
      await wallet.doRefund(acc.name, 4000, 'QE OLD RPT-036');
      await done(page, 'Wallet Refund has been created successfully');
      await approvePvDraft(page, apt.name, 'Wallet Refund');
      await wallet.goto(apt.id);
      const pv = voucherOf(await wallet.row(/\( Wallet Refund \)/).first().innerText());
      return { code: pv, list: recentOutflows(page, pv) };
    }
  },
  {
    label: 'Document=Deposit Withdraw PV (approved)', approval: true, report: 'cashOutflow',
    make: async page => {
      const apt = await setupApartment(page);
      const acc = await createCashAccount(page);
      await addDeposit(page, apt, acc, 10000);
      const deposit = new ApartmentDepositPage(page);
      await deposit.goto(apt.id);
      await deposit.doWithdraw(acc.name, 4000, 'QE OLD RPT-036');
      await done(page, 'Deposit Withdraw has been created successfully');
      await approvePvDraft(page, apt.name, 'Deposit Withdrawal');
      await deposit.goto(apt.id);
      const pv = voucherOf(await deposit.row(/Deposit Withdraw/).first().innerText());
      return { code: pv, list: recentOutflows(page, pv) };
    }
  }
];

test.describe('Reported issue · Audit trail', () => {
  test.describe.configure({ timeout: 480_000 });

  for (const v of VARIANTS) {
    test(`RPT-036 [${v.label}] ${TITLE}`,
      testCase({ id: 'RPT-036', priority: 'P1', critical: true }),
      async ({ page }) => {
        test.info().annotations.push({ type: 'reported issue', description: ISSUE });
        test.info().annotations.push({ type: 'environment', description: 'No APPROVER_* account: admin is maker and approver, so Created By and Approved By are both the admin name' });
        const maker = await test.step('Maker / approver name (Settings › Staff)', () => staffName(page, credentials('admin').email))
          .catch(err => { test.skip(true, `BLOCKED: Settings › Staff did not list the admin (${String(err).split('\n')[0]})`); throw err; });

        let doc: Doc;
        try {
          doc = await test.step(`Steps 1-2: create${v.approval ? ' and approve' : ''} the document`, () => v.make(page));
        } catch (e) {
          // The builders (apartment, accounts, UO, payments) are other cases' flows: a failure there is the
          // environment, not the audit trail under test.
          await evidence(page, `RPT-036_setup-${VARIANTS.indexOf(v) + 1}`);
          test.skip(true, `BLOCKED: could not create the document on UAT (${String(e).split('\n')[0]})`);
          throw e;
        }
        test.info().annotations.push({ type: 'data', description: `${v.label}: ${doc.code}` });
        const tag = `RPT-036_${doc.code}`;
        const seen: string[] = [];

        /** Soft-checks one screen; `audit` undefined fields = the screen has no such column / field. */
        const check = async (screen: string, audit: AuditFields | 'missing', shot: string) => {
          if (audit === 'missing') {
            await evidence(page, `${tag}_${shot}`);
            expect.soft(audit, `${screen}: ${doc.code} not found`).not.toBe('missing');
            seen.push(`${screen}: document not found`);
            return;
          }
          seen.push(`${screen}: Created By ${audit.created === undefined ? 'NO FIELD' : `"${audit.created}"`}${v.approval ? `, Approved By ${audit.approved === undefined ? 'NO FIELD' : `"${audit.approved}"`}` : ''}`);
          const okCreated = audit.created === maker;
          const okApproved = !v.approval || audit.approved === maker;
          await evidence(page, `${tag}_${shot}`);
          expect.soft(okCreated, `Expected 1: ${screen} shows Created By "${maker}" for ${doc.code}; Old EM shows ${audit.created === undefined ? 'no Created By field' : `"${audit.created}"`}`).toBe(true);
          const shownApproved = audit.approved === undefined ? 'no Approved By field' : audit.approved === '' ? 'Approved By empty' : `"${audit.approved}"`;
          if (v.approval) expect.soft(okApproved, `Expected 2: ${screen} shows Approved By "${maker}" for ${doc.code}; Old EM shows ${shownApproved}`).toBe(true);
        };

        await test.step(`Step 3 / Expected 1-2: ${doc.list.name}`, async () => {
          await check(doc.list.name, await doc.list.read(), 'list');
        });

        let manage: string | undefined;
        await test.step(`Expected 3: ${REPORTS[v.report].label}`, async () => {
          const r = await reportRow(page, v.report, doc.code, v.transactionType);
          manage = r.manage;
          if (r.fields) await r.row.scrollIntoViewIfNeeded();
          await check(REPORTS[v.report].label, r.fields ? auditOf(r.fields) : 'missing', 'report');
        });

        await test.step('Step 3 / Expected 1-2: detail / voucher', async () => {
          const detail = doc.detail ?? manage;
          if (!detail) {
            await check('Detail / voucher (no Manage link to a detail page)', 'missing', 'detail');
            return;
          }
          await page.goto(detail);
          await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
          await waitIdle(page);
          if (/^\/invoices\/\d+$/.test(detail)) {
            await page.getByRole('heading', { name: /^Total:/ }).waitFor();
            await check('Document detail', auditInText(await page.locator('body').innerText()), 'detail');
            return;
          }
          const onPage = auditInText(await page.locator('main, body').first().innerText());
          test.info().annotations.push({ type: 'observed', description: `${detail} (detail page) shows ${onPage.created === undefined ? 'no Created By' : `Created By "${onPage.created}"`} and ${onPage.approved === undefined ? 'no Approved By' : `Approved By "${onPage.approved}"`}; the names are on its [Voucher]` });
          const hasVoucher = await page.getByRole('button', { name: 'Voucher' }).waitFor({ timeout: 10_000 }).then(() => true, () => false);
          if (!hasVoucher) {
            await check(`Detail ${detail} (no Voucher button)`, onPage, 'detail');
            return;
          }
          const { text, popup, pdf } = await voucherText(page);
          if (!pdf) await evidence(popup, `${tag}_voucher`).catch(() => {});
          else await test.info().attach(`${tag}_voucher.txt`, { body: text, contentType: 'text/plain' });
          await popup.close().catch(() => {});
          if (pdf && !/Voucher|Credit Note|Created|Printed/i.test(text)) {
            test.info().annotations.push({ type: 'not checked', description: `Voucher of ${doc.code}: the PDF text could not be read` });
            return;
          }
          test.info().annotations.push({ type: 'observed', description: `voucher of ${doc.code}: "${text.replace(/\s+/g, ' ').trim().slice(-200)}"` });
          await check('Voucher', auditInText(text), 'detail');
        });

        test.info().annotations.push({ type: 'observed', description: `${doc.code}: ${seen.join(' · ')}` });
      });
  }
});
