'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Resident, Bed, Complaint } from '@/types/database';
import { DEVI_BRANCHES } from '@/lib/data/branches';
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
  const [transferReason, setTransferReason] = useState('Room upgrade / shift timing adjustment');

  // Checkout State
  const [checkoutNotes, setCheckoutNotes] = useState('Normal notice period completed. Room in clean condition.');

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

  // Fetch beds for transfer destination
  useEffect(() => {
    const fetchDestBeds = async () => {
      const res = await fetch(`/api/inventory/beds?branch_code=${newBranchCode}&room_number=${newRoomNumber}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setAvailableBeds(json.data);
        const vacant = json.data.find((b: Bed) => b.status === 'vacant');
        if (vacant) setNewBedId(vacant.id);
        else setNewBedId(json.data[0].id);
      }
    };
    fetchDestBeds();
  }, [newBranchCode, newRoomNumber]);

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/residents/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: selectedResidentId,
          new_branch_code: newBranchCode,
          new_floor_number: newFloorNumber,
          new_room_number: newRoomNumber,
          new_bed_id: newBedId,
          reason: transferReason,
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
    setStatusMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/residents/checkout', {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
          Operational Workflows
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Transfers, Check-Outs & Maintenance Operations
        </h1>
        <p className="text-xs text-slate-400">
          Execute room transfers while preserving permanent DEVI Resident IDs, process checkouts, and dispatch repairs.
        </p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex gap-2 max-w-md">
        <button
          onClick={() => setActiveTab('transfer')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'transfer' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Room/Branch Transfer
        </button>
        <button
          onClick={() => setActiveTab('checkout')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'checkout' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LogOut className="w-3.5 h-3.5" /> Check-Out
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'complaints' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" /> Complaints ({complaints.filter(c => c.status !== 'resolved').length})
        </button>
      </div>

      {/* TAB 1: Transfer Workflow */}
      {activeTab === 'transfer' && (
        <form onSubmit={handleExecuteTransfer} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-3xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-500" />
            Execute Room or Branch Transfer
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Active Resident *
              </label>
              <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.resident_id} — {r.full_name} (Current: Branch {r.current_branch_code}, Room {r.current_room_number})
                  </option>
                ))}
              </select>
            </div>

            {selectedResident && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <p><strong>Resident:</strong> {selectedResident.full_name} ({selectedResident.resident_id})</p>
                <p><strong>Current Allotment:</strong> Branch {selectedResident.current_branch_code}, Floor {selectedResident.current_floor_number}, Room {selectedResident.current_room_number} (Bed {selectedResident.current_bed_number})</p>
                <p className="text-amber-400 font-semibold text-[11px]">
                  ✓ Note: Resident ID &quot;{selectedResident.resident_id}&quot; will remain permanently unchanged across transfers.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">New Branch *</label>
                <select
                  value={newBranchCode}
                  onChange={(e) => setNewBranchCode(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {DEVI_BRANCHES.map((b) => (
                    <option key={b.branch_code} value={b.branch_code}>
                      Branch {b.branch_code} ({b.gender_category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">New Floor *</label>
                <select
                  value={newFloorNumber}
                  onChange={(e) => setNewFloorNumber(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>Floor 1</option>
                  <option value={2}>Floor 2</option>
                  <option value={3}>Floor 3</option>
                  <option value={4}>Floor 4</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">New Room *</label>
                <select
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={`${newFloorNumber}01`}>Room {newFloorNumber}01</option>
                  <option value={`${newFloorNumber}02`}>Room {newFloorNumber}02</option>
                  <option value={`${newFloorNumber}03`}>Room {newFloorNumber}03</option>
                  <option value={`${newFloorNumber}04`}>Room {newFloorNumber}04</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">New Bed Allotment *</label>
                <select
                  value={newBedId}
                  onChange={(e) => setNewBedId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.status === 'occupied' || b.status === 'maintenance'}>
                      Bed {b.bed_number} ({b.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transfer Reason / Remarks</label>
              <input
                type="text"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder="Reason for room change..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            {loading ? 'Processing Transfer...' : 'Confirm Transfer & Reallocate Bed'}
          </button>
        </form>
      )}

      {/* TAB 2: Check-Out Workflow */}
      {activeTab === 'checkout' && (
        <form onSubmit={handleExecuteCheckout} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-2xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <LogOut className="w-5 h-5 text-rose-500" />
            Execute Resident Check-Out & Release Bed
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Resident to Check-Out *
              </label>
              <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.resident_id} — {r.full_name} (Branch {r.current_branch_code}, Bed {r.current_bed_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Settlement & Inspection Notes
              </label>
              <textarea
                rows={3}
                value={checkoutNotes}
                onChange={(e) => setCheckoutNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
          >
            {loading ? 'Processing...' : 'Complete Check-Out & Release Bed to Vacant Inventory'}
          </button>
        </form>
      )}

      {/* TAB 3: Maintenance Tickets */}
      {activeTab === 'complaints' && (
        <div className="space-y-4 max-w-4xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-amber-500" />
            Resident Maintenance & Repair Tickets
          </h3>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                No active complaints reported.
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{c.title}</span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Resident: <strong className="text-slate-200">{c.resident_name}</strong> ({c.devi_resident_id}) • Branch {c.branch_code}, Room {c.room_number}
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      c.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {c.description}
                  </p>

                  {c.status !== 'resolved' && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleResolveComplaint(c.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Mark Ticket Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOperationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading operations...</div>}>
      <OperationsContent />
    </Suspense>
  );
}
