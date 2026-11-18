// src/helpers/pdfText.ts — best-effort text of a simple PDF (no PDF library in the repo): inflates the
// FlateDecode streams and joins the string literals of Tj / TJ operators. Returns '' when the PDF uses
// hex-encoded / subset-font glyphs that cannot be read this way: the caller then records "not checked".
import { inflateSync } from 'node:zlib';

export function pdfText(pdf: Buffer): string {
  const raw = pdf.toString('latin1');
  const chunks: string[] = [];
  const re = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    const start = m.index + m[0].length;
    const end = raw.indexOf('endstream', start);
    if (end < 0) break;
    const body = pdf.subarray(start, end);
    let content: string;
    try { content = inflateSync(body).toString('latin1'); } catch { content = body.toString('latin1'); }
    // (text) Tj  and  [(te) 12 (xt)] TJ
    for (const t of content.matchAll(/\((?:\\.|[^\\)])*\)/g)) {
      chunks.push(t[0].slice(1, -1).replace(/\\([()\\])/g, '$1'));
    }
    chunks.push('\n');
    re.lastIndex = end;
  }
  return chunks.join('').replace(/[ \t]+/g, ' ');
}
