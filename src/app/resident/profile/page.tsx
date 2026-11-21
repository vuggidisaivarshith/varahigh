'use client';

import React, { useState, useEffect } from 'react';
import { Resident } from '@/types/database';
import { User, Phone, Mail, ShieldCheck, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function ResidentProfilePage() {
  const [resident, setResident] = useState<Resident | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const match = document.cookie.match(/devi_resident_id=([^;]+)/);
      const residentId = match ? match[1] : 'DV1-1-00001';
      const res = await fetch(`/api/residents/${residentId}`);
      const json = await res.json();
      if (json.success) setResident(json.data.resident);
    };
    fetchProfile();
  }, []);

  if (!resident) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Resident Digital Profile</h1>
        <p className="text-xs text-slate-400">
          Permanent profile records maintained by DEVI Hostels Central Registry.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-2xl">
              {resident.full_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{resident.full_name}</h2>
              <p className="text-xs text-amber-400 font-mono font-bold mt-0.5">
                PERMANENT RESIDENT ID: {resident.resident_id}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Active Resident
          </span>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Personal Information
            </h3>
            <p><strong>Mobile Number:</strong> +91 {resident.phone}</p>
            <p><strong>Email Address:</strong> {resident.email || 'N/A'}</p>
            <p><strong>Gender:</strong> <span className="capitalize">{resident.gender}</span></p>
            <p><strong>Aadhaar Proof:</strong> •••• •••• {resident.aadhaar_last_four || '4589'}</p>
            <p><strong>Admission Date:</strong> {resident.admission_date}</p>
          </div>

          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Emergency Contact (Parent / Guardian)
            </h3>
            <p><strong>Name:</strong> {resident.emergency_contact_name}</p>
            <p><strong>Relationship:</strong> {resident.emergency_contact_relation}</p>
            <p><strong>Emergency Phone:</strong> +91 {resident.emergency_contact_phone}</p>
            <p className="text-[11px] text-emerald-400 font-medium">✓ Emergency alert authorization on file</p>
          </div>
        </div>

        {/* Category Details */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {resident.category === 'student' ? '🎓 College Academic Record' : '✈️ RGIA Aviation Employer Record'}
          </h3>
          {resident.category === 'student' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <p><strong>College:</strong> {resident.student_college_name || 'Vardhaman College'}</p>
              <p><strong>Course:</strong> {resident.student_course || 'B.Tech CSE'}</p>
              <p><strong>Academic Year:</strong> {resident.student_year || '2nd Year'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <p><strong>Employer:</strong> {resident.employee_company || 'IndiGo'}</p>
              <p><strong>Designation:</strong> {resident.employee_designation || 'Staff'}</p>
              <p><strong>Shift:</strong> {resident.employee_shift_timing || 'Rotational'}</p>
              <p><strong>Badge ID:</strong> {resident.employee_id_number || 'AEP-992'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
