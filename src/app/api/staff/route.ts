import { NextRequest, NextResponse } from 'next/server';
import { getStaffMembers, createStaffMember, updateStaffStatus } from '@/lib/data/staff-repo';
import { verifyStaffAuth } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    const staffCheck = verifyStaffAuth(request);
    if (!staffCheck.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Staff session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || undefined;
    const branchCode = searchParams.get('branch_code')
      ? parseInt(searchParams.get('branch_code')!, 10)
      : undefined;
    const status = searchParams.get('status') || undefined;

    const list = getStaffMembers({ role, branchCode, status });
    return NextResponse.json({ success: true, count: list.length, data: list });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only Owner can create staff accounts
    const staffCheck = verifyStaffAuth(request, { allowedRoles: ['owner'] });
    if (!staffCheck.authenticated) {
      return NextResponse.json(
        { success: false, error: staffCheck.error || 'Only Owner can provision staff accounts.' },
        { status: staffCheck.statusCode || 403 }
      );
    }

    const body = await request.json();
    const result = createStaffMember(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, staff: result.staff }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Only Owner can modify staff statuses
    const staffCheck = verifyStaffAuth(request, { allowedRoles: ['owner'] });
    if (!staffCheck.authenticated) {
      return NextResponse.json(
        { success: false, error: staffCheck.error || 'Only Owner can modify staff statuses.' },
        { status: staffCheck.statusCode || 403 }
      );
    }

    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Staff ID and status are required.' },
        { status: 400 }
      );
    }
    const result = updateStaffStatus(id, status);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, staff: result.staff });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
