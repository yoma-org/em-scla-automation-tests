# Gotchas, risks and known issues

These come from reading the code and git history. Severity is my own judgement. Check each
one against production behaviour before acting on it.

## 🔴 High: money correctness

1. **The partner API marks every payment as PAID, even partial ones.**
   `estate-billing-api/app/Services/PaymentCashInflowService.php` sets
   `status = PAID` without comparing the amount to the due amount. The back office
   (`MakePaymentOperation`) correctly uses `PARTIALLY_PAID`. A partial payment through the partner
   API therefore closes the invoice while `paid_amount < grand_total`.

2. **The partner API's invoice validation is broken.**
   `MakePaymentService::makePayment`: `if (!$invoice && $invoice->due_amount === $data['amount'])`
   - when the invoice code doesn't exist, it dereferences `null` (a 500 error instead of a clean error)
   - it never checks that `amount <= due amount`, so overpayment isn't routed to the wallet
   - nothing makes the call idempotent, so a partner retry creates a second payment

3. **Two separate payment implementations.** `estate-billing-api` copies the models, enums and code
   generators instead of sharing them with `em-backend`. The two have already drifted apart: the
   billing API writes `estate_balances` as "latest balance − amount" and doesn't handle backdating.

4. **Running-balance drift and duplicate snapshots.** In September 2026 the team found duplicate
   `account_balances` rows caused by **races and re-run approvals** on cash transfers and cash outflows.
   Fixes so far:
   - `lockForUpdate` added to the cash transfer and cash outflow approvals
   - a unique constraint on `account_balances(account_id, cash_transaction_id)`
   - `php artisan reconcile:account-balance-duplicates [--keep] [--type]`
   - `php artisan reconcile:cash-transfer {code} [--dry-run]`

   The same backdated-rewrite pattern exists for estate, wallet and deposit balances,
   **and those ledgers haven't been fixed or reconciled yet**.

5. **Invoice numbering has no lock.** `Traits/GenerateInvoiceCode.php` reads the "last record" without
   `lockForUpdate`, while voucher numbering (`GenerateCodeNumber`) does lock. Bulk-approving UO or EM
   items at the same time can collide on the unique `invoices.code` and fail.

6. **Payments are matched to invoices by text.** `MakePaymentOperation::prepareCashInflowData` finds
   the transaction for an invoice with `str_contains($transaction->description, $invoice->code)`.
   An `invoice_id` column was added to `cash_transactions` in March 2024 and should be used instead.

## 🟠 Medium: hardcoded business config

- The UO and EM invoices are **always MMK**.
- EM invoices: category is looked up by the string `'Estate Mgmt Fees'`, and the payment term by
  `days_until_due = 45`. Renaming the category in Settings breaks EM approval.
- The number sequences start from **env vars** (`RV_CODE`, `INV_COREF_CODE`, `*_CURRENT_MONTH_CODE`, …).
  A wrong `.env` in a new environment restarts numbering or produces duplicates.
- UO meter rules (one import per month, same-month reading date, meter reset) were patched
  over and over between April and July 2026. Expect edge cases around meter resets.

## 🟡 Security

- The **response "encryption"** uses a key that ships in the frontend bundle, so it only obscures the
  data and doesn't protect it. Don't rely on it.
- `GET /v1/get_token/{auth}` puts the API key **in the URL**, where it ends up in access logs and
  proxy logs. Prefer `POST /v2/get_token`.
- `em-web/README` documents a default `superadmin` / `password` login from the seeders. Make sure
  it isn't active in any deployed environment.
- AWS account and ECR IDs are in `.gitlab-ci.yml`. That's normal, but be aware of it.

## ⚪ Operational traps

- `php artisan ems:run` **wipes the database** (`migrate:fresh --seed`).
- When modules are toggled from the DB (`TOGGLE_APP_SERVICES=true`) and something looks
  unregistered, run `php artisan cache:clear`.
- Migrations are spread across `app/Services/*/database/migrations`, so `database/migrations`
  only has the framework tables.
- Columns renamed from the legacy system: `old_co_ref` and `is_data_migrated` / `is_imported` on
  utility operations. These link to the *EMS Data Migration* repo, which wasn't scanned.
- The billing API has a stray file, `Enums/DocumentStatusEnum copy.php`.

## Open questions for whoever knows the history

- Who uses `estate-billing-api` in production? Is it a bank, a kiosk or a resident app? Partial
  payments through it are a live bug if it's used at all.
- What is the relationship to "Standard EM"? Is this a client fork of a product?
- Were the estate, wallet and deposit balance ledgers ever reconciled the way `account_balances` was?
