'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import { Floor, Room, Bed, CustomerCategory, Gender } from '@/types/database';
import { UserCheck, ShieldCheck, CheckCircle2, Building, Bed as BedIcon, AlertCircle, ArrowRight } from 'lucide-react';

function AdmissionsForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [branchCode, setBranchCode] = useState<number>(1);
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [bedId, setBedId] = useState<string>('');

  // Dropdown lists
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);

  // Resident details (exclusively female for Varahi Girls Hostel)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [category, setCategory] = useState<CustomerCategory>('student');
  const [admissionDate, setAdmissionDate] = useState('');
  const [agreedRent, setAgreedRent] = useState<number>(6000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(3000);

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
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_code: branchCode,
          floor_number: floorNumber,
          room_number: roomNumber,
          bed_id: bedId,
          full_name: fullName,
          phone,
          email,
          gender: 'female',
          category,
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
        }),
      });

      const json = await res.json();
      if (json.success) {
        setFeedback({
          type: 'success',
          text: `Admission successfully confirmed! Bed allocated to ${fullName}.`,
          residentId: json.data?.resident_id,
        });
      } else {
        setFeedback({
          type: 'error',
          text: json.error || 'Failed to complete admission.',
        });
      }
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
    <div className="max-w-4xl mx-auto space-y-8 bg-[#F8F4FA]">
      <div className="border-b border-[#E9E1ED] pb-4">
        <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
          ADMISSIONS DESK (BRANCH 1)
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
          Resident Admission &amp; Bed Allocation
        </h1>
        <p className="text-xs text-[#766D7C]">
          Assign physical room and bed, verify vacancy, and generate collision-safe VARAHI Resident ID.
        </p>
      </div>

      {feedback && (
        <div className={`p-5 rounded-2xl text-xs font-semibold ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <p className="text-sm font-bold mb-1">{feedback.text}</p>
          {feedback.residentId && (
            <p className="mt-2 text-[#302343]">
              Permanent Resident ID: <span className="font-mono text-[#79618E] font-extrabold text-base">{feedback.residentId}</span>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Section 1: Room & Bed Allocation */}
        <div className="space-y-4 border-b border-[#E9E1ED] pb-6">
          <h3 className="text-base font-serif font-bold text-[#302343] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#79618E]" />
            1. Select Physical Location (Floor ➔ Room ➔ Bed)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#302343] mb-1">Hostel Branch *</label>
              <div className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs font-bold text-[#302343]">
                Branch 1 (Girls Only)
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#302343] mb-1">Floor *</label>
              <select
                value={floorNumber}
                onChange={(e) => setFloorNumber(parseInt(e.target.value, 10))}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              >
                {floors.map((f) => (
                  <option key={f.id} value={f.floor_number}>
                    Floor {f.floor_number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#302343] mb-1">Room *</label>
              <select
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.room_number}>
                    Room {r.room_number} ({r.room_type.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-[#302343] mb-1">Bed Allotment *</label>
              <select
                value={bedId}
                onChange={(e) => setBedId(e.target.value)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] font-mono"
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
        <div className="space-y-4 border-b border-[#E9E1ED] pb-6">
          <h3 className="text-base font-serif font-bold text-[#302343] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#79618E]" />
            2. Resident Information (Female Residence)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. K. Ananya Reddy"
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] placeholder-[#766D7C] focus:outline-none focus:border-[#79618E]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Mobile (10 Digits) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9849111222"
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] placeholder-[#766D7C] focus:outline-none focus:border-[#79618E] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. resident@gmail.com"
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] placeholder-[#766D7C] focus:outline-none focus:border-[#79618E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Customer Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CustomerCategory)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              >
                <option value="student">🎓 College Student</option>
                <option value="airport_employee">✈️ RGIA Airport Staff / Working Woman</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Admission Date *</label>
              <input
                type="date"
                required
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Gender</label>
              <div className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] font-bold">
                Female (Girls Hostel)
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Financial Terms */}
        <div className="space-y-4 border-b border-[#E9E1ED] pb-6">
          <h3 className="text-base font-serif font-bold text-[#302343] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#79618E]" />
            3. Financial Agreement &amp; Security Deposit (Non-AC)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">
                Agreed Monthly Rent (INR) *
              </label>
              <input
                type="number"
                required
                value={agreedRent}
                onChange={(e) => setAgreedRent(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] font-mono font-bold"
              />
              <p className="text-[11px] text-[#766D7C] mt-1 font-mono">
                Standard: ₹6,000 (3-Sharing) • ₹5,500 (4 &amp; 5 Sharing)
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">
                Refundable Security Deposit (INR) *
              </label>
              <input
                type="number"
                required
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E] font-mono font-bold"
              />
              <p className="text-[11px] text-emerald-700 mt-1 font-mono">
                Managed in refundable security deposit ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Emergency Contacts */}
        <div className="space-y-4">
          <h3 className="text-base font-serif font-bold text-[#302343] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#79618E]" />
            4. Emergency Contact (Parent / Guardian)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Contact Name *</label>
              <input
                type="text"
                required
                value={emergName}
                onChange={(e) => setEmergName(e.target.value)}
                placeholder="Parent / Guardian Name"
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] placeholder-[#766D7C] focus:outline-none focus:border-[#79618E]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Contact Phone *</label>
              <input
                type="tel"
                required
                value={emergPhone}
                onChange={(e) => setEmergPhone(e.target.value)}
                placeholder="Parent Mobile Number"
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] placeholder-[#766D7C] focus:outline-none focus:border-[#79618E] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#302343] mb-1">Relationship *</label>
              <select
                value={emergRelation}
                onChange={(e) => setEmergRelation(e.target.value)}
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Sibling">Sibling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-bold text-xs shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#F8F4FA]">
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#766D7C]">Loading admissions desk...</div>}>
        <AdmissionsForm />
      </Suspense>
    </div>
  );
}
