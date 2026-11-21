'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Building,
  User,
  Clock,
  FileText,
  LifeBuoy,
  Receipt,
  Sparkles,
  Lock
} from 'lucide-react';
import { Resident, ResidentInvoice, ResidentPayment } from '@/types/database';

export default function ResidentDashboardPage() {
  const [data, setData] = useState<{
    resident: Resident;
    invoices: ResidentInvoice[];
    payments: ResidentPayment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const match = document.cookie.match(/(?:devi|varahi)_resident_id=([^;]+)/);
        const residentId = match ? match[1] : null;

        if (!residentId) {
          setData(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/residents/${residentId}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-[#766D7C] text-xs font-mono">
        Loading resident dashboard & financial ledger...
      </div>
    );
  }

  if (!data?.resident) {
    return (
      <div className="card-editorial max-w-md mx-auto p-8 text-center space-y-4 bg-[#FFFFFF] border border-[#E9E1ED]">
        <div className="w-12 h-12 rounded-xl bg-[#F8F4FA] text-[#302343] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-[#C6A46A]" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-bold text-[#302343]">No Active Session Found</h2>
          <p className="text-xs text-[#766D7C]">
            Please sign in with your permanent Varahi Resident ID or registered mobile number.
          </p>
        </div>
        <Link
          href="/resident/login"
          className="btn-primary-navy inline-block text-xs py-2.5 px-6"
        >
          Sign In to Resident Portal
        </Link>
      </div>
    );
  }

  const { resident, invoices, payments } = data;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#302343] text-[#FFFFFF] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-[#45335C]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#C6A46A] bg-[#C6A46A]/20 px-2.5 py-0.5 rounded border border-[#C6A46A]/40">
              PERMANENT ID: {resident.resident_id}
            </span>
            <span className="text-xs text-[#E9E1ED]/80 font-mono">
              Admitted: {resident.admission_date}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFFFFF]">
            Welcome, {resident.full_name}
          </h1>
          <p className="text-xs text-[#E9E1ED]/80 max-w-xl">
            Allocated to <strong>Branch {resident.current_branch_code}</strong>, Floor {resident.current_floor_number}, Room <strong>{resident.current_room_number}</strong> (Bed {resident.current_bed_number}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/resident/invoices"
            className="btn-emerald-cta text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Rent Online (Instant UPI)</span>
          </Link>
          <Link
            href="/resident/receipts"
            className="btn-ghost-luxury text-[#302343] text-xs py-2.5 px-3 flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Receipts</span>
          </Link>
        </div>
      </div>

      {/* Financial Action Quick Hub */}
      <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9E1ED] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#79618E] animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#302343]">
              Resident Financial & Payment Ledger Hub
            </span>
          </div>
          <span className="text-[11px] text-[#766D7C]">
            Reconciled with Varahi Girls Hostel Accounts Desk
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            href="/resident/invoices"
            className="p-3 rounded-lg bg-[#F8F4FA] hover:bg-[#FFFFFF] border border-[#E9E1ED] transition-colors flex items-center gap-2 group"
          >
            <FileText className="w-4 h-4 text-[#C6A46A] group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-xs text-[#302343]">Invoices & Bills</p>
              <p className="text-[10px] text-[#766D7C] font-mono">View cycle dues</p>
            </div>
          </Link>

          <Link
            href="/resident/payments"
            className="p-3 rounded-lg bg-[#F8F4FA] hover:bg-[#FFFFFF] border border-[#E9E1ED] transition-colors flex items-center gap-2 group"
          >
            <CreditCard className="w-4 h-4 text-[#79618E] group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-xs text-[#302343]">Payment History</p>
              <p className="text-[10px] text-[#766D7C] font-mono">Online & cash logs</p>
            </div>
          </Link>

          <Link
            href="/resident/advance"
            className="p-3 rounded-lg bg-[#F8F4FA] hover:bg-[#FFFFFF] border border-[#E9E1ED] transition-colors flex items-center gap-2 group"
          >
            <Wallet className="w-4 h-4 text-[#302343] group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-xs text-[#302343]">Advance Rent</p>
              <p className="text-[10px] text-[#766D7C] font-mono">₹{resident.advance_balance} balance</p>
            </div>
          </Link>

          <Link
            href="/resident/deposits"
            className="p-3 rounded-lg bg-[#F8F4FA] hover:bg-[#FFFFFF] border border-[#E9E1ED] transition-colors flex items-center gap-2 group"
          >
            <ShieldCheck className="w-4 h-4 text-[#C6A46A] group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-bold text-xs text-[#302343]">Security Deposit</p>
              <p className="text-[10px] text-[#766D7C] font-mono">₹{resident.security_deposit} held</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mandatory Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Agreed Monthly Rent */}
        <div className="card-editorial p-6 space-y-2 bg-[#FFFFFF]">
          <div className="flex items-center justify-between text-[#766D7C]">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Monthly Rent</span>
            <Building className="w-4 h-4 text-[#C6A46A]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#302343]">
            ₹{resident.agreed_monthly_rent.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#766D7C]">
            Due every month on the <strong className="text-[#302343]">{resident.billing_anchor_day}th</strong>
          </p>
        </div>

        {/* Card 2: Outstanding Balance */}
        <div className="card-editorial p-6 space-y-2 bg-[#FFFFFF]">
          <div className="flex items-center justify-between text-[#766D7C]">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Outstanding Dues</span>
            <AlertCircle className={`w-4 h-4 ${resident.outstanding_balance > 0 ? 'text-[#9B1C1C]' : 'text-[#79618E]'}`} />
          </div>
          <p className={`text-3xl font-serif font-bold ${resident.outstanding_balance > 0 ? 'text-[#9B1C1C]' : 'text-[#79618E]'}`}>
            ₹{resident.outstanding_balance.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#766D7C]">
            Next Due: <strong className="text-[#302343]">{resident.next_payment_due_date}</strong>
          </p>
        </div>

        {/* Card 3: Advance Balance */}
        <div className="card-editorial p-6 space-y-2 bg-[#FFFFFF]">
          <div className="flex items-center justify-between text-[#766D7C]">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Advance Balance</span>
            <Wallet className="w-4 h-4 text-[#302343]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#302343]">
            ₹{resident.advance_balance.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#766D7C]">
            Automatically credited against future rent bills
          </p>
        </div>

        {/* Card 4: Security Deposit Held */}
        <div className="card-editorial p-6 space-y-2 bg-[#FFFFFF]">
          <div className="flex items-center justify-between text-[#766D7C]">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Security Deposit</span>
            <ShieldCheck className="w-4 h-4 text-[#79618E]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#302343]">
            ₹{resident.security_deposit.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#79618E] font-semibold">
            100% Refundable upon checkout notice
          </p>
        </div>
      </div>

      {/* Two Column Section: Recent Invoices & Recent Payment Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="card-editorial p-6 space-y-4 bg-[#FFFFFF]">
          <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#302343] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C6A46A]" />
              Recent Rent Invoices
            </h3>
            <Link href="/resident/invoices" className="text-xs font-bold text-[#302343] hover:underline flex items-center gap-1 font-mono">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {invoices.length === 0 ? (
              <p className="text-xs text-[#766D7C] py-6 text-center">No invoices generated yet.</p>
            ) : (
              invoices.slice(0, 3).map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-lg border border-[#E9E1ED] bg-[#F8F4FA]/50 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-[#302343] font-mono">{inv.invoice_number}</p>
                    <p className="text-[11px] text-[#766D7C]">
                      Period: {inv.billing_period_start} to {inv.billing_period_end}
                    </p>
                    <p className="text-[11px] text-[#766D7C]">Due Date: {inv.due_date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-mono font-bold text-[#302343] text-sm">
                      ₹{inv.total_payable.toLocaleString()}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      inv.status === 'paid'
                        ? 'bg-[#EBF2F0] text-[#1D4038]'
                        : 'bg-[#FDF2F2] text-[#9B1C1C]'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payment Receipts */}
        <div className="card-editorial p-6 space-y-4 bg-[#FFFFFF]">
          <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
            <h3 className="font-serif text-lg font-bold text-[#302343] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#79618E]" />
              Verified Payment Receipts
            </h3>
            <Link href="/resident/payments" className="text-xs font-bold text-[#302343] hover:underline flex items-center gap-1 font-mono">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {payments.length === 0 ? (
              <p className="text-xs text-[#766D7C] py-6 text-center">No payment records yet.</p>
            ) : (
              payments.slice(0, 3).map((pay) => (
                <div
                  key={pay.id}
                  className="p-4 rounded-lg border border-[#E9E1ED] bg-[#F8F4FA]/50 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-[#302343] font-mono">{pay.receipt_number}</p>
                    <p className="text-[11px] text-[#766D7C]">Date: {pay.payment_date}</p>
                    <p className="text-[10px] font-mono text-[#766D7C]">{pay.transaction_reference}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-mono font-bold text-[#79618E] text-sm">
                      ₹{pay.amount.toLocaleString()}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#EBF2F0] text-[#1D4038] text-[10px] font-bold">
                      Verified
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
