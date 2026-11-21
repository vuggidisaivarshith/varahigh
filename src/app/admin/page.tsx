import React from 'react';
import Link from 'next/link';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import {
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Phone,
  ArrowRight,
  Layers,
  GraduationCap,
  Plane,
  UserCheck,
  ArrowRightLeft,
  LifeBuoy,
  FileText,
  CreditCard,
  Wallet,
  Receipt,
  PieChart,
  Shield,
  Sparkles
} from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-mono">
              CENTRAL OPERATIONS &amp; RESIDENCE MANAGEMENT
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F172A] mt-1">
            VARAHI GIRLS HOSTEL <span className="italic text-[#79618E] font-medium">Operations Hub</span>
          </h1>
          <p className="text-xs text-[#334155] mt-1 font-mono">
            Proprietor: <strong>E. Bharath Chandra</strong> (+91 93919 44082) • Shamshabad, Hyderabad (Branch 1 Flagship)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/finances/payments"
            className="btn-emerald-cta text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </Link>
          <Link
            href="/admin/admissions"
            className="btn-primary-ink text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>New Admission</span>
          </Link>
        </div>
      </div>

      {/* Primary Financial & Payment Automation Center */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
                Financial Automation & Payment Ledger Control
              </h2>
            </div>
            <p className="text-xs text-[#64748B]">
              Centralized joining-date billing engine, cash/UPI counter recording, advance rent credits & refundable deposits.
            </p>
          </div>

          <Link
            href="/admin/finances"
            className="text-xs font-bold text-[#79618E] hover:underline flex items-center gap-1 font-mono"
          >
            Open Full Ledger <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/admin/finances"
            className="card-editorial p-5 space-y-3 bg-slate-50 hover:bg-white hover:border-[#0F172A] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#0F172A] group-hover:text-[#79618E]">
                Finances Overview
              </h3>
              <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                Gross invoiced, total collected, outstanding dues & branch revenue summaries.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#79618E] flex items-center gap-1 pt-1">
              View Stats →
            </span>
          </Link>

          <Link
            href="/admin/finances/invoices"
            className="card-editorial p-5 space-y-3 bg-slate-50 hover:bg-white hover:border-[#0F172A] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#0F172A] group-hover:text-[#79618E]">
                Rent Invoices
              </h3>
              <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                Joining-date anchor billing engine, auto-generation, pro-rata calculations & overdue penalties.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#79618E] flex items-center gap-1 pt-1">
              Manage Invoices →
            </span>
          </Link>

          <Link
            href="/admin/finances/payments"
            className="card-editorial p-5 space-y-3 bg-emerald-50/60 hover:bg-white hover:border-emerald-600 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#0F172A] group-hover:text-emerald-700">
                Payment Ledger
              </h3>
              <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                Record counter cash, direct UPI receipts, Razorpay sync, non-destructive reversals & receipts.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 flex items-center gap-1 pt-1">
              Record / View Ledger →
            </span>
          </Link>

          <Link
            href="/admin/finances/deposits"
            className="card-editorial p-5 space-y-3 bg-slate-50 hover:bg-white hover:border-[#0F172A] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#0F172A] group-hover:text-[#79618E]">
                Security Deposits
              </h3>
              <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                Segregated deposit liability accounts, checkout damage deductions & refundable payouts.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#79618E] flex items-center gap-1 pt-1">
              Deposit Ledger →
            </span>
          </Link>

          <Link
            href="/admin/finances/reports"
            className="card-editorial p-5 space-y-3 bg-slate-50 hover:bg-white hover:border-[#0F172A] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#0F172A] group-hover:text-[#79618E]">
                Financial Reports
              </h3>
              <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                Branch-wise collection ratios, payment method distributions, defaulters list & CSV exports.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#79618E] flex items-center gap-1 pt-1">
              Generate Reports →
            </span>
          </Link>
        </div>
      </div>

      {/* Main Administrative Action Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/inventory"
          className="card-editorial p-6 space-y-3 bg-white hover:border-[#0F172A] transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#79618E]">
            Bed Inventory & Vacancy
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Branch ➔ Floor ➔ Room ➔ Bed allocation matrix with double-allocation prevention.
          </p>
          <span className="text-xs font-mono font-bold text-[#79618E] flex items-center gap-1 pt-1">
            Open Bed Matrix <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/admin/residents"
          className="card-editorial p-6 space-y-3 bg-white hover:border-[#0F172A] transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#79618E]">
            Resident Directory
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Search active & historical resident records, permanent DEVI IDs, stays & profiles.
          </p>
          <span className="text-xs font-mono font-bold text-[#79618E] flex items-center gap-1 pt-1">
            View Residents <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/admin/admissions"
          className="card-editorial p-6 space-y-3 bg-white hover:border-[#0F172A] transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#79618E]">
            Admission & ID Engine
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Confirm admission, generate collision-safe IDs (<code className="font-mono text-[11px] font-bold">DV1-1-XXXXX</code>), and assign beds.
          </p>
          <span className="text-xs font-mono font-bold text-[#79618E] flex items-center gap-1 pt-1">
            Admit Resident <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/admin/operations"
          className="card-editorial p-6 space-y-3 bg-white hover:border-[#0F172A] transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#79618E]">
            Operations & Transfers
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Room/branch transfers preserving permanent IDs, checkouts, and maintenance tickets.
          </p>
          <span className="text-xs font-mono font-bold text-[#79618E] flex items-center gap-1 pt-1">
            Manage Operations <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Five Branch Status Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            Centralized 5-Branch Network
          </h3>
          <Link href="/branches" className="text-xs font-mono font-bold text-[#79618E] hover:underline">
            Public Website Directory →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEVI_BRANCHES.map((b) => (
            <div
              key={b.id}
              className="card-editorial p-6 space-y-4 bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="badge-mono text-[10px]">
                  BRANCH CODE {b.branch_code}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  b.gender_category === 'girls' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {b.gender_category === 'girls' ? 'Girls Only Enclave' : 'Boys Hostel'}
                </span>
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold text-[#0F172A]">{b.name}</h4>
                <p className="text-xs text-[#64748B] mt-1">{b.address_line1}</p>
                <p className="text-[11px] text-amber-700 mt-1 font-mono font-semibold">{b.distance_from_rgia}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[#64748B] font-mono">{b.total_floors} Floors</span>
                <Link
                  href={`/admin/inventory?branch=${b.branch_code}`}
                  className="font-mono text-xs font-bold text-[#79618E] hover:underline"
                >
                  Inspect Bed Matrix →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
