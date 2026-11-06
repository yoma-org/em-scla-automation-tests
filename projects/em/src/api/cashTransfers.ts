// src/api/cashTransfers.ts — read-only Cash Transfer checks through the web gateway (/api/gw), as the
// logged-in browser user. The gateway returns plain JSON (not the encrypted em-backend payload).
import { type APIRequestContext } from '@playwright/test';

export interface CashTransfer {
  id: number;
  status: 'DRAFT' | 'POSTED' | 'REJECTED' | string;
  journal_entry_id: number | null;
  from_amount: string;
  currency_code: string;
  requested_by: string;
  requested_by_name: string;
  description: string | null;
  voucher_code: string | null;
}

export interface CurrentUser {
  user_id: number;
  name: string;
  email: string;
  permissions: string[];
}

async function json<T>(request: APIRequestContext, url: string): Promise<T> {
  const res = await request.get(url);
  if (!res.ok()) throw new Error(`GET ${url} → ${res.status()} ${(await res.text()).slice(0, 300)}`);
  return res.json() as Promise<T>;
}

export const getCashTransfer = (request: APIRequestContext, id: number) =>
  json<CashTransfer>(request, `/api/gw/accounts/cash/transfers/${id}`);

export const getCurrentUser = (request: APIRequestContext) => json<CurrentUser>(request, '/api/auth/me');
