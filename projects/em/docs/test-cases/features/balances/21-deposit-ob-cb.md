# 21 · Deposit — Opening / Closing Balance

[← Test case index](../../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 13 (+24 data-variant rows)  
**Priority:** P1 13 · P2 0 · P3 0 · **★ Critical:** 13 · **Smoke:** 1 · **E2E:** 11 · **Auto:** 13 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [OB-DEP-001](#-ob-dep-001--deposit-obcb-continuity-after-current-date-add-deposit-rv--by-source) | ★ Deposit OB/CB continuity after current-date add deposit (RV) — by source | Deposit OB/CB - Add deposit | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 5 |
| [OB-DEP-002](#-ob-dep-002--deposit-obcb-continuity-after-back-dated-add-deposit-rv--by-source--date-position) | ★ Deposit OB/CB continuity after back-dated add deposit (RV) — by source × date position | Deposit OB/CB - Add deposit | P1 | E2E · Regression | Auto-UI+API | Active | 4 |
| [OB-DEP-003](#-ob-dep-003--deposit-obcb-continuity-after-current-date-deposit-withdraw-pv) | ★ Deposit OB/CB continuity after current-date deposit withdraw (PV) | Deposit OB/CB - Withdraw | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-DEP-004](#-ob-dep-004--deposit-obcb-continuity-after-back-dated-late-approved-deposit-withdraw-pv) | ★ Deposit OB/CB continuity after back-dated, late-approved deposit withdraw (PV) | Deposit OB/CB - Withdraw | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-DEP-005](#-ob-dep-005--deposit-obcb-with-2-same-type-transactions-at-same-time--current--current-date) | ★ Deposit OB/CB with 2 same-type transactions at same time — current & current date | Deposit OB/CB - Concurrent | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-DEP-006](#-ob-dep-006--deposit-obcb-with-2-same-type-transactions-at-same-time--current--back-date) | ★ Deposit OB/CB with 2 same-type transactions at same time — current & back date | Deposit OB/CB - Concurrent | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-DEP-007](#-ob-dep-007--deposit-obcb-with-2-same-type-transactions-at-same-time--back--back-date) | ★ Deposit OB/CB with 2 same-type transactions at same time — back & back date | Deposit OB/CB - Concurrent | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-DEP-008](#-ob-dep-008--deposit-obcb-with-2-different-type-transactions-at-same-time--current--current-date) | ★ Deposit OB/CB with 2 different-type transactions at same time — current & current date | Deposit OB/CB - Concurrent | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-DEP-009](#-ob-dep-009--deposit-obcb-with-2-different-type-transactions-at-same-time--current--back-date) | ★ Deposit OB/CB with 2 different-type transactions at same time — current & back date | Deposit OB/CB - Concurrent | P1 | E2E · Regression | Auto-UI+API | Active | 4 |
| [OB-DEP-010](#-ob-dep-010--deposit-obcb-with-2-different-type-transactions-at-same-time--back--back-date) | ★ Deposit OB/CB with 2 different-type transactions at same time — back & back date | Deposit OB/CB - Concurrent | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [OB-DEP-011](#-ob-dep-011--deposit-obcb-after-one-transaction-type-followed-by-another--type-pair-matrix) | ★ Deposit OB/CB after one transaction type followed by another — type-pair matrix | Deposit OB/CB - Sequential | P1 | E2E · Regression | Auto-UI+API | Active | 6 |
| [OB-DEP-012](#-ob-dep-012--two-users-withdraw-deposit-concurrently-exceeding-balance--second-refused) | ★ Two users withdraw deposit concurrently exceeding balance — second refused | Deposit withdraw concurrency | P1 | Regression | Auto-API | Active | 2 |
| [OB-DEP-013](#-ob-dep-013--two-users-withdraw-deposit-concurrently-within-balance--both-allowed-and-approvable) | ★ Two users withdraw deposit concurrently within balance — both allowed and approvable | Deposit withdraw concurrency | P1 | Regression | Auto-API | Active |  |
<!-- /generated:summary -->

## Test cases

### Deposit OB/CB - Add deposit

#### ★ OB-DEP-001 · Deposit OB/CB continuity after current-date add deposit (RV) — by source

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r3 |

**Scenario group:** Create Add Deposit(RV) with (Current Date)

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (5 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Add Deposit (RV) from Apartment > Deposit (manual) | Deposit - OB & CB r3 | |
| 2 | Source=Convert unknown RV to deposit; Currency=Same; Date=Current | Deposit - OB & CB r4 |  |
| 3 | Source=Convert unknown RV to deposit; Currency=Other; Date=Current | Deposit - OB & CB r5 |  |
| 4 | Source=Unknown RV assign overflow to deposit; Currency=Same; Date=Current | Deposit - OB & CB r6 |  |
| 5 | Source=Unknown RV assign overflow to deposit; Currency=Other; Date=Current | Deposit - OB & CB r7 |  |

---

#### ★ OB-DEP-002 · Deposit OB/CB continuity after back-dated add deposit (RV) — by source × date position

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r9 |

**Scenario group:** Create Add Deposit(RV) with (Back Date)

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Convert unknown RV to deposit RV (Directly add to the deposit) / 1st day, last day and mid-month date is chosen as  the Back Date. | Deposit - OB & CB r9 | |
| 2 | Source=Convert unknown RV to deposit; Currency=Other; Date=Back date (1st/mid/last day) | Deposit - OB & CB r10 |  |
| 3 | Source=Unknown RV assign overflow to deposit; Currency=Same; Date=Back date (1st/mid/last day) | Deposit - OB & CB r11 |  |
| 4 | Source=Unknown RV assign overflow to deposit; Currency=Other; Date=Back date (1st/mid/last day) | Deposit - OB & CB r12 |  |

---

### Deposit OB/CB - Withdraw

#### ★ OB-DEP-003 · Deposit OB/CB continuity after current-date deposit withdraw (PV)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r14 |

**Scenario group:** Create Withdraw Deposit(PV) with(Current date)

**Check point:**

PV date  
Check PV no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Deposit Withdraw | Deposit - OB & CB r14 | |
| 2 | Exact duplicate row | Deposit - OB & CB r15 | Exact duplicate of DOB-R14 (likely meant a different data set) |

---

#### ★ OB-DEP-004 · Deposit OB/CB continuity after back-dated, late-approved deposit withdraw (PV)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r17 |

**Scenario group:** Create Withdraw Deposit(PV) with(backdate)

**Check point:**

PV date  
Check PV no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Deposit Withdraw (late approved) / 1st day, last day and mid-month date is chosen as  the Back Date. | Deposit - OB & CB r17 | |
| 2 | Exact duplicate row | Deposit - OB & CB r18 | Exact duplicate of DOB-R17 (likely meant a different data set) |

---

### Deposit OB/CB - Concurrent

#### ★ OB-DEP-005 · Deposit OB/CB with 2 same-type transactions at same time — current & current date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r21 |

**Scenario group:** 2 same transaction at the  same time

**Test way:**

Current Date & Curent Date  

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) RV (add deposit) / RV (add deposit) | Deposit - OB & CB r21 | |
| 2 | 1st=RV unknown assign; 2nd=RV unknown assign; Dates=Current Date & Current Date | Deposit - OB & CB r22 |  |
| 3 | 1st=PV (deposit withdraw); 2nd=PV (deposit withdraw); Dates=Current Date & Current Date | Deposit - OB & CB r23 |  |

---

#### ★ OB-DEP-006 · Deposit OB/CB with 2 same-type transactions at same time — current & back date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r24 |

**Scenario group:** 2 same transaction at the  same time

**Test way:**

Current Date & Back Date  

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) RV unknown assign / RV unknown assign | Deposit - OB & CB r24 | |
| 2 | 1st=PV (deposit withdraw); 2nd=PV (deposit withdraw); Dates=Current Date & Back Date | Deposit - OB & CB r25 |  |

---

#### ★ OB-DEP-007 · Deposit OB/CB with 2 same-type transactions at same time — back & back date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r26 |

**Scenario group:** 2 same transaction at the  same time

**Test way:**

Back Date & Back Date  

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) RV unknown assign / RV unknown assign | Deposit - OB & CB r26 | |
| 2 | 1st=PV (deposit withdraw); 2nd=PV (deposit withdraw); Dates=Back Date & Back Date | Deposit - OB & CB r27 |  |

---

#### ★ OB-DEP-008 · Deposit OB/CB with 2 different-type transactions at same time — current & current date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r30 |

**Scenario group:** 2 different transaction type at the same time

**Test way:**

Current Date & Curent Date  

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) RV (add deposit) / RV unknown assign | Deposit - OB & CB r30 | |
| 2 | 1st=RV (add deposit); 2nd=PV (deposit withdraw); Dates=Current Date & Current Date | Deposit - OB & CB r31 |  |
| 3 | 1st=RV unknown assign; 2nd=PV (deposit withdraw); Dates=Current Date & Current Date | Deposit - OB & CB r32 |  |

---

#### ★ OB-DEP-009 · Deposit OB/CB with 2 different-type transactions at same time — current & back date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r33 |

**Scenario group:** 2 different transaction type at the same time

**Test way:**

Current Date & Back Date  

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) RV (add deposit) / RV unknown assign | Deposit - OB & CB r33 | |
| 2 | 1st=RV (add deposit); 2nd=PV (deposit withdraw); Dates=Current Date & Back Date | Deposit - OB & CB r34 |  |
| 3 | 1st=RV unknown assign; 2nd=PV (deposit withdraw); Dates=Current Date & Back Date | Deposit - OB & CB r35 |  |
| 4 | 1st=PV (deposit withdraw); 2nd=RV unknown assign; Dates=Current Date & Back Date | Deposit - OB & CB r36 |  |

---

#### ★ OB-DEP-010 · Deposit OB/CB with 2 different-type transactions at same time — back & back date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r37 |

**Scenario group:** 2 different transaction type at the same time

**Test way:**

Back Date & Back Date  

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

---

### Deposit OB/CB - Sequential

#### ★ OB-DEP-011 · Deposit OB/CB after one transaction type followed by another — type-pair matrix

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit - OB & CB r39 |

**Scenario group:** one transaction type is  followed by another  transaction type

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Apartment > Deposit screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Deposit page  
Apartment Deposit PDF  
API - > Apartment > Deposit by Apartment  
API - > PDF Printouts > Apartment Deposit PDF  
All of the above should be correct if you check)  

**Data variants (6 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) RV (add deposit) / RV (unknown assign) | Deposit - OB & CB r39 | |
| 2 | 1st=RV (add deposit); 2nd=PV (deposit withdraw) | Deposit - OB & CB r40 |  |
| 3 | 1st=RV (unknown assign); 2nd=RV (add deposit) | Deposit - OB & CB r41 |  |
| 4 | 1st=RV (unknown assign); 2nd=PV (deposit withdraw) | Deposit - OB & CB r42 |  |
| 5 | 1st=PV (deposit withdraw); 2nd=RV (add deposit) | Deposit - OB & CB r43 |  |
| 6 | 1st=PV (deposit withdraw); 2nd=RV (unknown assign) | Deposit - OB & CB r44 |  |

---

### Deposit withdraw concurrency

#### ★ OB-DEP-012 · Two users withdraw deposit concurrently exceeding balance — second refused

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active — Expected in Area column ("Insufficient Balance..."); new EM message "Insufficient deposit balance" (wording differs) | Deposit - OB & CB r46 |

**Scenario group:** Deposit Withdraw by 2 users at the same time.

**Test way:**

Total Deposit balance = 100,000  
User1 withdraw amount= 100,000  
User2 withdraw amount= 100,000  

**Check point:**

Both users withdraw the full deposit balance at the same time  

**Check areas:**

"Insufficient Balance in 'Withdraw From' Account"  

> **Source comments:** The new EM matches the sheet here: the second one is refused when it goes over the balance.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) deposit withdraw (draft) / deposit withdraw (draft) | Deposit - OB & CB r46 | |
| 2 | User1 + User2 amounts > balance (partial amounts, not full balance each) | Deposit - OB & CB r48 | New EM message "Insufficient deposit balance" vs sheet "Insufficient Balance in Withdraw From Account" |

---

#### ★ OB-DEP-013 · Two users withdraw deposit concurrently within balance — both allowed and approvable

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active — Expected in Area column ("2 user allow"); confirmed by comment | Deposit - OB & CB r47 |

**Scenario group:** Deposit Withdraw by 2 users at the same time.

**Test way:**

Total Deposit balance = 100,000  
User1 withdraw amount + User2 withdraw amount <= 100,000  

**Check point:**

Total Withdraw amount by 2 user is less than or equal to Total Deposit balance  

**Check areas:**

2 user allow  

> **Source comments:** New EM lets both users save their withdraw drafts when the two amounts together stay within the deposit balance, and both can then be approved. Matches the expected result.

---
