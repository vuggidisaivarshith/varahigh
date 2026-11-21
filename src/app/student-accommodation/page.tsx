import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Utensils, Wifi, ShieldCheck, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import BranchCard from '@/components/ui/BranchCard';

export default function StudentAccommodationPage() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#F5F1E9]">
      {/* Short Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="badge-mono border-[#D6A85F] text-[#142B45]">
          FEMALE STUDENT ACCOMMODATION
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#142B45]">
          Student Living in Shamshabad
        </h1>
        <p className="text-[#263447] text-sm leading-relaxed">
          Structured for academic focus: nutritious home-cooked meals 3 times daily, high-speed fiber Wi-Fi, individual study desks, resident lady warden, and 24/7 CCTV security.
        </p>
      </div>

      {/* Student Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-2">
          <Utensils className="w-5 h-5 text-[#D6A85F]" />
          <h3 className="font-serif text-xs font-bold text-[#142B45]">3 Fresh Meals</h3>
          <p className="text-[11px] text-[#718096]">Daily South &amp; North Indian nutritious buffet.</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-2">
          <Wifi className="w-5 h-5 text-[#D6A85F]" />
          <h3 className="font-serif text-xs font-bold text-[#142B45]">Fiber Wi-Fi</h3>
          <p className="text-[11px] text-[#718096]">High-speed internet for online coursework &amp; research.</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-2">
          <BookOpen className="w-5 h-5 text-[#D6A85F]" />
          <h3 className="font-serif text-xs font-bold text-[#142B45]">Study Desks</h3>
          <p className="text-[11px] text-[#718096]">Personal study tables and disciplined quiet atmosphere.</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E5E0D7] space-y-2">
          <ShieldCheck className="w-5 h-5 text-[#477B70]" />
          <h3 className="font-serif text-xs font-bold text-[#142B45]">24/7 Safety</h3>
          <p className="text-[11px] text-[#718096]">Continuous CCTV, resident lady warden &amp; verified entry.</p>
        </div>
      </div>

      {/* Campus Photos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-editorial overflow-hidden bg-white">
          <div className="relative aspect-4/3 w-full bg-[#142B45]">
            <Image
              src="/images/branches/branch1-main.svg"
              alt="Varahi Girls Hostel Elevation"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <p className="font-serif text-xs font-bold text-[#142B45]">Varahi Girls Hostel</p>
            <p className="text-[10px] text-[#718096]">Branch 1 Main Building</p>
          </div>
        </div>

        <div className="card-editorial overflow-hidden bg-white">
          <div className="relative aspect-4/3 w-full bg-[#142B45]">
            <Image
              src="/images/branches/branch2-main.svg"
              alt="Student Study Room"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <p className="font-serif text-xs font-bold text-[#142B45]">Study Room Layout</p>
            <p className="text-[10px] text-[#718096]">Individual Bed &amp; Attached Bath</p>
          </div>
        </div>

        <div className="card-editorial overflow-hidden bg-white">
          <div className="relative aspect-4/3 w-full bg-[#142B45]">
            <Image
              src="/images/branches/branch5-main.svg"
              alt="Girls Enclave Entrance"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="p-3">
            <p className="font-serif text-xs font-bold text-[#142B45]">Secured Gating</p>
            <p className="text-[10px] text-[#718096]">Resident Lady Warden Desk</p>
          </div>
        </div>
      </div>

      {/* Hostel Card */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#142B45]">
          Student Accommodation Campus
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BranchCard branch={branch} />
          <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E5E0D7] flex flex-col justify-between space-y-4">
            <div>
              <span className="badge-mono text-[9px] mb-2 text-[#477B70]">PARENT PEACE OF MIND</span>
              <h3 className="font-serif text-xl font-bold text-[#142B45]">
                Parent Verification &amp; Safe Living
              </h3>
              <p className="text-xs text-[#718096] mt-1 leading-relaxed">
                Parents receive regular updates, digital payment receipts, and direct contact with Proprietor E. Bharath Chandra and the resident warden.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E5E0D7] flex flex-col gap-2">
              <Link href="/enquiry" className="btn-primary-navy text-xs py-2.5 px-4 text-center block">
                Apply for Student Admission
              </Link>
              <a
                href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
                className="btn-ghost-luxury text-xs py-2 px-4 text-center block"
              >
                Call: {VERIFIED_CONTACTS.primary_phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
