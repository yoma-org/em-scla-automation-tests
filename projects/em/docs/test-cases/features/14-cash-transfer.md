# 14 · Cash Transfer (JV)

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 12 (+4 data-variant rows)  
**Priority:** P1 4 · P2 5 · P3 3 · **★ Critical:** 4 · **Smoke:** 1 · **E2E:** 4 · **Auto:** 10 · **Manual:** 2 · **Review:** 1

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [CT-001](#-ct-001--transfer-between-mmk-accounts-jv-listed-and-both-balances-updated) | ★ Transfer between MMK accounts; JV listed and both balances updated | Cash transfer - same currency | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 3 |
| [CT-002](#-ct-002--cross-currency-cash-transfer-with-conversion-rate-both-balances-updated) | ★ Cross-currency cash transfer with conversion rate; both balances updated | Cash transfer - cross currency | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [CT-003](#ct-003--required-field-errors-shown-on-cash-transfer-form) | Required-field errors shown on Cash Transfer form | Cash transfer - form validation | P3 | Regression | Auto-UI | Active |  |
| [CT-004](#ct-004--reject-zero-amount-on-cash-transfer-the-selected-amount-is-invalid) | Reject zero amount on Cash Transfer ("The selected Amount is invalid") | Cash transfer - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CT-005](#ct-005--negative-amount-cannot-be-entered-on-cash-transfer-form) | Negative amount cannot be entered on Cash Transfer form | Cash transfer - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CT-006](#ct-006--reject-cash-transfer-amount-99999999999999-exceeds-max-limit) | Reject Cash Transfer amount 99,999,999,999,999 (exceeds max limit) | Cash transfer - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CT-007](#ct-007--cash-transfer-with-minimum-amount-001-mmk-succeeds) | Cash Transfer with minimum amount 0.01 MMK succeeds | Cash transfer - amount validation | P2 | E2E · Regression | Auto-UI+API | Active |  |
| [CT-008](#-ct-008--block-cash-transfer-exceeding-source-account-balance-insufficient-balance) | ★ Block Cash Transfer exceeding source account balance (insufficient balance) | Cash transfer - balance check | P1 | Regression | Auto-UI+API | Active |  |
| [CT-009](#-ct-009--cash-transfer-above-balance-allowed-when-source-bank-overdraft-is-enabled) | ★ Cash Transfer above balance allowed when source bank overdraft is enabled | Cash transfer - overdraft | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [CT-010](#ct-010--print-journal-voucher-jv) | Print journal voucher (JV) | Voucher print | P2 | Regression | Manual | Active |  |
| [CT-011](#ct-011--cash-transfer-is-not-submitted-by-pressing-enter-key) | Cash Transfer is not submitted by pressing Enter key | Cash transfer - form validation | P3 | Regression | Auto-UI | Active |  |
| [CT-012](#ct-012--jv-numbering-continues-without-upper-limit) | JV numbering continues without upper limit | Voucher numbering | P3 | Regression | Manual | Review |  |
<!-- /generated:summary -->

## Test cases

### Cash transfer - same currency

#### ★ CT-001 · Transfer between MMK accounts; JV listed and both balances updated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Cash Transfer r5 (TC_CT_001) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. transfer from account =
   "[ Cash MMK ] Cash IN Hand - Facility"
2. Received in account =
   "[ Cash MMK ] Cash IN Hand - Golf"
3. Description =
   "For Maintainance cost"
4. Amount sent = "100000"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose [...MMK] in transfer from account.
3. Choose [...MMK] in Received in account.
4. Date will be today (default)
5. Fill the required fields.
6. Click "Submit" button

**Expected result:**

1. Transaction Added Successfully
2. JV (Journal Voucher) will be showed in Recent Transfers list
3. Cash and bank balance will be updated

**Check areas:**

1. Dashboard - Cash & Bank Account
2. Cash Transfer - recent 20
3. Cash & Bank Account
4. Report - Acc Statement report and acc detail , Transaction

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can transfer from account to account (MMK to MMK) | Cash Transfer r5 (TC_CT_001) | |
| 2 | Account type=Cash<->Bank | Cash Transfer r17 (TC_CT_013) |  |
| 3 | Date=Back date | Cash Transfer r18 (TC_CT_014) |  |

---

### Cash transfer - cross currency

#### ★ CT-002 · Cross-currency cash transfer with conversion rate; both balances updated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Cash Transfer r6 (TC_CT_002) |

**Preconditions:**

User needs  
to login the system first.  

**Test data:**

1. transfer from account =
   "[ Cash MMK ] Cash IN Hand - Estate Management"
2. Received in account =
   "[ Cash USD ] Cash In Hand - Golf"
3. Description =
   "Cash transfer from MMK to USD"
4. Amount Sent MMK = "300,0000.00"
5. Amount Received USD = "$100,0.00"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose [...MMK] in transfer from account.
3. Choose [...USD] in Received in account.
4. Date will be today (default)
5. Fill the required fields.
   (Amount Sent, Amount Received, Description)
6. Conversion rate will be automatically calculated.
7. Click "Submit" button

**Expected result:**

1. Transaction Added Successfully
2. JV (Journal Voucher) will be showed in Recent Transfers list
3. Cash and bank balance will be updated

**Check areas:**

1. Dashboard - Cash & Bank Account
2. Cash Transfer - recent 20
3. Cash & Bank Account
4. Report - Acc Statement report and acc detail , Transaction

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can transfer from account to account (MMK to other currency) | Cash Transfer r6 (TC_CT_002) | |
| 2 | From=USD; To=MMK | Cash Transfer r7 (TC_CT_003) |  |
| 3 | From=USD; To=EUR | Cash Transfer r8 (TC_CT_004) |  |

---

### Cash transfer - form validation

#### CT-003 · Required-field errors shown on Cash Transfer form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Cash Transfer r9 (TC_CT_005) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Date will be today (default)
3. Do not fill the required fields.
4. Click "Submit" button

**Expected result:**

1. Error messages will alert under
   required feild.

---

### Cash transfer - amount validation

#### CT-004 · Reject zero amount on Cash Transfer ("The selected Amount is invalid")

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Transfer r10 (TC_CT_006) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. transfer from account =
   "Cash In Hand - EM"
2. Received in account =
   "Cash In Bank - EM"
3. Description =
   "For Maintainance cost"
4. Amount sent = "0"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose one cash account in transfer from account.
3. Choose bank account in Received in account.
4. Date will be today (default)
5. Fill the required fields.
6. Click "Submit" button

**Expected result:**

1. "The selected Amount is invalid" alert will be shown

---

#### CT-005 · Negative amount cannot be entered on Cash Transfer form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Transfer r11 (TC_CT_007) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. transfer from account =
   "Cash In Hand - EM"
2. Received in account =
   "Cash In Bank - EM"
3. Description =
   "For Maintainance cost"
4. Amount sent = "-100"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose one cash account in transfer from account.
3. Choose bank account in Received in account.
4. Date will be today (default)
5. Fill the required fields.
6. Click "Submit" button

**Expected result:**

1. The system does not allow minus, so it does not appear in the field.

---

#### CT-006 · Reject Cash Transfer amount 99,999,999,999,999 (exceeds max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Transfer r12 (TC_CT_008) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. transfer from account =
   "Cash In Hand - EM"
2. Received in account =
   "Cash In Bank - EM"
3. Description =
   "For Maintainance cost"
4. Amount sent = "99999999999999.00"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose one cash account in transfer from account.
3. Choose bank account in Received in account.
4. Date will be today (default)
5. Fill the required fields.
6. Click "Submit" button

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

#### CT-007 · Cash Transfer with minimum amount 0.01 MMK succeeds

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI+API | Active | Cash Transfer r13 (TC_CT_009) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. transfer from account =
   "Cash In Hand - EM"
2. Received in account =
   "Cash In Bank - EM"
3. Description =
   "For Maintainance cost"
4. Amount sent = "0.01"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose one cash account in transfer from account.
3. Choose bank account in Received in account.
4. Date will be today (default)
5. Fill the required fields.
6. Click "Submit" button

**Expected result:**

1. Transaction Added Successfully.
2. JV (Journal Voucher) will be showed in Recent Transfers list
3. Cash and bank balance will be updated

**Check areas:**

1. Dashboard - Cash & Bank Account
2. Cash Transfer - recent 20
3. Cash & Bank Account
4. Report - Acc Statement report and acc detail , Transaction

---

### Cash transfer - balance check

#### ★ CT-008 · Block Cash Transfer exceeding source account balance (insufficient balance)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Cash Transfer r14 (TC_CT_010) |

**Preconditions:**

1. User needs to login the system first.
2. Amount sent must be greater than amount in trasnsferred from account

**Test data:**

1. transfer from account =
   "Cash In Bank - Banker"
2. Received in account =
   "Cash In Bank - Developer"
3. Description =
   "For Maintainance cost"
4. Amount sent = "1,000"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose [...MMK] in transfer from account.
3. Choose [...MMK] in Received in account.
4. Date will be today (default)
5. Fill the required fields.
6. Click "Submit" button

**Expected result:**

"Insufficient Balance" alert will be shown under amount sent  

---

### Cash transfer - overdraft

#### ★ CT-009 · Cash Transfer above balance allowed when source bank overdraft is enabled

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Cash Transfer r15 (TC_CT_011) |

**Preconditions:**

1. User needs
   to login the system first.
2. Account type is "Bank" and overdraft enable must be "Yes".
2. Amount sent must be greater than amount in trasnsferred from account

**Test data:**

1. transfer from account =
   "Cash In Bank - EM"
2. Received in account =
   "Cash In Bank - Developer"
3. Description =
   "For Maintainance cost"
4. Amount sent = "1,000,000"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose one bank account in transfer from account.
3. Choose one bank account in Received in account.
4. Date will be today (default)
5. Fill the required fields.
6. Click "Submit" button

**Expected result:**

1. Transaction Added Successfully.
2. JV (Journal Voucher) will be showed in Recent Transfers list
3. Cash and bank balance will be updated

**Check areas:**

1. Dashboard - Cash & Bank Account
2. Cash Transfer - recent 20
3. Cash & Bank Account
4. Report - Acc Statement report and acc detail , Transaction

---

### Voucher print

#### CT-010 · Print journal voucher (JV)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Manual — Physical print dialog | Active | Cash Transfer r16 (TC_CT_012) |

**Preconditions:**

User needs to login the system first.  

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Select one of the payment voucher.
3. Click "Manage" button
4. Click "Voucher" button

**Expected result:**

1. Voucher will be
   printed.

---

### Cash transfer - form validation

#### CT-011 · Cash Transfer is not submitted by pressing Enter key

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Cash Transfer r19 (TC_CT_015) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. transfer from account =
   "[ Cash MMK ] Cash IN Hand - Facility"
2. Received in account =
   "[ Cash MMK ] Cash IN Hand - Golf"
3. Description =
   "For Maintainance cost"
4. Amount sent = "100000"

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Choose [...MMK] in transfer from account.
3. Choose [...MMK] in Received in account.
4. Date will be today (default)
5. Fill the required fields.
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Cash Transfer function.  

---

### Voucher numbering

#### CT-012 · JV numbering continues without upper limit

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Manual — Expected not measurable as written (unbounded) | Review — "Unlimited" JV numbers is not verifiable; define numbering rule | Cash Transfer r20 (TC_CT_016) |

**Preconditions:**

1. User needs to login the system first.
2. You can only check when the number of created Cash Transfer is grearter than or equal to 6 digits.

**Steps:**

1. Click "Cash Transfer" from left menu.
2. Check if the Cash Transfer list is not showing.
3. Check the number count for Cash Transfer number

**Expected result:**

The system can generate an unlimited number for the Cash Transfer numbers.  

**Check areas:**

1. Dashboard - Cash & Bank Account
2. Cash Transfer - recent 20
3. Cash & Bank Account
4. Report - Acc Statement report and acc detail , Transaction

---
