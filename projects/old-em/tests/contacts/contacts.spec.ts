// Contacts (../em/docs/test-cases/features/09-contacts.md). Each test creates its own contact
// (QE OLD <date>-<rand>); the identity number is random because Old EM rejects a duplicate one.
import { test, expect } from '@fixtures';
import { testCase } from '@helpers/testCase';
import { uniqueName } from '@helpers/names';
import { evidence } from '@helpers/evidence';
import { toast } from '@components/Toast';

const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');

test.describe('Contacts · Create', () => {
  // Data variants 2 (Passport) and 3 (Company) are not run in smoke: base row only.
  test('CON-001 [base] Create contact — by ID type (NRC, Passport, Company Reg. No.)',
    testCase({ id: 'CON-001', source: 'TC_Contact_001', priority: 'P1', smoke: true, critical: true }),
    async ({ page, contactsListPage: list, contactCreatePage: form }) => {
      const name = uniqueName('Tester');
      const phone = `9${digits(8)}`; // case: +959123456789
      const nrc = { state: '12', township: 'PAZATA', type: 'N', number: digits(6) }; // case: 12/PaZaTa(N)001122

      await test.step('1-2. Contacts › New', async () => {
        await list.goto();
        await list.newButton.click();
        await expect(page).toHaveURL(/\/contacts\/new$/);
        await expect(form.fullName).toBeVisible();
      });

      await test.step('3-4. Country code +95 and ID type NRC by default', async () => {
        await expect.soft(form.phoneCountry, 'Phone country code default').toContainText('(+95)');
        await expect.soft(form.identityType, 'Identity Types default').toHaveText('NRC');
      });

      await test.step('5-6. Fill the required fields, Create', async () => {
        await form.fullName.fill(name);
        await form.phone.fill(phone);
        await form.fillNrc(nrc.state, nrc.township, nrc.type, nrc.number);
        await form.createButton.click();
        await expect(toast(page, 'Contact has been created successfully')).toBeVisible();
      });

      await test.step('Expected: name, phone and NRC number in the Contact list', async () => {
        await expect(page).toHaveURL(/\/contacts$/);
        await list.find(name);
        await expect(list.row(name), `"${name}" in Contacts`).toBeVisible();
        const cells = list.cells(name);
        await expect.soft(cells.type).toHaveText('NRC');
        await expect.soft(cells.id, 'NRC number').toHaveText(`${nrc.state}/${nrc.township}(${nrc.type})${nrc.number}`);
        await expect.soft(cells.phone, 'Phone number').toHaveText(`+95${phone}`);
        await evidence(page, 'CON-001_contact-list');
      });
    });
});
