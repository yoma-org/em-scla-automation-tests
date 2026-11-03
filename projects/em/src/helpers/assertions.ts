// src/helpers/assertions.ts — shared web-first assertions
import { expect, type Locator } from '@playwright/test';
import { amountOrNull } from '@helpers/money';

/** Waits until the locator shows `expected` (normalized decimal string, e.g. '1000.000'). */
export async function expectAmount(locator: Locator, expected: string, fractionDigits = 2): Promise<void> {
  await expect
    .poll(async () => amountOrNull(await locator.innerText(), fractionDigits), { message: `amount in ${locator}` })
    .toBe(expected);
}
