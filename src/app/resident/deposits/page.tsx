'use client';

import React, { useState, useEffect } from 'react';
import { Resident } from '@/types/database';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export default function ResidentDepositsPage() {
  const [resident, setResident] = useState<Resident | null>(null);

  useEffect(() => {
    const fetchResident = async () => {
      const match = document.cookie.match(/devi_resident_id=([^;]+)/);
      if (!match) return;
      const res = await fetch(`/api/residents/${match[1]}`);
      const json = await res.json();
      if (json.success) setResident(json.data.resident);
    };
    fetchResident();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#302343]">Refundable Security Deposit</h1>
        <p className="text-xs text-[#766D7C]">
          Security deposit balance held under your admission stay record at DEVI Hostels.
        </p>
      </div>

      <div className="card-editorial p-6 sm:p-8 space-y-6 bg-[#FFFFFF] border border-[#E9E1ED]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#766D7C]">
              Total Refundable Deposit Held
            </span>
            <p className="text-3xl font-serif font-bold text-[#79618E] font-mono mt-1">
              ₹{(resident?.security_deposit || 10000).toLocaleString()}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EBF2F0] text-[#1D4038] border border-[#A3C7BD] flex items-center gap-1.5 self-start sm:self-auto font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#79618E]" />
            100% Refundable
          </span>
        </div>

        <div className="bg-[#F8F4FA] border border-[#E9E1ED] p-4 rounded-xl flex items-start gap-3 text-xs text-[#332C38]">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#C6A46A]" />
          <div className="space-y-1">
            <p className="font-bold text-[#302343]">DEVI Hostels Refund Policy:</p>
            <p className="leading-relaxed">
              Your security deposit is 100% refundable upon completing your checkout notice period (minimum 15 days notice). Following room inspection for zero structural damages and clearance of any outstanding monthly rent dues, the deposit is disbursed directly to your original bank account or UPI ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
