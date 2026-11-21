'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FinancialOverviewSummary
} from '@/lib/data/financials-repo';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  ShieldCheck,
  Building2,
  FileText,
  AlertCircle,
  Plus,
  RefreshCw,
  ArrowRight,
  PieChart,
  UserCheck
} from 'lucide-react';

export default function AdminFinancesPage() {
  const [overview, setOverview] = useState<FinancialOverviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/financials/overview');
      const json = await res.json();
      if (json.success) setOverview(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F8F4FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-6">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            ACCOUNTING & FINANCIAL CONTROL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-2">
            Central Financial Dashboard
          </h1>
          <p className="text-xs text-[#766D7C] mt-1">
            Proprietor: <strong className="text-[#302343]">MARPINA PRADEEP</strong> • Shamshabad 5-Branch Centralized Financial Ledger
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchOverview}
            className="btn-ghost-luxury text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#C6A46A]' : ''}`} />
            Refresh
          </button>
          <Link
            href="/admin/finances/payments"
            className="btn-emerald-cta text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Record Offline Payment
          </Link>
          <Link
            href="/admin/finances/invoices"
            className="btn-champagne-gold text-xs flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Generate Invoices
          </Link>
        </div>
      </div>

      {/* Top Financial Metric Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card-editorial p-5 space-y-2 bg-white border border-[#E9E1ED]">
            <span className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Gross Invoiced</span>
            <p className="font-serif text-2xl font-bold text-[#302343]">
              ₹{overview.total_invoiced.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#766D7C]">Across all active cycles</p>
          </div>

          <div className="card-editorial p-5 space-y-2 bg-white border border-[#E9E1ED]">
            <span className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Total Collected</span>
            <p className="font-serif text-2xl font-bold text-[#79618E]">
              ₹{overview.total_collected.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#79618E] font-medium font-mono">Bank-reconciled receipts</p>
          </div>

          <div className="card-editorial p-5 space-y-2 bg-white border border-[#E9E1ED]">
            <span className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Outstanding Dues</span>
            <p className="font-serif text-2xl font-bold text-rose-600">
              ₹{overview.total_outstanding_dues.toLocaleString()}
            </p>
            <p className="text-[10px] text-rose-500 font-medium font-mono">Pending resident settlement</p>
          </div>

          <div className="card-editorial p-5 space-y-2 bg-white border border-[#E9E1ED]">
            <span className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Advance Rent Held</span>
            <p className="font-serif text-2xl font-bold text-blue-700">
              ₹{overview.total_advance_held.toLocaleString()}
            </p>
            <p className="text-[10px] text-blue-600 font-medium font-mono">Credits toward next cycles</p>
          </div>

          <div className="card-editorial p-5 space-y-2 bg-white border border-[#E9E1ED]">
            <span className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Security Deposits</span>
            <p className="font-serif text-2xl font-bold text-[#C6A46A]">
              ₹{overview.total_security_deposits.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#C6A46A] font-medium font-mono">Refundable deposit liability</p>
          </div>
        </div>
      )}

      {/* Payment Method Breakdown */}
      {overview && (
        <div className="card-editorial p-6 sm:p-8 space-y-6 bg-white border border-[#E9E1ED]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9E1ED] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#302343] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C6A46A]" />
                Collection Breakdown by Payment Instrument
              </h3>
              <p className="text-xs text-[#766D7C] mt-0.5">
                Clearly distinguishing verified online gateway, offline direct UPI, cash, and bank transfers.
              </p>
            </div>
            <Link href="/admin/finances/transactions" className="text-xs font-mono font-bold text-[#302343] hover:text-[#C6A46A]">
              View All Transactions →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#766D7C]">Online Gateway (UPI & Cards)</span>
              <p className="font-serif text-xl font-bold text-[#302343]">
                ₹{overview.collections_by_method.online_upi.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#79618E] font-mono">Auto-captured via Razorpay/Cashfree</p>
            </div>

            <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#766D7C]">Direct QR / UPI Transfers</span>
              <p className="font-serif text-xl font-bold text-[#302343]">
                ₹{overview.collections_by_method.direct_upi.toLocaleString()}
              </p>
              <p className="text-[10px] text-blue-700 font-mono">Bank-statement verified entries</p>
            </div>

            <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#766D7C]">Cash Collections</span>
              <p className="font-serif text-xl font-bold text-[#302343]">
                ₹{overview.collections_by_method.cash.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#C6A46A] font-mono">Physical receipts with accountant ID</p>
            </div>

            <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#766D7C]">Direct Bank Transfers (NEFT/IMPS)</span>
              <p className="font-serif text-xl font-bold text-[#302343]">
                ₹{overview.collections_by_method.bank_transfer.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#766D7C] font-mono">Direct corporate / parental credits</p>
            </div>
          </div>
        </div>
      )}

      {/* Branch Financial Summaries */}
      {overview && (
        <div className="card-editorial p-6 sm:p-8 space-y-6 bg-white border border-[#E9E1ED]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9E1ED] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#302343] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C6A46A]" />
                Branch-Wise Revenue & Dues Comparison
              </h3>
              <p className="text-xs text-[#766D7C] mt-0.5">
                Centralized accounting across all 5 Shamshabad branches.
              </p>
            </div>
            <Link href="/admin/finances/reports" className="text-xs font-mono font-bold text-[#302343] hover:text-[#C6A46A]">
              Full Financial Reports →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {overview.branch_summaries.map((b) => (
              <div
                key={b.branch_code}
                className="bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#302343] border border-[#E9E1ED]">
                    BRANCH {b.branch_code}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${b.outstanding > 0 ? 'text-rose-600' : 'text-[#79618E]'}`}>
                    {b.outstanding > 0 ? `Dues: ₹${b.outstanding.toLocaleString()}` : 'No Dues'}
                  </span>
                </div>

                <h4 className="font-serif text-xs font-bold text-[#302343] truncate">{b.branch_name}</h4>

                <div className="text-[11px] space-y-1 text-[#766D7C] border-t border-[#E9E1ED] pt-2 font-mono">
                  <p>Invoiced: <strong className="text-[#302343]">₹{b.invoiced.toLocaleString()}</strong></p>
                  <p>Collected: <strong className="text-[#79618E]">₹{b.collected.toLocaleString()}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-module Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/finances/invoices"
          className="card-editorial p-5 bg-white border border-[#E9E1ED] hover:border-[#C6A46A] transition-all flex items-center justify-between group"
        >
          <div>
            <p className="font-serif text-xs font-bold text-[#302343] group-hover:text-[#C6A46A]">Invoice Manager</p>
            <p className="text-[11px] text-[#766D7C]">Recurring joining-date bills</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#766D7C] group-hover:text-[#C6A46A]" />
        </Link>

        <Link
          href="/admin/finances/payments"
          className="card-editorial p-5 bg-white border border-[#E9E1ED] hover:border-[#C6A46A] transition-all flex items-center justify-between group"
        >
          <div>
            <p className="font-serif text-xs font-bold text-[#302343] group-hover:text-[#C6A46A]">Payment Collection</p>
            <p className="text-[11px] text-[#766D7C]">Cash & Direct UPI entries</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#766D7C] group-hover:text-[#C6A46A]" />
        </Link>

        <Link
          href="/admin/finances/deposits"
          className="card-editorial p-5 bg-white border border-[#E9E1ED] hover:border-[#C6A46A] transition-all flex items-center justify-between group"
        >
          <div>
            <p className="font-serif text-xs font-bold text-[#302343] group-hover:text-[#C6A46A]">Security Deposits</p>
            <p className="text-[11px] text-[#766D7C]">Deposit balances & refunds</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#766D7C] group-hover:text-[#C6A46A]" />
        </Link>

        <Link
          href="/admin/finances/transactions"
          className="card-editorial p-5 bg-white border border-[#E9E1ED] hover:border-[#C6A46A] transition-all flex items-center justify-between group"
        >
          <div>
            <p className="font-serif text-xs font-bold text-[#302343] group-hover:text-[#C6A46A]">Transaction Ledger</p>
            <p className="text-[11px] text-[#766D7C]">Audit sheets & statements</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#766D7C] group-hover:text-[#C6A46A]" />
        </Link>
      </div>
    </div>
  );
}
