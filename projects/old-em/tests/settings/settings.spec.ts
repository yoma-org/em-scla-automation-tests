// Settings (../em/docs/test-cases/features/23-settings.md).
// SET-003 changes a GLOBAL price that other testers use: it restores the original price in finally,
// and bills only its own new apartment (with a new owner).
import { test, expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';
import { createApartment, createUoDraft } from '@data/builders';
import { type UoPricingPage } from '@pages/settings/UoPricingPage';
import { type Page } from '@playwright/test';

const ks = (n: number) => `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ks`;

async function setUnitPrice(page: Page, pricing: UoPricingPage, item: string, price: number) {
  await pricing.goto();
  await pricing.openEdit(item);
  await pricing.editUnitPrice.fill(String(price));
  await pricing.updateButton.click();
  await expect(pricing.editPanel).toBeHidden();
  await expect(pricing.unitPriceCell(item)).toHaveText(ks(price));
}

test.describe('Settings · UO pricing', () => {
  test.describe.configure({ timeout: 240_000 });

  test('SET-003 Edit UO pricing unit price and verify new UO invoices are charged at the new rate',
    testCase({ id: 'SET-003', source: 'TC_Setting_03', priority: 'P1', smoke: true, critical: true }),
    async ({ page, uoPricingPage: pricing, uoDraftsPage: drafts, apartmentDetailPage, invoiceDetailPage: invoice }) => {
      const item = 'Electricity (YESC)';
      const used = 10;
      // Apartment first: the price is changed for as short a time as possible.
      const apartment = await test.step('Setup: own apartment with an owner', () => createApartment(page, { owner: true }));

      await pricing.goto();
      const original = await pricing.unitPrice(item);
      const price = original === 250 ? 260 : 250; // case: 250
      test.info().annotations.push({ type: 'data', description: `${item}: ${original} → ${price} → restored ${original}; apartment ${apartment.name}` });

      try {
        await test.step('1-3. Settings › UO Pricing › Edit', async () => {
          await pricing.openEdit(item);
        });

        await test.step('4-5. Name cannot be edited; Unit Price can', async () => {
          await expect.soft(pricing.editName, 'UO Pricing name').toBeDisabled();
          await expect.soft(pricing.editName).toHaveValue(item);
          await expect(pricing.editUnitPrice, 'Unit Price').toBeEditable();
        });

        await test.step('6. Update', async () => {
          await pricing.editUnitPrice.fill(String(price));
          await pricing.updateButton.click();
          await expect(pricing.editPanel).toBeHidden();
        });

        await test.step('Expected 1. Updated price in the UO Pricing list', async () => {
          await expect(pricing.unitPriceCell(item), `${item} unit price in the list`).toHaveText(ks(price));
          await pricing.goto();
          await expect(pricing.unitPriceCell(item), `${item} unit price after reload`).toHaveText(ks(price));
          await evidence(page, 'SET-003_uo-pricing-list');
        });

        await test.step('Expected 2. A new UO invoice is charged at the new price', async () => {
          await createUoDraft(page, apartment, { [item]: { previous: 0, current: used } });
          await drafts.goto();
          await expect.soft(drafts.amount(apartment.name), 'UO draft amount').toHaveText(ks(price * used).replace(' ', ''));
          await drafts.approve(apartment.name);
          await expect(toast(page, 'UO Entry Invoiced Successfully')).toBeVisible();

          await apartmentDetailPage.gotoInvoices(apartment.id);
          const row = apartmentDetailPage.invoiceRow('Utilities');
          await expect(row).toHaveCount(1);
          await row.locator('a[href^="/invoices/"]').click();
          await expect(invoice.total).toBeVisible();
          const line = invoice.line(item);
          await expect.soft(line.unit, `${item} units`).toHaveText(String(used));
          await expect.soft(line.grossPrice, `${item} unit price on the invoice`).toHaveText(ks(price));
          await expect.soft(line.total, `${item} line total`).toHaveText(ks(price * used));
          await expect.soft(invoice.total, 'Invoice total').toHaveText(`Total: ${ks(price * used)}`);
          await evidence(page, 'SET-003_uo-invoice');
        });
      } finally {
        await test.step('Restore the original price', async () => {
          await setUnitPrice(page, pricing, item, original);
        });
      }
    });
});
