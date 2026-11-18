// Partner API (estate-billing-api), ../em/docs/test-cases/features/26-api.md.
// Base URL: PARTNER_API_BASE_URL (Settings › API Access "Application URL" + /api). Documented endpoints
// (Swagger at <host>/docs/api-docs.json): GET /v1/get_token/{auth}, POST /v1/apartment_soa
// {apartment, month}, POST /v1/apartment_summary {apartment} (form-urlencoded, Bearer token).
//
// The file creates its own API key (Settings › API Access, Contact / Apartment + Summary + Soa permissions),
// exchanges it for a token ONCE (each exchange deletes the key's earlier tokens, MONEY_FLOWS.md §8), and
// deletes the key at the end. The SOA / AR summary cases read the test's own apartment with one UO invoice.
import { test, expect } from '@fixtures';
import { type APIResponse } from '@playwright/test';
import { testCase } from '@helpers/testCase';
import { createApartment, createUoInvoice, type Apartment } from '@data/builders';
import { asAdmin, createApiKey, deleteApiKey, type ApiKey } from '@data/access';
import { InvoiceDetailPage } from '@pages/invoices/InvoiceDetailPage';

const API = (process.env.PARTNER_API_BASE_URL || 'https://www.uat.ted-api.synergy.yomaland360.com/api').replace(/\/$/, '');

/** Response body for the report: status + JSON (trimmed). */
async function attach(name: string, res: APIResponse): Promise<string> {
  const text = await res.text();
  await test.info().attach(name, { body: `${res.status()} ${res.url().replace(/get_token\/[^/?]+/, 'get_token/***')}\n\n${text.slice(0, 20_000)}`, contentType: 'text/plain' });
  return text;
}

function json(text: string): any {
  try { return JSON.parse(text); } catch { return undefined; }
}

test.describe('API · Partner API', () => {
  test.describe.configure({ timeout: 300_000 });

  let apiKey: ApiKey | undefined;
  let token: string | undefined;
  /** The one token exchange of this file (done in beforeAll, asserted by API-001). */
  let exchange: { status: number; text: string } | undefined;
  let apartment: Apartment | undefined;
  let invoiceTotal = 0;

  test.beforeAll(async ({ browser, baseURL, playwright }) => {
    test.setTimeout(600_000);
    apiKey = await asAdmin(browser, baseURL, page => createApiKey(page, 'API', ['Contact / Apartment', 'Summary', 'Soa']))
      .catch(e => { console.warn(`API key could not be created: ${(e as Error).message}`); return undefined; });
    if (apiKey) {
      const request = await playwright.request.newContext();
      const res = await request.get(`${API}/v1/get_token/${apiKey.key}`, { headers: { Accept: 'application/json' } });
      exchange = { status: res.status(), text: await res.text() };
      const t = json(exchange.text)?.accessToken;
      token = typeof t === 'string' && t.length > 20 ? t : undefined;
      await request.dispose();
    }
  });

  test.afterAll(async ({ browser, baseURL }) => {
    if (apiKey) {
      const label = apiKey.label;
      await asAdmin(browser, baseURL, page => deleteApiKey(page, label)).catch(e => console.warn(`API key cleanup failed: ${e.message}`));
    }
  });

  test('API-001 Get access token with valid client credentials',
    testCase({ id: 'API-001', source: 'CMD_001', priority: 'P1', smoke: true, critical: true }),
    async () => {
      test.skip(!apiKey, 'BLOCKED: no API key could be created in Settings › API Access');
      test.info().annotations.push({ type: 'data', description: `GET ${API}/v1/get_token/{key} (documented token endpoint), key "${apiKey!.label}"` });

      await test.info().attach('API-001 get_token response', { body: `${exchange!.status}\n\n${exchange!.text.replace(/"accessToken":"[^"]+"/, '"accessToken":"<redacted>"')}`, contentType: 'text/plain' });
      const body = json(exchange!.text);
      expect.soft(exchange!.status, 'Expected 1: 200 status code').toBe(200);
      expect(token, `Expected 2: an access token is returned. Body keys: ${Object.keys(body ?? {})}`).toBeTruthy();
    });

  test('API-002 Access token is not issued for invalid credentials (401)',
    testCase({ id: 'API-002', source: 'CMD_002', priority: 'P1', smoke: true, critical: true }),
    async ({ request }) => {
      test.info().annotations.push({ type: 'case issue', description: 'Steps send an "invalid (or) uncomplete authentication token" to the token request; run as an invalid and a truncated API key (source-issues.md).' });
      const keys: Record<string, string> = { invalid: `QEOLDinvalid${Date.now()}` };
      if (apiKey) keys.truncated = apiKey.key.slice(0, -5);

      for (const [what, key] of Object.entries(keys)) {
        await test.step(`${what} key`, async () => {
          const res = await request.get(`${API}/v1/get_token/${key}`, { headers: { Accept: 'application/json' } });
          const text = await attach(`API-002 ${what} key response`, res);
          const body = json(text);
          expect.soft(res.status(), `${what} key: Expected 1: 401 status code`).toBe(401);
          expect.soft(body?.accessToken, `${what} key: Expected 2: no access token is issued`).toBeUndefined();
          expect.soft(String(body?.message ?? ''), `${what} key: Expected 2: an error message is shown. Body: ${text.slice(0, 200)}`).not.toBe('');
        });
      }
    });

  test.describe('Apartment', () => {
    test.beforeAll(async ({ browser, baseURL }) => {
      test.setTimeout(600_000);
      if (!apiKey) return;
      await asAdmin(browser, baseURL, async page => {
        apartment = await createApartment(page);
        const inv = await createUoInvoice(page, apartment, { 'Electricity (YESC)': { previous: 0, current: 10 } });
        const detail = new InvoiceDetailPage(page);
        await detail.goto(inv.invoiceId);
        await expect(detail.total, "UO invoice total (not the 0.00 shown while loading)").toHaveText(/Total:\s*[1-9][\d,]*\.\d\d/);
        invoiceTotal = Number((await detail.total.innerText()).match(/([\d,]+\.\d\d)/)![1].replace(/,/g, ''));
      });
    });

    test('API-013 Get Apartment SOA by apartment and month',
      testCase({ id: 'API-013', source: 'APM-001', priority: 'P1', smoke: true, critical: true }),
      async ({ request }) => {
        test.skip(!apiKey, 'BLOCKED: no API key could be created in Settings › API Access');
        test.skip(!token, 'BLOCKED: the token exchange (API-001) returned no token');
        const month = new Date().toISOString().slice(0, 7);
        test.info().annotations.push({ type: 'data', description: `apartment ${apartment!.name} (own, one UO invoice ${invoiceTotal} Ks this month), month ${month}` });

        const res = await request.post(`${API}/v1/apartment_soa`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }, form: { apartment: apartment!.name, month }
        });
        const body = json(await attach('API-013 apartment_soa response', res));
        expect.soft(res.status(), 'Expected 1: 200 status code').toBe(200);

        const mmk = body?.data?.MMK as Record<string, any[]> | undefined;
        const rows = Object.values(mmk ?? {}).flat();
        expect(rows.length, 'Expected 2: the apartment SOA (MMK) is returned as a list').toBeGreaterThan(0);
        const amounts = rows.map(r => Number(String(r.amount).replace(/,/g, '')));
        expect.soft(amounts, `Expected 2: the SOA lists the apartment's UO invoice (${invoiceTotal} Ks)`).toContain(invoiceTotal);
        const last = rows[rows.length - 1];
        expect.soft(Number(String(last?.balance).replace(/,/g, '')), 'SOA closing balance = the unpaid invoice').toBe(invoiceTotal);
      });

    test('API-020 Get AR summary by apartment',
      testCase({ id: 'API-020', source: 'APM-021', priority: 'P1', smoke: true, critical: true }),
      async ({ request }) => {
        test.skip(!apiKey, 'BLOCKED: no API key could be created in Settings › API Access');
        test.skip(!token, 'BLOCKED: the token exchange (API-001) returned no token');
        test.info().annotations.push({ type: 'data', description: `apartment ${apartment!.name} (own, one unpaid UO invoice ${invoiceTotal} Ks, due on receipt)` });

        const res = await request.post(`${API}/v1/apartment_summary`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }, form: { apartment: apartment!.name }
        });
        const body = json(await attach('API-020 apartment_summary response', res));
        expect.soft(res.status(), 'Expected 1: 200 status code').toBe(200);

        const mmk = body?.MMK;
        expect(Array.isArray(mmk?.boxes), 'Expected 2: the AR summary (MMK) is returned with its ageing boxes').toBe(true);
        expect.soft(Number(String(mmk.accounts_receivable).replace(/,/g, '')), 'MMK accounts_receivable = the unpaid UO invoice').toBe(invoiceTotal);
        const boxTotal = (mmk.boxes as { Name: string; amount: number | string }[])
          .filter(b => b.Name !== 'Total Overdue')
          .reduce((s, b) => s + Number(String(b.amount).replace(/,/g, '')), 0);
        expect.soft(boxTotal, 'Sum of the ageing boxes = accounts_receivable').toBe(invoiceTotal);
      });
  });
});
