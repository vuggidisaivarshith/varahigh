'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { VERIFIED_CONTACTS } from '@/lib/data/branches';

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'owner' | 'branch_manager' | 'accountant' | 'warden';
  assigned_branch_codes: number[];
  status: 'active' | 'inactive';
  created_at: string;
}

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New staff form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'branch_manager' | 'accountant' | 'warden'>('warden');
  const [selectedBranches, setSelectedBranches] = useState<number[]>([1]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff');
      const json = await res.json();
      if (json.success) setStaffList(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          role,
          assigned_branch_codes: [1],
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to add staff member.');
      }

      await fetchStaff();
      setIsModalOpen(false);
      setFullName('');
      setEmail('');
      setPhone('');
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (staff: StaffMember) => {
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: staff.id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchStaff();
      }
    } catch {
      // ignore
    }
  };

  const filteredStaff = staffList.filter((s) => {
    if (roleFilter !== 'all' && s.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F8F4FA]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-6">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
            STAFF &amp; ACCESS CONTROL (BRANCH 1)
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
            Staff Management &amp; Role Access Control
          </h1>
          <p className="text-xs text-[#766D7C] font-mono">
            Proprietor: <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong> ({VERIFIED_CONTACTS.primary_phone}) • Varahi Girls Hostel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStaff}
            className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] hover:bg-[#F8F4FA] text-[#302343] text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#79618E]' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>
      </div>

      {/* Role Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Staff' },
          { id: 'owner', label: '👑 Owner / Super Admin' },
          { id: 'warden', label: '🛡️ Resident Lady Wardens' },
          { id: 'accountant', label: '💰 Accountants' },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setRoleFilter(r.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              roleFilter === r.id
                ? 'bg-[#79618E] text-[#FFFFFF] font-bold shadow-xs'
                : 'bg-[#FFFFFF] border border-[#E9E1ED] text-[#766D7C] hover:text-[#302343]'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Staff Table */}
      <div className="rounded-2xl border border-[#E9E1ED] overflow-hidden bg-[#FFFFFF] shadow-xs">
        <table className="w-full text-left text-sm text-[#332C38]">
          <thead className="bg-[#F8F4FA] text-xs uppercase font-mono font-bold text-[#302343] border-b border-[#E9E1ED]">
            <tr>
              <th className="px-6 py-4">Staff Member</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E1ED]">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-[#F8F4FA]/60 transition">
                <td className="px-6 py-4">
                  <p className="font-bold text-[#302343] text-sm">{staff.full_name}</p>
                  <p className="text-[11px] font-mono text-[#766D7C]">ID: {staff.id}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    staff.role === 'owner'
                      ? 'bg-[#C6A46A]/20 text-[#302343] border border-[#C6A46A]/30'
                      : staff.role === 'warden'
                      ? 'bg-[#D9C8E8]/40 text-[#79618E] border border-[#D9C8E8]'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {staff.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F8F4FA] border border-[#E9E1ED] text-[#302343]">
                    Branch 1
                  </span>
                </td>
                <td className="px-6 py-4 text-xs space-y-0.5">
                  <p className="text-[#302343] flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-[#79618E]" /> {staff.phone}
                  </p>
                  <p className="text-[#766D7C] flex items-center gap-1 font-mono">
                    <Mail className="w-3 h-3 text-[#C6A46A]" /> {staff.email}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    staff.status === 'active' ? 'text-emerald-700' : 'text-[#766D7C]'
                  }`}>
                    ● {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {staff.role !== 'owner' && (
                    <button
                      onClick={() => handleToggleStatus(staff)}
                      className="text-xs text-[#79618E] hover:underline transition font-bold"
                    >
                      {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302343]/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#F8F4FA] text-[#79618E] border border-[#E9E1ED]">
                  <UserCheck className="w-5 h-5 text-[#79618E]" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-[#302343] text-base">Add New Staff Member</h3>
                  <p className="text-xs text-[#766D7C]">Configure role permissions for Branch 1</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#766D7C] hover:text-[#302343] transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono font-bold text-[#302343] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. P. Sunitha Reddy"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-[#302343] text-sm focus:outline-none focus:border-[#79618E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono font-bold text-[#302343] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sunitha@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-[#302343] text-sm focus:outline-none focus:border-[#79618E]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono font-bold text-[#302343] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9848011222"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-[#302343] text-sm focus:outline-none focus:border-[#79618E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono font-bold text-[#302343] mb-1">
                  Role Category *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] text-[#302343] text-sm focus:outline-none focus:border-[#79618E]"
                >
                  <option value="warden">Resident Lady Warden (Hostel Management &amp; Care)</option>
                  <option value="accountant">Accountant (Financial Ledger Access)</option>
                  <option value="branch_manager">Branch Manager (Branch Operations)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E9E1ED]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost-luxury py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-bold text-xs transition shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
