import { Branch, Floor, Room, Bed, BedStatus, RoomSharing } from '@/types/database';
import { DEVI_BRANCHES } from './branches';

// In-memory persistent inventory store
let floorsStore: Floor[] = [];
let roomsStore: Room[] = [];
let bedsStore: Bed[] = [];

// Initialize inventory
function initializeInventory() {
  if (floorsStore.length > 0) return;

  const branchCodes = [1, 2, 3, 4, 5];
  branchCodes.forEach((bCode) => {
    const branch = DEVI_BRANCHES.find(b => b.branch_code === bCode) || {
      id: `b${bCode}-branch-${bCode}`,
      branch_code: bCode as any,
      total_floors: 4,
      starting_price_per_month: 7000,
    };

    for (let f = 1; f <= branch.total_floors; f++) {
      const floorId = `floor-${branch.branch_code}-${f}`;
      floorsStore.push({
        id: floorId,
        branch_id: branch.id,
        branch_code: branch.branch_code,
        floor_number: f,
        floor_name: `Floor ${f}`,
      });

      // 4 rooms per floor
      const roomTypes: { type: RoomSharing; capacity: number; hasAc: boolean }[] = [
        { type: '1_sharing', capacity: 1, hasAc: true },
        { type: '2_sharing', capacity: 2, hasAc: f % 2 === 0 },
        { type: '2_sharing', capacity: 2, hasAc: false },
        { type: '3_sharing', capacity: 3, hasAc: false },
      ];

      roomTypes.forEach((rt, rIdx) => {
        const roomNum = `${f}0${rIdx + 1}`; // e.g. 101, 102, 103, 104
        const roomId = `room-${branch.branch_code}-${roomNum}`;

        roomsStore.push({
          id: roomId,
          branch_id: branch.id,
          branch_code: branch.branch_code,
          floor_id: floorId,
          floor_number: f,
          room_number: roomNum,
          room_type: rt.type,
          bed_capacity: rt.capacity,
          has_ac: rt.hasAc,
          has_attached_bathroom: true,
          monthly_rate_per_bed:
            rt.type === '1_sharing'
              ? branch.starting_price_per_month + 3500
              : rt.type === '2_sharing'
              ? branch.starting_price_per_month + (rt.hasAc ? 1500 : 500)
              : branch.starting_price_per_month,
        });

        // Generate Beds inside room
        const bedLetters = ['A', 'B', 'C', 'D'];
        for (let b = 0; b < rt.capacity; b++) {
          const bedId = `bed-${branch.branch_code}-${roomNum}-${bedLetters[b]}`;
          bedsStore.push({
            id: bedId,
            room_id: roomId,
            room_number: roomNum,
            floor_number: f,
            branch_code: branch.branch_code,
            bed_number: `${roomNum}-${bedLetters[b]}`,
            status: 'vacant',
          });
        }
      });
    }
  });
}

// Ensure initialized
initializeInventory();

export function getFloors(branchCode?: number): Floor[] {
  initializeInventory();
  if (branchCode) {
    return floorsStore.filter((f) => f.branch_code === branchCode);
  }
  return floorsStore;
}

export function getRooms(branchCode?: number, floorNumber?: number): Room[] {
  initializeInventory();
  let result = roomsStore;
  if (branchCode) {
    result = result.filter((r) => r.branch_code === branchCode);
  }
  if (floorNumber !== undefined) {
    result = result.filter((r) => r.floor_number === floorNumber);
  }
  return result;
}

export function getBeds(branchCode?: number, roomNumber?: string): Bed[] {
  initializeInventory();
  let result = bedsStore;
  if (branchCode) {
    result = result.filter((b) => b.branch_code === branchCode);
  }
  if (roomNumber) {
    result = result.filter((b) => b.room_number === roomNumber);
  }
  return result;
}

export function getBedById(bedId: string): Bed | undefined {
  initializeInventory();
  return bedsStore.find((b) => b.id === bedId);
}

// Allocate a bed to a resident (prevents double allocation)
export function allocateBed(
  bedId: string,
  residentId: string,
  residentName: string
): { success: boolean; error?: string; bed?: Bed } {
  initializeInventory();
  const bedIndex = bedsStore.findIndex((b) => b.id === bedId);
  if (bedIndex === -1) {
    return { success: false, error: 'Bed not found in inventory.' };
  }

  const currentBed = bedsStore[bedIndex];
  if (currentBed.status === 'occupied' && currentBed.current_resident_id !== residentId) {
    return {
      success: false,
      error: `Bed ${currentBed.bed_number} is already occupied by resident ${currentBed.current_resident_name}. Double allocation prevented.`,
    };
  }

  if (currentBed.status === 'maintenance') {
    return {
      success: false,
      error: `Bed ${currentBed.bed_number} is currently under maintenance and cannot be allocated.`,
    };
  }

  bedsStore[bedIndex] = {
    ...currentBed,
    status: 'occupied',
    current_resident_id: residentId,
    current_resident_name: residentName,
  };

  return { success: true, bed: bedsStore[bedIndex] };
}

// Free a bed upon checkout or room transfer
export function releaseBed(bedId: string): boolean {
  initializeInventory();
  const bedIndex = bedsStore.findIndex((b) => b.id === bedId);
  if (bedIndex !== -1) {
    bedsStore[bedIndex] = {
      ...bedsStore[bedIndex],
      status: 'vacant',
      current_resident_id: undefined,
      current_resident_name: undefined,
    };
    return true;
  }
  return false;
}

// Update bed status (e.g. set maintenance or vacant)
export function updateBedStatus(bedId: string, status: BedStatus): boolean {
  initializeInventory();
  const bedIndex = bedsStore.findIndex((b) => b.id === bedId);
  if (bedIndex !== -1) {
    bedsStore[bedIndex].status = status;
    if (status === 'vacant' || status === 'maintenance') {
      bedsStore[bedIndex].current_resident_id = undefined;
      bedsStore[bedIndex].current_resident_name = undefined;
    }
    return true;
  }
  return false;
}

// Branch-wise Vacancy Analytics
export interface BranchVacancySummary {
  branch_code: 1 | 2 | 3 | 4 | 5;
  branch_name: string;
  total_beds: number;
  occupied_beds: number;
  vacant_beds: number;
  maintenance_beds: number;
  occupancy_rate_percentage: number;
}

export function getBranchVacancySummary(): BranchVacancySummary[] {
  initializeInventory();
  return DEVI_BRANCHES.map((b) => {
    const branchBeds = bedsStore.filter((bed) => bed.branch_code === b.branch_code);
    const total = branchBeds.length;
    const occupied = branchBeds.filter((bed) => bed.status === 'occupied').length;
    const vacant = branchBeds.filter((bed) => bed.status === 'vacant').length;
    const maintenance = branchBeds.filter((bed) => bed.status === 'maintenance').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return {
      branch_code: b.branch_code,
      branch_name: b.name,
      total_beds: total,
      occupied_beds: occupied,
      vacant_beds: vacant,
      maintenance_beds: maintenance,
      occupancy_rate_percentage: occupancyRate,
    };
  });
}
