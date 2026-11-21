'use client';

import React from 'react';
import { Bell, Calendar, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ResidentNotificationsPage() {
  const notices = [
    {
      id: '1',
      title: 'Monthly Rent Reminder Schedule Active',
      date: 'Today',
      type: 'billing',
      content: 'Your billing cycle is anchored to your joining date. Automated courtesy alerts are delivered prior to the due date via WhatsApp and SMS.',
    },
    {
      id: '2',
      title: 'Sunday Special Lunch: Chicken Biryani & Paneer Butter Masala',
      date: 'Upcoming Sunday',
      type: 'food',
      content: 'Branch 1 dining hall will serve Sunday Special feast from 12:30 PM to 3:00 PM for all residents.',
    },
    {
      id: '3',
      title: 'Airport Shift Quiet Hours Enforced',
      date: 'Standing Notice',
      type: 'rule',
      content: 'Residents are kindly reminded to observe corridor silence during day rest hours for night-duty cabin crew and healthcare staff.',
    },
    {
      id: '4',
      title: 'Daily Housekeeping & Floor Sanitization Completed',
      date: 'Yesterday',
      type: 'maintenance',
      content: 'Daily deep cleaning and sanitization of attached washrooms, rooms, and corridors completed by the housekeeping team.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-[#F8F4FA]">
      <div className="border-b border-[#E9E1ED] pb-4">
        <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
          HOSTEL ANNOUNCEMENTS
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
          Notifications &amp; Resident Notices
        </h1>
        <p className="text-xs text-[#766D7C]">
          Official communication, billing reminders, and hostel updates for Branch 1 residents.
        </p>
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-5 sm:p-6 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                n.type === 'billing'
                  ? 'bg-[#D9C8E8]/40 text-[#79618E] border border-[#D9C8E8]'
                  : n.type === 'food'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : n.type === 'rule'
                  ? 'bg-[#C6A46A]/20 text-[#302343] border border-[#C6A46A]/30'
                  : 'bg-[#F8F4FA] text-[#302343] border border-[#E9E1ED]'
              }`}>
                {n.type.toUpperCase()}
              </span>
              <span className="text-[11px] font-mono text-[#766D7C]">{n.date}</span>
            </div>
            <h3 className="font-serif text-base font-bold text-[#302343]">{n.title}</h3>
            <p className="text-xs text-[#766D7C] leading-relaxed">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
