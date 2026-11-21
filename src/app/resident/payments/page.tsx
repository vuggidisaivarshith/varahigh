'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResidentPayment, Resident } from '@/types/database';
import { CreditCard, CheckCircle2, Receipt, ArrowRight } from 'lucide-react';

export default function ResidentPaymentsPage() {
  const [payments, setPayments] = useState<ResidentPayment[]>([]);
  const [resident, setResident] = useState<Resident | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const match = document.cookie.match(/(?:devi|varahi)_resident_id=([^;]+)/);
      const residentId = match ? match[1] : 'VG1-1-00001';
      const res = await fetch(`/api/residents/${residentId}`);
      const json = await res.json();
      if (json.success) {
        setPayments(json.data.payments);
        setResident(json.data.resident);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-8 bg-[#F8F4FA]">
      <div className="border-b border-[#E9E1ED] pb-4">
        <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
          TRANSACTION HISTORY
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
          Payment History &amp; Receipts
        </h1>
        <p className="text-xs text-[#766D7C]">
          All verified online UPI, card, and bank transfers recorded for Resident ID: <span className="font-mono text-[#79618E] font-bold">{resident?.resident_id}</span>
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#F8F4FA] border-b border-[#E9E1ED] flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#302343]">
            Payment Receipts ({payments.length})
          </span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Transactions Bank-Reconciled
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#766D7C]">
            No payments recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#E9E1ED]">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8F4FA]/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#302343]">{p.receipt_number}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase font-mono">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#766D7C]">
                    Method: <span className="text-[#302343] font-semibold uppercase">{p.payment_method.replace('_', ' ')}</span> • Date: {p.payment_date}
                  </p>
                  <p className="text-[11px] font-mono text-[#766D7C]">
                    Ref: {p.transaction_reference}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <p className="text-lg font-bold text-emerald-700 font-mono">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </p>
                  <Link
                    href="/resident/receipts"
                    className="px-3.5 py-1.5 rounded-lg bg-[#F8F4FA] hover:bg-[#E9E1ED] border border-[#E9E1ED] text-[#302343] text-xs font-semibold transition-colors"
                  >
                    View Receipt
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
