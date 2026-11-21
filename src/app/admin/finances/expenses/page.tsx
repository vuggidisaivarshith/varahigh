'use client';

import React, { useState, useEffect } from 'react';
import { ExpenseEntry } from '@/lib/data/financials-repo';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import { TrendingDown, Plus, Filter, Calendar, Building2, CheckCircle2 } from 'lucide-react';

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [branchCode, setBranchCode] = useState<number>(1);
  const [category, setCategory] = useState<ExpenseEntry['category']>('food_groceries');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'direct_upi' | 'bank_transfer'>('direct_upi');
  const [vendorName, setVendorName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/financials/expenses');
      const json = await res.json();
      if (json.success) setExpenses(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !vendorName) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/financials/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_code: branchCode,
          category,
          amount: parseFloat(amount),
          date,
          payment_method: paymentMethod,
          vendor_name: vendorName,
          notes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        setAmount('');
        setVendorName('');
        setNotes('');
        fetchExpenses();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-4">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            OPERATIONAL EXPENDITURES
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
            Branch Expenses & Vouchers
          </h1>
          <p className="text-xs text-[#766D7C]">
            Track food provisions, generator diesel, utilities, maintenance, and hostel operations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary-navy text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E9E1ED]">
          <span className="badge-mono text-[9px] border-[#C6A46A]">TOTAL EXPENDITURE</span>
          <p className="font-serif text-3xl font-bold text-[#9B1C1C] font-mono mt-1">
            ₹{totalExpenses.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#766D7C] mt-0.5">Recorded operational disbursements</p>
        </div>
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E9E1ED]">
          <span className="badge-mono text-[9px] border-[#C6A46A]">VOUCHERS LOGGED</span>
          <p className="font-serif text-3xl font-bold text-[#302343] font-mono mt-1">
            {expenses.length} Vouchers
          </p>
          <p className="text-[11px] text-[#766D7C] mt-0.5">Audit verified payments</p>
        </div>
        <div className="card-editorial p-5 bg-[#FFFFFF] border border-[#E9E1ED]">
          <span className="badge-mono text-[9px] border-[#C6A46A]">LARGEST COST CENTRE</span>
          <p className="font-serif text-sm font-bold text-[#302343] mt-1">Food, Mess & Provisions</p>
          <p className="text-[11px] text-[#766D7C] mt-0.5">Daily 3-time resident dining</p>
        </div>
      </div>

      {/* Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#302343]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card-editorial max-w-lg w-full p-6 bg-[#FFFFFF] border border-[#E9E1ED] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#302343]">Record Operational Expense</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-mono text-[#766D7C] hover:text-[#302343]"
              >
                Cancel ✕
              </button>
            </div>

            <form onSubmit={handleRecordExpense} className="space-y-4">
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
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  >
                    <option value="food_groceries">Food & Groceries</option>
                    <option value="diesel_generator">Diesel / Generator Fuel</option>
                    <option value="maintenance">Plumbing / Repairs</option>
                    <option value="utilities">Electricity / Water</option>
                    <option value="internet">Wi-Fi & Internet</option>
                    <option value="cleaning">Housekeeping / Sanitation</option>
                    <option value="staff_salary">Staff Salary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Amount (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  >
                    <option value="direct_upi">Direct UPI</option>
                    <option value="cash">Counter Cash</option>
                    <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                  Vendor / Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. HPCL Fuel Station Shamshabad"
                  className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                  Notes / Bill Details
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 50 Litres Diesel for generator backup"
                  className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost-luxury text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-navy text-xs py-2 px-5"
                >
                  {submitting ? 'Recording...' : 'Save Expense Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="card-editorial overflow-hidden bg-[#FFFFFF] border border-[#E9E1ED]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#302343] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1ED] text-[#332C38]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#766D7C] font-mono">
                    Loading expenses ledger...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#766D7C] font-mono">
                    No expense vouchers recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#F8F4FA]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#302343]">
                      {exp.expense_voucher_no}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#766D7C]">{exp.date}</td>
                    <td className="py-3 px-4 font-mono">Branch {exp.branch_code}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-[#302343]">
                      {exp.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#302343]">{exp.vendor_name}</p>
                      {exp.notes && <p className="text-[10px] text-[#766D7C]">{exp.notes}</p>}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#9B1C1C]">
                      -₹{exp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] capitalize">
                      {exp.payment_method.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-[#766D7C]">{exp.recorded_by}</td>
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
