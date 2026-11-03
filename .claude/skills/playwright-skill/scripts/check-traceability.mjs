#!/usr/bin/env node
// Checks every Playwright test of one app against projects/<app>/docs/test-cases/test-catalog.csv:
// title / `tc` / `source` annotations, tags, variants, status (Review / Manual / Obsolete),
// leftover generator drafts. Exit code 1 when anything is wrong.
//
// Sanity tests (tests/sanity/, IDs SAN-…) are checked against projects/<app>/docs/sanity-test/
// instead of the catalog: the ID must be a case heading there, and tags must be @sanity +
// the doc's priority (+ @critical for ★ cases).
//
// Usage (from the repo root; --app defaults to $APP):
//   node .claude/skills/playwright-skill/scripts/check-traceability.mjs --app em            # runs `playwright test --list`
//   node .claude/skills/playwright-skill/scripts/check-traceability.mjs --app em --json list.json
//   node .claude/skills/playwright-skill/scripts/check-traceability.mjs --app em --coverage # also list cases with no test
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = name => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const app = opt('--app') ?? process.env.APP;
if (!app || !existsSync(`projects/${app}/playwright.config.ts`)) {
  const apps = readdirSync('projects').filter(d => !d.startsWith('_') && existsSync(`projects/${d}/playwright.config.ts`));
  console.error(`Pass --app <name> (or set APP). Apps: ${apps.join(', ')}`);
  process.exit(1);
}
const catalogPath = opt('--catalog') ?? `projects/${app}/docs/test-cases/test-catalog.csv`;
const jsonPath = opt('--json');
const showCoverage = args.includes('--coverage');

// Files that are allowed to have tests without a case ID.
const NO_ID_FILES = [/(^|\/)seed\.spec\.ts$/, /\.setup\.ts$/];
const ID = /^([A-Z]+(?:-[A-Z]+)?-\d{3}|E2E-\d{2}|SAN-[A-Z0-9]+-\d{3})(?:\s|$)/;
const MANAGED_TAGS = ['@smoke', '@P1', '@P2', '@P3', '@critical', '@review', '@e2e', '@sanity'];
const REMOVED_TAGS = /^@(R[1-3]|regression)$/;
// Variant rows that are merged duplicates or source noise (matrix header / blank rows), not
// separate data: kept in the catalog for traceability, but they need no run of their own.
const NO_RUN_VARIANT = /duplicate|header row|blank row/i;

// ---------- catalog ----------

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter(r => r.some(Boolean));
  return body.map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

const catalog = new Map(); // id -> { canonical, variants: [] }
const catalogWarnings = [];
for (const row of parseCsv(readFileSync(catalogPath, 'utf8'))) {
  const c = catalog.get(row.test_id) ?? { canonical: undefined, variants: [] };
  if (row.row_type === 'canonical') c.canonical = row;
  else c.variants.push(row);
  catalog.set(row.test_id, c);
}
for (const [id, c] of catalog) {
  const labels = c.variants.map(v => v.variant);
  const dup = labels.filter((l, i) => labels.indexOf(l) !== i);
  if (dup.length) catalogWarnings.push(`${id}: duplicate variant label(s) in catalog: ${[...new Set(dup)].join(' | ')}`);
}

// ---------- sanity cases (docs/sanity-test/**/*.md) ----------
// Heading: "#### [★ ]SAN-XXX-nnn · Title", then a table whose first data cell is the priority.

const sanityDir = `projects/${app}/docs/sanity-test`;
const sanityCases = new Map(); // id -> { priority, critical, doc }
(function scan(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { scan(file); continue; }
    if (!entry.name.endsWith('.md')) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const m = /^#{2,5}\s+(★\s*)?(SAN-[A-Z0-9]+-\d{3})\s+·/.exec(line);
      if (!m) return;
      let priority;
      for (let j = i + 1; j < Math.min(i + 8, lines.length) && !priority; j++) {
        priority = /^\|\s*(P[1-3])\s*\|/.exec(lines[j])?.[1];
      }
      sanityCases.set(m[2], { priority, critical: Boolean(m[1]), doc: path.relative(`projects/${app}`, file) });
    });
  }
})(sanityDir);

// ---------- tests ----------

const listJson = jsonPath
  ? readFileSync(jsonPath, 'utf8')
  : execFileSync('npx', ['playwright', 'test', '-c', `projects/${app}`, '--list', '--reporter=json'], {
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'inherit']
    });
const report = JSON.parse(listJson);
if (report.errors?.length) {
  for (const e of report.errors) console.error(`Playwright load error: ${e.message ?? JSON.stringify(e)}`);
  process.exit(1);
}

// One entry per test, deduplicated across projects.
const tests = new Map();
(function walk(suite) {
  for (const spec of suite.specs ?? []) {
    const key = `${spec.file}:${spec.line}:${spec.column}:${spec.title}`;
    if (!tests.has(key)) tests.set(key, { ...spec, annotations: spec.tests?.[0]?.annotations ?? [] });
  }
  for (const child of suite.suites ?? []) walk(child);
})({ suites: report.suites });

const errors = [];
const implemented = new Map(); // id -> Set(label)
const seenTitles = new Map();
const sanityImplemented = new Set();

for (const t of tests.values()) {
  const where = `${t.file}:${t.line} "${t.title}"`;
  const err = msg => errors.push(`${where}\n    ${msg}`);
  const tags = new Set(t.tags.map(tag => (tag.startsWith('@') ? tag : `@${tag}`)));
  const ann = type => t.annotations.filter(a => a.type === type).map(a => a.description);

  if (/(^|\/)_drafts\//.test(t.file)) {
    err('generator draft still present: refactor it into tests/<feature>/ and delete the draft');
    continue;
  }
  for (const tag of tags) if (REMOVED_TAGS.test(tag)) err(`${tag} is not used (regression tiers are selected by priority tags)`);

  const idMatch = ID.exec(t.title);
  if (!idMatch) {
    if (!NO_ID_FILES.some(re => re.test(t.file))) err('title does not start with a case ID (e.g. "AUTH-001 …")');
    continue;
  }
  const id = idMatch[1];

  // ----- E2E flows -----
  if (id.startsWith('E2E-')) {
    for (const tag of ['@e2e', '@P1', '@critical']) if (!tags.has(tag)) err(`E2E flow must be tagged ${tag}`);
    const covered = ann('tc');
    if (!covered.length) err('E2E flow lists no covered cases (`tc` annotations)');
    for (const c of covered) if (!catalog.has(c)) err(`tc "${c}" is not in the catalog`);
    continue;
  }

  // ----- sanity cases -----
  if (id.startsWith('SAN-')) {
    if (!/(^|\/)sanity\//.test(t.file)) err('sanity cases (SAN-…) belong in tests/sanity/');
    const c = sanityCases.get(id);
    if (!c) { err(`${id} is not a case heading in ${sanityDir}`); continue; }
    const tc = ann('tc');
    if (tc.length !== 1 || tc[0] !== id) err(`needs exactly one annotation { type: 'tc', description: '${id}' } (found: ${tc.join(', ') || 'none'})`);
    const expected = new Set(['@sanity', ...(c.priority ? [`@${c.priority}`] : []), ...(c.critical ? ['@critical'] : [])]);
    if (!c.priority) err(`${id}: no priority found under its heading in ${c.doc}`);
    // Ticket cases (SAN-EM92-…) must carry their Jira task as a tag, so CI can run them per ticket.
    const task = /^SAN-([A-Z]+)(\d+)-\d{3}$/.exec(id);
    if (task && !tags.has(`@${task[1]}-${task[2]}`)) err(`missing Jira task tag @${task[1]}-${task[2]} (sanity() adds it from the ID)`);
    const actual = new Set(MANAGED_TAGS.filter(tag => tags.has(tag)));
    const missing = [...expected].filter(tag => !actual.has(tag));
    const extra = [...actual].filter(tag => !expected.has(tag));
    if (missing.length || extra.length) {
      err(`tags: expected [${[...expected].join(' ')}]` +
        (missing.length ? `, missing ${missing.join(' ')}` : '') +
        (extra.length ? `, unexpected ${extra.join(' ')}` : ''));
    }
    const key = `${id} []`;
    if (seenTitles.has(key)) err(`duplicate test for ${id} (also ${seenTitles.get(key)})`);
    else seenTitles.set(key, `${t.file}:${t.line}`);
    sanityImplemented.add(id);
    continue;
  }

  // ----- single cases -----
  const entry = catalog.get(id);
  if (!entry?.canonical) {
    err(`${id} is not a canonical case in ${catalogPath}`);
    continue;
  }
  const tc = ann('tc');
  if (tc.length !== 1 || tc[0] !== id) err(`needs exactly one annotation { type: 'tc', description: '${id}' } (found: ${tc.join(', ') || 'none'})`);

  const labelMatch = /^\S+ \[(.+?)\](?:\s|$)/.exec(t.title);
  const label = labelMatch?.[1];
  let row = entry.canonical;
  if (entry.variants.length) {
    if (!label) err(`${id} has ${entry.variants.length} variant row(s): title needs "[base]" or "[<variant>]" after the ID`);
    else if (label !== 'base') {
      row = entry.variants.find(v => v.variant === label);
      if (!row) {
        err(`variant "${label}" is not in the catalog for ${id}`);
        row = entry.canonical;
      }
    }
  } else if (label) err(`${id} has no variants in the catalog, but the title has "[${label}]"`);

  // status / automation
  if (row.automation === 'Manual') err(`${id} is Manual: do not automate it`);
  if (row.status === 'Obsolete') err(`${id} is Obsolete: do not automate it`);
  // `test.fixme(true, …)` inside the body is invisible to `--list`, so the review annotation is
  // required even on a fixme'd Review case.
  if (row.status === 'Review' && !ann('review').length) {
    err(`${id} is Review: add { type: 'review', description: <status_note> } (also when the test is fixme)`);
  }

  // source
  const source = ann('source');
  if (row.source_id && (source.length !== 1 || source[0] !== row.source_id)) {
    err(`needs annotation { type: 'source', description: '${row.source_id}' } (found: ${source.join(', ') || 'none'})`);
  }

  // tags
  const expected = new Set([`@${row.priority}`]);
  if (row.critical === 'Y') expected.add('@critical');
  if (row.smoke === 'Y' && row.row_type === 'canonical') expected.add('@smoke');
  if (row.status === 'Review') expected.add('@review');
  const actual = new Set(MANAGED_TAGS.filter(tag => tags.has(tag)));
  const missing = [...expected].filter(tag => !actual.has(tag));
  const extra = [...actual].filter(tag => !expected.has(tag));
  if (missing.length || extra.length) {
    err(`tags: expected [${[...expected].join(' ')}]` +
      (missing.length ? `, missing ${missing.join(' ')}` : '') +
      (extra.length ? `, unexpected ${extra.join(' ')}` : ''));
  }

  // duplicates
  const key = `${id} [${label ?? ''}]`;
  if (seenTitles.has(key)) err(`duplicate test for ${key} (also ${seenTitles.get(key)})`);
  else seenTitles.set(key, `${t.file}:${t.line}`);

  if (!implemented.has(id)) implemented.set(id, new Set());
  implemented.get(id).add(label ?? 'base');
}

// ---------- coverage ----------

const automatable = [...catalog.entries()].filter(([, c]) =>
  c.canonical && c.canonical.automation !== 'Manual' && c.canonical.status !== 'Obsolete');
const done = automatable.filter(([id]) => implemented.has(id));
const missingVariants = [];
for (const [id, c] of done) {
  const want = [...new Set(['base', ...c.variants.map(v => v.variant).filter(l => !NO_RUN_VARIANT.test(l))])];
  const have = implemented.get(id);
  const lacking = want.filter(l => !have.has(l));
  if (want.length > 1 && lacking.length) missingVariants.push(`${id}: ${lacking.length} of ${want.length} variant run(s) missing`);
}

// ---------- output ----------

for (const w of catalogWarnings) console.warn(`catalog warning: ${w}`);
if (errors.length) {
  console.error(`\n${errors.length} traceability error(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
}
console.log(`\nTests checked: ${tests.size}`);
console.log(`Cases implemented: ${done.length} / ${automatable.length} automatable canonical cases`);
if (sanityCases.size) console.log(`Sanity cases implemented: ${sanityImplemented.size} / ${sanityCases.size} in ${sanityDir}`);
for (const m of missingVariants) console.log(`  incomplete: ${m}`);
if (showCoverage) {
  const byFeature = new Map();
  for (const [id, c] of automatable) if (!implemented.has(id)) {
    const f = c.canonical.feature;
    byFeature.set(f, [...(byFeature.get(f) ?? []), id]);
  }
  for (const [f, ids] of byFeature) console.log(`  not implemented — ${f} (${ids.length}): ${ids.join(', ')}`);
}
process.exit(errors.length || missingVariants.length ? 1 : 0);
