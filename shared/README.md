# shared/

Code reused by more than one app in `projects/`, imported as `@shared/*` (every app's
`tsconfig.json` maps it).

Put something here only when a second app needs it: generic helpers (env access, retries on
polling, date / money parsing, download parsing), generic Component Objects for a UI library
two apps share, base fixtures. App-specific Page Objects, API clients, roles and data
factories stay in `projects/<app>/src/`.

Shared code must not import from `projects/`.
