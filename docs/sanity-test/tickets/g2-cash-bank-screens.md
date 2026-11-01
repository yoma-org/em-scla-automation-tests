# G2 · Cash & Bank Account screens

[← Ticket index](README.md) · [Sanity index](../README.md)

**Tickets:** 3 · **Open:** 1 · **Partly open:** 2

## Summary

| Ticket | Title | Jira priority | Status (build -37) | Result | Case |
|---|---|---|---|---|---|
| [EM-94](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-94) | [Cash & Bank Account > Edit Initial Balance] Update fails with 'Could not update initial balance' | Medium | Open | Update Initial Balance fails with ERR_UNKNOWN; `PUT .../migrated-balance` returns 405. | [SAN-EM94-001](#san-em94-001--edit-initial-balance-saves-the-value-and-updates-closing-balance) |
| [EM-72](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-72) | [Cash & Bank Account > Edit > Edit Cash Account] Edit UI does not match current EM UAT | Highest | Partly open | Edit Cash fields match; Payment Method is a checkbox list instead of Old EM's multiselect. | [SAN-EM72-001](#san-em72-001--edit-cash-account-matches-old-em-fields-and-payment-method-control) |
| [EM-73](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-73) | [Cash & Bank Account > Edit > Edit Bank Account] Edit UI does not match current EM UAT | Highest | Partly open | Edit Bank fields match; Payment Method is a checkbox list and still shows a discontinued method. | [SAN-EM73-001](#san-em73-001--edit-bank-account-matches-old-em-fields-and-payment-method-control) |

## Tickets

### EM-94 · [Cash & Bank Account > Edit Initial Balance] Update fails with 'Could not update initial balance'

[EM-94](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-94) · Jira priority Medium · Status **Open**

**Reported:** Editing the Initial Balance of a cash or bank account always fails with 'Could not update initial balance'; the balance stays unchanged and the API returns 405 Method Not Allowed.

#### SAN-EM94-001 · Edit Initial Balance saves the value and updates Closing Balance

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Sanity · Regression | Auto-UI+API | Active | EM-94 repro (TC-EM-94-01), 2026-11-01 |

**Preconditions:**

1. Logged in as an Admin user.
2. CASH account `QA-REPRO-EM-94 Cash` exists on both sides: MMK, Initial Balance 10,000, Payment Method Cash.

**Test data:**

1. New Initial Balance 15,000.

**Steps:**

1. In the list, click [Edit Initial Balance] on the test account (New `/settings/accounts`, Old `/initial-balance/148/edit`).
2. Change 10,000 to 15,000 and click [Update].
3. Read the account row again.
4. On New EM, read the request in the browser Network tab.

**Expected result:**

1. The Edit Initial Balance page opens.
2. "Account has been successfully updated."
3. Initial 15,000.00 / Closing 15,000.00.

**Result (build -37, 2026-11-01):**

| # | Old EM | New EM | |
|---|---|---|---|
| 1 | Edit Initial Balance page | **Dialog** (with an extra "As of date" field) | ❌ Differs |
| 2 | "Account has been successfully updated." | **"Could not update initial balance … (ERR_UNKNOWN)"** | ❌ Differs |
| 3 | Initial 15,000.00 / Closing 15,000.00 | Initial **10,000.00** / Closing 10,000.00 | ❌ Differs |
| 4 | Not run | `PUT /api/gw/accounts/65/migrated-balance` → **405 Method Not Allowed** | ⛔ Not run |

**Conclusion:** Open. The opening balance, used for data migration, cannot be corrected, so the account balance stays wrong.

**Test data created:** New EM account `QA-REPRO-EM-94 Cash` (id 65, 10,000); Old EM account `QA-REPRO-EM-94 Cash` (initial-balance id 148, now 15,000).

**Evidence:**

- ![EM-94 new](img/EM-94/01_NEW-uat_edit-initial-balance-405.png) — STILL BUG: Update fails (ERR_UNKNOWN)
- ![EM-94 old](img/EM-94/02_OLD-uat_edit-initial-balance-ok.png) — Old EM: saved, toast "Account has been successfully updated."
---

### EM-72 · [Cash & Bank Account > Edit > Edit Cash Account] Edit UI does not match current EM UAT

[EM-72](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-72) · Jira priority Highest · Status **Partly open**

**Reported:** The Cash Account edit UI differed from the current EM UAT.

#### SAN-EM72-001 · Edit cash account matches Old EM fields and Payment Method control

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Sanity · Regression | Auto-UI | Active | EM-72 repro (TC-EM-72-01), 2026-11-01 |

**Preconditions:**

1. Logged in as an Admin user.
2. A cash account exists (New: PARITY Cash, id 54; Old: 2C2P Account detail, id 100).

**Steps:**

1. From the list, click the pencil on a cash account (New `/settings/accounts/<id>/edit`, Old `/cash-and-bank-accounts/<id>/edit`).
2. Compare the fields.
3. Read the Payment Method control. Do not change anything and do not click [Update].

**Expected result:**

1. The page Edit Cash And Bank Account opens.
2. Name*, Currency (locked), Payment Method, Type (locked), Description.
3. Payment Method is a multiselect dropdown showing the names of the selected payment methods.

**Result (build -37, 2026-11-01):**

| # | Old EM | New EM | |
|---|---|---|---|
| 1 | Edit Cash And Bank Account page | Edit Cash And Bank Account page | ✅ Same |
| 2 | Name*, Currency (locked), Payment Method, Type (locked), Description | Name*, Currency (locked), Payment Method, Type (locked), Description | ✅ Same |
| 3 | Multiselect dropdown showing the selected names | **Checkbox list** | ❌ Differs |

**Conclusion:** Partly open. The ticket asks for the same Edit UI as Old EM; the field set matches, but Payment Method is still a different control.

**Evidence:**

- ![EM-72 new](img/EM-72/01_NEW-uat_edit-cash-account.png) — STILL DIFFERS: Payment Method is a checkbox list; old EM uses a multiselect dropdown
- ![EM-72 old](img/EM-72/02_OLD-uat_edit-cash-account.png) — Old EM: Name*, Currency (locked), Payment Method (multiselect), Type (locked), Description
---

### EM-73 · [Cash & Bank Account > Edit > Edit Bank Account] Edit UI does not match current EM UAT

[EM-73](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-73) · Jira priority Highest · Status **Partly open**

**Reported:** The Bank Account edit UI differed from the current EM UAT.

#### SAN-EM73-001 · Edit bank account matches Old EM fields and Payment Method control

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Sanity · Regression | Auto-UI | Active | EM-73 repro (TC-EM-73-01), 2026-11-01 |

**Preconditions:**

1. Logged in as an Admin user.
2. A bank account exists (New: 006, id 41; Old: Bank 13Nov, id 70).

**Steps:**

1. From the list, click the pencil on a bank account (New `/settings/accounts/<id>/edit`, Old `/cash-and-bank-accounts/<id>/edit`).
2. Compare the fields.
3. Read the Payment Method control. Do not change anything and do not click [Update].

**Expected result:**

1. The page Edit Cash And Bank Account opens.
2. Name*, Currency (locked), Payment Method, Type (locked), Select Bank Name*, Account Number*, Enable Overdraft, Description.
3. Payment Method is a multiselect dropdown showing the names of the selected payment methods.

**Result (build -37, 2026-11-01):**

| # | Old EM | New EM | |
|---|---|---|---|
| 1 | Edit Cash And Bank Account page | Edit Cash And Bank Account page | ✅ Same |
| 2 | Name*, Currency (locked), Payment Method, Type (locked), Select Bank Name*, Account Number*, Enable Overdraft, Description | Name*, Currency (locked), Payment Method, Type (locked), Select Bank Name*, Account Number*, Enable Overdraft, Description | ✅ Same |
| 3 | Multiselect dropdown showing the selected names | **Checkbox list**; the discontinued "Mobile Wallet (no longer offered)" is still shown, ticked | ❌ Differs |

**Conclusion:** Partly open. The ticket asks for the same Edit UI as Old EM; the field set matches, but Payment Method is still a different control.

**Evidence:**

- ![EM-73 new](img/EM-73/01_NEW-uat_edit-bank-account.png) — STILL DIFFERS: checkbox list instead of multiselect; disabled payment methods still shown
- ![EM-73 old](img/EM-73/02_OLD-uat_edit-bank-account.png) — Old EM: Name*, Currency, Payment Method (multiselect), Type, Bank Name*, Account Number*, Enable Overdraft, Description
---
