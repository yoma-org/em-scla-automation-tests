# 09 · Contacts

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 32 (+13 data-variant rows)  
**Priority:** P1 13 · P2 12 · P3 7 · **★ Critical:** 8 · **Smoke:** 1 · **E2E:** 8 · **Auto:** 32 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [CON-001](#-con-001--create-contact--by-id-type-nrc-passport-company-reg-no) | ★ Create contact — by ID type (NRC, Passport, Company Reg. No.) | Create contact | P1 | Smoke · E2E · Regression | Auto-UI | Active | 3 |
| [CON-002](#con-002--cannot-create-contact-with-existing-identity-number--by-id-type) | Cannot create contact with existing identity number — by ID type | Create contact | P2 | Regression | Auto-UI | Active | 3 |
| [CON-003](#con-003--cannot-create-contact-with-invalid-primarysecondary-email) | Cannot create contact with invalid primary/secondary email | Create contact | P3 | Regression | Auto-UI | Active |  |
| [CON-004](#con-004--cannot-create-contact-without-required-fields-name-mobile-id-number) | Cannot create contact without required fields (name, mobile, ID number) | Create contact | P3 | Regression | Auto-UI | Active |  |
| [CON-005](#con-005--create-contact-with-phone-number-of-8-to-11-digits) | Create contact with phone number of 8 to 11 digits | Create contact | P3 | Regression | Auto-UI | Active |  |
| [CON-006](#con-006--cannot-create-contact-with-phone-shorter-than-8-or-longer-than-11-digits) | Cannot create contact with phone shorter than 8 or longer than 11 digits | Create contact | P3 | Regression | Auto-UI | Active |  |
| [CON-007](#con-007--cannot-create-contact-with-invalid-nrc-number-length--by-length) | Cannot create contact with invalid NRC number length — by length | Create contact | P3 | Regression | Auto-UI | Active | 2 |
| [CON-008](#con-008--pressing-enter-key-does-not-submit-new-contact-form) | Pressing Enter key does not submit New Contact form | Create contact | P3 | Regression | Auto-UI | Active |  |
| [CON-009](#con-009--edit-contact-from-contact-list) | Edit contact from contact list | Contact list | P2 | Regression | Auto-UI | Active |  |
| [CON-010](#con-010--delete-contact-from-contact-list) | Delete contact from contact list | Contact list | P2 | Regression | Auto-UI | Active |  |
| [CON-011](#con-011--download-contact-list-as-excel) | Download contact list as Excel | Contact list | P2 | Regression | Auto-UI+API | Active |  |
| [CON-012](#con-012--contact-summary-shows-total-unpaid-ar-mmk-and-ar-aging-cards) | Contact summary shows total unpaid AR (MMK) and AR aging cards | Contact summary | P1 | Regression | Auto-UI+API | Active |  |
| [CON-013](#con-013--contact-summary-current-card-shows-amount-owed-not-yet-due) | Contact summary Current card shows amount owed (not yet due) | Contact summary | P1 | Regression | Auto-UI+API | Active |  |
| [CON-014](#con-014--contact-summary-total-overdue-card-shows-total-overdue-amount) | Contact summary Total Overdue card shows total overdue amount | Contact summary | P1 | Regression | Auto-UI+API | Active |  |
| [CON-015](#con-015--contact-summary-aging-bucket-card-amount-and--of-total-overdue--by-bucket) | Contact summary aging bucket card amount and % of total overdue — by bucket | Contact summary | P1 | Regression | Auto-UI+API | Active | 7 |
| [CON-016](#con-016--contact-summary-shows-apartments-owned-and-tenanted-by-the-contact) | Contact summary shows apartments owned and tenanted by the contact | Contact summary | P2 | Regression | Auto-UI | Active |  |
| [CON-017](#con-017--edit-contact-information-from-contact-summary) | Edit contact information from contact summary | Contact summary | P2 | Regression | Auto-UI | Active |  |
| [CON-018](#con-018--contact-summary-shows-contact-details-name-id-company-emails-phones-country) | Contact summary shows contact details (name, ID, company, emails, phones, country) | Contact summary | P2 | Regression | Auto-UI | Active |  |
| [CON-019](#con-019--contact-unpaid-invoices-tab-lists-all-unpaid-invoices-and-debit-notes) | Contact Unpaid Invoices tab lists all unpaid invoices and debit notes | Contact unpaid invoices | P2 | Regression | Auto-UI | Active |  |
| [CON-020](#con-020--view-unpaid-invoicedn-voucher-from-contact-and-viewdownload-pdf) | View unpaid invoice/DN voucher from contact and view/download PDF | Contact unpaid invoices | P2 | Regression | Auto-UI+API | Active |  |
| [CON-021](#con-021--contact-unpaid-invoices-tab-shows-total-unpaid-amount) | Contact Unpaid Invoices tab shows total unpaid amount | Contact unpaid invoices | P1 | Regression | Auto-UI+API | Active |  |
| [CON-022](#-con-022--make-full-payment-from-contact--soa-ar-and-unpaid-total-updated) | ★ Make full payment from contact — SOA, AR and unpaid total updated | Contact payment | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [CON-023](#-con-023--make-payment-selecting-payment-method-and-received-in-account--rv-created) | ★ Make payment selecting payment method and received-in account — RV created | Contact payment | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [CON-024](#-con-024--make-partial-payment-from-contact--invoice-becomes-partially-paid) | ★ Make partial payment from contact — invoice becomes Partially Paid | Contact payment | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [CON-025](#-con-025--pay-multiple-invoices-with-one-rv-from-contact--one-soa-line-per-invoice) | ★ Pay multiple invoices with one RV from contact — one SOA line per invoice | Contact payment | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [CON-026](#-con-026--pay-invoice-with-wallet-balance-from-contact--wp-created-wallet-reduced) | ★ Pay invoice with wallet balance from contact — WP created, wallet reduced | Contact payment | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [CON-027](#-con-027--overpayment-from-contact--excess-goes-to-wallet--by-pay-in-currency) | ★ Overpayment from contact — excess goes to wallet — by pay-in currency | Contact payment | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [CON-028](#-con-028--make-payment-with-currency-conversion-from-contact--by-direction) | ★ Make payment with currency conversion from contact — by direction | Contact payment | P1 | E2E · Regression | Auto-UI+API | Active | 2 |
| [CON-029](#con-029--add-note-to-contact) | Add note to contact | Contact notes | P2 | Regression | Auto-UI | Active |  |
| [CON-030](#con-030--edit-own-note-on-contact) | Edit own note on contact | Contact notes | P2 | Regression | Auto-UI | Active |  |
| [CON-031](#con-031--user-cannot-edit-another-users-contact-note-no-edit-button) | User cannot edit another user's contact note (no edit button) | Contact notes | P2 | Regression | Auto-UI | Active |  |
| [CON-032](#con-032--pressing-enter-key-does-not-submit-contact-note) | Pressing Enter key does not submit contact note | Contact notes | P3 | Regression | Auto-UI | Active |  |
<!-- /generated:summary -->

## Test cases

### Create contact

#### ★ CON-001 · Create contact — by ID type (NRC, Passport, Company Reg. No.)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI | Active — Contact is prerequisite for owner/tenant assignment and billing | Contacts r5 (TC_Contact_001) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Full Name = "Tester"
2. Phone = "+959123456789"
3. ID type = "NRC"
4. ID number = "12/PaZaTa(N)001122"

**Steps:**

1. Click "Contact" from Left Menu.
2. Click "New" button
3. Country code will be "+95" default.
4. ID type will be "NRC" default
5. Fill the required fields.
6. Click "Create" button.

**Expected result:**

1. Created Contact with Contact Name,Phone Number and NRC Number will be seen
   in Contact

**Check areas:**

1. Contact listing page

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can create contact with NRC Number | Contacts r5 (TC_Contact_001) | |
| 2 | ID type=Passport | Contacts r6 (TC_Contact_002) |  |
| 3 | ID type=Company | Contacts r7 (TC_Contact_003) |  |

---

#### CON-002 · Cannot create contact with existing identity number — by ID type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Contacts r8 (TC_Contact_004) |

**Preconditions:**

1. User needs to login the system frist
2. Create at least one contact with NRC number

**Test data:**

1. Full Name = "Tester"
2. Phone = "+959123456789"
3. ID type = "NRC"
4. ID number = "12/PaZaTa(N)001122"

**Steps:**

1. Click "Contact" from Left Menu.
2. Click "New" button
3. Country code will be "+95" default.
4. ID type will be "NRC" default
5. Fill existing NRC number and other required fields.
6. Click "Create" button.

**Expected result:**

1. "The Identity Number has already been taken" alert will be shown
2. System does not create the contact

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't create contact with Existing NRC Number | Contacts r8 (TC_Contact_004) | |
| 2 | ID type=Passport | Contacts r9 (TC_Contact_005) |  |
| 3 | ID type=Company | Contacts r10 (TC_Contact_006) |  |

---

#### CON-003 · Cannot create contact with invalid primary/secondary email

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Contacts r11 (TC_Contact_007) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Full Name = "Tester"
2. Phone = "+959123456789"
3. ID type = "NRC"
4. ID number = "12/PaZaTa(N)001222"
5. Primary Email = " tester "
6. Secondary Email = "tester@gmail

**Steps:**

1. Click "Contact" from Left Menu.
2. Click "New" button
3. Country code will be "+95" default.
4. ID type will be "NRC" default
5. Fill the required fields.
6. Click "Create" button.

**Expected result:**

1. "The Email must be a valid email address" alert will be shown
2. "The secondary email must be a valid email address" alert will be shown
3. System does not create the contact

---

#### CON-004 · Cannot create contact without required fields (name, mobile, ID number)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Contacts r12 (TC_Contact_008) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Full Name = "Tester"
2. Phone = "+959123456789"
3. ID type = "NRC"
4. ID number = "12/PaZaTa(N)001322"

**Steps:**

1. Click "Contact" from Left Menu.
2. Click "New" button
3. Country code will be "+95" default.
4. ID type will be "NRC" default
5. Leave one of the three required fields blank.
6. Click "Create" button.

**Expected result:**

1. "Full Name is required /
   Mobile number is required /
   Identity Number is required " alert will be shown  
2. System does not create the contact

---

#### CON-005 · Create contact with phone number of 8 to 11 digits

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Contacts r13 (TC_Contact_009) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Full Name = "Tester"
2. Phone(Primary) = "+9591234567"
   (or)
3. Phone(Primary) = "+9591234567890"
4. ID type = "NRC"
5. ID number = "12/PaZaTa(N)001422"

**Steps:**

1. Click "Contact" from Left Menu.
2. Click "New" button
3. Country code will be "+95" default.
4. ID type will be "NRC" default
5. Fill the required fields.
6. Click "Create" button.

**Expected result:**

1. Created Contact with correct digit Phone Number will be seen
   in Contact

**Check areas:**

1. Contact listing page

---

#### CON-006 · Cannot create contact with phone shorter than 8 or longer than 11 digits

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Contacts r14 (TC_Contact_010) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Full Name = "Tester"
2. Phone(Primary) = "+959123456"
   (or)
3. Phone(Primary) = "+95912345678911"
4. ID type = "NRC"
5. ID number = "12/PaZaTa(N)001522"

**Steps:**

1. Click "Contact" from Left Menu.
2. Click "New" button
3. Country code will be "+95" default.
4. ID type will be "NRC" default
5. Fill the required fields.
6. Click "Create" button.

**Expected result:**

1. "The mobile number format is invalid." alert will be shown
2. "The mobile number format is invalid.
   The mobile number must not be greater than 11 characters." alert will be shown
3. System does not create the contact

---

#### CON-007 · Cannot create contact with invalid NRC number length — by length

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Contacts r15 (TC_Contact_011) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Full Name = "Tester"
2. Phone = "+959123456789"
3. ID type = "NRC"
4. ID number = "12/PaZaTa(N)001"

**Steps:**

1. Click "Contact" from Left Menu.
2. Click "New" button
3. Country code will be "+95" default.
4. ID type will be "NRC" default.
5. Fill the required fields.
6. Click "Create" button.

**Expected result:**

1. "The Identity Number format is invalid" message will be shown.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't create contact when the NRC number is less than 6 digits. | Contacts r15 (TC_Contact_011) | |
| 2 | NRC digits=more than 6 | Contacts r16 (TC_Contact_012) |  |

---

#### CON-008 · Pressing Enter key does not submit New Contact form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Contacts r17 (TC_Contact_013) |

**Preconditions:**

1. User needs to login the system frist

**Test data:**

1. Full Name = "Tester"
2. Phone = "+959123456789"
3. ID type = "NRC"
4. ID number = "12/PaZaTa(N)001122"

**Steps:**

1. Click "Contact" from Left Menu.
2. Click "New" button
3. Country code will be "+95" default.
4. ID type will be "NRC" default
5. Fill the required fields.
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create New Contact function.  

---

### Contact list

#### CON-009 · Edit contact from contact list

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Contacts r18 (TC_Contact_014) |

**Preconditions:**

1. User needs to login the system frist
2. At least one contact needs

**Steps:**

1. Click "Contact" from Left Menu.
2. Choose one account from Contact list
3. Click "Edit" icon (or) Edit tap
4. Edit the fields
5. Click "Update" button

**Expected result:**

1. "Contact has been updated successfully " alert will be shown

**Check areas:**

1. Contact listing page

---

#### CON-010 · Delete contact from contact list

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Source does not say what happens if contact is linked to an apartment | Contacts r19 (TC_Contact_015) |

**Preconditions:**

1. User needs to login the system frist
2. At least one account needs

**Steps:**

1. Click "Contact" from Left Menu.
2. Choose one account from Contact list
3. Click "Delete" icon
4. Click "Yes, Delete it" button

**Expected result:**

1. "Contact has been deleted successfully" altert will be showed.
2. Contact will be deleted.

---

#### CON-011 · Download contact list as Excel

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Contacts r20 (TC_Contact_016) |

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Contact" from Left Menu.
2. Click " Excel" button of contact listing page

**Expected result:**

1. You will receive the entire contact list page as an excel file.

---

### Contact summary

#### CON-012 · Contact summary shows total unpaid AR (MMK) and AR aging cards

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Contacts r27 (TC_cont:smy_001) |

**Scenario group:** Contact (summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Contacts" from left menu.
2. Select one contact what you want to see
3. Click "Summary" button.

**Expected result:**

1. You can see total Unpaid amount in MMK for related Contact.
2. You can see AR cards that are divided by overdue date range categories.

---

#### CON-013 · Contact summary Current card shows amount owed (not yet due)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Contacts r28 (TC_cont:smy_002) |

**Scenario group:** Contact (summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Contacts" from left menu.
2. Select one contact what you want to see
3. Click "Summary" button.

**Expected result:**

1. You can see the total amount owed in the system in current card for related Contact

---

#### CON-014 · Contact summary Total Overdue card shows total overdue amount

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Contacts r29 (TC_cont:smy_003) |

**Scenario group:** Contact (summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Contacts" from left menu.
2. Select one contact what you want to see
3. Click "Summary" button.

**Expected result:**

1. You can see the total amount overdue by the system for related Contact

---

#### CON-015 · Contact summary aging bucket card amount and % of total overdue — by bucket

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Contacts r30 (TC_cont:smy_004) |

**Scenario group:** Contact (summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Contacts" from left menu.
2. Select one contact what you want to see
3. Click "Summary" button.

**Expected result:**

1. , You can see amount that is overdue within 1 to 30 days for related Contact
2. Amount on this card is how many percentages of the total overdue amount are shown.

**Data variants (7 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can see 1 to 30 Days card | Contacts r30 (TC_cont:smy_004) | |
| 2 | Bucket=31-60 days | Contacts r31 (TC_cont:smy_005) |  |
| 3 | Bucket=61-90 days | Contacts r32 (TC_cont:smy_006) |  |
| 4 | Bucket=91-120 days | Contacts r33 (TC_cont:smy_007) |  |
| 5 | Bucket=121-150 days | Contacts r34 (TC_cont:smy_008) |  |
| 6 | Bucket=151-180 days | Contacts r35 (TC_cont:smy_009) |  |
| 7 | Bucket=>180 days | Contacts r36 (TC_cont:smy_010) |  |

---

#### CON-016 · Contact summary shows apartments owned and tenanted by the contact

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Source says "Contacts owned/tenanted" — likely means apartments | Contacts r37 (TC_cont:smy_011) |

**Scenario group:** Contact (summary)

**Preconditions:**

1. User need to login
   the System first.
2. User must be the current owner or tenant of the Contact.

**Steps:**

1. Click "Contacts" from left menu.
2. Select one contact what you want to see
3. Click "Summary" button.

**Expected result:**

1. Under Contacts owned, the Contact owned by him will be displayed.
2. Under Contacts Tenanted, his tenant Contact will be displayed.
3. User can see the contact information.

---

#### CON-017 · Edit contact information from contact summary

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Contacts r38 (TC_cont:smy_012) |

**Scenario group:** Contact (summary)

**Preconditions:**

1. User need to login
   the System first.
2. User must be the current tenant of one Apartment.

**Steps:**

1. Click "Contacts" from left menu.
2. Select one contact what you want to see
3. Click "Summary" button.
4. Click "Edit" button.
5. Update the Contact Information.

**Expected result:**

1. The value will be updated.

---

#### CON-018 · Contact summary shows contact details (name, ID, company, emails, phones, country)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Contacts r39 (TC_cont:smy_013) |

**Scenario group:** Contact (summary)

**Preconditions:**

1. User need to login
   the System first.

**Steps:**

1. Click "Contacts" from left menu.
2. Select one contact what you want to see
3. Click "Summary" button.

**Expected result:**

1. User can see the contact information.
   - Full Name, ID,
   Company, Email, Secondary Email, Phone (primary), Phone (secondary), Country  

---

### Contact unpaid invoices

#### CON-019 · Contact Unpaid Invoices tab lists all unpaid invoices and debit notes

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Contacts r46 (TC_cont:Inv_01) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Unpaid Invoices" button.

**Expected result:**

1. All Unpaid Invoice and debit note for related Contact are shown in list

---

#### CON-020 · View unpaid invoice/DN voucher from contact and view/download PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Contacts r47 (TC_cont:Inv_02) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Unpaid Invoices" button.
4. Click "View" button of one Unpaid Invoice(or)DN what you want to see

**Expected result:**

1. You can see Unpaid Invoice(or)Debit note voucher with full data, and you can view or download pdf file.

---

#### CON-021 · Contact Unpaid Invoices tab shows total unpaid amount

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Contacts r48 (TC_cont:Inv_03) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Unpaid Invoices" button.

**Expected result:**

1. You can see total Unpaid amount for ralated Contact.

---

### Contact payment

#### ★ CON-022 · Make full payment from contact — SOA, AR and unpaid total updated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Contacts r49 (TC_cont:Inv_04) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

Invoices must be created for apartment related to the contact.  

**Test data:**

1. Currency type = "MMK"
2. Location = MO - CL
3. Payment type = cash
4. Received in = [Cash MMK] 2C2P account
5. Received amount = 10,000 MMK / select invoice that you want to make payment

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Unpaid Invoices" tab and then click "Make Payment" button.
4. Choose Apartment assigned for contact.
5. Fill the required fields
6. You can enter received amount(or) You can select balance you want to pay
7. Click "Confirm" button

**Expected result:**

1. Payment Received record is stored in S.O.A of related Contact
2. The Unpaid Invoice will be deleted from the AR list
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

#### ★ CON-023 · Make payment selecting payment method and received-in account — RV created

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active — Steps start from Apartment page although case is under Contacts | Contacts r50 (TC_cont:Inv_05) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

Invoices must be created for apartment related to the contact.  

**Test data:**

1. Currency type = "MMK"
2. Location = MO - CL
3. Payment method = Select the payment method
4. Received In account = The system will show you the accounts that can use the selected payment method, and you can then select from them.
5. Received amount = 10,000 MMK / select invoice that you want to make payment

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

#### ★ CON-024 · Make partial payment from contact — invoice becomes Partially Paid

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Contacts r51 (TC_cont:Inv_06) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

Invoices must be created for apartment related to the contact.  

**Test data:**

1. Currency type = "MMK"
2. Location = MO - CL
3. Payment type = cash
4. Received in = [Cash MMK] 2C2P account
5. Received amount = 1,000 MMK / enter partial amount in invoice that you want to make payment

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Unpaid Invoices" tab and then click "Make Payment" button.
4. Choose Apartment assigned for contact.
5. Fill the required fields
6. You can enter received amount(or) You can select balance you want to pay
7. Click "Confirm" button

**Expected result:**

1. Balance amount will be partially decrease
2. Unpaid Invoice status change to "partially paid" in AR
3. Payment Received record is stored in S.O.A of related Contact
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

#### ★ CON-025 · Pay multiple invoices with one RV from contact — one SOA line per invoice

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Contacts r52 (TC_cont:Inv_07) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

Invoices must be created for apartment related to the contact.  

**Test data:**

1. Location = "MO - A5"
2. Payment method = "Cash"
3. Received In account = CB Bank
4. Received Amount = 1,000 MMK / select multiple invoice that you want to make payment

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Unpaid Invoices" tab and then click "Make Payment" button.
4. Choose Apartment assigned for contact.
5. Fill the required fields
6. Enter received amount / select multiple invoice that you want to make payment
7. Click "Confirm" button

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

#### ★ CON-026 · Pay invoice with wallet balance from contact — WP created, wallet reduced

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Contacts r53 (TC_cont:Inv_08) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

Invoices must be created for apartment related to the contact.  

**Test data:**

1. Location = "MO - A5"
2. Payment method = wallet
3. Select invoice that you want to make payment

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Unpaid Invoices" tab and then click "Make Payment" button.
4. Choose Apartment assigned for contact.
5. Fill the required fields
6. Select invoice that you want to make payment.
7. Click "Confirm" button

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

#### ★ CON-027 · Overpayment from contact — excess goes to wallet — by pay-in currency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Contacts r54 (TC_cont:Inv_09) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

Invoices must be created for apartment related to the contact.  

**Test data:**

1. Location = "MO - A5"
2. Payment method = "Cash"
3. Received In account = CB Bank
4. Received Amount = 1,000,000 MMK (or)
5. Select invoice that you want to make payment and enter amount in "credit to wallet"

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Unpaid Invoices" tab and then click "Make Payment" button.
4. Choose Apartment assigned for contact.
5. Fill the required fields
6. Enter overflow received amount /enter amount in "credit to wallet" .
7. Click "Confirm" button

**Expected result:**

1. Payment Received record is stored in S.O.A of related Contact
2. The Unpaid Invoice will be deleted from the AR list
3. Total unpaid amount is decreased for ralated aprtment
4. The excess amount is returned to the wallet

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
| 1 | (base) Users can make payment in same curreny and overflow to wallet | Contacts r54 (TC_cont:Inv_09) | |
| 2 | Currency=MMK; Pay in=USD | Contacts r55 (TC_cont:Inv_10) |  |

---

#### ★ CON-028 · Make payment with currency conversion from contact — by direction

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active — Step 4 says "Choose Contacts assigned for contact" (should be Apartment) | Contacts r56 (TC_cont:Inv_11) |

**Scenario group:** Contacts (Unpaid Invoices)

**Preconditions:**

1. User
   needs to login the system first

**Test data:**

1. Currency type = "MMK"
2. Location = MO - CL
3. Payment type = cash
4. Received in = [Cash MMK] 2C2P account
5. Received amount USD = $10
6. Received amount MMK = 35000 mmk

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "Make Payment" button.
4. Choose Contacts assigned for contact.
5. Select "MMK"in currency type
6. Fill the required fields
7. Click " Pay in USD" checkbox
8. You can enter received amount in MMK and USD
9. Conversion rate will be automatically calculated.
10. Click "Confirm" button

**Expected result:**

1. Payment Received record is stored in S.O.A of related Contact
2. The Unpaid Invoice will be deleted from the AR list
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
| 1 | (base) User can make payment (MMK to Other Currency ) | Contacts r56 (TC_cont:Inv_11) | |
| 2 | Direction=USD to MMK | Contacts r57 (TC_cont:Inv_12) |  |

---

### Contact notes

#### CON-029 · Add note to contact

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — src_id reuses TC_Apart:N&E_001 | Contacts r64 (TC_Apart:N&E_001) |

**Scenario group:** Contacts (Note)

**Preconditions:**

1. User need to login
   the System first.

**Test data:**

1. Notes = " This Contact owner is YOMA and tenant is "Onenex". They rent 1year and 6 months start from oct 2023."

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "note" button.
4. Add notes in note text feild
5. Click "Post" button.

**Expected result:**

1. Notes for related Contact are saved in Notes.
2. You can review new notes and all notes in the note list.

**Check areas:**

1. Contact - Note page

---

#### CON-030 · Edit own note on contact

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Contacts r65 (TC_Apart:N&E_002) |

**Scenario group:** Contacts (Note)

**Preconditions:**

1. User need to login
   the System first.
2. There must be a note created.

**Test data:**

1. Notes = " This Contact owner is YOMA and tenant is "Onenex". They rent 6 months start from oct 2023."

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "note" button.
4. Click the edit button of the old note you want to edit.
5. Click "Post" button.

**Expected result:**

1. The original note will be replaced with the new edited text.

**Check areas:**

1. Contact - Note page

---

#### CON-031 · User cannot edit another user's contact note (no edit button)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Contacts r66 (TC_Apart:N&E_003) |

**Scenario group:** Contacts (Note)

**Preconditions:**

1. User need to login
   the System first.
2. There must be a note other user created.

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "note" button.

**Expected result:**

1. You can view notes written by other people, but you can't edit them.
2. You won't see the edit button.

---

#### CON-032 · Pressing Enter key does not submit contact note

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Contacts r67 (TC_Apart:N&E_004) |

**Scenario group:** Contacts (Note)

**Preconditions:**

1. User need to login
   the System first.

**Test data:**

1. Notes = " This Contact owner is YOMA and tenant is "Onenex". They rent 1year and 6 months start from oct 2023."

**Steps:**

1. Click "Contacts" from left menu.
2. Select one Contact what you want to see
3. Click "note" button.
4. Add notes in note text feild
5. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Note function.  

---
