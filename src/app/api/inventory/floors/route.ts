import { NextRequest, NextResponse } from 'next/server';
import { getFloors } from '@/lib/data/inventory-repo';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branchCode = searchParams.get('branch_code');
  const codeNum = branchCode ? parseInt(branchCode, 10) : undefined;

  const floors = getFloors(codeNum);
  return NextResponse.json({ success: true, count: floors.length, data: floors });
}
