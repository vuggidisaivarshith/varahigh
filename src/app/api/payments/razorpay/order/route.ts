import { NextRequest, NextResponse } from 'next/server';
import { getResidentById } from '@/lib/data/residents-repo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resident_id, invoice_id, amount } = body;

    if (!resident_id || !amount) {
      return NextResponse.json(
        { success: false, error: 'Resident ID and payment amount are required.' },
        { status: 400 }
      );
    }

    const resident = getResidentById(resident_id);
    if (!resident) {
      return NextResponse.json({ success: false, error: 'Resident not found.' }, { status: 404 });
    }

    // Amount in paise
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    const receiptId = `RCPT-${Date.now()}`;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderData = {
      id: `order_devi_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      status: 'created',
    };

    // If live/test Razorpay API credentials are provided, call official Razorpay API
    if (keyId && keySecret && !keyId.includes('mock')) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: receiptId,
            notes: {
              resident_id: resident.id,
              devi_resident_id: resident.resident_id,
              resident_name: resident.full_name,
              invoice_id: invoice_id || '',
            },
          }),
        });

        if (rzpResponse.ok) {
          const rzpJson = await rzpResponse.json();
          orderData = {
            id: rzpJson.id,
            amount: rzpJson.amount,
            currency: rzpJson.currency,
            receipt: rzpJson.receipt || receiptId,
            status: rzpJson.status,
          };
        }
      } catch (e) {
        console.warn('Razorpay API call warning, falling back to local generated order:', e);
      }
    }

    return NextResponse.json({
      success: true,
      order: orderData,
      key_id: keyId || 'rzp_test_U2WWrItDHHmxWU',
      resident: {
        name: resident.full_name,
        email: resident.email || 'resident@devihostels.com',
        phone: resident.phone,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
