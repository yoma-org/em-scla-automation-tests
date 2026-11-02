# 23 · Settings (master data & configuration)

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 50 (+24 data-variant rows)  
**Priority:** P1 3 · P2 43 · P3 4 · **★ Critical:** 3 · **Smoke:** 1 · **E2E:** 18 · **Auto:** 50 · **Manual:** 0 · **Review:** 4

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [SET-001](#set-001--enable-old-coref-no-and-verify-field-appears-on-new-invoicedebit-note-form) | Enable Old CoRef No and verify field appears on new invoice/debit note form | General setting | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-002](#set-002--disable-old-coref-no-and-verify-field-is-hidden-on-new-invoicedebit-note-form) | Disable Old CoRef No and verify field is hidden on new invoice/debit note form | General setting | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-003](#-set-003--edit-uo-pricing-unit-price-and-verify-new-uo-invoices-are-charged-at-the-new-rate) | ★ Edit UO pricing unit price and verify new UO invoices are charged at the new rate | UO pricing | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [SET-004](#-set-004--reject-negative-unit-price-when-editing-uo-pricing) | ★ Reject negative unit price when editing UO pricing | UO pricing | P1 | Regression | Auto-UI | Active |  |
| [SET-005](#set-005--sort-list-columns-ascendingdescending--by-setting-entity) | Sort list columns ascending/descending — by setting entity | List sorting | P3 | Regression | Auto-UI | Active | 8 |
| [SET-006](#set-006--add-parent-income-category-and-verify-it-appears-in-invoicedncredit-note-forms) | Add parent income category and verify it appears in invoice/DN/credit note forms | Income category | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-007](#set-007--create-fund-type-income-category-verify-it-appears-only-in-funding-received-form) | Create Fund-type income category; verify it appears only in Funding Received form | Income category | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-008](#set-008--add-child-income-category-under-a-parent-category) | Add child income category under a parent category | Income category | P2 | Regression | Auto-UI | Active |  |
| [SET-009](#set-009--reorder-parent-categories-by-drag-and-drop--by-category-type) | Reorder parent categories by drag and drop — by category type | Category sorting | P3 | Regression | Auto-UI | Active | 2 |
| [SET-010](#set-010--reorder-categories-via-sort-number-in-edit-form--by-category-type-and-level) | Reorder categories via sort number in edit form — by category type and level | Category sorting | P3 | Regression | Auto-UI | Active | 4 |
| [SET-011](#set-011--enter-key-does-not-submit-the-create-form--by-setting-entity) | Enter key does not submit the create form — by setting entity | Form submit guard | P3 | Regression | Auto-UI | Active | 10 |
| [SET-012](#set-012--disable-income-category-and-verify-it-is-hidden-in-new-invoice-form) | Disable income category and verify it is hidden in new invoice form | Income category | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-013](#set-013--add-parent-expense-category-and-verify-it-appears-in-cash-outflow-form-only) | Add parent expense category and verify it appears in Cash Outflow form only | Expense category | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-014](#set-014--add-child-expense-category-under-a-parent-category) | Add child expense category under a parent category | Expense category | P2 | Regression | Auto-UI | Active |  |
| [SET-015](#set-015--disable-expense-category-and-verify-it-is-hidden-in-cash-outflow-form) | Disable expense category and verify it is hidden in Cash Outflow form | Expense category | P2 | E2E · Regression | Auto-UI | Review |  |
| [SET-016](#set-016--add-currency-from-default-currency-list-codesymbol-auto-filled) | Add currency from default currency list (code/symbol auto-filled) | Currency | P2 | Regression | Auto-UI | Active |  |
| [SET-017](#set-017--add-custom-currency-type-others) | Add custom currency type ("Others") | Currency | P2 | Regression | Auto-UI | Active |  |
| [SET-018](#set-018--disable-currency-hidden-from-transaction-forms-but-kept-in-reports) | Disable currency; hidden from transaction forms but kept in reports | Currency | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-019](#set-019--default-currency-namecodesymbol-cannot-be-edited-status-only) | Default currency name/code/symbol cannot be edited (status only) | Currency | P2 | Regression | Auto-UI | Active |  |
| [SET-020](#set-020--edit-custom-currency-name-code-and-symbol) | Edit custom currency name, code and symbol | Currency | P2 | Regression | Auto-UI | Active |  |
| [SET-021](#set-021--add-payment-method-and-verify-it-appears-in-bank-account-create-form) | Add payment method and verify it appears in bank account create form | Payment method | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-022](#set-022--edit-payment-method) | Edit payment method | Payment method | P2 | Regression | Auto-UI | Active |  |
| [SET-023](#set-023--disable-payment-method-hidden-from-transaction-forms-but-kept-in-reports) | Disable payment method; hidden from transaction forms but kept in reports | Payment method | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-024](#set-024--add-account-type) | Add account type | Account type | P2 | Regression | Auto-UI | Active |  |
| [SET-025](#set-025--edit-account-type) | Edit account type | Account type | P2 | Regression | Auto-UI | Active |  |
| [SET-026](#set-026--disable-account-type-and-verify-it-is-hidden-in-cash--bank-account-form) | Disable account type and verify it is hidden in Cash & Bank account form | Account type | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-027](#set-027--add-bank) | Add bank | Bank | P2 | Regression | Auto-UI | Active |  |
| [SET-028](#set-028--edit-bank) | Edit bank | Bank | P2 | Regression | Auto-UI | Active |  |
| [SET-029](#set-029--disable-bank-and-verify-it-is-hidden-in-cash--bank-account-form) | Disable bank and verify it is hidden in Cash & Bank account form | Bank | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-030](#set-030--add-location-with-status) | Add location with status | Location | P2 | Regression | Auto-UI | Active |  |
| [SET-031](#set-031--edit-location) | Edit location | Location | P2 | Regression | Auto-UI | Active |  |
| [SET-032](#set-032--disable-location-and-verify-it-is-hidden-in-cash-received-location-selector) | Disable location and verify it is hidden in Cash Received location selector | Location | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-033](#set-033--search-master-data-list-by-namestatus--by-entity) | Search master data list by name/status — by entity | List search | P2 | Regression | Auto-UI | Review | 3 |
| [SET-034](#set-034--add-zone-with-status) | Add zone with status | Zone | P2 | Regression | Auto-UI | Active |  |
| [SET-035](#set-035--edit-zone) | Edit zone | Zone | P2 | Regression | Auto-UI | Active |  |
| [SET-036](#set-036--disable-zone-and-verify-it-is-hidden-in-buildingapartment-create-forms) | Disable zone and verify it is hidden in building/apartment create forms | Zone | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-037](#set-037--add-building-with-zone-and-status) | Add building with zone and status | Building | P2 | Regression | Auto-UI | Active |  |
| [SET-038](#set-038--edit-building-change-zone) | Edit building (change zone) | Building | P2 | Regression | Auto-UI | Active |  |
| [SET-039](#set-039--disable-building-and-verify-it-is-hidden-in-apartment-create-form) | Disable building and verify it is hidden in apartment create form | Building | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-040](#set-040--add-staff-user-with-type-and-status) | Add staff user with type and status | Staff | P2 | Regression | Auto-UI | Active |  |
| [SET-041](#set-041--edit-staff-user-details) | Edit staff user details | Staff | P2 | Regression | Auto-UI | Active |  |
| [SET-042](#set-042--search-staff-list-by-name-email-type-status) | Search staff list by name, email, type, status | Staff | P2 | Regression | Auto-UI | Review |  |
| [SET-043](#set-043--user-deactivates-own-account-and-is-logged-out-of-all-sessions) | User deactivates own account and is logged out of all sessions | Staff account status | P2 | Regression | Auto-UI | Active |  |
| [SET-044](#set-044--adminsetting-edit-user-deactivates-and-reactivates-another-account) | Admin/setting-edit user deactivates and reactivates another account | Staff account status | P2 | Regression | Auto-UI | Active |  |
| [SET-045](#set-045--setting-view-only-user-deactivating-an-account-permission-check) | Setting-view-only user deactivating an account (permission check) | Staff account status | P2 | Regression | Auto-UI | Review |  |
| [SET-046](#set-046--notification-draft-count-limited-to-permitted-categories) | Notification draft count limited to permitted categories | Notifications | P2 | E2E · Regression | Auto-UI | Active |  |
| [SET-047](#set-047--admin-changes-another-account-password-target-logged-out-new-password-required) | Admin changes another account password; target logged out, new password required | Password management | P2 | Regression | Auto-UI | Active | 2 |
| [SET-048](#set-048--user-changes-own-password-session-stays-active-new-password-needed-next-login) | User changes own password; session stays active, new password needed next login | Password management | P2 | Regression | Auto-UI | Active | 2 |
| [SET-049](#set-049--non-admin-user-cannot-edit-or-change-an-admin-password) | Non-admin user cannot edit or change an admin password | Password management | P2 | Regression | Auto-UI | Active |  |
| [SET-050](#-set-050--create-role-with-permissions-and-categories-assigned-user-is-limited-to-them) | ★ Create role with permissions and categories; assigned user is limited to them | Role | P1 | E2E · Regression | Auto-UI+API | Active |  |
<!-- /generated:summary -->

## Test cases

### General setting

#### SET-001 · Enable Old CoRef No and verify field appears on new invoice/debit note form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r5 (TC_Setting_01) |

**Preconditions:**

User need to  
login the System first.  

**Steps:**

1. Click "Setting" from Left Menu and then click
   General setting Menu.
2. Select "Enable" of Old CoRef.
3. Click "Submit" button.

**Expected result:**

Old CoRef No will be  
appeared in add new invoice and new debit note form  

**Check areas:**

1. Invoice/Debit Note create form ,
2. Every Invoice/Debit Note detail page and pdf file

---

#### SET-002 · Disable Old CoRef No and verify field is hidden on new invoice/debit note form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r6 (TC_Setting_02) |

**Preconditions:**

User need to  
login the System first.  

**Steps:**

1. Click "Setting" from Left Menu and then click
   General setting Menu.
2. Select "Disable" of Old CoRef.
3. Click "Submit" button.

**Expected result:**

Old CoRef No will be  
disappeared in add new invoice and new debit note form  

**Check areas:**

1. Invoice/Debit Note create form ,
2. Every Invoice/Debit Note detail page and pdf file

---

### UO pricing

#### ★ SET-003 · Edit UO pricing unit price and verify new UO invoices are charged at the new rate

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Setting r13 (TC_Setting_03) |

**Scenario group:** UO pricing

**Preconditions:**

User need to login the System first.  

**Test data:**

1. UO Pricing Name =
   "Electricity (YESC)"
2. Unit price = "250"

**Steps:**

1. Click "Setting" from Left Menu and then click UO Pricing Menu.
2. In UO Pricing List, select one of the data.
3. Click "Edit" button.
4. In Edit form, UO Pricing name cannot be edited.
5. "Unit Price" can be edited.
6. Click "Update" button

**Expected result:**

1. After editing the unit price for UO Pricing data, the updated price can be seen in the UO Pricing list.
2. When creating a new UO invoice, it will be charged with these units.

**Check areas:**

1. Every UO invoice detail page and pdf file

---

#### ★ SET-004 · Reject negative unit price when editing UO pricing

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI | Active | Setting r14 (TC_Setting_04) |

**Scenario group:** UO pricing

**Preconditions:**

User need to login  
the System first.  

**Test data:**

1. UO Pricing Name =
   "Electricity (Generator)"
2. Unit price = "-1500"

**Steps:**

1. Click "Setting" from Left Menu and then click UO Pricing Menu.
2. In UO Pricing List, select one of the data.
3. Click "Edit" button.
4. In Edit form, UO Pricing name cannot be edited.
5. "Unit Price" can be edited.
6. Click "Update" button

**Expected result:**

1. Unit price will not be changed.

---

### List sorting

#### SET-005 · Sort list columns ascending/descending — by setting entity

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Setting r15 (TC_Setting_05) |

**Scenario group:** UO pricing

**Preconditions:**

User need to login the System first and System must have at least two UO Pricing data.  

**Steps:**

1. Click "Setting" from Left Menu and then click UO Pricing Menu.
2. For Name and Unit Price column data, Name can be ordered alphabetically and Unit Price can be ordered by value in ascending and descending order.

**Expected result:**

1. After ordering the Name or Unit Price data , ordered data can be seen.

**Data variants (8 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can order the UO Pricing Data in ascending/descending order. | Setting r15 (TC_Setting_05) | |
| 2 | Entity=Currency | Setting r49 (TC_Setting_27) |  |
| 3 | Entity=Payment method | Setting r54 (TC_Setting_32) |  |
| 4 | Entity=Account type | Setting r59 (TC_Setting_37) |  |
| 5 | Entity=Bank | Setting r64 (TC_Setting_42) |  |
| 6 | Entity=Zone | Setting r87 (TC_Setting_53) |  |
| 7 | Entity=Building | Setting r99 (TC_Setting_59) |  |
| 8 | Entity=Staff | Setting r109 (TC_Setting_63) |  |

---

### Income category

#### SET-006 · Add parent income category and verify it appears in invoice/DN/credit note forms

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r22 (TC_Setting_06) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. name = "Parent Category"

**Steps:**

1. Click "Setting" from Left Menu and then click Income Categories Menu.
2. In new Income Categories form, Fill the category name.
3. Click "Submit" button

**Expected result:**

1. After adding the new Income category , new catagory as parent can be seen in the list.
2. Income Category will be
   appeared in Invoice/debit note and credit not created form.

**Check areas:**

1. Account Receivable - Categories filter
2. Invoice/Debit Note - create form
3. Apartment - credit note create form
4. Report - Transactions , Cash Received category filter

---

#### SET-007 · Create Fund-type income category; verify it appears only in Funding Received form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r23 (TC_Setting_07) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first and need to create at lease one parent income category.  

**Steps:**

1. Click "Setting" from Left Menu and then click Income Categories Menu.
2. In new Income Categories form, Click on "Fund" radio button.
3. Status select box will be bind automatically.
4. Add the sorting number.
5. Click "Submit" button

**Expected result:**

1. Funding Categoy will be created.
2. Funding Category will be
   appeared in funding received created form only.

**Check areas:**

1. Account Receivable - Categories filter
2. Cash Received - funding received , unknown to funding assign form
3. Report - Transactions , Cash Received category filter

---

#### SET-008 · Add child income category under a parent category

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r24 (TC_Setting_08) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first and need to create at lease one parent income category.  

**Test data:**

1. name =
   "Testing Income Categories"
2. parent category=
   "Parent Category"
3. status = "Enabled"
4. sorting number = "1"

**Steps:**

1. Click "Setting" from Left Menu and then click Income Categories Menu.
2. In new Income Categories form, Fill the category name and click "Submit" button.
3. Then, one parent income category is added to the list.
4. Then click the one of the income category which need to set as child income category.
5. In income category edit form, select parent category or enter and choose the parent income category keyword.
6. Status can be changed. (Optional)
7. Add the sorting number.
8. Click "Submit" button

**Expected result:**

1. In income category list,
   the new added child income category will be seen under the respective parent income category.

**Check areas:**

1. Account Receivable - Categories filter
2. Invoice/Debit Note - create form
3. Apartment - credit note create form
   (or)
2. Cash Received - funding received , unknown to funding assign form
4. Report - Transactions , Cash Received category filter

---

### Category sorting

#### SET-009 · Reorder parent categories by drag and drop — by category type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Setting r25 (TC_Setting_09) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first and system must have at least two parent income categories.  

**Steps:**

1. Click "Setting" from Left Menu and then click Income Categories Menu.
2. In Income category list, drag and drop the parent income categories for sorting.

**Expected result:**

1. The updated sorted parent
   income category list can be seen.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can sort the parent income category by drag and drop. | Setting r25 (TC_Setting_09) | |
| 2 | Type=Expense | Setting r33 (TC_Setting_17) |  |

---

#### SET-010 · Reorder categories via sort number in edit form — by category type and level

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Setting r26 (TC_Setting_10) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first and system must have at least two parent income categories.  

**Steps:**

1. Click "Setting" from Left Menu and then click Income Categories Menu.
2. In Income category list, Choose one of the parent income categories and Click it.
3. In Edit form, edit the sort number.
4. Click "Submit" button

**Expected result:**

1. The updated sorted parent
   income category list can be seen.

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can sort the parent income category in edit form. | Setting r26 (TC_Setting_10) | |
| 2 | Type=Income; Level=Child | Setting r27 (TC_Setting_11) |  |
| 3 | Type=Expense; Level=Parent | Setting r34 (TC_Setting_18) |  |
| 4 | Type=Expense; Level=Child | Setting r35 (TC_Setting_19) |  |

---

### Form submit guard

#### SET-011 · Enter key does not submit the create form — by setting entity

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Setting r28 (TC_Setting_12) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. name = "Parent Category"

**Steps:**

1. Click "Setting" from Left Menu and then click Income Categories Menu.
2. In new Income Categories form, Fill the category name.
3. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create New Income Category function.  

**Data variants (10 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't create New Income Category by clicking the "Enter" button on the keyboard. | Setting r28 (TC_Setting_12) | |
| 2 | Entity=Expense category | Setting r32 (TC_Setting_16) |  |
| 3 | Entity=Currency | Setting r45 (TC_Setting_23) |  |
| 4 | Entity=Payment method | Setting r51 (TC_Setting_29) |  |
| 5 | Entity=Account type | Setting r56 (TC_Setting_34) |  |
| 6 | Entity=Bank | Setting r61 (TC_Setting_39) |  |
| 7 | Entity=Location | Setting r72 (TC_Setting_44) |  |
| 8 | Entity=Zone | Setting r83 (TC_Setting_49) |  |
| 9 | Entity=Building | Setting r95 (TC_Setting_55) |  |
| 10 | Entity=Staff | Setting r110 (TC_Setting_64) |  |

---

### Income category

#### SET-012 · Disable income category and verify it is hidden in new invoice form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r29 (TC_Setting_13) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first and system must have at least one income category.  

**Test data:**

1. name =
   "Testing Income Categories"
2. parent category=
   "Parent Category"
3. status = "Disabled"
4. sorting number = "1"

**Steps:**

1. Click "Setting" from Left Menu and then click Income Categories Menu.
2. In Income category list, Choose one of the child income categories and Click it.
3. In Edit form, selected income category set to disabled.
4. Click "Submit" button

**Expected result:**

1. The selected disabled income category
   cannot be seen in income categories selected box of new invoice form.

**Check areas:**

1. Account Receivable - Categories filter
2. Invoice/Debit Note - create form
3. Apartment - credit note create form
   (or)
2. Cash Received - funding received , unknown to funding assign form
4. Report - Transactions , Cash Received category filter

---

### Expense category

#### SET-013 · Add parent expense category and verify it appears in Cash Outflow form only

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r30 (TC_Setting_14) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. expense category name =
   "Payment - Testing"

**Steps:**

1. Click "Setting" from Left Menu and then click Expense Categories Menu.
2. In new Expense Categories form, Fill the category name.
3. Click "Submit" button

**Expected result:**

1. After adding the new expense category , new catagory as parent can be seen in the list.
2. Expense Category will be
   appeared in Cash Outflow created form only.

**Check areas:**

1. Account Receivable - Categories filter
2. Cash Outflow - create form
3. Report - Transactions , Cash Outflow category filter

---

#### SET-014 · Add child expense category under a parent category

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r31 (TC_Setting_15) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first and need to create at lease one parent expense category.  

**Test data:**

1. name =
   "Expense test category"
2. Parent Category =
   "Payment - Testing"
3. Status = "Enabled"
4. Sorting Number = "0"

**Steps:**

1. Click "Setting" from Left Menu and then click Expense Categories Menu.
2. In new Expense Categories form, Fill the category name and click "Submit" button
3. Then, one parent expense category is added to the list.
4. Then click the one of the expense category which need to set as child expense category.
5. In expense category edit form, select parent category or enter and choose the parent expense category keyword.
6. Status can be changed. (Optional)
7. Add the sorting number.
8. Click "Submit" button

**Expected result:**

1. In expense category list,
   the new added child expense category will be seen under the respective parent expense category.

**Check areas:**

1. Account Receivable - Categories filter
2. Cash Outflow - create form
3. Report - Transactions , Cash Outflow category filter

---

#### SET-015 · Disable expense category and verify it is hidden in Cash Outflow form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Review — Source expected says "new invoice form"; expense categories are used in Cash Outflow form | Setting r36 (TC_Setting_20) |

**Scenario group:** Income and Expense Category

**Preconditions:**

User need to  
login the System first and system must have at least one expense category.  

**Test data:**

1. name =
   "Expense test category"
2. Parent Category =
   "Payment - Testing"
3. Status = "Disabled"
4. Sorting Number = "0"

**Steps:**

1. Click "Setting" from Left Menu and then click Expense Categories Menu.
2. In Expense category list, Choose one of the child expense categories and Click it.
3. In Edit form, selected expense category set to disabled.
4. Click "Submit" button

**Expected result:**

1. The selected disabled expense category
   cannot be seen in expense categories selected box of new invoice form.

**Check areas:**

1. Account Receivable - Categories filter
2. Cash Outflow - create form
3. Report - Transactions , Cash Outflow category filter

---

### Currency

#### SET-016 · Add currency from default currency list (code/symbol auto-filled)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r43 (TC_Setting_21) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. Click "Add " button of Manage Currency.
3. Select one default currency, The currency code and symbol will be automatically generated.
4. Click "Submit" button.
5. If the currency name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After adding the new currency information, new currency information can be seen in the list.

**Check areas:**

1. Dashboard
2. Account Receivable-Currency filter
3. Invoice/Debit Note create form
4. Cash Received
5. Cash Outflow
6. Cash Transfer
7. Apartment-Summary, make payment, SOA, Wallet, Deposit
8. Contact-Summary, make payment
9. Cash & Bank Account
10. Report-Acc Statement report & detail,Invoice,transaction,cash received,cash outflow

---

#### SET-017 · Add custom currency type ("Others")

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r44 (TC_Setting_22) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. Currency Name = "Crypto"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. Click "Add " button of Manage Currency.
3. In Add Currency Form, seleted "others" in "Currencies".
4. Fill Currency informatoin.
5. Click "Submit" button.
6. If the currency name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After adding the new currency information, new currency information can be seen in the list.

**Check areas:**

1. Dashboard
2. Account Receivable-Currency filter
3. Invoice/Debit Note create form
4. Cash Received
5. Cash Outflow
6. Cash Transfer
7. Apartment-Summary, make payment, SOA, Wallet, Deposit
8. Contact-Summary, make payment
9. Cash & Bank Account
10. Report-Acc Statement report & detail,Invoice,transaction,cash received,cash outflow

---

#### SET-018 · Disable currency; hidden from transaction forms but kept in reports

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r46 (TC_Setting_24) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one currency information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. One of the currency is selected and Click "Edit" button.
3. Edit the status and click "Create" button
4. You can edit Status only

**Expected result:**

1. The disabled currency will disappear from all transaction created forms.
2. You can still view previous transactions in the report.

**Check areas:**

1. Invoice/Debit Note create form
2. Cash Received
3. Cash Outflow
4. Cash Transfer
5. Apartment-make payment, Wallet, Deposit
6. Contact-make payment
7. Cash & Bank Account

---

#### SET-019 · Default currency name/code/symbol cannot be edited (status only)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r47 (TC_Setting_25) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one currency information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. One of the currency is selected and Click "Edit" button.
3. Name , Code and Symbol feild will be bind automatically.
4. You can edit Status only

**Expected result:**

1. The default currency cannot be edited except for the status.

---

#### SET-020 · Edit custom currency name, code and symbol

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r48 (TC_Setting_26) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one currency information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. One of the currency is selected and Click "Edit" button.
3. Update currency name , Code and Symbol information.
4. Click "Submit" button.
5. If the currency name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After updating the currency information, the updated data can be seen.

**Check areas:**

1. Dashboard
2. Account Receivable-Currency filter
3. Invoice/Debit Note create form
4. Cash Received
5. Cash Outflow
6. Cash Transfer
7. Apartment-Summary, make payment, SOA, Wallet, Deposit
8. Contact-Summary, make payment
9. Cash & Bank Account
10. Report-Acc Statement report & detail,Invoice,transaction,cash received,cash outflow

---

### Payment method

#### SET-021 · Add payment method and verify it appears in bank account create form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r50 (TC_Setting_28) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. Payment Methond = "Wave Money"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. Click "Add " button of Manage payment method.
3. In Add Payment Method Form, Fill payment method informatoin.
4. Click "Submit" button.
5. If the payment method is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After adding the new payment method, new payment method can be seen in the list.
2. It will appear in the payment method select box on the bank account create form.

**Check areas:**

1. Apartment-Make payment,Wallet recharge,add deposit
2. Contact-Make payment
3. Cash & Bank Account create

---

#### SET-022 · Edit payment method

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r52 (TC_Setting_30) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one payment method information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. In payment method list information, one of the payment method is selected and Click "Edit" button.
3. In Edit payment method Form, Update payment method name informatoin.
4. Click "Submit" button.
5. If the payment method name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After updating the payment method information, the updated data can be seen.

**Check areas:**

1. Apartment-Make payment,Wallet recharge,add deposit
2. Contact-Make payment
3. Cash & Bank Account create
4. Report-Transactions,Cash Received,Cash Outflow

---

#### SET-023 · Disable payment method; hidden from transaction forms but kept in reports

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r53 (TC_Setting_31) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one payment method information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. One of the payment method is selected and Click "Edit" button.
3. Edit the status and click "Create" button

**Expected result:**

1. The disabled Payment Method will disappear from all transaction created forms.
2. You can still view previous transactions in the report.

**Check areas:**

1. Apartment-Make payment,Wallet recharge,add deposit
2. Contact-Make payment
3. Cash & Bank Account create

---

### Account type

#### SET-024 · Add account type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r55 (TC_Setting_33) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. Account Type = "Digital Money"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. Click "Add " button of Manage account type.
3. Fill account type information
   - Enter name
- Please choose whether to add the bank name or not.
- Please choose whether to add Acc Number or not.
- Please choose whether to add Enable Overdraft or not.
4. Click "Submit" button.
5. If the account name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After adding the new account type, new account type can be seen in the list.

**Check areas:**

1. Cash & Bank Account Create

---

#### SET-025 · Edit account type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r57 (TC_Setting_35) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one account type information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. In account type list information, one of the account type is selected and Click "Edit" button.
3. In Edit account type Form, Update account type name informatoin.
4. Click "Submit" button.
5. If the account type name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After updating the account type information, the updated data can be seen.

**Check areas:**

1. Cash & Bank Account Create

---

#### SET-026 · Disable account type and verify it is hidden in Cash & Bank account form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r58 (TC_Setting_36) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one account type information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. In account type list information, one of the account type is selected and Click "Edit" button.
3. Edit the status and click "Create" button

**Expected result:**

1. The disabled Account Type will disappear from Cash & Bank Account created forms.
2. You can still view previous transactions in the report.

**Check areas:**

1. Cash & Bank Account Create

---

### Bank

#### SET-027 · Add bank

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r60 (TC_Setting_38) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. Bank Name = "Test Bank"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. Click "Add" button of Manage Bank.
3. In Add Bank Form, Fill Bank name informatoin.
4. Click "Submit" button.
5. If the bank name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After adding the new bank
   information, new bank information can be seen in the list.

**Check areas:**

1. Dashboard Bank name
2. Cash & Bank Account Create
3. Account Statement report

---

#### SET-028 · Edit bank

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r62 (TC_Setting_40) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one bank information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. In Bank list information, one of the banks is selected and Click "Edit" button.
3. In Edit Bank Form, Update Bank name informatoin.
4. Click "Submit" button.
5. If the bank name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After updating the bank
   information, the updated data can be seen.

**Check areas:**

1. Dashboard Bank name
2. Cash & Bank Account Create
3. Account Statement report

---

#### SET-029 · Disable bank and verify it is hidden in Cash & Bank account form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r63 (TC_Setting_41) |

**Scenario group:** Account Classification

**Preconditions:**

User need to  
login the System first and system must have at least one bank information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Account Classification menu.
2. In Bank list information, one of the banks is selected and Click "Edit" button.
3. Edit the status and click "Create" button

**Expected result:**

1. The disabled Bank will disappear from Cash & Bank Account created forms.
2. You can still view previous transactions in the report.

**Check areas:**

1. Cash & Bank Account Create

---

### Location

#### SET-030 · Add location with status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r71 (TC_Setting_43) |

**Scenario group:** Location

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. Location name =
   "MO - Location Test"
2. Status = "Enabled"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Locations Menu.
2. Click "Add New Location" button.
3. In Add New Location Form, Fill Location name informatoin and set Status (Enabled or Disabled)
4. Click "Submit" button.
5. If the location name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After adding the new location information, new location information with status can be seen in the list.

**Check areas:**

1. Cash Received-Unknown Received, Funding Received
2. Apartment-make payment, wallet recharge, add deposit
3. Contact-make payment
4. Report-Transaction,Cash Received,Cash Outflow

---

#### SET-031 · Edit location

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r73 (TC_Setting_45) |

**Scenario group:** Location

**Preconditions:**

User need to  
login the System first and system must have at least one location information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Locations Menu.
2. In Location list information, one of the Locations is selected and Click "Edit" button.
3. In Edit Location Form, Update location name informatoin.
4. Click "Submit" button.
5. If the location name is not filled and click "Submit" button, then error message for not entering required field will be showed.
6. In Edit form, status for the location can be edited as enabled stats to disabled or disabled status to enabled.

**Expected result:**

1. After updating the location information, the updated data can be seen.

**Check areas:**

1. Cash Received-Unknown Received, Funding Received
2. Apartment-make payment, wallet recharge, add deposit
3. Contact-make payment
4. Report-Transaction,Cash Received,Cash Outflow

---

#### SET-032 · Disable location and verify it is hidden in Cash Received location selector

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r74 (TC_Setting_46) |

**Scenario group:** Location

**Preconditions:**

User need to  
login the System first and system must have at least one location information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Locations Menu.
2. One of the Locations is selected and Click "Edit" button.
3. Edit the status and click "Create" button

**Expected result:**

Disabled location cannot be seen in location selector of Cash Received form.  

**Check areas:**

1. Cash Received-Unknown Received, Funding Received
2. Apartment-make payment, wallet recharge, add deposit
3. Contact-make payment

---

### List search

#### SET-033 · Search master data list by name/status — by entity

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — ZL: Location search matches name only; status keyword does not filter (status filter suggested) | Setting r75 (TC_Setting_47) |

**Scenario group:** Location

**Preconditions:**

User need to  
login the System first.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Location Menu.
2. Confirm that search box exist In location list information screen.
3. Type the keyword which User want to search and click "Enter".

**Expected result:**

1. The searched result regarding to
   the search keyword can be seen as a list. If there is no result for related keyword, show the empty view.

> **Source comments:** Name only; typing ACTIVE or INACTIVE doesn't filter. Suggest: a status filter next to the search box.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can search the location information from search box. (Name, Status) | Setting r75 (TC_Setting_47) | |
| 2 | Entity=Zone | Setting r86 (TC_Setting_52) | Review; ZL: no search box yet on Zone list (defect filed) |
| 3 | Entity=Building | Setting r98 (TC_Setting_58) | Review; ZL: no search box yet on Building list (defect filed) |

---

### Zone

#### SET-034 · Add zone with status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r82 (TC_Setting_48) |

**Scenario group:** Zone

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. Zone name = "Zone -D"
2. Status = "Enabled"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Zones Menu.
2. Click "Add Zone" button.
3. In Add New Zone Form, Fill the zone name informatoin and set Status (Enabled or Disabled)
4. Click "Submit" button.
5. If the zone name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After adding the new zone information, new zone information with status can be seen in the list.

**Check areas:**

1. UO Zone filter
2. EM Zone filter
3. Apartment list Zone filter, Apartment create form
4. Setting-Building create form

---

#### SET-035 · Edit zone

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r84 (TC_Setting_50) |

**Scenario group:** Zone

**Preconditions:**

User need to  
login the System first and system must have at least one zone information.  

**Test data:**

1. Zone name = "Zone -D"
2. Status = "Disabled"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Zones Menu.
2. In Zone list information, one of the Zones is selected and Click "Edit" button.
3. In Edit Zone Form, Update Zone name informatoin.
4. Click "Submit" button.
5. If the zone name is not filled and click "Submit" button, then error message for not entering required field will be showed.
6. In Edit form, status for the zone can be edited as enabled stats to disabled or disabled status to enabled.

**Expected result:**

1. After updating the zone information, the updated data can be seen.

**Check areas:**

1. UO Zone filter
2. EM Zone filter
3. Apartment list Zone filter, Apartment create form
4. Report-Building create form

---

#### SET-036 · Disable zone and verify it is hidden in building/apartment create forms

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r85 (TC_Setting_51) |

**Scenario group:** Zone

**Preconditions:**

User need to  
login the System first and system must have at least one zone information.  

**Test data:**

1. Zone name = "Zone -D"
2. Status = "Disabled"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Zones Menu.
2. In Zone list information, one of the Zones is selected and Click "Edit" button.
3. Edit the status and click "Create" button

**Expected result:**

Disabled zone cannot be seen in zone selector of Building and Apartment created form.  

**Check areas:**

1. Apartment create form
2. Setting-Building create form

---

### Building

#### SET-037 · Add building with zone and status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r94 (TC_Setting_54) |

**Scenario group:** Building

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. building name =
   "Test Building"
2. Zone = "Zone B"
3. Status = "Enabled"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Buildings Menu.
2. Click "Add Building" button.
3. In Add New Building Form, fill the building name informatoin, select zone and set Status (Enabled or Disabled).
4. Click "Submit" button.
5. If the building name is not filled and click "Submit" button, then error message for not entering required field will be showed.

**Expected result:**

1. After adding the new building information, new building information with respective zone and status can be seen in the list.

**Check areas:**

1. Invoice/Debit Note-listing page building filter
2. UO Building filter
3. EM Building filter
4. Apartment list Building filter, Apartment create form
5. Report-Transaction,Cash Received,Cash Outflow

---

#### SET-038 · Edit building (change zone)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r96 (TC_Setting_56) |

**Scenario group:** Building

**Preconditions:**

User need to  
login the System first and system must have at least one building information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Buildings Menu.
2. In Building list information, one of the Buildings is selected and Click "Edit" button.
3. In Edit Building Form, Update the Zone informatoin.
4. Click "Submit" button.
5. In Edit form, status for the building can be edited as enabled stats to disabled or disabled status to enabled.

**Expected result:**

1. After updating the building information, the updated data can be seen.

**Check areas:**

1. Invoice/Debit Note-listing page building filter
2. UO Building filter
3. EM Building filter
4. Apartment list Building filter, Apartment create form
5. Report-Transaction,Cash Received,Cash Outflow

---

#### SET-039 · Disable building and verify it is hidden in apartment create form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r97 (TC_Setting_57) |

**Scenario group:** Building

**Preconditions:**

User need to  
login the System first and system must have at least one building information.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Buildings Menu.
2. In Building list information, one of the Buildings is selected and Click "Edit" button.
3. Edit the status and click "Create" button

**Expected result:**

1. Disabled building cannot be seen in building selector of Apartment Created form.

**Check areas:**

1. Apartment create form

---

### Staff

#### SET-040 · Add staff user with type and status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r106 (TC_Setting_60) |

**Scenario group:** Staff

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. user name (email) =
   "test@gmail.com"
2. full name = "tester"
3. user type =
   "Financial Analyst"
4. Password = "123456"
5. Confirm password = "123456"

**Steps:**

1. Click "Setting" from Left Menu and then
   click Staffs Menu.
2. Click "Add New User" button.
   - Edit Name
- Edit Email
- Edit Phone
- Edit Staff Type
- Edit the password and confirm password
- Edit status
3. Click "Create" button.
4. If the user name (Email), User Type, password and confirm password are not filled and click "Submit" button, then error message for not entering required field will be showed.
5. If the password is not matched with confirm password, system will also show the error message for mismatched passwords.

**Expected result:**

1. After adding the new staff information, new staff information with respective user name, full name, user type and status can be seen in the list.

---

#### SET-041 · Edit staff user details

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r107 (TC_Setting_61) |

**Scenario group:** Staff

**Preconditions:**

1. User need to
   login the System first
2. System must have at least one staff information.

**Steps:**

1. Click "Setting" from Left Menu and then
   click Staffs Menu.
2. One of the staffs is selected and Click "Edit" button.
   - Edit Name
- Edit Email
- Edit Phone
- Edit Staff Type
- Edit the password and confirm password
- Edit status
4. Click "Update" button.

**Expected result:**

1. After updating the staff information, the updated data can be seen.

---

#### SET-042 · Search staff list by name, email, type, status

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — ZL: staff search matches email only, not name (defect filed) | Setting r108 (TC_Setting_62) |

**Scenario group:** Staff

**Preconditions:**

User need to  
login the System first.  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Staffs Menu.
2. Confirm that search box exist In Staffs list information screen.
3. Type the keyword with staff name which User want to search and click "Enter".

**Expected result:**

1. The searched result regarding to
   the search keyword regarding to staff name can be seen as a list. If there is no result for related keyword, show the empty view.

> **Source comments:** Staff search matches email only, not name. Ours to fix, filed.

---

### Staff account status

#### SET-043 · User deactivates own account and is logged out of all sessions

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r111 (TC_Setting_65) |

**Scenario group:** Staff

**Preconditions:**

1. User need to
   login the System first.
2. You must have at least 1 User account.

**Steps:**

1. Click "Setting" from Left Menu and then
   click Staffs Menu.
2. Click the edit button for your personal account.
   (or)
1. Click on the Profile Icon in the top right corner of the screen
2. Click on My Profile
3. Edit the status of account
4. Click "Submit" button.

**Expected result:**

1. Deactivate account will be logged out from all places where he is logged in.
2. Other User or someone with setting edit permission can re-activate that account and log in to the system.

---

#### SET-044 · Admin/setting-edit user deactivates and reactivates another account

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r112 (TC_Setting_66) |

**Scenario group:** Staff

**Preconditions:**

1. User need to
   login the System first.
2. Must have at least 1 user account.

**Steps:**

1. Click "Setting" from Left Menu and then
   click Staffs Menu.
2. One of the staffs is selected and Click "Edit" button.
3. Edit the status of account
4. Click "Submit" button.

**Expected result:**

1. Deactivate account will be logged out from all places where he is logged in.
2. Other User or someone with setting edit permission can re-activate that account and log in to the system.

---

#### SET-045 · Setting-view-only user deactivating an account (permission check)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Source data says "testcase issues"; steps edit another staff while title says own account; expected unclear for view-only permission | Setting r113 (TC_Setting_67) |

**Scenario group:** Staff

**Preconditions:**

1. User need to
   login the System first
2. System must have at least one staff information.
3. You must have setting view permission

**Test data:**

testcase issues  

**Steps:**

1. Click "Setting" from Left Menu and then
   click Staffs Menu.
2. One of the staffs is selected and Click "Edit" button.
3. Edit the status of account
4. Click "Submit" button.

**Expected result:**

1. Deactivate account will be logged out from all places where he is logged in.
2. Other User or someone with setting edit permission can re-activate that account and log in to the system.

---

### Notifications

#### SET-046 · Notification draft count limited to permitted categories

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Setting r114 (TC_Setting_68) |

**Scenario group:** Staff

**Preconditions:**

1. User need to
   login the System first.
2. The system must have draft notifications created.

**Steps:**

1. Login with created staff acc
2. Check the noti bar for draft notifications
3. Click noti icon

**Expected result:**

1. The noti count depends on the category, that the user has permission to view.
2. The user will only be able to see transactions created by the category, that the user has permission to view.

---

### Password management

#### SET-047 · Admin changes another account password; target logged out, new password required

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r115 (TC_Setting_69) |

**Scenario group:** Staff

**Preconditions:**

1. Two admins need to log in first.
2. You must already have 2 admin accounts.

**Test data:**

1. Old password
2. New password

**Steps:**

1. Login with Admin1 account
2. Click "Setting" from Left Menu and then
   click Staff Menu.
3. Click the "Edit" button of Admin2 account whose password you want to change.
4. In Edit User Form,
   - Click "Click to change password" button
- Enter new password in "Password" and "Confirm Password"
4. Click "Update" button.

**Expected result:**

1. The admin2 account whose password has been changed will be logged out from all places where he is logged in.
2. The next time he log in, he will only be able to log in with the new password.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Admin1 can change other Admin2 account password. | Setting r115 (TC_Setting_69) | |
| 2 | Target=Non-admin user | Setting r117 (TC_Setting_71) |  |

---

#### SET-048 · User changes own password; session stays active, new password needed next login

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r116 (TC_Setting_70) |

**Scenario group:** Staff

**Preconditions:**

1. Admin need to login the System first.
2. You must have at least 1 admin account.

**Test data:**

1. Old password
2. New password

**Steps:**

1. Login with Admin account
2. Click "Setting" from Left Menu and then
   click Staff Menu.
3. Click the edit button for your personal account.
4. In Edit User Form,
   - Click "Click to change password" button
- Enter new password in "Password" and "Confirm Password"
4. Click "Update" button.
   (or)
1. Click on the Profile Icon in the top right corner of the screen
2. Click on Change Password
3. Enter Current Password
4. Enter new password in "Password" and "Confirm Password"
5. Click "Submit" button

**Expected result:**

1. If you change your own password, you will not be logged out of the system and will be able to continue using it.
2. You will only need to use the new password the next time you log in to that account.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Admin can change his own password. | Setting r116 (TC_Setting_70) | |
| 2 | Actor=Non-admin user | Setting r118 (TC_Setting_72) |  |

---

#### SET-049 · Non-admin user cannot edit or change an admin password

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Setting r119 (TC_Setting_73) |

**Scenario group:** Staff

**Preconditions:**

1. Both the admin and the other user need to log in first.
2. You must have 1 admin account and 1 user account.

**Test data:**

1. Old password
2. New password

**Steps:**

1. Login with Other user account
2. Click "Setting" from Left Menu and then
   click Staff Menu.
3. Click the edit button for your personal account.
4. In Edit User Form,
   - Click "Click to change password" button
- Enter new password in "Password" and "Confirm Password"
4. Click "Update" button.

**Expected result:**

1. Even if you have all the permissions for the setting, you can't change it unless you are an admin.
2. You won't see the edit button next to the admin account.

---

### Role

#### ★ SET-050 · Create role with permissions and categories; assigned user is limited to them

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Setting r126 (TC_Setting_74) |

**Scenario group:** Role

**Preconditions:**

User need to  
login the System first.  

**Test data:**

1. Role Name = Tester QA
2. Permissions to be assigned
3. Categories to be assigned

**Steps:**

1. Click "Setting" from Left Menu and then
   click Role Menu.
2. Click "New" button.
3. Enter Role Name
4. Set permission for this role
5. select the catagories for this role
6. Click "Create" button.
7. Assign a staff member to the role you created.

**Expected result:**

1. A user can only use the system with the assigned permissions and categories.

---
