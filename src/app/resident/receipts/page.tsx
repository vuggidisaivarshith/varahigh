'use client';

import React, { useState, useEffect } from 'react';
import { ResidentPayment, Resident } from '@/types/database';
import { Receipt, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ResidentReceiptsPage() {
  const [payments, setPayments] = useState<ResidentPayment[]>([]);
  const [resident, setResident] = useState<Resident | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ResidentPayment | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      const match = document.cookie.match(/devi_resident_id=([^;]+)/);
      const residentId = match ? match[1] : 'DV1-1-00001';
      const res = await fetch(`/api/residents/${residentId}`);
      const json = await res.json();
      if (json.success) {
        setPayments(json.data.payments);
        setResident(json.data.resident);
        if (json.data.payments.length > 0) {
          setSelectedReceipt(json.data.payments[0]);
        }
      }
    };
    fetchReceipts();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Digital Payment Receipts</h1>
        <p className="text-xs text-slate-400">
          Official computerized payment receipts for tax, reimbursement, and record-keeping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Receipts List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300">
              Receipt History ({payments.length})
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {payments.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedReceipt(p)}
                className={`p-4 cursor-pointer transition-colors flex items-center justify-between text-xs ${
                  selectedReceipt?.id === p.id ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-slate-850'
                }`}
              >
                <div>
                  <p className="font-bold text-white">{p.receipt_number}</p>
                  <p className="text-[11px] text-slate-400">Date: {p.payment_date}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-400">₹{p.amount.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-400 uppercase">{p.payment_method.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printable Official Receipt View */}
        <div className="lg:col-span-7">
          {selectedReceipt && resident ? (
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-300">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl tracking-tight text-slate-950">
                      DEVI HOSTELS
                    </span>
                    <span className="text-[10px] bg-slate-900 text-amber-400 font-bold px-1.5 py-0.5 rounded">
                      OFFICIAL RECEIPT
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Shamshabad, Hyderabad, Telangana 501218 • Near RGIA
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Proprietor: Marpina Pradeep • Phone: +91 98480 12345
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-slate-500">RECEIPT NO.</p>
                  <p className="font-mono text-sm font-black text-slate-900">{selectedReceipt.receipt_number}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Date: {selectedReceipt.payment_date}</p>
                </div>
              </div>

              {/* Resident Allocation Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Received From:</p>
                  <p className="font-bold text-slate-900 text-sm">{resident.full_name}</p>
                  <p className="font-mono text-amber-800 font-bold mt-0.5">RESIDENT ID: {resident.resident_id}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Assigned Location:</p>
                  <p className="font-semibold text-slate-900">Branch {resident.current_branch_code}</p>
                  <p className="text-slate-700">Room {resident.current_room_number} (Bed {resident.current_bed_number})</p>
                </div>
              </div>

              {/* Payment Details Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 p-2.5 font-bold flex justify-between">
                  <span>Description</span>
                  <span>Amount (INR)</span>
                </div>
                <div className="p-3 flex justify-between border-b border-slate-200">
                  <span>Hostel Monthly Accommodation & Mess Charges</span>
                  <span className="font-mono font-bold">₹{selectedReceipt.amount.toLocaleString()}.00</span>
                </div>
                <div className="p-3 bg-slate-50 flex justify-between font-bold text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-emerald-800">₹{selectedReceipt.amount.toLocaleString()}.00</span>
                </div>
              </div>

              {/* Verification & Method */}
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Payment Method:</strong> <span className="uppercase">{selectedReceipt.payment_method.replace('_', ' ')}</span></p>
                <p><strong>Bank Transaction Ref:</strong> <span className="font-mono">{selectedReceipt.transaction_reference}</span></p>
                <p className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified and crediting towards account settlement.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <p>Computer generated receipt • Valid without physical signature</p>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              Select a receipt on the left to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
