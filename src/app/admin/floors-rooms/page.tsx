'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import { Room, Floor } from '@/types/database';
import { Layers, Building2, Bed, DoorOpen, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminFloorsRoomsPage() {
  const [selectedBranch, setSelectedBranch] = useState<number>(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (bCode: number) => {
    setLoading(true);
    try {
      const [resFloors, resRooms] = await Promise.all([
        fetch(`/api/inventory/floors?branch=${bCode}`),
        fetch(`/api/inventory/rooms?branch=${bCode}`),
      ]);
      const jsonFloors = await resFloors.json();
      const jsonRooms = await resRooms.json();
      if (jsonFloors.success) setFloors(jsonFloors.data);
      if (jsonRooms.success) setRooms(jsonRooms.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedBranch);
  }, [selectedBranch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
        <div>
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            SPATIAL HIERARCHY: BRANCH ➔ FLOOR ➔ ROOM ➔ BED
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
            Floors & Rooms Directory
          </h1>
          <p className="text-xs text-[#718096]">
            Configure floor wings, room sharing capacities, and bed inventories.
          </p>
        </div>

        <Link
          href="/admin/inventory"
          className="btn-primary-navy text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Bed className="w-4 h-4" />
          <span>Bed Allocation Grid</span>
        </Link>
      </div>

      {/* Branch Selector Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DEVI_BRANCHES.map((b) => (
          <button
            key={b.branch_code}
            onClick={() => setSelectedBranch(b.branch_code)}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors border ${
              selectedBranch === b.branch_code
                ? 'bg-[#142B45] text-[#FFFFFF] border-[#142B45]'
                : 'bg-[#FFFFFF] text-[#263447] border-[#E5E0D7] hover:bg-[#F5F1E9]'
            }`}
          >
            Branch {b.branch_code}: {b.name.split('—')[0]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#718096] text-xs font-mono">
          Loading floors and rooms for Branch {selectedBranch}...
        </div>
      ) : (
        <div className="space-y-6">
          {floors.map((floor) => {
            const floorRooms = rooms.filter((r) => r.floor_id === floor.id || r.floor_number === floor.floor_number);
            return (
              <div key={floor.id} className="card-editorial p-6 bg-[#FFFFFF] border border-[#E5E0D7] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E0D7] pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#D6A85F]" />
                    <h3 className="font-serif text-lg font-bold text-[#142B45]">
                      Floor {floor.floor_number}: {floor.floor_name || `Wing ${floor.floor_number}`}
                    </h3>
                  </div>
                  <span className="badge-mono border-[#E5E0D7] text-[#142B45]">
                    {floorRooms.length} Rooms Configured
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {floorRooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-lg bg-[#F5F1E9]/60 border border-[#E5E0D7] space-y-2 hover:border-[#142B45] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#142B45]">
                          Room {room.room_number}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E0D7] text-[#718096]">
                          {(room.room_type || room.sharing_type || 'standard').replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-[#718096] space-y-1">
                        <p>Total Capacity: <strong className="text-[#142B45]">{room.bed_capacity || room.capacity || 2} Beds</strong></p>
                        <p>Bathrooms: <strong className="text-[#142B45]">{room.has_attached_bathroom ? 'Attached' : 'Common'}</strong></p>
                      </div>
                      <div className="pt-2 border-t border-[#E5E0D7] flex items-center justify-between">
                        <Link
                          href={`/admin/inventory?branch=${selectedBranch}&room=${room.room_number}`}
                          className="font-mono text-[10px] font-bold text-[#142B45] hover:underline"
                        >
                          View Beds →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
