# 11 · Cash Received (RV / Unknown / Funding)

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 13 (+6 data-variant rows)  
**Priority:** P1 3 · P2 7 · P3 3 · **★ Critical:** 3 · **Smoke:** 2 · **E2E:** 3 · **Auto:** 11 · **Manual:** 2 · **Review:** 2

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [CR-001](#cr-001--recent-receipts-shows-last-20-rvs-in-serial-order) | Recent Receipts shows last 20 RVs in serial order | Recent receipts | P2 | Regression | Auto-UI | Active |  |
| [CR-002](#-cr-002--record-unknown-received-mmk-rv-listed-for-allocation-and-account-balance-increases) | ★ Record Unknown Received (MMK); RV listed for allocation and account balance increases | Unknown received - record | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 4 |
| [CR-003](#cr-003--unknown-received-is-not-submitted-by-pressing-enter-key) | Unknown Received is not submitted by pressing Enter key | Cash received - form validation | P3 | Regression | Auto-UI | Active | 2 |
| [CR-004](#-cr-004--record-funding-received-mmk-rv-in-recent-receipts-and-account-balance-increases) | ★ Record Funding Received (MMK); RV in Recent Receipts and account balance increases | Funding received - record | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 2 |
| [CR-005](#cr-005--required-field-errors-shown-on-unknownfunding-received-form) | Required-field errors shown on Unknown/Funding Received form | Cash received - form validation | P3 | Regression | Auto-UI | Active |  |
| [CR-006](#cr-006--record-unknownfunding-received-at-amount-boundaries-max-142-digits-min-001) | Record Unknown/Funding Received at amount boundaries (max 14+2 digits, min 0.01) | Cash received - amount validation | P2 | E2E · Regression | Auto-UI+API | Active | 2 |
| [CR-007](#cr-007--reject-cash-received-amount-99999999999999-exceeds-max-limit) | Reject Cash Received amount 99,999,999,999,999 (exceeds max limit) | Cash received - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CR-008](#cr-008--reject-zero-amount-on-unknownfunding-received-invalid-amount) | Reject zero amount on Unknown/Funding Received ("Invalid amount") | Cash received - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CR-009](#cr-009--negative-amount-cannot-be-entered-on-cash-received-form) | Negative amount cannot be entered on Cash Received form | Cash received - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CR-010](#-cr-010--identify-unknown-received-rv-to-a-payer-with-category) | ★ Identify Unknown Received RV to a payer with category | Unknown RV assign - payer | P1 | Regression | Auto-UI+API | Active |  |
| [CR-011](#cr-011--print-receipt-voucher-rv) | Print receipt voucher (RV) | Voucher print | P2 | Regression | Manual | Active |  |
| [CR-012](#cr-012--rv-numbering-continues-without-upper-limit) | RV numbering continues without upper limit | Voucher numbering | P3 | Regression | Manual | Review |  |
| [CR-013](#cr-013--update-payment-methodstatus-of-a-cheque-receipt-in-recent-receipts) | Update payment method/status of a Cheque receipt in Recent Receipts | Recent receipts | P2 | Regression | Auto-UI | Review |  |
<!-- /generated:summary -->

## Test cases

### Recent receipts

#### CR-001 · Recent Receipts shows last 20 RVs in serial order

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Received r5 (TC_CR_001) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Unknown Received" and Click "Recent Receipts".

**Expected result:**

1. Last 20 Receipt Voucher number will be shown in serial number.

---

### Unknown received - record

#### ★ CR-002 · Record Unknown Received (MMK); RV listed for allocation and account balance increases

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Cash Received r6 (TC_CR_002) |

**Preconditions:**

1. User need to login
   the System first.

**Test data:**

1. Amount = "10,000.00"
2. Deposite in =
   "[ Cash MMK] 2C2P Account"
3. Location =" MO Zone A/B"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Unknown Received".
3. Date will be today and currency will be MMK by default.
4. Fill required data.
5. Click "Submit" button.

**Expected result:**

1. Receipt Voucher for Unknown received will be shown in the Unknown Received Allocation
2. Receipt Voucher number will be serial number
3. In deposit in account, amount will be added and updated.

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Received - Recent Receipt , Unknown Received Allocation
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transactions , Cash Received

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) For Unknown Received, User can record the received amount with MMK. | Cash Received r6 (TC_CR_002) | |
| 2 | Currency=USD | Cash Received r7 (TC_CR_003) |  |
| 3 | Type=Unknown/Funding; Currency=USD; Amount=12.58 | Cash Received r18 (TC_CR_014) |  |
| 4 | Type=Unknown/Funding; Date=Back date | Cash Received r31 (TC_CR_027) |  |

---

### Cash received - form validation

#### CR-003 · Unknown Received is not submitted by pressing Enter key

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Cash Received r8 (TC_CR_004) |

**Preconditions:**

1. User need to login
   the System first.

**Test data:**

1. Amount = "10,000.00"
2. Deposite in =
   "[ Cash MMK] 2C2P Account"
3. Location =" MO Zone A/B"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Unknown Received".
3. Date will be today and currency will be MMK default.
4. Fill required data.
5. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create RV function.  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't create Unknown Received by clicking the "Enter" button on the keyboard. | Cash Received r8 (TC_CR_004) | |
| 2 | Type=Funding Received | Cash Received r11 (TC_CR_007) |  |

---

### Funding received - record

#### ★ CR-004 · Record Funding Received (MMK); RV in Recent Receipts and account balance increases

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Cash Received r9 (TC_CR_005) |

**Preconditions:**

1. User need to login
   the System first.
2. At least one funding status category must have

**Test data:**

1. payer = "May Myat Thu "
2. Amount = "100000"
3. Categories = "others - EM"
4. Deposit in account =
   "[ Cash MMK ] Cash In Hand - CIty Loft"
5. Location = "MO - Zone A/B"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Funding Received" Tab.
3. Enter the payer name.
4. Date will be today and Currency will be MMK. (default)
5. Fill the required data.
6. Fill the Remark. (Optional)
7. Click "Submit" button.

**Expected result:**

1. Transaction for Inter Company (Receipt Voucher) will be shown in the Recent Receipt list.
2. In deposit in account, amount will be added and updated.

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Received - Recent Receipt
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transactions , Cash Received

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can record the received amount for Funding Received. | Cash Received r9 (TC_CR_005) | |
| 2 | Currency=USD | Cash Received r10 (TC_CR_006) |  |

---

### Cash received - form validation

#### CR-005 · Required-field errors shown on Unknown/Funding Received form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Cash Received r12 (TC_CR_008) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Unknown Received / Funding Received" Tab.
3. Fill the Date. (System will show today date by default.)
4. Select the currency. (MMK is default.)
5. Do not fill the received amount.
6. Do not select the Account to Deposit in.
7. Do not select the Location.
8. Fill the Remark. (Optional)
9. Click "Submit" button.

**Expected result:**

1. Error Message will be show for not entering the required field in Unknown Received form.

---

### Cash received - amount validation

#### CR-006 · Record Unknown/Funding Received at amount boundaries (max 14+2 digits, min 0.01)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI+API | Active | Cash Received r13 (TC_CR_009) |

**Preconditions:**

1. User need to login
   the System first.

**Test data:**

1. Amount = "12,345,678,901,234.56"
2. Deposite in = "[ Cash MMK ] 2C2P Account"
3. Location = "MO - Zone A/B"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Unknown Received / Funding Received".
3. Date will be today and currency will be today default.
4. Fill required data.
5. Click "Submit" button.

**Expected result:**

1. Receipt Voucher for Unknown cash received will be shown in the Unknown Received Allocation
2. Receipt Voucher number will be serial number
3. In deposit in account, amount will be added and upadted.

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Received - Recent Receipt , Unknown Received Allocation
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transactions , Cash Received

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) For Unknown Received, User can record the received maxium received with 14 integers and 2 points | Cash Received r13 (TC_CR_009) | |
| 2 | Amount=0.01 (min) | Cash Received r14 (TC_CR_010) |  |

---

#### CR-007 · Reject Cash Received amount 99,999,999,999,999 (exceeds max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Received r15 (TC_CR_011) |

**Preconditions:**

1. User need to login
   the System first.

**Test data:**

1. Amount = "99,999,999,999,999"
2. Deposite in =
   "[ Cash MMK] 2C2P Account"
3. Location =" MO Zone A/B"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Unknown Received" / "Funding Received"
3. Date will be today and currency will be MMK default.
4. Fill required data.
5. Click "Submit" button.

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

#### CR-008 · Reject zero amount on Unknown/Funding Received ("Invalid amount")

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Received r16 (TC_CR_012) |

**Preconditions:**

1. User need to login
   the System first.

**Test data:**

1. Amount = "0.00"
2. Deposite in = "[ Cash MMK ] 2C2P Account"
3. Location = "MO - Zone A/B"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Unknown Received / Funding Received".
3. Date will be today and currency will be MMK default.
4. Fill required data.
5. Click "Submit" button.

**Expected result:**

"Invalid amount" alert will be shown  

---

#### CR-009 · Negative amount cannot be entered on Cash Received form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Received r17 (TC_CR_013) |

**Preconditions:**

1. User need to login
   the System first.

**Test data:**

1. Amount = "-10,000.00"
2. Deposite in =
   "[ Cash MMK] 2C2P Account"
3. Location =" MO Zone A/B"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Select "Unknown Received / funding Received".
3. Date will be today and currency will be today default.
4. Fill required data.
5. Click "Submit" button.

**Expected result:**

The system does not allow minus,so it does not appear in the feild  

---

### Unknown RV assign - payer

#### ★ CR-010 · Identify Unknown Received RV to a payer with category

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Cash Received r19 (TC_CR_015) |

**Preconditions:**

Receipt for unknown cash receipt has been already created.  

**Test data:**

1. Payer = "U Thein"
2. Categories = "Estate Mgmt Fees"

**Steps:**

1. Click "Cash Received" from Left Menu.
2. Click "Unknown Received".
3. Click "Unknown Received Allocation".
4. Choose one of the unknown payment and click "Manage" button.
5. In unknown payment form, unknown amount will be seen.
6. Fill in Payer name.
7. Select the Category.
8. Fill the Remark.(Optional)
9. Click "Confirm" button

**Expected result:**

1. The record from unknown received will be seen with payer name in the Recent Receipts

**Check areas:**

1. Cash Received - Recent Receipt , Unknown Received Allocation
2. Report - Acc statement detail , Transactions , Cash Received

---

### Voucher print

#### CR-011 · Print receipt voucher (RV)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Manual — Physical print dialog | Active | Cash Received r30 (TC_CR_026) |

**Preconditions:**

At least one receipt voucher has been already created.  

**Steps:**

1. One of the receip vouchers in Inter Company or Unknown Receipt list is selected.
2. Click "Manage" button.
3. Click "Print Voucher" button.

**Expected result:**

1. Voucher can be printed.

---

### Voucher numbering

#### CR-012 · RV numbering continues without upper limit

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Manual — Expected not measurable as written (unbounded) | Review — "Unlimited" RV numbers is not verifiable; define numbering format/sequence rule | Cash Received r32 (TC_CR_028) |

**Preconditions:**

1. User need to login the System first.
2. You can only check when the number of created RV is greater than or equal to the 6 digits.

**Steps:**

1. Click "Cash Received" from Left Menu
2. Select "Unknown Received" and Click "Recent Receipts". (or)
3. Select "Unknown Received".
4. Check the count of the RV number.

**Expected result:**

The system can generate an unlimited number for RV numbers.  

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Received - Recent Receipt , Unknown Received Allocation
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transactions , Cash Received

---

### Recent receipts

#### CR-013 · Update payment method/status of a Cheque receipt in Recent Receipts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Title says change status, steps change Payment Method; no data or target status given | Cash Received r33 (TC_CR_029) |

**Preconditions:**

At least one receipt voucher which payment method is 'Cheque' has been already created.  

**Steps:**

1. One of the receip vouchers in Recent Receipt is selected.
2. Click "Manage" button.
3. Change the "Payment Method".
4. Click "Submit" button.

**Expected result:**

The Status of the created RV is changed to the updated value.  

**Check areas:**

1. Cash Received - Recent Receipt
2. Report - Transactions , Cash Received

---
