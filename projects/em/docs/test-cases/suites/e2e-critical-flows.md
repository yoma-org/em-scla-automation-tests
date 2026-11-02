# E2E Suite — Critical Business Flows ★

[← Test case index](../README.md)

These are the end-to-end scenarios that prove EM can **bill, collect, hold and report money correctly**. Each flow chains catalogued test cases (linked by ID) into one run with shared data, so a defect anywhere along the money path breaks the flow.

- All flows are **P1 ★**. A failed flow blocks release.
- Run order matters only inside a flow. Flows are independent if each uses its own apartment/contact.
- Assert numbers **twice**: on the screen (UI) and via API (`/apartments/{id}/soa`, AR summary, wallet, deposit). Where the case says PDF, parse the PDF text and compare values.
- Use a fresh apartment per run (e.g. `E2E-<date>-<n>`). Balance checks then start from zero and don't drift with other tests.

| Flow | Name | Modules crossed | Automation |
|---|---|---|---|
| [E2E-01](#e2e-01--utility-billing-to-collection-golden-path) | ★ Utility billing to collection (golden path) | Settings → Apartment → UO → Approval → Invoice → Payment → AR → SOA → Reports | Auto-UI+API |
| [E2E-02](#e2e-02--estate-management-fee-billing-to-collection) | ★ Estate Management fee billing to collection | EM → Approval → Debit note → Payment (partial + wallet) → SOA | Auto-UI+API |
| [E2E-03](#e2e-03--manual-invoice--debit-note-with-makerchecker) | ★ Manual invoice / debit note with maker–checker | Role → Invoice/DN → Approval → AR → Dashboard → API | Auto-UI+API |
| [E2E-04](#e2e-04--unknown-receipt-to-allocation) | ★ Unknown receipt to allocation | Cash Received → Assignment → Invoice / Wallet / Deposit → SOA → Account Statement | Auto-UI+API |
| [E2E-05](#e2e-05--wallet-lifecycle) | ★ Wallet lifecycle | Wallet recharge → transfer → payment → credit note → refund → OB/CB | Auto-UI+API |
| [E2E-06](#e2e-06--deposit-lifecycle) | ★ Deposit lifecycle | Add deposit → deposit invoice → withdraw → OB/CB → Account Statement | Auto-UI+API |
| [E2E-07](#e2e-07--cash--bank-movements) | ★ Cash & bank movements | Accounts → Funding RV → Outflow PV → Transfer JV → Overdraft → Account Statement → Dashboard | Auto-UI+API |
| [E2E-08](#e2e-08--meter-reset-and-next-reading) | ★ Meter reset and next reading | Meter reset → manual / imported reading → invoice amount → SOA | Auto-UI+API |
| [E2E-09](#e2e-09--double-payment--concurrency-protection) | ★ Double-payment & concurrency protection | Payment, Unknown RV, Wallet, Deposit, Account, UO import | Auto-API (parallel) |
| [E2E-10](#e2e-10--back-dated-transactions-and-month-end-continuity) | ★ Back-dated transactions and month-end continuity | SOA, Wallet, Deposit, Account Statement | Auto-UI+API |
| [E2E-11](#e2e-11--external-api-consumer) | ★ External API consumer | API auth → SOA / AR / wallet / deposit → make payment | Auto-API |
| [E2E-12](#e2e-12--approval-gates-by-role) | ★ Approval gates by role | Role setup → create (maker) → approve (checker) for every financial document | Auto-UI+API |

---

## E2E-01 · Utility billing to collection (golden path)

**Why critical:** this is how TED earns most recurring revenue. It covers the whole cycle: meter reading → invoice → cash → statement.

**Setup:** UO pricing configured for YESC / Generator / Water. New apartment with an owner contact. One MMK cash account.

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Set / confirm UO unit prices | New UO invoices use the configured rate | [SET-003](../features/23-settings.md) |
| 2 | Create apartment and owner contact | Apartment is selectable in UO, invoice and payment forms | [APT-001](../features/08-apartments.md), [CON-001](../features/09-contacts.md), [APT-030](../features/08-apartments.md) |
| 3 | Enter a UO reading (draft) | Draft created; approver notified; no AR yet | [UO-001](../features/05-utility-operations-uo.md) |
| 4 | Approve UO | Invoice generated = consumption × rate per utility; invoice number assigned; unpaid in apartment | [UO-007](../features/05-utility-operations-uo.md) |
| 4b | *(alt)* Bulk import readings, then bulk approve | Same invoice result for every apartment in the file | [UOI-001](../features/06-uo-import.md), [UO-008](../features/05-utility-operations-uo.md) |
| 5 | Check receivables | Invoice in AR list (current bucket); AR and Dashboard totals rise by the invoice amount | [AR-003](../features/03-accounts-receivable.md), [AR-001](../features/03-accounts-receivable.md), [DASH-001](../features/02-dashboard.md) |
| 6 | Make full payment from apartment | RV created; invoice Paid; AR falls; cash account rises | [PAY-001](../features/10-make-payment.md), [APT-016](../features/08-apartments.md) |
| 7 | Check SOA | SOA lists invoice and RV; next month OB = this month CB (page, PDF, API) | [APT-021](../features/08-apartments.md), [OB-SOA-002](../features/balances/19-soa-ob-cb.md), [OB-SOA-007](../features/balances/19-soa-ob-cb.md) |
| 8 | Check reporting | Account statement shows the RV; day OB = previous CB; AR snapshot reflects the paid state next day | [RPT-006](../features/18-reports.md), [OB-ACS-001](../features/balances/22-account-statement-ob-cb.md), [AR-010](../features/03-accounts-receivable.md) |

---

## E2E-02 · Estate Management fee billing to collection

**Why critical:** EM fees are the fixed monthly charge to every apartment. They are billed as debit notes from a batch.

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Create single EM draft *or* import EM batch | Draft amount = monthly fee × months; import starts at previous end date + 1 | [EMF-001](../features/07-estate-management-fee.md), [EMF-007](../features/07-estate-management-fee.md) |
| 2 | Approve (single / bulk) | Debit note generated with DN number; unpaid in apartment; AR rises | [EMF-005](../features/07-estate-management-fee.md), [EMF-006](../features/07-estate-management-fee.md) |
| 3 | Partial payment | Debit note becomes Partially Paid; due amount falls | [PAY-003](../features/10-make-payment.md) |
| 4 | Recharge wallet, then pay the remainder with the wallet | WP created; wallet falls; debit note Paid | [WAL-001](../features/16-wallet.md), [PAY-005](../features/10-make-payment.md), [WAL-020](../features/16-wallet.md) |
| 5 | Check balances | SOA OB/CB continuity after the EM debit note and WP; wallet OB/CB continuity | [OB-SOA-005](../features/balances/19-soa-ob-cb.md), [OB-SOA-010](../features/balances/19-soa-ob-cb.md), [OB-WAL-008](../features/balances/20-wallet-ob-cb.md) |
| 6 | Numbering under load | Approving a DN while an EM import runs keeps DN / co-ref numbers in sequence | [EMF-016](../features/07-estate-management-fee.md), [EMF-017](../features/07-estate-management-fee.md) |

---

## E2E-03 · Manual invoice / debit note with maker–checker

**Why critical:** manual documents bypass meter data, so the approval control is the only safeguard.

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Maker role: Invoice create limited to assigned income categories | Only permitted categories selectable | [RBAC-005](../features/24-role-permission.md), [SET-050](../features/23-settings.md) |
| 2 | Maker creates invoice (multi-line, payment term) and a debit note | Saved as draft; due date = issue date + term; no AR effect yet | [INV-001](../features/04-invoice-debit-note.md), [INV-008](../features/04-invoice-debit-note.md), [INV-003](../features/04-invoice-debit-note.md), [INV-020](../features/04-invoice-debit-note.md) |
| 3 | Checker approves both | Reference numbers assigned; tax included; unpaid in apartment | [RBAC-006](../features/24-role-permission.md), [INV-017](../features/04-invoice-debit-note.md), [INV-031](../features/04-invoice-debit-note.md) |
| 4 | AR / Dashboard | Both documents in AR at the right aging bucket; totals updated per currency | [AR-003](../features/03-accounts-receivable.md), [DASH-001](../features/02-dashboard.md) |
| 5 | API view | Unpaid invoices and AR summary by apartment match the UI | [API-018](../features/26-api.md), [API-020](../features/26-api.md) |
| 6 | Negative | Delete a draft → no AR effect. Future-dated invoice is blocked | [INV-016](../features/04-invoice-debit-note.md), [INV-030](../features/04-invoice-debit-note.md) |

> **Gap:** the source has no explicit *reject* case for an invoice, DN, UO or EM draft. Add one: the rejected document must have **no** AR, SOA or numbering effect.

---

## E2E-04 · Unknown receipt to allocation

**Why critical:** money arrives before anyone knows whose it is. It must be recorded once and then allocated exactly once.

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Record Unknown Received (MMK, then other currency) | RV in unknown list; account balance rises | [CR-002](../features/11-cash-received.md) |
| 2a | Assign to apartment invoices | Invoice Paid / Partial; AR falls; RV re-typed | [PAY-008](../features/10-make-payment.md) |
| 2b | Assign with overflow → wallet / deposit | Excess lands in wallet or deposit | [PAY-009](../features/10-make-payment.md), [PAY-010](../features/10-make-payment.md) |
| 2c | Assign fully to wallet / deposit / payer | No invoice touched; wallet / deposit / payer updated | [PAY-011](../features/10-make-payment.md), [PAY-012](../features/10-make-payment.md), [CR-010](../features/11-cash-received.md) |
| 3 | Balances | SOA, wallet and account statement OB/CB continuity after assignment | [OB-SOA-008](../features/balances/19-soa-ob-cb.md), [OB-WAL-001](../features/balances/20-wallet-ob-cb.md), [OB-DEP-001](../features/balances/21-deposit-ob-cb.md), [OB-ACS-001](../features/balances/22-account-statement-ob-cb.md) |
| 4 | Audit | Assign Unknown Received Log lists the reassigned RV | [RPT-033](../features/18-reports.md) |

---

## E2E-05 · Wallet lifecycle

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Recharge wallet | Wallet and received-in account rise; RV issued (no approval) | [WAL-001](../features/16-wallet.md) |
| 2 | Transfer to another apartment | Both wallets updated; WT created | [WAL-006](../features/16-wallet.md) |
| 3 | Pay invoice partly / fully from wallet | WP created; invoice status and SOA updated | [WAL-019](../features/16-wallet.md), [WAL-020](../features/16-wallet.md) |
| 4 | Credit note → approve | CN amount added to wallet only after approval | [WAL-011](../features/16-wallet.md), [WAL-016](../features/16-wallet.md) |
| 5 | Refund → approve | Wallet and refund-from account fall; PV issued | [WAL-021](../features/16-wallet.md), [WAL-028](../features/16-wallet.md) |
| 6 | Balances | Wallet OB/CB continuity per transaction type; next month OB = current balance; account statement reflects the refund PV | [OB-WAL-001](../features/balances/20-wallet-ob-cb.md), [OB-WAL-003](../features/balances/20-wallet-ob-cb.md), [OB-WAL-005](../features/balances/20-wallet-ob-cb.md), [OB-WAL-007](../features/balances/20-wallet-ob-cb.md), [WAL-031](../features/16-wallet.md), [OB-ACS-003](../features/balances/22-account-statement-ob-cb.md) |

---

## E2E-06 · Deposit lifecycle

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Add deposit | Deposit and account balance rise; RV issued | [DEP-001](../features/17-deposit.md) |
| 2 | Deposit invoice → approve | DI approved and printable | [DEP-007](../features/17-deposit.md), [DEP-012](../features/17-deposit.md) |
| 3 | Withdraw → approve | Deposit falls; PV in Cash Outflow; account falls | [DEP-013](../features/17-deposit.md), [DEP-022](../features/17-deposit.md) |
| 4 | Balances | Deposit OB/CB continuity; next month OB = current balance; account statement | [OB-DEP-001](../features/balances/21-deposit-ob-cb.md), [OB-DEP-003](../features/balances/21-deposit-ob-cb.md), [DEP-024](../features/17-deposit.md), [OB-ACS-003](../features/balances/22-account-statement-ob-cb.md) |

---

## E2E-07 · Cash & bank movements

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Create cash account (initial balance) and bank account (overdraft on) | Balances shown; account offered only for its payment method | [CBA-001](../features/15-cash-bank-account.md), [CBA-005](../features/15-cash-bank-account.md), [CBA-002](../features/15-cash-bank-account.md) |
| 2 | Funding Received | Account balance rises | [CR-004](../features/11-cash-received.md) |
| 3 | Cash Outflow → approve | PV listed; balance falls only after approval | [CO-001](../features/13-cash-outflow.md), [CO-010](../features/13-cash-outflow.md) |
| 4 | Over-balance outflow / transfer | Blocked on cash account; allowed on bank with overdraft | [CO-005](../features/13-cash-outflow.md), [CO-008](../features/13-cash-outflow.md), [CT-008](../features/14-cash-transfer.md), [CT-009](../features/14-cash-transfer.md) |
| 5 | Transfer same / cross currency | JV listed; both legs updated with conversion rate | [CT-001](../features/14-cash-transfer.md), [CT-002](../features/14-cash-transfer.md) |
| 6 | Reporting | Account statement totals; day OB = previous CB; Dashboard cash & bank and net cash | [RPT-001](../features/18-reports.md), [RPT-006](../features/18-reports.md), [OB-ACS-003](../features/balances/22-account-statement-ob-cb.md), [OB-ACS-005](../features/balances/22-account-statement-ob-cb.md), [DASH-002](../features/02-dashboard.md), [DASH-005](../features/02-dashboard.md) |

> **Open question:** the Cash Transfer cases never mention approval, but the business summary says a JV posts on approval. Confirm with Finance before automating step 5.

---

## E2E-08 · Meter reset and next reading

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Create and approve meter reset | MR date / units become the apartment's last reading | [UO-022](../features/05-utility-operations-uo.md) |
| 2a | Manual reading after MR | Previous reading = MR units; consumption and invoice correct | [UO-015](../features/05-utility-operations-uo.md) |
| 2b | Imported reading after MR | Same as 2a via import (**known v4 defect** — status Review) | [UO-014](../features/05-utility-operations-uo.md), [UOI-001](../features/06-uo-import.md) |
| 3 | SOA | OB/CB continuity after the UO-generated invoice | [OB-SOA-002](../features/balances/19-soa-ob-cb.md) |

---

## E2E-09 · Double-payment & concurrency protection

**Why critical:** two cashiers acting on the same document at the same moment must never double-count money. Automate by firing the two API calls **in parallel** (same start barrier). Then assert exactly one wins, or both win when within balance.

| Scenario | Expected | Cases |
|---|---|---|
| 1 invoice, 2 full payments | 2nd rejected "already paid in full" | [CONC-001](../features/12-payment-concurrency.md), [CONC-002](../features/12-payment-concurrency.md) |
| 1 invoice, 2 partial payments | Both accepted within balance; 2nd asked to refresh when over | [CONC-003](../features/12-payment-concurrency.md), [CONC-004](../features/12-payment-concurrency.md) |
| 1 unknown RV, 2 users identify / assign | 2nd asked to refresh | [CONC-006](../features/12-payment-concurrency.md), [CONC-007](../features/12-payment-concurrency.md) |
| Wallet / deposit / account debited by 2 users | Over balance → 2nd refused; within → both allowed | [OB-WAL-012](../features/balances/20-wallet-ob-cb.md), [OB-WAL-013](../features/balances/20-wallet-ob-cb.md), [OB-DEP-012](../features/balances/21-deposit-ob-cb.md), [OB-DEP-013](../features/balances/21-deposit-ob-cb.md), [OB-ACS-010](../features/balances/22-account-statement-ob-cb.md), [OB-ACS-011](../features/balances/22-account-statement-ob-cb.md) |
| Concurrent UO / MR / EM drafts on the same apartment | 2nd blocked | [OB-SOA-018](../features/balances/19-soa-ob-cb.md), [OB-SOA-019](../features/balances/19-soa-ob-cb.md), [OB-SOA-020](../features/balances/19-soa-ob-cb.md) |
| Concurrent / duplicate UO import | 2nd upload blocked; same file rejected | [UOI-028](../features/06-uo-import.md), [UOI-029](../features/06-uo-import.md) |

---

## E2E-10 · Back-dated transactions and month-end continuity

**Why critical:** Finance back-dates late paperwork. Every later month's opening balance must be recalculated. Run each scenario with the date on the **1st, mid-month and last day** of a past month (data variants in each case).

| Ledger | Cases |
|---|---|
| Apartment SOA | [OB-SOA-003](../features/balances/19-soa-ob-cb.md), [OB-SOA-006](../features/balances/19-soa-ob-cb.md), [OB-SOA-009](../features/balances/19-soa-ob-cb.md), [OB-SOA-012](../features/balances/19-soa-ob-cb.md), [OB-SOA-013](../features/balances/19-soa-ob-cb.md), [OB-SOA-017](../features/balances/19-soa-ob-cb.md) |
| Wallet | [OB-WAL-002](../features/balances/20-wallet-ob-cb.md), [OB-WAL-004](../features/balances/20-wallet-ob-cb.md), [OB-WAL-006](../features/balances/20-wallet-ob-cb.md), [OB-WAL-009](../features/balances/20-wallet-ob-cb.md) |
| Deposit | [OB-DEP-002](../features/balances/21-deposit-ob-cb.md), [OB-DEP-004](../features/balances/21-deposit-ob-cb.md), [OB-DEP-006](../features/balances/21-deposit-ob-cb.md), [OB-DEP-007](../features/balances/21-deposit-ob-cb.md) |
| Account statement (daily) | [OB-ACS-002](../features/balances/22-account-statement-ob-cb.md), [OB-ACS-004](../features/balances/22-account-statement-ob-cb.md), [OB-ACS-006](../features/balances/22-account-statement-ob-cb.md), [OB-ACS-007](../features/balances/22-account-statement-ob-cb.md) |

> **Gap:** the source has no back-dated case for Make Payment RV, Wallet Payment or Wallet Transfer.

---

## E2E-11 · External API consumer

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | Get token (valid / invalid) | 200 + token / 401 | [API-001](../features/26-api.md), [API-002](../features/26-api.md), [API-006](../features/26-api.md) |
| 2 | Read SOA, AR summary, unpaid invoices, wallet, deposit | Values equal the UI for the same apartment and month | [API-013](../features/26-api.md), [API-020](../features/26-api.md), [API-018](../features/26-api.md), [API-012](../features/26-api.md), [API-016](../features/26-api.md), [API-017](../features/26-api.md) |
| 3 | Make payment via API | RV created in Cash Received; invoice status and AR updated (**ZL: RV not yet created — Review**) | [API-022](../features/26-api.md) |
| 4 | Without permission | Permission Denied | [API-024](../features/26-api.md) |

---

## E2E-12 · Approval gates by role

For each financial document, a role **with** create but **without** approve can create a draft and cannot approve it. A role with approve can approve and remove the draft.

| Document | Create | Approve |
|---|---|---|
| Invoice / Debit note | [RBAC-005](../features/24-role-permission.md), [RBAC-028](../features/24-role-permission.md) | [RBAC-006](../features/24-role-permission.md) |
| UO / Meter reset | [RBAC-008](../features/24-role-permission.md), [RBAC-009](../features/24-role-permission.md) | [RBAC-010](../features/24-role-permission.md), [RBAC-015](../features/24-role-permission.md) |
| EM | [RBAC-018](../features/24-role-permission.md), [RBAC-019](../features/24-role-permission.md) | [RBAC-020](../features/24-role-permission.md) |
| Credit note | [RBAC-043](../features/24-role-permission.md) | [RBAC-044](../features/24-role-permission.md) |
| Deposit invoice | [RBAC-046](../features/24-role-permission.md) | [RBAC-047](../features/24-role-permission.md) |
| Cash outflow / wallet refund / deposit withdraw | [RBAC-060](../features/24-role-permission.md), [RBAC-030](../features/24-role-permission.md), [RBAC-034](../features/24-role-permission.md) | [RBAC-061](../features/24-role-permission.md), [RBAC-031](../features/24-role-permission.md) |
| Cash transfer | [RBAC-064](../features/24-role-permission.md) | [RBAC-065](../features/24-role-permission.md) |
| Unknown / funding received | [RBAC-056](../features/24-role-permission.md), [RBAC-058](../features/24-role-permission.md), [RBAC-057](../features/24-role-permission.md) | — (no approval by design) |

> **Open question (EM initial findings):** the Admin role could not approve its own Invoice / DN / UO / EM in the new build. Confirm whether self-approval is allowed for Admin or blocked by maker–checker.
