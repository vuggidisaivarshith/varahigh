'use client';

import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintCategory, Resident } from '@/types/database';
import { LifeBuoy, Plus, CheckCircle2, Clock, Send, AlertCircle, X } from 'lucide-react';

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
    const match = document.cookie.match(/(?:devi|varahi)_resident_id=([^;]+)/);
    const residentId = match ? match[1] : 'VG1-1-00001';
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
    <div className="space-y-8 max-w-4xl mx-auto bg-[#F8F4FA]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-4">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
            RESIDENT ASSISTANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
            Support &amp; Maintenance Requests
          </h1>
          <p className="text-xs text-[#766D7C]">
            Report plumbing, geyser, Wi-Fi, cleaning, or mess issues directly to the resident warden.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Maintenance Ticket
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Modal for new ticket */}
      {showModal && (
        <div className="fixed inset-0 bg-[#302343]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
              <h3 className="text-xl font-serif font-bold text-[#302343]">Create Maintenance Ticket</h3>
              <button onClick={() => setShowModal(false)} className="text-[#766D7C] hover:text-[#302343]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
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
                <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Geyser water not heating in bathroom"
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-4 py-2.5 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide specific details to help the maintenance technician..."
                  className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl p-3 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost-luxury py-2 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] text-xs font-bold shadow-xs transition-colors"
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
          <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-12 text-center text-xs text-[#766D7C]">
            No maintenance tickets on file. Click &quot;New Maintenance Ticket&quot; if you need assistance.
          </div>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-5 sm:p-6 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8F4FA] text-[#79618E] border border-[#E9E1ED]">
                  {c.category}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full capitalize ${
                  c.status === 'resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : c.status === 'in_progress'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="text-base font-serif font-bold text-[#302343]">{c.title}</h3>
              <p className="text-xs text-[#332C38]">{c.description}</p>

              {c.resolution_notes && (
                <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
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
