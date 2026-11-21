import { NextRequest, NextResponse } from 'next/server';
import { getCashReconciliations, recordCashReconciliation } from '@/lib/data/financials-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get('branch') ? parseInt(searchParams.get('branch')!, 10) : undefined;
    const recons = getCashReconciliations(branchCode);
    return NextResponse.json({ success: true, count: recons.length, data: recons });
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
    const { branch_code, date, opening_cash, cash_collected, cash_expenses, closing_cash_actual, verified_by, remarks } = body;

    if (!branch_code || !date || opening_cash === undefined || cash_collected === undefined || cash_expenses === undefined || closing_cash_actual === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required cash reconciliation fields.' },
        { status: 400 }
      );
    }

    const created = recordCashReconciliation({
      branch_code,
      date,
      opening_cash: parseFloat(opening_cash),
      cash_collected: parseFloat(cash_collected),
      cash_expenses: parseFloat(cash_expenses),
      closing_cash_actual: parseFloat(closing_cash_actual),
      verified_by: verified_by || 'Staff Member',
      remarks,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
