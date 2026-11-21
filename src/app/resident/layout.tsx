'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Building2,
  FileText,
  CreditCard,
  Wallet,
  ShieldCheck,
  Receipt,
  Bell,
  LifeBuoy,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Resident } from '@/types/database';

export default function ResidentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render without the portal sidebar/header
  if (pathname === '/resident/login') {
    return <>{children}</>;
  }

  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResidentData = async () => {
    setLoading(true);
    try {
      const match = document.cookie.match(/(?:devi|varahi)_resident_id=([^;]+)/);
      const targetId = match ? match[1] : null;

      if (!targetId) {
        setResident(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/residents/${targetId}`);
      const json = await res.json();
      if (json.success && json.data?.resident) {
        setResident(json.data.resident);
      } else {
        setResident(null);
      }
    } catch {
      setResident(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidentData();
  }, [pathname]);

  const handleSignOut = () => {
    document.cookie = 'devi_resident_id=; path=/; max-age=0';
    document.cookie = 'varahi_resident_id=; path=/; max-age=0';
    router.push('/resident/login');
  };

  const portalNav = [
    { name: 'Dashboard', href: '/resident/dashboard', icon: LayoutDashboard },
    { name: 'Rent Invoices & Pay', href: '/resident/invoices', icon: FileText, highlight: true },
    { name: 'Payment History', href: '/resident/payments', icon: CreditCard },
    { name: 'Advance Rent', href: '/resident/advance', icon: Wallet },
    { name: 'Security Deposit', href: '/resident/deposits', icon: ShieldCheck },
    { name: 'Digital Receipts', href: '/resident/receipts', icon: Receipt },
    { name: 'My Profile', href: '/resident/profile', icon: User },
    { name: 'My Hostel & Room', href: '/resident/my-hostel', icon: Building2 },
    { name: 'Notifications', href: '/resident/notifications', icon: Bell },
    { name: 'Support', href: '/resident/support', icon: LifeBuoy },
  ];

  // If no resident is authenticated, show login prompt
  if (!loading && !resident) {
    return (
      <div className="min-h-screen bg-[#F5F1E9] py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="card-editorial max-w-md mx-auto p-8 bg-[#FFFFFF] text-center space-y-5 border border-[#E5E0D7]">
          <div className="w-12 h-12 rounded-xl bg-[#F5F1E9] text-[#142B45] flex items-center justify-center mx-auto border border-[#E5E0D7]">
            <Lock className="w-6 h-6 text-[#D6A85F]" />
          </div>
          <div className="space-y-1">
            <span className="badge-mono border-[#D6A85F] text-[#142B45]">
              AUTHENTICATION REQUIRED
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#142B45]">
              Resident Portal Access
            </h2>
            <p className="text-xs text-[#718096] leading-relaxed">
              Please sign in with your permanent Varahi Resident ID or registered mobile number to access your room details, invoices, and payment ledger.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/resident/login" className="btn-primary-navy w-full py-3 text-xs">
              Go to Resident Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E9] text-[#142B45] flex flex-col">
      {/* Resident Top Identity Banner */}
      <div className="bg-[#142B45] text-[#FFFFFF] py-4 px-4 sm:px-6 lg:px-8 border-b border-[#1F3C5F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D6A85F] text-[#142B45] font-serif font-black text-xl flex items-center justify-center shadow-xs">
              {resident?.full_name?.slice(0, 2).toUpperCase() || 'VG'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-[#FFFFFF]">
                  {resident?.full_name}
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#D6A85F]/20 text-[#D6A85F] border border-[#D6A85F]/40">
                  {resident?.resident_id}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  resident?.category === 'student' ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#477B70]/30 text-[#477B70]'
                }`}>
                  {resident?.category === 'student' ? '🎓 College Student' : '✈️ RGIA Aviation Staff'}
                </span>
              </div>
              <p className="text-xs text-[#E5E0D7]/80 mt-1 font-mono">
                Branch {resident?.current_branch_code} • Floor {resident?.current_floor_number} • Room {resident?.current_room_number} (Bed {resident?.current_bed_number})
              </p>
            </div>
          </div>

          {/* Quick Pay CTA & Sign Out */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <Link
              href="/resident/invoices"
              className="btn-emerald-cta text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay Rent Online</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-[#E5E0D7] hover:text-[#FFFFFF] hover:bg-[#1F3C5F] transition-colors flex items-center gap-1 text-xs"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subnavigation Bar with Clear Payment & Ledger Tabs */}
      <div className="bg-[#FFFFFF] border-b border-[#E5E0D7] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none">
            {portalNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#142B45] text-[#FFFFFF] shadow-xs'
                      : item.highlight
                      ? 'text-[#477B70] bg-[#F5F1E9] hover:bg-[#E5E0D7] font-bold'
                      : 'text-[#718096] hover:text-[#142B45] hover:bg-[#F5F1E9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
