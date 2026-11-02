# 10 · Make Payment

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 14 (+17 data-variant rows)  
**Priority:** P1 13 · P2 0 · P3 1 · **★ Critical:** 13 · **Smoke:** 4 · **E2E:** 13 · **Auto:** 14 · **Manual:** 0 · **Review:** 1

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [PAY-001](#-pay-001--make-full-payment-for-apartment-invoice-and-verify-soa-rv-invoice-status-and-ar) | ★ Make full payment for apartment invoice and verify SOA, RV, invoice status and AR | Make payment - full | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 2 |
| [PAY-002](#-pay-002--received-in-account-list-filtered-by-selected-payment-method-in-make-payment) | ★ Received-In account list filtered by selected payment method in Make Payment | Make payment - method & account | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [PAY-003](#-pay-003--make-partial-payment-invoice-becomes-partial-paid-and-duear-reduce) | ★ Make partial payment; invoice becomes Partial Paid and due/AR reduce | Make payment - partial | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [PAY-004](#-pay-004--make-one-payment-across-multiple-invoices-one-rv-soa-line-per-invoice) | ★ Make one payment across multiple invoices (one RV, SOA line per invoice) | Make payment - multi invoice | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [PAY-005](#-pay-005--pay-invoice-from-wallet-balance-wp-created-wallet-and-ar-updated) | ★ Pay invoice from wallet balance (WP created, wallet and AR updated) | Make payment - wallet | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [PAY-006](#-pay-006--pay-mmk-invoice-in-other-currency-pay-in-usd-and-verify-soaar) | ★ Pay MMK invoice in other currency (Pay in USD) and verify SOA/AR | Make payment - other currency | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [PAY-007](#-pay-007--overpay-invoice-and-credit-overflow-amount-to-wallet) | ★ Overpay invoice and credit overflow amount to wallet | Make payment - overflow to wallet | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [PAY-008](#-pay-008--assign-unknown-received-rv-to-apartment-invoices-rv-and-ar-updated) | ★ Assign Unknown Received RV to apartment invoices; RV and AR updated | Unknown RV assign - invoice | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 4 |
| [PAY-009](#-pay-009--assign-unknown-received-rv-to-apartment-overflow-credited-to-wallet) | ★ Assign Unknown Received RV to apartment; overflow credited to wallet | Unknown RV assign - overflow wallet | P1 | E2E · Regression | Auto-UI+API | Active | 4 |
| [PAY-010](#-pay-010--assign-unknown-received-rv-to-apartment-overflow-added-to-deposit) | ★ Assign Unknown Received RV to apartment; overflow added to deposit | Unknown RV assign - overflow deposit | P1 | E2E · Regression | Auto-UI+API | Active | 4 |
| [PAY-011](#-pay-011--assign-unknown-received-rv-fully-to-apartment-wallet-no-invoice) | ★ Assign Unknown Received RV fully to apartment wallet (no invoice) | Unknown RV assign - wallet only | P1 | E2E · Regression | Auto-UI+API | Active | 4 |
| [PAY-012](#-pay-012--assign-unknown-received-rv-fully-to-apartment-deposit-no-invoice) | ★ Assign Unknown Received RV fully to apartment deposit (no invoice) | Unknown RV assign - deposit only | P1 | E2E · Regression | Auto-UI+API | Active | 4 |
| [PAY-013](#pay-013--make-payment-is-not-submitted-by-pressing-enter-key) | Make Payment is not submitted by pressing Enter key | Make payment - form validation | P3 | Regression | Auto-UI | Active |  |
| [PAY-014](#-pay-014--make-payment-for-apartment-invoice-with-cheque-method) | ★ Make payment for apartment invoice with Cheque method | Make payment - method & account | P1 | E2E · Regression | Auto-UI+API | Review |  |
<!-- /generated:summary -->

## Test cases

### Make payment - full

#### ★ PAY-001 · Make full payment for apartment invoice and verify SOA, RV, invoice status and AR

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Make Payment r5 (TC_MPM_001) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Location = "MO - A5"
2. Payment method = "Cash"
3. Received In account = CB Bank
4. Received Amount = 10,000 MMK / select invoice that you want to make payment

**Steps:**

1. Click "Apartment" from left menu and click manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency , location, Payment Method and Received In account.
4. Enter received amount / select invoice that you want to make payment.
5. Click "Confirm" button

**Expected result:**

1. Transaction Added in apartment SOA.
2. New RV code created and will be showed in Cash Received list.
3. Invoive status and AR amount will be updated

**Check areas:**

1. Dashboard AR amount , Cash & Bank amount , net cash
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Cash & Bank Account
7. Report - Account Statement report and account detail , Invoices list , transaction , cash received

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can make full payment from Apartment invoice | Make Payment r5 (TC_MPM_001) | |
| 2 | Entry=Contact > Unpaid Invoice tab | Make Payment r6 (TC_MPM_002) |  |

---

### Make payment - method & account

#### ★ PAY-002 · Received-In account list filtered by selected payment method in Make Payment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Make Payment r7 (TC_MPM_003) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Location = "MO - A5"
2. Payment method = Select the payment method
3. Received In account = The system will show you the accounts that can use the selected payment method, and you can then select from them.
4. Received Amount = 10,000 MMK / select invoice that you want to make payment

**Steps:**

1. Click "Apartment" from left menu and click apartmant manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency ,location, Payment Method and Received In account.
4. Enter received amount / select invoice that you want to make payment.
5. Click "Confirm" button

**Expected result:**

1. Transaction Added in apartment SOA.
2. New RV code created and will be showed in Cash Received list.
3. Invoive status and AR amount will be updated

**Check areas:**

1. Dashboard AR amount , Cash & Bank amount , net cash
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Cash & Bank Account
7. Report - Account Statement report and account detail , Invoices list , transaction , cash received

---

### Make payment - partial

#### ★ PAY-003 · Make partial payment; invoice becomes Partial Paid and due/AR reduce

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Make Payment r8 (TC_MPM_004) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Location = "MO - A5"
2. Payment method = "Cash"
3. Received In account = CB Bank
4. Received Amount = 1,000 MMK / enter partial amount in invoice that you want to make payment

**Steps:**

1. Click "Apartment" from left menu and click apartmant manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency , location, Payment Method and Received In account.
4. Enter received amount / enter partial amount invoice that you want to make payment.
5. Click "Confirm" button

**Expected result:**

1. Transaction Added in apartment SOA.
2. New RV code created and will be showed in Cash Received list.
3. Invoive status change to "partial paid".
4. Invoice due amount and AR amount will be updated.

**Check areas:**

1. Dashboard AR amount , Cash & Bank amount , net cash
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Cash & Bank Account
7. Report - Account Statement report and account detail , Invoices list , transaction , cash received

---

### Make payment - multi invoice

#### ★ PAY-004 · Make one payment across multiple invoices (one RV, SOA line per invoice)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Make Payment r9 (TC_MPM_005) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Location = "MO - A5"
2. Payment method = "Cash"
3. Received In account = CB Bank
4. Received Amount = 1,000 MMK / select multiple invoice that you want to make payment

**Steps:**

1. Click "Apartment" from left menu and click apartmant manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency , location, Payment Method and Received In account.
4. Enter received amount / select multiple invoice that you want to make payment
5. Click "Confirm" button

**Expected result:**

1. Even though there is only one RV, transactions will be recorded in the Apartment SOA based on the number of invoices.
2. New RV code created and will be showed in Cash Received list.
3. Invoive status and AR amount will be updated

**Check areas:**

1. Dashboard AR amount , Cash & Bank amount , net cash
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Cash & Bank Account
7. Report - Account Statement report and account detail , Invoices list , transaction , cash received

---

### Make payment - wallet

#### ★ PAY-005 · Pay invoice from wallet balance (WP created, wallet and AR updated)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Make Payment r10 (TC_MPM_006) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Location = "MO - A5"
2. Payment method = wallet
3. Select invoice that you want to make payment

**Steps:**

1. Click "Apartment" from left menu and click apartmant manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency ,location, Payment Method.
4. Select invoice that you want to make payment.
5. Click "Confirm" button

**Expected result:**

1. Transaction Added in apartment SOA and apartment wallet.
2. New RV code created and will be showed in Cash Received list.
3. New WP code created and will be showed in Wallet tab.
4. Invoive status , wallet balance and AR amount will be updated

**Check areas:**

1. Dashboard AR amount , wallet
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report ,wallet
5. Contact - summary amount, Unpaid Invoices list
6. Report - Account Statement detail , Invoices list , transaction , cash received

---

### Make payment - other currency

#### ★ PAY-006 · Pay MMK invoice in other currency (Pay in USD) and verify SOA/AR

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Make Payment r11 (TC_MPM_007) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Currency = MMK
2. Location = "MO - A5"
3. Pay in = USD
4. Payment method = "Cash"
5. Received In account = CB Bank
6. Received Amount (USD) = 10$
7. Received Amount (MMK) = 35000MMK / select invoice that you want to make payment

**Steps:**

1. Click "Apartment" from left menu and click apartmant manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency, Pay in currency, location, Payment Method and Received In account.
4. Enter received amount(MMK & Other Currency) / select invoice that you want to make payment.
5. Click "Confirm" button

**Expected result:**

1. Transaction(same currency with invoice) Added in apartment SOA.
2. New RV code created and will be showed in Cash Received list.
3. Invoive status and AR amount will be updated

**Check areas:**

1. Dashboard AR amount , Cash & Bank amount , net cash
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Cash & Bank Account
7. Report - Account Statement report and account detail , Invoices list , transaction , cash received

---

### Make payment - overflow to wallet

#### ★ PAY-007 · Overpay invoice and credit overflow amount to wallet

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Make Payment r12 (TC_MPM_008) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Location = "MO - A5"
2. Payment method = "Cash"
3. Received In account = CB Bank
4. Received Amount = 1,000,000 MMK (or)
5. Select invoice that you want to make payment and enter amount in "credit to wallet"

**Steps:**

1. Click "Apartment" from left menu and click apartmant manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency ,location, Payment Method and Received In account.
4. Enter overflow received amount /enter amount in "credit to wallet" .
5. Click "Confirm" button

**Expected result:**

1. Transaction Added in apartment SOA and apartment wallet.
2. New RV code created and will be showed in Cash Received list and wallet.
3. Invoive status , wallet balance and AR amount will be updated

**Check areas:**

1. Dashboard AR amount , Cash & Bank amount , net cash , wallet
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report ,wallet
5. Contact - summary amount, Unpaid Invoices list
6. Cash & Bank Account
7. Report - Account Statement detail , Invoices list , transaction , cash received

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Users can make payment in same curreny and overflow to wallet | Make Payment r12 (TC_MPM_008) | |
| 2 | Pay in=USD (invoice MMK) | Make Payment r13 (TC_MPM_009) |  |

---

### Unknown RV assign - invoice

#### ★ PAY-008 · Assign Unknown Received RV to apartment invoices; RV and AR updated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Make Payment r14 (TC_MPM_010) |

**Preconditions:**

1. Invoices for apartments must be created.
2. Receipt for unknown cash receipt has been already created.

**Test data:**

1. Select apartment
2. Remark = "unknown to apartment"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Click "Unknown Received".
3. Click "Unknown Received Allocation".
4. Click "Manage" button of RV that you want to re assign
5. Select the apartment number and will see the invoices with amounts.
6. If the Cash Received Amount is not overflow, the received amount is paid for first opened invoices.
7. Click "Confirm" button.

**Expected result:**

1. Receipt voucher is updated and Account Receivable is also updated.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Account Statement detail , Invoices list , transaction , cash received , Assign Unknown Received Logs

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can change Unknown Received RV to Apartment payment RV | Make Payment r14 (TC_MPM_010) | |
| 2 | Currency=Other (MMK & other currency amounts) | Make Payment r15 (TC_MPM_011) |  |
| 3 | Duplicate of TC_MPM_010 (Cash Received sheet) | Cash Received r20 (TC_CR_016) |  |
| 4 | Currency=Other; duplicate of TC_MPM_011 | Cash Received r21 (TC_CR_017) |  |

---

### Unknown RV assign - overflow wallet

#### ★ PAY-009 · Assign Unknown Received RV to apartment; overflow credited to wallet

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Make Payment r16 (TC_MPM_012) |

**Preconditions:**

Receipt for unknown received has been already created.  

**Test data:**

1. Select apartment
2. Remark = "unknown to apartment"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Click "Unknown Received" .
3. Click "Unknown Received Allocation".
4. Click "Manage" button of RV that you want to re assign
5. Select the apartment number and will see the invoices with amounts.
6. If the Cash Received Amount is overflow, the overflow amount is addes as credited amount to wallet of the respective apartment by selecting the "Credit to Wallet".
7. Click "Confirm" button.

**Expected result:**

1. Receipt voucher is updated and wallet balance is updated.

**Check areas:**

1. Dashboard AR amount , wallet
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report ,wallet
6. Contact - summary amount, Unpaid Invoices list
7. Report - Account Statement detail , Invoices list , transaction , cash received , Assign Unknown Received Logs

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can change Unknown Received RV to Apartment payment RV and overflow amount is added to wallet balance. | Make Payment r16 (TC_MPM_012) | |
| 2 | Currency=Other | Make Payment r17 (TC_MPM_013) |  |
| 3 | Duplicate of TC_MPM_012 | Cash Received r22 (TC_CR_018) |  |
| 4 | Currency=Other; duplicate of TC_MPM_013 | Cash Received r23 (TC_CR_019) |  |

---

### Unknown RV assign - overflow deposit

#### ★ PAY-010 · Assign Unknown Received RV to apartment; overflow added to deposit

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Make Payment r18 (TC_MPM_014) |

**Preconditions:**

1. Receipt for unknown cash receipt has been already created.

**Test data:**

1. Select apartment
2. Remark = "unknown to apartment"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Click "Unknown Received".
3. Click "Unknown Received Allocation".
4. Click "Manage" button of RV that you want to re assign
5. Select the apartment number and will see the invoices with amounts.
6. If the Cash Received Amount is overflow, the overflow amount is addes as credited amount to deposit of the respective apartment by selecting the "Deposit".
7. Click "Confirm" button.

**Expected result:**

1. Receipt voucher is updated and deposit amount is updated.

**Check areas:**

1. Dashboard AR amount , Deposit
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report ,Deposit
6. Contact - summary amount, Unpaid Invoices list
7. Report - Account Statement detail , Invoices list , transaction , cash received , Assign Unknown Received Logs

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can change Unknown Received RV to Apartment payment RV and overflow amount is added as deposit amount. | Make Payment r18 (TC_MPM_014) | |
| 2 | Currency=Other | Make Payment r19 (TC_MPM_015) | Review; Expected says wallet balance updated for a deposit-overflow case (copy error) |
| 3 | Duplicate of TC_MPM_014 | Cash Received r24 (TC_CR_020) |  |
| 4 | Currency=Other; duplicate of TC_MPM_015 | Cash Received r25 (TC_CR_021) | Review; Expected says wallet balance updated for a deposit-overflow case (copy error) |

---

### Unknown RV assign - wallet only

#### ★ PAY-011 · Assign Unknown Received RV fully to apartment wallet (no invoice)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Make Payment r20 (TC_MPM_016) |

**Preconditions:**

Receipt for unknown received has been already created.  

**Test data:**

1. Select apartment
2. Remark = "unknown to wallet"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Click "Unknown Received" .
3. Click "Unknown Received Allocation".
4. Click "Manage" button of RV that you want to re assign
5. Select no invoice, the amount will only go into the "Credit to Wallet".
6. Click "Confirm" button.

**Expected result:**

1. Receipt voucher is updated and wallet balance is updated.

**Check areas:**

1. Dashboard wallet
2. Cash Received - Recent Receipt
3. Apartment - wallet
4. Report - Account Statement detail , transaction , cash received , Assign Unknown Received Logs

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can change Unknown Received RV to wallet balance. | Make Payment r20 (TC_MPM_016) | |
| 2 | Currency=Other | Make Payment r21 (TC_MPM_017) |  |
| 3 | Duplicate of TC_MPM_016 | Cash Received r26 (TC_CR_022) |  |
| 4 | Currency=Other; duplicate of TC_MPM_017 | Cash Received r27 (TC_CR_023) |  |

---

### Unknown RV assign - deposit only

#### ★ PAY-012 · Assign Unknown Received RV fully to apartment deposit (no invoice)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Make Payment r22 (TC_MPM_018) |

**Preconditions:**

1. Receipt for unknown cash receipt has been already created.

**Test data:**

1. Select apartment
2. Remark = "unknown to depositt"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Click "Unknown Received".
3. Click "Unknown Received Allocation".
4. Click "Manage" button of RV that you want to re assign
5. Select no invoice, the amount will only go into the "Credit to Wallet".
6. Click on "Deposit"
7. Click "Confirm" button.

**Expected result:**

1. Receipt voucher is updated and deposit amount is updated.

**Check areas:**

1. Dashboard Deposit
2. Cash Received - Recent Receipt
3. Apartment - Deposit
4. Report - Account Statement detail , transaction , cash received , Assign Unknown Received Logs

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can change Unknown Received RV to deposit amount. | Make Payment r22 (TC_MPM_018) | |
| 2 | Currency=Other | Make Payment r23 (TC_MPM_019) |  |
| 3 | Duplicate of TC_MPM_018 | Cash Received r28 (TC_CR_024) |  |
| 4 | Currency=Other; duplicate of TC_MPM_019 | Cash Received r29 (TC_CR_025) |  |

---

### Make payment - form validation

#### PAY-013 · Make Payment is not submitted by pressing Enter key

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Make Payment r24 (TC_MPM_020) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Location = "MO - A5"
2. Payment method = "Cash"
3. Received In account = CB Bank
4. Received Amount = 10,000 MMK / select invoice that you want to make payment

**Steps:**

1. Click "Apartment" from left menu and click apartmant manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency , location, Payment Method and Received In account.
4. Enter received amount / select invoice that you want to make payment.
5. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the Make Payment function.  

---

### Make payment - method & account

#### ★ PAY-014 · Make payment for apartment invoice with Cheque method

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Review — Expected mentions wallet transaction and WP code for a cheque payment (copy from wallet case) | Make Payment r25 (TC_MPM_021) |

**Preconditions:**

1. Invoices for apartments must be created.

**Test data:**

1. Location = "MO - A5"
2. Payment method = Cheque
3. Select invoice that you want to make payment

**Steps:**

1. Click "Apartment" from left menu and click apartmant manage button of select apartment.
2. Click "Invoice" tab and click "Make Payment" button.
3. Select Currency ,Location, Payment Method as 'Cheque', Received in.
4. Select invoice that you want to make payment.
5. Click "Confirm" button.

**Expected result:**

1. Transaction Added in apartment SOA and apartment wallet.
2. New RV code created and will be showed in Cash Received list.
3. New WP code created and will be showed in Wallet tab.
4. Invoive status , and AR amount will be updated

**Check areas:**

1. Dashboard AR amount , Cash & Bank amount , net cash
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Cash & Bank Account
7. Report - Account Statement report and account detail , Invoices list , transaction , cash received

---
