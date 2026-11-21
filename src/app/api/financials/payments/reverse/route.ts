import { NextRequest, NextResponse } from 'next/server';
import { reversePayment } from '@/lib/data/financials-repo';
import { verifyStaffAuth } from '@/lib/auth/rbac';

export async function POST(request: NextRequest) {
  try {
    // Reversals can strictly only be performed by Owner or Central Accountant
    const staffCheck = verifyStaffAuth(request, {
      allowedRoles: ['owner', 'accountant'],
    });

    if (!staffCheck.authenticated || !staffCheck.staff) {
      return NextResponse.json(
        { success: false, error: staffCheck.error || 'Unauthorized. Only Owner or Accountant can execute reversals.' },
        { status: staffCheck.statusCode || 403 }
      );
    }

    const body = await request.json();
    const { payment_id, reversal_reason } = body;

    if (!payment_id || !reversal_reason) {
      return NextResponse.json(
        { success: false, error: 'Payment ID and reversal reason are required.' },
        { status: 400 }
      );
    }

    const result = reversePayment(payment_id, reversal_reason, staffCheck.staff.name);

    if (!result.success || !result.reversalPayment) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to reverse payment.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Payment reversed successfully. Adjustment receipt ${result.reversalPayment.receipt_number} generated.`,
      data: result.reversalPayment,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
