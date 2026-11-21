import { NextRequest, NextResponse } from 'next/server';
import { bulkImportResidents, BulkResidentInput } from '@/lib/data/residents-repo';
import { verifyStaffAuth } from '@/lib/auth/rbac';

export async function POST(request: NextRequest) {
  try {
    const staffCheck = verifyStaffAuth(request);
    // Allow if authenticated staff OR running in local dev / admin session
    if (!staffCheck.authenticated && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Staff session required to import residents.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const rows: BulkResidentInput[] = body.residents || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No resident rows provided for import.' },
        { status: 400 }
      );
    }

    const result = bulkImportResidents(rows);

    return NextResponse.json({
      success: result.imported > 0 || (result.imported === 0 && result.skipped === 0),
      imported: result.imported,
      skipped: result.skipped,
      errors: result.errors,
      data: result.residents,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
