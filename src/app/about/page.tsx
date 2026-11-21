import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, Building2, MapPin, Phone, Mail, Award, CheckCircle2, ExternalLink } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function AboutPage() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-[#F8F4FA]">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="badge-mono border-[#C6A46A] text-[#302343]">
          ABOUT VARAHI GIRLS HOSTEL
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#302343] leading-tight">
          A Commitment to Safety, Dignity & <span className="italic text-[#302343] font-medium">Home-Like Comfort</span>
        </h1>
        <p className="text-[#332C38] text-base leading-relaxed">
          Operating in Shamshabad, Hyderabad under the active leadership of Proprietor <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong>, VARAHI GIRLS HOSTEL provides a premier, secure, and fully monitored living environment exclusively for women.
        </p>
      </div>

      {/* Leadership Profile */}
      <div className="card-editorial p-8 sm:p-12 rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center">
            <div className="w-28 h-28 rounded-2xl bg-[#302343] text-[#FFFFFF] mx-auto flex items-center justify-center font-serif font-bold text-3xl shadow-xs border border-[#45335C]">
              BC
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#302343] mt-4">{VERIFIED_CONTACTS.owner_proprietor}</h3>
            <p className="font-mono text-xs font-bold uppercase text-[#C6A46A] tracking-wider">Founder & Proprietor</p>
            <p className="text-xs text-[#766D7C] mt-0.5">VARAHI GIRLS HOSTEL</p>
            <div className="pt-3 flex justify-center gap-2">
              <a
                href={VERIFIED_CONTACTS.google_map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="badge-mono text-[9px] hover:border-[#302343] flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-[#C6A46A]" /> Google Verified 4.9★
              </a>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343]">
              “Building Safety, Trust & High Standards for Women in Shamshabad”
            </h4>
            <p className="text-sm text-[#332C38] leading-relaxed">
              When we established VARAHI GIRLS HOSTEL in Shamshabad, our core mission was clear: create a residence where parents have total peace of mind and residents feel entirely safe, respected, and comfortable.
            </p>
            <p className="text-sm text-[#332C38] leading-relaxed">
              Equipped with 24/7 CCTV surveillance, a dedicated resident lady warden, daily housekeeping, and fresh home-style South and North Indian meals cooked 3 times daily, Varahi Girls Hostel provides an ideal home for college students and working professionals near Rajiv Gandhi International Airport (RGIA).
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#766D7C] border-t border-[#E9E1ED] font-mono">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#C6A46A]" /> Shamshabad, Hyderabad</span>
              <a href={`tel:${VERIFIED_CONTACTS.primary_phone}`} className="flex items-center gap-1.5 hover:text-[#302343] font-bold text-[#302343]">
                <Phone className="w-4 h-4 text-[#79618E]" /> {VERIFIED_CONTACTS.primary_phone}
              </a>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#C6A46A]" /> {VERIFIED_CONTACTS.contact_email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#F8F4FA] text-[#302343] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-[#C6A46A]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#302343]">Multi-Tier Women Safety</h4>
          <p className="text-xs text-[#766D7C] leading-relaxed">
            Continuous CCTV monitoring, on-duty resident lady warden, secure gated entry, and strict visitor verification protocols.
          </p>
        </div>

        <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#F8F4FA] text-[#302343] flex items-center justify-center font-bold">
            <HeartHandshake className="w-6 h-6 text-[#79618E]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#302343]">Wholesome Homely Dining</h4>
          <p className="text-xs text-[#766D7C] leading-relaxed">
            Hygienic meals prepared fresh 3 times daily, plus shift food packaging for early morning airline and hospital professionals.
          </p>
        </div>

        <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#F8F4FA] text-[#302343] flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6 text-[#C6A46A]" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#302343]">Complete Amenities</h4>
          <p className="text-xs text-[#766D7C] leading-relaxed">
            Attached bathrooms with 24/7 hot water geysers, high-speed fiber Wi-Fi, daily housekeeping, and automatic laundry facilities.
          </p>
        </div>
      </div>
    </div>
  );
}
