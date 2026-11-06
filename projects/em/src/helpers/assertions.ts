// src/helpers/assertions.ts — shared web-first assertions
import { expect, type Locator } from '@playwright/test';
import { amountOrNull } from '@helpers/money';

/**
 * Waits until the locator shows `expected` (normalized decimal string, e.g. '1000.000').
 * `soft: true` records a failure and lets the test go on, like expect.soft.
 */
export async function expectAmount(
  locator: Locator,
  expected: string,
  fractionDigits = 2,
  { soft = false }: { soft?: boolean } = {}
): Promise<void> {
  await (soft ? expect.configure({ soft: true }) : expect)
    .poll(async () => amountOrNull(await locator.innerText(), fractionDigits), { message: `amount in ${locator}` })
    .toBe(expected);
}
