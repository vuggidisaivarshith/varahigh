import { NextRequest, NextResponse } from 'next/server';
import { recordPayment } from '@/lib/data/financials-repo';
import crypto from 'crypto';

// Track processed payment IDs to prevent duplicate webhook/call processing
const processedGatewayPayments = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      resident_id,
      amount,
      invoice_id,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !resident_id || !amount) {
      return NextResponse.json(
        { success: false, error: 'Order ID, payment ID, resident ID, and amount are required.' },
        { status: 400 }
      );
    }

    // Idempotency check: if this gateway payment ID was already settled, return success
    if (processedGatewayPayments.has(razorpay_payment_id)) {
      return NextResponse.json({
        success: true,
        message: 'Payment was already processed and verified previously. Duplicate webhook ignored safely.',
      });
    }

    // Mandatory Cryptographic signature check
    const secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET || 'sK2fdECWh3ItJvA19HBhm7Ru';
    if (!razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Signature is mandatory for payment verification.' },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature. Cryptographic verification failed.' },
        { status: 400 }
      );
    }

    // Record verified transaction in ledger
    const result = recordPayment({
      resident_id,
      amount: parseFloat(amount),
      payment_method: 'online_upi',
      transaction_reference: `RZP/${razorpay_payment_id}/${razorpay_order_id}`,
      collector_name: 'Razorpay Payment Gateway (Verified)',
      verification_status: 'verified',
      invoice_id,
      remarks: 'Online payment captured and verified via signed callback.',
    });

    if (!result.success || !result.payment) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to settle verified payment.' },
        { status: 400 }
      );
    }

    processedGatewayPayments.add(razorpay_payment_id);

    return NextResponse.json({
      success: true,
      message: `Payment of ₹${result.payment.amount.toLocaleString()} successfully verified! Digital receipt ${result.payment.receipt_number} generated.`,
      payment: result.payment,
      data: result.payment,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
