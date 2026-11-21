import crypto from 'crypto';

/**
 * Computes a secure PBKDF2 salt + hash for account passwords.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored salt:hash string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) {
    return false;
  }

  try {
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const computedBuffer = Buffer.from(computedHash);
    const originalBuffer = Buffer.from(originalHash);

    if (computedBuffer.length !== originalBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedBuffer, originalBuffer);
  } catch {
    return false;
  }
}
