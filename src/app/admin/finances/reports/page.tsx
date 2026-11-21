'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DailyRow {
  date: string;
  total: number;
  count: number;
}

interface BranchRow {
  branch_code: number;
  branch_name: string;
  invoiced: number;
  collected: number;
  dues: number;
  residents_count: number;
}

interface DueRow {
  id: string;
  invoice_number: string;
  resident_id: string;
  resident_name: string;
  branch_name: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  balance_due: number;
  due_date: string;
}

interface BalanceRow {
  resident_id: string;
  full_name: string;
  branch_code: number;
  room_number: string;
  advance_balance?: number;
  security_deposit?: number;
}

interface StatementData {
  resident: {
    id: string;
    resident_id: string;
    full_name: string;
    mobile: string;
    email: string;
    current_branch_name: string;
    current_room_number: string;
    current_bed_label: string;
    monthly_rent: number;
    advance_balance: number;
    security_deposit: number;
    outstanding_balance: number;
    admission_date: string;
  };
  invoices: Array<{
    invoice_number: string;
    period_start: string;
    period_end: string;
    total_amount: number;
    paid_amount: number;
    balance_due: number;
    status: string;
    due_date: string;
  }>;
  payments: Array<{
    receipt_number: string;
    payment_date: string;
    amount: number;
    payment_method: string;
    status: string;
    reference_number?: string;
  }>;
  advances: Array<{
    entry_date: string;
    type: string;
    amount: number;
    balance_after: number;
    description: string;
  }>;
  deposits: Array<{
    transaction_date: string;
    type: string;
    amount: number;
    balance_after: number;
    notes: string;
  }>;
}

export default function FinancialReportsPage() {
  const [activeTab, setActiveTab] = useState<
    'daily' | 'branch' | 'dues' | 'advance' | 'deposit' | 'statement'
  >('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Report state
  const [dailyData, setDailyData] = useState<DailyRow[]>([]);
  const [branchData, setBranchData] = useState<BranchRow[]>([]);
  const [duesData, setDuesData] = useState<DueRow[]>([]);
  const [advanceData, setAdvanceData] = useState<BalanceRow[]>([]);
  const [depositData, setDepositData] = useState<BalanceRow[]>([]);
  
  // Statement state
  const [residentSearch, setResidentSearch] = useState('DV1-1-00001');
  const [statement, setStatement] = useState<StatementData | null>(null);

  const fetchReport = async (tab: string) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'daily') {
        const res = await fetch('/api/financials/reports?type=daily_collections');
        const json = await res.json();
        if (json.success) setDailyData(json.data);
      } else if (tab === 'branch') {
        const res = await fetch('/api/financials/reports?type=branch_revenue');
        const json = await res.json();
        if (json.success) setBranchData(json.data);
      } else if (tab === 'dues') {
        const res = await fetch('/api/financials/reports?type=pending_dues');
        const json = await res.json();
        if (json.success) setDuesData(json.data);
      } else if (tab === 'advance') {
        const res = await fetch('/api/financials/reports?type=advance_balances');
        const json = await res.json();
        if (json.success) setAdvanceData(json.data);
      } else if (tab === 'deposit') {
        const res = await fetch('/api/financials/reports?type=deposit_liabilities');
        const json = await res.json();
        if (json.success) setDepositData(json.data);
      }
    } catch {
      setError('Failed to fetch report data. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatement = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!residentSearch.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/financials/reports?type=resident_statement&resident_id=${encodeURIComponent(residentSearch.trim())}`);
      const json = await res.json();
      if (json.success) {
        setStatement(json.statement);
      } else {
        setError(json.error || 'Failed to generate resident statement.');
        setStatement(null);
      }
    } catch {
      setError('Network error while generating resident statement.');
      setStatement(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'statement') {
      fetchStatement();
    } else {
      fetchReport(activeTab);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin</Link>
              <span>/</span>
              <Link href="/admin/finances" className="hover:text-amber-400 transition-colors">Finances</Link>
              <span>/</span>
              <span className="text-slate-200">Financial Reports</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                📊
              </span>
              Financial Reporting & Ledger Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Comprehensive audit reports, daily collections, branch revenue distributions, liability ledgers, and resident account statements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/finances"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              ← Back to Finances
            </Link>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2"
            >
              🖨️ Print / Export PDF
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'daily', label: '📅 Daily Collections' },
            { id: 'branch', label: '🏢 Branch Revenue' },
            { id: 'dues', label: '⚠️ Pending Dues' },
            { id: 'advance', label: '💰 Advance Rent Liabilities' },
            { id: 'deposit', label: '🛡️ Deposit Liabilities' },
            { id: 'statement', label: '📄 Resident Statement' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-rose-300 font-bold ml-4">✕</button>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Generating report...</p>
          </div>
        ) : (
          <div>
            {/* TAB 1: DAILY COLLECTIONS */}
            {activeTab === 'daily' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Recorded Days</p>
                    <p className="text-3xl font-bold text-white mt-1">{dailyData.length}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cumulative Collections</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">
                      ₹{dailyData.reduce((acc, r) => acc + r.total, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Transactions</p>
                    <p className="text-3xl font-bold text-amber-400 mt-1">
                      {dailyData.reduce((acc, r) => acc + r.count, 0)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-800/30">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4">Collection Date</th>
                        <th className="px-6 py-4">Total Amount Collected</th>
                        <th className="px-6 py-4">Transactions Count</th>
                        <th className="px-6 py-4">Average Ticket</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dailyData.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                            No collection records logged yet.
                          </td>
                        </tr>
                      ) : (
                        dailyData.map((row) => (
                          <tr key={row.date} className="hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 font-mono font-medium text-white">{row.date}</td>
                            <td className="px-6 py-4 font-semibold text-emerald-400">
                              ₹{row.total.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                                {row.count} payments
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                              ₹{Math.round(row.total / row.count).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: BRANCH REVENUE */}
            {activeTab === 'branch' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {branchData.map((b) => (
                    <div key={b.branch_code} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Branch {b.branch_code}
                        </span>
                        <span className="text-xs text-slate-400">{b.residents_count} residents</span>
                      </div>
                      <h3 className="font-semibold text-white text-sm truncate">{b.branch_name}</h3>
                      <div className="pt-2 border-t border-slate-700/50 text-xs space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Invoiced:</span>
                          <span className="text-slate-200">₹{b.invoiced.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Collected:</span>
                          <span className="text-emerald-400 font-semibold">₹{b.collected.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Dues:</span>
                          <span className="text-rose-400 font-semibold">₹{b.dues.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-800/30">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4">Branch Code</th>
                        <th className="px-6 py-4">Branch Name</th>
                        <th className="px-6 py-4">Total Invoiced</th>
                        <th className="px-6 py-4">Total Collected</th>
                        <th className="px-6 py-4">Outstanding Dues</th>
                        <th className="px-6 py-4">Collection Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {branchData.map((row) => {
                        const ratio = row.invoiced > 0 ? Math.round((row.collected / row.invoiced) * 100) : 0;
                        return (
                          <tr key={row.branch_code} className="hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 font-mono font-bold text-amber-400">
                              Branch {row.branch_code}
                            </td>
                            <td className="px-6 py-4 font-medium text-white">{row.branch_name}</td>
                            <td className="px-6 py-4 text-slate-300">₹{row.invoiced.toLocaleString()}</td>
                            <td className="px-6 py-4 font-semibold text-emerald-400">₹{row.collected.toLocaleString()}</td>
                            <td className="px-6 py-4 font-semibold text-rose-400">₹{row.dues.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full ${ratio >= 80 ? 'bg-emerald-500' : ratio >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                    style={{ width: `${Math.min(ratio, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono">{ratio}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: PENDING DUES */}
            {activeTab === 'dues' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                      <span>⚠️</span> Pending Rent Dues & Defaulters
                    </h3>
                    <p className="text-xs text-rose-300/80 mt-1">
                      All unpaid and partially paid rent invoices across all 5 branches requiring collection follow-ups.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-slate-400">Total Outstanding Rent</p>
                    <p className="text-2xl font-bold text-rose-400">
                      ₹{duesData.reduce((acc, d) => acc + d.balance_due, 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-800/30">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4">Invoice #</th>
                        <th className="px-6 py-4">Resident</th>
                        <th className="px-6 py-4">Branch</th>
                        <th className="px-6 py-4">Billing Period</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4">Total Amount</th>
                        <th className="px-6 py-4">Balance Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {duesData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-emerald-400 font-medium">
                            ✓ No pending dues! All invoices are completely settled.
                          </td>
                        </tr>
                      ) : (
                        duesData.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 font-mono font-medium text-white">{row.invoice_number}</td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-white">{row.resident_name}</p>
                              <p className="text-xs font-mono text-amber-400">{row.resident_id}</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400">{row.branch_name}</td>
                            <td className="px-6 py-4 text-xs text-slate-300">
                              {row.period_start} to {row.period_end}
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-rose-400">{row.due_date}</td>
                            <td className="px-6 py-4 text-slate-300">₹{row.total_amount.toLocaleString()}</td>
                            <td className="px-6 py-4 font-bold text-rose-400">₹{row.balance_due.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: ADVANCE RENT LIABILITIES */}
            {activeTab === 'advance' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                      <span>💰</span> Resident Advance Rent Balances
                    </h3>
                    <p className="text-xs text-amber-300/80 mt-1">
                      Unutilized advance rent credits held on account. Automatically offsets subsequent monthly recurring invoices.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-slate-400">Total Advance Credit Held</p>
                    <p className="text-2xl font-bold text-amber-400">
                      ₹{advanceData.reduce((acc, r) => acc + (r.advance_balance || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-800/30">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4">Resident ID</th>
                        <th className="px-6 py-4">Resident Name</th>
                        <th className="px-6 py-4">Branch</th>
                        <th className="px-6 py-4">Room #</th>
                        <th className="px-6 py-4">Advance Credit Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {advanceData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            No unallocated advance rent credits currently recorded.
                          </td>
                        </tr>
                      ) : (
                        advanceData.map((row) => (
                          <tr key={row.resident_id} className="hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 font-mono font-medium text-amber-400">{row.resident_id}</td>
                            <td className="px-6 py-4 font-semibold text-white">{row.full_name}</td>
                            <td className="px-6 py-4 text-xs text-slate-400">Branch {row.branch_code}</td>
                            <td className="px-6 py-4 text-slate-300">Room {row.room_number}</td>
                            <td className="px-6 py-4 font-bold text-emerald-400">
                              ₹{(row.advance_balance || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: DEPOSIT LIABILITIES */}
            {activeTab === 'deposit' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                      <span>🛡️</span> Refundable Security Deposit Liabilities
                    </h3>
                    <p className="text-xs text-blue-300/80 mt-1">
                      Held in dedicated refundable deposit accounts for active residents. Subject to room inspection, damage deductions, and checkout refund.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-slate-400">Total Deposit Liability</p>
                    <p className="text-2xl font-bold text-blue-400">
                      ₹{depositData.reduce((acc, r) => acc + (r.security_deposit || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-800/30">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="px-6 py-4">Resident ID</th>
                        <th className="px-6 py-4">Resident Name</th>
                        <th className="px-6 py-4">Branch</th>
                        <th className="px-6 py-4">Room #</th>
                        <th className="px-6 py-4">Security Deposit Held</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {depositData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            No security deposits currently recorded in active accounts.
                          </td>
                        </tr>
                      ) : (
                        depositData.map((row) => (
                          <tr key={row.resident_id} className="hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 font-mono font-medium text-amber-400">{row.resident_id}</td>
                            <td className="px-6 py-4 font-semibold text-white">{row.full_name}</td>
                            <td className="px-6 py-4 text-xs text-slate-400">Branch {row.branch_code}</td>
                            <td className="px-6 py-4 text-slate-300">Room {row.room_number}</td>
                            <td className="px-6 py-4 font-bold text-blue-400">
                              ₹{(row.security_deposit || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: RESIDENT STATEMENT */}
            {activeTab === 'statement' && (
              <div className="space-y-6">
                {/* Search Header */}
                <form onSubmit={fetchStatement} className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <label className="block text-xs uppercase font-medium text-slate-400 mb-1">
                      Enter Resident ID (e.g., DV1-1-00001, DV2-3-00002)
                    </label>
                    <input
                      type="text"
                      value={residentSearch}
                      onChange={(e) => setResidentSearch(e.target.value)}
                      placeholder="DV1-1-00001"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                  <div className="pt-4 md:pt-5 w-full md:w-auto">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20"
                    >
                      Generate Statement
                    </button>
                  </div>
                </form>

                {statement && (
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-8 space-y-8 print:border-black print:bg-white print:text-black">
                    {/* Official Statement Letterhead */}
                    <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6 print:border-black">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black tracking-wider text-amber-500 print:text-black">
                            DEVI HOSTELS
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono print:border print:border-black print:text-black">
                            FINANCIAL ACCOUNT STATEMENT
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 max-w-sm print:text-gray-700">
                          Proprietor: MARPINA PRADEEP <br />
                          Shamshabad, Hyderabad, Telangana, India. <br />
                          Airport Road, Near RGIA
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider print:text-gray-700">Resident ID</p>
                        <p className="text-2xl font-black font-mono text-amber-400 print:text-black">
                          {statement.resident.resident_id}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 print:text-gray-600">
                          Statement Date: 2026-11-20
                        </p>
                      </div>
                    </div>

                    {/* Resident Info Matrix */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800 print:border-black print:bg-gray-100">
                      <div>
                        <p className="text-xs text-slate-400 print:text-gray-600">Resident Name</p>
                        <p className="font-bold text-white text-base print:text-black">{statement.resident.full_name}</p>
                        <p className="text-xs text-slate-400 print:text-gray-600">{statement.resident.mobile}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 print:text-gray-600">Assigned Branch & Room</p>
                        <p className="font-semibold text-white print:text-black">{statement.resident.current_branch_name}</p>
                        <p className="text-xs text-slate-400 print:text-gray-600">
                          Room {statement.resident.current_room_number} (Bed {statement.resident.current_bed_label})
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 print:text-gray-600">Agreed Monthly Rent</p>
                        <p className="font-bold text-white text-base print:text-black">
                          ₹{statement.resident.monthly_rent.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400 print:text-gray-600">
                          Joined: {statement.resident.admission_date}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 print:text-gray-600">Current Balances</p>
                        <p className="text-xs text-emerald-400 font-semibold print:text-black">
                          Advance: ₹{statement.resident.advance_balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-400 font-semibold print:text-black">
                          Deposit: ₹{statement.resident.security_deposit.toLocaleString()}
                        </p>
                        <p className="text-xs text-rose-400 font-bold print:text-black">
                          Due: ₹{statement.resident.outstanding_balance.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Invoices Table */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-black">
                        1. Invoices & Billing Cycles
                      </h4>
                      <table className="w-full text-left text-xs text-slate-300 print:text-black">
                        <thead className="bg-slate-800/80 uppercase font-semibold text-slate-400 border-b border-slate-700 print:border-black print:bg-gray-200">
                          <tr>
                            <th className="p-3">Invoice #</th>
                            <th className="p-3">Period</th>
                            <th className="p-3">Due Date</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Paid</th>
                            <th className="p-3">Due</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 print:divide-black">
                          {statement.invoices.map((inv) => (
                            <tr key={inv.invoice_number}>
                              <td className="p-3 font-mono font-medium">{inv.invoice_number}</td>
                              <td className="p-3">{inv.period_start} to {inv.period_end}</td>
                              <td className="p-3">{inv.due_date}</td>
                              <td className="p-3">₹{inv.total_amount.toLocaleString()}</td>
                              <td className="p-3 text-emerald-400 print:text-black">₹{inv.paid_amount.toLocaleString()}</td>
                              <td className="p-3 text-rose-400 font-bold print:text-black">₹{inv.balance_due.toLocaleString()}</td>
                              <td className="p-3 uppercase font-semibold">{inv.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Payments Table */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-black">
                        2. Recorded Payment Receipts
                      </h4>
                      <table className="w-full text-left text-xs text-slate-300 print:text-black">
                        <thead className="bg-slate-800/80 uppercase font-semibold text-slate-400 border-b border-slate-700 print:border-black print:bg-gray-200">
                          <tr>
                            <th className="p-3">Receipt #</th>
                            <th className="p-3">Payment Date</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Method</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Reference #</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 print:divide-black">
                          {statement.payments.map((p) => (
                            <tr key={p.receipt_number}>
                              <td className="p-3 font-mono font-medium">{p.receipt_number}</td>
                              <td className="p-3">{p.payment_date}</td>
                              <td className="p-3 font-bold text-emerald-400 print:text-black">₹{p.amount.toLocaleString()}</td>
                              <td className="p-3 uppercase">{p.payment_method}</td>
                              <td className="p-3 uppercase font-semibold">{p.status}</td>
                              <td className="p-3 font-mono text-slate-400 print:text-black">{p.reference_number || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Security Deposit & Advance Ledger Summaries */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black">
                          3. Security Deposit Ledger Log
                        </h4>
                        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800 space-y-2 text-xs print:border-black">
                          {statement.deposits.length === 0 ? (
                            <p className="text-slate-500">No deposit transactions logged.</p>
                          ) : (
                            statement.deposits.map((d, i) => (
                              <div key={i} className="flex justify-between border-b border-slate-800/50 pb-1 last:border-0">
                                <div>
                                  <span className="font-semibold text-white print:text-black uppercase">{d.type}</span>
                                  <p className="text-[10px] text-slate-400">{d.notes} ({d.transaction_date})</p>
                                </div>
                                <span className="font-mono text-blue-400 print:text-black font-bold">
                                  ₹{d.amount.toLocaleString()}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-black">
                          4. Advance Rent Credit Log
                        </h4>
                        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800 space-y-2 text-xs print:border-black">
                          {statement.advances.length === 0 ? (
                            <p className="text-slate-500">No advance ledger events logged.</p>
                          ) : (
                            statement.advances.map((a, i) => (
                              <div key={i} className="flex justify-between border-b border-slate-800/50 pb-1 last:border-0">
                                <div>
                                  <span className="font-semibold text-white print:text-black uppercase">{a.type}</span>
                                  <p className="text-[10px] text-slate-400">{a.description} ({a.entry_date})</p>
                                </div>
                                <span className="font-mono text-amber-400 print:text-black font-bold">
                                  ₹{a.amount.toLocaleString()}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Official Signoff */}
                    <div className="pt-8 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400 print:text-gray-700 print:border-black">
                      <div>
                        <p>Authorized Signature: __________________________</p>
                        <p className="mt-1 font-semibold text-slate-300 print:text-black">DEVI HOSTELS Accounts Dept.</p>
                      </div>
                      <div className="text-right">
                        <p>Computer-generated statement.</p>
                        <p>Issued at Shamshabad Central Office.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
