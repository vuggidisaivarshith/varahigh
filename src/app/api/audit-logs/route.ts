import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/data/financials-repo';
import { verifyStaffAuth } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    // Audit logs can strictly only be viewed by Owner / Super Admin
    const staffCheck = verifyStaffAuth(request, {
      allowedRoles: ['owner'],
    });

    if (!staffCheck.authenticated) {
      return NextResponse.json(
        { success: false, error: staffCheck.error || 'Unauthorized. Only Owner can access security audit logs.' },
        { status: staffCheck.statusCode || 403 }
      );
    }

    const logs = getAuditLogs();
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
