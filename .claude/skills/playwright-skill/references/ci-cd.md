# CI/CD

One job per app (a matrix over `projects/<app>/`, `_template` excluded). Each app deploys on
its own schedule, so its gates run on its own triggers; run only the apps whose
`projects/<app>/` or `shared/` changed on a merge request.

Recommended steps:

```yaml
strategy:
  matrix:
    app: [em, scla]      # add each app
env:
  APP: ${{ matrix.app }}
steps:
  - run: npm ci
  - run: npx playwright install --with-deps chromium
  - run: npm run typecheck
  - run: npm run lint
  - run: npm run cases:check -- --app $APP
  - run: node .claude/skills/playwright-skill/scripts/check-traceability.mjs --app $APP
  - run: npx playwright test --grep @smoke --grep-invert @review   # every deploy (blocking)
  - run: npx playwright test --grep @P1 --grep-invert @review      # every merge / nightly (blocking)
  - run: npx playwright test --grep @review                        # non-blocking report (continue-on-error)
  - run: npx playwright test                                       # before production release
```

Environment values and credentials come from CI secret variables, never from the repo. Use
separate secret sets per app (`BASE_URL`, roles…); in CI they are plain env vars, so no
`projects/<app>/.env` file is needed.

Publish:

- HTML report (`projects/<app>/playwright-report/`);
- traces for failures;
- screenshots and videos when retained;
- test results required by the CI platform (JUnit if needed).

Use sharding only when test isolation and data strategy support it. Tests in the serial
global-totals project must not be sharded.
