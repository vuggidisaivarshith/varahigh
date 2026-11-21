'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Building2,
  Shield,
  User,
  MapPin,
  Lock,
} from 'lucide-react';
import { VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Clean, focused global navigation
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Hostel & Rooms', href: '/branches' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E9E1ED] text-[#302343] shadow-xs">
      {/* Top Verified Contact Bar (Deep Plum with Champagne Gold Accents) */}
      <div className="bg-[#302343] text-[#FFFFFF] text-[11px] py-1.5 px-4 font-mono tracking-wider border-b border-[#45335C]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C6A46A] animate-pulse" />
            <span className="text-[#F8F4FA]">
              VARAHI GIRLS HOSTEL • High-Security Women&apos;s Living • Shamshabad, Hyderabad
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10.5px]">
            <a
              href={VERIFIED_CONTACTS.google_map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-[#E9E1ED] hover:text-[#C6A46A] transition-colors"
            >
              <MapPin className="w-3 h-3 text-[#C6A46A]" /> Google Verified Location
            </a>
            <a
              href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
              className="flex items-center gap-1 text-[#C6A46A] hover:underline font-bold"
            >
              <Phone className="w-3 h-3 text-[#C6A46A]" /> {VERIFIED_CONTACTS.primary_phone}
            </a>
            <Link
              href="/login"
              className="bg-[#79618E] hover:bg-[#C6A46A] hover:text-[#302343] text-[#FFFFFF] font-bold py-1 px-3 rounded-full flex items-center gap-1.5 transition-all shadow-xs border border-[#C6A46A]/50"
            >
              <User className="w-3 h-3" />
              <span>Portal Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#302343] text-[#FFFFFF] flex items-center justify-center font-serif text-lg font-bold border border-[#C6A46A]/40 shadow-xs group-hover:scale-105 transition-transform duration-200">
              VGH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#302343]">
                  VARAHI GIRLS HOSTEL
                </span>
                <span className="badge-mono hidden sm:inline-flex text-[9px] py-0.5 px-1.5 border-[#C6A46A]/50 text-[#302343] bg-[#F8F4FA]">
                  BRANCH 1
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-[#766D7C] uppercase">
                Shamshabad • Hyderabad • Near RGIA
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 text-xs font-mono font-medium rounded-md transition-all ${
                  isActive(link.href)
                    ? 'text-[#79618E] bg-[#D9C8E8]/30 font-bold border-b-2 border-[#79618E]'
                    : 'text-[#332C38] hover:text-[#C6A46A] hover:bg-[#F8F4FA]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Primary Action Buttons — Featuring Big, Accessible Portal Login Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
                'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I would like to enquire about room availability.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-emerald-cta text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            
            <Link
              href="/enquiry"
              className="btn-ghost-luxury text-xs py-2.5 px-4 font-bold"
            >
              Apply Online
            </Link>

            {/* BIG, PROMINENT PORTAL LOGIN BUTTON */}
            <Link
              href="/login"
              className="bg-[#302343] hover:bg-[#79618E] text-[#FFFFFF] font-mono text-xs uppercase font-bold py-2.5 px-4.5 rounded-lg flex items-center gap-2 border border-[#C6A46A]/60 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <User className="w-4 h-4 text-[#C6A46A]" />
              <span>Portal Login</span>
            </Link>
          </div>

          {/* Mobile Quick Login & Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/login"
              className="bg-[#302343] hover:bg-[#79618E] text-[#FFFFFF] text-xs font-mono font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 border border-[#C6A46A]/60 shadow-xs active:scale-95 transition-all"
            >
              <User className="w-3.5 h-3.5 text-[#C6A46A]" />
              <span>Login</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#302343] hover:bg-[#F8F4FA] border border-[#E9E1ED]"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#302343]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#E9E1ED] bg-[#FFFFFF] px-4 pt-4 pb-6 space-y-4">
          {/* BIG PROMINENT LOGIN BUTTON FOR MOBILE USERS */}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#302343] hover:bg-[#79618E] text-[#FFFFFF] font-mono text-sm uppercase font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 border border-[#C6A46A] shadow-md transition-all active:scale-98"
          >
            <User className="w-5 h-5 text-[#C6A46A]" />
            <span>Resident &amp; Staff Login</span>
          </Link>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-mono ${
                  isActive(link.href)
                    ? 'text-[#79618E] bg-[#D9C8E8]/30 font-bold'
                    : 'text-[#332C38] hover:bg-[#F8F4FA]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E9E1ED] flex flex-col gap-2.5">
            <a
              href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
              className="btn-ghost-luxury py-2.5 text-xs text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#C6A46A]" />
              <span>Call: {VERIFIED_CONTACTS.primary_phone}</span>
            </a>
            <Link
              href="/enquiry"
              onClick={() => setIsOpen(false)}
              className="btn-primary-navy py-2.5 text-xs text-center font-bold"
            >
              Admission Enquiry
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
