'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Resident, CustomerCategory } from '@/types/database';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import {
  Users,
  Search,
  Filter,
  Phone,
  Building,
  GraduationCap,
  Plane,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function AdminResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (branchFilter !== 'all') params.append('branch_code', branchFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/residents?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setResidents(json.data);
        if (json.data.length > 0 && !selectedResident) {
          setSelectedResident(json.data[0]);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, [branchFilter, categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResidents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
            Resident Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Central Resident Directory
          </h1>
          <p className="text-xs text-slate-400">
            All registered residents across all 5 branches with permanent DEVI Resident IDs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/admissions"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> New Admission
          </Link>
          <Link
            href="/admin/operations"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-800"
          >
            Operations & Transfers
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Resident ID (e.g. DV1-1-00001), resident name, phone..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Filter Branch
            </label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
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
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              <option value="student">🎓 College Students</option>
              <option value="airport_employee">✈️ RGIA Airport Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Residents</option>
              <option value="inactive">Checked-Out / Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Directory Table & Resident Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300">
              Total Residents ({residents.length})
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">
              Loading resident directory...
            </div>
          ) : residents.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No residents found matching criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {residents.map((r) => {
                const isSelected = selectedResident?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedResident(r)}
                    className={`p-4 sm:p-5 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-slate-850'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-white">{r.full_name}</span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {r.resident_id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.category === 'student' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {r.category === 'student' ? '🎓 Student' : '✈️ Airport Staff'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">
                        Branch {r.current_branch_code} • Room {r.current_room_number} (Bed {r.current_bed_number}) • Phone: <span className="font-mono text-slate-300">+91 {r.phone}</span>
                      </p>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-xs font-mono font-bold text-white">₹{r.agreed_monthly_rent.toLocaleString()}/mo</p>
                        <p className="text-[10px] text-slate-400">Anchor: {r.billing_anchor_day}th</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Resident Profile Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {selectedResident ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded">
                  {selectedResident.resident_id}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedResident.full_name}
                </h3>
                <p className="text-xs text-slate-400">
                  Admitted: {selectedResident.admission_date}
                </p>
              </div>

              {/* Physical Location */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <p className="font-bold text-amber-400 uppercase text-[10px]">Current Location</p>
                <p><strong>Branch:</strong> Branch Code {selectedResident.current_branch_code}</p>
                <p><strong>Floor:</strong> Floor {selectedResident.current_floor_number}</p>
                <p><strong>Room & Bed:</strong> Room {selectedResident.current_room_number} (Bed {selectedResident.current_bed_number})</p>
                <p><strong>Original Admission:</strong> Branch {selectedResident.initial_branch_code}, Floor {selectedResident.initial_floor_number}</p>
              </div>

              {/* Contact Info */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <p className="font-bold text-amber-400 uppercase text-[10px]">Contact & Emergency</p>
                <p><strong>Phone:</strong> +91 {selectedResident.phone}</p>
                <p><strong>Email:</strong> {selectedResident.email || 'N/A'}</p>
                <p><strong>Emergency:</strong> {selectedResident.emergency_contact_name} ({selectedResident.emergency_contact_relation}) - +91 {selectedResident.emergency_contact_phone}</p>
              </div>

              {/* Financial Snapshot */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <p className="font-bold text-amber-400 uppercase text-[10px]">Financial Ledger</p>
                <p><strong>Monthly Rent:</strong> ₹{selectedResident.agreed_monthly_rent.toLocaleString()}</p>
                <p><strong>Advance Credit:</strong> ₹{selectedResident.advance_balance.toLocaleString()}</p>
                <p><strong>Security Deposit:</strong> ₹{selectedResident.security_deposit.toLocaleString()}</p>
                <p><strong>Outstanding Balance:</strong> ₹{selectedResident.outstanding_balance.toLocaleString()}</p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/admin/operations?resident_id=${selectedResident.id}`}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  Transfer / Checkout Actions
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Select a resident to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
