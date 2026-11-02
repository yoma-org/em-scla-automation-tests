# 06 · UO Import (bulk meter readings)

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 38 (+26 data-variant rows)  
**Priority:** P1 11 · P2 26 · P3 1 · **★ Critical:** 11 · **Smoke:** 1 · **E2E:** 6 · **Auto:** 37 · **Manual:** 1 · **Review:** 4

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [UOI-001](#-uoi-001--uo-import-succeeds-in-month-after-last-reading---by-previous-reading-source) | ★ UO import succeeds in month after last reading - by previous reading source | Single-record import rules | P1 | Smoke · E2E · Regression | Auto-UI+API | Active | 3 |
| [UOI-002](#-uoi-002--uo-import-later-in-same-month-as-last-manualmeter-reset-reading-succeeds) | ★ UO import later in same month as last manual/meter-reset reading succeeds | Single-record import rules | P1 | Regression | Auto-UI+API | Review | 2 |
| [UOI-003](#uoi-003--uo-import-in-same-month-as-last-bulk-upload-is-rejected) | UO import in same month as last bulk upload is rejected | Single-record import rules | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-004](#-uoi-004--uo-import-accepts-units-equal-to-or-greater-than-last-units) | ★ UO import accepts units equal to or greater than last units | Single-record import rules | P1 | Regression | Auto-UI+API | Active |  |
| [UOI-005](#-uoi-005--uo-import-with-zero-consumption-creates-000-invoice-marked-paid) | ★ UO import with zero consumption creates 0.00 invoice marked Paid | Single-record import rules | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [UOI-006](#uoi-006--uo-import-rejects-record-with-blank-units) | UO import rejects record with blank units | Single-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-007](#uoi-007--uo-import-rejects-reading-date-earlier-than-last-reading-date) | UO import rejects reading date earlier than last reading date | Single-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-008](#uoi-008--uo-import-rejects-future-reading-date) | UO import rejects future reading date | Single-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-009](#uoi-009--uo-import-rejects-units-lower-than-last-reading) | UO import rejects units lower than last reading | Single-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-010](#uoi-010--uo-import-rejects-invalid-csv-structure-history-counts-0---extra-column--missing-header) | UO import rejects invalid CSV structure (history counts 0) - extra column / missing header | File format validation | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-011](#uoi-011--uo-import-of-header-only-csv-completes-with-0-counts) | UO import of header-only CSV completes with 0 counts | File format validation | P3 | Regression | Auto-UI+API | Active |  |
| [UOI-012](#-uoi-012--multi-record-import---2-valid-records-for-one-apartment-both-succeed) | ★ Multi-record import - 2 valid records for one apartment both succeed | Multi-record import rules | P1 | E2E · Regression | Auto-UI+API | Active |  |
| [UOI-013](#uoi-013--multi-record-import---second-record-in-same-monthdate-rejected-first-saved) | Multi-record import - second record in same month/date rejected (first saved) | Multi-record import rules | P2 | Regression | Auto-UI+API | Active | 4 |
| [UOI-014](#-uoi-014--multi-record-import---zero-consumption-records-succeed-with-000-paid-invoice) | ★ Multi-record import - zero-consumption records succeed with 0.00 Paid invoice | Multi-record import rules | P1 | E2E · Regression | Auto-UI+API | Active | 3 |
| [UOI-015](#uoi-015--multi-record-import---2nd-record-units-lower-than-1st-previous-successful-rejected) | Multi-record import - 2nd record units lower than 1st (previous successful) rejected | Multi-record import rules | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-016](#uoi-016--multi-record-import---both-records-with-blank-units-fail) | Multi-record import - both records with blank units fail | Multi-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-017](#uoi-017--multi-record-import---record-with-blank-units-fails-other-succeeds) | Multi-record import - record with blank units fails, other succeeds | Multi-record import rules | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-018](#uoi-018--multi-record-import---both-records-in-last-reading-month-fail) | Multi-record import - both records in last reading month fail | Multi-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-019](#uoi-019--multi-record-import---record-in-last-reading-month-fails-other-succeeds) | Multi-record import - record in last reading month fails, other succeeds | Multi-record import rules | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-020](#uoi-020--multi-record-import---2nd-record-dated-before-1st-record-fails) | Multi-record import - 2nd record dated before 1st record fails | Multi-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-021](#uoi-021--multi-record-import---both-records-dated-before-last-reading-fail) | Multi-record import - both records dated before last reading fail | Multi-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-022](#uoi-022--multi-record-import---record-dated-before-last-reading-fails-other-succeeds) | Multi-record import - record dated before last reading fails, other succeeds | Multi-record import rules | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-023](#uoi-023--multi-record-import---both-records-future-dated-fail) | Multi-record import - both records future-dated fail | Multi-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-024](#uoi-024--multi-record-import---future-dated-record-fails-other-succeeds) | Multi-record import - future-dated record fails, other succeeds | Multi-record import rules | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-025](#uoi-025--multi-record-import---one-earlier-than-last-and-one-future-record-both-fail) | Multi-record import - one earlier-than-last and one future record both fail | Multi-record import rules | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-026](#uoi-026--multi-record-import---both-records-with-units-below-last-reading-fail) | Multi-record import - both records with units below last reading fail | Multi-record import rules | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-027](#uoi-027--multi-record-import---record-with-units-below-last-reading-fails-other-succeeds) | Multi-record import - record with units below last reading fails, other succeeds | Multi-record import rules | P2 | Regression | Auto-UI+API | Active | 2 |
| [UOI-028](#-uoi-028--concurrent-upload---2nd-upload-blocked-while-users-1st-upload-in-progress) | ★ Concurrent upload - 2nd upload blocked while user's 1st upload in progress | Concurrent upload | P1 | Regression | Auto-API | Active | 2 |
| [UOI-029](#-uoi-029--duplicate-upload---re-uploading-the-same-file-is-rejected) | ★ Duplicate upload - re-uploading the same file is rejected | Concurrent upload | P1 | Regression | Auto-API | Active | 3 |
| [UOI-030](#-uoi-030--upload-of-a-different-file-after-previous-upload-succeeds) | ★ Upload of a different file after previous upload succeeds | Concurrent upload | P1 | Regression | Auto-API | Active | 3 |
| [UOI-031](#uoi-031--uo-import-history-shows-upload-startcomplete-time-file-name-counts-status-uploader) | UO import history shows upload start/complete time, file name, counts, status, uploader | Import history | P2 | Regression | Auto-UI+API | Active | 5 |
| [UOI-032](#uoi-032--download-previously-imported-csv-from-import-history) | Download previously imported CSV from import history | Import history | P2 | Regression | Auto-UI+API | Active |  |
| [UOI-033](#uoi-033--uo-import-within-time-limit-succeeds-with-response-message) | UO import within time limit succeeds with response message | Import timeout | P2 | Regression | Auto-UI+API | Review |  |
| [UOI-034](#uoi-034--uo-import-exceeding-time-limit-shows-timeout-message-history-shows-partial-counts) | UO import exceeding time limit shows timeout message; history shows partial counts | Import timeout | P2 | Regression | Manual | Review |  |
| [UOI-035](#uoi-035--admin-can-view-import-history-and-download-uploaded-csv) | Admin can view import history and download uploaded CSV | History permission | P2 | Regression | Auto-UI | Active |  |
| [UOI-036](#uoi-036--user-with-only-uo-create-permission-gets-permission-denied-on-import-history) | User with only UO create permission gets Permission Denied on import history | History permission | P2 | Regression | Auto-UI | Review |  |
| [UOI-037](#-uoi-037--approving-current-month-invdn-during-uo-import-keeps-invoiceco-ref-numbering-in-order) | ★ Approving current-month Inv/DN during UO import keeps invoice/co-ref numbering in order | Approval during import | P1 | E2E · Regression | Auto-API | Active |  |
| [UOI-038](#-uoi-038--approving-previous-month-invdn-during-uo-import-keeps-numbering-consistent) | ★ Approving previous-month Inv/DN during UO import keeps numbering consistent | Approval during import | P1 | E2E · Regression | Auto-API | Active |  |
<!-- /generated:summary -->

## Test cases

### Single-record import rules

#### ★ UOI-001 · UO import succeeds in month after last reading - by previous reading source

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | Uo import r3 |

**Scenario group:** Single import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-101  
Reading Date- 05/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The above data are added manually by filling the New UO Draft Form)  

**Import data:**

Reading date - 20/02/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

import successfully  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) New UO Reading Date must be greater than the previous Reading Date if the most recent Previous Reading is made Manually. | Uo import r3 | |
| 2 | Previous=Meter reset | Uo import r5 | Review; Onenex v4: unit calculation incorrect |
| 3 | Previous=Bulk upload | Uo import r7 |  |

---

#### ★ UOI-002 · UO import later in same month as last manual/meter-reset reading succeeds

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Review — Onenex: not in v4 scope; import fails in v4 - needs business decision | Uo import r4 |

**Pre-existing system data:**

Apartment - A1-106  
Reading Date- 05/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The above data are added manually by filling the New UO Draft Form)  

**Import data:**

Reading date - 20/01/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

import successfully  

> **Source comments:** This TC is not included in this statistics v4 release. User can't import the file in v4.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) New UO Reading Date is greater than the previous Reading Date but same month when the most recent Previous Reading is made Manually. | Uo import r4 | |
| 2 | Previous=Meter reset | Uo import r6 | Review; Onenex v4: unit calculation incorrect |

---

#### UOI-003 · UO import in same month as last bulk upload is rejected

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r8 |

**Pre-existing system data:**

Apartment - A6-206  
Reading Date- 05/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  

**Import data:**

Reading date - 20/01/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

import failed  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) New UO Reading Date is greater than the previous Reading Date but same month when the most recent Previous Reading is made Bulk Upload. | Uo import r8 | |
| 2 | Apartment=CL1-101; Prev 01/01, Import 20/01 | Uo import r12 |  |

---

#### ★ UOI-004 · UO import accepts units equal to or greater than last units

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-UI+API | Active | Uo import r9 |

**Pre-existing system data:**

Apartment - CL1-101  
Last reading date - 01/01/2025  
Uploaded date- 27/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 10  
GEN - 10  
T Water - 15  
R Water - 15  

**Expected result:**

import successfully  

---

#### ★ UOI-005 · UO import with zero consumption creates 0.00 invoice marked Paid

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Uo import r10 |

**Pre-existing system data:**

Apartment - CL1-101  
Last reading date - 01/01/2025  
Uploaded date- 27/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  

**Expected result:**

import successfully  
(Since all consumed units are 0, the balance due will also be 0.00ks. The system will set the status of that invoice to paid.)  

---

#### UOI-006 · UO import rejects record with blank units

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r11 |

**Pre-existing system data:**

Apartment - CL1-101  
Last reading date - 01/01/2025  
Uploaded date- 27/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 15  
GEN - 15  
T Water -  
R Water -  

**Expected result:**

import failed  

---

#### UOI-007 · UO import rejects reading date earlier than last reading date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r13 |

**Pre-existing system data:**

Apartment - CL1-101  
Last reading date - 01/01/2025  
Uploaded date- 27/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/12/2024 <-  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

import failed  

---

#### UOI-008 · UO import rejects future reading date

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r14 |

**Pre-existing system data:**

Apartment - CL1-101  
Last reading date - 01/01/2025  
Uploaded date- 27/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/12/2029 <-  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

import failed  

---

#### UOI-009 · UO import rejects units lower than last reading

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r15 |

**Pre-existing system data:**

Apartment - CL1-101  
Last reading date - 01/01/2025  
Uploaded date- 27/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 5  
GEN - 9  
T Water - 10  
R Water - 15  

**Expected result:**

import failed  

---

### File format validation

#### UOI-010 · UO import rejects invalid CSV structure (history counts 0) - extra column / missing header

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r16 |

**Pre-existing system data:**

Apartment - CL1-101  
Last reading date - 01/01/2025  
Uploaded date- 27/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  
Extra fees - !@#wer123  

**Expected result:**

import failed  
(It is an invalid csv file.  
In UO import history, success, fail, total count will all be shown as 0)  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Can't import with extra column | Uo import r16 | |
| 2 | Invalid=Missing header name | Uo import r17 |  |

---

#### UOI-011 · UO import of header-only CSV completes with 0 counts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI+API | Active | Uo import r18 |

**Pre-existing system data:**

Apartment - CL1-101  
Last reading date - 01/01/2025  
Uploaded date- 27/01/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date -  
YESC -  
GEN -  
T Water -  
R Water -  

**Expected result:**

import successfully  
(The system does not show any response msg because there is no success record.  
In UO import history, success, fail, total count will all be shown as 0)  

---

### Multi-record import rules

#### ★ UOI-012 · Multi-record import - 2 valid records for one apartment both succeed

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active — Source shows only one data row for 2-record case | Uo import r19 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

Both import successfully  

---

#### UOI-013 · Multi-record import - second record in same month/date rejected (first saved)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r20 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

1st records successful  
2nd records failed

**Data variants (4 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Can't import with Duplicate Data (Same date & Same Unit) | Uo import r20 | |
| 2 | Same reading date, different data | Uo import r22 |  |
| 3 | Same month, different dates | Uo import r32 |  |
| 4 | Same month 25/02, different units | Uo import r33 |  |

---

#### ★ UOI-014 · Multi-record import - zero-consumption records succeed with 0.00 Paid invoice

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-UI+API | Active | Uo import r21 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  

**Expected result:**

Both import successfully  
For Both record - (Since all consumed units are 0, the balance due will also be 0 0ks. The system will set the status of that invoice to paid.)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Both have Same Unit with system last reading unit | Uo import r21 | |
| 2 | Zero consumption=1st record | Uo import r23 |  |
| 3 | Zero consumption=2nd record (vs previous successful) | Uo import r25 |  |

---

#### UOI-015 · Multi-record import - 2nd record units lower than 1st (previous successful) rejected

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active — Title says "same unit as system last" but expected is less than previous successful unit | Uo import r24 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

1st records successful  
2nd records failed
(2nd record has Less Unit than previous successful unit)

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) 2nd month has Same Unit with system last reading unit | Uo import r24 | |
| 2 | Units 15 then lower | Uo import r46 |  |

---

#### UOI-016 · Multi-record import - both records with blank units fail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r26 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC -  
GEN - 15  
T Water - 15  
R Water -  

**Expected result:**

Both Record Failed  

---

#### UOI-017 · Multi-record import - record with blank units fails, other succeeds

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r27 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

1st records successful  
2nd records failed

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) can't import bulk data with blank (2nd month records have blank unit) | Uo import r27 | |
| 2 | Blank=1st record | Uo import r28 |  |

---

#### UOI-018 · Multi-record import - both records in last reading month fail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r29 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 15/01/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

Both Record Failed  

---

#### UOI-019 · Multi-record import - record in last reading month fails, other succeeds

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r30 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 25/01/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

1st records failed  
2nd records successful

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) New Reading month should greater than Previous (1st date are same with system reading month) | Uo import r30 | |
| 2 | Same month=2nd record | Uo import r31 |  |

---

#### UOI-020 · Multi-record import - 2nd record dated before 1st record fails

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r34 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/04/2025  
YESC - 18  
GEN - 18  
T Water - 18  
R Water - 18  

**Expected result:**

1st records successful  
2nd records failed
(The system saves the first record found.)

---

#### UOI-021 · Multi-record import - both records dated before last reading fail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r35 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/09/2024 <-  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

Both records failed  

---

#### UOI-022 · Multi-record import - record dated before last reading fails, other succeeds

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r36 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/09/2024  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

1st records failed  
2nd records successful

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Can't upload with a previous date than the last (1st record date is less than system reading date) | Uo import r36 | |
| 2 | Earlier date=2nd record | Uo import r37 |  |

---

#### UOI-023 · Multi-record import - both records future-dated fail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r38 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/11/2028  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

Both records failed  

---

#### UOI-024 · Multi-record import - future-dated record fails, other succeeds

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r39 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

1st records successful  
2nd records failed

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) can't import with future date (2nd record date is future) | Uo import r39 | |
| 2 | Future=1st record | Uo import r40 | Data label says "Last reading date" for reading date |

---

#### UOI-025 · Multi-record import - one earlier-than-last and one future record both fail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r41 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/09/2024  
YESC - 15  
GEN - 15  
T Water - 15  
R Water - 15  

**Expected result:**

Both Record Failed  

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) Can't upload with a previous date than the last and future (1st record date is earlier than system date 2nd record date is future ) | Uo import r41 | |
| 2 | Order=future then earlier | Uo import r42 |  |

---

#### UOI-026 · Multi-record import - both records with units below last reading fail

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active — Title typo "older than" means greater than | Uo import r43 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 8  
GEN - 9  
T Water - 15  
R Water - 15  

**Expected result:**

Both Record Failed  

---

#### UOI-027 · Multi-record import - record with units below last reading fails, other succeeds

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r44 |

**Scenario group:** Multiple import data for 1 apartment

**Pre-existing system data:**

Apartment - A1-138  
Last reading date - 01/01/2025  
Uploaded date- 27/05/2025  
YESC - 10  
GEN - 10  
T Water - 10  
R Water - 10  
(The apartment should already have an old UO record.)  

**Import data:**

Reading date - 01/02/2025  
YESC - 8  
GEN - 9  
T Water - 15  
R Water - 15  

**Expected result:**

1st records failed  
2nd records successful

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) 1. New UO units are accepted only if they are older than the last unit. 2. Can't import with less unit (1st record has Less Unit than system last reading unit) | Uo import r44 | |
| 2 | Lower units=2nd record | Uo import r45 |  |

---

### Concurrent upload

#### ★ UOI-028 · Concurrent upload - 2nd upload blocked while user's 1st upload in progress

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active | Uo import r49 |

**Scenario group:** Same Person

**Pre-existing system data:**

1st upload file is in progress  

**Import data:**

The file will continue to upload even after closing browser, tab, and computer.  

**Expected result:**

2nd file upload is Fail  
(Second File is blocked until First file upload finishes)

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) try to upload the same file | Uo import r49 | |
| 2 | Same user; different file | Uo import r51 |  |

---

#### ★ UOI-029 · Duplicate upload - re-uploading the same file is rejected

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active | Uo import r50 |

**Scenario group:** Same Person

**Pre-existing system data:**

1st upload file is Successful  

**Expected result:**

Fail  
(Second upload is restricted because user tries to upload the same file.)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) try to upload the same file | Uo import r50 | |
| 2 | Different user; 1st in progress | Uo import r53 |  |
| 3 | Different user; 1st completed | Uo import r54 |  |

---

#### ★ UOI-030 · Upload of a different file after previous upload succeeds

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active | Uo import r52 |

**Scenario group:** Same Person

**Pre-existing system data:**

1st upload file is Successful  

**Expected result:**

Success  
(Both uploads succeed independently)  

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) try to upload the Different file | Uo import r52 | |
| 2 | Different user; 1st in progress | Uo import r55 |  |
| 3 | Different user; 1st completed | Uo import r56 |  |

---

### Import history

#### UOI-031 · UO import history shows upload start/complete time, file name, counts, status, uploader

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r58 |

**Scenario group:** UO import history

**Pre-existing system data:**

1. Click "UO" from left menu.
2. Click "Import" button.
3. Click "History" button.

**Import data:**

1. Upload Start Time
2. Complete Upload Time

**Expected result:**

The date and time the CSV file was uploaded is shown in Upload Start Time.  
The time when upload complementation time is shown in Complete Upload Time.  

**Data variants (5 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) View import history | Uo import r58 | |
| 2 | Column=File name | Uo import r59 |  |
| 3 | Column=Success/Fail/Total count | Uo import r60 |  |
| 4 | Column=Status (Complete/Processing) | Uo import r61 |  |
| 5 | Column=Uploader name | Uo import r62 |  |

---

#### UOI-032 · Download previously imported CSV from import history

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Active | Uo import r63 |

**Scenario group:** UO import history

**Pre-existing system data:**

1. Click "UO" from left menu.
2. Click "Import" button.
3. Click "History" button.
4. Download the file you want to view.

**Import data:**

9. Action " Download "

**Expected result:**

You can download and view the imported CSV file again.  
The date & time of upload are displayed next to the file name.  

---

### Import timeout

#### UOI-033 · UO import within time limit succeeds with response message

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI+API | Review — No title/steps/data; time limit not specified | Uo import r65 |

**Scenario group:** Upload time is within the limit

**Expected result:**

1. The file upload will be successful.
2. Show response msg for import apartment data.

---

#### UOI-034 · UO import exceeding time limit shows timeout message; history shows partial counts

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Manual — Needs server-side timeout to be triggered; limit not specified | Review — No title/steps/data; time limit not specified | Uo import r66 |

**Scenario group:** Upload time exceeded the limit

**Expected result:**

1. The system will display a Timeout msg "The import process is not successfully finished. Please contact EMS Support Team for next upload."
2. User need to contact EMS Support Team for next upload.
3. You can see how many lines were successful and how many failed in the Import History.

---

### History permission

#### UOI-035 · Admin can view import history and download uploaded CSV

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Uo import r68 |

**Scenario group:** UO import history Permission

**Pre-existing system data:**

1. Click "UO" from left menu.
2. Click "Import" button.
3. Click "History" button

**Expected result:**

Admin can view the UO Import History list  
and can also download and view the uploaded csv file.  

---

#### UOI-036 · User with only UO create permission gets Permission Denied on import history

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — GT Aug-2025 remarks list "Users with UO create permission" under history permission - conflicting expectation | Uo import r69 |

**Scenario group:** UO import history Permission

**Pre-existing system data:**

1. Click "UO" from left menu.
2. Click "Import" button.
   (Import button can only see UO create permission user)
3. Click "History" button

**Expected result:**

Can't see UO Import History  
System will show "Permission Denied" error msg  

---

### Approval during import

#### ★ UOI-037 · Approving current-month Inv/DN during UO import keeps invoice/co-ref numbering in order

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | Uo import r71 |

**Scenario group:** Invoice is approved during import.

**Pre-existing system data:**

1. User 1 uploads the import file.
2. User 2 approves the current month Inv/DN

**Expected result:**

1. The approved process will be successful.
2. The invoice number from approved will be in the order between the invoice number and coref number from the import file.

---

#### ★ UOI-038 · Approving previous-month Inv/DN during UO import keeps numbering consistent

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | Uo import r72 |

**Scenario group:** Invoice is approved during import.

**Pre-existing system data:**

1. User 1 uploads the import file
2. User 2 approves previous month Inv/DN

**Expected result:**

1. The approved process will be successful
2. The invoice number obtained from approved will be the last number of the previous month
3. The Coref number obtained from approved will be consecutive between the coref numbers obtained from the UO import file

---
