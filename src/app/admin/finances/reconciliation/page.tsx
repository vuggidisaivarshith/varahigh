'use client';

import React, { useState, useEffect } from 'react';
import { CashReconciliationEntry } from '@/lib/data/financials-repo';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import { Scale, Plus, CheckCircle2, AlertCircle, Building2, Calendar } from 'lucide-react';

export default function AdminCashReconciliationPage() {
  const [reconciliations, setReconciliations] = useState<CashReconciliationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [branchCode, setBranchCode] = useState<number>(1);
  const [date, setDate] = useState('');
  const [openingCash, setOpeningCash] = useState('5000');
  const [cashCollected, setCashCollected] = useState('');
  const [cashExpenses, setCashExpenses] = useState('');
  const [closingActual, setClosingActual] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchReconciliations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/financials/reconciliation');
      const json = await res.json();
      if (json.success) setReconciliations(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReconciliations();
  }, []);

  const handleRecordRecon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openingCash || !cashCollected || !cashExpenses || !closingActual) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/financials/reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_code: branchCode,
          date,
          opening_cash: parseFloat(openingCash),
          cash_collected: parseFloat(cashCollected),
          cash_expenses: parseFloat(cashExpenses),
          closing_cash_actual: parseFloat(closingActual),
          remarks,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setCashCollected('');
        setCashExpenses('');
        setClosingActual('');
        setRemarks('');
        fetchReconciliations();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-4">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            COUNTER CASH VERIFICATION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
            Cash Drawer Reconciliation
          </h1>
          <p className="text-xs text-[#766D7C]">
            Compare opening cash, offline receipts, counter payouts, and physical cash drawer counts.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary-navy text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Daily Reconciliation</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#302343]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card-editorial max-w-lg w-full p-6 bg-[#FFFFFF] border border-[#E9E1ED] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#302343]">Record Cash Reconciliation</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs font-mono text-[#766D7C] hover:text-[#302343]"
              >
                Cancel ✕
              </button>
            </div>

            <form onSubmit={handleRecordRecon} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Branch
                  </label>
                  <select
                    value={branchCode}
                    onChange={(e) => setBranchCode(parseInt(e.target.value, 10))}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  >
                    {DEVI_BRANCHES.map((b) => (
                      <option key={b.branch_code} value={b.branch_code}>
                        Branch {b.branch_code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Reconciliation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Opening Cash Float (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={openingCash}
                    onChange={(e) => setOpeningCash(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Cash Collected (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={cashCollected}
                    onChange={(e) => setCashCollected(e.target.value)}
                    placeholder="e.g. 14000"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Cash Expenses Paid (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={cashExpenses}
                    onChange={(e) => setCashExpenses(e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Physical Drawer Count (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={closingActual}
                    onChange={(e) => setClosingActual(e.target.value)}
                    placeholder="e.g. 14500"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                  Verification Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Physical denomination count matches expected balance."
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
                  {submitting ? 'Recording...' : 'Save Reconciliation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reconciliations Table */}
      <div className="card-editorial overflow-hidden bg-[#FFFFFF] border border-[#E9E1ED]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#302343] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Ref No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4 text-right">Opening</th>
                <th className="py-3 px-4 text-right">Cash In</th>
                <th className="py-3 px-4 text-right">Cash Out</th>
                <th className="py-3 px-4 text-right">Calculated</th>
                <th className="py-3 px-4 text-right">Actual Count</th>
                <th className="py-3 px-4 text-right">Variance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verified By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1ED] text-[#332C38]">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-[#766D7C] font-mono">
                    Loading cash reconciliation logs...
                  </td>
                </tr>
              ) : reconciliations.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-[#766D7C] font-mono">
                    No cash reconciliations logged yet.
                  </td>
                </tr>
              ) : (
                reconciliations.map((cr) => (
                  <tr key={cr.id} className="hover:bg-[#F8F4FA]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#302343]">
                      {cr.reconciliation_ref}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#766D7C]">{cr.date}</td>
                    <td className="py-3 px-4 font-mono">Branch {cr.branch_code}</td>
                    <td className="py-3 px-4 text-right font-mono text-[#766D7C]">
                      ₹{cr.opening_cash.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#79618E]">
                      +₹{cr.cash_collected.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#9B1C1C]">
                      -₹{cr.cash_expenses.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#766D7C]">
                      ₹{cr.closing_cash_calculated.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#302343]">
                      ₹{cr.closing_cash_actual.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${
                      cr.variance === 0 ? 'text-[#79618E]' : 'text-[#9B1C1C]'
                    }`}>
                      {cr.variance === 0 ? '₹0' : `₹${cr.variance}`}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                        cr.status === 'balanced'
                          ? 'bg-[#EBF2F0] text-[#1D4038]'
                          : 'bg-[#FDF2F2] text-[#9B1C1C]'
                      }`}>
                        {cr.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#766D7C]">{cr.verified_by}</td>
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
