# 01 · Login & Authentication

[← Test case index](../README.md)

<!-- generated:summary (npm run cases:build) — edit the test cases below, not this block -->
**Test cases:** 1  
**Priority:** P1 1 · P2 0 · P3 0 · **★ Critical:** 1 · **Smoke:** 1 · **E2E:** 0 · **Auto:** 1 · **Manual:** 0

## Summary

| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |
|---|---|---|---|---|---|---|---|
| [AUTH-001](#-auth-001--login-with-valid-credentials-lands-on-the-home-page) | ★ Login with valid credentials lands on the home page | Login | P1 | Smoke · Regression | Auto-UI | Active |  |
<!-- /generated:summary -->

## Test cases

### Login

#### ★ AUTH-001 · Login with valid credentials lands on the home page

| Priority | Suites | Automation | Status | Source |
|---|---|---|---|---|
| P1 | Smoke · Regression | Auto-UI | Active | Example — replace with the real source |

**Preconditions:**

1. A user account with known credentials exists.

**Test data:**

1. Email = "<ADMIN_EMAIL>"
2. Password = "<ADMIN_PASSWORD>"

**Steps:**

1. Open the login page.
2. Enter the email and password.
3. Click "Sign in".

**Expected result:**

1. The user lands on the home page and sees their name in the header.

---
