# API Testing

Read the API sections of `projects/<app>/PROJECT.md` first. The examples below come from the
`em` app, whose back-office API encrypts every response body (hence `decryptPayload()`); an
app without that quirk reads `response.json()` in the same place.

## Back-office Request Context

```ts
import { request, type APIRequestContext } from '@playwright/test';
import { env } from '@utils/Environment';

export async function backOfficeContext(token?: string): Promise<APIRequestContext> {
  return request.newContext({
    baseURL: env.apiBaseUrl,
    extraHTTPHeaders: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
}
```

Dispose contexts you create (`await ctx.dispose()`) in the owning fixture's teardown.

## API Client

Every em-backend client reads bodies through `decryptPayload()`:

```ts
import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { decryptPayload } from '@api/crypto';

export class InvoicesApi {
  constructor(private readonly request: APIRequestContext) {}

  async get(id: string): Promise<{ response: APIResponse; body: Invoice }> {
    const response = await this.request.get(`invoices/${id}`);
    return { response, body: await decryptPayload<Invoice>(response) };
  }
}
```

- Clients return the response and the decoded body; the **spec** asserts status and values.
- Throw (not `expect`) inside clients only for setup steps that must succeed, with a message
  naming the call and status.

## API Test

```ts
import { test, expect } from '@fixtures';

test('INV-0xx approved invoice due amount equals grand total', { tag: ['@P1'] }, async ({ invoicesApi, approvedInvoice }) => {
  const { response, body } = await invoicesApi.get(approvedInvoice.id);

  expect(response.status()).toBe(200);
  expect(body.due_amount).toBe(body.grand_total);
});
```

(Placeholder ID and fields; take the real ones from the case and the API.)

## Concurrency

```ts
const [first, second] = await Promise.all([
  makerA.payments.pay(invoice.id, invoice.due_amount),
  makerB.payments.pay(invoice.id, invoice.due_amount)
]);

// CONC-001 style (one must lose). Status codes are placeholders: use the ones the API returns.
const statuses = [first.response.status(), second.response.status()].sort();
expect(statuses).toEqual([200, 422]);
```

Each simulated user has its own request context and token.

## Validate

- status;
- body values (amounts as exact decimals);
- schema or contract;
- permissions per role (expect 403 for roles without the permission);
- error handling and messages;
- business rules;
- data consistency between UI, API and PDF.
