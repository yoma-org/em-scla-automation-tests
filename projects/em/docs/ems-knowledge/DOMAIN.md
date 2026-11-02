# Domain model

## Glossary

| Term | Meaning |
|---|---|
| **Estate / Apartment** | One unit (an apartment). Table `estates`: `area_id` + `unit` + `name`. The UI calls it "Apartment" and the code calls it "Estate". |
| **Area** | Location hierarchy: `ZONE` → `BUILDING` (self-referencing `parent_id`). |
| **Contact** | A person or company. Identity type is `NRC` (Myanmar national ID), `PASSPORT` or `COMPANY`. |
| **Estate Contact** | Links a contact to an apartment as `OWNER` or `TENANT`, with status `CURRENT` or `PREVIOUS` and ownership start/end dates. |
| **UO (Utility Operation)** | A meter-reading batch for one apartment. Each item is one service item (e.g. electricity or water) with previous, current and consumed units × unit price. Approving it creates a UO invoice. |
| **Service Item / UO Pricing** | A utility with a unit price (`service_items`, type `UO_PRICING`). |
| **Meter Reset** | `estate_uo_balance_resets`: an approved override of an apartment's last meter reading (e.g. after a meter is replaced). |
| **EM (Estate Management)** | A management-fee record: `monthly_fee × number_of_months` for a start to end date. Approving it creates an EM invoice. |
| **Invoice** | Type `INVOICE`, `DEBIT_NOTE`, `UTILITY_OPERATION` or `ESTATE_MANAGEMENT`. Status `DRAFT` → `UNPAID` → `PARTIALLY_PAID` → `PAID` (or `DELETED`). |
| **Deposit Invoice (DI)** | An invoice for an apartment's security deposit. |
| **Cash Inflow (RV)** | Money received. Types: `INVOICE_PAYMENT`, `WALLET_PAYMENT`, `CASH_RECEIVED`, `DEPOSIT_ADD`, `WALLET_RECHARGE`. |
| **Unknown Cash Received** | A receipt where the payer or apartment isn't known yet (`is_unknown`). It is assigned to an apartment later (`is_assigned_unknown`). |
| **Cash Outflow (PV)** | Money paid out: `CASH_OUTFLOW`, `WALLET_REFUND`, `DEPOSIT_WITHDRAW`. |
| **Cash Transfer (JV)** | A move between two cash or bank accounts, possibly in different currencies (`from_amount`/`to_amount`). |
| **Wallet** | Prepaid credit for each apartment (`estate_wallets`). It is topped up by recharge, overpayment or credit note, spent on invoices (WP), moved between apartments (WT), or refunded. |
| **Deposit** | Security deposit held for each apartment (`estate_deposits`). |
| **Credit Note (CN)** | Currently only of type `WALLET`: it credits an apartment's wallet. |
| **SOA** | Statement of Account. `statement_of_account` rows are of type `INVOICE`, `DEBIT_NOTE` or `PAYMENT_RECEIVED`, one per apartment. |
| **AR** | Accounts receivable. `ar:snapshot` saves the aging buckets (current, 1–30 … >180 days) every night. |
| **Account** | A company cash or bank account (`CASH`/`BANK`, with optional overdraft). |
| **Category** | Income or expense category (a tree, `is_fund`). Roles can be limited to certain categories (`category_role`). |
| **Location** | The physical collection point where a payment was taken. |
| **Co-Ref** | The running document reference (`co_ref`) kept alongside the monthly invoice code. `old_co_ref` holds numbers from the legacy system. |

## Voucher/document code prefixes

| Prefix | Document |
|---|---|
| `Inv` | Invoice (monthly numbering: `month_prefix` = YYYYMM) |
| `DN` | Debit note |
| `DI` | Deposit invoice |
| `RV` | Receipt voucher (cash inflow) |
| `PV` | Payment voucher (cash outflow) |
| `JV` | Journal voucher (cash transfer) |
| `CN` | Credit note |
| `WT` | Wallet transfer |
| `WP` | Wallet payment |

The starting numbers come from env vars (`RV_CODE`, `INV_COREF_CODE`, etc. in `config/voucher.php`)
so that numbering **continues from the legacy system** after data migration.

## Entity relationships (simplified)

```
Area(ZONE) ─< Area(BUILDING) ─< Estate ─< EstateContact >─ Contact
                                  │
     ┌──────────────┬─────────────┼──────────────┬───────────────┐
UtilityOperation  EstateManagement  Invoice ─< InvoiceItem   EstateWallet / EstateDeposit
  └< UOItem           │               │                         │
     (ServiceItem)    └── invoice_id ─┘                    WalletTransaction / DepositTransaction
                                      │
                         StatementOfAccount ─ EstateBalance (running balance per apartment)

CashInflow / CashOutflow / CashTransfer / WalletPayment ─< CashTransaction (polymorphic "transactable")
Account ─< AccountBalance (running balance snapshot per cash_transaction)
```

The schema stores names alongside IDs on purpose (`estate_name`, `account_name`, `created_by_name`,
`approved_by_name`, …). Documents keep the names as they were when the document was created.

## Roles (maker-checker)

`admin`, `management`, `uo-operator`/`uo-manager`, `mo-operator`/`mo-manager` (management
office / EM fees), `leasing-operator`/`leasing-manager`, `finance-operator`/`finance-manager`,
`cashier-operator`/`cashier-manager`, `credit-control`, `it-operator`.

Operators create documents and managers approve them. Permissions follow the pattern
`index|show|create|edit|approve|delete-<module>` (see `PermissionEnum`). The web app mirrors them
through CASL.
