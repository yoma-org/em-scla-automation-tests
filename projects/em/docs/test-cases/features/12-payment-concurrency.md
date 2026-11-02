# 12 · Payment Concurrency (1 Inv × 2 RV, 1 RV × 2 Inv)

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 7 (+66 data-variant rows)  
**Priority:** P1 7 · P2 0 · P3 0 · **★ Critical:** 7 · **Smoke:** 0 · **E2E:** 7 · **Auto:** 7 · **Manual:** 0 · **Review:** 1

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [CONC-001](#-conc-001--1-invoice-2-concurrent-full-payments-2nd-rejected-as-paid-in-full-matrix) | ★ 1 invoice, 2 concurrent full payments: 2nd rejected as paid in full (matrix) | 1Inv2RV - full paid | P1 | E2E · Regression | Auto-API | Active | 12 |
| [CONC-002](#-conc-002--1-invoice-concurrent-full-payment--scla-ui-paid-in-full-api-invalid-amount-matrix) | ★ 1 invoice, concurrent full payment + SCLA: UI paid-in-full, API Invalid Amount (matrix) | 1Inv2RV - full paid (SCLA) | P1 | E2E · Regression | Auto-API | Active | 5 |
| [CONC-003](#-conc-003--1-invoice-2-concurrent-partial-payments-within-balance-both-accepted-matrix) | ★ 1 invoice, 2 concurrent partial payments within balance: both accepted (matrix) | 1Inv2RV - partial within balance | P1 | E2E · Regression | Auto-API | Active | 22 |
| [CONC-004](#-conc-004--1-invoice-2-concurrent-partials-exceeding-balance-2nd-asked-to-refresh-matrix) | ★ 1 invoice, 2 concurrent partials exceeding balance: 2nd asked to refresh (matrix) | 1Inv2RV - partial exceeding balance | P1 | E2E · Regression | Auto-API | Active | 11 |
| [CONC-005](#-conc-005--1-invoice-partial--concurrent-full-scla-scla-rejected-api-invalid-amount-matrix) | ★ 1 invoice, partial + concurrent full SCLA: SCLA rejected (API Invalid Amount) (matrix) | 1Inv2RV - partial vs SCLA | P1 | E2E · Regression | Auto-API | Review | 5 |
| [CONC-006](#-conc-006--1-unknown-rv-identified-by-2-users-concurrently-2nd-asked-to-refresh-matrix) | ★ 1 Unknown RV identified by 2 users concurrently: 2nd asked to refresh (matrix) | 1RV2Inv - payer identify | P1 | E2E · Regression | Auto-API | Active | 2 |
| [CONC-007](#-conc-007--1-unknown-rv-assigned-to-invoices-by-2-users-concurrently-2nd-asked-to-refresh-matrix) | ★ 1 Unknown RV assigned to invoices by 2 users concurrently: 2nd asked to refresh (matrix) | 1RV2Inv - invoice assign | P1 | E2E · Regression | Auto-API | Active | 16 |
<!-- /generated:summary -->

## Test cases

### 1Inv2RV - full paid

#### ★ CONC-001 · 1 invoice, 2 concurrent full payments: 2nd rejected as paid in full (matrix)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | 1Inv 2RV r4 |

**Scenario group:** An invoice was paid by two RVs  at the same time. (Same Currency)

**Scenario:**

An invoice was paid by two RVs  
at the same time.  
(Same Currency)  

**Type:**

Full Paid  
(Inv amount is 1000)  

**Concurrent actions:**

1st: make payment (RV = 1000) | 2nd: make payment (RV = 1000)  

**Expected result:**

UI: "This invoice has already been paid in full. No further payments are required."  

**Data variants (12 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Full Paid  (Inv amount is 1000) | 1Inv 2RV r4 | |
| 2 | Currency=Same; 1st=make payment (RV=1000); 2nd=unknown assign (RV=1000); Expect=UI paid-in-full msg | 1Inv 2RV r5 |  |
| 3 | Currency=Same; 1st=make payment (RV=1000); 2nd=Wallet Payment (WP=1000); Expect=UI paid-in-full msg | 1Inv 2RV r6 |  |
| 4 | Currency=Same; 1st=unknown assign (RV=1000); 2nd=unknown assign (RV=1000); Expect=UI paid-in-full msg | 1Inv 2RV r9 |  |
| 5 | Currency=Same; 1st=unknown assign (RV=1000); 2nd=Wallet Payment (WP=1000); Expect=UI paid-in-full msg | 1Inv 2RV r10 |  |
| 6 | Currency=Same; 1st=Wallet Payment (WP=1000); 2nd=Wallet Payment (WP=1000); Expect=UI paid-in-full msg | 1Inv 2RV r13 |  |
| 7 | Currency=Same; 1st=Wallet Payment (WP=1000); 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg | 1Inv 2RV r14 | WP + SCLA row lacks the "API: Invalid Amount" note other SCLA rows have |
| 8 | Currency=Diff; 1st=make payment; 2nd=make payment (RV=1000); Expect=UI paid-in-full msg | 1Inv 2RV r48 |  |
| 9 | Currency=Diff; 1st=make payment; 2nd=unknown assign (RV=1000); Expect=UI paid-in-full msg | 1Inv 2RV r49 |  |
| 10 | Currency=Diff; 1st=make payment; 2nd=Wallet Payment (WP=1000); Expect=UI paid-in-full msg | 1Inv 2RV r50 |  |
| 11 | Currency=Diff; 1st=unknown assign; 2nd=unknown assign (RV=1000); Expect=UI paid-in-full msg | 1Inv 2RV r53 |  |
| 12 | Currency=Diff; 1st=unknown assign; 2nd=Wallet Payment (WP=1000); Expect=UI paid-in-full msg | 1Inv 2RV r54 |  |

---

### 1Inv2RV - full paid (SCLA)

#### ★ CONC-002 · 1 invoice, concurrent full payment + SCLA: UI paid-in-full, API Invalid Amount (matrix)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | 1Inv 2RV r7 |

**Scenario group:** An invoice was paid by two RVs  at the same time. (Same Currency)

**Scenario:**

An invoice was paid by two RVs  
at the same time.  
(Same Currency)  

**Type:**

Full Paid  
(Inv amount is 1000)  

**Concurrent actions:**

1st: make payment (RV = 1000) | 2nd: SCLA (RV = 1000)  

**Expected result:**

UI: "This invoice has already been paid in full. No further payments are required." | API: Invalid Amount  

**Data variants (5 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Full Paid  (Inv amount is 1000) | 1Inv 2RV r7 | |
| 2 | Currency=Same; 1st=unknown assign (RV=1000); 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg + API Invalid Amount | 1Inv 2RV r11 |  |
| 3 | Currency=Same; 1st=SCLA (RV=1000); 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg + API Invalid Amount | 1Inv 2RV r16 |  |
| 4 | Currency=Diff; 1st=make payment; 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg + API Invalid Amount | 1Inv 2RV r51 |  |
| 5 | Currency=Diff; 1st=unknown assign; 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg + API Invalid Amount | 1Inv 2RV r55 |  |

---

### 1Inv2RV - partial within balance

#### ★ CONC-003 · 1 invoice, 2 concurrent partial payments within balance: both accepted (matrix)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | 1Inv 2RV r18 |

**Scenario group:** An invoice was paid by two RVs  at the same time. (Same Currency)

**Scenario:**

An invoice was paid by two RVs  
at the same time.  
(Same Currency)  

**Type:**

Partial Paid  
(Inv amount is 1000)  

**Concurrent actions:**

1st: make payment (RV = 500) | 2nd: make payment (RV = 400)  

**Expected result:**

UI: 2 user allow  

**Data variants (22 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Partial Paid (Inv amount is 1000) | 1Inv 2RV r18 | |
| 2 | Currency=Same; 1st=make payment (RV=500); 2nd=make payment (RV=500); Expect=both accepted | 1Inv 2RV r19 |  |
| 3 | Currency=Same; 1st=make payment (RV=500); 2nd=unknown assign (RV=400); Expect=both accepted | 1Inv 2RV r22 |  |
| 4 | Currency=Same; 1st=make payment (RV=500); 2nd=unknown assign (RV=500); Expect=both accepted | 1Inv 2RV r23 |  |
| 5 | Currency=Same; 1st=make payment (RV=500); 2nd=Wallet Payment (WP=400); Expect=both accepted | 1Inv 2RV r26 |  |
| 6 | Currency=Same; 1st=make payment (RV=500); 2nd=Wallet Payment (WP=500); Expect=both accepted | 1Inv 2RV r27 |  |
| 7 | Currency=Same; 1st=unknown assign (RV=500); 2nd=unknown assign (RV=400); Expect=both accepted | 1Inv 2RV r32 |  |
| 8 | Currency=Same; 1st=unknown assign (RV=500); 2nd=unknown assign (RV=500); Expect=both accepted | 1Inv 2RV r33 |  |
| 9 | Currency=Same; 1st=unknown assign (RV=500); 2nd=Wallet Payment (WP=400); Expect=both accepted | 1Inv 2RV r36 |  |
| 10 | Currency=Same; 1st=unknown assign (RV=500); 2nd=Wallet Payment (WP=500); Expect=both accepted | 1Inv 2RV r37 |  |
| 11 | Currency=Same; 1st=Wallet Payment (WP=500); 2nd=Wallet Payment (WP=400); Expect=both accepted | 1Inv 2RV r42 |  |
| 12 | Currency=Same; 1st=Wallet Payment (WP=500); 2nd=Wallet Payment (WP=500); Expect=both accepted | 1Inv 2RV r43 |  |
| 13 | Currency=Diff; 1st=make payment (RV=500); 2nd=make payment (RV=400); Expect=both accepted | 1Inv 2RV r57 |  |
| 14 | Currency=Diff; 1st=make payment (RV=500); 2nd=make payment (RV=500); Expect=both accepted | 1Inv 2RV r58 |  |
| 15 | Currency=Diff; 1st=make payment (RV=500); 2nd=unknown assign (RV=400); Expect=both accepted | 1Inv 2RV r61 |  |
| 16 | Currency=Diff; 1st=make payment (RV=500); 2nd=unknown assign (RV=500); Expect=both accepted | 1Inv 2RV r62 |  |
| 17 | Currency=Diff; 1st=make payment (RV=500); 2nd=Wallet Payment (WP=400); Expect=both accepted | 1Inv 2RV r65 |  |
| 18 | Currency=Diff; 1st=make payment (RV=500); 2nd=Wallet Payment (WP=500); Expect=both accepted | 1Inv 2RV r66 |  |
| 19 | Currency=Diff; 1st=unknown assign (RV=500); 2nd=unknown assign (RV=400); Expect=both accepted | 1Inv 2RV r71 |  |
| 20 | Currency=Diff; 1st=unknown assign (RV=500); 2nd=unknown assign (RV=500); Expect=both accepted | 1Inv 2RV r72 |  |
| 21 | Currency=Diff; 1st=unknown assign (RV=500); 2nd=Wallet Payment (WP=400); Expect=both accepted | 1Inv 2RV r75 |  |
| 22 | Currency=Diff; 1st=unknown assign (RV=500); 2nd=Wallet Payment (WP=500); Expect=both accepted | 1Inv 2RV r76 |  |

---

### 1Inv2RV - partial exceeding balance

#### ★ CONC-004 · 1 invoice, 2 concurrent partials exceeding balance: 2nd asked to refresh (matrix)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | 1Inv 2RV r20 |

**Scenario group:** An invoice was paid by two RVs  at the same time. (Same Currency)

**Scenario:**

An invoice was paid by two RVs  
at the same time.  
(Same Currency)  

**Type:**

Partial Paid  
(Inv amount is 1000)  

**Concurrent actions:**

1st: make payment (RV = 500) | 2nd: make payment (RV = 600)  

**Expected result:**

UI: "This invoice has already been partially paid. Please refresh and try again."  

**Data variants (11 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Partial Paid (Inv amount is 1000) | 1Inv 2RV r20 | |
| 2 | Currency=Same; 1st=make payment (RV=500); 2nd=unknown assign (RV=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r24 |  |
| 3 | Currency=Same; 1st=make payment (RV=500); 2nd=Wallet Payment (WP=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r28 |  |
| 4 | Currency=Same; 1st=unknown assign (RV=500); 2nd=unknown assign (RV=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r34 |  |
| 5 | Currency=Same; 1st=unknown assign (RV=500); 2nd=Wallet Payment (WP=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r38 |  |
| 6 | Currency=Same; 1st=Wallet Payment (WP=500); 2nd=Wallet Payment (WP=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r44 |  |
| 7 | Currency=Diff; 1st=make payment (RV=500); 2nd=make payment (RV=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r59 |  |
| 8 | Currency=Diff; 1st=make payment (RV=500); 2nd=unknown assign (RV=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r63 |  |
| 9 | Currency=Diff; 1st=make payment (RV=500); 2nd=Wallet Payment (WP=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r67 |  |
| 10 | Currency=Diff; 1st=unknown assign (RV=500); 2nd=unknown assign (RV=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r73 |  |
| 11 | Currency=Diff; 1st=unknown assign (RV=500); 2nd=Wallet Payment (WP=600); Expect=UI partially-paid refresh msg | 1Inv 2RV r77 |  |

---

### 1Inv2RV - partial vs SCLA

#### ★ CONC-005 · 1 invoice, partial + concurrent full SCLA: SCLA rejected (API Invalid Amount) (matrix)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Review — After 500 partial, SCLA 1000 exceeds balance; expected shows "paid in full" message, not "partially paid" - confirm | 1Inv 2RV r30 |

**Scenario group:** An invoice was paid by two RVs  at the same time. (Same Currency)

**Scenario:**

An invoice was paid by two RVs  
at the same time.  
(Same Currency)  

**Type:**

Partial Paid  
(Inv amount is 1000)  

**Concurrent actions:**

1st: make payment (RV = 500) | 2nd: SCLA (RV = 1000)  

**Expected result:**

UI: "This invoice has already been paid in full. No further payments are required." | API: Invalid Amount  

**Data variants (5 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Partial Paid (Inv amount is 1000) | 1Inv 2RV r30 | |
| 2 | Currency=Same; 1st=unknown assign (RV=500); 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg + API Invalid Amount | 1Inv 2RV r40 | Review; After 500 partial, SCLA 1000 exceeds balance; expected shows "paid in full" message, not "partially paid" - confirm |
| 3 | Currency=Same; 1st=Wallet Payment (WP=500); 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg + API Invalid Amount | 1Inv 2RV r46 | Review; After 500 partial, SCLA 1000 exceeds balance; expected shows "paid in full" message, not "partially paid" - confirm |
| 4 | Currency=Diff; 1st=make payment (RV=500); 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg + API Invalid Amount | 1Inv 2RV r69 | Review; After 500 partial, SCLA 1000 exceeds balance; expected shows "paid in full" message, not "partially paid" - confirm |
| 5 | Currency=Diff; 1st=unknown assign (RV=500); 2nd=SCLA (RV=1000); Expect=UI paid-in-full msg + API Invalid Amount | 1Inv 2RV r79 | Review; After 500 partial, SCLA 1000 exceeds balance; expected shows "paid in full" message, not "partially paid" - confirm |

---

### 1RV2Inv - payer identify

#### ★ CONC-006 · 1 Unknown RV identified by 2 users concurrently: 2nd asked to refresh (matrix)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active — Source priority blank | 1RV 2Inv r3 |

**Scenario group:** 1 unknown RV was concurrently assigned to two users.

**Scenario:**

1 unknown RV was concurrently  
assigned to two users.

**Type:**

Payer  

**Concurrent actions:**

Payer  

**Expected result:**

This unknown RV has been identified. Please refresh and try again.  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Payer | 1RV 2Inv r3 | |
| 2 | 1st=Payer identify; 2nd=Apartment Assign; Expect=RV already identified msg | 1RV 2Inv r4 | Source priority blank |

---

### 1RV2Inv - invoice assign

#### ★ CONC-007 · 1 Unknown RV assigned to invoices by 2 users concurrently: 2nd asked to refresh (matrix)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active — Source priority blank | 1RV 2Inv r6 |

**Scenario group:** 1 unknown RV was concurrently assigned to two users.

**Scenario:**

1 unknown RV was concurrently  
assigned to two users.

**Type:**

Same apartment  

**Concurrent actions:**

make payment 2 inv (1000)  

**Expected result:**

This unknown RV has been identified. Please refresh and try again.  

**Data variants (16 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Same apartment | 1RV 2Inv r6 | |
| 2 | Scope=Same apartment; Action=partial payment for invoices (allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r7 | Source priority blank |
| 3 | Scope=Same apartment; Action=partial overflow wallet(allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r8 | Source priority blank |
| 4 | Scope=Same apartment; Action=partial over flow deposit (allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r9 | Source priority blank |
| 5 | Scope=Different apartment; Action=make payment 2 inv (1000); Expect=RV already identified msg | 1RV 2Inv r11 | Source priority blank |
| 6 | Scope=Different apartment; Action=partial payment for invoices (allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r12 | Source priority blank |
| 7 | Scope=Different apartment; Action=partial overflow wallet(allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r13 | Source priority blank |
| 8 | Scope=Different apartment; Action=partial over flow deposit (allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r14 | Source priority blank |
| 9 | Scope=Different Currency; Action=make payment 2 inv (1000); Expect=RV already identified msg | 1RV 2Inv r16 | Source priority blank |
| 10 | Scope=Different Currency; Action=partial payment for invoices (allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r17 | Source priority blank |
| 11 | Scope=Different Currency; Action=partial overflow wallet(allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r18 | Source priority blank |
| 12 | Scope=Different Currency; Action=partial over flow deposit (allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r19 | Source priority blank |
| 13 | Scope=Different Currency Different Invoice; Action=make payment 2 inv (1000); Expect=RV already identified msg | 1RV 2Inv r21 | Source priority blank |
| 14 | Scope=Different Currency Different Invoice; Action=partial payment for invoices (allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r22 | Source priority blank |
| 15 | Scope=Different Currency Different Invoice; Action=partial overflow wallet(allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r23 | Source priority blank |
| 16 | Scope=Different Currency Different Invoice; Action=partial over flow deposit (allow only 1 user); Expect=RV already identified msg | 1RV 2Inv r24 | Source priority blank |

---
