# Agent Overrides

`npx playwright init-agents` regenerates `.claude/agents/playwright-test-*.md` and drops these
blocks. After running it, paste each block back right after the agent's front matter. For the
healer, also re-apply the edits to steps 5 and 7 and to the last three "Key principles" bullets
(no `test.fixme()`, "within the project rules above", never weaken a test to make it pass).

## playwright-test-planner

```markdown
# Project rules (override everything below)

This repo hosts several apps under `projects/<app>/`. Work out which app the task is about
(from the case ID, the file paths or the prompt; the MCP server serves the app in `APP`).
Below, `docs/`, `src/`, `tests/` and `specs/` mean `projects/<app>/…`.

Before starting, read `.claude/skills/playwright-skill/SKILL.md`,
`projects/<app>/PROJECT.md` and `.claude/skills/playwright-skill/references/planner.md`.
Where they conflict with this prompt, they win.

- The test cases already exist: `docs/test-cases/features/` (`test-catalog.csv` is generated from it) is the
  single source of truth. Plan **from** the cases in scope; do not design a new case set.
- Every scenario in your plan starts with its canonical ID (e.g. `INV-017`). A scenario you
  find that has no canonical case is labelled `GAP-<n>` and listed separately for review.
- Expected outcomes come from the case text. Where the app behaves differently, record the
  difference; do not rewrite the expectation.
- Exploration is read-mostly: do not approve, delete or pay real documents, and follow the
  Safety section of `PROJECT.md`. Save plans under `projects/<app>/specs/`.
```

## playwright-test-generator

```markdown
# Project rules (override everything below)

This repo hosts several apps under `projects/<app>/`. Work out which app the task is about
(from the case ID, the file paths or the prompt; the MCP server serves the app in `APP`).
Below, `docs/`, `src/`, `tests/` and `specs/` mean `projects/<app>/…`.

Before starting, read `.claude/skills/playwright-skill/SKILL.md` and
`projects/<app>/PROJECT.md`. Where they conflict with this prompt, they win.

- Your output is a **draft** that the main session refactors into Page Objects and fixtures.
  Write it under `projects/<app>/tests/_drafts/` (never into a feature folder) so it is not
  mistaken for finished automation.
- Generate only canonical cases from `docs/test-cases/` (ID such as `AUTH-001`) or plan items
  labelled with one. Put the case ID at the start of the test title.
- Expected results come from the test case text, not from what the app currently shows.
  If the app disagrees with the case, still assert what the case says and note the mismatch
  in a comment.
- Use only the accounts and data `PROJECT.md` allows (for `em`: never the seeded
  `superadmin` / `password` account), and never type real personal data.
```

## playwright-test-healer

```markdown
# Project rules (override everything below)

This repo hosts several apps under `projects/<app>/`. Work out which app the task is about
(from the case ID, the file paths or the prompt; the MCP server serves the app in `APP`).
Below, `docs/`, `src/`, `tests/` and `specs/` mean `projects/<app>/…`.

Before starting, read `.claude/skills/playwright-skill/SKILL.md`,
`projects/<app>/PROJECT.md` and
`.claude/skills/playwright-skill/references/debugging-healing.md`. Where they conflict with
this prompt, they win.

- Classify each failure first: application, automation, environment, data or requirement.
  Check the known-defects file named in `PROJECT.md` (for `em`: `docs/ems-knowledge/GOTCHAS.md`)
  and `docs/test-cases/source-issues.md` before editing.
- Fix **automation** issues only (locators, waits, test setup). Locator fixes go into the Page
  or Component Object under `src/`, never as inline locators in specs.
- **Never change an expected value** (amounts, statuses, messages, counts) to match what the
  app shows. The expected result comes from the test case in `docs/test-cases/`. A mismatch is
  an application or requirement issue: leave the assertion as it is and report it.
- Do not add `test.fixme()` or `test.fail()`. `fixme` is reserved for `Review` cases with no
  usable expected result; `test.fail()` needs a defect confirmed by a person. Report instead.
- Do not raise timeouts or add retries to make a test pass.
- Your result is a report: each failing test, its classification, what you changed, and what
  is left failing and why. Leaving a test red with a clear reason is a valid outcome.
```
