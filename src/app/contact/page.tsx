import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, UserCheck, ArrowRight, MessageCircle, ExternalLink } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function ContactPage() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-[#F5F1E9]">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="badge-mono border-[#D6A85F] text-[#142B45]">
          CONTACT & LOCATION DESK
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#142B45]">
          Connect with <span className="italic font-normal">VARAHI GIRLS HOSTEL</span>
        </h1>
        <p className="text-[#263447] text-sm sm:text-base leading-relaxed">
          Reach out directly to Proprietor <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong> and our Shamshabad hostel admission desk for room visits, bed allotments, and parent queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-editorial p-8 space-y-6 bg-[#FFFFFF] border border-[#E5E0D7]">
            <h2 className="font-serif text-2xl font-bold text-[#142B45]">
              Branch 1 &amp; Admission Office
            </h2>

            <div className="space-y-4 text-xs text-[#263447]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D6A85F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142B45] text-sm block mb-0.5">Physical Address:</strong>
                  {branch.address_line1}, {branch.address_line2}, {branch.city} — {branch.pincode}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#477B70] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142B45] text-sm block mb-0.5">Direct Helpline / Owner:</strong>
                  <a href={`tel:${VERIFIED_CONTACTS.primary_phone}`} className="font-mono text-[#142B45] font-bold hover:underline text-sm block">
                    {VERIFIED_CONTACTS.primary_phone}
                  </a>
                  <span className="text-[#718096] text-[11px] block mt-0.5">
                    Proprietor: {VERIFIED_CONTACTS.owner_proprietor}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-[#D6A85F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142B45] text-sm block mb-0.5">Google Maps Listing:</strong>
                  <a
                    href={VERIFIED_CONTACTS.google_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[#142B45] font-bold hover:underline flex items-center gap-1"
                  >
                    Open Google Maps Pin (4.9★) <ExternalLink className="w-3 h-3 text-[#D6A85F]" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D6A85F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142B45] text-sm block mb-0.5">Official Email:</strong>
                  <a href="mailto:contact@varahigirlshostel.com" className="text-[#263447] hover:text-[#142B45] font-mono">
                    contact@varahigirlshostel.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#142B45] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#142B45] text-sm block mb-0.5">Visiting Hours & Check-ins:</strong>
                  Open 7 Days a Week • Safe 24-hour entry assistance for verified shift workers
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E0D7] flex flex-col gap-2">
              <a
                href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
                  'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I would like to enquire about room availability.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-emerald-cta w-full py-3 text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp ({VERIFIED_CONTACTS.primary_phone})</span>
              </a>
              <a
                href={VERIFIED_CONTACTS.google_map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-luxury w-full py-2.5 text-center text-xs flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D6A85F]" />
                <span>Navigate via Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Visit Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-editorial p-8 bg-[#FFFFFF] border border-[#E5E0D7] space-y-6">
            <div>
              <span className="badge-mono border-[#D6A85F] text-[#142B45]">
                HOSTEL VISIT &amp; INTAKE
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#142B45] mt-1">
                Schedule a Visit or Ask a Question
              </h2>
              <p className="text-xs text-[#718096] mt-1">
                Submit your enquiry below or apply directly through our admission form.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F5F1E9] border border-[#E5E0D7] space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#477B70]" />
                  <p className="font-mono text-xs font-bold text-[#142B45]">Safety & Parent Assurance</p>
                </div>
                <p className="text-xs text-[#263447] leading-relaxed">
                  Parents and guardians are welcome to inspect rooms, dining hygiene, and security measures. Please contact owner <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong> at <strong>{VERIFIED_CONTACTS.primary_phone}</strong> to coordinate a visit time.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E5E0D7] space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#142B45]">Online Admission Process:</h4>
                <ul className="space-y-2 text-xs text-[#718096]">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#142B45] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0">1</span>
                    <span>Submit the online admission form with sharing preference (1, 2, 3, or 4 sharing).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#142B45] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0">2</span>
                    <span>Hostel management confirms bed availability and issues your digital reference code.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#142B45] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0">3</span>
                    <span>Complete move-in, check-in verification with lady warden, and access your resident portal.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <Link href="/enquiry" className="btn-primary-navy py-3 px-6 text-xs w-full text-center flex items-center justify-center gap-2">
                  <span>Go to Full Admission Form</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
