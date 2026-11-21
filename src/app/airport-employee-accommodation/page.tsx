import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plane, Clock, ShieldCheck, Moon, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import BranchCard from '@/components/ui/BranchCard';

export default function AirportAccommodationPage() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#F5F1E9]">
      {/* Short Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="badge-mono border-[#D6A85F] text-[#142B45]">
          AVIATION &amp; WORKING WOMEN LIVING
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#142B45]">
          Aviation &amp; Corporate Accommodation
        </h1>
        <p className="text-[#263447] text-sm leading-relaxed">
          Tailored for female flight attendants, cabin crew, ground operations leads, and working women in Shamshabad. Just minutes from RGIA passenger &amp; cargo gates.
        </p>
      </div>

      {/* Shift Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-2">
          <Plane className="w-5 h-5 text-[#477B70]" />
          <h3 className="font-serif text-xs font-bold text-[#142B45]">5-8 Mins to RGIA</h3>
          <p className="text-[11px] text-[#718096]">Rapid transit to airline terminals and transit cabs.</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-2">
          <Moon className="w-5 h-5 text-[#D6A85F]" />
          <h3 className="font-serif text-xs font-bold text-[#142B45]">Quiet Daytime Rest</h3>
          <p className="text-[11px] text-[#718096]">Sound-conscious policy supporting restorative day sleep.</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-2">
          <Clock className="w-5 h-5 text-[#D6A85F]" />
          <h3 className="font-serif text-xs font-bold text-[#142B45]">Shift Food Packs</h3>
          <p className="text-[11px] text-[#718096]">Early breakfast &amp; packed dinners for rotating flight rosters.</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-2">
          <ShieldCheck className="w-5 h-5 text-[#477B70]" />
          <h3 className="font-serif text-xs font-bold text-[#142B45]">24/7 Safe Entry</h3>
          <p className="text-[11px] text-[#718096]">Secure gate assistance for odd-hour shift check-ins.</p>
        </div>
      </div>

      {/* Branch & Booking Section */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#142B45]">
          Varahi Girls Hostel — Branch 1
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BranchCard branch={branch} />
          <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E5E0D7] flex flex-col justify-between space-y-4">
            <div>
              <span className="badge-mono text-[9px] mb-2 text-[#477B70]">CORPORATE &amp; CREW TIE-UPS</span>
              <h3 className="font-serif text-xl font-bold text-[#142B45]">
                Airline &amp; Aviation Enquiries
              </h3>
              <p className="text-xs text-[#718096] mt-1 leading-relaxed">
                We accommodate personnel from IndiGo, Air India, AISATS, GMR, and other airport organizations. Contact Proprietor E. Bharath Chandra directly for availability.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E5E0D7] flex flex-col gap-2">
              <Link href="/enquiry" className="btn-primary-navy text-xs py-2.5 px-4 text-center block">
                Submit Aviation Shift Enquiry
              </Link>
              <a
                href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
                  'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I work at RGIA and would like to enquire about room availability.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-emerald-cta text-xs py-2 px-4 text-center block"
              >
                Chat on WhatsApp (+91 93919 44082)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
