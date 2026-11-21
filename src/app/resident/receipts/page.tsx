'use client';

import React, { useState, useEffect } from 'react';
import { ResidentPayment, Resident } from '@/types/database';
import { Receipt, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { VERIFIED_CONTACTS, VARAHI_BRANCHES } from '@/lib/data/branches';

export default function ResidentReceiptsPage() {
  const [payments, setPayments] = useState<ResidentPayment[]>([]);
  const [resident, setResident] = useState<Resident | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ResidentPayment | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      const match = document.cookie.match(/(?:devi|varahi)_resident_id=([^;]+)/);
      const residentId = match ? match[1] : 'VG1-1-00001';
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

  const branch = VARAHI_BRANCHES[0];

  return (
    <div className="space-y-8 bg-[#F8F4FA]">
      <div className="border-b border-[#E9E1ED] pb-4">
        <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
          PAYMENT CONFIRMATIONS
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
          Digital Payment Receipts
        </h1>
        <p className="text-xs text-[#766D7C]">
          Official computerized payment receipts for records, employer reimbursement, and accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Receipts List */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-[#F8F4FA] border-b border-[#E9E1ED]">
            <span className="text-xs font-mono font-bold text-[#302343]">
              Receipt History ({payments.length})
            </span>
          </div>

          <div className="divide-y divide-[#E9E1ED]">
            {payments.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedReceipt(p)}
                className={`p-4 cursor-pointer transition-colors flex items-center justify-between text-xs ${
                  selectedReceipt?.id === p.id
                    ? 'bg-[#D9C8E8]/20 border-l-4 border-[#79618E]'
                    : 'hover:bg-[#F8F4FA]/60'
                }`}
              >
                <div>
                  <p className="font-bold text-[#302343]">{p.receipt_number}</p>
                  <p className="text-[11px] text-[#766D7C] font-mono">Date: {p.payment_date}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-700">₹{p.amount.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-[#766D7C] uppercase font-mono">{p.payment_method.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printable Official Receipt View */}
        <div className="lg:col-span-7">
          {selectedReceipt && resident ? (
            <div className="bg-[#FFFFFF] text-[#302343] rounded-2xl p-6 sm:p-8 shadow-md space-y-6 border border-[#E9E1ED]">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-[#E9E1ED] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-xl tracking-tight text-[#302343]">
                      VARAHI GIRLS HOSTEL
                    </span>
                    <span className="text-[10px] bg-[#302343] text-[#FFFFFF] font-mono font-bold px-2 py-0.5 rounded">
                      OFFICIAL RECEIPT
                    </span>
                  </div>
                  <p className="text-[11px] text-[#766D7C] mt-1 font-mono">
                    {branch.address_line1}, {branch.city} — {branch.pincode}
                  </p>
                  <p className="text-[11px] text-[#766D7C] font-mono">
                    Proprietor: {VERIFIED_CONTACTS.owner_proprietor} • Phone: {VERIFIED_CONTACTS.primary_phone}
                  </p>
                </div>

                <div className="text-right font-mono">
                  <p className="text-xs text-[#766D7C]">RECEIPT NO.</p>
                  <p className="text-sm font-bold text-[#302343]">{selectedReceipt.receipt_number}</p>
                  <p className="text-[11px] text-[#766D7C] mt-1">Date: {selectedReceipt.payment_date}</p>
                </div>
              </div>

              {/* Resident Allocation Info */}
              <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[#766D7C] font-medium">Received From:</p>
                  <p className="font-bold text-[#302343] text-sm">{resident.full_name}</p>
                  <p className="font-mono text-[#79618E] font-bold mt-0.5">RESIDENT ID: {resident.resident_id}</p>
                </div>
                <div>
                  <p className="text-[#766D7C] font-medium">Assigned Location:</p>
                  <p className="font-semibold text-[#302343]">Branch 1 (Girls Hostel)</p>
                  <p className="text-[#766D7C]">Room {resident.current_room_number} (Bed {resident.current_bed_number})</p>
                </div>
              </div>

              {/* Payment Details Table */}
              <div className="border border-[#E9E1ED] rounded-xl overflow-hidden text-xs">
                <div className="bg-[#F8F4FA] p-2.5 font-mono font-bold text-[#302343] flex justify-between">
                  <span>Description</span>
                  <span>Amount (INR)</span>
                </div>
                <div className="p-3 flex justify-between border-b border-[#E9E1ED]">
                  <span>Hostel Monthly Accommodation &amp; Mess Buffet Tariff</span>
                  <span className="font-mono font-bold">₹{selectedReceipt.amount.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="p-3 bg-[#F8F4FA] flex justify-between font-bold text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-emerald-700">₹{selectedReceipt.amount.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Verification & Method */}
              <div className="text-xs text-[#332C38] space-y-1">
                <p><strong>Payment Method:</strong> <span className="uppercase font-mono">{selectedReceipt.payment_method.replace('_', ' ')}</span></p>
                <p><strong>Bank Transaction Ref:</strong> <span className="font-mono">{selectedReceipt.transaction_reference}</span></p>
                <p className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified and credited towards account ledger.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E9E1ED] flex items-center justify-between text-xs text-[#766D7C]">
                <p>Computer generated receipt • Valid without physical signature</p>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-[#302343] hover:bg-[#79618E] text-[#FFFFFF] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#766D7C] bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl">
              Select a receipt on the left to preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
