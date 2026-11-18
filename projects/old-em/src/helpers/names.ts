// src/helpers/names.ts — unique names for data a test creates (PROJECT.md › Data Isolation).
/** 'QE OLD 20261112-k3x9' (+ ' <label>'): date and random, so runs never collide and QE data is easy to find. */
export function uniqueName(label?: string): string {
  const day = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const random = Math.random().toString(36).slice(2, 6);
  return [`QE OLD ${day}-${random}`, label].filter(Boolean).join(' ');
}
