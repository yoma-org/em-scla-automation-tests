# 25 · Global Search

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 1 (+8 data-variant rows)  
**Priority:** P1 0 · P2 1 · P3 0 · **★ Critical:** 0 · **Smoke:** 0 · **E2E:** 0 · **Auto:** 1 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [SRCH-001](#srch-001--global-search-returns-matching-records-or-empty-view--by-entity) | Global search returns matching records or empty view — by entity | Global search | P2 | Regression | Auto-UI | Active | 9 |
<!-- /generated:summary -->

## Test cases

### Global search

#### SRCH-001 · Global search returns matching records or empty view — by entity

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Global Search r5 (TC-GS-001) |

**Preconditions:**

1. User need to login the System first.
2. The user must have Apartment "View" permission.

**Steps:**

1. Click "Search" button from the top of screen
2. Type the keyword with letters or digits that admin wants to search for.

**Expected result:**

1. The searched result regarding to
   the search keyword regarding to apartment can be seen as a list.
2. If there is no result for related keyword, show the empty view.

**Data variants (9 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can search the Apartment from search box. | Global Search r5 (TC-GS-001) | |
| 2 | Entity=Contact; needs its View permission | Global Search r6 (TC-GS-002) |  |
| 3 | Entity=Invoice (number or Co.ref); needs its View permission | Global Search r7 (TC-GS-003) |  |
| 4 | Entity=Debit Note; needs its View permission | Global Search r8 (TC-GS-004) |  |
| 5 | Entity=Receipt Voucher; needs its View permission | Global Search r9 (TC-GS-005) |  |
| 6 | Entity=Payment Voucher; needs its View permission | Global Search r10 (TC-GS-006) |  |
| 7 | Entity=Journal Voucher; needs its View permission | Global Search r11 (TC-GS-007) |  |
| 8 | Entity=Credit Note; needs its View permission | Global Search r12 (TC-GS-008) |  |
| 9 | Entity=Wallet Payment; needs its View permission | Global Search r13 (TC-GS-009) |  |

---
