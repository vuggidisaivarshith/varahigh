import { NextResponse } from 'next/server';
import { DEVI_BRANCHES } from '@/lib/data/branches';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: DEVI_BRANCHES.length,
    data: DEVI_BRANCHES,
  });
}
