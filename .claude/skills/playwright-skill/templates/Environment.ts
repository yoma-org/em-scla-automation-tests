// src/utils/Environment.ts
import path from 'node:path';

export const roles = ['admin'] as const; // the roles this app's suite uses (PROJECT.md), e.g. em: 'uo-operator', 'uo-manager'
export type Role = (typeof roles)[number];

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name} (see .env.example)`);
  return value;
}

export const env = {
  get baseUrl() { return required('BASE_URL'); },
  get apiBaseUrl() { return required('API_BASE_URL'); },
  // App-specific, e.g. em: partner API and the response-decryption key
  get partnerApiBaseUrl() { return required('PARTNER_API_BASE_URL'); },
  get apiPayloadKey() { return required('API_PAYLOAD_KEY'); }
};

// 'uo-operator' → UO_OPERATOR_EMAIL / UO_OPERATOR_PASSWORD  (read from projects/<app>/.env)
export function credentials(role: Role): { email: string; password: string } {
  const prefix = role.toUpperCase().replaceAll('-', '_');
  return { email: required(`${prefix}_EMAIL`), password: required(`${prefix}_PASSWORD`) };
}

// projects/<app>/playwright/.auth/<role>.json (this file is projects/<app>/src/utils/Environment.ts)
export function authFile(role: Role): string {
  return path.join(__dirname, '..', '..', 'playwright', '.auth', `${role}.json`);
}
