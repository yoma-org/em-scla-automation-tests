# Test Case → Test Conventions

These conventions apply to every app in `projects/`. `scripts/check-traceability.mjs` enforces
them. An app's `PROJECT.md` adds app-specific rules (roles, data, money, safety) and may name
its E2E flows, but it does not change these.

Paths below are relative to the app folder `projects/<app>/`.

## Title, annotations, tags

- Title: `<ID> <case title>`, e.g. `AUTH-001 login with valid credentials lands on dashboard`.
- Annotation: `{ type: 'tc', description: 'AUTH-001' }` and, when the case has a source ID,
  `{ type: 'source', description: 'TC_Login_001' }`.
- Tags come from the catalog columns (`docs/test-cases/test-catalog.csv`):

| Catalog column | Tag |
|---|---|
| `smoke = Y` | `@smoke` |
| priority | `@P1` / `@P2` / `@P3` |
| `critical = Y` | `@critical` (★ critical business flow; always a subset of P1, used to run only the ★ flows) |
| `status = Review` | `@review` |

- No `@regression` tag: the catalog marks every case `regression = Y`, so regression is
  simply "all tests".

## E2E flows

- `@e2e` is only on the composed flows (`E2E-01`, `E2E-02`, … listed in
  `docs/test-cases/suites/e2e-critical-flows.md`, implemented in `tests/e2e/`), so
  `--grep @e2e` runs exactly the E2E suite. Single cases with `e2e = Y` in the catalog are
  **not** tagged `@e2e`, but they **still get their own test** in `tests/<feature>/`; the flow
  is extra coverage, not a replacement.
- Each flow lists the case IDs it covers as `tc` annotations.
- Every flow is tagged `@e2e @P1 @critical`; flows are not in the catalog, so there is no other
  tag source.

```ts
test('E2E-01 order to payment', {
  tag: ['@e2e', '@P1', '@critical'],
  annotation: ['AUTH-001', 'ORD-003', 'PAY-001' /* … every case in the flow table */]
    .map(id => ({ type: 'tc', description: id }))
}, async () => { /* one test.step() per flow step */ });
```

- Flows that chain several roles or approvals get their own timeout (`test.setTimeout()`)
  instead of a higher global default.

## Folders and runs

- Folders are **by feature**, not by suite, because one case can be in several suites:
  `tests/<feature>/<feature>.spec.ts`, `tests/e2e/E2E-01-<slug>.spec.ts`, `tests/api/…`.
- Which tests to run is chosen by tag, with no extra tier tags. Gates that block a merge or a
  deploy exclude `@review` (their expected result is in question, so a red one is not a
  regression); a separate non-blocking job runs `--grep @review` and reports its failures
  against `docs/test-cases/source-issues.md`:

```bash
# every deploy (blocking)
APP=<app> npx playwright test --grep @smoke --grep-invert @review
# every merge / nightly (blocking)
APP=<app> npx playwright test --grep @P1 --grep-invert @review
# release candidate (blocking)
APP=<app> npx playwright test --grep "@P1|@P2" --grep-invert @review
# before production release: everything, @review included
APP=<app> npx playwright test
# review cases (non-blocking report)
APP=<app> npx playwright test --grep @review
```

## Review cases

`Review` cases stay in the suite, tagged `@review`, with the open question as an annotation
(`{ type: 'review', description: '<status_note>' }`). Implement the expected result as the
case states it; a failure is first checked against `docs/test-cases/source-issues.md`.
Use `test.fixme()` only when the case gives no usable expected result, and keep the
`review` annotation and `@review` tag on it.

## Data variants

Merged cases with a **Data variants** table: one data array, one generated test per row,
variant label in the title: `<ID> [<variant>] <title>`. The label is the catalog `variant`
column for `variant` rows and the literal `base` for the canonical row (its `variant`
column is empty), e.g. `AUTH-003 [base] …`, `AUTH-003 [Email=invalid; Password=invalid] …`.

- Each generated test carries `tc` = the case ID and `source` = **that row's** `source_id`
  (variants have their own, e.g. `TC_Login_004`; omit `source` when it is empty).
- Only the base row carries `@smoke`; the variant rows run in regression
  (`docs/test-cases/suites/smoke.md`).
- Variant rows labelled as a duplicate ("Duplicate of TC_…", "Exact duplicate row") or as
  source noise ("header row", "Blank row in source") are not separate data: they need no run
  of their own (`check-traceability.mjs` skips them).

## Automation types

| Catalog value | Pattern |
|---|---|
| `Auto-UI` | Act and assert in the browser. |
| `Auto-UI+API` | Act in the UI; assert the result on screen **and** via API (and via parsed file, e.g. PDF, when the case says so). |
| `Auto-API` | API only. Concurrency cases fire requests with `Promise.all`. |
| `Manual` | Not automated; report as manual-only. |

Downloaded files (PDF, CSV, Excel): capture with `page.waitForEvent('download')`, parse the
content, assert the values. Do not assert visual layout (that is `Manual`).

## Known product bugs

When a case hits a defect that is **confirmed on the test environment**, keep the correct
expected result and mark the test `test.fail()` with a reference to where the defect is
recorded (the app's `PROJECT.md` names the place), so the test alerts when the bug is fixed.
`test.fail()` passes on *any* failure, including a broken locator, so make the steps before the
buggy assertion pass first (assert them explicitly) and re-check these tests whenever the
page they touch changes.
