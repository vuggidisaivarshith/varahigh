'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight, ExternalLink, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function Footer() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <footer className="bg-[#142B45] text-[#E5E0D7] border-t border-[#1F3C5F]">
      {/* Upper Highlight Banner on warm ivory canvas */}
      <div className="bg-[#F5F1E9] text-[#142B45] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E5E0D7]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="badge-mono mb-2 border-[#D6A85F] text-[#142B45]">
              PREMIER WOMEN&apos;S LIVING IN SHAMSHABAD
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
              Looking for safe, hygienic & modern accommodation near RGIA?
            </h3>
            <p className="text-[#263447] text-sm max-w-2xl mt-1.5 leading-relaxed">
              Attached bathrooms, 24/7 CCTV surveillance, resident lady warden, 3-times daily homely food, high-speed Wi-Fi, and 100% generator power backup. Just minutes from Rajiv Gandhi International Airport and major Shamshabad colleges.
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

      {/* Main Multi-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About Varahi Girls Hostel */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] text-[#142B45] flex items-center justify-center font-serif text-lg font-bold border border-[#E5E0D7]">
                VGH
              </div>
              <div>
                <span className="font-serif text-lg text-[#FFFFFF] font-bold tracking-tight">
                  VARAHI GIRLS HOSTEL
                </span>
                <p className="font-mono text-[10px] tracking-wider text-[#D6A85F] uppercase">
                  BRANCH 1 (PREMIER WOMEN&apos;S LIVING)
                </p>
              </div>
            </div>
            <p className="text-xs text-[#E5E0D7]/80 leading-relaxed">
              Proprietor: <strong className="text-[#FFFFFF] font-semibold">{VERIFIED_CONTACTS.owner_proprietor}</strong>. High-security, fully monitored residence crafted exclusively for female college students, cabin crew, airport staff, and working professionals in Shamshabad, Hyderabad.
            </p>
            <div className="pt-2 text-xs text-[#E5E0D7]/80 space-y-1 font-mono">
              <p>
                <strong className="text-[#FFFFFF]">Google Rating:</strong> {VERIFIED_CONTACTS.google_rating}
              </p>
              <a
                href={VERIFIED_CONTACTS.google_map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#D6A85F] hover:underline pt-1"
              >
                <MapPin className="w-3.5 h-3.5" /> View on Google Maps
              </a>
            </div>
          </div>

          {/* Col 2: Room & Sharing Options */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#FFFFFF] font-bold border-b border-[#1F3C5F] pb-2">
              Room Options
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-[#E5E0D7]/90">
                <span>Single Sharing (Private Room)</span>
                <span className="font-mono text-[10px] text-[#D6A85F]">AC / Non-AC</span>
              </li>
              <li className="flex items-center justify-between text-[#E5E0D7]/90">
                <span>2-Sharing Executive Room</span>
                <span className="font-mono text-[10px] text-[#D6A85F]">Attached Bath</span>
              </li>
              <li className="flex items-center justify-between text-[#E5E0D7]/90">
                <span>3-Sharing Comfort Room</span>
                <span className="font-mono text-[10px] text-[#D6A85F]">Student Choice</span>
              </li>
              <li className="flex items-center justify-between text-[#E5E0D7]/90">
                <span>4-Sharing Economy Room</span>
                <span className="font-mono text-[10px] text-[#D6A85F]">Budget Friendly</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/branches/1"
                  className="text-xs font-mono text-[#D6A85F] hover:underline flex items-center gap-1"
                >
                  <span>View Branch 1 Specifications</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Safety */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#FFFFFF] font-bold border-b border-[#1F3C5F] pb-2">
              Resident & Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/student-accommodation" className="hover:text-[#FFFFFF] transition-colors">
                  College Student Accommodation
                </Link>
              </li>
              <li>
                <Link href="/airport-employee-accommodation" className="hover:text-[#FFFFFF] transition-colors">
                  Aviation & Working Women Living
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-[#FFFFFF] transition-colors">
                  Hostel Amenities & Security
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#FFFFFF] transition-colors">
                  Premises & Room Gallery
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-[#FFFFFF] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#D6A85F] hover:underline flex items-center gap-1">
                  <span>Portal Login (Resident & Staff)</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#FFFFFF] font-bold border-b border-[#1F3C5F] pb-2">
              Contact & Location
            </h4>
            <div className="space-y-3 text-xs text-[#E5E0D7]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6A85F] shrink-0 mt-0.5" />
                <span>
                  {branch.address_line1}, {branch.address_line2}, {branch.city} — {branch.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#477B70] shrink-0" />
                <a
                  href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
                  className="hover:text-[#FFFFFF] font-mono font-bold text-[#FFFFFF]"
                >
                  {VERIFIED_CONTACTS.primary_phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D6A85F] shrink-0" />
                <span className="font-mono">contact@varahigirlshostel.com</span>
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
        <div className="mt-12 pt-6 border-t border-[#1F3C5F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#718096] font-mono">
          <p>© 2026 VARAHI GIRLS HOSTEL. All rights reserved. Managed by E. Bharath Chandra.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Shamshabad, Hyderabad</span>
            <span>•</span>
            <Link href="/login" className="hover:text-[#E5E0D7]">Staff Gateway</Link>
            <span>•</span>
            <Link href="/resident/login" className="hover:text-[#E5E0D7]">Resident Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
