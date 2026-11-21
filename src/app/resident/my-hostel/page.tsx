'use client';

import React, { useState, useEffect } from 'react';
import { Resident, StayRecord } from '@/types/database';
import { getBranchByCode } from '@/lib/data/branches';
import { Building2, MapPin, Phone, ShieldCheck, CheckCircle2, Utensils, Wifi, Clock, History } from 'lucide-react';

export default function MyHostelPage() {
  const [data, setData] = useState<{ resident: Resident; stays: StayRecord[] } | null>(null);

  useEffect(() => {
    const fetchHostelData = async () => {
      const match = document.cookie.match(/(?:devi|varahi)_resident_id=([^;]+)/);
      const residentId = match ? match[1] : 'VG1-1-00001';
      const res = await fetch(`/api/residents/${residentId}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    };
    fetchHostelData();
  }, []);

  if (!data?.resident) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading hostel details...</div>;
  }

  const { resident, stays } = data;
  const branch = getBranchByCode(resident.current_branch_code);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">My Hostel & Room Details</h1>
        <p className="text-xs text-slate-400">
          Current allocation, branch facilities, and stay history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Allocation Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Active Physical Location
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {branch?.name || `Branch ${resident.current_branch_code}`}
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {branch?.address_line1}, {branch?.city}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold uppercase text-slate-400">Branch</p>
              <p className="text-lg font-black text-amber-400 mt-1">Code {resident.current_branch_code}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold uppercase text-slate-400">Floor</p>
              <p className="text-lg font-black text-white mt-1">Floor {resident.current_floor_number}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold uppercase text-slate-400">Room No</p>
              <p className="text-lg font-black text-white mt-1">Room {resident.current_room_number}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] font-bold uppercase text-slate-400">Bed Allotment</p>
              <p className="text-lg font-black text-emerald-400 mt-1">Bed {resident.current_bed_number}</p>
            </div>
          </div>

          {/* Daily Schedule & Meal Timings */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Daily Mess Buffet Timings (Shamshabad)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <p className="font-bold text-white">Breakfast</p>
                <p className="text-[11px] text-slate-400 mt-0.5">7:00 AM – 9:45 AM</p>
                <p className="text-[10px] text-amber-400 mt-0.5">(Airport early shift packed boxes from 5:30 AM)</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <p className="font-bold text-white">Lunch</p>
                <p className="text-[11px] text-slate-400 mt-0.5">12:30 PM – 2:45 PM</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Full South & North Indian hot meals</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <p className="font-bold text-white">Dinner</p>
                <p className="text-[11px] text-slate-400 mt-0.5">7:30 PM – 10:15 PM</p>
                <p className="text-[10px] text-blue-400 mt-0.5">Warm buffet & night shift warm trays</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stay History & Warden Contacts */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500" />
              Branch Staff & Warden
            </h3>
            <div className="text-xs text-slate-300 space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-bold text-white">Resident Warden on Duty</p>
                <p className="text-[11px] text-slate-400">Available 24/7 at Reception Desk</p>
                <a href="tel:+919848012345" className="text-amber-400 font-bold block mt-1">+91 98480 12345</a>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-bold text-white">Proprietor: Marpina Pradeep</p>
                <p className="text-[11px] text-slate-400">Direct Management Escalations</p>
                <a href="tel:+919848012345" className="text-amber-400 font-bold block mt-1">+91 98480 12345</a>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500" />
              Allocation History
            </h3>
            <div className="space-y-2">
              {stays.map((s) => (
                <div key={s.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Branch {s.branch_code} • Room {s.room_number}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.is_current ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {s.is_current ? 'Active' : 'Previous'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">From {s.check_in_date} {s.check_out_date ? `to ${s.check_out_date}` : '(Present)'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
