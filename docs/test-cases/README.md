# EM Test Cases — Smoke · E2E · Regression

Consolidated test-case catalog for the **Estate Management System (EM)** rebuild (TED estate, Yoma Land × Zeya Labs). It is the baseline for building the automated **Smoke**, **E2E** and **Regression** suites.

| | |
|---|---|
| **Source of truth** | The feature files in [features/](features/). Add and change test cases there (see [Adding or changing test cases](#adding-or-changing-test-cases)). |
| **Origin** | First imported on 11 Oct 2026 from `ZL_TED EM Test Case for Round Testing (2026)_19082026.xlsx` (27 sheets, EM QA team). The workbook is no longer maintained. |
| **Business context** | [EM Business Summary](../EM_Business_Summary.md) |

## How to read this

**Priority**

| | Meaning |
|---|---|
| **P1** | Money correctness or a critical business flow: create / approve financial documents, payments and allocation, wallet / deposit / cash balances, AR / SOA / OB-CB, login, approval permissions. Must pass to release. |
| **P2** | Core functional behaviour that does not calculate money: list / view / filter / edit / delete of master data, PDF content, report filters, data-integrity validation, view / create permissions. |
| **P3** | Field-level and UI validation, messages, sorting, cosmetic. |

**★ Critical business flow** — the case directly exercises one of these:

1. Billing: UO → invoice, EM → debit note, manual Inv / DN with approval.
2. Collection: payment → allocation → invoice status → AR.
3. Balance continuity: OB = previous CB.
4. Maker–checker and concurrency protection.
5. Access to money operations.

**Suites** (one case can be in several)

- `Smoke`: a small happy-path set run on every deploy.
- `E2E`: the case is a step in a cross-module flow, composed into flows in [e2e-critical-flows.md](suites/e2e-critical-flows.md).
- `Regression`: every non-obsolete case, run in tiers R1 / R2 / R3.

**Automation**

| Tag | Meaning |
|---|---|
| `Auto-UI` | Browser automation; assert on screen. |
| `Auto-UI+API` | Act in the UI, assert the numbers via API or parsed PDF. Used for most money checks. |
| `Auto-API` | Pure API test, including parallel requests for race conditions. |
| `Manual` | Physical print, visual layout or untestable-as-written. The reason is given on each case. |

**Status:** `Active` · `Review` (expected result or behaviour needs confirmation — see [source-issues.md](source-issues.md)) · `Obsolete`.

**Data variants.** A case that runs the same check with different data lists the data in its **Data variants** table. Automate each such case as **one parameterized / data-driven test** with one run per variant. The variants of the imported cases are workbook rows that were merged; the merge record is in [duplicates-merged.md](duplicates-merged.md).

**IDs.** `<FEATURE>-<nnn>`, for example `INV-017` or `OB-SOA-007`. An ID never changes and is never reused. Imported cases keep their workbook sheet, row and original ID (e.g. `TC_Inv_021`) in the **Source** column.

<!-- generated:overview (npm run cases:build) -->
## At a glance

| | |
|---|---|
| Test cases | **599** (+940 data-variant rows = 1539 rows) |
| ★ Critical business flow | 208 |
| Priority P1 / P2 / P3 | 225 / 303 / 71 |
| Smoke / E2E-tagged | 56 / 198 (+ 12 composed [E2E flows](suites/e2e-critical-flows.md)) |
| Automatable / Manual | 590 / 9 |
| Review (open question) / Obsolete | 53 / 0 |

## Suites

| Suite | File | Size | Purpose |
|---|---|---|---|
| Smoke | [suites/smoke.md](suites/smoke.md) | 56 cases | Every deploy — can EM still bill, collect and report? |
| E2E | [suites/e2e-critical-flows.md](suites/e2e-critical-flows.md) | 12 flows | ★ Critical business flows chained across modules |
| Regression | [suites/regression.md](suites/regression.md) | R1 / R2 / R3 tiers | Coverage per feature; manual-only list |

## Features

| # | Feature | Cases | ★ | P1 | Smoke | Auto | Manual |
|---|---|---|---|---|---|---|---|
| | **Billing** | | | | | | |
| 04 | [Invoice & Debit Note](features/04-invoice-debit-note.md) | 37 | 7 | 7 | 4 | 35 | 2 |
| 05 | [Utility Operations (UO) — manual entry](features/05-utility-operations-uo.md) | 28 | 8 | 8 | 2 | 28 | 0 |
| 06 | [UO Import (bulk meter readings)](features/06-uo-import.md) | 38 | 11 | 11 | 1 | 37 | 1 |
| 07 | [Estate Management Fee (EM)](features/07-estate-management-fee.md) | 17 | 6 | 6 | 3 | 17 | 0 |
| | **Collection & cash** | | | | | | |
| 10 | [Make Payment](features/10-make-payment.md) | 14 | 13 | 13 | 4 | 14 | 0 |
| 11 | [Cash Received (RV / Unknown / Funding)](features/11-cash-received.md) | 13 | 3 | 3 | 2 | 11 | 2 |
| 12 | [Payment Concurrency (1 Inv × 2 RV, 1 RV × 2 Inv)](features/12-payment-concurrency.md) | 7 | 7 | 7 | 0 | 7 | 0 |
| 13 | [Cash Outflow (PV)](features/13-cash-outflow.md) | 13 | 4 | 4 | 2 | 11 | 2 |
| 14 | [Cash Transfer (JV)](features/14-cash-transfer.md) | 12 | 4 | 4 | 1 | 10 | 2 |
| 15 | [Cash & Bank Account](features/15-cash-bank-account.md) | 20 | 2 | 4 | 1 | 20 | 0 |
| | **Apartment ledgers** | | | | | | |
| 08 | [Apartments](features/08-apartments.md) | 33 | 9 | 15 | 3 | 33 | 0 |
| 09 | [Contacts](features/09-contacts.md) | 32 | 8 | 13 | 1 | 32 | 0 |
| 16 | [Wallet](features/16-wallet.md) | 32 | 9 | 9 | 5 | 32 | 0 |
| 17 | [Deposit](features/17-deposit.md) | 25 | 6 | 6 | 3 | 25 | 0 |
| | **Balances (OB / CB)** | | | | | | |
| 19 | [SOA — Opening / Closing Balance](features/balances/19-soa-ob-cb.md) | 20 | 20 | 20 | 2 | 20 | 0 |
| 20 | [Wallet — Opening / Closing Balance](features/balances/20-wallet-ob-cb.md) | 13 | 13 | 13 | 1 | 13 | 0 |
| 21 | [Deposit — Opening / Closing Balance](features/balances/21-deposit-ob-cb.md) | 13 | 13 | 13 | 1 | 13 | 0 |
| 22 | [Account Statement — Opening / Closing Balance](features/balances/22-account-statement-ob-cb.md) | 11 | 11 | 11 | 2 | 11 | 0 |
| | **Receivables & reporting** | | | | | | |
| 02 | [Dashboard](features/02-dashboard.md) | 8 | 4 | 6 | 3 | 8 | 0 |
| 03 | [Accounts Receivable](features/03-accounts-receivable.md) | 18 | 2 | 4 | 2 | 18 | 0 |
| 18 | [Reports](features/18-reports.md) | 35 | 4 | 4 | 2 | 35 | 0 |
| 25 | [Global Search](features/25-global-search.md) | 1 | 0 | 0 | 0 | 1 | 0 |
| | **Platform** | | | | | | |
| 01 | [Login & Authentication](features/01-login.md) | 6 | 1 | 1 | 1 | 6 | 0 |
| 23 | [Settings (master data & configuration)](features/23-settings.md) | 50 | 3 | 3 | 1 | 50 | 0 |
| 24 | [Role & Permission](features/24-role-permission.md) | 76 | 29 | 29 | 5 | 76 | 0 |
| 26 | [External API](features/26-api.md) | 27 | 11 | 11 | 4 | 27 | 0 |
<!-- /generated:overview -->

## Other files

| File | What it is |
|---|---|
| [test-catalog.csv](test-catalog.csv) | Generated. One row per case (`canonical`) and one per extra data variant (`variant`), with columns:<br>• ID, row type, feature, sub-feature, title<br>• priority, ★, smoke, E2E, regression<br>• automation, status, variant label<br>• source, source TC ID, feature file<br>The Playwright traceability check and tags are driven by it. |
| [duplicates-merged.md](duplicates-merged.md) | Historical record of the workbook import (11 Oct 2026): which workbook rows were merged into which case, and why. Not updated. |
| [../sanity-test/](../sanity-test/README.md) | Hand-written, not generated. Sanity pass of New EM vs Old EM on UAT (130 `SAN-*` cases, 32 bugs with evidence, Jira cross-check). Not part of this catalog yet. |
| [source-issues.md](source-issues.md) | Decisions needed, known defects, wrong expected results, coverage gaps (hand-written); all cases in Review (generated). |

## Suggested automation tagging

Tag each automated test from the catalog values, so suites can be selected without separate lists. The case ID goes in the test title (and a `tc` annotation), not in a tag:

```
INV-017 <title>   @P1 @critical @smoke @review
```

| Tag | On |
|---|---|
| `@P1` / `@P2` / `@P3` | every case (priority) |
| `@critical` | ★ cases (always P1) |
| `@smoke` | smoke cases (base row only for data-driven cases) |
| `@review` | cases with status Review |
| `@e2e` | only the 12 composed [E2E flows](suites/e2e-critical-flows.md); single cases marked E2E are listed in the flow, not tagged |

There is no `@regression` tag: every case is in regression.

| When | Run |
|---|---|
| Every deploy (smoke) | `--grep @smoke --grep-invert @review` |
| Every merge / nightly (R1) | `--grep @P1 --grep-invert @review` |
| Release candidate (R2) | `--grep "@P1\|@P2" --grep-invert @review` |
| Before production release (R3) | everything, `@review` included |
| E2E flows | `--grep @e2e` |
| Review cases (non-blocking report) | `--grep @review` |

Blocking gates leave out `@review`: their expected result is still in question, so a red one is checked against [source-issues.md](source-issues.md) instead of failing the build.

The full rules are in the Playwright skill (`.claude/skills/playwright-skill/references/em-project.md`).

## Adding or changing test cases

The case sections in `features/**/*.md` are the **only** place a test case is written. Everything else is generated from them by `npm run cases:build`:

- the counts and **Summary** table at the top of each feature file,
- [test-catalog.csv](test-catalog.csv), [suites/smoke.md](suites/smoke.md), [suites/regression.md](suites/regression.md),
- the blocks between `<!-- generated:… -->` markers in this README and in [source-issues.md](source-issues.md).

Do not edit generated content by hand; the next build overwrites it. [suites/e2e-critical-flows.md](suites/e2e-critical-flows.md) is hand-written.

**Workflow**

1. Edit or add the case in its feature file.
2. Run `npm run cases:build`. It validates every case and rewrites the generated files.
3. Commit the feature file together with the generated files. `npm run cases:check` fails when they are out of date (use it in CI).

**Rules**

- **New case:** the next free number at the end of the feature, under the right `### <sub-feature>` heading. Never renumber or reuse an ID.
- **Removed case:** set its Status to `Obsolete` and keep it. Delete a case only if it was never automated.
- **New feature:** a new file `features/<nn>-<slug>.md` (next free number) with its own ID prefix, starting with `# <nn> · <Feature name>`, the index link, empty `<!-- generated:summary -->` markers and `## Test cases`. Add the prefix to a README group and a smoke stage in `scripts/test-cases.mjs`, or it is listed under "Other".
- **Status `Review`** needs the open question after the status: `Review — <question>`. **Automation `Manual`** needs the reason: `Manual — <reason>`.

**Case template**

```markdown
### <Sub-feature>

#### ★ PAY-015 · <Title: action and expected outcome>

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI+API | Active | <ticket / spec / author, date> |

**Preconditions:**

1. ...

**Test data:**

1. ...

**Steps:**

1. ...

**Expected result:**

1. ...

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) <title> | <source> | |
| 2 | <short label, unique in this case> | <source> | |
| 3 | <short label> | <source> | Review; <open question> |

---
```

- `★ ` before the ID marks a critical business flow (P1 only). Leave it out otherwise.
- **Suites:** any of `Smoke`, `E2E`, plus `Regression` for every case that is not Obsolete. Smoke cases must be P1, Active and automatable.
- **Priority** `P1` / `P2` / `P3`; **Automation** `Auto-UI` / `Auto-UI+API` / `Auto-API` / `Manual`; **Status** `Active` / `Review` / `Obsolete`.
- Leave out the Data variants section when the case has a single data set. The variant label becomes part of the Playwright test title, so keep it short and unique.
- Other sections (`Check areas`, `Scenario group`, …) are free-form; use what the case needs.
