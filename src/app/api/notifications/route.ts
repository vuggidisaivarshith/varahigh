import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, sendNotification, NotificationTemplate, NotificationChannel } from '@/lib/data/notifications-repo';
import { getResidents } from '@/lib/data/residents-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const residentId = searchParams.get('resident_id');
    const channel = searchParams.get('channel') as NotificationChannel | null;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    const list = getNotifications({
      residentId: residentId || undefined,
      channel: channel || undefined,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
    });
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
    const { resident_id, template, channel, channels, custom_data, broadcast, branch_code } = body;

    // Handle branch broadcast announcement
    if (broadcast) {
      let targets = getResidents().filter((r) => r.status === 'active');
      if (branch_code) {
        targets = targets.filter((r) => r.current_branch_code === parseInt(branch_code, 10));
      }

      const allDispatched = [];
      for (const resident of targets) {
        const res = await sendNotification({
          resident_id: resident.id,
          template: 'broadcast_announcement',
          channel: channel || 'whatsapp',
          custom_data: {
            custom_message: custom_data?.custom_message || 'Notice from DEVI Hostels Management.',
          },
        });
        if (res.success) {
          allDispatched.push(...res.records);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Broadcast message sent to ${targets.length} residents across specified branches.`,
        dispatched_count: allDispatched.length,
        records: allDispatched,
      });
    }

    if (!resident_id || !template) {
      return NextResponse.json(
        { success: false, error: 'Resident ID and Notification Template are required.' },
        { status: 400 }
      );
    }

    const result = await sendNotification({
      resident_id,
      template: template as NotificationTemplate,
      channel: channel as NotificationChannel,
      channels,
      custom_data,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Dispatched ${result.records.length} notification(s) successfully.`,
      records: result.records,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
