# EMS: knowledge base (old EM codebase)

These notes come from scanning `em-backend`, `em-web` and `estate-billing-api` in
`~/Documents/Projects/EM/Old EM codebase` (October 2026). Two projects in the GitLab group were
**not** in the folder and are not covered: *EMS Data Migration* and *Standard EM IaC Terraform*.

## What the system is

EMS is an **Estate Management System** for a residential estate (condo/apartment complex) in
**Myanmar**. It uses MMK as the main currency, USD as a secondary one, and NRC identity numbers.
In practice it is a **property billing and receivables ledger**, built around these activities:

- billing apartments for **utilities** (meter readings → "UO" invoices) and **estate management fees**
  ("EM" invoices), plus ad-hoc invoices and debit notes
- recording **payments** against those invoices, including partial payments, cheques and
  "unknown" receipts
- an **apartment wallet** (prepaid credit) and a **security deposit** for each apartment
- **cash/bank accounts**, transfers between them, and cash outflows
- **maker-checker approval** on almost every money-moving document
- reporting: statement of account (SOA), AR aging, account statements, and PDFs of each document

## The repos

| Repo | What it is | Stack | Activity |
|---|---|---|---|
| `em-backend` | Main back-office API. All business logic lives here. | Laravel 10, PHP 8.1, Lucid architecture, Passport, Horizon/Redis, MySQL | 1,743 commits, May 2023 → Sep 2026 |
| `em-web` | Back-office admin portal for staff | Vue 3, Pinia, PrimeVue (Sakai), CASL, Vite | 1,600 commits, May 2023 → 2026 |
| `estate-billing-api` | Small **external partner API** for looking up invoices and posting payments (e.g. a bank, payment kiosk or resident app). Uses the **same database**. | Laravel 10, plain Services, Passport, l5-swagger | 372 commits, Mar 2024 → Aug 2025 |

## Read these notes in this order

1. [DOMAIN.md](DOMAIN.md): glossary, entities and how they relate
2. [MONEY_FLOWS.md](MONEY_FLOWS.md): how invoices, payments, wallet, deposit and balances work
3. [ARCHITECTURE.md](ARCHITECTURE.md): code layout, auth, deployment, environments
4. [NUMBERS.md](NUMBERS.md): **the formula and source behind every number on screen** (use it
   to answer "why does the app show X?")
5. [GOTCHAS.md](GOTCHAS.md): known bugs, risks and traps (**read this before changing anything
   to do with money**)

## Reading order for the code

1. `em-backend/config/core.php`: the list of services (modules)
2. `em-backend/app/Enums/`: the domain vocabulary
3. `em-backend/app/Services/*/database/migrations/`: the schema. Each module has its own
   migrations, and only the framework tables are in `database/migrations`.
4. `em-backend/app/Services/{UtilityOperation,EstateManagement,Invoice,CashInflow,Wallet}/Operations/`:
   the core business flows
5. `estate-billing-api/routes/api.php` + `app/Services/MakePaymentService.php`
6. `em-web/src/modules/`: one folder per screen group, which shows how staff actually use the system
