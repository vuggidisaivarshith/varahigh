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
        className="w-12 h-12 rounded-full bg-[#142B45] hover:bg-[#1F3C5F] text-[#D6A85F] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group relative border border-[#D6A85F]/50"
        aria-label="Google Maps Location Pin"
      >
        <MapPin className="w-5 h-5 text-[#D6A85F]" />
        <span className="absolute right-14 bg-[#142B45] text-white font-mono text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded border border-[#1F3C5F] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Google Maps Location
        </span>
      </a>

      {/* WhatsApp Quick Chat */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#059669] hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:scale-110 active:scale-95 transition-all group relative border border-emerald-400"
        aria-label="Chat on WhatsApp with Varahi Girls Hostel"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-14 bg-[#142B45] text-white font-mono text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded border border-[#1F3C5F] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          WhatsApp: {VERIFIED_CONTACTS.primary_phone}
        </span>
      </a>

      {/* Direct Phone Call */}
      <a
        href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
        className="w-12 h-12 rounded-full bg-[#142B45] hover:bg-[#1F3C5F] text-white flex items-center justify-center shadow-lg shadow-slate-900/30 hover:scale-110 active:scale-95 transition-all group relative border border-[#1F3C5F]"
        aria-label="Call Varahi Girls Hostel Management"
      >
        <Phone className="w-5 h-5 text-[#D6A85F]" />
        <span className="absolute right-14 bg-[#142B45] text-white font-mono text-[10px] tracking-wider uppercase font-bold px-3 py-1.5 rounded border border-[#1F3C5F] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Call: {VERIFIED_CONTACTS.primary_phone}
        </span>
      </a>
    </div>
  );
}
