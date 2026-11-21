'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DEVI_BRANCHES } from '@/lib/data/branches';
import { Floor, Room, Bed, CustomerCategory, Gender } from '@/types/database';
import { UserCheck, ShieldCheck, CheckCircle2, Building, Bed as BedIcon, AlertCircle, ArrowRight } from 'lucide-react';

function AdmissionsForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prefillBranch = searchParams.get('branch');
  const prefillEnquiry = searchParams.get('enquiry_id');

  const [branchCode, setBranchCode] = useState<number>(prefillBranch ? parseInt(prefillBranch, 10) : 1);
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [bedId, setBedId] = useState<string>('');

  // Dropdown lists
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);

  // Resident details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [category, setCategory] = useState<CustomerCategory>('student');
  const [admissionDate, setAdmissionDate] = useState('');
  const [agreedRent, setAgreedRent] = useState<number>(7000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(10000);

  useEffect(() => {
    setAdmissionDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Emergency contact
  const [emergName, setEmergName] = useState('');
  const [emergPhone, setEmergPhone] = useState('');
  const [emergRelation, setEmergRelation] = useState('Parent');

  // Category specifics
  const [collegeName, setCollegeName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('1st Year');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string; residentId?: string } | null>(null);

  // Load floors when branch changes
  useEffect(() => {
    const fetchFloors = async () => {
      const res = await fetch(`/api/inventory/floors?branch_code=${branchCode}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setFloors(json.data);
        setFloorNumber(json.data[0].floor_number);
      }
    };
    fetchFloors();
  }, [branchCode]);

  // Load rooms when floor changes
  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch(`/api/inventory/rooms?branch_code=${branchCode}&floor_number=${floorNumber}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setRooms(json.data);
        setRoomNumber(json.data[0].room_number);
        setAgreedRent(json.data[0].monthly_rate_per_bed);
      }
    };
    fetchRooms();
  }, [branchCode, floorNumber]);

  // Load beds when room changes
  useEffect(() => {
    if (!roomNumber) return;
    const fetchBeds = async () => {
      const res = await fetch(`/api/inventory/beds?branch_code=${branchCode}&room_number=${roomNumber}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setBeds(json.data);
        // Find first vacant bed
        const vacant = json.data.find((b: Bed) => b.status === 'vacant');
        if (vacant) {
          setBedId(vacant.id);
        } else {
          setBedId(json.data[0].id);
        }
      }
    };
    fetchBeds();
  }, [branchCode, roomNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    const payload = {
      enquiry_id: prefillEnquiry || undefined,
      full_name: fullName,
      phone,
      email,
      gender,
      category,
      branch_code: branchCode,
      floor_number: floorNumber,
      room_number: roomNumber,
      bed_id: bedId,
      admission_date: admissionDate,
      agreed_monthly_rent: agreedRent,
      security_deposit: securityDeposit,
      emergency_contact_name: emergName,
      emergency_contact_phone: emergPhone,
      emergency_contact_relation: emergRelation,
      student_college_name: category === 'student' ? collegeName : undefined,
      student_course: category === 'student' ? course : undefined,
      student_year: category === 'student' ? year : undefined,
      employee_company: category === 'airport_employee' ? company : undefined,
      employee_designation: category === 'airport_employee' ? designation : undefined,
    };

    try {
      const res = await fetch('/api/admissions/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to confirm admission.');
      }

      setFeedback({
        type: 'success',
        text: data.message,
        residentId: data.data.resident_id,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: (err as Error).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
          Admissions Desk
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Resident Admission & Bed Allocation
        </h1>
        <p className="text-xs text-slate-400">
          Assigns physical room/bed, checks vacancy, and generates permanent collision-safe DEVI Resident ID.
        </p>
      </div>

      {feedback && (
        <div className={`p-5 rounded-2xl text-xs font-semibold ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
        }`}>
          <p className="text-sm font-bold mb-1">{feedback.text}</p>
          {feedback.residentId && (
            <p className="mt-2 text-white">
              Permanent Resident ID: <span className="font-mono text-amber-400 font-extrabold text-base">{feedback.residentId}</span>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* Section 1: Room & Bed Allocation */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-500" />
            1. Select Physical Location (Branch ➔ Floor ➔ Room ➔ Bed)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Branch *</label>
              <select
                value={branchCode}
                onChange={(e) => setBranchCode(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {DEVI_BRANCHES.map((b) => (
                  <option key={b.branch_code} value={b.branch_code}>
                    Branch {b.branch_code} ({b.gender_category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Floor *</label>
              <select
                value={floorNumber}
                onChange={(e) => setFloorNumber(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {floors.map((f) => (
                  <option key={f.id} value={f.floor_number}>
                    Floor {f.floor_number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Room *</label>
              <select
                value={roomNumber}
                onChange={(e) => {
                  setRoomNumber(e.target.value);
                  const selectedRoom = rooms.find((r) => r.room_number === e.target.value);
                  if (selectedRoom) setAgreedRent(selectedRoom.monthly_rate_per_bed);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.room_number}>
                    Room {r.room_number} ({r.room_type.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Bed Allotment *</label>
              <select
                value={bedId}
                onChange={(e) => setBedId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {beds.map((b) => (
                  <option key={b.id} value={b.id} disabled={b.status === 'occupied' || b.status === 'maintenance'}>
                    Bed {b.bed_number} ({b.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Details */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-500" />
            2. Resident Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile (10 Digits) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9848011223"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ramesh@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="male">Male (Boys Hostels 1-4)</option>
                <option value="female">Female (Girls Branch 1)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CustomerCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="student">🎓 College Student</option>
                <option value="airport_employee">✈️ RGIA Airport Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admission Date *</label>
              <input
                type="date"
                required
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial Terms & Anchor */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            3. Financial Agreement & Security Deposit
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Agreed Monthly Rent (INR) *
              </label>
              <input
                type="number"
                required
                value={agreedRent}
                onChange={(e) => setAgreedRent(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Billing anchor will be automatically set to the <strong>{new Date(admissionDate).getDate()}th</strong> of each month.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Refundable Security Deposit (INR) *
              </label>
              <input
                type="number"
                required
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
              <p className="text-[11px] text-emerald-400 mt-1">
                Managed in dedicated refundable deposit liability ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Emergency Contacts */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            4. Emergency Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Name *</label>
              <input
                type="text"
                required
                value={emergName}
                onChange={(e) => setEmergName(e.target.value)}
                placeholder="Parent / Guardian Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone *</label>
              <input
                type="tel"
                required
                value={emergPhone}
                onChange={(e) => setEmergPhone(e.target.value)}
                placeholder="Parent Mobile Number"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship *</label>
              <select
                value={emergRelation}
                onChange={(e) => setEmergRelation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? 'Confirming Admission...' : 'Confirm Admission & Generate Resident ID'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminAdmissionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading admissions desk...</div>}>
        <AdmissionsForm />
      </Suspense>
    </div>
  );
}
