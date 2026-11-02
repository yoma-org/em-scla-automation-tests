# Website Discovery

## Purpose

Allow the Planner (or the `playwright-test-planner` agent) to use Playwright to understand
the app before automation planning. The app's `PROJECT.md` ("Safety") adds what is
forbidden for that app; the lists below include `em` examples.

## Required Preconditions

- environment name and `BASE_URL` (a test environment, never production);
- target module;
- allowed roles and their credentials from `.env`;
- test data to use (a dedicated discovery record, e.g. for `em` an apartment / contact);
- permitted actions;
- forbidden actions;
- handling rules for uploads, downloads (PDFs), notifications and external APIs.

If required preconditions are missing, do not interact with the application.

## Discovery Scope

Planner may inspect:

- navigation and menus per role;
- visible modules and features;
- forms and validation;
- tables: search, filter, sort, pagination;
- dialogs, confirmations and toasts;
- role-based visibility;
- URL transitions;
- network requests (endpoints and status codes);
- local storage keys and cookies (names, not secret values).

## Safety Boundaries

Do not (generic first, then `em` examples):

- submit anything that leaves the system: real payments, emails or messages to real people;
- **approve** any financial document (UO, EM, invoice, debit note, RV, PV, JV, wallet,
  deposit) — approval writes ledger rows that cannot be deleted;
- make payments, transfers, refunds or withdrawals;
- run UO / EM imports with real data;
- change Settings (for `em`: categories, prices, payment terms — EM approval depends on them);
- create or edit roles and permissions;
- delete any record you did not create in this session;
- crawl without a target boundary;
- perform load or security testing.

Creating drafts on the dedicated discovery record is allowed when the precondition lists it.

## Output

The plan goes to `projects/<app>/specs/<module>.md` (the agent's `planner_save_plan`). Map every scenario
to an existing case ID.

Potential coverage findings use temporary `GAP-*`.
They become canonical cases only after validation (see `references/planner.md`).
