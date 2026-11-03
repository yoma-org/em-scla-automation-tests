#!/usr/bin/env node
// Links tests to Jira issues by their issue tags (@EM-92; sanity() adds them to sanity tests).
//
//   node scripts/jira-tests.mjs tasks   --app em [--status QA]
//       Jira tasks in that status (default QA) that have tests. Prints them; in GitHub
//       Actions also writes `tasks=EM-92,EM-34` and `untested=EM-31` to $GITHUB_OUTPUT.
//   node scripts/jira-tests.mjs comment --app em --tasks EM-92,EM-34 [--dry-run]
//       Reads projects/<app>/test-results/results.json and adds one comment per task with
//       the result of each of its tests. --dry-run prints the comments instead.
//
// Env: JIRA_BASE_URL (https://<site>.atlassian.net), JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT (default EM).
// In CI also GITHUB_SERVER_URL / GITHUB_REPOSITORY / GITHUB_RUN_ID for the link to the run.
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const command = args[0];
const opt = name => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const app = opt('--app') ?? process.env.APP ?? 'em';
const dryRun = args.includes('--dry-run');
const TASK_TAG = /^@?([A-Z][A-Z0-9]+-\d+)$/;

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

async function jira(method, path, body) {
  const base = required('JIRA_BASE_URL').replace(/\/$/, '');
  const auth = Buffer.from(`${required('JIRA_EMAIL')}:${required('JIRA_API_TOKEN')}`).toString('base64');
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`Jira ${method} ${path} → ${res.status}: ${await res.text()}`);
  return res.status === 204 ? undefined : res.json();
}

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

/** Jira issue tags (EM-92 …) on all tests, from `playwright test --list`. */
function automatedTasks() {
  const json = execFileSync('npx', ['playwright', 'test', '-c', `projects/${app}`, '--list', '--reporter=json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'inherit']
  });
  const tasks = new Set();
  (function walk(suite) {
    for (const spec of suite.specs ?? []) for (const tag of spec.tags ?? []) {
      const m = TASK_TAG.exec(tag);
      if (m) tasks.add(m[1]);
    }
    for (const child of suite.suites ?? []) walk(child);
  })({ suites: JSON.parse(json).suites });
  return tasks;
}

async function tasksCommand() {
  const status = opt('--status') ?? 'QA';
  const project = process.env.JIRA_PROJECT ?? 'EM';
  const jql = `project = ${project} AND issuetype = Bug AND status = "${status}" ORDER BY key`;
  const keys = [];
  let nextPageToken;
  do {
    const page = await jira('POST', '/rest/api/3/search/jql', { jql, fields: ['summary'], maxResults: 100, nextPageToken });
    keys.push(...page.issues.map(i => i.key));
    nextPageToken = page.nextPageToken;
  } while (nextPageToken);

  const automated = automatedTasks();
  const tasks = keys.filter(k => automated.has(k));
  const untested = keys.filter(k => !automated.has(k));
  console.log(`Jira ${project} bugs in "${status}": ${keys.join(', ') || 'none'}`);
  console.log(`  with tests:    ${tasks.join(', ') || 'none'}`);
  console.log(`  without tests: ${untested.join(', ') || 'none'}`);
  setOutput('tasks', tasks.join(','));
  setOutput('untested', untested.join(','));
}

/** Results per Jira task from the Playwright JSON report. */
function resultsByTask(file) {
  if (!existsSync(file)) throw new Error(`${file} not found: run the tests first`);
  const report = JSON.parse(readFileSync(file, 'utf8'));
  const byTask = new Map();
  (function walk(suite) {
    for (const spec of suite.specs ?? []) {
      const tasks = (spec.tags ?? []).map(t => TASK_TAG.exec(t)?.[1]).filter(Boolean);
      for (const test of spec.tests ?? []) {
        const last = test.results?.at(-1);
        const row = {
          title: spec.title,
          project: test.projectName,
          // expected = passed (or failed under test.fail()), flaky = passed on retry
          status: { expected: 'passed', flaky: 'flaky', unexpected: 'failed', skipped: 'skipped' }[test.status] ?? test.status,
          error: last?.error?.message?.split('\n')[0]?.replace(/\u001b\[[0-9;]*m/g, '')
        };
        for (const t of tasks) byTask.set(t, [...(byTask.get(t) ?? []), row]);
      }
    }
    for (const child of suite.suites ?? []) walk(child);
  })({ suites: report.suites });
  return byTask;
}

const text = (t, marks) => ({ type: 'text', text: t, ...(marks ? { marks } : {}) });

function commentBody(task, rows) {
  const failed = rows.filter(r => r.status === 'failed');
  const verdict = failed.length
    ? `❌ ${failed.length} of ${rows.length} automated test(s) failed: the fix is not complete on the test environment.`
    : `✅ All ${rows.length} automated test(s) passed.`;
  const runUrl = process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : undefined;
  const icon = { passed: '✅', flaky: '⚠️', failed: '❌', skipped: '⏭️' };
  return {
    type: 'doc',
    version: 1,
    content: [
      { type: 'paragraph', content: [text(`Automated check for ${task}`, [{ type: 'strong' }])] },
      { type: 'paragraph', content: [text(verdict)] },
      {
        type: 'bulletList',
        content: rows.map(r => ({
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [text(`${icon[r.status] ?? r.status} ${r.title} [${r.project}]${r.error ? ` — ${r.error}` : ''}`)]
          }]
        }))
      },
      ...(runUrl
        ? [{ type: 'paragraph', content: [text('Report and traces: '), text(runUrl, [{ type: 'link', attrs: { href: runUrl } }])] }]
        : [])
    ]
  };
}

async function commentCommand() {
  const tasks = (opt('--tasks') ?? '').split(',').map(t => t.trim()).filter(Boolean);
  if (!tasks.length) throw new Error('Pass --tasks EM-92[,EM-93]');
  const byTask = resultsByTask(`projects/${app}/test-results/results.json`);
  for (const task of tasks) {
    const rows = byTask.get(task);
    if (!rows?.length) {
      console.log(`${task}: no test results, no comment`);
      continue;
    }
    const body = commentBody(task, rows);
    if (dryRun) {
      console.log(`--- ${task}\n${JSON.stringify(body, null, 2)}`);
      continue;
    }
    await jira('POST', `/rest/api/3/issue/${task}/comment`, { body });
    console.log(`${task}: commented (${rows.length} test results)`);
  }
}

const commands = { tasks: tasksCommand, comment: commentCommand };
if (!commands[command]) {
  console.error('Usage: node scripts/jira-tests.mjs <tasks|comment> --app em [--status QA] [--tasks EM-92] [--dry-run]');
  process.exit(1);
}
commands[command]().catch(e => {
  console.error(e.message);
  process.exit(1);
});
