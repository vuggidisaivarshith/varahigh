import React from 'react';
import EnquiryForm from '@/components/enquiry/EnquiryForm';
import { ShieldCheck, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';

export const metadata = {
  title: 'Admission Enquiry — VARAHI GIRLS HOSTEL Shamshabad',
  description:
    'Submit an online admission enquiry for Varahi Girls Hostel (Branch 1) in Shamshabad, Hyderabad near RGIA. 3, 4, and 5-sharing Non-AC rooms for female students and working professionals.',
};

export default function EnquiryPage() {
  return (
    <div className="bg-[#F8F4FA] min-h-screen py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="badge-mono border-[#C6A46A] text-[#302343]">
            ONLINE ADMISSION DESK
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#302343]">
            Apply for Accommodation
          </h1>
          <p className="text-xs sm:text-sm text-[#332C38] max-w-xl mx-auto leading-relaxed">
            Fill out the 3-step admission intake form below. Proprietor <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong> and our Shamshabad hostel desk will review vacancy and contact you directly.
          </p>
        </div>

        {/* Reassurance Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] text-center space-y-1">
            <ShieldCheck className="w-4 h-4 text-[#79618E] mx-auto" />
            <p className="font-serif text-xs font-bold text-[#302343]">High-Security Residence</p>
            <p className="text-[10px] text-[#766D7C]">24/7 CCTV &amp; Resident Warden</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] text-center space-y-1">
            <CheckCircle2 className="w-4 h-4 text-[#C6A46A] mx-auto" />
            <p className="font-serif text-xs font-bold text-[#302343]">3 Fresh Meals Included</p>
            <p className="text-[10px] text-[#766D7C]">South &amp; North Indian Buffet</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] text-center space-y-1">
            <Phone className="w-4 h-4 text-[#79618E] mx-auto" />
            <p className="font-serif text-xs font-bold text-[#302343]">Direct Management</p>
            <p className="text-[10px] text-[#766D7C] font-mono">{VERIFIED_CONTACTS.primary_phone}</p>
          </div>
        </div>

        {/* The Form */}
        <EnquiryForm />
      </div>
    </div>
  );
}
