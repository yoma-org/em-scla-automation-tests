# 17 · Deposit

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 25 (+4 data-variant rows)  
**Priority:** P1 6 · P2 10 · P3 9 · **★ Critical:** 6 · **Smoke:** 3 · **E2E:** 3 · **Auto:** 25 · **Manual:** 0 · **Review:** 1

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [DEP-001](#-dep-001--add-deposit-mmk-cash--deposit-balance-increases-and-rv-issued) | ★ Add deposit (MMK, cash) — deposit balance increases and RV issued | Add deposit | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 3 |
| [DEP-002](#dep-002--cannot-add-deposit-with-0-amount) | Cannot add deposit with 0 amount | Add deposit | P2 | Regression | Auto-UI | Active |  |
| [DEP-003](#dep-003--add-deposit-amount-field-rejects-minus-sign) | Add deposit amount field rejects minus sign | Add deposit | P3 | Regression | Auto-UI | Active |  |
| [DEP-004](#dep-004--add-deposit-without-required-fields-shows-validation-errors) | Add deposit without required fields shows validation errors | Add deposit | P3 | Regression | Auto-UI | Active |  |
| [DEP-005](#dep-005--cannot-add-deposit-amount-9999999999999900-over-max-limit) | Cannot add deposit amount 99999999999999.00 (over max limit) | Add deposit | P3 | Regression | Auto-UI | Active |  |
| [DEP-006](#dep-006--view-deposit-invoice) | View deposit invoice | Deposit invoice | P2 | Regression | Auto-UI | Active |  |
| [DEP-007](#-dep-007--add-deposit-invoice-unit-x-gross-price--saved-as-draft-and-sent-for-approval) | ★ Add deposit invoice (unit x gross price) — saved as draft and sent for approval | Deposit invoice | P1 | Regression | Auto-UI+API | Active |  |
| [DEP-008](#dep-008--cannot-add-deposit-invoice-with-0-unit-and-0-gross-price) | Cannot add deposit invoice with 0 unit and 0 gross price | Deposit invoice | P2 | Regression | Auto-UI | Active |  |
| [DEP-009](#dep-009--deposit-invoice-unitgross-price-fields-reject-minus-sign) | Deposit invoice unit/gross price fields reject minus sign | Deposit invoice | P3 | Regression | Auto-UI | Active |  |
| [DEP-010](#dep-010--pressing-enter-key-does-not-submit-add-deposit-form) | Pressing Enter key does not submit Add Deposit form | Add deposit | P3 | Regression | Auto-UI | Active |  |
| [DEP-011](#dep-011--delete-draft-deposit-invoice) | Delete draft deposit invoice | Deposit invoice | P2 | Regression | Auto-UI | Active |  |
| [DEP-012](#-dep-012--approve-deposit-invoice--di-approved-and-printable) | ★ Approve deposit invoice — DI approved and printable | Deposit invoice | P1 | Smoke · Regression | Auto-UI+API | Active |  |
| [DEP-013](#-dep-013--withdraw-deposit--pv-saved-as-draft-and-sent-for-approval) | ★ Withdraw deposit — PV saved as draft and sent for approval | Withdraw deposit | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [DEP-014](#dep-014--withdraw-deposit-without-withdraw-from-account-shows-required-error) | Withdraw deposit without withdraw-from account shows required error | Withdraw deposit | P3 | Regression | Auto-UI | Active |  |
| [DEP-015](#dep-015--withdraw-deposit-amount-field-rejects-minus-sign) | Withdraw deposit amount field rejects minus sign | Withdraw deposit | P3 | Regression | Auto-UI | Active |  |
| [DEP-016](#dep-016--cannot-withdraw-deposit-with-0-amount) | Cannot withdraw deposit with 0 amount | Withdraw deposit | P2 | Regression | Auto-UI | Active |  |
| [DEP-017](#dep-017--cannot-withdraw-more-than-withdraw-from-account-balance) | Cannot withdraw more than withdraw-from account balance | Withdraw deposit | P2 | Regression | Auto-UI | Active |  |
| [DEP-018](#dep-018--cannot-withdraw-more-than-available-balance) | Cannot withdraw more than available balance | Withdraw deposit | P2 | Regression | Auto-UI | Review |  |
| [DEP-019](#dep-019--cannot-withdraw-amount-9999999999999900-over-max-limit) | Cannot withdraw amount 99999999999999.00 (over max limit) | Withdraw deposit | P3 | Regression | Auto-UI | Active |  |
| [DEP-020](#dep-020--pressing-enter-key-does-not-submit-withdraw-deposit-form) | Pressing Enter key does not submit Withdraw Deposit form | Withdraw deposit | P3 | Regression | Auto-UI | Active |  |
| [DEP-021](#dep-021--delete-draft-withdraw-deposit-pv) | Delete draft withdraw deposit PV | Withdraw deposit | P2 | Regression | Auto-UI | Active |  |
| [DEP-022](#-dep-022--approve-withdraw-deposit--deposit-balance-reduced-and-pv-in-cash-outflow) | ★ Approve withdraw deposit — deposit balance reduced and PV in Cash Outflow | Withdraw deposit | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [DEP-023](#dep-023--filter-deposit-transactions-by-month-and-currency) | Filter deposit transactions by month and currency | Deposit statement | P2 | Regression | Auto-UI | Active |  |
| [DEP-024](#-dep-024--deposit-ob-of-upcoming-month-equals-current-deposit-balance) | ★ Deposit OB of upcoming month equals current deposit balance | Deposit statement | P1 | Regression | Auto-UI+API | Active |  |
| [DEP-025](#dep-025--deposit-transaction-pdf-for-selected-month-and-currency) | Deposit transaction PDF for selected month and currency | Deposit statement | P2 | Regression | Auto-UI+API | Active |  |
<!-- /generated:summary -->

## Test cases

### Add deposit

#### ★ DEP-001 · Add deposit (MMK, cash) — deposit balance increases and RV issued

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active — Remark "x" in source unexplained; no approval required for Add Deposit (GT remark) | Deposit r5 (TC_Deposit_001) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment

**Test data:**

1. Payment method = "Cash"
2. Account to received in = "[ Cash MMK ] Cash In Hand - Facility"
3. Location = " MO - Zone A/B"
4. Amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Add Deposit" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Fill the remark. (optional)
7. Click "Confirm" button.

**Expected result:**

1. Received amount will be added to deposit current balance.
2. Receipt Voucher ( Deposit Received) will be shown.

**Check areas:**

1. Dashboard - Cash & Bank account , net cash , deposit
2. Cash Received - Recent Receipt
3. apartment - Deposit
4. Cash & Bank Account
5. Report - Acc statement report and detail , transactions , cash received

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can add deposit | Deposit r5 (TC_Deposit_001) | |
| 2 | Amount=0.01 (minimum) | Deposit r9 (TC_Deposit_005) |  |
| 3 | Amount=12345678901234.56 (maximum) | Deposit r10 (TC_Deposit_006) |  |

---

#### DEP-002 · Cannot add deposit with 0 amount

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Deposit r6 (TC_Deposit_002) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment

**Test data:**

1. Payment method = "Cash"
2. Account to received in = "[ Cash MMK ] Cash In Hand - Facility"
3. Location = " MO - Zone A/B"
4. Amount = "0"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Add Deposit" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Fill the remark. (optional)
7. Click "Confirm" button.

**Expected result:**

1. "Invalid amount" alert box will be
   shown

---

#### DEP-003 · Add deposit amount field rejects minus sign

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Deposit r7 (TC_Deposit_003) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment

**Test data:**

1. Payment method = "Cash"
2. Account to received in = "[ Cash MMK ] Cash In Hand - Facility"
3. Location = " MO - Zone A/B"
4. Amount = "-100"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Add Deposit" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Fill the remark. (optional)
7. Click "Confirm" button.

**Expected result:**

The system does not allow minus,so it does not appear in the feild  

---

#### DEP-004 · Add deposit without required fields shows validation errors

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Deposit r8 (TC_Deposit_004) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Add Deposit" button.
4. Select currency (MMK is default).
5. Do not fill the required fields
6. Fill the remark. (optional)
7. Click "Confirm" button.

**Expected result:**

Error message will alert for not  
filling the fields in the add deposit form.  

---

#### DEP-005 · Cannot add deposit amount 99999999999999.00 (over max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Deposit r11 (TC_Deposit_007) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment

**Test data:**

1. Payment method = "Cash"
2. Account to received in = "[ Cash MMK ] Cash In Hand - Facility"
3. Location = " MO - Zone A/B"
4. Amount = "99999999999999.00"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Add Deposit" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Fill the remark. (optional)
7. Click "Confirm" button.

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

### Deposit invoice

#### DEP-006 · View deposit invoice

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Deposit r13 (TC_Deposit_008) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Deposit Invoice" button.
4. Choose one of the deposit invoice.
5. Click "View" button

**Expected result:**

Deposit Invoice will be shown  

---

#### ★ DEP-007 · Add deposit invoice (unit x gross price) — saved as draft and sent for approval

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Deposit r14 (TC_Deposit_009) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Item Description = "Cleaning Fees"
2. Unit = "2"
3. Gros price = "1500"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Deposit Invoice" button.
4. Click "Add Deposit Invoice" button.
5. Fill the require fields.
6. Total is unit and gross price multiplied
7. Click "Save" button

**Expected result:**

1. The recorded deposit invoice (DI) will be saved as draft.
2. Notification will be sent to approver.

**Check areas:**

1. Apartment - Depost > Deposti Invoice

---

#### DEP-008 · Cannot add deposit invoice with 0 unit and 0 gross price

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Deposit r15 (TC_Deposit_010) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Item Description = "Cleaning Fees"
2. Unit = "0"
3. Gros price = "0"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Deposit Invoice" button.
4. Click "Add Deposit Invoice" button.
5. Fill the require fields.
6. Total is unit and gross price multiplied
7. Click "Save" button

**Expected result:**

1. "The selected items.0.quantity / unit_price is invalid." alert box will be
   shown

---

#### DEP-009 · Deposit invoice unit/gross price fields reject minus sign

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Deposit r16 (TC_Deposit_011) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Item Description = "Cleaning Fees"
2. Unit = "-2"
3. Gros price = "-1500"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Deposit Invoice" button.
4. Click "Add Deposit Invoice" button.
5. Fill the require fields.
6. Total is unit and gross price multiplied
7. Click "Save" button

**Expected result:**

The system does not allow minus,so it does not appear in the feild  

---

### Add deposit

#### DEP-010 · Pressing Enter key does not submit Add Deposit form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Deposit r17 (TC_Deposit_012) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment

**Test data:**

1. Payment method = "Cash"
2. Account to received in = "[ Cash MMK ] Cash In Hand - Facility"
3. Location = " MO - Zone A/B"
4. Amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Add Deposit" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Fill the remark. (optional)
7. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Add Deposit function.  

---

### Deposit invoice

#### DEP-011 · Delete draft deposit invoice

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Steps copy-pasted from PV flow ("cash outflow draft") | Deposit r18 (TC_Deposit_013) |

**Preconditions:**

1. User must have the permission

**Steps:**

1. Click "DI"on the top
2. Choose one of the payment.
3. Click "manage" button
4. Check the cash outflow draft
5. Click "delete" button

**Expected result:**

1. " Deposit Invoice has been deleted successfully "

---

#### ★ DEP-012 · Approve deposit invoice — DI approved and printable

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active — Steps mention "cash outflow draft" (copy-paste); "will be printed" unclear | Deposit r19 (TC_Deposit_014) |

**Preconditions:**

1. User must have the permission

**Steps:**

1. Click "DI"on the top
2. Choose one of the payment.
3. Click "manage" button
4. Check the cash outflow draft
5. Click "Approve" button

**Expected result:**

1. Invoice approved successfully
2. deposit invoice will be printed

**Check areas:**

1. Apartment - Depost > Deposti Invoice

---

### Withdraw deposit

#### ★ DEP-013 · Withdraw deposit — PV saved as draft and sent for approval

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Deposit r21 (TC_Deposit_015) |

**Preconditions:**

1. User needs to login the system first.
2. Withdrawers needs to own apartment

**Test data:**

1. account for withdraw from =
   "[ YOMA Bank MMK ] Zone B2 (000 110 215 500 486)"
2. amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Withdraw Deposit" button.
4. Select currency (MMK is default).
5. Select account for withdraw from.
6. Fill the amount
9. Fill the remark. (optional)
10. Click "Confirm" button.

**Expected result:**

1. The recorded payment vouchcer (PV) will be saved as draft.
2. Notification will be sent to approver.

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash , Deposit
2. Cash Outflow - recent 20
3. Apartment - Deposit
4. Cash & Bank Account
5. Report - Acc statement report and detail , transaction , Cash Outflow

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can withdraw deposit | Deposit r21 (TC_Deposit_015) | |
| 2 | Amount=0.1 (minimum) | Deposit r27 (TC_Deposit_021) |  |
| 3 | Amount=12345678901234.56 (maximum) | Deposit r28 (TC_Deposit_022) | Source title says "add deposit" but steps are Withdraw |

---

#### DEP-014 · Withdraw deposit without withdraw-from account shows required error

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Deposit r22 (TC_Deposit_016) |

**Preconditions:**

1. User needs to login the system first.
2. Withdrawers needs to own apartment

**Test data:**

1. amount = 100000

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Withdraw Deposit" button.
4. Select currency (MMK is default).
5. Do not choose account for withdraw from.
6. Fill the amount
9. Fill the remark. (optional)
10. Click "Confirm" button.

**Expected result:**

1. "Account is required" alert
   box will be shown

---

#### DEP-015 · Withdraw deposit amount field rejects minus sign

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Deposit r23 (TC_Deposit_017) |

**Preconditions:**

1. User needs to login the system first.
2. Withdrawers needs to own apartment

**Test data:**

1. account for withdraw from
2. amount

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Withdraw Deposit" button.
4. Select currency (MMK is default).
5. Select account for withdraw from.
6. Fill minus value in the amount
9. Fill the remark. (optional)
10. Click "Confirm" button.

**Expected result:**

The system does not allow minus,so it does not appear in the feild  

---

#### DEP-016 · Cannot withdraw deposit with 0 amount

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Deposit r24 (TC_Deposit_018) |

**Preconditions:**

1. User needs to login the system first.
2. Withdrawers needs to own apartment

**Test data:**

1. account for withdraw from
2. amount

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Withdraw Deposit" button.
4. Select currency (MMK is default).
5. Select account for withdraw from.
6. Fill 000 in the amount
9. Fill the remark. (optional)
10. Click "Confirm" button.

**Expected result:**

1. "The selected Amount is invalid." alert box will be
   shown

---

#### DEP-017 · Cannot withdraw more than withdraw-from account balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Deposit r25 (TC_Deposit_019) |

**Preconditions:**

1. User needs to login the system first.
2. Withdrawers needs to own apartment

**Test data:**

1. withdraw from account
2. amount

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Withdraw Deposit" button.
4. Select currency (MMK is default).
5. Select account for withdraw from.
6. Fill amount which is greater than amount in the withdraw from account
9. Fill the remark. (optional)
10. Click "Confirm" button.

**Expected result:**

1. "Insufficient balance in withdraw from account" alert box will be shown

---

#### DEP-018 · Cannot withdraw more than available balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Ambiguous which balance ("amount in account") vs Deposit#25; expected numbered "2." only | Deposit r26 (TC_Deposit_020) |

**Preconditions:**

1. User needs to login the system first.
2. Withdrawers needs to own apartment

**Test data:**

1. withdraw from account
2. amount

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Withdraw Deposit" button.
4. Select currency (MMK is default).
5. Select account for withdraw from.
6. Fill amount which is greater than amount in account
9. Fill the remark. (optional)
10. Click "Confirm" button.

**Expected result:**

2. "Invalid Amount" alert will be shown under the amount text box

---

#### DEP-019 · Cannot withdraw amount 99999999999999.00 (over max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active — Source title says "add amount" but steps are Withdraw | Deposit r29 (TC_Deposit_023) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment

**Test data:**

1. account for withdraw from =
   "[ YOMA Bank MMK ] Zone B2 (000 110 215 500 486)"
2. amount = "99999999999999.00"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Withdraw Deposit" button.
4. Select currency (MMK is default).
5. Select account for withdraw from.
6. Fill the amount
9. Fill the remark. (optional)
10. Click "Confirm" button.

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

#### DEP-020 · Pressing Enter key does not submit Withdraw Deposit form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Deposit r30 (TC_Deposit_024) |

**Preconditions:**

1. User needs to login the system first.
2. Withdrawers needs to own apartment

**Test data:**

1. account for withdraw from =
   "[ YOMA Bank MMK ] Zone B2 (000 110 215 500 486)"
2. amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "Withdraw Deposit" button.
4. Select currency (MMK is default).
5. Select account for withdraw from.
6. Fill the amount
7. Fill the remark. (optional)
8. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Deposit Withdraw function.  

---

#### DEP-021 · Delete draft withdraw deposit PV

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Deposit r31 (TC_Deposit_025) |

**Preconditions:**

User must have the  
permission.  

**Steps:**

1. Click "PV"on the top
2. Choose one of the payment.
3. Click "manage" button
4. Check the cash outflow draft
5. Click "delete" button

**Expected result:**

1. Transaction will be deleted successfully

---

#### ★ DEP-022 · Approve withdraw deposit — deposit balance reduced and PV in Cash Outflow

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Deposit r32 (TC_Deposit_026) |

**Preconditions:**

User must have the  
permission.  

**Steps:**

1. Click "PV"on the top
2. Choose one of the payment.
3. Click "manage" button
4. Check the cash outflow draft
5. Click "Approve" button

**Expected result:**

1. Cash outflow approved
2. withdraw amount will be subtracted from deposit current balance
3. PV will be shown in Cash Outflow

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash , Deposit
2. Cash Outflow - recent 20
3. Apartment - Deposit
4. Cash & Bank Account
5. Report - Acc statement report and detail , transaction , Cash Outflow

---

### Deposit statement

#### DEP-023 · Filter deposit transactions by month and currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Deposit r33 (TC_Deposit_027) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Select the Month and Currency which user want to view.

**Expected result:**

The deposit transaction for the selected month and currency will be shown.  

---

#### ★ DEP-024 · Deposit OB of upcoming month equals current deposit balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Deposit r34 (TC_Deposit_028) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Select the upcoming Month.

**Expected result:**

The opening balance for the selected upcoming month which is the same with deposit current balance will be shown.  

---

#### DEP-025 · Deposit transaction PDF for selected month and currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Deposit r35 (TC_Deposit_029) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Search apartment from search bar.
2. Click "Deposit" from side bar.
3. Click "PDF" button.

**Expected result:**

The deposit transaction pdf for the selected month and currency will be shown.  

---
