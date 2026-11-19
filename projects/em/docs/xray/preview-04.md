# Xray preview · Invoice & Debit Note

1 Test(s) → project EM, type Test (Manual).

## INV-009 · Invoice create - required field validation (apartment / item description / category)

**Labels:** `TC_Inv_009` `Invoice-Debit-Note_r13` `TC_Inv_010` `Invoice-Debit-Note_r14` `TC_Inv_011` `Invoice-Debit-Note_r15`

**Description (Jira):**

```
*Repo case:* INV-009
*Module / sub-feature:* Invoice & Debit Note / Invoice validation
*Priority:* P3   *Suites:* Regression
*Automation:* Auto-UI
*Status:* Active
*Excel source:* Invoice-Debit Note r13 (TC_Inv_009)

h3. Preconditions
# User needs to login the system first.

h3. Test data
# Categories = "Maintenance Services"
# Payment terms = "+7days"
# Item Description = "Maintenance fees"
# Tax type = "+3%tax"
# Unit = 2
# Gross price = 1500
# Discount = 10 ks

h3. Data variants
||#||Variant||Excel source||Expected result||Note||
|1|(base) Error message for not filling apartment fields in invoices.|Invoice-Debit Note r13 (TC_Inv_009)|"Apartment is required" error message under the Apartment box.| |
|2|Missing field=Item description|Invoice-Debit Note r14 (TC_Inv_010)|"Item description is required" error message under the Item Description box.| |
|3|Missing field=Income category|Invoice-Debit Note r15 (TC_Inv_011)|"Category is required" error message under the Income Categories box.| |
```

**Steps:**

| # | Action | Data | Expected result |
|---|---|---|---|
| 1 | Click "Invoices / Debit Note" from left menu. |  |  |
| 2 | Click "Add invoice" button |  |  |
| 3 | Currency will be MMK and Date will be today.(default) |  |  |
| 4 | Fill the required fields but do not fill apartment. |  |  |
| 5 | Fill the Item Description, Tax Type, Unit, Gross Price and Discount (Amount or percentage) are added. Then , Discount price, Tax and Total fields are auto calculated. (Note. Discount field is optional.) |  |  |
| 6 | Click "Create" button |  | "Apartment is required" error message will be shown under the apartment box. |
| 7 | Variant 2: repeat the steps above with Missing field=Item description | Invoice-Debit Note r14 (TC_Inv_010) | "Item description is required" error message under the Item Description box. |
| 8 | Variant 3: repeat the steps above with Missing field=Income category | Invoice-Debit Note r15 (TC_Inv_011) | "Category is required" error message under the Income Categories box. |
