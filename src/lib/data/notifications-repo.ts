import { NotificationRecord, NotificationChannel, NotificationTemplate } from '@/types/database';
import { getResidentById } from './residents-repo';
import { VERIFIED_CONTACTS } from './branches';

export type { NotificationRecord, NotificationChannel, NotificationTemplate };

// In-memory central notification store
let notificationsStore: NotificationRecord[] = [
  {
    id: 'notif-001',
    resident_id: 'res-001',
    devi_resident_id: 'VG1-1-00001',
    channel: 'whatsapp',
    template: 'admission_welcome',
    title: 'Welcome to VARAHI GIRLS HOSTEL',
    body: 'Dear K. Ananya Reddy, Welcome to VARAHI GIRLS HOSTEL! Your permanent Resident ID is VG1-1-00001. Branch: Varahi Girls Hostel — Branch 1. Room: 102 (Bed 102-A). Proprietor: E. Bharath Chandra (+91 93919 44082).',
    status: 'delivered',
    sent_at: '2026-11-01T10:05:00Z',
    delivered_at: '2026-11-01T10:05:15Z',
    recipient_target: '+91 98491 11222',
  },
  {
    id: 'notif-002',
    resident_id: 'res-001',
    devi_resident_id: 'VG1-1-00001',
    channel: 'email',
    template: 'invoice_generated',
    title: 'Rent Invoice Generated: INV-2026-001',
    body: 'Your monthly rent invoice INV-2026-001 of ₹7,500 has been generated for November 2026.',
    status: 'delivered',
    sent_at: '2026-11-01T10:06:00Z',
    delivered_at: '2026-11-01T10:06:05Z',
    recipient_target: 'ananya.reddy@gmail.com',
  },
  {
    id: 'notif-003',
    resident_id: 'res-002',
    devi_resident_id: 'VG1-2-00002',
    channel: 'whatsapp',
    template: 'admission_welcome',
    title: 'Welcome to VARAHI GIRLS HOSTEL',
    body: 'Dear Pooja Hegde, Welcome to VARAHI GIRLS HOSTEL! Your permanent Resident ID is VG1-2-00002. Room: 201 (Bed 201-A). Proprietor: E. Bharath Chandra (+91 93919 44082).',
    status: 'delivered',
    sent_at: '2026-11-10T12:05:00Z',
    delivered_at: '2026-11-10T12:05:10Z',
    recipient_target: '+91 97012 34567',
  },
];

export function renderNotificationContent(
  template: NotificationTemplate,
  data: {
    resident_name: string;
    devi_resident_id: string;
    amount?: number;
    invoice_number?: string;
    receipt_number?: string;
    due_date?: string;
    room_number?: string;
    bed_number?: string;
    branch_name?: string;
    period_start?: string;
    period_end?: string;
    days_overdue?: number;
    custom_message?: string;
  }
): { title: string; body: string } {
  switch (template) {
    case 'admission_welcome':
      return {
        title: 'Welcome to VARAHI GIRLS HOSTEL!',
        body: `Dear ${data.resident_name},\n\nWelcome to VARAHI GIRLS HOSTEL! Your permanent Resident ID is ${data.devi_resident_id}.\nBranch: ${data.branch_name || 'Varahi Girls Hostel'}\nRoom: ${data.room_number || ''} (Bed ${data.bed_number || ''})\n\nLog in to your 24/7 self-service resident portal: /resident/login\n\nProprietor: E. Bharath Chandra (+91 93919 44082), Shamshabad.`,
      };

    case 'invoice_generated':
      return {
        title: `Rent Invoice Generated: ${data.invoice_number}`,
        body: `Dear ${data.resident_name},\n\nYour monthly rent invoice ${data.invoice_number} has been generated for period ${data.period_start} to ${data.period_end}.\nAmount Due: ₹${data.amount?.toLocaleString()}\nDue Date: ${data.due_date}\n\nPay online instantly via UPI / Cards: /resident/invoices`,
      };

    case 'payment_reminder':
      return {
        title: `Payment Reminder: Rent Due for ${data.devi_resident_id}`,
        body: `Dear ${data.resident_name},\n\nThis is a gentle reminder that your monthly hostel rent of ₹${data.amount?.toLocaleString()} is due on ${data.due_date}.\n\nPay online conveniently via Instant UPI: /resident/invoices`,
      };

    case 'payment_receipt':
      return {
        title: `Payment Receipt: ${data.receipt_number}`,
        body: `Dear ${data.resident_name},\n\nPayment Received! ₹${data.amount?.toLocaleString()} has been credited to your account.\nReceipt Number: ${data.receipt_number}\nInvoice Settled: ${data.invoice_number || 'Rent Due'}\n\nDownload digital receipt: /resident/receipts`,
      };

    case 'overdue_escalation':
      return {
        title: `URGENT: Overdue Rent Alert (${data.days_overdue || 0} Days Past Due)`,
        body: `URGENT NOTICE for ${data.resident_name} (${data.devi_resident_id}):\nYour hostel rent of ₹${data.amount?.toLocaleString()} is overdue by ${data.days_overdue || 0} days. Please clear your balance immediately to avoid late fee penalties or management escalation.\n\nHelpline: +91 93919 44082 (Proprietor: E. Bharath Chandra).`,
      };

    case 'transfer_confirmed':
      return {
        title: 'Room Transfer Confirmed',
        body: `Dear ${data.resident_name},\n\nYour transfer has been approved and completed. New Location: ${data.branch_name}, Room ${data.room_number}, Bed ${data.bed_number}.\nYour permanent Resident ID remains unchanged: ${data.devi_resident_id}.`,
      };

    case 'checkout_settlement':
      return {
        title: 'Checkout & Deposit Refund Settlement',
        body: `Dear ${data.resident_name},\n\nYour checkout inspection has been completed. Refundable deposit settlement of ₹${data.amount?.toLocaleString()} has been processed to your bank account. Thank you for staying at VARAHI GIRLS HOSTEL!`,
      };

    case 'complaint_update':
      return {
        title: 'Hostel Maintenance Update',
        body: `Dear ${data.resident_name},\n\nUpdate regarding your maintenance request: ${data.custom_message || 'Ticket is being resolved by resident lady warden.'}`,
      };

    case 'broadcast_announcement':
      return {
        title: 'Important VARAHI GIRLS HOSTEL Announcement',
        body: `VARAHI GIRLS HOSTEL Notice to all Residents:\n\n${data.custom_message || 'Scheduled maintenance alert.'}`,
      };

    default:
      return {
        title: 'VARAHI GIRLS HOSTEL Notification',
        body: data.custom_message || 'You have a new update from VARAHI GIRLS HOSTEL.',
      };
  }
}

// Dispatch a Notification (WhatsApp, Email, SMS)
export async function sendNotification(input: {
  resident_id: string;
  template: NotificationTemplate;
  channels?: NotificationChannel[];
  channel?: NotificationChannel;
  custom_data?: {
    amount?: number;
    invoice_number?: string;
    receipt_number?: string;
    due_date?: string;
    period_start?: string;
    period_end?: string;
    days_overdue?: number;
    custom_message?: string;
  };
}): Promise<{ success: boolean; records: NotificationRecord[]; error?: string }> {
  const resident = getResidentById(input.resident_id);
  if (!resident) {
    return { success: false, records: [], error: 'Resident not found for notification dispatch.' };
  }

  const { title, body } = renderNotificationContent(input.template, {
    resident_name: resident.full_name,
    devi_resident_id: resident.resident_id,
    amount: input.custom_data?.amount,
    invoice_number: input.custom_data?.invoice_number,
    receipt_number: input.custom_data?.receipt_number,
    due_date: input.custom_data?.due_date,
    period_start: input.custom_data?.period_start,
    period_end: input.custom_data?.period_end,
    days_overdue: input.custom_data?.days_overdue,
    room_number: resident.current_room_number,
    bed_number: resident.current_bed_number,
    branch_name: 'Varahi Girls Hostel — Branch 1',
    custom_message: input.custom_data?.custom_message,
  });

  const now = new Date().toISOString();
  const createdRecords: NotificationRecord[] = [];
  const channelsToDispatch: NotificationChannel[] =
    input.channels && input.channels.length > 0
      ? input.channels
      : input.channel
      ? [input.channel]
      : ['whatsapp'];

  for (const channel of channelsToDispatch) {
    let target = '';
    if (channel === 'whatsapp' || channel === 'sms') {
      target = `+91 ${resident.phone}`;
    } else if (channel === 'email') {
      target = resident.email || `${resident.resident_id.toLowerCase()}@varahigirlshostel.com`;
    }

    const record: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      resident_id: resident.id,
      devi_resident_id: resident.resident_id,
      channel,
      template: input.template,
      title,
      body,
      status: 'delivered', // simulated delivery in pre-launch
      sent_at: now,
      delivered_at: now,
      recipient_target: target,
    };

    notificationsStore.unshift(record);
    createdRecords.push(record);
  }

  return { success: true, records: createdRecords };
}

// Query Notifications Log
export function getNotifications(filter?: {
  residentId?: string;
  channel?: NotificationChannel;
  limit?: number;
}): NotificationRecord[] {
  let list = [...notificationsStore];

  if (filter?.residentId) {
    const filterId = filter.residentId;
    list = list.filter((n) => n.resident_id === filterId || (n.devi_resident_id && n.devi_resident_id.toUpperCase() === filterId.toUpperCase()));
  }

  if (filter?.channel) {
    list = list.filter((n) => n.channel === filter.channel);
  }

  if (filter?.limit) {
    list = list.slice(0, filter.limit);
  }

  return list;
}
