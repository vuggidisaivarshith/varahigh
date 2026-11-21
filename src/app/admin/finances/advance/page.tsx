'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdvanceEntry } from '@/lib/data/financials-repo';
import { Wallet, Plus, ArrowRight, ShieldCheck, User, Calendar } from 'lucide-react';

export default function AdminAdvancePage() {
  const [entries, setEntries] = useState<AdvanceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdvance = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/financials/advance');
      const json = await res.json();
      if (json.success) setEntries(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvance();
  }, []);

  const totalAdvanceHeld = entries.reduce((acc, curr) => {
    if (curr.type === 'credit') return acc + curr.amount;
    if (curr.type === 'debit_invoice') return acc - curr.amount;
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
        <div>
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            ADVANCE LIABILITY LEDGER
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
            Advance Rent Management
          </h1>
          <p className="text-xs text-[#718096]">
            Tracks resident advance deposits and automated cycle invoice deductions.
          </p>
        </div>

        <Link
          href="/admin/finances/payments"
          className="btn-emerald-cta text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Advance Payment</span>
        </Link>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E5E0D7]">
          <span className="badge-mono text-[9px] border-[#D6A85F]">LIABILITY BALANCE</span>
          <p className="font-serif text-3xl font-bold text-[#142B45] font-mono mt-1">
            ₹{Math.max(0, totalAdvanceHeld).toLocaleString()}
          </p>
          <p className="text-[11px] text-[#718096] mt-0.5">Prepaid resident rent held</p>
        </div>
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E5E0D7]">
          <span className="badge-mono text-[9px] border-[#D6A85F]">ACTIVE CREDITS</span>
          <p className="font-serif text-3xl font-bold text-[#477B70] font-mono mt-1">
            {entries.filter(e => e.type === 'credit').length} Records
          </p>
          <p className="text-[11px] text-[#718096] mt-0.5">Advance deposits on book</p>
        </div>
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E5E0D7]">
          <span className="badge-mono text-[9px] border-[#D6A85F]">OFFSET PROTOCOL</span>
          <p className="font-serif text-sm font-bold text-[#142B45] mt-1">Automatic Rent Offset</p>
          <p className="text-[11px] text-[#718096] mt-0.5">Auto-applies against cycle invoices</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card-editorial overflow-hidden bg-[#FFFFFF] border border-[#E5E0D7]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#142B45] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Entry ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4">Transaction Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Balance After</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D7] text-[#263447]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718096] font-mono">
                    Loading advance rent ledger...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718096] font-mono">
                    No advance entries found.
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="hover:bg-[#F5F1E9]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#142B45]">{e.id}</td>
                    <td className="py-3 px-4 font-mono text-[#718096]">{e.date}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#142B45]">{e.resident_name}</p>
                      <p className="font-mono text-[10px] text-[#718096]">{e.devi_resident_id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                        e.type === 'credit'
                          ? 'bg-[#EBF2F0] text-[#1D4038]'
                          : 'bg-[#FDF6F0] text-[#9C4221]'
                      }`}>
                        {e.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${
                      e.type === 'credit' ? 'text-[#477B70]' : 'text-[#9B1C1C]'
                    }`}>
                      {e.type === 'credit' ? '+' : '-'}₹{e.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#142B45]">
                      ₹{e.balance_after.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#718096]">{e.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
