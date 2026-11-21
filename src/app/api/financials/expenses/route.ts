import { NextRequest, NextResponse } from 'next/server';
import { getExpenses, recordExpense } from '@/lib/data/financials-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get('branch') ? parseInt(searchParams.get('branch')!, 10) : undefined;
    const expenses = getExpenses(branchCode);
    return NextResponse.json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { branch_code, category, amount, date, payment_method, vendor_name, recorded_by, receipt_ref, notes } = body;

    if (!branch_code || !category || !amount || !date || !payment_method || !vendor_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required expense fields.' },
        { status: 400 }
      );
    }

    const created = recordExpense({
      branch_code,
      category,
      amount: parseFloat(amount),
      date,
      payment_method,
      vendor_name,
      recorded_by: recorded_by || 'Staff Member',
      receipt_ref: receipt_ref || `REF-${Date.now()}`,
      notes,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
