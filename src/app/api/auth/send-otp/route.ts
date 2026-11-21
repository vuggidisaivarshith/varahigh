import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { generateOtp } from '@/lib/auth/otp';
import { getResidentByPhone } from '@/lib/data/residents-repo';
import { sendNotification } from '@/lib/data/notifications-repo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    // Rate limit: Max 3 OTP requests per phone number every 5 minutes
    const rateCheck = checkRateLimit(`otp:${cleanPhone}`, 3, 300);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many OTP requests. Please wait ${rateCheck.resetInSeconds} seconds before requesting another code.`,
        },
        { status: 429 }
      );
    }

    // Check if resident exists with this phone number
    const resident = getResidentByPhone(cleanPhone);
    if (!resident) {
      return NextResponse.json(
        {
          success: false,
          error: `No active resident record found for +91 ${cleanPhone}. If you are newly admitted, please verify with hostel reception.`,
        },
        { status: 404 }
      );
    }

    // Generate cryptographic OTP
    const { otp, expiresAt } = generateOtp(cleanPhone);

    // Send multi-channel notification (SMS / WhatsApp)
    await sendNotification({
      resident_id: resident.id,
      channel: 'sms',
      template: 'broadcast_announcement',
      custom_data: {
        custom_message: `Your DEVI Hostels login OTP code is ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
      },
    });

    // In development mode only, provide an informative hint if in local sandbox
    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      success: true,
      message: `Verification code dispatched to +91 ${cleanPhone.slice(0, 2)}******${cleanPhone.slice(-2)}. Valid for 5 minutes.`,
      // Never expose OTP code in response body in production
      ...(isDev ? { dev_hint: `Dev Sandbox OTP: ${otp}` } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
