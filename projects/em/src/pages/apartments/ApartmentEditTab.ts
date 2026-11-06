// src/pages/apartments/ApartmentEditTab.ts — Apartment › Edit tab (/estates/:id?tab=edit)
import { type Locator, type Page } from '@playwright/test';
import { Routes } from '@constants/Routes';

export type Party = 'owner' | 'tenant';
export type Period = 'current' | 'previous';

export class ApartmentEditTab {
  readonly panel: Locator;
  readonly form: Locator;
  readonly saveButton: Locator;
  readonly accountName: Locator;
  readonly enable: Locator;
  readonly partyTabs: Locator;
  /** Not on Old EM's Edit tab (seen on New EM build -37). */
  readonly deleteApartmentButton: Locator;
  /** Contact picker that opens from Select Owner / Select Tenant. */
  readonly contactDialog: Locator;
  readonly contactOptions: Locator;

  constructor(private readonly page: Page) {
    this.panel = page.getByRole('tabpanel', { name: 'Edit' });
    this.form = this.panel.getByRole('form', { name: 'Edit apartment' });
    this.saveButton = this.form.getByRole('button', { name: 'Save', exact: true });
    this.accountName = this.form.getByRole('textbox', { name: 'Account Name' });
    this.enable = this.form.getByRole('combobox', { name: 'Enable' });
    this.partyTabs = this.form.getByRole('tablist', { name: 'Owners and tenants' });
    this.deleteApartmentButton = page.getByRole('button', { name: /delete apartment/i });
    this.contactDialog = page.getByRole('dialog', { name: /^Contacts for Select (Owner|Tenant)$/ });
    this.contactOptions = this.contactDialog.getByRole('listbox', { name: 'Suggestions' }).getByRole('option');
  }

  async goto(apartmentId: number | string): Promise<void> {
    await this.page.goto(Routes.apartmentEdit(apartmentId));
    await this.accountName.waitFor();
  }

  partyTab(party: Party): Locator {
    return this.partyTabs.getByRole('tab', { name: party === 'owner' ? 'Owners' : 'Tenants' });
  }

  /** "Current owners", "Previous tenants", … */
  section(party: Party, period: Period): Locator {
    return this.form.getByRole('region', { name: `${cap(period)} ${party}s` });
  }

  addMore(party: Party, period: Period): Locator {
    return this.section(party, period).getByRole('button', { name: `Add More ${period} ${party}` });
  }

  /** Row group "Current owner 1", "Previous tenant 2", … */
  row(party: Party, period: Period, n = 1): Locator {
    return this.section(party, period).getByRole('group', { name: `${cap(period)} ${party} ${n}`, exact: true });
  }

  /** All rows of a section, e.g. every "Current owner N" group. */
  rows(party: Party, period: Period): Locator {
    return this.section(party, period).getByRole('group', { name: new RegExp(`^${cap(period)} ${party} \\d+$`) });
  }

  /** Fields of one row. Labels follow Old EM: Ownership / Tenancy Start (and End) Date. */
  rowFields(row: Locator, party: Party) {
    const date = party === 'owner' ? 'Ownership' : 'Tenancy';
    return {
      contact: row.getByRole('combobox', { name: `Select ${cap(party)}` }),
      startDate: row.getByRole('textbox', { name: `${date} Start Date` }),
      endDate: row.getByRole('textbox', { name: `${date} End Date` }),
      current: row.getByRole('checkbox', { name: /^Current\b/ }),
      remove: row.getByRole('button', { name: /^Remove / })
    };
  }

  /** Adds a row and fills it. Dates are DD-MM-YYYY. Returns the picked contact text. Not saved until save(). */
  async addRow(party: Party, period: Period, contactSearch: string, start: string, end?: string): Promise<string> {
    await this.partyTab(party).click();
    const n = (await this.rows(party, period).count()) + 1;
    await this.addMore(party, period).click();
    const f = this.rowFields(this.row(party, period, n), party);
    const picked = await this.pickContact(f.contact, contactSearch);
    await f.startDate.fill(start);
    if (end) await f.endDate.fill(end);
    return picked;
  }

  /** Clicks [Save]; New EM then opens the Summary tab. */
  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForURL(/[?&]tab=summary/);
  }

  /** Removes every owner and tenant row and saves, if there were any. Leaves the apartment with no contacts. */
  async clearContacts(apartmentId: number | string): Promise<void> {
    await this.goto(apartmentId);
    let removed = 0;
    for (const party of ['owner', 'tenant'] as const) {
      await this.partyTab(party).click();
      for (const period of ['current', 'previous'] as const) {
        const rows = this.rows(party, period);
        while (await rows.count()) {
          await rows.first().getByRole('button', { name: /^Remove / }).click();
          removed++;
        }
      }
    }
    if (removed) await this.save();
  }

  /** Opens the contact picker of a row, searches, and picks the first match. Nothing is saved. */
  async pickContact(contact: Locator, search: string): Promise<string> {
    await contact.click();
    await this.contactDialog.getByRole('combobox').fill(search);
    const option = this.contactOptions.filter({ hasText: search }).first();
    await option.waitFor();
    const text = (await option.innerText()).trim();
    await option.click();
    await this.contactDialog.waitFor({ state: 'detached' });
    return text;
  }
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
