'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VARAHI_BRANCHES } from '@/lib/data/branches';
import { Bed, Room, Floor, BedStatus } from '@/types/database';
import {
  Layers,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  User,
  ArrowRight
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [selectedBranch] = useState<number>(1);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);
  const [vacancySummary, setVacancySummary] = useState<any>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [fRes, rRes, bRes, vRes] = await Promise.all([
        fetch(`/api/inventory/floors?branch_code=1`),
        fetch(`/api/inventory/rooms?branch_code=1&floor_number=${selectedFloor}`),
        fetch(`/api/inventory/beds?branch_code=1`),
        fetch('/api/inventory/vacancy-summary'),
      ]);

      const [fJson, rJson, bJson, vJson] = await Promise.all([
        fRes.json(),
        rRes.json(),
        bRes.json(),
        vRes.json(),
      ]);

      if (fJson.success) setFloors(fJson.data);
      if (rJson.success) setRooms(rJson.data);
      if (bJson.success) setBeds(bJson.data);
      if (vJson.success) setVacancySummary(vJson.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedFloor]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F8F4FA]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-6">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
            HOSTEL INVENTORY &amp; VACANCY (BRANCH 1)
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
            Room &amp; Bed Inventory Tracker
          </h1>
          <p className="text-xs text-[#766D7C]">
            Floor ➔ Room ➔ Bed allocation hierarchy &amp; real-time occupancy status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/admissions"
            className="px-4 py-2 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <User className="w-4 h-4" /> New Admission
          </Link>
          <Link
            href="/admin/residents"
            className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] text-[#302343] font-semibold text-xs hover:bg-[#F8F4FA] shadow-xs"
          >
            Residents Directory
          </Link>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E9E1ED] space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Campus</p>
          <p className="font-serif text-2xl font-bold text-[#302343]">Branch 1</p>
          <p className="text-[10px] text-[#79618E] font-mono">Girls Residence Only</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E9E1ED] space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Total Capacity</p>
          <p className="font-serif text-2xl font-bold text-[#302343]">
            {vacancySummary?.totals?.total_beds || beds.length || 60} Beds
          </p>
          <p className="text-[10px] text-[#766D7C] font-mono">5 Residential Floors</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E9E1ED] space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Vacant Beds</p>
          <p className="font-serif text-2xl font-bold text-emerald-700">
            {beds.filter(b => b.status === 'vacant').length} Available
          </p>
          <p className="text-[10px] text-emerald-700 font-mono">Ready for Check-in</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E9E1ED] space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Room Types</p>
          <p className="font-serif text-2xl font-bold text-[#302343]">3, 4 &amp; 5 Sharing</p>
          <p className="text-[10px] text-[#79618E] font-mono">₹6,000 / ₹5,500 Non-AC</p>
        </div>
      </div>

      {/* Floor Filter Tabs */}
      <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono font-bold text-[#302343] mr-2">Select Floor:</span>
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFloor(f.floor_number)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFloor === f.floor_number
                  ? 'bg-[#79618E] text-[#FFFFFF] shadow-xs'
                  : 'bg-[#F8F4FA] border border-[#E9E1ED] text-[#766D7C] hover:text-[#302343]'
              }`}
            >
              Floor {f.floor_number}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-medium">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Vacant
          </span>
          <span className="flex items-center gap-1.5 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Occupied
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> Maintenance
          </span>
        </div>
      </div>

      {/* Rooms and Beds Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-serif font-bold text-[#302343] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#79618E]" />
          Floor {selectedFloor} Rooms &amp; Bed Occupancy
        </h3>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#766D7C]">
            Loading floor rooms &amp; bed matrix...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room) => {
              const roomBeds = beds.filter((b) => b.room_number === room.room_number);

              return (
                <div
                  key={room.id}
                  className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-5 space-y-4 shadow-xs hover:border-[#79618E]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-[#302343]">
                        Room {room.room_number}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F8F4FA] text-[#79618E] border border-[#E9E1ED]">
                        Non-AC
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#766D7C]">
                      <span>{room.room_type.replace('_', ' ')}</span>
                      <span className="font-mono font-bold text-[#302343]">
                        ₹{room.monthly_rate_per_bed.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Beds in Room */}
                    <div className="pt-2 space-y-2">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#766D7C]">
                        Beds ({roomBeds.length}):
                      </p>
                      {roomBeds.map((bed) => (
                        <div
                          key={bed.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                            bed.status === 'occupied'
                              ? 'bg-rose-50 border-rose-200 text-rose-800'
                              : bed.status === 'maintenance'
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          }`}
                        >
                          <div>
                            <span className="font-bold font-mono text-[#302343] block">
                              Bed {bed.bed_number}
                            </span>
                            {bed.current_resident_name && (
                              <p className="text-[11px] text-[#766D7C] truncate max-w-[130px]">
                                {bed.current_resident_name}
                              </p>
                            )}
                          </div>

                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E9E1ED]">
                            {bed.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E9E1ED] flex items-center justify-between text-xs">
                    <span className="text-[#766D7C] font-mono">
                      Capacity: {room.bed_capacity} Beds
                    </span>
                    <Link
                      href={`/admin/admissions?room=${room.room_number}`}
                      className="text-[#79618E] font-bold hover:underline"
                    >
                      Allocate Bed →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
