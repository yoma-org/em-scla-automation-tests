# Network and Mocking

Use `page.route()` for controlled UI scenarios:

```ts
await page.route('**/api/products', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Product' }])
  });
});
```

Mock when:

- dependency is external;
- scenario is difficult to reproduce;
- deterministic failure behavior is required.

Do not mock the behavior being validated.

Example notes (`em` app):

- em-backend responses are encrypted. A mocked em-backend response must be encrypted the same
  way (an `encryptPayload()` helper next to `decryptPayload()`), or em-web will fail to read it.
- Money calculations, approvals and balances are never mocked: they are what EM tests validate.
- Good mock targets: notifications (Pusher), file storage (S3) errors, slow responses for
  loading states.
