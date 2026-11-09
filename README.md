# EM-SCLA Automation Tests

Playwright + TypeScript automation for several applications. Each application ("app") lives
in its own folder under `projects/`; the framework conventions, the Claude Code Playwright
skill and the planner / generator / healer agents are shared.

| App | Folder | Rules |
|---|---|---|
| EM (Estate Management) | [projects/em/](projects/em/) | [PROJECT.md](projects/em/PROJECT.md) |
| SCLA | [projects/scla/](projects/scla/) | [PROJECT.md](projects/scla/PROJECT.md) |

## Layout

```text
projects/
  <app>/
    PROJECT.md              app rules: system under test, roles, data, safety
    docs/test-cases/        canonical test cases (source of truth) + generated catalog and suites
    docs/…                  app knowledge base
    src/  tests/  specs/    Page Objects / fixtures / API clients, Playwright specs, planner plans
    playwright.config.ts    app config: own .env, baseURL, reports
    tsconfig.json           path aliases (@pages, @fixtures, …) → this app's src/
    test-cases.config.mjs   README groups and smoke stages for cases:build
  _template/                scaffold for new apps
shared/                     code used by two or more apps (@shared/*)
scripts/                    test-cases.mjs (catalog build), new-project.mjs (scaffold)
.claude/                    Playwright skill + agents (shared)
playwright.config.ts        delegates to projects/$APP/playwright.config.ts
```

## Everyday commands

The app is chosen with `APP` (Playwright) or `--app` (scripts).

```bash
APP=em npx playwright test                       # or: npx playwright test -c projects/em
APP=em npx playwright test --grep @smoke --grep-invert @review
npm run cases:build -- --app em                  # validate cases, regenerate catalog / suites
npm run cases:check -- --app em                  # CI: fail if generated files are stale
npm run traceability -- --app em                 # tests ↔ catalog check
```

Each app reads its secrets from `projects/<app>/.env` (copy `.env.example`; git-ignored).

### Running by tag

Suites are chosen by tag, locally and in CI, with one tag expression
(`scripts/run-tags.mjs`): space = OR, `+` = AND, `!` = NOT. A missing `@` is added, and tags
match whole words (`@EM-9` does not match `@EM-92`).

```bash
npm run test:tags -- "@sanity" --app em               # sanity suite
npm run test:tags -- "@smoke+!@review" --app em       # smoke without review cases
npm run test:tags -- "@e2e" --app em                  # E2E flows
npm run test:tags -- "@EM-92 @EM-93" --app em         # tests of these Jira issues
npm run test:tags -- "@sanity+@P1" --app em -- --project=chromium --headed   # extra Playwright args after --
npm run test:tags -- "@smoke" --app em --print        # only print the --grep regex
```

| Tag | Meaning |
|---|---|
| `@smoke`, `@e2e`, `@sanity` | Suite |
| `@P1` `@P2` `@P3`, `@critical` | Priority, ★ business flow |
| `@review` | Expected result in question (non-blocking) |
| `@EM-92` … | Jira issue the test checks |

CI for `em`: one workflow per suite, sharing the steps in `.github/workflows/em-run-tests.yml`.

| Workflow | Runs | When |
|---|---|---|
| `em-sanity.yml` · EM Sanity | `@sanity` | by hand only (some tests post real transactions on UAT) |
| `em-smoke.yml` · EM Smoke | `@smoke` | every push to `main` |
| `em-e2e.yml` · EM E2E | `@e2e` | Mon–Fri 01:00 Vietnam |
| `em-regression.yml` · EM Regression | every test except `@sanity` (`@P1+!@sanity @P2+!@sanity @P3+!@sanity`) | Saturday 01:00 Vietnam |
| `em-tests.yml` · EM tests (manual / Jira) | the tags you type | by hand, or from Jira |

Each suite workflow can also be started by hand. For any tags: Actions → EM tests (manual / Jira) → Run workflow,
type the tags, optionally tick *comment* to post the result on the Jira issues in the tags.
A suite with no tests yet passes without running anything.

## Adding an app

```bash
npm run new-project -- <name>                    # copies projects/_template → projects/<name>
```

Then:

1. Fill in `projects/<name>/PROJECT.md` (system under test, roles, data isolation, safety).
2. `cp projects/<name>/.env.example projects/<name>/.env` and set `BASE_URL` and credentials.
3. Replace the example case in `projects/<name>/docs/test-cases/features/` with the real
   cases, set groups and smoke stages in `test-cases.config.mjs`, run `npm run cases:build -- --app <name>`.
4. Add the app to the table above and to the CI matrix.

## Claude Code

- The `playwright-skill` skill works on any app; it reads `projects/<app>/PROJECT.md` first.
- The `playwright-test` MCP server (used by the agents) serves one app, set by `APP` when
  Claude Code starts; `.mcp.json` defaults it to `em`. For another app: `APP=<name> claude`.
