import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry, getEnquiries } from '@/lib/data/enquiries-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branch_id');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    let enquiries = await getEnquiries();

    if (branchId && branchId !== 'all') {
      enquiries = enquiries.filter((e) => e.preferred_branch_id === branchId);
    }

    if (status && status !== 'all') {
      enquiries = enquiries.filter((e) => e.status === status);
    }

    if (category && category !== 'all') {
      enquiries = enquiries.filter((e) => e.category === category);
    }

    if (search) {
      enquiries = enquiries.filter(
        (e) =>
          e.full_name.toLowerCase().includes(search) ||
          e.phone.includes(search) ||
          (e.email && e.email.toLowerCase().includes(search)) ||
          (e.student_college_name && e.student_college_name.toLowerCase().includes(search)) ||
          (e.employee_company && e.employee_company.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, count: enquiries.length, data: enquiries });
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

    // Required field validation
    if (!body.full_name || !body.phone || !body.category || !body.preferred_branch_id) {
      return NextResponse.json(
        { success: false, error: 'Full name, phone, customer category, and preferred branch are required.' },
        { status: 400 }
      );
    }

    if (!body.emergency_contact_name || !body.emergency_contact_phone) {
      return NextResponse.json(
        { success: false, error: 'Emergency contact name and phone number are required.' },
        { status: 400 }
      );
    }

    // Phone validation (10 digits)
    const cleanPhone = body.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile phone number.' },
        { status: 400 }
      );
    }

    const created = await createEnquiry({
      ...body,
      phone: cleanPhone,
      status: 'new',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your admission enquiry has been successfully recorded. DEVI Hostels management will contact you shortly.',
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
