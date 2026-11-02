# 08 · Apartments

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 33 (+22 data-variant rows)  
**Priority:** P1 15 · P2 15 · P3 3 · **★ Critical:** 9 · **Smoke:** 3 · **E2E:** 11 · **Auto:** 33 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [APT-001](#-apt-001--create-new-apartment-zone-building-unit) | ★ Create new apartment (zone, building, unit) | Create apartment | P1 | Smoke · E2E · Regression | Auto-UI | Active |  |
| [APT-002](#apt-002--cannot-create-duplicate-apartment-same-zonebuildingunit) | Cannot create duplicate apartment (same zone/building/unit) | Create apartment | P2 | Regression | Auto-UI | Active |  |
| [APT-003](#apt-003--cannot-create-apartment-without-unit-required-validation) | Cannot create apartment without Unit (required validation) | Create apartment | P3 | Regression | Auto-UI | Active |  |
| [APT-004](#apt-004--pressing-enter-key-does-not-submit-new-apartment-form) | Pressing Enter key does not submit New Apartment form | Create apartment | P3 | Regression | Auto-UI | Active |  |
| [APT-005](#apt-005--apartment-summary-shows-total-unpaid-ar-mmk-and-ar-aging-cards) | Apartment summary shows total unpaid AR (MMK) and AR aging cards | Apartment summary | P1 | Regression | Auto-UI+API | Active |  |
| [APT-006](#apt-006--apartment-summary-current-card-shows-amount-owed-not-yet-due) | Apartment summary Current card shows amount owed (not yet due) | Apartment summary | P1 | Regression | Auto-UI+API | Active |  |
| [APT-007](#apt-007--apartment-summary-total-overdue-card-shows-total-overdue-amount) | Apartment summary Total Overdue card shows total overdue amount | Apartment summary | P1 | Regression | Auto-UI+API | Active |  |
| [APT-008](#apt-008--apartment-summary-aging-bucket-card-amount-and--of-total-overdue--by-bucket) | Apartment summary aging bucket card amount and % of total overdue — by bucket | Apartment summary | P1 | Regression | Auto-UI+API | Active | 7 |
| [APT-009](#apt-009--apartment-summary-shows-ownertenant-detail-cards--by-role-and-status) | Apartment summary shows owner/tenant detail cards — by role and status | Apartment summary | P2 | Regression | Auto-UI | Active | 4 |
| [APT-010](#apt-010--apartment-invoices-tab-lists-all-invoices-and-debit-notes-of-the-apartment) | Apartment Invoices tab lists all invoices and debit notes of the apartment | Apartment invoices | P2 | Regression | Auto-UI | Active |  |
| [APT-011](#apt-011--view-invoicedebit-note-voucher-from-apartment-and-viewdownload-pdf) | View invoice/debit note voucher from apartment and view/download PDF | Apartment invoices | P2 | Regression | Auto-UI+API | Active |  |
| [APT-012](#apt-012--apartment-invoices-tab-shows-unpaid-amount-and-wallet-balance-mmk-and-other-currency) | Apartment Invoices tab shows unpaid amount and wallet balance (MMK and other currency) | Apartment invoices | P1 | Regression | Auto-UI+API | Active |  |
| [APT-013](#apt-013--filter-apartment-invoices-by-unpaid-only--current-only) | Filter apartment invoices by Unpaid only / Current only | Apartment invoices | P2 | Regression | Auto-UI | Active |  |
| [APT-014](#-apt-014--add-invoice-from-apartment-page--saved-as-draft-and-sent-for-approval) | ★ Add invoice from apartment page — saved as draft and sent for approval | Apartment invoices | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [APT-015](#apt-015--newly-approved-invoicedebit-note-appears-in-apartment-invoice-list) | Newly approved invoice/debit note appears in apartment invoice list | Apartment invoices | P2 | E2E · Regression | Auto-UI | Active |  |
| [APT-016](#-apt-016--make-full-payment-from-apartment--soa-ar-and-unpaid-total-updated) | ★ Make full payment from apartment — SOA, AR and unpaid total updated | Apartment payment | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [APT-017](#-apt-017--make-partial-payment-from-apartment--invoice-becomes-partially-paid) | ★ Make partial payment from apartment — invoice becomes Partially Paid | Apartment payment | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [APT-018](#-apt-018--overpayment-from-apartment--excess-amount-goes-to-wallet) | ★ Overpayment from apartment — excess amount goes to wallet | Apartment payment | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [APT-019](#-apt-019--make-payment-with-currency-conversion-from-apartment--by-direction) | ★ Make payment with currency conversion from apartment — by direction | Apartment payment | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [APT-020](#-apt-020--apartment-soa-shows-current-ar-balance-per-currency-mmk-usd) | ★ Apartment SOA shows current AR balance per currency (MMK, USD) | Apartment SOA | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [APT-021](#-apt-021--apartment-monthly-soa-lists-transactions-and-ob--previous-month-cb--by-currency) | ★ Apartment monthly SOA lists transactions and OB = previous month CB — by currency | Apartment SOA | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 2 |
| [APT-022](#-apt-022--apartment-soa-all-history-lists-all-invoices-dns-and-receipts--by-currency) | ★ Apartment SOA All History lists all invoices, DNs and receipts — by currency | Apartment SOA | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [APT-023](#apt-023--apartment-monthly-soa-pdf-contains-months-invoices-dns-and-receipts) | Apartment monthly SOA PDF contains month's invoices, DNs and receipts | Apartment SOA | P2 | Regression | Auto-UI+API | Active |  |
| [APT-024](#apt-024--apartment-all-history-soa-pdf-contains-all-invoices-dns-and-receipts) | Apartment All History SOA PDF contains all invoices, DNs and receipts | Apartment SOA | P2 | Regression | Auto-UI+API | Active |  |
| [APT-025](#apt-025--open-voucher-invoicednrv-by-clicking-its-number-in-apartment-soa) | Open voucher (invoice/DN/RV) by clicking its number in apartment SOA | Apartment SOA | P2 | Regression | Auto-UI | Active |  |
| [APT-026](#apt-026--add-note-to-apartment) | Add note to apartment | Apartment notes | P2 | Regression | Auto-UI | Active |  |
| [APT-027](#apt-027--edit-own-note-on-apartment) | Edit own note on apartment | Apartment notes | P2 | Regression | Auto-UI | Active |  |
| [APT-028](#apt-028--user-cannot-edit-another-users-apartment-note-no-edit-button) | User cannot edit another user's apartment note (no edit button) | Apartment notes | P2 | Regression | Auto-UI | Active |  |
| [APT-029](#apt-029--pressing-enter-key-does-not-submit-apartment-note) | Pressing Enter key does not submit apartment note | Apartment notes | P3 | Regression | Auto-UI | Active |  |
| [APT-030](#apt-030--assign-current-ownertenant-to-apartment--by-role-and-count) | Assign current owner/tenant to apartment — by role and count | Apartment owner/tenant | P1 | E2E · Regression | Auto-UI | Active | 4 |
| [APT-031](#apt-031--assign-previous-ownertenant-with-end-date--by-role-and-count) | Assign previous owner/tenant with end date — by role and count | Apartment owner/tenant | P2 | Regression | Auto-UI | Active | 4 |
| [APT-032](#apt-032--change-current-ownertenant-to-previous-set-end-date--by-role) | Change current owner/tenant to previous (set end date) — by role | Apartment owner/tenant | P2 | Regression | Auto-UI | Active | 2 |
| [APT-033](#apt-033--delete-apartment-ownertenant--by-role-and-status) | Delete apartment owner/tenant — by role and status | Apartment owner/tenant | P2 | Regression | Auto-UI | Active | 4 |
<!-- /generated:summary -->

## Test cases

### Create apartment

#### ★ APT-001 · Create new apartment (zone, building, unit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI | Active — Area: new apartment must appear in Invoice/DN, Cash Received, UO, EM apartment search boxes | Apartments r5 (TC_NewApartment_001) |

**Preconditions:**

User needs to login the system first  

**Test data:**

1. Zone = "City Loft"
2. Building = "CL1"
3. Unit = '101"

**Steps:**

1. Click "Apartments" from left menu.
2. Click "New" button.
3. Select "Zone"
4. Select "Building"
5. Fill the "Unit"
4. Click "Create" button

**Expected result:**

1. New apartment will be created.

**Check areas:**

1. Invoice / Debit Note Create page > Apartment Search box
2. Cash Received - Unknown to apartment > search box
3. UO & MR create > apartment seart box
4. EM create > apartment seart box
5. Apartment Listing page

---

#### APT-002 · Cannot create duplicate apartment (same zone/building/unit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r6 (TC_NewApartment_002) |

**Preconditions:**

User needs to login the system first  

**Test data:**

1. Zone = "City Loft"
2. Building = "CL1"
3. Unit = '101"

**Steps:**

1. Click "Apartments" from left menu.
2. Click "New" button.
3. Select "Zone"
4. Select "Building"
5. Fill the "Unit"
4. Click "Create" button

**Expected result:**

1. "The Name has already been taken " alert will be shown.

---

#### APT-003 · Cannot create apartment without Unit (required validation)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active — Steps say "Save" while #5 says "Create" button | Apartments r7 (TC_NewApartment_003) |

**Preconditions:**

User needs to login the system first  

**Test data:**

1. Zone = "City Loft"
2. Building = "CL1"

**Steps:**

1. Click "Apartments" from left menu.
2. Click "New" button.
3. Select "Zone"
4. Select "Building"
5. Do not fill the "Unit"
4. Click "Save" button

**Expected result:**

1. "Unit is required" alert will be shown under unit text box

---

#### APT-004 · Pressing Enter key does not submit New Apartment form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Apartments r8 (TC_NewApartment_004) |

**Preconditions:**

User needs to login the system first  

**Test data:**

1. Zone = "City Loft"
2. Building = "CL1"
3. Unit = '102"

**Steps:**

1. Click "Apartments" from left menu.
2. Click "New" button.
3. Select "Zone"
4. Select "Building"
5. Fill the "Unit"
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create New Apartment function.  

---

### Apartment summary

#### APT-005 · Apartment summary shows total unpaid AR (MMK) and AR aging cards

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Apartments r15 (TC_Apart:summary_001) |

**Scenario group:** Apartments (Summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Summary" button.

**Expected result:**

1. You can see total Unpaid amount in MMK for ralated apartment.
2. You can see AR cards that are divided by overdue date range categories.

---

#### APT-006 · Apartment summary Current card shows amount owed (not yet due)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Apartments r16 (TC_Apart:summary_002) |

**Scenario group:** Apartments (Summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Summary" button.

**Expected result:**

1. You can see the total amount owed in the system in current card for related apartment

---

#### APT-007 · Apartment summary Total Overdue card shows total overdue amount

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Apartments r17 (TC_Apart:summary_003) |

**Scenario group:** Apartments (Summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Summary" button.

**Expected result:**

1. You can see the total amount overdue by the system for related apartment

---

#### APT-008 · Apartment summary aging bucket card amount and % of total overdue — by bucket

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Apartments r18 (TC_Apart:summary_004) |

**Scenario group:** Apartments (Summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Summary" button.

**Expected result:**

1. , You can see amount that is overdue within 1 to 30 days for related apartment
2. Amount on this card is how many percentages of the total overdue amount are shown.

**Data variants (7 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see 1 to 30 Days card | Apartments r18 (TC_Apart:summary_004) | |
| 2 | Bucket=31-60 days | Apartments r19 (TC_Apart:summary_005) |  |
| 3 | Bucket=61-90 days | Apartments r20 (TC_Apart:summary_006) |  |
| 4 | Bucket=91-120 days | Apartments r21 (TC_Apart:summary_007) |  |
| 5 | Bucket=121-150 days | Apartments r22 (TC_Apart:summary_008) |  |
| 6 | Bucket=151-180 days | Apartments r23 (TC_Apart:summary_009) |  |
| 7 | Bucket=>180 days | Apartments r24 (TC_Apart:summary_010) |  |

---

#### APT-009 · Apartment summary shows owner/tenant detail cards — by role and status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r25 (TC_Apart:summary_011) |

**Scenario group:** Apartments (Summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Summary" button.

**Expected result:**

1. User can see the apartment owner details card.
2. The owner details card includes name, ID, phone number, email, and ownership start date.
3. If an apartment has more than one owner, all owner details cards are shown.

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see apartment current owner | Apartments r25 (TC_Apart:summary_011) | |
| 2 | Role=Owner; Status=Previous (with end date) | Apartments r26 (TC_Apart:summary_012) |  |
| 3 | Role=Tenant; Status=Current | Apartments r27 (TC_Apart:summary_013) |  |
| 4 | Role=Tenant; Status=Previous (with end date) | Apartments r28 (TC_Apart:summary_014) |  |

---

### Apartment invoices

#### APT-010 · Apartment Invoices tab lists all invoices and debit notes of the apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r35 (TC_Apart:Invoice_001) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Invoices" button.

**Expected result:**

1. All Invoice and debit note for related apartment are shown in list

---

#### APT-011 · View invoice/debit note voucher from apartment and view/download PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Apartments r36 (TC_Apart:Invoice_002) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Invoices" button.
4. Click "View" button of one invoice(or)DN what you want to see

**Expected result:**

1. You can see Invoice(or)Debit note voucher with full data, and you can view or download pdf file.

---

#### APT-012 · Apartment Invoices tab shows unpaid amount and wallet balance (MMK and other currency)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Apartments r37 (TC_Apart:Invoice_003) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Invoices" button.

**Expected result:**

1. You can see total Unpaid amount in MMK for ralated apartment.
2. You can see total Unpaid amount in Other Currency for ralated apartment.
3. You can see Wallet current balance in MMK for ralated apartment.
4. You can see Wallet current balance in Other Currency for ralated apartment.

---

#### APT-013 · Filter apartment invoices by Unpaid only / Current only

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r38 (TC_Apart:Invoice_004) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Invoices" button.
4. Click the checkbox "Unpaid Only" (or) "Current only"

**Expected result:**

1. When user check the "Unpaid only",user can see all unpaid receivable invoice list
2. When user check the "Current only",user can see all current receivable invoice list
3. When user uncheck both,user can see all invoice list that include paid,unpaid and current unpaid

---

#### ★ APT-014 · Add invoice from apartment page — saved as draft and sent for approval

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active — Area: Dashboard AR, AR list, Inv/DN list, contact summary, reports after approval | Apartments r39 (TC_Apart:Invoice_005) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Categories = "Maintenance Services"
2. Payment terms = "+7days"
3. Item Description = "Maintenance fees"
4. Tax type = "+3%tax"
5. Unit = 2
6. Gross price = 1500
7. Discount = 10 ks

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Invoices" button.
4. Click "Add invoice" button
5. Currency will be Apartment,MMK and Date will be today.(default)
6. Fill the required fields.
7. Disc.Price, Tax and Total depend on tax type, unit, Gross price and Discount. They will be calculated automatically .
8. If invoice prepareer wants to add another description, Click "Add blank Line" button
9. Fill the required fields
10. Click "Save" button

**Expected result:**

1. "Invoice has been successfully created" message will be shown
2. Invoice will be saved as draft in Inv/Dn.
3. Notification will be sent to approver.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

#### APT-015 · Newly approved invoice/debit note appears in apartment invoice list

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Apartments r40 (TC_Apart:Invoice_006) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

1. User needs to login the system first
2. Admin approves Inv/DN by clicking approve of Inv/DN on the top

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Invoices" button.

**Expected result:**

1. In the list, the newly added invoice approved by the admin will increase

---

### Apartment payment

#### ★ APT-016 · Make full payment from apartment — SOA, AR and unpaid total updated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Apartments r41 (TC_Apart:Invoice_007) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. Currency type = "MMK"
2. Location = MO - CL
3. Payment type = cash
4. Received in = [Cash MMK] 2C2P account
5. Received amount = 100000(or)
6. Select the balance of the invoice you want to pay

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Make Payment" button.
4. Fill the required fields
5. You can enter received amount(or)
6. You can select balance you want to pay
7. Click "Confirm" button

**Expected result:**

1. Payment Received record is stored in S.O.A of related apartment
2. The invoice will be deleted from the AR list
3. Total unpaid amount is decreased for ralated aprtment

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

#### ★ APT-017 · Make partial payment from apartment — invoice becomes Partially Paid

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Apartments r42 (TC_Apart:Invoice_008) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. Currency type = "MMK"
2. Location = MO - CL
3. Payment type = cash
4. Received in = [Cash MMK] 2C2P account
5. Received amount = 100

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Make Payment" button.
4. Fill the required fields
5. You can enter received amount less than balance amount
6. Click "Confirm" button

**Expected result:**

1. Balance amount will be partially decrease
2. Invoice status change to "partially paid" in AR
3. Payment Received record is stored in S.O.A of related apartment
4. Total unpaid amount is decreased for ralated aprtment

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

#### ★ APT-018 · Overpayment from apartment — excess amount goes to wallet

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Apartments r43 (TC_Apart:Invoice_009) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. Currency type = "MMK"
2. Location = MO - CL
3. Payment type = cash
4. Received in = [Cash MMK] 2C2P account
5. Enter received amount more than total unpaid amount

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Make Payment" button.
4. Fill the required fields
5. You can enter received amount more than total unpaid amount
6. Click "Confirm" button

**Expected result:**

1. Payment Received record is stored in S.O.A of related apartment
2. The invoice will be deleted from the AR lis
3. Total unpaid amount is decreased for ralated aprtment
4. The excess amount is returned to the wallet

**Check areas:**

1. Dashboard AR amount , Cash & Bank amount , net cash , wallet
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Cash Received - Recent Receipt
5. Apartment - summary amount , Invoices list, SOA report ,wallet
5. Contact - summary amount, Unpaid Invoices list
6. Cash & Bank Account
7. Report - Account Statement detail , Invoices list , transaction , cash received

---

#### ★ APT-019 · Make payment with currency conversion from apartment — by direction

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Apartments r44 (TC_Apart:Invoice_010) |

**Scenario group:** Apartments (Invoice)

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. Currency type = "MMK"
2. Location = MO - CL
3. Payment type = cash
4. Received in = [Cash MMK] 2C2P account
5. Received amount USD = $10
6. Received amount MMK = 35000 mmk

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Make Payment" button.
4. Select "MMK"in currency type
5. Fill the required fields
6. Click " Pay in USD" checkbox
7. You can enter received amount in MMK and USD
8. Conversion rate will be automatically calculated.
9. Click "Confirm" button

**Expected result:**

1. Payment Received record is stored in S.O.A of related apartment
2. The invoice will be deleted from the AR list
3. Total unpaid amount is decreased for ralated aprtment

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
| 1 | (base) User can make payment ( MMK to Other Currency) | Apartments r44 (TC_Apart:Invoice_010) | |
| 2 | Direction=USD to MMK | Apartments r45 (TC_Apart:Invoice_011) |  |

---

### Apartment SOA

#### ★ APT-020 · Apartment SOA shows current AR balance per currency (MMK, USD)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Apartments r52 (TC_Apart:SOA_001) |

**Scenario group:** Apartments (SOA)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "S.O.A" button.

**Expected result:**

1. You can see total current AR balance in MMK
2. You can see total current AR balance in other currency (eg: USD)

---

#### ★ APT-021 · Apartment monthly SOA lists transactions and OB = previous month CB — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Apartments r53 (TC_Apart:SOA_002) |

**Scenario group:** Apartments (SOA)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "S.O.A" button.
4. Balance type "MMK" will be auto selected
5. In the date range, to month will be auto selected

**Expected result:**

1. You can see all "MMK" S.O.A list for to month
2. S.O.A list include invoices,debit notes and payment voucher for related apartment
3. The opening balance of the next month must be the closing balance of the previous month.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Users can see monthly "MMK" S.O.A list of related apartments | Apartments r53 (TC_Apart:SOA_002) | |
| 2 | Currency=USD | Apartments r55 (TC_Apart:SOA_004) |  |

---

#### ★ APT-022 · Apartment SOA All History lists all invoices, DNs and receipts — by currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Apartments r54 (TC_Apart:SOA_003) |

**Scenario group:** Apartments (SOA)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "S.O.A" button.
4. Balance type "MMK" will be auto selected
5. Click on "All History" button

**Expected result:**

1. You can see all "MMK" S.O.A list for related apartment
2. S.O.A list include invoices,debit notes and payment voucher for related apartment

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see all "MMK" S.O.A list for related apartment | Apartments r54 (TC_Apart:SOA_003) | |
| 2 | Currency=USD | Apartments r56 (TC_Apart:SOA_005) |  |

---

#### APT-023 · Apartment monthly SOA PDF contains month's invoices, DNs and receipts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Apartments r57 (TC_Apart:SOA_006) |

**Scenario group:** Apartments (SOA)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "S.O.A" button.
4. Choose balance type "MMK"/Other Currency (eg:"USD")
5. The current month is selected in default and can choose the desired month to view.
6. Click "PDF" button.

**Expected result:**

1. You can see monthy statement of account voucher
2. Voucher include all monthy invoice, debit notes and payment received list

---

#### APT-024 · Apartment All History SOA PDF contains all invoices, DNs and receipts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Apartments r58 (TC_Apart:SOA_007) |

**Scenario group:** Apartments (SOA)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "S.O.A" button.
4. Choose balance type "MMK"/Other Currency
5. Click on "All History" button.
6. Click "PDF" button.

**Expected result:**

1. You can see all statement of account voucher
2. Voucher include all invoice, debit notes and payment received list

---

#### APT-025 · Open voucher (invoice/DN/RV) by clicking its number in apartment SOA

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r59 (TC_Apart:SOA_008) |

**Scenario group:** Apartments (SOA)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "S.O.A" button.
4. Choose balance type "MMK"/Other Currency
5. Click on statement voucher number you want to view.

**Expected result:**

1. You can see related vouchers when you click on the statement voucher number you want to view.
2. You can see invoice voucher when you click on invoice number
3. You can see debit note voucher when you click on debit note number
4. You can see receipt voucher when you click on receipt vouche number

---

### Apartment notes

#### APT-026 · Add note to apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r66 (TC_Apart:N&E_001) |

**Scenario group:** Apartments (Note and Edit)

**Preconditions:**

1. User need to login the System first.

**Test data:**

1. Notes = " This apartment owner is YOMA and tenant is "Onenex". They rent 1year and 6 months start from oct 2023."

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "note" button.
4. Add notes in note text field
5. Click "Post" button.

**Expected result:**

1. Notes for related apartment are saved in Notes.
2. You can review new notes and all notes in the note list.

**Check areas:**

Apartment Note page  

---

#### APT-027 · Edit own note on apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Source title says "Contact"; data text refers to Contact (copy-paste) | Apartments r67 (TC_Apart:N&E_002) |

**Scenario group:** Apartments (Note and Edit)

**Preconditions:**

1. User need to login the System first.
2. There must be a note created.

**Test data:**

1. Notes = " This Contact owner is YOMA and tenant is "Onenex". They rent 6 months start from oct 2023."

**Steps:**

1. Click "Apartments" from left menu.
2. Select one Apartment what you want to see
3. Click "note" button.
4. Click the edit button of the old note you want to edit.
5. Click "Post" button.

**Expected result:**

1. The original note will be replaced with the new edited text.

**Check areas:**

Apartment Note page  

---

#### APT-028 · User cannot edit another user's apartment note (no edit button)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r68 (TC_Apart:N&E_003) |

**Scenario group:** Apartments (Note and Edit)

**Preconditions:**

1. User need to login the System first.
2. There must be a note other user created.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one Apartment what you want to see
3. Click "note" button.

**Expected result:**

1. You can view notes written by other people, but you can't edit them.
2. You won't see the edit button.

---

#### APT-029 · Pressing Enter key does not submit apartment note

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Apartments r69 (TC_Apart:N&E_004) |

**Scenario group:** Apartments (Note and Edit)

**Preconditions:**

1. User need to login the System first.

**Test data:**

1. Notes = " This apartment owner is YOMA and tenant is "Onenex". They rent 1year and 6 months start from oct 2023."

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "note" button.
4. Add notes in note text field
5. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Note function.  

---

### Apartment owner/tenant

#### APT-030 · Assign current owner/tenant to apartment — by role and count

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI | Active — Rules: contact cannot be owner and tenant of same apartment; periods must not overlap | Apartments r70 (TC_Apart:N&E_005) |

**Scenario group:** Apartments (Note and Edit)

**Preconditions:**

1. User need to login the System first.
2. The owner's contact must be created in advance.

**Test data:**

1. The contact must not be a current tenant in the same apartment.
2. The current owner period cannot overlap with the date range of any previous owner or tenant. There must be at least one day gap after the previous owner/tenant’s end date.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Edit" button and click "Owners"
4. Select owner from existsing contact.
5. Set current ownership start date
5. Click "Save" button.

**Expected result:**

1. The system registered the apartment and the owner of the apartment together
2. Owner detail card is added to apartment summary
3. Owner name,ph no and ID no are added in apartment detail and show in apartment list

**Check areas:**

1. Apartment Listing page
2. Apartment - summary , Invoice pdf
3. Contact - Summary , Unpaid Invoice

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can set apartment current owner | Apartments r70 (TC_Apart:N&E_005) | |
| 2 | Role=Owner; Count=Multiple (Add More) | Apartments r71 (TC_Apart:N&E_006) |  |
| 3 | Role=Tenant; Count=Single | Apartments r77 (TC_Apart:N&E_012) |  |
| 4 | Role=Tenant; Count=Multiple | Apartments r78 (TC_Apart:N&E_013) |  |

---

#### APT-031 · Assign previous owner/tenant with end date — by role and count

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — End date must be at least 1 day after start date | Apartments r72 (TC_Apart:N&E_007) |

**Scenario group:** Apartments (Note and Edit)

**Preconditions:**

1. User need to login the System first.
2. The owner's contact must be created in advance

**Test data:**

1. The Ownership End Date must be at least one day later than the Ownership Start Date. It cannot be the same day or earlier.
2. The contact must not be a current owner or tenant in the same apartment.
3. The previous owner period cannot overlap with the date range of any previous owner or tenant. There must be at least one day gap after the previous owner/tenant’s end date.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Edit" button and click "Owners"
4. Click "Add More" button under Owner of 'Previous'
5. Select previous owner from existsing contact
6. Set current ownership start date
7. Set current ownership end date
8. Click "Save" button.

**Expected result:**

1. The system registered the apartment and the previous owner of the apartment together
2. Previous owner detail card is added to apartment summary
3. Previous owner name,ph no and ID no are added in apartment detail and show in apartment list

**Check areas:**

1. Apartment Listing page
2. Apartment - summary

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can set apartment previous owner | Apartments r72 (TC_Apart:N&E_007) | |
| 2 | Role=Owner; Count=Multiple | Apartments r73 (TC_Apart:N&E_008) |  |
| 3 | Role=Tenant; Count=Single | Apartments r79 (TC_Apart:N&E_014) |  |
| 4 | Role=Tenant; Count=Multiple | Apartments r80 (TC_Apart:N&E_015) |  |

---

#### APT-032 · Change current owner/tenant to previous (set end date) — by role

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r74 (TC_Apart:N&E_009) |

**Scenario group:** Apartments (Note and Edit)

**Preconditions:**

1. User need to login the System first.

**Test data:**

1. The Ownership End Date must be at least one day later than the Ownership Start Date. It cannot be the same day or earlier.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Edit" button and click "Owners"
4. Unselect "current" checkbox under owner of current
5. Set current ownership end date
6. Click "Save" button.

**Expected result:**

1. Owner status is changed to previous owner.
2. The old owner detail card is gone, and
3. A new previous owner detail card is added to the apartment summary.

**Check areas:**

1. Apartment Listing page
2. Apartment - summary , Invoice pdf
3. Contact - Summary , Unpaid Invoice

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can change apartment current owner to previous owner | Apartments r74 (TC_Apart:N&E_009) | |
| 2 | Role=Tenant | Apartments r81 (TC_Apart:N&E_016) |  |

---

#### APT-033 · Delete apartment owner/tenant — by role and status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Apartments r75 (TC_Apart:N&E_010) |

**Scenario group:** Apartments (Note and Edit)

**Preconditions:**

1. User need to login the System first.

**Steps:**

1. Click "Apartments" from left menu.
2. Select one apartment what you want to see
3. Click "Edit" button and click "Owners"
4. Click "Delete" button beside the current owner you want to delete.
6. Click "Save" button.

**Expected result:**

1. The current owner details is gone
2. Current owner detail card is disappeared in apartment summary

**Check areas:**

1. Apartment Listing page
2. Apartment - summary , Invoice pdf
3. Contact - Summary , Unpaid Invoice

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can delete apartment Current Owner | Apartments r75 (TC_Apart:N&E_010) | |
| 2 | Role=Owner; Status=Previous | Apartments r76 (TC_Apart:N&E_011) |  |
| 3 | Role=Tenant; Status=Current | Apartments r82 (TC_Apart:N&E_017) |  |
| 4 | Role=Tenant; Status=Previous | Apartments r83 (TC_Apart:N&E_018) |  |

---
