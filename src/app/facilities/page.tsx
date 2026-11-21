import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  Wifi,
  ShieldCheck,
  Building2,
  Sparkles,
  Car,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function FacilitiesPage() {
  const facilities = [
    {
      icon: ShieldCheck,
      title: '24/7 CCTV & Resident Lady Warden',
      desc: 'Round-the-clock camera monitoring in all corridors, entryways, and common areas, with an experienced resident female warden stationed onsite.',
      badge: 'HIGH SECURITY',
    },
    {
      icon: Utensils,
      title: '3-Times Hygienic Buffet Dining',
      desc: 'Freshly prepared, wholesome South and North Indian meals daily. Special early morning and late night packed meal options for airline and hospital shift staff.',
      badge: 'HOMELY COOKING',
    },
    {
      icon: Building2,
      title: 'Attached Washrooms & 24/7 Hot Water',
      desc: 'Every room features an attached private bathroom fitted with high-efficiency geysers providing continuous hot water in all seasons.',
      badge: 'PRIVATE & HYGIENIC',
    },
    {
      icon: Wifi,
      title: 'High-Speed Unlimited Fiber Wi-Fi',
      desc: 'Dual-band commercial fiber internet available across all floors for uninterrupted study, video conferencing, work-from-hostel, and entertainment.',
      badge: '100+ MBPS',
    },
    {
      icon: Sparkles,
      title: 'Generator & Inverter Power Backup',
      desc: 'Heavy-duty power backup system ensuring uninterrupted lighting, fans, Wi-Fi connectivity, and essential electrical outlets during grid cuts.',
      badge: '100% RELIABILITY',
    },
    {
      icon: Car,
      title: 'Gated Two-Wheeler Parking',
      desc: 'Dedicated on-premise vehicle parking area secured behind main gates with continuous CCTV monitoring and security lighting.',
      badge: 'SAFE ON-PREMISE',
    },
    {
      icon: HeartHandshake,
      title: 'Multi-Stage RO Mineral Drinking Water',
      desc: 'Certified commercial RO water filtration units installed on floors ensuring 100% safe, pure, and temperature-controlled drinking water.',
      badge: 'PURE & TESTED',
    },
    {
      icon: Clock,
      title: 'Automatic Washing Machines & Drying',
      desc: 'Commercial-grade automatic washing machines and spacious, sun-lit covered clothes drying areas available to all residents.',
      badge: 'CONVENIENT LAUNDRY',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-[#F8F4FA]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="badge-mono border-[#C6A46A] text-[#302343]">
          COMPREHENSIVE AMENITIES
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#302343]">
          Hostel Amenities at <span className="italic font-normal">VARAHI GIRLS HOSTEL</span>
        </h1>
        <p className="text-[#332C38] text-sm sm:text-base leading-relaxed">
          Every amenity at Varahi Girls Hostel is curated for safety, hygiene, comfort, and peace of mind for female students and working professionals.
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {facilities.map((fac, idx) => {
          const Icon = fac.icon;
          return (
            <div
              key={idx}
              className="card-editorial p-6 rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F8F4FA] text-[#302343] flex items-center justify-center font-bold border border-[#E9E1ED]">
                  <Icon className="w-6 h-6 text-[#C6A46A]" />
                </div>
                <span className="badge-mono text-[9px] text-[#79618E] border-[#79618E]/30">
                  {fac.badge}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#302343]">
                  {fac.title}
                </h3>
                <p className="text-xs text-[#766D7C] leading-relaxed">
                  {fac.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visit Banner */}
      <div className="card-editorial p-8 sm:p-12 rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] text-center max-w-4xl mx-auto space-y-6">
        <span className="badge-mono border-[#C6A46A] text-[#302343]">
          SCHEDULE AN IN-PERSON INSPECTION
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#302343]">
          Experience Varahi Girls Hostel in Person
        </h2>
        <p className="text-sm text-[#332C38] max-w-xl mx-auto leading-relaxed">
          Parents and applicants are warmly welcomed to inspect the rooms, kitchen cleanliness, warden presence, and security measures in Shamshabad.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
            className="btn-ghost-luxury py-3 px-6 text-xs flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#79618E]" />
            <span>Call Proprietor ({VERIFIED_CONTACTS.primary_phone})</span>
          </a>
          <a
            href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
              'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I would like to schedule a room inspection visit.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-emerald-cta py-3 px-6 text-xs flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <Link href="/enquiry" className="btn-primary-navy py-3 px-6 text-xs">
            Submit Online Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
