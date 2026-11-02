# Playwright Planner

All paths are inside the app folder `projects/<app>/`. The example rows come from the `em` app.

## Inputs

- canonical cases: `docs/test-cases/features/**/*.md` (the only source) and `docs/test-cases/test-catalog.csv`
  (generated from them; handy for filtering);
- E2E flows: `docs/test-cases/suites/e2e-critical-flows.md`;
- open questions: `docs/test-cases/source-issues.md`;
- app rules and business context: `PROJECT.md` and the knowledge docs it points to;
- existing automation under `tests/` and `src/`;
- optional Website Discovery evidence (plans in `specs/`).

## Responsibilities

1. review the canonical cases in scope (filter the catalog by feature, suite or priority);
2. inspect existing automation (search `tests/` for the IDs);
3. identify gaps, duplicates, blockers, `Review` cases and manual-only cases;
4. validate gaps;
5. update canonical artifacts;
6. create implementation plan.

## Gaps

- A new scenario found by the planner or the `playwright-test-planner` agent is a `GAP-<n>`
  in the plan under `specs/`.
- It becomes a canonical case only after validation: add it to the feature file with the
  next free `<FEATURE>-<nnn>` ID (template and rules: "Adding or changing test cases" in
  `docs/test-cases/README.md`), then run `npm run cases:build -- --app <app>`. Never edit `test-catalog.csv`,
  the suites or the generated blocks by hand, and never renumber existing IDs.

## Planner Output Example

| Case ID | Layer | Roles | Files | Fixtures | Data | Mock | Tags | Complexity |
|---|---|---|---|---|---|---|---|---|
| AUTH-001 | UI | admin | LoginPage, tests/auth/login.spec.ts | loginPage, dashboardPage | env admin user | No | @smoke @P1 @critical | Low |
| UO-007 | UI+API | uo-operator → uo-manager | UoPage, UoApi, tests/uo/uo.spec.ts | asRole, apartment | fresh apartment | No | @smoke @P1 @critical | Medium |
| CONC-001 | API | 2 × cashier-operator | PaymentsApi, tests/payment/concurrency.spec.ts | apiAs, approvedInvoice | fresh invoice, base + variant rows | No | @P1 @critical | High |

Planner never owns a separate test case set. `specs/` holds plans, not cases.
