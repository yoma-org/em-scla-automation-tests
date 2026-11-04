// Sanity · G3 Invoice line amounts and precision
// Cases: docs/sanity-test/tickets/open/g3-invoice-amounts.md. Expected results are Old EM behaviour.
// Line figures show 3 decimals ("1,000.000 Ks"), invoice totals 2 ("1,050.00 Ks").
import { test, expect } from '@fixtures';
import { expectAmount } from '@helpers/assertions';
import { sanity } from '@helpers/sanity';
import type { InvoiceLineInput } from '@pages/invoices/CreateInvoicePage';

const doc = 'docs/sanity-test/tickets/open/g3-invoice-amounts.md';

/**
 * Line amount cases: same steps, different data. One row = one test.
 * To add a row, first add the case (with its own SAN ID) to the doc, then add it here.
 */
const lineAmountCases: {
  id: string;
  title: string;
  line: InvoiceLineInput;
  expected: { discPrice: string; tax: string; total: string; grandTotal: string };
}[] = [
  {
    id: 'SAN-EM92-002',
    title: 'Line 1 x 1000 with 5% Tax and Discount 0 shows Disc. Price 1,000.000 and Total 1,000.000',
    line: { taxType: '5% Tax', unit: '1', grossPrice: '1000', discount: '0' },
    expected: { discPrice: '1000.000', tax: '50.000', total: '1000.000', grandTotal: '1050.00' }
  },
  {
    id: 'SAN-EM92-003',
    title: 'Line 1 x 1000 with 5% Tax and Discount 10% shows Disc. Price 900.000 and Total 900.000',
    line: { taxType: '5% Tax', unit: '1', grossPrice: '1000', discount: '10' },
    expected: { discPrice: '900.000', tax: '45.000', total: '900.000', grandTotal: '945.00' }
  }
];

test.describe('Sanity · EM-92 Create Invoice line amounts and Payment Terms', () => {
  test.beforeEach(async ({ createInvoicePage }) => {
    await createInvoicePage.goto();
    await expect(createInvoicePage.heading).toBeVisible();
  });

  test('SAN-EM92-001 Create Invoice opens with Payment Terms optional and preset to Due On Receipt',
    sanity({ id: 'SAN-EM92-001', priority: 'P1', critical: true, doc }),
    async ({ createInvoicePage }) => {
      await expect(createInvoicePage.paymentTermsLabel).toHaveText('Payment Terms');
      await expect(createInvoicePage.paymentTerms).toHaveText(/^Due on receipt$/i);
    });

  for (const c of lineAmountCases) {
    test(`${c.id} ${c.title}`,
      sanity({ id: c.id, priority: 'P1', critical: true, doc }),
      async ({ createInvoicePage }) => {
        const line = createInvoicePage.line(0);
        await line.fill(c.line);

        await expectAmount(line.discPrice, c.expected.discPrice, 3);
        await expectAmount(line.tax, c.expected.tax, 3);
        await expectAmount(line.total, c.expected.total, 3);
        await expectAmount(createInvoicePage.total('Grand Total'), c.expected.grandTotal, 2);
      });
  }

  test('SAN-EM92-004 Changing Tax Type clears the line, as in Old EM',
    sanity({ id: 'SAN-EM92-004', priority: 'P1', critical: true, doc }),
    async ({ createInvoicePage }) => {
      const line = createInvoicePage.line(0);
      await line.fill({ taxType: '5% Tax', unit: '1', grossPrice: '1000', discount: '10' });
      await expectAmount(line.total, '900.000', 3);

      await line.selectTaxType('3% Tax');

      await expect(line.unit).toHaveValue('');
      await expect(line.grossPrice).toHaveValue('');
      // Discount goes back to its default (empty or 0).
      await expect(line.discount).toHaveValue(/^0?$/);
    });
});
