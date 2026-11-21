import { NextRequest, NextResponse } from 'next/server';
import { getPayments, recordPayment } from '@/lib/data/financials-repo';
import { verifyStaffAuth, verifyResidentAuth } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    const staffCheck = verifyStaffAuth(request);
    let residentIdFilter: string | undefined = undefined;

    if (!staffCheck.authenticated) {
      const residentCheck = verifyResidentAuth(request);
      if (!residentCheck.authenticated || !residentCheck.resident) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized. Staff or resident session required.' },
          { status: 401 }
        );
      }
      residentIdFilter = residentCheck.resident.residentId;
    }

    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get('branch_code');
    const residentId = searchParams.get('resident_id');
    const method = searchParams.get('method');
    const status = searchParams.get('status');

    const effectiveResidentId = residentIdFilter || residentId || undefined;

    const payments = getPayments({
      branchCode: branchCode ? parseInt(branchCode, 10) : undefined,
      residentId: effectiveResidentId,
      method: method || undefined,
      status: status || undefined,
    });

    return NextResponse.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only authorized staff (owner, accountant, branch_manager) can record payments
    const staffCheck = verifyStaffAuth(request, {
      allowedRoles: ['owner', 'accountant', 'branch_manager'],
    });

    if (!staffCheck.authenticated || !staffCheck.staff) {
      return NextResponse.json(
        { success: false, error: staffCheck.error || 'Unauthorized. Authorized staff session required.' },
        { status: staffCheck.statusCode || 403 }
      );
    }

    const body = await request.json();
    const {
      resident_id,
      amount,
      payment_method,
      transaction_reference,
      collector_name,
      verification_status,
      invoice_id,
      remarks,
    } = body;

    if (!resident_id || !amount || !payment_method) {
      return NextResponse.json(
        { success: false, error: 'Resident ID, amount, and payment method are required.' },
        { status: 400 }
      );
    }

    const result = recordPayment({
      resident_id,
      amount: parseFloat(amount),
      payment_method,
      transaction_reference,
      collector_name: collector_name || staffCheck.staff.name,
      collector_id: staffCheck.staff.staffId,
      verification_status: verification_status || 'verified',
      invoice_id,
      remarks,
    });

    if (!result.success || !result.payment) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to record payment.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Payment of ₹${result.payment.amount.toLocaleString()} recorded successfully with receipt ${result.payment.receipt_number}.`,
        data: result.payment,
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
