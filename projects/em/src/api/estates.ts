// src/api/estates.ts — apartments (estates) and contacts through the web gateway, as the logged-in user.
// Used for test setup (PROJECT.md › Data Isolation): each test bills its own new apartment with its own owner,
// so the apartment / contact check areas start from zero.
// Bodies are the ones New EM's own forms send (Create Apartments, Create Contact, Apartment › Edit › Owners).
import { type APIRequestContext, type TestInfo } from '@playwright/test';
import { getAreas } from '@api/areas';
import { uniqueName } from '@helpers/names';

export interface Contact { id: number; name: string }
export interface Apartment { id: number; name: string; building: string; owner: Contact }

async function ok(res: Awaited<ReturnType<APIRequestContext['post']>>, what: string) {
  if (!res.ok()) throw new Error(`${what} → ${res.status()} ${(await res.text()).slice(0, 300)}`);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

/** Contact with a generated passport number and phone (no real resident data). */
export async function createContact(request: APIRequestContext, name: string): Promise<Contact> {
  const digits = String(Date.now()).slice(-7);
  const body = await ok(await request.post('/api/gw/contacts', {
    data: { type: 'PASSPORT', identity: `P${digits}`, name, mobile_number: `9${digits}${Math.floor(Math.random() * 10)}`, mobile_country_code: '+95' }
  }), 'POST contacts');
  return { id: Number(body.id ?? body.data?.id), name };
}

/** yyyy-mm-dd */
export const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * New apartment in the first active building, with a new contact as current owner since `ownerSince`
 * (set it before any document date the test uses). The apartment name is "<building>-<unit>".
 */
export async function createApartmentWithOwner(request: APIRequestContext, testInfo: TestInfo, ownerSince: Date): Promise<Apartment> {
  const tag = uniqueName(testInfo);
  const building = (await getAreas(request)).find(a => a.type === 'BUILDING' && a.status === 'ACTIVE');
  if (!building) throw new Error('no active building on this environment');
  const estate = await ok(await request.post('/api/gw/estates', {
    data: { area_id: building.id, unit: tag.replace(/^AT-/, ''), name: null, status: 'ACTIVE' }
  }), 'POST estates');
  const owner = await createContact(request, `${tag} Owner`);
  await ok(await request.put(`/api/gw/estates/${estate.id}/contacts`, {
    data: {
      owners: { current: [{ id: null, contact_id: owner.id, ownership_startdate: isoDate(ownerSince), ownership_enddate: null, is_new: true, is_deleted: false }], previous: [] },
      tenants: { current: [], previous: [] }
    }
  }), 'PUT estate contacts');
  return { id: Number(estate.id), name: String(estate.name), building: building.name, owner };
}
