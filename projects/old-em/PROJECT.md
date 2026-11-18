# Old EM Project Rules

App: `old-em` (the **old** Estate Management system). Run with `APP=old-em` (or `-c projects/old-em`).

These rules apply to every task on this app. Where a generic skill reference shows a
different pattern, this file wins. Paths in this file are relative to `projects/old-em/`.

## Why this app exists

New EM (`projects/em/`) is a rebuild of Old EM. Its test cases (`../em/docs/test-cases/`, written
by the GT testers) describe Old EM's behaviour, including the expected behaviour of known Old EM
issues. Before a New EM failure is reported as a regression, we need to know whether Old EM
passes the same case. This app runs those cases **against Old EM** and lists the areas where
Old EM itself fails, for the project managers to decide what the rebuild must fix.

Output: [report/old-em-issues.md](report/old-em-issues.md).

Background: `../em/docs/ems-knowledge/` (scanned from the Old EM code base) and
`../em/docs/EM_Business_Summary.md`.

## System Under Test

| Part | What (stack) | Env var |
|---|---|---|
| Web app | `em-web`, Vue 3 / PrimeVue (Sakai) | `BASE_URL` = https://www.uat.ted.synergy.yomaland360.com |
| API | `em-backend`, Laravel, Passport Bearer token | `API_BASE_URL` = https://www.uat.ted-bkend.synergy.yomaland360.com/api |

- Old EM UAT only. It has no version number; record the date of the run instead.
- Never run against production.

## API

- Responses are AES-encrypted in a `payload` field (`ApiEncrypt`). The tests assert on the
  screens, not on the API, so no decryption helper is needed yet.

## Roles and Authentication

Roles: `admin` (maker), `approver` (checker).

- The New EM accounts in `../em/.env` are rejected by Old EM (401). Old EM accounts go in
  `.env` (`ADMIN_*`, optional `APPROVER_*`).
- When `APPROVER_*` is empty, admin approves its own documents; the report says so if Old EM
  refuses (`../em/docs/test-cases/source-issues.md` D1).
- `tests/auth.setup.ts` logs in each role and saves `playwright/.auth/<role>.json` (git-ignored).
- Never use the seeded `superadmin` account.

## Test Cases → Tests

- **Source of truth: `../em/docs/test-cases/`.** This app has no cases of its own; a test here
  uses the em case ID, title and `tc` / `source` annotations unchanged, so results line up with
  New EM. Traceability: `npm run traceability -- --app old-em --catalog projects/em/docs/test-cases/test-catalog.csv`.
- Scope of the first pass: the 61 **smoke** cases (`../em/docs/test-cases/suites/smoke.md`).
- Tests: `tests/<feature>/`. Tags as in em (`@smoke`, `@P1`, `@critical`, `@review`).
- Fixtures: `src/fixtures/base.fixture.ts` (shared page objects) plus one file per area that extends it
  (`billing`, `collection`, `wallet`, `balances`, `access`). A spec imports `test` from its area file.
- Data builders: `src/data/builders.ts` (contact, apartment, cash account, UO invoice) and one file per area.
- A check area a test leaves out is an annotation `not checked`; a case whose test data does not exist
  on UAT, or whose text is contradictory, gets a `case issue` annotation saying what was used instead.
- A step the case asks for that Old EM cannot do on screen is a **failure** with the reason in
  the message, not a skip. A step we could not run because of the environment (login, data, UAT
  down) is **blocked** (`test.skip` with the reason), never a failure.
- Read a case's Expected result before deciding pass or fail.

## Data Isolation

- Each test creates its own data named `QE OLD <yyyymmdd>-<rand> …` (apartment, contact,
  cash/bank accounts), so it never depends on other testers' data.
- Shared totals (Dashboard, AR, Account Statement) are checked as **deltas** around the test's
  own action, never as absolute values.
- Old EM has no delete for posted documents; QE OLD data stays on UAT.

## Known Product Bugs

Old EM failures found by this app are listed in `report/old-em-issues.md`. Do not mark them
`test.fail()`: the point of the suite is to show them.

## Safety

- Old EM UAT only. Other testers use it: never edit or approve data the test did not create,
  and never change global settings except where a case requires it (then restore them).
- Never upload real personal data; generate it.
