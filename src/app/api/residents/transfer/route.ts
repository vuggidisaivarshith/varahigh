import { NextRequest, NextResponse } from 'next/server';
import { transferResident } from '@/lib/data/residents-repo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resident_id, new_branch_code, new_floor_number, new_room_number, new_bed_id, reason } = body;

    if (!resident_id || !new_branch_code || !new_floor_number || !new_room_number || !new_bed_id) {
      return NextResponse.json(
        { success: false, error: 'Resident ID, new branch, new floor, new room, and new bed are required.' },
        { status: 400 }
      );
    }

    const result = transferResident(
      resident_id,
      new_branch_code,
      new_floor_number,
      new_room_number,
      new_bed_id,
      reason
    );

    if (!result.success || !result.resident) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to execute transfer.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Transfer successful! Resident ${result.resident.full_name} moved to Branch ${new_branch_code}, Room ${new_room_number}, Bed ${result.resident.current_bed_number}. Permanent Resident ID ${result.resident.resident_id} remains preserved.`,
      data: result.resident,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
