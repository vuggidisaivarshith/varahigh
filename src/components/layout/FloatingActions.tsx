'use client';

import React from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function FloatingActions() {
  const whatsappUrl =
    `https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=` +
    encodeURIComponent('Hello Varahi Girls Hostel Management (E. Bharath Chandra). I would like to enquire about room availability.');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Google Maps Location Pin */}
      <a
        href={VERIFIED_CONTACTS.google_map_link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#302343] hover:bg-[#79618E] text-[#C6A46A] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group relative border border-[#C6A46A]/50"
        aria-label="Google Maps Location Pin"
      >
        <MapPin className="w-5 h-5 text-[#C6A46A]" />
        <span className="absolute right-14 bg-[#302343] text-white font-mono text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded border border-[#45335C] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Google Maps Location
        </span>
      </a>

      {/* WhatsApp Quick Chat */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#79618E] hover:bg-[#302343] text-white flex items-center justify-center shadow-lg shadow-[#79618E]/30 hover:scale-110 active:scale-95 transition-all group relative border border-[#C6A46A]/50"
        aria-label="Chat on WhatsApp with Varahi Girls Hostel"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute right-14 bg-[#302343] text-white font-mono text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded border border-[#45335C] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          WhatsApp: {VERIFIED_CONTACTS.primary_phone}
        </span>
      </a>

      {/* Direct Phone Call */}
      <a
        href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
        className="w-12 h-12 rounded-full bg-[#302343] hover:bg-[#79618E] text-white flex items-center justify-center shadow-lg shadow-[#302343]/30 hover:scale-110 active:scale-95 transition-all group relative border border-[#C6A46A]/50"
        aria-label="Call Varahi Girls Hostel Management"
      >
        <Phone className="w-5 h-5 text-[#C6A46A]" />
        <span className="absolute right-14 bg-[#302343] text-white font-mono text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded border border-[#45335C] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Call: {VERIFIED_CONTACTS.primary_phone}
        </span>
      </a>
    </div>
  );
}
