# 22 · Account Statement — Opening / Closing Balance

[← Test case index](../../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 11 (+211 data-variant rows)  
**Priority:** P1 11 · P2 0 · P3 0 · **★ Critical:** 11 · **Smoke:** 2 · **E2E:** 9 · **Auto:** 11 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [OB-ACS-001](#-ob-acs-001--account-statement-obcb-continuity-after-cash-received-rv-current-date--by-rv-type) | ★ Account statement OB/CB continuity after cash received RV (current date) — by RV type | Account statement OB/CB – single transaction | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 9 |
| [OB-ACS-002](#-ob-acs-002--account-statement-obcb-continuity-after-back-dated-cash-received-rv--by-rv-type) | ★ Account statement OB/CB continuity after back-dated cash received RV — by RV type | Account statement OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 5 |
| [OB-ACS-003](#-ob-acs-003--account-statement-obcb-continuity-after-cash-outflow-pv-current-date--by-pv-type) | ★ Account statement OB/CB continuity after cash outflow PV (current date) — by PV type | Account statement OB/CB – single transaction | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-ACS-004](#-ob-acs-004--account-statement-obcb-continuity-after-back-dated-pv-late-approve--by-pv-type) | ★ Account statement OB/CB continuity after back-dated PV (late approve) — by PV type | Account statement OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [OB-ACS-005](#-ob-acs-005--account-statement-obcb-continuity-after-cash-transfer-jv-current-date--inout) | ★ Account statement OB/CB continuity after cash transfer JV (current date) — in/out | Account statement OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-ACS-006](#-ob-acs-006--account-statement-obcb-continuity-after-back-dated-cash-transfer-jv--inout) | ★ Account statement OB/CB continuity after back-dated cash transfer JV — in/out | Account statement OB/CB – single transaction | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [OB-ACS-007](#-ob-acs-007--account-statement-obcb--2-same-type-transactions-at-same-time--date-combo) | ★ Account statement OB/CB — 2 same-type transactions at same time × date combo | Account statement OB/CB – simultaneous pairs | P1 | E2E · Regression | Auto-UI+API | Active | 25 |
| [OB-ACS-008](#-ob-acs-008--account-statement-obcb--2-different-type-transactions-at-same-time--date-combo) | ★ Account statement OB/CB — 2 different-type transactions at same time × date combo | Account statement OB/CB – simultaneous pairs | P1 | E2E · Regression | Auto-UI+API | Active | 146 |
| [OB-ACS-009](#-ob-acs-009--account-statement-obcb--one-transaction-type-followed-by-another) | ★ Account statement OB/CB — one transaction type followed by another | Account statement OB/CB – sequential pairs | P1 | E2E · Regression | Auto-UI+API | Active | 15 |
| [OB-ACS-010](#-ob-acs-010--account-2-users-debit-fullover-balance-concurrently--second-is-refused) | ★ Account: 2 users debit full/over balance concurrently — second is refused | Account concurrency – overdraw protection | P1 | Regression | Auto-API | Active | 8 |
| [OB-ACS-011](#-ob-acs-011--account-2-users-debit-within-balance-concurrently--both-allowed) | ★ Account: 2 users debit within balance concurrently — both allowed | Account concurrency – overdraw protection | P1 | Regression | Auto-API | Active | 4 |
<!-- /generated:summary -->

## Test cases

### Account statement OB/CB – single transaction

#### ★ OB-ACS-001 · Account statement OB/CB continuity after cash received RV (current date) — by RV type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r3 |

**Scenario group:** Create Cash Received(RV) with (Current Date)

**Test way:**

The transaction is entered on the first, last  
and mid-time of a given day.  

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (9 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Funding Received | Acc Statement - OB & CB r3 | |
| 2 | Type=Create Unknown Received; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r4 |  |
| 3 | Type=Assign unknown Received to Make Payment; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r5 |  |
| 4 | Type=Assign unknown Received to Wallet Recharge; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r6 |  |
| 5 | Type=Assign unknown Received to Add Deposit; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r7 |  |
| 6 | Type=Create Wallet Recharge; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r8 |  |
| 7 | Type=Create Add Deposit; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r9 |  |
| 8 | Type=Make Payment Directly; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r10 |  |
| 9 | Type=RV from SCLA; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r11 |  |

---

#### ★ OB-ACS-002 · Account statement OB/CB continuity after back-dated cash received RV — by RV type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r13 |

**Scenario group:** Create Cash Received(RV) with (Back date)

**Test way:**

The transaction is entered on the first, last  
and mid-time of a given day.  

**Check point:**

RV date  
Check RV no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (5 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Funding Received | Acc Statement - OB & CB r13 | |
| 2 | Type=Create Unknown Received; Date=Back date; Time=first/mid/last of day | Acc Statement - OB & CB r14 |  |
| 3 | Type=Assign unknown Received to Make Payment; Date=Back date; Time=first/mid/last of day | Acc Statement - OB & CB r15 |  |
| 4 | Type=Assign unknown Received to Wallet Recharge; Date=Back date; Time=first/mid/last of day | Acc Statement - OB & CB r16 |  |
| 5 | Type=Assign unknown Received to Add Deposit; Date=Back date; Time=first/mid/last of day | Acc Statement - OB & CB r17 |  |

---

#### ★ OB-ACS-003 · Account statement OB/CB continuity after cash outflow PV (current date) — by PV type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r19 |

**Scenario group:** Create Cash Outflow(PV) with (Current Date)

**Check point:**

PV date  
Check PV no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Cash Outflow / The transaction is entered on the first, last  and mid-time of a given day. | Acc Statement - OB & CB r19 | |
| 2 | Type=Create Wallet Refund; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r20 |  |
| 3 | Type=Create Deposit Withdraw; Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r21 |  |

---

#### ★ OB-ACS-004 · Account statement OB/CB continuity after back-dated PV (late approve) — by PV type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r23 |

**Scenario group:** Create Cash Outflow(PV) with (Back date)

**Check point:**

PV date  
Check PV no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Cash Outflow / The transaction is entered on the first, last  and mid-time of a given day. | Acc Statement - OB & CB r23 | |
| 2 | Type=Create Wallet Refund (late approve); Date=Back date; Time=first/mid/last of day | Acc Statement - OB & CB r24 |  |
| 3 | Type=Create Deposit Withdraw (late approve); Date=Back date; Time=first/mid/last of day | Acc Statement - OB & CB r25 |  |

---

#### ★ OB-ACS-005 · Account statement OB/CB continuity after cash transfer JV (current date) — in/out

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r27 |

**Scenario group:** Create Cash Transfer(JV) with (Current Date)

**Check point:**

JV date  
Check JV no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Cash Transfer JV (Cash In) / The transaction is entered on the first, last  and mid-time of a given day. | Acc Statement - OB & CB r27 | |
| 2 | Type=Create Cash Transfer JV (Cash Out); Date=Current date; Time=first/mid/last of day | Acc Statement - OB & CB r28 |  |

---

#### ★ OB-ACS-006 · Account statement OB/CB continuity after back-dated cash transfer JV — in/out

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r30 |

**Scenario group:** Create Cash Transfer(JV) with (Back date)

**Check point:**

JV date  
Check JV no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Create Cash Transfer JV (Cash In) / The transaction is entered on the first, last  and mid-time of a given day. | Acc Statement - OB & CB r30 | |
| 2 | Type=Create Cash Transfer JV (Cash Out); Date=Back date; Time=first/mid/last of day | Acc Statement - OB & CB r31 |  |

---

### Account statement OB/CB – simultaneous pairs

#### ★ OB-ACS-007 · Account statement OB/CB — 2 same-type transactions at same time × date combo

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r35 |

**Scenario group:** 2 same transaction at the  same time

**Test way:**

Current Date & Curent Date  

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (25 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Funding Received / Funding Received | Acc Statement - OB & CB r35 | |
| 2 | 1st=Unknown Received; 2nd=Unknown Received; Dates=Current Date & Current Date | Acc Statement - OB & CB r36 |  |
| 3 | 1st=Wallet Recharge; 2nd=Wallet Recharge; Dates=Current Date & Current Date | Acc Statement - OB & CB r37 |  |
| 4 | 1st=Add Deposit; 2nd=Add Deposit; Dates=Current Date & Current Date | Acc Statement - OB & CB r38 |  |
| 5 | 1st=Make Payment; 2nd=Make Payment; Dates=Current Date & Current Date | Acc Statement - OB & CB r39 |  |
| 6 | 1st=RV from SCLA; 2nd=RV from SCLA; Dates=Current Date & Current Date | Acc Statement - OB & CB r40 |  |
| 7 | 1st=Cash Outflow; 2nd=Cash Outflow; Dates=Current Date & Current Date | Acc Statement - OB & CB r41 |  |
| 8 | 1st=Wallet Refund; 2nd=Wallet Refund; Dates=Current Date & Current Date | Acc Statement - OB & CB r42 |  |
| 9 | 1st=Deposit Withdraw; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r43 |  |
| 10 | 1st=Cash Transfer JV (Cash In); 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r44 |  |
| 11 | 1st=Cash Transfer JV (Cash out); 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r45 |  |
| 12 | 1st=Funding Received; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r46 |  |
| 13 | 1st=Unknown Received; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r47 |  |
| 14 | 1st=Cash Outflow; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r48 |  |
| 15 | 1st=Wallet Refund; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r49 |  |
| 16 | 1st=Deposit Withdraw; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r50 |  |
| 17 | 1st=Cash Transfer JV (Cash In); 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r51 |  |
| 18 | 1st=Cash Transfer JV (Cash out); 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r52 |  |
| 19 | 1st=Funding Received; 2nd=Funding Received; Dates=Back Date & Back Date | Acc Statement - OB & CB r53 |  |
| 20 | 1st=Unknown Received; 2nd=Unknown Received; Dates=Back Date & Back Date | Acc Statement - OB & CB r54 |  |
| 21 | 1st=Cash Outflow; 2nd=Cash Outflow; Dates=Back Date & Back Date | Acc Statement - OB & CB r55 |  |
| 22 | 1st=Wallet Refund; 2nd=Wallet Refund; Dates=Back Date & Back Date | Acc Statement - OB & CB r56 |  |
| 23 | 1st=Deposit Withdraw; 2nd=Deposit Withdraw; Dates=Back Date & Back Date | Acc Statement - OB & CB r57 |  |
| 24 | 1st=Cash Transfer JV (Cash In); 2nd=Cash Transfer JV (Cash In); Dates=Back Date & Back Date | Acc Statement - OB & CB r58 |  |
| 25 | 1st=Cash Transfer JV (Cash out); 2nd=Cash Transfer JV (Cash out); Dates=Back Date & Back Date | Acc Statement - OB & CB r59 |  |

---

#### ★ OB-ACS-008 · Account statement OB/CB — 2 different-type transactions at same time × date combo

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r62 |

**Scenario group:** 2 different transaction type at the same time

**Test way:**

Current Date & Curent Date  

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (146 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Funding Received / Unknown Received | Acc Statement - OB & CB r62 | |
| 2 | 1st=Funding Received; 2nd=Wallet Recharge; Dates=Current Date & Current Date | Acc Statement - OB & CB r63 |  |
| 3 | 1st=Funding Received; 2nd=Add Deposit; Dates=Current Date & Current Date | Acc Statement - OB & CB r64 |  |
| 4 | 1st=Funding Received; 2nd=Make Payment; Dates=Current Date & Current Date | Acc Statement - OB & CB r65 |  |
| 5 | 1st=Funding Received; 2nd=RV from SCLA; Dates=Current Date & Current Date | Acc Statement - OB & CB r66 |  |
| 6 | 1st=Funding Received; 2nd=Cash Outflow; Dates=Current Date & Current Date | Acc Statement - OB & CB r67 |  |
| 7 | 1st=Funding Received; 2nd=Wallet Refund; Dates=Current Date & Current Date | Acc Statement - OB & CB r68 |  |
| 8 | 1st=Funding Received; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r69 |  |
| 9 | 1st=Funding Received; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r70 |  |
| 10 | 1st=Funding Received; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r71 |  |
| 11 | 1st=Unknown Received; 2nd=Wallet Recharge; Dates=Current Date & Current Date | Acc Statement - OB & CB r72 |  |
| 12 | 1st=Unknown Received; 2nd=Add Deposit; Dates=Current Date & Current Date | Acc Statement - OB & CB r73 |  |
| 13 | 1st=Unknown Received; 2nd=Make Payment; Dates=Current Date & Current Date | Acc Statement - OB & CB r74 |  |
| 14 | 1st=Unknown Received; 2nd=RV from SCLA; Dates=Current Date & Current Date | Acc Statement - OB & CB r75 |  |
| 15 | 1st=Unknown Received; 2nd=Cash Outflow; Dates=Current Date & Current Date | Acc Statement - OB & CB r76 |  |
| 16 | 1st=Unknown Received; 2nd=Wallet Refund; Dates=Current Date & Current Date | Acc Statement - OB & CB r77 |  |
| 17 | 1st=Unknown Received; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r78 |  |
| 18 | 1st=Unknown Received; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r79 |  |
| 19 | 1st=Unknown Received; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r80 |  |
| 20 | 1st=Wallet Recharge; 2nd=Add Deposit; Dates=Current Date & Current Date | Acc Statement - OB & CB r81 |  |
| 21 | 1st=Wallet Recharge; 2nd=Make Payment; Dates=Current Date & Current Date | Acc Statement - OB & CB r82 |  |
| 22 | 1st=Wallet Recharge; 2nd=RV from SCLA; Dates=Current Date & Current Date | Acc Statement - OB & CB r83 |  |
| 23 | 1st=Wallet Recharge; 2nd=Cash Outflow; Dates=Current Date & Current Date | Acc Statement - OB & CB r84 |  |
| 24 | 1st=Wallet Recharge; 2nd=Wallet Refund; Dates=Current Date & Current Date | Acc Statement - OB & CB r85 |  |
| 25 | 1st=Wallet Recharge; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r86 |  |
| 26 | 1st=Wallet Recharge; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r87 |  |
| 27 | 1st=Wallet Recharge; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r88 |  |
| 28 | 1st=Add Deposit; 2nd=Make Payment; Dates=Current Date & Current Date | Acc Statement - OB & CB r89 |  |
| 29 | 1st=Add Deposit; 2nd=RV from SCLA; Dates=Current Date & Current Date | Acc Statement - OB & CB r90 |  |
| 30 | 1st=Add Deposit; 2nd=Cash Outflow; Dates=Current Date & Current Date | Acc Statement - OB & CB r91 |  |
| 31 | 1st=Add Deposit; 2nd=Wallet Refund; Dates=Current Date & Current Date | Acc Statement - OB & CB r92 |  |
| 32 | 1st=Add Deposit; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r93 |  |
| 33 | 1st=Add Deposit; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r94 |  |
| 34 | 1st=Add Deposit; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r95 |  |
| 35 | 1st=Make Payment; 2nd=RV from SCLA; Dates=Current Date & Current Date | Acc Statement - OB & CB r96 |  |
| 36 | 1st=Make Payment; 2nd=Cash Outflow; Dates=Current Date & Current Date | Acc Statement - OB & CB r97 |  |
| 37 | 1st=Make Payment; 2nd=Wallet Refund; Dates=Current Date & Current Date | Acc Statement - OB & CB r98 |  |
| 38 | 1st=Make Payment; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r99 |  |
| 39 | 1st=Make Payment; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r100 |  |
| 40 | 1st=Make Payment; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r101 |  |
| 41 | 1st=RV from SCLA; 2nd=Cash Outflow; Dates=Current Date & Current Date | Acc Statement - OB & CB r102 |  |
| 42 | 1st=RV from SCLA; 2nd=Wallet Refund; Dates=Current Date & Current Date | Acc Statement - OB & CB r103 |  |
| 43 | 1st=RV from SCLA; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r104 |  |
| 44 | 1st=RV from SCLA; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r105 |  |
| 45 | 1st=RV from SCLA; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r106 |  |
| 46 | 1st=Cash Outflow; 2nd=Wallet Refund; Dates=Current Date & Current Date | Acc Statement - OB & CB r107 |  |
| 47 | 1st=Cash Outflow; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r108 |  |
| 48 | 1st=Cash Outflow; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r109 |  |
| 49 | 1st=Cash Outflow; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r110 |  |
| 50 | 1st=Wallet Refund; 2nd=Deposit Withdraw; Dates=Current Date & Current Date | Acc Statement - OB & CB r111 |  |
| 51 | 1st=Wallet Refund; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r112 |  |
| 52 | 1st=Wallet Refund; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r113 |  |
| 53 | 1st=Deposit Withdraw; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Current Date | Acc Statement - OB & CB r114 |  |
| 54 | 1st=Deposit Withdraw; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r115 |  |
| 55 | 1st=Cash Transfer JV (Cash In); 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Current Date | Acc Statement - OB & CB r116 |  |
| 56 | 1st=Funding Received; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r117 |  |
| 57 | 1st=Funding Received; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r118 |  |
| 58 | 1st=Funding Received; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r119 |  |
| 59 | 1st=Funding Received; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r120 |  |
| 60 | 1st=Funding Received; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r121 |  |
| 61 | 1st=Funding Received; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r122 |  |
| 62 | 1st=Unknown Received; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r123 |  |
| 63 | 1st=Unknown Received; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r124 |  |
| 64 | 1st=Unknown Received; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r125 |  |
| 65 | 1st=Unknown Received; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r126 |  |
| 66 | 1st=Unknown Received; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r127 |  |
| 67 | 1st=Unknown Received; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r128 |  |
| 68 | 1st=Wallet Recharge; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r129 |  |
| 69 | 1st=Wallet Recharge; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r130 |  |
| 70 | 1st=Wallet Recharge; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r131 |  |
| 71 | 1st=Wallet Recharge; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r132 |  |
| 72 | 1st=Wallet Recharge; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r133 |  |
| 73 | 1st=Wallet Recharge; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r134 |  |
| 74 | 1st=Wallet Recharge; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r135 |  |
| 75 | 1st=Add Deposit; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r136 |  |
| 76 | 1st=Add Deposit; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r137 |  |
| 77 | 1st=Add Deposit; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r138 |  |
| 78 | 1st=Add Deposit; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r139 |  |
| 79 | 1st=Add Deposit; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r140 |  |
| 80 | 1st=Add Deposit; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r141 |  |
| 81 | 1st=Add Deposit; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r142 |  |
| 82 | 1st=Make Payment; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r143 |  |
| 83 | 1st=Make Payment; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r144 |  |
| 84 | 1st=Make Payment; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r145 |  |
| 85 | 1st=Make Payment; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r146 |  |
| 86 | 1st=Make Payment; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r147 |  |
| 87 | 1st=Make Payment; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r148 |  |
| 88 | 1st=Make Payment; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r149 |  |
| 89 | 1st=RV from SCLA; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r150 |  |
| 90 | 1st=RV from SCLA; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r151 |  |
| 91 | 1st=RV from SCLA; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r152 |  |
| 92 | 1st=RV from SCLA; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r153 |  |
| 93 | 1st=RV from SCLA; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r154 |  |
| 94 | 1st=RV from SCLA; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r155 |  |
| 95 | 1st=RV from SCLA; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r156 |  |
| 96 | 1st=Cash Outflow; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r157 |  |
| 97 | 1st=Cash Outflow; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r158 |  |
| 98 | 1st=Cash Outflow; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r159 |  |
| 99 | 1st=Cash Outflow; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r160 |  |
| 100 | 1st=Cash Outflow; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r161 |  |
| 101 | 1st=Cash Outflow; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r162 |  |
| 102 | 1st=Wallet Refund; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r163 |  |
| 103 | 1st=Wallet Refund; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r164 |  |
| 104 | 1st=Wallet Refund; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r165 |  |
| 105 | 1st=Wallet Refund; 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r166 |  |
| 106 | 1st=Wallet Refund; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r167 |  |
| 107 | 1st=Wallet Refund; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r168 |  |
| 108 | 1st=Deposit Withdraw; 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r169 |  |
| 109 | 1st=Deposit Withdraw; 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r170 |  |
| 110 | 1st=Deposit Withdraw; 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r171 |  |
| 111 | 1st=Deposit Withdraw; 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r172 |  |
| 112 | 1st=Deposit Withdraw; 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r173 |  |
| 113 | 1st=Deposit Withdraw; 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r174 |  |
| 114 | 1st=Cash Transfer JV (Cash In); 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r175 |  |
| 115 | 1st=Cash Transfer JV (Cash In); 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r176 |  |
| 116 | 1st=Cash Transfer JV (Cash In); 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r177 |  |
| 117 | 1st=Cash Transfer JV (Cash In); 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r178 |  |
| 118 | 1st=Cash Transfer JV (Cash In); 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r179 |  |
| 119 | 1st=Cash Transfer JV (Cash In); 2nd=Cash Transfer JV (Cash out); Dates=Current Date & Back Date | Acc Statement - OB & CB r180 |  |
| 120 | 1st=Cash Transfer JV (Cash out); 2nd=Funding Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r181 |  |
| 121 | 1st=Cash Transfer JV (Cash out); 2nd=Unknown Received; Dates=Current Date & Back Date | Acc Statement - OB & CB r182 |  |
| 122 | 1st=Cash Transfer JV (Cash out); 2nd=Cash Outflow; Dates=Current Date & Back Date | Acc Statement - OB & CB r183 |  |
| 123 | 1st=Cash Transfer JV (Cash out); 2nd=Wallet Refund; Dates=Current Date & Back Date | Acc Statement - OB & CB r184 |  |
| 124 | 1st=Cash Transfer JV (Cash out); 2nd=Deposit Withdraw; Dates=Current Date & Back Date | Acc Statement - OB & CB r185 |  |
| 125 | 1st=Cash Transfer JV (Cash out); 2nd=Cash Transfer JV (Cash In); Dates=Current Date & Back Date | Acc Statement - OB & CB r186 |  |
| 126 | 1st=Funding Received; 2nd=Unknown Received; Dates=Back Date & Back Date | Acc Statement - OB & CB r187 |  |
| 127 | 1st=Funding Received; 2nd=Cash Outflow; Dates=Back Date & Back Date | Acc Statement - OB & CB r188 |  |
| 128 | 1st=Funding Received; 2nd=Wallet Refund; Dates=Back Date & Back Date | Acc Statement - OB & CB r189 |  |
| 129 | 1st=Funding Received; 2nd=Deposit Withdraw; Dates=Back Date & Back Date | Acc Statement - OB & CB r190 |  |
| 130 | 1st=Funding Received; 2nd=Cash Transfer JV (Cash In); Dates=Back Date & Back Date | Acc Statement - OB & CB r191 |  |
| 131 | 1st=Funding Received; 2nd=Cash Transfer JV (Cash out); Dates=Back Date & Back Date | Acc Statement - OB & CB r192 |  |
| 132 | 1st=Unknown Received; 2nd=Cash Outflow; Dates=Back Date & Back Date | Acc Statement - OB & CB r193 |  |
| 133 | 1st=Unknown Received; 2nd=Wallet Refund; Dates=Back Date & Back Date | Acc Statement - OB & CB r194 |  |
| 134 | 1st=Unknown Received; 2nd=Deposit Withdraw; Dates=Back Date & Back Date | Acc Statement - OB & CB r195 |  |
| 135 | 1st=Unknown Received; 2nd=Cash Transfer JV (Cash In); Dates=Back Date & Back Date | Acc Statement - OB & CB r196 |  |
| 136 | 1st=Unknown Received; 2nd=Cash Transfer JV (Cash out); Dates=Back Date & Back Date | Acc Statement - OB & CB r197 |  |
| 137 | 1st=Cash Outflow; 2nd=Wallet Refund; Dates=Back Date & Back Date | Acc Statement - OB & CB r198 |  |
| 138 | 1st=Cash Outflow; 2nd=Deposit Withdraw; Dates=Back Date & Back Date | Acc Statement - OB & CB r199 |  |
| 139 | 1st=Cash Outflow; 2nd=Cash Transfer JV (Cash In); Dates=Back Date & Back Date | Acc Statement - OB & CB r200 |  |
| 140 | 1st=Cash Outflow; 2nd=Cash Transfer JV (Cash out); Dates=Back Date & Back Date | Acc Statement - OB & CB r201 |  |
| 141 | 1st=Wallet Refund; 2nd=Deposit Withdraw; Dates=Back Date & Back Date | Acc Statement - OB & CB r202 |  |
| 142 | 1st=Wallet Refund; 2nd=Cash Transfer JV (Cash In); Dates=Back Date & Back Date | Acc Statement - OB & CB r203 |  |
| 143 | 1st=Wallet Refund; 2nd=Cash Transfer JV (Cash out); Dates=Back Date & Back Date | Acc Statement - OB & CB r204 |  |
| 144 | 1st=Deposit Withdraw; 2nd=Cash Transfer JV (Cash In); Dates=Back Date & Back Date | Acc Statement - OB & CB r205 |  |
| 145 | 1st=Deposit Withdraw; 2nd=Cash Transfer JV (Cash out); Dates=Back Date & Back Date | Acc Statement - OB & CB r206 |  |
| 146 | 1st=Cash Transfer JV (Cash In); 2nd=Cash Transfer JV (Cash out); Dates=Back Date & Back Date | Acc Statement - OB & CB r207 |  |

---

### Account statement OB/CB – sequential pairs

#### ★ OB-ACS-009 · Account statement OB/CB — one transaction type followed by another

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Acc Statement - OB & CB r209 |

**Scenario group:** one transaction type is  followed by another  transaction type

**Check point:**

Transaction date  
Check Transaction no  
Balance calculation  
Balance Amount in Account> Detail screen of Bank Account  
Opening Balance of the following day  
Closing balance of Transaction Date  

**Check areas:**

Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  

**Expected result:**

The Closing Balance of the Previous day must be same with the Opening Balance of the Following day.  
(Account Statement Detail page  
Account Statement PDF  
Account Statement Excel  
All of the above should be correct if you check)  

**Data variants (15 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Cash Received(RV) / Cash Outflow(PV) | Acc Statement - OB & CB r209 | |
| 2 | 1st=Cash Received(RV); then 2nd=Cash Transfer JV (Cash In) | Acc Statement - OB & CB r210 |  |
| 3 | 1st=Cash Received(RV); then 2nd=Cash Transfer JV (Cash out) | Acc Statement - OB & CB r211 |  |
| 4 | Blank row in source (no transaction pair) | Acc Statement - OB & CB r212 | Review; Blank title/data row in source — no transaction pair defined |
| 5 | 1st=Cash Outflow(PV); then 2nd=Cash Received(RV) | Acc Statement - OB & CB r213 |  |
| 6 | 1st=Cash Outflow(PV); then 2nd=Cash Transfer JV (Cash In) | Acc Statement - OB & CB r214 |  |
| 7 | 1st=Cash Outflow(PV); then 2nd=Cash Transfer JV (Cash out) | Acc Statement - OB & CB r215 |  |
| 8 | Blank row in source (no transaction pair) | Acc Statement - OB & CB r216 | Review; Blank title/data row in source — no transaction pair defined |
| 9 | 1st=Cash Transfer JV (Cash In); then 2nd=Cash Received(RV) | Acc Statement - OB & CB r217 |  |
| 10 | 1st=Cash Transfer JV (Cash In); then 2nd=Cash Outflow(PV) | Acc Statement - OB & CB r218 |  |
| 11 | 1st=Cash Transfer JV (Cash In); then 2nd=Cash Transfer JV (Cash out) | Acc Statement - OB & CB r219 |  |
| 12 | Blank row in source (no transaction pair) | Acc Statement - OB & CB r220 | Review; Blank title/data row in source — no transaction pair defined |
| 13 | 1st=Cash Transfer JV (Cash out); then 2nd=Cash Received(RV) | Acc Statement - OB & CB r221 |  |
| 14 | 1st=Cash Transfer JV (Cash out); then 2nd=Cash Outflow(PV) | Acc Statement - OB & CB r222 |  |
| 15 | 1st=Cash Transfer JV (Cash out); then 2nd=Cash Transfer JV (Cash In) | Acc Statement - OB & CB r223 |  |

---

### Account concurrency – overdraw protection

#### ★ OB-ACS-010 · Account: 2 users debit full/over balance concurrently — second is refused

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active — Sheet expected column blank — expectation in check-area col | Acc Statement - OB & CB r225 |

**Scenario group:** Cash Outflow , Wallet Refund , Deposit Withdraw , Cash Transfer by 2 users at the same time.

**Test way:**

Total Account balance = 100,000  
User1 Outflow amount= 100,000  
User2 Outflowamount= 100,000  

**Check point:**

Both users Outflow the full Account balance at the same time  

**Check areas:**

error msg "Insufficient balance"  

**Data variants (8 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) outflow(approved) / outflow(approved) | Acc Statement - OB & CB r225 | |
| 2 | Type=outflow(approved); Account balance = 100,000; User1 Outflow amt + User2 Outflow amt > 100,000; Expect=error msg "Insufficient balance" | Acc Statement - OB & CB r227 |  |
| 3 | Type=wallet refund (approved); Account balance = 100,000; User1 Wallet Refund amt= 100,000; User2 Wallet Refund amt= 100,000; Expect=error msg "Insufficient balance" | Acc Statement - OB & CB r228 |  |
| 4 | Type=wallet refund (approved); Account balance = 100,000; User1 Wallet Refund amt + User2 Wallet Refund amt > 100,000; Expect=error msg "Insufficient balance" | Acc Statement - OB & CB r230 |  |
| 5 | Type=deposit withdraw (approved); Account balance = 100,000; User1 Deposit Withdraw amt= 100,000; User2 Deposit Withdraw amt= 100,000; Expect=error msg "Insufficient balance" | Acc Statement - OB & CB r231 |  |
| 6 | Type=deposit withdraw (approved); Account balance = 100,000; User1 Deposit Withdraw amt + User2 Deposit Withdraw amt > 100,000; Expect=error msg "Insufficient balance" | Acc Statement - OB & CB r233 |  |
| 7 | Type=cash transfer out(approved); Account balance = 100,000; User1 Transfer Out amt= 100,000; User2 Transfer Out amt= 100,000; Expect=error msg "Insufficient Balance in Account" | Acc Statement - OB & CB r234 |  |
| 8 | Type=cash transfer out(approved); Account balance = 100,000; User1 Transfer Out amt + User2 Transfer Out amt > 100,000; Expect=error msg "Insufficient Balance in Account" | Acc Statement - OB & CB r236 |  |

---

#### ★ OB-ACS-011 · Account: 2 users debit within balance concurrently — both allowed

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active — Sheet expected column blank — expectation in check-area col | Acc Statement - OB & CB r226 |

**Scenario group:** Cash Outflow , Wallet Refund , Deposit Withdraw , Cash Transfer by 2 users at the same time.

**Test way:**

Total Account balance = 100,000  
User1 Outflow amount + User2 Outflow amount <= 100,000  

**Check point:**

Total Outflow amount by 2 user is less than or equal to Total Account balance  

**Check areas:**

2 user allow  

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) outflow(approved) / outflow(approved) | Acc Statement - OB & CB r226 | |
| 2 | Type=wallet refund (approved); Account balance = 100,000; User1 Wallet Refund amt + User2 Wallet Refund amt <= 100,000; Expect=2 user allow | Acc Statement - OB & CB r229 |  |
| 3 | Type=deposit withdraw (approved); Account balance = 100,000; User1 Deposit Withdraw amt + User2 Deposit Withdraw amt <= 100,000; Expect=2 user allow | Acc Statement - OB & CB r232 |  |
| 4 | Type=cash transfer out(approved); Account balance = 100,000; User1 Transfer Out amt + User2 Transfer Out amt <= 100,000; Expect=2 user allow | Acc Statement - OB & CB r235 |  |

---
