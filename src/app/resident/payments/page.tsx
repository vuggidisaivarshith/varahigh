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
      const match = document.cookie.match(/devi_resident_id=([^;]+)/);
      const residentId = match ? match[1] : 'DV1-1-00001';
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment History & Transactions</h1>
        <p className="text-xs text-slate-400">
          All verified online UPI, cash, and direct bank transfers recorded for Resident ID: <span className="font-mono text-amber-400 font-bold">{resident?.resident_id}</span>
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            Payment Receipts ({payments.length})
          </span>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Transactions Bank-Reconciled
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No payments recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{p.receipt_number}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Method: <span className="text-amber-400 font-semibold uppercase">{p.payment_method.replace('_', ' ')}</span> • Date: {p.payment_date}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500">
                    Ref: {p.transaction_reference}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <p className="text-lg font-black text-emerald-400 font-mono">
                    ₹{p.amount.toLocaleString()}
                  </p>
                  <Link
                    href="/resident/receipts"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
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
