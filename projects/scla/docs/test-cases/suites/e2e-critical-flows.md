# E2E Suite — Critical Business Flows ★

[← Test case index](../README.md)

End-to-end scenarios that chain catalogued test cases (linked by ID) into one run with shared data. Hand-written; `npm run cases:build` only counts the `## E2E-nn` headings.

- All flows are **P1 ★**. A failed flow blocks release.
- Flows are independent: each creates its own data.

| Flow | Name | Modules crossed | Automation |
|---|---|---|---|

<!-- Add flows as:

## E2E-01 · <Flow name>

**Why critical:** …

**Setup:** …

| # | Step | Verify | Cases |
|---|---|---|---|
| 1 | … | … | [AUTH-001](../features/01-login.md) |
-->
