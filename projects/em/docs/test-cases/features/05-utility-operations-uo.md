# 05 · Utility Operations (UO) — manual entry

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 28 (+1 data-variant rows)  
**Priority:** P1 8 · P2 19 · P3 1 · **★ Critical:** 8 · **Smoke:** 2 · **E2E:** 5 · **Auto:** 28 · **Manual:** 0 · **Review:** 2

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [UO-001](#-uo-001--create-single-uo-reading-draft-manual) | ★ Create single UO reading draft (manual) | Create UO reading | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [UO-002](#uo-002--uo-reading-date-must-be-later-than-last-reading-date) | UO reading date must be later than last reading date | UO reading validation | P2 | Regression | Auto-UI | Active |  |
| [UO-003](#uo-003--cannot-create-uo-when-apartment-has-pending-uo-draft) | Cannot create UO when apartment has pending UO draft | UO reading validation | P2 | Regression | Auto-UI | Active |  |
| [UO-004](#uo-004--cannot-create-uo-when-apartment-has-pending-meter-reset-draft) | Cannot create UO when apartment has pending meter reset draft | UO reading validation | P2 | Regression | Auto-UI | Active |  |
| [UO-005](#uo-005--delete-uo-draft) | Delete UO draft | Edit/Delete UO draft | P2 | Regression | Auto-UI | Active |  |
| [UO-006](#uo-006--edit-uo-draft-readings) | Edit UO draft readings | Edit/Delete UO draft | P2 | Regression | Auto-UI | Active |  |
| [UO-007](#-uo-007--approve-uo-draft---invoice-generated-unpaid-in-apartment) | ★ Approve UO draft - invoice generated, unpaid in apartment | Approve UO | P1 | Smoke · E2E · Regression | Auto-UI+API | Active |  |
| [UO-008](#-uo-008--bulk-approve-uo-drafts---invoices-generated) | ★ Bulk approve UO drafts - invoices generated | Approve UO | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [UO-009](#-uo-009--uo-import-allowed-in-same-month-as-last-reading-when-last-reading-is-manualmeter-reset) | ★ UO import allowed in same month as last reading when last reading is manual/meter reset | UO import | P1 | E2E · Regression | Auto-UI+API | Review |  |
| [UO-010](#uo-010--uo-import-rejected-in-same-month-when-last-reading-is-bulk-upload) | UO import rejected in same month when last reading is bulk upload | UO import | P2 | Regression | Auto-UI | Active |  |
| [UO-011](#-uo-011--uo-import-allowed-in-month-after-last-bulk-upload-reading) | ★ UO import allowed in month after last bulk-upload reading | UO import | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [UO-012](#uo-012--uo-import-rejected-when-reading-date-equals-last-reading-date) | UO import rejected when reading date equals last reading date | UO import | P2 | Regression | Auto-UI | Active |  |
| [UO-013](#uo-013--uo-import-rejected-in-month-already-having-a-bulk-upload-last-reading-manual) | UO import rejected in month already having a bulk upload (last reading manual) | UO import | P2 | Regression | Auto-UI | Active | 2 |
| [UO-014](#-uo-014--import-after-meter-reset-uses-mr-units-as-previous-reading-consumption-correct) | ★ Import after meter reset uses MR units as previous reading; consumption correct | Meter reset | P1 | Regression | Auto-UI+API | Review |  |
| [UO-015](#-uo-015--manual-uo-after-meter-reset-uses-mr-units-as-previous-reading-consumption-correct) | ★ Manual UO after meter reset uses MR units as previous reading; consumption correct | Meter reset | P1 | Regression | Auto-UI+API | Active |  |
| [UO-016](#uo-016--uo-import-rejects-csv-with-lower-or-blank-reading-units) | UO import rejects CSV with lower or blank reading units | UO import | P2 | Regression | Auto-UI | Active |  |
| [UO-017](#uo-017--view-approved-uo-invoice-pdf-from-listing) | View approved UO invoice PDF from listing | UO PDF | P2 | Regression | Auto-UI+API | Active |  |
| [UO-018](#uo-018--view-all-approved-uo-invoice-pdfs-via-bulk-pdf) | View all approved UO invoice PDFs via bulk PDF | UO PDF | P2 | Regression | Auto-UI+API | Active |  |
| [UO-019](#uo-019--create-meter-reset-draft-date-after-last-reading) | Create meter reset draft (date after last reading) | Meter reset | P2 | Regression | Auto-UI | Active |  |
| [UO-020](#uo-020--cannot-create-meter-reset-when-apartment-has-pending-uo-draft) | Cannot create meter reset when apartment has pending UO draft | Meter reset | P2 | Regression | Auto-UI | Active |  |
| [UO-021](#uo-021--cannot-create-meter-reset-when-apartment-has-pending-meter-reset-draft) | Cannot create meter reset when apartment has pending meter reset draft | Meter reset | P2 | Regression | Auto-UI | Active |  |
| [UO-022](#-uo-022--approve-meter-reset---mr-dateunits-become-apartment-last-reading) | ★ Approve meter reset - MR date/units become apartment last reading | Meter reset | P1 | Regression | Auto-UI+API | Active |  |
| [UO-023](#uo-023--delete-meter-reset-draft) | Delete meter reset draft | Meter reset | P2 | Regression | Auto-UI | Active |  |
| [UO-024](#uo-024--filter-uo-list---draft-only) | Filter UO list - draft only | UO listing & filters | P2 | Regression | Auto-UI | Active |  |
| [UO-025](#uo-025--filter-uo-list-by-zone-and-building) | Filter UO list by zone and building | UO listing & filters | P2 | Regression | Auto-UI | Active |  |
| [UO-026](#uo-026--search-uo-invoices-by-keyword) | Search UO invoices by keyword | UO listing & filters | P2 | Regression | Auto-UI | Active |  |
| [UO-027](#uo-027--filter-uo-invoices-by-month-and-year) | Filter UO invoices by month and year | UO listing & filters | P2 | Regression | Auto-UI | Active |  |
| [UO-028](#uo-028--enter-key-does-not-submit-the-uo-create-form) | Enter key does not submit the UO create form | UO reading validation | P3 | Regression | Auto-UI | Active |  |
<!-- /generated:summary -->

## Test cases

### Create UO reading

#### ★ UO-001 · Create single UO reading draft (manual)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | UO r5 (TC_UO_001) |

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. Apartment = "A - 205"
2. YESC previous = "6925"
3. YESC current = "7000"
4. Generator previous = "0"
5. Generator current = "100"
6. Treated Water previous = "0"
7. Treated Water current = "100"
8. Raw Water previous = "0"
9. Raw Water current = "100"

**Steps:**

1. Click "UO" from left menu.
2. Click "New UO draft" button.
3. Fill the required fields.
4. Current reading unit must be equal or greater than the previous.
5. If aparment has old UO data,new UO reading date must be greater than the last reading date.
6. Can't create with future date.
7. Click "Save" button

**Expected result:**

1. UO entry created successfully.
2. Notification will be sent to approver.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. UO record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list

---

### UO reading validation

#### UO-002 · UO reading date must be later than last reading date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r6 (TC_UO_002) |

**Preconditions:**

1. User needs to login the system first
2. There is at least one UO reading for the selected Apartment.

**Test data:**

1. Apartment = "A - 205"
2. YESC previous = "6925"
3. YESC current = "7000"
4. Generator previous = "0"
5. Generator current = "100"
6. Treated Water previous = "0"
7. Treated Water current = "100"
8. Raw Water previous = "0"
9. Raw Water current = "100"
10. Current Reading Date = 10/01/2025 (Previous Reading Date =20/01/2025)

**Steps:**

1. Click "UO" from left menu.
2. Click "New UO draft" button.
3. Fill the required fields.
4. Current reading unit must be equal or greater than the previous.
5. If aparment has old UO data,new UO reading date must be greater than the last reading date.
6. Can't create with future date.
7. Click "Save" button

**Expected result:**

1. The 'Reading Date' must be later than the previous 'Reading Date' will be shown.

---

#### UO-003 · Cannot create UO when apartment has pending UO draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r7 (TC_UO_003) |

**Preconditions:**

1. User needs to login the system first.
2. The Apartment has one UO draft.

**Test data:**

1. Apartment = "A - 205"
2. YESC previous = "6925"
3. YESC current = "7000"
4. Generator previous = "0"
5. Generator current = "100"
6. Treated Water previous = "0"
7. Treated Water current = "100"
8. Raw Water previous = "0"
9. Raw Water current = "100"

**Steps:**

1. Click "UO" from left menu.
2. Click "New UO draft" button.
3. Fill the required fields.
4. Current reading unit must be equal or greater than the previous.
5. If aparment has old UO data,new UO date should greater than old reading date.(can't create with future date.)
6. Click "Save" button

**Expected result:**

"Apartment have draft UO Invoice pending." alert will be shown.  

---

#### UO-004 · Cannot create UO when apartment has pending meter reset draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r8 (TC_UO_004) |

**Preconditions:**

1. User needs to login the system first
2. The Apartment has one Meter Reset Draft.

**Test data:**

1. Apartment = "A - 205"
2. YESC previous = "6925"
3. YESC current = "7000"
4. Generator previous = "0"
5. Generator current = "100"
6. Treated Water previous = "0"
7. Treated Water current = "100"
8. Raw Water previous = "0"
9. Raw Water current = "100"

**Steps:**

1. Click "UO" from left menu.
2. Click "New UO draft" button.
3. Fill the required fields.
4. Current reading unit must be equal or greater than the previous.
5. If aparment has old UO data,new UO date should greater than old reading date.(can't create with future date)
6. Click "Save" button

**Expected result:**

"Apartment have draft Meter Reset pending." alert will be shown.  

---

### Edit/Delete UO draft

#### UO-005 · Delete UO draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r9 (TC_UO_005) |

**Preconditions:**

1. User must have the permission to delete the UO draft.
2. There is at least one UO draft in the listing.

**Steps:**

1. Click "UO"on the top bar.
2. Choose one of the UO entry.
3. Click "delete" icon.
4. "Are you sure" alert box will be occured.
5. Click "Yes" button.

**Expected result:**

"UO Entries Deleted Successfully." alert will be shown  

---

#### UO-006 · Edit UO draft readings

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r10 (TC_UO_006) |

**Preconditions:**

1. User must have the permission to edit the UO draft.
2. There is at least one UO draft in the listing.

**Test data:**

1. Apartment = "A - 205"
2. YESC previous = "6925"
3. YESC current = "7000"
4. Generator previous = "0"
5. Generator current = "50"
6. Treated Water previous = "0"
7. Treated Water current = "100"
8. Raw Water previous = "0"
9. Raw Water current = "100"

**Steps:**

1. Click "UO"on the top bar.
2. Choose one of the UO entry.
3. Click "Edit" icon
4. Check and edit the entry unit .
5. Click "Submit" button

**Expected result:**

"UO entry updated." alert will be shown  

---

### Approve UO

#### ★ UO-007 · Approve UO draft - invoice generated, unpaid in apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | UO r11 (TC_UO_007) |

**Preconditions:**

1. User must have the permission to approve the UO draft.
2. There is at least one UO draft in the listing.

**Steps:**

1. Click "UO"on the top bar.
2. Choose one of the UO entries.
3. Click "Approve" icon
4. "Are you sure" alert box will be occured.
5. Click "Yes" button

**Expected result:**

1. UO Entries with ref number Invoiced Succesfully
2. In the apartment, invoice (Inv) will be shown with unpaid status.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. UO record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list

---

#### ★ UO-008 · Bulk approve UO drafts - invoices generated

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | UO r12 (TC_UO_008) |

**Preconditions:**

1. User must have the permission to approve the UO draft.
2. There is at least two UO drafts in the listing.

**Steps:**

1. Click "UO"on the top
2. Click "Draft Only" check box,Bulk approved button will appear
3. Select UO drafts that your want to approved, and click "Bulk Approved"

**Expected result:**

1. Selected UO drafts are changed to approved.
2. UO Entries with ref number Invoiced Succesfully
3. In the apartment, invoice (Inv) will be shown with unpaid status

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. UO record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list
8. Created By and Approved By user name

---

### UO import

#### ★ UO-009 · UO import allowed in same month as last reading when last reading is manual/meter reset

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Review — Conflicts with Uo import#4 (same-month import after manual fails in v4); data year typo 2024 vs 2025 | UO r13 (TC_UO_009) |

**Preconditions:**

1. User needs to login the system first.
2. Apartment should have at least one old UO record.

**Test data:**

1. UO reading unit in import CSV file should greater than old data unit.
2. The most recent previous reading is manually or meter reset and UO reading date in import CSV file must be greater than old reading date.
3. Can't import with future date.
   Previous Reading Date (Manual)-10/05/2024
   (or) Previous Meter Reset Date -12/05/2025  
   Reading Date for current Import -20/05/2025  

**Steps:**

1. Click "UO" from left menu.
2. Click "Import" button and Click "Download CSV Template"
3. You can fill UO data in Template and save.
4. You can upload your update CSV file

**Expected result:**

1. UO data of your entry are created successfully in system.
2. UO import transaction lines do not need to be approved.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. UO record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list

---

#### UO-010 · UO import rejected in same month when last reading is bulk upload

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Data year typo (prev 10/05/2024 vs import 20/05/2025) | UO r14 (TC_UO_010) |

**Preconditions:**

1. User needs to login the system first.
2. Apartment should have at least one old UO record.

**Test data:**

1. UO reading unit in import CSV file should greater than old data unit.
2. The most recent previous reading is bulk upload, UO reading month in import CSV file must be greater than old reading date's month.
3. Can't import with future date.
   Previous Reading Date(Bulk Upload) -10/05/2024
   Reading Date for current Import -20/05/2025  

**Steps:**

1. Click "UO" from left menu.
2. Click "Import" button and Click "Download CSV Template"
3. You can fill UO data in Template and save.
4. Upload your update CSV file

**Expected result:**

Room Number 'There is already a record with 'Reading Date' in the same month. Only an import is allowed within a month'  

---

#### ★ UO-011 · UO import allowed in month after last bulk-upload reading

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | UO r15 (TC_UO_011) |

**Preconditions:**

1. User needs to login the system first.
2. Apartment should have at least one old UO record.

**Test data:**

1. UO reading unit in import CSV file should greater than old data unit.
2. The most recent previous reading is bulk upload, UO reading month in import CSV file must be greater than old reading date's month.
3. Can't import with future date.
   Previous Reading Date (Bulk Upload)-10/05/2025
   Reading Date for current Import -10/06/2025  

**Steps:**

1. Click "UO" from left menu.
2. Click "Import" button and Click "Download CSV Template"
3. You can fill UO data in Template and save.
4. Upload your update CSV file

**Expected result:**

1. UO data of your entry are created successfully in system.
2. UO import transaction lines do not need to be approved.

**Check areas:**

1. Dashboard AR amount
2. Account Receivable amount and list
3. Invoice/Debit Note list
4. UO record list
5. Apartment - summary amount , Invoices list, SOA report
6. Contact - summary amount, Unpaid Invoices list
7. Report - Invoices list

---

#### UO-012 · UO import rejected when reading date equals last reading date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r16 (TC_UO_012) |

**Preconditions:**

1. User needs to login the system first.
2. Apartment should have at least one old UO record.

**Test data:**

1. UO reading unit in import CSV file should greater than old data unit.
2. Can't import with future date.
   Previous Reading Date(Manual/ Bulk Upload/Meter Reset) -10/05/2025
   Reading Date for current Import -10/05/2025  

**Steps:**

1. Click "UO" from left menu.
2. Click "Import" button and Click "Download CSV Template"
3. You can fill UO data in Template and save.
4. Upload your update CSV file

**Expected result:**

The 'Reading Date' must be later than the previous 'Reading Date' message is shown.  

---

#### UO-013 · UO import rejected in month already having a bulk upload (last reading manual)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r17 (TC_UO_013) |

**Preconditions:**

1. User needs to login the system first.
2. Apartment should have at least one old UO record which is made by bulk upload and one old UO record which is made by manually for the same month.

**Test data:**

1. UO reading unit in import CSV file should greater than old data unit.
2. The most recent previous reading is bulk upload, UO reading month in import CSV file must be greater than old reading date's month.
3. Can't import with future date.
   Previous Reading Date (Bulk Upload)-01/05/2025
   Previous Reading Date (Manual) -10/05/2025  
   Reading Date for current Import -15/05/2025  

**Steps:**

1. Click "UO" from left menu.
2. Click "Import" button and Click "Download CSV Template"
3. You can fill UO data in Template and save.
4. Upload your update CSV file

**Expected result:**

Room Number 'There is already a record with 'Reading Date' in the same month. Only an import is allowed within a month'  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't import bulk data with reading date which is same month of the most recent last reading date when the most recent last reading is manual but there is one bulk upload reading for this month. | UO r17 (TC_UO_013) | |
| 2 | Most recent reading=Meter reset | UO r18 (TC_UO_014) |  |

---

### Meter reset

#### ★ UO-014 · Import after meter reset uses MR units as previous reading; consumption correct

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Review — Onenex v4: unit calc after meter reset incorrect (Uo import#5/#6) | UO r19 (TC_UO_015) |

**Preconditions:**

1. User needs to login the system first.
2. Apply Meter Reset for one Apartment.

**Test data:**

1. UO reading unit in import CSV file should greater than old data unit.
2. The most recent reading is meter reset and do not have import process for the same month.
3. Can't import with future date.
   Previous Reading Unit - 200,150,100,20
   Meter Reset Unit - 100,100,100,0  
   Reading Unit for Current Import - 200,100,250,0  

**Steps:**

1. Click "UO" from left menu.
2. Click "Import" button and Click "Download CSV Template"
3. You can fill UO data in Template and save.
4. Upload your update CSV file

**Expected result:**

UO data of previous reading must be the meter reset unit and calculation must be correct.  

**Check areas:**

1. Invoice/Debit Note list
2. UO record list

---

#### ★ UO-015 · Manual UO after meter reset uses MR units as previous reading; consumption correct

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active — Source data mentions CSV import for a manual case | UO r20 (TC_UO_016) |

**Preconditions:**

1. User needs to login the system first.
2. Apply Meter Reset for one Apartment.

**Test data:**

1. UO reading unit in import CSV file should greater than old data unit.
2. The most recent reading is meter reset and do not have import process for the same month.
3. Can't import with future date.
   Previous Reading Unit - 300,100,200,20
   Meter Reset Unit - 100,100,100,0  
   Reading Unit for Current Import - 200,100,250,0  

**Steps:**

1. Click "UO" from left menu.
2. Click "New UO draft" button.
3. Fill the required fields.
4. Current reading unit must be equal or greater than the previous.
5. If aparment has old UO data,new UO date should greater than old reading date.(can't create with future date)
6. Click "Save" button

**Expected result:**

UO data of previous reading must be the meter reset unit and calculation must be correct.  

**Check areas:**

1. Invoice/Debit Note list
2. UO record list

---

### UO import

#### UO-016 · UO import rejects CSV with lower or blank reading units

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r21 (TC_UO_017) |

**Preconditions:**

1. User needs to login the system first
2. Apartment should have old UO record

**Test data:**

1. In the uploaded csv file, the reading unit is smaller than the old data or blank data exists.

**Steps:**

1. Click "UO" from left menu.
2. Click "Import" button and Click "Download CSVTemplate"
3. You can fill UO data in Template and save.
4. Upload your update CSV file.

**Expected result:**

1. Error Message alert will be shown.

---

### UO PDF

#### UO-017 · View approved UO invoice PDF from listing

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | UO r22 (TC_UO_018) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "UO" from left menu.
2. Click Inv number of each UO transaction from listing

**Expected result:**

1. User can see UO invoice PDF of clicked UO.

---

#### UO-018 · View all approved UO invoice PDFs via bulk PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | UO r23 (TC_UO_019) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "UO" from left menu.
2. Click "PDF" button of Manage UO page
3. Click "View PDF"

**Expected result:**

1. User can see all approved UO invoice PDF

---

### Meter reset

#### UO-019 · Create meter reset draft (date after last reading)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r24 (TC_UO_020) |

**Preconditions:**

1. User needs to login the system first
2. Apartment should have old UO record

**Test data:**

1. Apartment = "A - 205"
2. YESC = "0"
3. Generator = "0"
4. Treated Water = "0"
5. Raw Water = "0"
6. Meter Reset date is greater than the most recent previous reading date.

**Steps:**

1. Click "UO" from left menu.
2. Click "Meter Reset" button ,will reach meter reset history listing page
3. Click "New Meter Reset" button.
4. Select apartment that you want to reset
3. Fill the required fields.
4. Click "Save" button

**Expected result:**

1. MR entry created successfully.
2. Notification will be sent to approver.

**Check areas:**

1. UO - Apartment UO record and last reading date

---

#### UO-020 · Cannot create meter reset when apartment has pending UO draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r25 (TC_UO_021) |

**Preconditions:**

1. User needs to login the system first
2. Apartment should have old UO record

**Test data:**

1. Apartment = "A - 205"
2. YESC = "0"
3. Generator = "0"
4. Treated Water = "0"
5. Raw Water = "0"

**Steps:**

1. Click "UO" from left menu.
2. Click "Meter Reset" button ,will reach meter reset history listing page
3. Click "New Meter Reset" button.
4. Select apartment that you want to reset
3. Fill the required fields.
4. Click "Save" button

**Expected result:**

"Apartment have draft UO Invoice pending." alert will be shown.  

---

#### UO-021 · Cannot create meter reset when apartment has pending meter reset draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r26 (TC_UO_022) |

**Preconditions:**

1. User needs to login the system first
2. Apartment should have old UO record

**Test data:**

1. Apartment = "A - 205"
2. YESC = "0"
3. Generator = "0"
4. Treated Water = "0"
5. Raw Water = "0"

**Steps:**

1. Click "UO" from left menu.
2. Click "Meter Reset" button ,will reach meter reset history listing page
3. Click "New Meter Reset" button.
4. Select apartment that you want to reset
3. Fill the required fields.
4. Click "Save" button

**Expected result:**

"Apartment have draft Meter Reset pending." alert will be shown.  

---

#### ★ UO-022 · Approve meter reset - MR date/units become apartment last reading

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | UO r27 (TC_UO_023) |

**Preconditions:**

1. User must have the permission.
2. User needs to login the system first
3. Apartment should have Meter Reset Draft Record.

**Steps:**

1. Click "MR"on the top
2. Choose one of the MR entry.
3. Click "Approve" icon
4. "Are you sure" alert box will be occured.
5. Click "Yes" button

**Expected result:**

1. UO data of apartment will clear.
2. Apartment' previous data & date are changed with MR value.
3. The Meter Reset date and units will become the apartment’s last record

**Check areas:**

1. UO - Apartment UO record and last reading date

---

#### UO-023 · Delete meter reset draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r28 (TC_UO_024) |

**Preconditions:**

1. User must have the permission.
2. User needs to login the system first
3. Apartment should have Meter Reset Draft Record.

**Steps:**

1. Click "MR"on the top
2. Choose one of the MR entry.
3. Click "delete" icon
4. "Are you sure" alert box will be occured.
5. Click "Yes" button

**Expected result:**

"Meter Reset Deleted Successfully." alert will be shown  

---

### UO listing & filters

#### UO-024 · Filter UO list - draft only

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r29 (TC_UO_025) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "UO" from left menu.
2. Click "Draft only" check box

**Expected result:**

1. User can see draft UO transction that are not approved from admin .

---

#### UO-025 · Filter UO list by zone and building

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r30 (TC_UO_026) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "UO" from left menu.
2. Select "Zone" and "Building"

**Expected result:**

1. User can see UO transction filtered list.

---

#### UO-026 · Search UO invoices by keyword

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r31 (TC_UO_027) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "UO" from left menu.
2. Enter the keyword which the user want to search.

**Expected result:**

1. User can see all approved UO invoice regarding to the searched keyword.

---

#### UO-027 · Filter UO invoices by month and year

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | UO r32 (TC_UO_028) |

**Preconditions:**

User needs to login the system first  

**Steps:**

1. Click "UO" from left menu.
2. Select the month and year which the user want to search.

**Expected result:**

1. User can see all approved UO invoices regarding to the searched month and year.

---

### UO reading validation

#### UO-028 · Enter key does not submit the UO create form

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | UO r33 (TC_UO_029) |

**Preconditions:**

1. User needs to login the system first

**Test data:**

1. Apartment = "A - 205"
2. YESC previous = "6925"
3. YESC current = "7000"
4. Generator previous = "0"
5. Generator current = "100"
6. Treated Water previous = "0"
7. Treated Water current = "100"
8. Raw Water previous = "0"
9. Raw Water current = "100"

**Steps:**

1. Click "UO" from left menu.
2. Click "New UO draft" button.
3. Fill the required fields.
4. Current reading unit must be equal or greater
   than the previous.
5. If aparment has old UO data,new UO date should greater than old reading date.(can't create with future date)
6. Click "Enter" button on the keyboard

**Expected result:**

The system does not allow creating clicking "enter" on the keyboard,  
so it does not work the create UO Invoice function.  

---
