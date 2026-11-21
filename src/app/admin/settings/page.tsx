'use client';

import React, { useState } from 'react';
import { VERIFIED_CONTACTS } from '@/lib/data/branches';
import { Settings, Save, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  const [businessName, setBusinessName] = useState(VERIFIED_CONTACTS.business_name);
  const [ownerName, setOwnerName] = useState(VERIFIED_CONTACTS.owner_proprietor);
  const [primaryPhone, setPrimaryPhone] = useState(VERIFIED_CONTACTS.primary_phone);
  const [secondaryPhone, setSecondaryPhone] = useState(VERIFIED_CONTACTS.secondary_phone);
  const [address, setAddress] = useState(VERIFIED_CONTACTS.flagship_address);
  const [gracePeriodDays, setGracePeriodDays] = useState('3');
  const [lateFeePerDay, setLateFeePerDay] = useState('100');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
        <div>
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            SYSTEM ARCHITECTURE & GLOBAL POLICIES
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1">
            Global ERP Settings
          </h1>
          <p className="text-xs text-[#718096]">
            Configure verified business contacts, billing parameters, grace periods, and late fee protocols.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-lg bg-[#EBF2F0] border border-[#A3C7BD] text-xs text-[#1D4038] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#477B70]" />
          <span>System configuration successfully updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Verified Business Parameters */}
        <div className="card-editorial p-6 bg-[#FFFFFF] border border-[#E5E0D7] space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#142B45] border-b border-[#E5E0D7] pb-2">
            Verified Business Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#142B45] mb-1">
                Business Legal Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#142B45] mb-1">
                Proprietor / Super Admin
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#142B45] mb-1">
                Primary Phone Helpline
              </label>
              <input
                type="text"
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#142B45] mb-1">
                Secondary Contact
              </label>
              <input
                type="text"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-[#142B45] mb-1">
              Verified Flagship Office Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
            />
          </div>
        </div>

        {/* Financial Billing Protocols */}
        <div className="card-editorial p-6 bg-[#FFFFFF] border border-[#E5E0D7] space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#142B45] border-b border-[#E5E0D7] pb-2">
            Joining-Date Cycle Billing Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#142B45] mb-1">
                Rent Due Grace Period (Days)
              </label>
              <input
                type="number"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
              />
              <p className="text-[10px] text-[#718096] mt-1">Days after cycle start before late fee accrues.</p>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-[#142B45] mb-1">
                Daily Overdue Penalty (₹ / day)
              </label>
              <input
                type="number"
                value={lateFeePerDay}
                onChange={(e) => setLateFeePerDay(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
              />
              <p className="text-[10px] text-[#718096] mt-1">Penalty applied per overdue day after grace.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary-navy text-xs py-2.5 px-6 flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
