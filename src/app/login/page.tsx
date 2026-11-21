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
    <div className="min-h-screen bg-[#F8F4FA] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-lg bg-[#302343] text-[#FFFFFF] flex items-center justify-center font-serif font-bold text-lg border border-[#C6A46A]/40 group-hover:scale-105 transition-transform">
              VGH
            </div>
            <span className="font-serif text-2xl font-bold text-[#302343]">VARAHI GIRLS HOSTEL</span>
          </Link>
          <div className="inline-flex items-center gap-2 badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] animate-pulse" />
            <span>SECURE DIGITAL GATEWAY • SHAMSHABAD HYD</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#302343]">
            Select Your Portal to <span className="italic text-[#79618E] font-medium">Sign In</span>
          </h1>
          <p className="text-[#766D7C] text-sm max-w-lg mx-auto">
            Choose whether you are a hostel resident accessing self-service payments and room details, or an authorized management staff member.
          </p>
        </div>

        {/* Two Main Doors: Resident vs Staff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gate 1: Resident Portal */}
          <div className="card-editorial p-8 rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#D9C8E8]/40 text-[#79618E] flex items-center justify-center font-bold border border-[#D9C8E8]">
                <User className="w-6 h-6" />
              </div>
              <span className="badge-mono border-[#D9C8E8] text-[#79618E] bg-[#F8F4FA]">
                FOR ACTIVE &amp; NEW RESIDENTS
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#302343]">
                Hostel Resident Self-Service Portal
              </h2>
              <p className="text-xs text-[#766D7C] leading-relaxed">
                Log in using your registered mobile number + OTP or permanent Varahi Resident ID (<code className="font-mono text-[11px] font-bold bg-[#F8F4FA] border border-[#E9E1ED] px-1.5 py-0.5 rounded text-[#302343]">VG1-1-XXXXX</code>) and password.
              </p>

              <div className="p-4 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-xs space-y-2">
                <p className="font-mono text-[10px] uppercase font-bold text-[#302343]">Resident Features:</p>
                <ul className="space-y-1.5 text-[#332C38] text-[11px]">
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
              className="w-full bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-mono text-sm uppercase font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.02] active:scale-98 transition-all min-h-[52px]"
            >
              <User className="w-4 h-4 text-[#C6A46A]" />
              <span>Resident Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Gate 2: Management & Staff Portal */}
          <div className="card-editorial p-8 rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#302343] text-[#C6A46A] flex items-center justify-center font-bold border border-[#C6A46A]/40">
                <Shield className="w-6 h-6" />
              </div>
              <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#F8F4FA]">
                FOR AUTHORIZED MANAGEMENT
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#302343]">
                Management &amp; Staff Operations Hub
              </h2>
              <p className="text-xs text-[#766D7C] leading-relaxed">
                Restricted access for Owner <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong>, Resident Lady Warden, and Administrative Staff.
              </p>

              <div className="p-4 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-xs space-y-2">
                <p className="font-mono text-[10px] uppercase font-bold text-[#302343]">Management Features:</p>
                <ul className="space-y-1.5 text-[#332C38] text-[11px]">
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
              className="w-full bg-[#302343] hover:bg-[#79618E] text-[#FFFFFF] font-mono text-sm uppercase font-bold py-4 px-6 rounded-xl text-center flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.02] active:scale-98 transition-all border border-[#C6A46A]/50 min-h-[52px]"
            >
              <Lock className="w-4 h-4 text-[#C6A46A]" />
              <span>Administrative Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Support Help */}
        <div className="text-center text-xs text-[#766D7C] font-mono">
          <span>Need login assistance? Contact management at </span>
          <a href={`tel:${VERIFIED_CONTACTS.primary_phone}`} className="text-[#302343] font-bold hover:underline">
            {VERIFIED_CONTACTS.primary_phone}
          </a>
        </div>
      </div>
    </div>
  );
}
