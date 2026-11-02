# Features only New EM has

[← Sanity index](README.md)

Noticed while running the round-2 sanity pass. Old EM has no matching screen or function. Each item was used at least once (column "Tried"). None has its own test case yet.

| # | Feature | Where | Tried | Note |
|---|---|---|---|---|
| <a id="n-01"></a>N-01 | Approval confirmation dialog (dual approval) | Approving Invoice, PV, JV, UO, EM, Outflow | ✅ every approval in round 2 | Old approves in one click, or with "Are you sure?" |
| <a id="n-02"></a>N-02 | Mark a cheque Uncleared / Cleared after recording | Cash Received > RV detail | ✅ [SAN-RV-002](differences.md#san-rv-002) | Account balance unchanged (as specified). Old UAT has no way to change it |
| <a id="n-03"></a>N-03 | "Cheque status" chosen during Make Payment | Make Payment | ✅ SAN-DB-006, [SAN-MP-008](differences.md#san-mp-008) | Old has no such field |
| <a id="n-04"></a>N-04 | "All" tab plus status tabs, filter via URL | Accounts Receivable | ✅ SAN-AR-006 / 007 | Old opens on the Current tab by default |
| <a id="n-05"></a>N-05 | Links to Payments / Apartment Statement / Dunning | Accounts Receivable | Seen, not opened | |
| <a id="n-06"></a>N-06 | Per-apartment reconciliation table ("Reconciled") | AR Snapshot | Seen | 60 rows per apartment, column Reconciled = Yes |
| <a id="n-07"></a>N-07 | Inflow type filter, including funding and wallet | Recent Receipts | Seen | |
| <a id="n-08"></a>N-08 | "Assigned Unknown Received" button | Unknown Received | Seen | Old has it under Reports > Assigned Unknown Received Logs |
| <a id="n-09"></a>N-09 | Hint "Next period must start …" | New EM record | ✅ SAN-EM-001 | But From is not auto-filled ([BUG-21](bugs.md#bug-21)) |
| <a id="n-10"></a>N-10 | "Reason" for Meter Reset (rollover / replacement / …) | Meter Reset | ✅ SAN-MR-002 | Old has no reason |
| <a id="n-11"></a>N-11 | Error messages with a code (ERR_…) and "contact support" | Many forms | ✅ EM-05, UO-06, MR-02 | Wording uses internal terms (MFO, estate) |
| <a id="n-12"></a>N-12 | Search results grouped by type, with status, max 5 | Global search | ✅ SAN-SRCH-003 | |
| <a id="n-13"></a>N-13 | Balance check when approving a PV ("cannot go into overdraft") | Cash Outflow | ✅ SAN-PV-005 | Old also blocks, but only says "Insufficient Balance" |
| <a id="n-14"></a>N-14 | "Pay In Currency" field with a rate hint ("MMK for 1 USD, worked out from the two amounts") | Make Payment, Unknown assign | ✅ SAN-MP-011, SAN-UNK-007 | Old uses a "Pay in $" checkbox |
| <a id="n-15"></a>N-15 | Wallet Refund goes through the approval queue, with "No money has moved yet" | Wallet > Refund | ✅ SAN-DB-013 | Old also creates a PV draft, without the notice |
| <a id="n-16"></a>N-16 | NRC format hint, Create disabled while NRC is invalid | Contacts | ✅ SAN-CON-002 | Old only errors after clicking Create |

Not done yet: a full sweep of New's menu to list every New-only screen (Settings, Approvals, Documents). Worth a separate pass.
