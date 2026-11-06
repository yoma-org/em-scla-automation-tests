// Sanity · Fixed tickets · Cash Transfer
// Cases: docs/sanity-test/tickets/fixed/fixed-cash-transfer.md. Expected results are Old EM behaviour.
// SAN-EM86-001 posts a real Cash Transfer of 10 Ks (CASH-0003 → BANK-0001) on every run. A posted transfer
// cannot be deleted, so CASH-0003 goes down by 10 Ks each run.
import { type Page } from '@playwright/test';
import { test, expect } from '@fixtures';
import { sanity } from '@helpers/sanity';
import { parseAmount } from '@helpers/money';
import { getCashTransfer, getCurrentUser } from '@api/cashTransfers';

const doc = 'docs/sanity-test/tickets/fixed/fixed-cash-transfer.md';

/** Test data from the case (UAT). */
const transfer = {
  from: 'CASH-0003 — QA-REPRO-EM-94 Cash',
  to: 'BANK-0001 — QE PAIR Bank',
  amount: '10'
};

/** Screenshot attached to the report (and to the Jira comment as evidence). */
async function evidence(page: Page, name: string) {
  await test.info().attach(name, { body: await page.screenshot(), contentType: 'image/png' });
}

test.describe('Sanity · EM-86 Cash Transfer self-approval', () => {
  test('SAN-EM86-001 User with Self Approve can approve their own Cash Transfer',
    sanity({ id: 'SAN-EM86-001', priority: 'P1', critical: true, doc }),
    async ({ page, cashTransfersPage: transfers, cashTransferDetailPage: detail }) => {
      // Unique per run, so the register row and the API record are this run's.
      const description = `QA-REPRO-EM-86 self approve ${new Date().toISOString()}`;
      let me = { user_id: 0, name: '' };
      let id = 0;

      await test.step('Precondition: logged-in user has Self Approve', async () => {
        const user = await getCurrentUser(page.request);
        me = user;
        expect(user.permissions, `${user.email} needs the self-approve permission`).toContain('self-approve');
        expect(user.permissions, `${user.email} needs approve-cash-transfer`).toContain('approve-cash-transfer');
      });

      await test.step(`1. Create a transfer ${transfer.from} → ${transfer.to}, ${transfer.amount} Ks`, async () => {
        await transfers.goto();
        await transfers.fill({ ...transfer, description });
        await expect(transfers.submitButton).toBeEnabled();
        id = await transfers.submit();

        // Expected 1: a draft is created, by this user.
        const draft = await getCashTransfer(page.request, id);
        expect(draft.status, `transfer #${id}`).toBe('DRAFT');
        expect(Number(draft.requested_by), `#${id} created by`).toBe(me.user_id);
        expect(parseAmount(draft.from_amount)).toBe(parseAmount(transfer.amount));
      });

      await test.step('2. Open the draft, click Approve › Confirm approve with the same user', async () => {
        // Open the draft through the UI: header badge JV › Draft list › Manage icon of this run's row.
        await transfers.openDraftList();
        const draftRow = transfers.draftRow(description);
        await expect(draftRow, 'this run\'s draft in the draft list').toHaveCount(1);
        await expect(transfers.manageDraftLink(draftRow)).toHaveAccessibleName(`Open draft transfer ${id} to approve`);
        await transfers.manageDraftLink(draftRow).click();
        await expect(page).toHaveURL(new RegExp(`/accounts/transfers/${id}/approve$`));
        await expect(detail.approveHeading).toBeVisible();
        await expect(detail.approveButton).toBeEnabled();
        // Account names load after the page (it shows "#65" until then).
        await expect(detail.field('Transferred From')).toHaveText(transfer.from);
        await expect(detail.field('Received In')).toHaveText(transfer.to);
        await evidence(page, `01_NEW_transfer-${id}_draft`);
        await detail.approve();

        // Expected 2: the transfer is approved (the bug: a self-approver could not approve their own transfer).
        await expect(detail.message('Cash Transfer has been approved successfully.')).toBeVisible();
        await evidence(page, `02_NEW_transfer-${id}_approved`);

        const posted = await getCashTransfer(page.request, id);
        expect(posted.status, `transfer #${id}`).toBe('POSTED');
        expect(posted.journal_entry_id, `#${id} journal entry`).not.toBeNull();
        expect(posted.voucher_code, `#${id} voucher`).toMatch(/^JV-\d+$/);
        expect(Number(posted.requested_by), 'created and approved by the same user').toBe(me.user_id);
      });

      await test.step('Register: the transfer is listed as a posted JV', async () => {
        const { voucher_code: voucher } = await getCashTransfer(page.request, id);
        await detail.gotoDetail(id);
        await expect(detail.voucher).toHaveText(voucher!);
        await expect(detail.field('Status')).toHaveText('Posted');
        await expect(detail.field('Created By')).toHaveText(me.name);
        await expect(detail.field('Transferred From')).toHaveText(transfer.from);
        await expect(detail.field('Received In')).toHaveText(transfer.to);
        await evidence(page, `03_NEW_${voucher}_detail-posted`);

        await transfers.goto();
        const row = transfers.row(voucher!);
        await expect(row, `${voucher} in the Cash Transfer register`).toHaveCount(1);
        await expect(transfers.cell(row, 'Description')).toHaveText(description);
        await expect(transfers.cell(row, 'Transferred From')).toHaveText(transfer.from);
        await expect(transfers.cell(row, 'Received In')).toHaveText(transfer.to);
        await expect(transfers.cell(row, 'Created By')).toHaveText(me.name);
        expect(parseAmount(await transfers.cell(row, 'Amount').innerText())).toBe(parseAmount(transfer.amount));
        await row.scrollIntoViewIfNeeded();
        await evidence(page, `04_NEW_${voucher}_register`);
      });
    });
});
