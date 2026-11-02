# 02 · Dashboard

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 8 (+18 data-variant rows)  
**Priority:** P1 6 · P2 2 · P3 0 · **★ Critical:** 4 · **Smoke:** 3 · **E2E:** 2 · **Auto:** 8 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [DASH-001](#-dash-001--dashboard-shows-ar-total-current-and-overdue-amounts--by-currency) | ★ Dashboard shows AR total, current and overdue amounts — by currency | AR summary | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 3 |
| [DASH-002](#-dash-002--dashboard-shows-total-cash--bank-balance--mmk-and-other-currency) | ★ Dashboard shows total Cash & Bank balance — MMK and other currency | Cash & Bank balance | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [DASH-003](#-dash-003--dashboard-shows-cash--bank-balance-split-by-in-hand--in-bank--by-currency) | ★ Dashboard shows Cash & Bank balance split by In Hand / In Bank — by currency | Cash & Bank balance | P1 | Regression | Auto-UI+API | Active | 3 |
| [DASH-004](#-dash-004--dashboard-shows-balance-per-bank-account--by-currency) | ★ Dashboard shows balance per bank account — by currency | Cash & Bank balance | P1 | Regression | Auto-UI+API | Active | 3 |
| [DASH-005](#dash-005--dashboard-net-cash-collection-payment-net--by-currency--period) | Dashboard net cash (collection, payment, net) — by currency × period | Net cash | P1 | Smoke · Regression | Auto-UI+API | Active | 6 |
| [DASH-006](#dash-006--negative-net-cash-shown-in-red-within-brackets--by-currency) | Negative net cash shown in red within brackets — by currency | Net cash | P2 | Regression | Auto-UI | Active | 2 |
| [DASH-007](#dash-007--dashboard-wallet--deposit-net-amounts--by-currency--period) | Dashboard Wallet & Deposit net amounts — by currency × period | Wallet & Deposit | P1 | Regression | Auto-UI+API | Active | 6 |
| [DASH-008](#dash-008--negative-wallet--deposit-total-shown-in-red-within-brackets--by-currency) | Negative Wallet & Deposit total shown in red within brackets — by currency | Wallet & Deposit | P2 | Regression | Auto-UI | Active | 2 |
<!-- /generated:summary -->

## Test cases

### AR summary

#### ★ DASH-001 · Dashboard shows AR total, current and overdue amounts — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Dashboard r5 (TC_AR_001) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Dashboard" from the left menu.

**Expected result:**

1. As soon as you enter the system, you should see the dashboard screen.
2. You can see total receivable amount(MMK) in the system.
3. You can see the total amount owed in the system in current card.
4. You can see the total amount overdue by the system.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see Account Receivable(MMK) is in the system. | Dashboard r5 (TC_AR_001) | |
| 2 | Currency=Other (USD etc.) | Dashboard r6 (TC_AR_002) |  |
| 3 | Duplicate from AR sheet (total receivable only, opened via Dashboard) | Accounts Receivable r5 (TC_AR_001) |  |

---

### Cash & Bank balance

#### ★ DASH-002 · Dashboard shows total Cash & Bank balance — MMK and other currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Dashboard r7 (TC_Dashboard_001) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Dashboard" from the left menu.

**Expected result:**

1. User can see the total balance amount(MMK) in the system.
2. User can see the total balance amount(other currency) in the system.

---

#### ★ DASH-003 · Dashboard shows Cash & Bank balance split by In Hand / In Bank — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Dashboard r8 (TC_Dashboard_002) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Dashboard" from the left menu.

**Expected result:**

1. User can see the In Hand balance amount(MMK) and In Bank balance amount (MMK) in the system.
2. User can see the In Hand balance amount(other currency) and In Bank balance amount (other currency) in the system.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see the Cash & Bank Balance for Types (In Hand & In Bank) separatly in the system. | Dashboard r8 (TC_Dashboard_002) | |
| 2 | Currency=MMK; includes Other account type | Dashboard r10 (TC_Dashboard_002) |  |
| 3 | Currency=Other; includes Other account type | Dashboard r12 (TC_Dashboard_004) |  |

---

#### ★ DASH-004 · Dashboard shows balance per bank account — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Dashboard r9 (TC_Dashboard_003) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Dashboard" from the left menu.

**Expected result:**

1. User can see the balance amount with MMK/other currency for each bank in the system.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see each Bank's balance amount in the system. | Dashboard r9 (TC_Dashboard_003) | |
| 2 | Currency=MMK | Dashboard r11 (TC_Dashboard_003) |  |
| 3 | Currency=Other | Dashboard r13 (TC_Dashboard_005) |  |

---

### Net cash

#### DASH-005 · Dashboard net cash (collection, payment, net) — by currency × period

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active | Dashboard r14 (TC_NetCash_001) |

**Preconditions:**

1. User need to login the System first.

**Steps:**

1. Click "Dashboard" from the left menu.

**Expected result:**

1. You can see the total collection(MMK) for today.
2. You can see the total payment(MMK) for today.
3. You can see the total net cash(MMK) for today.

**Data variants (6 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see total net cash(MMK) for today | Dashboard r14 (TC_NetCash_001) | |
| 2 | Currency=MMK; Period=Current month | Dashboard r15 (TC_NetCash_002) |  |
| 3 | Currency=MMK; Period=Last two months | Dashboard r16 (TC_NetCash_003) |  |
| 4 | Currency=Other; Period=Today | Dashboard r18 (TC_NetCash_005) |  |
| 5 | Currency=Other; Period=Current month | Dashboard r19 (TC_NetCash_006) |  |
| 6 | Currency=Other; Period=Last two months | Dashboard r20 (TC_NetCash_007) |  |

---

#### DASH-006 · Negative net cash shown in red within brackets — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Dashboard r17 (TC_NetCash_004) |

**Preconditions:**

1. User need to login the System first.
2. The total payment value is greater than total collection.

**Steps:**

1. Click "Dashboard" from the left menu.

**Expected result:**

1. If the net cash value is minus (negative), the total net cash value will be shown with a red color within the bracket.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see minus-value net cash(MMK) with red color | Dashboard r17 (TC_NetCash_004) | |
| 2 | Currency=Other | Dashboard r21 (TC_NetCash_008) |  |

---

### Wallet & Deposit

#### DASH-007 · Dashboard Wallet & Deposit net amounts — by currency × period

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Dashboard r22 (TC_W&D_001) |

**Preconditions:**

1. User need to login the System first.

**Steps:**

1. Click "Dashboard" from the left menu.

**Expected result:**

1. You can see the wallet net amount(MMK) for today.
2. You can see the deposit net amount(MMK) for today.
3. You can see the total net amount(MMK) for today.

**Data variants (6 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see total Wallet & Deposit(MMK) for today | Dashboard r22 (TC_W&D_001) | |
| 2 | Currency=MMK; Period=Current month | Dashboard r23 (TC_W&D_002) |  |
| 3 | Currency=MMK; Period=Last two months | Dashboard r24 (TC_W&D_003) |  |
| 4 | Currency=Other; Period=Today | Dashboard r26 (TC_W&D_005) |  |
| 5 | Currency=Other; Period=Current month | Dashboard r27 (TC_W&D_006) |  |
| 6 | Currency=Other; Period=Last two months | Dashboard r28 (TC_W&D_007) |  |

---

#### DASH-008 · Negative Wallet & Deposit total shown in red within brackets — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — No precondition creating a negative value (unlike net cash case) | Dashboard r25 (TC_W&D_004) |

**Preconditions:**

1. User need to login the System first.

**Steps:**

1. Click "Dashboard" from the left menu.

**Expected result:**

1. If the Wallet & Deposits value is minus (negative), the total Wallet & Deposits value will be shown with a red color within the bracket.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see minus-value Wallet & Deposits(MMK) with red color | Dashboard r25 (TC_W&D_004) | |
| 2 | Currency=Other | Dashboard r29 (TC_W&D_008) |  |

---
