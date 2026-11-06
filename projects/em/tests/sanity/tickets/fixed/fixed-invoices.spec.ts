// Sanity · Fixed tickets · Invoices / Debit Note (Create Invoice line amounts: EM-92, EM-75, EM-76)
// Cases: docs/sanity-test/tickets/fixed/fixed-invoices.md. Expected results are Old EM behaviour.
// Line figures show 3 decimals ("1,000.000 Ks"), invoice totals 2 ("1,050.00 Ks").
// Read-only: no test here clicks Create, so no invoice is saved.
import { test, expect } from '@fixtures';
import { expectAmount } from '@helpers/assertions';
import { evidence } from '@helpers/evidence';
import { sanity } from '@helpers/sanity';
import type { InvoiceLineInput } from '@pages/invoices/CreateInvoicePage';

const doc = 'docs/sanity-test/tickets/fixed/fixed-invoices.md';

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
    async ({ page, createInvoicePage }) => {
      await expect(createInvoicePage.paymentTermsLabel).toHaveText('Payment Terms');
      await expect(createInvoicePage.paymentTerms).toHaveText(/^Due on receipt$/i);
      await evidence(page, '01_NEW_payment-terms');
    });

  for (const c of lineAmountCases) {
    test(`${c.id} ${c.title}`,
      sanity({ id: c.id, priority: 'P1', critical: true, doc }),
      async ({ page, createInvoicePage }) => {
        const line = createInvoicePage.line(0);
        await line.fill(c.line);

        await expectAmount(line.discPrice, c.expected.discPrice, 3);
        await expectAmount(line.tax, c.expected.tax, 3);
        await expectAmount(line.total, c.expected.total, 3);
        await expectAmount(createInvoicePage.total('Grand Total'), c.expected.grandTotal, 2);
        await evidence(page, `01_NEW_${c.line.unit}x${c.line.grossPrice}_disc${c.line.discount}`);
      });
  }

  test('SAN-EM92-004 Changing Tax Type clears the line, as in Old EM',
    sanity({ id: 'SAN-EM92-004', priority: 'P1', critical: true, doc }),
    async ({ page, createInvoicePage }) => {
      const line = createInvoicePage.line(0);
      await line.fill({ taxType: '5% Tax', unit: '1', grossPrice: '1000', discount: '10' });
      await expectAmount(line.total, '900.000', 3);

      await line.selectTaxType('3% Tax');

      await expect(line.unit).toHaveValue('');
      await expect(line.grossPrice).toHaveValue('');
      // Discount goes back to its default (empty or 0).
      await expect(line.discount).toHaveValue(/^0?$/);
      await evidence(page, '01_NEW_taxtype-change-clears-line');
    });
});

test.describe('Sanity · EM-75 Create Invoice with Inclusive Tax', () => {
  test('SAN-EM75-001 Inclusive Tax 5% and 3% matches the Old EM form and does not allow Discount',
    sanity({ id: 'SAN-EM75-001', priority: 'P1', critical: true, doc }),
    async ({ page, createInvoicePage: form }) => {
      const line = form.line(0);
      const soft = { soft: true };

      await form.goto();
      await expect(form.heading).toBeVisible();

      await test.step('1. Selecting Incl. 5% Tax clears the line and splits Gross Price into a locked pre-tax price + an input', async () => {
        // Start from a filled exclusive-tax line, so "cleared" means something.
        await line.fill({ taxType: '5% Tax', unit: '2', grossPrice: '500', discount: '10' });
        await expectAmount(line.total, '900.000', 3);

        await line.selectTaxType('Incl. 5% Tax');

        await expect.soft(line.unit).toHaveValue('');
        await expect.soft(line.grossPrice).toHaveValue('');
        await expect.soft(line.grossPriceBeforeTax).toBeVisible();
        await expect.soft(line.discount).toBeDisabled();
      });

      await test.step('2. Line 1 x 1050: Gross 1,000 (locked) + 1050; Discount locked; Disc. Price 1,000.000; Tax 50.000; Total 1,000.000', async () => {
        await line.fill({ taxType: 'Incl. 5% Tax', unit: '1', grossPrice: '1050' });

        await expectAmount(line.grossPriceBeforeTax, '1000.00', 2, soft);
        await expect.soft(line.grossPrice).toHaveValue('1050');
        await expectAmount(line.discPrice, '1000.000', 3, soft);
        await expectAmount(line.tax, '50.000', 3, soft);
        await expectAmount(line.total, '1000.000', 3, soft);
        await evidence(page, '01_NEW_incl5-1x1050-line');
      });

      await test.step('3. Discount cannot be typed', async () => {
        await expect.soft(line.discount).toBeDisabled();
        await expect.soft(line.discount).not.toHaveValue(/[1-9]/);
      });

      await test.step('4. The % / Ks switch can be clicked, with no effect on the line', async () => {
        const before = await form.discountInKs.getAttribute('aria-checked');
        await form.discountInKs.click();
        await expect.soft(form.discountInKs).not.toHaveAttribute('aria-checked', before ?? '');
        await expect.soft(line.discount).toBeDisabled();
        await expectAmount(line.discPrice, '1000.000', 3, soft);
        await expectAmount(line.total, '1000.000', 3, soft);
        await form.discountInKs.click(); // back to how it was
      });

      await test.step('5. Footer: Gross 1,000.00 · Discount 0.00 · Tax 50.00 · Grand 1,050.00', async () => {
        await expectAmount(form.total('Gross Total'), '1000.00', 2, soft);
        await expectAmount(form.total('Discount'), '0.00', 2, soft);
        await expectAmount(form.total('Commercial Tax'), '50.00', 2, soft);
        await expectAmount(form.total('Grand Total'), '1050.00', 2, soft);
        await evidence(page, '02_NEW_incl5-footer');
      });

      await test.step('6. Incl. 3% Tax, 1 x 1030: line cleared; Gross 1,000 (locked); Discount locked; Disc. Price / Total 1,000.000; Tax 30.000; Grand 1,030.00', async () => {
        await line.selectTaxType('Incl. 3% Tax');
        await expect.soft(line.unit).toHaveValue('');
        await expect.soft(line.grossPrice).toHaveValue('');

        await line.fill({ taxType: 'Incl. 3% Tax', unit: '1', grossPrice: '1030' });

        await expect.soft(line.discount).toBeDisabled();
        await expectAmount(line.grossPriceBeforeTax, '1000.00', 2, soft);
        await expectAmount(line.discPrice, '1000.000', 3, soft);
        await expectAmount(line.tax, '30.000', 3, soft);
        await expectAmount(line.total, '1000.000', 3, soft);
        await expectAmount(form.total('Commercial Tax'), '30.00', 2, soft);
        await expectAmount(form.total('Grand Total'), '1030.00', 2, soft);
        await evidence(page, '03_NEW_incl3-1x1030');
      });
    });
});

test.describe('Sanity · EM-76 Apartment Add Invoice with Inclusive Tax', () => {
  /**
   * Must be Enable: a Disable apartment has no [Add Invoice] (Estate SEED-Z-001 from the 11-01 repro is Disable since 11-06).
   * QA apartment created under EM-32.
   */
  const apartment = { id: 32, name: 'QA-REPRO-EM-56 Tower-R32-101' };

  test('SAN-EM76-001 Inclusive Tax from an apartment: Add Invoice matches Old EM and blocks Discount',
    sanity({ id: 'SAN-EM76-001', priority: 'P1', critical: true, doc }),
    async ({ page, apartmentInvoicesTab: tab, createInvoicePage: form }) => {
      const line = form.line(0);
      const soft = { soft: true };

      // Same form as EM-75, but opened from the apartment: the apartment is preselected.
      await tab.goto(apartment.id);
      await tab.addInvoice.click();
      await expect(page).toHaveURL(new RegExp(`/receivables/invoices/new\\?estate_id=${apartment.id}\\b`));
      await expect(form.heading).toBeVisible();
      await expect(form.apartment, 'apartment preselected').toHaveText(apartment.name);

      await test.step('1. Selecting Incl. 5% Tax clears the line and splits Gross Price into a locked pre-tax price + an input', async () => {
        // Start from a filled exclusive-tax line, so "cleared" means something.
        await line.fill({ taxType: '5% Tax', unit: '2', grossPrice: '500', discount: '10' });
        await expectAmount(line.total, '900.000', 3);

        await line.selectTaxType('Incl. 5% Tax');

        await expect.soft(line.unit).toHaveValue('');
        await expect.soft(line.grossPrice).toHaveValue('');
        await expect.soft(line.grossPriceBeforeTax).toBeVisible();
        await expect.soft(line.discount).toBeDisabled();
      });

      await test.step('2. Line 1 x 1050: Gross 1,000 (locked) + 1050; Discount locked; Disc. Price 1,000.000; Tax 50.000; Total 1,000.000', async () => {
        await line.fill({ taxType: 'Incl. 5% Tax', unit: '1', grossPrice: '1050' });

        await expectAmount(line.grossPriceBeforeTax, '1000.00', 2, soft);
        await expect.soft(line.grossPrice).toHaveValue('1050');
        await expectAmount(line.discPrice, '1000.000', 3, soft);
        await expectAmount(line.tax, '50.000', 3, soft);
        await expectAmount(line.total, '1000.000', 3, soft);
        await evidence(page, '01_NEW_incl5-1x1050-line');
      });

      await test.step('3. Discount cannot be typed', async () => {
        await expect.soft(line.discount).toBeDisabled();
        await expect.soft(line.discount).not.toHaveValue(/[1-9]/);
      });

      await test.step('4. The % / Ks switch can be clicked, with no effect on the line', async () => {
        const before = await form.discountInKs.getAttribute('aria-checked');
        await form.discountInKs.click();
        await expect.soft(form.discountInKs).not.toHaveAttribute('aria-checked', before ?? '');
        await expect.soft(line.discount).toBeDisabled();
        await expectAmount(line.discPrice, '1000.000', 3, soft);
        await expectAmount(line.total, '1000.000', 3, soft);
        await form.discountInKs.click(); // back to how it was
      });

      await test.step('5. Footer: Gross 1,000.00 · Discount 0.00 · Tax 50.00 · Grand 1,050.00', async () => {
        await expectAmount(form.total('Gross Total'), '1000.00', 2, soft);
        await expectAmount(form.total('Discount'), '0.00', 2, soft);
        await expectAmount(form.total('Commercial Tax'), '50.00', 2, soft);
        await expectAmount(form.total('Grand Total'), '1050.00', 2, soft);
        await evidence(page, '02_NEW_incl5-footer');
      });

      // The 11-01 repro line (Incl. 3%, 1 x 1030) at the corresponding %.
      await test.step('6. Incl. 3% Tax, 1 x 1030: line cleared; Gross 1,000 (locked); Discount locked; Disc. Price / Total 1,000.000; Tax 30.000; Grand 1,030.00', async () => {
        await line.selectTaxType('Incl. 3% Tax');
        await expect.soft(line.unit).toHaveValue('');
        await expect.soft(line.grossPrice).toHaveValue('');

        await line.fill({ taxType: 'Incl. 3% Tax', unit: '1', grossPrice: '1030' });

        await expect.soft(line.discount).toBeDisabled();
        await expectAmount(line.grossPriceBeforeTax, '1000.00', 2, soft);
        await expectAmount(line.discPrice, '1000.000', 3, soft);
        await expectAmount(line.tax, '30.000', 3, soft);
        await expectAmount(line.total, '1000.000', 3, soft);
        await expectAmount(form.total('Commercial Tax'), '30.00', 2, soft);
        await expectAmount(form.total('Grand Total'), '1030.00', 2, soft);
        await evidence(page, '03_NEW_incl3-1x1030');
      });
    });
});
