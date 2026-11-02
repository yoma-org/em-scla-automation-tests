import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

// Each app under projects/<app>/ has its own playwright.config.ts. This root config only picks
// one, so `npx playwright test`, the VS Code extension and the playwright-test MCP server work
// from the repo root:  APP=em npx playwright test   (same as: npx playwright test -c projects/em)
const projectsDir = path.join(__dirname, 'projects');
const apps = readdirSync(projectsDir).filter(
  d => !d.startsWith('_') && existsSync(path.join(projectsDir, d, 'playwright.config.ts')),
);
const app = process.env.APP ?? (apps.length === 1 ? apps[0] : undefined);
if (!app || !apps.includes(app)) {
  throw new Error(`Set APP to one of: ${apps.join(', ')} (e.g. APP=${apps[0]} npx playwright test)`);
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
export default require(`./projects/${app}/playwright.config.ts`).default;
