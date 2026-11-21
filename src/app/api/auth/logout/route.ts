import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIES } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Successfully logged out.',
  });

  // Clear all auth cookies
  response.cookies.delete(SESSION_COOKIES.STAFF);
  response.cookies.delete(SESSION_COOKIES.RESIDENT);
  response.cookies.delete('devi_staff_name');
  response.cookies.delete('devi_staff_role');
  response.cookies.delete('devi_resident_id');

  return response;
}
