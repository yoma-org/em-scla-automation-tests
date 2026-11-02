# Review and Refactoring

Review:

- architecture;
- locator quality;
- Page Object responsibilities;
- fixture scope;
- setup and cleanup;
- data isolation;
- assertions;
- hardcoded waits;
- duplicated workflows;
- parallel safety;
- traceability (case ID in title + `tc` annotation, correct tags): run
  `scripts/check-traceability.mjs --app <app>` instead of checking by eye;
- role usage (maker and checker are different contexts);
- money assertions (exact decimals, UI vs API vs PDF where the case requires);
- API response quirks handled in one helper as `PROJECT.md` requires (e.g. `em`: encrypted responses read only through `decryptPayload()`);
- `Review` cases tagged `@review` with the open question annotated, never on an invented expectation;
- generator drafts fully refactored (specs import from `@fixtures`; only `auth.setup.ts` and
  fixture files import `@playwright/test`).

Refactor only after preserving behavior.

Avoid moving all common methods into `BasePage`.
Prefer composition and domain-specific helpers.
