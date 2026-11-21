'use client';

import React, { useState, useEffect } from 'react';
import { AuditLogItem } from '@/lib/data/financials-repo';
import { History, Shield, Filter, Search } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit-logs');
      const json = await res.json();
      if (json.success) setLogs(json.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
        <div>
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            IMMUTABLE SECURITY TRAIL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
            Audit Logs & Activity Records
          </h1>
          <p className="text-xs text-[#718096]">
            Tracks staff logins, payment reversals, manual fee waivers, room reallocations, and configuration changes.
          </p>
        </div>
      </div>

      <div className="card-editorial overflow-hidden bg-[#FFFFFF] border border-[#E5E0D7]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#142B45] text-[#FFFFFF] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D7] text-[#263447]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718096] font-mono">
                    Loading security audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718096] font-mono">
                    No audit records logged.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F5F1E9]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#142B45]">{l.id}</td>
                    <td className="py-3 px-4 font-mono text-[#718096]">{l.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-[#142B45]">{l.staff_name}</td>
                    <td className="py-3 px-4 font-mono text-[10px] uppercase text-[#718096]">{l.staff_role}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5F1E9] text-[#142B45] border border-[#E5E0D7]">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#718096]">
                      {l.entity_type} ({l.entity_id})
                    </td>
                    <td className="py-3 px-4 text-[#263447]">{l.details}</td>
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
