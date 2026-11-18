# Old EM: extra test cases (not in the EM catalog)

These cases were written for issues reported on **Old EM** by the testers and the IT solution manager (tester notes 2026-11-12).
They are **not** in the Excel workbook and **not** in the New EM catalog ([projects/em/docs/test-cases/](../../../em/docs/test-cases/README.md)):
keeping them here means the Old EM baseline does not change New EM's test cases, counts or suites.
If New EM adopts them later, move them into the EM feature files with the same IDs.

| ID | Area | Title | Reported issue |
|---|---|---|---|
| [INV-038](#inv-038) | Invoice & Debit Note | Invoice totals with discount and tax are calculated once and saved exactly as shown on the form | Invoice Calculation (Decimal/Rounding) |
| [WAL-033](#wal-033) | Wallet | Removing a draft credit note leaves no wallet or account transaction behind | Incomplete Deletion on Rejection |
| [RPT-036](#rpt-036) | Reports | Created By and Approved By are recorded for every money document — by document type | Missing Audit Trails |

Data variants: [extra-catalog.csv](extra-catalog.csv) (same columns as the EM `test-catalog.csv`).

---

## Invoice & Debit Note

<a id="inv-038"></a>



#### ★ INV-038 · Invoice totals with discount and tax are calculated once and saved exactly as shown on the form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Review — confirm the rounding rule: round the grand total to 2 decimals half-up (all variants below give the same result if each line is rounded instead) | Reported Old EM issue "Invoice Calculation (Decimal/Rounding)", tester notes 2026-11-12 |

**Preconditions:**

1. User needs to login the system first.
2. An apartment with an owner exists.

**Test data:**

1. Income Category = any active income category
2. Currency = MMK
3. Tax Type = "3% Tax"
4. Unit = 2, Gross Price = 1,500.00, Discount = 10 % (base row)

**Steps:**

1. Click "Invoices / Debit Note" from left menu and click "Create Invoice".
2. Select the apartment, income category and currency.
3. Enter Item Description, Tax Type, Unit, Gross Price and Discount from the test data.
4. Check Disc. Price, Tax, line Total, Gross Total, Discount, Commercial Tax and Grand Total on the form.
5. Click "Create".
6. Open the draft and approve it.

**Expected result:**

1. Form: Disc. Price = Gross Price × (1 − discount %) (or Gross Price − fixed discount); line Total = Unit × Disc. Price; Tax = line Total × 3 %; Grand Total = line Total + Tax, rounded to 2 decimals (base row: 1,350.00 / 2,700.00 / 81.00 / Grand Total 2,781.00 Ks).
2. The Gross Price, Unit and Discount typed are kept: no "field is required" error and no total of 0 after typing.
3. The draft in the Inv/DN draft list, the approved invoice, the apartment SOA, the Accounts Receivable list and the invoice PDF all show the same Grand Total as the form.
4. Creating the same invoice 5 times in a row gives the same Grand Total every time.

**Check areas:**

1. Invoice/Debit Note draft list and detail
2. Apartment - Invoices list, SOA
3. Accounts Receivable list
4. Invoice PDF

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Unit=2; Gross Price=1,500.00; Discount=10 %; Grand Total=2,781.00 | Tester notes 2026-11-12 | Data of the Old EM run where the draft was saved as 3,090.00 |
| 2 | Unit=3; Gross Price=333.33; Discount=10 %; Grand Total=926.99 | Tester notes 2026-11-12 | Disc. Price has 3 decimals (299.997) |
| 3 | Unit=7; Gross Price=0.15; Discount=0; Grand Total=1.08 | Tester notes 2026-11-12 | Tax 0.0315 rounds to 0.03 |
| 4 | Unit=1; Gross Price=100.10; Discount=0.05 Ks (fixed); Grand Total=103.05 | Tester notes 2026-11-12 | Fixed discount in Ks |

---

---

## Wallet

<a id="wal-033"></a>



#### ★ WAL-033 · Removing a draft credit note leaves no wallet or account transaction behind

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Reported Old EM issue "Incomplete Deletion on Rejection" (credit note row left in the cash transaction table), tester notes 2026-11-12 |

**Preconditions:**

1. User needs to login the system first.
2. An apartment with wallet balance (e.g. 50,000 Ks from a wallet recharge).
3. A second user with credit note approve permission (or the approver of the draft).

**Test data:**

1. Credit note amount = 10,000.00 Ks
2. Currency = MMK

**Steps:**

1. Note the apartment's wallet balance and this month's wallet transactions.
2. Add a credit note of 10,000 Ks to the apartment's wallet (draft).
3. As approver, open the CN draft list from the top bar and click "Remove" on the draft.
4. Check the apartment wallet, the Credit Note report and the CN draft list.
5. Pay an invoice of the apartment with the Wallet payment method for the full wallet balance noted in step 1.

**Expected result:**

1. The draft is gone from the CN draft list and the top-bar CN counter goes back down.
2. Wallet balance is the same as in step 1; the wallet transaction list and its Opening / Closing Balance show no credit note line.
3. The Credit Note report does not list the removed credit note.
4. The wallet payment in step 5 succeeds and leaves the wallet at 0.00 (no amount from the removed credit note is counted).

**Check areas:**

1. Apartment - Wallet tab (balance, transactions, OB / CB), SOA
2. CN draft list and top-bar counter
3. Report - Credit Note
4. Dashboard - Wallet & Deposits

---

---

## Reports

<a id="rpt-036"></a>



#### ★ RPT-036 · Created By and Approved By are recorded for every money document — by document type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI | Active | Reported Old EM issue "Missing Audit Trails: 'Approved By' and 'Created By' missing in some transactions", tester notes 2026-11-12 |

**Preconditions:**

1. User needs to login the system first.
2. A maker user and an approver user (or one user with both permissions).

**Steps:**

1. As maker, create the document of the variant.
2. If the document needs approval, approve it as approver.
3. Open the document's list (e.g. Recent Receipts, Recent Outflows, Recent Transfers, Invoices / Debit Note, apartment Wallet / Deposit tab) and the document detail / voucher.

**Expected result:**

1. "Created By" shows the maker's name in the list and on the detail / voucher.
2. For a document that goes through approval, "Approved By" shows the approver's name in the list and on the detail / voucher; it is never empty.
3. The same names appear in the matching report (Invoices, Transactions, Cash Received, Cash Outflow, Credit Note).

**Check areas:**

1. Document list and detail / voucher (PDF)
2. Reports - Invoices, Transactions, Cash Received, Cash Outflow, Credit Note

**Data variants (12 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Document=Invoice (approved) | Tester notes 2026-11-12 | |
| 2 | Document=Debit Note (approved) | Tester notes 2026-11-12 | |
| 3 | Document=UO invoice (approved UO draft) | Tester notes 2026-11-12 | |
| 4 | Document=EM debit note (approved EM draft) | Tester notes 2026-11-12 | |
| 5 | Document=Make Payment RV | Tester notes 2026-11-12 | No approval step: Created By only |
| 6 | Document=Unknown Received RV | Tester notes 2026-11-12 | No approval step: Created By only |
| 7 | Document=Cash Outflow PV (approved) | Tester notes 2026-11-12 | |
| 8 | Document=Cash Transfer JV (approved) | Tester notes 2026-11-12 | |
| 9 | Document=Credit Note CN (approved) | Tester notes 2026-11-12 | |
| 10 | Document=Wallet Transfer WT | Tester notes 2026-11-12 | |
| 11 | Document=Wallet Refund PV (approved) | Tester notes 2026-11-12 | |
| 12 | Document=Deposit Withdraw PV (approved) | Tester notes 2026-11-12 | |

---
