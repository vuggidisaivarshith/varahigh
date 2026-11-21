'use client';

import React, { useState, useEffect } from 'react';
import { Resident, StayRecord } from '@/types/database';
import { getBranchByCode, VERIFIED_CONTACTS } from '@/lib/data/branches';
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
    return <div className="p-8 text-center text-xs text-[#766D7C]">Loading hostel details...</div>;
  }

  const { resident, stays } = data;
  const branch = getBranchByCode(resident.current_branch_code);

  return (
    <div className="space-y-8 bg-[#F8F4FA]">
      <div className="border-b border-[#E9E1ED] pb-4">
        <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
          HOSTEL &amp; QUARTERS
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
          My Hostel &amp; Room Details
        </h1>
        <p className="text-xs text-[#766D7C]">
          Current allocation, branch facilities, mess schedule, and stay history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Allocation Card */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-[#E9E1ED] pb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#79618E]">
              Active Physical Location
            </span>
            <h2 className="text-xl font-serif font-bold text-[#302343] mt-1">
              {branch?.name || `Varahi Girls Hostel — Branch 1`}
            </h2>
            <p className="text-xs text-[#766D7C] mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C6A46A]" />
              {branch?.address_line1}, {branch?.city} — {branch?.pincode}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED]">
              <p className="text-[10px] font-mono font-bold uppercase text-[#766D7C]">Hostel</p>
              <p className="text-lg font-bold text-[#302343] mt-1">Branch 1</p>
            </div>
            <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED]">
              <p className="text-[10px] font-mono font-bold uppercase text-[#766D7C]">Floor</p>
              <p className="text-lg font-bold text-[#302343] mt-1">Floor {resident.current_floor_number}</p>
            </div>
            <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED]">
              <p className="text-[10px] font-mono font-bold uppercase text-[#766D7C]">Room No</p>
              <p className="text-lg font-bold text-[#302343] mt-1">Room {resident.current_room_number}</p>
            </div>
            <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED]">
              <p className="text-[10px] font-mono font-bold uppercase text-[#766D7C]">Bed No</p>
              <p className="text-lg font-bold text-[#79618E] mt-1 font-mono">Bed {resident.current_bed_number}</p>
            </div>
          </div>

          {/* Daily Schedule & Meal Timings */}
          <div className="bg-[#F8F4FA] p-5 rounded-xl border border-[#E9E1ED] space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#302343] flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#C6A46A]" /> Daily Buffet Timings (Shamshabad)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#332C38]">
              <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#E9E1ED]">
                <p className="font-bold text-[#302343]">Breakfast</p>
                <p className="text-[11px] text-[#766D7C] mt-0.5">7:00 AM – 9:45 AM</p>
                <p className="text-[10px] text-[#79618E] mt-0.5">(Early airport shift packing from 5:30 AM)</p>
              </div>
              <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#E9E1ED]">
                <p className="font-bold text-[#302343]">Lunch</p>
                <p className="text-[11px] text-[#766D7C] mt-0.5">12:30 PM – 2:45 PM</p>
                <p className="text-[10px] text-emerald-700 mt-0.5">Fresh South &amp; North Indian buffet</p>
              </div>
              <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#E9E1ED]">
                <p className="font-bold text-[#302343]">Dinner</p>
                <p className="text-[11px] text-[#766D7C] mt-0.5">7:30 PM – 10:15 PM</p>
                <p className="text-[10px] text-[#79618E] mt-0.5">Warm buffet &amp; night shift meals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stay History & Warden Contacts */}
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-serif font-bold text-[#302343] flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#79618E]" />
              Staff &amp; Management Contacts
            </h3>
            <div className="text-xs text-[#332C38] space-y-3">
              <div className="p-3 bg-[#F8F4FA] rounded-xl border border-[#E9E1ED]">
                <p className="font-bold text-[#302343]">Resident Lady Warden</p>
                <p className="text-[11px] text-[#766D7C]">Stationed Onsite (24/7 Security &amp; Care)</p>
                <a href={`tel:${VERIFIED_CONTACTS.primary_phone}`} className="text-[#79618E] font-bold block mt-1 font-mono">
                  {VERIFIED_CONTACTS.primary_phone}
                </a>
              </div>
              <div className="p-3 bg-[#F8F4FA] rounded-xl border border-[#E9E1ED]">
                <p className="font-bold text-[#302343]">Proprietor: {VERIFIED_CONTACTS.owner_proprietor}</p>
                <p className="text-[11px] text-[#766D7C]">Direct Management Assistance</p>
                <a href={`tel:${VERIFIED_CONTACTS.primary_phone}`} className="text-[#79618E] font-bold block mt-1 font-mono">
                  {VERIFIED_CONTACTS.primary_phone}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-serif font-bold text-[#302343] flex items-center gap-2">
              <History className="w-4 h-4 text-[#79618E]" />
              Stay Allocation History
            </h3>
            <div className="space-y-2">
              {stays.map((s) => (
                <div key={s.id} className="p-3 bg-[#F8F4FA] rounded-xl border border-[#E9E1ED] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#302343]">Room {s.room_number} (Bed {s.bed_number})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.is_current ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#E9E1ED] text-[#766D7C]'}`}>
                      {s.is_current ? 'Active' : 'Previous'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#766D7C] font-mono">From {s.check_in_date} {s.check_out_date ? `to ${s.check_out_date}` : '(Present)'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
