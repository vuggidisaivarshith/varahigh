'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FinancialPayment } from '@/lib/data/financials-repo';
import { Resident } from '@/types/database';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Building,
  User,
  ShieldCheck,
  Receipt
} from 'lucide-react';

function PaymentsManagementContent() {
  const searchParams = useSearchParams();
  const prefillResidentId = searchParams.get('resident_id');
  const prefillInvoiceId = searchParams.get('invoice_id');

  const [payments, setPayments] = useState<FinancialPayment[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);

  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Record Offline Payment Modal
  const [showModal, setShowModal] = useState(false);
  const [residentId, setResidentId] = useState(prefillResidentId || '');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'direct_upi' | 'bank_transfer'>('direct_upi');
  const [reference, setReference] = useState('');
  const [collectorName, setCollectorName] = useState('Marpina Pradeep (Owner)');
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'pending'>('verified');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reversal Modal
  const [reversalTarget, setReversalTarget] = useState<FinancialPayment | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [reversing, setReversing] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (methodFilter !== 'all') params.append('method', methodFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const [pRes, rRes] = await Promise.all([
        fetch(`/api/financials/payments?${params.toString()}`),
        fetch('/api/residents?status=active'),
      ]);
      const [pJson, rJson] = await Promise.all([pRes.json(), rRes.json()]);

      if (pJson.success) setPayments(pJson.data);
      if (rJson.success) {
        setResidents(rJson.data);
        if (!residentId && rJson.data.length > 0) {
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
    fetchPayments();
  }, [methodFilter, statusFilter]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/financials/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: residentId,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          transaction_reference: reference || `${paymentMethod.toUpperCase()}-${Date.now()}`,
          collector_name: collectorName,
          verification_status: verificationStatus,
          invoice_id: prefillInvoiceId || undefined,
          remarks,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to record payment.');
      }

      setFeedback({ type: 'success', text: data.message });
      setShowModal(false);
      setAmount('');
      setReference('');
      setRemarks('');
      fetchPayments();
    } catch (err) {
      setFeedback({ type: 'error', text: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExecuteReversal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalTarget) return;
    setReversing(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/financials/payments/reverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: reversalTarget.id,
          reversal_reason: reversalReason,
          actor_name: 'Marpina Pradeep (Owner)',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reverse payment.');
      }

      setFeedback({ type: 'success', text: data.message });
      setReversalTarget(null);
      setReversalReason('');
      fetchPayments();
    } catch (err) {
      setFeedback({ type: 'error', text: (err as Error).message });
    } finally {
      setReversing(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.receipt_number.toLowerCase().includes(s) ||
      p.devi_resident_id.toLowerCase().includes(s) ||
      p.resident_name.toLowerCase().includes(s) ||
      p.transaction_reference.toLowerCase().includes(s)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F5F1E9] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-6">
        <div>
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            PAYMENT COLLECTION & RECONCILIATION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-2">
            Omnichannel Payment Ledger
          </h1>
          <p className="text-xs text-[#718096] mt-1">
            Record Cash & Direct UPI collections, reconcile bank credits, and audit verified transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="btn-emerald-cta text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Record Cash / Direct UPI
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

      {/* Record Offline Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="card-editorial p-6 sm:p-8 max-w-lg w-full space-y-5 bg-white border border-[#E5E0D7] shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#142B45] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#477B70]" />
              Record Offline Collection
            </h3>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#142B45] mb-1">
                  Select Resident *
                </label>
                <select
                  value={residentId}
                  onChange={(e) => setResidentId(e.target.value)}
                  className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-xl px-4 py-2.5 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F] font-mono"
                >
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.resident_id} — {r.full_name} (Outstanding: ₹{r.outstanding_balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#142B45] mb-1">
                    Amount Collected (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 7000"
                    className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-xl px-4 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142B45] mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-xl px-4 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F]"
                  >
                    <option value="direct_upi">Direct QR / PhonePe / GPay</option>
                    <option value="cash">Cash Collection</option>
                    <option value="bank_transfer">Direct Bank Transfer (NEFT/IMPS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142B45] mb-1">
                  Transaction Reference / UTR Number
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. UPI/123456789012 or Cash Voucher No."
                  className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-xl px-4 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142B45] mb-1">
                  Verification Status *
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value as any)}
                  className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-xl px-4 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F]"
                >
                  <option value="verified">Verified against received bank credit</option>
                  <option value="pending">Pending bank statement clearance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#142B45] mb-1">
                  Collector / Staff Name *
                </label>
                <input
                  type="text"
                  required
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-xl px-4 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F]"
                />
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
                  disabled={submitting}
                  className="btn-emerald-cta text-xs"
                >
                  {submitting ? 'Recording...' : 'Confirm & Issue Official Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reversal Modal */}
      {reversalTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="card-editorial p-6 sm:p-8 max-w-lg w-full space-y-5 bg-white border border-[#E5E0D7] shadow-xl">
            <h3 className="font-serif text-xl font-bold text-rose-700 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              Reverse Verified Transaction
            </h3>
            <p className="text-xs text-[#718096]">
              You are reversing receipt <strong>{reversalTarget.receipt_number}</strong> for <strong>₹{reversalTarget.amount.toLocaleString()}</strong> ({reversalTarget.resident_name}).
              Financial records are never deleted; an offsetting reversal entry will be written to the ledger.
            </p>

            <form onSubmit={handleExecuteReversal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#142B45] mb-1">
                  Reason for Reversal / Adjustment *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  placeholder="e.g. Bank chargeback, duplicate manual entry, or cheque return..."
                  className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-xl p-3 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReversalTarget(null)}
                  className="btn-ghost-luxury text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reversing}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
                >
                  {reversing ? 'Reversing...' : 'Execute Counter-Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card-editorial p-4 sm:p-5 space-y-4 bg-white border border-[#E5E0D7]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by receipt number (e.g. RCPT-2026-001), Resident ID, transaction reference..."
              className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E5E0D7]">
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#718096] mb-1 uppercase">
              Payment Method
            </label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F]"
            >
              <option value="all">All Payment Methods</option>
              <option value="online_upi">Online UPI / Razorpay</option>
              <option value="direct_upi">Direct QR / PhonePe</option>
              <option value="cash">Cash Collection</option>
              <option value="bank_transfer">Direct Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-[#718096] mb-1 uppercase">
              Verification Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F5F1E9] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#D6A85F]"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified & Captured</option>
              <option value="pending">Pending Bank Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card-editorial bg-white border border-[#E5E0D7] overflow-hidden">
        <div className="p-4 bg-[#F5F1E9] border-b border-[#E5E0D7] flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#142B45]">
            TOTAL TRANSACTIONS ({filteredPayments.length})
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#718096]">
            Loading payments...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#718096]">
            No payments found.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E0D7]">
            {filteredPayments.map((p) => (
              <div
                key={p.id}
                className={`p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  p.is_reversed ? 'opacity-60 bg-slate-50' : 'hover:bg-[#F5F1E9]/50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#142B45] font-mono">{p.receipt_number}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {p.devi_resident_id}
                    </span>
                    <span className="text-xs font-semibold text-[#142B45]">{p.resident_name}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      p.is_reversed
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : p.status === 'verified'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {p.is_reversed ? 'Reversed' : p.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#718096]">
                    Method: <strong className="text-[#142B45] uppercase">{p.payment_method.replace('_', ' ')}</strong> • Date: {p.payment_date} • Collector: {p.collector_name}
                  </p>
                  <p className="text-[11px] font-mono text-[#718096]">
                    Ref: {p.transaction_reference}
                  </p>
                  {p.remarks && <p className="text-[11px] text-[#718096] italic">&quot;{p.remarks}&quot;</p>}
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <div className="text-right">
                    <p className={`font-serif text-lg font-bold font-mono ${p.amount < 0 ? 'text-rose-600' : 'text-[#477B70]'}`}>
                      {p.amount < 0 ? '-' : '+'}₹{Math.abs(p.amount).toLocaleString()}
                    </p>
                  </div>

                  {!p.is_reversed && p.amount > 0 && (
                    <button
                      type="button"
                      onClick={() => setReversalTarget(p)}
                      className="px-3 py-1.5 rounded-lg border border-[#E5E0D7] bg-[#F5F1E9] hover:bg-rose-50 hover:text-rose-700 text-[#718096] text-xs font-semibold transition-colors"
                      title="Reverse transaction"
                    >
                      Reverse
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#718096]">Loading payment ledger...</div>}>
      <PaymentsManagementContent />
    </Suspense>
  );
}
