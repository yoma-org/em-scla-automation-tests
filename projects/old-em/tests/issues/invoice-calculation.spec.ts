// Reported Old EM issue "Invoice calculation (decimal/rounding)" — INV-038
// (docs/test-cases/extra-cases.md, an Old EM extra case, not in the EM catalog). One run per catalog variant: the same invoice is
// created 5 times on the test's own apartment; the line is typed like a user and then WATCHED for a few seconds
// (Old EM recalculates on the server and overwrites the typed values with each answer: see
// src/pages/billing/InvoiceCalcForm.ts). The first draft is approved and followed to the draft list, the
// approved invoice, the apartment, AR, the Invoices report and the PDF; the other drafts are removed again.
import { test } from '@fixtures/billing.fixture';
import { expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { pdfText } from '@helpers/pdfText';
import { toast } from '@components/Toast';
import { amountOf, ks, noteOldCoRef, setupApartment } from '@data/billing';
import { checkPostedAreas, notChecked } from '@helpers/billing-checks';
import { InvoiceCalcForm, footerFigures, type CalcLine, type LineSample } from '@pages/billing/InvoiceCalcForm';

const ISSUE = 'Invoice calculation (decimal/rounding)';
const TITLE = 'Invoice totals with discount and tax are calculated once and saved exactly as shown on the form';
const REVIEW = 'confirm the rounding rule: round the grand total to 2 decimals half-up (all variants below give the same result if each line is rounded instead)';
const CATEGORY = 'Maintenance Services';
const TIMES = 5;
/** How long the line is watched after typing, before Create. */
const WATCH_MS = 6_000;

interface Expected { discPrice: number; lineTotal: number; tax: number; grossTotal: number; discount: number; grand: number }
interface Variant { label: string; line: CalcLine; exact: Expected }

// Exact figures of the case's formulas (Expected 1); compared at 2 decimals, the money precision.
const VARIANTS: Variant[] = [
  { label: 'base', line: { unit: '2', grossPrice: '1500', discount: '10', fixed: false },
    exact: { discPrice: 1350, lineTotal: 2700, tax: 81, grossTotal: 3000, discount: 300, grand: 2781 } },
  { label: 'Unit=3; Gross Price=333.33; Discount=10 %; Grand Total=926.99', line: { unit: '3', grossPrice: '333.33', discount: '10', fixed: false },
    exact: { discPrice: 299.997, lineTotal: 899.991, tax: 26.99973, grossTotal: 999.99, discount: 99.999, grand: 926.99 } },
  { label: 'Unit=7; Gross Price=0.15; Discount=0; Grand Total=1.08', line: { unit: '7', grossPrice: '0.15', discount: '0', fixed: false },
    exact: { discPrice: 0.15, lineTotal: 1.05, tax: 0.0315, grossTotal: 1.05, discount: 0, grand: 1.08 } },
  { label: 'Unit=1; Gross Price=100.10; Discount=0.05 Ks (fixed); Grand Total=103.05', line: { unit: '1', grossPrice: '100.10', discount: '0.05', fixed: true },
    exact: { discPrice: 100.05, lineTotal: 100.05, tax: 3.0015, grossTotal: 100.10, discount: 0.05, grand: 103.05 } }
];

/** Half-up to cents (1e-9 absorbs binary noise such as 0.035 → 0.034999…). */
const cents = (n: number) => Math.round((n + 1e-9) * 100) / 100;
const same = (shown: string, expected: number) => shown !== '' && cents(amountOf(shown)) === cents(expected);

/** A sample whose typed Unit / Gross Price / Discount are not what was typed (wiped or changed by Old EM). */
function lost(s: LineSample, line: CalcLine): string | undefined {
  const diffs: string[] = [];
  if (amountOf(s.unit) !== Number(line.unit) || s.unit === '') diffs.push(`Unit "${s.unit}"`);
  if (s.grossPrice === '' || amountOf(s.grossPrice) !== Number(line.grossPrice)) diffs.push(`Gross Price "${s.grossPrice}"`);
  if (Number(line.discount) > 0 && (s.discount === '' || amountOf(s.discount) !== Number(line.discount))) diffs.push(`Discount "${s.discount}"`);
  // Empty = not calculated yet (first answer pending); a calculated 0.000 counts.
  if (s.total !== '' && amountOf(s.total) === 0) diffs.push(`Total "${s.total}"`);
  return diffs.length ? diffs.join(', ') : undefined;
}

interface Run { n: number; formGrand?: number; formFigures: string; saved?: number; draftUrl?: string; problem?: string }

test.describe('Reported issue · Invoice calculation', () => {
  test.describe.configure({ timeout: 900_000 });

  for (const [i, v] of VARIANTS.entries()) {
    const tag = `INV-038-v${i + 1}`;
    test(`INV-038 [${v.label}] ${TITLE}`,
      testCase({ id: 'INV-038', priority: 'P1', critical: true, ...(v.label === 'base' ? { review: REVIEW } : {}) }),
      async ({ page, invoiceDocPage: doc, invoiceDraftsPage: drafts }) => {
        test.info().annotations.push({ type: 'reported issue', description: ISSUE });
        test.info().annotations.push({ type: 'data', description: `line: Unit ${v.line.unit} · Gross Price ${v.line.grossPrice} · Discount ${v.line.discount}${v.line.fixed ? ' Ks (fixed)' : ' %'} · 3% Tax · ${CATEGORY}; expected Grand Total ${ks(v.exact.grand)}` });
        const e = v.exact;
        const form = new InvoiceCalcForm(page);
        const apartment = await test.step('Precondition: own apartment with an owner', () => setupApartment(page, { owner: true }))
          .catch(err => { test.skip(true, `BLOCKED: apartment / owner setup failed twice on UAT (${String(err).split('\n')[0]})`); throw err; });
        const runs: Run[] = [];

        for (let n = 1; n <= TIMES; n++) {
          await test.step(`Creation ${n}/${TIMES}: steps 1-5`, async () => {
            const run: Run = { n, formFigures: '' };
            runs.push(run);
            await form.goto();
            await expect.soft(form.currency, 'Currency MMK').toHaveText('MMK');
            noteOldCoRef(await form.fillHeader(apartment.name, CATEGORY, `QE OLD INV-038 #${n}`, '3% Tax'));
            await page.waitForLoadState('networkidle');

            // Steps 3-4: type the line, then watch it with no input (a user reading the figures).
            await form.typeLine(v.line);
            const typedAt = Date.now();
            const samples = await form.watch(WATCH_MS);
            const last = samples[samples.length - 1];
            const f = footerFigures(last.footer);
            run.formGrand = f.grand;
            run.formFigures = `Disc. Price ${last.discPrice} · Tax ${last.tax} · Total ${last.total} · ${last.footer}`;
            const wiped = samples.map(s => ({ s, d: lost(s, v.line) })).filter(x => x.d);
            const lateRequests = form.amountRequestsSince(typedAt + WATCH_MS - 2_000);
            if (lateRequests) test.info().annotations.push({ type: 'observed', description: `#${n}: Old EM still sent ${lateRequests} POST /invoices/amount in the last 2 s of the ${WATCH_MS / 1000} s watch, with no input (recalculation loop)` });
            if (wiped.length || lateRequests) await evidence(page, `${tag}_form-${n}`);

            // Expected 2: typed values kept, no "field is required", no total 0.
            expect.soft(wiped.length === 0,
              `#${n} Expected 2: Unit/Gross Price/Discount stay as typed (${v.line.unit} / ${v.line.grossPrice} / ${v.line.discount}) and Total is not 0 after typing. ` +
              `Old EM changed them in ${wiped.length} of ${samples.length} samples over ${WATCH_MS / 1000} s, first ${wiped[0] ? `${wiped[0].s.at - typedAt} ms after typing: ${wiped[0].d}` : '-'}`).toBe(true);
            await expect.soft(form.requiredErrors, `#${n} Expected 2: no "field is required" under the filled line`).toHaveCount(0);

            // Expected 1: the form figures (line at 2 decimals, footer as shown).
            expect.soft(same(last.discPrice, e.discPrice), `#${n} Disc. Price: expected ${e.discPrice} (≈ ${cents(e.discPrice)}), form shows "${last.discPrice}"`).toBe(true);
            expect.soft(same(last.total, e.lineTotal), `#${n} line Total: expected ${e.lineTotal} (≈ ${cents(e.lineTotal)}), form shows "${last.total}"`).toBe(true);
            expect.soft(same(last.tax, e.tax), `#${n} Tax (3 % of line Total): expected ${e.tax} (≈ ${cents(e.tax)}), form shows "${last.tax}"`).toBe(true);
            expect.soft(f.gross, `#${n} footer Gross Total (form: ${last.footer})`).toBe(cents(e.grossTotal));
            expect.soft(f.discount, `#${n} footer Discount (form: ${last.footer})`).toBe(cents(e.discount));
            expect.soft(f.tax, `#${n} footer Commercial Tax (form: ${last.footer})`).toBe(cents(e.tax));
            expect.soft(f.grand, `#${n} footer Grand Total (form: ${last.footer})`).toBe(e.grand);
            if (n === 1) await evidence(page, `${tag}_form-totals`);
          });

          await test.step(`Creation ${n}/${TIMES}: Create → draft`, async () => {
            const run = runs[n - 1];
            await form.createButton.click();
            const created = await page.waitForURL(/\/invoices\/\d+\/draft$/, { timeout: 30_000 }).then(() => true, () => false);
            if (!created) {
              const errors = (await page.getByText(/required|invalid|error/i).allInnerTexts()).map(t => t.trim()).filter(Boolean);
              run.problem = `Create did not save the invoice (form: ${run.formFigures}; messages: ${errors.join(' | ') || 'none'})`;
              await evidence(page, `${tag}_create-failed-${n}`);
              expect.soft(created, `#${n} Expected 1-3: Create saves the draft. ${run.problem}`).toBe(true);
              return;
            }
            await toast(page, 'Invoice has been successfully created').waitFor({ timeout: 10_000 }).catch(() => {}); // the draft URL already proves it
            run.draftUrl = new URL(page.url()).pathname;
            // The heading reads "Total: 0.00 Ks" until the draft has loaded: wait for its line first.
            await expect(doc.lines.filter({ hasText: `QE OLD INV-038 #${n}` })).toBeVisible({ timeout: 30_000 });
            await expect(doc.total).not.toHaveText('Total: 0.00 Ks', { timeout: 10_000 }).catch(() => {});
            run.saved = amountOf((await doc.total.innerText()).replace('Total:', ''));
            if (run.saved !== e.grand || run.saved !== run.formGrand) await evidence(page, `${tag}_draft-${n}`);
            expect.soft(run.saved, `#${n} Expected 3: saved draft Total = form Grand Total ${run.formGrand} (form: ${run.formFigures})`).toBe(run.formGrand);
            expect.soft(run.saved, `#${n} Expected 1: saved draft Total = ${ks(e.grand)}`).toBe(e.grand);
          });
        }

        await test.step(`Expected 4: the ${TIMES} creations give the same Grand Total`, () => {
          const summary = runs.map(r => `#${r.n}: form ${r.formGrand ?? '-'} → saved ${r.saved ?? `not saved (${r.problem})`}`).join('; ');
          test.info().annotations.push({ type: 'observed', description: `${v.label}: ${summary}` });
          const saved = runs.map(r => r.saved);
          expect.soft(saved, `Expected 4: ${TIMES} × ${ks(e.grand)} (${summary})`).toEqual(Array(TIMES).fill(e.grand));
        });

        const ok = runs.filter(r => r.draftUrl);
        if (!ok.length) {
          notChecked('Draft list, approved invoice, apartment, AR, report, PDF', 'no draft was saved (see above)');
          return;
        }

        await test.step('Expected 3: Inv/DN draft list shows the Grand Total of each draft', async () => {
          await drafts.goto();
          await drafts.filterApartment(apartment.name);
          const rows = drafts.row(apartment.name).filter({ hasText: 'INVOICE' });
          await expect.soft(rows, 'our drafts in the list').toHaveCount(ok.length);
          const texts = await rows.allInnerTexts();
          await evidence(page, `${tag}_draft-list`);
          for (const t of texts) expect.soft(t.replace(/\s+/g, ' '), `draft list row: Total ${ks(e.grand)}`).toContain(ks(e.grand));
        });

        // Approve a draft saved with the case's Grand Total when there is one, so the posted screens test the
        // posting itself; a wrong draft (already reported above) is approved only when no draft is right.
        const first = ok.find(r => r.saved === e.grand) ?? ok[0];
        if (first.saved !== e.grand) test.info().annotations.push({ type: 'observed', description: `no draft was saved with ${ks(e.grand)}: approving draft #${first.n} (${first.saved})` });
        let code = '';
        await test.step(`Step 6: open draft #${first.n} and approve it`, async () => {
          await doc.goto(first.draftUrl!);
          await doc.approveButton.click();
          await expect(page).toHaveURL(/\/invoices\/\d+$/, { timeout: 60_000 });
          await doc.refLine.waitFor();
          code = (await doc.ref()).code;
          test.info().annotations.push({ type: 'data', description: `${apartment.name}: ${code} (approved draft #${first.n}; admin approves its own draft: Created By = Approved By)` });
        });

        await test.step('Expected 3: approved invoice shows the same figures', async () => {
          const footer = (await doc.footer.innerText()).replace(/\s+/g, ' ');
          const f = footerFigures(footer);
          const line = (await doc.lines.first().innerText()).replace(/\s+/g, ' ');
          await evidence(page, `${tag}_approved-invoice`);
          await expect.soft(doc.total, 'approved invoice Total').toHaveText(`Total: ${ks(e.grand)}`);
          expect.soft(f.grand, `approved invoice Grand Total (${footer})`).toBe(e.grand);
          expect.soft(f.gross, `approved invoice Gross Total (${footer})`).toBe(cents(e.grossTotal));
          // The approved invoice has no Discount line when there is no discount.
          expect.soft(f.discount ?? 0, `approved invoice Discount (${footer})`).toBe(cents(e.discount));
          expect.soft(f.tax, `approved invoice Commercial Tax (${footer})`).toBe(cents(e.tax));
          expect.soft(line, 'approved invoice line: Disc. Price · Tax · Total').toContain(`${ks(cents(e.discPrice))} ${ks(cents(e.tax))} ${ks(cents(e.lineTotal))}`);
        });

        await test.step('Expected 3: invoice PDF shows the same Grand Total', async () => {
          // The PDF menu's options have no usable accessible name ("[object Object]"): pick by text.
          await page.getByRole('combobox', { name: 'PDF' }).click();
          const downloading = page.waitForEvent('download', { timeout: 30_000 }).catch(() => undefined);
          await page.getByRole('option').filter({ hasText: 'Download PDF' }).click();
          const download = await downloading;
          if (!download) { notChecked('Invoice PDF', 'PDF › Download PDF gave no file'); return; }
          const file = test.info().outputPath(`${tag}.pdf`);
          await download.saveAs(file);
          const text = pdfText(await import('node:fs/promises').then(fs => fs.readFile(file)));
          await test.info().attach(`${tag}_invoice.pdf`, { path: file, contentType: 'application/pdf' });
          if (!/Grand Total/i.test(text)) { notChecked('Invoice PDF', 'the PDF text is not readable without a PDF library (attached for a manual look)'); return; }
          expect.soft(text, `PDF Grand Total ${ks(e.grand)}`).toContain(ks(e.grand).replace(' Ks', ''));
        });

        await test.step('Expected 3: apartment Invoices / SOA, AR list, Invoice list, report', () =>
          checkPostedAreas(page, tag, { code, category: CATEGORY, amount: e.grand, apartment, apartmentAR: e.grand }));

        await test.step(`Clean-up: remove our other ${ok.length - 1} drafts`, async () => {
          for (const r of ok.filter(x => x !== first)) {
            await doc.goto(r.draftUrl!);
            await page.getByRole('button', { name: /^(Remove|Delete)$/ }).click();
            const yes = page.getByRole('alertdialog').getByRole('button', { name: /^Yes/ });
            if (await yes.waitFor({ timeout: 2_000 }).then(() => true, () => false)) await yes.click();
            await expect(page).toHaveURL(/\/invoices\/draft$/, { timeout: 30_000 }); // Old EM: toast "Invoice data has been deleted successfully"
          }
        });
      });
  }
});
