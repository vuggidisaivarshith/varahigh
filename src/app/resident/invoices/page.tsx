'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResidentInvoice, Resident } from '@/types/database';
import { FileText, CreditCard, Download, CheckCircle2, AlertCircle, ShieldCheck, X } from 'lucide-react';

export default function ResidentInvoicesPage() {
  const [invoices, setInvoices] = useState<ResidentInvoice[]>([]);
  const [resident, setResident] = useState<Resident | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<ResidentInvoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paySuccess, setPaySuccess] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    const match = document.cookie.match(/devi_resident_id=([^;]+)/);
    const residentId = match ? match[1] : 'DV1-1-00001';
    const res = await fetch(`/api/residents/${residentId}`);
    const json = await res.json();
    if (json.success) {
      setInvoices(json.data.invoices);
      setResident(json.data.resident);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenPayModal = (inv: ResidentInvoice) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.balance_due);
    setPayError(null);
    setPaySuccess(null);
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProcessPayment = async () => {
    if (!selectedInvoice || !resident) return;
    if (payAmount <= 0) {
      setPayError('Please enter a valid payment amount.');
      return;
    }

    setIsProcessing(true);
    setPayError(null);
    setPaySuccess(null);

    try {
      // Step 1: Create Razorpay Order
      const orderRes = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: resident.id,
          invoice_id: selectedInvoice.id,
          amount: payAmount,
          notes: `Rent payment for ${selectedInvoice.invoice_number}`,
        }),
      });

      const orderJson = await orderRes.json();
      if (!orderJson.success) {
        throw new Error(orderJson.error || 'Failed to initialize payment gateway.');
      }

      const order = orderJson.order;
      const rzpKey = orderJson.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const scriptLoaded = await loadRazorpayScript();

      // If Razorpay JS SDK loaded and real Razorpay order ID exists, launch modal
      if (
        scriptLoaded &&
        typeof window !== 'undefined' &&
        (window as any).Razorpay &&
        rzpKey &&
        order.id &&
        !order.id.startsWith('order_varahi_')
      ) {
        const options = {
          key: rzpKey,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'VARAHI GIRLS HOSTEL',
          description: `Rent payment for ${selectedInvoice.invoice_number}`,
          order_id: order.id,
          prefill: {
            name: resident.full_name,
            contact: resident.phone,
            email: resident.email,
          },
          theme: {
            color: '#302343',
          },
          handler: async function (response: any) {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                resident_id: resident.id,
                invoice_id: selectedInvoice.id,
                amount: payAmount,
                method: paymentMethod,
              }),
            });

            const verifyJson = await verifyRes.json();
            if (!verifyJson.success) {
              setPayError(verifyJson.error || 'Payment verification failed.');
              setIsProcessing(false);
              return;
            }

            setPaySuccess(
              `Payment of ₹${payAmount.toLocaleString()} completed successfully! Receipt #${verifyJson.payment?.receipt_number || 'GEN'}`
            );
            await fetchInvoices();
            setTimeout(() => {
              setSelectedInvoice(null);
              setPaySuccess(null);
              setIsProcessing(false);
            }, 2500);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      // Fallback / Sandbox direct verify simulation
      const mockPaymentId = `pay_sim_${Date.now()}`;
      const verifyRes = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: order.id,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: 'dev_mock_signature',
          resident_id: resident.id,
          invoice_id: selectedInvoice.id,
          amount: payAmount,
          method: paymentMethod,
        }),
      });

      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        throw new Error(verifyJson.error || 'Payment verification failed.');
      }

      setPaySuccess(
        `Payment of ₹${payAmount.toLocaleString()} completed successfully! Receipt #${verifyJson.payment?.receipt_number || 'GEN'}`
      );
      
      // Refresh invoices
      await fetchInvoices();
      setTimeout(() => {
        setSelectedInvoice(null);
        setPaySuccess(null);
      }, 2500);
    } catch (err: any) {
      setPayError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 bg-[#F8F4FA]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-4">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
            BILLING &amp; PAYMENT DESK
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">Monthly Rent Invoices</h1>
          <p className="text-xs text-[#766D7C]">
            Individual joining-date billing records for Resident ID: <span className="font-mono text-[#79618E] font-bold">{resident?.resident_id}</span>
          </p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#F8F4FA] border-b border-[#E9E1ED] flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#302343]">
            All Invoices ({invoices.length})
          </span>
          <span className="text-xs text-[#766D7C] font-mono">
            Billing Anchor: <strong className="text-[#302343]">{resident?.billing_anchor_day}th of every month</strong>
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#766D7C]">
            No rent invoices found.
          </div>
        ) : (
          <div className="divide-y divide-[#E9E1ED]">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8F4FA]/60 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#302343]">{inv.invoice_number}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      inv.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#766D7C]">
                    Billing Period: <strong className="text-[#302343]">{inv.billing_period_start}</strong> to <strong className="text-[#302343]">{inv.billing_period_end}</strong>
                  </p>
                  <p className="text-xs text-[#766D7C]">
                    Payment Due Date: <span className="text-[#79618E] font-semibold">{inv.due_date}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-mono font-bold text-[#766D7C]">Total Payable</p>
                    <p className="text-lg font-bold text-[#302343] font-mono">
                      ₹{inv.total_payable.toLocaleString('en-IN')}
                    </p>
                    {inv.balance_due > 0 ? (
                      <p className="text-xs text-rose-600 font-semibold font-mono">
                        Due: ₹{inv.balance_due.toLocaleString('en-IN')}
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-600 font-semibold">
                        Paid in Full
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {inv.balance_due > 0 && (
                      <button
                        onClick={() => handleOpenPayModal(inv)}
                        className="px-4 py-2 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay Online
                      </button>
                    )}
                    <Link
                      href="/resident/receipts"
                      className="px-4 py-2 rounded-xl bg-[#F8F4FA] hover:bg-[#E9E1ED] border border-[#E9E1ED] text-[#302343] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C6A46A]" />
                      Receipt
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Online Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302343]/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#F8F4FA] text-[#79618E] border border-[#E9E1ED]">
                  <CreditCard className="w-5 h-5 text-[#C6A46A]" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-[#302343] text-base">Pay Rent Online</h3>
                  <p className="text-xs text-[#766D7C] font-mono">{selectedInvoice.invoice_number}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-[#766D7C] hover:text-[#302343] transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paySuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-emerald-900 text-base">Payment Verified!</h4>
                <p className="text-xs text-emerald-700">{paySuccess}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{payError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase font-mono font-bold text-[#302343] mb-1">
                    Amount to Pay (₹)
                  </label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    max={selectedInvoice.balance_due}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-[#302343] font-mono font-bold text-lg focus:outline-none focus:border-[#79618E]"
                  />
                  <p className="text-[11px] text-[#766D7C] mt-1 font-mono">
                    Total balance due: ₹{selectedInvoice.balance_due.toLocaleString('en-IN')}
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono font-bold text-[#302343] mb-2">
                    Select Payment Gateway Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upi', label: '⚡ Instant UPI', desc: 'GPay/PhonePe' },
                      { id: 'card', label: '💳 Cards', desc: 'Debit / Credit' },
                      { id: 'netbanking', label: '🏦 Net Banking', desc: '50+ Banks' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl text-left border transition text-xs ${
                          paymentMethod === m.id
                            ? 'bg-[#D9C8E8]/30 border-[#79618E] text-[#302343] font-bold shadow-xs'
                            : 'bg-[#F8F4FA] border-[#E9E1ED] text-[#766D7C] hover:border-[#79618E]/50'
                        }`}
                      >
                        <p className="font-bold text-[#302343]">{m.label}</p>
                        <p className="text-[10px] text-[#766D7C] mt-0.5">{m.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-xs text-[#766D7C] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-bit encrypted Razorpay / Cashfree PCI-DSS compliant checkout.</span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="w-full py-3 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-bold text-sm tracking-wide transition shadow-xs disabled:opacity-50"
                >
                  {isProcessing ? 'Verifying Transaction...' : `Pay ₹${payAmount.toLocaleString('en-IN')} Now`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
