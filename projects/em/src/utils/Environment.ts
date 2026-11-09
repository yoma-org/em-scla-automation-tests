// src/utils/Environment.ts
import path from 'node:path';

/** Roles the suite logs in as. Add a role here and set <ROLE>_EMAIL / <ROLE>_PASSWORD in .env. */
export const roles = ['admin'] as const;
export type Role = (typeof roles)[number];

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name} (see .env.example)`);
  return value;
}

export const env = {
  get baseUrl() { return required('BASE_URL'); }
};

// 'uo-operator' → UO_OPERATOR_EMAIL / UO_OPERATOR_PASSWORD
export function credentials(role: Role): { email: string; password: string } {
  const prefix = role.toUpperCase().replaceAll('-', '_');
  return { email: required(`${prefix}_EMAIL`), password: required(`${prefix}_PASSWORD`) };
}

// projects/em/playwright/.auth/<role>.json, or .auth/<TARGET_ENV>/<role>.json (git-ignored).
// One folder per environment, so a UAT login is never reused on the test environment.
export function authFile(role: Role): string {
  const target = process.env.TARGET_ENV;
  const dir = path.join(__dirname, '..', '..', 'playwright', '.auth', ...(target ? [target] : []));
  return path.join(dir, `${role}.json`);
}
