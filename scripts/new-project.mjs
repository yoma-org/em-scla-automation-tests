#!/usr/bin/env node
// Scaffolds a new app under projects/<name>/ from projects/_template/.
//
// Usage (from the repo root):
//   npm run new-project -- <name>      # name: lowercase letters, digits and dashes
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Usage: npm run new-project -- <name>   (lowercase letters, digits, dashes)');
  process.exit(1);
}
const dest = join('projects', name);
if (existsSync(dest)) {
  console.error(`${dest} already exists`);
  process.exit(1);
}

cpSync(join('projects', '_template'), dest, { recursive: true });

// Replace the __APP__ placeholder in every text file.
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else {
      const text = readFileSync(p, 'utf8');
      if (text.includes('__APP__')) writeFileSync(p, text.replaceAll('__APP__', name));
    }
  }
})(dest);

execFileSync(process.execPath, ['scripts/test-cases.mjs', '--app', name], { stdio: 'inherit' });

console.log(`
Created ${dest}/. Next:
  1. Fill in ${dest}/PROJECT.md (system under test, roles, data, safety).
  2. cp ${dest}/.env.example ${dest}/.env and set BASE_URL and credentials.
  3. Replace the example case in ${dest}/docs/test-cases/features/ with real cases,
     then: npm run cases:build -- --app ${name}
  4. Run: APP=${name} npx playwright test
     (to point the playwright-test MCP server / agents at it: start Claude Code with APP=${name})`);
