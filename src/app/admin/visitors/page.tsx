'use client';

import React, { useState, useEffect } from 'react';
import { VisitorRecord } from '@/lib/data/financials-repo';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import { UserPlus, Plus, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [branchCode, setBranchCode] = useState<number>(1);
  const [deviResidentId, setDeviResidentId] = useState('');
  const [residentName, setResidentName] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [relation, setRelation] = useState('Parent');
  const [purpose, setPurpose] = useState('');
  const [inTime, setInTime] = useState('11:00');
  const [submitting, setSubmitting] = useState(false);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/visitors');
      const json = await res.json();
      if (json.success) setVisitors(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleCheckout = async (id: string) => {
    const timeNow = new Date().toTimeString().slice(0, 5);
    try {
      await fetch('/api/visitors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor_id: id, out_time: timeNow }),
      });
      fetchVisitors();
    } catch {
      // ignore
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone || !deviResidentId) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: `res-${deviResidentId}`,
          devi_resident_id: deviResidentId,
          resident_name: residentName || 'Resident',
          branch_code: branchCode,
          visitor_name: visitorName,
          visitor_phone: visitorPhone,
          relation,
          visit_date: new Date().toISOString().split('T')[0],
          in_time: inTime,
          purpose,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setVisitorName('');
        setVisitorPhone('');
        setDeviResidentId('');
        setResidentName('');
        setPurpose('');
        fetchVisitors();
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
            GATE ACCESS & VISITOR REGULATION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
            Visitor Gate Passes & Logs
          </h1>
          <p className="text-xs text-[#766D7C]">
            Record visiting parents, relatives, and official guests with digital gate pass check-in/out timestamps.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary-navy text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Gate Pass</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#302343]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card-editorial max-w-lg w-full p-6 bg-[#FFFFFF] border border-[#E9E1ED] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#302343]">Issue Visitor Gate Pass</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs font-mono text-[#766D7C] hover:text-[#302343]"
              >
                Cancel ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
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
                    In Time
                  </label>
                  <input
                    type="time"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Resident ID (DV1-1-XXXXX) *
                  </label>
                  <input
                    type="text"
                    required
                    value={deviResidentId}
                    onChange={(e) => setDeviResidentId(e.target.value)}
                    placeholder="e.g. DV1-1-00001"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Resident Full Name
                  </label>
                  <input
                    type="text"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    placeholder="e.g. Aditya Sai Krishna"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Visitor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g. K. Venkat Rao"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Visitor Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="e.g. 9849111220"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Relation
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-2.5 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Friend / Colleague">Friend / Colleague</option>
                    <option value="Vendor / Delivery">Vendor / Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#302343] mb-1">
                    Visit Purpose
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Family meeting"
                    className="w-full bg-[#FFFFFF] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] focus:ring-1 focus:ring-[#79618E]"
                  />
                </div>
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
                  {submitting ? 'Generating...' : 'Issue Gate Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visitors Table */}
      <div className="card-editorial overflow-hidden bg-[#FFFFFF] border border-[#E9E1ED]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#302343] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Pass No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Visitor Name</th>
                <th className="py-3 px-4">Resident Visited</th>
                <th className="py-3 px-4">In Time</th>
                <th className="py-3 px-4">Out Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1ED] text-[#332C38]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#766D7C] font-mono">
                    Loading visitor records...
                  </td>
                </tr>
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#766D7C] font-mono">
                    No visitor records logged today.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-[#F8F4FA]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#302343]">
                      {v.gate_pass_no}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#766D7C]">{v.visit_date}</td>
                    <td className="py-3 px-4 font-mono">Branch {v.branch_code}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#302343]">{v.visitor_name}</p>
                      <p className="font-mono text-[10px] text-[#766D7C]">{v.visitor_phone} • {v.relation}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#302343]">{v.resident_name}</p>
                      <p className="font-mono text-[10px] text-[#766D7C]">{v.devi_resident_id}</p>
                    </td>
                    <td className="py-3 px-4 font-mono">{v.in_time}</td>
                    <td className="py-3 px-4 font-mono text-[#766D7C]">{v.out_time || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize ${
                        v.status === 'checked_out'
                          ? 'bg-[#EBF2F0] text-[#1D4038]'
                          : 'bg-[#FDF6F0] text-[#9C4221]'
                      }`}>
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {v.status === 'checked_in' && (
                        <button
                          onClick={() => handleCheckout(v.id)}
                          className="btn-ghost-luxury py-1 px-2.5 text-[10px]"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
