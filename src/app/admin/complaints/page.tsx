'use client';

import React, { useState, useEffect } from 'react';
import { Complaint } from '@/types/database';
import { LifeBuoy, CheckCircle2, Clock, AlertCircle, Filter, ArrowRight } from 'lucide-react';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/complaints');
      const json = await res.json();
      if (json.success) setComplaints(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = filterStatus === 'all'
    ? complaints
    : complaints.filter((c) => c.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
        <div>
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            MAINTENANCE & RESOLUTION DESK
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
            Resident Complaints & Repairs
          </h1>
          <p className="text-xs text-[#718096]">
            Tracks electrical, plumbing, Wi-Fi, food, and housekeeping tickets raised by residents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Tickets</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#718096] text-xs font-mono">
          Loading maintenance tickets...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-editorial p-12 text-center text-[#718096] text-xs font-mono bg-[#FFFFFF]">
          No complaints registered under this status.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className="card-editorial p-5 bg-[#FFFFFF] border border-[#E5E0D7] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E0D7] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#142B45]">
                    {c.ticket_number || `TKT-${c.id.slice(-4)}`}
                  </span>
                  <span className="badge-mono text-[9px] uppercase border-[#D6A85F]">
                    {c.category}
                  </span>
                  <span className="font-mono text-[10px] text-[#718096]">
                    Branch {c.branch_code} • Room {c.room_number}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                    c.status === 'resolved'
                      ? 'bg-[#EBF2F0] text-[#1D4038]'
                      : c.status === 'in_progress'
                      ? 'bg-[#FDF6F0] text-[#9C4221]'
                      : 'bg-[#FDF2F2] text-[#9B1C1C]'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-base font-bold text-[#142B45]">{c.title}</h3>
                <p className="text-xs text-[#263447] mt-1 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-2 border-t border-[#E5E0D7] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#718096] gap-2">
                <p>
                  Resident: <strong className="text-[#142B45]">{c.resident_name}</strong> (<span className="font-mono text-[11px]">{c.devi_resident_id}</span>)
                </p>
                <p className="font-mono text-[11px]">
                  Logged: {c.created_at.split('T')[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
