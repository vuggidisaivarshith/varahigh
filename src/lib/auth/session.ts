import crypto from 'crypto';
import { env } from '@/lib/env';

export interface StaffSessionPayload {
  type: 'staff';
  staffId: string;
  name: string;
  email: string;
  role: 'owner' | 'branch_manager' | 'accountant' | 'warden';
  assignedBranchCodes: number[];
  exp: number; // Unix timestamp in seconds
}

export interface ResidentSessionPayload {
  type: 'resident';
  residentId: string; // e.g. DV1-1-00001
  id: string; // Internal UUID
  name: string;
  branchCode: number;
  exp: number;
}

export type AuthSessionPayload = StaffSessionPayload | ResidentSessionPayload;

const COOKIE_NAME_STAFF = 'devi_auth_staff_session';
const COOKIE_NAME_RESIDENT = 'devi_auth_resident_session';

/**
 * Creates an HMAC-SHA256 signature for a string payload.
 */
function signPayload(payloadB64: string): string {
  return crypto.createHmac('sha256', env.sessionSecret).update(payloadB64).digest('base64url');
}

/**
 * Generates a signed tamper-proof session token.
 */
export function createSessionToken(payload: AuthSessionPayload): string {
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadJson).toString('base64url');
  const signature = signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies and decodes a signed session token. Returns null if invalid or expired.
 */
export function verifySessionToken<T extends AuthSessionPayload>(token: string): T | null {
  if (!token || !token.includes('.')) return null;

  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;

  const expectedSignature = signPayload(payloadB64);
  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson) as T;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIES = {
  STAFF: COOKIE_NAME_STAFF,
  RESIDENT: COOKIE_NAME_RESIDENT,
};
