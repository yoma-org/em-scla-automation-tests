// src/helpers/race.ts — two sessions acting at the same moment (concurrency cases, tests/issues/concurrency.spec.ts).
//
// Old EM API responses are AES-encrypted, so the race is driven through two real UI sessions:
//   secondSession(browser)        a second browser context logged in as the same admin (APPROVER_* is empty on UAT).
//   race(pages, clicks)           fires the final clicks together AND holds each session's first write request
//                                 (POST/PUT/PATCH/DELETE to the API) with page.route until every session has sent
//                                 one, then releases them together, so both reach the server truly at once.
//                                 → per session: the write URL, HTTP status, and how far apart they arrived.
//   outcome(page, successUrl?)    what the user saw after the click: toasts / dialog text / landing URL.
import { expect, test, type Browser, type Page, type Request, type Route } from '@playwright/test';
import { authFile } from '@utils/Environment';

export async function secondSession(browser: Browser): Promise<Page> {
  const use = test.info().project.use;
  const context = await browser.newContext({
    baseURL: use.baseURL, viewport: use.viewport ?? { width: 1440, height: 900 }, storageState: authFile('admin')
  });
  return context.newPage();
}

export interface RaceWrite { session: number; method: string; url: string; status: number | null; arrivedAt: number }
export interface RaceResult { writes: RaceWrite[]; spreadMs: number; held: boolean; method: string }

const isWrite = (r: Request) => ['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && /\/api\//.test(r.url());

/**
 * Arms a barrier on every page, runs all clicks at once, waits for each held write's response.
 * Requests that are not writes pass through untouched.
 */
export async function race(pages: Page[], clicks: (() => Promise<void>)[], holdMs = 10_000): Promise<RaceResult> {
  const arrived: (RaceWrite | undefined)[] = pages.map(() => undefined);
  let release!: () => void;
  const allArrived = new Promise<void>(r => { release = r; });
  const responses: (Promise<number | null> | undefined)[] = [];
  const handlers = pages.map((page, i) => {
    let done = false;
    const handler = async (route: Route) => {
      const req = route.request();
      if (done || !isWrite(req)) return route.fallback();
      done = true;
      arrived[i] = { session: i + 1, method: req.method(), url: req.url().replace(/^https?:\/\/[^/]+/, ''), status: null, arrivedAt: Date.now() };
      responses[i] = page.waitForResponse(res => res.request() === req, { timeout: 60_000 }).then(res => res.status(), () => null);
      if (arrived.every(Boolean)) release();
      await Promise.race([allArrived, new Promise(r => setTimeout(r, holdMs))]);
      await route.continue();
    };
    return { page, handler };
  });
  for (const { page, handler } of handlers) await page.route('**/*', handler);
  try {
    await Promise.all(clicks.map(c => c()));
    // Wait until each session sent its write (or the hold ran out).
    await Promise.race([allArrived, new Promise(r => setTimeout(r, holdMs + 2_000))]);
    for (let i = 0; i < pages.length; i++) {
      const res = responses[i]; if (arrived[i] && res) arrived[i]!.status = await res;
    }
  } finally {
    for (const { page, handler } of handlers) await page.unroute('**/*', handler).catch(() => {});
  }
  const writes = arrived.filter((w): w is RaceWrite => !!w);
  const times = writes.map(w => w.arrivedAt);
  const spreadMs = times.length ? Math.max(...times) - Math.min(...times) : 0;
  const held = writes.length === pages.length;
  const method = held
    ? `two sessions of the same admin; Confirm/Submit clicked together (Promise.all) and each write request held by page.route until both were sent (${spreadMs} ms apart), then released together`
    : `two sessions clicked together; only ${writes.length} of ${pages.length} sessions sent a write request (the other was stopped in the browser)`;
  return { writes, spreadMs, held, method };
}

export interface Outcome { url: string; messages: string[] }

/** Toast / dialog texts and URL a few seconds after the click. Waits until something shows or `successUrl` is reached. */
export async function outcome(page: Page, successUrl?: RegExp, waitMs = 20_000): Promise<Outcome> {
  const toasts = page.locator('.p-toast').getByRole('alert');
  const dialogs = page.getByRole('alertdialog').or(page.getByRole('dialog'));
  const swal = page.locator('.swal2-popup');
  const signal = [toasts.first().waitFor({ timeout: waitMs }), dialogs.first().waitFor({ timeout: waitMs }), swal.first().waitFor({ timeout: waitMs })];
  if (successUrl) signal.push(expect(page).toHaveURL(successUrl, { timeout: waitMs }));
  await Promise.any(signal).catch(() => {});
  await page.waitForTimeout(1_500);
  const texts = [
    ...(await toasts.allInnerTexts()), ...(await dialogs.allInnerTexts()), ...(await swal.allInnerTexts())
  ].map(t => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
  return { url: page.url().replace(/^https?:\/\/[^/]+/, ''), messages: [...new Set(texts)] };
}

export function describeOutcome(o: Outcome): string {
  return `${o.url}${o.messages.length ? ` — "${o.messages.join('" / "')}"` : ' — no message'}`;
}
