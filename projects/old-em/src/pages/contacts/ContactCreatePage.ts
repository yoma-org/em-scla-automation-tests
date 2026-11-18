// src/pages/contacts/ContactCreatePage.ts — Create Contact (/contacts/new)
// Identity: NRC = state (#prefix) / township (#town, options depend on state) / type (#type: N P E C)
// + 6-digit number; PASSPORT / COMPANY = one textbox. Phone: country code dropdown (+95 default).
// Old EM gives the Resident ID, Full Name and Company inputs the same id="name": use placeholders.
import { type Locator, type Page } from '@playwright/test';
import { chooseOption, formField } from '@components/PrimeSelect';

export type IdentityType = 'NRC' | 'PASSPORT' | 'COMPANY';

export class ContactCreatePage {
  readonly fullName: Locator;
  readonly company: Locator;
  readonly phoneCountry: Locator;
  readonly phone: Locator;
  readonly identityType: Locator;
  readonly nrcState: Locator;
  readonly nrcTownship: Locator;
  readonly nrcType: Locator;
  readonly nrcNumber: Locator;
  readonly identityField: Locator;
  readonly primaryEmail: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.fullName = page.getByPlaceholder('Full Name', { exact: true });
    this.company = page.getByPlaceholder('Company', { exact: true }).first();
    this.phoneCountry = formField(page, 'Phone (Primary)*').getByRole('combobox');
    this.phone = page.getByPlaceholder('912345678');
    this.identityType = formField(page, 'Identity Types*').getByRole('combobox');
    this.nrcState = page.locator('#prefix');
    this.nrcTownship = page.locator('#town');
    this.nrcType = page.locator('#type');
    this.nrcNumber = page.getByPlaceholder('000000');
    this.identityField = formField(page, 'Identity Numbers*');
    this.primaryEmail = page.getByPlaceholder('Primary Email');
    this.createButton = page.getByRole('button', { name: 'Create' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/contacts/new');
    await this.fullName.waitFor();
  }

  async setIdentityType(type: IdentityType): Promise<void> {
    if ((await this.identityType.innerText()).trim() !== type) await chooseOption(this.page, this.identityType, type);
  }

  /** NRC parts, e.g. state '12', township 'PAZATA', type 'N', number '001122'. */
  async fillNrc(state: string, township: string, type: string, number: string): Promise<void> {
    await chooseOption(this.page, this.nrcState, state);
    await chooseOption(this.page, this.nrcTownship, township);
    await chooseOption(this.page, this.nrcType, type);
    await this.nrcNumber.fill(number);
  }

  /** Passport / company registration number (the identity textbox). */
  async fillIdentityNumber(value: string): Promise<void> {
    await this.identityField.getByRole('textbox').last().fill(value);
  }
}
