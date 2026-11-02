# Estate Management System — Business Summary

> Yoma Land · Zeya Labs
>
> How the business actually works — what EM charges, collects and reports, and why it is being rebuilt.

| | |
|---|---|
| **Prepared for** | EM project onboarding |
| **Date** | 10 Oct 2026 |
| **Sources** | BRD, PRD, gap review, user manual, ER diagram, 2 screenshot decks |
| **Online version** | https://claude.ai/artifact/1ssKrn9ob7SPpb65pxn8MX |

## Contents

1. [What EM is](#01-what-em-is)
2. [Two estates, one system](#02-two-estates-one-system)
3. [Who uses it](#03-who-uses-it)
4. [The revenue cycle](#04-the-revenue-cycle)
5. [The approval backbone](#05-the-approval-backbone)
6. [What each module does](#06-what-each-module-does)
7. [Business rules that matter](#07-business-rules-that-matter)
8. [Why the rebuild exists](#08-why-the-rebuild-exists)
9. [The critical path](#09-the-critical-path)
10. [Unanswered business questions](#10-unanswered-business-questions)

---

## 01. What EM is

> **EM is the system of financial record for Yoma Land's residential estates. It decides what every apartment owes each month, records what they pay, and reports the gap.**

The business it runs is recurring property billing. Residents in an estate owe two kinds of charge: a fixed **estate management fee** for the upkeep of the development, and a variable **utility charge** based on metered consumption. EM calculates both, turns them into invoices and debit notes, collects cash against those documents, and tracks what remains outstanding by apartment, by contact and by currency.

Everything else in the system supports that loop: apartments and contacts are the master records, cash and bank accounts are where money lands, approvals are the control that stops anything posting unchecked, and reports are how Finance proves the numbers.

| Metric | Count |
|---|---|
| Documented features | 47 |
| Business workflows | 13 |
| Approval types | 8 |
| Report sections | 7 |
| External API scopes | 10 |
| Role families | ~18 |

## 02. Two estates, one system

EM is not one installation. The documentation set contains two distinct deployments, each with its own screenshot pack, and they are not the same product surface.

| Deployment | Business | Scope in evidence |
|---|---|---|
| **TED EMS** | Thanlyin Estate Development | The full system — utility operations, meter reset, bulk statements, AR snapshots, apartment wallets and deposits, bulk import. 120 screens captured. |
| **Estella EMS** | Yoma Land Development | A reduced surface — billing, cash, accounts, apartments, basic reporting. No utility operations, no snapshots, no wallet or deposit ledgers. 31 screens captured. |

This matters commercially: the two estates run different charging models. Thanlyin bills metered utilities and holds resident wallet and deposit balances; Estella appears not to. Any statement about "how EM works" is really a statement about one of these two.

> [!WARNING]
> **Contradicts a stated assumption.** The BRD records assumption A-09, *"a single production tenant is in use,"* and notes that if it is false, multi-tenancy adds architectural scope. The evidence in the same document set shows two. This needs confirming before scope and cost are fixed.

## 03. Who uses it

Access is governed by a configurable permission matrix — each role is granted *menu, view, create, edit, approve* and *delete* rights per module. The business consequence is a deliberate maker–checker split: the people who enter financial documents are generally not the people who release them.

| Role | What they do for the business | Limit |
|---|---|---|
| Cashier Operator | Records receipts as residents pay; prints evidence | Cannot approve own entries |
| Cashier Manager | Reviews and releases cash movements | Accountable for release |
| Finance Operator | Raises invoices, debit notes, outflows, transfers | Limited approval rights |
| Finance Manager | Approves documents and their accounting effects | Accountable for posted results |
| Credit Control | Chases overdue balances; issues statements in bulk | Depends on aging accuracy |
| Utility Operator | Enters meter readings per apartment | Pricing configured elsewhere |
| Utility Manager | Validates readings before charges post | Approval creates an invoice |
| Estate Ops Operator | Raises recurring fee batches each period | Approval creates debit notes |
| Management | Oversight of position and exposure | Read-only |
| Auditor | Evidence of control and traceability | Must not alter data |
| IT | Administers access and configuration | Should not transact |
| External system | Scoped programmatic access, no interface | Key and scope per request |

## 04. The revenue cycle

Read top to bottom, this is the business in one pass.

### Charge

Each period, two charge streams are raised. Estate Management produces a batch of recurring fees — a monthly fee multiplied by a number of months, per apartment. Utility Operations produces metered charges, calculated from consumption against configured pricing. Both start life as **drafts** and affect nothing until approved.

### Bill

On approval, those batches become real accounting documents: an invoice for utilities, a debit note for estate fees. Document numbers are assigned at the moment of approval, in an unbroken series — not when the draft was created. Credit notes reduce a position where a charge was wrong or a concession was given.

### Collect

Residents pay, and a cashier records the receipt against a cash or bank account. The receipt is then **allocated** against specific open invoices and debit notes, which is what actually reduces the outstanding balance. Where money arrives and the payer cannot be identified, it is held as an **unknown receipt** and remains visibly unresolved until someone assigns it — so unallocated cash is never quietly absorbed.

### Report

Accounts Receivable aggregates the position by contact, apartment and currency, split into current and overdue aging buckets. Credit Control issues statements of account in bulk, filtered by zone, building, currency and month. A snapshot of the AR position is captured daily, giving a history of aging that cannot be reconstructed after the fact.

### Hold

Apartments also carry two balances that sit outside receivables: a **wallet** that residents top up and draw down, and a **deposit** held against the unit. Both are tracked as separate ledgers and do not move AR directly.

## 05. The approval backbone

> **Nothing posts to the accounts without passing approval. This single control is the system's defining business feature.**

Business modules raise typed approval records when a draft is submitted. These collect in one approval queue with per-type counters. When an approver releases a draft, the status change *and* its accounting consequence commit together in a single transaction — if the side effect fails, the approval rolls back, so the business never ends up with a half-applied financial event.

| Draft | Input | On approve |
|---|---|---|
| Utility batch | Meter readings × configured pricing | Generates the related **invoice**, with matching lines and totals |
| Estate fee batch | Monthly fee × number of months | Generates the related **debit note** charges |
| Invoice / debit note | Multi-line, raised against apartment or contact | Assigns the **document number**; appears in the register and in AR |
| Credit note | Correction or concession | Reduces the **outstanding position** of its target |
| Cash transfer | Between cash and bank accounts | Posts **both legs atomically** — neither side can post alone |
| Cash outflow | Payment voucher to a payee | Updates the **account ledger**; voucher becomes printable |
| Meter reset | Meter rollover or replacement | Becomes the **baseline** for the next utility reading |
| Deposit invoice | Raised in the apartment context | Creates the **deposit document** on the apartment profile |

Rejection is the mirror image: status changes, and no accounting effect of any kind is produced.

## 06. What each module does

| Module | Business purpose |
|---|---|
| **Dashboard** | Position at a glance — receivables, cash and bank, net cash, wallet and deposit totals, held separately per currency. |
| **Accounts Receivable** | Who owes what. Balances by contact and apartment, aging into current and overdue, filterable by currency and business category. |
| **Bulk SOA** | Statements of account generated for every qualifying apartment at once, selected by zone, building, currency and month. The collections workhorse. |
| **AR Snapshots** | Daily capture of the receivables position per currency, viewable by month and exportable. The only record of how aging moved over time. |
| **Invoices / Debit Notes** | The billing documents themselves — multi-line entry, draft, approval, numbering, register and printable detail. |
| **Cash Received** | Money in. Customer receipts with allocation, funding receipts that bypass customer AR, and unknown receipts for unidentified cash. |
| **Cash Outflow** | Money out. Payment vouchers with payee, category, currency and narrative, approved before they touch the ledger. |
| **Cash Transfer** | Movement between the organisation's own accounts, with currencies derived server-side from the accounts rather than chosen by the user. |
| **UO** | Utility Operations. Meter readings per apartment, consumption and charge calculated from configured pricing. |
| **Meter Reset** | Handles meter rollover or physical replacement so consumption is not miscalculated across the change. |
| **EM** | Estate Management fee batches — the recurring service charge, per apartment, per period. |
| **Apartments** | The unit master record: location, zone, building, occupant, fees, ledger, outstanding balance, wallet and deposit. |
| **Contacts** | The person or company master record: identity, communication details, related apartments, statements and balances. |
| **Cash & Bank Accounts** | Where money is held. Balances by currency and account type, with opening balances and payment methods. |
| **Reports** | Seven sections: account statement, invoices, transactions, cash received, cash outflow, credit note, assigned unknown received. |
| **Approvals** | The single queue where every pending financial decision lands, filtered by type and status. |
| **Settings** | The configured data that determines money: utility pricing, income and expense categories, account classification, currencies, locations, zones, buildings — plus staff, roles and API clients. |
| **External API** | Ten scopes exposing contacts, apartments, invoices, summaries, statements, wallets, deposits, receipts, payments and locations to other systems, by issued key. |

## 07. Business rules that matter

These come from the operator manual and are the rules the business actually runs on.

### Utility readings

- Three meters are read per apartment: **Electricity (YESC)** from the grid supply, **Electricity (Generator)** for backup power, and **Treated Water**.
- A current reading may never be lower than the previous reading — it must be greater than or equal.
- The first reading for an apartment is keyed in by the operator. After that, the previous value is carried forward automatically from the last record.
- An apartment that already has an open UO or meter-reset draft cannot have another created. One open charge per unit at a time.

### Estate management fees

- A batch is a monthly fee multiplied by a number of months, between **1 and 12**.
- The monthly fee is capped at nine digits.
- The first batch for an apartment takes a user-chosen start date. Afterwards the system proposes the day after the last batch ended, so periods do not overlap or leave gaps. Future-dated batches are permitted.
- As with utilities, an apartment with an open EM draft cannot have a second one raised.
- While still a draft, the monthly fee and number of months remain editable. After approval, they do not.

### Money

- Balances are held per currency and are never aggregated across currencies without an explicit stated conversion.
- Transfer currencies are derived from the selected accounts on the server; the client cannot override them.
- Allocation is what reduces a balance — recording a receipt alone does not.
- Soft-deleted apartments, contacts and documents are excluded from every list, search and report.

One practical note: the operator manual is written in **English and Burmese**, and the detailed field rules appear in the Burmese text. Anyone writing test cases or training material from it needs to read both.

## 08. Why the rebuild exists

> **The system works. The problem is that it cannot be changed safely or reproduced reliably — and nobody can currently prove what it does.**

The BRD states the business problem plainly: the organisation depends on EM for receivables, cash control and charge generation, yet cannot demonstrate what the production system does, cannot change it safely, and cannot prove its financial records are protected from unapproved or fabricated entries.

Three consequences follow. There is **no trusted specification** to rebuild against. There is **no safe change mechanism** — no migrations, no documented pipeline, no rollback. And the **financial and access controls are unverified** rather than evidenced.

The first deliverable is therefore not code. It is an agreed, evidence-backed statement of what production actually does, delivered through an AWS gap review. Work then runs in phases: baseline reconciliation, then urgent production hygiene fixes that do not wait for the rebuild, then the platform foundation, then rebuild to parity, then quality and reach, then cutover.

> [!WARNING]
> **Two things the business should know now**
>
> **The gap review has not been run.** It exists as a blank template — every row unchecked. Until it is executed, the BRD and PRD rest on assumptions their own authors have flagged as unverified.
>
> **The documented stack and the supplied schema disagree.** The requirements describe a React, Node and PostgreSQL system with no migrations. The entity diagram in the same folder is a Laravel and MySQL application that does have a migrations table. These look like two different codebases. Which one is production determines what "parity" even means.

A third point is worth flagging for scope: the Thanlyin deployment has bulk **import** screens for both utility and estate-fee batches. Bulk import directly into charge-generating modules appears in no requirement and in no feature inventory. Under the BRD's own rules, undocumented capability found in production is unbudgeted scope requiring change control.

## 09. The critical path

> **One chain carries the whole business: a charge is calculated, approved into a real document, paid against, and reported. If it holds, the system earns its keep. If any link breaks, money is wrong.**

This is the path to verify first, and the one to re-run before every release. It touches pricing configuration, master data, the draft and approval engine, side-effect generation, document numbering, receivables, allocation, reporting and the daily snapshot — most of the system, in thirteen steps.

| # | Phase | Step | Screen | What must be true |
|---|---|---|---|---|
| 01 | Prepare | Confirm the utility rate | `/settings/uo-pricing` | Rate recorded — the expected charge cannot be computed without it |
| 02 | Prepare | Confirm the receiving account | `/settings/cash-bank-accounts` | Account enabled, with its currency and opening balance |
| 03 | Prepare | Create a contact | `/contacts/new` | Saves with validation on required fields |
| 04 | Prepare | Create an apartment, linked to that contact | `/apartments/new` | Zone, building and monthly fee set |
| 05 | Charge | Raise a utility draft | `/uo/new` | Previous and current values for all three meters; draft saves |
| 06 | Charge | Draft reaches the queue | `/approvals` | Appears with the correct type; header counter increments by one |
| 07 | Charge | **Approve** | `/approvals` | **An invoice is generated**, with lines and totals matching the batch |
| 08 | Charge | Check numbering | `/invoices/:id` | Number assigned *at approval*, next in series, no gap or duplicate |
| 09 | Collect | Check receivables | `/ar` | Balance rises by the invoice total, in the correct currency bucket |
| 10 | Collect | Record a payment | `/cash-received` | Receipt against the bank account, **allocated to that invoice** |
| 11 | Collect | Check the reduction | `/invoices/:id` · `/ar` | Outstanding falls by exactly the allocated amount |
| 12 | Report | Check the statement | `/apartments/:id` | Charge and payment both appear; closing balance correct |
| 13 | Report | Check the snapshot | `/ar/snapshots` | The next daily snapshot reflects the new position |

### The calculation to prove at step 07

For each of **Electricity (YESC)**, **Electricity (Generator)** and **Treated Water** separately:

```
consumption = current − previous
charge      = consumption × configured rate
```

This is where incorrect money originates, and it fails silently — a wrongly-priced invoice looks entirely valid on screen.

> [!IMPORTANT]
> **Precondition.** This path runs on **TED** only. Estella has no utility operations, no snapshots and no wallet or deposit ledgers, so the run will stop at step 05 for reasons that are not defects. Estella needs its own shorter path, starting from a manually raised invoice at step 07.

### The critical variants

Eight flows that the golden path does not cover, ordered by what breaks and how loudly.

1. **Estate fee batch → debit note.** The same shape as the golden path with a different generator: monthly fee × number of months produces a debit note on approval. Run it as a parallel track from step 05. The documents rate this and utility on-charge jointly as the highest-value checks in the system.
2. **Approval rollback.** Induce a failure in the side effect and confirm the approval rolls back — the draft stays unapproved and no partial document exists. This is what produces half-applied financial events, and the gap review asks for production to be inspected for ones that have already happened.
3. **Double and concurrent approval.** Approve the same draft twice simultaneously. Exactly one transition may occur. Two invoices from one batch means a resident is billed twice.
4. **Cash transfer, both legs.** Approve a transfer and confirm the source decreased and the destination increased; neither may post alone. Separately, attempt to override the transfer currency from the client — it must be derived server-side from the accounts.
5. **Rejection produces nothing.** Reject a draft of each of the eight types and confirm zero accounting effect: no document, no posting, no ledger movement. Easy to implement wrongly, easy to miss in testing.
6. **Unknown receipt resolution.** Record cash with no identified payer, confirm it stays visibly unresolved, then assign it and confirm the allocation applies, the original record remains traceable, and it appears in the Assigned Unknown Received report. This is where cash goes missing in practice.
7. **Meter reset baseline.** Reset a meter, then take the next reading, and confirm consumption calculates from the reset value rather than the pre-reset value. Getting this wrong once bills a resident for the meter's entire history.
8. **Server-side permission enforcement.** Not a business flow, but the highest-leverage automation target: call protected endpoints directly using an under-privileged session, across every module and all six actions. The gap review states the principle plainly — hiding a control in the interface is not an access control.

> [!WARNING]
> **Two blockers before expected results can be written**
>
> **Aging bucket boundaries** are undefined, so the overdue split at step 09 has no expected value. **Monetary precision and rounding rules** are undefined, so the charge at step 07 may differ in the last decimal with no way to tell a defect from a tolerance. Both belong to Finance and appear in the next section.
>
> One further confirmation is needed before automation is worth building: which codebase is production. Routes, selectors and API shapes differ between the two candidate stacks.

## 10. Unanswered business questions

These are open in the documents themselves, and each one blocks a decision rather than merely a detail. They belong to the business, not to the delivery team.

| Question | Owner | What it blocks |
|---|---|---|
| What exactly are the AR aging bucket boundaries? | Finance | Every overdue figure and collections decision |
| Is maker–checker separation mandatory, and for which document types? | Finance + Audit | Segregation of duties; role design |
| What triggers the daily AR snapshot, and is the history complete? | IT | Aging history that cannot be rebuilt if lost |
| What are the exact permissions of each production role? | Operations + IT | Access governance; go-live regression risk |
| What monetary precision and rounding rules apply? | Finance | Whether charges reconcile to the cent |
| What retention applies to financial documents and resident personal data? | Finance + Compliance | Data protection obligations |
| Who are the external API consumers, and are their contracts still needed? | IT | Integration scope; standing data exposure |
| Which devices and viewports must be supported, for which roles? | Operations | Whether on-site staff can work at all |
| Is a parallel run required, or is an overlap reconciliation period enough? | Finance | Cutover approach and cost |
| What is the approved cutover window given the financial calendar? | Finance | Go-live date |

A further gap sits underneath several of these. The requirements call for an immutable audit trail of every financial state change, approval decision, role change and credential change. The supplied schema has no audit table — only `created_by`, `updated_by`, `approved_by` and timestamp columns, which record the latest state rather than a history, and can be overwritten. As things stand, the audit requirement cannot be met without new structure.

---

*Compiled from the EMS document set: `EMS_Rebuild_BRD.md`, `EMS_Rebuild_PRD.md`, `YL_EM_Replit.md` (gap review), the Estate Management System user manual, the `EM Software` entity diagram, and the TED and Estella screenshot packs. Points marked as contradictions arise from reading those documents against one another and are not stated in any single source.*
