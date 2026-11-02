# 18 · Reports

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 35 (+25 data-variant rows)  
**Priority:** P1 4 · P2 27 · P3 4 · **★ Critical:** 4 · **Smoke:** 2 · **E2E:** 3 · **Auto:** 35 · **Manual:** 0 · **Review:** 3

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [RPT-001](#-rpt-001--account-statement-shows-total-cash-in-hand-and-bank--by-currency) | ★ Account Statement shows total cash in hand and bank — by currency | Account Statement | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 2 |
| [RPT-002](#-rpt-002--account-statement-lists-cash-in-hand-accounts-with-balances--by-currency) | ★ Account Statement lists cash-in-hand accounts with balances — by currency | Account Statement | P1 | Regression | Auto-UI+API | Active | 2 |
| [RPT-003](#-rpt-003--account-statement-lists-bank-accounts-with-balance-per-bank-and-location--by-currency) | ★ Account Statement lists bank accounts with balance per bank and location — by currency | Account Statement | P1 | Regression | Auto-UI+API | Active | 2 |
| [RPT-004](#rpt-004--download-account-statement-summary-as-pdf) | Download Account Statement summary as PDF | Account Statement | P2 | Regression | Auto-UI | Active |  |
| [RPT-005](#rpt-005--download-account-statement-summary-as-excel) | Download Account Statement summary as Excel | Account Statement | P2 | Regression | Auto-UI | Active |  |
| [RPT-006](#-rpt-006--account-statement-history-day-opening-balance-equals-previous-closing-balance) | ★ Account statement history: day opening balance equals previous closing balance | Account Statement | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [RPT-007](#rpt-007--download-account-statement-details-as-pdf) | Download account statement details as PDF | Account Statement | P2 | Regression | Auto-UI | Active |  |
| [RPT-008](#rpt-008--download-account-statement-details-as-excel) | Download account statement details as Excel | Account Statement | P2 | Regression | Auto-UI | Active |  |
| [RPT-009](#rpt-009--invoices-report-filter-by-document-type) | Invoices report filter by document type | Invoices report | P2 | Regression | Auto-UI | Active |  |
| [RPT-010](#rpt-010--invoices-report-filter-by-building-and-apartment) | Invoices report filter by building and apartment | Invoices report | P2 | Regression | Auto-UI | Active |  |
| [RPT-011](#rpt-011--invoices-report-filter-by-date-range) | Invoices report filter by date range | Invoices report | P2 | Regression | Auto-UI | Active |  |
| [RPT-012](#rpt-012--invoices-report-list-shows-amounts-paiddue-creator-and-approver) | Invoices report list shows amounts, paid/due, creator and approver | Invoices report | P2 | Regression | Auto-UI+API | Active |  |
| [RPT-013](#rpt-013--invoices-report-voucher-shows-items-totals-tax-paiddue-and-partial-payments) | Invoices report voucher shows items, totals, tax, paid/due and partial payments | Invoices report | P2 | Regression | Auto-UI+API | Active |  |
| [RPT-014](#rpt-014--export-invoices-report-to-excel) | Export Invoices report to Excel | Invoices report | P2 | Regression | Auto-UI | Active |  |
| [RPT-015](#rpt-015--transaction-report-filter-by-date-range--by-report) | Transaction report filter by date range — by report | Transactions report | P2 | Regression | Auto-UI | Active | 3 |
| [RPT-016](#rpt-016--transaction-report-filter-by-currency--by-report) | Transaction report filter by currency — by report | Transactions report | P2 | Regression | Auto-UI | Active | 3 |
| [RPT-017](#rpt-017--transactions-report-filter-by-transaction-type) | Transactions report filter by transaction type | Transactions report | P2 | Regression | Auto-UI | Active |  |
| [RPT-018](#rpt-018--transaction-report-filter-by-location-account-and-category--by-report) | Transaction report filter by location, account and category — by report | Transactions report | P2 | Regression | Auto-UI | Active | 3 |
| [RPT-019](#rpt-019--transaction-report-filter-by-cleared-status--by-report) | Transaction report filter by CLEARED status — by report | Transactions report | P3 | Regression | Auto-UI | Review | 3 |
| [RPT-020](#rpt-020--transaction-report-filter-by-uncleared-status--by-report) | Transaction report filter by UNCLEARED status — by report | Transactions report | P3 | Regression | Auto-UI | Active | 3 |
| [RPT-021](#rpt-021--transaction-report-filter-by-building-and-apartment--by-report) | Transaction report filter by building and apartment — by report | Transactions report | P2 | Regression | Auto-UI | Active | 3 |
| [RPT-022](#rpt-022--transaction-report-filter-by-contact--by-report) | Transaction report filter by contact — by report | Transactions report | P3 | Regression | Auto-UI | Review | 3 |
| [RPT-023](#rpt-023--transactions-report-list-shows-number-date-account-type-payer-category-creator) | Transactions report list shows number, date, account, type, payer, category, creator | Transactions report | P2 | Regression | Auto-UI | Active |  |
| [RPT-024](#rpt-024--open-voucher-from-transaction-report-and-download-pdf--by-voucher-type) | Open voucher from transaction report and download PDF — by voucher type | Transactions report | P2 | Regression | Auto-UI | Active | 7 |
| [RPT-025](#rpt-025--export-transaction-report-to-excel--by-report) | Export transaction report to Excel — by report | Transactions report | P2 | Regression | Auto-UI | Active | 3 |
| [RPT-026](#rpt-026--cash-received-report-lists-only-rv-transactions-with-type-pre-selected) | Cash Received report lists only RV transactions with type pre-selected | Cash Received report | P2 | Regression | Auto-UI | Active |  |
| [RPT-027](#rpt-027--cash-outflow-report-lists-only-pv-transactions-with-type-pre-selected) | Cash Outflow report lists only PV transactions with type pre-selected | Cash Outflow report | P2 | Regression | Auto-UI | Review |  |
| [RPT-028](#rpt-028--credit-notes-report-filter-by-building-and-apartment) | Credit Notes report filter by building and apartment | Credit Notes report | P2 | Regression | Auto-UI | Active |  |
| [RPT-029](#rpt-029--credit-notes-report-filter-by-date-range) | Credit Notes report filter by date range | Credit Notes report | P2 | Regression | Auto-UI | Active |  |
| [RPT-030](#rpt-030--credit-notes-report-list-shows-cn-apartment-category-creator-approver) | Credit Notes report list shows CN, apartment, category, creator, approver | Credit Notes report | P2 | Regression | Auto-UI | Active |  |
| [RPT-031](#rpt-031--open-credit-note-voucher-and-download-pdf) | Open credit note voucher and download PDF | Credit Notes report | P2 | Regression | Auto-UI | Active |  |
| [RPT-032](#rpt-032--export-credit-notes-report-to-excel) | Export Credit Notes report to Excel | Credit Notes report | P2 | Regression | Auto-UI | Active |  |
| [RPT-033](#rpt-033--assign-unknown-received-log-lists-reassigned-rvs-sorted-by-rv-number) | Assign Unknown Received Log lists reassigned RVs sorted by RV number | Assign Unknown Received Log | P2 | E2E · Regression | Auto-UI+API | Active |  |
| [RPT-034](#rpt-034--search-assign-unknown-received-log-by-rv-number) | Search Assign Unknown Received Log by RV number | Assign Unknown Received Log | P3 | Regression | Auto-UI | Active |  |
| [RPT-035](#rpt-035--export-assign-unknown-received-log-to-excel) | Export Assign Unknown Received Log to Excel | Assign Unknown Received Log | P2 | Regression | Auto-UI | Active |  |
<!-- /generated:summary -->

## Test cases

### Account Statement

#### ★ RPT-001 · Account Statement shows total cash in hand and bank — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Reports r5 (TC_AccountStatement_001) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Statement" from the left menu under Report.

**Expected result:**

1. User can see the total MMK amount in the system
2. You can see the total amount of money in the cash in hand account
3. You can see the total amount of money in the bank account

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see how much MMK there is. | Reports r5 (TC_AccountStatement_001) | |
| 2 | Currency=Other | Reports r8 (TC_AccountStatement_004) |  |

---

#### ★ RPT-002 · Account Statement lists cash-in-hand accounts with balances — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Reports r6 (TC_AccountStatement_002) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Statement" from the left menu under Report.
2. Check under MMK In Hand amount

**Expected result:**

1. User can view all cash in hand accounts
2. The amount of money in each cash in hand account is shown in a list

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see the cash in hand(MMK) account list | Reports r6 (TC_AccountStatement_002) | |
| 2 | Currency=Other | Reports r9 (TC_AccountStatement_005) |  |

---

#### ★ RPT-003 · Account Statement lists bank accounts with balance per bank and location — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Reports r7 (TC_AccountStatement_003) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Statement" from the left menu under Report.
2. Check under MMK In Bank amount

**Expected result:**

1. User can view all Bank accounts
2. The amount of money in each Bank name is shown in a list
3. Shows the amount of money in each location account

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see the Bank(MMK) account list | Reports r7 (TC_AccountStatement_003) | |
| 2 | Currency=Other (e.g. USD) | Reports r10 (TC_AccountStatement_006) |  |

---

#### RPT-004 · Download Account Statement summary as PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r11 (TC_AccountStatement_007) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Statement" from the left menu under Report.
2. Click PDF button of report page

**Expected result:**

1. You will receive the entire account statement report page as a pdf file.

---

#### RPT-005 · Download Account Statement summary as Excel

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r12 (TC_AccountStatement_008) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Statement" from the left menu under Report.
2. Click Excel button of report page

**Expected result:**

1. You will receive the entire account statement report page as an excel file.

---

#### ★ RPT-006 · Account statement history: day opening balance equals previous closing balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Reports r13 (TC_AccountStatement_009) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Statement" from the left menu under Report.
2. Select acount
3. Select from date and to date in date filter
3. Click "View Statement"

**Expected result:**

1. You can see the complete Transaction History showing all income, expenses, and balance amounts for the relevant account.
2. The opening balance of the next day must be the closing balance of the previous day.

---

#### RPT-007 · Download account statement details as PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r14 (TC_AccountStatement_010) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Statement" from the left menu under Report.
2. Select acount
3. Select from date and to date in date filter
4. Click "View Statement"
5. Click PDF button of details page

**Expected result:**

1. You will receive the entire account statement details page as a pdf file.

---

#### RPT-008 · Download account statement details as Excel

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r15 (TC_AccountStatement_011) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Statement" from the left menu under Report.
2. Select acount
3. Select from date and to date in date filter
4. Click "View Statement"
5. Click Excel button of details page

**Expected result:**

1. You will receive the entire account statement details page as an excel file.

---

### Invoices report

#### RPT-009 · Invoices report filter by document type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r22 (TC_Invoices_001) |

**Scenario group:** Invoices

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Invoices" from the left menu under Report.
2. Select "Invoice" / "Debit Notes"
3. Click "Filter"

**Expected result:**

1. If you select "All Types" , all "Invoice" and "Debit Notes" will be displayed.
2. If you set the filter to "Invoice", all lists related to "Invoice" will be selected and displayed.
3. If you set the filter to "Debit Notes", all lists related to "Debit Notes" will be selected and displayed.

---

#### RPT-010 · Invoices report filter by building and apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r23 (TC_Invoices_002) |

**Scenario group:** Invoices

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Invoices" from the left menu under Report.
2. Select Building and Apartment
3. Click "Filter"

**Expected result:**

1. If you selects a building and apartment, only the data related to the selected building and apartment will be displayed

---

#### RPT-011 · Invoices report filter by date range

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r24 (TC_Invoices_003) |

**Scenario group:** Invoices

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Invoices" from the left menu under Report.
2. Select date or date range
3. Click "Filter"

**Expected result:**

1. If you selects date range, only the data related within selected date range will be displayed

---

#### RPT-012 · Invoices report list shows amounts, paid/due, creator and approver

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Reports r25 (TC_Invoices_004) |

**Scenario group:** Invoices

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Invoices" from the left menu under Report.
2. Select what you want to see and filter

**Expected result:**

1. You can see invoice or debit notes number of relevant apartment and category
2. You can see total arrears list , paid amount and due amount list
3. You can see the invoice issued date, the invoice created person, and who is approved.
4. you can click manage button and can see invoice voucher

---

#### RPT-013 · Invoices report voucher shows items, totals, tax, paid/due and partial payments

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Reports r26 (TC_Invoices_005) |

**Scenario group:** Invoices

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Invoices" from the left menu under Report.
2. Click the invoice number from the list of invoice/debit note numbers (or)
3. Click the "Manage" button for the related invoice in the invoice/debit note list.

**Expected result:**

1. You can see invoice voucher of related invoice
2. Voucher will show invoice number of relevant apartment and paid type
3. Voucher will show created and approved person; issued date,due date
4. Voucher will show total amount,paid amount ,due amount and tax amount
5. Voucher will show each invoice items, unit, gross price ,total amount and gross total
6. If the payment type is partial, related transaction data will be shown.

---

#### RPT-014 · Export Invoices report to Excel

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r27 (TC_Invoices_006) |

**Scenario group:** Invoices

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Invoices" from the left menu under Report.
2. Select "Invoice" / "Debit Notes"
3. Use filters to filter the data you want to see.
4. Click "Excel" button

**Expected result:**

1. You will receive the entire Invoice list as an excel file.

---

### Transactions report

#### RPT-015 · Transaction report filter by date range — by report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r34 (TC_Transactions_001) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select date or date range
3. Click "Filter"

**Expected result:**

1. If you selects date range, only the data related within selected date range will be displayed

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can filter by date range | Reports r34 (TC_Transactions_001) | |
| 2 | Report=Cash Received | Reports r55 (TC_CashReceived_001) |  |
| 3 | Report=Cash Outflow | Reports r71 (TC_CashOutflow_001) |  |

---

#### RPT-016 · Transaction report filter by currency — by report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r35 (TC_Transactions_002) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select MMK (or) Other Currency
3. Click "Filter"

**Expected result:**

1. If you selects MMK, only the data related with MMK will be displayed
2. If you selects Other Currency, only the data related with selected currency will be displayed

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can select MMK (or) Other Currency (eg: USD) and can filter | Reports r35 (TC_Transactions_002) | |
| 2 | Report=Cash Received | Reports r56 (TC_CashReceived_002) |  |
| 3 | Report=Cash Outflow | Reports r72 (TC_CashOutflow_002) |  |

---

#### RPT-017 · Transactions report filter by transaction type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r36 (TC_Transactions_003) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select transaction type
3. Click "Filter"

**Expected result:**

1. If you selects Cash Received, only the data related with cash received will be displayed
2. If you selects Cash Outflow, only the data related with Cash Outflow will be displayed
3. If you selects Cash Transfer, only the data related with Cash Transfer will be displayed
4. If you selects Wallet Payment, only the data related with Wallet Payment will be displayed
5. If you selects Wallet Transfer, only the data related with Wallet Transfer will be displayed
6. If you select all categories, All data related to all transaction types will be displayed.

---

#### RPT-018 · Transaction report filter by location, account and category — by report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r37 (TC_Transactions_004) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select Location, Account and Category.
3. Click "Filter"

**Expected result:**

1. If you select location, account and category, only the data related to the selected field will be displayed.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can filter by Location, Account and Category. | Reports r37 (TC_Transactions_004) | |
| 2 | Report=Cash Received | Reports r57 (TC_CashReceived_003) |  |
| 3 | Report=Cash Outflow | Reports r73 (TC_CashOutflow_003) |  |

---

#### RPT-019 · Transaction report filter by CLEARED status — by report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Review — Remark: status filter removed from Make Payment form, so CLEARED returns same as no status filter | Reports r38 (TC_Transactions_005) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select "CLEARED" value from Status filter.
3. Click "Filter"

**Expected result:**

1. The data related to the selected field will be displayed.
   (If "CLEARED" is selected, not only cheque with cleared status but also all payment method with cleared status will be shown.)

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can filter with 'CLEARED' Status. | Reports r38 (TC_Transactions_005) | |
| 2 | Report=Cash Received | Reports r58 (TC_CashReceived_004) | Review; Remark: status filter removed from Make Payment form, so CLEARED returns same as no status filter |
| 3 | Report=Cash Outflow | Reports r74 (TC_CashOutflow_004) | Review; Remark: status filter removed from Make Payment form, so CLEARED returns same as no status filter |

---

#### RPT-020 · Transaction report filter by UNCLEARED status — by report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Reports r39 (TC_Transactions_006) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select "UNCLEARED" value from Status filter.
3. Click "Filter"

**Expected result:**

1. The data related to the selected field will be displayed.
   (If "UNCLEARED" is selected, only cheque with uncleared status will be shown.)

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can filter with 'UNCLEARED' Status. | Reports r39 (TC_Transactions_006) | |
| 2 | Report=Cash Received | Reports r59 (TC_CashReceived_005) |  |
| 3 | Report=Cash Outflow | Reports r75 (TC_CashOutflow_005) |  |

---

#### RPT-021 · Transaction report filter by building and apartment — by report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r40 (TC_Transactions_007) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login the System first.
2. At least one receipt voucher has been created. The Receipt Voucher type must be RV (Unknow To Apartment) or RV (Wallet Recharge) or WT (Wallet Transfer) or PV (Wallet Refund) or RV (Deposit) or PV (Deposit Withdraw).

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select Building and Apartment Filter.
3. Click "Filter"

**Expected result:**

1. If you selects building and apartment filter, only the data related to the selected building and apartment will be displayed

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can filter by Building and Apartment. | Reports r40 (TC_Transactions_007) | |
| 2 | Report=Cash Received | Reports r60 (TC_CashReceived_006) |  |
| 3 | Report=Cash Outflow | Reports r76 (TC_CashOutflow_006) |  |

---

#### RPT-022 · Transaction report filter by contact — by report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Review — Known minor issue: Contact filter not fully functional; EM asks to keep it unchanged in production | Reports r41 (TC_Transactions_008) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login the System first.
2. At least one receipt voucher has been created. The Receipt Voucher type must be RV (Unknow To Apartment) or RV (Unknow To Payer) or RV (Wallet Recharge) or WT (Wallet Transfer) or PV (Wallet Refund) or RV (Deposit) or PV (Deposit Withdraw).

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select Contact Filter.
3. Click "Filter".

**Expected result:**

1. If you selects contact filter, only the data related to the selected contact will be displayed.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can filter by Contact. | Reports r41 (TC_Transactions_008) | |
| 2 | Report=Cash Received | Reports r61 (TC_CashReceived_007) | Review; Known minor issue: Contact filter not fully functional; EM asks to keep it unchanged in production |
| 3 | Report=Cash Outflow | Reports r77 (TC_CashOutflow_007) | Review; Known minor issue: Contact filter not fully functional; EM asks to keep it unchanged in production |

---

#### RPT-023 · Transactions report list shows number, date, account, type, payer, category, creator

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r42 (TC_Transactions_009) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select what you want to see and filter

**Expected result:**

1. You can see transaction number of relevant transaction type
2. You can see the invoice issued date, account, transaction type and payer name
3. You can see category , location, description and transaction created person.

---

#### RPT-024 · Open voucher from transaction report and download PDF — by voucher type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Physical print step not automated; verify voucher detail + PDF download | Reports r43 (TC_Transactions_010) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Select "Cash Received" in transaction type filter
3. Click the RV number from the list of Cash Received (RV) (or)
4. Click the "Manage" button for the related RV in the Cash Received (RV) list.

**Expected result:**

1. You can check Cash Received data before printing a receipt voucher.
2. You can see Receipt voucher with full data, and you can print or download pdf file.

**Data variants (7 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can print  receipt voucher | Reports r43 (TC_Transactions_010) | |
| 2 | Voucher=PV (Cash Outflow) | Reports r44 (TC_Transactions_011) |  |
| 3 | Voucher=JV (Cash Transfer) | Reports r45 (TC_Transactions_012) |  |
| 4 | Voucher=WP (Wallet Payment) | Reports r46 (TC_Transactions_013) |  |
| 5 | Voucher=WT (Wallet Transfer) | Reports r47 (TC_Transactions_014) |  |
| 6 | Report=Cash Received; Voucher=RV | Reports r63 (TC_CashReceived_009) |  |
| 7 | Report=Cash Outflow; Voucher=PV | Reports r79 (TC_CashOutflow_009) |  |

---

#### RPT-025 · Export transaction report to Excel — by report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r48 (TC_Transactions_015) |

**Scenario group:** Transaction

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Transactions" from the left menu under Report.
2. Use the filter to filter the data for the type of transaction you want to view.
3. Click "Excel" button

**Expected result:**

1. You will receive the entire transactions type list as an excel file.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can download Transaction list Excel | Reports r48 (TC_Transactions_015) | |
| 2 | Report=Cash Received | Reports r64 (TC_CashReceived_010) |  |
| 3 | Report=Cash Outflow | Reports r80 (TC_CashOutflow_010) |  |

---

### Cash Received report

#### RPT-026 · Cash Received report lists only RV transactions with type pre-selected

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r62 (TC_CashReceived_008) |

**Scenario group:** Cash Received

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Cash Received" from the left menu under Report.
2. Select what you want to see and filter

**Expected result:**

1. "Cash Received" will be auto-selected in the "Transaction type".
2. Only the data related to cash received will be displayed.
3. You can see the invoice issued date, account, transaction type and payer name
4. You can see category , location, description and transaction created person.

---

### Cash Outflow report

#### RPT-027 · Cash Outflow report lists only PV transactions with type pre-selected

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Expected step 2 says "cash received" data; should be cash outflow (copy error) | Reports r78 (TC_CashOutflow_008) |

**Scenario group:** Cash Outflow

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Cash Outflow" from the left menu under Report.
2. Select what you want to see and filter

**Expected result:**

1. "Cash Outflow" will be auto-selected in the "Transaction type".
2. Only the data related to cash received will be displayed.
3. You can see the invoice issued date, account, transaction type and payer name
4. You can see category , location, description and transaction created person.

---

### Credit Notes report

#### RPT-028 · Credit Notes report filter by building and apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r87 (TC_CN_001) |

**Scenario group:** Credit Notes

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Credit Notes" from the left menu under Report.
2. Select Building and Apartment
3. Click "Filter"

**Expected result:**

1. If you selects a building and apartment, only the data related to the selected building and apartment will be displayed

---

#### RPT-029 · Credit Notes report filter by date range

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r88 (TC_CN_002) |

**Scenario group:** Credit Notes

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Credit Notes" from the left menu under Report.
2. Select date or date range
3. Click "Filter"

**Expected result:**

1. If you selects date range, only the data related within selected date range will be displayed

---

#### RPT-030 · Credit Notes report list shows CN, apartment, category, creator, approver

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r89 (TC_CN_003) |

**Scenario group:** Credit Notes

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Credit Notes" from the left menu under Report.
2. Select what you want to see and filter

**Expected result:**

1. You can see credit notes number of relevant apartment , category , description and remark
2. You can see the credit notes issued date, the CN created person, and who is approved.

---

#### RPT-031 · Open credit note voucher and download PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Physical print step not automated | Reports r90 (TC_CN_004) |

**Scenario group:** Credit Notes

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Credit Notes" from the left menu under Report.
2. Click the CN number from the list of credit note (or)
3. Click the "Manage" button for the related CN in the credit note list.

**Expected result:**

1. You can check credit note data before printing credit note voucher.
2. You can see credit note voucher with full data, and you can print or download pdf file.

---

#### RPT-032 · Export Credit Notes report to Excel

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r91 (TC_CN_005) |

**Scenario group:** Credit Notes

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Credit Note" from the left menu under Report.
3. Use filters to filter the data you want to see.
4. Click "Excel" button

**Expected result:**

1. You will receive the entire Credit Note list as an excel file.

---

### Assign Unknown Received Log

#### RPT-033 · Assign Unknown Received Log lists reassigned RVs sorted by RV number

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI+API | Active | Reports r98 (TC_AURL_001) |

**Scenario group:** Assign Unknown Received Log

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Assign Unknown Received Log" from the left menu under Report.

**Expected result:**

1. You can see all RV vouchers list that are changed unkown to payer (or) apartment payment. The list is sorted by the RV voucher number.

---

#### RPT-034 · Search Assign Unknown Received Log by RV number

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active — Steps omit typing the RV number in search | Reports r99 (TC_AURL_002) |

**Scenario group:** Assign Unknown Received Log

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Assign Unknown Received Log" from the left menu under Report.

**Expected result:**

1. The searched result regarding to
   the search keyword regarding to RV voucher can be seen as a list.
2. If there is no result for related keyword, show the empty view.

---

#### RPT-035 · Export Assign Unknown Received Log to Excel

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Reports r100 (TC_AURL_003) |

**Scenario group:** Assign Unknown Received Log

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Assign Unknown Received Log" from the left menu under Report.
3. Use filters to filter the data you want to see.
4. Click "Excel" button

**Expected result:**

1. You will receive the entire Assign Unknown Received Log list as an excel file.

---
