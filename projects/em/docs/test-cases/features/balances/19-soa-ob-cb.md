# 19 · SOA — Opening / Closing Balance

[← Test case index](../../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 20 (+273 data-variant rows)  
**Priority:** P1 20 · P2 0 · P3 0 · **★ Critical:** 20 · **Smoke:** 2 · **E2E:** 17 · **Auto:** 20 · **Manual:** 0 · **Review:** 3

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [OB-SOA-001](#-ob-soa-001--soa-obcb-continuity-after-current-date-invoice--by-category) | ★ SOA OB/CB continuity after current-date invoice — by category | SOA OB/CB - Invoice | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-SOA-002](#-ob-soa-002--soa-obcb-continuity-after-current-date-uo-generated-invoice-manual--bulk-import) | ★ SOA OB/CB continuity after current-date UO-generated invoice (manual / bulk import) | SOA OB/CB - Invoice | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-SOA-003](#-ob-soa-003--soa-obcb-continuity-after-back-dated-invoice--by-category--date-position) | ★ SOA OB/CB continuity after back-dated invoice — by category × date position | SOA OB/CB - Invoice | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-SOA-004](#-ob-soa-004--soa-obcb-continuity-after-current-date-debit-note--by-category) | ★ SOA OB/CB continuity after current-date debit note — by category | SOA OB/CB - Debit note | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-SOA-005](#-ob-soa-005--soa-obcb-continuity-after-current-date-em-generated-debit-note-manual--bulk-import) | ★ SOA OB/CB continuity after current-date EM-generated debit note (manual / bulk import) | SOA OB/CB - Debit note | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-SOA-006](#-ob-soa-006--soa-obcb-continuity-after-back-dated-debit-note--by-category--date-position) | ★ SOA OB/CB continuity after back-dated debit note — by category × date position | SOA OB/CB - Debit note | P1 | E2E · Regression | Auto-UI+API | Active | 4 |
| [OB-SOA-007](#-ob-soa-007--soa-obcb-continuity-after-make-payment-rv--by-currency--singlemultipleoverflow) | ★ SOA OB/CB continuity after Make Payment RV — by currency × single/multiple/overflow | SOA OB/CB - Payment (RV) | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 8 |
| [OB-SOA-008](#-ob-soa-008--soa-obcb-continuity-after-current-date-unknown-rv-assignment--by-currency--mode) | ★ SOA OB/CB continuity after current-date unknown RV assignment — by currency × mode | SOA OB/CB - Unknown RV assign | P1 | E2E · Regression | Auto-UI+API | Active | 10 |
| [OB-SOA-009](#-ob-soa-009--soa-obcb-continuity-after-back-dated-unknown-rv-assignment--by-currency--mode--date) | ★ SOA OB/CB continuity after back-dated unknown RV assignment — by currency × mode × date | SOA OB/CB - Unknown RV assign | P1 | E2E · Regression | Auto-UI+API | Active | 10 |
| [OB-SOA-010](#-ob-soa-010--soa-obcb-continuity-after-wallet-payment-wp--single--multiple) | ★ SOA OB/CB continuity after Wallet Payment (WP) — single / multiple | SOA OB/CB - Wallet payment | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-SOA-011](#-ob-soa-011--soa-obcb-with-2-same-type-transactions-at-same-time--current--current-date) | ★ SOA OB/CB with 2 same-type transactions at same time — current & current date | SOA OB/CB - Concurrent same-type | P1 | E2E · Regression | Auto-UI+API | Active | 6 |
| [OB-SOA-012](#-ob-soa-012--soa-obcb-with-2-same-type-transactions-at-same-time--current--back-date) | ★ SOA OB/CB with 2 same-type transactions at same time — current & back date | SOA OB/CB - Concurrent same-type | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-SOA-013](#-ob-soa-013--soa-obcb-with-2-same-type-transactions-at-same-time--back--back-date) | ★ SOA OB/CB with 2 same-type transactions at same time — back & back date | SOA OB/CB - Concurrent same-type | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-SOA-014](#-ob-soa-014--soa-obcb-with-2-different-type-transactions-at-same-time--current--current-date) | ★ SOA OB/CB with 2 different-type transactions at same time — current & current date | SOA OB/CB - Concurrent mixed-type | P1 | E2E · Regression | Auto-UI+API | Active | 60 |
| [OB-SOA-015](#-ob-soa-015--soa-obcb-with-2-different-type-transactions-at-same-time--current--back-date) | ★ SOA OB/CB with 2 different-type transactions at same time — current & back date | SOA OB/CB - Concurrent mixed-type | P1 | E2E · Regression | Auto-UI+API | Active | 33 |
| [OB-SOA-016](#-ob-soa-016--soa-obcb-with-2-different-type-transactions-at-same-time--back--back-date) | ★ SOA OB/CB with 2 different-type transactions at same time — back & back date | SOA OB/CB - Concurrent mixed-type | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-SOA-017](#-ob-soa-017--soa-obcb-after-one-transaction-type-followed-by-another--type-pair-matrix) | ★ SOA OB/CB after one transaction type followed by another — type-pair matrix | SOA OB/CB - Sequential transactions | P1 | E2E · Regression | Auto-UI+API | Active | 132 |
| [OB-SOA-018](#-ob-soa-018--two-users-submit-uo-draft-for-same-apartment-at-same-time--second-blocked) | ★ Two users submit UO draft for same apartment at same time — second blocked | Concurrent draft submission | P1 | Regression | Auto-API | Review | 2 |
| [OB-SOA-019](#-ob-soa-019--two-users-submit-meter-reset-draft-for-same-apartment-at-same-time--second-blocked) | ★ Two users submit Meter Reset draft for same apartment at same time — second blocked | Concurrent draft submission | P1 | Regression | Auto-API | Review | 2 |
| [OB-SOA-020](#-ob-soa-020--two-users-submit-em-draft-for-same-apartment-at-same-time--second-blocked) | ★ Two users submit EM draft for same apartment at same time — second blocked | Concurrent draft submission | P1 | Regression | Auto-API | Review | 2 |
<!-- /generated:summary -->

## Test cases

### SOA OB/CB - Invoice

#### ★ OB-SOA-001 · SOA OB/CB continuity after current-date invoice — by category

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r3 |

**Scenario group:** Create Invoice with  (Current Date)

**Check point:**

Invoice date  
Check Invoice Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen Amount in Apartment's SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Normal Invoice  (Not Utilities or Estate Mgmt Fees Category) | SOA - OB & CB r3 | |
| 2 | Category=Utilities; Date=Current | SOA - OB & CB r4 |  |
| 3 | Category=Estate Mgmt Fees; Date=Current | SOA - OB & CB r5 |  |

---

#### ★ OB-SOA-002 · SOA OB/CB continuity after current-date UO-generated invoice (manual / bulk import)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r6 |

**Scenario group:** Create Invoice with  (Current Date)

**Check point:**

Invoice date  
Check Invoice Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen Amount in Apartment's SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Invoice from UO | SOA - OB & CB r6 | |
| 2 | Source=UO bulk import; Date=Current | SOA - OB & CB r7 |  |

---

#### ★ OB-SOA-003 · SOA OB/CB continuity after back-dated invoice — by category × date position

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r9 |

**Scenario group:** Create Invoice with  (Back Date)

**Check point:**

Invoice date  
Check Invoice Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Normal Invoice  (Not Utilities or Estate Mgmt Fees Category) / 1st day, last day and mid-month date is chosen as the Back Date. | SOA - OB & CB r9 | |
| 2 | Category=Utilities; Date=Back date (1st/mid/last day) | SOA - OB & CB r10 |  |
| 3 | Category=Estate Mgmt Fees; Date=Back date (1st/mid/last day) | SOA - OB & CB r11 |  |

---

### SOA OB/CB - Debit note

#### ★ OB-SOA-004 · SOA OB/CB continuity after current-date debit note — by category

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r13 |

**Scenario group:** Create Debit Note with (Current Date)

**Check point:**

Debit Note date  
Check Invoice Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Normal Debit Note (Not Utilities or Estate Mgmt Fees Category) | SOA - OB & CB r13 | |
| 2 | Category=Utilities; Date=Current | SOA - OB & CB r14 |  |
| 3 | Category=Estate Mgmt Fees; Date=Current | SOA - OB & CB r15 |  |

---

#### ★ OB-SOA-005 · SOA OB/CB continuity after current-date EM-generated debit note (manual / bulk import)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r16 |

**Scenario group:** Create Debit Note with (Current Date)

**Check point:**

Debit Note date  
Check Invoice Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Debit Note from EM | SOA - OB & CB r16 | |
| 2 | Source=EM bulk import; Date=Current | SOA - OB & CB r17 |  |

---

#### ★ OB-SOA-006 · SOA OB/CB continuity after back-dated debit note — by category × date position

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r19 |

**Scenario group:** Create Debit Note with (Back Date)

**Check point:**

Debit Note date  
Check Invoice Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Normal Debit Note (Not Utilities or Estate Mgmt Fees Category) / 1st day, last day and mid-month date is chosen as the Back Date. | SOA - OB & CB r19 | |
| 2 | Category=Utilities; Date=Back date (1st/mid/last day) | SOA - OB & CB r20 |  |
| 3 | Category=Estate Mgmt Fees; Date=Back date (1st/mid/last day) | SOA - OB & CB r21 |  |
| 4 | Category unspecified (header row); Date=Back date (1st/mid/last day) | SOA - OB & CB r22 | Missing source priority; title lacks category (header row) |

---

### SOA OB/CB - Payment (RV)

#### ★ OB-SOA-007 · SOA OB/CB continuity after Make Payment RV — by currency × single/multiple/overflow

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r25 |

**Scenario group:** Make Payment

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (8 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Make Payment Directly (Same Currency) / Single Make Payment from (API) | SOA - OB & CB r25 | |
| 2 | Currency=Same; Mode=Multiple | SOA - OB & CB r26 |  |
| 3 | Currency=Same; Mode=Multiple (overflow to wallet) | SOA - OB & CB r27 |  |
| 4 | Currency=Same; Mode=unspecified (header row) | SOA - OB & CB r28 | Missing source priority; header row without sub-type |
| 5 | Currency=Different; Mode=Single | SOA - OB & CB r29 |  |
| 6 | Currency=Different; Mode=Multiple | SOA - OB & CB r30 |  |
| 7 | Currency=Different; Mode=Multiple (overflow to wallet) | SOA - OB & CB r31 |  |
| 8 | Currency=Different; Mode=unspecified (header row) | SOA - OB & CB r32 | Missing source priority; header row without sub-type |

---

### SOA OB/CB - Unknown RV assign

#### ★ OB-SOA-008 · SOA OB/CB continuity after current-date unknown RV assignment — by currency × mode

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r33 |

**Scenario group:** Make Payment

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (10 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Assigned from Unknown RV (Current Date & Same Currency) / Single Make Payment | SOA - OB & CB r33 | |
| 2 | Currency=Same; Mode=Multiple Make Payment; Date=Current | SOA - OB & CB r34 |  |
| 3 | Currency=Same; Mode=Multiple Make Payment (overflow to wallet); Date=Current | SOA - OB & CB r35 |  |
| 4 | Currency=Same; Mode=Multiple Make Payment (overflow to deposit); Date=Current | SOA - OB & CB r36 |  |
| 5 | Currency=Same; Mode=unspecified (header row); Date=Current | SOA - OB & CB r37 | Missing source priority; header row without sub-type |
| 6 | Currency=Different; Mode=Single Make Payment; Date=Current | SOA - OB & CB r38 |  |
| 7 | Currency=Different; Mode=Multiple Make Payment; Date=Current | SOA - OB & CB r39 |  |
| 8 | Currency=Different; Mode=Multiple Make Payment (overflow to wallet); Date=Current | SOA - OB & CB r40 |  |
| 9 | Currency=Different; Mode=Multiple Make Payment (overflow to deposit); Date=Current | SOA - OB & CB r41 |  |
| 10 | Currency=Different; Mode=unspecified (header row); Date=Current | SOA - OB & CB r42 | Missing source priority; header row without sub-type |

---

#### ★ OB-SOA-009 · SOA OB/CB continuity after back-dated unknown RV assignment — by currency × mode × date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r43 |

**Scenario group:** Make Payment

**Test way:**

1st day, last day and mid-month date of a month is chosen as the Back Date.  

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (10 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Assigned from Unknown RV (Back Date With Same Currency) / Single Make Payment | SOA - OB & CB r43 | |
| 2 | Currency=Same; Mode=Multiple Make Payment; Date=Back date (1st/mid/last day) | SOA - OB & CB r44 |  |
| 3 | Currency=Same; Mode=Multiple Make Payment (overflow to wallet); Date=Back date (1st/mid/last day) | SOA - OB & CB r45 |  |
| 4 | Currency=Same; Mode=Multiple Make Payment (overflow to deposit); Date=Back date (1st/mid/last day) | SOA - OB & CB r46 |  |
| 5 | Currency=Same; Mode=unspecified (header row); Date=Back date (1st/mid/last day) | SOA - OB & CB r47 | Missing source priority; header row without sub-type |
| 6 | Currency=Different; Mode=Single Make Payment; Date=Back date (1st/mid/last day) | SOA - OB & CB r48 |  |
| 7 | Currency=Different; Mode=Multiple Make Payment; Date=Back date (1st/mid/last day) | SOA - OB & CB r49 |  |
| 8 | Currency=Different; Mode=Multiple Make Payment (overflow to wallet); Date=Back date (1st/mid/last day) | SOA - OB & CB r50 |  |
| 9 | Currency=Different; Mode=Multiple Make Payment (overflow to deposit); Date=Back date (1st/mid/last day) | SOA - OB & CB r51 |  |
| 10 | Currency=Different; Mode=unspecified (header row); Date=Back date (1st/mid/last day) | SOA - OB & CB r52 | Missing source priority; header row without sub-type |

---

### SOA OB/CB - Wallet payment

#### ★ OB-SOA-010 · SOA OB/CB continuity after Wallet Payment (WP) — single / multiple

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r53 |

**Scenario group:** Wallet Payment (WP)

**Check point:**

WP date  
Check WP Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of transaction date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Single Make Payment | SOA - OB & CB r53 | |
| 2 | Mode=Multiple | SOA - OB & CB r54 |  |

---

### SOA OB/CB - Concurrent same-type

#### ★ OB-SOA-011 · SOA OB/CB with 2 same-type transactions at same time — current & current date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r58 |

**Scenario group:** 2 same Transaction type at the  same time

**Test way:**

Current Date & Curent Date  

**Check point:**

Transaction date  
Check Transaction Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (6 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Invoice (Inv) / Invoice (Inv) | SOA - OB & CB r58 | |
| 2 | 1st=Debit Note (DN); 2nd=Debit Note (DN); Dates=Current Date & Current Date | SOA - OB & CB r59 |  |
| 3 | 1st=Make Payment (RV); 2nd=Make Payment (RV); Dates=Current Date & Current Date | SOA - OB & CB r60 |  |
| 4 | 1st=RV Unknown assign (RV); 2nd=RV Unknown assign (RV); Dates=Current Date & Current Date | SOA - OB & CB r61 |  |
| 5 | 1st=RV from SCLA; 2nd=RV from SCLA; Dates=Current Date & Current Date | SOA - OB & CB r62 |  |
| 6 | 1st=Wallet Payment (WP); 2nd=Wallet Payment (WP); Dates=Current Date & Current Date | SOA - OB & CB r63 |  |

---

#### ★ OB-SOA-012 · SOA OB/CB with 2 same-type transactions at same time — current & back date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r64 |

**Scenario group:** 2 same Transaction type at the  same time

**Test way:**

Current Date & Back Date  

**Check point:**

Transaction date  
Check Transaction Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Invoice (Inv) / Invoice (Inv) | SOA - OB & CB r64 | |
| 2 | 1st=Debit Note (DN); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r65 |  |
| 3 | 1st=RV Unknown assign (RV); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r66 |  |

---

#### ★ OB-SOA-013 · SOA OB/CB with 2 same-type transactions at same time — back & back date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r67 |

**Scenario group:** 2 same Transaction type at the  same time

**Test way:**

Back Date & Back Date  

**Check point:**

Transaction date  
Check Transaction Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Invoice (Inv) / Invoice (Inv) | SOA - OB & CB r67 | |
| 2 | 1st=Debit Note (DN); 2nd=Debit Note (DN); Dates=Back Date & Back Date | SOA - OB & CB r68 |  |
| 3 | 1st=RV Unknown assign (RV); 2nd=RV Unknown assign (RV); Dates=Back Date & Back Date | SOA - OB & CB r69 |  |

---

### SOA OB/CB - Concurrent mixed-type

#### ★ OB-SOA-014 · SOA OB/CB with 2 different-type transactions at same time — current & current date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r72 |

**Scenario group:** High

**Test way:**

Current Date & Curent Date  

**Check point:**

Transaction Date  
Check transaction Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (60 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Invoice (Inv) / Debit Note (DN) | SOA - OB & CB r72 | |
| 2 | 1st=Invoice (Inv); 2nd=Make Payment (RV); Dates=Current Date & Current Date | SOA - OB & CB r73 |  |
| 3 | 1st=Invoice (Inv); 2nd=RV Unknown assign (RV); Dates=Current Date & Current Date | SOA - OB & CB r74 |  |
| 4 | 1st=Invoice (Inv); 2nd=RV from SCLA; Dates=Current Date & Current Date | SOA - OB & CB r75 |  |
| 5 | 1st=Invoice (Inv); 2nd=Wallet Payment (WP); Dates=Current Date & Current Date | SOA - OB & CB r76 |  |
| 6 | 1st=Invoice (Inv); 2nd=UO(manual); Dates=Current Date & Current Date | SOA - OB & CB r77 |  |
| 7 | 1st=Invoice (Inv); 2nd=UO(bulk approve); Dates=Current Date & Current Date | SOA - OB & CB r78 |  |
| 8 | 1st=Invoice (Inv); 2nd=UO (import); Dates=Current Date & Current Date | SOA - OB & CB r79 |  |
| 9 | 1st=Invoice (Inv); 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r80 |  |
| 10 | 1st=Invoice (Inv); 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r81 |  |
| 11 | 1st=Invoice (Inv); 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r82 |  |
| 12 | 1st=Debit Note (DN); 2nd=Make Payment (RV); Dates=Current Date & Current Date | SOA - OB & CB r83 |  |
| 13 | 1st=Debit Note (DN); 2nd=RV Unknown assign (RV); Dates=Current Date & Current Date | SOA - OB & CB r84 |  |
| 14 | 1st=Debit Note (DN); 2nd=RV from SCLA; Dates=Current Date & Current Date | SOA - OB & CB r85 |  |
| 15 | 1st=Debit Note (DN); 2nd=Wallet Payment (WP); Dates=Current Date & Current Date | SOA - OB & CB r86 |  |
| 16 | 1st=Debit Note (DN); 2nd=UO(manual); Dates=Current Date & Current Date | SOA - OB & CB r87 |  |
| 17 | 1st=Debit Note (DN); 2nd=UO(bulk approve); Dates=Current Date & Current Date | SOA - OB & CB r88 |  |
| 18 | 1st=Debit Note (DN); 2nd=UO (import); Dates=Current Date & Current Date | SOA - OB & CB r89 |  |
| 19 | 1st=Debit Note (DN); 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r90 |  |
| 20 | 1st=Debit Note (DN); 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r91 |  |
| 21 | 1st=Debit Note (DN); 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r92 |  |
| 22 | 1st=Make Payment (RV); 2nd=RV Unknown assign (RV); Dates=Current Date & Current Date | SOA - OB & CB r93 |  |
| 23 | 1st=Make Payment (RV); 2nd=RV from SCLA; Dates=Current Date & Current Date | SOA - OB & CB r94 |  |
| 24 | 1st=Make Payment (RV); 2nd=Wallet Payment (WP); Dates=Current Date & Current Date | SOA - OB & CB r95 |  |
| 25 | 1st=Make Payment (RV); 2nd=UO(manual); Dates=Current Date & Current Date | SOA - OB & CB r96 |  |
| 26 | 1st=Make Payment (RV); 2nd=UO(bulk approve); Dates=Current Date & Current Date | SOA - OB & CB r97 |  |
| 27 | 1st=Make Payment (RV); 2nd=UO (import); Dates=Current Date & Current Date | SOA - OB & CB r98 |  |
| 28 | 1st=Make Payment (RV); 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r99 |  |
| 29 | 1st=Make Payment (RV); 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r100 |  |
| 30 | 1st=Make Payment (RV); 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r101 |  |
| 31 | 1st=RV Unknown assign (RV); 2nd=RV from SCLA; Dates=Current Date & Current Date | SOA - OB & CB r102 |  |
| 32 | 1st=RV Unknown assign (RV); 2nd=Wallet Payment (WP); Dates=Current Date & Current Date | SOA - OB & CB r103 |  |
| 33 | 1st=RV Unknown assign (RV); 2nd=UO(manual); Dates=Current Date & Current Date | SOA - OB & CB r104 |  |
| 34 | 1st=RV Unknown assign (RV); 2nd=UO(bulk approve); Dates=Current Date & Current Date | SOA - OB & CB r105 |  |
| 35 | 1st=RV Unknown assign (RV); 2nd=UO (import); Dates=Current Date & Current Date | SOA - OB & CB r106 |  |
| 36 | 1st=RV Unknown assign (RV); 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r107 |  |
| 37 | 1st=RV Unknown assign (RV); 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r108 |  |
| 38 | 1st=RV Unknown assign (RV); 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r109 |  |
| 39 | 1st=RV from SCLA; 2nd=Wallet Payment (WP); Dates=Current Date & Current Date | SOA - OB & CB r110 |  |
| 40 | 1st=RV from SCLA; 2nd=UO(manual); Dates=Current Date & Current Date | SOA - OB & CB r111 |  |
| 41 | 1st=RV from SCLA; 2nd=UO(bulk approve); Dates=Current Date & Current Date | SOA - OB & CB r112 |  |
| 42 | 1st=RV from SCLA; 2nd=UO (import); Dates=Current Date & Current Date | SOA - OB & CB r113 |  |
| 43 | 1st=RV from SCLA; 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r114 |  |
| 44 | 1st=RV from SCLA; 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r115 |  |
| 45 | 1st=RV from SCLA; 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r116 |  |
| 46 | 1st=Wallet Payment (WP); 2nd=UO(manual); Dates=Current Date & Current Date | SOA - OB & CB r117 |  |
| 47 | 1st=Wallet Payment (WP); 2nd=UO(bulk approve); Dates=Current Date & Current Date | SOA - OB & CB r118 |  |
| 48 | 1st=Wallet Payment (WP); 2nd=UO (import); Dates=Current Date & Current Date | SOA - OB & CB r119 |  |
| 49 | 1st=Wallet Payment (WP); 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r120 |  |
| 50 | 1st=Wallet Payment (WP); 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r121 |  |
| 51 | 1st=Wallet Payment (WP); 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r122 |  |
| 52 | 1st=UO(manual); 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r123 |  |
| 53 | 1st=UO(manual); 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r124 |  |
| 54 | 1st=UO(manual); 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r125 |  |
| 55 | 1st=UO(bulk approve); 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r126 |  |
| 56 | 1st=UO(bulk approve); 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r127 |  |
| 57 | 1st=UO(bulk approve); 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r128 |  |
| 58 | 1st=UO (import); 2nd=EM(manual); Dates=Current Date & Current Date | SOA - OB & CB r129 |  |
| 59 | 1st=UO (import); 2nd=EM(Bulk approved); Dates=Current Date & Current Date | SOA - OB & CB r130 |  |
| 60 | 1st=UO (import); 2nd=EM(import); Dates=Current Date & Current Date | SOA - OB & CB r131 |  |

---

#### ★ OB-SOA-015 · SOA OB/CB with 2 different-type transactions at same time — current & back date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r132 |

**Scenario group:** High

**Test way:**

Current Date & Back Date  

**Check point:**

Transaction Date  
Check transaction Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (33 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Invoice (Inv) / Debit Note (DN) | SOA - OB & CB r132 | |
| 2 | 1st=Invoice (Inv); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r133 |  |
| 3 | 1st=Debit Note (DN); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r134 |  |
| 4 | 1st=Debit Note (DN); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r135 |  |
| 5 | 1st=Make Payment (RV); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r136 |  |
| 6 | 1st=Make Payment (RV); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r137 |  |
| 7 | 1st=Make Payment (RV); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r138 |  |
| 8 | 1st=RV Unknown assign (RV); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r139 |  |
| 9 | 1st=RV Unknown assign (RV); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r140 |  |
| 10 | 1st=RV from SCLA; 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r141 |  |
| 11 | 1st=RV from SCLA; 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r142 |  |
| 12 | 1st=RV from SCLA; 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r143 |  |
| 13 | 1st=Wallet Payment (WP); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r144 |  |
| 14 | 1st=Wallet Payment (WP); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r145 |  |
| 15 | 1st=Wallet Payment (WP); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r146 |  |
| 16 | 1st=UO(manual); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r147 |  |
| 17 | 1st=UO(manual); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r148 |  |
| 18 | 1st=UO(manual); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r149 |  |
| 19 | 1st=UO(bulk approve); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r150 |  |
| 20 | 1st=UO(bulk approve); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r151 |  |
| 21 | 1st=UO(bulk approve); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r152 |  |
| 22 | 1st=UO (import); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r153 |  |
| 23 | 1st=UO (import); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r154 |  |
| 24 | 1st=UO (import); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r155 |  |
| 25 | 1st=EM(manual); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r156 |  |
| 26 | 1st=EM(manual); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r157 |  |
| 27 | 1st=EM(manual); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r158 |  |
| 28 | 1st=EM(Bulk approved); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r159 |  |
| 29 | 1st=EM(Bulk approved); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r160 |  |
| 30 | 1st=EM(Bulk approved); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r161 |  |
| 31 | 1st=EM(import); 2nd=Invoice (Inv); Dates=Current Date & Back Date | SOA - OB & CB r162 |  |
| 32 | 1st=EM(import); 2nd=Debit Note (DN); Dates=Current Date & Back Date | SOA - OB & CB r163 |  |
| 33 | 1st=EM(import); 2nd=RV Unknown assign (RV); Dates=Current Date & Back Date | SOA - OB & CB r164 |  |

---

#### ★ OB-SOA-016 · SOA OB/CB with 2 different-type transactions at same time — back & back date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r165 |

**Scenario group:** High

**Test way:**

Back Date & Back Date  

**Check point:**

Transaction Date  
Check transaction Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Invoice (Inv) / Debit Note (DN) | SOA - OB & CB r165 | |
| 2 | 1st=Invoice (Inv); 2nd=RV Unknown assign (RV); Dates=Back Date & Back Date | SOA - OB & CB r166 |  |
| 3 | 1st=Debit Note (DN); 2nd=RV Unknown assign (RV); Dates=Back Date & Back Date | SOA - OB & CB r167 |  |

---

### SOA OB/CB - Sequential transactions

#### ★ OB-SOA-017 · SOA OB/CB after one transaction type followed by another — type-pair matrix

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | SOA - OB & CB r170 |

**Scenario group:** One transaction Type is  followed by Another  Transaction Type

**Check point:**

Transaction Date  
Check transaction Number  
Balance Calculation  
Balance Due Amount in Apartment > SOA screen  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment SOA page  
Apartment SOA PDF  
Bulk SOA PDF  
API - > Apartment > SOA by Apartment  
API - > PDF Printouts > Apartment SOA PDF  
All of the above should be correct if you check)  

**Data variants (132 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Invoice (Inv) / Debit Note (DN) | SOA - OB & CB r170 | |
| 2 | 1st=Invoice (Inv); 2nd=Make Payment (RV) | SOA - OB & CB r171 |  |
| 3 | 1st=Invoice (Inv); 2nd=RV Unknown assign (RV) | SOA - OB & CB r172 |  |
| 4 | 1st=Invoice (Inv); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r173 |  |
| 5 | 1st=Invoice (Inv); 2nd=Wallet Payment (WP) | SOA - OB & CB r174 |  |
| 6 | 1st=Invoice (Inv); 2nd=UO(manual) | SOA - OB & CB r175 |  |
| 7 | 1st=Invoice (Inv); 2nd=UO(bulk approve) | SOA - OB & CB r176 |  |
| 8 | 1st=Invoice (Inv); 2nd=UO (import) | SOA - OB & CB r177 |  |
| 9 | 1st=Invoice (Inv); 2nd=EM(manual) | SOA - OB & CB r178 |  |
| 10 | 1st=Invoice (Inv); 2nd=EM(Bulk approved) | SOA - OB & CB r179 |  |
| 11 | 1st=Invoice (Inv); 2nd=EM(import) | SOA - OB & CB r180 |  |
| 12 | 1st=Debit Note (DN); 2nd=Invoice (Inv) | SOA - OB & CB r182 |  |
| 13 | 1st=Debit Note (DN); 2nd=Make Payment (RV) | SOA - OB & CB r183 |  |
| 14 | 1st=Debit Note (DN); 2nd=RV Unknown assign (RV) | SOA - OB & CB r184 |  |
| 15 | 1st=Debit Note (DN); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r185 |  |
| 16 | 1st=Debit Note (DN); 2nd=Wallet Payment (WP) | SOA - OB & CB r186 |  |
| 17 | 1st=Debit Note (DN); 2nd=UO(manual) | SOA - OB & CB r187 |  |
| 18 | 1st=Debit Note (DN); 2nd=UO(bulk approve) | SOA - OB & CB r188 |  |
| 19 | 1st=Debit Note (DN); 2nd=UO (import) | SOA - OB & CB r189 |  |
| 20 | 1st=Debit Note (DN); 2nd=EM(manual) | SOA - OB & CB r190 |  |
| 21 | 1st=Debit Note (DN); 2nd=EM(Bulk approved) | SOA - OB & CB r191 |  |
| 22 | 1st=Debit Note (DN); 2nd=EM(import) | SOA - OB & CB r192 |  |
| 23 | 1st=Make Payment (RV); 2nd=RV Unknown assign (RV) | SOA - OB & CB r194 |  |
| 24 | 1st=Make Payment (RV); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r195 |  |
| 25 | 1st=Make Payment (RV); 2nd=Invoice (Inv) | SOA - OB & CB r196 |  |
| 26 | 1st=Make Payment (RV); 2nd=Debit Note (DN) | SOA - OB & CB r197 |  |
| 27 | 1st=Make Payment (RV); 2nd=Wallet Payment (WP) | SOA - OB & CB r198 |  |
| 28 | 1st=Make Payment (RV); 2nd=UO(manual) | SOA - OB & CB r199 |  |
| 29 | 1st=Make Payment (RV); 2nd=UO(bulk approve) | SOA - OB & CB r200 |  |
| 30 | 1st=Make Payment (RV); 2nd=UO (import) | SOA - OB & CB r201 |  |
| 31 | 1st=Make Payment (RV); 2nd=EM(manual) | SOA - OB & CB r202 |  |
| 32 | 1st=Make Payment (RV); 2nd=EM(Bulk approved) | SOA - OB & CB r203 |  |
| 33 | 1st=Make Payment (RV); 2nd=EM(import) | SOA - OB & CB r204 |  |
| 34 | 1st=RV Unknown assign (RV); 2nd=Invoice (Inv) | SOA - OB & CB r206 |  |
| 35 | 1st=RV Unknown assign (RV); 2nd=Debit Note (DN) | SOA - OB & CB r207 |  |
| 36 | 1st=RV Unknown assign (RV); 2nd=Make Payment (RV) | SOA - OB & CB r208 |  |
| 37 | 1st=RV Unknown assign (RV); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r209 |  |
| 38 | 1st=RV Unknown assign (RV); 2nd=Wallet Payment (WP) | SOA - OB & CB r210 |  |
| 39 | 1st=RV Unknown assign (RV); 2nd=UO(manual) | SOA - OB & CB r211 |  |
| 40 | 1st=RV Unknown assign (RV); 2nd=UO(bulk approve) | SOA - OB & CB r212 |  |
| 41 | 1st=RV Unknown assign (RV); 2nd=UO (import) | SOA - OB & CB r213 |  |
| 42 | 1st=RV Unknown assign (RV); 2nd=EM(manual) | SOA - OB & CB r214 |  |
| 43 | 1st=RV Unknown assign (RV); 2nd=EM(Bulk approved) | SOA - OB & CB r215 |  |
| 44 | 1st=RV Unknown assign (RV); 2nd=EM(import) | SOA - OB & CB r216 |  |
| 45 | 1st=RV from SCLA; 2nd=RV Unknown assign (RV) | SOA - OB & CB r218 |  |
| 46 | 1st=RV from SCLA; 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r219 |  |
| 47 | 1st=RV from SCLA; 2nd=Invoice (Inv) | SOA - OB & CB r220 |  |
| 48 | 1st=RV from SCLA; 2nd=Debit Note (DN) | SOA - OB & CB r221 |  |
| 49 | 1st=RV from SCLA; 2nd=Wallet Payment (WP) | SOA - OB & CB r222 |  |
| 50 | 1st=RV from SCLA; 2nd=UO(manual) | SOA - OB & CB r223 |  |
| 51 | 1st=RV from SCLA; 2nd=UO(bulk approve) | SOA - OB & CB r224 |  |
| 52 | 1st=RV from SCLA; 2nd=UO (import) | SOA - OB & CB r225 |  |
| 53 | 1st=RV from SCLA; 2nd=EM(manual) | SOA - OB & CB r226 |  |
| 54 | 1st=RV from SCLA; 2nd=EM(Bulk approved) | SOA - OB & CB r227 |  |
| 55 | 1st=RV from SCLA; 2nd=EM(import) | SOA - OB & CB r228 |  |
| 56 | 1st=Wallet Payment (WP); 2nd=Invoice (Inv) | SOA - OB & CB r230 |  |
| 57 | 1st=Wallet Payment (WP); 2nd=Debit Note (DN) | SOA - OB & CB r231 |  |
| 58 | 1st=Wallet Payment (WP); 2nd=Make Payment (RV) | SOA - OB & CB r232 |  |
| 59 | 1st=Wallet Payment (WP); 2nd=RV Unknown assign (RV) | SOA - OB & CB r233 |  |
| 60 | 1st=Wallet Payment (WP); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r234 |  |
| 61 | 1st=Wallet Payment (WP); 2nd=UO(manual) | SOA - OB & CB r235 |  |
| 62 | 1st=Wallet Payment (WP); 2nd=UO(bulk approve) | SOA - OB & CB r236 |  |
| 63 | 1st=Wallet Payment (WP); 2nd=UO (import) | SOA - OB & CB r237 |  |
| 64 | 1st=Wallet Payment (WP); 2nd=EM(manual) | SOA - OB & CB r238 |  |
| 65 | 1st=Wallet Payment (WP); 2nd=EM(Bulk approved) | SOA - OB & CB r239 |  |
| 66 | 1st=Wallet Payment (WP); 2nd=EM(import) | SOA - OB & CB r240 |  |
| 67 | 1st=UO(manual); 2nd=Invoice (Inv) | SOA - OB & CB r242 |  |
| 68 | 1st=UO(manual); 2nd=Debit Note (DN) | SOA - OB & CB r243 |  |
| 69 | 1st=UO(manual); 2nd=Make Payment (RV) | SOA - OB & CB r244 |  |
| 70 | 1st=UO(manual); 2nd=RV Unknown assign (RV) | SOA - OB & CB r245 |  |
| 71 | 1st=UO(manual); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r246 |  |
| 72 | 1st=UO(manual); 2nd=Wallet Payment (WP) | SOA - OB & CB r247 |  |
| 73 | 1st=UO(manual); 2nd=UO(bulk approve) | SOA - OB & CB r248 |  |
| 74 | 1st=UO(manual); 2nd=UO (import) | SOA - OB & CB r249 |  |
| 75 | 1st=UO(manual); 2nd=EM(manual) | SOA - OB & CB r250 |  |
| 76 | 1st=UO(manual); 2nd=EM(Bulk approved) | SOA - OB & CB r251 |  |
| 77 | 1st=UO(manual); 2nd=EM(import) | SOA - OB & CB r252 |  |
| 78 | 1st=UO(bulk approve); 2nd=Invoice (Inv) | SOA - OB & CB r254 |  |
| 79 | 1st=UO(bulk approve); 2nd=Debit Note (DN) | SOA - OB & CB r255 |  |
| 80 | 1st=UO(bulk approve); 2nd=Make Payment (RV) | SOA - OB & CB r256 |  |
| 81 | 1st=UO(bulk approve); 2nd=RV Unknown assign (RV) | SOA - OB & CB r257 |  |
| 82 | 1st=UO(bulk approve); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r258 |  |
| 83 | 1st=UO(bulk approve); 2nd=Wallet Payment (WP) | SOA - OB & CB r259 |  |
| 84 | 1st=UO(bulk approve); 2nd=UO(manual) | SOA - OB & CB r260 |  |
| 85 | 1st=UO(bulk approve); 2nd=UO (import) | SOA - OB & CB r261 |  |
| 86 | 1st=UO(bulk approve); 2nd=EM(manual) | SOA - OB & CB r262 |  |
| 87 | 1st=UO(bulk approve); 2nd=EM(Bulk approved) | SOA - OB & CB r263 |  |
| 88 | 1st=UO(bulk approve); 2nd=EM(import) | SOA - OB & CB r264 |  |
| 89 | 1st=UO (import); 2nd=Invoice (Inv) | SOA - OB & CB r266 |  |
| 90 | 1st=UO (import); 2nd=Debit Note (DN) | SOA - OB & CB r267 |  |
| 91 | 1st=UO (import); 2nd=Make Payment (RV) | SOA - OB & CB r268 |  |
| 92 | 1st=UO (import); 2nd=RV Unknown assign (RV) | SOA - OB & CB r269 |  |
| 93 | 1st=UO (import); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r270 |  |
| 94 | 1st=UO (import); 2nd=Wallet Payment (WP) | SOA - OB & CB r271 |  |
| 95 | 1st=UO (import); 2nd=UO(manual) | SOA - OB & CB r272 |  |
| 96 | 1st=UO (import); 2nd=UO(bulk approve) | SOA - OB & CB r273 |  |
| 97 | 1st=UO (import); 2nd=EM(manual) | SOA - OB & CB r274 |  |
| 98 | 1st=UO (import); 2nd=EM(Bulk approved) | SOA - OB & CB r275 |  |
| 99 | 1st=UO (import); 2nd=EM(import) | SOA - OB & CB r276 |  |
| 100 | 1st=EM(manual); 2nd=Invoice (Inv) | SOA - OB & CB r278 |  |
| 101 | 1st=EM(manual); 2nd=Debit Note (DN) | SOA - OB & CB r279 |  |
| 102 | 1st=EM(manual); 2nd=Make Payment (RV) | SOA - OB & CB r280 |  |
| 103 | 1st=EM(manual); 2nd=RV Unknown assign (RV) | SOA - OB & CB r281 |  |
| 104 | 1st=EM(manual); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r282 |  |
| 105 | 1st=EM(manual); 2nd=Wallet Payment (WP) | SOA - OB & CB r283 |  |
| 106 | 1st=EM(manual); 2nd=UO(manual) | SOA - OB & CB r284 |  |
| 107 | 1st=EM(manual); 2nd=UO(bulk approve) | SOA - OB & CB r285 |  |
| 108 | 1st=EM(manual); 2nd=UO (import) | SOA - OB & CB r286 |  |
| 109 | 1st=EM(manual); 2nd=EM(Bulk approved) | SOA - OB & CB r287 |  |
| 110 | 1st=EM(manual); 2nd=EM(import) | SOA - OB & CB r288 |  |
| 111 | 1st=EM(Bulk approved); 2nd=Invoice (Inv) | SOA - OB & CB r290 |  |
| 112 | 1st=EM(Bulk approved); 2nd=Debit Note (DN) | SOA - OB & CB r291 |  |
| 113 | 1st=EM(Bulk approved); 2nd=Make Payment (RV) | SOA - OB & CB r292 |  |
| 114 | 1st=EM(Bulk approved); 2nd=RV Unknown assign (RV) | SOA - OB & CB r293 |  |
| 115 | 1st=EM(Bulk approved); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r294 |  |
| 116 | 1st=EM(Bulk approved); 2nd=Wallet Payment (WP) | SOA - OB & CB r295 |  |
| 117 | 1st=EM(Bulk approved); 2nd=UO(manual) | SOA - OB & CB r296 |  |
| 118 | 1st=EM(Bulk approved); 2nd=UO(bulk approve) | SOA - OB & CB r297 |  |
| 119 | 1st=EM(Bulk approved); 2nd=UO (import) | SOA - OB & CB r298 |  |
| 120 | 1st=EM(Bulk approved); 2nd=EM(manual) | SOA - OB & CB r299 |  |
| 121 | 1st=EM(Bulk approved); 2nd=EM(import) | SOA - OB & CB r300 |  |
| 122 | 1st=EM(import); 2nd=Invoice (Inv) | SOA - OB & CB r302 |  |
| 123 | 1st=EM(import); 2nd=Debit Note (DN) | SOA - OB & CB r303 |  |
| 124 | 1st=EM(import); 2nd=Make Payment (RV) | SOA - OB & CB r304 |  |
| 125 | 1st=EM(import); 2nd=RV Unknown assign (RV) | SOA - OB & CB r305 |  |
| 126 | 1st=EM(import); 2nd=Make Payment (RV) from SCLA | SOA - OB & CB r306 |  |
| 127 | 1st=EM(import); 2nd=Wallet Payment (WP) | SOA - OB & CB r307 |  |
| 128 | 1st=EM(import); 2nd=UO(manual) | SOA - OB & CB r308 |  |
| 129 | 1st=EM(import); 2nd=UO(bulk approve) | SOA - OB & CB r309 |  |
| 130 | 1st=EM(import); 2nd=UO (import) | SOA - OB & CB r310 |  |
| 131 | 1st=EM(import); 2nd=EM(manual) | SOA - OB & CB r311 |  |
| 132 | 1st=EM(import); 2nd=EM(Bulk approved) | SOA - OB & CB r312 |  |

---

### Concurrent draft submission

#### ★ OB-SOA-018 · Two users submit UO draft for same apartment at same time — second blocked

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Review — Expected result only in Data column (error message); exact duplicate row follows; owned by UO/EM modules | SOA - OB & CB r314 |

**Scenario group:** Two users for one  apartment submit UO  record at the same time

**Test way:**

error msg "Apartment have draft UO Invoice pending."  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) UO (Draft) / UO (Draft) | SOA - OB & CB r314 | |
| 2 | Exact duplicate row | SOA - OB & CB r315 | Review; Expected result only in Data column (error message); exact duplicate row follows; owned by UO/EM modules |

---

#### ★ OB-SOA-019 · Two users submit Meter Reset draft for same apartment at same time — second blocked

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Review — Expected result only in Data column (error message); exact duplicate row follows; owned by UO/EM modules | SOA - OB & CB r316 |

**Scenario group:** Two users for one  apartment submit UO  record at the same time

**Test way:**

error msg "Apartment have draft Meter Reset pending."  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) MR (Draft) / MR (Draft) | SOA - OB & CB r316 | |
| 2 | Exact duplicate row | SOA - OB & CB r317 | Review; Expected result only in Data column (error message); exact duplicate row follows; owned by UO/EM modules |

---

#### ★ OB-SOA-020 · Two users submit EM draft for same apartment at same time — second blocked

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Review — Expected result only in Data column (error message); exact duplicate row follows; owned by UO/EM modules | SOA - OB & CB r318 |

**Scenario group:** Two users for one  apartment submit EM  record at the same time

**Test way:**

error msg "Apartment have draft EM Invoice pending."  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) EM (Draft) / EM (Draft) | SOA - OB & CB r318 | |
| 2 | Exact duplicate row | SOA - OB & CB r319 | Review; Expected result only in Data column (error message); exact duplicate row follows; owned by UO/EM modules |

---
