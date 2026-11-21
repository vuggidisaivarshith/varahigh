import { NextRequest, NextResponse } from 'next/server';
import { getAdvanceLedger } from '@/lib/data/financials-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('resident_id');
    const ledger = getAdvanceLedger(residentId || undefined);
    return NextResponse.json({ success: true, count: ledger.length, data: ledger });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
