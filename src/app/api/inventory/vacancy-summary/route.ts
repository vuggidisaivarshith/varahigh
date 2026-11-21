import { NextResponse } from 'next/server';
import { getBranchVacancySummary } from '@/lib/data/inventory-repo';

export async function GET() {
  const summary = getBranchVacancySummary();
  const totalBeds = summary.reduce((acc, s) => acc + s.total_beds, 0);
  const totalOccupied = summary.reduce((acc, s) => acc + s.occupied_beds, 0);
  const totalVacant = summary.reduce((acc, s) => acc + s.vacant_beds, 0);
  const totalMaintenance = summary.reduce((acc, s) => acc + s.maintenance_beds, 0);
  const overallOccupancyRate = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;

  return NextResponse.json({
    success: true,
    data: {
      branches: summary,
      totals: {
        total_beds: totalBeds,
        total_occupied: totalOccupied,
        total_vacant: totalVacant,
        total_maintenance: totalMaintenance,
        overall_occupancy_rate: overallOccupancyRate,
      },
    },
  });
}
