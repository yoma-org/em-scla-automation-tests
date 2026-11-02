# 24 · Role & Permission

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 76 (+5 data-variant rows)  
**Priority:** P1 29 · P2 47 · P3 0 · **★ Critical:** 29 · **Smoke:** 5 · **E2E:** 32 · **Auto:** 76 · **Manual:** 0 · **Review:** 11

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [RBAC-001](#rbac-001--dashboard-view-permission-shows-ar-cash--bank-balance-and-net-cash) | Dashboard view permission shows AR, cash & bank balance and net cash | Dashboard | P2 | Regression | Auto-UI | Review |  |
| [RBAC-002](#rbac-002--ar-view-permission-shows-ar-ageing-data) | AR view permission shows AR ageing data | AR | P2 | Regression | Auto-UI | Active |  |
| [RBAC-003](#rbac-003--bulk-soa-view-permission-ar--contactsapartments-view) | Bulk SOA view permission (AR + Contacts/Apartments view) | AR | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-004](#rbac-004--invoicedn-view-permission-list-detail-filter-export-approved) | Invoice/DN view permission: list, detail, filter, export approved | Invoices/Debit Notes | P2 | Regression | Auto-UI | Active |  |
| [RBAC-005](#-rbac-005--invoicedn-create-permission-limited-to-assigned-income-categories) | ★ Invoice/DN create permission limited to assigned income categories | Invoices/Debit Notes | P1 | Smoke · Regression | Auto-UI+API | Active |  |
| [RBAC-006](#-rbac-006--invoicedn-approve-permission-allows-approveremove-of-draft) | ★ Invoice/DN approve permission allows approve/remove of draft | Invoices/Debit Notes | P1 | Smoke · Regression | Auto-UI+API | Active |  |
| [RBAC-007](#rbac-007--uo-view-permission-draft-and-approved-lists-filter-search) | UO view permission: draft and approved lists, filter, search | UO | P2 | Regression | Auto-UI | Active |  |
| [RBAC-008](#-rbac-008--uo-create-permission-new-draft-import-download-template) | ★ UO create permission: new draft, import, download template | UO | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-009](#-rbac-009--uo-edit-permission-allows-editing-uo-drafts) | ★ UO edit permission allows editing UO drafts | UO | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-010](#-rbac-010--uo-approve-permission-allows-single-and-bulk-approve-of-drafts) | ★ UO approve permission allows single and bulk approve of drafts | UO | P1 | Smoke · Regression | Auto-UI+API | Active |  |
| [RBAC-011](#rbac-011--uo-delete-permission-allows-deleting-uo-drafts) | UO delete permission allows deleting UO drafts | UO | P2 | Regression | Auto-UI | Active |  |
| [RBAC-012](#rbac-012--uo-pdf-view-requires-invoicesdebit-notes-view) | UO PDF view requires Invoices/Debit Notes view | UO | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-013](#rbac-013--meter-reset-view-permission-draftapproved-logs-filter-search) | Meter reset view permission: draft/approved logs, filter, search | UO meter reset | P2 | Regression | Auto-UI | Active |  |
| [RBAC-014](#rbac-014--meter-reset-create-permission) | Meter reset create permission | UO meter reset | P2 | Regression | Auto-UI | Active |  |
| [RBAC-015](#-rbac-015--meter-reset-approve-permission) | ★ Meter reset approve permission | UO meter reset | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-016](#rbac-016--meter-reset-delete-permission-for-drafts) | Meter reset delete permission for drafts | UO meter reset | P2 | Regression | Auto-UI | Active |  |
| [RBAC-017](#rbac-017--em-view-permission-draft-and-approved-lists-filter-search) | EM view permission: draft and approved lists, filter, search | EM | P2 | Regression | Auto-UI | Active |  |
| [RBAC-018](#-rbac-018--em-create-permission-new-draft-and-import) | ★ EM create permission: new draft and import | EM | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-019](#-rbac-019--em-edit-permission-allows-editing-em-drafts) | ★ EM edit permission allows editing EM drafts | EM | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-020](#-rbac-020--em-approve-permission-allows-single-and-bulk-approve-of-drafts) | ★ EM approve permission allows single and bulk approve of drafts | EM | P1 | Smoke · Regression | Auto-UI+API | Active |  |
| [RBAC-021](#rbac-021--em-delete-permission-allows-deleting-em-drafts) | EM delete permission allows deleting EM drafts | EM | P2 | Regression | Auto-UI | Active |  |
| [RBAC-022](#rbac-022--contact-listing-permission-view-export-search) | Contact listing permission: view, export, search | Contacts/Apartments | P2 | Regression | Auto-UI | Active |  |
| [RBAC-023](#rbac-023--apartment-listing-permission-view-export-search-filter) | Apartment listing permission: view, export, search, filter | Contacts/Apartments | P2 | Regression | Auto-UI | Review |  |
| [RBAC-024](#rbac-024--contact-detail-view-permission-incl-ar-apartments) | Contact detail view permission incl. AR, apartments | Contacts/Apartments | P2 | Regression | Auto-UI | Review |  |
| [RBAC-025](#rbac-025--apartment-detail-view-permission-incl-ar-summary-ownertenant) | Apartment detail view permission incl. AR summary, owner/tenant | Contacts/Apartments | P2 | Regression | Auto-UI | Review |  |
| [RBAC-026](#rbac-026--view-unpaid-invoices-and-pdfs-in-contact-detail-needs-invoice-view) | View unpaid invoices and PDFs in Contact detail (needs Invoice view) | Contacts/Apartments | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-027](#rbac-027--view-invoices-and-pdfs-in-apartment-detail-needs-invoice-view) | View invoices and PDFs in Apartment detail (needs Invoice view) | Contacts/Apartments | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-028](#-rbac-028--create-invoicedn-under-apartment-needs-invoice-create--categories) | ★ Create invoice/DN under Apartment (needs Invoice create + categories) | Contacts/Apartments | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-029](#-rbac-029--wallet-recharge-permission-funding-received-or-unknown-received-create) | ★ Wallet recharge permission (Funding Received or Unknown Received create) | Wallet & Deposit | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-030](#-rbac-030--wallet-refund-permission-cash-outflow-create-hidden-when-no-balance) | ★ Wallet refund permission (Cash Outflow create); hidden when no balance | Wallet & Deposit | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-031](#-rbac-031--approve-wallet-refund-draft-cash-outflow-approve-via-notification) | ★ Approve wallet refund draft (Cash Outflow approve) via notification | Wallet & Deposit | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-032](#-rbac-032--wallet-transfer-permission-funding-received--cash-transfer-create) | ★ Wallet transfer permission (Funding Received + Cash Transfer create) | Wallet & Deposit | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-033](#-rbac-033--add-deposit-permission-funding-received-or-unknown-received-create) | ★ Add deposit permission (Funding Received or Unknown Received create) | Wallet & Deposit | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-034](#-rbac-034--withdraw-deposit-permission-cash-outflow-create) | ★ Withdraw deposit permission (Cash Outflow create) | Wallet & Deposit | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-035](#-rbac-035--make-payment-from-apartment-invoices-funding-received-create) | ★ Make payment from Apartment invoices (Funding Received create) | Payments | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-036](#rbac-036--contact-create-permission) | Contact create permission | Contacts/Apartments | P2 | Regression | Auto-UI | Active |  |
| [RBAC-037](#rbac-037--apartment-create-permission) | Apartment create permission | Contacts/Apartments | P2 | Regression | Auto-UI | Active |  |
| [RBAC-038](#rbac-038--contact-edit-permission) | Contact edit permission | Contacts/Apartments | P2 | Regression | Auto-UI | Active |  |
| [RBAC-039](#rbac-039--apartment-edit-permission-incl-ownertenant) | Apartment edit permission incl. owner/tenant | Contacts/Apartments | P2 | Regression | Auto-UI | Active |  |
| [RBAC-040](#rbac-040--contact-delete-permission-only-contacts-without-transactions) | Contact delete permission (only contacts without transactions) | Contacts/Apartments | P2 | Regression | Auto-UI | Active |  |
| [RBAC-041](#rbac-041--apartment-delete-permission-only-apartments-without-transactions) | Apartment delete permission (only apartments without transactions) | Contacts/Apartments | P2 | Regression | Auto-UI | Active |  |
| [RBAC-042](#rbac-042--credit-note-report-view-permission-list-detail-filter-export) | Credit Note report view permission: list, detail, filter, export | Credit Notes | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-043](#-rbac-043--credit-note-create-permission-with-assigned-income-categories) | ★ Credit note create permission with assigned income categories | Credit Notes | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-044](#-rbac-044--credit-note-approve-permission-allows-approveremove-of-draft) | ★ Credit note approve permission allows approve/remove of draft | Credit Notes | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-045](#rbac-045--deposit-invoice-view-permission-approved-draft-pdf) | Deposit invoice view permission: approved, draft, PDF | Deposit Invoice | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-046](#-rbac-046--deposit-invoice-create-permission) | ★ Deposit invoice create permission | Deposit Invoice | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-047](#-rbac-047--deposit-invoice-approve-permission-allows-approveremove-of-draft) | ★ Deposit invoice approve permission allows approve/remove of draft | Deposit Invoice | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-048](#rbac-048--cash--bank-account-view-permission-list-and-search) | Cash & Bank account view permission: list and search | Cash & Bank Accounts | P2 | Regression | Auto-UI | Active |  |
| [RBAC-049](#rbac-049--cash--bank-account-create-permission-needs-setting-edit) | Cash & Bank account create permission (needs Setting edit) | Cash & Bank Accounts | P2 | E2E · Regression | Auto-UI | Review |  |
| [RBAC-050](#-rbac-050--cash--bank-account-edit-permission-incl-initial-balance) | ★ Cash & Bank account edit permission incl. initial balance | Cash & Bank Accounts | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-051](#rbac-051--cash--bank-account-delete-permission-no-transactions-only) | Cash & Bank account delete permission (no transactions only) | Cash & Bank Accounts | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-052](#rbac-052--global-search-finds-contactapartment-names-with-contacts-view) | Global search finds Contact/Apartment names with Contacts view | Global search | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-053](#rbac-053--global-search-finds-voucher-numbers-per-module-view-permission--by-document-type) | Global search finds voucher numbers per module View permission — by document type | Global search | P2 | E2E · Regression | Auto-UI | Active | 5 |
| [RBAC-054](#rbac-054--recent-receipt-view-permission-list-detail-voucher) | Recent Receipt view permission: list, detail, voucher | Cash Received | P2 | Regression | Auto-UI | Active |  |
| [RBAC-055](#rbac-055--unknown-cash-received-view-permission-list-by-currency-search-export) | Unknown Cash Received view permission: list by currency, search, export | Cash Received | P2 | Regression | Auto-UI | Active |  |
| [RBAC-056](#-rbac-056--unknown-cash-received-create-permission) | ★ Unknown Cash Received create permission | Cash Received | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-057](#-rbac-057--assign-unknown-cash-received-to-payerapartment-edit--categories) | ★ Assign Unknown Cash Received to payer/apartment (Edit + categories) | Cash Received | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [RBAC-058](#-rbac-058--funding-received-create-permission-with-income-with-funding-categories) | ★ Funding Received create permission with Income-with-Funding categories | Cash Received | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-059](#rbac-059--cash-outflow-view-permission-list-detail-voucher-remove-own-draft) | Cash Outflow view permission: list, detail, voucher, remove own draft | Cash Outflow | P2 | Regression | Auto-UI | Active |  |
| [RBAC-060](#-rbac-060--cash-outflow-create-permission-with-assigned-expense-categories) | ★ Cash Outflow create permission with assigned expense categories | Cash Outflow | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-061](#-rbac-061--cash-outflow-approve-permission-allows-approveremove-of-draft) | ★ Cash Outflow approve permission allows approve/remove of draft | Cash Outflow | P1 | Smoke · Regression | Auto-UI+API | Active |  |
| [RBAC-062](#rbac-062--remove-own-cash-outflow-draft-view--create) | Remove own Cash Outflow draft (View + Create) | Cash Outflow | P2 | Regression | Auto-UI | Active |  |
| [RBAC-063](#rbac-063--cash-transfer-view-permission-list-detail-voucher) | Cash Transfer view permission: list, detail, voucher | Cash Transfer | P2 | Regression | Auto-UI | Active |  |
| [RBAC-064](#-rbac-064--cash-transfer-create-permission-with-assigned-categories) | ★ Cash Transfer create permission with assigned categories | Cash Transfer | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-065](#-rbac-065--cash-transfer-approve-permission-allows-approveremove-of-draft) | ★ Cash Transfer approve permission allows approve/remove of draft | Cash Transfer | P1 | Regression | Auto-UI+API | Active |  |
| [RBAC-066](#rbac-066--remove-own-cash-transfer-draft-only-others-drafts-not-removable) | Remove own Cash Transfer draft only; others' drafts not removable | Cash Transfer | P2 | Regression | Auto-UI | Active |  |
| [RBAC-067](#rbac-067--setting-view-permission-shows-all-setting-sub-menus) | Setting view permission shows all Setting sub-menus | Setting | P2 | Regression | Auto-UI | Active |  |
| [RBAC-068](#rbac-068--setting-create-permission-for-categories-account-classification-master-data) | Setting create permission for categories, account classification, master data | Setting | P2 | Regression | Auto-UI | Active |  |
| [RBAC-069](#rbac-069--setting-edit-permission-for-general-setting-uo-pricing-categories-master-data) | Setting edit permission for general setting, UO pricing, categories, master data | Setting | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-070](#rbac-070--report-view-transactions-and-cash-received-reports--by-receipt-dependency) | Report view: Transactions and Cash Received reports — by receipt dependency | Reports | P2 | E2E · Regression | Auto-UI | Review | 2 |
| [RBAC-071](#rbac-071--report-view-transactions-and-cash-outflow-reports) | Report view: Transactions and Cash Outflow reports | Reports | P2 | E2E · Regression | Auto-UI | Review |  |
| [RBAC-072](#rbac-072--report-view-transactions-report-with-cash-transfer-view) | Report view: Transactions report with Cash Transfer view | Reports | P2 | E2E · Regression | Auto-UI | Review |  |
| [RBAC-073](#rbac-073--report-view-credit-note-report) | Report view: Credit Note report | Reports | P2 | E2E · Regression | Auto-UI | Active |  |
| [RBAC-074](#rbac-074--report-view-assigned-unknown-received-logs) | Report view: Assigned Unknown Received logs | Reports | P2 | E2E · Regression | Auto-UI | Review |  |
| [RBAC-075](#rbac-075--report-view-cash--bank-balance-and-account-statement-with-export) | Report view: Cash & Bank balance and Account Statement with export | Reports | P2 | E2E · Regression | Auto-UI | Review |  |
| [RBAC-076](#rbac-076--report-view-invoices-report-with-filter-export-detail) | Report view: Invoices report with filter, export, detail | Reports | P2 | E2E · Regression | Auto-UI | Review |  |
<!-- /generated:summary -->

## Test cases

### Dashboard

#### RBAC-001 · Dashboard view permission shows AR, cash & bank balance and net cash

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — ZL: no separate Dashboard permission in new EM; each figure needs its module View permission | Role&Permission r3 (TC_Role&Permission_001) |

**Feature:**

Dashboard  

**Permission required:**

Dashboard  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the Account Receivable Data of Current Date under Dashboard Menu
2. Can View Cash & Bank Balance under Dashboard Menu
3. Can View Net Cash Data of Different Currency for Current Date, last 3 Months Data
4. Can View Wallet and Deposit Data of Different Currency for Current Date and last 3 Months Data

> **Source comments:** No separate Dashboard permission in the new EM; each figure shows only with its module's View. Suggest: drop the dashboard permission from this row.

---

### AR

#### RBAC-002 · AR view permission shows AR ageing data

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r4 (TC_Role&Permission_002) |

**Feature:**

AR  

**Permission required:**

AR  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the Account Receivable Data of Current Date including Current ,Total Overdue Amount, 1-30 days overdue, 31-60 days overdue, 61-90 days overdue, 91-120 days overdue, 121-150 days overdue, 151-180 days overdue and >180 days overdue Amount
2. Can View the Account Receivable Data with different Currency
3. Can View the Invoices and Debit Notes including Current ,Total Overdue Amount, 1-30 days overdue, 31-60 days overdue, 61-90 days overdue, 91-120 days overdue, 121-150 days overdue, 151-180 days overdue and >180 days overdue Amount, Unpaid, Partially Paid Amount
4. Can filter and View the data for Different Currencies, Type: Invoices/Debit Notes, Category
5. Can Export the Invoices and Debit Notes Data with Excel Format
6. Can View the AR Snapshot Data of selected month for different Currencies
7. Can Export the AR Snapshot Data of selected month and currency with Excel Format

---

#### RBAC-003 · Bulk SOA view permission (AR + Contacts/Apartments view)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r5 (TC_Role&Permission_003) |

**Permission required:**

AR  
(Menu=Y, View=Y)  

**Permission dependency:**

Contacts/Apartments  
(View=Y)  

**Expected result:**

1. Can View the SOA data of selected Zone, Building, Currency and Month

---

### Invoices/Debit Notes

#### RBAC-004 · Invoice/DN view permission: list, detail, filter, export approved

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r6 (TC_Role&Permission_004) |

**Feature:**

Invoices/Debit Notes  

**Permission required:**

Invoices/Debit Notes  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the Invoices/Debit Notes listing
2. Can View the Invoice/Debit Note Detail
3. Can Filter the listing with Date Range, Building, Apartment and Currency
4. Can Export the Approved listing with Excel Format
5. Can View and Download PDF format of Invoice/Debit Note
6. Can View the Invoice/Debit Note Draft List
7. Can Filter with Building, Apartment, Category (if Income Categories are added as permission for the Login User)
8. Can Export the Invoice/Debit NoteDraft listing with Excel Format
9. Can View the Deposit Invoice Draft List
10. Can Filter with Building and Apartment
11. Can Export the Deposit Invoice Draft List with Excel Format

---

#### ★ RBAC-005 · Invoice/DN create permission limited to assigned income categories

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active | Role&Permission r7 (TC_Role&Permission_005) |

**Permission required:**

Invoices/Debit Notes  
(Menu=Y, View=Y, Create=Y)  

**Permission dependency:**

Need to add Assign Categories (Income Categories)  

**Expected result:**

1. Create the new Invoices/Debit Notes with the assigned Income Categories
2. Can Delete the Invoices/Debit Notes (Draft) which is Created by the Login User

---

#### ★ RBAC-006 · Invoice/DN approve permission allows approve/remove of draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active | Role&Permission r8 (TC_Role&Permission_006) |

**Permission required:**

Invoices/Debit Notes  
(Menu=Y, View=Y, Approve=Y)  

**Permission dependency:**

Need to add Assign Categories (Income Categories)  

**Precondition:**

There is at least one Created Invoices/Debit Notes with draft state.  

**Expected result:**

1. Can Approve or Remove the crated Invoice/Debit Note which is in Draft state

---

### UO

#### RBAC-007 · UO view permission: draft and approved lists, filter, search

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r9 (TC_Role&Permission_007) |

**Feature:**

UO  

**Permission required:**

UO  
(Menu=Y, View=Y)  

**Precondition:**

There is at least one Created UO with Draft state to see the UO Draft icon.  

**Expected result:**

1. Can View UO Draft list
2. Can View the UO Listing which has been Approved
3. Can Filter with Zone & Building and Month in Approved Listing and Draft Listing
4. Can Search with Desired Keyword in Approved and Draft Listing

---

#### ★ RBAC-008 · UO create permission: new draft, import, download template

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r10 (TC_Role&Permission_008) |

**Permission required:**

UO  
(Menu=Y, View=Y, Create=Y)  

**Expected result:**

1. Can Create new UO Draft by clicking 'New UO Draft' button
2. Can Import the UO Data by clicking 'Import' button
3. Can Download the CSV Template regarding to the selected Zone and Building for the UO Import

---

#### ★ RBAC-009 · UO edit permission allows editing UO drafts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r11 (TC_Role&Permission_009) |

**Permission required:**

UO  
(Menu=Y, View=Y, Edit=Y)  

**Expected result:**

1. Can edit the UO Draft list.

---

#### ★ RBAC-010 · UO approve permission allows single and bulk approve of drafts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active | Role&Permission r12 (TC_Role&Permission_010) |

**Permission required:**

UO  
(Menu=Y, View=Y, Approve=Y)  

**Precondition:**

There is at least one Created UO with Draft state .  

**Expected result:**

1. Can Approve the UO Draft
2. Can Bulk Approve the UO Draft

---

#### RBAC-011 · UO delete permission allows deleting UO drafts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r13 (TC_Role&Permission_011) |

**Permission required:**

UO  
(Menu=Y, View=Y, Delete=Y)  

**Precondition:**

There is at least one Created UO with Draft state .  

**Expected result:**

1. Can Delete the UO Draft

---

#### RBAC-012 · UO PDF view requires Invoices/Debit Notes view

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r14 (TC_Role&Permission_012) |

**Permission required:**

UO  
(Menu=Y, View=Y)  

**Permission dependency:**

Invoices/Debit Notes  
(View=Y)  

**Expected result:**

1. Can View the PDF file of UO listing regarding to the selected month and Zone, Building

---

### UO meter reset

#### RBAC-013 · Meter reset view permission: draft/approved logs, filter, search

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r15 (TC_Role&Permission_013) |

**Permission required:**

UO  
(Menu=Y, View=Y)  

**Permission dependency:**

Meter Reset  
(View=Y)  

**Expected result:**

1. Can View Meter Reset Logs (Draft and Apporved Listing)
2. Can Filter with Zone and Building in Draft and Approved listing
3. Can Search with desired keyword in Draft and Approved listing

---

#### RBAC-014 · Meter reset create permission

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r16 (TC_Role&Permission_014) |

**Permission required:**

UO  
(Menu=Y, View=Y)  

**Permission dependency:**

Meter Reset  
(View=Y, Create=Y)  

**Expected result:**

1. Can Create new Meter Reset record by clicking 'New Meter Reset' button

---

#### ★ RBAC-015 · Meter reset approve permission

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r17 (TC_Role&Permission_015) |

**Permission required:**

UO  
(Menu=Y, View=Y)  

**Permission dependency:**

Meter Reset  
(View=Y, Approve=Y)  

**Precondition:**

There is at least one Created Meter Reset Record with Draft state .  

**Expected result:**

1. Can Approve the Meter Reset Draft Record

---

#### RBAC-016 · Meter reset delete permission for drafts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r18 (TC_Role&Permission_016) |

**Permission required:**

UO  
(Menu=Y, View=Y)  

**Permission dependency:**

Meter Reset  
(View=Y, Delete=Y)  

**Precondition:**

There is at least one Created Meter Reset Record with Draft state .  

**Expected result:**

1. Can Delete the Meter Reset Draft Record

---

### EM

#### RBAC-017 · EM view permission: draft and approved lists, filter, search

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r19 (TC_Role&Permission_017) |

**Feature:**

EM  

**Permission required:**

EM  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View EM Draft list
2. Can View the EM Listing which has been Approved
3. Can Filter with Zone & Building and Month in Approved and Draft Listing
4. Can Search with Desired Keyword in Approved and Draft Listing

---

#### ★ RBAC-018 · EM create permission: new draft and import

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r20 (TC_Role&Permission_018) |

**Permission required:**

EM  
(Menu=Y, View=Y, Create=Y)  

**Expected result:**

1. Can Create new EM Draft by clicking 'New EM Draft' button
2. Can Import the EM Data by clicking 'Import' button

---

#### ★ RBAC-019 · EM edit permission allows editing EM drafts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r21 (TC_Role&Permission_019) |

**Permission required:**

EM  
(Menu=Y, View=Y, Edit=Y)  

**Expected result:**

1. Can Edit the EM Draft list.

---

#### ★ RBAC-020 · EM approve permission allows single and bulk approve of drafts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active — Source title says "UO Draft" — typo, row is EM | Role&Permission r22 (TC_Role&Permission_020) |

**Permission required:**

EM  
(Menu=Y, View=Y, Approve=Y)  

**Precondition:**

There is at least one EM Record with Draft state .  

**Expected result:**

1. Can Approve the EM Draft
2. Can Bulk Approve the EM Draft

---

#### RBAC-021 · EM delete permission allows deleting EM drafts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r23 (TC_Role&Permission_021) |

**Permission required:**

EM  
(Menu=Y, View=Y, Delete=Y)  

**Precondition:**

There is at least one EM Record with Draft state .  

**Expected result:**

1. Can Delete the EM Draft

---

### Contacts/Apartments

#### RBAC-022 · Contact listing permission: view, export, search

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r24 (TC_Role&Permission_022) |

**Feature:**

Contacts/Apartments  

**Permission required:**

Contacts/Apartments  
(Menu=Y)  

**Expected result:**

1. Can see the Contact listing
2. Can Export the Contact listing in Excel format
3. Can Search with keyword

---

#### RBAC-023 · Apartment listing permission: view, export, search, filter

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — ZL: export includes owner/tenant details so Contact view is also required — update row | Role&Permission r25 (TC_Role&Permission_023) |

**Permission required:**

Contacts/Apartments  
(Menu=Y)  

**Expected result:**

1. Can see the Apartment listing
2. Can Export the Apartment listing in Excel format
3. Can Search with keyword
4. Can filter with Zone and Building

> **Source comments:** The export carries owner and tenant details, so the new EM also needs Contact view. Suggest: add Contact view to this row.

---

#### RBAC-024 · Contact detail view permission incl. AR, apartments

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — ZL: money panels need Invoices/Debit Notes view and Wallet view — update row | Role&Permission r26 (TC_Role&Permission_024) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Expected result:**

1. Can see the Contact Detail
2. Can View the Account Receivable of the selected Contact in Detail Screen
3. Can View the Account Receivable for different Currencies
4. Can View the Apartment Owned and Apartment Tenanted and Contact Detail Infomation under Summay of Contact Detail Screen
5. Can View the Unpaid Invoices of the selected Contact

> **Source comments:** The new EM needs each module's own View permission for its money panel. Suggest: add Invoices/Debit Notes view and Wallet view to this row.

---

#### RBAC-025 · Apartment detail view permission incl. AR summary, owner/tenant

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — ZL: money panels need Invoices/Debit Notes view and Wallet view — update row | Role&Permission r27 (TC_Role&Permission_025) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the Account Receivable of the selected Apartment in Apartment Detail Screen => Summary
2. Can View the Previous and Current Owner and Tenant Information in n Apartment Detail Screen => Summary
3. Can View the Invoices of the Apartment in Apartment Detail Screen=> Invoices
4. Can Filter with Unpaid Only and Current Invoices
5. Can Export the Invoices with Excel format
6. Can View SOA of Current Month, Desired Month and All History (for different Currencies) under Apartment Detail Screen => SOA
7. Can Export the SOA Result with PDF format
8. Can View the Wallet Transaction of Current Month and Desired Month (for different Currencies) under Apartment Detail Screen => Wallet
9. Can Export the Wallet Transaction Record with PDF format
10. Can View the Deposit Transaction of Current Month and Desired Month (for different Currencies) under Apartment Detail Screen => Deposit
11. Can Export the Deposit Transaction Record with PDF format
12. Can Add the new Note for the Apartment and can Edit the Created Note under Apartment Detail Screen => Note

> **Source comments:** The new EM needs each module's own View permission for its money panel. Suggest: add Invoices/Debit Notes view and Wallet view to this row.

---

#### RBAC-026 · View unpaid invoices and PDFs in Contact detail (needs Invoice view)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r28 (TC_Role&Permission_026) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Invoices/Debit Notes  
(View=Y)  

**Expected result:**

1. Can View the Unpaid Invoices/Debit Notes Detail of each Contact in Contact Detail Screen => Unpaid Invoices
2. Can View and Download PDF format of each Unpaid Invoice

---

#### RBAC-027 · View invoices and PDFs in Apartment detail (needs Invoice view)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r29 (TC_Role&Permission_027) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Invoices/Debit Notes  
(View=Y)  

**Expected result:**

1. Can View the Invoices/Debit Notes Detail of each Contact in Apartment Detail Screen => Invoices
2. Can View and Download PDF format of each Invoice

---

#### ★ RBAC-028 · Create invoice/DN under Apartment (needs Invoice create + categories)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r30 (TC_Role&Permission_028) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Invoices/Debit Notes  
(Create=Y)  
Need to add Assign Categories (Income Categories)  

**Expected result:**

1. Create the new Invoices/Debit Notes with the assigned Income Categories
2. Can Delete the Invoices/Debit Notes (Draft) which is Created by the Login User

---

### Wallet & Deposit

#### ★ RBAC-029 · Wallet recharge permission (Funding Received or Unknown Received create)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r31 (TC_Role&Permission_029) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Funding Received (Create =Y)  
(or)  
Unknown Cash Received (Create=Y)  

**Expected result:**

1. Can Make Wallet Recharge by clicking Apartment Detail => Wallet=> Recharge button.

---

#### ★ RBAC-030 · Wallet refund permission (Cash Outflow create); hidden when no balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r32 (TC_Role&Permission_030) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Cash Outflow  
(Create =Y)  

**Precondition:**

The selected Apartment's Wallet is need to have Balance.  

**Expected result:**

1. Can Make Wallet Refund by clicking Apartment Detail => Wallet => Refund button (The selcted Apartment is needed to have Wallet Balance. Otherwise, the 'Wallet Refund' does not appear.)
2. Can Remove the Wallet Fund Draft List under Notification Bar=> PV
   (User can only remove the wallet refund record which has been created himself)

---

#### ★ RBAC-031 · Approve wallet refund draft (Cash Outflow approve) via notification

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r33 (TC_Role&Permission_031) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Cash Outflow  
(View=Y, Approve=Y)  

**Precondition:**

There is at least one Wallet Refund Record with Draft state .  

**Expected result:**

1. Can Approve or Remove the Wallet Fund Draft which is created by login user or not in Notification Bar => PV

---

#### ★ RBAC-032 · Wallet transfer permission (Funding Received + Cash Transfer create)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r34 (TC_Role&Permission_032) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Funding Received (Create=Y)  
AND  
Cash Transfer (Create=Y)  

**Expected result:**

1. Can Make Wallet Transfer by clicking Apartment Detail => Wallet => Wallet Transfer button

---

#### ★ RBAC-033 · Add deposit permission (Funding Received or Unknown Received create)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r35 (TC_Role&Permission_033) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Funding Received (Create =Y)  
(or)  
Unknown Cash Received (Create=Y)  

**Expected result:**

1. Can Add Deposit by clicking Apartment Detail => Deposit => Add Deposit button.

---

#### ★ RBAC-034 · Withdraw deposit permission (Cash Outflow create)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r36 (TC_Role&Permission_034) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Cash Outflow  
(Create =Y)  

**Precondition:**

The selected Apartment's Deposit Balance must be greater than 0.  

**Expected result:**

1. Can Withdraw the Deposit by clicking Apartment Detail => Deposit => Withdraw Deposit.

---

### Payments

#### ★ RBAC-035 · Make payment from Apartment invoices (Funding Received create)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r37 (TC_Role&Permission_035) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Permission dependency:**

Funding Received  
(Create =Y)  

**Precondition:**

There is at least one Invoices/Debite Notes which has been approved.  

**Expected result:**

1. Can Make Payment from Apartment Detail => Invoices => Make Payment

---

### Contacts/Apartments

#### RBAC-036 · Contact create permission

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r38 (TC_Role&Permission_036) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y, Create=Y)  

**Expected result:**

1. Can Create new Contact

---

#### RBAC-037 · Apartment create permission

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r39 (TC_Role&Permission_037) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y, Create=Y)  

**Expected result:**

2. Can Create new Apartment

---

#### RBAC-038 · Contact edit permission

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r40 (TC_Role&Permission_038) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y, Edit=Y)  

**Precondition:**

There is at least one created Contact.  

**Expected result:**

1. Can edit the Contact Information

---

#### RBAC-039 · Apartment edit permission incl. owner/tenant

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r41 (TC_Role&Permission_039) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, View=Y, Edit=Y)  

**Precondition:**

There is at least one created Apartment.  

**Expected result:**

1. Can edit the Apartment Information (Name, Status) and Owner , Tenant Information

---

#### RBAC-040 · Contact delete permission (only contacts without transactions)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r42 (TC_Role&Permission_040) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, Delete=Y)  

**Precondition:**

There is at least one Contact which does not have any transaction.  

**Expected result:**

1. Can delete the Created Contact that does not have any transactions

---

#### RBAC-041 · Apartment delete permission (only apartments without transactions)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r43 (TC_Role&Permission_041) |

**Permission required:**

Contacts/Apartments  
(Menu=Y, Delete=Y)  

**Precondition:**

There is at least one Apartment which does not have any transaction.  

**Expected result:**

1. Can delete the Created Apartment that does not have any transactions

---

### Credit Notes

#### RBAC-042 · Credit Note report view permission: list, detail, filter, export

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r44 (TC_Role&Permission_042) |

**Feature:**

Credit Note  

**Permission required:**

Credit Notes  
(Menu=Y, View=Y)  

**Permission dependency:**

Report  
(Menu=Y, View=Y)  

**Expected result:**

1. Can see the Credit Note Report under Report Menu
2. Can View the Credit Note Detail
3. Can Filter the Credit Note Report listing with Date Range, Building, Apartment
4. Can Export the Credit Note listing with Excel Format
5. Cannot View the Credit Note Draft Listing

---

#### ★ RBAC-043 · Credit note create permission with assigned income categories

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r45 (TC_Role&Permission_043) |

**Permission required:**

Credit Notes  
(Create=Y)  

**Permission dependency:**

Contacts/Apartments  
(Menu=Y, View=Y)  
Need to add Assign Categories (Income Categories)  

**Expected result:**

1. Can Create the new Credit Note by clicking "Add Credit Note" button under Apartment> Wallet

---

#### ★ RBAC-044 · Credit note approve permission allows approve/remove of draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r46 (TC_Role&Permission_044) |

**Permission required:**

Credit Notes  
(View=Y, Approve=Y)  

**Permission dependency:**

Contacts/Apartments  
(View=Y)  

**Precondition:**

There is at least one Created Credit Note with draft state.  

**Expected result:**

1. Can Approve or Remove the Credite Note which is in draft state.

---

### Deposit Invoice

#### RBAC-045 · Deposit invoice view permission: approved, draft, PDF

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r47 (TC_Role&Permission_045) |

**Feature:**

Deposit Invoice  

**Permission required:**

Invoices/Debit Notes  
(View=Y, Create=Y)  

**Permission dependency:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the Deposit Invoices which have been Approved under Apartment > Deposit > Deposit Invoice
2. Can View the Draft Deposit Invoices
3. Can View and Download PDF of the Added Deposit Record with monthly and currency filter

---

#### ★ RBAC-046 · Deposit invoice create permission

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r48 (TC_Role&Permission_046) |

**Permission required:**

Invoices/Debit Notes  
(View=Y, Create=Y)  

**Permission dependency:**

Contacts/Apartments  
(Menu=Y, View=Y, Create=Y)  

**Expected result:**

1. Can Create new Deposit Invoice

---

#### ★ RBAC-047 · Deposit invoice approve permission allows approve/remove of draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r49 (TC_Role&Permission_047) |

**Permission required:**

Invoices/Debit Notes  
(View=Y, Approve=Y)  

**Permission dependency:**

Contacts/Apartments  
(Menu=Y, View=Y)  

**Precondition:**

There is at least one Deposit Invoice with draft state which is created by login user.  

**Expected result:**

1. Can Approve/Remove the Created Deposit Invoice which is in Draft State and created by Login User

---

### Cash & Bank Accounts

#### RBAC-048 · Cash & Bank account view permission: list and search

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r50 (TC_Role&Permission_048) |

**Feature:**

Cash & Bank Account  

**Permission required:**

Cash & Bank Accounts  
(Menu=Y, View=Y) or (Menu=Y)  

**Permission dependency:**

- 

**Precondition:**

There is at least one created Cash & Bank Account.  

**Expected result:**

1. Can View the Created Cash & Bank Accounts
2. Can search the listing with desired keyword

---

#### RBAC-049 · Cash & Bank account create permission (needs Setting edit)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Review — ZL: creating with opening balance also needs account register Approve; test role lacks it | Role&Permission r51 (TC_Role&Permission_049) |

**Permission required:**

Cash & Bank Accounts  
(Menu=Y, Create=Y)  

**Permission dependency:**

Setting  
(Edit=Y)  

**Expected result:**

1. Can Create the new Cash & Bank Account

> **Source comments:** Creating with an opening balance also needs account register Approve, which the test role doesn't have. Suggest: grant it to the test role.

---

#### ★ RBAC-050 · Cash & Bank account edit permission incl. initial balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r52 (TC_Role&Permission_050) |

**Permission required:**

Cash & Bank Accounts  
(Menu=Y, View=Y, Edit=Y)  

**Permission dependency:**

Setting  
(Edit=Y)  

**Precondition:**

There is at least one created Cash & Bank Account.  

**Expected result:**

1. Can Edit the Initial Balance of each Cash & Bank Account
2. Can Edit the Cash & Bank Information

---

#### RBAC-051 · Cash & Bank account delete permission (no transactions only)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r53 (TC_Role&Permission_051) |

**Permission required:**

Cash & Bank Accounts  
(Menu=Y, View=Y, Edit=Y, Delete=Y)  

**Permission dependency:**

Setting  
(Delete =Y)  

**Precondition:**

There is at least one created Cash & Bank Account which does not have any transaction.  

**Expected result:**

1. Can Delete the Created Cash & Bank Account which has no transaction

---

### Global search

#### RBAC-052 · Global search finds Contact/Apartment names with Contacts view

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r54 (TC_Role&Permission_052) |

**Feature:**

Search  

**Permission required:**

Search  
(View=Y)  

**Permission dependency:**

Contacts/Apartments  
(View=Y)  

**Precondition:**

There is at least one Contact and one Apartment.  

**Expected result:**

1. Can Search the Contact or Apartment Name

---

#### RBAC-053 · Global search finds voucher numbers per module View permission — by document type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r55 (TC_Role&Permission_053) |

**Permission required:**

Search  
(View=Y)  

**Permission dependency:**

Invoices/Debit Notes  
(View=Y)  

**Precondition:**

There is at least one Invoices/Debite Notes.  

**Expected result:**

1. Can search the Invoice Number for Invoices, Debit Notes, UO, EM

**Data variants (5 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) — | Role&Permission r55 (TC_Role&Permission_053) | |
| 2 | Doc=RV; Dependency=Recent/Unknown/Funding Received view; plus PDF view/download | Role&Permission r56 (TC_Role&Permission_054) |  |
| 3 | Doc=PV; Dependency=Cash Outflow view | Role&Permission r57 (TC_Role&Permission_055) |  |
| 4 | Doc=JV; Dependency=Cash Transfer view | Role&Permission r58 (TC_Role&Permission_056) |  |
| 5 | Doc=CN; Dependency=Credit Note view; plus voucher view | Role&Permission r59 (TC_Role&Permission_057) |  |

---

### Cash Received

#### RBAC-054 · Recent Receipt view permission: list, detail, voucher

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r60 (TC_Role&Permission_058) |

**Feature:**

Recent Receipt  

**Permission required:**

Recent Receipt  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the Recent Receipt listing under Cash Received
2. Can View the Recent Receipt Detail
3. Can View the Recent Receipt Voucher

---

#### RBAC-055 · Unknown Cash Received view permission: list by currency, search, export

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r61 (TC_Role&Permission_059) |

**Feature:**

Unknown Cash Received  

**Permission required:**

Unkown Cash Received  
(Menu=Y, View=Y)  

**Permission dependency:**

Report  
(View=Y)  

**Expected result:**

1. Can View Unkown Cash Received Records by changing different currencies under Cash Received => Unknown Cash Received => Unknown Cash Received Allocation
2. Can Search with Keyword
3. Can Export the Unknown Cash Received which are note assigned with Excel Format

---

#### ★ RBAC-056 · Unknown Cash Received create permission

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r62 (TC_Role&Permission_060) |

**Permission required:**

Unkown Cash Received  
(Menu=Y, View=Y, Create =Y)  

**Permission dependency:**

Report  
(View=Y)  

**Expected result:**

1. Can Create New Unknown Received Allocation and can View the created one under Unknown Received Allocation

---

#### ★ RBAC-057 · Assign Unknown Cash Received to payer/apartment (Edit + categories)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Role&Permission r63 (TC_Role&Permission_061) |

**Permission required:**

Unkown Cash Received  
(Menu=Y, View=Y, Edit =Y)  

**Permission dependency:**

Report  
(View=Y)  
AND  
Need to Add Assign Categories ( Income with Funding )  
If user wants to assign Apartment for the Unknown Received, need to give the permission for  
Contacts/Apartments (View=Y).  

**Precondition:**

There is at least one Unknow Received Transaction.  

**Expected result:**

1. Can Assign the Unknown Received to Payer or Apartment by clicking Manage button in Unknown Received Allocation Screen.

---

#### ★ RBAC-058 · Funding Received create permission with Income-with-Funding categories

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r64 (TC_Role&Permission_062) |

**Feature:**

Funding Received  

**Permission required:**

Funding Received  
(Menu=Y, View=Y, Create=Y)  

**Permission dependency:**

Report (View=Y)  
AND  
Need to Add Assign Categories (Income with Funding)  

**Expected result:**

1. Can Create new Funding Recieved Records

---

### Cash Outflow

#### RBAC-059 · Cash Outflow view permission: list, detail, voucher, remove own draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r65 (TC_Role&Permission_063) |

**Feature:**

Cash Outflow  

**Permission required:**

Cash Outflow  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the Cash Outflow listing
2. Can View the Cash Outflow Detail
3. Can View the Cash Outflow Voucher
4. Can Remove the Cash Outflow Draft which is created by the Login User

---

#### ★ RBAC-060 · Cash Outflow create permission with assigned expense categories

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r66 (TC_Role&Permission_064) |

**Permission required:**

Cash Outflow  
(Menu=Y, View=Y, Create=Y)  

**Permission dependency:**

Need to add Assign Categories (Expense Categories)  

**Expected result:**

1. Can Create the new Cash Outflow in Draft State

---

#### ★ RBAC-061 · Cash Outflow approve permission allows approve/remove of draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI+API | Active | Role&Permission r67 (TC_Role&Permission_065) |

**Permission required:**

Cash Outflow  
(Menu=Y, View=Y, Approve=Y)  

**Precondition:**

There is at least one Created Cash Outflow record with draft state.  

**Expected result:**

1. Can Approve or Remove the crated Cash Outflow data which is in Draft state

---

#### RBAC-062 · Remove own Cash Outflow draft (View + Create)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r68 (TC_Role&Permission_066) |

**Permission required:**

Cash Outflow  
(View=Y, Create=Y)  

**Precondition:**

There is at least one Created Cash Outflow record with draft state.  

**Expected result:**

1. Can Remove the Created Cash Outflow data which is in Draft state

---

### Cash Transfer

#### RBAC-063 · Cash Transfer view permission: list, detail, voucher

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r69 (TC_Role&Permission_067) |

**Feature:**

Cash Transfer  

**Permission required:**

Cash Transfer  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the Cash Transfer listing
2. Can View the Cash Transfer Detail
3. Can View the Cash Transfer Voucher

---

#### ★ RBAC-064 · Cash Transfer create permission with assigned categories

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r70 (TC_Role&Permission_068) |

**Permission required:**

Cash Transfer  
(Menu=Y, View=Y, Create=Y)  

**Permission dependency:**

Need to add Expense Assign Categories  

**Expected result:**

1. Can Create the new Cash Transfer in Draft State

---

#### ★ RBAC-065 · Cash Transfer approve permission allows approve/remove of draft

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Role&Permission r71 (TC_Role&Permission_069) |

**Permission required:**

Cash Transfer  
(Menu=Y, View=Y, Approve=Y)  

**Precondition:**

There is at least one Created Cash Transfer record with draft state.  

**Expected result:**

1. Can Approve or Remove the crated Cash Transfer data which is in Draft state

---

#### RBAC-066 · Remove own Cash Transfer draft only; others' drafts not removable

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active — Source title says "Cash Outflow" — typo, row is Cash Transfer | Role&Permission r72 (TC_Role&Permission_070) |

**Permission required:**

Cash Transfer  
(View=Y, Create=Y)  

**Precondition:**

There is at least one Created Cash Transfer record with draft state.  

**Expected result:**

1. Can Remove the Created Cash Transfer data which is in Draft state
   (Note: Users are not permitted to remove the records that they did not Create.)

---

### Setting

#### RBAC-067 · Setting view permission shows all Setting sub-menus

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r73 (TC_Role&Permission_071) |

**Feature:**

Setting  

**Permission required:**

Setting  
(Menu=Y, View=Y)  

**Expected result:**

1. Can View the General Setting
2. Can View the UO Pricing Listing
3. Can View the Income Categories Listing
4. Can View the Expense Categories Listing
5. Can View the Currency, Payment Method, Payment Type, Bank under Account Classification Listing
6. Can View Location Listing
7. Can View Zones Listing
8. Can View Building Listing
9. Can View Staff Listing
10. Can View Role Listing
11. Can View API Access (URL and Account Credentials)
12. Can click API Docs and open the API Accessible page

---

#### RBAC-068 · Setting create permission for categories, account classification, master data

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Role&Permission r74 (TC_Role&Permission_072) |

**Permission required:**

Setting  
(Menu=Y, View=Y, Create=Y))  

**Expected result:**

1. Can Create new Income Category
2. Can Create new Expense Category
3. Can Create new Currency, new Payment Method, new Payment Type, new Bank under Account Classification Listing
4. Can Create new Location and searchable
5. Can Create new Zone and search with keyword
6. Can Create new Building and search with keyword
7. Can Create new Staff and search with keyword
8. Can Create new Role and searchable with keyword
9. Can add API Access

---

#### RBAC-069 · Setting edit permission for general setting, UO pricing, categories, master data

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active | Role&Permission r75 (TC_Role&Permission_073) |

**Permission required:**

Setting  
(Menu=Y, View=Y, Edit=Y))  

**Precondition:**

There is at least one record for the respective menu.  

**Expected result:**

1. Can edit the Old Co.Ref Number (Enable/Disable) under General Setting
2. Can edit the UO Pricing Listing
3. Can edit the Income Categories Listing (Change Name,Add Parent Category, Change Status, make Sorting), can drag and drop the item to sort.
4. Can View the Expense Categories Listing (Change Name,Add Parent Category, Change Status, make Sorting), can drag and drop the item to sort.
5. Can edit the Currency, Payment Method, Payment Type, Bank under Account Classification Listing
6. Can edit the Created Location
7. Can edit the Created Zone information
8. Can edit the Created Building Informatin
9. Can edit the Created Staff Information
10. Can edit the name and permission of the Created Role
11. Can edit the permission of the Created API Access

---

### Reports

#### RBAC-070 · Report view: Transactions and Cash Received reports — by receipt dependency

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Review — Known difference (ZL): all reports sit under one Reports permission, not one per report — rewrite dependency | Role&Permission r76 (TC_Role&Permission_074) |

**Feature:**

Report  

**Permission required:**

Report  
(Menu=Y, View=Y)  

**Permission dependency:**

Funding Received (View=Y), AR ( Menu and View)  

**Precondition:**

There is at least one Funding Received Record.  

**Expected result:**

1. Can View the Transaction Records Under Report > Transactions.
2. Can View the Cash Received Records Under Reprot> Cash Received
3. Can View Detail and Voucher
4. Can Filter with Date Range, Currency, Location, Bank Account, Category, Building and Status
5. Can Export the Excel File

> **Source comments:** All seven reports show under one Reports permission instead of one per report. Suggest: accept as a known difference this release.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) View Transaction Report and Cash Received | Role&Permission r76 (TC_Role&Permission_074) | |
| 2 | Dependency=Unknown Cash Received view | Role&Permission r77 (TC_Role&Permission_075) | Review; Known difference (ZL): all reports sit under one Reports permission, not one per report — rewrite dependency |

---

#### RBAC-071 · Report view: Transactions and Cash Outflow reports

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Review — Known difference (ZL): all reports sit under one Reports permission, not one per report — rewrite dependency | Role&Permission r78 (TC_Role&Permission_076) |

**Permission required:**

Report  
(Menu=Y, View=Y)  

**Permission dependency:**

Cash Outflow (View=Y), AR ( Menu and View)  

**Precondition:**

There is at least one Cash Outflow Record.  

**Expected result:**

1. Can View the Transaction Records Under Report > Transactions.
2. Can View the Cash Outflow Records Under Reprot> Cash Outflow
3. Can View Detail and Voucher
4. Can filter with Transaction Type (Cash Outlow or Wallet Payement) in Report >Transactions listing and Report> Cash Outflow listing.
5. Can Filter with Date Range, Currency, Location, Bank Account, Category, Building and Status
6. Can Export the Excel File

> **Source comments:** All seven reports show under one Reports permission instead of one per report. Suggest: accept as a known difference this release.

---

#### RBAC-072 · Report view: Transactions report with Cash Transfer view

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Review — Known difference (ZL): all reports sit under one Reports permission, not one per report — rewrite dependency | Role&Permission r79 (TC_Role&Permission_077) |

**Permission required:**

Report  
(Menu=Y, View=Y)  

**Permission dependency:**

Cash Transfer (View=Y), AR ( Menu and View)  

**Precondition:**

There is at least one Cash Transfer Record.  

**Expected result:**

1. Can View the Transaction Records Under Report > Transactions.
2. Can filter with Transaction Type (Cash Outlow or Wallet Payement) in Report >Transactions listing
3. Can View Detail and Voucher
4. Can Filter with Date Range, Currency, Location, Bank Account, Category, Building and Status
5. Can Export the Excel File

> **Source comments:** All seven reports show under one Reports permission instead of one per report. Suggest: accept as a known difference this release.

---

#### RBAC-073 · Report view: Credit Note report

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Active — Source priority blank | Role&Permission r80 (TC_Role&Permission_078) |

**Permission required:**

Report  
(Menu=Y, View=Y)  

**Permission dependency:**

Credit Note (Menu = Y and View = Y)  

**Precondition:**

There is at least one Credit Note Transaction.  

**Expected result:**

1. Can View the Credit Note which has at least one been assigned
2. Can View Detail and Voucher
3. Can filter the record
4. Can Export the Excel File

---

#### RBAC-074 · Report view: Assigned Unknown Received logs

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Review — Known difference (ZL): all reports sit under one Reports permission, not one per report — rewrite dependency | Role&Permission r81 (TC_Role&Permission_079) |

**Permission required:**

Report  
(Menu=Y, View=Y)  

**Permission dependency:**

Recent Receipt (View=Y)  
AND  
Setting (Edit=Y)  

**Precondition:**

There is at least one Unknown Cash Received Record which has been assigned to Payer or Apartment.  

**Expected result:**

1. Can View the Unknown Cash Received Log which has at least one been assigned
2. Can View Detail and Voucher
3. Can filter the record
4. Can Export the Excel File

> **Source comments:** All seven reports show under one Reports permission instead of one per report. Suggest: accept as a known difference this release.

---

#### RBAC-075 · Report view: Cash & Bank balance and Account Statement with export

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Review — Known difference (ZL): all reports sit under one Reports permission, not one per report — rewrite dependency | Role&Permission r82 (TC_Role&Permission_080) |

**Permission required:**

Report  
(Menu=Y, View=Y)  

**Permission dependency:**

Cash & Bank Account  
(View=Y)  

**Precondition:**

There is at least one Cash and Bank Account.  

**Expected result:**

1. Can View the Cash & Bank Balance
2. Can Export the Cash & Bank Balance with Excel and PDF
3. Can View the Account Statement of each Account by Date Range
4. Can Export the Account Statement of selected Account and Date Range with Excel and PDF format

> **Source comments:** All seven reports show under one Reports permission instead of one per report. Suggest: accept as a known difference this release.

---

#### RBAC-076 · Report view: Invoices report with filter, export, detail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | E2E · Regression | Auto-UI | Review — Known difference (ZL): all reports sit under one Reports permission, not one per report — rewrite dependency | Role&Permission r83 (TC_Role&Permission_081) |

**Permission required:**

Report  
(Menu=Y, View=Y)  

**Permission dependency:**

Invoices/Debit Notes  
(View=Y)  

**Precondition:**

There is at least one Invoice/Debit Note.  

**Expected result:**

1. Can View the Invoices listing under Report
2. Can Filter with Date Range, Invoice Type, Building and Apartment
3. Can Export the Invoices listing with Excel Format
4. Can View Detail of each Invoice
5. Can View and Download PDF of the Invoice in Invoice Detail

> **Source comments:** All seven reports show under one Reports permission instead of one per report. Suggest: accept as a known difference this release.

---
