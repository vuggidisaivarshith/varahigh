'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Enquiry, EnquiryStatus, CustomerCategory } from '@/types/database';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
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
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleUpdateStatus = async (enquiryId: string, newStatus: EnquiryStatus) => {
    setUpdating(true);
    setActionMessage('');

    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          internal_remarks: remarksText,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setActionMessage(`Status updated to ${newStatus.toUpperCase()}`);
        fetchEnquiries();
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry({
            ...selectedEnquiry,
            status: newStatus,
            internal_remarks: remarksText,
          });
        }
      }
    } catch {
      setActionMessage('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F8F4FA]">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
              STAFF &amp; MANAGEMENT PORTAL
            </span>
            <span className="text-xs font-mono text-[#79618E] font-bold">Branch 1 (Girls Hostel)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343]">
            Admission Enquiries Pipeline
          </h1>
          <p className="text-xs text-[#766D7C] mt-0.5 font-mono">
            Proprietor: <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong> • Shamshabad, Hyderabad
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEnquiries}
            className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] hover:bg-[#F8F4FA] text-[#302343] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#79618E]' : ''}`} />
            Refresh
          </button>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-bold text-xs transition-colors shadow-xs"
          >
            Admin Overview
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#766D7C] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate by name, phone, college, or employer..."
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#302343] placeholder-[#766D7C] focus:outline-none focus:border-[#79618E]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-semibold text-xs transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E9E1ED]">
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#302343] mb-1">
              Customer Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
            >
              <option value="all">All Categories</option>
              <option value="student">🎓 College Students</option>
              <option value="airport_employee">✈️ RGIA Airport Staff / Working Women</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-[#302343] mb-1">
              Lead Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
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
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-[#F8F4FA] border-b border-[#E9E1ED] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#302343]">
              Enquiries ({enquiries.length})
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#766D7C] text-xs">
              Loading enquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center text-[#766D7C] text-xs space-y-2">
              <p>No enquiries found matching your filter criteria.</p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="text-[#79618E] font-bold hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E9E1ED]">
              {enquiries.map((enq) => {
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
                      isSelected ? 'bg-[#D9C8E8]/20 border-l-4 border-[#79618E]' : 'hover:bg-[#F8F4FA]/60'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#302343]">
                          {enq.full_name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          enq.category === 'student'
                            ? 'bg-[#D9C8E8]/40 text-[#79618E] border border-[#D9C8E8]'
                            : 'bg-[#C6A46A]/20 text-[#302343] border border-[#C6A46A]/30'
                        }`}>
                          {enq.category === 'student' ? '🎓 Student' : '✈️ Airport Staff'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          enq.status === 'new'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : enq.status === 'contacted'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : enq.status === 'visited'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : enq.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#F8F4FA] text-[#766D7C] border border-[#E9E1ED]'
                        }`}>
                          {enq.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#766D7C]">
                        <span className="flex items-center gap-1 font-mono text-[#302343]">
                          <Phone className="w-3 h-3 text-[#79618E]" />
                          {enq.phone}
                        </span>
                        <span>Branch 1 (Girls Hostel)</span>
                        <span>Move-in: {enq.expected_joining_date}</span>
                      </div>

                      <p className="text-[11px] text-[#766D7C] line-clamp-1">
                        {enq.category === 'student'
                          ? `College: ${enq.student_college_name || 'N/A'} • ${enq.student_course || ''}`
                          : `Employer: ${enq.employee_company || 'N/A'} • Shift: ${enq.employee_shift_timing || ''}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <ChevronRight className="w-5 h-5 text-[#766D7C]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Inspection Sidebar */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 shadow-xs space-y-6">
          {selectedEnquiry ? (
            <div className="space-y-6">
              <div className="border-b border-[#E9E1ED] pb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#79618E]">
                  Enquiry Details
                </span>
                <h3 className="text-xl font-serif font-bold text-[#302343] mt-1">
                  {selectedEnquiry.full_name}
                </h3>
                <p className="text-xs text-[#766D7C] font-mono">
                  Registered: {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleDateString() : 'Today'}
                </p>
              </div>

              {actionMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {actionMessage}
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-2 text-xs text-[#332C38] bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED]">
                <p><strong>Mobile:</strong> <a href={`tel:${selectedEnquiry.phone}`} className="text-[#79618E] font-mono font-bold hover:underline">{selectedEnquiry.phone}</a></p>
                {selectedEnquiry.email && <p><strong>Email:</strong> {selectedEnquiry.email}</p>}
                <p><strong>Gender:</strong> <span className="capitalize">{selectedEnquiry.gender}</span></p>
                <p><strong>Emergency:</strong> {selectedEnquiry.emergency_contact_name} ({selectedEnquiry.emergency_contact_relation}) - {selectedEnquiry.emergency_contact_phone}</p>
                <p><strong>Sharing:</strong> {selectedEnquiry.room_sharing_preference.replace('_', ' ')}</p>
                <p><strong>Target Joining:</strong> {selectedEnquiry.expected_joining_date}</p>
              </div>

              {/* Category Specific */}
              <div className="space-y-1 text-xs text-[#332C38] bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED]">
                <p className="text-[10px] font-mono font-bold uppercase text-[#302343] mb-1">
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
                    <p><strong>Badge ID:</strong> {selectedEnquiry.employee_id_number || 'N/A'}</p>
                  </>
                )}
              </div>

              {/* Internal Remarks */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-[#302343]">
                  Staff Remarks &amp; Follow-up Notes
                </label>
                <textarea
                  rows={3}
                  value={remarksText}
                  onChange={(e) => setRemarksText(e.target.value)}
                  placeholder="e.g. Called candidate; confirmed 3-sharing room inspection..."
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl p-3 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
                />
              </div>

              {/* Status Action Buttons */}
              <div className="space-y-2">
                <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">
                  Advance Status:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id!, 'contacted')}
                    className="py-2 px-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors"
                  >
                    Mark Contacted
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id!, 'visited')}
                    className="py-2 px-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    Mark Visited
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id!, 'approved')}
                    className="py-2 px-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    Approve Admission
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id!, 'rejected')}
                    className="py-2 px-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors"
                  >
                    Reject Lead
                  </button>
                </div>
              </div>

              {/* Convert to Admission Indicator */}
              {selectedEnquiry.status === 'approved' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-700" /> Ready for Resident Admission
                  </p>
                  <Link
                    href={`/admin/admissions?enquiry_id=${selectedEnquiry.id}&branch=1`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-[#302343] text-white text-xs font-bold hover:bg-[#79618E] transition-colors"
                  >
                    Proceed to Admission Desk
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-[#766D7C] text-xs space-y-2">
              <Users className="w-8 h-8 mx-auto text-[#766D7C]" />
              <p>Select an enquiry from the left to view complete details, update status, and log staff remarks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
