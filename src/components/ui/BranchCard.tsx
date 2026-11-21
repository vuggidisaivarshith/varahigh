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
    <div className="card-editorial rounded-xl overflow-hidden flex flex-col group bg-[#FFFFFF] border border-[#E9E1ED]">
      {/* Card Header & Category Tag */}
      <div className="p-6 border-b border-[#E9E1ED] bg-[#F8F4FA]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="badge-mono text-[9px] bg-[#FFFFFF] border-[#E9E1ED] text-[#302343]">
            BRANCH CODE {branch.branch_code}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 bg-[#D9C8E8]/40 text-[#302343] border border-[#D9C8E8]">
            <User className="w-3 h-3 text-[#C6A46A]" />
            Women&apos;s Exclusive Enclave
          </span>
        </div>

        <h3 className="font-serif text-xl font-bold text-[#302343] group-hover:text-[#79618E] transition-colors leading-snug">
          {branch.name}
        </h3>

        <p className="text-xs text-[#766D7C] font-medium mt-1 flex items-center gap-1.5 font-mono">
          <Building2 className="w-3.5 h-3.5 text-[#C6A46A]" />
          {branch.distance_from_rgia}
        </p>
      </div>

      {/* Body Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <div className="flex items-start gap-2 text-xs text-[#766D7C]">
            <MapPin className="w-4 h-4 text-[#C6A46A] shrink-0 mt-0.5" />
            <span className="leading-relaxed text-[#332C38]">
              {branch.address_line1}, {branch.address_line2 ? `${branch.address_line2}, ` : ''}{branch.city}
            </span>
          </div>

          {/* 2-3 Important Verified Facilities */}
          <div className="bg-[#F8F4FA] rounded-lg p-3.5 border border-[#E9E1ED]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#766D7C] mb-2">
              Verified Facilities:
            </p>
            <ul className="space-y-1.5">
              {branch.facilities.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-xs text-[#332C38] flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#79618E] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-4 border-t border-[#E9E1ED] flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase font-bold text-[#766D7C]">Starting Tariff</p>
            <p className="font-serif text-lg font-bold text-[#302343]">
              ₹{branch.starting_price_per_month.toLocaleString()}
              <span className="font-sans text-xs font-normal text-[#766D7C]"> / mo</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/branches/${branch.branch_code}`}
              className="btn-ghost-luxury py-2 px-3 text-[10px]"
            >
              Details
            </Link>
            <Link
              href={`/enquiry?branch=${branch.branch_code}`}
              className="btn-primary-navy py-2 px-3.5 text-[10px] flex items-center gap-1"
            >
              <span>Enquire</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
