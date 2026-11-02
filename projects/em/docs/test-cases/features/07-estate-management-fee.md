# 07 · Estate Management Fee (EM)

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 17  
**Priority:** P1 6 · P2 10 · P3 1 · **★ Critical:** 6 · **Smoke:** 3 · **E2E:** 6 · **Auto:** 17 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [EMF-001](#-emf-001--create-single-em-draft-monthly-fee-x-number-of-months) | ★ Create single EM draft (monthly fee x number of months) | Create EM | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [EMF-002](#emf-002--cannot-create-em-when-apartment-has-pending-em-draft) | Cannot create EM when apartment has pending EM draft | EM validation | P2 | Regression | Auto-UI | Active |  |
| [EMF-003](#emf-003--delete-em-draft) | Delete EM draft | Edit/Delete EM | P2 | Regression | Auto-UI | Active |  |
| [EMF-004](#emf-004--edit-em-draft-monthly-fee) | Edit EM draft monthly fee | Edit/Delete EM | P2 | Regression | Auto-UI | Active |  |
| [EMF-005](#-emf-005--approve-em-draft---debit-note-generated-unpaid-in-apartment) | ★ Approve EM draft - debit note generated, unpaid in apartment | Approve EM | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [EMF-006](#-emf-006--bulk-approve-em-drafts---documents-generated) | ★ Bulk approve EM drafts - documents generated | Approve EM | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [EMF-007](#-emf-007--em-bulk-import-from-date--previous-end-date--1-creates-entries-without-approval) | ★ EM bulk import (from date = previous end date + 1) creates entries without approval | EM import | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [EMF-008](#emf-008--em-import-rejects-csv-with-incorrect-or-blank-data) | EM import rejects CSV with incorrect or blank data | EM import | P2 | Regression | Auto-UI+API | Active |  |
| [EMF-009](#emf-009--filter-em-list---draft-only) | Filter EM list - draft only | EM listing & filters | P2 | Regression | Auto-UI | Active |  |
| [EMF-010](#emf-010--view-approved-em-debit-note-pdf-from-listing) | View approved EM debit note PDF from listing | EM PDF | P2 | Regression | Auto-UI+API | Active |  |
| [EMF-011](#emf-011--view-all-approved-em-pdfs-via-bulk-pdf) | View all approved EM PDFs via bulk PDF | EM PDF | P2 | Regression | Auto-UI+API | Active |  |
| [EMF-012](#emf-012--filter-em-list-by-zone-and-building) | Filter EM list by zone and building | EM listing & filters | P2 | Regression | Auto-UI | Active |  |
| [EMF-013](#emf-013--enter-key-does-not-submit-the-em-create-form) | Enter key does not submit the EM create form | EM validation | P3 | Regression | Auto-UI | Active |  |
| [EMF-014](#emf-014--search-em-by-keyword) | Search EM by keyword | EM listing & filters | P2 | Regression | Auto-UI | Active |  |
| [EMF-015](#emf-015--filter-em-by-month-and-year) | Filter EM by month and year | EM listing & filters | P2 | Regression | Auto-UI | Active |  |
| [EMF-016](#-emf-016--approving-current-month-debit-note-during-em-import-keeps-dnco-ref-numbering-in-order) | ★ Approving current-month debit note during EM import keeps DN/co-ref numbering in order | Approval during import | P1 | E2E · Regression | Auto-API | Active |  |
| [EMF-017](#-emf-017--approving-previous-month-debit-note-during-em-import-keeps-numbering-consistent) | ★ Approving previous-month debit note during EM import keeps numbering consistent | Approval during import | P1 | E2E · Regression | Auto-API | Active |  |
<!-- /generated:summary -->

## Test cases

### Create EM

#### ★ EMF-001 · Create single EM draft (monthly fee x number of months)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | EM r5 (TC_EM_001) |

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. apartment = "A1-206"
2. Monthly fee = "30000"
3. No of month = "5"
4. From = "28-07-2023"

**Steps:**

1. Click "EM" from left menu.
2. Click "New EM draft" button.
3. Fill the required fields.
4. If aparment has old EM data,EM start date and end date will be automated fill by system with user enter number of months count
5. Click "Save" button

**Expected result:**

1. EM entry created successfully.
2. Notification will be sent to approver.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. EM record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list

---

### EM validation

#### EMF-002 · Cannot create EM when apartment has pending EM draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | EM r6 (TC_EM_002) |

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. apartment = "A1-206"
2. Monthly fee = "30000"
3. No of month = "5"
4. From = "28-07-2023"

**Steps:**

1. Click "EM" from left menu.
2. Click "New EM draft" button.
3. Fill the required fields.
4. If aparment has old EM data,EM start date and end date will be automated fill by system with user enter number of months count
5. Click "Save" button

**Expected result:**

"Apartment have draft EM invoice pending." alert will be shown.  

---

### Edit/Delete EM

#### EMF-003 · Delete EM draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | EM r7 (TC_EM_003) |

**Preconditions:**

User must have the permission  

**Steps:**

1. Click "EM"on the top
2. Choose one of the EM entry.
3. Click "delete" icon
4. "Are you sure" alert box will be occured.
5. Click "Yes" button

**Expected result:**

"EM has been deleted successfully" alert will be shown  

---

#### EMF-004 · Edit EM draft monthly fee

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | EM r8 (TC_EM_004) |

**Preconditions:**

User must have the permission  

**Test data:**

1. Apartment = "A - 206"
2. Monthly fee = "25000"

**Steps:**

1. Click "EM"on the top
2. Choose one of the EM entry.
3. Click "Edit" icon
4. Check and edit the entry unit .
5. Click "Submit" button

**Expected result:**

"EM has been successfully updated." alert will be shown  

---

### Approve EM

#### ★ EMF-005 · Approve EM draft - debit note generated, unpaid in apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active — Expected says "invoice (Inv)"; EM produces debit note | EM r9 (TC_EM_005) |

**Preconditions:**

User must have the permission  

**Steps:**

1. Click "EM"on the top
2. Choose one of the EM entry.
3. Click "Approve" icon
4. "Are you sure" alert box will be occured.
5. Click "Yes" button

**Expected result:**

1. EM Entries with ref number Invoiced Succesfully
2. In the apartment, invoice (Inv) will be shown with unpaid status

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. EM record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list

---

#### ★ EMF-006 · Bulk approve EM drafts - documents generated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active — Expected says "invoice (Inv)"; EM produces debit note | EM r11 (TC_EM_006) |

**Preconditions:**

User must have the permission  

**Steps:**

1. Click "EM"on the top
2. Click "Draft Only" check box,Bulk approved button will appear
3. Select EM that your want to approved, and click "Bulk Approved"

**Expected result:**

1. Selected EM draft are changed to approved.
2. EM Entries with ref number Invoiced Succesfully
3. In the apartment, invoice (Inv) will be shown with unpaid status

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. EM record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list

---

### EM import

#### ★ EMF-007 · EM bulk import (from date = previous end date + 1) creates entries without approval

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | EM r12 (TC_EM_007) |

**Preconditions:**

User needs to login the system first  

**Test data:**

1. If the apartment has old EM data, the EM fromdate in the import scv file should be plus one day of the old data enddate.

**Steps:**

1. Click "EM" from left menu.
2. Click "Import" button and Click "Download SCV Template"
3. You can fill EM data in Template and save
4. You can upload your update SCV file

**Expected result:**

1. EM data of your entry are created successfully in system.
2. EM import transaction lines do not need to be approved.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. EM record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list

---

#### EMF-008 · EM import rejects CSV with incorrect or blank data

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | EM r13 (TC_EM_008) |

**Preconditions:**

User needs to login the system first  

**Test data:**

1. If the apartment has old EM data, the EM fromdate in the import scv file should be plus one day of the old data enddate.

**Steps:**

1. Click "EM" from left menu.
2. Click "Import" button and Click "Download SCV Template"
3. You can fill EM data in Template and save
4. You can upload your update SCV file

**Expected result:**

1. Error Message alert will be shown.

---

### EM listing & filters

#### EMF-009 · Filter EM list - draft only

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | EM r14 (TC_EM_009) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "EM" from left menu.
2. Click "Draft only" check box

**Expected result:**

1. User can see draft EM transction that are not approved from admin .

---

### EM PDF

#### EMF-010 · View approved EM debit note PDF from listing

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | EM r15 (TC_EM_010) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "EM" from left menu.
2. Click DN number of each EM transaction from listing

**Expected result:**

1. User can see EM invoice PDF of clicked EM.

---

#### EMF-011 · View all approved EM PDFs via bulk PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | EM r16 (TC_EM_011) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "EM" from left menu.
2. Click "PDF" drop down.
3. Click "View PDF".

**Expected result:**

1. User can see all approved EM invoice PDF

---

### EM listing & filters

#### EMF-012 · Filter EM list by zone and building

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | EM r17 (TC_EM_012) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "EM" from left menu.
2. Select "Zone" and "Building"

**Expected result:**

1. User can see EM transction filtered list.

---

### EM validation

#### EMF-013 · Enter key does not submit the EM create form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | EM r18 (TC_EM_013) |

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. apartment = "A1-206"
2. Monthly fee = "30000"
3. No of month = "5"
4. From = "28-07-2023"

**Steps:**

1. Click "EM" from left menu.
2. Click "New EM draft" button.
3. Fill the required fields.
4. If aparment has old EM data,EM start date and end date will be automated fill by system with user enter number of months count
5. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create EM - Debit Note function.  

---

### EM listing & filters

#### EMF-014 · Search EM by keyword

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | EM r19 (TC_EM_014) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "EM" from left menu.
2. Enter the keyword which the user want to search.

**Expected result:**

1. User can see all approved EM invoice regarding to the searched keyword.

---

#### EMF-015 · Filter EM by month and year

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | EM r20 (TC_EM_015) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "EM" from left menu.
2. Select the month and year which the user want to search.

**Expected result:**

1. User can see all approved EM invoice regarding to the searched month and year.

---

### Approval during import

#### ★ EMF-016 · Approving current-month debit note during EM import keeps DN/co-ref numbering in order

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | EM r22 |

**Preconditions:**

1. User 1 uploads the import
2. User 2 approves the current month Debit Note

**Expected result:**

1. The approved process will be successful.
2. The Debit Note number from approved will be in the order between the Debit Note number and coref number from the import file.

---

#### ★ EMF-017 · Approving previous-month debit note during EM import keeps numbering consistent

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | EM r23 |

**Preconditions:**

1. User 1 uploads import
2. User 2 approves previous month Debit Note

**Expected result:**

1. The approved process will be successful
2. The Debit Note number obtained from approved will be the last number of the previous month
3. The Coref number obtained from approved will be consecutive between the coref numbers obtained from the EM import file

---
