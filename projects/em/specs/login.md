# 🔐 Login Test Plan

> **NEW EM · UAT** · https://uat.newem.ted.synergy.yomaland360.com/login
> Source cases: [`01-login.md`](../docs/test-cases/features/01-login.md) · Discovery: 2026-10-15

**Contents:** [Summary](#summary) · [Bugs to report](#bugs-to-report) · [Open questions](#open-questions) · [1. Login cases](#1-login-cases) · [2. Proposed gaps](#2-proposed-gaps) · [Reference](#reference)

**Legend:** ✅ Matches · 🐞 Bug · ⏳ Not run yet · 🧪 Needs a mock · ⛔ Not testable

---

## Summary

**Rules for this plan**

- **The old EM is the expected behaviour.** The case text is kept as written. When the new EM behaves differently, the test fails and that is a **bug**.
- **Credentials come from `.env`**, never from the case text: `ADMIN_EMAIL` / `ADMIN_PASSWORD` (other roles: `<ROLE>_EMAIL` / `<ROLE>_PASSWORD`, see `.env.example`).
- Once a bug is confirmed on UAT and logged, mark that test `test.fail()` with the bug reference, so it alerts when the bug is fixed.

| ✅ Matches | 🐞 Bug | ⏳ Not run yet |
|:---:|:---:|:---:|
| **0** | **6** | **1** |

| # | Case | Priority | Status | What fails |
|---|---|:---:|---|---|
| 1.1 | [AUTH-001](#auth-001) ★ Login with valid credentials | P1 | ⏳ | Run with `.env` credentials; toast wording likely a bug |
| 1.2 | [AUTH-002](#auth-002) Unregistered email | P2 | 🐞 | Generic form-level message, not under the email field |
| 1.3 | [AUTH-003](#auth-003) Invalid password | P2 | 🐞 | Generic form-level message, not under the password field |
| 1.4 | [AUTH-003 variant](#auth-003-variant) Both invalid | P2 | 🐞 | Same as AUTH-003 |
| 1.5 | [AUTH-004](#auth-004) Blank email | P3 | 🐞 | Wording: "Email address is required." |
| 1.6 | [AUTH-005](#auth-005) Blank password | P3 | 🐞 | Wording: trailing period |
| 1.7 | [AUTH-006](#auth-006) Password < 6 chars | P3 | 🐞 | 6-character rule is missing |

---

## Bugs to report

New EM behaviour that differs from the old EM. Replace the `BUG-LOGIN-xx` label with the tracker key once logged.

| Bug | Expected (old EM) | Actual (new EM) | Case |
|---|---|---|---|
| BUG-LOGIN-01 | "Email is not a valid email address" under the email field | Generic form-level "Check the email and password, then try again." | AUTH-002 |
| BUG-LOGIN-02 | "Email or Password is Invalid" under the password field | Generic form-level "Check the email and password, then try again." | AUTH-003 (+ variant) |
| BUG-LOGIN-03 | "Email is required." | "Email address is required." | AUTH-004 |
| BUG-LOGIN-04 | "Password is required" | "Password is required." | AUTH-005 |
| BUG-LOGIN-05 | "The password must be at least 6 characters." | No length check; request sent, generic 401 message | AUTH-006 |
| BUG-LOGIN-06 | Email format is validated ("Email is not a valid email address") | `not-an-email` gets no format error | GAP-LOGIN-08 |
| BUG-LOGIN-07 | "Logged in Successfully" | "Signed in successfully." (from page code, confirm on run) | AUTH-001 |
| BUG-LOGIN-08 | n/a | `favicon.ico` returns 404 (minor) | none |

---

## Open questions

Only things the old EM does not answer.

| # | Question | Affects |
|:---:|---|---|
| 1 | Empty submit: the new EM shows the email error first, the password error only on the next submit. What did the old EM do? | AUTH-004 |
| 2 | The toggle keeps the label "Show characters" in both states. Accept, or a11y bug? | GAP-01 |
| 3 | Rate-limit thresholds? Is the 30 s countdown fixed? Will captcha be enabled on UAT? | GAP-03, 06 |
| 4 | Need an account with `password_change_required` (add to `.env`) and a mailbox for forgot-password. | GAP-02, 04 |
| 5 | Fix wording in `01-login.md`: typo "webisite", AUTH-006 step 3, AUTH-002's forbidden `superadmin@gmail.com`. | AUTH-002, 006 |

---

## 1. Login cases

**File:** `projects/em/tests/auth/login.spec.ts` · **Seed:** `projects/em/tests/seed.spec.ts`

<a id="auth-001"></a>

### 1.1 · AUTH-001 · Login with valid credentials lands on dashboard

| Tags | Source | Status |
|---|---|---|
| `@smoke` `@P1` `@critical` | TC_Login_001 | ⏳ Not run yet |

**Steps**

1. Go to /login. Type `ADMIN_EMAIL` into "Email address" and `ADMIN_PASSWORD` into "Password". Click "Sign in".

   - expect: "Logged in Successfully" alert is shown.
   - expect: The main dashboard opens.

**Expected vs actual** (actual read from page code, not run yet)

| | Expected (old EM) | Actual (new EM) |
|---|---|---|
| Message | "Logged in Successfully" alert | Toast "Signed in successfully." → BUG-LOGIN-07 |
| Landing | Main dashboard | `/dashboard` |

> 💡 The session is a cookie set by `POST /api/auth/login`. Accounts flagged `password_change_required` land on `/account/change-password` instead (GAP-LOGIN-04).

---

<a id="auth-002"></a>

### 1.2 · AUTH-002 · Login rejected for unregistered email

| Tags | Source | Status |
|---|---|---|
| `@P2` `@review` | TC_Login_002 (Review) | 🐞 BUG-LOGIN-01 |

**Steps**

1. Go to /login. Type a well-formed but unregistered email and any password. Click "Sign in".

   - expect: The user cannot log in and stays on /login.
   - expect: "Email is not a valid email address" is shown under the email field.

**Expected vs actual**

| | Expected (old EM) | Actual (new EM) |
|---|---|---|
| Message | "Email is not a valid email address" | "Check the email and password, then try again." |
| Where | Under the email field | Form-level alert above "Sign in" |
| Network | n/a | 401 `ERR_AUTH_INVALID_CREDENTIALS` |

> ⚠️ Use a fake address such as `at-discovery-nonexistent@example.com`, **never** the case's `superadmin@gmail.com`.

---

<a id="auth-003"></a>

### 1.3 · AUTH-003 · Login rejected for invalid password

| Tags | Source | Status |
|---|---|---|
| `@P2` | TC_Login_003 | 🐞 BUG-LOGIN-02 |

**Steps**

1. Go to /login. Type `ADMIN_EMAIL` and an invalid password. Click "Sign in".

   - expect: The user cannot log in.
   - expect: "Email or Password is Invalid" is shown under the password field.

**Expected vs actual**

| | Expected (old EM) | Actual (new EM) |
|---|---|---|
| Message | "Email or Password is Invalid" | "Check the email and password, then try again." |
| Where | Under the password field | Form-level alert |
| Other | n/a | 401; password keeps its value; no toast |

> 💡 Observed with a fake email only. Confirm with `ADMIN_EMAIL` on the first run.

---

<a id="auth-003-variant"></a>

### 1.4 · AUTH-003 variant · Email invalid + password invalid

| Tags | Source | Status |
|---|---|---|
| `@P2` | TC_Login_004 | 🐞 BUG-LOGIN-02 |

**Steps**

1. Go to /login. Type an invalid/unregistered email and an invalid password. Click "Sign in".

   - expect: The user cannot log in.
   - expect: "Email or Password is Invalid" is shown under the password field.

> 💡 Both observed attempts (`psw12`, and a 20-char random password) returned 401 with the generic alert.

---

<a id="auth-004"></a>

### 1.5 · AUTH-004 · Required-field error when email is blank

| Tags | Source | Status |
|---|---|---|
| `@P3` | TC_Login_005 | 🐞 BUG-LOGIN-03 |

**Steps**

1. Go to /login. Leave Email empty. Type a password. Click "Sign in".

   - expect: The user cannot log in.
   - expect: "Email is required." is shown under the email field.

**Expected vs actual**

| | Expected (old EM) | Actual (new EM) |
|---|---|---|
| Message | "Email is required." | "Email address is required." |
| Where | Under the email field | Under the email field ✅ (field focused, no network call) |

---

<a id="auth-005"></a>

### 1.6 · AUTH-005 · Required-field error when password is blank

| Tags | Source | Status |
|---|---|---|
| `@P3` `@review` | TC_Login_006 (Review) | 🐞 BUG-LOGIN-04 |

**Steps**

1. Go to /login. Type an email. Leave Password empty. Click "Sign in".

   - expect: The user cannot log in.
   - expect: "Password is required" is shown under the email field.

**Expected vs actual**

| | Expected (old EM) | Actual (new EM) |
|---|---|---|
| Message | "Password is required" | "Password is required." (trailing period) |
| Where | Under the email field (case flagged Review: probably wrong) | Under the password field |

> 💡 The location stays a Review question on the case text, not a bug.

---

<a id="auth-006"></a>

### 1.7 · AUTH-006 · Error when password is shorter than 6 characters

| Tags | Source | Status |
|---|---|---|
| `@P3` `@review` | TC_Login_007 (Review) | 🐞 BUG-LOGIN-05 |

**Steps**

1. Go to /login. Type an email and the 5-char password `psw12`. Click "Sign in".

   - expect: "The password must be at least 6 characters." is shown under the password field.

**Expected vs actual**

| | Expected (old EM) | Actual (new EM) |
|---|---|---|
| Behaviour | Client-side length check | No length check; the request is sent |
| Message | "The password must be at least 6 characters." | Generic "Check the email and password, then try again." (401) |

> 💡 The case's step 3 ("Do not type Password") contradicts its data; the data is followed.

---

## 2. Proposed gaps

Not canonical IDs until validated. **File:** `projects/em/tests/auth/login.spec.ts` · **Seed:** `projects/em/tests/seed.spec.ts`

| # | Gap | Topic | Testable now? |
|---|---|---|---|
| 2.1 | GAP-LOGIN-01 | Show/hide password toggle | ✅ Yes |
| 2.2 | GAP-LOGIN-02 | Forgot-password link and page | ✅ Yes (inspect only) |
| 2.3 | GAP-LOGIN-03 | Rate limiting | 🧪 Mock |
| 2.4 | GAP-LOGIN-04 | Forced password change redirect | 🧪 Mock, or a `.env` account |
| 2.5 | GAP-LOGIN-05 | Network failure | 🧪 Mock |
| 2.6 | GAP-LOGIN-06 | Optional captcha | ⛔ Not enabled |
| 2.7 | GAP-LOGIN-07 | Keyboard: Tab order, Enter submits | ✅ Yes |
| 2.8 | GAP-LOGIN-08 | Email format validation | 🐞 BUG-LOGIN-06 |
| 2.9 | GAP-LOGIN-09 | Same response for unknown email and wrong password | ✅ Yes (`.env` credentials) |
| 2.10 | GAP-LOGIN-10 | Redirects for /login and /dashboard | ✅ Yes (`.env` credentials) |

### 2.1 · GAP-LOGIN-01 · Show/hide password toggle

1. Type a password. Click "Show characters" twice.

   - expect: After the 1st click the input type is `text` and `aria-pressed=true`.
   - expect: After the 2nd click the input type is `password` and `aria-pressed=false`.

> 💡 The accessible name stays "Show characters" in both states (open question 2).

### 2.2 · GAP-LOGIN-02 · Forgot-password link and page

1. Click "Forgot your password?".

   - expect: URL is `/forgot-password`, title "Reset your password · EM Admin", h1 "Reset your password".
   - expect: Text "Enter your work email. If an account exists, we'll email a 6-digit code (valid for 10 minutes)."
   - expect: Textbox "Email address" (placeholder `staff@example.com`), button "Send code", link "Back to sign in" → `/login`.

> ⚠️ Never submit this form against shared UAT (it sends an email).

### 2.3 · GAP-LOGIN-03 · Rate limiting (`ERR_AUTH_RATE_LIMITED`)

1. Mock `POST /api/auth/login` with `page.route` to return 429 `{code: 'ERR_AUTH_RATE_LIMITED'}`. Submit the form.

   - expect: A 30-second countdown is shown (from page code, not observed live).

> ⚠️ Always mock. Never brute-force UAT.

### 2.4 · GAP-LOGIN-04 · Forced password change redirect

1. Log in with an account flagged `password_change_required` (from `.env`), or mock the response.

   - expect: Redirect to `/account/change-password` instead of `/dashboard`.

### 2.5 · GAP-LOGIN-05 · Network failure (`ERR_BFF_NETWORK`)

1. Abort `POST /api/auth/login` with `page.route`. Submit the form.

   - expect: A friendly error from `describeAuthProblem()` is shown. Record the exact text when mocking.

### 2.6 · GAP-LOGIN-06 · Optional captcha (Turnstile/hCaptcha)

1. When captcha is enabled, submit the form.

   - expect: The request body includes `captcha_token`.

> 💡 Not rendered on UAT now. Design the page object so it can wait for the widget.

### 2.7 · GAP-LOGIN-07 · Keyboard: Tab order and Enter to submit

1. Tab through Email, Password, Show characters, Sign in, Forgot link. Press Enter in the Password field.

   - expect: Focus moves in that order.
   - expect: Enter in the password field submits the form.

### 2.8 · GAP-LOGIN-08 · Email format validation

1. Type `not-an-email`, leave Password empty, click "Sign in".

   - expect: "Email is not a valid email address" is shown under the email field (old EM).

> 🐞 Fails on the new EM: no format error, only "Password is required." (BUG-LOGIN-06).

### 2.9 · GAP-LOGIN-09 · Same response for unknown email and wrong password

1. Submit an unknown email, then `ADMIN_EMAIL` with a wrong password. Compare the responses.

   - expect: Both return `ERR_AUTH_INVALID_CREDENTIALS` with the same message (no account enumeration).

### 2.10 · GAP-LOGIN-10 · Redirects for /login and /dashboard

1. Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then open `/login`.

   - expect: Redirect to `/dashboard`.

2. Without a session, open `/dashboard`.

   - expect: Redirect to `/login`.

---

## Reference

<details>
<summary><b>How the new EM login page behaves</b> (observed 2026-10-15)</summary>

**Page**
- Title "Sign in · EM Admin"; h1 "Welcome to EM", text "Sign in to continue", h2 "Sign in".
- Email input: `name=email`, `type=email`, accessible name "Email address", placeholder "Email".
- Password input: `name=password`, accessible name "Password".
- Toggle button "Show characters": `aria-pressed` and the input type switch; the label never changes.
- Button "Sign in"; link "Forgot your password?" → `/forgot-password`.

**Client-side validation** (the form has `noValidate`, so no browser bubbles)
- Empty submit shows **only** "Email address is required." first and focuses that field.
- With an email filled, the next submit shows "Password is required." under the password field.
- No email-format check: `not-an-email` gets no error.
- No minimum password length.

**Wrong credentials**
- `POST /api/auth/login` → 401 `{"code":"ERR_AUTH_INVALID_CREDENTIALS"}`.
- Form-level `role=alert` "Check the email and password, then try again." between the password field and the button.
- Not under a field, no `aria-invalid`, no toast. Same message for 5-char and 20-char passwords.

**Other**
- Enter in the password field submits the form.
- Only console error: `favicon.ico` 404.

**Discovery scope:** 2 failed logins with fake `at-discovery-nonexistent@example.com` (both 401). Forgot-password page inspected only, never submitted.

</details>

<details>
<summary><b>Suggested locators</b> (LoginPage)</summary>

| Element | Locator |
|---|---|
| Heading | `getByRole('heading', { name: 'Sign in', level: 2 })` |
| Email | `getByRole('textbox', { name: 'Email address' })` |
| Password | `getByRole('textbox', { name: 'Password' })`; fallback `locator('input[name=password]')` |
| Show password | `getByRole('button', { name: 'Show characters' })`; assert `aria-pressed` + input `type` |
| Submit | `getByRole('button', { name: 'Sign in' })` |
| Forgot link | `getByRole('link', { name: 'Forgot your password?' })` |
| Email error | `getByRole('alert').filter({ hasText: 'Email address is required.' })` |
| Password error | `getByRole('alert').filter({ hasText: 'Password is required.' })` |
| Form error | `getByRole('alert').filter({ hasText: 'Check the email and password' })` |
| Success toast | `getByRole('region', { name: /Notifications/ })` + `getByText('Signed in successfully.')` |

- Always filter alerts by text: the page also has an empty Next.js route-announcer `role=alert`.
- Forgot-password page: heading "Reset your password", textbox "Email address", button "Send code", link "Back to sign in".
- Ask devs for `data-testid` only if the alert filters prove flaky.

</details>
