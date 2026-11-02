# Where every number in the app comes from

Use this file to answer **"why does the app show X?"** For each figure it gives the formula, the
source table and columns, what's included or excluded, and the code location. Paths are in
`em-backend/app/` unless noted otherwise.

General rules:
- Money is `DECIMAL(25,2)`. Line math runs at 3 decimals, and totals are rounded to 2 (see §1.4).
- Every figure is calculated **per currency** (MMK and USD are never added together).
- **"Outstanding" always means `grand_total − paid_amount`** for invoices whose status is not
  DRAFT, PAID or DELETED. Deposit invoices (DI) are a separate table and are **never** included in
  AR.
- An approved invoice can't be deleted (only drafts can). Approved invoices are corrected with credit notes,
  debit notes or wallet movements.

---

## 1. Invoice amounts

### 1.1 Manual invoice and debit note lines
`Domains/Invoice/Jobs/CalculateTaxAndDiscountInvoiceItemJob.php`, `Services/Invoice/Operations/CreateInvoiceOperation.php`

The discount **type** is set once per invoice (PERCENTAGE or FIXED_AMOUNT). The discount **value**
is set per line. A fixed-amount discount applies **per unit**.

| Field | Formula |
|---|---|
| `discount_unit_price` | PERCENTAGE: `unit_price − unit_price × value/100`. FIXED: `unit_price − value` |
| line `total` | `quantity × discount_unit_price`. **Excludes tax.** |
| `tax_amount` (EXCLUSIVE) | `discount_unit_price × rate/100 × quantity` (tax is on the discounted price) |
| `tax_amount` (INCLUSIVE) | the entered price is treated as gross: `net unit_price = gross / (1 + rate/100)` (3 dp), then `tax = quantity × (gross − net)` |
| `tax_amount` (NO_TAX) | 0 |

### 1.2 Invoice totals
| Field | Formula |
|---|---|
| `gross_total` | Σ `quantity × unit_price` (with inclusive tax, `unit_price` is the **net** price) |
| `discount_amount_total` | Σ `quantity × (unit_price − discount_unit_price)` |
| `tax_amount_total` | Σ line `tax_amount` |
| **`grand_total`** | `gross_total + tax_amount_total − discount_amount_total` |
| `paid_amount` | running sum of payments applied to the invoice |
| **Due amount** | `grand_total − paid_amount` |
| `due_date` | `invoice_date + payment term days` |

### 1.3 UO and EM invoices
- **UO line**: `consumed = current_unit − previous_unit`, and `total = consumed × unit_price`.
  - `previous_unit` = the apartment's last approved reading (`estate_uo_item_balances.last_read_unit`).
    For an apartment's first-ever reading, it's whatever was entered.
  - `unit_price` = the service item's price **when the UO was created**. A later price change
    doesn't affect drafts that already exist.
  - Readings are whole numbers. MMK, no tax, no discount. Invoice `grand_total` = Σ line totals.
    The invoice date is the **approval date**, not the reading date.
- **EM**: `amount = monthly_fee × number_of_months`. The invoice has one line (qty = months).
  MMK, due in 45 days from approval.

### 1.4 Rounding (a source of 0.01 differences)
`Helpers/Amount`:
- `bcround(x, 2)` adds 0.005 and truncates, so it rounds half up.
- **Exception:** for an invoice with **exactly one line using INCLUSIVE tax**, the tax total uses
  `customRound`. That rounds up only when the 3rd decimal is **greater than 5** and otherwise
  truncates, so `x.xx5` rounds **down**. If a one-line inclusive-tax invoice is off by 0.01, this is
  why.

---

## 2. Invoice status after a payment
`Services/Invoice/Operations/MakePaymentOperation.php`

- `amount paid == due amount` → **PAID**, otherwise → **PARTIALLY_PAID**.
- An amount above what's due goes to the apartment's **wallet**. It doesn't increase `paid_amount`.
- A UO invoice with a 0 amount is created already **PAID**.
- ⚠️ A payment through the **partner API** (`estate-billing-api`) is **always marked PAID**, even
  when partial (GOTCHAS #1). When `status = PAID` but `grand_total − paid_amount > 0`, the payment
  almost certainly came in that way.

---

## 3. Dashboard
`Services/Dashboard/Operations/IndexDashboardOperation.php` → `Domains/Dashboard/Jobs/*`

### 3.1 Accounts Receivable widget (`ShowAccountReceivableJob`)
Outstanding (`Σ grand_total − Σ paid_amount`) of invoices that are not DRAFT, PAID or DELETED,
bucketed by **days past `due_date`**, measured **today**:

| Bucket | Rule |
|---|---|
| Current | `due_date ≥ today` (not due yet) |
| 1–30 … 151–180 | `due_date` between today−N and today−M days |
| >180 | `due_date < today − 180` |
| **Total Overdue** | sum of every bucket except Current |
| **Total Due** | Current + Total Overdue |

The aging is based on the **due date**, not the invoice date.

### 3.2 Account Balance widget (`ShowAccountBalanceJob`)
- Shows `accounts.balance` for every account that isn't soft-deleted, grouped by currency → account
  type → bank name.
- It's a **live stored balance**, not recalculated. It includes **uncleared cheques**, because a
  cheque payment increases the balance straight away.

### 3.3 Net Cash widget (`ShowNetCashJob`, scopes in `Data/Models/CashTransaction.php`)
These are calculated for Today, This month, Last month and 2 months ago (by `transaction_date`).

| Figure | Formula |
|---|---|
| Cash Received | Σ `debit` of cash transactions of type CASH_RECEIVED, WALLET_RECHARGE, DEPOSIT_ADD or INVOICE_PAYMENT. **No approval needed**, and it includes uncleared cheques and unknown receipts. |
| Payment (outflow) | Σ `credit` of type CASH_OUTFLOW, WALLET_REFUND or DEPOSIT_WITHDRAW **that are approved** (`approved_at` set) |
| **Net Cash** | Cash Received − Payment |

**Not** included: cash transfers between accounts, wallet payments (which use wallet money, not new
cash), and opening balances.

### 3.4 Wallet & Deposit widget (`ShowWalletDepositJob`, scopes in `WalletTransaction` / `DepositTransaction`)
This is **net movement in the period**, not the balance:
`Σ debit − Σ credit` of the period's wallet (or deposit) transactions. Refunds and withdrawals
count **only once approved**. Wallet + Deposit = the sum of the two.

---

## 4. Accounts Receivable report
`Domains/AccountReceivable/Jobs/IndexAccountReceivableJob.php` (also `…ByApartmentJob`, `…ByContactJob`)

- Uses the same buckets and invoice set as §3.1, with optional filters for currency, category and
  type. The type filter is `Inv` vs `DN` by **code prefix**, so UO and EM invoices count as `Inv`.
- Each row's `due_amount` is `grand_total − paid_amount`.
- **AR snapshots** (`ar:snapshot`, runs **daily at 23:58**): the same numbers saved to
  `account_receivable` for history. A snapshot is the state **at 23:58 on that day**. A backdated
  entry made later **doesn't change** old snapshots, so a snapshot and today's live report for a
  past date won't match.

---

## 5. Apartment Statement of Account (SOA)
`Domains/EstateSOA/Jobs/GetEstateStatementOfAccountJob.php`

For one apartment, one currency and one month:

| Figure | Formula |
|---|---|
| **Opening Balance** | `estate_balances.balance` of the latest row dated **before the 1st of the month**, or 0 if there's none |
| Rows | `statement_of_account` rows in that month, ordered by date, then id |
| Running balance | INVOICE or DEBIT_NOTE row: `+ debit`. PAYMENT_RECEIVED row: `− credit` |
| **Balance (header)** | **calculated separately**: Σ `grand_total − paid_amount` of the apartment's invoices that are not PAID, DRAFT or DELETED |

⚠️ **The SOA closing balance and the header balance come from different sources.** They should be
equal, but they disagree when:
- the `estate_balances` snapshots have drifted (backdated rewrites or races; see GOTCHAS #4)
- a partner-API partial payment set an invoice to PAID, which drops it from the header but leaves
  the SOA still owing the difference
- the SOA is filtered to an earlier month, so its closing balance is as at the end of that month,
  not today

---

## 6. Cash/Bank Account Statement
`Domains/AccountStatement/Jobs/ShowAccountStatementJob.php`

| Figure | Formula |
|---|---|
| **Opening Balance** | `account_balances.balance` of the latest snapshot with **`created_at`** before *date from* |
| Rows | the account's cash transactions with `transaction_date` in the range. **Unapproved cash outflows and cash transfers are excluded.** Zero initial-balance rows are hidden. |
| Running balance | `+ debit` for INITIAL_BALANCE, CASH_RECEIVED, INVOICE_PAYMENT, WALLET_RECHARGE, DEPOSIT_ADD, CASH_TRANSFER_IN. `− credit` for CASH_OUTFLOW, WALLET_REFUND, DEPOSIT_WITHDRAW, CASH_TRANSFER_OUT |

⚠️ The opening balance is picked by the snapshot's **creation time**, but the rows are filtered by
**transaction date**. A **backdated** transaction (entered today with an earlier date) can therefore
make the statement's closing balance differ from `accounts.balance` or from the next period's opening balance.

---

## 7. Wallet and deposit balances (apartment page)
- **Current wallet balance** = `estate_wallets.balance` (stored, live).
  It goes **up** with recharge, overpayment, approved credit note and incoming transfer. It goes
  **down** with wallet payment, outgoing transfer and approved refund.
- **Current deposit balance** = `estate_deposits.balance`. It goes up when a deposit is added and
  down when an approved withdrawal is made.
- Their histories are kept in `estate_wallet_balances` and `estate_deposit_balances` (one row per
  transaction, with the same backdated-rewrite pattern).

---

## 8. Checklist: investigating a disputed number

1. **Which figure is it?** Find its section above, and note the formula and source.
2. **Currency and date basis.** Check that it's the same currency and the right date: transaction
   date, due date, approval date or the snapshot's created_at.
3. **Status filters.** Is a draft, unapproved or deleted document expected to count? Most totals
   only count approved documents. Cash received doesn't need approval.
4. **Stored vs computed.** Compare the stored value with a recalculation:
   ```sql
   -- invoice outstanding for an apartment
   SELECT currency_code, SUM(grand_total - paid_amount)
   FROM invoices WHERE estate_id = ? AND status NOT IN ('DRAFT','PAID','DELETED') AND deleted_at IS NULL
   GROUP BY currency_code;

   -- invoices marked PAID but not fully paid (partner-API bug)
   SELECT code, grand_total, paid_amount FROM invoices
   WHERE status = 'PAID' AND grand_total - paid_amount > 0;

   -- account balance vs. ledger (initial balance is itself an INITIAL_BALANCE debit row;
   -- unapproved outflows/transfers should not have moved the balance — exclude them if needed)
   SELECT a.balance, SUM(ct.debit) - SUM(ct.credit) AS recomputed
   FROM accounts a JOIN cash_transactions ct ON ct.account_id = a.id
   WHERE a.id = ? AND ct.deleted_at IS NULL GROUP BY a.balance;

   -- duplicate account balance snapshots
   SELECT account_id, cash_transaction_id, COUNT(*) FROM account_balances
   GROUP BY 1,2 HAVING COUNT(*) > 1;
   ```
5. **Backdating.** Look for entries whose `created_at` is much later than their transaction or document date.
6. **0.01 differences.** See the rounding rules in §1.4.
