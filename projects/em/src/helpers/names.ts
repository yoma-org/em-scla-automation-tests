// src/helpers/names.ts — unique names for data a test creates (PROJECT.md › Data Isolation).
import { type TestInfo } from '@playwright/test';

/** 'AT-20261109-0-k3x9' (+ ' <label>'): date, worker, random, so parallel runs never collide. */
export function uniqueName(testInfo: TestInfo, label?: string): string {
  const day = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const random = Math.random().toString(36).slice(2, 6);
  return [`AT-${day}-${testInfo.workerIndex}-${random}`, label].filter(Boolean).join(' ');
}
