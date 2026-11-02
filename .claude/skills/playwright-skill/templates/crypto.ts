// em app only (PROJECT.md "Encrypted API Responses"). Other apps do not need this file.
// src/api/crypto.ts
import { type APIResponse } from '@playwright/test';
import { env } from '@utils/Environment';

/**
 * em-backend wraps every response body in an AES-encrypted `payload` field (ApiEncrypt middleware).
 * Port the exact algorithm from em-web `src/libs/crypton` (cipher, IV handling, encoding)
 * before using this. Until then it fails loudly instead of guessing.
 */
export function decryptString(_payload: string, _key: string): string {
  throw new Error('decryptString not implemented: port em-web src/libs/crypton');
}

export async function decryptPayload<T>(response: APIResponse): Promise<T> {
  const body = await response.json();
  if (typeof body?.payload !== 'string') {
    // Unencrypted response (e.g. some error responses): return as is.
    return body as T;
  }
  return JSON.parse(decryptString(body.payload, env.apiPayloadKey)) as T;
}
