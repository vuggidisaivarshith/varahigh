import { NextRequest, NextResponse } from 'next/server';
import { getRooms } from '@/lib/data/inventory-repo';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branchCode = searchParams.get('branch_code');
  const floorNumber = searchParams.get('floor_number');

  const bNum = branchCode ? parseInt(branchCode, 10) : undefined;
  const fNum = floorNumber ? parseInt(floorNumber, 10) : undefined;

  const rooms = getRooms(bNum, fNum);
  return NextResponse.json({ success: true, count: rooms.length, data: rooms });
}
