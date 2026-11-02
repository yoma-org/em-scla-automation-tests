# 13 · Cash Outflow (PV)

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 13 (+4 data-variant rows)  
**Priority:** P1 4 · P2 6 · P3 3 · **★ Critical:** 4 · **Smoke:** 2 · **E2E:** 2 · **Auto:** 11 · **Manual:** 2 · **Review:** 2

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [CO-001](#-co-001--create-cash-outflow-pv-mmk-saved-as-draft-and-approver-notified) | ★ Create Cash Outflow PV (MMK) saved as draft and approver notified | Cash outflow - create | P1 | Smoke · Regression | Auto-UI+API | Active | 3 |
| [CO-002](#co-002--create-cash-outflow-at-amount-boundaries-max-142-digits-min-001) | Create Cash Outflow at amount boundaries (max 14+2 digits, min 0.01) | Cash outflow - amount validation | P2 | Regression | Auto-UI | Review | 2 |
| [CO-003](#co-003--reject-cash-outflow-amount-99999999999999-exceeds-max-limit) | Reject Cash Outflow amount 99,999,999,999,999 (exceeds max limit) | Cash outflow - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CO-004](#co-004--required-field-errors-shown-on-cash-outflow-form) | Required-field errors shown on Cash Outflow form | Cash outflow - form validation | P3 | Regression | Auto-UI | Active |  |
| [CO-005](#-co-005--block-cash-outflow-exceeding-withdraw-from-account-balance-insufficient-balance) | ★ Block Cash Outflow exceeding Withdraw-From account balance (insufficient balance) | Cash outflow - balance check | P1 | Regression | Auto-UI+API | Active | 2 |
| [CO-006](#co-006--reject-zero-amount-on-cash-outflow-the-selected-amount-is-invalid) | Reject zero amount on Cash Outflow ("The selected Amount is invalid") | Cash outflow - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CO-007](#co-007--negative-amount-cannot-be-entered-on-cash-outflow-form) | Negative amount cannot be entered on Cash Outflow form | Cash outflow - amount validation | P2 | Regression | Auto-UI | Active |  |
| [CO-008](#-co-008--cash-outflow-above-balance-allowed-when-bank-overdraft-is-enabled) | ★ Cash Outflow above balance allowed when bank overdraft is enabled | Cash outflow - overdraft | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [CO-009](#co-009--delete-a-draft-cash-outflow) | Delete a draft Cash Outflow | Cash outflow - delete | P2 | Regression | Auto-UI | Active |  |
| [CO-010](#-co-010--approve-cash-outflow-pv-in-recent-outflows-and-account-balance-reduced) | ★ Approve Cash Outflow; PV in Recent Outflows and account balance reduced | Cash outflow - approve | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [CO-011](#co-011--print-payment-voucher-pv) | Print payment voucher (PV) | Voucher print | P2 | Regression | Manual | Active |  |
| [CO-012](#co-012--cash-outflow-is-not-submitted-by-pressing-enter-key) | Cash Outflow is not submitted by pressing Enter key | Cash outflow - form validation | P3 | Regression | Auto-UI | Active |  |
| [CO-013](#co-013--pv-numbering-continues-without-upper-limit) | PV numbering continues without upper limit | Voucher numbering | P3 | Regression | Manual | Review |  |
<!-- /generated:summary -->

## Test cases

### Cash outflow - create

#### ★ CO-001 · Create Cash Outflow PV (MMK) saved as draft and approver notified

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active | Cash Outflow r5 (TC_CO_001) |

**Preconditions:**

1. User needs
   to login the system first.

**Test data:**

1. Payee = " Aung Kyaw"
2. Amount = "2,000.00"
3. Description = "to buy tissue"
4. Category = "Landscaping Expenses"
5. Withdraw from account =
   "[ Bank MMK ] Galaxy Tower 1 "

**Steps:**

1. Click "Cash Outflow" from left menu.
2. Fill the required fields.
3. Date will be today and currency will be MMK. (default)
4. Click "Submit" button

**Expected result:**

1. Cash Outflow (Payment Voucher) PV successfully saved as draft.
2. Notification will be sent to Approver

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Outflow - Recent 20
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transaction , Cash Outflow

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can make cash  outflow with MMK. | Cash Outflow r5 (TC_CO_001) | |
| 2 | Currency=USD | Cash Outflow r15 (TC_CO_011) |  |
| 3 | Date=Back date | Cash Outflow r19 (TC_CO_015) |  |

---

### Cash outflow - amount validation

#### CO-002 · Create Cash Outflow at amount boundaries (max 14+2 digits, min 0.01)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Expected mentions a Receipt Voucher in Cash Received list for a PV (copy error); "saved" vs draft unclear | Cash Outflow r6 (TC_CO_002) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Payee = " Wai Yan"
2. Amount = "12345678901234.56"
3. Description = "cash outflow"
4. Remark = " nov 12 cash outflow"

**Steps:**

1. Click "Cash Outflow" from left menu
2. Date will be today . (default)
3. Fill the required fields.
4. Click "Submit" button

**Expected result:**

1. Cash Outflow (Payment Voucher) PV successfully saved in system.
2. Receipt Voucher for payer will be shown in the Cash Received(RV) list.

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Outflow - Recent 20
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transaction , Cash Outflow

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can record the maximum amount payment with 14 integers and 2 points | Cash Outflow r6 (TC_CO_002) | |
| 2 | Amount=0.01 (min) | Cash Outflow r8 (TC_CO_004) | Review; Expected mentions RV in Cash Received list for a PV (copy error) |

---

#### CO-003 · Reject Cash Outflow amount 99,999,999,999,999 (exceeds max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Outflow r7 (TC_CO_003) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Payee = " Wai Yan"
2. Amount = "99999999999999.00"
3. Description = "cash outflow"
4. Remark = " nov 12 cash outflow"

**Steps:**

1. Click "Cash Outflow" from left menu
2. Date will be today . (default)
3. Fill the required fields.
4. Click "Submit" button

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

### Cash outflow - form validation

#### CO-004 · Required-field errors shown on Cash Outflow form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Cash Outflow r9 (TC_CO_005) |

**Preconditions:**

1. User needs
   to login the system first.

**Steps:**

1. Click "Cash Outflow" from left menu.
2. Do not fill the required fields.
3. Date will be today and currency will be MMK. (default)
4. Click "Submit" button

**Expected result:**

Error message will alert  

---

### Cash outflow - balance check

#### ★ CO-005 · Block Cash Outflow exceeding Withdraw-From account balance (insufficient balance)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Cash Outflow r10 (TC_CO_006) |

**Preconditions:**

1. User needs to login the system first.
2. Amount must be greater than the amount in "Withdraw From" account

**Test data:**

1. Payee = "Min Min"
2. Amount = "10,000,000,000,000,000"
3. Description = "to buy tissue"
4. Category = "C Villa - Finance Cost"
5. Withdraw from account =
   "[ Cash MMK] Cash IN Hand - City Loft"

**Steps:**

1. Click "Cash Outflow" from left menu.
2. Fill the required fields.
3. Date will be today and currency will be MMK. (default)
4. Click "Submit" button

**Expected result:**

"Insufficient Balance in  
'Withdraw From' Account"  
will be shown under the amount  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Error message alert for amount is greater than "Withdraw From" Cash account | Cash Outflow r10 (TC_CO_006) | |
| 2 | Withdraw-from=Bank account (message "Insufficient Balance") | Cash Outflow r13 (TC_CO_009) |  |

---

### Cash outflow - amount validation

#### CO-006 · Reject zero amount on Cash Outflow ("The selected Amount is invalid")

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Outflow r11 (TC_CO_007) |

**Preconditions:**

1. User needs
   to login the system first.

**Test data:**

1. Payee = " Soe Moe"
2. Amount = "0.00"
3. Description = "to buy tissue"
4. Category = "Landscaping Expenses"
5. Withdraw from account =
   "[ Bank MMK ] Galaxy Tower 1 "

**Steps:**

1. Click "Cash Outflow" from left menu.
2. Fill the required fields.
3. Date will be today and currency will be MMK. (default)
4. Click "Submit" button

**Expected result:**

"The selected Amount is invalid.  
" alert will be shown  

---

#### CO-007 · Negative amount cannot be entered on Cash Outflow form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Outflow r12 (TC_CO_008) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Payee = " Wai Yan "
2. Amount = "-100.00"
3. Description = "to buy tissue"
4. Remark = " oct 19 cash outflow"

**Steps:**

1. Click "Cash Outflow" from left menu
2. Date will be today . (default)
3. Fill the required fields.
4. Click "Submit" button

**Expected result:**

The system does not allow minus, so it does not appear in the  
field  

---

### Cash outflow - overdraft

#### ★ CO-008 · Cash Outflow above balance allowed when bank overdraft is enabled

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Cash Outflow r14 (TC_CO_010) |

**Preconditions:**

1. User needs to login the system first.
2. Account type is "Bank" and overdraft enable must be "Yes".
2. Amount sent must be greater than amount in withdraw from account

**Test data:**

1. Payee = " Aung Kyaw"
2. Amount = "200,000.00"
3. Description = "to buy tissue"
4. Category = "Landscaping Expenses"
5. Withdraw from account =
   "[ Bank MMK ] Galaxy Tower 1 "

**Steps:**

1. Click "Cash Outflow" from left menu.
2. Fill the required fields.
3. Date will be today and currency will be MMK. (default)
4. Click "Submit" button

**Expected result:**

1. Transaction Added Successfully.
2. PV (Receipt Voucher) will be showed in Recent PV list
3. Cash and bank balance will be updated

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Outflow - Recent 20
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transaction , Cash Outflow

---

### Cash outflow - delete

#### CO-009 · Delete a draft Cash Outflow

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash Outflow r16 (TC_CO_012) |

**Preconditions:**

1. User needs
   to login the system first and must
   have the permission.  

**Steps:**

1. Click "PV"on the top
2. Choose one of the cash outflow.
3. Click "manage" button
4. Check the cash outflow draft
5. Click "delete" button

**Expected result:**

" Cash Outflow has been deleted successfully " alert will be shown  

---

### Cash outflow - approve

#### ★ CO-010 · Approve Cash Outflow; PV in Recent Outflows and account balance reduced

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Cash Outflow r17 (TC_CO_013) |

**Preconditions:**

1. User needs
   to login the system first and must
   have the permission.  

**Steps:**

1. Click "PV"on the top
2. Choose one of the cash outflow.
3. Click "manage" button
4. Check the cash outflow draft
5. Click "Approve" button

**Expected result:**

1. Cash Outflow approved
2. PV (Payment Voucher) will show in the Recent Outflows List
3. Amount from withdraw from account will be substracted and updted.

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Outflow - Recent 20
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transaction , Cash Outflow

---

### Voucher print

#### CO-011 · Print payment voucher (PV)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Manual — Physical print dialog | Active | Cash Outflow r18 (TC_CO_014) |

**Preconditions:**

1. User needs to
   login the system first

**Steps:**

1. Click "Cash Outflow" from left menu.
2. Select one of the payment voucher.
3. Click "Manage" button
4. Click "Voucher" button

**Expected result:**

1. Voucher will be
   printed.

---

### Cash outflow - form validation

#### CO-012 · Cash Outflow is not submitted by pressing Enter key

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Cash Outflow r20 (TC_CO_016) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Payee = " Aung Kyaw"
2. Amount = "2,000.00"
3. Description = "to buy tissue"
4. Category = "Landscaping Expenses"
5. Withdraw from account =
   "[ Bank MMK ] Galaxy Tower 1 "

**Steps:**

1. Click "Cash Outflow" from left menu.
2. Fill the required fields.
3. Date will be today and currency will be MMK. (default)
4. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Cash Outflow function.  

---

### Voucher numbering

#### CO-013 · PV numbering continues without upper limit

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Manual — Expected not measurable as written (unbounded) | Review — "Unlimited" PV numbers is not verifiable; define numbering rule | Cash Outflow r21 (TC_CO_017) |

**Preconditions:**

1. User needs to login the system first.
2. You can only check when the number of created Cash Outflow is greater than or equal to 6 digits.

**Steps:**

1. Click "Cash Outflow" from left menu.
2. Check if the Cash Outflow list is not showing.
3. Check the number count of Cash Outflow number

**Expected result:**

The system can generate an unlimited number for Cash Outflow numbers.  

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash
2. Cash Outflow - Recent 20
3. Cash & Bank Account
4. Report - Acc statement report and account detail , Transaction , Cash Outflow

---
