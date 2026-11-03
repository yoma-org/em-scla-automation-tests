// src/helpers/money.ts — one place to parse amounts from UI, API and PDF text.
// Returns a normalized decimal string ("150000.00") so comparisons never use floats.
// Throws instead of guessing: a wrong parse would make a money assertion pass or fail for the wrong reason.

// One amount: optional sign or "(…)" for negatives, optional currency, thousands separators.
const AMOUNT = /^(-)?\(?\s*(?:MMK|USD|Ks|\$)?\s*(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?\s*(?:MMK|USD|Ks)?\s*\)?$/i;

export function parseAmount(text: string | number, fractionDigits = 2): string {
  const raw = String(text).trim();
  const match = AMOUNT.exec(raw);
  if (!match) throw new Error(`Not a single amount: "${raw}"`);

  const [, minus, int, frac = ''] = match;
  if (frac.length > fractionDigits && /[^0]/.test(frac.slice(fractionDigits))) {
    throw new Error(`"${raw}" has more than ${fractionDigits} decimals`);
  }
  const negative = Boolean(minus) || (raw.includes('(') && raw.includes(')'));
  const value = `${BigInt(int.replaceAll(',', ''))}.${frac.padEnd(fractionDigits, '0').slice(0, fractionDigits)}`;
  return negative && /[1-9]/.test(value) ? `-${value}` : value;
}

/** Like parseAmount, but returns null for text that is not (yet) an amount, e.g. "— Not calculated yet". For expect.poll. */
export function amountOrNull(text: string, fractionDigits = 2): string | null {
  try {
    return parseAmount(text, fractionDigits);
  } catch {
    return null;
  }
}
