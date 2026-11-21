'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Layers,
  Bed,
  Mail,
  UserCheck,
  Users,
  FileText,
  CreditCard,
  Receipt,
  Wallet,
  ShieldCheck,
  TrendingDown,
  Scale,
  Bell,
  LifeBuoy,
  UserPlus,
  PieChart,
  Shield,
  Settings,
  History,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on admin login page, render children cleanly without portal chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const [activeRole, setActiveRole] = useState<string>('owner');
  const [activeName, setActiveName] = useState<string>('E. Bharath Chandra');
  const [activeBranch, setActiveBranch] = useState<string>('Branch 1 (Flagship)');

  useEffect(() => {
    const roleMatch = document.cookie.match(/(?:devi|varahi)_staff_role=([^;]+)/);
    const nameMatch = document.cookie.match(/(?:devi|varahi)_staff_name=([^;]+)/);
    const branchMatch = document.cookie.match(/(?:devi|varahi)_staff_branch=([^;]+)/);

    if (roleMatch) setActiveRole(roleMatch[1]);
    if (nameMatch) setActiveName(decodeURIComponent(nameMatch[1]));
    if (branchMatch && branchMatch[1] !== 'all') {
      setActiveBranch(`Branch ${branchMatch[1]}`);
    }
  }, [pathname]);

  const staffRolePresets = [
    { role: 'owner', name: 'E. Bharath Chandra', branch: 'Branch 1 (Global Control)', title: 'Owner / Super Admin' },
    { role: 'warden', name: 'P. Sunitha Reddy', branch: 'Branch 1 (Girls Hostel)', title: 'Resident Lady Warden' },
    { role: 'accountant', name: 'K. Sridhar Rao', branch: 'Branch 1 (Finance Ledger)', title: 'Hostel Accountant' },
  ];

  const handleSwitchStaff = (preset: (typeof staffRolePresets)[0]) => {
    document.cookie = `varahi_staff_role=${preset.role}; path=/; max-age=86400`;
    document.cookie = `varahi_staff_name=${encodeURIComponent(preset.name)}; path=/; max-age=86400`;
    document.cookie = `devi_staff_role=${preset.role}; path=/; max-age=86400`;
    document.cookie = `devi_staff_name=${encodeURIComponent(preset.name)}; path=/; max-age=86400`;
    setActiveRole(preset.role);
    setActiveName(preset.name);
    setActiveBranch(preset.branch);
  };

  const navGroups = [
    {
      group: 'Core Management',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Branch Details', href: '/admin/branches', icon: Building2 },
        { name: 'Floors & Rooms', href: '/admin/floors-rooms', icon: Layers },
        { name: 'Beds & Vacancy', href: '/admin/inventory', icon: Bed },
        { name: 'Enquiries', href: '/admin/enquiries', icon: Mail },
        { name: 'Admissions', href: '/admin/admissions', icon: UserCheck },
        { name: 'Residents', href: '/admin/residents', icon: Users },
      ],
    },
    {
      group: 'Transactions & Finance',
      items: [
        { name: 'Transactions Ledger', href: '/admin/finances/transactions', icon: Receipt },
        { name: 'Invoices & Billing', href: '/admin/finances/invoices', icon: FileText },
        { name: 'Payments Ledger', href: '/admin/finances/payments', icon: CreditCard },
        { name: 'Advance Rent', href: '/admin/finances/advance', icon: Wallet },
        { name: 'Security Deposits', href: '/admin/finances/deposits', icon: ShieldCheck },
        { name: 'Branch Expenses', href: '/admin/finances/expenses', icon: TrendingDown },
        { name: 'Cash Reconciliation', href: '/admin/finances/reconciliation', icon: Scale },
        { name: 'Financial Reports', href: '/admin/finances/reports', icon: PieChart },
      ],
    },
    {
      group: 'Hostel Operations',
      items: [
        { name: 'Reminders & Tasks', href: '/admin/reminders', icon: Bell },
        { name: 'Complaints', href: '/admin/complaints', icon: LifeBuoy },
        { name: 'Visitor Passes', href: '/admin/visitors', icon: UserPlus },
      ],
    },
    {
      group: 'Administration',
      items: [
        { name: 'Staff & Roles', href: '/admin/staff', icon: Shield },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F8F4FA] text-[#302343] flex flex-col">
      {/* Top Staff Header */}
      <header className="bg-[#302343] text-[#FFFFFF] border-b border-[#45335C] sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            {/* Mobile Sidebar Toggle & Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-md text-[#E9E1ED] hover:bg-[#45335C]"
                aria-label="Toggle admin sidebar"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] text-[#302343] flex items-center justify-center font-serif font-black text-sm">
                  VGH
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold tracking-tight text-[#FFFFFF]">
                      VARAHI GIRLS HOSTEL
                    </span>
                    <span className="bg-[#C6A46A] text-[#302343] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                      MANAGEMENT ERP
                    </span>
                  </div>
                  <p className="text-[10.5px] font-mono text-[#E9E1ED]/80">
                    Active: <strong className="text-[#FFFFFF]">{activeName}</strong> • <span className="text-[#C6A46A]">{activeBranch}</span>
                  </p>
                </div>
              </Link>
            </div>

            {/* Quick Actions & Role Switcher */}
            <div className="flex items-center flex-wrap gap-2.5 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 bg-[#45335C] border border-[#302343] rounded-lg px-2.5 py-1 text-xs">
                <span className="text-[#E9E1ED] text-[11px] font-mono">Role:</span>
                <select
                  value={staffRolePresets.find(p => p.name === activeName)?.role || 'owner'}
                  onChange={(e) => {
                    const preset = staffRolePresets.find(p => p.role === e.target.value);
                    if (preset) handleSwitchStaff(preset);
                  }}
                  className="bg-transparent text-[#C6A46A] font-bold text-xs focus:outline-none cursor-pointer"
                >
                  {staffRolePresets.map((p) => (
                    <option key={p.role} value={p.role} className="bg-[#302343] text-[#FFFFFF]">
                      {p.title} ({p.name})
                    </option>
                  ))}
                </select>
              </div>

              <Link
                href="/admin/finances/payments"
                className="btn-emerald-cta text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </Link>

              <Link
                href="/admin/admissions"
                className="btn-champagne-gold text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>New Admission</span>
              </Link>

              <Link
                href="/admin/login"
                className="text-[#E9E1ED] hover:text-[#FFFFFF] p-1.5 rounded-md hover:bg-[#45335C] transition-colors"
                title="Switch Account"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Full Responsive Sidebar */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar (and Drawer on Mobile) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#FFFFFF] border-r border-[#E9E1ED] p-4 overflow-y-auto transition-transform duration-200 lg:static lg:block lg:w-64 lg:rounded-xl lg:border lg:shadow-xs lg:overflow-visible ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#766D7C] px-2.5 pb-1">
                  {group.group}
                </p>
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-[#302343] text-[#FFFFFF] font-bold shadow-xs'
                          : 'text-[#332C38] hover:bg-[#F8F4FA] hover:text-[#302343]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#C6A46A]' : 'text-[#766D7C]'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
