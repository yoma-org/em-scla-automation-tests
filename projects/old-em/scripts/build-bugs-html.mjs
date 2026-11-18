// scripts/build-bugs-html.mjs — turns report/old-em-bugs*.md into ONE self-contained HTML file each
// (screenshots embedded), so the file can be sent by mail / chat without the img/ folder.
//
//   node projects/old-em/scripts/build-bugs-html.mjs          (from the repo root)
//
// Markdown → HTML: the `marked` CLI via npx (pinned, no project dependency). Styling: the <style> block of
// report/old-em-issues.html. Images: recompressed with macOS `sips` (JPEG quality "normal") and inlined as base64.
// Links to local files are turned into plain text (the reader has no repo); web links are kept.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPORT = 'projects/old-em/report';
const FILES = [['old-em-bugs.md', 'old-em-bugs.html', 'en'], ['old-em-bugs.vi.md', 'old-em-bugs.vi.html', 'vi']];

const styleSrc = readFileSync(join(REPORT, 'old-em-issues.html'), 'utf8');
const style = styleSrc.slice(styleSrc.indexOf('<style>'), styleSrc.indexOf('</style>') + 8);
const toolbar = `<div class="toolbar"><button onclick="document.querySelectorAll('details').forEach(d=>d.open=true)">Expand all</button>` +
  `<button onclick="document.querySelectorAll('details').forEach(d=>d.open=false)">Collapse all</button></div>`;

const tmp = mkdtempSync(join(tmpdir(), 'old-em-bugs-'));
const cache = new Map();
function dataUri(rel) {
  if (!cache.has(rel)) {
    const out = join(tmp, `${cache.size}.jpg`);
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', 'normal', join(REPORT, rel), '--out', out], { stdio: 'ignore' });
    cache.set(rel, `data:image/jpeg;base64,${readFileSync(out).toString('base64')}`);
  }
  return cache.get(rel);
}

try {
  for (const [md, html, lang] of FILES) {
    const src = join(REPORT, md);
    const title = (/^# (.+)$/m.exec(readFileSync(src, 'utf8')) ?? [, 'Old EM bugs'])[1];
    let body = execFileSync('npx', ['--yes', 'marked@12.0.2', '--gfm', '-i', src], { encoding: 'utf8', maxBuffer: 64 << 20 });
    let images = 0;
    body = body.replace(/src="(img\/[^"]+)"/g, (_, rel) => { images++; return `src="${dataUri(rel)}"`; });
    body = body.replace(/<a href="(?!https?:|#)[^"]*">([\s\S]*?)<\/a>/g, '$1');
    const page = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8">` +
      `<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${style}</head>\n` +
      `<body>${toolbar}<main>${body}</main></body></html>\n`;
    writeFileSync(join(REPORT, html), page);
    console.log(`${html}: ${images} images inlined, ${(page.length / 1e6).toFixed(1)} MB`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
