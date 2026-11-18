#!/usr/bin/env node
// Writes projects/old-em/report/old-em-issues.md from the last Old EM run.
//
//   test-results/results.json   Playwright JSON reporter output of the smoke run (playwright.config.ts)
//   test-results/issues.json    JSON output of the reported-issue run (tests/issues/), when present
//   ../em/docs/test-cases/      catalog (feature / area, title, priority) and case anchors
//   report/analysis.json        hand-written analysis:
//                                 "<ID>": { "why", "impact", "decision", "status"? }  status "UNSTABLE" overrides the
//                                         run result for a case that failed only some of the time
//                                 "<ID> [<variant>]": same, for one variant of a data-driven case
//                                 "areas": { "<feature>": "focus note" }, "intro", "observations": [{ "title", "text" }]
//                                 "issues": { "<reported issue>": { "verdict": "CONFIRMED|NOT REPRODUCED|INCONCLUSIVE", "text" } }
//                                         for tests annotated { type: 'reported issue' } (tests/issues/)
//
// Screenshots of failing tests (evidence shots and the screen at failure) are written to report/img/ so the
// report can be read on GitHub.
//
// Usage (from the repo root): node projects/old-em/scripts/build-report.mjs
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const APP_DIR = 'projects/old-em';
const CASES_DIR = 'projects/em/docs/test-cases';
const REPORT_DIR = join(APP_DIR, 'report');
const IMG_DIR = join(REPORT_DIR, 'img');

const runs = ['results.json', 'issues.json'].map(f => join(APP_DIR, 'test-results', f)).filter(existsSync)
  .map(f => JSON.parse(readFileSync(f, 'utf8')));
const results = runs[0];
const analysisFile = join(REPORT_DIR, 'analysis.json');
const analysis = existsSync(analysisFile) ? JSON.parse(readFileSync(analysisFile, 'utf8')) : {};

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
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
// The EM catalog (read only) plus Old EM's own extra cases, which are kept out of New EM's catalog
// (docs/test-cases/extra-cases.md: cases written for issues reported on Old EM).
const EXTRA_DIR = join(APP_DIR, 'docs', 'test-cases');
const catalog = new Map(
  [join(CASES_DIR, 'test-catalog.csv'), join(EXTRA_DIR, 'extra-catalog.csv')].filter(existsSync)
    .flatMap(f => parseCsv(readFileSync(f, 'utf8')))
    .filter(r => r.row_type === 'canonical')
    .map(r => [r.test_id, r])
);

// GitHub heading anchors of the case sections, e.g. "#### ★ AUTH-001 · Login …"
const anchors = new Map();
(function walk(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.md')) {
      for (const line of readFileSync(p, 'utf8').split('\n')) {
        const m = /^#### (.*?([A-Z][A-Z-]*-\d{3}) · .*)$/.exec(line);
        if (!m) continue;
        const slug = m[1].toLowerCase().replace(/[^\p{L}\p{N} -]/gu, '').replaceAll(' ', '-');
        anchors.set(m[2], `${relative(REPORT_DIR, p)}#${slug}`);
      }
    }
  }
})(join(CASES_DIR, 'features'));
// Old EM extra cases: plain <a id="inv-038"> anchors.
if (existsSync(join(EXTRA_DIR, 'extra-cases.md'))) {
  for (const m of readFileSync(join(EXTRA_DIR, 'extra-cases.md'), 'utf8').matchAll(/<a id="([a-z]+(?:-[a-z]+)*-\d{3})"><\/a>/g)) {
    anchors.set(m[1].toUpperCase(), `${relative(REPORT_DIR, join(EXTRA_DIR, 'extra-cases.md'))}#${m[1]}`);
  }
}

// ---------- results ----------
const tests = [];
function walkRun(suite, file) {
  for (const s of suite.suites ?? []) walkRun(s, s.file ?? file);
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      const id = t.annotations.find(a => a.type === 'tc')?.description;
      if (t.projectName === 'setup' || !id) continue; // seed test
      const variant = /^\S+ \[([^\]]+)\]/.exec(spec.title)?.[1];
      const key = variant && variant !== 'base' ? `${id} [${variant}]` : id;
      const last = t.results.at(-1) ?? { status: 'skipped', errors: [], attachments: [] };
      const skipReason = t.annotations.find(a => a.type === 'skip')?.description;
      const status = (analysis[key] ?? analysis[id])?.status ?? (last.status === 'passed' ? 'PASS'
        : last.status === 'skipped' ? 'BLOCKED'
        : 'FAIL');
      tests.push({
        id, key, variant, title: spec.title, file: spec.file ?? file, status,
        errors: [...(last.errors ?? [])].map(e => clean(e.message ?? '')).filter(Boolean),
        skipReason,
        notes: [...t.annotations, ...(last.annotations ?? [])].filter(a => !['tc', 'source', 'skip'].includes(a.type)),
        images: (last.attachments ?? []).filter(a => a.contentType === 'image/png' && (a.path || a.body))
      });
    }
  }
}
for (const run of runs) walkRun(run);

function clean(message) {
  // eslint-disable-next-line no-control-regex
  return message.replace(/\u001b\[[0-9;]*m/g, '').split('\n')
    .filter(l => !/^\s+at |Call log:|^\s+- |^\s*>?\s*\d+ \||^\s+\|\s/.test(l))
    .join('\n').trim().slice(0, 900);
}

// ---------- images ----------
rmSync(IMG_DIR, { recursive: true, force: true });
mkdirSync(IMG_DIR, { recursive: true });
/** Screenshots as JPEG (about 5× smaller) with macOS `sips`; keeps the PNG where sips is missing. */
function toJpeg(png) {
  const jpg = png.replace(/\.png$/, '.jpg');
  try {
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '70', png, '--out', jpg], { stdio: 'ignore' });
    rmSync(png);
    return jpg.split('/').pop();
  } catch {
    return png.split('/').pop();
  }
}
const slugKey = key => key.replace(/[^A-Za-z0-9-]+/g, '_').replace(/_+$/, '');
for (const t of tests.filter(t => ['FAIL', 'UNSTABLE'].includes(t.status))) {
  // This run's own attachments: the evidence shots the test took of the difference, then the screen at failure.
  // At most the last 3 evidence shots (the ones closest to the failure), then the screen at failure.
  const shots = [...t.images.filter(a => a.name !== 'screenshot').slice(-3), ...t.images.filter(a => a.name === 'screenshot')];
  t.imageLinks = shots.map((a, i) => {
    const png = join(IMG_DIR, `${slugKey(t.key)}-${i + 1}.png`);
    if (a.path) copyFileSync(a.path, png);
    else writeFileSync(png, Buffer.from(a.body, 'base64'));
    const name = toJpeg(png);
    return { name: a.name === 'screenshot' ? 'Screen at failure' : a.name.replace(`${t.id}_`, ''), src: `img/${name}` };
  });
}

// ---------- report ----------
const byArea = new Map();
for (const t of tests) {
  const area = catalog.get(t.id)?.feature ?? 'Other';
  if (!byArea.has(area)) byArea.set(area, []);
  byArea.get(area).push(t);
}
const count = (list, s) => list.filter(t => t.status === s).length;
const caseLink = id => (anchors.has(id) ? `[${id}](${anchors.get(id)})` : id);
const runDate = new Date(results.stats?.startTime ?? Date.now()).toISOString().slice(0, 10);
const areas = [...byArea.entries()].sort((a, b) => count(b[1], 'FAIL') - count(a[1], 'FAIL') || a[0].localeCompare(b[0]));
const failedAreas = areas.filter(([, list]) => count(list, 'FAIL'));

const out = [];
out.push(
  '# Old EM: areas that fail their own test cases',
  '',
  `Old EM UAT (https://www.uat.ted.synergy.yomaland360.com), run on **${runDate}** by the \`old-em\` Playwright suite.`,
  `Requirements: the GT test cases in [projects/em/docs/test-cases/](../../em/docs/test-cases/README.md) (${new Set(tests.map(t => t.id)).size} cases, ${tests.length} test runs incl. data variants).`,
  '',
  analysis.intro ?? '',
  '',
  '## Summary',
  '',
  `| | Test runs |`,
  `|---|---|`,
  `| Run | ${tests.length} |`,
  `| ✅ Pass | ${count(tests, 'PASS')} |`,
  `| ❌ Fail (Old EM does not do what the case expects) | ${count(tests, 'FAIL')} |`,
  `| ⚠️ Unstable (failed in some runs only; check by hand) | ${count(tests, 'UNSTABLE')} |`,
  `| ⛔ Blocked (could not be checked on this environment) | ${count(tests, 'BLOCKED')} |`,
  '',
  '| Area | Pass | Fail | Unstable | Blocked | Focus |',
  '|---|---|---|---|---|---|',
  ...areas.map(([area, list]) => `| ${count(list, 'FAIL') ? `[${area}](#${slugify(area)})` : area} | ${count(list, 'PASS')} | ${count(list, 'FAIL')} | ${count(list, 'UNSTABLE')} | ${count(list, 'BLOCKED')} | ${count(list, 'FAIL') ? '**Yes**' : count(list, 'UNSTABLE') ? 'Check' : ''} |`),
  ''
);

function renderCase(t, icon, whyLabel = 'Why it fails') {
  const a = analysis[t.key] ?? analysis[t.id] ?? {};
  const c = catalog.get(t.id);
  out.push(
    `#### ${icon} ${caseLink(t.id)}${t.key !== t.id ? ` [${t.variant}]` : ''} · ${t.title.replace(/^\S+\s(\[[^\]]+\]\s)?/, '')}`,
    '',
    `Priority ${c?.priority ?? '?'}${c?.critical === 'Y' ? ' · ★ critical business flow' : ''} · test: [${t.file}](../tests/${t.file})`,
    ''
  );
  if (a.why) out.push(`**${whyLabel}:** ${a.why}`, '');
  if (a.impact) out.push(`**Impact:** ${a.impact}`, '');
  if (a.decision) out.push(`**Decision needed:** ${a.decision}`, '');
  out.push('<details><summary>Test output</summary>', '', '```text', t.errors.join('\n\n') || '(no message)', '```', '', '</details>', '');
  for (const img of t.imageLinks ?? []) out.push(`![${t.key} · ${img.name}](${img.src})`, '');
}

/** [id, description] pairs of one annotation type, without repeats. */
function uniqueNotes(type) {
  const seen = new Set();
  return tests.flatMap(t => t.notes.filter(n => n.type === type).map(n => [t.id, n.description ?? '']))
    .filter(([id, d]) => !seen.has(id + d) && seen.add(id + d));
}

function slugify(s) {
  return s.toLowerCase().replace(/[^\p{L}\p{N} -]/gu, '').replaceAll(' ', '-');
}

const ICON = { PASS: '✅', FAIL: '❌', UNSTABLE: '⚠️', BLOCKED: '⛔' };
const byIssue = new Map();
for (const t of tests) {
  for (const n of t.notes.filter(n => n.type === 'reported issue')) {
    if (!byIssue.has(n.description)) byIssue.set(n.description, []);
    if (!byIssue.get(n.description).includes(t)) byIssue.get(n.description).push(t);
  }
}
if (byIssue.size) {
  out.push('## Reported issues: checked on Old EM', '',
    'Issues reported by the IT solution manager and testers (not sure whether they are real), each checked by running the test cases that target it.', '',
    '| Reported issue | Verdict | Tests (✅ pass · ❌ fail · ⚠️ unstable · ⛔ blocked) |', '|---|---|---|',
    ...[...byIssue].map(([issue, list]) => `| ${issue} | **${analysis.issues?.[issue]?.verdict ?? '?'}** | ${list.map(t => `${ICON[t.status]} ${t.key}`).join('<br>')} |`), '');
  for (const [issue, list] of byIssue) {
    const text = analysis.issues?.[issue]?.text;
    if (text) out.push(`### ${issue}`, '', text, '', ...list.filter(t => t.status !== 'PASS').map(t => `- ${ICON[t.status]} ${t.key}: see [${catalog.get(t.id)?.feature ?? 'Other'}](#${slugify(catalog.get(t.id)?.feature ?? 'Other')}) below`), '');
  }
}

if (failedAreas.length) {
  out.push('## Areas to focus on', '');
  for (const [area, list] of failedAreas) {
    out.push(`### ${area}`, '');
    if (analysis.areas?.[area]) out.push(analysis.areas[area], '');
    for (const t of list.filter(t => t.status === 'FAIL')) renderCase(t, '❌');
  }
}

const unstable = tests.filter(t => t.status === 'UNSTABLE');
if (unstable.length) {
  out.push('## Unstable cases (check by hand)', '', 'These failed in some runs and passed in others. The run result alone does not prove a defect.', '');
  for (const t of unstable) renderCase(t, '⚠️', 'What happens');
}

if (analysis.observations?.length) {
  out.push('## Other observations (not counted as failures)', '');
  for (const o of analysis.observations) out.push(`- **${o.title}.** ${o.text}`);
  out.push('');
}

const caseIssues = uniqueNotes('case issue');
if (caseIssues.length) {
  out.push('## Test-case corrections', '',
    'The test was run with the closest working data or reading; the case text should be updated so manual testers do the same.', '',
    '| Case | Note |', '|---|---|',
    ...caseIssues.map(([id, d]) => `| ${caseLink(id)} | ${d.replace(/\|/g, '\\|')} |`), '');
}

const notChecked = uniqueNotes('not checked');
if (notChecked.length) {
  out.push('<details><summary>Check areas not covered by the smoke run</summary>', '',
    '| Case | Not checked |', '|---|---|',
    ...notChecked.map(([id, d]) => `| ${id} | ${d.replace(/\|/g, '\\|')} |`), '', '</details>', '');
}

const blocked = tests.filter(t => t.status === 'BLOCKED');
if (blocked.length) {
  out.push('## Blocked cases', '', 'Not a verdict on Old EM: the case could not be run here.', '', '| Case | Reason |', '|---|---|');
  for (const t of blocked) out.push(`| ${caseLink(t.id)} ${t.title.replace(/^\S+\s/, '')} | ${((analysis[t.key] ?? analysis[t.id])?.why ?? t.skipReason ?? '').replace(/\|/g, '\\|')} |`);
  out.push('');
}

out.push('## Passing cases', '', '| Case | Area |', '|---|---|');
for (const t of tests.filter(t => t.status === 'PASS')) out.push(`| ${caseLink(t.id)}${t.key !== t.id ? ` [${t.variant}]` : ''} ${t.title.replace(/^\S+\s(\[[^\]]+\]\s)?/, '')} | ${catalog.get(t.id)?.feature ?? ''} |`);
out.push('', '## How to rerun', '', '```bash',
  'APP=old-em npx playwright test --project=chromium     # needs projects/old-em/.env (Old EM accounts)',
  'node projects/old-em/scripts/build-report.mjs         # rewrites this report',
  '```', '');

writeFileSync(join(REPORT_DIR, 'old-em-issues.md'), out.join('\n').replace(/\n{3,}/g, '\n\n'));
console.log(`report/old-em-issues.md: ${tests.length} cases, ${count(tests, 'FAIL')} fail, ${count(tests, 'BLOCKED')} blocked`);
