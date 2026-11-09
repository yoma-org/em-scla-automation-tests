---
name: jira-sanity-test
description: Turn an EM Jira ticket (EM-41, EM-86, …) into a sanity Playwright test, run it on UAT, update its case doc, and optionally post the retest result on Jira. Use when the user says "create test / test run / automate / retest EM-<n>", "Playwright for EM-<n>", or asks to verify a Jira ticket with automation.
---

# Jira ticket → sanity Playwright test

Scope: app `em` only. A ticket's sanity case (`SAN-EM<n>-<nnn>`) is already written in
`projects/em/docs/sanity-test/tickets/{open,fixed}/*.md`; this skill automates it.
For framework rules (POM, fixtures, assertions, no `waitForTimeout`) follow the
`playwright-skill` and `projects/em/PROJECT.md`. Expected results = **Old EM behaviour**;
a difference on New EM is a bug, never a reason to change the expectation.

## 1. Find the case

```bash
cd projects/em
grep -rn "EM-<n>" docs/sanity-test/tickets tests/sanity src
```

- Read the ticket's section (`### EM-<n> · …`): case ID, priority, preconditions, steps,
  expected results, past results and "Not run" notes.
- The doc folder decides the test folder: `tickets/fixed/fixed-<area>.md` →
  `tests/sanity/tickets/fixed/fixed-<area>.spec.ts` (same for `open/`). Traceability fails if they differ.
- If the ticket has no case yet, write the case section first (same layout as its
  neighbours) and ask the user only if the expected result is unclear. Never invent one.
- If the Jira ticket is needed, read it with Atlassian MCP `getJiraIssue`.

## 2. Explore the live page (read-only)

1. Load `mcp__playwright-test__planner_setup_page` with `seedFile: "projects/em/tests/seed.spec.ts"`
   (logged in as admin on UAT).
2. `browser_navigate` to the page in the case, then `browser_snapshot` (target `main` or the
   tabpanel) to get roles and names for the locators.
3. Choose test data that **can show the fix**. An earlier "⛔ Not run" is often caused by bad data
   (e.g. EM-41: the apartment had no AR, so switching currency showed nothing; Estate SEED-Z-001,
   `/estates/1`, has AR). Data that changes on UAT comes from the API at run time (see `@api/areas`).
4. `browser_network_requests` with filter `/api/` shows which gateway calls the page makes.
5. Safety: never click Create / Post / Approve / Delete while exploring. If the test itself has to
   create data, say so in the spec header comment (as `fixed-wallet.spec.ts` does).

## 3. Write the code

- **Page Object**: reuse `projects/em/src/pages/<area>/…` or add one (one class per page/tab, locators
  by role, short header comment with the route). Add new routes to `src/constants/Routes.ts`,
  register the fixture in `src/fixtures/base.fixture.ts`.
- **Spec**: add a `test.describe('Sanity · EM-<n> <short title>')` to the matching spec file
  (create it if missing, copying the header style of the others):

```ts
test('SAN-EM<n>-001 <case title from the doc>',
  sanity({ id: 'SAN-EM<n>-001', priority: 'P2', doc }),   // critical: true for ★ cases
  async ({ page, <pageFixture>: p }) => {
    await test.step('1. <expected result 1>', async () => { … await evidence(page, '01_NEW_<what>'); });
    await test.step('2. <expected result 2>', async () => { … });
  });
```

- One `test.step` per expected result, titled with its number and text.
- Hard `expect` for preconditions and navigation; `expect.soft` for checks, so one run lists every
  failing check.
- Add a precondition guard with a clear message when data could make the test meaningless
  (e.g. "`<apartment>` needs MMK receivables for the switch to show").
- `evidence(page, 'NN_NEW_<what>', [mask…])` screenshots at the key moments; they become the Jira images.
  Every shot gets an info bar at the bottom (`NEW EM · build · page URL · time GMT+7 · EM-<n>`), since
  screenshots have no address bar. Take the shot after the page has finished loading (e.g. wait for a
  control to be enabled), so it does not show a half-loaded form.
  Pass a `mask` locator for any personal data on screen (owner/tenant names, NRC, phone, e.g.
  `apartmentSummaryTab.contactDetails`), so the shot can be posted without manual redaction.
  Look at every image before uploading it.
- `sanity()` adds `@sanity @P<n> @open|@fixed @EM-<n>` and the `tc` / `jira` / `doc` annotations.

## 4. Run and validate

```bash
APP=em npx playwright test --grep SAN-EM<n>-001 --reporter=list     # chromium + firefox
node .claude/skills/playwright-skill/scripts/check-traceability.mjs --app em
```

- A red test on an `open` ticket is expected while the bug is there. Check that it fails **for the
  bug**, not because of a locator or data problem.
- A red test on a `fixed` ticket means a regression or a broken test: find out which before reporting.
- Never add retries or timeouts to make it pass.
- Build under test = "Application version" in the New EM sidebar (e.g. `v0.4.1-62-g27f19494`).

## 5. Update the case doc

In the ticket's section:

1. Under Expected result add
   `**Automated test:** [\`SAN-EM<n>-001\` in <spec>.spec.ts](../../../../tests/sanity/tickets/<folder>/<spec>.spec.ts) · tag \`@sanity\` \`@EM-<n>\` · run \`APP=em npx playwright test --grep SAN-EM<n>-001\` · <data used, read-only or what it creates>`.
2. After the Conclusion add `**Retest (build <build>, <YYYY-MM-DD>, automated): passed | still failing**`
   with a `# | Check | Old EM | New EM | ✅/❌` table, and an "Also noted" line for side findings.
3. Update the Result text of the ticket's row in the file's Summary table **and** in
   `docs/sanity-test/tickets/README.md`.
4. Status changed (open ↔ fixed)? Move the doc section **and** the test to the other folder.

## 6. Jira retest comment (only when the user agrees)

Ask before posting; a comment is visible to the team.

- First line: `VERIFIED_PASSED_<build>` (pass) or `VERIFIED_FAILED_<build>` (fail), as a heading in
  Jira's **Bold green** for a pass and **Bold red** for a fail:
  `<h3><span style="color: #006644">VERIFIED_PASSED_<build></span></h3>` /
  `<h3><span style="color: #bf2600">VERIFIED_FAILED_<build></span></h3>`.
- One short line per step with its result; put each screenshot **directly under its step** with a
  caption, plus the Old EM baseline image if one exists.
- Save the screenshots as `projects/em/docs/sanity-test/tickets/img/EM-<n>/NN_NEW-uat_retest-<date>_<what>.png`
  (take them from the test report attachments in `test-results/` / the HTML report).
- Upload images with Atlassian MCP `uploadAttachmentToJiraIssue` (run its curl → media id), then
  `addOrEditJiraIssueComment` with `contentFormat: html` and
  `<figure data-type="media-single" data-width="60" data-width-type="percentage"><div data-type="media" data-id="…" data-collection="…"></div></figure>`.
- Reporter / assignee defaults: Trang Pham (check the MCP account first).

## 7. Report to the user

Lead with pass/fail and the build. Then: what the test checks (one line per step), how to run it,
files changed (links), side findings, and what was not done (Jira comment, commit).
Do not commit or push unless asked.
