# 01 · Login & Authentication

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 6 (+1 data-variant rows)  
**Priority:** P1 1 · P2 2 · P3 3 · **★ Critical:** 1 · **Smoke:** 1 · **E2E:** 0 · **Auto:** 6 · **Manual:** 0 · **Review:** 3

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [AUTH-001](#-auth-001--login-with-valid-credentials-lands-on-dashboard) | ★ Login with valid credentials lands on dashboard | Login | P1 | Smoke · Regression | Auto-UI | Active |  |
| [AUTH-002](#auth-002--login-rejected-for-unregistered-email) | Login rejected for unregistered email | Login validation | P2 | Regression | Auto-UI | Review |  |
| [AUTH-003](#auth-003--login-rejected-for-invalid-password--invalid-credentials) | Login rejected for invalid password / invalid credentials | Login validation | P2 | Regression | Auto-UI | Active | 2 |
| [AUTH-004](#auth-004--required-field-error-when-email-is-blank) | Required-field error when email is blank | Login validation | P3 | Regression | Auto-UI | Active |  |
| [AUTH-005](#auth-005--required-field-error-when-password-is-blank) | Required-field error when password is blank | Login validation | P3 | Regression | Auto-UI | Review |  |
| [AUTH-006](#auth-006--error-when-password-is-shorter-than-6-characters) | Error when password is shorter than 6 characters | Login validation | P3 | Regression | Auto-UI | Review |  |
<!-- /generated:summary -->

## Test cases

### Login

#### ★ AUTH-001 · Login with valid credentials lands on dashboard

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI | Active | Login r5 (TC_Login_001) |

**Preconditions:**

User must have a valid account with  
known credentials exists.  

**Test data:**

1. Email = "<ADMIN_EMAIL>"
2. Password = "<VALID_PASSWORD>"

**Steps:**

1. Go to the webisite.
2. Type valid Email address.
3. Type valid Password.
4. Click "Sign in" button.

**Expected result:**

1. "Logged in Successfully" alert will be shown.
2. Verify that the user is successfully logged
   in and directed to the application's main dashboard or landing page.

---

### Login validation

#### AUTH-002 · Login rejected for unregistered email

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Review — Expected message "Email is not a valid email address" for a well-formed but unregistered email; confirm intended message | Login r6 (TC_Login_002) |

**Preconditions:**

User must have a valid account with  
known credentials exists.  

**Test data:**

1. Email = "superadmin@gmail.com"
2. Password = "<VALID_PASSWORD>"

**Steps:**

1. Go to the webisite.
2. Type invalid Email address.
3. Type valid Password.
4. Click "Sign in" button.

**Expected result:**

1. User can't login into system.
2. Error message "Email is not a valid email address" will be shown under username field.

---

#### AUTH-003 · Login rejected for invalid password / invalid credentials

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P2 | Regression | Auto-UI | Active | Login r7 (TC_Login_003) |

**Preconditions:**

User must have a valid account with  
known credentials exists.  

**Test data:**

1. Email = "<ADMIN_EMAIL>"
2. Password = "<INVALID_PASSWORD>"

**Steps:**

1. Go to the webisite.
2. Type valid Email address.
3. Type invalid Password.
4. Click "Sign in" button.

**Expected result:**

1. User can't login into system.
2. Error message "Email or Password is Invalid" will be shown under password field.

**Data variants (2 incl. base) — run as one data-driven test:**

| # | Variant | Source | Note |
|---|---|---|---|
| 1 | (base) User can't login with invalid password | Login r7 (TC_Login_003) | |
| 2 | Email=invalid; Password=invalid | Login r8 (TC_Login_004) |  |

---

#### AUTH-004 · Required-field error when email is blank

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Active | Login r9 (TC_Login_005) |

**Preconditions:**

User must have a valid account with  
known credentials exists.  

**Test data:**

1. Password = "<VALID_PASSWORD>"

**Steps:**

1. Go to the webisite.
2. Do not type Email address
3. Type Password.
4. Click "Sign in" button.

**Expected result:**

1. User can't login into system.
2. "Email is required."
   will be shown under the email text box.

---

#### AUTH-005 · Required-field error when password is blank

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Review — Expected says message appears under the email text box; likely should be password field | Login r10 (TC_Login_006) |

**Preconditions:**

User must have a valid account with  
known credentials exists.  

**Test data:**

1. Email = "<ADMIN_EMAIL>"

**Steps:**

1. Go to the webisite.
2. Type Email address.
3. Do not type Password.
4. Click "Sign in" button.

**Expected result:**

1. User can't login into system.
2. "Password is required"
   will be shown under the email text box.

---

#### AUTH-006 · Error when password is shorter than 6 characters

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P3 | Regression | Auto-UI | Review — Step 3 says "Do not type Password" but data gives 5-char password; contradictory steps | Login r11 (TC_Login_007) |

**Preconditions:**

User must have a valid account with  
known credentials exists.  

**Test data:**

1. Email = "<ADMIN_EMAIL>"
2. Password = "psw12"

**Steps:**

1. Go to the webisite..
2. Type Email address
3. Do not type Password.
4. Click "Sign in" button.

**Expected result:**

1. User can't login into system.
2. "The password must be at least 6 characters."
   will be shown under password field.

---
