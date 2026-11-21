/**
 * VARAHI GIRLS HOSTEL — CENTRALIZED INTEGRATIONS & PRE-LAUNCH CONFIGURATION
 * 
 * IMPORTANT: PRE-LAUNCH MODE NOTICE
 * This platform is currently in Pre-Launch Preview Mode for review and approval
 * by Business Proprietor E. Bharath Chandra.
 * 
 * NO LIVE BUSINESS INTEGRATIONS (Payments, WhatsApp Business API, SMS, Email)
 * are activated until formal owner authorization is received.
 */

export interface IntegrationStatus {
  service: string;
  category: 'payment' | 'messaging' | 'storage' | 'auth' | 'analytics' | 'maps';
  enabled: boolean;
  mode: 'disabled' | 'preview_mock' | 'sandbox_test' | 'live_production';
  status: 'pending_owner_approval' | 'configured_sandbox' | 'live_active';
  description: string;
  requiredCredentials: string[];
  ownerDecisionsNeeded: string[];
}

export const INTEGRATIONS_CONFIG = {
  // Global Pre-Launch Mode Switch
  IS_PRE_LAUNCH_MODE: true,
  OWNER_NAME: 'E. Bharath Chandra',
  BUSINESS_NAME: 'VARAHI GIRLS HOSTEL',

  // Feature Flags: All external live services default to FALSE
  FEATURES: {
    ENABLE_LIVE_PAYMENTS: false,
    ENABLE_LIVE_WHATSAPP_API: false,
    ENABLE_LIVE_SMS_DISPATCH: false,
    ENABLE_LIVE_EMAIL_DISPATCH: false,
    ENABLE_LIVE_MAPS_API: false,
    ENABLE_REAL_TIME_NOTIFICATIONS: false,
  },

  // Detailed status for every external integration
  SERVICES: [
    {
      service: 'Razorpay Payment Gateway',
      category: 'payment',
      enabled: false,
      mode: 'preview_mock',
      status: 'pending_owner_approval',
      description: 'Online rent collection via UPI, Debit/Credit Cards, and Net Banking.',
      requiredCredentials: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET'],
      ownerDecisionsNeeded: [
        'Select official business bank account for settlement payout',
        'Approve Razorpay merchant onboarding & KYC documentation',
        'Decide whether transaction convenience fee is absorbed or passed to resident',
      ],
    },
    {
      service: 'WhatsApp Business Platform',
      category: 'messaging',
      enabled: false,
      mode: 'preview_mock',
      status: 'pending_owner_approval',
      description: 'Automated rent receipts, monthly due reminders, and admission notifications over official WhatsApp.',
      requiredCredentials: ['WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_WABA_ID'],
      ownerDecisionsNeeded: [
        'Register official business phone number on Meta Business Manager',
        'Approve WhatsApp message templates with Meta',
      ],
    },
    {
      service: 'SMS / OTP Gateway',
      category: 'messaging',
      enabled: false,
      mode: 'preview_mock',
      status: 'pending_owner_approval',
      description: 'Login OTP verification codes and critical security alerts via DLT-approved SMS.',
      requiredCredentials: ['SMS_GATEWAY_API_KEY', 'SMS_SENDER_ID', 'DLT_TE_ID'],
      ownerDecisionsNeeded: [
        'Register entity and SMS headers on Indian Telecom DLT portal',
        'Select SMS vendor (e.g. Fast2SMS, Textlocal, Gupshup)',
      ],
    },
    {
      service: 'Email Notification Service (Resend)',
      category: 'messaging',
      enabled: false,
      mode: 'preview_mock',
      status: 'pending_owner_approval',
      description: 'Formal digital invoices and quarterly financial statements sent to residents and parents.',
      requiredCredentials: ['RESEND_API_KEY', 'EMAIL_FROM_DOMAIN'],
      ownerDecisionsNeeded: [
        'Configure DNS DKIM and SPF records for devihostels.com',
        'Select sending address (e.g. billing@devihostels.com)',
      ],
    },
    {
      service: 'Supabase PostgreSQL Managed Backend',
      category: 'auth',
      enabled: true,
      mode: 'sandbox_test',
      status: 'configured_sandbox',
      description: 'Multi-branch centralized database with Row Level Security (RLS) policies.',
      requiredCredentials: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
      ownerDecisionsNeeded: [
        'Link official Supabase project to company billing',
        'Confirm database backup retention policies',
      ],
    },
  ] as IntegrationStatus[],
};

/**
 * Helper to safely query whether an external live integration can execute.
 * ALWAYS returns false in pre-launch mode unless explicitly approved.
 */
export function canExecuteLiveIntegration(
  service: 'payments' | 'whatsapp' | 'sms' | 'email' | 'maps'
): boolean {
  if (INTEGRATIONS_CONFIG.IS_PRE_LAUNCH_MODE) {
    return false;
  }
  switch (service) {
    case 'payments':
      return INTEGRATIONS_CONFIG.FEATURES.ENABLE_LIVE_PAYMENTS;
    case 'whatsapp':
      return INTEGRATIONS_CONFIG.FEATURES.ENABLE_LIVE_WHATSAPP_API;
    case 'sms':
      return INTEGRATIONS_CONFIG.FEATURES.ENABLE_LIVE_SMS_DISPATCH;
    case 'email':
      return INTEGRATIONS_CONFIG.FEATURES.ENABLE_LIVE_EMAIL_DISPATCH;
    case 'maps':
      return INTEGRATIONS_CONFIG.FEATURES.ENABLE_LIVE_MAPS_API;
    default:
      return false;
  }
}
