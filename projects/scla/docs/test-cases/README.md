# scla Test Cases — Smoke · E2E · Regression

Test-case catalog for **scla**. It is the baseline for the automated **Smoke**, **E2E** and **Regression** suites.

| | |
|---|---|
| **Source of truth** | The feature files in [features/](features/). Add and change test cases there (see [Adding or changing test cases](#adding-or-changing-test-cases)). |
| **Business context** | [Knowledge base](../knowledge/README.md) |

## How to read this

**Priority**

| | Meaning |
|---|---|
| **P1** | Critical business flow or data correctness. Must pass to release. |
| **P2** | Core functional behaviour: list / view / filter / edit / delete, report filters, permissions. |
| **P3** | Field-level and UI validation, messages, sorting, cosmetic. |

**★ Critical business flow** — the case directly exercises one of the app's critical flows (list them here).

**Suites** (one case can be in several)

- `Smoke`: a small happy-path set run on every deploy.
- `E2E`: the case is a step in a cross-module flow, composed into flows in [e2e-critical-flows.md](suites/e2e-critical-flows.md).
- `Regression`: every non-obsolete case, run in tiers R1 / R2 / R3.

**Automation**

| Tag | Meaning |
|---|---|
| `Auto-UI` | Browser automation; assert on screen. |
| `Auto-UI+API` | Act in the UI, assert the result via API or a parsed file. |
| `Auto-API` | Pure API test, including parallel requests for race conditions. |
| `Manual` | Physical print, visual layout or untestable-as-written. The reason is given on each case. |

**Status:** `Active` · `Review` (expected result or behaviour needs confirmation — see [source-issues.md](source-issues.md)) · `Obsolete`.

**Data variants.** A case that runs the same check with different data lists the data in its **Data variants** table. Automate each such case as **one parameterized / data-driven test** with one run per variant.

**IDs.** `<FEATURE>-<nnn>`, for example `AUTH-001`. An ID never changes and is never reused.

<!-- generated:overview (npm run cases:build) -->
## At a glance

| | |
|---|---|
| Test cases | **1** (+0 data-variant rows = 1 rows) |
| ★ Critical business flow | 1 |
| Priority P1 / P2 / P3 | 1 / 0 / 0 |
| Smoke / E2E-tagged | 1 / 0 (+ 1 composed [E2E flows](suites/e2e-critical-flows.md)) |
| Automatable / Manual | 1 / 0 |
| Review (open question) / Obsolete | 0 / 0 |

## Suites

| Suite | File | Size | Purpose |
|---|---|---|---|
| Smoke | [suites/smoke.md](suites/smoke.md) | 1 cases | Every deploy — can users still sign in and complete the core flow? |
| E2E | [suites/e2e-critical-flows.md](suites/e2e-critical-flows.md) | 1 flows | ★ Critical business flows chained across modules |
| Regression | [suites/regression.md](suites/regression.md) | R1 / R2 / R3 tiers | Coverage per feature; manual-only list |

## Features

| # | Feature | Cases | ★ | P1 | Smoke | Auto | Manual |
|---|---|---|---|---|---|---|---|
| | **Platform** | | | | | | |
| 01 | [Login & Authentication](features/01-login.md) | 1 | 1 | 1 | 1 | 1 | 0 |
<!-- /generated:overview -->

## Adding or changing test cases

The case sections in `features/**/*.md` are the **only** place a test case is written. Everything else is generated from them by `npm run cases:build -- --app scla`:

- the counts and **Summary** table at the top of each feature file,
- [test-catalog.csv](test-catalog.csv), [suites/smoke.md](suites/smoke.md), [suites/regression.md](suites/regression.md),
- the blocks between `<!-- generated:… -->` markers in this README and in [source-issues.md](source-issues.md).

Do not edit generated content by hand; the next build overwrites it. [suites/e2e-critical-flows.md](suites/e2e-critical-flows.md) is hand-written.

**Workflow**

1. Edit or add the case in its feature file.
2. Run `npm run cases:build -- --app scla`. It validates every case and rewrites the generated files.
3. Commit the feature file together with the generated files. `npm run cases:check -- --app scla` fails when they are out of date (use it in CI).

**Rules**

- **New case:** the next free number at the end of the feature, under the right `### <sub-feature>` heading. Never renumber or reuse an ID.
- **Removed case:** set its Status to `Obsolete` and keep it. Delete a case only if it was never automated.
- **New feature:** a new file `features/<nn>-<slug>.md` (next free number) with its own ID prefix, starting with `# <nn> · <Feature name>`, the index link, empty `<!-- generated:summary -->` markers and `## Test cases`. Add the prefix to a README group and a smoke stage in `../../test-cases.config.mjs`, or it is listed under "Other".
- **Status `Review`** needs the open question after the status: `Review — <question>`. **Automation `Manual`** needs the reason: `Manual — <reason>`.

**Case template**

```markdown
### <Sub-feature>

#### ★ AUTH-002 · <Title: action and expected outcome>

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-UI | Active | <ticket / spec / author, date> |

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
