// src/api/categories.ts — income / expense categories through the web gateway, as the logged-in user.
import { type APIRequestContext } from '@playwright/test';

export interface Category {
  id: number;
  name: string;
  kind: 'INCOME' | 'EXPENSE';
  is_fund: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  parent_id: number | null;
  sort_order: number;
}

export async function getCategories(request: APIRequestContext, kind?: Category['kind']): Promise<Category[]> {
  const res = await request.get(`/api/gw/categories${kind ? `?kind=${kind}` : ''}`);
  if (!res.ok()) throw new Error(`GET categories → ${res.status()} ${(await res.text()).slice(0, 300)}`);
  return (await res.json()).items as Category[];
}

export async function findCategory(request: APIRequestContext, name: string): Promise<Category> {
  const found = (await getCategories(request)).find(c => c.name === name);
  if (!found) throw new Error(`category "${name}" not found`);
  return found;
}
