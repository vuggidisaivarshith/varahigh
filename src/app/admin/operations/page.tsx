'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Resident, Bed, Complaint } from '@/types/database';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import {
  ArrowRightLeft,
  LogOut,
  LifeBuoy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building,
  UserCheck
} from 'lucide-react';

function OperationsContent() {
  const searchParams = useSearchParams();
  const prefillResidentId = searchParams.get('resident_id');

  const [residents, setResidents] = useState<Resident[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState<string>(prefillResidentId || '');

  // Transfer Form State
  const [newBranchCode, setNewBranchCode] = useState<number>(1);
  const [newFloorNumber, setNewFloorNumber] = useState<number>(1);
  const [newRoomNumber, setNewRoomNumber] = useState<string>('101');
  const [newBedId, setNewBedId] = useState<string>('');
  const [availableBeds, setAvailableBeds] = useState<Bed[]>([]);
  const [transferReason, setTransferReason] = useState('Room adjustment / floor change');

  // Checkout State
  const [checkoutNotes, setCheckoutNotes] = useState('Notice period completed. Room in clean condition.');

  const [activeTab, setActiveTab] = useState<'transfer' | 'checkout' | 'complaints'>('transfer');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInitialData = async () => {
    try {
      const [resRes, compRes] = await Promise.all([
        fetch('/api/residents?status=active'),
        fetch('/api/complaints'),
      ]);
      const [resJson, compJson] = await Promise.all([resRes.json(), compRes.json()]);
      if (resJson.success) {
        setResidents(resJson.data);
        if (!selectedResidentId && resJson.data.length > 0) {
          setSelectedResidentId(resJson.data[0].id);
        }
      }
      if (compJson.success) setComplaints(compJson.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch beds when target room changes
  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const res = await fetch(`/api/inventory/beds?branch_code=1&room_number=${newRoomNumber}`);
        const json = await res.json();
        if (json.success) {
          setAvailableBeds(json.data);
          const vacant = json.data.find((b: Bed) => b.status === 'vacant');
          if (vacant) setNewBedId(vacant.id);
          else if (json.data.length > 0) setNewBedId(json.data[0].id);
        }
      } catch {
        // ignore
      }
    };
    fetchBeds();
  }, [newRoomNumber]);

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResidentId || !newBedId) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/operations/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: selectedResidentId,
          target_branch_code: 1,
          target_floor_number: newFloorNumber,
          target_room_number: newRoomNumber,
          target_bed_id: newBedId,
          transfer_reason: transferReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute transfer.');
      }

      setStatusMessage({ type: 'success', text: data.message });
      fetchInitialData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResidentId) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/operations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: selectedResidentId,
          settlement_notes: checkoutNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute checkout.');
      }

      setStatusMessage({ type: 'success', text: data.message });
      fetchInitialData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComplaint = async (complaintId: string) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          resolution_notes: 'Inspected and repaired by hostel maintenance team.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInitialData();
      }
    } catch {
      // ignore
    }
  };

  const selectedResident = residents.find((r) => r.id === selectedResidentId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F8F4FA]">
      <div className="border-b border-[#E9E1ED] pb-4">
        <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
          OPERATIONAL WORKFLOWS
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
          Transfers, Check-Outs &amp; Maintenance Operations
        </h1>
        <p className="text-xs text-[#766D7C]">
          Execute room transfers while preserving permanent VARAHI Resident IDs, process checkouts, and dispatch maintenance.
        </p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-1.5 flex gap-2 max-w-md shadow-xs">
        <button
          onClick={() => setActiveTab('transfer')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'transfer' ? 'bg-[#79618E] text-[#FFFFFF] shadow-xs' : 'text-[#766D7C] hover:text-[#302343]'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Room Transfer
        </button>
        <button
          onClick={() => setActiveTab('checkout')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'checkout' ? 'bg-[#79618E] text-[#FFFFFF] shadow-xs' : 'text-[#766D7C] hover:text-[#302343]'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" /> Check-Out
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'complaints' ? 'bg-[#79618E] text-[#FFFFFF] shadow-xs' : 'text-[#766D7C] hover:text-[#302343]'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" /> Complaints ({complaints.filter(c => c.status !== 'resolved').length})
        </button>
      </div>

      {/* TAB 1: Transfer Workflow */}
      {activeTab === 'transfer' && (
        <form onSubmit={handleExecuteTransfer} className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
          <h3 className="text-lg font-serif font-bold text-[#302343] flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#79618E]" />
            Execute Room Transfer (Branch 1)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Select Resident *</label>
              <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              >
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.full_name} ({r.resident_id}) — Room {r.current_room_number} (Bed {r.current_bed_number})
                  </option>
                ))}
              </select>
            </div>

            {selectedResident && (
              <div className="p-4 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-xs space-y-1 text-[#332C38]">
                <p><strong>Current Bed:</strong> Room {selectedResident.current_room_number} (Bed {selectedResident.current_bed_number}) on Floor {selectedResident.current_floor_number}</p>
                <p><strong>Monthly Rent:</strong> ₹{selectedResident.agreed_monthly_rent.toLocaleString('en-IN')}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Target Floor *</label>
                <select
                  value={newFloorNumber}
                  onChange={(e) => {
                    const fl = parseInt(e.target.value, 10);
                    setNewFloorNumber(fl);
                    setNewRoomNumber(`${fl}01`);
                  }}
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
                >
                  <option value={1}>Floor 1</option>
                  <option value={2}>Floor 2</option>
                  <option value={3}>Floor 3</option>
                  <option value={4}>Floor 4</option>
                  <option value={5}>Floor 5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Target Room *</label>
                <input
                  type="text"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="e.g. 201"
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Target Bed *</label>
                <select
                  value={newBedId}
                  onChange={(e) => setNewBedId(e.target.value)}
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
                >
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.status === 'occupied'}>
                      Bed {b.bed_number} ({b.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Transfer Reason / Remarks</label>
              <input
                type="text"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-bold text-xs shadow-xs transition-all disabled:opacity-50"
              >
                {loading ? 'Processing Transfer...' : 'Confirm & Execute Transfer'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Check-out Workflow */}
      {activeTab === 'checkout' && (
        <form onSubmit={handleExecuteCheckout} className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
          <h3 className="text-lg font-serif font-bold text-[#302343] flex items-center gap-2">
            <LogOut className="w-5 h-5 text-rose-600" />
            Process Resident Check-Out &amp; Security Deposit Settlement
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Select Departing Resident *</label>
              <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              >
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.full_name} ({r.resident_id}) — Room {r.current_room_number} (Bed {r.current_bed_number})
                  </option>
                ))}
              </select>
            </div>

            {selectedResident && (
              <div className="p-4 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-xs space-y-2 text-[#332C38]">
                <p className="font-mono font-bold uppercase text-[10px] text-[#302343]">Financial Clearance</p>
                <div className="grid grid-cols-2 gap-2">
                  <p>Security Deposit to Refund: <strong>₹{selectedResident.security_deposit.toLocaleString('en-IN')}</strong></p>
                  <p>Outstanding Rent Balance: <strong className={selectedResident.outstanding_balance > 0 ? 'text-rose-600' : 'text-emerald-700'}>₹{selectedResident.outstanding_balance.toLocaleString('en-IN')}</strong></p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Settlement / Inventory Handover Notes</label>
              <textarea
                rows={3}
                value={checkoutNotes}
                onChange={(e) => setCheckoutNotes(e.target.value)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl p-3 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-[#FFFFFF] font-bold text-xs shadow-xs transition-all disabled:opacity-50"
              >
                {loading ? 'Closing Account...' : 'Confirm Check-Out & Free Bed'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: Maintenance & Complaints */}
      {activeTab === 'complaints' && (
        <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl">
          <h3 className="text-lg font-serif font-bold text-[#302343] flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-[#79618E]" />
            Hostel Maintenance &amp; Resident Assistance Requests
          </h3>

          {complaints.length === 0 ? (
            <p className="text-xs text-[#766D7C] py-8 text-center">No open complaints reported.</p>
          ) : (
            <div className="divide-y divide-[#E9E1ED]">
              {complaints.map((c) => (
                <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#302343]">{c.title}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#766D7C]">{c.description}</p>
                    <p className="text-[11px] font-mono text-[#766D7C]">
                      Reported by {c.resident_name} (Room {c.room_number}) on {c.created_at.split('T')[0]}
                    </p>
                  </div>

                  {c.status !== 'resolved' && (
                    <button
                      onClick={() => handleResolveComplaint(c.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[#FFFFFF] font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminOperationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#766D7C]">Loading operations...</div>}>
      <OperationsContent />
    </Suspense>
  );
}
