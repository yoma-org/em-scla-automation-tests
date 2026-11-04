# Jira tickets — status on UAT, 2026-11-01

[← Sanity index](../README.md) · [Bugs](../bugs.md) · [Jira cross-check](../jira.md)

Every bug ticket on Jira was reproduced on the UAT web: 117 tickets in the filter, minus 27 epics and tasks, leaves **90 bugs** and 93 test cases. Each ticket has Old vs New results and screenshots.

| | |
|---|---|
| **New EM** | https://uat.newem.ted.synergy.yomaland360.com, build `v0.4.1-37-g3090ff81` |
| **Old EM (baseline)** | https://www.uat.ted.synergy.yomaland360.com, bundle `dd551ca9` / `d4869b4a` (Old EM has no version number) |
| **Screenshots** | Retaken 2026-11-01, 17:14–18:02: viewport 1440×900, PNG at full size, English labels |
| **Jira** | Read only, no ticket was changed. All 90 were **To Do** at capture, including the fixed ones. |

## Result

| Status | Tickets | Which |
|---|---|---|
| **Open** | 22 | EM-33 (reopened 11-02), 92*, 93, 94, 95, 96, 97, 99, 100, 101, 103, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117 |
| **Partly open** | 13 | EM-35, 37, 55, 72, 73, 74, 75, 76, 85, 98, 102, 104, 105 |
| **Fixed** | 53 | Listed under [All tickets](#all-tickets) |
| **Fixed (partly verified)** | 1 | EM-83: the file is read correctly, but no valid date is available yet to stage a row. Retry from 02/11. |
| **Blocked** | 1 | EM-29: needs an invited user and their mailbox |
| **Total** | **90** | |

\* EM-92 has a fix that is not deployed to UAT yet, so UAT still has the defect.

## Hard stop: fix first

**[EM-96](open/g1-api-validation.md): the API accepts a Cash Transfer to the internal control account `INCOME-CTRL`.** `POST` returns 201 and created draft #23 on UAT, so anyone calling the API directly can move money in or out of an internal ledger account.

[EM-98](open/g1-api-validation.md) is the same kind of defect, where the API skips a check the form makes: sending `kind=BANK` creates a BANK account with no bank details (id 66). Fix these two before the other groups.

## Tickets by group

**Still to fix.** Tickets in a group sit in the same area, so they are cheaper to fix together.

| Group | Area | File | Tickets |
|---|---|---|---|
| G1 | API validation: Cash & Bank, Cash Transfer, Cash Outflow | [g1-api-validation](open/g1-api-validation.md) | 96, 98, 97 |
| G2 | Cash & Bank Account screens | [g2-cash-bank-screens](open/g2-cash-bank-screens.md) | 94, 72, 73 |
| G3 | Invoice line amounts and precision | [g3-invoice-amounts](open/g3-invoice-amounts.md) | 92, 75, 76, 112, 93, 113 |
| G4 | USD and Unknown payment allocation | [g4-payment-allocation](open/g4-payment-allocation.md) | 116, 117, 114, 115, 104 |
| G5 | How receipts show in lists, reports and S.O.A | [g5-receipt-display](open/g5-receipt-display.md) | 102, 109, 101, 74 |
| G6 | Reports and AR | [g6-reports-ar](open/g6-reports-ar.md) | 107, 108, 99, 95, 100 |
| G7 | Deposit | [g7-deposit](open/g7-deposit.md) | 103, 105 |
| G8 | UO, EM and reading dates | [g8-uo-em-dates](open/g8-uo-em-dates.md) | 110, 111, 37, 55 |
| G9 | UI and stray data | [g9-ui-data](open/g9-ui-data.md) | 85, 35 |
| G10 | Apartment form | [g10-apartment-form](open/g10-apartment-form.md) | 33 |
| Blocked | Needs a person to run it | [blocked](open/blocked.md) | 29 |

**Fixed.** These cases are now regression checks, grouped by screen.

| Area | File | Tickets |
|---|---|---|
| Cash & Bank Account | [fixed-accounts](fixed/fixed-accounts.md) | 69, 70, 71, 88 |
| Apartments | [fixed-apartments](fixed/fixed-apartments.md) | 32, 41, 42, 44, 47, 48, 52, 66, 67 |
| Cash Outflow | [fixed-cash-outflow](fixed/fixed-cash-outflow.md) | 59 |
| Cash Received | [fixed-cash-received](fixed/fixed-cash-received.md) | 84 |
| Cash Transfer | [fixed-cash-transfer](fixed/fixed-cash-transfer.md) | 61, 86 |
| Contacts | [fixed-contacts](fixed/fixed-contacts.md) | 43, 45 |
| Dashboard | [fixed-dashboard](fixed/fixed-dashboard.md) | 31 |
| Deposit | [fixed-deposit](fixed/fixed-deposit.md) | 68 |
| Estate Management fee | [fixed-em](fixed/fixed-em.md) | 51, 54, 91 |
| Invoices / Debit Note | [fixed-invoices](fixed/fixed-invoices.md) | 49, 53 |
| Reports | [fixed-reports](fixed/fixed-reports.md) | 36, 106 |
| Settings | [fixed-settings](fixed/fixed-settings.md) | 34, 38, 39, 40, 46, 56, 57, 58, 60, 62, 63, 64, 65 |
| Sign In & Account | [fixed-sign-in](fixed/fixed-sign-in.md) | 28, 30, 87 |
| Utility Operations & Meter Reset | [fixed-uo](fixed/fixed-uo.md) | 50, 90 |
| UO Import | [fixed-uo-import](fixed/fixed-uo-import.md) | 82, 83 |
| Wallet | [fixed-wallet](fixed/fixed-wallet.md) | 77, 78, 79, 80, 81, 89 |

IDs follow the repro: `TC-EM-93-01` becomes `SAN-EM93-001`. Priority comes from Jira: Highest and High are P1, Medium is P2, Low is P3.

## Fix tracking

Update Fix status, Owner, PR and UAT retest as fixes land. Fix status values: `To do`, `Doing`, `In review`, `Waiting for deploy`, `Needs clarifying`, `Done`. Write the build and result in UAT retest (for example `v0.4.2 OK`), and move to `Done` only after the retest passes on UAT.

| Group | Ticket | Status | Symptom | Fix status | Owner | PR | UAT retest |
|---|---|---|---|---|---|---|---|
| G1 | [EM-96](open/g1-api-validation.md) | Open (hard stop) | Hard stop: API creates a transfer to INCOME-CTRL (201, draft #23) | To do |  |  |  |
| G1 | [EM-98](open/g1-api-validation.md) | Partly open | API with `kind=BANK` only still creates a BANK account with no bank (id 66); `account_type_id` is now blocked. | To do |  |  |  |
| G1 | [EM-97](open/g1-api-validation.md) | Open | Outflow 30,000 and Transfer 50,000 above a 10,000 balance still create drafts; Old EM blocks at the Amount field | To do |  |  |  |
| G2 | [EM-94](open/g2-cash-bank-screens.md) | Open | Update Initial Balance fails with ERR_UNKNOWN; `PUT .../migrated-balance` returns 405. | To do |  |  |  |
| G2 | [EM-72](open/g2-cash-bank-screens.md) | Partly open | Edit Cash fields match; Payment Method is a checkbox list instead of Old EM's multiselect. | To do |  |  |  |
| G2 | [EM-73](open/g2-cash-bank-screens.md) | Partly open | Edit Bank fields match; Payment Method is a checkbox list and still shows a discontinued method. | To do |  |  |  |
| G3 | [EM-92](open/g3-invoice-amounts.md) | Open | Disc. Price, line Total and Payment Terms still differ; a fix exists but is not deployed to UAT | Waiting for deploy |  |  |  |
| G3 | [EM-75](open/g3-invoice-amounts.md) | Partly open | Discount is locked; line Disc. Price / Total still differ from Old EM | To do |  |  |  |
| G3 | [EM-76](open/g3-invoice-amounts.md) | Partly open | Discount is locked; line Disc. Price / Total still differ from Old EM, waiting for the EM-92 fix on UAT | To do |  |  |  |
| G3 | [EM-112](open/g3-invoice-amounts.md) | Open | Discount 100% still gives 'Could not calculate the total / ERR_UNKNOWN'; Old EM clears the field | To do |  |  |  |
| G3 | [EM-93](open/g3-invoice-amounts.md) | Open | INV-202610-00047 stays PARTIALLY_PAID with due 0.0042 (screen shows 0.00) | To do |  |  |  |
| G3 | [EM-113](open/g3-invoice-amounts.md) | Open | Second Approve from a stale tab shows no 'Invoice has been already approved.' | To do |  |  |  |
| G4 | [EM-116](open/g4-payment-allocation.md) | Open | $1 for 3 invoices of 1,000 Ks allocates 0.33 × 3 = $0.99 | To do |  |  |  |
| G4 | [EM-117](open/g4-payment-allocation.md) | Open | Description is '—' in the log (Old EM writes the conversion) | To do |  |  |  |
| G4 | [EM-114](open/g4-payment-allocation.md) | Open | Allocating 80.01 of 1,000 still says 'short of 1000.0000' (correct: 919.99) | To do |  |  |  |
| G4 | [EM-115](open/g4-payment-allocation.md) | Open | Pay In USD still offers Wallet | To do |  |  |  |
| G4 | [EM-104](open/g4-payment-allocation.md) | Partly open | Clear "Insufficient wallet balance" message now; Received still not locked and line not capped to the wallet | To do |  |  |  |
| G5 | [EM-102](open/g5-receipt-display.md) | Partly open | Wallet/deposit receipts are listed; still 1 row per receipt, no Created By column | To do |  |  |  |
| G5 | [EM-109](open/g5-receipt-display.md) | Open | RV-00057 (3 invoices + wallet) is still 1 row with no description. | To do |  |  |  |
| G5 | [EM-101](open/g5-receipt-display.md) | Open | S.O.A still has OVERPAYMENT_RESIDUE, a 0.00 row and wallet rows | To do |  |  |  |
| G5 | [EM-74](open/g5-receipt-display.md) | Partly open | Form matches Old EM (no Category field) but saves "No category" instead of "Uncategorized Receive" | To do |  |  |  |
| G6 | [EM-107](open/g6-reports-ar.md) | Open | The Cash Outflow report still has 3 draft rows '— No voucher yet' at 100 rows/page. | To do |  |  |  |
| G6 | [EM-108](open/g6-reports-ar.md) | Open | Last 30 days starts on 03/10 instead of 02/10 (Old EM: today − 30). | To do |  |  |  |
| G6 | [EM-99](open/g6-reports-ar.md) | Open | Type still has 4 options; 'Invoice' leaves out UO (557,200.00 Ks under 'Utility operation') | To do |  |  |  |
| G6 | [EM-95](open/g6-reports-ar.md) | Open | Snapshot USD for 01/11 is $200, AR USD is $550; $350 missing | To do |  |  |  |
| G6 | [EM-100](open/g6-reports-ar.md) | Open | The Invoice / Debit Note list has no Totals row | To do |  |  |  |
| G7 | [EM-103](open/g7-deposit.md) | Open | No Date field; approved invoice shows '—' for dates and users, and Remove is still shown. | To do |  |  |  |
| G7 | [EM-105](open/g7-deposit.md) | Partly open | Withdraw From is now a dropdown; the hint still says 'Enter an amount to deposit.' | To do |  |  |  |
| G8 | [EM-110](open/g8-uo-em-dates.md) | Open | Same-day reset is rejected with ERR_METER_RESET_DATE_NOT_AFTER_PREVIOUS | To do |  |  |  |
| G8 | [EM-111](open/g8-uo-em-dates.md) | Open | From stays empty and unlocked; the hint gives the wrong date (01/10 instead of 01/11) | To do |  |  |  |
| G8 | [EM-37](open/g8-uo-em-dates.md) | Partly open | Technical code is gone, but New EM shows "Invalid 'Reading Date'" instead of the Old EM sentence | To do |  |  |  |
| G8 | [EM-55](open/g8-uo-em-dates.md) | Partly open | Filter bar matches; the default list has no per-meter columns | To do |  |  |  |
| G9 | [EM-85](open/g9-ui-data.md) | Partly open | Overlap is gone; Apartment dropdown overflows the screen and cannot be scrolled | To do |  |  |  |
| G9 | [EM-35](open/g9-ui-data.md) | Partly open | The New button is removed; the list still has 5 records (duplicate YESC, 2 Seed) and lacks Generator and Treated Water. | To do |  |  |  |
| G10 | [EM-33](open/g10-apartment-form.md) | Reopened | Zone/Building lists offer the selectable options "Zone"/"Building"; Status Enable/Disable missing on Create | To do |  |  | v0.4.1-43 failed (2026-11-02) |
| Blocked | [EM-29](open/blocked.md) | Blocked | Not run: needs an invited user, that user's mailbox and a sign-out | Needs clarifying |  |  |  |

## Findings without a ticket

Seen during the repro. None has a Jira ticket yet.

- Payment terms has duplicates: "Due on receipt" and "Due On Receipt".
- The UO template has a duplicate "Electricity (YESC)" header.
- UAT uses the S3 bucket `em-dev-documents`.
- Settings > Payment Method and Bank have a Delete button. Old EM has only Edit on these lists. (Apartments and Cash & Bank have a delete icon on Old EM too, so those screens do not differ.)
- The Old EM Create Apartment form has a Status field. New EM does not.
- Resident ID is not required on New EM.
- Description is not required on Outflow and Transfer.
- The Outflow list has no Approved By column.
- The Create Invoice page scrolls horizontally.

## Limits of the evidence

- 164 screenshots were retaken (209 copies per ticket, because one image can serve several tickets). 89 tickets have at least one New and one Old image. EM-92 only had its retest image retaken; its earlier images and GIFs are unchanged.
- **One verdict changed:** EM-30 moved from Blocked to Fixed, tested with a fake email and password. The other 89 kept their verdict.
- **Newly verified:**
  - EM-104: Old caps to the wallet balance (`A1-QEPAIR01`, wallet 1,920; typing 5,000 becomes 1,920).
  - EM-113: Old's toast "Invoice has been already approved." is now captured.
  - EM-97: Old blocks at the Amount field and creates no draft.
- **Recaptured, not re-run:**
  - EM-96: the API was not called again. The request and response in the image are from 15:25–15:27. Old was checked at UI level only.
  - EM-98: same; account id 66 is still there, request recorded at 14:47.
  - EM-97: no new drafts, so the Draft List was recaptured instead of the creation toasts.
  - EM-79, EM-81, EM-86: existing transactions recaptured (WT-00006, PV-00027, JV-00014).
- **Not settled:**
  - EM-29: blocked, see above.
  - EM-83: the QA apartment has a reading on 01/11, so the date must be later, and 02/11 was refused as a future date. Retry from 02/11.
- EM-82, EM-83: on Old, only the Import page was captured; the template was not downloaded.
- EM-110: Old has no date field on Meter Reset. No real reset was created.
- EM-116: uses receipt RV-00066 from 30/10. The 3 invoices and the rate were not recreated on UAT.
- EM-95: Old UAT has no snapshot data, so New's snapshot is compared with New's AR on the same day.
- **Redacted images:** staff names and emails, and owner and tenant names, NRC and phone numbers, are blacked out in EM-41, EM-43, EM-44, EM-47, EM-52 and EM-64. Other screenshots can still show staff names in columns and labels such as Created By, and contact data on UAT. Check before sharing outside the team.

## Test data created

**New EM UAT**

- **Settings:** building `QA-REPRO-EM-56 Tower`, apartment `QA-REPRO-EM-56 Tower-R32-101` (id 32); categories `QA-REPRO-EM-38 Parent/Child`, `QA-REPRO-EM-39 Fund`, `QA-REPRO-EM-40 Payment Developer`; payment method `QA-REPRO-EM-58 PM`.
- **Accounts:** `QA-REPRO-EM-94 Cash` (id 65, CASH-0003, 10,000), `QA-REPRO-EM-98 Bank kind` (id 66).
- **Invoices:** INV-202611-00001 (#146), INV-202611-00003 (#149, `QA-REPRO-EM-113`, re-run), #147 (from EM #12), #148 (from UO #18).
- **Receipts:** RV-00073 Unknown 1,000; RV-00074 recharge 100; RV-00075 deposit 500. Re-run: RV-00076 Unknown 1,000 (#77, **not assigned**), RV-00077 deposit 1, RV-00078 recharge 1.
- **Wallet and vouchers:** WT-00006 (10 Ks), refund PV-00027 (50), JV-00014.
- **Drafts:** outflow 30,000 (`QA-REPRO-EM-97`), transfer #24 (50,000).
- **Other:** UO import batches #20 and #21 (both quarantined, no reading created), export job #51.

**Old EM UAT**

- `QA-REPRO-EM-94 Cash`, initial balance id 148, now 15,000.
- On `A1-000` with account "Cash 13 Nov": wallet recharge RV-102424 (1 Ks), wallet transfer WT-100117 (1 Ks, A1-000 → A1-001), wallet refund 1 Ks (draft #5430, self-approved as PV-100272), Add Deposit RV-102425 (1 Ks).
- Invoice #136096 (A1-000, 1.05 Ks, "QA-REPRO-EM-113 double approve"), created and approved.
- Invoice #136097 (A1-000, 1,050 Ks, "QA-REPRO-EM-113 approve twice"), created and approved in the re-run.
- Tried without saving: Outflow 30,000 (blocked), UO with a wrong date (blocked), Assign Unknown RV-102418 and Make Payment, including the wallet cap on `A1-QEPAIR01` (not confirmed).

## Cleanup needed on UAT

- **Draft transfer #23 to `INCOME-CTRL`** (from EM-96) is still there. Someone with permission should delete or reject it.
- INV-202610-00046 and INV-202610-00047 on `Building 1 -QEPAIR02` are stuck with 0.0042 due (EM-93).

## All tickets

| Ticket | Title | Jira priority | Status | Result | File |
|---|---|---|---|---|---|
| [EM-92](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-92) | [Invoices / Debit Note > Add Invoice] Create Invoice – line amounts and Payment Terms differ from old EM (Disc. Price, line Total, Payment Terms) | High | Open | Disc. Price, line Total and Payment Terms still differ; a fix exists but is not deployed to UAT | [g3-invoice-amounts](open/g3-invoice-amounts.md) |
| [EM-93](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-93) | [Invoices / Debit Note > Add Invoice] Invoice stays Partially Paid after paying the full displayed amount (3-decimal unit price) | Medium | Open | INV-202610-00047 stays PARTIALLY_PAID with due 0.0042 (screen shows 0.00) | [g3-invoice-amounts](open/g3-invoice-amounts.md) |
| [EM-94](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-94) | [Cash & Bank Account > Edit Initial Balance] Update fails with 'Could not update initial balance' | Medium | Open | Update Initial Balance fails with ERR_UNKNOWN; `PUT .../migrated-balance` returns 405. | [g2-cash-bank-screens](open/g2-cash-bank-screens.md) |
| [EM-95](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-95) | [Accounts Receivable > AR Snapshot] USD snapshot total does not match actual AR | Medium | Open | Snapshot USD for 01/11 is $200, AR USD is $550; $350 missing | [g6-reports-ar](open/g6-reports-ar.md) |
| [EM-96](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-96) | [Cash Transfer > API] Transfer can be created to the internal control account INCOME-CTRL | Medium | Open | Hard stop: API creates a transfer to INCOME-CTRL (201, draft #23) | [g1-api-validation](open/g1-api-validation.md) |
| [EM-97](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-97) | [Cash Outflow / Cash Transfer] Draft can be created for an amount above the account balance | Medium | Open | Outflow 30,000 and Transfer 50,000 above a 10,000 balance still create drafts; Old EM blocks at the Amount field | [g1-api-validation](open/g1-api-validation.md) |
| [EM-99](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-99) | [Accounts Receivable / Reports > Invoices] Type filter 'Invoice' / 'Debit Note' excludes UO and EM documents | Medium | Open | Type still has 4 options; 'Invoice' leaves out UO (557,200.00 Ks under 'Utility operation') | [g6-reports-ar](open/g6-reports-ar.md) |
| [EM-100](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-100) | [Invoices / Debit Note > List] Totals row is missing | Medium | Open | The Invoice / Debit Note list has no Totals row | [g6-reports-ar](open/g6-reports-ar.md) |
| [EM-101](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-101) | [Apartments > S.O.A] Statement shows wallet rows and internal text 'OVERPAYMENT_RESIDUE' | Medium | Open | S.O.A still has OVERPAYMENT_RESIDUE, a 0.00 row and wallet rows | [g5-receipt-display](open/g5-receipt-display.md) |
| [EM-103](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-103) | [Deposit Invoice] No Date field; approved invoice shows no dates, creator or approver | Medium | Open | No Date field; approved invoice shows '—' for dates and users, and Remove is still shown. | [g7-deposit](open/g7-deposit.md) |
| [EM-107](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-107) | [Reports > Cash Outflow / Transactions] Unapproved drafts are included | Medium | Open | The Cash Outflow report still has 3 draft rows '— No voucher yet' at 100 rows/page. | [g6-reports-ar](open/g6-reports-ar.md) |
| [EM-108](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-108) | [Reports > Invoices] 'Last 30 days' starts one day later than current EM | Medium | Open | Last 30 days starts on 03/10 instead of 02/10 (Old EM: today − 30). | [g6-reports-ar](open/g6-reports-ar.md) |
| [EM-109](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-109) | [Reports > Cash Received] One receipt shown as a single row without allocation details | Medium | Open | RV-00057 (3 invoices + wallet) is still 1 row with no description. | [g5-receipt-display](open/g5-receipt-display.md) |
| [EM-110](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-110) | [UO > Meter Reset] Reset is rejected on the same day as the last reading | Medium | Open | Same-day reset is rejected with ERR_METER_RESET_DATE_NOT_AFTER_PREVIOUS | [g8-uo-em-dates](open/g8-uo-em-dates.md) |
| [EM-111](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-111) | [EM > New] 'From' date is not auto-filled from the previous period | Medium | Open | From stays empty and unlocked; the hint gives the wrong date (01/10 instead of 01/11) | [g8-uo-em-dates](open/g8-uo-em-dates.md) |
| [EM-112](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-112) | [Invoices / Debit Note > Add Invoice] 100% discount shows generic 'ERR_UNKNOWN' instead of the real reason | Medium | Open | Discount 100% still gives 'Could not calculate the total / ERR_UNKNOWN'; Old EM clears the field | [g3-invoice-amounts](open/g3-invoice-amounts.md) |
| [EM-113](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-113) | [Invoices / Debit Note > Approve] No message when approving an already approved invoice | Medium | Open | Second Approve from a stale tab shows no 'Invoice has been already approved.' | [g3-invoice-amounts](open/g3-invoice-amounts.md) |
| [EM-114](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-114) | [Cash Received > Unknown Receipt > Assign] Wrong 'short of' amount in the error message | Medium | Open | Allocating 80.01 of 1,000 still says 'short of 1000.0000' (correct: 919.99) | [g4-payment-allocation](open/g4-payment-allocation.md) |
| [EM-115](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-115) | [Make Payment] Wallet still selectable when paying in USD | Medium | Open | Pay In USD still offers Wallet | [g4-payment-allocation](open/g4-payment-allocation.md) |
| [EM-116](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-116) | [Make Payment > USD] 1-cent difference across invoices (no rounding adjustment) | Medium | Open | $1 for 3 invoices of 1,000 Ks allocates 0.33 × 3 = $0.99 | [g4-payment-allocation](open/g4-payment-allocation.md) |
| [EM-117](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-117) | [Cash Received > Unknown Receipt > Assign] USD to MMK invoice loses the conversion description | Medium | Open | Description is '—' in the log (Old EM writes the conversion) | [g4-payment-allocation](open/g4-payment-allocation.md) |
| [EM-35](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-35) | [Settings > UO Pricing] New button allows creating extra UO Pricing records | High | Partly open | The New button is removed; the list still has 5 records (duplicate YESC, 2 Seed) and lacks Generator and Treated Water. | [g9-ui-data](open/g9-ui-data.md) |
| [EM-37](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-37) | [UO] Incorrect error message when meter reading date equals the previous reading date | Medium | Partly open | Technical code is gone, but New EM shows "Invalid 'Reading Date'" instead of the Old EM sentence | [g8-uo-em-dates](open/g8-uo-em-dates.md) |
| [EM-55](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-55) | [UO > Search] Search behaviour and UI differ from current EM | Medium | Partly open | Filter bar matches; the default list has no per-meter columns | [g8-uo-em-dates](open/g8-uo-em-dates.md) |
| [EM-72](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-72) | [Cash & Bank Account > Edit > Edit Cash Account] Edit UI does not match current EM UAT | Highest | Partly open | Edit Cash fields match; Payment Method is a checkbox list instead of Old EM's multiselect. | [g2-cash-bank-screens](open/g2-cash-bank-screens.md) |
| [EM-73](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-73) | [Cash & Bank Account > Edit > Edit Bank Account] Edit UI does not match current EM UAT | Highest | Partly open | Edit Bank fields match; Payment Method is a checkbox list and still shows a discontinued method. | [g2-cash-bank-screens](open/g2-cash-bank-screens.md) |
| [EM-74](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-74) | [Cash Received > Unknown Received] Category field is not mandatory | Low | Partly open | Form matches Old EM (no Category field) but saves "No category" instead of "Uncategorized Receive" | [g5-receipt-display](open/g5-receipt-display.md) |
| [EM-75](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-75) | [Invoices / Debit Note > Add Invoice] Inclusive Tax 5%/3% UI differs and allows discount | Highest | Partly open | Discount is locked; line Disc. Price / Total still differ from Old EM | [g3-invoice-amounts](open/g3-invoice-amounts.md) |
| [EM-76](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-76) | [Apartments > Add Invoice] Inclusive Tax 5%/3% UI differs and allows discount | Highest | Partly open | Discount is locked; line Disc. Price / Total still differ from Old EM, waiting for the EM-92 fix on UAT | [g3-invoice-amounts](open/g3-invoice-amounts.md) |
| [EM-85](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-85) | [Cash Received > Unknown Receipt Allocation] Assign popup has overlapping fields and misalignment | Medium | Partly open | Overlap is gone; Apartment dropdown overflows the screen and cannot be scrolled | [g9-ui-data](open/g9-ui-data.md) |
| [EM-98](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-98) | [Cash & Bank Account > API] Bank account can be created without Bank Name and Account Number | Medium | Partly open | API with `kind=BANK` only still creates a BANK account with no bank (id 66); `account_type_id` is now blocked. | [g1-api-validation](open/g1-api-validation.md) |
| [EM-102](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-102) | [Cash Received > Recent Receipts] Wallet recharge and deposit receipts are not listed | Medium | Partly open | Wallet/deposit receipts are listed; still 1 row per receipt, no Created By column | [g5-receipt-display](open/g5-receipt-display.md) |
| [EM-104](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-104) | [Make Payment > Wallet] Payment amount is not limited to wallet balance; ERR_UNKNOWN on confirm | Medium | Partly open | Clear "Insufficient wallet balance" message now; Received still not locked and line not capped to the wallet | [g4-payment-allocation](open/g4-payment-allocation.md) |
| [EM-105](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-105) | [Deposit > Withdraw] 'Withdraw From' is free text (account ID) instead of account dropdown | Medium | Partly open | Withdraw From is now a dropdown; the hint still says 'Enter an amount to deposit.' | [g7-deposit](open/g7-deposit.md) |
| [EM-29](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-29) | [TC_Login_001] - Users are redirected to error page after changing password | Medium | Blocked | Not run: needs an invited user, that user's mailbox and a sign-out | [blocked](open/blocked.md) |
| [EM-83](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-83) | [UO > Import] Import with provided CSV template stages 0 rows | Highest | Fixed (partly verified) | File is read (batches #20 and #21: 1 row recognised, quarantined); no valid row has been imported yet, retry possible from 02/11 | [fixed-uo-import](fixed/fixed-uo-import.md) |
| [EM-28](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-28) | [Change Password] “Log out of every device?” dialog content overflows outside the modal | Medium | Fixed | "Log out everywhere" button and dialog removed; page matches Old EM | [fixed-sign-in](fixed/fixed-sign-in.md) |
| [EM-30](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-30) | [Sign In] Invalid email/password alert message is incorrect | Low | Fixed | Shows "Email or Password is invalid"; only the final period differs from Old EM | [fixed-sign-in](fixed/fixed-sign-in.md) |
| [EM-31](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-31) | [Dashboard] Page shows two scroll bars and large white space when scrolling | Medium | Fixed | One scroll bar, no white space at the bottom | [fixed-dashboard](fixed/fixed-dashboard.md) |
| [EM-32](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-32) | [Apartments] Only unit name is displayed instead of apartment full name (e.g. A1-202) | High | Fixed | New apartment shows Building-Unit full name on detail, Global Search and Create Invoice; older records still show the unit only | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-33](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-33) | [Apartments] Apartment can be created without selecting a Building linked to a Zone | High | Reopened (11-02) | Zone/Building lists offer the selectable options "Zone"/"Building"; Status Enable/Disable missing on Create | [g10-apartment-form](open/g10-apartment-form.md) |
| [EM-34](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-34) | [Settings > General Setting] Extra CoRef-related fields are displayed | High | Fixed | General Settings has only Old CoRef No., as in Old EM. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-36](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-36) | [Reports > Transactions / Cash Received] Arrow symbols shown with names in Category filter | Low | Fixed | The Category filter has no ↑/↓ and is grouped by parent as in Old EM. | [fixed-reports](fixed/fixed-reports.md) |
| [EM-38](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-38) | [TC_Setting_08][TC_Setting_15] Parent-child hierarchy not shown in Category filter | High | Fixed | A new parent/child pair is shown as a hierarchy in the AR Category filter (parent as group heading). | [fixed-settings](fixed/fixed-settings.md) |
| [EM-39](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-39) | [TC_Setting_07] Created Fund Category is not available in related filters and forms | High | Fixed | A newly created Fund Category is in the Funding Received form. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-40](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-40) | [TC_Setting_14] New parent expense category not displayed in Categories filter | High | Fixed | A newly created parent expense category is shown in the AR Category filter. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-41](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-41) | [Apartments > Summary] Currency filter is missing on Apartment Summary | Medium | Fixed | Apartment Summary has the Currency dropdown; switching currency not tried (test apartment has no AR) | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-42](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-42) | [Apartments > Invoice] Debit Note can be created from the apartment's Invoices tab | High | Fixed | Invoices tab shows Add Invoice + Make Payment, with no way to add a Debit Note | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-43](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-43) | [Contact > Summary] Currency filter misaligned with Accounts Receivable header | Low | Fixed | Accounts Receivable title and Currency filter are on the same row | [fixed-contacts](fixed/fixed-contacts.md) |
| [EM-44](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-44) | [Apartments > Side Panel] Side panel not responsive; buttons and fields cut off | High | Fixed | Apartments New/Edit are now a page and a tab with no cut-off side panel | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-45](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-45) | [Contact > Side Panel] NRC field is free text instead of Myanmar NRC dropdowns | High | Fixed | NRC is 3 dropdowns + number field; Resident ID is not required on New EM, unlike Old EM | [fixed-contacts](fixed/fixed-contacts.md) |
| [EM-46](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-46) | [Settings > Zone and Building] Delete button should not exist | Medium | Fixed | Zones and Buildings have Edit only, no Delete, as in Old EM. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-47](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-47) | [Apartments] Add Owner/Tenant contacts to apartment does not match current EM | Highest | Fixed | Owners/Tenants Add More flow and layout match Old EM; New EM has an extra Delete apartment button | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-48](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-48) | [Apartments > Invoice tab] Tab count shows paid + unpaid invoices and loads late | Medium | Fixed | Tab shows Invoices (6) = 5 Unpaid + 1 Partially paid, immediately on open | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-49](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-49) | [Invoices / Debit Note] Excel export of list does not work | Highest | Fixed | Excel creates a DONE job with a `presigned_url`; download works through the S3 link (file content not opened) | [fixed-invoices](fixed/fixed-invoices.md) |
| [EM-50](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-50) | [UO > Zone filter] Disabled zones are displayed | Medium | Fixed | UO Zone filter lists only Enable zones | [fixed-uo](fixed/fixed-uo.md) |
| [EM-51](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-51) | [EM > Zone filter] Disabled zones are displayed | Medium | Fixed | EM Zone filter lists only Enable zones | [fixed-em](fixed/fixed-em.md) |
| [EM-52](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-52) | [Apartments > Zone filter] Disabled zones are displayed | Medium | Fixed | Apartments Zone filter lists only Enable zones | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-53](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-53) | [Invoices / Debit Note > Advance filter] Layout and fields differ from current EM | Medium | Fixed | Advance Filter matches Old EM; no overlap at 1000px / 700px | [fixed-invoices](fixed/fixed-invoices.md) |
| [EM-54](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-54) | [EM > Search] Search behaviour and UI differ from current EM | Medium | Fixed | Filter bar and columns match; the extra buttons differ; keyword search not tried (no data for 11/2026) | [fixed-em](fixed/fixed-em.md) |
| [EM-56](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-56) | [Settings > Building] Duplicate building records can be created | High | Fixed | A duplicate building name in the same zone is blocked: Building Name Already Exists. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-57](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-57) | [Settings > Currency] Required fields missing in currency creation (e.g. Currency Status) | Medium | Fixed | Create Currency has Currencies, Name, Code, Symbol, Status, as in Old EM. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-58](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-58) | [TC_Setting_28] Check areas fail after creating a new payment method | High | Fixed | A newly created payment method is listed in the Cash & Bank Account form. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-59](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-59) | [Cash Outflow] Extra Payment Method and Location fields not in current EM | High | Fixed | Form no longer has Payment Method / Location | [fixed-cash-outflow](fixed/fixed-cash-outflow.md) |
| [EM-60](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-60) | [Settings > Account Classification] Manage Type section is missing | High | Fixed | Account Classification has Manage Type (noted: New EM also has Delete on Payment Method and Bank). | [fixed-settings](fixed/fixed-settings.md) |
| [EM-61](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-61) | [Cash Transfer] Extra fields (Amount Received MMK, Conversion Rate, Currency, Location) not in current EM | Highest | Fixed | The 4 extra fields are gone | [fixed-cash-transfer](fixed/fixed-cash-transfer.md) |
| [EM-62](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-62) | [Side Panel] Roles, Cash & Bank Account, Currency, Payment Method, Staff forms should be page views | High | Fixed | Roles, Cash & Bank, Currency, Payment Method and Staff all open as pages. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-63](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-63) | [Settings > Staff] Phone number field missing in staff creation form | Medium | Fixed | Create Staff has Phone (code +95). | [fixed-settings](fixed/fixed-settings.md) |
| [EM-64](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-64) | [Settings > Staff] Status shown as Enable/Disable instead of Activate/Deactivate | Low | Fixed | Staff status is displayed as Activate / Deactivate. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-65](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-65) | [Settings > Staff] Reset Password flow differs from current EM | Medium | Fixed | Edit Staff uses 'Click to change password', as in Old EM. | [fixed-settings](fixed/fixed-settings.md) |
| [EM-66](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-66) | [Apartments > Create Apartment] Full Name not updated after selecting Zone and Building | Medium | Fixed | Full Name is generated as Building-Unit from the selections | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-67](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-67) | [Apartments > Create Apartment] Additional "Name (optional)" field should not be displayed | Medium | Fixed | "Name (optional)" is gone; New EM has no Status field, unlike Old EM | [fixed-apartments](fixed/fixed-apartments.md) |
| [EM-68](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-68) | [Apartments > Deposit > Add Deposit] Error on Post; deposit is not created | Highest | Fixed | Add Deposit is created (RV-00075 500 Ks, RV-00077 1 Ks); balance 501.00. | [fixed-deposit](fixed/fixed-deposit.md) |
| [EM-69](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-69) | [Cash & Bank Account > List] List does not match current EM UAT | Medium | Fixed | The list matches Old EM (columns, content, Edit Initial Balance). | [fixed-accounts](fixed/fixed-accounts.md) |
| [EM-70](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-70) | [Cash & Bank Account > New > Create New Cash Account] Create UI does not match current EM UAT | Highest | Fixed | Code removed; CASH has Name, Currency, Initial Balance, Payment Method, Description (Payment Method is still a checkbox list). | [fixed-accounts](fixed/fixed-accounts.md) |
| [EM-71](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-71) | [Cash & Bank Account > New > Create New Bank Account] Create UI does not match current EM UAT | Highest | Fixed | Code removed; BANK shows Bank Name, Account Number, Enable Overdraft (Payment Method is still a checkbox list). | [fixed-accounts](fixed/fixed-accounts.md) |
| [EM-77](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-77) | [Apartments > Wallet > Wallet Recharge] Redirects to Wallet Operations instead of apartment wallet | Medium | Fixed | After Recharge the user returns to Apartment › Wallet with the updated balance (RV-00078, 960.99 Ks). | [fixed-wallet](fixed/fixed-wallet.md) |
| [EM-78](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-78) | [Apartments > Wallet > Wallet Transfer] "Transfer To" is free text instead of apartment dropdown | Medium | Fixed | "Transfer to *" is an apartment dropdown. | [fixed-wallet](fixed/fixed-wallet.md) |
| [EM-79](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-79) | [Apartments > Wallet > Wallet Transfer] Transfer fails with a valid destination apartment | Highest | Fixed | Transfer of 10 Ks succeeds (WT-00006). | [fixed-wallet](fixed/fixed-wallet.md) |
| [EM-80](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-80) | [Apartments > Wallet > Wallet Transfer] Location field should not be displayed | Medium | Fixed | The Wallet Transfer form has no Location field. | [fixed-wallet](fixed/fixed-wallet.md) |
| [EM-81](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-81) | [Apartments > Wallet > Wallet Refund] Admin with self-approval cannot approve refund | High | Fixed | Refund is self-approved (PV-00027) and the wallet is reduced by 50. | [fixed-wallet](fixed/fixed-wallet.md) |
| [EM-82](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-82) | [UO > Import > Download CSV template] Apartments of selected Zone/Building not included | Highest | Fixed | Template contains the apartments of the selected building; header has a duplicate Electricity (YESC) column | [fixed-uo-import](fixed/fixed-uo-import.md) |
| [EM-84](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-84) | [Cash Received > Unknown Receipt Allocation] Amount not credited to wallet when apartment has no open invoices | Highest | Fixed | Remainder 919.99 goes to the wallet (run with an apartment that has 1 open invoice) | [fixed-cash-received](fixed/fixed-cash-received.md) |
| [EM-86](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-86) | [Cash Transfer] User with self-approval permission cannot approve own transfer | High | Fixed | Self-approved transfer #25 is POSTED (JV-00014) | [fixed-cash-transfer](fixed/fixed-cash-transfer.md) |
| [EM-87](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-87) | [Sign In > Forgot Your Password] Feature shown but not supported in current EM | Low | Fixed | Sign In page no longer has the link | [fixed-sign-in](fixed/fixed-sign-in.md) |
| [EM-88](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-88) | [Cash and Bank] Bank fields not shown when Type = Bank; Payment Method field missing | Highest | Fixed | Payment Method is present; BANK shows all bank fields. | [fixed-accounts](fixed/fixed-accounts.md) |
| [EM-89](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-89) | [Wallet / Deposit] Business logic not aligned with current EM; approval state should not be required | Highest | Fixed | Recharge and Add Deposit post immediately, with no approval. | [fixed-wallet](fixed/fixed-wallet.md) |
| [EM-90](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-90) | [UO] Self-approve does not work; UO cannot be approved to generate invoices | Highest | Fixed | Self-approving UO #18 produces invoice #148 | [fixed-uo](fixed/fixed-uo.md) |
| [EM-91](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-91) | [MFO] Self-approve does not work for Estate Management Fee (MFO) | Highest | Fixed | Self-approving EM #12 produces invoice #147 | [fixed-em](fixed/fixed-em.md) |
| [EM-106](https://zeyalabs-team-a83df6me.atlassian.net/browse/EM-106) | [Reports > Cash Received] Unknown receipts are missing from the report | Medium | Fixed | Unknown receipts (RV-00061, RV-00062, RV-00073) are in Reports › Cash Received. | [fixed-reports](fixed/fixed-reports.md) |
