'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifiedTransaction } from '@/lib/data/financials-repo';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import {
  Receipt,
  Search,
  Filter,
  Download,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Wallet,
  ShieldCheck,
  RefreshCw,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function AdminTransactionsLedgerPage() {
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBranch !== 'all') params.set('branch', selectedBranch);
      if (selectedType !== 'all') params.set('type', selectedType);
      if (selectedMethod !== 'all') params.set('method', selectedMethod);
      if (search) params.set('search', search);

      const res = await fetch(`/api/financials/transactions?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedBranch, selectedType, selectedMethod]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  const exportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Reference No', 'Date', 'Type', 'Category', 'Branch', 'Resident ID', 'Resident Name', 'Amount (INR)', 'Payment Method', 'Verification Status', 'Staff', 'Notes'];
    const rows = transactions.map((t) => [
      t.reference_no,
      t.date,
      t.transaction_type,
      t.category,
      `Branch ${t.branch_code}`,
      t.devi_resident_id || '—',
      t.resident_name || '—',
      t.amount,
      t.payment_method,
      t.verification_status,
      t.recording_staff,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DEVI_HOSTELS_TRANSACTIONS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
        <div>
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            IMMUTABLE CENTRAL LEDGER
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
            Complete Transactions Ledger
          </h1>
          <p className="text-xs text-[#718096]">
            Audited financial record for rent receipts, advances, deposits, cash collections, Razorpay settlements, and expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="btn-ghost-luxury text-xs py-2 px-3.5 flex items-center gap-1.5"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/admin/finances/payments"
            className="btn-emerald-cta text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </Link>
          <Link
            href="/admin/finances/expenses"
            className="btn-primary-navy text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Record Expense</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#718096] absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by receipt no, resident ID (DV1-1-XXXXX), name, notes..."
              className="w-full bg-[#F5F1E9]/50 border border-[#E5E0D7] rounded-lg pl-9 pr-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-2.5 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
            >
              <option value="all">All Branches</option>
              {DEVI_BRANCHES.map((b) => (
                <option key={b.branch_code} value={b.branch_code}>
                  Branch {b.branch_code}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-2.5 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
            >
              <option value="all">All Types</option>
              <option value="rent_receipt">Rent Receipts</option>
              <option value="advance_credit">Advance Rent</option>
              <option value="deposit_received">Security Deposit</option>
              <option value="branch_expense">Branch Expense</option>
              <option value="adjustment_reversal">Reversals</option>
            </select>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-2.5 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
            >
              <option value="all">All Methods</option>
              <option value="cash">Counter Cash</option>
              <option value="direct_upi">Direct UPI</option>
              <option value="online_upi">Online Razorpay</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary-navy text-xs py-2 px-4 w-full md:w-auto"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="card-editorial overflow-hidden bg-[#FFFFFF] border border-[#E5E0D7]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#142B45] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type & Category</th>
                <th className="py-3 px-4">Resident / Beneficiary</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D7] text-[#263447]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#718096] font-mono">
                    Loading transactions ledger...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#718096] font-mono">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const isExpense = t.category === 'expense';
                  const isReversal = t.category === 'reversal';
                  return (
                    <tr key={t.id} className="hover:bg-[#F5F1E9]/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#142B45]">
                        {t.reference_no}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#718096]">
                        {t.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#142B45] capitalize">
                          {t.transaction_type.replace('_', ' ')}
                        </span>
                        <p className="text-[10px] font-mono text-[#718096] uppercase">{t.category}</p>
                      </td>
                      <td className="py-3 px-4">
                        {t.resident_name ? (
                          <div>
                            <p className="font-bold text-[#142B45]">{t.resident_name}</p>
                            <p className="font-mono text-[10px] text-[#718096]">{t.devi_resident_id}</p>
                          </div>
                        ) : (
                          <span className="text-[#718096] italic">{t.notes || '—'}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        Branch {t.branch_code}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold text-sm ${
                        isExpense
                          ? 'text-[#9B1C1C]'
                          : isReversal
                          ? 'text-[#718096] line-through'
                          : 'text-[#477B70]'
                      }`}>
                        {isExpense ? '-' : '+'}₹{t.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] capitalize">
                        {t.payment_method.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                          t.verification_status === 'verified'
                            ? 'bg-[#EBF2F0] text-[#1D4038]'
                            : t.verification_status === 'reversed'
                            ? 'bg-[#FDF2F2] text-[#9B1C1C]'
                            : 'bg-[#F5F1E9] text-[#718096]'
                        }`}>
                          {t.verification_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#718096]">
                        {t.recording_staff}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
