'use client';

import React, { useState, useEffect } from 'react';
import { DepositEntry } from '@/lib/data/financials-repo';
import { Resident } from '@/types/database';
import {
  ShieldCheck,
  Plus,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function AdminDepositsPage() {
  const [entries, setEntries] = useState<DepositEntry[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [residentId, setResidentId] = useState('');
  const [type, setType] = useState<'damage_deduction' | 'utility_deduction' | 'refund'>('damage_deduction');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const [dRes, rRes] = await Promise.all([
        fetch('/api/financials/deposits'),
        fetch('/api/residents?status=active'),
      ]);
      const [dJson, rJson] = await Promise.all([dRes.json(), rRes.json()]);

      if (dJson.success) setEntries(dJson.data);
      if (rJson.success) {
        setResidents(rJson.data);
        if (rJson.data.length > 0 && !residentId) {
          setResidentId(rJson.data[0].id);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleRecordDepositAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/financials/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: residentId,
          type,
          amount: parseFloat(amount),
          remarks,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process deposit transaction.');
      }

      setFeedback({ type: 'success', text: data.message });
      setShowModal(false);
      setAmount('');
      setRemarks('');
      fetchDeposits();
    } catch (err) {
      setFeedback({ type: 'error', text: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  const totalHeld = residents.reduce((acc, r) => acc + (r.security_deposit || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-4">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            DEPOSIT LIABILITY MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
            Refundable Security Deposits
          </h1>
          <p className="text-xs text-[#766D7C]">
            Track refundable deposits held against resident stays, room damage deductions, and checkout refunds.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary-navy text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Deduction / Refund</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-lg text-xs font-semibold ${
          feedback.type === 'success'
            ? 'bg-[#EBF2F0] border border-[#A3C7BD] text-[#1D4038]'
            : 'bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C]'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E9E1ED]">
          <span className="badge-mono text-[9px] border-[#C6A46A]">TOTAL DEPOSITS HELD</span>
          <p className="font-serif text-3xl font-bold text-[#79618E] font-mono mt-1">
            ₹{totalHeld.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#766D7C] mt-0.5">Segregated refundable liability</p>
        </div>
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E9E1ED]">
          <span className="badge-mono text-[9px] border-[#C6A46A]">ACTIVE RESIDENTS</span>
          <p className="font-serif text-3xl font-bold text-[#302343] font-mono mt-1">
            {residents.length} Residents
          </p>
          <p className="text-[11px] text-[#766D7C] mt-0.5">With active security deposit</p>
        </div>
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E9E1ED]">
          <span className="badge-mono text-[9px] border-[#C6A46A]">REFUND PROTOCOL</span>
          <p className="font-serif text-sm font-bold text-[#302343] mt-1">15-Day Notice Checkout</p>
          <p className="text-[11px] text-[#766D7C] mt-0.5">Disbursed upon clear room inspection</p>
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#302343]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card-editorial max-w-lg w-full p-6 bg-[#FFFFFF] border border-[#E9E1ED] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#302343]">
                Process Security Deposit Deduction / Refund
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs font-mono text-[#766D7C] hover:text-[#302343]"
              >
                Cancel ✕
              </button>
            </div>

            <form onSubmit={handleRecordDepositAction} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                  Select Resident *
                </label>
                <select
                  value={residentId}
                  onChange={(e) => setResidentId(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                >
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.full_name} ({r.resident_id}) — Branch {r.current_branch_code} (Balance: ₹{r.security_deposit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Action Type *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  >
                    <option value="damage_deduction">Damage Deduction</option>
                    <option value="utility_deduction">Utility / Key Loss Deduction</option>
                    <option value="refund">Checkout Payout Refund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Amount (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                  Audit Remarks / Deduction Reason *
                </label>
                <input
                  type="text"
                  required
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Broken window latch repair or Checkout settlement to bank"
                  className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost-luxury text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-navy text-xs py-2 px-5"
                >
                  {submitting ? 'Processing...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposits Table */}
      <div className="card-editorial overflow-hidden bg-[#FFFFFF] border border-[#E9E1ED]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#302343] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Entry ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Balance After</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1ED] text-[#332C38]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#766D7C] font-mono">
                    Loading security deposit entries...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#766D7C] font-mono">
                    No security deposit records found.
                  </td>
                </tr>
              ) : (
                entries.map((dep) => (
                  <tr key={dep.id} className="hover:bg-[#F8F4FA]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#302343]">{dep.id}</td>
                    <td className="py-3 px-4 font-mono text-[#766D7C]">{dep.date}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#302343]">{dep.resident_name}</p>
                      <p className="font-mono text-[10px] text-[#766D7C]">{dep.devi_resident_id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                        dep.type === 'deposit_received'
                          ? 'bg-[#EBF2F0] text-[#1D4038]'
                          : dep.type === 'refund'
                          ? 'bg-[#FDF6F0] text-[#9C4221]'
                          : 'bg-[#FDF2F2] text-[#9B1C1C]'
                      }`}>
                        {dep.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${
                      dep.type === 'deposit_received' ? 'text-[#79618E]' : 'text-[#9B1C1C]'
                    }`}>
                      {dep.type === 'deposit_received' ? '+' : '-'}₹{dep.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#302343]">
                      ₹{dep.balance_after.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#766D7C]">{dep.remarks}</td>
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
