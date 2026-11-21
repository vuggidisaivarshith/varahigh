import { NextRequest, NextResponse } from 'next/server';
import {
  getResidentById,
  getResidentStays,
  getResidentInvoices,
  getResidentPayments,
  getComplaints
} from '@/lib/data/residents-repo';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resident = getResidentById(id);

    if (!resident) {
      return NextResponse.json(
        { success: false, error: 'Resident not found.' },
        { status: 404 }
      );
    }

    const stays = getResidentStays(resident.id);
    const invoices = getResidentInvoices(resident.id);
    const payments = getResidentPayments(resident.id);
    const complaints = getComplaints(resident.id);

    return NextResponse.json({
      success: true,
      data: {
        resident,
        stays,
        invoices,
        payments,
        complaints,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
