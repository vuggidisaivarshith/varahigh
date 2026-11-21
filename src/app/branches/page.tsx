import React from 'react';
import Link from 'next/link';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import BranchCard from '@/components/ui/BranchCard';
import { Building2, Sparkles, ShieldCheck, MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react';

export default function BranchesPage() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 bg-[#F8F4FA]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="badge-mono border-[#C6A46A] text-[#302343]">
          FLAGSHIP WOMEN&apos;S LIVING IN SHAMSHABAD
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#302343]">
          Varahi Girls Hostel — Branch 1
        </h1>
        <p className="text-[#332C38] text-sm sm:text-base leading-relaxed">
          Managed directly by Proprietor <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong>. An exclusive, high-security residence designed for female students and working professionals near Rajiv Gandhi International Airport (RGIA) and Shamshabad colleges.
        </p>
      </div>

      {/* Highlights Bar */}
      <div className="card-editorial p-6 bg-[#FFFFFF] border border-[#E9E1ED] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-xs font-mono font-bold uppercase text-[#766D7C] tracking-wider">Campus Structure</p>
          <p className="font-serif text-2xl font-bold text-[#302343] mt-1">Branch 1 (5 Floors)</p>
          <p className="text-xs text-[#C6A46A] font-mono">Exclusively Girls &amp; Women</p>
        </div>
        <div className="sm:border-x border-[#E9E1ED]">
          <p className="text-xs font-mono font-bold uppercase text-[#766D7C] tracking-wider">Airport Transit</p>
          <p className="font-serif text-2xl font-bold text-[#302343] mt-1">5-8 Mins to RGIA</p>
          <p className="text-xs text-[#79618E] font-mono">Terminal &amp; Cargo Gates</p>
        </div>
        <div>
          <p className="text-xs font-mono font-bold uppercase text-[#766D7C] tracking-wider">All-Inclusive Dining</p>
          <p className="font-serif text-2xl font-bold text-[#302343] mt-1">3 Fresh Meals Daily</p>
          <p className="text-xs text-[#C6A46A] font-mono">South &amp; North Indian Buffet</p>
        </div>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VARAHI_BRANCHES.map((b) => (
          <BranchCard key={b.id} branch={b} />
        ))}

        {/* Room Option Cards */}
        <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="badge-mono text-[9px] text-[#302343]">3-SHARING COMFORT</span>
              <span className="text-xs font-mono font-bold text-[#79618E]">₹6,000/mo</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#302343]">
              3-Sharing Non-AC Room
            </h3>
            <p className="text-xs text-[#766D7C] mt-1 leading-relaxed">
              Spacious three-person sharing with attached private washroom, hot water geyser, individual study desk, lockable wardrobe, and 3-times daily buffet meals.
            </p>
          </div>
          <div className="pt-3 border-t border-[#E9E1ED]">
            <Link href="/enquiry" className="btn-primary-navy text-xs py-2 px-4 w-full text-center block">
              Apply for 3-Sharing (₹6,000)
            </Link>
          </div>
        </div>

        <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="badge-mono text-[9px] text-[#302343]">4 &amp; 5 SHARING ECONOMY</span>
              <span className="text-xs font-mono font-bold text-[#79618E]">₹5,500/mo</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#302343]">
              4 &amp; 5-Sharing Non-AC Rooms
            </h3>
            <p className="text-xs text-[#766D7C] mt-1 leading-relaxed">
              Well-ventilated sharing accommodation with attached washroom, hot water geyser, high-speed fiber Wi-Fi, daily housekeeping, and 3-times daily nutritious meals.
            </p>
          </div>
          <div className="pt-3 border-t border-[#E9E1ED]">
            <a
              href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
                'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I would like to check 4/5-sharing bed availability (₹5,500/mo).'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-emerald-cta text-xs py-2 px-4 w-full text-center block"
            >
              WhatsApp Availability
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
