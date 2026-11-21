import { NextRequest, NextResponse } from 'next/server';
import {
  getInvoices,
  getPayments,
  getAdvanceLedger,
  getDepositLedger,
  getFinancialOverview
} from '@/lib/data/financials-repo';
import { getResidents, getResidentById } from '@/lib/data/residents-repo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const residentId = searchParams.get('resident_id');

    if (reportType === 'daily_collections') {
      const payments = getPayments();
      // Group by payment_date
      const dailyMap: Record<string, { date: string; total: number; count: number }> = {};
      payments.forEach((p) => {
        if (!dailyMap[p.payment_date]) {
          dailyMap[p.payment_date] = { date: p.payment_date, total: 0, count: 0 };
        }
        dailyMap[p.payment_date].total += p.amount;
        dailyMap[p.payment_date].count += 1;
      });
      const rows = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date));
      return NextResponse.json({ success: true, report: 'daily_collections', data: rows });
    }

    if (reportType === 'branch_revenue') {
      const overview = getFinancialOverview();
      return NextResponse.json({
        success: true,
        report: 'branch_revenue',
        data: overview.branch_summaries,
      });
    }

    if (reportType === 'pending_dues') {
      const unpaidInvoices = getInvoices().filter((i) => i.balance_due > 0);
      return NextResponse.json({
        success: true,
        report: 'pending_dues',
        count: unpaidInvoices.length,
        total_dues: unpaidInvoices.reduce((acc, i) => acc + i.balance_due, 0),
        data: unpaidInvoices,
      });
    }

    if (reportType === 'advance_balances') {
      const residents = getResidents().filter((r) => r.advance_balance > 0);
      return NextResponse.json({
        success: true,
        report: 'advance_balances',
        total_advance_held: residents.reduce((acc, r) => acc + r.advance_balance, 0),
        data: residents.map((r) => ({
          resident_id: r.resident_id,
          full_name: r.full_name,
          branch_code: r.current_branch_code,
          room_number: r.current_room_number,
          advance_balance: r.advance_balance,
        })),
      });
    }

    if (reportType === 'deposit_liabilities') {
      const residents = getResidents().filter((r) => r.security_deposit > 0);
      return NextResponse.json({
        success: true,
        report: 'deposit_liabilities',
        total_deposit_held: residents.reduce((acc, r) => acc + r.security_deposit, 0),
        data: residents.map((r) => ({
          resident_id: r.resident_id,
          full_name: r.full_name,
          branch_code: r.current_branch_code,
          room_number: r.current_room_number,
          security_deposit: r.security_deposit,
        })),
      });
    }

    if (reportType === 'resident_statement') {
      if (!residentId) {
        return NextResponse.json(
          { success: false, error: 'Resident ID is required for account statement.' },
          { status: 400 }
        );
      }
      const resident = getResidentById(residentId);
      if (!resident) {
        return NextResponse.json({ success: false, error: 'Resident not found.' }, { status: 404 });
      }

      const invoices = getInvoices({ residentId: resident.id });
      const payments = getPayments({ residentId: resident.id });
      const advances = getAdvanceLedger(resident.id);
      const deposits = getDepositLedger(resident.id);

      const residentSummary = {
        id: resident.id,
        resident_id: resident.resident_id,
        full_name: resident.full_name,
        phone: resident.phone,
        mobile: resident.phone,
        email: resident.email || '',
        branch_code: resident.current_branch_code,
        current_branch_name: `Branch ${resident.current_branch_code}`,
        room_number: resident.current_room_number,
        current_room_number: resident.current_room_number,
        bed_number: resident.current_bed_number,
        current_bed_label: resident.current_bed_number,
        admission_date: resident.admission_date,
        monthly_rent: resident.agreed_monthly_rent,
        agreed_rent: resident.agreed_monthly_rent,
        outstanding_balance: resident.outstanding_balance,
        advance_balance: resident.advance_balance,
        security_deposit: resident.security_deposit,
      };

      return NextResponse.json({
        success: true,
        report: 'resident_statement',
        resident: residentSummary,
        statement: {
          resident: residentSummary,
          invoices,
          payments,
          advances,
          deposits,
        },
      });
    }

    // Default overview
    const overview = getFinancialOverview();
    return NextResponse.json({ success: true, report: 'overview', data: overview });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
