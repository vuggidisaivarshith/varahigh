'use client';

import React, { useState, useEffect } from 'react';
import { Resident } from '@/types/database';
import { Wallet, Info, CheckCircle2 } from 'lucide-react';

export default function ResidentAdvancePage() {
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
        <h1 className="font-serif text-2xl font-bold text-[#142B45]">Advance Rent Credit Ledger</h1>
        <p className="text-xs text-[#718096]">
          Advance rent balance maintained separately from refundable security deposits.
        </p>
      </div>

      <div className="card-editorial p-6 sm:p-8 space-y-6 bg-[#FFFFFF] border border-[#E5E0D7]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#718096]">
              Current Available Advance Credit
            </span>
            <p className="text-3xl font-serif font-bold text-[#142B45] font-mono mt-1">
              ₹{(resident?.advance_balance || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-[#F5F1E9] rounded-lg border border-[#E5E0D7] text-xs text-[#718096] font-mono">
            Resident ID: <strong className="text-[#142B45]">{resident?.resident_id || '—'}</strong>
          </div>
        </div>

        <div className="bg-[#F5F1E9] border border-[#E5E0D7] p-4 rounded-xl flex items-start gap-3 text-xs text-[#263447]">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#D6A85F]" />
          <div className="space-y-1">
            <p className="font-bold text-[#142B45]">How Advance Rent is Utilized:</p>
            <p className="leading-relaxed">
              When your monthly rent invoice is generated on your billing cycle anchor date ({resident?.billing_anchor_day || '—'}th of each month), any available advance credit balance is automatically deducted before calculating the net balance payable. You may also request a refund of unused advance credit upon departure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
