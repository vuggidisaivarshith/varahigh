'use client';

import React, { useState, useEffect } from 'react';
import { ReminderItem } from '@/lib/data/financials-repo';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import { Bell, Plus, CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react';

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [branchCode, setBranchCode] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReminderItem['category']>('water_filter');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<ReminderItem['priority']>('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDueDate(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reminders');
      const json = await res.json();
      if (json.success) setReminders(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await fetch('/api/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchReminders();
    } catch {
      // ignore
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_code: branchCode,
          title,
          category,
          due_date: dueDate,
          priority,
          assigned_to: assignedTo || 'Warden on Duty',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setTitle('');
        setAssignedTo('');
        fetchReminders();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-4">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            HOSTEL MAINTENANCE & TASK PROTOCOL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
            Operational Reminders & Audits
          </h1>
          <p className="text-xs text-[#766D7C]">
            Water filter servicing, diesel generator fuel checks, safety audits, and task reminders.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary-navy text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task Reminder</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#302343]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card-editorial max-w-lg w-full p-6 bg-[#FFFFFF] border border-[#E9E1ED] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#302343]">Create Operational Reminder</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs font-mono text-[#766D7C] hover:text-[#302343]"
              >
                Cancel ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                  Task / Reminder Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Inspect water overhead tanks and geyser circuits"
                  className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Branch
                  </label>
                  <select
                    value={branchCode}
                    onChange={(e) => setBranchCode(parseInt(e.target.value, 10))}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  >
                    {DEVI_BRANCHES.map((b) => (
                      <option key={b.branch_code} value={b.branch_code}>
                        Branch {b.branch_code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  >
                    <option value="water_filter">RO Water Filter</option>
                    <option value="diesel_refill">Generator Diesel</option>
                    <option value="safety_inspection">Safety & CCTV</option>
                    <option value="pest_control">Pest Control</option>
                    <option value="rent_due">Rent Cycle Notice</option>
                    <option value="license_renewal">Hostel License</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                  Assigned Staff Member
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. V. Ramesh Babu"
                  className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost-luxury text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-navy text-xs py-2 px-5"
                >
                  {submitting ? 'Saving...' : 'Add Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-[#766D7C] text-xs font-mono">
            Loading reminders...
          </div>
        ) : reminders.length === 0 ? (
          <div className="card-editorial p-12 text-center text-[#766D7C] text-xs font-mono bg-[#FFFFFF]">
            No pending task reminders.
          </div>
        ) : (
          reminders.map((r) => (
            <div
              key={r.id}
              className={`card-editorial p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                r.status === 'completed' ? 'bg-[#F8F4FA]/60 opacity-70' : 'bg-[#FFFFFF]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggle(r.id)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    r.status === 'completed'
                      ? 'bg-[#79618E] border-[#79618E] text-[#FFFFFF]'
                      : 'border-[#E9E1ED] hover:border-[#302343]'
                  }`}
                >
                  {r.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#766D7C]">
                      Branch {r.branch_code}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      r.priority === 'urgent'
                        ? 'bg-[#FDF2F2] text-[#9B1C1C]'
                        : r.priority === 'high'
                        ? 'bg-[#FDF6F0] text-[#9C4221]'
                        : 'bg-[#F8F4FA] text-[#766D7C]'
                    }`}>
                      {r.priority}
                    </span>
                    <span className="text-[10px] font-mono text-[#766D7C]">
                      {r.category.replace('_', ' ')}
                    </span>
                  </div>

                  <p className={`text-sm font-bold ${
                    r.status === 'completed' ? 'line-through text-[#766D7C]' : 'text-[#302343]'
                  }`}>
                    {r.title}
                  </p>

                  <p className="text-xs text-[#766D7C] flex items-center gap-3">
                    <span>Due: <strong className="text-[#302343] font-mono">{r.due_date}</strong></span>
                    <span>Assigned: <strong className="text-[#302343]">{r.assigned_to}</strong></span>
                  </p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleToggle(r.id)}
                  className="btn-ghost-luxury text-xs py-1.5 px-3 whitespace-nowrap"
                >
                  {r.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
