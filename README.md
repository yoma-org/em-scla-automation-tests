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
