'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight, ExternalLink, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function Footer() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <footer className="bg-[#302343] text-[#F8F4FA] border-t border-[#45335C]">
      {/* Upper Highlight Banner on Ivory canvas */}
      <div className="bg-[#F8F4FA] text-[#302343] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E9E1ED]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="badge-mono mb-2 border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
              PREMIER WOMEN&apos;S LIVING IN SHAMSHABAD
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
              Looking for safe, hygienic & modern accommodation near RGIA?
            </h3>
            <p className="text-[#332C38] text-sm max-w-2xl mt-1.5 leading-relaxed">
              Attached bathrooms, 24/7 CCTV surveillance, resident lady warden, 3-times daily homely food, and high-speed Wi-Fi. Just minutes from Rajiv Gandhi International Airport and major Shamshabad colleges.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/enquiry" className="btn-primary-navy py-3 px-6 text-xs">
              Admission Enquiry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
                'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I am enquiring about room availability.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-emerald-cta py-3 px-5 text-xs"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer in Deep Plum */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About Varahi Girls Hostel */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] text-[#302343] flex items-center justify-center font-serif text-lg font-bold border border-[#C6A46A]/40 shadow-xs">
                VGH
              </div>
              <div>
                <span className="font-serif text-lg text-[#FFFFFF] font-bold tracking-tight">
                  VARAHI GIRLS HOSTEL
                </span>
                <p className="font-mono text-[10px] tracking-wider text-[#C6A46A] uppercase">
                  BRANCH 1 (PREMIER WOMEN&apos;S LIVING)
                </p>
              </div>
            </div>
            <p className="text-xs text-[#E9E1ED]/85 leading-relaxed">
              Proprietor: <strong className="text-[#FFFFFF] font-semibold">{VERIFIED_CONTACTS.owner_proprietor}</strong>. High-security, fully monitored residence crafted exclusively for female college students, cabin crew, airport staff, and working professionals in Shamshabad, Hyderabad.
            </p>
            <div className="pt-2 text-xs text-[#E9E1ED]/85 space-y-1 font-mono">
              <p>
                <strong className="text-[#FFFFFF]">Google Rating:</strong> <span className="text-[#C6A46A] font-bold">{VERIFIED_CONTACTS.google_rating}</span>
              </p>
              <a
                href={VERIFIED_CONTACTS.google_map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#C6A46A] hover:underline pt-1"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C6A46A]" /> View on Google Maps
              </a>
            </div>
          </div>

          {/* Col 2: Room & Sharing Options */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#FFFFFF] font-bold border-b border-[#45335C] pb-2">
              Room Options (Non-AC)
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-[#E9E1ED]/90">
                <span>3-Sharing Comfort Room</span>
                <span className="font-mono text-[10px] text-[#C6A46A] font-bold">₹6,000 / mo</span>
              </li>
              <li className="flex items-center justify-between text-[#E9E1ED]/90">
                <span>4-Sharing Economy Room</span>
                <span className="font-mono text-[10px] text-[#C6A46A] font-bold">₹5,500 / mo</span>
              </li>
              <li className="flex items-center justify-between text-[#E9E1ED]/90">
                <span>5-Sharing Economy Room</span>
                <span className="font-mono text-[10px] text-[#C6A46A] font-bold">₹5,500 / mo</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/branches"
                  className="text-xs font-mono text-[#C6A46A] hover:underline flex items-center gap-1"
                >
                  <span>View Room Specifications</span>
                  <ArrowRight className="w-3 h-3 text-[#C6A46A]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Safety */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#FFFFFF] font-bold border-b border-[#45335C] pb-2">
              Resident & Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/student-accommodation" className="hover:text-[#C6A46A] text-[#E9E1ED]/90 transition-colors">
                  College Student Accommodation
                </Link>
              </li>
              <li>
                <Link href="/airport-employee-accommodation" className="hover:text-[#C6A46A] text-[#E9E1ED]/90 transition-colors">
                  Aviation & Working Women Living
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-[#C6A46A] text-[#E9E1ED]/90 transition-colors">
                  Hostel Amenities & Security
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#C6A46A] text-[#E9E1ED]/90 transition-colors">
                  Premises & Room Gallery
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-[#C6A46A] text-[#E9E1ED]/90 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#C6A46A] hover:underline flex items-center gap-1">
                  <span>Portal Login (Resident & Staff)</span>
                  <ExternalLink className="w-3 h-3 text-[#C6A46A]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#FFFFFF] font-bold border-b border-[#45335C] pb-2">
              Contact & Location
            </h4>
            <div className="space-y-3 text-xs text-[#E9E1ED]/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C6A46A] shrink-0 mt-0.5" />
                <span>
                  {branch.address_line1}, {branch.address_line2}, {branch.city} — {branch.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C6A46A] shrink-0" />
                <a
                  href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
                  className="hover:text-[#C6A46A] font-mono font-bold text-[#FFFFFF]"
                >
                  {VERIFIED_CONTACTS.primary_phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C6A46A] shrink-0" />
                <a
                  href={`mailto:${VERIFIED_CONTACTS.contact_email}`}
                  className="font-mono text-[11px] hover:text-[#C6A46A] break-all"
                >
                  {VERIFIED_CONTACTS.contact_email}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={VERIFIED_CONTACTS.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-luxury py-2 px-3 text-[11px] w-full text-center block"
                >
                  Google Maps Location Pin
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#45335C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D9C8E8]/70 font-mono">
          <p>© 2026 VARAHI GIRLS HOSTEL. All rights reserved. Managed by E. Bharath Chandra.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Shamshabad, Hyderabad</span>
            <span>•</span>
            <Link href="/login" className="hover:text-[#C6A46A] text-[#D9C8E8]/70">Staff Gateway</Link>
            <span>•</span>
            <Link href="/resident/login" className="hover:text-[#C6A46A] text-[#D9C8E8]/70">Resident Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
