// src/pages/balances/money.ts — amounts as Old EM prints them, parsed to integer cents (bigint).
//
// UAT totals are far beyond Number precision (AR ≈ 115,408,155,122,939,890.68 Ks), so every
// comparison is done in bigint cents. Formats seen: "1,050.00 Ks", "$ 103,382.11", "(701.00 Ks)"
// (negative, Net Cash / Total Payment), "฿ 0.00", "?-? 0.00", " 746,536.25 Ks" (icon glyph first).

/** "1,050.00 Ks" → 105000n; "(701.00 Ks)" or "-701.00 Ks" → -70100n. Throws on text without an amount. */
export function cents(text: string | null | undefined): bigint {
  const t = (text ?? '').trim();
  const m = t.match(/(-)?\s*(\d[\d,]*)(?:\.(\d{1,2}))?/);
  if (!m) throw new Error(`No amount in "${t}"`);
  const whole = BigInt(m[2].replaceAll(',', ''));
  const frac = BigInt((m[3] ?? '0').padEnd(2, '0'));
  const negative = !!m[1] || /^\(.*\)$/.test(t);
  const value = whole * 100n + frac;
  return negative ? -value : value;
}

/** 105000n → "1,050.00" (no currency), for messages. */
export function fmt(c: bigint): string {
  const neg = c < 0n;
  const abs = neg ? -c : c;
  const whole = (abs / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${neg ? '-' : ''}${whole}.${(abs % 100n).toString().padStart(2, '0')}`;
}

export function sum(values: bigint[]): bigint {
  return values.reduce((a, b) => a + b, 0n);
}

// ── Dates (Old EM shows dd/mm/yyyy; the business runs on Myanmar time) ───────────────────────

const TZ = 'Asia/Yangon';

/** Today in Myanmar as { y, m (1-12), d }. */
export function today(offsetDays = 0): { y: number; m: number; d: number } {
  const now = new Date(Date.now() + offsetDays * 86_400_000);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const p = (t: string) => Number(parts.find(x => x.type === t)!.value);
  return { y: p('year'), m: p('month'), d: p('day') };
}

const pad = (n: number) => String(n).padStart(2, '0');
/** "12/11/2026" */
export const dmy = (x: { y: number; m: number; d: number }) => `${pad(x.d)}/${pad(x.m)}/${x.y}`;
/** "2026-11-12" (Account Statement detail URL) */
export const ymd = (x: { y: number; m: number; d: number }) => `${x.y}-${pad(x.m)}-${pad(x.d)}`;

/** Month `offset` months from the current Myanmar month: { y, m }. */
export function month(offset = 0): { y: number; m: number } {
  const t = today();
  const i = t.y * 12 + (t.m - 1) + offset;
  return { y: Math.floor(i / 12), m: (i % 12) + 1 };
}
