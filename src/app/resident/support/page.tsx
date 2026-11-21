'use client';

import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintCategory, Resident } from '@/types/database';
import { LifeBuoy, Plus, CheckCircle2, Clock, Send, AlertCircle } from 'lucide-react';

export default function ResidentSupportPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [resident, setResident] = useState<Resident | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<ComplaintCategory>('plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchComplaints = async () => {
    const match = document.cookie.match(/devi_resident_id=([^;]+)/);
    const residentId = match ? match[1] : 'DV1-1-00001';
    const res = await fetch(`/api/residents/${residentId}`);
    const json = await res.json();
    if (json.success) {
      setComplaints(json.data.complaints || []);
      setResident(json.data.resident);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resident) return;
    setSubmitting(true);
    setFeedback('');

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: resident.resident_id,
          category,
          title,
          description,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('Maintenance request submitted successfully!');
        setShowModal(false);
        setTitle('');
        setDescription('');
        fetchComplaints();
      } else {
        setFeedback(data.error || 'Failed to submit request.');
      }
    } catch (err) {
      setFeedback((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Support & Maintenance Requests</h1>
          <p className="text-xs text-slate-400">
            Report plumbing, electrical, Wi-Fi, cleaning, or mess issues directly to the resident warden.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Maintenance Ticket
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Modal for new ticket */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Create Maintenance Ticket</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="plumbing">Plumbing / Tap / Geyser</option>
                  <option value="electrical">Electrical / Fan / Light / Socket</option>
                  <option value="wifi">High-Speed Wi-Fi / Internet</option>
                  <option value="food">Mess Dining / Food Quality</option>
                  <option value="cleaning">Room Housekeeping / Washroom Sanitization</option>
                  <option value="noise">Noise / Disturbance in Quiet Hours</option>
                  <option value="other">General Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Geyser water not heating in bathroom"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide specific details to help the maintenance technician..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500">
            No maintenance tickets on file. Click &quot;New Maintenance Ticket&quot; if you need assistance.
          </div>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                  {c.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  c.status === 'resolved'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : c.status === 'in_progress'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{c.title}</h3>
              <p className="text-xs text-slate-300">{c.description}</p>

              {c.resolution_notes && (
                <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                  <strong>Warden Resolution Notes:</strong> {c.resolution_notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
