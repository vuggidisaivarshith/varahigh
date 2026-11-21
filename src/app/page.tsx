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
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const branch = VARAHI_BRANCHES[0];

  return (
    <div className="space-y-16 pb-16 bg-[#F8F4FA]">
      {/* 1. HERO SECTION (Sophisticated Deep Plum-to-Royal Lavender Gradient with Champagne Gold Accents) */}
      <section className="relative overflow-hidden pt-14 pb-18 lg:pt-20 lg:pb-26 border-b border-[#45335C] bg-gradient-to-b from-[#302343] via-[#45335C] to-[#79618E] text-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 badge-mono border-[#C6A46A]/60 bg-[#FFFFFF]/10 text-[#F8F4FA] backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] animate-pulse" />
            <span>VARAHI GIRLS HOSTEL • BRANCH 1 • SHAMSHABAD NEAR RGIA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#FFFFFF] tracking-tight leading-[1.15]">
            A Safe, Dignified Place to Stay. <br />
            <span className="italic font-medium text-[#D9C8E8]">A Better Way to Live.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#F8F4FA]/90 font-normal leading-relaxed">
            Premium, high-security accommodation designed exclusively for female college students, working women, and RGIA airport staff in Shamshabad, Hyderabad.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/branches/1"
              className="btn-champagne-gold py-3 px-6 text-xs w-full sm:w-auto shadow-md flex items-center justify-center gap-2 font-bold"
            >
              <span>Explore Hostel & Rooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* BIG PROMINENT LOGIN BUTTON IN HERO */}
            <Link
              href="/login"
              className="bg-[#302343] hover:bg-[#79618E] text-[#FFFFFF] font-mono text-xs uppercase font-bold py-3 px-6 rounded-md shadow-md border-2 border-[#C6A46A] flex items-center justify-center gap-2 transition-all w-full sm:w-auto hover:scale-105 active:scale-95"
            >
              <Lock className="w-4 h-4 text-[#C6A46A]" />
              <span>Resident &amp; Staff Login</span>
            </Link>

            <a
              href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
                'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I am enquiring about room availability in Shamshabad.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-luxury py-3 px-6 text-xs w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FFFFFF] border-[#E9E1ED]/30"
            >
              <MessageCircle className="w-4 h-4 text-[#D9C8E8]" />
              <span>WhatsApp</span>
            </a>
            <a
              href={VERIFIED_CONTACTS.google_map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-luxury py-3 px-5 text-xs w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FFFFFF] border-[#C6A46A]/40"
            >
              <MapPin className="w-4 h-4 text-[#C6A46A]" />
              <span>Location Pin</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SHORT INTRODUCTION TO VARAHI GIRLS HOSTEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-editorial p-6 sm:p-10 bg-[#FFFFFF] border border-[#E9E1ED]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#F8F4FA]">
                ABOUT THE RESIDENCE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343]">
                Excellence in Women&apos;s Living in Shamshabad
              </h2>
              <p className="text-sm text-[#332C38] leading-relaxed">
                Founded and actively supervised by Proprietor <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong>, VARAHI GIRLS HOSTEL offers a secure, peaceful, and fully-equipped home-away-from-home. Located strategically near RGIA airport transit routes and Shamshabad colleges, we feature 3 fresh daily home-style buffet meals, high-speed fiber Wi-Fi, resident lady wardens, 24/7 CCTV surveillance, and attached washrooms with hot water geysers.
              </p>
            </div>
            <div className="md:col-span-4 grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED]">
                <p className="font-serif text-2xl font-bold text-[#302343]">Branch 1</p>
                <p className="text-[11px] font-mono text-[#766D7C] uppercase">Flagship</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED]">
                <p className="font-serif text-2xl font-bold text-[#C6A46A]">4.9★</p>
                <p className="text-[11px] font-mono text-[#766D7C] uppercase">Google Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRANCH SPECIFICATION CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E9E1ED] pb-4">
          <div>
            <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#F8F4FA]">
              VERIFIED PROPERTY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
              Varahi Girls Hostel — Branch 1
            </h2>
          </div>
          <p className="text-xs text-[#766D7C] font-mono">
            High-Security Women Enclave • Resident Lady Warden on Duty
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VARAHI_BRANCHES.map((b) => (
            <BranchCard key={b.id} branch={b} />
          ))}
          {/* Room sharing cards */}
          <div className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge-mono text-[9px] text-[#79618E] bg-[#D9C8E8]/30 border-[#D9C8E8]">
                  3-SHARING COMFORT
                </span>
                <span className="text-xs font-mono font-bold text-[#79618E]">₹6,000/mo</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#302343]">
                3-Sharing Non-AC Room
              </h3>
              <p className="text-xs text-[#766D7C] mt-1 leading-relaxed">
                Spacious room with attached washroom, hot water geyser, individual study desk, lockable wardrobe, high-speed Wi-Fi, and 3-times daily buffet meals.
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
                <span className="badge-mono text-[9px] text-[#C6A46A] bg-[#F8F4FA] border-[#C6A46A]/50">
                  4 &amp; 5 SHARING ECONOMY
                </span>
                <span className="text-xs font-mono font-bold text-[#79618E]">₹5,500/mo</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#302343]">
                4 &amp; 5-Sharing Non-AC Rooms
              </h3>
              <p className="text-xs text-[#766D7C] mt-1 leading-relaxed">
                Well-ventilated sharing layouts with attached washroom, geyser, daily housekeeping, Wi-Fi, and wholesome 3-times daily meals.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E9E1ED]">
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
          <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#F8F4FA]">
            STANDARD AMENITIES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343]">
            Included Hostel Facilities
          </h2>
          <p className="text-xs sm:text-sm text-[#766D7C]">
            Every resident receives essential utilities, security, and services included in the monthly tariff.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Utensils className="w-5 h-5 mx-auto text-[#C6A46A]" />
            <p className="font-serif text-xs font-bold text-[#302343]">3 Buffet Meals</p>
            <p className="text-[10px] text-[#766D7C]">South & North Indian</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Wifi className="w-5 h-5 mx-auto text-[#79618E]" />
            <p className="font-serif text-xs font-bold text-[#302343]">Fiber Wi-Fi</p>
            <p className="text-[10px] text-[#766D7C]">High-speed internet</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <ShieldCheck className="w-5 h-5 mx-auto text-[#79618E]" />
            <p className="font-serif text-xs font-bold text-[#302343]">24/7 Security</p>
            <p className="text-[10px] text-[#766D7C]">CCTV & Lady Warden</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Building2 className="w-5 h-5 mx-auto text-[#C6A46A]" />
            <p className="font-serif text-xs font-bold text-[#302343]">Hot Water</p>
            <p className="text-[10px] text-[#766D7C]">24/7 Geyser supply</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Sparkles className="w-5 h-5 mx-auto text-[#C6A46A]" />
            <p className="font-serif text-xs font-bold text-[#302343]">Housekeeping</p>
            <p className="text-[10px] text-[#766D7C]">Daily clean rooms</p>
          </div>
          <div className="card-editorial p-4 bg-[#FFFFFF] text-center space-y-2">
            <Clock className="w-5 h-5 mx-auto text-[#79618E]" />
            <p className="font-serif text-xs font-bold text-[#302343]">Washing Machines</p>
            <p className="text-[10px] text-[#766D7C]">Automatic laundry</p>
          </div>
        </div>
      </section>

      {/* 5. STUDENT AND AIRPORT PROFESSIONAL ACCOMMODATION OPTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-[#E9E1ED] pb-3">
          <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#F8F4FA]">
            TAILORED LIVING
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
            Accommodation by Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-editorial p-6 sm:p-8 bg-[#FFFFFF] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] flex items-center justify-center text-[#79618E]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#302343]">
              For Female College Students
            </h3>
            <p className="text-xs text-[#332C38] leading-relaxed">
              Quiet study environments, personal desks, parental visitor controls, and nutritious 3-times daily buffet meals located with easy access to college transit points across Shamshabad.
            </p>
            <Link
              href="/student-accommodation"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#79618E] hover:text-[#302343]"
            >
              <span>Explore Student Accommodation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card-editorial p-6 sm:p-8 bg-[#FFFFFF] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED] flex items-center justify-center text-[#C6A46A]">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#302343]">
              For RGIA Airport Staff & Working Women
            </h3>
            <p className="text-xs text-[#332C38] leading-relaxed">
              Strategically situated minutes from passenger gates and airline hubs. Flexible meal timing, early breakfast packing, and sound-insulated rooms tailored for 24/7 rotating airline shifts.
            </p>
            <Link
              href="/airport-employee-accommodation"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#79618E] hover:text-[#302343]"
            >
              <span>Explore Professional Living Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. GENUINE PROPERTY GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E9E1ED] pb-4">
          <div>
            <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#F8F4FA]">
              HOSTEL PREVIEWS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343] mt-1">
              Genuine Property Gallery
            </h2>
          </div>
          <a
            href={VERIFIED_CONTACTS.google_map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold text-[#302343] hover:text-[#C6A46A] flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C6A46A]" />
            <span>Google Maps Verified Listing (4.9★)</span>
            <ExternalLink className="w-3 h-3 text-[#C6A46A]" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-editorial overflow-hidden bg-[#FFFFFF] group">
            <div className="relative aspect-4/3 w-full bg-[#302343]">
              <Image
                src="/images/branches/branch1-main.svg"
                alt="Varahi Girls Hostel Building"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-serif text-xs font-bold text-[#302343]">Varahi Girls Hostel</p>
              <p className="text-[10px] text-[#766D7C]">Branch 1 Main Building</p>
            </div>
          </div>

          <div className="card-editorial overflow-hidden bg-[#FFFFFF] group">
            <div className="relative aspect-4/3 w-full bg-[#302343]">
              <Image
                src="/images/branches/branch5-main.svg"
                alt="Women Enclave Entrance"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-serif text-xs font-bold text-[#302343]">High-Security Gate</p>
              <p className="text-[10px] text-[#766D7C]">24/7 CCTV & Warden Desk</p>
            </div>
          </div>

          <div className="card-editorial overflow-hidden bg-[#FFFFFF] group">
            <div className="relative aspect-4/3 w-full bg-[#302343]">
              <Image
                src="/images/branches/branch2-main.svg"
                alt="Executive Room"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-serif text-xs font-bold text-[#302343]">Spacious Bedrooms</p>
              <p className="text-[10px] text-[#766D7C]">Attached Washroom & Geyser</p>
            </div>
          </div>

          <div className="card-editorial overflow-hidden bg-[#FFFFFF] group">
            <div className="relative aspect-4/3 w-full bg-[#302343]">
              <Image
                src="/images/branches/branch3-main.svg"
                alt="Dining Hall & Study Area"
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-serif text-xs font-bold text-[#302343]">Dining & Study Lounge</p>
              <p className="text-[10px] text-[#766D7C]">Hygienic Home Buffet Food</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ONE ENQUIRY / CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="enquiry-section">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#F8F4FA]">
            ONLINE ADMISSION INTAKE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302343]">
            Submit Admission Enquiry
          </h2>
          <p className="text-xs sm:text-sm text-[#766D7C]">
            Receive an instant reference number and schedule your hostel visit directly with owner E. Bharath Chandra.
          </p>
        </div>

        <EnquiryForm />
      </section>
    </div>
  );
}
