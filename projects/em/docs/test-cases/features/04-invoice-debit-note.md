# 04 · Invoice & Debit Note

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 37 (+8 data-variant rows)  
**Priority:** P1 7 · P2 20 · P3 10 · **★ Critical:** 7 · **Smoke:** 4 · **E2E:** 7 · **Auto:** 35 · **Manual:** 2 · **Review:** 6

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [INV-001](#-inv-001--create-generic-invoice-mmk-dated-last-month-to-today-as-draft) | ★ Create generic invoice (MMK, dated last month to today) as draft | Create invoice | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [INV-002](#inv-002--invoice-date-cannot-be-a-future-date) | Invoice date cannot be a future date | Invoice validation | P2 | Regression | Auto-UI | Active |  |
| [INV-003](#-inv-003--invoice-due-date--issue-date--payment-term-ar-overdue-based-on-due-date) | ★ Invoice due date = issue date + payment term; AR overdue based on due date | Create invoice | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [INV-004](#inv-004--invoice-percentage-discount-max-99-100120-rejected) | Invoice percentage discount max 99% (100%/120% rejected) | Invoice validation | P2 | Regression | Auto-UI | Active |  |
| [INV-005](#inv-005--invoice-percentage-discount-rejects-decimal-value) | Invoice percentage discount rejects decimal value | Invoice validation | P2 | Regression | Auto-UI | Active |  |
| [INV-006](#inv-006--invoice-fixed-discount-cannot-be--gross-price) | Invoice fixed discount cannot be >= gross price | Invoice validation | P2 | Regression | Auto-UI | Active |  |
| [INV-007](#inv-007--invoice-discount-field-disabled-for-inclusive-tax-type) | Invoice discount field disabled for inclusive tax type | Invoice validation | P2 | Regression | Auto-UI | Active |  |
| [INV-008](#-inv-008--create-invoice-with-multiple-line-items) | ★ Create invoice with multiple line items | Create invoice | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [INV-009](#inv-009--invoice-create---required-field-validation-apartment--item-description--category) | Invoice create - required field validation (apartment / item description / category) | Invoice validation | P3 | Regression | Auto-UI | Active | 3 |
| [INV-010](#inv-010--invoice-create---zero-unit--gross-price-rejected) | Invoice create - zero Unit / Gross price rejected | Invoice validation | P3 | Regression | Auto-UI | Active | 2 |
| [INV-011](#inv-011--invoice-create---negative-unit--gross-price-not-accepted) | Invoice create - negative Unit / Gross price not accepted | Invoice validation | P3 | Regression | Auto-UI | Active | 2 |
| [INV-012](#inv-012--invoice-accepts-max-gross-price-14-integer-digits--2-decimals) | Invoice accepts max gross price (14 integer digits + 2 decimals) | Invoice validation | P2 | Regression | Auto-UI | Active |  |
| [INV-013](#inv-013--invoice-rejects-gross-price-99999999999999-amount-exceeded-limit) | Invoice rejects gross price 99,999,999,999,999 (amount exceeded limit) | Invoice validation | P2 | Regression | Auto-UI | Active |  |
| [INV-014](#inv-014--invoice-total-calculation-correct-up-to-17-combined-digits-unit-x-gross-price) | Invoice total calculation correct up to 17 combined digits (Unit x Gross price) | Invoice validation | P2 | Regression | Auto-UI | Review |  |
| [INV-015](#inv-015--invoice-accepts-minimum-gross-price-01-mmk) | Invoice accepts minimum gross price 0.1 MMK | Invoice validation | P2 | Regression | Auto-UI | Review |  |
| [INV-016](#inv-016--delete-draft-invoice) | Delete draft invoice | Delete invoice | P2 | Regression | Auto-UI | Active |  |
| [INV-017](#-inv-017--approve-invoice---ref-number-tax-included-unpaid-in-apartment) | ★ Approve invoice - ref number, tax included, unpaid in apartment | Approve invoice | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [INV-018](#inv-018--enter-key-does-not-submit-the-invoice-create-form) | Enter key does not submit the invoice create form | Invoice validation | P3 | Regression | Auto-UI | Active |  |
| [INV-019](#inv-019--invoice-number-generation-continues-beyond-6-digits) | Invoice number generation continues beyond 6 digits | Document numbering | P3 | Regression | Manual | Review |  |
| [INV-020](#-inv-020--create-debit-note-mmk-dated-last-month-to-today-as-draft) | ★ Create debit note (MMK, dated last month to today) as draft | Create debit note | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [INV-021](#inv-021--debit-note-date-cannot-be-a-future-date) | Debit note date cannot be a future date | Debit note validation | P2 | Regression | Auto-UI | Active |  |
| [INV-022](#inv-022--debit-note-create---required-field-validation-apartment--item-description--category) | Debit note create - required field validation (apartment / item description / category) | Debit note validation | P3 | Regression | Auto-UI | Active | 3 |
| [INV-023](#inv-023--debit-note-create---zero-unit--gross-price-rejected) | Debit note create - zero Unit / Gross price rejected | Debit note validation | P3 | Regression | Auto-UI | Active | 2 |
| [INV-024](#inv-024--debit-note-create---negative-unit--gross-price-not-accepted) | Debit note create - negative Unit / Gross price not accepted | Debit note validation | P3 | Regression | Auto-UI | Active | 2 |
| [INV-025](#inv-025--debit-note-accepts-max-gross-price-14-integer-digits--2-decimals) | Debit note accepts max gross price (14 integer digits + 2 decimals) | Debit note validation | P2 | Regression | Auto-UI | Active |  |
| [INV-026](#inv-026--debit-note-rejects-gross-price-99999999999999-amount-exceeded-limit) | Debit note rejects gross price 99,999,999,999,999 (amount exceeded limit) | Debit note validation | P2 | Regression | Auto-UI | Active |  |
| [INV-027](#inv-027--debit-note-total-calculation-correct-up-to-17-combined-digits) | Debit note total calculation correct up to 17 combined digits | Debit note validation | P2 | Regression | Auto-UI | Review |  |
| [INV-028](#inv-028--debit-note-accepts-minimum-gross-price-001-mmk) | Debit note accepts minimum gross price 0.01 MMK | Debit note validation | P2 | Regression | Auto-UI | Review |  |
| [INV-029](#-inv-029--debit-note-due-date--issue-date--payment-term-ar-overdue-based-on-due-date) | ★ Debit note due date = issue date + payment term; AR overdue based on due date | Create debit note | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [INV-030](#inv-030--delete-draft-debit-note) | Delete draft debit note | Delete debit note | P2 | Regression | Auto-UI | Active |  |
| [INV-031](#-inv-031--approve-debit-note---ref-number-unpaid-in-apartment) | ★ Approve debit note - ref number, unpaid in apartment | Approve debit note | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [INV-032](#inv-032--enter-key-does-not-submit-the-debit-note-create-form) | Enter key does not submit the debit note create form | Debit note validation | P3 | Regression | Auto-UI | Active |  |
| [INV-033](#inv-033--debit-note-number-generation-continues-beyond-6-digits) | Debit note number generation continues beyond 6 digits | Document numbering | P3 | Regression | Manual | Review |  |
| [INV-034](#inv-034--export-invoicedebit-note-list-to-excel-respects-filters) | Export Invoice/Debit Note list to Excel (respects filters) | Inv/DN listing | P2 | Regression | Auto-UI+API | Active |  |
| [INV-035](#inv-035--filter-invoicedebit-note-list-by-date-range-building-apartment-currency-reset) | Filter Invoice/Debit Note list by date range, building, apartment, currency; reset | Inv/DN listing | P2 | Regression | Auto-UI | Active |  |
| [INV-036](#inv-036--invoicedebit-note-list-shows-expected-columns-and-amounts) | Invoice/Debit Note list shows expected columns and amounts | Inv/DN listing | P2 | Regression | Auto-UI | Active |  |
| [INV-037](#inv-037--view-invoicedebit-note-detail-and-viewdownload-pdf) | View Invoice/Debit Note detail and view/download PDF | Inv/DN listing | P2 | Regression | Auto-UI+API | Active |  |
<!-- /generated:summary -->

## Test cases

### Create invoice

#### ★ INV-001 · Create generic invoice (MMK, dated last month to today) as draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Invoice-Debit Note r5 (TC_Inv_001) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Tax type = "+3%tax"
6. Unit = 2
7. Gross price = 1500
8. Discount = 10 %

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

1. "Invoice is successfully issued" message will be shown
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

### Invoice validation

#### INV-002 · Invoice date cannot be a future date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r6 (TC_Inv_002) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Tax type = "+3%tax"
6. Unit = 2
7. Gross price = 1500
8. Discount = 10 %

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK
4. Select future date in Date Field.

**Expected result:**

The system does not allow creating invoices with future dates, so dates are bound and users can't select the future days  

---

### Create invoice

#### ★ INV-003 · Invoice due date = issue date + payment term; AR overdue based on due date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Invoice-Debit Note r7 (TC_Inv_003) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Date = "1.6.2025"
4. Payment terms = "+7days"
5. Item Description = "Maintenance fees"
6. Tax type = "+3%tax"
7. Unit = 2
8. Gross price = 1500
9. Discount = 10 %

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

1. When the invoice is approved, the due date should be 8.6.2025.
2. The overdue date will be calculated in AR based on the due date

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

### Invoice validation

#### INV-004 · Invoice percentage discount max 99% (100%/120% rejected)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r8 (TC_Inv_004) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Date = "1.6.2025"
4. Payment terms = "+7days"
5. Item Description = "Maintenance fees"
6. Tax type = "+3%tax"
7. Unit = 2
8. Gross price = 1500
9. Discount = 99 % (or) 100% (or) 120%

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
5. Fill the required fields
6. Click "Create" button

**Expected result:**

1. The system does not allow you to create an invoice with a discount amount greater than 99.
2. If you enter a discount amount greater than 99, the system will auto clear it.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

#### INV-005 · Invoice percentage discount rejects decimal value

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r9 (TC_Inv_005) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Date = "1.6.2025"
4. Payment terms = "+7days"
5. Item Description = "Maintenance fees"
6. Tax type = "+3%tax"
7. Unit = 2
8. Gross price = 1500
9. Discount = 15.55 %

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

1. The system does not allow you to create an invoice with a discount percentage with a point number.
2. If you enter a discount amount with point value, the system will auto-clear it.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

#### INV-006 · Invoice fixed discount cannot be >= gross price

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r10 (TC_Inv_006) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Date = "1.6.2025"
4. Payment terms = "+7days"
5. Item Description = "Maintenance fees"
6. Tax type = "+3%tax"
7. Unit = 2
8. Gross price = 1500
9. Discount = 1500 (or) 1600

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

1. The system does not allow you to create an invoice with discount amounts equal to/greater than the gross price
2. If you enter discount amounts equal to/greater than the gross price, the system will auto clear it.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

#### INV-007 · Invoice discount field disabled for inclusive tax type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r11 (TC_Inv_007) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Date = "1.6.2025"
4. Payment terms = "+7days"
5. Item Description = "Maintenance fees"
6. Tax type = "Incl. 5% Tax"
7. Unit = 2
8. Gross price = 1500

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional. )
6. Click "Create" button

**Expected result:**

The system will disable the discount field, and they will not be able to enter an amount.  

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

### Create invoice

#### ★ INV-008 · Create invoice with multiple line items

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Invoice-Debit Note r12 (TC_Inv_008) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Date = "1.6.2025"
4. Payment terms = "+7days"
5. For Item 1,
   Item Description = "Maintenance fees"
   Tax type = "Incl. 5% Tax"  
   Unit = 2  
   Gross price = 1500  
6. For Iteam 2,
   Item Description = "Maintenance fees"
   Tax type = "3% Tax"  
   Unit = 1  
   Gross price = 15000  

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Add blank Line" button and fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
7. Fill the required fields.
8. Click "Create" button

**Expected result:**

1. "Invoice is successfully issued" message will be shown
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

### Invoice validation

#### INV-009 · Invoice create - required field validation (apartment / item description / category)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Invoice-Debit Note r13 (TC_Inv_009) |

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

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields but do not fill apartment.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

"Apartment is required" error message will be shown under the apartment box.  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Error message for not filling apartment fields in invoices. | Invoice-Debit Note r13 (TC_Inv_009) | |
| 2 | Missing field=Item description | Invoice-Debit Note r14 (TC_Inv_010) |  |
| 3 | Missing field=Income category | Invoice-Debit Note r15 (TC_Inv_011) |  |

---

#### INV-010 · Invoice create - zero Unit / Gross price rejected

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Invoice-Debit Note r16 (TC_Inv_012) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Tax type = "+3%tax"
6. Unit = 0
7. Gross price = 1500
8. Discount = 10 ks

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields and fill 0 unit.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

"The selected Unit is invalid." error message alert will be shown.  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Error message for filling 0 unit in invoices | Invoice-Debit Note r16 (TC_Inv_012) | |
| 2 | Field=Gross price (0) | Invoice-Debit Note r18 (TC_Inv_014) |  |

---

#### INV-011 · Invoice create - negative Unit / Gross price not accepted

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Invoice-Debit Note r17 (TC_Inv_013) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Tax type = "+3%tax"
6. Unit = (-11)
7. Gross price = 1500
8. Discount = 10 ks

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today (default).
4. Fill the required fields and fill minus sign (-) unit.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

The system does not allow minus,so it does not appear in the feild  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't create with minus sign(-) unit in invoice | Invoice-Debit Note r17 (TC_Inv_013) | |
| 2 | Field=Gross price (-1000) | Invoice-Debit Note r19 (TC_Inv_015) |  |

---

#### INV-012 · Invoice accepts max gross price (14 integer digits + 2 decimals)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r20 (TC_Inv_016) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Tax type = "+3%tax"
6. Unit = 200
7. Gross price = 12,345,678,901,234.56
8. Discount = 10 ks

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

1. "Invoice is successfully issued" message will be shown
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

#### INV-013 · Invoice rejects gross price 99,999,999,999,999 (amount exceeded limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r21 (TC_Inv_017) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Tax type = "+3%tax"
6. Unit = 200
7. Gross price = 99,999,999,999,999
8. Discount = 10 ks

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit." error message will be shown.

---

#### INV-014 · Invoice total calculation correct up to 17 combined digits (Unit x Gross price)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Expected accepts wrong calculation above 17 digits; no validation defined | Invoice-Debit Note r22 (TC_Inv_018) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Unit = 22,222,222
6. Gross price = 111,111,111
7. Discount = 10 ks

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

1. The system can correctly calculate the sum of the unit and gross prices up to 17 digits.
2. If it is more than 17 digits, it will not be calculated correctly.

---

#### INV-015 · Invoice accepts minimum gross price 0.1 MMK

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Invoice min 0.1 vs DN min 0.01; GT Aug-2025 remark asks "0.1 or 0.01" | Invoice-Debit Note r23 (TC_Inv_019) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Tax type = "+3%tax"
6. Unit = 200
7. Gross price = 0.1/greater than 0
8. Discount = 10 ks

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Create" button

**Expected result:**

1. "Invoice is successfully created" message will be shown
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

### Delete invoice

#### INV-016 · Delete draft invoice

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Source expected calls success msg an "error message" | Invoice-Debit Note r24 (TC_Inv_020) |

**Preconditions:**

User must  
have the permission.  

**Steps:**

1. Click "Inv/Dn" on the top
2. Choose one of the invoice.
3. Click "Manage" button
4. Check the data
5. Click "Remove" button

**Expected result:**

1. "Invoice is deleted successfully"
   error message will be shown

---

### Approve invoice

#### ★ INV-017 · Approve invoice - ref number, tax included, unpaid in apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Invoice-Debit Note r25 (TC_Inv_021) |

**Preconditions:**

User must have the permission.  

**Steps:**

1. Click "Inv/Dn" on the top
2. Choose one of the invoice.
3. Click "Manage" button
4. Check the data
5. Click "Approve" button

**Expected result:**

1. Invoice approved successfully with ref number
2. Commercial tax will be included
   in the invoice
3. In the apartment, invoice will be shown with unpaid status

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

### Invoice validation

#### INV-018 · Enter key does not submit the invoice create form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Invoice-Debit Note r26 (TC_Inv_022) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Payment terms = "+7days"
4. Item Description = "Maintenance fees"
5. Tax type = "+3%tax"
6. Unit = 2
7. Gross price = 1500
8. Discount = 10 ks

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Add invoice" button
3. Currency will be MMK and Date will be today.(default)
4. Fill the required fields.
5. Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.)
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create Invoice function.  

---

### Document numbering

#### INV-019 · Invoice number generation continues beyond 6 digits

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Manual — Needs 100k+ invoices volume; no steps defined | Review — Comment "Need to check"; no steps | Invoice-Debit Note r27 (TC_Inv_023) |

**Preconditions:**

1. User needs to login the system first.
2. You can only check when the number of created invoices is greater than and equal to 6 digits.

**Expected result:**

The system can generate an unlimited number for the invoice number.  

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

> **Source comments:** Need to check

---

### Create debit note

#### ★ INV-020 · Create debit note (MMK, dated last month to today) as draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Invoice-Debit Note r29 (TC_Inv_024) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = 150
6. Gross price = 1500

**Steps:**

1. Click "Dashboard / Debit Note" from left menu.
2. Click "Add Debit Note" button
3. Fill the required fields.
4. Currency will be MMK and Date will be today.(default)
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

1. "debit note has been create successfully" message will be shown
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

### Debit note validation

#### INV-021 · Debit note date cannot be a future date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r30 (TC_Inv_025) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = 150
6. Gross price = 1500

**Steps:**

1. Click "Dashboard / Debit Note" from left menu.
2. Click "Add Debit Note" button
3. Currency will be MMK
4. Fill the required fields and select future date.
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

The system does not allow creating invoices with future dates, so dates are bound and users can't select these days..  

---

#### INV-022 · Debit note create - required field validation (apartment / item description / category)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Invoice-Debit Note r31 (TC_Inv_026) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Categories = "Internet"
2. Payment terms = "+15days"
3. Item Description = "To pay bill"
4. Unit = 150
5. Gross price = 1500

**Steps:**

1. Click "Dashboard / Debit Note" from left menu.
2. Click "Add Debit Note" button.
3. Currency will be MMK and Date will be today.(default).
4. Fill the required fields but not fill apartment
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

"Apartment is required" error message will be shown under the apartment box.  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Error message for not filling apartment fields in debit notes. | Invoice-Debit Note r31 (TC_Inv_026) | |
| 2 | Missing field=Item description | Invoice-Debit Note r32 (TC_Inv_027) |  |
| 3 | Missing field=Income category | Invoice-Debit Note r33 (TC_Inv_028) | Source data lists Category but omits Apartment |

---

#### INV-023 · Debit note create - zero Unit / Gross price rejected

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active — Msg "Unit is required" differs from invoice "Unit is invalid" | Invoice-Debit Note r34 (TC_Inv_029) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = 0
6. Gross price = 1500

**Steps:**

1. Click "Dashboard / Debit Note" from left menu.
2. Click "Add Debit Note" button.
3. Currency will be MMK and Date will be today.(default).
4. Fill the required fields and fill unit is 0.
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

"Unit is required." error message alert will be shown.  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Error message for filling 0 unit in debit notes | Invoice-Debit Note r34 (TC_Inv_029) | |
| 2 | Field=Gross price (0) | Invoice-Debit Note r36 (TC_Inv_031) |  |

---

#### INV-024 · Debit note create - negative Unit / Gross price not accepted

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Invoice-Debit Note r35 (TC_Inv_030) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = -1
6. Gross price = 1500

**Steps:**

1. Click "Dashboard / Debit Note" from left menu.
2. Click "Add Debit Note" button.
3. Currency will be MMK and Date will be today.(default).
4. Fill the required fields and fill unit is -1.
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

The system does not allow minus,so it does not appear in the feild  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't create with minus sign(-) unit in debit notes | Invoice-Debit Note r35 (TC_Inv_030) | |
| 2 | Field=Gross price (-1000) | Invoice-Debit Note r37 (TC_Inv_032) |  |

---

#### INV-025 · Debit note accepts max gross price (14 integer digits + 2 decimals)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r38 (TC_Inv_033) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = 1
6. Gross price = "12,345,678,901,234.56"

**Steps:**

1. Click "Invoice / Debit Note" from left menu.
2. Click "Add Debit Note" button.
3. Currency will be MMK and Date will be today.(default).
4. Fill the required fields
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

1. "Debit notes is successfully issued" message will be shown
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

#### INV-026 · Debit note rejects gross price 99,999,999,999,999 (amount exceeded limit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r39 (TC_Inv_034) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = 1
6. Gross price = 99,999,999,999,999

**Steps:**

1. Click "Invoice / Debit Note" from left menu.
2. Click "Add Debit Note" button.
3. Currency will be MMK and Date will be today.(default).
4. Fill the required fields
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

1. The system does not allow to create with value 99999999999999.00 .
2. "Amount exceeded maximum limit" error message will be shown.

---

#### INV-027 · Debit note total calculation correct up to 17 combined digits

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Expected accepts wrong calculation above 17 digits; no validation defined | Invoice-Debit Note r40 (TC_Inv_035) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = 22,222,222
6. Gross price = 111,111,111

**Steps:**

1. Click "Invoice / Debit Note" from left menu.
2. Click "Add Debit Note" button.
3. Currency will be MMK and Date will be today.(default).
4. Fill the required fields
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

1. The system can correctly calculate the sum of the unit and gross prices up to 17 digits.
2. If it is more than 17 digits, it will not be calculated correctly.

---

#### INV-028 · Debit note accepts minimum gross price 0.01 MMK

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — DN min 0.01 vs invoice min 0.1; GT remark open question | Invoice-Debit Note r41 (TC_Inv_036) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = 1
6. Gross price = 0.01

**Steps:**

1. Click "Invoice / Debit Note" from left menu.
2. Click "Add Debit Note" button.
3. Currency will be MMK and Date will be today.(default).
4. Fill the required fields
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

1. "Debit notes is successfully issued" message will be shown
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

### Create debit note

#### ★ INV-029 · Debit note due date = issue date + payment term; AR overdue based on due date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Invoice-Debit Note r42 (TC_Inv_037) |

**Preconditions:**

User needs to login the system first.  

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Maintenance Services"
3. Date = "1.6.2025"
4. Payment terms = "+7days"
5. Item Description = "Maintenance fees"
6. Unit = 2
7. Gross price = 1500

**Steps:**

1. Click "Dashboard / Debit Note" from left menu.
2. Click "Add Debit Note" button
3. Fill the required fields.
4. Currency will be MMK and Date will be today.(default)
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Create" button

**Expected result:**

1. When the invoice is approved, the due date should be 8.6.2025.
2. The overdue date will be calculated in AR based on the due date

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

### Delete debit note

#### INV-030 · Delete draft debit note

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Source expected calls success msg an "error message" | Invoice-Debit Note r43 (TC_Inv_038) |

**Preconditions:**

User must  
have the permission.  

**Steps:**

1. Click "Inv/Dn" on the top
2. Choose one of the debit note.
3. Click "Manage" button
4. Check the data.
5. Click "Delete" button

**Expected result:**

1. "Debit notes is deleted successfully"
   error message will be shown

---

### Approve debit note

#### ★ INV-031 · Approve debit note - ref number, unpaid in apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Invoice-Debit Note r44 (TC_Inv_039) |

**Preconditions:**

User must  
have the permission.  

**Steps:**

1. Click "Inv/Dn" on the top
2. Choose one of the invoice.
3. Click "Manage" button
4. Check the data.
5. Click "Approve" button

**Expected result:**

1. Debit note (DN) approved successfully with ref number
2. In the apartment, debit note (DN) will be shown with unpaid status

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

---

### Debit note validation

#### INV-032 · Enter key does not submit the debit note create form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Invoice-Debit Note r45 (TC_Inv_040) |

**Preconditions:**

1. User needs to login the system first.

**Test data:**

1. Apartment = "A1 -205"
2. Categories = "Internet"
3. Payment terms = "+15days"
4. Item Description = "To pay bill"
5. Unit = 150
6. Gross price = 1500

**Steps:**

1. Click "Dashboard / Debit Note" from left menu.
2. Click "Add Debit Note" button
3. Fill the required fields.
4. Currency will be MMK and Date will be today.(default)
5. Total depends on unit, Gross price. It will be calculated automatically .
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create debit note function.  

---

### Document numbering

#### INV-033 · Debit note number generation continues beyond 6 digits

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Manual — Needs 100k+ debit notes volume | Review — Comment "Need to check" | Invoice-Debit Note r46 (TC_Inv_041) |

**Preconditions:**

1. User needs to login the system first.
2. You can only check when the number of created debit note is greater than or equal to the 6 digits.

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Check if the Invoices / Debit Note list is not showing.
3. Check the count of debit note number

**Expected result:**

The system can generate an unlimited number for debit note numbers.  

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. Apartment - summary amount , Invoices list, SOA report
5. Contact - summary amount, Unpaid Invoices list
6. Report - Invoices list

> **Source comments:** Need to check

---

### Inv/DN listing

#### INV-034 · Export Invoice/Debit Note list to Excel (respects filters)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Invoice-Debit Note r47 (TC_Inv_042) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Click "Excel" button.

**Expected result:**

The system will generate the Invoices/Debit Notes with Excel format according to the filter applied results.  

---

#### INV-035 · Filter Invoice/Debit Note list by date range, building, apartment, currency; reset

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r48 (TC_Inv_043) |

**Preconditions:**

1. User needs to login the system first.

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. Use (Date Range, Building, Apartment and Currency) filters to filter the data you want to see.
3. Click "Reset" button to reset the filter.

**Expected result:**

If the filter is applied, the Invoice/Debit Note regarding to the filter result will be shown.  

---

#### INV-036 · Invoice/Debit Note list shows expected columns and amounts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Invoice-Debit Note r49 (TC_Inv_044) |

**Preconditions:**

1. User needs to login the system first.
2. There is at least one created Invoice/Debit Note.

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. In Listing, Check the data.

**Expected result:**

In Invoice/Debit Note Listing,  
Invoice Number(Inv) / Debit Note (DN)  
Co.Ref Number  
Related Apartment  
Category  
Total Amount filled in Inv/DN create form  
Paid Amount of this Inv/DN (this field will only show after making payment. If not, only show 0)  
Due Amount  
Date (Inv/DN created Date)  
Created By  

---

#### INV-037 · View Invoice/Debit Note detail and view/download PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Invoice-Debit Note r50 (TC_Inv_045) |

**Preconditions:**

1. User needs to login the system first.
2. There is at least one created Invoice and Debit Note.

**Steps:**

1. Click "Invoices / Debit Note" from left menu.
2. In Listing, click one of the Invoice.
3. Click "Manage" button.

**Expected result:**

You can see Invoice(or)Debit note voucher with full data, and you can view or download pdf file by clicking "View PDF" / "Download PDF"  

---
