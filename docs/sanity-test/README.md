# EM Sanity Test — New EM vs Old EM (UAT)

QE record of the rebuilt **New EM** against the current **Old EM** on the UAT web, with Old EM as the baseline. It has two parts:

- **[Jira tickets](tickets/README.md):** the current status. All 90 bug tickets were reproduced on build -37 on 2026-11-01 and are grouped by what to fix together. **Start here.**
- **Parity pass:** 130 cases run with the same actions on the same data on both sites, on build -31 on 29–30 Oct 2026. The [case files](#by-module) keep those results, and [bugs.md](bugs.md) carries each bug's latest status.

| | |
|---|---|
| **Old EM (baseline)** | https://www.uat.ted.synergy.yomaland360.com/ |
| **New EM** | https://uat.newem.ted.synergy.yomaland360.com/ |
| **Latest status** | `v0.4.1-37-g3090ff81`, 1 Nov 2026 ([tickets](tickets/README.md)) |
| **Parity pass** | `v0.4.1-31-g1482a663`, 29–30 Oct 2026 |
| **Origin** | EM Parity v2 report (QE, round 2). Round-1 findings were folded in where still valid. |
| **Related** | [Test case catalog](../test-cases/README.md) · [EM Business Summary](../EM_Business_Summary.md) |

## Current status (2026-11-01, build -37)

| Status | Jira tickets |
|---|---|
| Open | 21 |
| Partly open | 13 |
| Fixed | 54 |
| Fixed (partly verified) | 1 |
| Blocked | 1 |
| **Total** | **90** |

**Fix first:** [EM-96](tickets/g1-api-validation.md), where the API accepts a Cash Transfer to the internal control account `INCOME-CTRL`, and [EM-98](tickets/g1-api-validation.md), where it creates a BANK account with no bank details.

| Group | Area | Tickets | Bugs in [bugs.md](bugs.md) |
|---|---|---|---|
| [G1](tickets/g1-api-validation.md) | API validation: Cash & Bank, Cash Transfer, Cash Outflow | EM-96, 98, 97 | BUG-04, 07, 05 |
| [G2](tickets/g2-cash-bank-screens.md) | Cash & Bank Account screens | EM-94, 72, 73 | BUG-02 |
| [G3](tickets/g3-invoice-amounts.md) | Invoice line amounts and precision | EM-92, 75, 76, 112, 93, 113 | BUG-01, 22, 23, 26 |
| [G4](tickets/g4-payment-allocation.md) | USD and Unknown payment allocation | EM-116, 117, 114, 115, 104 | BUG-37, 38, 31, 36, 19 |
| [G5](tickets/g5-receipt-display.md) | How receipts show in lists, reports and S.O.A | EM-102, 109, 101, 74 | BUG-13, 14, 12 |
| [G6](tickets/g6-reports-ar.md) | Reports and AR | EM-107, 108, 99, 95, 100 | BUG-33, 09, 08, 03, 10 |
| [G7](tickets/g7-deposit.md) | Deposit | EM-103, 105 | BUG-15, 30 |
| [G8](tickets/g8-uo-em-dates.md) | UO, EM and reading dates | EM-110, 111, 37, 55 | BUG-17, 21 |
| [G9](tickets/g9-ui-data.md) | UI and stray data | EM-85, 35 | BUG-20, 24 |
| [Blocked](tickets/blocked.md) | Needs a person to run it | EM-29 | — |

The 55 fixed tickets are in `tickets/fixed-*.md`, grouped by screen, and listed in the [ticket index](tickets/README.md#tickets-by-group).

## Parity pass result: 130 cases with a clear verdict

| Group | Cases | Meaning | Read |
|---|---|---|---|
| ✅ Match | 84 | New gives the same result as Old | case files |
| ⚠️ Differs | 13 | New differs (display, message, speed) but money and data are **not wrong** | [differences.md](differences.md) |
| ❌ Bug | 33 | New is **wrong**: wrong money or report, blocks what Old allows, or lets the user do wrong | [bugs.md](bugs.md) |
| **Total** | **130** | | |

The ❌ cases point to **32 bugs** (S1: 4, S2: 16, S3: 12). One bug can break several cases, so there are fewer bugs than ❌ cases. The pass also produced:

- 3 round-1 bugs that are gone: BUG-06, BUG-25 and BUG-27.
- 4 minor UI issues: UI-17 to UI-20.

**25 new Jira tickets** were filed (EM-93 … EM-117), and 65 existing ones were cross-checked: [jira.md](jira.md).

## Most severe bugs (S1), status on build -37

- [BUG-01](bugs.md#bug-01) · Invoice stays Partially Paid after paying the full displayed amount. New stores totals with 4 decimals but shows 2, so a small hidden amount stays due forever. **Open on build -37.**
- [BUG-02](bugs.md#bug-02) · Edit Initial Balance of a cash / bank account always fails with 'Could not update initial balance'. **Open.**
- [BUG-03](bugs.md#bug-03) · AR Snapshot USD total ($200) does not match actual AR ($550) for the same day. **Open.**
- [BUG-04](bugs.md#bug-04) · Through the API, a Cash Transfer can be created to the internal ledger account `INCOME-CTRL`. **Open, hard stop.**

## By module

Parity pass cases, results from build -31.

| # | Module | File | Cases | ✅ | ⚠️ | ❌ |
|---|---|---|---|---|---|---|
| 00 | General, Topbar, Search | [00-general](cases/00-general.md) | 11 | 7 | 3 | 1 |
| 01 | Dashboard | [01-dashboard](cases/01-dashboard.md) | 12 | 12 | 0 | 0 |
| 02 | AR, AR Snapshot, Bulk SOA | [02-ar](cases/02-ar.md) | 12 | 8 | 2 | 2 |
| 03 | Invoices / Debit Note | [03-invoices](cases/03-invoices.md) | 13 | 7 | 0 | 6 |
| 04 | Make Payment | [04-make-payment](cases/04-make-payment.md) | 12 | 3 | 2 | 7 |
| 05 | Apartment SOA | [05-soa](cases/05-soa.md) | 5 | 5 | 0 | 0 |
| 06 | Wallet, Deposit, Deposit Invoice | [06-wallet-deposit](cases/06-wallet-deposit.md) | 12 | 10 | 0 | 2 |
| 07 | Cash Received, Unknown, Funding | [07-cash-received](cases/07-cash-received.md) | 10 | 5 | 1 | 4 |
| 08 | Cash Outflow (PV), Cash Transfer (JV) | [08-outflow-transfer](cases/08-outflow-transfer.md) | 12 | 8 | 1 | 3 |
| 09 | Cash & Bank Account | [09-accounts](cases/09-accounts.md) | 5 | 3 | 0 | 2 |
| 10 | UO, Meter Reset | [10-uo-mr](cases/10-uo-mr.md) | 9 | 6 | 2 | 1 |
| 11 | Estate Management fee | [11-em](cases/11-em.md) | 5 | 4 | 0 | 1 |
| 12 | Reports | [12-reports](cases/12-reports.md) | 8 | 2 | 2 | 4 |
| 13 | Contacts | [13-contacts](cases/13-contacts.md) | 4 | 4 | 0 | 0 |
| | **Total** | | **130** | **84** | **13** | **33** |

Also: [new-only.md](new-only.md) lists 16 features only New has.

## Reading order

1. This file, for the overview.
2. [tickets/README.md](tickets/README.md): current status, fix groups and tracking table.
3. [bugs.md](bugs.md): each bug in plain words, why it matters, the steps that found it (Old vs New) and annotated evidence.
4. [differences.md](differences.md), then the case files when you need detail for one screen.

## How the cases are written

Cases follow the same template as [docs/test-cases](../test-cases/README.md#adding-or-changing-test-cases): a `#### ID · Title` heading, a metadata table, then Preconditions, Test data, Steps and Expected result. Each case adds a **Parity result** table (Old vs New) and **Evidence**.

| Field | Rule |
|---|---|
| ID | `TC-<MOD>-NN` from the parity report becomes `SAN-<MOD>-0NN`, keeping the number (TC-INV-13 → SAN-INV-013). The original ID is kept in the Source column. |
| Priority | Source P0 becomes P1. P1, P2 and P3 stay as they are. `★` marks P1 cases that touch money. |
| Suites | `Sanity · Regression` |
| Status | ✅ / ⚠️ / ❌ are `Active`. ❌ cases expect the **correct** behaviour, so an automated test stays red until the bug is fixed. |
| Automation | `Auto-UI`, `Auto-UI+API` (hidden decimals / numbers checked via API), `Auto-API` (API-only bugs), or `Manual — <reason>` |

These cases live outside `docs/test-cases/features/`, so `npm run cases:build` does not pick them up. Mapping them to catalog IDs (INV-017 …) and automating them is the next step.

## How to read the evidence

- Images are composites: **OLD EM** in a red frame and **NEW EM** in a green frame, the same action on the same data.
- Red labels (in English) mark the exact difference. Orange text at the top is a note.
- A **dark background** means the image shows New's API response. It is used when the screen hides information, for example hidden decimals.
- Every image comes with a "look at" sentence saying what it proves. GIFs replay the steps.

## Test data (self-created only)

| | Old EM | New EM |
|---|---|---|
| Apartments | `A1-QEPAIR01`, `A1-QEPAIR02` | `Building 1 -QEPAIR01` (id 30), `Building 1 -QEPAIR02` (id 31) |
| Accounts | `QE PAIR Cash`, `QE PAIR Bank`, `QE PAIR Acc2`; round 2 adds `QE PAIR USD Cash`, `QE PAIR USD Bank` | `QE PAIR Cash` (57), `QE PAIR Bank` (59), `QE PAIR Acc2` (63); plus `QE PAIR API Bank` (62, created via API for BUG-07); `PARITY USD` (56) and `QE PAIR USD Bank` (64) |
| Contact | `QE PAIR Contact One`, owner of A1-QEPAIR01 | `QE PAIR Contact One` (#15), owner of QEPAIR01 |

- Every document created during the pass sits on these apartments and accounts.
- Trial drafts were removed or cancelled: on New, PV #29, #31, #34, #35, #36 and JV #19, #21; on Old, PV 5413, 5415, 5416 and Invoice 136080.
- Seed data and other people's data were **not** touched.

## Notes on the results

- **Time zone:** the test machine ran on UTC+7 and the server uses Yangon time (UTC+6:30), so dates shift around midnight on 29/10 ([D-13](differences.md#d-13)). Both sites behave the same, so it is not a bug.
- **Different configuration between environments**, not bugs:
  - UO price YESC is 100 on Old and 1,000 on New.
  - The expense category is "Expense test category" on Old and "Security" on New.
- **UAT incidents:**
  - New sometimes returned 503 (ERR_BFF_CIRCUIT_OPEN, [D-10](differences.md#d-10)).
  - Once an EM Submit was lost with no error shown; submitting again worked.
