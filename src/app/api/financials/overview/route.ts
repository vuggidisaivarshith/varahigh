import { NextResponse } from 'next/server';
import { getFinancialOverview } from '@/lib/data/financials-repo';

export async function GET() {
  try {
    const summary = getFinancialOverview();
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
