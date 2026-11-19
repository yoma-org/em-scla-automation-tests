# Invoice & Debit Note · Round 1: results by source test case

- **Xray Test Execution:** EM-154 "Invoice & Debit Note · Round 1" (Test Plan EM-143)
- **Build:** New EM `v0.4.1-148-g1a6a8d7b`, test env (`.env.test`)
- **Dates:** 2026-11-18 → 2026-11-19
- **How the runs were made:** automated (Playwright `projects/em/tests/invoice/invoice-debit-note.spec.ts`), and every result was confirmed by the tester.
- **Pass/fail rule:** the expected result in the case doc, with messages compared word for word.

| Source TC ID | Excel row | Repo case (variant) | Xray Test | Result | Failed step | Bug |
|---|---|---|---|---|---|---|
| TC_Inv_001 | Invoice-Debit Note r5 | INV-001 | EM-139 | ❌ FAILED | 6. Create → Expected 1: no "Invoice has been successfully created" message (both runs: dated today and dated last month) | EM-153 |
| TC_Inv_002 | Invoice-Debit Note r6 | INV-002 | EM-144 | ✅ PASSED | — | — |
| TC_Inv_003 | Invoice-Debit Note r7 | INV-003 | EM-145 | ✅ PASSED | — (dated 01/10/2026 instead of 1.6.2025, which is outside the allowed date range) | — |
| TC_Inv_004 | Invoice-Debit Note r8 | INV-004 | EM-146 | ✅ PASSED | — | — |
| TC_Inv_005 | Invoice-Debit Note r9 | INV-005 | EM-147 | ✅ PASSED | — | — |
| TC_Inv_006 | Invoice-Debit Note r10 | INV-006 | EM-148 | ✅ PASSED | — | — |
| TC_Inv_007 | Invoice-Debit Note r11 | INV-007 | EM-149 | ✅ PASSED | — | — |
| TC_Inv_008 | Invoice-Debit Note r12 | INV-008 | EM-150 | ❌ FAILED | 8. Create → Expected 1: no "Invoice has been successfully created" message | EM-153 |
| TC_Inv_009 | Invoice-Debit Note r13 | INV-009 [base] missing Apartment | EM-140 (step 6) | ❌ FAILED | 6. "Select 'Apartment'" shown instead of "Apartment is required" | EM-155 |
| TC_Inv_010 | Invoice-Debit Note r14 | INV-009 [Missing field=Item description] | EM-140 (step 7) | ❌ FAILED | 7. "Enter 'Item Description'" shown instead of "Item description is required" | EM-155 |
| TC_Inv_011 | Invoice-Debit Note r15 | INV-009 [Missing field=Income category] | EM-140 (step 8) | ✅ PASSED | — | — |
| TC_Inv_012 | Invoice-Debit Note r16 | INV-010 [base] Unit 0 | EM-151 (step 6) | ✅ PASSED | — | — |
| TC_Inv_014 | Invoice-Debit Note r18 | INV-010 [Field=Gross price (0)] | EM-151 (step 7) | ✅ PASSED | — | — |

## Summary

- **Source test cases run:** 13
  - ✅ PASSED: 9
  - ❌ FAILED: 4 (TC_Inv_001, TC_Inv_008, TC_Inv_009, TC_Inv_010)
- **Counted by Xray Test (repo case):** 10 Tests, 7 PASSED and 3 FAILED (EM-139, EM-150, EM-140).
- **Not in this round:**
  - TC_Inv_013 (r17) belongs to INV-011 and has not been run yet.
  - The remaining cases of the module (INV-011 to INV-037) have not been run yet.

## Bugs

| Bug | Title | Status | Source TC IDs failing on it |
|---|---|---|---|
| [EM-153](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-153) | Invoice/ Debit note create: no success message after clicking Create (draft is saved silently) | In Progress | TC_Inv_001, TC_Inv_008 |
| [EM-155](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-155) | [Invoices / Debit Note > Create] Required-field validation messages are wrong and do not clear after the field is fixed | In Progress | TC_Inv_009, TC_Inv_010 |

## Noted, not counted as failures

These points are outside the case's expected results. They are open questions for the tester.

| Source TC ID | What was noted |
|---|---|
| TC_Inv_014 | With Gross price 0, New EM keeps the Discount (10 Ks) and adds "Discount must be less than Gross Price.". Old EM clears the Discount. |
| TC_Inv_012 | With Unit 0, New EM shows "Not calculated yet". Old EM shows Total 0.000. |
| TC_Inv_010 (Old EM) | After Create with Item Description missing, Old EM sets all figures to 0.00. Its message has a spelling mistake ("requried"). |

## Related ticket retest

- **EM-112** (100 % discount gave "ERR_UNKNOWN") **passed**:
  - New EM UAT build -117 (Jira comment `VERIFIED_PASSED_v0.4.1-117`)
  - test env build -148
- Same behaviour as TC_Inv_004.
