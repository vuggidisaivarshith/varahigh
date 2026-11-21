import { NextRequest, NextResponse } from 'next/server';
import { getAllTransactions } from '@/lib/data/financials-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get('branch') ? parseInt(searchParams.get('branch')!, 10) : undefined;
    const type = searchParams.get('type') || undefined;
    const method = searchParams.get('method') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;
    const search = searchParams.get('search') || undefined;

    const transactions = getAllTransactions({
      branch_code: branchCode,
      transaction_type: type,
      payment_method: method,
      start_date: startDate,
      end_date: endDate,
      search: search,
    });

    return NextResponse.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
