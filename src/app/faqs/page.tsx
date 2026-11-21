import React from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';

export default function FaqsPage() {
  const faqs = [
    {
      q: 'Where is Varahi Girls Hostel located?',
      a: `Varahi Girls Hostel (Branch 1) is located in Shamshabad, Hyderabad, minutes from Rajiv Gandhi International Airport (RGIA) and major educational corridors. Our location provides swift transit for airport staff and college students. You can view our verified listing on Google Maps (${VERIFIED_CONTACTS.google_rating}).`,
    },
    {
      q: 'Who is the owner/proprietor of Varahi Girls Hostel?',
      a: `Varahi Girls Hostel is founded and personally managed by Proprietor E. Bharath Chandra. You can contact management directly at +91 93919 44082 for admission enquiries, room availability, and parent site visits.`,
    },
    {
      q: 'What security measures are implemented for female residents?',
      a: `Safety is our foremost priority. The hostel features round-the-clock CCTV surveillance across all entry points, corridors, and common zones, a resident lady warden residing permanently onsite, biometric/secured gating, and strict visitor verification registers.`,
    },
    {
      q: 'Is Varahi Girls Hostel suitable for RGIA airport professionals on rotating shifts?',
      a: `Yes, absolutely. A significant portion of our residents are aviation crew, ground staff, and healthcare professionals. We provide 24/7 safe entry assistance, quiet-hour enforcement for daytime sleeping, and flexible early morning/late night meal packaging.`,
    },
    {
      q: 'What is the food and dining arrangement?',
      a: `All-inclusive fresh dining is cooked onsite 3 times daily (breakfast, lunch, and dinner) offering authentic South and North Indian home-style recipes. Pure multi-stage RO drinking water is provided on every floor.`,
    },
    {
      q: 'What is the Varahi Resident ID format?',
      a: `Every resident receives a permanent digital ID in the format VG1-{Floor}-{Sequence} (e.g. VG1-1-00001). This ID tracks your room allotment, joining date, monthly invoices, receipts, and maintenance requests in the Resident Portal.`,
    },
    {
      q: 'How does the monthly billing cycle work?',
      a: `Varahi Girls Hostel follows an individual joining-date billing cycle. If your confirmed admission begins on the 12th of a month, your billing cycle runs from the 12th to the 11th of each subsequent month, ensuring you never pay for unstayed days.`,
    },
    {
      q: 'How can rent and deposits be paid?',
      a: `Residents and parents can pay securely online through our integrated payment portal using any UPI app (Google Pay, PhonePe, Paytm), debit/credit cards, or net banking with instant digital receipt generation. Cash payments can also be acknowledged directly by management.`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-[#F5F1E9]">
      <div className="text-center space-y-3">
        <span className="badge-mono border-[#D6A85F] text-[#142B45]">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#142B45]">
          Common Queries &amp; Resident Policies
        </h1>
        <p className="text-[#263447] text-sm sm:text-base leading-relaxed">
          Everything you need to know about admissions, security, dining, room options, and billing at VARAHI GIRLS HOSTEL.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="card-editorial p-6 rounded-xl bg-[#FFFFFF] border border-[#E5E0D7] space-y-2 shadow-xs"
          >
            <h3 className="font-serif text-lg font-bold text-[#142B45] flex items-start gap-2.5">
              <span className="text-[#D6A85F] font-mono text-sm shrink-0">Q{idx + 1}.</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#263447] pl-6 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Still Have Questions Card */}
      <div className="card-editorial p-8 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D7] text-center space-y-4 shadow-sm">
        <h3 className="font-serif text-2xl font-bold text-[#142B45]">
          Still have a question or need to inspect rooms?
        </h3>
        <p className="text-xs sm:text-sm text-[#718096] max-w-md mx-auto">
          Proprietor E. Bharath Chandra is available directly on call and WhatsApp to assist you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={`tel:${VERIFIED_CONTACTS.primary_phone}`}
            className="btn-ghost-luxury py-2.5 px-5 text-xs flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#477B70]" />
            <span>Call: {VERIFIED_CONTACTS.primary_phone}</span>
          </a>
          <a
            href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
              'Hello Varahi Girls Hostel Management (E. Bharath Chandra), I have a question regarding admissions.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-emerald-cta py-2.5 px-5 text-xs flex items-center gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Chat</span>
          </a>
          <Link href="/enquiry" className="btn-primary-navy py-2.5 px-5 text-xs">
            Submit Online Enquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
