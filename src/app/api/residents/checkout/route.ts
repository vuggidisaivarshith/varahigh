import { NextRequest, NextResponse } from 'next/server';
import { checkoutResident } from '@/lib/data/residents-repo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resident_id, settlement_notes } = body;

    if (!resident_id) {
      return NextResponse.json(
        { success: false, error: 'Resident ID is required for checkout.' },
        { status: 400 }
      );
    }

    const result = checkoutResident(resident_id, settlement_notes);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to checkout resident.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Checkout executed successfully. Bed released to vacant inventory.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
