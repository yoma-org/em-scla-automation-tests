// Sanity · Fixed tickets · Wallet
// Cases: docs/sanity-test/tickets/fixed/fixed-wallet.md. Expected results are Old EM behaviour.
// SAN-EM79-001 posts a real Wallet Transfer of 10 Ks on every run (no approval step, cannot be undone),
// so the source apartment's wallet goes down by 10 Ks each run. Top it up with a Recharge when it runs low.
import { type Page } from '@playwright/test';
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { parseAmount, subtractAmount } from '@helpers/money';

const doc = 'docs/sanity-test/tickets/fixed/fixed-wallet.md';

/** Precondition data from the case (UAT). */
const source = { id: 32, name: 'QA-REPRO-EM-56 Tower-R32-101' };
const destination = 'Estate SEED-Z-002';
const amount = '10.00';

/** Screenshot attached to the report (and to the Jira comment as evidence). */
async function evidence(page: Page, name: string) {
  await test.info().attach(name, { body: await page.screenshot(), contentType: 'image/png' });
}

test.describe('Sanity · EM-79 Wallet Transfer', () => {
  test('SAN-EM79-001 Wallet Transfer to a valid apartment posts and reduces the source wallet',
    sanity({ id: 'SAN-EM79-001', priority: 'P1', critical: true, doc }),
    async ({ page, apartmentWalletTab: wallet, walletTransfersPage: transfers }) => {
      let balanceBefore = '';
      let ref = '';

      await test.step('Precondition: source wallet can cover the transfer', async () => {
        await wallet.goto(source.id);
        balanceBefore = await wallet.currentBalanceAmount();
        const available = await wallet.availableAmount();
        expect(Number(available), `${source.name} has ${available} Ks available; recharge it to at least ${amount} Ks`)
          .toBeGreaterThanOrEqual(Number(amount));
      });

      await test.step('1. Open the source apartment, tab Wallet, click [Wallet Transfer]', async () => {
        await wallet.walletTransferLink.click();
        await expect(transfers.form).toBeVisible();
        await expect(transfers.fromApartment).toHaveValue(source.name);
      });

      await test.step(`2. Transfer ${amount} Ks to ${destination} and click [Post ${amount} Ks]`, async () => {
        await transfers.fill({ to: destination, amount: '10', remark: `QA-REPRO-EM-79 ${new Date().toISOString()}` });
        await expect(transfers.postButton).toHaveText(`Post ${amount} Ks`);
        await expect(transfers.postButton).toBeEnabled();
        await transfers.postButton.click();
        // Expected 1: the transfer completes (the bug was an error here and nothing posted).
        // New EM keeps the dialog open and shows "Posted as WT-00008 — 10.00 Ks".
        await expect(transfers.postedMessage, 'transfer posted').toBeVisible();
        const posted = await transfers.posted();
        ref = posted.ref;
        expect(parseAmount(posted.amount), `${ref} amount`).toBe(amount);
        await evidence(page, `01_NEW_${ref}_posted`);
      });

      await test.step('3. Open the source apartment wallet', async () => {
        await wallet.goto(source.id);
        const row = wallet.transferOutRow(ref);
        await expect(row, `"Transfer out #${ref}" row on the source wallet`).toHaveCount(1);
        expect(parseAmount(await wallet.cell(row, 'CR').innerText()), `${ref} CR`).toBe(amount);
        // Expected 2: the wallet is reduced by the amount. Soft, because another test that moves
        // this wallet at the same time would change the total; the CR row above is the hard check.
        expect.soft(await wallet.currentBalanceAmount(), 'Current Balance').toBe(subtractAmount(balanceBefore, amount));
        await row.scrollIntoViewIfNeeded();
        await evidence(page, `02_NEW_${ref}_source-wallet`);
      });

      await test.step(`Register: ${destination} received a Posted transfer`, async () => {
        await transfers.goto();
        const row = transfers.row(ref);
        await expect(transfers.cell(row, 'Status')).toHaveText('Posted');
        await expect(transfers.cell(row, 'From')).toHaveText(source.name);
        await expect(transfers.cell(row, 'To')).toHaveText(destination);
        expect(parseAmount(await transfers.cell(row, 'Amount').innerText())).toBe(amount);
        await evidence(page, `03_NEW_${ref}_wallet-transfers`);
      });
    });
});
