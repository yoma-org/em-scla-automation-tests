// src/helpers/evidence.ts — screenshot attached to the test report; these become the Jira retest images.
import { test, type Locator, type Page } from '@playwright/test';

const BAR_ID = '__qa-evidence-bar';

/** "2026-11-09 15:36 (GMT+7)": the team reads times in Vietnam time. */
function stamp(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const p = (t: string) => parts.find(x => x.type === t)?.value ?? '';
  return `${p('year')}-${p('month')}-${p('day')} ${p('hour')}:${p('minute')} (GMT+7)`;
}

/**
 * Adds a bar at the bottom of the page with what a reviewer needs to trust the shot:
 * app, build (sidebar "Application version"), page URL, time and Jira ticket.
 * Screenshots have no browser address bar, so without it the URL is lost.
 */
async function addInfoBar(page: Page): Promise<void> {
  const tickets = test.info().annotations.filter(a => a.type === 'jira').map(a => a.description).join(', ');
  await page.evaluate(({ id, time, tickets }) => {
    const build = /v\d+\.\d+\.\d+-\d+-g[0-9a-f]+/.exec(document.body.innerText)?.[0] ?? 'build ?';
    const bar = document.createElement('div');
    bar.id = id;
    bar.textContent = ['NEW EM', build, location.href, time, tickets].filter(Boolean).join(' · ');
    Object.assign(bar.style, {
      position: 'fixed', left: '0', right: '0', bottom: '0', zIndex: '2147483647',
      padding: '4px 8px', background: '#111', color: '#fff',
      font: '12px/1.4 ui-monospace, Menlo, monospace', whiteSpace: 'nowrap', overflow: 'hidden',
      textOverflow: 'ellipsis', pointerEvents: 'none'
    });
    document.body.appendChild(bar);
  }, { id: BAR_ID, time: stamp(), tickets });
}

async function removeInfoBar(page: Page): Promise<void> {
  await page.evaluate(id => document.getElementById(id)?.remove(), BAR_ID).catch(() => {});
}

/**
 * animations: 'disabled' finishes open animations, so an open dropdown shows in the shot.
 * mask: blacks out personal data (names, NRC, phone) so the shot can be posted on Jira.
 * Every shot carries the info bar (build, URL, time, ticket) at the bottom.
 */
export async function evidence(page: Page, name: string, mask: Locator[] = []): Promise<void> {
  await addInfoBar(page);
  try {
    const body = await page.screenshot({ animations: 'disabled', mask, maskColor: '#000' });
    await test.info().attach(name, { body, contentType: 'image/png' });
  } finally {
    await removeInfoBar(page);
  }
}
