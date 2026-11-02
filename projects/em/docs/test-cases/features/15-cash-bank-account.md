# 15 · Cash & Bank Account

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 20 (+5 data-variant rows)  
**Priority:** P1 4 · P2 14 · P3 2 · **★ Critical:** 2 · **Smoke:** 1 · **E2E:** 4 · **Auto:** 20 · **Manual:** 0 · **Review:** 2

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [CBA-001](#cba-001--create-cash-account-with-initial-balance-balance-shown-in-account-list) | Create Cash account with initial balance; balance shown in account list | Account - create cash | P1 | Smoke · Regression | Auto-UI+API | Active | 2 |
| [CBA-002](#cba-002--account-with-payment-method-is-offered-only-for-that-payment-method) | Account with payment method is offered only for that payment method | Account - payment method | P2 | E2E · Regression | Auto-UI+API | Active | 2 |
| [CBA-003](#cba-003--account-without-payment-method-excluded-from-payments-usable-for-refundwithdraw) | Account without payment method excluded from payments; usable for refund/withdraw | Account - payment method | P2 | E2E · Regression | Auto-UI+API | Active | 2 |
| [CBA-004](#cba-004--create-bank-account-with-account-no-and-initial-balance) | Create Bank account with account no and initial balance | Account - create bank | P1 | Regression | Auto-UI+API | Active | 2 |
| [CBA-005](#cba-005--create-bank-account-with-overdraft-enabled) | Create Bank account with overdraft enabled | Account - overdraft | P2 | E2E · Regression | Auto-UI+API | Active | 2 |
| [CBA-006](#cba-006--create-other-type-account-eg-digital-money) | Create Other-type account (e.g. Digital Money) | Account - create other type | P2 | Regression | Auto-UI | Active |  |
| [CBA-007](#cba-007--other-type-account-without-payment-method-excluded-from-payments) | Other-type account without payment method excluded from payments | Account - payment method | P2 | E2E · Regression | Auto-UI+API | Review |  |
| [CBA-008](#cba-008--new-cash--bank-account-is-not-created-by-pressing-enter-key) | New Cash & Bank account is not created by pressing Enter key | Account - form validation | P3 | Regression | Auto-UI | Active |  |
| [CBA-009](#-cba-009--edit-initial-balance-before-transactions-closing-balance-recalculated) | ★ Edit initial balance before transactions; closing balance recalculated | Account - initial balance | P1 | Regression | Auto-UI+API | Active |  |
| [CBA-010](#-cba-010--edit-initial-balance-after-transactions-closing-balance-recalculated) | ★ Edit initial balance after transactions; closing balance recalculated | Account - initial balance | P1 | Regression | Auto-UI+API | Active |  |
| [CBA-011](#cba-011--edit-account-details) | Edit account details | Account - edit | P2 | Regression | Auto-UI | Review |  |
| [CBA-012](#cba-012--account-type-and-currency-are-not-editable) | Account type and currency are not editable | Account - edit | P2 | Regression | Auto-UI | Active |  |
| [CBA-013](#cba-013--overdraft-cannot-be-disabled-while-account-balance-is-negative) | Overdraft cannot be disabled while account balance is negative | Account - overdraft | P2 | Regression | Auto-UI | Active |  |
| [CBA-014](#cba-014--delete-a-cash--bank-account-with-no-transactions) | Delete a Cash & Bank account with no transactions | Account - delete | P2 | Regression | Auto-UI | Active |  |
| [CBA-015](#cba-015--block-deleting-an-account-that-has-transactions) | Block deleting an account that has transactions | Account - delete | P2 | Regression | Auto-UI | Active |  |
| [CBA-016](#cba-016--negative-initial-balance-cannot-be-entered-on-create) | Negative initial balance cannot be entered on create | Account - form validation | P2 | Regression | Auto-UI | Active |  |
| [CBA-017](#cba-017--negative-initial-balance-cannot-be-entered-on-edit) | Negative initial balance cannot be entered on edit | Account - initial balance | P2 | Regression | Auto-UI | Active |  |
| [CBA-018](#cba-018--view-all-cash--bank-accounts-in-list) | View all Cash & Bank accounts in list | Account - list | P2 | Regression | Auto-UI | Active |  |
| [CBA-019](#cba-019--search-accounts-by-name-bank-number-type-currency-or-balance) | Search accounts by name, bank, number, type, currency or balance | Account - list | P2 | Regression | Auto-UI | Active |  |
| [CBA-020](#cba-020--sort-account-list-by-account-name) | Sort account list by account name | Account - list | P3 | Regression | Auto-UI | Active |  |
<!-- /generated:summary -->

## Test cases

### Account - create cash

#### CBA-001 · Create Cash account with initial balance; balance shown in account list

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active | Cash and Bank Account r5 (TC_Cash_Bank_Acc_001) |

**Preconditions:**

1. User needs to login
   the system frist

**Test data:**

1. Account Name = "2C2P Account"
2. Currency = "MMK"
3. Initial Balance = "100000MMK"
4. Payment Method = "CASH"
5. Type = "CASH"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button
3. Currency will be "MMK" default.
4. Fill the required fields.
5. Type will be "Cash" default
6. Click "Create" button.

**Expected result:**

1. Created Account with Initial Balance and Balance (Closing Balance) will be seen
   in Cash and Bank Account List.

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can create  cash account with MMK currency | Cash and Bank Account r5 (TC_Cash_Bank_Acc_001) | |
| 2 | Currency=USD; Initial balance=0.01 | Cash and Bank Account r6 (TC_Cash_Bank_Acc_002) |  |

---

### Account - payment method

#### CBA-002 · Account with payment method is offered only for that payment method

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI+API | Active | Cash and Bank Account r7 (TC_Cash_Bank_Acc_003) |

**Preconditions:**

1. User needs to login
   the system frist

**Test data:**

1. Account name= "Cash In Hand - Selected Cash Acc"
2. Currency = "MMK"
3. Initial Balance = "100000MMK"
4. Payment Method = Select the payment method that can be used with this account.
5. Type = "CASH"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button
3. Currency will be "MMK" default.
4. Fill the account name.
5. Select the payment method that can be used with this account.
6. Choose Account Type.
7. Click "Create" button.

**Expected result:**

1. Created Account will be seen in
   Cash and Bank Account List
2. This account can be used when selecting a payment method specified in the account.
3. This account cannot be used when selecting a payment method which is not specified in the account.

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can create Cash account selected payment method | Cash and Bank Account r7 (TC_Cash_Bank_Acc_003) | |
| 2 | Type=Bank | Cash and Bank Account r12 (TC_Cash_Bank_Acc_008) |  |

---

#### CBA-003 · Account without payment method excluded from payments; usable for refund/withdraw

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI+API | Active | Cash and Bank Account r8 (TC_Cash_Bank_Acc_004) |

**Preconditions:**

1. User needs to login
   the system frist

**Test data:**

1. Account name= "Cash In Hand - Only Cash Acc Name"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button
3. Currency will be "MMK" default.
4. Fill the account name.
5. Choose Account Type.
6. Click "Create" button.

**Expected result:**

1. Created Account will be seen in
   Cash and Bank Account List
2. There is no payment method, so it cannot be used to make payment, recharge wallet and add deposit.
3. If there is no payment method for Cash & Bank Account, this account can be able to use for Wallet Refund and Deposit Withdraw.

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can create  cash account without payment method | Cash and Bank Account r8 (TC_Cash_Bank_Acc_004) | |
| 2 | Type=Bank | Cash and Bank Account r13 (TC_Cash_Bank_Acc_009) |  |

---

### Account - create bank

#### CBA-004 · Create Bank account with account no and initial balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Cash and Bank Account r9 (TC_Cash_Bank_Acc_005) |

**Preconditions:**

1. User needs to login
   the system frist

**Test data:**

1. Account Name = "City Loft - Central Collateral Account"
2. Currency = "MMK"
3. Initial Balance = "100000MMK"
4. Payment Method = "Bank"
5. Type = "Bank"
6. Bank Name = "Yoma Bank"
7. Account Number = "(006 344 105 002 416)"
8. Enable Overdraft = "No"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button.
3. Currency will be "MMK" default.
4. Fill the initial balance.
5. Select Payment method.
6. Select "Bank" in type.
7. Fill the required fields
8. Click "Create" button.

**Expected result:**

1. Created Account with Account No, Initial Balance and Balance (Closing Balance) will be seen in Cash and Bank Account List

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can create  Bank account with MMK currency | Cash and Bank Account r9 (TC_Cash_Bank_Acc_005) | |
| 2 | Currency=USD | Cash and Bank Account r10 (TC_Cash_Bank_Acc_006) |  |

---

### Account - overdraft

#### CBA-005 · Create Bank account with overdraft enabled

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI+API | Active | Cash and Bank Account r11 (TC_Cash_Bank_Acc_007) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Account Name = "Overdraft Bank"
2. Currency = "MMK"
3. Initial Balance = "100000MMK"
4. Payment Method = "Bank"
5. Type = "Bank"
6. Bank Name = "AYA Bank"
7. Account Number = "(006 344 105 002 416)"
8. Enable Overdraft = "Yes"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button.
3. Currency will be "MMK"
4. Fill the initial balance.
5. Select Payment method.
6. Select "Bank" in type.
7. Set Enable Overdraft value to "Yes".
8. Fill the required fields
9. Click "Create" button.

**Expected result:**

1. Created Account with Account No, Initial Balance and Balance (Closing Balance) will be seen in Account List
2. When balance is less than outdraw amount ,this account can be outdraw overdraft

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can create Bank which enable outdraw overdraft | Cash and Bank Account r11 (TC_Cash_Bank_Acc_007) | |
| 2 | Type=Other (Digital Money) | Cash and Bank Account r15 (TC_Cash_Bank_Acc_011) |  |

---

### Account - create other type

#### CBA-006 · Create Other-type account (e.g. Digital Money)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r14 (TC_Cash_Bank_Acc_010) |

**Preconditions:**

1. User needs to login
   the system frist
2. At least one created new account type needs

**Test data:**

1. Account Name = "Digital Money"
2. Currency = "MMK"/ other currency
3. Initial Balance = "100000"
4. Payment Method = "Digital Money" / other
5. Type = "Digital Money"
6. Bank,Account Number and Enable Overdraft, these 3 categories can be selected as desired.
   (eg.)
   Bank Name = "Yoma Bank"  
   Account Number = "(006 344 105 002 416)"  
   Enable Overdraft = "No"  

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button.
3. Select Currency.
4. Fill the initial balance.
5. Select Payment method.
6. Select Account Type
7. Fill in the required information for the account type.
8. Click "Create" button.

**Expected result:**

1. Created Account with Account No, Initial Balance and Balance (Closing Balance) will be seen in Cash and Bank Account List

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

---

### Account - payment method

#### CBA-007 · Other-type account without payment method excluded from payments

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI+API | Review — Expected item 3 about overdraft does not fit a no-payment-method case (copy error) | Cash and Bank Account r16 (TC_Cash_Bank_Acc_012) |

**Preconditions:**

1. User needs to login
   the system frist

**Test data:**

1. Account Name = "Digital Money"
2. Currency = "MMK"/ other currency
3. Initial Balance = "100000"
4. Type = "Digital Money" (New created Manage type under Setting > Account Classification)
5. Bank Name = "AYA Bank"
6. Account Number = "(006 344 105 002 416)"
7. Enable Overdraft = "Yes"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button.
3. Select Currency.
4. Fill the initial balance.
5. Select Account Type
6. Fill in the required information for the account type.
7. Click "Create" button.

**Expected result:**

1. Created Account will be seen in
   Cash and Bank Account List
2. There is no payment method, so it cannot be used to Apartment-make payment, recharge wallet and add deposit.
3. When balance is less than outdraw amount ,this account can be outdraw overdraft

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

---

### Account - form validation

#### CBA-008 · New Cash & Bank account is not created by pressing Enter key

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Cash and Bank Account r17 (TC_Cash_Bank_Acc_013) |

**Preconditions:**

1. User needs to login
   the system frist

**Test data:**

1. Account Name = "2C2P Account"
2. Currency = "MMK"
3. Initial Balance = "100000MMK"
4. Payment Method = "CASH"
5. Type = "CASH"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button
3. Currency will be "MMK" default.
4. Fill the required fields.
5. Type will be "Cash" default
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create New Account function.  

---

### Account - initial balance

#### ★ CBA-009 · Edit initial balance before transactions; closing balance recalculated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Cash and Bank Account r18 (TC_Cash_Bank_Acc_014) |

**Preconditions:**

1. User needs to login
   the system frist
2. At least one account is needed

**Test data:**

1. Account Name = "2C2P Account"
2. Initial Balance = "50000MMK"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Choose one account from Cash and Bank account list
3. Click "Edit Initial Balance" button
4. Type amount in initial balance
5. Click "Update" button

**Expected result:**

1. "Account has been successfully updated" alert will be shown
2. Initial Balance and Balance (Closing Balance) amount will change.

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
   (Transactions are needed as earlier date than account create date, Transaction that is the same date with account create date and the subsequence dates after the account create date)

---

#### ★ CBA-010 · Edit initial balance after transactions; closing balance recalculated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Cash and Bank Account r19 (TC_Cash_Bank_Acc_015) |

**Preconditions:**

1. User needs to login
   the system frist
2. At least one account is needed and ther are more than one transactions has been made for the

**Test data:**

1. Account Name = "2C2P Account"
2. Initial Balance = "50000MMK"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Choose one account from Cash and Bank account list
3. Click "Edit Initial Balance" button
4. Type amount in initial balance
5. Click "Update" button

**Expected result:**

1. "Account has been successfully updated" alert will be shown
2. Initial Balance and Balance (Closing Balance) amount will change.

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
   (Transactions are needed as earlier date than account create date, Transaction that is the same date with account create date and the subsequence dates after the account create date)

---

### Account - edit

#### CBA-011 · Edit account details

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Steps say editable fields still to be defined | Cash and Bank Account r20 (TC_Cash_Bank_Acc_016) |

**Preconditions:**

1. User needs to login
   the system frist
2. At least one account needs

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Choose one account from Cash and Bank account list
3. Click "Edit" icon
4. Edit the fields. (Need to add which fields can be allowed to edit)
5. Click "Update" button

**Expected result:**

1. "Account has been successfully
   updated" alert will be shown and the updated value will be shown.

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

---

#### CBA-012 · Account type and currency are not editable

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r21 (TC_Cash_Bank_Acc_017) |

**Preconditions:**

1. User needs to login the system frist
2. At least one account needs

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Choose one account from Cash and Bank account list
3. Click "Edit" icon
4. Go to select the "Type" field. (Not only type. currency also can't be edit )

**Expected result:**

1. The system does not allow to change account type (bank to cash / cash to bank).
2. So type field is shown as disabled.

---

### Account - overdraft

#### CBA-013 · Overdraft cannot be disabled while account balance is negative

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r22 (TC_Cash_Bank_Acc_018) |

**Preconditions:**

1. User needs to login the system frist
2. At least one account needs

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Choose one account from Cash and Bank account list
3. Click "Edit" icon
4. Go to enable overdraft field

**Expected result:**

1. When account balance is minus value,the system does not allow to change enable overdraft Yes to No.
2. So Enable overdraft field is shown as disabled.

---

### Account - delete

#### CBA-014 · Delete a Cash & Bank account with no transactions

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r23 (TC_Cash_Bank_Acc_019) |

**Preconditions:**

1. User needs to login
   the system frist
2. At least one account needs

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Choose one account from Cash and Bank account list
3. Click "Delete" icon
4. Click "Yes, Delete it" button

**Expected result:**

1. "Account has been deleted successfully" altert will be showed.
2. Account will be deleted.

**Check areas:**

1. Dashboard - Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type
2. Cash and Bank Account Listing
3. Report - Acc Statement report and detail, Cash & Bank Balance, Total Amount per relevant Bank, Total Amount per associated Payment Type

---

#### CBA-015 · Block deleting an account that has transactions

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r24 (TC_Cash_Bank_Acc_020) |

**Preconditions:**

1. User needs to login the system frist(user must be User)
2. Needs an account that has at least one transaction in cash received or cash outflow.

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Choose one account with transaction from Cash and Bank account list
3. Click "Delete" icon
4. Click "Yes, Delete it" button

**Expected result:**

1. Account can't be deleted.
2. "Account delete is not allowed." altert will be showed.

---

### Account - form validation

#### CBA-016 · Negative initial balance cannot be entered on create

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r25 (TC_Cash_Bank_Acc_021) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Account Name = "Minus Account"
2. Initial Balance = "-100000MMK"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Click "New" button
3. Select bank name.
4. Fill the required fields.
5. Choose enable overdraft Yes/Np
6. Click "Create" button.

**Expected result:**

The system does not allow minus, so it does not appear in the field  

---

### Account - initial balance

#### CBA-017 · Negative initial balance cannot be entered on edit

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r26 (TC_Cash_Bank_Acc_022) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Account Name = "City Loft - Only Bank Acc Name"
2. Initial Balance = "-100000MMK"

**Steps:**

1. Click "Cash and Bank Account" from Left Menu.
2. Choose one account from Cash and Bank account list
3. Click "Edit Initial Balance" button
4. Type minus amount in initial balance.
5. Click "Update" button

**Expected result:**

The system does not allow minus, so it does not appear in the field  

---

### Account - list

#### CBA-018 · View all Cash & Bank accounts in list

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r27 (TC_Cash_Bank_Acc_023) |

**Preconditions:**

1. User needs to login the system frist

**Steps:**

1. Click "Cash and Bank Account" from left menu.

**Expected result:**

1. You can see all Cash & Bank Account for being created

---

#### CBA-019 · Search accounts by name, bank, number, type, currency or balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Cash and Bank Account r28 (TC_Cash_Bank_Acc_024) |

**Preconditions:**

1. User needs to login the system frist

**Steps:**

1. Click "Cash and Bank Account" from Left Menu
2. Confirm that search box exist In account list information screen.
3. Type the keyword with letters or digit which admin want to search.(do not need to enter separated comma ',' when search with initial balance and closing balance.)

**Expected result:**

1. The searched result regarding to
   the search keyword regarding to account can be seen as a list. If there is no result for related keyword, show the empty view.

---

#### CBA-020 · Sort account list by account name

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Cash and Bank Account r29 (TC_Cash_Bank_Acc_025) |

**Preconditions:**

User need to login the System first.  

**Steps:**

1. Click "Cash and Bank Account" from Left Menu
2. Confirm that sorting for Account Name exit in account list information screen
3. Click the sorting icon of Account column.

**Expected result:**

1. You can view the list you sorted field with ascending or descending sorting.

---
