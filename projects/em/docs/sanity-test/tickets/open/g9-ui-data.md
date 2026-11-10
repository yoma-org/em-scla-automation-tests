# G9 · UI and stray data

[← Ticket index](../README.md) · [Sanity index](../../README.md)

**Tickets:** 1 · **Partly open:** 1

## Summary

| Ticket | Title | Jira priority | Status (build -37) | Result | Case |
|---|---|---|---|---|---|
| [EM-85](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-85) | [Cash Received > Unknown Receipt Allocation] Assign popup has overlapping fields and misalignment | Medium | Partly open | Overlap is gone; Apartment dropdown overflows the screen and cannot be scrolled | [SAN-EM85-001](#san-em85-001--assign-unknown-receipt-popup-has-no-overlap-and-the-apartment-list-scrolls) |

## Tickets

### EM-85 · [Cash Received > Unknown Receipt Allocation] Assign popup has overlapping fields and misalignment

[EM-85](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-85) · Jira priority Medium · Status **Partly open**

**Reported:** The Assign Unknown Receipt popup has layout issues: input fields and text overlap and the content is misaligned.

#### SAN-EM85-001 · Assign Unknown Receipt popup has no overlap and the Apartment list scrolls

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Sanity · Regression | Auto-UI | Active | EM-85 repro (TC-EM-85-01), 2026-11-01 |

**Preconditions:**

1. Logged in as Admin.
2. Unknown Received RV-00076 (#77, 1,000 Ks) exists and is not assigned; window 1440×900 (first run: RV-00073, screen 1568×776).
3. Page: New EM `/accounts/unknown-receive?tab=allocation`.

**Steps:**

1. Click + on RV-00076 › Assign.
2. Open the Apartment list.
3. Select an apartment and read the "Settle against open invoices" section.

**Expected result:**

1. The popup is tidy.
2. The list scrolls and does not overflow.
3. Fields and labels do not overlap.

**Result (build -37, 2026-11-01):**

| # | Old EM | New EM | |
|---|---|---|---|
| 1 | Assign is a full page with aligned fields | Tidy popup: Receipt amount, Payer, Apartment, Category*, Remark, Cancel/Confirm | ✅ Same |
| 2 | Assign is a full page; Apartment list overflow not checked | **Overflows the screen**: 24 rows, bottom edge at 1238px on a 900px window (first run: 1422px > window 1267px, `max-height: none`); the last items (including the QA apartment) **cannot be reached with the mouse** | ❌ Differs |
| 3 | A1-QEPAIR01 selected, 80.01 allocated, not confirmed; invoice numbers not cut | No overlap, but the apartment had to be selected by script; invoice number cut "INV-202611-000…", amount shown with 4 decimals "1000.0000 MMK" | ❌ Differs |

**Conclusion:** Partly open. The overlap is gone, but the Apartment dropdown in the popup overflows the screen and cannot be scrolled.

**Evidence:**

- ![EM-85 new](../img/EM-85/01_NEW-uat_assign-popup-apartment-list-overflow.png) — STILL BUG: list overflows the screen (24 rows, bottom edge at 1238 px on a 900 px window)
- ![EM-85 new](../img/EM-85/02_NEW-uat_assign-popup-after-apartment.png) — No overlapping fields or labels; clean vertical layout
- ![EM-85 old](../img/EM-85/03_OLD-uat_unknown-assign-remainder-919.99.png) — 80.01 allocated; invoice numbers are shown in full
---
