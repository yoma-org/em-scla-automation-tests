// src/api/clients/AuthApi.ts
import { type APIRequestContext } from '@playwright/test';
import { decryptPayload } from '@api/crypto';

// Confirm the login endpoint and response shape against the app API (PROJECT.md).
// decryptPayload() is em-specific; other apps read response.json() unless their API wraps bodies.
const LOGIN_PATH = 'auth/login';

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(email: string, password: string): Promise<string> {
    const response = await this.request.post(LOGIN_PATH, { data: { email, password } });
    if (!response.ok()) {
      throw new Error(`POST ${LOGIN_PATH} failed for ${email}: ${response.status()}`);
    }
    const body = await decryptPayload<{ access_token?: string; token?: string }>(response);
    const token = body.access_token ?? body.token;
    if (!token) throw new Error(`POST ${LOGIN_PATH}: no token in decrypted body`);
    return token;
  }
}
