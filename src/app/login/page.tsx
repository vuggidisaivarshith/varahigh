'use client';

import React from 'react';
import Link from 'next/link';
import {
  User,
  Shield,
  Building2,
  GraduationCap,
  Plane,
  CreditCard,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function UnifiedPortalLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-serif font-bold text-lg">
              VGH
            </div>
            <span className="font-serif text-2xl font-bold text-[#0F172A]">VARAHI GIRLS HOSTEL</span>
          </Link>
          <div className="inline-flex items-center gap-2 badge-mono">
            <span>SECURE DIGITAL GATEWAY • SHAMSHABAD HYD</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0F172A]">
            Select Your Portal to <span className="italic text-[#365679] font-medium">Sign In</span>
          </h1>
          <p className="text-[#334155] text-sm max-w-lg mx-auto">
            Choose whether you are a hostel resident accessing self-service payments and room details, or an authorized management staff member.
          </p>
        </div>

        {/* Two Main Doors: Resident vs Staff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gate 1: Resident Portal */}
          <div className="card-editorial p-8 rounded-2xl bg-white flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <User className="w-6 h-6" />
              </div>
              <span className="badge-mono">FOR ACTIVE &amp; NEW RESIDENTS</span>
              <h2 className="font-serif text-2xl font-bold text-[#0F172A]">
                Hostel Resident Self-Service Portal
              </h2>
              <p className="text-xs text-[#334155] leading-relaxed">
                Log in using your registered mobile number + OTP or permanent Varahi Resident ID (<code className="font-mono text-[11px] font-bold bg-slate-100 px-1 py-0.5 rounded">VG1-1-XXXXX</code>) and password.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="font-mono text-[10px] uppercase font-bold text-[#0F172A]">Resident Features:</p>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    💳 <strong>Instant Online Rent Payments (UPI / Cards)</strong>
                  </li>
                  <li className="flex items-center gap-1.5">
                    📄 <strong>View &amp; Download GST Rent Invoices &amp; Receipts</strong>
                  </li>
                  <li className="flex items-center gap-1.5">
                    🛡️ <strong>Track Advance Balance &amp; Security Deposits</strong>
                  </li>
                  <li className="flex items-center gap-1.5">
                    🛠️ <strong>Submit Room Maintenance &amp; Complaint Tickets</strong>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/resident/login"
              className="btn-emerald-cta w-full py-3.5 text-xs text-center flex items-center justify-center gap-2"
            >
              <span>Resident Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Gate 2: Management & Staff Portal */}
          <div className="card-editorial p-8 rounded-2xl bg-white flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <span className="badge-mono">FOR AUTHORIZED MANAGEMENT</span>
              <h2 className="font-serif text-2xl font-bold text-[#0F172A]">
                Management &amp; Staff Operations Hub
              </h2>
              <p className="text-xs text-[#334155] leading-relaxed">
                Restricted access for Owner <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong>, Resident Lady Warden, and Administrative Staff.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <p className="font-mono text-[10px] uppercase font-bold text-[#0F172A]">Management Features:</p>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li className="flex items-center gap-1.5">
                    📊 <strong>Real-Time Bed Inventory &amp; Room Allocations</strong>
                  </li>
                  <li className="flex items-center gap-1.5">
                    👤 <strong>Resident Admissions, KYC &amp; Verification</strong>
                  </li>
                  <li className="flex items-center gap-1.5">
                    💰 <strong>Automated Monthly Rent Billing &amp; Invoicing</strong>
                  </li>
                  <li className="flex items-center gap-1.5">
                    ⚖️ <strong>Cash Reconciliation &amp; Expense Ledgers</strong>
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/admin/login"
              className="btn-primary-ink w-full py-3.5 text-xs text-center flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Administrative Sign In</span>
            </Link>
          </div>
        </div>

        {/* Support Help */}
        <div className="text-center text-xs text-[#334155] font-mono">
          <span>Need login assistance? Contact management at </span>
          <a href={`tel:${VERIFIED_CONTACTS.primary_phone}`} className="text-[#0F172A] font-bold hover:underline">
            {VERIFIED_CONTACTS.primary_phone}
          </a>
        </div>
      </div>
    </div>
  );
}
