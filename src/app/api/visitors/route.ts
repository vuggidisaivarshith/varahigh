import { NextRequest, NextResponse } from 'next/server';
import { getVisitors, recordVisitor, checkoutVisitor } from '@/lib/data/financials-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get('branch') ? parseInt(searchParams.get('branch')!, 10) : undefined;
    const visitors = getVisitors(branchCode);
    return NextResponse.json({ success: true, count: visitors.length, data: visitors });
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
    const { resident_id, devi_resident_id, resident_name, branch_code, visitor_name, visitor_phone, relation, visit_date, in_time, purpose } = body;

    if (!resident_id || !visitor_name || !visitor_phone || !relation || !visit_date || !in_time) {
      return NextResponse.json(
        { success: false, error: 'Missing required visitor gate pass fields.' },
        { status: 400 }
      );
    }

    const created = recordVisitor({
      resident_id,
      devi_resident_id: devi_resident_id || 'DV-RESIDENT',
      resident_name: resident_name || 'Resident',
      branch_code: branch_code || 1,
      visitor_name,
      visitor_phone,
      relation,
      visit_date,
      in_time,
      purpose: purpose || 'Personal Visit',
      status: 'checked_in',
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitor_id, out_time } = body;

    if (!visitor_id || !out_time) {
      return NextResponse.json(
        { success: false, error: 'Visitor ID and out time are required.' },
        { status: 400 }
      );
    }

    const ok = checkoutVisitor(visitor_id, out_time);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Visitor record not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Visitor checked out successfully.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
