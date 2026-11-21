import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBranchByCode, getBranchById, VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import {
  MapPin,
  Phone,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  User,
  Layers,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: 'b1-girls-branch-1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const branchNum = parseInt(id, 10);
  const branch = !isNaN(branchNum) ? getBranchByCode(branchNum) : getBranchById(id);

  if (!branch) {
    notFound();
  }

  return (
    <div className="bg-[#F8F4FA] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#766D7C]">
          <Link href="/" className="hover:text-[#302343]">Home</Link>
          <span>/</span>
          <Link href="/branches" className="hover:text-[#302343]">Hostel</Link>
          <span>/</span>
          <span className="text-[#302343] font-semibold">{branch.name}</span>
        </div>

        {/* Hero Header */}
        <div className="card-editorial p-8 sm:p-12 bg-[#FFFFFF] border border-[#E9E1ED] shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="badge-mono border-[#C6A46A] text-[#302343]">
                BRANCH CODE {branch.branch_code}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200">
                <User className="w-3.5 h-3.5 text-[#C6A46A]" />
                GIRLS ONLY • HIGH SECURITY RESIDENCE
              </span>
            </div>
            <span className="text-xs text-[#79618E] font-mono font-semibold flex items-center gap-1.5 bg-[#79618E]/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" /> Operational &amp; Accepting Admissions
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#302343] leading-tight">
            {branch.name}
          </h1>

          <p className="text-sm sm:text-base text-[#332C38] mt-4 max-w-3xl leading-relaxed">
            {branch.description}
          </p>

          <div className="mt-8 pt-6 border-t border-[#E9E1ED] flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#766D7C]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C6A46A]" />
                <span className="text-[#302343] font-medium">{branch.address_line1}, {branch.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C6A46A]" />
                <span>{branch.distance_from_rgia}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C6A46A]" />
                <span>{branch.total_floors} Residential Floors</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
                className="btn-ghost-luxury text-xs py-2.5 px-4 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#79618E]" />
                <span>Call {VERIFIED_CONTACTS.primary_phone}</span>
              </a>
              <a
                href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
                  `Hello Varahi Girls Hostel Management (E. Bharath Chandra), I am enquiring about ${branch.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-emerald-cta text-xs py-2.5 px-5 flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Enquiry</span>
              </a>
              <Link href="/enquiry" className="btn-primary-navy text-xs py-2.5 px-5">
                Apply Online
              </Link>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Highlights */}
            <div className="card-editorial p-6 sm:p-8 bg-[#FFFFFF] border border-[#E9E1ED] space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#302343] border-b border-[#E9E1ED] pb-3">
                Key Residence Highlights
              </h2>
              <ul className="space-y-3">
                {branch.key_highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#332C38]">
                    <CheckCircle2 className="w-4 h-4 text-[#79618E] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Standard Facilities List */}
            <div className="card-editorial p-6 sm:p-8 bg-[#FFFFFF] border border-[#E9E1ED] space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#302343] border-b border-[#E9E1ED] pb-3">
                Included Amenities &amp; Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {branch.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F8F4FA] border border-[#E9E1ED] text-xs text-[#302343]">
                    <ShieldCheck className="w-4 h-4 text-[#C6A46A] shrink-0" />
                    <span className="font-medium">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pricing Summary */}
            <div className="card-editorial p-6 bg-[#FFFFFF] border border-[#E9E1ED] space-y-4">
              <span className="badge-mono text-[9px] text-[#302343]">STARTING TARIFF</span>
              <div>
                <p className="font-serif text-3xl font-bold text-[#302343]">
                  ₹{branch.starting_price_per_month.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-[#766D7C] font-mono"> / month</span>
                </p>
                <p className="text-[11px] text-[#766D7C] mt-1">
                  All-inclusive: 3 buffet meals, Wi-Fi, 24/7 hot water, power backup, and housekeeping.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E9E1ED] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E9E1ED]/60">
                  <span className="text-[#766D7C]">Security Deposit:</span>
                  <span className="font-mono font-bold text-[#302343]">₹3,000 (Refundable)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E9E1ED]/60">
                  <span className="text-[#766D7C]">Billing Cycle:</span>
                  <span className="font-mono font-bold text-[#302343]">Joining Date Cycle</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E9E1ED]/60">
                  <span className="text-[#766D7C]">Resident Lady Warden:</span>
                  <span className="font-mono font-bold text-[#79618E]">Present Onsite</span>
                </div>
              </div>

              <Link href="/enquiry" className="btn-primary-navy w-full py-3 text-xs text-center block mt-4">
                Submit Admission Enquiry
              </Link>
            </div>

            {/* Direct Proprietor Contact Card */}
            <div className="card-editorial p-6 bg-[#FFFFFF] border border-[#E9E1ED] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#302343]">
                Direct Management Contact
              </h3>
              <p className="text-xs text-[#766D7C] leading-relaxed">
                Connect directly with Proprietor <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong> to schedule a room inspection.
              </p>
              <div className="space-y-2 text-xs font-mono">
                <a
                  href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8F4FA] text-[#302343] font-bold hover:bg-[#E9E1ED] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#79618E]" />
                  <span>{VERIFIED_CONTACTS.primary_phone}</span>
                </a>
                <a
                  href={VERIFIED_CONTACTS.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F4FA] text-[#302343] font-bold hover:bg-[#E9E1ED] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C6A46A]" />
                    <span>Google Maps Pin</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#766D7C]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
