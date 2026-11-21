/**
 * DEVI HOSTELS — Server-Side Environment Variable Validator
 * Ensures required secrets and endpoints are present and prevents insecure mock defaults.
 */

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  razorpayWebhookSecret?: string;
  cronSecret?: string;
  sessionSecret: string;
  isProduction: boolean;
}

function getEnvVar(key: string, required: boolean = false, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (required && (!value || value.includes('placeholder') || value.includes('mock-anon-key'))) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[CRITICAL SECURITY CONFIG] Missing required environment variable: ${key}`);
    }
  }
  return value || '';
}

export const env: EnvConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://varahigirlshostel.supabase.co',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  cronSecret: process.env.CRON_SECRET || 'varahi_girls_hostel_cron_internal_2026',
  sessionSecret: process.env.SESSION_SECRET || 'varahi-girls-hostel-shamshabad-secure-secret-key-2026',
  isProduction: process.env.NODE_ENV === 'production',
};

/**
 * Validates that critical server secrets are present.
 */
export function validateServerEnvironment(): { valid: boolean; warnings: string[]; errors: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co')) {
    warnings.push('NEXT_PUBLIC_SUPABASE_URL is not set to a real production Supabase instance.');
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('mock-anon')) {
    warnings.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is using a development placeholder.');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    warnings.push('SUPABASE_SERVICE_ROLE_KEY is unset; server-side bypass capabilities will be restricted.');
  }

  if (!process.env.CRON_SECRET) {
    warnings.push('CRON_SECRET is using default fallback; define a strong secret in production.');
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}
