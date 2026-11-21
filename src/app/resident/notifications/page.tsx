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
      content: 'Your billing cycle is anchored to your joining date. Automated courtesy alerts are delivered 5 days and 2 days prior to the due date on WhatsApp and email.',
    },
    {
      id: '2',
      title: 'Sunday Special Lunch: Chicken Biryani & Paneer Butter Masala',
      date: 'Upcoming Sunday',
      type: 'food',
      content: 'All branches mess halls will serve Sunday Special non-veg and veg feast from 12:30 PM to 3:00 PM.',
    },
    {
      id: '3',
      title: 'Airport Night Shift Quiet Hours Enforced',
      date: 'Standing Notice',
      type: 'rule',
      content: 'Residents on Floors 1-3 are reminded to observe silence in corridors between 10:00 AM and 4:00 PM for day-sleeping airline and cargo crew.',
    },
    {
      id: '4',
      title: 'RO Water Plant Filter Maintenance Completed',
      date: 'Yesterday',
      type: 'maintenance',
      content: 'Filter cartridges replaced and TDS tested across all floor dispensers. TDS level certified at 85 PPM.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications & Branch Notices</h1>
        <p className="text-xs text-slate-400">
          Official communication, billing reminders, and hostel updates.
        </p>
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-2 shadow-lg"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                n.type === 'billing'
                  ? 'bg-amber-500/20 text-amber-300'
                  : n.type === 'food'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : n.type === 'rule'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {n.type}
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {n.date}
              </span>
            </div>

            <h3 className="text-base font-bold text-white">{n.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
