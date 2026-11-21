'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FinancialInvoice } from '@/lib/data/financials-repo';
import { Resident } from '@/types/database';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Building,
  RefreshCw,
  Printer
} from 'lucide-react';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<FinancialInvoice[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);

  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Generate modal
  const [showModal, setShowModal] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [notes, setNotes] = useState('');
  const [generating, setGenerating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (branchFilter !== 'all') params.append('branch_code', branchFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const [invRes, resRes] = await Promise.all([
        fetch(`/api/financials/invoices?${params.toString()}`),
        fetch('/api/residents?status=active'),
      ]);
      const [invJson, resJson] = await Promise.all([invRes.json(), resRes.json()]);

      if (invJson.success) setInvoices(invJson.data);
      if (resJson.success) {
        setResidents(resJson.data);
        if (resJson.data.length > 0 && !selectedResidentId) {
          setSelectedResidentId(resJson.data[0].id);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [branchFilter, statusFilter]);

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/financials/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: selectedResidentId,
          additional_charges: additionalCharges,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate recurring invoice.');
      }

      setFeedback({ type: 'success', text: data.message });
      setShowModal(false);
      fetchInvoices();
    } catch (err) {
      setFeedback({ type: 'error', text: (err as Error).message });
    } finally {
      setGenerating(false);
    }
  };

  const filteredInvoices = invoices.filter((i) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      i.invoice_number.toLowerCase().includes(s) ||
      i.devi_resident_id.toLowerCase().includes(s) ||
      i.resident_name.toLowerCase().includes(s)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F8F4FA] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-6">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            BILLING ENGINE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-2">
            Monthly Invoicing & Due Dates
          </h1>
          <p className="text-xs text-[#766D7C] mt-1">
            Individual joining-date billing engine with automated advance credit utilization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="btn-champagne-gold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Generate Recurring Invoice
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="card-editorial p-6 sm:p-8 max-w-lg w-full space-y-5 bg-white border border-[#E9E1ED] shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#302343] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C6A46A]" />
              Generate Joining-Date Recurring Invoice
            </h3>

            <form onSubmit={handleGenerateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#302343] mb-1">
                  Select Active Resident *
                </label>
                <select
                  value={selectedResidentId}
                  onChange={(e) => setSelectedResidentId(e.target.value)}
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#C6A46A] font-mono"
                >
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.resident_id} — {r.full_name} (Due: {r.billing_anchor_day}th | Rent: ₹{r.agreed_monthly_rent.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#302343] mb-1">
                  Additional Charges (Electricity / Maintenance, if any)
                </label>
                <input
                  type="number"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#C6A46A] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#302343] mb-1">
                  Invoice Internal Remarks
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Regular monthly rent billing cycle"
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#C6A46A]"
                />
              </div>

              <div className="bg-[#F8F4FA] p-3.5 rounded-xl border border-[#E9E1ED] text-[11px] text-[#766D7C] space-y-1">
                <p className="text-[#302343] font-bold">Automated Business Logic:</p>
                <p>• Billing period anchors directly to the resident&apos;s joining date without drift.</p>
                <p>• Any available advance rent credit balance is deducted automatically.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost-luxury text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="btn-champagne-gold text-xs"
                >
                  {generating ? 'Generating...' : 'Confirm & Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card-editorial p-4 sm:p-5 space-y-4 bg-white border border-[#E9E1ED]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#766D7C] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice number (e.g. INV-2026-001), Resident ID, or resident name..."
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#C6A46A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E9E1ED]">
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#766D7C] mb-1 uppercase">
              Filter by Branch
            </label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#C6A46A]"
            >
              <option value="all">All 5 Branches</option>
              {DEVI_BRANCHES.map((b) => (
                <option key={b.branch_code} value={b.branch_code}>
                  Branch {b.branch_code}: {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-[#766D7C] mb-1 uppercase">
              Invoice Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#C6A46A]"
            >
              <option value="all">All Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Fully Settled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card-editorial bg-white border border-[#E9E1ED] overflow-hidden">
        <div className="p-4 bg-[#F8F4FA] border-b border-[#E9E1ED] flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#302343]">
            TOTAL INVOICES ({filteredInvoices.length})
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#766D7C]">
            Loading invoices...
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#766D7C]">
            No invoices found matching criteria.
          </div>
        ) : (
          <div className="divide-y divide-[#E9E1ED]">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8F4FA]/50 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#302343] font-mono">{inv.invoice_number}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {inv.devi_resident_id}
                    </span>
                    <span className="text-xs font-semibold text-[#302343]">
                      {inv.resident_name}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full capitalize ${
                      inv.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : inv.status === 'partially_paid'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {inv.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#766D7C]">
                    Branch {inv.branch_code} • Room {inv.room_number} • Period: <strong>{inv.billing_period_start}</strong> to <strong>{inv.billing_period_end}</strong>
                  </p>
                  <p className="text-xs text-[#766D7C]">
                    Due Date: <span className="text-[#C6A46A] font-semibold">{inv.due_date}</span>
                    {inv.advance_adjusted > 0 && (
                      <span className="text-blue-700 ml-2 font-medium">
                        (Advance Applied: ₹{inv.advance_adjusted.toLocaleString()})
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-6 self-start sm:self-center">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-mono font-bold text-[#766D7C]">Total Payable</p>
                    <p className="font-serif text-lg font-bold text-[#302343]">
                      ₹{inv.total_payable.toLocaleString()}
                    </p>
                    {inv.balance_due > 0 ? (
                      <p className="text-xs text-rose-600 font-semibold font-mono">
                        Due: ₹{inv.balance_due.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-xs text-[#79618E] font-semibold font-mono">
                        Settled
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/admin/finances/payments?resident_id=${inv.resident_id}&invoice_id=${inv.id}`}
                    className="btn-emerald-cta text-xs"
                  >
                    Record Payment
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
