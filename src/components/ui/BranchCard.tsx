import React from 'react';
import Link from 'next/link';
import { VerifiedBranch } from '@/lib/data/branches';
import { MapPin, Building2, CheckCircle2, ArrowRight, User } from 'lucide-react';

interface BranchCardProps {
  branch: VerifiedBranch;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const isGirls = branch.gender_category === 'girls';

  return (
    <div className="card-editorial rounded-xl overflow-hidden flex flex-col group bg-[#FFFFFF] border border-[#E5E0D7]">
      {/* Card Header & Gender Tag */}
      <div className={`p-6 border-b border-[#E5E0D7] ${isGirls ? 'bg-[#FDF6F0]' : 'bg-[#F5F1E9]/70'}`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="badge-mono text-[9px] bg-[#FFFFFF] border-[#E5E0D7] text-[#142B45]">
            BRANCH CODE {branch.branch_code}
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
            isGirls
              ? 'bg-[#FDF6F0] text-[#9C4221] border border-[#E5C9B8]'
              : 'bg-[#FFFFFF] text-[#142B45] border border-[#E5E0D7]'
          }`}>
            <User className="w-3 h-3 text-[#D6A85F]" />
            {isGirls ? "Girls' Accommodation" : "Boys' Accommodation"}
          </span>
        </div>

        <h3 className="font-serif text-xl font-bold text-[#142B45] group-hover:text-[#365679] transition-colors leading-snug">
          {branch.name}
        </h3>

        <p className="text-xs text-[#718096] font-medium mt-1 flex items-center gap-1.5 font-mono">
          <Building2 className="w-3.5 h-3.5 text-[#D6A85F]" />
          {branch.distance_from_rgia}
        </p>
      </div>

      {/* Body Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <div className="flex items-start gap-2 text-xs text-[#718096]">
            <MapPin className="w-4 h-4 text-[#D6A85F] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {branch.address_line1}, {branch.address_line2 ? `${branch.address_line2}, ` : ''}{branch.city}
            </span>
          </div>

          {/* 2-3 Important Verified Facilities */}
          <div className="bg-[#F5F1E9] rounded-lg p-3.5 border border-[#E5E0D7]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#718096] mb-2">
              Verified Facilities:
            </p>
            <ul className="space-y-1.5">
              {branch.facilities.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-xs text-[#263447] flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#477B70] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-4 border-t border-[#E5E0D7] flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase font-bold text-[#718096]">Starting Tariff</p>
            <p className="font-serif text-lg font-bold text-[#142B45]">
              ₹{branch.starting_price_per_month.toLocaleString()}
              <span className="font-sans text-xs font-normal text-[#718096]"> / mo</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/branches/${branch.branch_code}`}
              className="btn-ghost-luxury py-2 px-3 text-[10px]"
            >
              View Details
            </Link>
            <Link
              href={`/enquiry?branch=${branch.branch_code}`}
              className="btn-primary-navy py-2 px-3 text-[10px]"
            >
              Enquire
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
