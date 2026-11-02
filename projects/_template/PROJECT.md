# __APP__ Project Rules

App: `__APP__`. Run with `APP=__APP__` (or `-c projects/__APP__`).

These rules apply to every task on this app. Where a generic skill reference shows a
different pattern, this file wins. Paths in this file are relative to `projects/__APP__/`.

Background: `docs/knowledge/`.

> Fill in every section before automating. Write "None" rather than deleting a section, so
> the skill knows the question was asked. Mark anything not yet confirmed as **unconfirmed**.

## System Under Test

| Part | What (stack) | Env var |
|---|---|---|
| Web app | | `BASE_URL` |
| API | | `API_BASE_URL` |

- Environments and which one tests run against: …
- Never run against production.

## API

- Auth scheme (Bearer / cookie / API key) and how tests get a token: …
- Response format quirks (envelopes, encryption, big-integer IDs, pagination): …
- Does logging in revoke earlier tokens or sessions? (decides whether API and UI can share an account): …

## Roles and Authentication

Roles: `admin`, …

- Which actions need two roles (maker–checker, approvals): …
- `tests/auth.setup.ts` logs in every role used by the suite and saves
  `playwright/.auth/<role>.json` (git-ignored).
- Credentials come from env: `<ROLE>_EMAIL` / `<ROLE>_PASSWORD`.
- Accounts tests must never use: …

## Test Cases → Tests

Follow the skill's `references/test-case-conventions.md`. App specifics:

- E2E flows: `E2E-01` … (`docs/test-cases/suites/e2e-critical-flows.md`).
- Feature folders: `tests/<feature>/` …
- Domain assertions (money, dates, units, rounding): …

## Data Isolation

- What each test creates for itself (and the naming pattern, e.g. `AT-<yyyymmdd>-<workerIndex>-<random>`): …
- Shared global state (totals, counters, settings) and how tests avoid depending on it: …
- What can and cannot be deleted after a test: …

## Known Product Bugs

Where confirmed defects are recorded (referenced by `test.fail()`): `docs/knowledge/GOTCHAS.md`.

## Safety

- Allowed environments: …
- Actions tests and discovery must never perform (real payments, emails to real users, resets): …
- Never upload real personal data; generate it.
