#!/usr/bin/env bash
# Run from the repository root:  scripts/validate-project.sh <app>   (or APP=<app>)
set -euo pipefail

export APP="${1:-${APP:?usage: validate-project.sh <app>}}"

npm ci
npx playwright install chromium
npm run typecheck
npm run lint
npm run cases:check -- --app "$APP"
node .claude/skills/playwright-skill/scripts/check-traceability.mjs --app "$APP"
