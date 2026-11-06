# G3 · Invoice line amounts and precision

[← Ticket index](../README.md) · [Sanity index](../../README.md)

**Tickets:** 3 · **Open:** 3

EM-92 and EM-75 passed on build -74 (2026-11-06) and moved to [fixed-invoices](../fixed/fixed-invoices.md). EM-76 (same cause, from an apartment) followed on build -74. EM-93 and EM-112 are both about money rounding.

## Summary

| Ticket | Title | Jira priority | Status (build -37) | Result | Case |
|---|---|---|---|---|---|
| [EM-112](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-112) | [Invoices / Debit Note > Add Invoice] 100% discount shows generic 'ERR_UNKNOWN' instead of the real reason | Medium | Open | Discount 100% still gives 'Could not calculate the total / ERR_UNKNOWN'; Old EM clears the field | [SAN-EM112-001](#san-em112-001--discount-100-does-not-give-the-generic-err_unknown-error) |
| [EM-93](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-93) | [Invoices / Debit Note > Add Invoice] Invoice stays Partially Paid after paying the full displayed amount (3-decimal unit price) | Medium | Open | INV-202610-00047 stays PARTIALLY_PAID with due 0.0042 (screen shows 0.00) | [SAN-EM93-001](#san-em93-001--paying-exactly-the-displayed-balance-due-makes-the-invoice-paid) |
| [EM-113](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-113) | [Invoices / Debit Note > Approve] No message when approving an already approved invoice | Medium | Open | Second Approve from a stale tab shows no 'Invoice has been already approved.' | [SAN-EM113-001](#san-em113-001--approving-an-invoice-already-approved-in-another-tab-shows-invoice-has-been-already-approved) |

## Tickets

### EM-112 · [Invoices / Debit Note > Add Invoice] 100% discount shows generic 'ERR_UNKNOWN' instead of the real reason

[EM-112](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-112) · Jira priority Medium · Status **Open**

**Reported:** Both systems allow at most 99% discount. Current EM clears the field; New EM keeps 100 and shows 'Could not calculate the total / ERR_UNKNOWN'.

#### SAN-EM112-001 · Discount 100% does not give the generic ERR_UNKNOWN error

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Sanity · Regression | Auto-UI | Active | EM-112 repro (TC-EM-112-01), 2026-11-01 |

**Preconditions:**

1. Logged in as Admin.
2. Pages: New EM `/receivables/invoices/new`, Old EM `/invoices/add-invoice` (bundle `dd551ca9`).

**Test data:**

1. Line: Unit 1, Gross Price 1000, Tax 5%.

**Steps:**

1. Enter the line from the test data.
2. Set Discount (%) = 100 and click outside.
3. Set Discount (Ks) = 1,000 (equal to the price).

**Expected result:**

1. Disc. Price 1,000.000 · Total 1,000.000.
2. The Discount field is **cleared**, totals are calculated as with discount 0, and there is no error.

**Result (build -37, 2026-11-01):**

| # | Old EM | New EM | |
|---|---|---|---|
| 1 | Disc. Price 1,000.000 · Total 1,000.000 | See EM-92 | — |
| 2 | Field **cleared**, no error | Field keeps **100**; red box "Could not calculate the total · Something went wrong · Reference: **ERR_UNKNOWN**"; all totals "—" | ❌ Differs |
| 3 | Not run | Not run | ⛔ Not run |

**Conclusion:** Open. The user is not told what is wrong (the 99% limit), and the generic message suggests the system is broken.

**Evidence:**

- ![EM-112 new](../img/EM-112/01_NEW-uat_discount-100-err-unknown.png) — keeps 100
- ![EM-112 old](../img/EM-112/02_OLD-uat_discount-100-cleared.png) — Old EM: typing 100 → Discount box is cleared, no generic error
---

### EM-93 · [Invoices / Debit Note > Add Invoice] Invoice stays Partially Paid after paying the full displayed amount (3-decimal unit price)

[EM-93](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-93) · Jira priority Medium · Status **Open**

**Reported:** Amounts are stored with 4 decimals but shown with 2, so a customer who pays exactly the amount on screen still owes a few thousandths and the invoice never becomes PAID. The ticket's retest on build -37 reproduces it with a 2-decimal Gross Price of 1000.52.

#### SAN-EM93-001 · Paying exactly the displayed Balance Due makes the invoice PAID

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Sanity · Regression | Auto-UI+API | Active | EM-93 repro (TC-EM-93-01), 2026-11-01 |

**Preconditions:**

1. Invoice INV-202610-00047 (id 145), created by the tester on build -37 on 31/10: 3 × 1,000.52, Discount 10%, Tax 5%.
2. Paid 400 (RV-00071) and 2,436.47 (RV-00072).
3. Page: New EM `/receivables/invoices/145`, API `GET /api/gw/invoices/145`.

**Steps:**

1. Create the invoice as in the preconditions.
2. Pay 400, then pay exactly the displayed Balance Due (2,436.47).
3. Call `GET /api/gw/invoices/145`.

**Expected result:**

1. Amounts are rounded to 2 decimals.
2. The invoice is PAID, Due 0.00, and disappears from Make Payment.

**Result (build -37, 2026-11-01):**

| # | Old EM | New EM | |
|---|---|---|---|
| 1 | Not re-run. Ticket: rounds to 2 decimals, Grand Total **2,836.55** for its 1000.555 example | Stores **2836.4742**, shows 2,836.47 | ❌ Differs |
| 2 | Inv-202610-00036 (3 × 1,000.55, disc 10%, tax 5%): Paid after 2 payments, Amount Due 0.00 | Detail page: **Partially paid**, Total Paid 2,836.47, **Amount Due 0.00 Ks** | ❌ Differs |
| 3 | — | `status PARTIALLY_PAID`, `total 2836.4742`, `paid 2836.4700`, **`due 0.0042`** | ❌ Differs |

**Conclusion:** Open. Discount, tax and total are stored with 4 decimals but shown with 2, so paying the amount on screen leaves 0.0042 due and the invoice can never close. A 3-decimal Gross Price is now refused; rounding and the PAID threshold are not fixed.

**Test data created:** none. Uses the tester's existing invoices INV-202610-00046 / 00047, which the ticket asks to clean up.

**Evidence:**

- ![EM-93 new](../img/EM-93/01_NEW-uat_inv-202610-00047-partially-paid-0.0042.png) — STILL BUG: still Partially paid
- ![EM-93 old](../img/EM-93/02_OLD-uat_invoice-paid-2-decimals.png) — Old EM: Paid after 2 payments
---

### EM-113 · [Invoices / Debit Note > Approve] No message when approving an already approved invoice

[EM-113](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-113) · Jira priority Medium · Status **Open**

**Reported:** With the same draft open in 2 tabs, approving in tab 2 after tab 1 shows a message in current EM, but nothing in New EM.

#### SAN-EM113-001 · Approving an invoice already approved in another tab shows Invoice has been already approved

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Sanity · Regression | Auto-UI | Active | EM-113 repro (TC-EM-113-01), 2026-11-01 |

**Preconditions:**

1. Logged in as Admin.
2. A separate draft: apartment QA-REPRO-EM-56 Tower-R32-101, item "QA-REPRO-EM-113 approve twice", 1 × 1000, 5% Tax, Due On Receipt → draft **#146** (1,050.00 Ks, first run). Re-run: draft **#149** (1,050 Ks, same apartment).
   Old EM: draft **#136097** (A1-000, 1,050 Ks, item "QA-REPRO-EM-113 approve twice").
3. Page: New EM `/receivables/invoices/149` (first run `/receivables/invoices/146`).

**Steps:**

1. Open the draft in tab 1 and tab 2.
2. Tab 1: click Approve › Confirm approve.
3. Tab 2 (not reloaded): click Approve › Confirm approve.

**Expected result:**

1. Both tabs show Approve.
2. The invoice is approved and gets a number.
3. The message **"Invoice has been already approved."** is shown.

**Result (build -37, 2026-11-01):**

| # | Old EM | New EM | |
|---|---|---|---|
| 1 | Draft #136097 open in 2 tabs; the Approve button state is not recorded | Both show Approve | — |
| 2 | Draft #136097 approved; the invoice number is not recorded | Re-run: draft #149 approved → **INV-202611-00003**. First run: draft #146 → **INV-202611-00001**, Unpaid, JE #300 | ✅ Same |
| 3 | Approving draft #136097 again from tab 2 shows the toast **"Invoice has been already approved."** | The dialog closes and the page shows the approved invoice; **no message at all** (toast/alert watched for 3 s, both runs) | ❌ Differs |

**Conclusion:** Open. Both sides were re-run with the same outcome. The approver in tab 2 believes they just approved it, while Old EM states someone else already did. Also noted: the Payment Terms dropdown has 2 near-duplicate entries, "Due on receipt" and "Due On Receipt".

**Test data created:** invoices **INV-202611-00001** (id 146, 1,050.00 Ks, Unpaid) and **INV-202611-00003** (id 149, 1,050 Ks) for apartment QA-REPRO-EM-56 Tower-R32-101; Old EM invoice #136097 (A1-000, 1,050 Ks), approved.

**Evidence:**

- ![EM-113 new](../img/EM-113/01_NEW-uat_tab2-approve-no-message.png) — STILL BUG: no "Invoice has been already approved." message, it just shows the approved invoice (#INV-202611-00003)
- ![EM-113 old](../img/EM-113/02_OLD-uat_already-approved-message.png) — Old EM: stale tab shows "Invoice has been already approved."
---
