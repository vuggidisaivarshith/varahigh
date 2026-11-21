import { NextRequest, NextResponse } from 'next/server';
import { getResidentById, getResidentByPhone } from '@/lib/data/residents-repo';
import { checkRateLimit, resetRateLimit } from '@/lib/auth/rate-limit';
import { verifyOtp } from '@/lib/auth/otp';
import { createSessionToken, SESSION_COOKIES } from '@/lib/auth/session';
import { verifyPassword } from '@/lib/auth/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, phone, otp, resident_id, password } = body;

    let resident = null;

    if (method === 'otp') {
      if (!phone || !otp) {
        return NextResponse.json(
          { success: false, error: 'Mobile number and OTP code are required.' },
          { status: 400 }
        );
      }

      const cleanPhone = phone.replace(/\D/g, '').slice(-10);

      // Rate limit verification attempts (Max 5 attempts per 5 minutes)
      const rateCheck = checkRateLimit(`verify:${cleanPhone}`, 5, 300);
      if (!rateCheck.success) {
        return NextResponse.json(
          {
            success: false,
            error: `Too many failed attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
          },
          { status: 429 }
        );
      }

      // Verify cryptographic OTP
      const otpCheck = verifyOtp(cleanPhone, otp);
      if (!otpCheck.success) {
        return NextResponse.json(
          { success: false, error: otpCheck.error || 'Invalid OTP code.' },
          { status: 401 }
        );
      }

      resident = getResidentByPhone(cleanPhone);
      if (!resident) {
        return NextResponse.json(
          { success: false, error: 'No active resident record associated with this number.' },
          { status: 404 }
        );
      }

      // Successful verification; reset rate limit counter
      resetRateLimit(`verify:${cleanPhone}`);
    } else if (method === 'password') {
      if (!resident_id || !password) {
        return NextResponse.json(
          { success: false, error: 'Resident ID and password are required.' },
          { status: 400 }
        );
      }

      const cleanId = resident_id.trim().toUpperCase();

      // Rate limit password attempts by resident ID
      const rateCheck = checkRateLimit(`pwd:${cleanId}`, 5, 300);
      if (!rateCheck.success) {
        return NextResponse.json(
          {
            success: false,
            error: `Account locked temporarily due to too many failed attempts. Please wait ${rateCheck.resetInSeconds} seconds.`,
          },
          { status: 429 }
        );
      }

      resident = getResidentById(cleanId);
      if (!resident) {
        return NextResponse.json(
          { success: false, error: `Resident ID '${cleanId}' not found. Please verify your ID card.` },
          { status: 404 }
        );
      }

      // Verify password securely using cryptographic timing-safe check
      const validPassword = resident.password_hash ? verifyPassword(password, resident.password_hash) : false;
      if (!validPassword) {
        return NextResponse.json(
          { success: false, error: 'Incorrect account password. Please try again or log in with verified mobile OTP.' },
          { status: 401 }
        );
      }

      resetRateLimit(`pwd:${cleanId}`);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication method. Must be "otp" or "password".' },
        { status: 400 }
      );
    }

    if (resident.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: `Resident account is currently ${resident.status}. Please contact hostel management.`,
        },
        { status: 403 }
      );
    }

    // Generate signed tamper-proof 7-day session token
    const exp = Math.floor(Date.now() / 1000) + 7 * 86400;
    const sessionToken = createSessionToken({
      type: 'resident',
      residentId: resident.resident_id,
      id: resident.id,
      name: resident.full_name,
      branchCode: resident.current_branch_code,
      exp,
    });

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${resident.full_name}!`,
      data: {
        resident_id: resident.resident_id,
        id: resident.id,
        full_name: resident.full_name,
        category: resident.category,
        branch_code: resident.current_branch_code,
        room_number: resident.current_room_number,
        bed_number: resident.current_bed_number,
      },
    });

    // Set secure HTTP-only signed session cookie
    response.cookies.set(SESSION_COOKIES.RESIDENT, sessionToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 86400,
    });

    // Also set client-readable convenience identifier for UI greeting
    response.cookies.set('varahi_resident_id', resident.resident_id, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 86400,
    });
    response.cookies.set('devi_resident_id', resident.resident_id, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 86400,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
