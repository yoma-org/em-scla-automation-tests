#!/usr/bin/env node
// Publishes one feature module's test cases to Xray Cloud and records module runs there.
// The case sections in projects/<app>/docs/test-cases/features/*.md are the source.
//
//   node scripts/xray-sync.mjs preview --app em --feature 04 [--ids INV-001,INV-009]
//       Writes the Xray Tests that would be created to projects/<app>/docs/xray/preview-<feature>.md.
//       Never calls Xray. Review the preview before pushing.
//   node scripts/xray-sync.mjs push --app em --feature 04 --plan "<Test Plan name>" [--ids ...]
//       Creates (or updates) one Manual Xray Test per repo case, the module's Test Set and adds
//       the Tests to the Test Plan (created if the name is new). Issue keys are kept in
//       projects/<app>/docs/xray/xray-map.json, so running it again updates instead of duplicating.
//   node scripts/xray-sync.mjs execution --app em --feature 04 [--ids ...] [--new]   (adds to the open round; --new = next round)
//       Creates a Test Execution for the module under the Test Plan and prints its key.
//   node scripts/xray-sync.mjs result --app em --exec EM-123 --case INV-001 --status PASSED|FAILED|BLOCKED|TODO
//                                     [--failed-step 5 | --steps "6=FAILED:note,7=FAILED" [--other PASSED]]
//                                     [--defects EM-200] [--comment "..."]
//   node scripts/xray-sync.mjs steps --app em --case INV-001       (lists the Test's step numbers)
//   node scripts/xray-sync.mjs type --app em --case INV-002 --type Automated
//       Sets one case's run status (and the failed step) in that Test Execution.
//
// Jira Priority is not on the Test create screen: after push, set P1→High, P2→Medium (default), P3→Low on the new Tests in Jira.
// Env (projects/<app>/.env.test or .env): XRAY_CLIENT_ID, XRAY_CLIENT_SECRET, JIRA_PROJECT (default EM).
//
// Mapping of a repo case to an Xray Test (one Test per repo case; variants are extra steps):
//   summary      "<ID> · <title>"
//   labels       every Excel ID (TC_Inv_001) and Excel row (Invoice-Debit-Note_r5) of the case and its variants
//   description  metadata, preconditions, test data, variants table, source comments
//   steps        each "Steps" line → Action; the "Expected result" goes on the last step;
//                each variant → one step "Repeat with <variant>"; each check area → one step
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const command = args[0];
const opt = name => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const APP = opt('--app') ?? process.env.APP ?? 'em';
const FEATURE = opt('--feature');
const IDS = opt('--ids')?.split(',').map(s => s.trim());
const APP_DIR = join('projects', APP);
const XRAY_DIR = join(APP_DIR, 'docs/xray');
const MAP_FILE = join(XRAY_DIR, 'xray-map.json');

// Xray keys are the same for every environment: read them from .env.test or .env, whichever has them.
loadEnv(join(APP_DIR, '.env.test'));
loadEnv(join(APP_DIR, '.env'));
const PROJECT = process.env.JIRA_PROJECT ?? 'EM';

// ---------- parse

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const splitRow = line =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));

function featureFile() {
  if (!FEATURE) throw new Error('Pass --feature <nn> (e.g. 04)');
  const dir = join(APP_DIR, 'docs/test-cases/features');
  const f = readdirSync(dir).find(n => n.startsWith(`${FEATURE.padStart(2, '0')}-`) && n.endsWith('.md'));
  if (!f) throw new Error(`No feature file ${FEATURE}-*.md in ${dir}`);
  return join(dir, f);
}

// Numbered list ("1. foo" with indented continuation lines) → array of strings; plain text → one item.
function listItems(lines) {
  const items = [];
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) continue;
    const m = line.match(/^\d+\.\s+(.*)$/);
    if (m) items.push(m[1]);
    else if (items.length) items[items.length - 1] += `\n${line.trim()}`;
    else items.push(line.trim());
  }
  return items;
}

// "Invoice-Debit Note r5 (TC_Inv_001)" → { row: "Invoice-Debit-Note_r5", tc: "TC_Inv_001" }
function sourceLabels(source) {
  const m = source.match(/^(.*?)\s+r(\d+)\s*\(([^)]+)\)/);
  if (!m) return [];
  return [m[3].trim(), `${m[1].trim().replace(/\s+/g, '-')}_r${m[2]}`];
}

function parseCases(file) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const feature = lines[0].replace(/^# \d+ · /, '').trim();
  const cases = [];
  let c = null;
  let section = null;
  let sub = '';
  const start = lines.findIndex(l => l.trim() === '## Test cases');
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    let h;
    if ((h = line.match(/^### (.+)$/))) { sub = h[1].trim(); continue; }
    if ((h = line.match(/^#### (★ )?(\S+) · (.+)$/))) {
      const [pri, suites, auto, status, source] = splitRow(lines[i + 4] ?? '');
      c = {
        id: h[2], title: h[3].trim(), critical: !!h[1], feature, sub,
        priority: pri, suites, automation: auto, status, source,
        sections: {}, variants: [], comments: '',
      };
      cases.push(c);
      section = null;
      i += 4;
      continue;
    }
    if (!c) continue;
    if ((h = line.match(/^\*\*(Preconditions|Test data|Steps|Expected result|Check areas):\*\*/))) {
      section = h[1];
      c.sections[section] = [];
      continue;
    }
    // Run results are recorded in Xray executions, not in the Test: never part of a section.
    if (/^\*\*Run results:\*\*/.test(line)) { section = null; continue; }
    if (/^\*\*Data variants/.test(line)) {
      section = null;
      // Columns by header name: | # | Variant | Source | [Expected result |] Note |
      const head = splitRow(lines[i + 2] ?? '').map(h => h.toLowerCase());
      const col = (name, dflt) => (head.indexOf(name) >= 0 ? head.indexOf(name) : dflt);
      let j = i + 3;
      for (; j < lines.length && lines[j].startsWith('|'); j++) {
        const r = splitRow(lines[j]);
        const [n, label, source, note = ''] = [r[0], r[col('variant', 1)], r[col('source', 2)], r[col('note', 3)] ?? ''];
        const expected = head.includes('expected result') ? (r[head.indexOf('expected result')] ?? '') : '';
        if (/^:?-+:?$/.test(n)) continue;
        if (n === '1') { c.baseVariant = label.replace(/^\(base\)\s*/, ''); c.baseExpected = expected; continue; }
        c.variants.push({ n, label, source, note, expected });
      }
      i = j - 1;
      continue;
    }
    if ((h = line.match(/^> \*\*Source comments:\*\*\s*(.*)$/))) { c.comments = h[1]; section = null; continue; }
    if (line.trim() === '---') { section = null; continue; }
    if (section) c.sections[section].push(line);
  }
  for (const x of cases) {
    for (const k of Object.keys(x.sections)) x.sections[k] = listItems(x.sections[k]);
    x.labels = [...new Set([x.source, ...x.variants.map(v => v.source)].flatMap(sourceLabels))];
  }
  return { feature, cases };
}

// ---------- case → Xray Test

function toTest(c) {
  const S = c.sections;
  const steps = (S.Steps ?? []).map(a => ({ action: a, data: '', result: '' }));
  const expected = (S['Expected result'] ?? []).map((e, k, all) => (all.length > 1 ? `${k + 1}. ${e}` : e)).join('\n');
  if (steps.length) steps[steps.length - 1].result = expected;
  else steps.push({ action: 'Check the expected result (no steps defined in the source)', data: '', result: expected });
  for (const v of c.variants) {
    steps.push({
      action: `Variant ${v.n}: repeat the steps above with ${v.label}`,
      data: v.source + (v.note ? `\n${v.note}` : ''),
      result: v.expected, // empty: asked from the user when the case is tested
    });
  }
  for (const area of S['Check areas'] ?? []) {
    steps.push({
      action: `Check area: ${area}`,
      data: 'Capture the value before and after the action',
      result: '', // asked from the user when the case is tested
    });
  }
  const meta = [
    `*Repo case:* ${c.id}${c.critical ? ' (★ critical)' : ''}`,
    `*Module / sub-feature:* ${c.feature} / ${c.sub}`,
    `*Priority:* ${c.priority}   *Suites:* ${c.suites}`,
    `*Automation:* ${c.automation}`,
    `*Status:* ${c.status}`,
    `*Excel source:* ${c.source}`,
  ];
  const parts = [meta.join('\n')];
  if (S.Preconditions?.length) parts.push(`h3. Preconditions\n${S.Preconditions.map(x => `# ${x.replace(/\n/g, ' ')}`).join('\n')}`);
  if (S['Test data']?.length) parts.push(`h3. Test data\n${S['Test data'].map(x => `# ${x.replace(/\n/g, '; ')}`).join('\n')}`);
  if (c.variants.length) {
    const exp = c.variants.some(v => v.expected);
    const rows = [`|1|(base) ${c.baseVariant ?? ''}|${c.source}|${exp ? `${c.baseExpected || ' '}|` : ''} |`,
      ...c.variants.map(v => `|${v.n}|${v.label}|${v.source}|${exp ? `${v.expected || ' '}|` : ''}${v.note || ' '}|`)];
    parts.push(`h3. Data variants\n||#||Variant||Excel source||${exp ? 'Expected result||' : ''}Note||\n${rows.join('\n')}`);
  }
  if (c.comments) parts.push(`h3. Source comments\n${c.comments}`);
  return { id: c.id, summary: `${c.id} · ${c.title}`, labels: c.labels, description: parts.join('\n\n'), steps };
}

function selected() {
  const { feature, cases } = parseCases(featureFile());
  const chosen = IDS ? cases.filter(c => IDS.includes(c.id)) : cases;
  if (IDS) for (const id of IDS) if (!cases.some(c => c.id === id)) throw new Error(`${id} not found in feature ${FEATURE}`);
  return { feature, tests: chosen.map(toTest) };
}

// ---------- preview

function preview() {
  const { feature, tests } = selected();
  const md = [`# Xray preview · ${feature}`, '', `${tests.length} Test(s) → project ${PROJECT}, type Test (Manual).`, ''];
  for (const t of tests) {
    md.push(`## ${t.summary}`, '', `**Labels:** ${t.labels.map(l => `\`${l}\``).join(' ')}`, '', '**Description (Jira):**', '', '```', t.description, '```', '');
    md.push('**Steps:**', '', '| # | Action | Data | Expected result |', '|---|---|---|---|');
    t.steps.forEach((s, k) => md.push(`| ${k + 1} | ${cellText(s.action)} | ${cellText(s.data)} | ${cellText(s.result)} |`));
    md.push('');
  }
  mkdirSync(XRAY_DIR, { recursive: true });
  const out = join(XRAY_DIR, `preview-${FEATURE.padStart(2, '0')}.md`);
  writeFileSync(out, md.join('\n'));
  console.log(`Wrote ${out} (${tests.length} tests)`);
}
const cellText = s => (s || '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');

// ---------- Xray API

let token;
async function gql(query, variables = {}) {
  if (!token) {
    const id = process.env.XRAY_CLIENT_ID;
    const secret = process.env.XRAY_CLIENT_SECRET;
    if (!id || !secret) throw new Error(`Set XRAY_CLIENT_ID and XRAY_CLIENT_SECRET in ${APP_DIR}/.env`);
    const r = await fetch('https://xray.cloud.getxray.app/api/v2/authenticate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: id, client_secret: secret }),
    });
    if (!r.ok) throw new Error(`Xray authenticate failed: ${r.status} ${await r.text()}`);
    token = await r.json();
  }
  const r = await fetch('https://xray.cloud.getxray.app/api/v2/graphql', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  const body = await r.json();
  if (!r.ok || body.errors?.length) throw new Error(`Xray GraphQL error: ${JSON.stringify(body.errors ?? body)}`);
  return body.data;
}

const readMap = () => (existsSync(MAP_FILE) ? JSON.parse(readFileSync(MAP_FILE, 'utf8')) : { tests: {}, sets: {}, plans: {}, executions: [] });
const writeMap = m => { mkdirSync(XRAY_DIR, { recursive: true }); writeFileSync(MAP_FILE, `${JSON.stringify(m, null, 2)}\n`); };
const jira = (summary, extra = {}) => ({ fields: { summary, project: { key: PROJECT }, ...extra } });

async function createTest(t) {
  const d = await gql(
    `mutation($steps: [CreateStepInput], $jira: JSON!) {
       createTest(testType: { name: "Manual" }, steps: $steps, jira: $jira) { test { issueId jira(fields: ["key"]) } warnings }
     }`,
    { steps: t.steps, jira: jira(t.summary, { labels: t.labels, description: t.description }) },
  );
  if (d.createTest.warnings?.length) console.warn(`  ${t.id}: ${d.createTest.warnings.join('; ')}`);
  return { issueId: d.createTest.test.issueId, key: d.createTest.test.jira.key };
}

async function updateTest(t, entry) {
  // Replace steps: remove the old ones, add the new ones. Jira fields (summary/labels/description)
  // are updated through Jira, not Xray; print a reminder rather than touching them silently.
  const d = await gql(`query($id: String) { getTest(issueId: $id) { steps { id } } }`, { id: entry.issueId });
  for (const s of d.getTest.steps) await gql(`mutation($id: String!) { removeTestStep(stepId: $id) }`, { id: s.id });
  for (const s of t.steps) await gql(`mutation($id: String!, $s: CreateStepInput!) { addTestStep(issueId: $id, step: $s) { id } }`, { id: entry.issueId, s });
}

async function push() {
  const plan = opt('--plan');
  if (!plan) throw new Error('Pass --plan "<Test Plan name>"');
  const { feature, tests } = selected();
  const map = readMap();
  for (const t of tests) {
    const entry = map.tests[t.id];
    if (entry) {
      await updateTest(t, entry);
      console.log(`updated ${t.id} → ${entry.key} (steps; edit summary/labels/description in Jira if they changed)`);
    } else {
      map.tests[t.id] = await createTest(t);
      writeMap(map);
      console.log(`created ${t.id} → ${map.tests[t.id].key}`);
    }
  }
  const ids = tests.map(t => map.tests[t.id].issueId);
  if (!map.sets[feature]) {
    const d = await gql(`mutation($ids: [String], $jira: JSON!) { createTestSet(testIssueIds: $ids, jira: $jira) { testSet { issueId jira(fields: ["key"]) } } }`,
      { ids, jira: jira(feature, { labels: ['module-test-set'] }) });
    map.sets[feature] = { issueId: d.createTestSet.testSet.issueId, key: d.createTestSet.testSet.jira.key };
    console.log(`created Test Set ${map.sets[feature].key} · ${feature}`);
  } else {
    await gql(`mutation($id: String!, $ids: [String]!) { addTestsToTestSet(issueId: $id, testIssueIds: $ids) { addedTests } }`, { id: map.sets[feature].issueId, ids });
  }
  if (!map.plans[plan]) {
    const d = await gql(`mutation($ids: [String], $jira: JSON!) { createTestPlan(testIssueIds: $ids, jira: $jira) { testPlan { issueId jira(fields: ["key"]) } } }`,
      { ids, jira: jira(plan) });
    map.plans[plan] = { issueId: d.createTestPlan.testPlan.issueId, key: d.createTestPlan.testPlan.jira.key };
    console.log(`created Test Plan ${map.plans[plan].key} · ${plan}`);
  } else {
    await gql(`mutation($id: String!, $ids: [String]!) { addTestsToTestPlan(issueId: $id, testIssueIds: $ids) { addedTests } }`, { id: map.plans[plan].issueId, ids });
  }
  map.currentPlan = plan;
  writeMap(map);
}

// One Test Execution per module per test round (user decision 2026-11-18): the open round of the feature is
// reused, and cases are added to it as they are run. A rerun updates the case's run in the same execution
// (Xray keeps the history). `--new` starts the next round ("<feature> · Round n").
async function execution() {
  const build = opt('--build');
  const { feature, tests } = selected();
  const map = readMap();
  map.rounds ??= {};
  const plan = map.plans[map.currentPlan];
  const missing = tests.filter(t => !map.tests[t.id]).map(t => t.id);
  if (missing.length) throw new Error(`Not in Xray yet (run push first): ${missing.join(', ')}`);
  const ids = tests.map(t => map.tests[t.id].issueId);
  const open = map.executions.find(e => e.key === map.rounds[feature]);
  if (open && !args.includes('--new')) {
    await gql(`mutation($id: String!, $t: [String]!) { addTestsToTestExecution(issueId: $id, testIssueIds: $t) { addedTests warning } }`, { id: open.issueId, t: ids });
    open.cases = [...new Set([...(open.cases ?? []), ...tests.map(t => t.id)])];
    writeMap(map);
    console.log(`using open round ${open.key} · ${open.summary ?? feature} (+ ${tests.map(t => t.id).join(', ')})`);
    return;
  }
  const round = map.executions.filter(e => e.feature === feature).length + 1;
  const summary = `${feature} · Round ${round}`;
  const d = await gql(`mutation($ids: [String], $jira: JSON!) { createTestExecution(testIssueIds: $ids, jira: $jira) { testExecution { issueId jira(fields: ["key"]) } } }`,
    { ids, jira: jira(summary, { labels: ['module-run'] }) });
  const exec = { issueId: d.createTestExecution.testExecution.issueId, key: d.createTestExecution.testExecution.jira.key, feature, summary, round, cases: tests.map(t => t.id), ...(build ? { firstBuild: build } : {}) };
  if (plan) await gql(`mutation($id: String!, $e: [String]!) { addTestExecutionsToTestPlan(issueId: $id, testExecIssueIds: $e) { addedTestExecutions } }`, { id: plan.issueId, e: [exec.issueId] });
  map.executions.push(exec);
  map.rounds[feature] = exec.key;
  writeMap(map);
  console.log(`created Test Execution ${exec.key} · ${summary}${plan ? ` (in ${plan.key})` : ''}`);
}

const jiraAuth = () => {
  const { JIRA_EMAIL: e, JIRA_API_TOKEN: t } = process.env;
  if (!e || !t) return {};
  return { Authorization: `Basic ${Buffer.from(`${e}:${t}`).toString('base64')}`, Accept: 'application/json' };
};

/** Sets a Test's Xray Test Type (Manual → Automated once its Playwright test passes). Steps are kept. */
async function type() {
  const map = readMap();
  const test = map.tests[opt('--case')];
  const name = opt('--type');
  if (!test || !name) throw new Error('Pass --case <id> --type Manual|Automated');
  await gql(`mutation($id: String!, $t: UpdateTestTypeInput!) { updateTestType(issueId: $id, testType: $t) { issueId testType { name } } }`, { id: test.issueId, t: { name } });
  test.type = name;
  writeMap(map);
  console.log(`${opt('--case')} (${test.key}) → Test Type ${name}`);
}

/** Prints a Test's steps with their numbers (to choose --steps). */
async function steps() {
  const map = readMap();
  const test = map.tests[opt('--case')];
  if (!test) throw new Error(`Unknown case ${opt('--case')} in ${MAP_FILE}`);
  const d = await gql(`query($id: String!) { getTest(issueId: $id) { steps { action result } } }`, { id: test.issueId });
  d.getTest.steps.forEach((s, k) => console.log(`${k + 1}. ${s.action.replace(/\s+/g, ' ').slice(0, 110)}${s.result ? `  →  ${s.result.replace(/\s+/g, ' ').slice(0, 60)}` : ''}`));
}

async function result() {
  const map = readMap();
  const execKey = opt('--exec');
  const caseId = opt('--case');
  const status = opt('--status');
  const failedStep = opt('--failed-step');
  const comment = opt('--comment');
  const exec = map.executions.find(e => e.key === execKey);
  const test = map.tests[caseId];
  if (!exec || !test) throw new Error(`Unknown execution ${execKey} or case ${caseId} in ${MAP_FILE}`);
  const d = await gql(`query($t: String, $e: String) { getTestRun(testIssueId: $t, testExecIssueId: $e) { id steps { id } } }`, { t: test.issueId, e: exec.issueId });
  const run = d.getTestRun;
  // --steps "6=FAILED:no success message,7=FAILED" sets those steps; every other step gets --other (default PASSED).
  // --failed-step n (older form): steps before n PASSED, n FAILED, after n TODO.
  const stepSpec = opt('--steps');
  const other = opt('--other') ?? 'PASSED';
  const plan = new Map();
  if (stepSpec) {
    for (const part of stepSpec.split(/,(?=\s*\d+=)/)) {
      const [, n, st, note] = part.match(/^\s*(\d+)=(\w+)(?::(.*))?$/) ?? [];
      if (!n) throw new Error(`Bad --steps entry "${part}" (use n=STATUS[:comment])`);
      plan.set(Number(n), { st, note: note?.trim() });
    }
  }
  if (stepSpec || failedStep) {
    const n = Number(failedStep);
    for (const [k, s] of run.steps.entries()) {
      const i = k + 1;
      const p = plan.get(i);
      const st = stepSpec ? (p?.st ?? other) : i < n ? 'PASSED' : i === n ? 'FAILED' : 'TODO';
      const note = stepSpec ? p?.note : i === n ? comment : undefined;
      await gql(`mutation($r: String!, $s: String!, $u: UpdateTestRunStepInput!) { updateTestRunStep(testRunId: $r, stepId: $s, updateData: $u) { warnings } }`,
        { r: run.id, s: s.id, u: { status: st, ...(note ? { comment: note } : {}) } });
    }
  }
  // --defects EM-200,EM-201 links bugs to the test run (Xray "Defects").
  const defects = opt('--defects');
  if (defects) {
    const ids = [];
    for (const key of defects.split(',').map(k => k.trim())) {
      if (/^\d+$/.test(key)) { ids.push(key); continue; } // already a Jira issue id
      const r = await fetch(`https://${process.env.JIRA_SITE ?? 'zeyalabs-team-a83df6me.atlassian.net'}/rest/api/3/issue/${key}?fields=summary`, { headers: jiraAuth() });
      if (!r.ok) throw new Error(`Cannot read ${key} from Jira (${r.status}); set JIRA_EMAIL / JIRA_API_TOKEN or pass issue ids`);
      ids.push((await r.json()).id);
    }
    await gql(`mutation($id: String!, $i: [String]!) { addDefectsToTestRun(id: $id, issues: $i) { addedDefects warnings } }`, { id: run.id, i: ids });
  }
  await gql(`mutation($id: String!, $st: String!) { updateTestRunStatus(id: $id, status: $st) }`, { id: run.id, st: status });
  if (comment) await gql(`mutation($id: String!, $c: String!) { updateTestRunComment(id: $id, comment: $c) }`, { id: run.id, c: comment });
  console.log(`${caseId} → ${status}${failedStep ? ` (failed at step ${failedStep})` : ''} in ${execKey}`);
}

const commands = { preview, push, execution, result, steps, type };
if (!commands[command]) {
  console.error('Usage: node scripts/xray-sync.mjs preview|push|execution|result --app <app> --feature <nn> ... (see header)');
  process.exit(1);
}
await commands[command]();
