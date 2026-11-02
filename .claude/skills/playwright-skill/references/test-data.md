# Test Data

## Static Data

Use `src/data/static/` for stable JSON inputs (e.g. UO import file templates, expected
messages). Credentials never go here; they come from `.env`.

## Generated Data

```ts
import { faker } from '@faker-js/faker';

export function runTag(workerIndex: number): string {
  const day = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `AT-${day}-${workerIndex}-${faker.string.alphanumeric(4).toUpperCase()}`;
}

export function buildContact(overrides: Partial<Contact> = {}): Contact {
  return {
    name: faker.person.fullName(),
    phone: `09${faker.string.numeric(9)}`,
    nrc: buildNrc(),
    ...overrides
  };
}
```

- `buildNrc()` must produce the format em-web validates (`<state>/<township>(N)<6 digits>`),
  using a township code em-web accepts.
- Amounts are strings or integers in the document currency, never floats.

## Rules

- every test or flow creates its own apartment / contact (`runTag` in the name) so
  balances start from zero;
- log the faker seed (`faker.seed()`) in the test so failing data can be reproduced;
- sensitive or real resident data must not be committed;
- approved financial records cannot be deleted; isolation comes from unique data on a
  dedicated environment (see the app's `PROJECT.md`);
- tests must not depend on pre-existing mutable records;
- data should match the business partition being tested (currency, utility type, month).
