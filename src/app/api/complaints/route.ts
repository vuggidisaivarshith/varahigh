import { NextRequest, NextResponse } from 'next/server';
import { getComplaints, createComplaint, getResidentById } from '@/lib/data/residents-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('resident_id');

    const complaints = getComplaints(residentId || undefined);
    return NextResponse.json({ success: true, count: complaints.length, data: complaints });
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
    const { resident_id, category, title, description } = body;

    if (!resident_id || !category || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'Resident ID, category, title, and description are required.' },
        { status: 400 }
      );
    }

    const resident = getResidentById(resident_id);
    if (!resident) {
      return NextResponse.json({ success: false, error: 'Resident not found.' }, { status: 404 });
    }

    const created = createComplaint({
      resident_id: resident.id,
      devi_resident_id: resident.resident_id,
      resident_name: resident.full_name,
      branch_code: resident.current_branch_code,
      room_number: resident.current_room_number,
      category,
      title,
      description,
      status: 'open',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Complaint ticket created. Warden and maintenance staff notified.',
        data: created,
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
