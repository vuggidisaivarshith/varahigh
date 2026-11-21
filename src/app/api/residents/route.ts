import { NextRequest, NextResponse } from 'next/server';
import { getResidents } from '@/lib/data/residents-repo';
import { CustomerCategory } from '@/types/database';
import { verifyStaffAuth, verifyResidentAuth } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    // Check authorization: Staff gets filtered list; Resident gets strictly their own record
    const staffCheck = verifyStaffAuth(request);
    let residentIdFilter: string | undefined = undefined;
    let allowedBranchCode: number | undefined = undefined;

    if (!staffCheck.authenticated) {
      const residentCheck = verifyResidentAuth(request);
      if (!residentCheck.authenticated || !residentCheck.resident) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Staff or resident session required.' },
          { status: 401 }
        );
      }
      residentIdFilter = residentCheck.resident.residentId;
    } else if (staffCheck.staff && staffCheck.staff.role !== 'owner') {
      // Non-owner staff can only view residents in their assigned branches
      if (staffCheck.staff.assignedBranchCodes.length === 1) {
        allowedBranchCode = staffCheck.staff.assignedBranchCodes[0];
      }
    }

    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get('branch_code');
    const category = searchParams.get('category') as CustomerCategory | null;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const effectiveBranchCode = branchCode ? parseInt(branchCode, 10) : allowedBranchCode;

    let residents = getResidents({
      branchCode: effectiveBranchCode,
      category: category || undefined,
      status: status || undefined,
      search: search || undefined,
    });

    if (residentIdFilter) {
      residents = residents.filter(
        (r) => r.resident_id === residentIdFilter || r.id === residentIdFilter
      );
    }

    return NextResponse.json({
      success: true,
      count: residents.length,
      data: residents,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
