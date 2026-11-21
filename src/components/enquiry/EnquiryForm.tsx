'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import { CustomerCategory, Gender, RoomSharing } from '@/types/database';
import {
  CheckCircle2,
  User,
  Phone,
  Mail,
  Building,
  Briefcase,
  Calendar,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Send,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

function EnquiryFormContent() {
  const searchParams = useSearchParams();
  const initialBranch = searchParams.get('branch');

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State — exclusively female for Varahi Girls Hostel
  const [category, setCategory] = useState<CustomerCategory>('student');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender>('female');

  // Emergency / Parent Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Parent');

  // Stay Preferences
  const [preferredBranchId, setPreferredBranchId] = useState(
    initialBranch ? `b${initialBranch}-girls-branch-${initialBranch}` : VARAHI_BRANCHES[0].id
  );
  const [sharingPreference, setSharingPreference] = useState<RoomSharing>('2_sharing');
  const [expectedJoiningDate, setExpectedJoiningDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );

  // Student specific
  const [collegeName, setCollegeName] = useState('');
  const [course, setCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('1st Year');
  const [parentPhone, setParentPhone] = useState('');

  // Airport Employee / Working Professional specific
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [shiftTiming, setShiftTiming] = useState('Rotational Shifts');
  const [employeeId, setEmployeeId] = useState('');

  const availableBranches = VARAHI_BRANCHES;

  const validateStep1 = () => {
    if (!fullName.trim()) return 'Please enter your full name.';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return 'Please enter a valid 10-digit mobile number.';
    if (!emergencyName.trim()) return 'Please enter parent/guardian emergency contact name.';
    const cleanEmergPhone = emergencyPhone.replace(/\D/g, '');
    if (cleanEmergPhone.length < 10) return 'Please enter a valid emergency contact phone number.';
    return null;
  };

  const validateStep2 = () => {
    if (category === 'student') {
      if (!collegeName.trim()) return 'Please enter your college or academy name.';
      if (!course.trim()) return 'Please enter your course or field of study.';
    } else {
      if (!company.trim()) return 'Please enter your employer, airline, or workplace company.';
      if (!designation.trim()) return 'Please enter your job role or designation.';
    }
    return null;
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const payload = {
      category,
      full_name: fullName,
      phone,
      email,
      gender: 'female',
      emergency_contact_name: emergencyName,
      emergency_contact_phone: emergencyPhone,
      emergency_contact_relation: emergencyRelation,
      preferred_branch_id: preferredBranchId,
      room_sharing_preference: sharingPreference,
      expected_joining_date: expectedJoiningDate,
      ...(category === 'student'
        ? {
            student_college_name: collegeName,
            student_course: course,
            student_year: academicYear,
            student_parent_phone: parentPhone || emergencyPhone,
          }
        : {
            employee_company: company,
            employee_designation: designation,
            employee_shift_timing: shiftTiming,
            employee_id_number: employeeId,
          }),
    };

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit admission enquiry.');
      }

      const generatedRef = data.data?.enquiry_reference || `ENQ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setReferenceNumber(generatedRef);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const selectedBranch = VARAHI_BRANCHES.find((b) => b.id === preferredBranchId) || VARAHI_BRANCHES[0];
    return (
      <div className="card-editorial p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 bg-[#FFFFFF] border border-[#E5E0D7]">
        <div className="w-16 h-16 bg-[#F5F1E9] text-[#477B70] rounded-full flex items-center justify-center mx-auto border border-[#E5E0D7]">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="badge-mono border-[#D6A85F] text-[#142B45]">
            REFERENCE: {referenceNumber}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
            Admission Enquiry Received
          </h2>
          <p className="text-xs text-[#718096]">
            Thank you, <strong>{fullName}</strong>. Your enquiry details have been forwarded directly to Proprietor <strong>{VERIFIED_CONTACTS.owner_proprietor}</strong>.
          </p>
        </div>

        {/* Policy Clarification Notice */}
        <div className="p-4 rounded-lg bg-[#F5F1E9] border border-[#E5E0D7] text-left text-xs text-[#263447] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#142B45]">
            <AlertCircle className="w-4 h-4 text-[#D6A85F]" />
            <span>Next Steps for Your Admission:</span>
          </div>
          <p className="leading-relaxed">
            Our team will reach out at <strong>{phone}</strong> to confirm room vacancy, sharing arrangements, and schedule your campus visit. You may also contact management directly on WhatsApp.
          </p>
        </div>

        {/* Summary of Request */}
        <div className="rounded-lg p-4 text-xs text-[#263447] bg-[#FFFFFF] border border-[#E5E0D7] space-y-2 text-left font-mono">
          <p>
            <strong className="text-[#142B45]">Hostel:</strong> {selectedBranch?.name || 'Varahi Girls Hostel — Branch 1'}
          </p>
          <p>
            <strong className="text-[#142B45]">Applicant Category:</strong> {category === 'student' ? 'College Student' : 'Airport / Corporate Professional'}
          </p>
          <p>
            <strong className="text-[#142B45]">Sharing Preference:</strong> {sharingPreference.replace('_', ' ').toUpperCase()}
          </p>
          <p>
            <strong className="text-[#142B45]">Expected Move-In:</strong> {expectedJoiningDate}
          </p>
          <p>
            <strong className="text-[#142B45]">Management Contact:</strong> {VERIFIED_CONTACTS.primary_phone} ({VERIFIED_CONTACTS.owner_proprietor})
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/${VERIFIED_CONTACTS.whatsapp_number}?text=${encodeURIComponent(
              `Hello Varahi Girls Hostel Management (E. Bharath Chandra), I have submitted an admission enquiry with reference ${referenceNumber}. Please let me know room availability.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-emerald-cta w-full sm:w-auto py-3 px-6 text-xs flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Follow Up on WhatsApp</span>
          </a>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
            }}
            className="btn-ghost-luxury w-full sm:w-auto py-3 px-6 text-xs"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-editorial max-w-3xl mx-auto overflow-hidden bg-[#FFFFFF] border border-[#E5E0D7] shadow-sm">
      {/* Step Indicator Header */}
      <div className="bg-[#142B45] text-[#FFFFFF] p-6 sm:p-8 border-b border-[#1F3C5F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D6A85F]">
              STEP {step} OF 3
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FFFFFF] mt-0.5">
              {step === 1 && 'Applicant & Guardian Details'}
              {step === 2 && 'Category & Academic / Workplace Profile'}
              {step === 3 && 'Room Sharing & Move-In Date'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? 'bg-[#D6A85F] text-[#142B45]' : 'bg-[#1F3C5F] text-[#E5E0D7]'
            }`}>
              1
            </span>
            <span className="w-4 h-0.5 bg-[#1F3C5F]" />
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? 'bg-[#D6A85F] text-[#142B45]' : 'bg-[#1F3C5F] text-[#E5E0D7]'
            }`}>
              2
            </span>
            <span className="w-4 h-0.5 bg-[#1F3C5F]" />
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 3 ? 'bg-[#D6A85F] text-[#142B45]' : 'bg-[#1F3C5F] text-[#E5E0D7]'
            }`}>
              3
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-[#FDF2F2] border border-[#F8B4B4] text-xs text-[#9B1C1C] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#9B1C1C]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Personal & Emergency Contact */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-2">
                1. Select Applicant Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCategory('student')}
                  className={`p-3.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2.5 ${
                    category === 'student'
                      ? 'border-[#142B45] bg-[#F5F1E9] text-[#142B45] font-bold'
                      : 'border-[#E5E0D7] bg-[#FFFFFF] text-[#718096] hover:bg-[#F5F1E9]/40'
                  }`}
                >
                  <User className="w-4 h-4 text-[#D6A85F]" />
                  <span>College Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('airport_employee')}
                  className={`p-3.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2.5 ${
                    category === 'airport_employee'
                      ? 'border-[#142B45] bg-[#F5F1E9] text-[#142B45] font-bold'
                      : 'border-[#E5E0D7] bg-[#FFFFFF] text-[#718096] hover:bg-[#F5F1E9]/40'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-[#D6A85F]" />
                  <span>RGIA Staff / Working Professional</span>
                </button>
              </div>
            </div>

            {/* Note on Women's Residence */}
            <div className="p-3.5 rounded-lg bg-rose-50/60 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Varahi Girls Hostel is strictly an exclusive, high-security residence for women.</span>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                  Applicant Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. K. Ananya Reddy"
                  className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                  Applicant Mobile (10 Digits) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9849123456"
                  className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. applicant@gmail.com"
                className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
              />
            </div>

            {/* Parent / Emergency Contact */}
            <div className="p-4 rounded-lg bg-[#F5F1E9] border border-[#E5E0D7] space-y-3">
              <p className="font-mono text-xs font-bold uppercase text-[#142B45]">
                Parent / Guardian / Emergency Contact *
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Contact Name"
                  className="bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                />
                <input
                  type="tel"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="Parent / Guardian Phone"
                  className="bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                />
                <select
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3 py-2 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
                >
                  <option value="Parent">Parent</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Relative">Relative</option>
                  <option value="Employer">Employer</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Category Specifics */}
        {step === 2 && (
          <div className="space-y-4">
            {category === 'student' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                      College / University / Academy Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. Vardhaman College of Engineering"
                      className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                      Degree / Course / Stream *
                    </label>
                    <input
                      type="text"
                      required
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science / Aviation"
                      className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                      Academic Year
                    </label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                      Alternative Parent Phone
                    </label>
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="e.g. 9849012345"
                      className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                      Airline / Workplace / Employer Company *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. IndiGo / Air India / AISATS / Corporate"
                      className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                      Designation / Role *
                    </label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Cabin Crew / Operations Lead / Analyst"
                      className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                      Shift Timing Pattern
                    </label>
                    <select
                      value={shiftTiming}
                      onChange={(e) => setShiftTiming(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
                    >
                      <option value="Rotational Shifts">Rotational Shifts (Day & Night)</option>
                      <option value="Day Shift Only">Regular Day Shift</option>
                      <option value="Night Shift Only">Dedicated Night Shift</option>
                      <option value="Flight Rosters">Flight Timed Rotations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                      Employee ID / Staff Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. 6E-9921"
                      className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] placeholder-[#718096] focus:outline-none focus:border-[#142B45]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Branch & Room Preferences */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Preferred Branch */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                Hostel Location
              </label>
              <div className="p-3.5 rounded-lg bg-[#F5F1E9] border border-[#E5E0D7] text-xs font-bold text-[#142B45]">
                {availableBranches[0].name} (Shamshabad, Near RGIA)
              </div>
            </div>

            {/* Sharing Preference */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-2">
                Room Sharing Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['single', '2_sharing', '3_sharing', '4_sharing'] as RoomSharing[]).map((sh) => (
                  <button
                    key={sh}
                    type="button"
                    onClick={() => setSharingPreference(sh)}
                    className={`p-3 rounded-lg border text-xs font-mono text-center transition-colors ${
                      sharingPreference === sh
                        ? 'border-[#142B45] bg-[#F5F1E9] text-[#142B45] font-bold'
                        : 'border-[#E5E0D7] text-[#718096] hover:bg-[#F5F1E9]/40'
                    }`}
                  >
                    {sh.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Joining Date */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#142B45] mb-1.5">
                Expected Joining Date *
              </label>
              <input
                type="date"
                required
                value={expectedJoiningDate}
                onChange={(e) => setExpectedJoiningDate(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#142B45] focus:outline-none focus:border-[#142B45]"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-[#E5E0D7] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-ghost-luxury py-2.5 px-4 text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary-navy py-2.5 px-6 text-xs flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary-navy py-2.5 px-7 text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting Enquiry...' : 'Submit Admission Enquiry'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function EnquiryForm() {
  return (
    <React.Suspense
      fallback={
        <div className="card-editorial p-10 text-center text-xs text-[#718096]">
          Loading enquiry form...
        </div>
      }
    >
      <EnquiryFormContent />
    </React.Suspense>
  );
}
