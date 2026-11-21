import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, MapPin, Phone, MessageCircle } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function GalleryPage() {
  const galleryItems = [
    {
      title: 'Varahi Girls Hostel — Building Elevation',
      category: 'Exterior & Architecture',
      description: 'Modern 5-floor residential structure located in a secure neighborhood in Shamshabad.',
      image: '/images/branches/branch1-main.svg',
    },
    {
      title: 'High-Security Gated Entrance & Warden Desk',
      category: 'Security & Access',
      description: '24/7 CCTV surveillance, biometric gating, and round-the-clock resident lady warden checkpost.',
      image: '/images/branches/branch5-main.svg',
    },
    {
      title: 'Executive Double-Sharing Bedroom',
      category: 'Living Quarters',
      description: 'Attached modern washroom, geyser, ergonomic study desks, and private full-length wardrobes.',
      image: '/images/branches/branch2-main.svg',
    },
    {
      title: 'Dining Hall & Homely Buffet Counter',
      category: 'Dining & Nutrition',
      description: 'Hygienic dining hall serving freshly cooked 3-times South & North Indian meals daily.',
      image: '/images/branches/branch3-main.svg',
    },
    {
      title: 'Private Attached Washrooms',
      category: 'Hygiene & Utilities',
      description: 'Clean tiled bathrooms with 24/7 hot water geysers and daily professional sanitation.',
      image: '/images/branches/branch4-main.svg',
    },
    {
      title: 'Study Lounge & Common Area',
      category: 'Student & Study',
      description: 'Peaceful ambience with high-speed fiber Wi-Fi and power backup for late-night exam prep.',
      image: '/images/branches/branch1-main.svg',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-[#F8F4FA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E9E1ED] pb-6">
        <div>
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            CAMPUS &amp; ROOM PREVIEWS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#302343] mt-1">
            Varahi Girls Hostel Visual Showcase
          </h1>
          <p className="text-[#332C38] text-sm mt-1 max-w-xl">
            Authentic preview of rooms, security enclaves, dining, and facilities at our Shamshabad residence.
          </p>
        </div>

        <a
          href={VERIFIED_CONTACTS.google_map_link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost-luxury text-xs py-2.5 px-4 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4 text-[#C6A46A]" />
          <span>Google Business Listing ({VERIFIED_CONTACTS.google_rating})</span>
          <ExternalLink className="w-3 h-3 text-[#766D7C]" />
        </a>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            className="card-editorial overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] flex flex-col group shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-4/3 w-full bg-[#302343] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#302343]/85 text-[#F8F4FA] font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#C6A46A]/50">
                {item.category}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#302343] group-hover:text-[#C6A46A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#766D7C] mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Inspection CTA */}
      <div className="card-editorial p-8 rounded-2xl bg-[#FFFFFF] border border-[#E9E1ED] text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#302343]">
          Inspect our rooms in person today
        </h3>
        <p className="text-xs sm:text-sm text-[#766D7C] max-w-lg mx-auto">
          Contact Proprietor E. Bharath Chandra to schedule a visit or check room availability.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
            className="btn-primary-navy py-2.5 px-6 text-xs flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call: {VERIFIED_CONTACTS.primary_phone}</span>
          </a>
          <Link href="/enquiry" className="btn-emerald-cta py-2.5 px-6 text-xs">
            Admission Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
