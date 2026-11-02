# 03 · Accounts Receivable

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 18 (+15 data-variant rows)  
**Priority:** P1 4 · P2 12 · P3 2 · **★ Critical:** 2 · **Smoke:** 2 · **E2E:** 2 · **Auto:** 18 · **Manual:** 0 · **Review:** 1

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [AR-001](#-ar-001--ar-page-summary-cards-show-current-and-total-overdue-amounts) | ★ AR page summary cards show current and total overdue amounts | AR summary cards | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 2 |
| [AR-002](#ar-002--ar-aging-cards-show-overdue-amount-and--of-total-overdue--by-bucket) | AR aging cards show overdue amount and % of total overdue — by bucket | Aging cards | P1 | Regression | Auto-UI+API | Active | 7 |
| [AR-003](#-ar-003--ar-list-shows-invoicesdebit-notes-by-aging-with-paid-status) | ★ AR list shows invoices/debit notes by aging with paid status | AR list | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [AR-004](#ar-004--ar-aging-tab-list-shows-invoice-apartment-dates-amounts-status--by-bucket) | AR aging tab list shows invoice, apartment, dates, amounts, status — by bucket | Aging lists | P1 | Regression | Auto-UI+API | Active | 8 |
| [AR-005](#ar-005--ar-status-tab-filters-invoices-by-payment-status) | AR status tab filters invoices by payment status | AR filters | P2 | Regression | Auto-UI | Active | 2 |
| [AR-006](#ar-006--ar-cards-and-list-filter-by-currency) | AR cards and list filter by currency | AR filters | P2 | Regression | Auto-UI | Active |  |
| [AR-007](#ar-007--ar-cards-and-list-filter-by-document-type-invoice--debit-note) | AR cards and list filter by document type (Invoice / Debit Note) | AR filters | P2 | Regression | Auto-UI | Active |  |
| [AR-008](#ar-008--ar-list-filter-by-category) | AR list filter by category | AR filters | P2 | Regression | Auto-UI | Active |  |
| [AR-009](#ar-009--export-ar-invoicedebit-note-list-to-excel) | Export AR invoice/debit note list to Excel | Export | P2 | Regression | Auto-UI | Active |  |
| [AR-010](#ar-010--ar-snapshot-shows-daily-receivable-list-by-currency) | AR Snapshot shows daily receivable list by currency | AR snapshot | P2 | Regression | Auto-UI+API | Active |  |
| [AR-011](#ar-011--ar-snapshot-filter-by-month) | AR Snapshot filter by month | AR snapshot | P2 | Regression | Auto-UI | Active |  |
| [AR-012](#ar-012--export-ar-snapshot-for-selected-month-to-excel) | Export AR Snapshot for selected month to Excel | AR snapshot | P2 | Regression | Auto-UI | Active |  |
| [AR-013](#ar-013--open-invoicedebit-note-detail-from-ar-list) | Open invoice/debit note detail from AR list | Invoice voucher | P2 | Regression | Auto-UI | Review |  |
| [AR-014](#ar-014--view-invoicedebit-note-pdf-from-ar-detail) | View invoice/debit note PDF from AR detail | Invoice voucher | P2 | Regression | Auto-UI | Active |  |
| [AR-015](#ar-015--download-invoicedebit-note-pdf-from-ar-detail) | Download invoice/debit note PDF from AR detail | Invoice voucher | P2 | Regression | Auto-UI | Active |  |
| [AR-016](#ar-016--bulk-soa-pdf-lists-apartment-soas-for-selected-zonebuildingcurrencydate) | Bulk SOA PDF lists apartment SOAs for selected zone/building/currency/date | Bulk SOA | P2 | Regression | Auto-UI+API | Active |  |
| [AR-017](#ar-017--sort-ar-list-by-each-column-ascdesc) | Sort AR list by each column asc/desc | Sorting | P3 | Regression | Auto-UI | Active |  |
| [AR-018](#ar-018--ar-list-sorts-by-only-one-column-at-a-time) | AR list sorts by only one column at a time | Sorting | P3 | Regression | Auto-UI | Active |  |
<!-- /generated:summary -->

## Test cases

### AR summary cards

#### ★ AR-001 · AR page summary cards show current and total overdue amounts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Accounts Receivable r6 (TC_AR_002) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.

**Expected result:**

1. You can see the total amount owed in the system in current card.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see current card. | Accounts Receivable r6 (TC_AR_002) | |
| 2 | Card=Total overdue | Accounts Receivable r7 (TC_AR_003) |  |

---

### Aging cards

#### AR-002 · AR aging cards show overdue amount and % of total overdue — by bucket

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Accounts Receivable r8 (TC_AR_004) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.

**Expected result:**

1. , You can see amount that is overdue within 1 to 30 days
2. Amount on this card is how many percentages of the total overdue amount are shown.

**Data variants (7 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see 1 to 30 Days card | Accounts Receivable r8 (TC_AR_004) | |
| 2 | Bucket=31-60 days | Accounts Receivable r9 (TC_AR_005) |  |
| 3 | Bucket=61-90 days | Accounts Receivable r10 (TC_AR_006) |  |
| 4 | Bucket=91-120 days | Accounts Receivable r11 (TC_AR_007) |  |
| 5 | Bucket=121-150 days | Accounts Receivable r12 (TC_AR_008) |  |
| 6 | Bucket=151-180 days | Accounts Receivable r13 (TC_AR_009) |  |
| 7 | Bucket=>180 days | Accounts Receivable r14 (TC_AR_010) |  |

---

### AR list

#### ★ AR-003 · AR list shows invoices/debit notes by aging with paid status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Accounts Receivable r15 (TC_AR_011) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.

**Expected result:**

1. You can view invoices and debit notes list by category according to past due dates
2. You can see whether the debt is partially paid or fully unpaid

---

### Aging lists

#### AR-004 · AR aging tab list shows invoice, apartment, dates, amounts, status — by bucket

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active — Comment: expected should read "fully unpaid or partially paid" | Accounts Receivable r16 (TC_AR_012) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click "Current"

**Expected result:**

1. You can see current arrears list
2. You can see invoice number of relevant apartment
3. You can see total arrears list and current due list
4. You can see invoice issued date and due date
5. You can see if the arrears are fully paid or partially paid , and who is responsible

> **Source comments:** fully unpaid or partially paid

**Data variants (8 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see current list | Accounts Receivable r16 (TC_AR_012) | |
| 2 | Bucket=1-30 days | Accounts Receivable r17 (TC_AR_013) |  |
| 3 | Bucket=31-60 days | Accounts Receivable r18 (TC_AR_014) |  |
| 4 | Bucket=61-90 days | Accounts Receivable r19 (TC_AR_015) |  |
| 5 | Bucket=91-120 days | Accounts Receivable r20 (TC_AR_016) |  |
| 6 | Bucket=121-150 days | Accounts Receivable r21 (TC_AR_017) |  |
| 7 | Bucket=151-180 days | Accounts Receivable r22 (TC_AR_018) |  |
| 8 | Bucket=>180 days | Accounts Receivable r23 (TC_AR_019) |  |

---

### AR filters

#### AR-005 · AR status tab filters invoices by payment status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r24 (TC_AR_020) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click "Unpaid"

**Expected result:**

1. You can see all unpaid invoices can be filtered.
2. You can see invoice number of relevant apartment
3. You can see total arrears list and current due list
4. You can see invoice issued date and due date
5. You can see who is responsible

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see Unpaid list | Accounts Receivable r24 (TC_AR_020) | |
| 2 | Status=Partially Paid | Accounts Receivable r25 (TC_AR_021) |  |

---

#### AR-006 · AR cards and list filter by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r26 (TC_AR_022) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Select "MMK" / Other Currency (USD/JPY/THB,...)

**Expected result:**

1. If you set the filter to MMK, all cards and lists related to MMK will be selected and displayed.
2. If you set the filter to other currency, all cards and lists regarding to the selected currency will be displayed.

---

#### AR-007 · AR cards and list filter by document type (Invoice / Debit Note)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r27 (TC_AR_023) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Select "Invoice" / "Debit Notes"

**Expected result:**

1. If you select "All Types" , all "Invoice" and "Debit Notes" will be displayed.
2. If you set the filter to "Invoice", all cards and lists related to "Invoice" will be selected and displayed.
3. If you set the filter to "Debit Notes", all cards and lists related to "Debit Notes" will be selected and displayed.

---

#### AR-008 · AR list filter by category

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r28 (TC_AR_024) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Select category.

**Expected result:**

1. If you selects a category, only the data related to the selected category will be displayed

---

### Export

#### AR-009 · Export AR invoice/debit note list to Excel

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r29 (TC_AR_025) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click "Excel" button.

**Expected result:**

1. The exported "Account Receivable" file will be downloaded.

---

### AR snapshot

#### AR-010 · AR Snapshot shows daily receivable list by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Accounts Receivable r30 (TC_AR_026) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click "AR Snapsnot"
3. Click "MMK" or Other Currency eg: USD

**Expected result:**

1. You can see each day's account receivable list day by day.
2. You can choose to see the MMK account receivable list or other currency's account receivable list.

---

#### AR-011 · AR Snapshot filter by month

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r31 (TC_AR_027) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click "AR Snapsnot"
3. Click the Filter and choose the desired Month.

**Expected result:**

1. You can see the selected month's account receivable list.

---

#### AR-012 · Export AR Snapshot for selected month to Excel

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r32 (TC_AR_028) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click "AR Snapsnot"
3. Click the "Excel" button.

**Expected result:**

1. The exported "Account Receivable" file with selected month will be downloaded.

---

### Invoice voucher

#### AR-013 · Open invoice/debit note detail from AR list

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Expected result is blank in source | Accounts Receivable r33 (TC_AR_029) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click the invoice number from the list of invoice/debit note numbers (or)
3. Click the "Manage" button for the related invoice in the invoice/debit note list.

---

#### AR-014 · View invoice/debit note PDF from AR detail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r34 (TC_AR_030) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click the invoice number from the list of invoice/debit note numbers (or)
3. Click the "Manage" button for the related invoice in the invoice/debit note list.
4. In the Invoice/Debit Note detail screen, click "View PDF" button.

**Expected result:**

1. The PDF file of "Invoice"/"Debit Note" will be shown.

---

#### AR-015 · Download invoice/debit note PDF from AR detail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Accounts Receivable r35 (TC_AR_031) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click the invoice number from the list of invoice/debit note numbers (or)
3. Click the "Manage" button for the related invoice in the invoice/debit note list.
4. In the Invoice/Debit Note detail screen, click "Download PDF" button.

**Expected result:**

1. The PDF file of "Invoice"/"Debit Note" will be downloaded to the user's device.

---

### Bulk SOA

#### AR-016 · Bulk SOA PDF lists apartment SOAs for selected zone/building/currency/date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active — GT remark asks to cover Bulk SOA in USD | Accounts Receivable r36 (TC_AR_032) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click "Bulk SOA"
3. Select Zone , Building , Currency and date
3. Click "PDF"

**Expected result:**

1. You can see all apartment SOA statements of elect Zone and Building in the serial apartment number.

---

### Sorting

#### AR-017 · Sort AR list by each column asc/desc

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active — Expected only mentions sorting by id although all columns are listed | Accounts Receivable r37 (TC_AR_033) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click the sorting button of the "id" or "Co.ref" or "Apartment" or "Amount" or "Due Amount" or "Issued Date" or "Due Date" or "Status" or "Category" or "Create By" column.
3. Chang the Ascending order to Descending order by clicking the sorting button.

**Expected result:**

1. You can see the Invoices/Debit Notes listing in the sorting order of id.

---

#### AR-018 · AR list sorts by only one column at a time

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Accounts Receivable r38 (TC_AR_034) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Accounts Receivable" from left menu.
2. Click the sorting button on a column.
3. Click the sort button on a different column from the one currently sorted.

**Expected result:**

1. You can see the last sorting value of Invoices/Debit Notes listing.

---
