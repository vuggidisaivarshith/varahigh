import { NextRequest, NextResponse } from 'next/server';
import { getInvoices } from '@/lib/data/financials-repo';
import { getResidentById } from '@/lib/data/residents-repo';
import { sendNotification } from '@/lib/data/notifications-repo';

export async function GET(request: NextRequest) {
  return handleCronReminders(request);
}

export async function POST(request: NextRequest) {
  return handleCronReminders(request);
}

async function handleCronReminders(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'devi_hostels_cron_internal_2026';
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized cron trigger. Valid Bearer token required.' }, { status: 401 });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const openInvoices = getInvoices().filter((i) => i.balance_due > 0 && i.status !== 'cancelled');
    const reminderLogs = [];

    for (const inv of openInvoices) {
      const resident = getResidentById(inv.resident_id);
      if (!resident) continue;

      const dueDate = new Date(inv.due_date);
      const diffMs = today.getTime() - dueDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)); // > 0 means overdue, < 0 means before due date

      let reminderSent = false;
      let reminderType = '';

      if (diffDays === -5) {
        // 5 Days before due date
        await sendNotification({
          resident_id: resident.id,
          template: 'payment_reminder',
          channels: ['whatsapp', 'email'],
          custom_data: {
            amount: inv.balance_due,
            due_date: inv.due_date,
            invoice_number: inv.invoice_number,
          },
        });
        reminderSent = true;
        reminderType = '5_DAYS_BEFORE';
      } else if (diffDays === -2) {
        // 2 Days before due date
        await sendNotification({
          resident_id: resident.id,
          template: 'payment_reminder',
          channel: 'whatsapp',
          custom_data: {
            amount: inv.balance_due,
            due_date: inv.due_date,
            invoice_number: inv.invoice_number,
          },
        });
        reminderSent = true;
        reminderType = '2_DAYS_BEFORE';
      } else if (diffDays === 0) {
        // On due date
        await sendNotification({
          resident_id: resident.id,
          template: 'payment_reminder',
          channels: ['whatsapp', 'sms'],
          custom_data: {
            amount: inv.balance_due,
            due_date: inv.due_date,
            invoice_number: inv.invoice_number,
          },
        });
        reminderSent = true;
        reminderType = 'ON_DUE_DATE';
      } else if (diffDays === 2) {
        // 2 Days past due
        await sendNotification({
          resident_id: resident.id,
          template: 'overdue_escalation',
          channel: 'whatsapp',
          custom_data: {
            amount: inv.balance_due,
            days_overdue: 2,
            invoice_number: inv.invoice_number,
          },
        });
        reminderSent = true;
        reminderType = 'OVERDUE_2_DAYS';
      } else if (diffDays === 7) {
        // 7 Days past due: escalate
        await sendNotification({
          resident_id: resident.id,
          template: 'overdue_escalation',
          channels: ['whatsapp', 'sms'],
          custom_data: {
            amount: inv.balance_due,
            days_overdue: 7,
            invoice_number: inv.invoice_number,
          },
        });
        reminderSent = true;
        reminderType = 'OVERDUE_7_DAYS_BRANCH_ESCALATION';
      } else if (diffDays >= 15 && diffDays % 5 === 0) {
        // 15+ Days past due: critical escalation to owner Marpina Pradeep
        await sendNotification({
          resident_id: resident.id,
          template: 'overdue_escalation',
          channels: ['whatsapp', 'sms', 'email'],
          custom_data: {
            amount: inv.balance_due,
            days_overdue: diffDays,
            invoice_number: inv.invoice_number,
          },
        });
        reminderSent = true;
        reminderType = `OVERDUE_${diffDays}_DAYS_OWNER_CRITICAL_ESCALATION`;
      }

      if (reminderSent) {
        reminderLogs.push({
          invoice_number: inv.invoice_number,
          devi_resident_id: resident.resident_id,
          resident_name: resident.full_name,
          diff_days: diffDays,
          reminder_type: reminderType,
        });
      }
    }

    return NextResponse.json({
      success: true,
      execution_timestamp: new Date().toISOString(),
      open_invoices_scanned: openInvoices.length,
      reminders_dispatched_count: reminderLogs.length,
      dispatched_reminders: reminderLogs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
