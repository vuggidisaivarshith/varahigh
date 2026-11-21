import { NextRequest, NextResponse } from 'next/server';
import { getDepositLedger, recordDepositTransaction } from '@/lib/data/financials-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('resident_id');
    const ledger = getDepositLedger(residentId || undefined);
    return NextResponse.json({ success: true, count: ledger.length, data: ledger });
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
    const { resident_id, type, amount, remarks } = body;

    if (!resident_id || !type || !amount || !remarks) {
      return NextResponse.json(
        { success: false, error: 'Resident ID, type, amount, and remarks are required.' },
        { status: 400 }
      );
    }

    const result = recordDepositTransaction(
      resident_id,
      type,
      parseFloat(amount),
      remarks
    );

    if (!result.success || !result.entry) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to process deposit transaction.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Security deposit ${type.replace('_', ' ')} of ₹${result.entry.amount.toLocaleString()} recorded.`,
        data: result.entry,
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
