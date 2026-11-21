import { NextResponse } from 'next/server';
import { getResidents } from '@/lib/data/residents-repo';
import { getBeds } from '@/lib/data/inventory-repo';
import { getFinancialOverview } from '@/lib/data/financials-repo';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { canExecuteLiveIntegration } from '@/lib/integrations/config';

export async function GET() {
  const startTime = Date.now();
  const residents = getResidents();
  const beds = getBeds();
  const financials = getFinancialOverview();

  const occupiedBeds = beds.filter((b) => b.status === 'occupied').length;
  const vacantBeds = beds.filter((b) => b.status === 'vacant').length;
  const totalBeds = beds.length;

  const uptimeSeconds = process.uptime ? Math.round(process.uptime()) : 0;
  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;

  const dbConfigured = isSupabaseConfigured();
  const paymentsLive = canExecuteLiveIntegration('payments');
  const razorpayKeyConfigured = Boolean(process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('placeholder'));

  return NextResponse.json({
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    business_name: VERIFIED_CONTACTS.business_name,
    proprietor: VERIFIED_CONTACTS.owner_proprietor,
    contact_phone: VERIFIED_CONTACTS.primary_phone,
    headquarters: 'Shamshabad, Hyderabad, Telangana, India',
    timestamp: new Date().toISOString(),
    response_time_ms: Date.now() - startTime,
    uptime_seconds: uptimeSeconds,
    memory_mb: memoryUsage ? Math.round(memoryUsage.rss / 1024 / 1024) : null,
    system_metrics: {
      branches_count: VARAHI_BRANCHES.length,
      active_residents: residents.filter((r) => r.status === 'active').length,
      total_residents_historical: residents.length,
      total_beds: totalBeds,
      occupied_beds: occupiedBeds,
      vacant_beds: vacantBeds,
      occupancy_rate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
    },
    financial_health: {
      gross_invoiced: financials.total_invoiced,
      total_collected: financials.total_collected,
      outstanding_dues: financials.total_outstanding_dues,
      collection_efficiency:
        financials.total_invoiced > 0
          ? Math.round((financials.total_collected / financials.total_invoiced) * 100)
          : 0,
    },
    integrations: {
      database: {
        engine: 'PostgreSQL / Supabase',
        configured: dbConfigured,
        status: dbConfigured ? 'connected' : 'ready_for_credentials',
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured',
      },
      payments: {
        gateway: 'Razorpay',
        configured: razorpayKeyConfigured,
        live_enabled: paymentsLive,
        key_id: process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.slice(0, 8)}...` : 'Not configured',
        status: razorpayKeyConfigured ? 'active_ready' : 'needs_keys',
      },
      notifications: 'WhatsApp Cloud API / Resend / SMS Enabled',
    },
  });
}
