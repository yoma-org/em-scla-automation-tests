// src/utils/Environment.ts
import path from 'node:path';

/** Roles the suite logs in as. `approver` falls back to admin when APPROVER_* is not set. */
export const roles = ['admin', 'approver'] as const;
export type Role = (typeof roles)[number];

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name} (copy projects/old-em/.env.example to .env)`);
  return value;
}

export const env = {
  get baseUrl() { return required('BASE_URL'); }
};

export function credentials(role: Role): { email: string; password: string } {
  if (role === 'approver' && !process.env.APPROVER_EMAIL) return credentials('admin');
  const prefix = role.toUpperCase();
  return { email: required(`${prefix}_EMAIL`), password: required(`${prefix}_PASSWORD`) };
}

/** True when a second account approves; otherwise admin approves its own documents. */
export const hasSeparateApprover = () => Boolean(process.env.APPROVER_EMAIL);

/** Roles that need a login of their own (approver shares admin's session when it has no account). */
export const loginRoles = (): Role[] => (hasSeparateApprover() ? [...roles] : ['admin']);

// projects/old-em/playwright/.auth/<role>.json (git-ignored)
export function authFile(role: Role): string {
  const file = role === 'approver' && !hasSeparateApprover() ? 'admin' : role;
  return path.join(__dirname, '..', '..', 'playwright', '.auth', `${file}.json`);
}
