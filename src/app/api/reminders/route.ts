import { NextRequest, NextResponse } from 'next/server';
import { getReminders, createReminder, toggleReminder } from '@/lib/data/financials-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchCode = searchParams.get('branch') ? parseInt(searchParams.get('branch')!, 10) : undefined;
    const reminders = getReminders(branchCode);
    return NextResponse.json({ success: true, count: reminders.length, data: reminders });
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
    const { branch_code, title, category, due_date, priority, assigned_to } = body;

    if (!branch_code || !title || !category || !due_date || !priority) {
      return NextResponse.json(
        { success: false, error: 'Missing required reminder fields.' },
        { status: 400 }
      );
    }

    const created = createReminder({
      branch_code,
      title,
      category,
      due_date,
      priority,
      status: 'pending',
      assigned_to: assigned_to || 'Warden On Duty',
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Reminder ID is required.' }, { status: 400 });
    }

    const ok = toggleReminder(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Reminder not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Reminder status updated.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
