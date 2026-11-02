# Money flows and business rules

Every amount is `DECIMAL(25,2)` and calculated with PHP `bcmath` (`bcadd`/`bcsub`, scale 2).
The frontend uses `big.js` and `json-parse-bigint` (IDs are snowflakes).

## 1. Utility Operation (UO) → invoice

`app/Services/UtilityOperation/Operations/ApproveUtilityOperation.php`

1. An operator creates a UO by hand or through an **Excel import** (`ImportUtilityOperation`). Each
   item records `previous_unit`, `current_unit`, `consumed_unit`, `unit_price` and `total` for one
   service item.
2. The previous reading comes from `estate_uo_item_balances` (the last reading per apartment and
   service item).
3. **On approval**, in a single DB transaction:
   - an invoice is created: type `UTILITY_OPERATION`, category = "utilities", currency **MMK
     hardcoded**, utilities payment term, **no tax**
   - the status is `UNPAID`, or `PAID` straight away if the amount is 0
   - each item's description is HTML: service name plus previous, current and consumed readings
   - `estate_uo_item_balances` is updated to the new reading, **unless** a meter reset was approved
     for this UO
   - an SOA debit row is written and the apartment's running balance is updated (see §6)
4. Bulk approve is available.
5. Validation added in 2026: **only one UO import per apartment per month**, the reading date
   can't be in the future, and the reading date must be in the same month and year.

## 2. Estate Management (EM) fee → invoice

`app/Services/EstateManagement/Operations/ApproveEstateManagementOperation.php`

- `amount = monthly_fee × number_of_months` for `start_date`–`end_date`.
- On approval it creates an `ESTATE_MANAGEMENT` invoice and approves it immediately, with:
  - category looked up **by name**: `'Estate Mgmt Fees'`
  - currency **MMK**, payment term **45 days** (looked up by `days_until_due = 45`)
  - one line: "Estate Management Fees from dd/mm/yyyy to dd/mm/yyyy", qty = months
- Excel import and bulk approve are available. `GetPreviousRecord` pre-fills the next period.

## 3. Manual invoices and debit notes

- Line items support a discount (`PERCENTAGE` or `FIXED_AMOUNT`) and tax (`NO_TAX`, `INCLUSIVE`
  or `EXCLUSIVE`).
- Payment terms: Due on receipt, +7, +15, +30, +45, +60 or +90 days.
- Numbering: `Inv-…` resets every month (`month_prefix` YYYYMM + `code_number`), and `co_ref` runs
  globally. Each prefix (`Inv`, `DN`, `DI`) has its own sequences.

## 4. Paying invoices (back office)

`CashInflow/Operations/CreatePaymentCashInflowOperation.php` and `Invoice/Operations/MakePaymentOperation.php`

1. One **cash inflow (RV)** can pay **several invoices** for one apartment. The payload includes
   `invoices: [{id, amount}]`, `received_in` (account), location and payment method.
2. For each invoice the system:
   - adds the amount to the account balance and writes an `account_balances` snapshot
   - writes one `cash_transactions` debit row whose description is `"<invoice code> Payment"` or
     `"… (2nd partial payment)"`
3. Then it sets the invoice to `PAID` if the amount equals the due amount and `PARTIALLY_PAID`
   otherwise, increases `paid_amount`, writes an SOA `PAYMENT_RECEIVED` credit row and adds a credit
   entry to the apartment's balance.
4. **Overpayment** goes to the wallet (`CreateCreditToWallet`) or the deposit (`CreateCreditToDeposit`).
5. There is a separate path for paying in a **different currency** from the invoice
   (`…WithDifferentCurrency`).
6. **Cheques**: `cheque_status` is `UNCLEARED` until it is updated, and every other payment method
   is `CLEARED` automatically.
7. **Unknown receipts**: money comes in with `is_unknown = true` and is later assigned to an
   apartment, which runs the same make-payment flow (`UnknownMakePayment`).

## 5. Wallet and deposit

- **Recharge**: a cash inflow of type `WALLET_RECHARGE` → `wallet_transactions` credit → the
  wallet balance goes up.
- **Wallet payment (WP)**: pays invoices from the wallet. It creates cash transactions and
  decreases the wallet balance per invoice, **without** touching any company bank or cash account.
- **Wallet transfer (WT)**: moves credit from one apartment to another.
- **Wallet refund**: a cash outflow that needs approval. It is validated against the wallet balance.
- **Credit note (CN, type WALLET)**: needs approval, then credits the wallet.
- **Deposit**: received via a deposit invoice (DI) or directly (`DEPOSIT_ADD`). Withdrawals need
  approval (`DEPOSIT_WITHDRAW`).

## 6. Running balances (important pattern)

There are **four** running-balance ledgers, and all of them follow the same pattern:

| Ledger | Header | Snapshot table |
|---|---|---|
| Company account | `accounts.balance` | `account_balances` (per cash_transaction) |
| Apartment AR | (none) | `estate_balances` (per SOA row, DEBIT/CREDIT) |
| Apartment wallet | `estate_wallets.balance` | `estate_wallet_balances` |
| Apartment deposit | `estate_deposits.balance` | `estate_deposit_balances` |

Because entries can be **backdated**, inserting one works like this:
1. find the latest snapshot **before** the new entry's date (`CheckLesser…DateJob`), so
   new balance = that balance ± amount
2. find every snapshot **after** that date (`CheckGreater…DateJob`) and add or subtract the
   amount on **each** of them (`lockForUpdate` per row)

So a single backdated entry can rewrite many rows. When these balances drift,
the fix is to rebuild them from the transactions (see the `reconcile:*` commands in GOTCHAS.md).

## 7. Approvals

Documents that need a manager's approval (`DocumentStatusEnum` DRAFT → APPROVED / DELETED):
cash outflow, cash transfer, wallet refund, deposit withdrawal, credit note, UO, EM, meter reset,
deposit invoice and invoices. Approving one is what actually posts the money. Drafts don't
affect any balance.

## 8. Partner payments (estate-billing-api)

- An API key (`api_key` table, managed in the back office under Settings → API Key, with its own
  permission set) is exchanged for a Passport token:
  `GET /v1/get_token/{key}` (old) or `POST /v2/get_token`. Each exchange deletes the key's earlier
  tokens.
- Endpoints: zones, locations, payment options, contact lookup, unpaid invoices by contact or
  apartment, SOA, wallet, deposit, AR summary, invoice by number, **make-payment**, and PDFs
  (invoice, receipt, SOA, wallet, deposit).
- `make-payment` takes `{id: invoice code, amount, account_id, location_id, payment_method, remark}`
  and creates an RV cash inflow, cash transaction, account balance row, SOA credit and estate
  balance row. **It is a separate re-implementation of the back-office flow.** See GOTCHAS.md for
  how the two differ.
