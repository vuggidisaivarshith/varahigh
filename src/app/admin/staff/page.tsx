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
  const [role, setRole] = useState<'branch_manager' | 'accountant' | 'warden'>('branch_manager');
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
          assigned_branch_codes: role === 'accountant' ? [1, 2, 3, 4, 5] : selectedBranches,
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
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link href="/admin" className="hover:text-amber-400 transition-colors">Admin</Link>
              <span>/</span>
              <span className="text-slate-200">Staff & Roles</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Shield className="w-6 h-6" />
              </span>
              Staff Management & Role-Based Access Control
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Proprietor: <strong>MARPINA PRADEEP</strong> • Manage authorized branch managers, accountants, wardens, and branch assignments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStaff}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
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
            { id: 'branch_manager', label: '🏢 Branch Managers' },
            { id: 'accountant', label: '💰 Accountants' },
            { id: 'warden', label: '🛡️ Wardens' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRoleFilter(r.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                roleFilter === r.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Staff Table */}
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-800/30">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Assigned Branches</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">{staff.full_name}</p>
                    <p className="text-[11px] font-mono text-slate-500">ID: {staff.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                      staff.role === 'owner'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : staff.role === 'branch_manager'
                        ? 'bg-blue-500/20 text-blue-300'
                        : staff.role === 'accountant'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {staff.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {staff.assigned_branch_codes.map((code) => (
                        <span key={code} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-200">
                          Branch {code}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs space-y-0.5">
                    <p className="text-slate-300 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" /> {staff.phone}
                    </p>
                    <p className="text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" /> {staff.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      staff.status === 'active' ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      ● {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {staff.role !== 'owner' && (
                      <button
                        onClick={() => handleToggleStatus(staff)}
                        className="text-xs text-slate-400 hover:text-white underline transition"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <UserCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-base">Add New Staff Member</h3>
                    <p className="text-xs text-slate-400">Configure role permissions and branch assignment</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateStaff} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-medium text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. K. Venkat Reddy"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-medium text-slate-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="staff@varahigirlshostel.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-medium text-slate-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 94940 XXXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-medium text-slate-400 mb-1">
                    Role Category *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="branch_manager">Branch Manager (Single Branch Control)</option>
                    <option value="accountant">Accountant (Central Financial Ledger Access)</option>
                    <option value="warden">Hostel Warden (Operations & Complaints)</option>
                  </select>
                </div>

                {role !== 'accountant' && (
                  <div>
                    <label className="block text-xs uppercase font-medium text-slate-400 mb-2">
                      Assigned Branch
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setSelectedBranches([code])}
                          className={`py-2 text-center rounded-xl text-xs font-bold border transition ${
                            selectedBranches.includes(code)
                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                              : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          Branch {code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Staff Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
