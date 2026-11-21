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
    { name: 'Portal Login', href: '/login' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E5E0D7] text-[#142B45] shadow-xs">
      {/* Top Verified Contact Bar */}
      <div className="bg-[#142B45] text-[#FFFFFF] text-[11px] py-1.5 px-4 font-mono tracking-wider border-b border-[#1F3C5F]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#477B70] animate-pulse" />
            <span className="text-[#F5F1E9]">
              VARAHI GIRLS HOSTEL • High-Security Women&apos;s Living • Shamshabad, Hyderabad
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10.5px]">
            <a
              href={VERIFIED_CONTACTS.google_map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-[#E5E0D7] hover:text-[#D6A85F] transition-colors"
            >
              <MapPin className="w-3 h-3 text-[#D6A85F]" /> Google Verified Location
            </a>
            <a
              href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
              className="flex items-center gap-1 text-[#D6A85F] hover:underline font-bold"
            >
              <Phone className="w-3 h-3" /> {VERIFIED_CONTACTS.primary_phone}
            </a>
            <Link
              href="/login"
              className="text-[#E5E0D7] hover:text-[#FFFFFF] flex items-center gap-1 transition-colors pl-2 border-l border-[#1F3C5F]"
            >
              <User className="w-3 h-3 text-[#D6A85F]" />
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
            <div className="w-10 h-10 rounded-lg bg-[#142B45] text-[#FFFFFF] flex items-center justify-center font-serif text-lg font-bold border border-[#1F3C5F] shadow-xs group-hover:scale-105 transition-transform duration-200">
              VGH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#142B45]">
                  VARAHI GIRLS HOSTEL
                </span>
                <span className="badge-mono hidden sm:inline-flex text-[9px] py-0.5 px-1.5 border-[#D6A85F]/50 text-[#142B45]">
                  BRANCH 1
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-[#718096] uppercase">
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
                className={`px-3 py-2 text-xs font-mono font-medium rounded-md transition-all ${
                  isActive(link.href)
                    ? 'text-[#142B45] bg-[#F5F1E9] font-bold border-b-2 border-[#142B45]'
                    : 'text-[#263447] hover:text-[#142B45] hover:bg-[#F5F1E9]/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Primary Action Buttons */}
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
              className="btn-primary-navy text-xs py-2 px-4"
            >
              Apply Online
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#142B45] hover:bg-[#F5F1E9] border border-[#E5E0D7]"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#E5E0D7] bg-[#FFFFFF] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-mono ${
                  isActive(link.href)
                    ? 'text-[#142B45] bg-[#F5F1E9] font-bold'
                    : 'text-[#263447] hover:bg-[#F5F1E9]/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E5E0D7] flex flex-col gap-2">
            <a
              href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
              className="btn-ghost-luxury py-2.5 text-xs text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#D6A85F]" />
              <span>Call: {VERIFIED_CONTACTS.primary_phone}</span>
            </a>
            <Link
              href="/enquiry"
              onClick={() => setIsOpen(false)}
              className="btn-primary-navy py-2.5 text-xs text-center"
            >
              Admission Enquiry
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
