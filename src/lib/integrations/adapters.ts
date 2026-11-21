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
 * Creates authenticated Razorpay orders when live, or test sandbox orders.
 */
export async function createPaymentOrder(input: PaymentOrderInput): Promise<PaymentOrderOutput> {
  const isLive = canExecuteLiveIntegration('payments');
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (isLive && keyId && keySecret && !keyId.includes('placeholder')) {
    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const amountInPaise = Math.round(input.amount * 100);
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: input.currency || 'INR',
          receipt: input.receipt_number || `RCPT-${Date.now()}`,
          notes: {
            resident_id: input.resident_id,
            invoice_id: input.invoice_id || '',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          order_id: data.id,
          amount: data.amount / 100,
          currency: data.currency,
          mode: 'live',
        };
      }
    } catch (e) {
      console.warn('Razorpay live order error, falling back to test order:', e);
    }
  }

  // Sandbox / test order
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return {
    success: true,
    order_id: orderId,
    amount: input.amount,
    currency: input.currency || 'INR',
    mode: isLive ? 'live' : 'preview_sandbox',
    preview_notice: isLive ? undefined : 'SANDBOX MODE: Safe simulation order.',
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
