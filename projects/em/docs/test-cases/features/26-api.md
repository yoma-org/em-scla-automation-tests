# 26 · External API

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 27 (+48 data-variant rows)  
**Priority:** P1 11 · P2 14 · P3 2 · **★ Critical:** 11 · **Smoke:** 4 · **E2E:** 7 · **Auto:** 27 · **Manual:** 0 · **Review:** 6

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [API-001](#-api-001--get-access-token-with-valid-client-credentials) | ★ Get access token with valid client credentials | Auth token | P1 | Smoke · Regression | Auto-API | Active |  |
| [API-002](#-api-002--access-token-is-not-issued-for-invalid-credentials-401) | ★ Access token is not issued for invalid credentials (401) | Auth token | P1 | Smoke · Regression | Auto-API | Active |  |
| [API-003](#api-003--get-zone-and-building-listing-with-valid-token) | Get Zone and Building listing with valid token | Master data | P2 | Regression | Auto-API | Active |  |
| [API-004](#api-004--listing-endpoints-exclude-disabled-records--by-endpoint) | Listing endpoints exclude disabled records — by endpoint | Master data | P2 | Regression | Auto-API | Active | 2 |
| [API-005](#api-005--endpoint-returns-permission-denied-without-required-permission--by-endpoint) | Endpoint returns Permission Denied without required permission — by endpoint | Permission | P2 | Regression | Auto-API | Active | 16 |
| [API-006](#-api-006--endpoint-rejects-invalid-or-incomplete-token-401--by-endpoint) | ★ Endpoint rejects invalid or incomplete token (401) — by endpoint | Auth token | P1 | Regression | Auto-API | Active | 17 |
| [API-007](#api-007--get-locations-listing-with-valid-token) | Get Locations listing with valid token | Master data | P2 | Regression | Auto-API | Active |  |
| [API-008](#api-008--get-payment-options-payment-types-with-currencies-with-valid-token) | Get Payment Options (payment types with currencies) with valid token | Master data | P2 | Regression | Auto-API | Active |  |
| [API-009](#api-009--payment-options-exclude-disabled-payment-methodscurrencies) | Payment Options exclude disabled payment methods/currencies | Master data | P2 | Regression | Auto-API | Active |  |
| [API-010](#api-010--get-contact-detail-by-id-incl-ownedtenanted-apartments) | Get contact detail by ID incl. owned/tenanted apartments | Contact | P2 | Regression | Auto-API | Active |  |
| [API-011](#api-011--endpoint-rejects-invalid-identifierparameters-401--error--by-endpoint) | Endpoint rejects invalid identifier/parameters (401 + error) — by endpoint | Invalid input | P3 | Regression | Auto-API | Review | 10 |
| [API-012](#-api-012--get-unpaid-invoices-by-contact-id-owned-and-tenanted-apartments) | ★ Get unpaid invoices by contact ID (owned and tenanted apartments) | Contact | P1 | E2E · Regression | Auto-API | Active |  |
| [API-013](#-api-013--get-apartment-soa-by-apartment-and-month) | ★ Get Apartment SOA by apartment and month | Apartment | P1 | Smoke · E2E · Regression | Auto-API | Active |  |
| [API-014](#api-014--apartment-balance-endpoints-reject-invalid-apartmentmonth-200--error--by-endpoint) | Apartment balance endpoints reject invalid apartment/month (200 + error) — by endpoint | Invalid input | P3 | Regression | Auto-API | Review | 3 |
| [API-015](#api-015--apartment-balance-endpoints-return-error-for-disabled-apartment--by-endpoint) | Apartment balance endpoints return error for disabled apartment — by endpoint | Disabled apartment | P2 | Regression | Auto-API | Review | 3 |
| [API-016](#-api-016--get-apartment-wallet-by-apartment-and-month) | ★ Get Apartment wallet by apartment and month | Apartment | P1 | E2E · Regression | Auto-API | Active |  |
| [API-017](#-api-017--get-apartment-deposit-by-apartment-and-month) | ★ Get Apartment deposit by apartment and month | Apartment | P1 | E2E · Regression | Auto-API | Active |  |
| [API-018](#-api-018--get-unpaid-invoices-by-apartment) | ★ Get unpaid invoices by apartment | Apartment | P1 | E2E · Regression | Auto-API | Active |  |
| [API-019](#api-019--apartment-endpoints-return-401-for-disabled-apartment--by-endpoint) | Apartment endpoints return 401 for disabled apartment — by endpoint | Disabled apartment | P2 | Regression | Auto-API | Review | 2 |
| [API-020](#-api-020--get-ar-summary-by-apartment) | ★ Get AR summary by apartment | Apartment | P1 | Smoke · E2E · Regression | Auto-API | Active |  |
| [API-021](#api-021--get-invoice-by-invoicedn-number) | Get invoice by invoice/DN number | Invoice | P2 | Regression | Auto-API | Active |  |
| [API-022](#-api-022--make-full-payment-via-api-creates-rv-and-updates-invoice-status-and-ar) | ★ Make full payment via API creates RV and updates invoice status and AR | Make payment | P1 | E2E · Regression | Auto-API | Review |  |
| [API-023](#api-023--make-payment-rejects-invalid-invoicelocationmethodaccount) | Make payment rejects invalid invoice/location/method/account | Make payment | P2 | Regression | Auto-API | Review |  |
| [API-024](#-api-024--make-payment-without-payment-create-permission-returns-permission-denied) | ★ Make payment without Payment create permission returns Permission Denied | Make payment | P1 | Regression | Auto-API | Active |  |
| [API-025](#api-025--get-invoice-pdf-by-id) | Get invoice PDF by ID | PDF printouts | P2 | Regression | Auto-API | Active |  |
| [API-026](#api-026--get-receipt-pdf-rvjvcn-by-id) | Get receipt PDF (RV/JV/CN) by ID | PDF printouts | P2 | Regression | Auto-API | Active |  |
| [API-027](#api-027--get-apartment-statement-pdf-by-apartment-month-currency--by-statement-type) | Get apartment statement PDF by apartment, month, currency — by statement type | PDF printouts | P2 | Regression | Auto-API | Active | 3 |
<!-- /generated:summary -->

## Test cases

### Auth token

#### ★ API-001 · Get access token with valid client credentials

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-API | Active | API r4 (CMD_001) |

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Authentication is successful, and the authentication token is returned.

---

#### ★ API-002 · Access token is not issued for invalid credentials (401)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-API | Active | API r5 (CMD_002) |

**Preconditions:**

1. There is a environment and base url must be created
2. There must be a collection created

**Steps:**

1. Select method.
2. Select url link.
3. Enter invalid (or) uncomplete authentication token
4. Click "Send"

**Expected result:**

1. 401 status code will be return.
2. The access token is not issued, and error message will show.

---

### Master data

#### API-003 · Get Zone and Building listing with valid token

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r6 (CMD_003) |

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. All Zone listing with id and name will be shown with related building that include id and name too.

---

#### API-004 · Listing endpoints exclude disabled records — by endpoint

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r7 (CMD_004) |

**Preconditions:**

1. There is a environment and base url must be created
2. There must be a collection created
3. There must be at least one disable Zone (or) Building

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Only Enable Zone listings will be shown with related Enable buildings.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't see Disable Zone and Building data | API r7 (CMD_004) | |
| 2 | Endpoint=Locations | API r11 (CMD_008) |  |

---

### Permission

#### API-005 · Endpoint returns Permission Denied without required permission — by endpoint

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r8 (CMD_005) |

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Click "Send"

**Expected result:**

1. 401 status code will be return.
2. "Permission Denied" error message will show.

**Data variants (16 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't search Zone and Building without View permission for Zone and Building | API r8 (CMD_005) | |
| 2 | Endpoint=Locations; Permission=Location view | API r12 (CMD_009) |  |
| 3 | Endpoint=Payment Options; Permission=Payment create | API r16 (CMD_013) |  |
| 4 | Endpoint=Contact detail; Permission=Contacts/Apartments view | API r24 (CT_003) |  |
| 5 | Endpoint=Unpaid invoices by contact; Permission=Invoice view | API r28 (CT_007) |  |
| 6 | Endpoint=Apartment SOA; Permission=SOA view | API r37 (APM-004) |  |
| 7 | Endpoint=Apartment wallet; Permission=Wallet view | API r42 (APM-009) |  |
| 8 | Endpoint=Apartment deposit; Permission=Deposit view | API r47 (APM-014) |  |
| 9 | Endpoint=Unpaid invoices by apartment; Permission=Invoice view | API r52 (APM-019) |  |
| 10 | Endpoint=AR summary by apartment; Permission=Summary view | API r57 (APM-024) |  |
| 11 | Endpoint=Invoice by number; Permission=Invoice view | API r65 (INV_003) |  |
| 12 | Endpoint=Invoice PDF; Permission=Invoice PDF access | API r77 (PDF_003) |  |
| 13 | Endpoint=Receipt PDF; Permission=Receipt PDF access | API r81 (PDF_007) |  |
| 14 | Endpoint=Apartment SOA PDF; Permission=SOA PDF access | API r85 (PDF_011) |  |
| 15 | Endpoint=Apartment wallet PDF; Permission=Wallet PDF access | API r89 (PDF_015) |  |
| 16 | Endpoint=Apartment deposit PDF; Permission=Deposit PDF access | API r93 (PDF_019) |  |

---

### Auth token

#### ★ API-006 · Endpoint rejects invalid or incomplete token (401) — by endpoint

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active | API r9 (CMD_006) |

**Preconditions:**

1. There is a environment and base url must be created
2. There must be a collection created

**Steps:**

1. Select method.
2. Select url link.
3. Enter invalid (or) uncomplete authentication token
4. Click "Send"

**Expected result:**

1. 401 status code will be return.
2. Zone and building list is not issued, and error message will show.

**Data variants (17 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't get Zone and Building listing with invalid credentials | API r9 (CMD_006) | |
| 2 | Endpoint=Locations | API r13 (CMD_010) |  |
| 3 | Endpoint=Payment Options | API r17 (CMD_014) |  |
| 4 | Endpoint=Contact detail | API r25 (CT_004) |  |
| 5 | Endpoint=Unpaid invoices by contact | API r29 (CT_008) |  |
| 6 | Endpoint=Apartment SOA | API r38 (APM-005) |  |
| 7 | Endpoint=Apartment wallet | API r43 (APM-010) |  |
| 8 | Endpoint=Apartment deposit | API r48 (APM-015) |  |
| 9 | Endpoint=Unpaid invoices by apartment | API r53 (APM-020) |  |
| 10 | Endpoint=AR summary by apartment | API r58 (APM-025) |  |
| 11 | Endpoint=Invoice by number | API r66 (INV_004) |  |
| 12 | Endpoint=Make payment | API r70 (INV_008) |  |
| 13 | Endpoint=Invoice PDF | API r78 (PDF_004) |  |
| 14 | Endpoint=Receipt PDF | API r82 (PDF_008) |  |
| 15 | Endpoint=Apartment SOA PDF | API r86 (PDF_012) |  |
| 16 | Endpoint=Apartment wallet PDF | API r90 (PDF_016) |  |
| 17 | Endpoint=Apartment deposit PDF | API r94 (PDF_020) |  |

---

### Master data

#### API-007 · Get Locations listing with valid token

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r10 (CMD_007) |

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. All Location listing with id and name will be shown .

---

#### API-008 · Get Payment Options (payment types with currencies) with valid token

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r14 (CMD_011) |

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. All Payment_Options with Payment Type will be shown with related Currency that include name and id too.

---

#### API-009 · Payment Options exclude disabled payment methods/currencies

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r15 (CMD_012) |

**Preconditions:**

1. There is a environment and base url must be created
2. There must be a collection created
3. There must be at least one disable Payment Method (or) Currency

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Can only see bank and cash accounts to enable payment methods and currencies.

---

### Contact

#### API-010 · Get contact detail by ID incl. owned/tenanted apartments

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r22 (CT_001) |

**Scenario group:** Contact

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. id = 12345678

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "ID" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. User can view the relevant contact details of the searched id.
3. User can view owned and tenanted apartment list.

---

### Invalid input

#### API-011 · Endpoint rejects invalid identifier/parameters (401 + error) — by endpoint

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-API | Review — Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract | API r23 (CT_002) |

**Scenario group:** Contact

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. id = 12345678910

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "ID" in body feild.
5. Click "Send"

**Expected result:**

1. 401 status code will be return.
2. Contact Detail is not issued, and error message 'ID is invalid' will show.

**Data variants (10 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't search contact detail by invalid ID | API r23 (CT_002) | |
| 2 | Endpoint=Unpaid invoices by contact; id=invalid | API r27 (CT_006) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 3 | Endpoint=Unpaid invoices by apartment; apartment=invalid | API r50 (APM-017) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 4 | Endpoint=AR summary by apartment; apartment=invalid | API r55 (APM-022) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 5 | Endpoint=Invoice by number; id=invalid | API r64 (INV_002) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 6 | Endpoint=Invoice PDF; id=invalid | API r76 (PDF_002) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 7 | Endpoint=Receipt PDF; id=invalid RV/JV/CN | API r80 (PDF_006) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 8 | Endpoint=Apartment SOA PDF; params=invalid | API r84 (PDF_010) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 9 | Endpoint=Apartment wallet PDF; params=invalid | API r88 (PDF_014) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 10 | Endpoint=Apartment deposit PDF; params=invalid | API r92 (PDF_018) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |

---

### Contact

#### ★ API-012 · Get unpaid invoices by contact ID (owned and tenanted apartments)

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active | API r26 (CT_005) |

**Scenario group:** Contact

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. id = 12345678

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "ID" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. User can see all unpaid invoices data of his owned and tenanted apartment.

---

### Apartment

#### ★ API-013 · Get Apartment SOA by apartment and month

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-API | Active — Remark: API docs may show small rounding differences on large amounts; assert against direct API response | API r34 (APM-001) |

**Scenario group:** Apartment

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment=A1-001
2. month=2024-03

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "apartment" and "month" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. The searched result regarding to the search keyword regarding to Apartment SOA can be seen as a list.

> **Source comments:** In API Documentation, Larger amounts may result in slight point discrepancies. But, calling directly the API will return the precise amount.

---

### Invalid input

#### API-014 · Apartment balance endpoints reject invalid apartment/month (200 + error) — by endpoint

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-API | Review — Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract | API r35 (APM-002) |

**Scenario group:** Apartment

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment=A1-00001
2. month=2024-03
   (or)
1. apartment=A1-001
2. month=2024-0356

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "apartment" and "month" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Apartment SOA is not issued, and error message will show.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't search Apartment SOA by invalid apartment name (or) month date | API r35 (APM-002) | |
| 2 | Endpoint=Apartment wallet | API r40 (APM-007) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 3 | Endpoint=Apartment deposit | API r45 (APM-012) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |

---

### Disabled apartment

#### API-015 · Apartment balance endpoints return error for disabled apartment — by endpoint

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Review — Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract | API r36 (APM-003) |

**Scenario group:** Apartment

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment=A1-002(Disable)
2. month=2024-03

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "apartment" and "month" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Apartment SOA is not issued, and error message will show.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't search Apartment SOA with Disable Apartment | API r36 (APM-003) | |
| 2 | Endpoint=Apartment wallet | API r41 (APM-008) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |
| 3 | Endpoint=Apartment deposit | API r46 (APM-013) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |

---

### Apartment

#### ★ API-016 · Get Apartment wallet by apartment and month

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active — Remark: API docs may show small rounding differences on large amounts; assert against direct API response | API r39 (APM-006) |

**Scenario group:** Apartment

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment=A1-001
2. month=2024-03

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "apartment" and "month" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. The searched result regarding to the search keyword regarding to Apartment Wallet can be seen as a list.

> **Source comments:** In API Documentation, Larger amounts may result in slight point discrepancies. But, calling directly the API will return the precise amount.

---

#### ★ API-017 · Get Apartment deposit by apartment and month

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active — Remark: API docs may show small rounding differences on large amounts; assert against direct API response | API r44 (APM-011) |

**Scenario group:** Apartment

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment=A1-001
2. month=2024-03

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "apartment" and "month" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. The searched result regarding to the search keyword regarding to Apartment Deposit can be seen as a list.

> **Source comments:** In API Documentation, Larger amounts may result in slight point discrepancies. But, calling directly the API will return the precise amount.

---

#### ★ API-018 · Get unpaid invoices by apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Active — Remark: API docs may show small rounding differences on large amounts; assert against direct API response | API r49 (APM-016) |

**Scenario group:** Apartment

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment=A1-001

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "apartment" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. User can see all unpaid invoices data of related apartment.

> **Source comments:** In API Documentation, Larger amounts may result in slight point discrepancies. But, calling directly the API will return the precise amount.

---

### Disabled apartment

#### API-019 · Apartment endpoints return 401 for disabled apartment — by endpoint

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Review — Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract | API r51 (APM-018) |

**Scenario group:** Apartment

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment=A1-002(Disable)

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "apartment" in body feild.
5. Click "Send"

**Expected result:**

1. 401 status code will be return.
2. Unpaid Invoice by Apartment is not issued, and error message will show.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't search Apartment Unpaid Invoice with Disable Apartment | API r51 (APM-018) | |
| 2 | Endpoint=AR summary by apartment | API r56 (APM-023) | Review; Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract |

---

### Apartment

#### ★ API-020 · Get AR summary by apartment

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · E2E · Regression | Auto-API | Active — Remark: API docs may show small rounding differences on large amounts; assert against direct API response | API r54 (APM-021) |

**Scenario group:** Apartment

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment=A1-001

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "apartment" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. The searched result regarding to the search keyword regarding to Accounts Receivable Summary By
   Apartment can be seen as a list.

> **Source comments:** In API Documentation, Larger amounts may result in slight point discrepancies. But, calling directly the API will return the precise amount.

---

### Invoice

#### API-021 · Get invoice by invoice/DN number

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r63 (INV_001) |

**Scenario group:** Invoice

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. id=Inv-202404-00061

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "inv / dn number" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. User can view the relevant invoice details of the searched id.

---

### Make payment

#### ★ API-022 · Make full payment via API creates RV and updates invoice status and AR

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | E2E · Regression | Auto-API | Review — ZL: new EM does not yet create an RV in Cash Received for the invoice (defect filed) | API r67 (INV_005) |

**Scenario group:** Invoice

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

id = Inv-202403-00093  
location_id = 3  
payment_method = cash  
account_id = 4  
amount = 2000462.25  
remark = "make payment from API"  

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter required data in request body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Transaction Added Successfully in make payment.
3. New RV code created and will be showed in Cash Received list
4. Invoive status and AR amount will be updated

> **Source comments:** The new EM doesn't create an RV in Cash Received for the named invoice yet. Ours to fix, filed.

---

#### API-023 · Make payment rejects invalid invoice/location/method/account

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Review — Status code inconsistent across endpoints (401 vs 200+error) for invalid input/disabled apartment; confirm API contract | API r68 (INV_006) |

**Scenario group:** Invoice

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

id = Inv-202403-93  
location_id = 78  
payment_method = cashbank  
account_id = 456  
amount = 2000462.25  

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter required data in request body feild.
5. Click "Send"

**Expected result:**

1. 401 status code will be return.
2. Make Payment is not issued, and error message will show.

---

#### ★ API-024 · Make payment without Payment create permission returns Permission Denied

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Regression | Auto-API | Active | API r69 (INV_007) |

**Scenario group:** Invoice

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

id = Inv-202403-00093  
location_id = 3  
payment_method = cash  
account_id = 4  
amount = 2000462.25  
remark = "make payment from API"  

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter required data in request body feild.
5. Click "Send"

**Expected result:**

1. 401 status code will be return.
2. "Permission Denied" error message will show.

---

### PDF printouts

#### API-025 · Get invoice PDF by ID

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r75 (PDF_001) |

**Scenario group:** PDF Printouts

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. id = Inv-202404-00063

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "ID" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Invoice PDF can be seen.

---

#### API-026 · Get receipt PDF (RV/JV/CN) by ID

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r79 (PDF_005) |

**Scenario group:** PDF Printouts

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. id = RV-00001 / JV-00001 / CN-00001

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter "ID" in body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Receipt PDF can be seen.

---

#### API-027 · Get apartment statement PDF by apartment, month, currency — by statement type

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-API | Active | API r83 (PDF_009) |

**Scenario group:** PDF Printouts

**Preconditions:**

1. User credentials are valid
2. There is a environment and base url must be created
3. There must be a collection created

**Test data:**

1. apartment = A1 - 001
2. month = 2024-03
3. currency = MMK

**Steps:**

1. Select method.
2. Select url link.
3. Enter an authentication token
4. Enter required data in request body feild.
5. Click "Send"

**Expected result:**

1. 200 status code will be return.
2. Apartment SOA PDF can be seen.

**Data variants (3 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can Printouts Apartment SOA PDF by valid Parameters | API r83 (PDF_009) | |
| 2 | Statement=Wallet | API r87 (PDF_013) |  |
| 3 | Statement=Deposit | API r91 (PDF_017) |  |

---
