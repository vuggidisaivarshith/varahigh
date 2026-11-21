import { NextRequest, NextResponse } from 'next/server';
import { updateComplaintStatus } from '@/lib/data/residents-repo';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, resolution_notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Complaint ID and new status are required.' },
        { status: 400 }
      );
    }

    const updated = updateComplaintStatus(id, status, resolution_notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Complaint not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint status updated.',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
