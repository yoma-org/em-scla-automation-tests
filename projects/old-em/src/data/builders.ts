// src/data/builders.ts — fresh test data through the Old EM UI (PROJECT.md › Data Isolation).
//
// Every builder creates NEW records named after uniqueName() and returns what later steps need:
//
//   createContact(page, opts?)       Contacts › New. NRC contact by default ("12/PAZATA(N)<6 random digits>",
//                                     phone +95 9<8 random digits>), or PASSPORT / COMPANY.
//                                     → { id, name, identityType, identity, phone, detailUrl }
//   createApartment(page, opts?)     Apartments › New in City Loft / CL1 (unit "QE<mmdd><rand4>", Enable).
//                                     Owner / tenant are optional: pass owner: true (a new contact is
//                                     created) or a Contact, likewise tenant; they are added on the Edit tab
//                                     with today's start date. UO / EM / invoices do not require an owner.
//                                     → { id, name ("CL1-QE…"), zone, building, unit, detailUrl, owner?, tenant? }
//   createCashAccount(page, opts?)   Cash & Bank Account › New: CASH (payment method Cash) or BANK (first bank
//                                     in the list, payment method Bank Transfer, random account number), MMK,
//                                     initial balance 0 unless given. → { id, name, type, currency, initialBalance }
//   createUoInvoice(page, apt, readings)
//                                     UO › New UO Draft for the apartment (readings not given = 0 → 0), then
//                                     approves the draft (admin approves its own) → invoice "Utilities".
//                                     → { invoiceId, invoiceUrl }. One UO per apartment per month: use a new apartment.
//
// Each builder waits for Old EM's success toast and for the record in its listing before returning.
import { expect, type Page } from '@playwright/test';
import { uniqueName } from '@helpers/names';
import { toast } from '@components/Toast';
import { ContactCreatePage, type IdentityType } from '@pages/contacts/ContactCreatePage';
import { ContactsListPage } from '@pages/contacts/ContactsListPage';
import { ApartmentCreatePage } from '@pages/apartments/ApartmentCreatePage';
import { ApartmentsListPage } from '@pages/apartments/ApartmentsListPage';
import { ApartmentEditPage } from '@pages/apartments/ApartmentEditPage';
import { ApartmentDetailPage } from '@pages/apartments/ApartmentDetailPage';
import { CashBankAccountCreatePage } from '@pages/cash-bank-accounts/CashBankAccountCreatePage';
import { CashBankAccountsPage } from '@pages/cash-bank-accounts/CashBankAccountsPage';
import { UoCreatePage, type UoReadings } from '@pages/uo/UoCreatePage';
import { UoDraftsPage } from '@pages/uo/UoDraftsPage';

const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
const idFromHref = (href: string | null, what: string) => {
  const id = href?.match(/\/(\d+)\//)?.[1];
  if (!id) throw new Error(`No ${what} id in link "${href}"`);
  return id;
};

// ── Contacts ────────────────────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  identityType: IdentityType;
  /** As the Contacts list shows it, e.g. "12/PAZATA(N)123456" or "P1234567". */
  identity: string;
  /** National number without +95, e.g. "912345678". */
  phone: string;
  detailUrl: string;
}

export interface ContactOptions {
  name?: string;
  identityType?: IdentityType;
  /** NRC parts (default 12 / PAZATA / N / random) or the passport / company number. */
  nrc?: { state: string; township: string; type: string; number?: string };
  identityNumber?: string;
  phone?: string;
}

export async function createContact(page: Page, opts: ContactOptions = {}): Promise<Contact> {
  const form = new ContactCreatePage(page);
  const list = new ContactsListPage(page);
  const name = opts.name ?? uniqueName('Contact');
  const identityType = opts.identityType ?? 'NRC';
  const phone = opts.phone ?? `9${digits(8)}`;

  await form.goto();
  await form.fullName.fill(name);
  await form.phone.fill(phone);
  await form.setIdentityType(identityType);
  let identity: string;
  if (identityType === 'NRC') {
    const nrc = { state: '12', township: 'PAZATA', type: 'N', ...opts.nrc };
    const number = nrc.number ?? digits(6);
    await form.fillNrc(nrc.state, nrc.township, nrc.type, number);
    identity = `${nrc.state}/${nrc.township}(${nrc.type})${number}`;
  } else {
    identity = opts.identityNumber ?? `${identityType === 'PASSPORT' ? 'P' : 'C'}${digits(8)}`;
    await form.fillIdentityNumber(identity);
  }
  await form.createButton.click();
  await expect(toast(page, 'Contact has been created successfully')).toBeVisible();
  await expect(page).toHaveURL(/\/contacts$/);

  await list.find(name);
  await expect(list.row(name)).toBeVisible();
  const id = idFromHref(await list.detailLink(name).getAttribute('href'), 'contact');
  return { id, name, identityType, identity, phone, detailUrl: `/contacts/${id}/detail` };
}

// ── Apartments ──────────────────────────────────────────────────────────────────────────────

export interface Apartment {
  id: string;
  /** "<building>-<unit>", e.g. "CL1-QE1112k3x9": the name every apartment picker shows. */
  name: string;
  zone: string;
  building: string;
  unit: string;
  detailUrl: string;
  owner?: Contact;
  tenant?: Contact;
}

export interface ApartmentOptions {
  zone?: string;
  building?: string;
  unit?: string;
  owner?: Contact | true;
  tenant?: Contact | true;
}

/** Unit like "QE1112k3x9": Old EM builds the apartment name from building + unit, so keep it short. */
export function uniqueUnit(): string {
  const d = new Date();
  const mmdd = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `QE${mmdd}${Math.random().toString(36).slice(2, 6)}`;
}

/** Fills and submits the New Apartment form; the caller checks the result. Returns the expected name. */
export async function submitNewApartment(page: Page, zone: string, building: string, unit: string): Promise<string> {
  const form = new ApartmentCreatePage(page);
  await form.goto();
  await form.selectZone(zone);
  await form.selectBuilding(building);
  await form.unit.fill(unit);
  await expect(form.fullName).toHaveValue(`${building}-${unit}`);
  await form.createButton.click();
  return `${building}-${unit}`;
}

/** Id of a listed apartment (Apartments list, filtered to its building). */
export async function findApartmentId(page: Page, zone: string, building: string, name: string): Promise<string> {
  const list = new ApartmentsListPage(page);
  await list.goto();
  await list.show(zone, building, name);
  await expect(list.nameLink(name)).toBeVisible();
  return idFromHref(await list.nameLink(name).getAttribute('href'), 'apartment');
}

export async function createApartment(page: Page, opts: ApartmentOptions = {}): Promise<Apartment> {
  const zone = opts.zone ?? 'City Loft';
  const building = opts.building ?? 'CL1';
  const unit = opts.unit ?? uniqueUnit();
  // Contacts first, so the apartment is not left half set up when a contact fails.
  const owner = opts.owner === true ? await createContact(page, { name: uniqueName('Owner') }) : opts.owner;
  const tenant = opts.tenant === true ? await createContact(page, { name: uniqueName('Tenant') }) : opts.tenant;

  const name = await submitNewApartment(page, zone, building, unit);
  await expect(toast(page, 'Estate created successfully')).toBeVisible();
  await expect(page).toHaveURL(/\/apartments$/);
  const id = await findApartmentId(page, zone, building, name);

  if (owner || tenant) {
    const edit = new ApartmentEditPage(page);
    await edit.goto(id);
    if (owner) await edit.addCurrent('Owner', owner.name);
    if (tenant) await edit.addCurrent('Tenant', tenant.name);
    await edit.saveButton.click();
    await expect(toast(page, 'Owners and Tenants have been updated successfully')).toBeVisible();
  }
  return { id, name, zone, building, unit, detailUrl: `/apartments/${id}/detail`, owner, tenant };
}

// ── Cash & bank accounts ────────────────────────────────────────────────────────────────────

export interface CashAccount {
  id: string;
  name: string;
  type: 'CASH' | 'BANK';
  currency: string;
  initialBalance: number;
}

export interface CashAccountOptions {
  name?: string;
  type?: 'CASH' | 'BANK';
  currency?: string;
  initialBalance?: number;
  /** Default: ['Cash'] for CASH, ['Bank Transfer'] for BANK. */
  paymentMethods?: string[];
  /** BANK only; default: the first bank in the list. */
  bank?: string;
}

export async function createCashAccount(page: Page, opts: CashAccountOptions = {}): Promise<CashAccount> {
  const type = opts.type ?? 'CASH';
  const currency = opts.currency ?? 'MMK';
  const initialBalance = opts.initialBalance ?? 0;
  const name = opts.name ?? uniqueName(type === 'CASH' ? 'Cash' : 'Bank');
  const form = new CashBankAccountCreatePage(page);
  const list = new CashBankAccountsPage(page);

  await form.goto();
  await form.name.fill(name);
  await form.selectCurrency(currency);
  if (initialBalance) await form.initialBalance.fill(String(initialBalance));
  await form.selectType(type);
  await form.selectPaymentMethods(opts.paymentMethods ?? [type === 'CASH' ? 'Cash' : 'Bank Transfer']);
  if (type === 'BANK') {
    await form.selectBank(opts.bank ?? /./);
    await form.accountNumber.fill(digits(10));
  }
  await form.createButton.click();
  await expect(toast(page, 'Account has been created successfully')).toBeVisible();
  await expect(page).toHaveURL(/\/cash-and-bank-accounts$/);

  // Text typed while the list is still loading is dropped, so type again until the row shows.
  await expect(async () => {
    await list.search.fill(name);
    await expect(list.row(name)).toBeVisible({ timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
  const id = idFromHref(await list.editLink(name).getAttribute('href'), 'account');
  return { id, name, type, currency, initialBalance };
}

// ── UO invoice ──────────────────────────────────────────────────────────────────────────────

export interface UoInvoice {
  invoiceId: string;
  invoiceUrl: string;
}

/** Saves a UO draft for the apartment (toast "1 UO Entry saved."). Does not approve it. */
export async function createUoDraft(page: Page, apartment: Pick<Apartment, 'name'>, readings: UoReadings): Promise<void> {
  const form = new UoCreatePage(page);
  await form.goto();
  await form.selectApartment(apartment.name);
  await form.fillReadings(readings);
  await form.submitButton.click();
  await expect(toast(page, 'UO Entry saved')).toBeVisible();
}

/** UO draft → approve → the apartment's new "Utilities" invoice. */
export async function createUoInvoice(page: Page, apartment: Pick<Apartment, 'id' | 'name'>, readings: UoReadings): Promise<UoInvoice> {
  await createUoDraft(page, apartment, readings);
  const drafts = new UoDraftsPage(page);
  await drafts.goto();
  await drafts.approve(apartment.name);
  await expect(toast(page, 'UO Entry Invoiced Successfully')).toBeVisible();

  const detail = new ApartmentDetailPage(page);
  await detail.gotoInvoices(apartment.id);
  const row = detail.invoiceRow('Utilities');
  await expect(row).toHaveCount(1);
  const href = await row.locator('a[href^="/invoices/"]').getAttribute('href');
  const invoiceId = href?.match(/\/invoices\/(\d+)/)?.[1];
  if (!invoiceId) throw new Error(`No invoice link on ${apartment.name}'s Invoices tab`);
  return { invoiceId, invoiceUrl: `/invoices/${invoiceId}` };
}
