import { NextResponse } from 'next/server';
import { getResidents } from '@/lib/data/residents-repo';
import { getBeds } from '@/lib/data/inventory-repo';
import { getFinancialOverview } from '@/lib/data/financials-repo';
import { DEVI_BRANCHES } from '@/lib/data/branches';

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

  return NextResponse.json({
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    business_name: 'DEVI HOSTELS',
    proprietor: 'MARPINA PRADEEP',
    headquarters: 'Shamshabad, Hyderabad, Telangana, India',
    timestamp: new Date().toISOString(),
    response_time_ms: Date.now() - startTime,
    uptime_seconds: uptimeSeconds,
    memory_mb: memoryUsage ? Math.round(memoryUsage.rss / 1024 / 1024) : null,
    system_metrics: {
      branches_count: DEVI_BRANCHES.length,
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
      database: 'PostgreSQL / Supabase Ready',
      payments: 'Razorpay / Cashfree PCI-DSS Compliant',
      notifications: 'WhatsApp Cloud API / Resend / SMS Enabled',
    },
  });
}
