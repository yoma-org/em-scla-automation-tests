# Debugging and Healing

Use:

```bash
npx playwright test --debug
npx playwright test --ui
npx playwright show-trace <trace.zip>
```

Healing workflow:

1. reproduce failure;
2. inspect trace, screenshot, logs, and network;
3. classify application, automation, environment, data, or requirement issue
   (check the known-defects file named in `PROJECT.md` — for `em`, `docs/ems-knowledge/GOTCHAS.md` — and `docs/test-cases/source-issues.md` first);
4. apply the smallest safe fix;
5. rerun targeted test;
6. rerun affected suite;
7. report evidence.

Do not blindly replace locators or increase timeouts.

When the `playwright-test-healer` agent fixes a locator, move the fix into the Page or
Component Object; specs keep no inline locators.

Never "heal" a money assertion by changing the expected amount to match what the app shows.
A wrong amount is an application or requirement issue: report it, and mark the test
`test.fail()` only when the defect is confirmed and tracked.
