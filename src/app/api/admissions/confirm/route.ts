import { NextRequest, NextResponse } from 'next/server';
import { confirmAdmission, ConfirmAdmissionInput } from '@/lib/data/residents-repo';
import { updateEnquiryStatus } from '@/lib/data/enquiries-repo';
import { verifyStaffAuth } from '@/lib/auth/rbac';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields check
    const required = [
      'full_name',
      'phone',
      'gender',
      'category',
      'branch_code',
      'floor_number',
      'room_number',
      'bed_id',
      'admission_date',
      'agreed_monthly_rent',
      'emergency_contact_name',
      'emergency_contact_phone',
      'emergency_contact_relation',
    ];

    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { success: false, error: `Field '${field}' is required for confirmed admission.` },
          { status: 400 }
        );
      }
    }

    // Server-side authorization check: Only owner or branch_manager for the assigned branch
    const branchCodeNum = parseInt(String(body.branch_code), 10);
    const staffCheck = verifyStaffAuth(request, {
      allowedRoles: ['owner', 'branch_manager'],
      requiredBranchCode: branchCodeNum,
    });

    if (!staffCheck.authenticated) {
      return NextResponse.json(
        { success: false, error: staffCheck.error || 'Unauthorized to confirm admissions.' },
        { status: staffCheck.statusCode || 403 }
      );
    }

    const result = confirmAdmission(body as ConfirmAdmissionInput);

    if (!result.success || !result.resident) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to confirm admission.' },
        { status: 400 }
      );
    }

    // If an enquiry ID was provided, mark enquiry as approved and link converted resident ID
    if (body.enquiry_id) {
      await updateEnquiryStatus(
        body.enquiry_id,
        'approved',
        `Converted to active admission with Resident ID ${result.resident.resident_id}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Admission confirmed! Permanent DEVI Resident ID ${result.resident.resident_id} generated. Bed ${result.resident.current_bed_number} assigned.`,
        data: result.resident,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
