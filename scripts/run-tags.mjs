#!/usr/bin/env node
// Run Playwright tests by tag expression, the same way locally and in CI.
//
//   node scripts/run-tags.mjs "<tags>" [--app em] [--print] [-- <extra playwright args>]
//
// Tag expression: groups separated by spaces or commas = OR; tags joined by "+" inside a group = AND.
//   "@sanity"               every sanity test
//   "@EM-92 @EM-93"         tests of EM-92 or EM-93
//   "@smoke"  "@e2e"        smoke suite / E2E flows
//   "@sanity+@P1"           sanity tests that are also P1
//   "@smoke @sanity+@P1"    smoke, plus sanity P1
//   "!@review" in a group   exclude: "@smoke+!@review" = smoke without review cases
// A missing "@" is added ("EM-92" = "@EM-92"). Tags match whole words: @EM-9 does not match @EM-92.
//
// --print  only prints the --grep regex. In GitHub Actions the script also writes
// `tags`, `grep` and `tasks` (Jira issues named in the tags, e.g. EM-92,EM-93) to $GITHUB_OUTPUT.
import { spawnSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const dashdash = argv.indexOf('--');
const own = dashdash >= 0 ? argv.slice(0, dashdash) : argv;
const extra = dashdash >= 0 ? argv.slice(dashdash + 1) : [];
const opt = name => {
  const i = own.indexOf(name);
  return i >= 0 ? own[i + 1] : undefined;
};
const app = opt('--app') ?? process.env.APP ?? 'em';
const printOnly = own.includes('--print');
const expression = own.filter((a, i) => !a.startsWith('--') && own[i - 1] !== '--app').join(' ').trim();

const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalise = tag => {
  const negate = tag.startsWith('!');
  const name = tag.replace(/^!/, '').replace(/^@*/, '@');
  return { negate, name };
};

/** "@a+@b @c" → [[a, b], [c]] */
function parse(expr) {
  return expr
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(group => group.split('+').filter(Boolean).map(normalise));
}

function toGrep(groups) {
  // Each tag must appear as a whole word in the title + tags string Playwright greps.
  const has = ({ negate, name }) => `(?${negate ? '!' : '='}.*${escape(name)}(?:\\s|$))`;
  return `^(?:${groups.map(g => g.map(has).join('')).join('|')})`;
}

if (!expression) {
  console.error('Usage: node scripts/run-tags.mjs "<tags>" [--app em] [--print] [-- <playwright args>]');
  process.exit(1);
}
const groups = parse(expression);
const grep = toGrep(groups);
const tags = groups.map(g => g.map(t => `${t.negate ? '!' : ''}${t.name}`).join('+')).join(' ');
const tasks = [...new Set(groups.flat().filter(t => !t.negate && /^@[A-Z][A-Z0-9]+-\d+$/.test(t.name)).map(t => t.name.slice(1)))];

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `tags=${tags}\ngrep=${grep}\ntasks=${tasks.join(',')}\n`);
}
console.log(`tags: ${tags}`);
console.log(`grep: ${grep}`);
if (printOnly) process.exit(0);

const result = spawnSync('npx', ['playwright', 'test', '-c', `projects/${app}`, '--grep', grep, ...extra], { stdio: 'inherit' });
process.exit(result.status ?? 1);
