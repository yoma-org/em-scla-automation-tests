# Project Setup and Framework Architecture

## Purpose

Define how to set up the Playwright TypeScript framework for an app in this multi-project
repository, and how to assess it without imposing unnecessary restructuring.

## Current State

The repository hosts several apps under `projects/<app>/`. `@playwright/test` and
`@types/node` are installed once at the root (one `package.json`, one `node_modules`). Each app
has its own `playwright.config.ts`, `tsconfig.json` and `.env`; the root `playwright.config.ts`
picks one by `APP`. Do **not** run `npm init playwright` again. A new app starts from
`npm run new-project -- <name>`; missing pieces are added on top.

## Dependencies

```bash
npm i -D typescript @faker-js/faker eslint typescript-eslint eslint-plugin-playwright prettier pdf-parse
```

Add only what the task needs, but `typescript` is required for `npm run typecheck`, and
`eslint` / `prettier` for `lint` / `format`.

## Default Structure

Repository level:

```text
<repo>/
├── projects/
│   ├── em/                    # one folder per app (tree below)
│   ├── <app>/
│   └── _template/             # scaffold for npm run new-project
├── shared/                    # code two or more apps use (@shared/*); never imports from projects/
├── scripts/                   # test-cases.mjs (cases:build), new-project.mjs
├── .claude/                   # this skill + Playwright agents (shared by all apps)
├── playwright.config.ts       # picks projects/$APP/playwright.config.ts
├── tsconfig.base.json         # compiler options shared by the app tsconfigs
├── .mcp.json                  # playwright-test MCP server (APP chooses the app)
└── package.json
```

App level (`projects/<app>/`, shown with `em` examples):

```text
projects/<app>/
├── PROJECT.md                 # app rules (read first)
├── test-cases.config.mjs      # README groups, smoke stages for cases:build
├── src/
│   ├── pages/                 # one class per em-web screen (LoginPage, InvoiceListPage, …)
│   ├── components/            # PrimeVue regions reused across pages (DataTable, Toast, ConfirmDialog, Sidebar)
│   ├── api/
│   │   ├── crypto.ts          # decryptPayload() for em-backend responses
│   │   ├── clients/           # back-office API clients (AuthApi, InvoicesApi, ApartmentsApi, …)
│   │   ├── partner/           # estate-billing-api clients
│   │   └── models/            # request / response types
│   ├── fixtures/
│   │   ├── base.fixture.ts    # page objects
│   │   ├── role.fixture.ts    # asRole(), per-role API clients
│   │   ├── data.fixture.ts    # apartment, contact, … created per test
│   │   └── index.ts           # mergeTests → `@fixtures`
│   ├── data/
│   │   ├── factories/         # buildApartment(), buildContact(), buildNrc() …
│   │   └── static/
│   ├── helpers/               # money.ts (parse/compare amounts), pdf.ts
│   ├── utils/                 # Environment.ts (env vars, roles, auth file paths)
│   ├── constants/             # Routes.ts
│   └── types/
├── tests/
│   ├── auth.setup.ts          # logs in every role → playwright/.auth/<role>.json
│   ├── seed.spec.ts           # starting point for the Playwright agents
│   ├── auth/                  # AUTH-*
│   ├── invoice/               # INV-*
│   ├── payment/               # PAY-*, CONC-* (UI part)
│   ├── balances/              # OB-SOA-*, OB-WAL-*, …
│   ├── …                      # one folder per feature in docs/test-cases/features
│   ├── e2e/                   # E2E-01 … E2E-12
│   └── api/
│       └── partner/           # estate-billing-api cases
├── playwright/.auth/          # git-ignored
├── specs/                     # Planner plans (not test cases)
├── docs/                      # canonical test cases and knowledge base
├── playwright.config.ts       # paths from __dirname; loads ./.env
├── tsconfig.json              # extends ../../tsconfig.base.json; aliases → ./src, @shared → ../../shared
└── .env.example
```

`eslint.config.mjs` (`templates/eslint.config.mjs`) lives once at the repository root.

Suites (smoke, priority, E2E) are **tags**, not folders. See `references/test-case-conventions.md`.

## Existing Repository Rule

1. inspect the existing structure;
2. reuse valid conventions;
3. map skill responsibilities to existing folders;
4. do not move files merely to match the default tree;
5. propose restructuring separately when necessary.

## Folder Responsibilities

| Folder | Responsibility |
|---|---|
| `src/pages` | Page-level UI behavior |
| `src/components` | Reusable UI regions |
| `src/api/clients` | Back-office API operations (decrypted) |
| `src/api/partner` | Partner API operations |
| `src/api/models` | Request and response types |
| `src/fixtures` | Dependency injection and lifecycle |
| `src/data/factories` | Generated test data |
| `src/helpers` | Domain helpers: money, PDF |
| `src/utils` | Environment and generic utilities |
| `src/constants` | Routes and stable constants |
| `tests/<feature>` | Specs per feature, tagged by suite |
| `tests/e2e` | Cross-module flows E2E-01 … E2E-12 |
| `tests/api/partner` | Partner API tests |

## TypeScript Configuration

Root `tsconfig.base.json` holds the compiler options (`target ES2022`, `module ESNext`,
`moduleResolution Bundler`, `strict`, `noEmit`, …). Each app's `projects/<app>/tsconfig.json`
(see `templates/tsconfig.json`) extends it and owns the aliases, so `@pages/*` in one app
never resolves into another app:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@pages/*": ["./src/pages/*"],
      "@components/*": ["./src/components/*"],
      "@api/*": ["./src/api/*"],
      "@fixtures": ["./src/fixtures/index.ts"],
      "@fixtures/*": ["./src/fixtures/*"],
      "@data/*": ["./src/data/*"],
      "@helpers/*": ["./src/helpers/*"],
      "@utils/*": ["./src/utils/*"],
      "@constants/*": ["./src/constants/*"],
      "@app-types/*": ["./src/types/*"],
      "@shared/*": ["../../shared/*"]
    }
  },
  "include": ["src", "tests", "playwright.config.ts", "../../shared"]
}
```

- `paths` are relative to the tsconfig, so `baseUrl` is not needed. `paths` in a child
  tsconfig replaces the parent's entirely, which is why aliases live only in the app files.
- Use `@app-types/*`, not `@types/*`, which is the npm type-package scope.
- Playwright reads `paths` from the `tsconfig.json` closest to each file; no extra bundler setup is needed.

## Package Scripts

Scripts are shared; the app comes from `APP` (Playwright, typecheck) or `-- --app <app>`
(cases, traceability), e.g. `APP=em npm run test:smoke`.

```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke --grep-invert @review",
    "test:p1": "playwright test --grep @P1 --grep-invert @review",
    "test:review": "playwright test --grep @review",
    "test:e2e": "playwright test --grep @e2e",
    "test:api": "playwright test api/",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui",
    "test:report": "playwright show-report",
    "typecheck": "tsc --noEmit -p projects/$APP",
    "lint": "eslint .",
    "format": "prettier --write .",
    "traceability": "node .claude/skills/playwright-skill/scripts/check-traceability.mjs",
    "cases:build": "node scripts/test-cases.mjs",
    "cases:check": "node scripts/test-cases.mjs --check",
    "new-project": "node scripts/new-project.mjs",
    "validate": "npm run typecheck && npm run lint && npm run traceability"
  }
}
```

## Environment

`projects/<app>/.env.example` (committed, no real values); each app reads its own
`projects/<app>/.env` (git-ignored by the root `.gitignore`). Example for `em`:

```dotenv
BASE_URL=
API_BASE_URL=
PARTNER_API_BASE_URL=
API_PAYLOAD_KEY=
PARTNER_API_KEY=

ADMIN_EMAIL=
ADMIN_PASSWORD=
UO_OPERATOR_EMAIL=
UO_OPERATOR_PASSWORD=
UO_MANAGER_EMAIL=
UO_MANAGER_PASSWORD=
# … one pair per role used by the suite
```

## Validation

Run (or `scripts/validate-project.sh <app>`):

```bash
npm ci
npx playwright install chromium
APP=<app> npm run typecheck
npm run lint
node .claude/skills/playwright-skill/scripts/check-traceability.mjs --app <app>   # also runs `playwright test --list`
```

The traceability check compares every test with `test-catalog.csv` (title, `tc` / `source`
annotations, tags, variants, Review / Manual status, leftover drafts) and exits 1 on any
mismatch. `--coverage` also lists the cases that have no test yet.

Do not report success without successful command output.
