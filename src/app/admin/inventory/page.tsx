'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DEVI_BRANCHES } from '@/lib/data/branches';
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
  const [selectedBranch, setSelectedBranch] = useState<number>(1);
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
        fetch(`/api/inventory/floors?branch_code=${selectedBranch}`),
        fetch(`/api/inventory/rooms?branch_code=${selectedBranch}&floor_number=${selectedFloor}`),
        fetch(`/api/inventory/beds?branch_code=${selectedBranch}`),
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
  }, [selectedBranch, selectedFloor]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
            Hostel Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Room & Bed Inventory Management
          </h1>
          <p className="text-xs text-slate-400">
            Branch ➔ Floor ➔ Room ➔ Bed allocation hierarchy & live vacancy tracker.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/admissions"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <User className="w-4 h-4" /> New Admission
          </Link>
          <Link
            href="/admin/residents"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-xs hover:bg-slate-800"
          >
            Residents Directory
          </Link>
        </div>
      </div>

      {/* Vacancy Summary Cards across 5 branches */}
      {vacancySummary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {vacancySummary.branches.map((b: any) => (
            <div
              key={b.branch_code}
              onClick={() => setSelectedBranch(b.branch_code)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedBranch === b.branch_code
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-amber-400">
                  CODE {b.branch_code}
                </span>
                <span className="text-[10px] font-bold text-emerald-400">
                  {b.occupancy_rate_percentage}% Full
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-1 truncate">
                Branch {b.branch_code}
              </h4>
              <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
                <p>Vacant: <strong className="text-emerald-400">{b.vacant_beds}</strong></p>
                <p>Occupied: <strong className="text-white">{b.occupied_beds}</strong></p>
              </div>
            </div>
          ))}

          {/* Overall Total Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Network</span>
            <div>
              <p className="text-xl font-black text-white">
                {vacancySummary.totals.total_beds} Beds
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                {vacancySummary.totals.total_vacant} Vacant Beds
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floor Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 mr-2">Select Floor:</span>
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFloor(f.floor_number)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFloor === f.floor_number
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Floor {f.floor_number}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Vacant
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Occupied
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Maintenance
          </span>
        </div>
      </div>

      {/* Rooms and Beds Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          Branch {selectedBranch} • Floor {selectedFloor} Rooms & Beds
        </h3>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading floor rooms & bed matrix...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room) => {
              const roomBeds = beds.filter((b) => b.room_number === room.room_number);

              return (
                <div
                  key={room.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-black text-white">
                        Room {room.room_number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        room.has_ac ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {room.has_ac ? '❄️ AC' : 'Non-AC'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{room.room_type.replace('_', ' ')}</span>
                      <span className="font-mono font-bold text-amber-400">
                        ₹{room.monthly_rate_per_bed.toLocaleString()}
                      </span>
                    </div>

                    {/* Beds in Room */}
                    <div className="pt-2 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Beds ({roomBeds.length}):
                      </p>
                      {roomBeds.map((bed) => (
                        <div
                          key={bed.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                            bed.status === 'occupied'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              : bed.status === 'maintenance'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold font-mono text-white block">
                              Bed {bed.bed_number}
                            </span>
                            {bed.current_resident_name && (
                              <p className="text-[11px] text-slate-300 truncate max-w-[130px]">
                                {bed.current_resident_name}
                              </p>
                            )}
                          </div>

                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-950/80">
                            {bed.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Capacity: {room.bed_capacity} Beds
                    </span>
                    <Link
                      href={`/admin/admissions?branch=${selectedBranch}&room=${room.room_number}`}
                      className="text-amber-400 font-bold hover:underline"
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
