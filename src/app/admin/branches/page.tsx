'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DEVI_BRANCHES, VERIFIED_CONTACTS, VerifiedBranch } from '@/lib/data/branches';
import { Building2, MapPin, Phone, User, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminBranchesPage() {
  const [branches] = useState<VerifiedBranch[]>(DEVI_BRANCHES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-4">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            PROPERTY CONFIGURATION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
            Varahi Girls Hostel — Branch 1
          </h1>
          <p className="text-xs text-[#766D7C]">
            Managed under centralized PostgreSQL ledger in Shamshabad. Proprietor: E. Bharath Chandra (+91 93919 44082).
          </p>
        </div>

        <Link
          href="/admin/inventory"
          className="btn-primary-navy text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Building2 className="w-4 h-4" />
          <span>Inspect Bed Matrix</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div key={b.id} className="card-editorial p-6 space-y-4 bg-[#FFFFFF] border border-[#E9E1ED]">
            <div className="flex items-center justify-between">
              <span className="badge-mono text-[9px] border-[#C6A46A]">
                CODE {b.branch_code}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                b.gender_category === 'girls' ? 'bg-[#FDF6F0] text-[#9C4221]' : 'bg-[#F8F4FA] text-[#302343]'
              }`}>
                {b.gender_category === 'girls' ? 'Girls Only' : 'Boys Hostel'}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-[#302343]">{b.name}</h3>
              <p className="text-xs text-[#766D7C] mt-1">{b.address_line1}</p>
              <p className="text-[11px] font-mono text-[#79618E] mt-0.5">{b.distance_from_rgia}</p>
            </div>

            <div className="space-y-1.5 text-xs text-[#332C38] pt-2 border-t border-[#E9E1ED]">
              <p className="flex items-center justify-between">
                <span className="text-[#766D7C]">Floors:</span>
                <strong className="font-mono">{b.total_floors} Floors</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[#766D7C]">Starting Tariff:</span>
                <strong className="font-mono text-[#302343]">₹{b.starting_price_per_month}/mo</strong>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-[#766D7C]">Address Verification:</span>
                <span className={`font-mono text-[10px] font-bold ${b.verified_address ? 'text-[#79618E]' : 'text-[#C6A46A]'}`}>
                  {b.verified_address ? 'Verified Landmark' : 'Pending Owner GPS Pin'}
                </span>
              </p>
            </div>

            <div className="pt-3 border-t border-[#E9E1ED] flex items-center justify-between">
              <Link
                href={`/admin/inventory?branch=${b.branch_code}`}
                className="font-mono text-xs font-bold text-[#302343] hover:underline"
              >
                Room Matrix →
              </Link>
              <Link
                href={`/branches/${b.branch_code}`}
                target="_blank"
                className="font-mono text-xs text-[#766D7C] hover:text-[#302343]"
              >
                Public Page ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
