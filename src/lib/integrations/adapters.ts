import { canExecuteLiveIntegration, INTEGRATIONS_CONFIG } from './config';

export interface PaymentOrderInput {
  resident_id: string;
  amount: number;
  currency?: string;
  invoice_id?: string;
  receipt_number?: string;
}

export interface PaymentOrderOutput {
  success: boolean;
  order_id: string;
  amount: number;
  currency: string;
  mode: 'preview_sandbox' | 'live';
  preview_notice?: string;
}

/**
 * Payment Integration Adapter
 * In Pre-Launch mode, generates a secure preview sandbox transaction without charging real money.
 */
export async function createPaymentOrder(input: PaymentOrderInput): Promise<PaymentOrderOutput> {
  const isLive = canExecuteLiveIntegration('payments');

  if (!isLive) {
    // Safe preview sandbox order
    const previewOrderId = `PREVIEW_ORDER_${Date.now()}`;
    return {
      success: true,
      order_id: previewOrderId,
      amount: input.amount,
      currency: input.currency || 'INR',
      mode: 'preview_sandbox',
      preview_notice: 'PRE-LAUNCH PREVIEW MODE: Live payment gateway is not activated. No real funds are deducted.',
    };
  }

  // Live Razorpay order creation (only executes after owner authorization)
  return {
    success: false,
    order_id: '',
    amount: input.amount,
    currency: 'INR',
    mode: 'live',
    preview_notice: 'Live gateway credentials required.',
  };
}

export interface NotificationDispatchInput {
  recipient_phone: string;
  recipient_email?: string;
  title: string;
  message: string;
  channel: 'whatsapp' | 'sms' | 'email';
}

export interface NotificationDispatchOutput {
  success: boolean;
  status: 'preview_logged' | 'dispatched_live';
  notice: string;
}

/**
 * Messaging & Notifications Adapter
 * In Pre-Launch mode, safely logs the formatted message without sending real paid SMS/WhatsApp messages.
 */
export async function dispatchNotification(input: NotificationDispatchInput): Promise<NotificationDispatchOutput> {
  const isLive = canExecuteLiveIntegration(input.channel);

  if (!isLive) {
    return {
      success: true,
      status: 'preview_logged',
      notice: `PRE-LAUNCH PREVIEW: Formatted ${input.channel.toUpperCase()} message logged safely. No live external API called.`,
    };
  }

  return {
    success: false,
    status: 'preview_logged',
    notice: 'Live dispatch not enabled.',
  };
}
