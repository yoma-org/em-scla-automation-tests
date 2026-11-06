// src/api/areas.ts — zones and buildings (one "areas" tree) through the web gateway, as the logged-in user.
import { type APIRequestContext } from '@playwright/test';

export interface Area {
  id: number;
  name: string;
  type: 'ZONE' | 'BUILDING';
  status: 'ACTIVE' | 'INACTIVE';
  parent_id: number | null;
}

export async function getAreas(request: APIRequestContext): Promise<Area[]> {
  const res = await request.get('/api/gw/areas?page=1&per_page=200');
  if (!res.ok()) throw new Error(`GET areas → ${res.status()} ${(await res.text()).slice(0, 300)}`);
  const body = await res.json();
  return (body.items ?? body.data ?? body) as Area[];
}
