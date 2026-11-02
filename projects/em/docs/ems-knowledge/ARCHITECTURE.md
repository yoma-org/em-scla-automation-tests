# Architecture

## em-backend: Laravel + Lucid architecture

It was built from an internal "Laravel Lucid Architecture Starter Kit" (laranex). The layers are:

```
app/Services/<Module>/          ← one module = one "service"
   Http/Controllers/            ← thin; calls a Feature
   Features/<X>Feature.php      ← one use case per HTTP endpoint
   Operations/<X>Operation.php  ← reusable multi-step business flow (often wraps a DB transaction)
   database/migrations/         ← THE SCHEMA LIVES HERE, per module
   routes/api.php
app/Domains/<Entity>/Jobs/      ← small single-purpose units (CreateXJob, IncreaseBalanceJob…)
app/Data/Models/                ← all Eloquent models (shared)
app/Enums/                      ← domain vocabulary
app/Traits/                     ← GenerateCodeNumber, GenerateInvoiceCode, HasAttachable, …
```

- Modules are registered in `config/core.php`. When `TOGGLE_APP_SERVICES=true` they load from
  the `application_services` DB table (cached), so a module can be switched off at runtime. If a
  route seems to be missing, run `php artisan cache:clear`.
- Key packages: Passport (auth tokens), spatie/permission (roles), spatie/query-builder,
  Horizon + Redis (queues), Scout (search), dompdf + pdf-merger (PDFs), maatwebsite/excel
  (imports/exports), owen-it/auditing (audit log), spatie/health, Pusher (notifications), S3 (files).
- API docs: Scribe (`php artisan scribe:generate`).
- **Responses are AES-encrypted** by the `ApiEncrypt` middleware into a `payload` field, and the
  frontend decrypts them in `src/libs/crypton`.
- File attachments use the `HasAttachable` trait with a polymorphic `files` table
  (`docs/AttachableFile.md`).
- Scheduler: health checks every minute, and `ar:snapshot` daily at 23:58.
- Tests: about 139 test files and about 270 test methods, mostly feature tests per module.

## em-web: Vue 3 portal

- Built from an internal "Portal Starter Kit" using PrimeVue with the Sakai admin template.
- `src/modules/<module>/`: account, accountReceivable, apartment, auth, cashOutflow,
  cashReceived, cashTransfer, contact, dashboard, estateManagement, invoices, meterReset, note,
  notification, reports, search, setting, utilityOperation, wallet.
- `src/libs/axios`: adds the Bearer token, **decrypts `payload`**, parses big-int IDs and shows
  success toasts automatically for non-GET requests.
- `src/libs/acl` + CASL: `$can('create', 'UO')` in templates, and `meta.subject/action` on routes.
- The auth token and user data are stored encrypted in Pinia/localStorage (`utils/encryptor.js`).
- i18n with vue-i18n. NRC township codes are hardcoded and get updated from time to time
  (e.g. the "13/KAKANA" commit).
- Env: `VITE_BASE_URL`.

## estate-billing-api

- A standard Laravel layout (Controllers → `app/Services/*Service.php`). It does **not** use Lucid.
- It has **no migrations of its own for the business tables**: it connects to the em-backend
  database and copies the models, enums and code-generation traits.
- Auth guard is `billing` (Passport, with tokens issued to the `ApiKey` model) plus
  spatie/permission per endpoint.
- Swagger docs via l5-swagger, protected by the `ApiDocumentationAuthCheck` middleware.

## Deployment and environments

- GitLab CI → Docker image → **AWS ECR** (`ap-southeast-1`, repo `ems/api`) → deployed by an
  **Ansible** playbook (`devops/apideploy-dev.yml`), which pulls the image and runs the API and
  Redis containers. Teleport `tbot` (`tbot.yaml`, `proxy.onenex.dev`) provides machine identity.
- The container runs PHP-FPM under supervisord (`docker-config/`).
- Branch flow: `develop` → `uat` → `preprod` → `master`. The UAT CI stages are commented out in
  `.gitlab-ci.yml`.
- The dev API host pattern is `*.dev.onenex.dev`. OneNex appears to be the vendor that built it.
- Infrastructure lives in the separate *Standard EM IaC Terraform* repo, which wasn't scanned. Commits like
  "sync from standard-em/uat" suggest there's a **"Standard EM" product line** that this
  project was forked from or kept in sync with.

## Local setup (em-backend)

```bash
cp .env.example .env    # fill DB, Redis, voucher start codes, S3, etc.
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan passport:install
```

⚠️ Don't use `php artisan ems:run` on a database you care about: it runs **`migrate:fresh --seed`**.
