# Expected Project Tree

The canonical tree with folder responsibilities is in
`references/project-setup-architecture.md` ("Default Structure"). Template → destination,
inside the app folder `projects/<app>/` unless marked *(root)*:

| Template | Destination |
|---|---|
| `templates/tsconfig.json` | `tsconfig.json` |
| `templates/playwright.config.ts` | `playwright.config.ts` |
| `templates/eslint.config.mjs` | `eslint.config.mjs` *(root, once)* |
| `templates/env.example` | `.env.example` |
| `templates/Environment.ts` | `src/utils/Environment.ts` |
| `templates/Routes.ts` | `src/constants/Routes.ts` |
| `templates/crypto.ts` | `src/api/crypto.ts` (`em` only: encrypted API responses) |
| `templates/AuthApi.ts` | `src/api/clients/AuthApi.ts` |
| `templates/LoginPage.ts` | `src/pages/LoginPage.ts` |
| `templates/DashboardPage.ts` | `src/pages/DashboardPage.ts` |
| `templates/Header.ts` | `src/components/Header.ts` |
| `templates/money.ts` | `src/helpers/money.ts` |
| `templates/base.fixture.ts` | `src/fixtures/base.fixture.ts` |
| `templates/role.fixture.ts` | `src/fixtures/role.fixture.ts` |
| `templates/fixtures.index.ts` | `src/fixtures/index.ts` |
| `templates/auth.setup.ts` | `tests/auth.setup.ts` |
| `templates/seed.spec.ts` | `tests/seed.spec.ts` |
| `templates/login.spec.ts` | `tests/auth/login.spec.ts` |

`projects/_template/` already provides `playwright.config.ts`, `tsconfig.json`, `.env.example`
and `tests/seed.spec.ts` in their minimal form; replace them with the templates when the
framework is set up.

Locators, routes, roles and the login endpoint in the templates are unconfirmed placeholders
(several come from the `em` app); verify them against the app before relying on them.
