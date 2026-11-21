import { NextRequest, NextResponse } from 'next/server';
import { verifyStaffAuth, verifyResidentAuth } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  // Check staff session first
  const staffCheck = verifyStaffAuth(request);
  if (staffCheck.authenticated && staffCheck.staff) {
    return NextResponse.json({
      success: true,
      authenticated: true,
      type: 'staff',
      user: staffCheck.staff,
    });
  }

  // Check resident session next
  const residentCheck = verifyResidentAuth(request);
  if (residentCheck.authenticated && residentCheck.resident) {
    return NextResponse.json({
      success: true,
      authenticated: true,
      type: 'resident',
      user: residentCheck.resident,
    });
  }

  return NextResponse.json({
    success: false,
    authenticated: false,
    error: 'No active session found.',
  }, { status: 401 });
}
