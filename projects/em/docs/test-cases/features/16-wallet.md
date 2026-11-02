# 16 · Wallet

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 32 (+8 data-variant rows)  
**Priority:** P1 9 · P2 11 · P3 12 · **★ Critical:** 9 · **Smoke:** 5 · **E2E:** 7 · **Auto:** 32 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [WAL-001](#-wal-001--recharge-wallet-mmk-cash--wallet-rv-and-received-in-account-balance-increase) | ★ Recharge wallet (MMK, cash) — wallet, RV and received-in account balance increase | Wallet recharge | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 3 |
| [WAL-002](#wal-002--recharge-wallet-without-required-fields-shows-validation-errors) | Recharge wallet without required fields shows validation errors | Wallet recharge | P3 | Regression | Auto-UI | Active |  |
| [WAL-003](#wal-003--cannot-recharge-wallet-with-0-amount) | Cannot recharge wallet with 0 amount | Wallet recharge | P2 | Regression | Auto-UI | Active |  |
| [WAL-004](#wal-004--cannot-recharge-wallet-with-amount-9999999999999900-over-max-limit) | Cannot recharge wallet with amount 99999999999999.00 (over max limit) | Wallet recharge | P3 | Regression | Auto-UI | Active |  |
| [WAL-005](#wal-005--pressing-enter-key-does-not-submit-wallet-recharge-form) | Pressing Enter key does not submit Wallet Recharge form | Wallet recharge | P3 | Regression | Auto-UI | Active |  |
| [WAL-006](#-wal-006--transfer-wallet-balance-to-another-apartment--both-wallets-updated-wt-created) | ★ Transfer wallet balance to another apartment — both wallets updated, WT created | Wallet transfer | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 3 |
| [WAL-007](#wal-007--wallet-transfer-without-required-fields-shows-validation-errors) | Wallet transfer without required fields shows validation errors | Wallet transfer | P3 | Regression | Auto-UI | Active |  |
| [WAL-008](#wal-008--cannot-transfer-more-than-wallet-current-balance) | Cannot transfer more than wallet current balance | Wallet transfer | P2 | Regression | Auto-UI | Active |  |
| [WAL-009](#wal-009--cannot-transfer-amount-9999999999999900-over-max-limit) | Cannot transfer amount 99999999999999.00 (over max limit) | Wallet transfer | P3 | Regression | Auto-UI | Active |  |
| [WAL-010](#wal-010--pressing-enter-key-does-not-submit-wallet-transfer-form) | Pressing Enter key does not submit Wallet Transfer form | Wallet transfer | P3 | Regression | Auto-UI | Active |  |
| [WAL-011](#-wal-011--add-credit-note-to-wallet--saved-as-draft-and-sent-for-approval) | ★ Add credit note to wallet — saved as draft and sent for approval | Wallet credit note | P1 | Regression | Auto-UI+API | Active | 3 |
| [WAL-012](#wal-012--cannot-add-credit-note-with-0-amount) | Cannot add credit note with 0 amount | Wallet credit note | P2 | Regression | Auto-UI | Active |  |
| [WAL-013](#wal-013--add-credit-note-without-required-fields-shows-validation-errors) | Add credit note without required fields shows validation errors | Wallet credit note | P3 | Regression | Auto-UI | Active |  |
| [WAL-014](#wal-014--cannot-add-credit-note-with-amount-9999999999999900-over-max-limit) | Cannot add credit note with amount 99999999999999.00 (over max limit) | Wallet credit note | P3 | Regression | Auto-UI | Active |  |
| [WAL-015](#wal-015--approver-can-view-list-of-recorded-credit-notes) | Approver can view list of recorded credit notes | Wallet credit note | P2 | Regression | Auto-UI | Active |  |
| [WAL-016](#-wal-016--approve-credit-note--cn-amount-added-to-wallet-balance) | ★ Approve credit note — CN amount added to wallet balance | Wallet credit note | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [WAL-017](#wal-017--delete-draft-credit-note) | Delete draft credit note | Wallet credit note | P2 | Regression | Auto-UI | Active |  |
| [WAL-018](#wal-018--pressing-enter-key-does-not-submit-credit-note-form) | Pressing Enter key does not submit Credit Note form | Wallet credit note | P3 | Regression | Auto-UI | Active |  |
| [WAL-019](#-wal-019--partial-payment-of-invoice-by-wallet--unpaid-total-soa-rv-and-wallet-updated) | ★ Partial payment of invoice by wallet — unpaid total, SOA RV and wallet updated | Wallet payment | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [WAL-020](#-wal-020--pay-invoice-in-full-with-wallet-payment-method--wallet-soa-and-unpaid-total-updated) | ★ Pay invoice in full with wallet payment method — wallet, SOA and unpaid total updated | Wallet payment | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [WAL-021](#-wal-021--refund-wallet--pv-saved-as-draft-and-sent-for-approval) | ★ Refund wallet — PV saved as draft and sent for approval | Wallet refund | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [WAL-022](#wal-022--cannot-refund-more-than-wallet-current-balance) | Cannot refund more than wallet current balance | Wallet refund | P2 | Regression | Auto-UI | Active |  |
| [WAL-023](#wal-023--cannot-refund-more-than-refund-from-account-balance) | Cannot refund more than refund-from account balance | Wallet refund | P2 | Regression | Auto-UI | Active |  |
| [WAL-024](#wal-024--cannot-refund-wallet-with-0-amount) | Cannot refund wallet with 0 amount | Wallet refund | P2 | Regression | Auto-UI | Active |  |
| [WAL-025](#wal-025--wallet-refund-without-accountamount-shows-required-errors) | Wallet refund without account/amount shows required errors | Wallet refund | P3 | Regression | Auto-UI | Active |  |
| [WAL-026](#wal-026--cannot-refund-amount-9999999999999900-over-max-limit) | Cannot refund amount 99999999999999.00 (over max limit) | Wallet refund | P3 | Regression | Auto-UI | Active |  |
| [WAL-027](#wal-027--delete-draft-wallet-refund-pv) | Delete draft wallet refund PV | Wallet refund | P2 | Regression | Auto-UI | Active |  |
| [WAL-028](#-wal-028--approve-wallet-refund--wallet-and-refund-from-account-reduced-pv-issued) | ★ Approve wallet refund — wallet and refund-from account reduced, PV issued | Wallet refund | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [WAL-029](#wal-029--pressing-enter-key-does-not-submit-wallet-refund-form) | Pressing Enter key does not submit Wallet Refund form | Wallet refund | P3 | Regression | Auto-UI | Active |  |
| [WAL-030](#wal-030--filter-wallet-transactions-by-month-and-currency) | Filter wallet transactions by month and currency | Wallet statement | P2 | Regression | Auto-UI | Active |  |
| [WAL-031](#-wal-031--wallet-ob-of-upcoming-month-equals-current-wallet-balance) | ★ Wallet OB of upcoming month equals current wallet balance | Wallet statement | P1 | Regression | Auto-UI+API | Active |  |
| [WAL-032](#wal-032--wallet-transaction-pdf-for-selected-month-and-currency) | Wallet transaction PDF for selected month and currency | Wallet statement | P2 | Regression | Auto-UI+API | Active |  |
<!-- /generated:summary -->

## Test cases

### Wallet recharge

#### ★ WAL-001 · Recharge wallet (MMK, cash) — wallet, RV and received-in account balance increase

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active — No approval required for wallet recharge (GT remark) | Wallet r5 (TC_Wallet_001) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment.

**Test data:**

1. Payment method = "Cash"
2. Account to received in =
   "[ Cash MMK ] Cash in Hand - Utility Operations"
3. Location = "Zone A/B"
4. Amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Recharge" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Click "Confirm" button.

**Expected result:**

1. Received amount will be added to wallet current amount.
2. Receipt Voucher (Wallet Cash Received) will be shown.
3. Balance (in home currency) of received in account will be updated.

**Check areas:**

1. Dashboard - Cash & Bank account , net cash , wallet
2. Cash Received - Recent Receipt
3. apartment - Wallet
4. Cash & Bank Account
5. Report - Acc statement report and detail , transactions , cash received

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can recharge the  wallet with MMK. | Wallet r5 (TC_Wallet_001) | |
| 2 | Amount=0.1 (minimum) | Wallet r8 (TC_Wallet_004) |  |
| 3 | Amount=12345678901234.56 (maximum) | Wallet r9 (TC_Wallet_005) | Source title says "minimum" for the max boundary |

---

#### WAL-002 · Recharge wallet without required fields shows validation errors

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r6 (TC_Wallet_002) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment.

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Recharge" button.
4. Select currency (MMK is default).
5. Do not fill the required fields
10. Click "Confirm" button.

**Expected result:**

Error message will alert for not  
filling the fields in the recharge wallet form.  

---

#### WAL-003 · Cannot recharge wallet with 0 amount

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r7 (TC_Wallet_003) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment.

**Test data:**

1. Payment method = "Cash"
2. Account to received in =
   "[ Cash MMK ] Cash in Hand - Utility Operations"
3. Location = "Zone A/B"
4. Amount = "0"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Recharge" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Click "Confirm" button.

**Expected result:**

"The selected Amount is invalid." alert will be shown.  

---

#### WAL-004 · Cannot recharge wallet with amount 99999999999999.00 (over max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r10 (TC_Wallet_006) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment.

**Test data:**

1. Payment method = "Cash"
2. Account to received in =
   "[ Cash MMK ] Cash in Hand - Utility Operations"
3. Location = "Zone A/B"
4. Amount = 99,999,999,999,999

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Recharge" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Click "Confirm" button.

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

#### WAL-005 · Pressing Enter key does not submit Wallet Recharge form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r11 (TC_Wallet_007) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment.

**Test data:**

1. Payment method = "Cash"
2. Account to received in =
   "[ Cash MMK ] Cash in Hand - Utility Operations"
3. Location = "Zone A/B"
4. Amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Recharge" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Wallet Recharge function.  

---

### Wallet transfer

#### ★ WAL-006 · Transfer wallet balance to another apartment — both wallets updated, WT created

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Wallet r12 (TC_Wallet_008) |

**Preconditions:**

1. User needs to login the system first.
2. Payer and receiver needs to own 2 apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. Transfer to = "A1- 205"
2. Amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Wallet Transfer" button.
4. Select currency (MMK is default).
5. Select apartment to transfer.
6. Fill the amount.
7. Fill the remark. (optional)
8. Click "Confirm" button

**Expected result:**

1. Transfer amount will be
   subtracted from wallet current amount.
2. WT (Wallet Transfer) will be shown
3. Wallet of transfer received apartment will be updated

**Check areas:**

1. Apartment - Wallet
2. Report - Transaction (wallet transfer)

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can transfer the  wallet from one apartment to other. | Wallet r12 (TC_Wallet_008) | |
| 2 | Amount=0.1 (minimum) | Wallet r15 (TC_Wallet_011) | Source title says "maximum"; steps say Recharge button instead of Wallet Transfer |
| 3 | Amount=12345678901234.56 (maximum) | Wallet r16 (TC_Wallet_012) | Source title says "minimum"; steps say Recharge button instead of Wallet Transfer |

---

#### WAL-007 · Wallet transfer without required fields shows validation errors

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r13 (TC_Wallet_009) |

**Preconditions:**

1. User needs to login the system first.
2. Payer and receiver needs to own 2 apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Wallet Transfer" button.
4. Select currency (MMK is default).
5. Do not fill the required fields
6. Click "Confirm" button

**Expected result:**

Error message will alert for not  
filling the fields in the wallet transfer form.  

---

#### WAL-008 · Cannot transfer more than wallet current balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r14 (TC_Wallet_010) |

**Preconditions:**

1. User needs to login the system first.
2. Payer and receiver needs to own 2 apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Wallet Transfer" button.
4. Select currency (MMK is default).
5. Fill the amount which is greater than the wallet current balance
6. Click "Confirm" button

**Expected result:**

"Invalid amount" will be shown under the amount text box.  

---

#### WAL-009 · Cannot transfer amount 99999999999999.00 (over max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active — Steps say Recharge button instead of Wallet Transfer | Wallet r17 (TC_Wallet_013) |

**Preconditions:**

1. User needs to login the system first.
2. Payer and receiver needs to own 2 apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. Transfer to = "A1- 205"
2. Amount = "99999999999999.00"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Recharge" button.
4. Select currency (MMK is default).
5. Fill the required fields.
6. Click "Confirm" button.

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

#### WAL-010 · Pressing Enter key does not submit Wallet Transfer form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r18 (TC_Wallet_014) |

**Preconditions:**

1. User needs to login the system first.
2. Payer and receiver needs to own apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. received apartment = "A1- 205"
2. Amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Wallet Transfer" button.
4. Select currency (MMK is default).
5. Select apartment to transfer.
6. Fill the amount.
7. Fill the remark. (optional)
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Wallet Transfer function.  

---

### Wallet credit note

#### ★ WAL-011 · Add credit note to wallet — saved as draft and sent for approval

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Wallet r19 (TC_Wallet_015) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. amount = "100000"
2. categories = "Internet"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Add Credit Note" button.
4. Select currency (MMK is default).
5. Fill the amount.
6. Select the category.
7. Type the description.(optional)
8. Fill the remark (optional)
9. Click "Confirm" button

**Expected result:**

1. The recorded credit note (CN) will be saved as draft.
2. Notification will be sent to approver.

**Check areas:**

1. Apartment - Wallet
2. Report - Credit Note

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can add the  credit note. | Wallet r19 (TC_Wallet_015) | |
| 2 | Amount=0.1 (minimum) | Wallet r22 (TC_Wallet_018) | Source title says "maximum" |
| 3 | Amount=12345678901234.56 (maximum) | Wallet r23 (TC_Wallet_019) | Source title says "minimum" |

---

#### WAL-012 · Cannot add credit note with 0 amount

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r20 (TC_Wallet_016) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. amount = "0"
2. category = "Internet"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Add Credit" button.
4. Select currency (MMK is default).
5. Fill 0 in the amount.
6. Select the category.
7. Type the description.(optional)
8. Fill the remark (optional)
9. Click "Confirm" button

**Expected result:**

1. "Invalid amount" alert box will be shown

---

#### WAL-013 · Add credit note without required fields shows validation errors

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r21 (TC_Wallet_017) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. amount = " "
2. categories = " "

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Add Credit Note" button.
4. Select currency (MMK is default).
5. Fill the amount.
6. Select the category.
7. Type the description.(optional)
8. Fill the remark (optional)
9. Click "Confirm" button

**Expected result:**

Error message will alert for not  
filling the fields in add credit note form.  

---

#### WAL-014 · Cannot add credit note with amount 99999999999999.00 (over max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r24 (TC_Wallet_020) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. amount = "99999999999999.00"
2. categories = "Internet"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Add Credit Note" button.
4. Select currency (MMK is default).
5. Fill the amount.
6. Select the category.
7. Type the description.(optional)
8. Fill the remark (optional)
9. Click "Confirm" button

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

#### WAL-015 · Approver can view list of recorded credit notes

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Steps minimal ("Click the CN on the top") | Wallet r25 (TC_Wallet_021) |

**Preconditions:**

User must have the permission to view  

**Steps:**

1. Click the CN on the top.

**Expected result:**

1. Approver will view the list of
   the credit note

---

#### ★ WAL-016 · Approve credit note — CN amount added to wallet balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active — Area: Apartment wallet, Report - Credit Note | Wallet r26 (TC_Wallet_022) |

**Preconditions:**

User must have the permission to approve  

**Steps:**

1. Choose one of the credit note
2. Click management button
3. Check the credit note draft
4. Click approve button

**Expected result:**

1. Credit note will be approved.
2. Credit note (Wallet Credit Received) amount will be added to wallet current amount.

**Check areas:**

1. Apartment - Wallet
2. Report - Credit Note

---

#### WAL-017 · Delete draft credit note

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r27 (TC_Wallet_023) |

**Preconditions:**

User must have the permission.  

**Steps:**

1. Choose one of the credit note
2. Click management button
3. Click delete button

**Expected result:**

1. Transaction deleted
   successfully.

---

#### WAL-018 · Pressing Enter key does not submit Credit Note form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r28 (TC_Wallet_024) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. amount = "100000"
2. categories = "Internet"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Add Credit" button.
4. Select currency (MMK is default).
5. Fill the amount.
6. Select the category.
7. Type the description.(optional)
8. Fill the remark (optional)
9. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Credit Note function.  

---

### Wallet payment

#### ★ WAL-019 · Partial payment of invoice by wallet — unpaid total, SOA RV and wallet updated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet r29 (TC_Wallet_025) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment
3. Received amount from wallet must be less than invoice amount

**Test data:**

1. location
2. payment method
3. received in account
4. received amount

**Steps:**

1. Search apartment from search bar.
2. Click "Invoice" from side bar.
3. Click "Make Payment" button
4. Select currency (MMK is default)
5. Select location.
6. Select Wallet payment method
7. Select received in account
8. Fill received amount which is less than invoice amount
9. Fill the remark (optional)
10. Click "Confirm" button

**Expected result:**

1. Total unpaid amount wiil be
   updated
2. RV (partial payment) receipt voucher will be out in SOA
3. Wallet Current balance will be updated

**Check areas:**

1. Dashboard - AR amount , wallet
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report ,wallet
5. Contact - summary amount, Unpaid Invoices list
6. Report - Account Statement detail , Invoices list , transaction , cash received

---

#### ★ WAL-020 · Pay invoice in full with wallet payment method — wallet, SOA and unpaid total updated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Wallet r30 (TC_Wallet_026) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment

**Test data:**

1. location
2. payment method
3. received in account
4. received amount

**Steps:**

1. Search apartment from search bar.
2. Click "Invoice" from side bar.
3. Click "Make Payment" button
4. Select currency (MMK is default)
5. Select location.
6. Select wallet in payment method
7. Click "Right Stick" beside the pay and the "right stick" will be green colour.
8. Recived amount will be filled automatically.
9. Fill the remark (optional)
10. Click "Confirm" button

**Expected result:**

1. Wallet current balance will be updated
2. RV (receipt voucher) will be out in SOA
3. Total unpaid amount will be updated.

**Check areas:**

1. Dashboard - AR amount , wallet
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report ,wallet
5. Contact - summary amount, Unpaid Invoices list
6. Report - Account Statement detail , Invoices list , transaction , cash received

---

### Wallet refund

#### ★ WAL-021 · Refund wallet — PV saved as draft and sent for approval

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Wallet r31 (TC_Wallet_027) |

**Preconditions:**

1. User needs to login the system first.
2. Refunder needs to own apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. Refund from account =
   "[ YOMA Bank MMK ] Zone B2 (000 110 215 500 486)"
2. Amount = "100000"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Refund" button
4. Select currency (MMK is default)
5. Choose refund from account
6. Fill the amount
7. Click "Confirm" button

**Expected result:**

1. The recorded payment vouchcer (PV) will be saved as draft.
2. Notification will be sent to approver.

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash , Wallet
2. Cash Outflow - recent 20
3. Apartment - Wallet
4. Cash & Bank Account
5. Report - Acc statement report and detail , transaction , Cash Outflow

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can refund the wallet. | Wallet r31 (TC_Wallet_027) | |
| 2 | Amount=0.1 (minimum) | Wallet r36 (TC_Wallet_032) | Source title says "maximum" |
| 3 | Amount=12345678901234.56 (maximum) | Wallet r37 (TC_Wallet_033) | Source title says "minimum" |

---

#### WAL-022 · Cannot refund more than wallet current balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r32 (TC_Wallet_028) |

**Preconditions:**

1. User needs to login the system first.
2. Refunder needs to own apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. Currency = MMK
2. Refund from account
3. Amount

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Refund" button
4. Select currency (MMK is default)
5. Choose refund from account
6. Fill the amount which is greater than the wallet currnet balance
7. Click "Confirm" button

**Expected result:**

"Invalid Amount" alert will be shown under the amount text box.  

---

#### WAL-023 · Cannot refund more than refund-from account balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r33 (TC_Wallet_029) |

**Preconditions:**

1. User needs to login the system first.
2. Refunder needs to own apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. Currency = MMK
2. Refund from account
3. Amount

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Refund" button
4. Select currency (MMK is default)
5. Choose refund from account
6. Fill the amount which is greater than the balance of refund from account
7. Click "Confirm" button

**Expected result:**

"Invalid Amount" alert will be shown under the amount text box.  

---

#### WAL-024 · Cannot refund wallet with 0 amount

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r34 (TC_Wallet_030) |

**Preconditions:**

1. User needs to login the system first.
2. Refunder needs to own apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. Refund from account =
   "[ YOMA Bank MMK ] Zone B2 (000 110 215 500 486)"
2. Amount = "0"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Wallet Refund" button
4. Select currency (MMK is default)
5. Choose refund from account
6. Fill the amount
7. Click "Confirm" button

**Expected result:**

1. "The selected Amount is invalid" alert box will be shown

---

#### WAL-025 · Wallet refund without account/amount shows required errors

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r35 (TC_Wallet_031) |

**Preconditions:**

1. User needs to login the system first.
2. Refunder needs to own apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. Refund from account =
   " "
2. Amount = " "

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Wallet Refund" button
4. Select currency (MMK is default)
5. Choose refund from account
6. Fill the amount
7. Click "Confirm" button

**Expected result:**

1. Error message "Account is required" will show for not
   filling the "Refund from" field in Wallet Refund form.
2. Error message "The Amount field is required" will show for not filling the "Amount" field although the "Refund from" field is filled in Wallet Refund form.

---

#### WAL-026 · Cannot refund amount 99999999999999.00 (over max limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Wallet r38 (TC_Wallet_034) |

**Preconditions:**

1. User needs to login the system first.
2. Refunder needs to own apartment.
3. The Wallet Balance of Selected Apartment must be greater than 0.

**Test data:**

1. Refund from account =
   "[ YOMA Bank MMK ] Zone B2 (000 110 215 500 486)"
2. Amount = "99999999999999.00"

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Wallet Refund" button
4. Select currency (MMK is default)
5. Choose refund from account
6. Fill the amount
7. Click "Confirm" button

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

#### WAL-027 · Delete draft wallet refund PV

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r39 (TC_Wallet_035) |

**Preconditions:**

1. User must have
   the permission

**Steps:**

1. Click "PV"on the top
2. Choose one of the payment.
3. Click "manage" button
4. Check the cash outflow draft
5. Click "delete" button

**Expected result:**

1. Transaction will be deleted successfully

---

#### ★ WAL-028 · Approve wallet refund — wallet and refund-from account reduced, PV issued

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Wallet r40 (TC_Wallet_036) |

**Preconditions:**

1. User must have
   the permission

**Steps:**

1. Click "PV"on the top
2. Choose one of the payment.
3. Click "manage" button
4. Check the cash outflow draft
5. Click "Approve" button

**Expected result:**

1. Cash outflow approved
2. refund amount will be subtracted from wallet current balance and balance of refund from account
3. PV (Wallet Refund) will be out

**Check areas:**

1. Dashboard - Cash & Bank Account , Net Cash , Wallet
2. Cash Outflow - recent 20
3. Apartment - Wallet
4. Cash & Bank Account
5. Report - Acc statement report and detail , transaction , Cash Outflow

---

#### WAL-029 · Pressing Enter key does not submit Wallet Refund form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active — Test data lists payment fields, not refund fields | Wallet r41 (TC_Wallet_037) |

**Preconditions:**

1. User needs to login the system first.
2. Payer needs to own apartment
3. Received amount from wallet must be less than invoice amount

**Test data:**

1. location
2. payment method
3. received in account
4. received amount

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "Wallet Refund" button
4. Select currency (MMK is default)
5. Choose refund from account
6. Fill the amount
7. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Wallet Refund function.  

---

### Wallet statement

#### WAL-030 · Filter wallet transactions by month and currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Wallet r42 (TC_Wallet_038) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Select the Month and Currency which user want to view.

**Expected result:**

The wallet transaction for the selected month and currency will be shown.  

---

#### ★ WAL-031 · Wallet OB of upcoming month equals current wallet balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Wallet r43 (TC_Wallet_039) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Select the upcoming Month.

**Expected result:**

The opening balance for the selected upcoming month which is the same with wallet current balance will be shown.  

---

#### WAL-032 · Wallet transaction PDF for selected month and currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Wallet r44 (TC_Wallet_040) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Search apartment from search bar.
2. Click "Wallet" from side bar.
3. Click "PDF" button.

**Expected result:**

The wallet transaction pdf for the selected month and currency will be shown.  

---
