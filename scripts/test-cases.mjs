#!/usr/bin/env node
// Test cases have one source per app: the case sections in projects/<app>/docs/test-cases/features/**/*.md.
// This script reads them and writes everything derived from them:
//   - the "generated" block at the top of each feature file (counts + summary table)
//   - test-catalog.csv
//   - suites/smoke.md, suites/regression.md
//   - the "generated" blocks in README.md and source-issues.md
// App-specific wording (README feature groups, smoke stages, smoke purpose) comes from
// projects/<app>/test-cases.config.mjs.
//
// Usage (from the repo root; --app defaults to $APP):
//   node scripts/test-cases.mjs --app em           # validate the cases and rewrite the derived files
//   node scripts/test-cases.mjs --app em --check   # validate only; exit 1 if a derived file is out of date
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename, posix, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const APP = argv.includes('--app') ? argv[argv.indexOf('--app') + 1] : process.env.APP;
if (!APP || !existsSync(join('projects', APP, 'docs/test-cases'))) {
  const apps = readdirSync('projects').filter(d => existsSync(join('projects', d, 'docs/test-cases')));
  console.error(`Pass --app <name> (or set APP). Apps: ${apps.join(', ')}`);
  process.exit(1);
}
const ROOT = posix.join('projects', APP, 'docs/test-cases');
const CHECK = argv.includes('--check');
const configFile = resolve('projects', APP, 'test-cases.config.mjs');
const config = existsSync(configFile) ? (await import(pathToFileURL(configFile))).default : {};

const PRIORITIES = ['P1', 'P2', 'P3'];
const AUTOMATION = ['Auto-UI', 'Auto-UI+API', 'Auto-API', 'Manual'];
const STATUSES = ['Active', 'Review', 'Obsolete'];
const ID = /^([A-Z]+(?:-[A-Z]+)?)-(\d{3})$/;

// README feature groups, by ID prefix. A feature whose prefix is not listed goes under "Other".
const GROUPS = config.groups ?? [];

// Smoke reading order (not a run order). A case goes to the first stage that lists its ID,
// otherwise to the first stage that lists its prefix without an ID filter.
const STAGES = config.stages ?? [];

const SMOKE_QUESTION = config.smokeQuestion ?? 'does the core business flow still work?';
const SMOKE_SUMMARY = config.smokeSummary ?? SMOKE_QUESTION;
const SMOKE_DATA = config.smokeData ?? 'each automated case creates its own data';

const errors = [];
const warnings = [];

// ---------- helpers

const posixPath = p => p.split('\\').join('/');
const rel = (from, to) => posix.relative(posix.dirname(from), to) || basename(to);
const cell = s => (s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const splitRow = line =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
const anchor = c => `${c.critical ? '★ ' : ''}${c.id} · ${c.title}`.toLowerCase()
  .replace(/[^\p{L}\p{N}_\- ]/gu, '').replace(/ /g, '-');
const link = (c, from) => `[${c.id}](${rel(from, c.feature.path)}#${anchor(c)})`;
const suites = c => [c.smoke && 'Smoke', c.e2e && 'E2E', c.status !== 'Obsolete' && 'Regression'].filter(Boolean).join(' · ') || '—';
const star = c => (c.critical ? '★ ' : '');

function walk(dir) {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
}

// Replace the block between <!-- generated:NAME ... --> and <!-- /generated:NAME -->.
function setBlock(text, name, body, file) {
  const re = new RegExp(`(<!-- generated:${name}[^>]*-->\\n)[\\s\\S]*?(<!-- /generated:${name} -->)`);
  if (!re.test(text)) {
    errors.push(`${file}: missing <!-- generated:${name} --> … <!-- /generated:${name} --> markers`);
    return text;
  }
  return text.replace(re, (_, a, b) => `${a}${body.replace(/\n*$/, '\n')}${b}`);
}

// ---------- parse feature files

function parseFeature(file) {
  const path = posixPath(relative(ROOT, file));
  const lines = readFileSync(file, 'utf8').split('\n');
  const m = basename(file).match(/^(\d+)-(.+)\.md$/);
  const h1 = (lines[0] ?? '').match(/^# (\d+) · (.+)$/);
  if (!m || !h1) {
    errors.push(`${path}: file must be named "<nn>-<slug>.md" and start with "# <nn> · <Feature name>"`);
    return null;
  }
  const feature = { no: Number(m[1]), path, name: h1[2].trim(), prefix: undefined, cases: [] };
  const where = i => `${path}:${i + 1}`;

  let i = lines.findIndex(l => l.trim() === '## Test cases');
  if (i < 0) {
    errors.push(`${path}: no "## Test cases" heading`);
    return feature;
  }
  let sub = '';
  let c = null;
  for (i++; i < lines.length; i++) {
    const line = lines[i];
    let h;
    if ((h = line.match(/^### (.+)$/))) { sub = h[1].trim(); continue; }
    if ((h = line.match(/^#### (★ )?(\S+) · (.+)$/))) {
      c = { feature, line: where(i), id: h[2], title: h[3].trim(), critical: !!h[1], sub, variants: [] };
      if (!ID.test(c.id)) errors.push(`${c.line}: "${c.id}" is not a valid ID (<PREFIX>-<nnn>)`);
      if (!sub) errors.push(`${c.line}: ${c.id} has no "### <sub-feature>" heading above it`);
      feature.cases.push(c);
      // metadata table: header, separator, row
      const head = lines[i + 2] ?? '';
      if (!/^\| Priority \| Suites \| Automation \| Status \| Source \|/.test(head)) {
        errors.push(`${where(i + 2)}: ${c.id} needs the "| Priority | Suites | Automation | Status | Source |" table right after its heading`);
        continue;
      }
      const [pri, sui, auto, status, source] = splitRow(lines[i + 4] ?? '');
      c.priority = pri;
      const s = (sui ?? '').split('·').map(x => x.trim()).filter(x => x && x !== '—');
      c.smoke = s.includes('Smoke');
      c.e2e = s.includes('E2E');
      for (const x of s) if (!['Smoke', 'E2E', 'Regression'].includes(x)) errors.push(`${c.line}: ${c.id} unknown suite "${x}"`);
      [c.automation, c.manualReason = ''] = (auto ?? '').split(/ — (.*)/s);
      [c.status, c.statusNote = ''] = (status ?? '').split(/ — (.*)/s);
      c.source = source ?? '';
      if (!PRIORITIES.includes(c.priority)) errors.push(`${c.line}: ${c.id} priority "${c.priority}" is not one of ${PRIORITIES.join(', ')}`);
      if (!AUTOMATION.includes(c.automation)) errors.push(`${c.line}: ${c.id} automation "${c.automation}" is not one of ${AUTOMATION.join(', ')}`);
      if (!STATUSES.includes(c.status)) errors.push(`${c.line}: ${c.id} status "${c.status}" is not one of ${STATUSES.join(', ')}`);
      if (c.automation === 'Manual' && !c.manualReason) errors.push(`${c.line}: ${c.id} is Manual: add the reason ("Manual — <reason>")`);
      if (c.status === 'Review' && !c.statusNote) errors.push(`${c.line}: ${c.id} is Review: add the open question ("Review — <question>")`);
      if (s.includes('Regression') === (c.status === 'Obsolete')) warnings.push(`${c.line}: ${c.id} Regression suite should be listed exactly when the case is not Obsolete`);
      if (c.critical && c.priority !== 'P1') warnings.push(`${c.line}: ${c.id} is ★ critical but ${c.priority} (★ cases are expected to be P1)`);
      if (c.smoke && (c.priority !== 'P1' || c.automation === 'Manual' || c.status !== 'Active')) warnings.push(`${c.line}: ${c.id} is Smoke but not P1 / automatable / Active`);
      i += 4;
      continue;
    }
    if (c && /^\*\*Data variants/.test(line)) {
      // | # | Variant | Source | Note |, then rows until a blank line; row 1 is the base case itself
      let j = i + 3;
      for (; j < lines.length && lines[j].startsWith('|'); j++) {
        const [n, label, source, note = ''] = splitRow(lines[j]);
        if (n === '1' || /^:?-+:?$/.test(n)) continue;
        const [, st = 'Active', rest = ''] = note.match(/^(Review|Obsolete)(?:; (.*))?$/s) ?? [null, 'Active', note];
        c.variants.push({ label, source, status: st, statusNote: rest, line: where(j) });
        if (!label) errors.push(`${where(j)}: ${c.id} variant ${n} has no label`);
      }
      // Rows that are merged duplicates or source noise need no run of their own (as in check-traceability.mjs).
      const labels = c.variants.map(v => v.label).filter(l => !/duplicate|header row|blank row/i.test(l));
      const dup = labels.filter((l, k) => labels.indexOf(l) !== k);
      if (dup.length) errors.push(`${c.line}: ${c.id} duplicate variant label(s): ${[...new Set(dup)].join(' | ')}`);
      i = j - 1;
    }
  }
  const prefixes = [...new Set(feature.cases.map(x => x.id.match(ID)?.[1]).filter(Boolean))];
  if (prefixes.length > 1) errors.push(`${path}: cases use more than one ID prefix (${prefixes.join(', ')})`);
  feature.prefix = prefixes[0];
  return feature;
}

const features = walk(join(ROOT, 'features'))
  .map(parseFeature)
  .filter(Boolean)
  .sort((a, b) => a.no - b.no);
const cases = features.flatMap(f => f.cases);

for (const [k, f] of features.entries()) {
  if (features.findIndex(x => x.no === f.no) !== k) errors.push(`${f.path}: feature number ${f.no} is used twice`);
}
const seen = new Map();
for (const c of cases) {
  if (seen.has(c.id)) errors.push(`${c.line}: ${c.id} is already used at ${seen.get(c.id)}`);
  else seen.set(c.id, c.line);
}

// ---------- derived content

const count = (list, f) => list.filter(f).length;
function stats(list) {
  return {
    cases: list.length,
    variants: list.reduce((n, c) => n + c.variants.length, 0),
    P1: count(list, c => c.priority === 'P1'), P2: count(list, c => c.priority === 'P2'), P3: count(list, c => c.priority === 'P3'),
    crit: count(list, c => c.critical), smoke: count(list, c => c.smoke), e2e: count(list, c => c.e2e),
    auto: count(list, c => c.automation !== 'Manual'), manual: count(list, c => c.automation === 'Manual'),
    review: count(list, c => c.status === 'Review'), obsolete: count(list, c => c.status === 'Obsolete'),
  };
}
const total = stats(cases);
const out = new Map(); // path -> content

// feature files: counts + summary table
for (const f of features) {
  const s = stats(f.cases);
  const L = [
    `**Test cases:** ${s.cases}` + (s.variants ? ` (+${s.variants} data-variant rows)` : '') + '  ',
    `**Priority:** P1 ${s.P1} · P2 ${s.P2} · P3 ${s.P3} · **★ Critical:** ${s.crit} · **Smoke:** ${s.smoke} · **E2E:** ${s.e2e} · **Auto:** ${s.auto} · **Manual:** ${s.manual}`
      + (s.review ? ` · **Review:** ${s.review}` : '') + (s.obsolete ? ` · **Obsolete:** ${s.obsolete}` : ''),
    '',
    '## Summary',
    '',
    '| ID | Test case | Sub-feature | Pri | Suites | Automation | Status | Variants |',
    '|---|---|---|---|---|---|---|---|',
    ...f.cases.map(c => `| [${c.id}](#${anchor(c)}) | ${star(c)}${cell(c.title)} | ${cell(c.sub)} | ${c.priority} | ${suites(c)} | ${c.automation} | ${c.status} | ${c.variants.length ? c.variants.length + 1 : ''} |`),
  ];
  const file = join(ROOT, f.path);
  out.set(file, setBlock(readFileSync(file, 'utf8'), 'summary', L.join('\n'), f.path));
}

// test-catalog.csv: one row per case and one per extra data variant
{
  const csv = v => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const tcId = src => src.match(/\(([^()]+)\)$/)?.[1] ?? '';
  const rows = [['test_id', 'row_type', 'feature', 'sub_feature', 'title', 'priority', 'critical', 'smoke', 'e2e',
    'regression', 'automation', 'manual_reason', 'status', 'status_note', 'variant', 'source', 'source_id', 'doc']];
  for (const c of cases) {
    const base = [c.id, '', c.feature.name, c.sub, c.title, c.priority, c.critical ? 'Y' : ''];
    const tail = [c.automation, c.manualReason];
    rows.push([...base.with(1, 'canonical'), c.smoke ? 'Y' : '', c.e2e ? 'Y' : '', c.status !== 'Obsolete' ? 'Y' : '',
      ...tail, c.status, c.statusNote, '', c.source, tcId(c.source), c.feature.path]);
    for (const v of c.variants) {
      rows.push([...base.with(1, 'variant'), '', c.e2e ? 'Y' : '', v.status !== 'Obsolete' ? 'Y' : '',
        ...tail, v.status, v.statusNote, v.label, v.source, tcId(v.source), c.feature.path]);
    }
  }
  out.set(join(ROOT, 'test-catalog.csv'), rows.map(r => r.map(x => csv(String(x))).join(',')).join('\n') + '\n');
}

const GENERATED = 'Generated by `npm run cases:build` from the feature files; do not edit it by hand.\n';

// suites/smoke.md
{
  const F = 'suites/smoke.md';
  const smoke = cases.filter(c => c.smoke);
  const stageOf = c => {
    const p = c.feature.prefix;
    const k = STAGES.findIndex(s => s.ids?.[p]?.includes(c.id));
    if (k >= 0) return k;
    const d = STAGES.findIndex(s => s.prefixes.includes(p) && !s.ids?.[p]);
    return d >= 0 ? d : STAGES.length;
  };
  const staged = [...STAGES, { name: `${STAGES.length + 1} · Other`, prefixes: [] }].map((s, k) => {
    const items = smoke.filter(c => stageOf(c) === k);
    const order = c => (s.prefixes.indexOf(c.feature.prefix) + 1 || 999) * 1e4 + cases.indexOf(c);
    return [s.name, items.sort((a, b) => order(a) - order(b))];
  });
  const L = ['# Smoke Suite\n', '[← Test case index](../README.md)\n', GENERATED,
    `**${smoke.length} test cases.** Run on every deployment, before any other suite. The smoke suite answers one question: *${SMOKE_QUESTION}* Every case is P1, Active and automatable, with a happy path. Stages are a reading order, not a run order: ${SMOKE_DATA} so the cases run independently and in parallel.\n`,
    '**Exit rule:** any failure stops the pipeline. Fix it, or roll back the build, before running E2E or regression.\n',
    'Data-driven cases (with variants) run **only the base row** in smoke. The full variant set runs in regression.\n'];
  for (const [name, items] of staged) {
    if (!items.length) continue;
    L.push(`## ${name}\n`, '| # | ID | Test case | Feature | Automation |', '|---|---|---|---|---|');
    items.forEach((c, k) => L.push(`| ${k + 1} | ${link(c, F)} | ${star(c)}${cell(c.title)} | ${c.feature.name} | ${c.automation} |`));
    L.push('');
  }
  out.set(join(ROOT, F), L.join('\n'));
}

// suites/regression.md
{
  const F = 'suites/regression.md';
  const active = cases.filter(c => c.status !== 'Obsolete');
  const runs = active.reduce((n, c) => n + 1 + count(c.variants, v => v.status !== 'Obsolete'), 0);
  const flink = f => `[${f.name}](${rel(F, f.path)})`;
  const L = ['# Regression Suite\n', '[← Test case index](../README.md)\n', GENERATED,
    'Regression = every non-obsolete test case, in three tiers. Pick the tier by how much changed.\n',
    '| Tier | Content | When to run | Test cases |', '|---|---|---|---|',
    `| **R1 — Critical** | All ★ critical + all P1 | Every merge to main / nightly | ${count(active, c => c.priority === 'P1' || c.critical)} |`,
    `| **R2 — Core** | R1 + all P2 | Before each release candidate | ${count(active, c => ['P1', 'P2'].includes(c.priority) || c.critical)} |`,
    `| **R3 — Full** | Everything (incl. P3 field / UI validation) + all data variants | Before production release / major refactor | ${active.length} cases (${runs} incl. variants) |`,
    '',
    'Data-driven cases run **all their variants** in regression; see the *Data variants* table under each case.\n',
    'Cases with status **Review** stay in the suite but are tagged; a failure there must first be checked against the open question in [source-issues.md](../source-issues.md).\n',
    '## Coverage by feature\n',
    '| # | Feature | Cases | ★ | P1 | P2 | P3 | Auto | Manual | Review | Rows incl. variants |',
    '|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const f of features) {
    const s = stats(f.cases);
    L.push(`| ${String(f.no).padStart(2, '0')} | ${flink(f)} | ${s.cases} | ${s.crit} | ${s.P1} | ${s.P2} | ${s.P3} | ${s.auto} | ${s.manual} | ${s.review} | ${s.cases + s.variants} |`);
  }
  const t = total;
  L.push(`| | **Total** | **${t.cases}** | **${t.crit}** | **${t.P1}** | **${t.P2}** | **${t.P3}** | **${t.auto}** | **${t.manual}** | **${t.review}** | **${t.cases + t.variants}** |`, '');
  const manual = cases.filter(c => c.automation === 'Manual');
  L.push(`## Manual-only cases (${manual.length})\n`, 'These stay in the manual regression checklist. Everything else is planned for automation.\n',
    '| ID | Test case | Reason |', '|---|---|---|', ...manual.map(c => `| ${link(c, F)} | ${cell(c.title)} | ${cell(c.manualReason)} |`), '');
  const desc = {
    'Auto-UI': 'Browser test; assert on screen', 'Auto-UI+API': 'Act in UI (or API), assert numbers via API / parsed PDF',
    'Auto-API': 'Pure API test (incl. parallel calls for concurrency)', Manual: 'Not automated (see list above)',
  };
  L.push('## Automation layer split\n', '| Layer | Cases | Meaning |', '|---|---|---|',
    ...AUTOMATION.map(a => `| ${a} | ${count(cases, c => c.automation === a)} | ${desc[a]} |`), '');
  out.set(join(ROOT, F), L.join('\n'));
}

// source-issues.md: list of Review rows
{
  const F = 'source-issues.md';
  const rows = cases.flatMap(c => [
    ...(c.status === 'Review' ? [[c, `base · ${c.source}`, c.statusNote]] : []),
    ...c.variants.filter(v => v.status === 'Review').map(v => [c, `variant · ${v.source}`, v.statusNote]),
  ]);
  const L = [`## Cases in Review status (${rows.length} rows)\n`,
    'Kept in the suites, but the expected result must be confirmed before an automated assertion is trusted.\n',
    '| ID | Row | Test case | Why |', '|---|---|---|---|',
    ...rows.map(([c, row, why]) => `| ${link(c, F)} | ${cell(row)} | ${cell(c.title)} | ${cell(why)} |`)];
  const file = join(ROOT, F);
  out.set(file, setBlock(readFileSync(file, 'utf8'), 'review', L.join('\n'), F));
}

// README.md: overview tables
{
  const F = 'README.md';
  const flows = (readFileSync(join(ROOT, 'suites/e2e-critical-flows.md'), 'utf8').match(/^## E2E-\d+/gm) ?? []).length;
  const t = total;
  const L = ['## At a glance\n', '| | |', '|---|---|',
    `| Test cases | **${t.cases}** (+${t.variants} data-variant rows = ${t.cases + t.variants} rows) |`,
    `| ★ Critical business flow | ${t.crit} |`,
    `| Priority P1 / P2 / P3 | ${t.P1} / ${t.P2} / ${t.P3} |`,
    `| Smoke / E2E-tagged | ${t.smoke} / ${t.e2e} (+ ${flows} composed [E2E flows](suites/e2e-critical-flows.md)) |`,
    `| Automatable / Manual | ${t.auto} / ${t.manual} |`,
    `| Review (open question) / Obsolete | ${t.review} / ${t.obsolete} |`, '',
    '## Suites\n', '| Suite | File | Size | Purpose |', '|---|---|---|---|',
    `| Smoke | [suites/smoke.md](suites/smoke.md) | ${t.smoke} cases | Every deploy — ${SMOKE_SUMMARY} |`,
    `| E2E | [suites/e2e-critical-flows.md](suites/e2e-critical-flows.md) | ${flows} flows | ★ Critical business flows chained across modules |`,
    '| Regression | [suites/regression.md](suites/regression.md) | R1 / R2 / R3 tiers | Coverage per feature; manual-only list |', '',
    '## Features\n', '| # | Feature | Cases | ★ | P1 | Smoke | Auto | Manual |', '|---|---|---|---|---|---|---|---|'];
  const listed = new Set(GROUPS.flatMap(([, p]) => p));
  const groups = [...GROUPS, ['Other', features.map(f => f.prefix).filter(p => !listed.has(p))]];
  for (const [g, prefixes] of groups) {
    const fs = features.filter(f => prefixes.includes(f.prefix));
    if (!fs.length) continue;
    L.push(`| | **${g}** | | | | | | |`);
    for (const f of fs) {
      const s = stats(f.cases);
      L.push(`| ${String(f.no).padStart(2, '0')} | [${f.name}](${f.path}) | ${s.cases} | ${s.crit} | ${s.P1} | ${s.smoke} | ${s.auto} | ${s.manual} |`);
    }
  }
  const file = join(ROOT, F);
  out.set(file, setBlock(readFileSync(file, 'utf8'), 'overview', L.join('\n'), F));
}

// ---------- report / write

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s); nothing written.`);
  process.exit(1);
}

const stale = [...out].filter(([p, text]) => {
  try { return readFileSync(p, 'utf8') !== text; } catch { return true; }
}).map(([p]) => p);

if (CHECK) {
  if (stale.length) {
    console.error(`Out of date (run npm run cases:build):\n  ${stale.join('\n  ')}`);
    process.exit(1);
  }
} else {
  for (const p of stale) writeFileSync(p, out.get(p));
  if (stale.length) console.log(`Updated:\n  ${stale.join('\n  ')}`);
}
console.log(`${total.cases} cases (+${total.variants} variant rows) in ${features.length} features; ${warnings.length} warning(s).`);
