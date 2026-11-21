import { NextRequest, NextResponse } from 'next/server';
import { getResidents } from '@/lib/data/residents-repo';
import {
  generateResidentInvoice,
  getInvoices,
  calculateNextBillingPeriod
} from '@/lib/data/financials-repo';
import { sendNotification } from '@/lib/data/notifications-repo';

export async function GET(request: NextRequest) {
  return handleCronBilling(request);
}

export async function POST(request: NextRequest) {
  return handleCronBilling(request);
}

async function handleCronBilling(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'devi_hostels_cron_internal_2026';
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized cron trigger. Valid Bearer token required.' }, { status: 401 });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    const activeResidents = getResidents().filter((r) => r.status === 'active');
    const existingInvoices = getInvoices();

    const generatedInvoices = [];
    const skippedResidents = [];

    for (const resident of activeResidents) {
      // Find invoices for this resident
      const resInvoices = existingInvoices.filter((i) => i.resident_id === resident.id);
      const nextPeriod = calculateNextBillingPeriod(resident.admission_date, resInvoices.length);

      // Check if invoice for this period already exists
      const alreadyExists = resInvoices.some((i) => i.billing_period_start === nextPeriod.start);
      if (alreadyExists) {
        skippedResidents.push({
          resident_id: resident.resident_id,
          reason: `Invoice for cycle starting ${nextPeriod.start} already created.`,
        });
        continue;
      }

      // Check if we are within the advance generation window (within 5 days before next cycle start)
      const startDate = new Date(nextPeriod.start);
      const diffMs = startDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // Generate invoice if today is <= 5 days before cycle start
      if (diffDays <= 5) {
        const genResult = generateResidentInvoice(resident.id, {
          additional_charges: 0,
          notes: `Automated recurring cycle starting ${nextPeriod.start}`,
        });

        if (genResult.success && genResult.invoice) {
          generatedInvoices.push(genResult.invoice);

          // Dispatch notification to resident
          await sendNotification({
            resident_id: resident.id,
            template: 'invoice_generated',
            channels: ['whatsapp', 'email'],
            custom_data: {
              invoice_number: genResult.invoice.invoice_number,
              amount: genResult.invoice.balance_due,
              period_start: genResult.invoice.billing_period_start,
              period_end: genResult.invoice.billing_period_end,
              due_date: genResult.invoice.due_date,
            },
          });
        }
      } else {
        skippedResidents.push({
          resident_id: resident.resident_id,
          reason: `Next cycle starts on ${nextPeriod.start} (${diffDays} days away, window is 5 days).`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      execution_timestamp: new Date().toISOString(),
      active_residents_count: activeResidents.length,
      invoices_generated_count: generatedInvoices.length,
      generated_invoices: generatedInvoices,
      skipped_residents: skippedResidents,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
