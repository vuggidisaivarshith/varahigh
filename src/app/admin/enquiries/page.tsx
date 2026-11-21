'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Enquiry, EnquiryStatus, CustomerCategory } from '@/types/database';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Plane,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [remarksText, setRemarksText] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (branchFilter !== 'all') params.append('branch_id', branchFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/enquiries?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [branchFilter, categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleUpdateStatus = async (id: string, newStatus: EnquiryStatus) => {
    setUpdating(true);
    setActionMessage('');
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          internal_remarks: remarksText || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Status updated to "${newStatus}"!`);
        fetchEnquiries();
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({
            ...selectedEnquiry,
            status: newStatus,
            internal_remarks: remarksText || selectedEnquiry.internal_remarks,
          });
        }
      }
    } catch (err) {
      setActionMessage((err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
              Staff & Management Portal
            </span>
            <span className="text-xs text-slate-400">All 5 Branches</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Admission Enquiries Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Owner: <strong>Marpina Pradeep</strong> • Shamshabad, Hyderabad
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEnquiries}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            Refresh
          </button>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
          >
            Admin Overview
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate by name, phone, college, or employer..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Filter by Branch
            </label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All 5 Branches</option>
              {DEVI_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  Branch {b.branch_code}: {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Customer Category
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
              Enquiry Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Leads</option>
              <option value="contacted">Contacted</option>
              <option value="visited">Visited Campus</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Table & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table of Enquiries */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Showing {enquiries.length} Enquiries
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Loading enquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-2">
              <p>No enquiries found matching your filter criteria.</p>
              <button
                onClick={() => {
                  setBranchFilter('all');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="text-amber-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {enquiries.map((enq) => {
                const branchObj = DEVI_BRANCHES.find((b) => b.id === enq.preferred_branch_id);
                const isSelected = selectedEnquiry?.id === enq.id;

                return (
                  <div
                    key={enq.id}
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setRemarksText(enq.internal_remarks || '');
                      setActionMessage('');
                    }}
                    className={`p-4 sm:p-5 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected ? 'bg-amber-500/10 border-l-4 border-amber-500' : 'hover:bg-slate-850'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {enq.full_name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          enq.category === 'student'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {enq.category === 'student' ? '🎓 Student' : '✈️ Airport Staff'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          enq.status === 'new'
                            ? 'bg-rose-500/20 text-rose-300'
                            : enq.status === 'contacted'
                            ? 'bg-amber-500/20 text-amber-300'
                            : enq.status === 'visited'
                            ? 'bg-blue-500/20 text-blue-300'
                            : enq.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {enq.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-slate-300">
                          <Phone className="w-3 h-3 text-amber-400" />
                          {enq.phone}
                        </span>
                        <span>
                          {branchObj ? `Branch ${branchObj.branch_code}: ${branchObj.name}` : 'Preferred Branch'}
                        </span>
                        <span>Move-in: {enq.expected_joining_date}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {enq.category === 'student'
                          ? `College: ${enq.student_college_name || 'N/A'} • ${enq.student_course || ''}`
                          : `Employer: ${enq.employee_company || 'N/A'} • Shift: ${enq.employee_shift_timing || ''}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Inspection Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {selectedEnquiry ? (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Enquiry Details
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedEnquiry.full_name}
                </h3>
                <p className="text-xs text-slate-400">
                  Registered: {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleDateString() : 'Today'}
                </p>
              </div>

              {actionMessage && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {actionMessage}
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p><strong>Mobile:</strong> <a href={`tel:${selectedEnquiry.phone}`} className="text-amber-400 font-mono font-bold hover:underline">{selectedEnquiry.phone}</a></p>
                {selectedEnquiry.email && <p><strong>Email:</strong> {selectedEnquiry.email}</p>}
                <p><strong>Gender:</strong> <span className="capitalize">{selectedEnquiry.gender}</span></p>
                <p><strong>Emergency:</strong> {selectedEnquiry.emergency_contact_name} ({selectedEnquiry.emergency_contact_relation}) - {selectedEnquiry.emergency_contact_phone}</p>
                <p><strong>Sharing:</strong> {selectedEnquiry.room_sharing_preference.replace('_', ' ')}</p>
                <p><strong>Target Joining:</strong> {selectedEnquiry.expected_joining_date}</p>
              </div>

              {/* Category Specific */}
              <div className="space-y-1 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] font-bold uppercase text-amber-400 mb-1">
                  {selectedEnquiry.category === 'student' ? 'Academic Enrolment' : 'Airport Employment'}
                </p>
                {selectedEnquiry.category === 'student' ? (
                  <>
                    <p><strong>College:</strong> {selectedEnquiry.student_college_name || 'N/A'}</p>
                    <p><strong>Course:</strong> {selectedEnquiry.student_course || 'N/A'}</p>
                    <p><strong>Year:</strong> {selectedEnquiry.student_year || 'N/A'}</p>
                    <p><strong>Parent Phone:</strong> {selectedEnquiry.student_parent_phone || 'N/A'}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Company:</strong> {selectedEnquiry.employee_company || 'N/A'}</p>
                    <p><strong>Designation:</strong> {selectedEnquiry.employee_designation || 'N/A'}</p>
                    <p><strong>Shift:</strong> {selectedEnquiry.employee_shift_timing || 'N/A'}</p>
                    <p><strong>Badge / AEP ID:</strong> {selectedEnquiry.employee_id_number || 'N/A'}</p>
                  </>
                )}
              </div>

              {/* Internal Remarks */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Staff Remarks & Follow-up Notes
                </label>
                <textarea
                  rows={3}
                  value={remarksText}
                  onChange={(e) => setRemarksText(e.target.value)}
                  placeholder="e.g. Called candidate; confirmed 2-sharing room tour on Saturday..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase text-slate-400">
                  Advance Status:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id!, 'contacted')}
                    className="py-2 px-3 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30"
                  >
                    Mark Contacted
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id!, 'visited')}
                    className="py-2 px-3 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold hover:bg-blue-500/30"
                  >
                    Mark Visited
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id!, 'approved')}
                    className="py-2 px-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30"
                  >
                    Approve Admission
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id!, 'rejected')}
                    className="py-2 px-3 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-500/30"
                  >
                    Reject Lead
                  </button>
                </div>
              </div>

              {/* Convert to Admission Indicator */}
              {selectedEnquiry.status === 'approved' && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <p className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Ready for Resident Admission
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Lead is approved. Room & Bed allocation and Permanent DEVI Resident ID generation (e.g. DV1-1-00001) will execute in Phase 2.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-600" />
              <p>Select an enquiry from the left to view complete details, update status, and log staff remarks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
