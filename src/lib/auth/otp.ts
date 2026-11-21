import crypto from 'crypto';

interface StoredOtp {
  phone: string;
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
}

const otpMemoryStore = new Map<string, StoredOtp>();

function hashOtp(phone: string, otp: string): string {
  const salt = process.env.SESSION_SECRET || 'devi-hostels-otp-salt-2026';
  return crypto.createHmac('sha256', salt).update(`${phone}:${otp}`).digest('hex');
}

/**
 * Generates and stores a secure 6-digit OTP for a mobile number.
 * Valid for 5 minutes.
 */
export function generateOtp(phone: string): { otp: string; expiresAt: Date } {
  // Clean phone number
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  // Generate cryptographically secure 6-digit code
  const code = String(crypto.randomInt(100000, 1000000));
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpMemoryStore.set(cleanPhone, {
    phone: cleanPhone,
    hashedOtp: hashOtp(cleanPhone, code),
    expiresAt,
    attempts: 0,
  });

  return { otp: code, expiresAt: new Date(expiresAt) };
}

/**
 * Verifies an OTP for a given phone number.
 */
export function verifyOtp(
  phone: string,
  enteredOtp: string
): { success: boolean; error?: string } {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const record = otpMemoryStore.get(cleanPhone);

  if (!record) {
    return {
      success: false,
      error: 'No active OTP request found for this mobile number. Please request a new code.',
    };
  }

  if (Date.now() > record.expiresAt) {
    otpMemoryStore.delete(cleanPhone);
    return {
      success: false,
      error: 'OTP has expired. Please request a new verification code.',
    };
  }

  if (record.attempts >= 3) {
    otpMemoryStore.delete(cleanPhone);
    return {
      success: false,
      error: 'Too many incorrect attempts. This OTP has been invalidated for security. Please request a new one.',
    };
  }

  const expectedHash = hashOtp(cleanPhone, enteredOtp.trim());
  if (crypto.timingSafeEqual(Buffer.from(record.hashedOtp), Buffer.from(expectedHash))) {
    // OTP verified successfully; consume it immediately
    otpMemoryStore.delete(cleanPhone);
    return { success: true };
  }

  record.attempts += 1;
  const remaining = 3 - record.attempts;
  return {
    success: false,
    error: `Invalid OTP code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
  };
}
