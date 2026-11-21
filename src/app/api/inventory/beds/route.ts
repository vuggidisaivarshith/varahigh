import { NextRequest, NextResponse } from 'next/server';
import { getBeds } from '@/lib/data/inventory-repo';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branchCode = searchParams.get('branch_code');
  const roomNumber = searchParams.get('room_number');

  const bNum = branchCode ? parseInt(branchCode, 10) : undefined;

  const beds = getBeds(bNum, roomNumber || undefined);
  return NextResponse.json({ success: true, count: beds.length, data: beds });
}
