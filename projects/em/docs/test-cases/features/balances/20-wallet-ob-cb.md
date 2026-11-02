# 20 · Wallet — Opening / Closing Balance

[← Test case index](../../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 13 (+104 data-variant rows)  
**Priority:** P1 13 · P2 0 · P3 0 · **★ Critical:** 13 · **Smoke:** 1 · **E2E:** 11 · **Auto:** 13 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [OB-WAL-001](#-ob-wal-001--wallet-obcb-continuity-after-wallet-recharge-rv-current-date--by-source) | ★ Wallet OB/CB continuity after wallet recharge RV (current date) — by source | Wallet OB/CB – single transaction | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 6 |
| [OB-WAL-002](#-ob-wal-002--wallet-obcb-continuity-after-back-dated-wallet-recharge-rv--by-source--day) | ★ Wallet OB/CB continuity after back-dated wallet recharge RV — by source × day | Wallet OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 4 |
| [OB-WAL-003](#-ob-wal-003--wallet-obcb-continuity-after-wallet-refund-pv-current-date) | ★ Wallet OB/CB continuity after wallet refund PV (current date) | Wallet OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-WAL-004](#-ob-wal-004--wallet-obcb-continuity-after-back-dated-wallet-refund-pv-late-approved) | ★ Wallet OB/CB continuity after back-dated wallet refund PV (late approved) | Wallet OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-WAL-005](#-ob-wal-005--wallet-obcb-continuity-after-credit-note-cn-current-date) | ★ Wallet OB/CB continuity after credit note CN (current date) | Wallet OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-WAL-006](#-ob-wal-006--wallet-obcb-continuity-after-back-dated-credit-note-cn-late-approved) | ★ Wallet OB/CB continuity after back-dated credit note CN (late approved) | Wallet OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-WAL-007](#-ob-wal-007--wallet-obcb-continuity-after-wallet-transfer-wt-current-date--cash-inout) | ★ Wallet OB/CB continuity after wallet transfer WT (current date) — cash in/out | Wallet OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-WAL-008](#-ob-wal-008--wallet-obcb-continuity-after-wallet-payment-wp-current-date) | ★ Wallet OB/CB continuity after wallet payment WP (current date) | Wallet OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-WAL-009](#-ob-wal-009--wallet-obcb-continuity--2-same-type-transactions-at-same-time--date-combo) | ★ Wallet OB/CB continuity — 2 same-type transactions at same time × date combo | Wallet OB/CB – simultaneous pairs | P1 | E2E · Regression | Auto-UI+API | Active | 14 |
| [OB-WAL-010](#-ob-wal-010--wallet-obcb-continuity--2-different-type-transactions-at-same-time--date-combo) | ★ Wallet OB/CB continuity — 2 different-type transactions at same time × date combo | Wallet OB/CB – simultaneous pairs | P1 | E2E · Regression | Auto-UI+API | Active | 42 |
| [OB-WAL-011](#-ob-wal-011--wallet-obcb-continuity--one-transaction-type-followed-by-another) | ★ Wallet OB/CB continuity — one transaction type followed by another | Wallet OB/CB – sequential pairs | P1 | E2E · Regression | Auto-UI+API | Active | 30 |
| [OB-WAL-012](#-ob-wal-012--wallet-2-users-debit-fullover-balance-concurrently--second-is-refused) | ★ Wallet: 2 users debit full/over balance concurrently — second is refused | Wallet concurrency – overdraw protection | P1 | Regression | Auto-API | Active | 6 |
| [OB-WAL-013](#-ob-wal-013--wallet-2-users-debit-within-balance-concurrently--both-allowed) | ★ Wallet: 2 users debit within balance concurrently — both allowed | Wallet concurrency – overdraw protection | P1 | Regression | Auto-API | Active | 3 |
<!-- /generated:summary -->

## Test cases

### Wallet OB/CB – single transaction

#### ★ OB-WAL-001 · Wallet OB/CB continuity after wallet recharge RV (current date) — by source

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r3 |

**Scenario group:** Create Wallet Recharge(RV) with (Current Date)

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (6 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Wallet Recharge(RV) from Apartment>Wallet (manual) | Wallet - OB & CB r3 | |
| 2 | Type=Convert unknown RV to wallet RV direct to wallet; Date=Current date | Wallet - OB & CB r4 |  |
| 3 | Type=Convert other currency unknown RV to wallet RV direct to wallet; Date=Current date | Wallet - OB & CB r5 |  |
| 4 | Type=When assigning the unknown RV, it overflows and goes into the wallet.; Date=Current date | Wallet - OB & CB r6 |  |
| 5 | Type=When assigning the other currency unknown RV, it overflows and goes into the wallet.; Date=Current date | Wallet - OB & CB r7 |  |
| 6 | Type=When making a payment, it overflows and goes into the wallet; Date=Current date | Wallet - OB & CB r8 |  |

---

#### ★ OB-WAL-002 · Wallet OB/CB continuity after back-dated wallet recharge RV — by source × day

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r10 |

**Scenario group:** Create Wallet Recharge(RV) with (Back Date)

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Convert unknown RV to wallet RV (Directly add to the wallet) / 1st day, last day and mid-month date is chosen as the Back Date. | Wallet - OB & CB r10 | |
| 2 | Type=Convert other currency unknown RV to wallet RV direct to wallet; Date=Back date (1st/mid/last day of month) | Wallet - OB & CB r11 |  |
| 3 | Type=When assigning the unknown RV, it overflows and goes into the wallet.; Date=Back date (1st/mid/last day of month) | Wallet - OB & CB r12 |  |
| 4 | Type=When assigning the other currency unknown RV, it overflows and goes into the wallet.; Date=Back date (1st/mid/last day of month) | Wallet - OB & CB r13 |  |

---

#### ★ OB-WAL-003 · Wallet OB/CB continuity after wallet refund PV (current date)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r15 |

**Scenario group:** Create Wallet Refund PV with (Current Date)

**Check point:**

Wallet Refund(PV) date  
Check Wallet Refund(PV) no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create wallet refund PV | Wallet - OB & CB r15 | |
| 2 | Type=Create wallet refund PV; Date=Current date; duplicate row in source | Wallet - OB & CB r16 | Exact duplicate row in source (no priority) |

---

#### ★ OB-WAL-004 · Wallet OB/CB continuity after back-dated wallet refund PV (late approved)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active — Back date uses 1st/mid/last day of month; late approval | Wallet - OB & CB r18 |

**Scenario group:** Create Wallet Refund PV with (Back Date)

**Check point:**

Wallet Refund(PV) date  
Check Wallet Refund(PV) no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create wallet refund PV (late approved) / 1st day, last day and mid-month date is chosen as the Back Date. | Wallet - OB & CB r18 | |
| 2 | Type=Create wallet refund PV (late approved); Date=Back date (1st/mid/last day of month); duplicate row in source | Wallet - OB & CB r19 | Exact duplicate row in source (no priority) |

---

#### ★ OB-WAL-005 · Wallet OB/CB continuity after credit note CN (current date)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r21 |

**Scenario group:** Create Credit Note CN with (Current Date)

**Check point:**

Credit Note(CN) date  
Check Credit Note(CN) no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Credit Note CN | Wallet - OB & CB r21 | |
| 2 | Type=Create Credit Note CN; Date=Current date; duplicate row in source | Wallet - OB & CB r22 | Exact duplicate row in source (no priority) |

---

#### ★ OB-WAL-006 · Wallet OB/CB continuity after back-dated credit note CN (late approved)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r24 |

**Scenario group:** Create Credit Note CN with (Back Date)

**Check point:**

Credit Note(CN) date  
Check Credit Note(CN) no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Credit Note CN ( late approved ) / 1st day, last day and mid-month date is chosen as the Back Date. | Wallet - OB & CB r24 | |
| 2 | Type=Create Credit Note CN ( late approved ); Date=Back date (1st/mid/last day of month); duplicate row in source | Wallet - OB & CB r25 | Exact duplicate row in source (no priority) |

---

#### ★ OB-WAL-007 · Wallet OB/CB continuity after wallet transfer WT (current date) — cash in/out

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r27 |

**Scenario group:** Create Wallet Transfer (Current Date)

**Check point:**

WT date  
Check WT no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Wallet Transfer WT (Cash In) | Wallet - OB & CB r27 | |
| 2 | Type=Create Wallet Transfer WT (Cash Out); Date=Current date | Wallet - OB & CB r28 |  |

---

#### ★ OB-WAL-008 · Wallet OB/CB continuity after wallet payment WP (current date)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r30 |

**Scenario group:** Create Wallet Payment WP with (Current Date)

**Check point:**

Wallet Payment(PV) date  
Check Wallet Payment(PV) no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create wallet payment WP | Wallet - OB & CB r30 | |
| 2 | Type=Create wallet payment WP; Date=Current date; duplicate row in source | Wallet - OB & CB r31 | Exact duplicate row in source (no priority) |

---

### Wallet OB/CB – simultaneous pairs

#### ★ OB-WAL-009 · Wallet OB/CB continuity — 2 same-type transactions at same time × date combo

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r34 |

**Scenario group:** 2 same transaction at the  same time

**Test way:**

Current Date & Curent Date  

**Check point:**

Transaction date  
Check transaction no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (14 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Wallet Recharge(RV) / Wallet Recharge(RV) | Wallet - OB & CB r34 | |
| 2 | Matrix header row (1st/2nd transaction type & date) | Wallet - OB & CB r33 | Review; Source header row, not an executable case; "Remark" placeholder only |
| 3 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Recharge(RV) unknown assign; Dates=Current Date & Current Date | Wallet - OB & CB r35 |  |
| 4 | 1st=Wallet Refund(PV); 2nd=Wallet Refund(PV); Dates=Current Date & Current Date | Wallet - OB & CB r36 |  |
| 5 | 1st=Credit Note(CN); 2nd=Credit Note(CN); Dates=Current Date & Current Date | Wallet - OB & CB r37 |  |
| 6 | 1st=Wallet Payment(WP); 2nd=Wallet Payment(WP); Dates=Current Date & Current Date | Wallet - OB & CB r38 |  |
| 7 | 1st=Wallet Transfer WT (Cash In); 2nd=Wallet Transfer WT (Cash In); Dates=Current Date & Current Date | Wallet - OB & CB r39 |  |
| 8 | 1st=Wallet Transfer WT (Cash out); 2nd=Wallet Transfer WT (Cash out); Dates=Current Date & Current Date | Wallet - OB & CB r40 |  |
| 9 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Recharge(RV) unknown assign; Dates=Current Date & Back Date | Wallet - OB & CB r41 |  |
| 10 | 1st=Wallet Refund(PV); 2nd=Wallet Refund(PV); Dates=Current Date & Back Date | Wallet - OB & CB r42 |  |
| 11 | 1st=Credit Note(CN); 2nd=Credit Note(CN); Dates=Current Date & Back Date | Wallet - OB & CB r43 |  |
| 12 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Recharge(RV) unknown assign; Dates=Back Date & Back Date | Wallet - OB & CB r44 |  |
| 13 | 1st=Wallet Refund(PV); 2nd=Wallet Refund(PV); Dates=Back Date & Back Date | Wallet - OB & CB r45 |  |
| 14 | 1st=Credit Note(CN); 2nd=Credit Note(CN); Dates=Back Date & Back Date | Wallet - OB & CB r46 |  |

---

#### ★ OB-WAL-010 · Wallet OB/CB continuity — 2 different-type transactions at same time × date combo

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r49 |

**Scenario group:** 2 different transaction type at the same time

**Test way:**

Current Date & Curent Date  

**Check point:**

Transaction date  
Check transaction no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (42 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Wallet Recharge(RV) / Wallet Recharge(RV) unknown assign | Wallet - OB & CB r49 | |
| 2 | 1st=Wallet Recharge(RV); 2nd=Wallet Refund(PV); Dates=Current Date & Current Date | Wallet - OB & CB r50 |  |
| 3 | 1st=Wallet Recharge(RV); 2nd=Credit Note(CN); Dates=Current Date & Current Date | Wallet - OB & CB r51 |  |
| 4 | 1st=Wallet Recharge(RV); 2nd=Wallet Transfer WT (Cash out); Dates=Current Date & Current Date | Wallet - OB & CB r52 |  |
| 5 | 1st=Wallet Recharge(RV); 2nd=Wallet Transfer WT (Cash In); Dates=Current Date & Current Date | Wallet - OB & CB r53 |  |
| 6 | 1st=Wallet Recharge(RV); 2nd=Wallet Payment(WP); Dates=Current Date & Current Date | Wallet - OB & CB r54 |  |
| 7 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Refund(PV); Dates=Current Date & Current Date | Wallet - OB & CB r55 |  |
| 8 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Credit Note(CN); Dates=Current Date & Current Date | Wallet - OB & CB r56 |  |
| 9 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Transfer WT (Cash out); Dates=Current Date & Current Date | Wallet - OB & CB r57 |  |
| 10 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Transfer WT (Cash In); Dates=Current Date & Current Date | Wallet - OB & CB r58 |  |
| 11 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Payment(WP); Dates=Current Date & Current Date | Wallet - OB & CB r59 |  |
| 12 | 1st=Wallet Refund(PV); 2nd=Credit Note(CN); Dates=Current Date & Current Date | Wallet - OB & CB r60 |  |
| 13 | 1st=Wallet Refund(PV); 2nd=Wallet Transfer WT (Cash out); Dates=Current Date & Current Date | Wallet - OB & CB r61 |  |
| 14 | 1st=Wallet Refund(PV); 2nd=Wallet Transfer WT (Cash In); Dates=Current Date & Current Date | Wallet - OB & CB r62 |  |
| 15 | 1st=Wallet Refund(PV); 2nd=Wallet Payment(WP); Dates=Current Date & Current Date | Wallet - OB & CB r63 |  |
| 16 | 1st=Credit Note(CN); 2nd=Wallet Transfer WT (Cash out); Dates=Current Date & Current Date | Wallet - OB & CB r64 |  |
| 17 | 1st=Credit Note(CN); 2nd=Wallet Transfer WT (Cash In); Dates=Current Date & Current Date | Wallet - OB & CB r65 |  |
| 18 | 1st=Credit Note(CN); 2nd=Wallet Payment(WP); Dates=Current Date & Current Date | Wallet - OB & CB r66 |  |
| 19 | 1st=Wallet Transfer WT (Cash out); 2nd=Wallet Payment(WP); Dates=Current Date & Current Date | Wallet - OB & CB r67 |  |
| 20 | 1st=Wallet Transfer WT (Cash In); 2nd=Wallet Payment(WP); Dates=Current Date & Current Date | Wallet - OB & CB r68 |  |
| 21 | 1st=Wallet Transfer WT (Cash out); 2nd=Wallet Transfer WT (Cash In); Dates=Current Date & Current Date | Wallet - OB & CB r69 |  |
| 22 | 1st=Wallet Recharge(RV); 2nd=Wallet Recharge(RV) unknown assign; Dates=Current Date & Back Date | Wallet - OB & CB r70 |  |
| 23 | 1st=Wallet Recharge(RV); 2nd=Wallet Refund(PV); Dates=Current Date & Back Date | Wallet - OB & CB r71 |  |
| 24 | 1st=Wallet Recharge(RV); 2nd=Credit Note(CN); Dates=Current Date & Back Date | Wallet - OB & CB r72 |  |
| 25 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Refund(PV); Dates=Current Date & Back Date | Wallet - OB & CB r73 |  |
| 26 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Credit Note(CN); Dates=Current Date & Back Date | Wallet - OB & CB r74 |  |
| 27 | 1st=Wallet Refund(PV); 2nd=Wallet Recharge(RV) unknown assign; Dates=Current Date & Back Date | Wallet - OB & CB r75 |  |
| 28 | 1st=Wallet Refund(PV); 2nd=Credit Note(CN); Dates=Current Date & Back Date | Wallet - OB & CB r76 |  |
| 29 | 1st=Credit Note(CN); 2nd=Wallet Recharge(RV) unknown assign; Dates=Current Date & Back Date | Wallet - OB & CB r77 |  |
| 30 | 1st=Credit Note(CN); 2nd=Wallet Refund(PV); Dates=Current Date & Back Date | Wallet - OB & CB r78 |  |
| 31 | 1st=Wallet Transfer WT (Cash out); 2nd=Wallet Recharge(RV) unknown assign; Dates=Current Date & Back Date | Wallet - OB & CB r79 |  |
| 32 | 1st=Wallet Transfer WT (Cash out); 2nd=Wallet Refund(PV); Dates=Current Date & Back Date | Wallet - OB & CB r80 |  |
| 33 | 1st=Wallet Transfer WT (Cash out); 2nd=Credit Note(CN); Dates=Current Date & Back Date | Wallet - OB & CB r81 |  |
| 34 | 1st=Wallet Transfer WT (Cash In); 2nd=Wallet Recharge(RV) unknown assign; Dates=Current Date & Back Date | Wallet - OB & CB r82 |  |
| 35 | 1st=Wallet Transfer WT (Cash In); 2nd=Wallet Refund(PV); Dates=Current Date & Back Date | Wallet - OB & CB r83 |  |
| 36 | 1st=Wallet Transfer WT (Cash In); 2nd=Credit Note(CN); Dates=Current Date & Back Date | Wallet - OB & CB r84 |  |
| 37 | 1st=Wallet Payment(WP); 2nd=Wallet Recharge(RV) unknown assign; Dates=Current Date & Back Date | Wallet - OB & CB r85 |  |
| 38 | 1st=Wallet Payment(WP); 2nd=Wallet Refund(PV); Dates=Current Date & Back Date | Wallet - OB & CB r86 |  |
| 39 | 1st=Wallet Payment(WP); 2nd=Credit Note(CN); Dates=Current Date & Back Date | Wallet - OB & CB r87 |  |
| 40 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Wallet Refund(PV); Dates=Back Date & Back Date | Wallet - OB & CB r88 |  |
| 41 | 1st=Wallet Recharge(RV) unknown assign; 2nd=Credit Note(CN); Dates=Back Date & Back Date | Wallet - OB & CB r89 |  |
| 42 | 1st=Wallet Refund(PV); 2nd=Credit Note(CN); Dates=Back Date & Back Date | Wallet - OB & CB r90 |  |

---

### Wallet OB/CB – sequential pairs

#### ★ OB-WAL-011 · Wallet OB/CB continuity — one transaction type followed by another

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet - OB & CB r92 |

**Scenario group:** one transaction type is  followed by another  transaction type

**Check point:**

Transaction date  
Check transaction no  
Balance calculation  
Balance Amount in Apartment > Wallet screen Amount  
Opening Balance of the following Month  
Closing balance of Transaction Date  

**Check areas:**

Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  

**Expected result:**

The Closing Balance of the Previous month must be same with the Opening Balance of the Following month.  
(Apartment Wallet page  
Apartment Wallet PDF  
API - > Apartment > Wallet by Apartment  
API - > PDF Printouts > Apartment Wallet PDF  
All of the above should be correct if you check)  

**Data variants (30 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Wallet Recharge(RV) / Wallet Refund(PV) | Wallet - OB & CB r92 | |
| 2 | 1st=Wallet Recharge(RV); then 2nd=Wallet Payment(WP) | Wallet - OB & CB r93 |  |
| 3 | 1st=Wallet Recharge(RV); then 2nd=Wallet Transfer WT (Cash In) | Wallet - OB & CB r94 |  |
| 4 | 1st=Wallet Recharge(RV); then 2nd=Wallet Transfer WT (Cash out) | Wallet - OB & CB r95 |  |
| 5 | 1st=Wallet Recharge(RV); then 2nd=Credit Note(CN) | Wallet - OB & CB r96 |  |
| 6 | 1st=Wallet Refund(PV); then 2nd=Wallet Recharge(RV) | Wallet - OB & CB r98 |  |
| 7 | 1st=Wallet Refund(PV); then 2nd=Wallet Payment(WP) | Wallet - OB & CB r99 |  |
| 8 | 1st=Wallet Refund(PV); then 2nd=Wallet Transfer WT (Cash In) | Wallet - OB & CB r100 |  |
| 9 | 1st=Wallet Refund(PV); then 2nd=Wallet Transfer WT (Cash out) | Wallet - OB & CB r101 |  |
| 10 | 1st=Wallet Refund(PV); then 2nd=Credit Note(CN) | Wallet - OB & CB r102 |  |
| 11 | 1st=Wallet Payment(WP); then 2nd=Wallet Recharge(RV) | Wallet - OB & CB r104 |  |
| 12 | 1st=Wallet Payment(WP); then 2nd=Wallet Refund(PV) | Wallet - OB & CB r105 |  |
| 13 | 1st=Wallet Payment(WP); then 2nd=Wallet Transfer WT (Cash In) | Wallet - OB & CB r106 |  |
| 14 | 1st=Wallet Payment(WP); then 2nd=Wallet Transfer WT (Cash out) | Wallet - OB & CB r107 |  |
| 15 | 1st=Wallet Payment(WP); then 2nd=Credit Note(CN) | Wallet - OB & CB r108 |  |
| 16 | 1st=Wallet Transfer WT (Cash In); then 2nd=Wallet Recharge(RV) | Wallet - OB & CB r110 |  |
| 17 | 1st=Wallet Transfer WT (Cash In); then 2nd=Wallet Refund(PV) | Wallet - OB & CB r111 |  |
| 18 | 1st=Wallet Transfer WT (Cash In); then 2nd=Wallet Payment(WP) | Wallet - OB & CB r112 |  |
| 19 | 1st=Wallet Transfer WT (Cash In); then 2nd=Wallet Transfer WT (Cash out) | Wallet - OB & CB r113 |  |
| 20 | 1st=Wallet Transfer WT (Cash In); then 2nd=Credit Note(CN) | Wallet - OB & CB r114 |  |
| 21 | 1st=Wallet Transfer WT (Cash out); then 2nd=Wallet Recharge(RV) | Wallet - OB & CB r116 |  |
| 22 | 1st=Wallet Transfer WT (Cash out); then 2nd=Wallet Refund(PV) | Wallet - OB & CB r117 |  |
| 23 | 1st=Wallet Transfer WT (Cash out); then 2nd=Wallet Payment(WP) | Wallet - OB & CB r118 |  |
| 24 | 1st=Wallet Transfer WT (Cash out); then 2nd=Wallet Transfer WT (Cash In) | Wallet - OB & CB r119 |  |
| 25 | 1st=Wallet Transfer WT (Cash out); then 2nd=Credit Note(CN) | Wallet - OB & CB r120 |  |
| 26 | 1st=Credit Note(CN); then 2nd=Wallet Recharge(RV) | Wallet - OB & CB r122 |  |
| 27 | 1st=Credit Note(CN); then 2nd=Wallet Refund(PV) | Wallet - OB & CB r123 |  |
| 28 | 1st=Credit Note(CN); then 2nd=Wallet Payment(WP) | Wallet - OB & CB r124 |  |
| 29 | 1st=Credit Note(CN); then 2nd=Wallet Transfer WT (Cash In) | Wallet - OB & CB r125 |  |
| 30 | 1st=Credit Note(CN); then 2nd=Wallet Transfer WT (Cash out) | Wallet - OB & CB r126 |  |

---

### Wallet concurrency – overdraw protection

#### ★ OB-WAL-012 · Wallet: 2 users debit full/over balance concurrently — second is refused

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active — ZL: new EM matches — second debit refused when over balance; sheet expected column blank (expectation in check-area col) | Wallet - OB & CB r128 |

**Scenario group:** Wallet Transfer,Refund by 2 users at the same time.

**Test way:**

Total Wallet balance = 100,000  
User1 Refund amount= 100,000  
User2 Refund amount= 100,000  

**Check point:**

Both users Refund the full Wallet balance at the same time  

**Check areas:**

"Insufficient Balance in 'Withdraw From' Account"  

> **Source comments:** The new EM matches the sheet here: the second one is refused when it goes over the balance.

**Data variants (6 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Wallet Refund (draft) / Wallet Refund (draft) | Wallet - OB & CB r128 | |
| 2 | Type=Wallet Refund (draft); Wallet balance = 100,000; User1 Refund amt + User2 Refund amt > 100,000; Expect="Insufficient Balance in 'Withdraw From' Account" | Wallet - OB & CB r130 | ZL: refused with 'Insufficient wallet balance' (sheet: "Insufficient Balance in 'Withdraw From' Account") — wording only |
| 3 | Type=Wallet Payment; Wallet balance = 100,000; User1 Payment amt= 100,000; User2 Payment amt= 100,000; Expect=error msg "Insufficient balance" | Wallet - OB & CB r131 | ZL: new EM matches — second debit refused when over balance; sheet expected column blank (expectation in check-area col) |
| 4 | Type=Wallet Payment; Wallet balance = 100,000; User1 Payment amt + User2 Payment amt > 100,000; Expect=error msg "Insufficient balance" | Wallet - OB & CB r133 | ZL: refused with 'Insufficient wallet balance' — wording differs from sheet |
| 5 | Type=Wallet Transfer out; Wallet balance = 100,000; User1 Transfer amt= 100,000; User2 Transfer amt= 100,000; Expect=error msg "Invalid Amount" | Wallet - OB & CB r134 | ZL: new EM matches — second debit refused when over balance; sheet expected column blank (expectation in check-area col) |
| 6 | Type=Wallet Transfer out; Wallet balance = 100,000; User1 Transfer amt + User2 Transfer amt > 100,000; Expect=error msg "Invalid Amount" | Wallet - OB & CB r136 | ZL: refused with 'Insufficient wallet balance'; sheet expects 'Invalid Amount' — wording only |

---

#### ★ OB-WAL-013 · Wallet: 2 users debit within balance concurrently — both allowed

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active — ZL: new EM allows both drafts and both approve when total within balance — matches; sheet expected column blank | Wallet - OB & CB r129 |

**Scenario group:** Wallet Transfer,Refund by 2 users at the same time.

**Test way:**

Total Wallet balance = 100,000  
User1 Refund amount + User2 Refund amount <= 100,000  

**Check point:**

Total Refund amount by 2 user is less than or equal to Total Wallet balance  

**Check areas:**

2 user allow  

> **Source comments:** New EM lets both users save their refund drafts when the two amounts together stay within the wallet balance, and both can then be approved. Matches the expected result.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Wallet Refund (draft) / Wallet Refund (draft) | Wallet - OB & CB r129 | |
| 2 | Type=Wallet Payment; Wallet balance = 100,000; User1 Payment amt + User2 Payment amt <= 100,000; Expect=2 user allow | Wallet - OB & CB r132 | ZL: new EM allows both when total within balance — matches |
| 3 | Type=Wallet Transfer out; Wallet balance = 100,000; User1 Transfer amt + User2 Transfer amt <= 100,000; Expect=2 user allow | Wallet - OB & CB r135 | ZL: new EM allows both when total within balance — matches |

---
