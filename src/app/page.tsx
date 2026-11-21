import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import BranchCard from '@/components/ui/BranchCard';
import EnquiryForm from '@/components/enquiry/EnquiryForm';
import {
  Building2,
  GraduationCap,
  Plane,
  ShieldCheck,
  Utensils,
  Wifi,
  ArrowRight,
  Phone,
  Sparkles,
  Car,
  MessageCircle,
  ExternalLink,
  MapPin,
  Lock,
  HeartHandshake,
} from 'lucide-react';

export default function HomePage() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <div className="space-y-16 pb-16 bg-[#F5F1E9]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E5E0D7] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 badge-mono border-[#D6A85F] text-[#142B45]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#477B70] animate-pulse" />
            <span>VARAHI GIRLS HOSTEL • BRANCH 1 • SHAMSHABAD NEAR RGIA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#142B45] tracking-tight leading-[1.15]">
            A Safe, Dignified Place to Stay. <br />
            <span className="italic font-medium">A Better Way to Live.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#263447] font-normal leading-relaxed">
            Premium, high-security accommodation designed exclusively for female college students, working women, and RGIA airport staff in Shamshabad, Hyderabad.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/branches/1" className="btn-primary-navy py-3 px-8 text-xs w-full sm:w-auto">
              <span>Explore Hostel & Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
                'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I am enquiring about room availability in Shamshabad.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-emerald-cta py-3 px-8 text-xs w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire on WhatsApp</span>
            </a>
            <a
              href={VERIFIED_CONTACTS.google_map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-luxury py-3 px-6 text-xs w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#D6A85F]" />
              <span>Google Location Pin</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SHORT INTRODUCTION TO VARAHI GIRLS HOSTEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-editorial p-6 sm:p-10 bg-[#FFFFFF] border border-[#E5E0D7]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="badge-mono border-[#D6A85F] text-[#142B45]">
                ABOUT THE RESIDENCE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
                Excellence in Women&apos;s Living in Shamshabad
              </h2>
              <p className="text-sm text-[#263447] leading-relaxed">
                Founded and actively supervised by Proprietor <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong>, VARAHI GIRLS HOSTEL offers a secure, peaceful, and fully-equipped home-away-from-home. Located strategically near RGIA airport transit routes and Shamshabad colleges, we feature 3 fresh daily home-style buffet meals, high-speed fiber Wi-Fi, resident lady wardens, 24/7 CCTV surveillance, and attached washrooms with hot water geysers.
              </p>
            </div>
            <div className="md:col-span-4 grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-[#F5F1E9] border border-[#E5E0D7]">
                <p className="font-serif text-2xl font-bold text-[#142B45]">Branch 1</p>
                <p className="text-[11px] font-mono text-[#718096] uppercase">Flagship</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F5F1E9] border border-[#E5E0D7]">
                <p className="font-serif text-2xl font-bold text-[#477B70]">4.9★</p>
                <p className="text-[11px] font-mono text-[#718096] uppercase">Google Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRANCH SPECIFICATION CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E0D7] pb-4">
          <div>
            <span className="badge-mono border-[#D6A85F] text-[#142B45]">
              VERIFIED PROPERTY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
              Varahi Girls Hostel — Branch 1
            </h2>
          </div>
          <p className="text-xs text-[#718096] font-mono">
            High-Security Women Enclave • Resident Lady Warden on Duty
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VARAHI_BRANCHES.map((b) => (
            <BranchCard key={b.id} branch={b} />
          ))}
          {/* Room sharing cards */}
          <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E5E0D7] flex flex-col justify-between space-y-4">
            <div>
              <span className="badge-mono text-[9px] mb-2 text-[#142B45]">AC & NON-AC</span>
              <h3 className="font-serif text-xl font-bold text-[#142B45]">
                Single & 2-Sharing Executive Rooms
              </h3>
              <p className="text-xs text-[#718096] mt-1 leading-relaxed">
                Spacious premium rooms with attached modern bathrooms, individual study desks, full-length wardrobes, and 24/7 hot water supply.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E5E0D7]">
              <Link href="/enquiry" className="btn-primary-navy text-xs py-2 px-4 w-full text-center block">
                Reserve a Bed
              </Link>
            </div>
          </div>

          <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E5E0D7] flex flex-col justify-between space-y-4">
            <div>
              <span className="badge-mono text-[9px] mb-2 text-[#477B70]">BUDGET FRIENDLY</span>
              <h3 className="font-serif text-xl font-bold text-[#142B45]">
                3-Sharing & 4-Sharing Comfort Rooms
              </h3>
              <p className="text-xs text-[#718096] mt-1 leading-relaxed">
                Well-ventilated sharing layouts optimal for university students with individual locker storage and high-speed Wi-Fi access.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E5E0D7]">
              <a
                href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
                className="btn-ghost-luxury text-xs py-2 px-4 w-full text-center block"
              >
                Call: {VERIFIED_CONTACTS.primary_phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY FACILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            STANDARD AMENITIES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
            Included Hostel Facilities
          </h2>
          <p className="text-xs sm:text-sm text-[#718096]">
            Every resident receives essential utilities, security, and services included in the monthly tariff.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Utensils className="w-5 h-5 mx-auto text-[#D6A85F]" />
            <p className="font-serif text-xs font-bold text-[#142B45]">3 Buffet Meals</p>
            <p className="text-[10px] text-[#718096]">South & North Indian</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Wifi className="w-5 h-5 mx-auto text-[#D6A85F]" />
            <p className="font-serif text-xs font-bold text-[#142B45]">Fiber Wi-Fi</p>
            <p className="text-[10px] text-[#718096]">High-speed internet</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <ShieldCheck className="w-5 h-5 mx-auto text-[#477B70]" />
            <p className="font-serif text-xs font-bold text-[#142B45]">24/7 Security</p>
            <p className="text-[10px] text-[#718096]">CCTV & Lady Warden</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Building2 className="w-5 h-5 mx-auto text-[#D6A85F]" />
            <p className="font-serif text-xs font-bold text-[#142B45]">Hot Water</p>
            <p className="text-[10px] text-[#718096]">24/7 Geyser supply</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Sparkles className="w-5 h-5 mx-auto text-[#D6A85F]" />
            <p className="font-serif text-xs font-bold text-[#142B45]">Power Backup</p>
            <p className="text-[10px] text-[#718096]">Generator & Inverter</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Car className="w-5 h-5 mx-auto text-[#D6A85F]" />
            <p className="font-serif text-xs font-bold text-[#142B45]">Vehicle Parking</p>
            <p className="text-[10px] text-[#718096]">Gated & monitored</p>
          </div>
        </div>
      </section>

      {/* 5. STUDENT AND AIRPORT PROFESSIONAL ACCOMMODATION OPTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-[#E5E0D7] pb-3">
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            TAILORED LIVING
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
            Accommodation by Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-editorial p-6 sm:p-8 bg-[#FFFFFF] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F1E9] border border-[#E5E0D7] flex items-center justify-center text-[#142B45]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#142B45]">
              For Female College Students
            </h3>
            <p className="text-xs text-[#263447] leading-relaxed">
              Quiet study environments, personal desks, parental visitor controls, and nutritious 3-times daily buffet meals located with easy access to college transit points across Shamshabad.
            </p>
            <Link
              href="/student-accommodation"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#142B45] hover:text-[#D6A85F]"
            >
              <span>Explore Student Accommodation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card-editorial p-6 sm:p-8 bg-[#FFFFFF] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F1E9] border border-[#E5E0D7] flex items-center justify-center text-[#142B45]">
              <Plane className="w-5 h-5 text-[#477B70]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#142B45]">
              For RGIA Airport Staff & Working Women
            </h3>
            <p className="text-xs text-[#263447] leading-relaxed">
              Strategically situated minutes from passenger gates and airline hubs. Flexible meal timing, early breakfast packing, and sound-insulated rooms tailored for 24/7 rotating airline shifts.
            </p>
            <Link
              href="/airport-employee-accommodation"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#142B45] hover:text-[#D6A85F]"
            >
              <span>Explore Professional Living Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. GENUINE PROPERTY GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E0D7] pb-4">
          <div>
            <span className="badge-mono border-[#D6A85F] text-[#142B45]">
              HOSTEL PREVIEWS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
              Genuine Property Gallery
            </h2>
          </div>
          <a
            href={VERIFIED_CONTACTS.google_map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold text-[#142B45] hover:text-[#D6A85F] flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D6A85F]" />
            <span>Google Maps Verified Listing (4.9★)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-editorial overflow-hidden bg-[#FFFFFF] group">
            <div className="relative aspect-4/3 w-full bg-[#142B45]">
              <Image
                src="/images/branches/branch1-main.svg"
                alt="Varahi Girls Hostel Building"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-serif text-xs font-bold text-[#142B45]">Varahi Girls Hostel</p>
              <p className="text-[10px] text-[#718096]">Branch 1 Main Building</p>
            </div>
          </div>

          <div className="card-editorial overflow-hidden bg-[#FFFFFF] group">
            <div className="relative aspect-4/3 w-full bg-[#142B45]">
              <Image
                src="/images/branches/branch5-main.svg"
                alt="Women Enclave Entrance"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-serif text-xs font-bold text-[#142B45]">High-Security Gate</p>
              <p className="text-[10px] text-[#718096]">24/7 CCTV & Warden Desk</p>
            </div>
          </div>

          <div className="card-editorial overflow-hidden bg-[#FFFFFF] group">
            <div className="relative aspect-4/3 w-full bg-[#142B45]">
              <Image
                src="/images/branches/branch2-main.svg"
                alt="Executive Room"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-serif text-xs font-bold text-[#142B45]">Spacious Bedrooms</p>
              <p className="text-[10px] text-[#718096]">Attached Washroom & Geyser</p>
            </div>
          </div>

          <div className="card-editorial overflow-hidden bg-[#FFFFFF] group">
            <div className="relative aspect-4/3 w-full bg-[#142B45]">
              <Image
                src="/images/branches/branch3-main.svg"
                alt="Dining Hall & Study Area"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-serif text-xs font-bold text-[#142B45]">Dining & Study Lounge</p>
              <p className="text-[10px] text-[#718096]">Hygienic Home Buffet Food</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ONE ENQUIRY / CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="enquiry-section">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            ONLINE ADMISSION INTAKE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
            Submit Admission Enquiry
          </h2>
          <p className="text-xs sm:text-sm text-[#718096]">
            Receive an instant reference number and schedule your hostel visit directly with owner E. Bharath Chandra.
          </p>
        </div>

        <EnquiryForm />
      </section>
    </div>
  );
}
