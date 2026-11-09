# EM Project Rules

App: `em` (Estate Management). Run with `APP=em` (or `-c projects/em`).

These rules apply to every task on this app. Where a generic skill reference shows a
different pattern, this file wins. Paths in this file are relative to `projects/em/`.

Background: `docs/ems-knowledge/` (read `GOTCHAS.md` before touching money flows) and
`docs/EM_Business_Summary.md`.

## System Under Test

| Part | What | Env var |
|---|---|---|
| `em-web` | Vue 3 / PrimeVue back-office portal | `BASE_URL` |
| `em-backend` | Back-office API (Laravel, Passport Bearer token) | `API_BASE_URL` |
| `estate-billing-api` | External partner API, same DB, auth by API key | `PARTNER_API_BASE_URL` |

- Currency MMK (main), USD (secondary). Identity numbers are Myanmar NRC.
- Never run against production. The deployed branches are `develop` → `uat` → `preprod` → `master`.

## Encrypted API Responses

em-backend wraps every response body in an AES-encrypted `payload` field (`ApiEncrypt`
middleware). em-web decrypts it in `src/libs/crypton` with a key shipped in the frontend bundle.

- All back-office API reads go through one helper: `src/api/crypto.ts` → `decryptPayload()`.
- Clients never call `response.json()` directly on em-backend responses.
- The key comes from `API_PAYLOAD_KEY` in `.env`; never commit it.
- Cipher, IV handling and encoding must be copied from `em-web/src/libs/crypton`. Until that
  is confirmed, `decryptPayload()` throws instead of guessing.
- IDs can be big integers (em-web parses them specially). Keep IDs as strings in tests.
- Check whether `estate-billing-api` encrypts responses before reusing the helper there.

## Two API Clients

| Client | Base URL | Auth |
|---|---|---|
| `src/api/clients/*` (back-office) | `API_BASE_URL` | Bearer token from user login, per role |
| `src/api/partner/*` | `PARTNER_API_BASE_URL` | API key → `POST /v2/get_token` (never the `GET /v1/get_token/{key}` form) |

Tokens:

- **Partner API: each token exchange deletes the key's earlier tokens** (`MONEY_FLOWS.md` §8).
  Exchange the key once per run (setup project → file, or a single worker) and share that
  token; tests that exchange the key themselves will invalidate each other in parallel.
- Back-office: get one token per role per worker and reuse it (worker-scoped fixture). Check
  whether em-backend login revokes the user's earlier tokens; if it does, the API login would
  also log out the browser storage state for that user, and roles need separate accounts for
  API and UI.

Create each `APIRequestContext` with its own `baseURL` and `extraHTTPHeaders`
(`Authorization: Bearer <token>`). Do not reuse the browser `request` fixture for the API,
because it points at `BASE_URL`.

## Roles and Authentication (maker–checker)

Roles: `admin`, `management`, `uo-operator`/`uo-manager`, `mo-operator`/`mo-manager`,
`leasing-operator`/`leasing-manager`, `finance-operator`/`finance-manager`,
`cashier-operator`/`cashier-manager`, `credit-control`, `it-operator`.

- Operators create, managers approve. Most money cases need **two roles in one test**.
- One `auth.setup.ts` logs in every role used by the suite and saves
  `playwright/.auth/<role>.json` (git-ignored). The em-web token lives in localStorage, which
  storageState captures.
- Credentials come from env: `<ROLE>_EMAIL` / `<ROLE>_PASSWORD` (e.g. `UO_OPERATOR_EMAIL`).
- Fixtures expose `asRole(role)` (a page in its own browser context) and `apiAs(role)` (an
  API context with that role's token). See `templates/role.fixture.ts`.
- Never use the seeded `superadmin` / `password` account.

## Test Cases → Tests

Follow the skill's `references/test-case-conventions.md` (titles, `tc` / `source`
annotations, tags, E2E flows, `@review`, data variants, CI gates). EM specifics:

- **Sanity suite** (New EM vs Old EM, Jira bug repros): cases in `docs/sanity-test/`,
  tests in `tests/sanity/`, tag `@sanity`, CI `.github/workflows/em-sanity.yml` (any tags by hand: `em-tests.yml`). Use
  `sanity()` from `@helpers/sanity` for tags and annotations. See `docs/sanity-test/README.md#automation`.
- The target is **New EM** (Next.js, Radix-style comboboxes, `data-testid` on figures), not
  the Vue/PrimeVue em-web described below. Confirm locators on the live page.

- There are 12 composed flows, `E2E-01` … `E2E-12` (`docs/test-cases/suites/e2e-critical-flows.md`:
  "All flows are P1 ★"). E2E flows chain several roles and approvals.
- Feature folders, e.g. `tests/invoice/`, `tests/payment/`, `tests/balances/`,
  `tests/e2e/E2E-01-utility-billing.spec.ts`, `tests/api/partner/`.
- `Auto-UI+API` is used for most money checks: assert the numbers on screen **and** via API
  (and via parsed PDF when the case says PDF).

Money assertions:

- Compare amounts as exact decimals (strings or integer minor units), never floating point.
- Read the screen value, the API value and the PDF value through helpers in `src/helpers/money.ts`
  so formatting (thousands separators, `MMK`) is parsed in one place.

## Data Isolation

- Each test or E2E flow creates its own apartment and contact through the API
  (name pattern `AT-<yyyymmdd>-<workerIndex>-<random>`), so balances start from zero.
  This includes smoke: the stages in `suites/smoke.md` are a reading order, not shared data.
- Global totals (Dashboard, AR summary, cash account balances) are shared by every test.
  Assert **deltas** captured before/after, scoped to your own documents where possible; if a
  case can only assert an absolute global total, put it in a `*.serial.spec.ts` file, which
  runs in the `serial-global-totals` project with one worker (see `configuration.md`).
- Approved financial documents cannot be deleted. "Cleanup" means unique data per run on a
  dedicated test environment, not deletion. Draft documents may be deleted when the API allows.
- Back-dated and month-end cases (OB/CB, E2E-10): pass explicit dates; use `page.clock` only for
  UI date defaults. Never depend on today's date being mid-month.

## Concurrency Cases (CONC-*, E2E-09)

- Use separate API contexts (or browser contexts) per simulated user.
- Fire the conflicting requests together with `Promise.all`, then assert the outcome the case
  states: one accepted and one rejected for full / exceeding payments (CONC-001, -002, -004…),
  **both accepted** for partials within the balance (CONC-003). Always also assert the final
  invoice due amount and status.
- Repeat each concurrency test several times (`--repeat-each`) before trusting a pass.

## Known Product Bugs

`docs/ems-knowledge/GOTCHAS.md` lists defects found in code (e.g. the partner API marks
partial payments as PAID). GOTCHAS was written from code reading: apply `test.fail()` (see
`references/test-case-conventions.md`) only once the defect is confirmed on the test
environment, and reference the GOTCHAS entry.

## Safety

- Only test environments listed in `.env` / CI variables. Abort if `BASE_URL` looks like production.
- Never run `php artisan ems:run` or any DB reset from tests.
- Partner API tests use a dedicated test API key; payments created there are real records
  in the shared DB.
- Do not upload real resident data; generate NRC / phone / names.
