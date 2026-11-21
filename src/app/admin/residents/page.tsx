'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Resident, CustomerCategory } from '@/types/database';
import { VARAHI_BRANCHES, VERIFIED_CONTACTS } from '@/lib/data/branches';
import {
  Users,
  Search,
  Filter,
  Phone,
  Building,
  GraduationCap,
  Plane,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  ArrowRight,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  DollarSign,
  User
} from 'lucide-react';

export default function AdminResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  // Excel / CSV Upload & Export States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{
    success: boolean;
    message: string;
    errors?: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/residents?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setResidents(json.data);
        if (json.data.length > 0 && !selectedResident) {
          setSelectedResident(json.data[0]);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResidents();
  };

  // Helper to trigger browser CSV download
  const triggerCsvDownload = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Download Personal Details CSV
  const handleDownloadPersonalDetails = () => {
    const headers = [
      'Resident ID',
      'Full Name',
      'Category',
      'Gender',
      'Phone',
      'Email',
      'Admission Date',
      'Floor',
      'Room Number',
      'Bed Number',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Emergency Relation',
      'College / Company',
      'Course / Designation',
      'Status'
    ];

    const rows = residents.map((r) => [
      `"${r.resident_id}"`,
      `"${r.full_name}"`,
      `"${r.category === 'student' ? 'Student' : 'Airport Staff'}"`,
      `"${r.gender}"`,
      `"${r.phone}"`,
      `"${r.email || ''}"`,
      `"${r.admission_date}"`,
      `"${r.current_floor_number}"`,
      `"${r.current_room_number}"`,
      `"${r.current_bed_number}"`,
      `"${r.emergency_contact_name}"`,
      `"${r.emergency_contact_phone}"`,
      `"${r.emergency_contact_relation}"`,
      `"${r.student_college_name || r.employee_company || ''}"`,
      `"${r.student_course || r.employee_designation || ''}"`,
      `"${r.status}"`
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerCsvDownload(`varahi_residents_personal_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  // 2. Download Financial Details CSV
  const handleDownloadFinancialDetails = () => {
    const headers = [
      'Resident ID',
      'Full Name',
      'Category',
      'Room Number',
      'Bed Number',
      'Agreed Monthly Rent (INR)',
      'Security Deposit (INR)',
      'Advance Balance (INR)',
      'Outstanding Balance (INR)',
      'Billing Anchor Day',
      'Next Payment Due Date',
      'Payment Status'
    ];

    const rows = residents.map((r) => [
      `"${r.resident_id}"`,
      `"${r.full_name}"`,
      `"${r.category}"`,
      `"${r.current_room_number}"`,
      `"${r.current_bed_number}"`,
      r.agreed_monthly_rent,
      r.security_deposit,
      r.advance_balance,
      r.outstanding_balance,
      r.billing_anchor_day,
      `"${r.next_payment_due_date}"`,
      `"${r.outstanding_balance > 0 ? 'Due Pending' : 'Clear / Paid'}"`
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerCsvDownload(`varahi_residents_financials_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  // 3. Download Full Master Sheet CSV
  const handleDownloadMasterSheet = () => {
    const headers = [
      'Resident ID',
      'Full Name',
      'Phone',
      'Email',
      'Category',
      'Floor',
      'Room Number',
      'Bed Number',
      'Monthly Rent',
      'Security Deposit',
      'Advance Balance',
      'Outstanding Balance',
      'Admission Date',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Emergency Relation',
      'College or Company',
      'Course or Designation',
      'Status'
    ];

    const rows = residents.map((r) => [
      `"${r.resident_id}"`,
      `"${r.full_name}"`,
      `"${r.phone}"`,
      `"${r.email || ''}"`,
      `"${r.category}"`,
      r.current_floor_number,
      `"${r.current_room_number}"`,
      `"${r.current_bed_number}"`,
      r.agreed_monthly_rent,
      r.security_deposit,
      r.advance_balance,
      r.outstanding_balance,
      `"${r.admission_date}"`,
      `"${r.emergency_contact_name}"`,
      `"${r.emergency_contact_phone}"`,
      `"${r.emergency_contact_relation}"`,
      `"${r.student_college_name || r.employee_company || ''}"`,
      `"${r.student_course || r.employee_designation || ''}"`,
      `"${r.status}"`
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerCsvDownload(`varahi_residents_master_sheet_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  // 4. Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const sampleCsv = `Full Name,Phone,Email,Category,Floor,Room,Bed,Monthly Rent,Security Deposit,Advance Balance,Emergency Name,Emergency Phone,Emergency Relation,College or Company,Course or Designation,Admission Date
P. Sneha Rao,9849200111,sneha.rao@gmail.com,student,1,101,101-A,6000,3000,0,P. Ramana Rao,9849200110,Father,Vardhaman College,B.Tech ECE,2026-11-20
M. Keerthana,9948300222,keerthana.m@gmail.com,airport_employee,2,201,201-B,5500,3000,0,M. Srinivas,9948300220,Father,IndiGo Airlines,Cabin Crew,2026-11-21`;
    triggerCsvDownload('varahi_resident_upload_template.csv', sampleCsv);
  };

  // Parse CSV text into preview rows
  const parseCsvText = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      setParsedRows([]);
      return;
    }

    const headers = lines[0].split(',').map(h => h.replace(/["\r]/g, '').trim().toLowerCase());

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      // Split by comma ignoring commas inside quotes
      const rowTokens = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const cleanTokens = rowTokens.map(t => t.replace(/^"|"$/g, '').trim());

      const rowObj: any = {
        full_name: cleanTokens[0] || '',
        phone: cleanTokens[1] || '',
        email: cleanTokens[2] || '',
        category: (cleanTokens[3] || 'student').toLowerCase().includes('air') ? 'airport_employee' : 'student',
        current_floor_number: Number(cleanTokens[4]) || 1,
        current_room_number: cleanTokens[5] || '101',
        current_bed_number: cleanTokens[6] || '101-A',
        agreed_monthly_rent: Number(cleanTokens[7]) || 5500,
        security_deposit: Number(cleanTokens[8]) || 3000,
        advance_balance: Number(cleanTokens[9]) || 0,
        emergency_contact_name: cleanTokens[10] || 'Guardian',
        emergency_contact_phone: cleanTokens[11] || cleanTokens[1] || '',
        emergency_contact_relation: cleanTokens[12] || 'Parent',
        student_college_name: cleanTokens[13] || '',
        student_course: cleanTokens[14] || '',
        admission_date: cleanTokens[15] || new Date().toISOString().split('T')[0],
      };

      // Validation check
      const isValid = rowObj.full_name.trim().length > 0 && rowObj.phone.replace(/\D/g, '').length >= 10;
      rowObj._isValid = isValid;
      rowObj._error = !rowObj.full_name.trim() ? 'Missing Name' : rowObj.phone.replace(/\D/g, '').length < 10 ? 'Invalid 10-digit Phone' : null;

      parsed.push(rowObj);
    }

    setParsedRows(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      parseCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setImporting(true);
    setImportFeedback(null);

    try {
      const validRows = parsedRows.filter(r => r._isValid);
      const res = await fetch('/api/residents/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ residents: validRows }),
      });

      const json = await res.json();
      if (json.success) {
        setImportFeedback({
          success: true,
          message: `Successfully imported ${json.imported} residents to directory! ${json.skipped > 0 ? `(${json.skipped} duplicate/invalid rows skipped)` : ''}`,
          errors: json.errors,
        });
        // Refresh directory
        await fetchResidents();
        // Reset upload after 2 seconds
        setTimeout(() => {
          setShowUploadModal(false);
          setCsvRawText('');
          setParsedRows([]);
          setImportFeedback(null);
        }, 2500);
      } else {
        setImportFeedback({
          success: false,
          message: json.error || 'Failed to import resident records.',
          errors: json.errors,
        });
      }
    } catch (err) {
      setImportFeedback({
        success: false,
        message: (err as Error).message,
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F8F4FA]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9E1ED] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-mono border-[#C6A46A] text-[#302343] bg-[#FFFFFF]">
              HOSTEL DIRECTORY (BRANCH 1)
            </span>
            <span className="text-xs font-mono text-[#79618E] font-bold">
              Proprietor: {VERIFIED_CONTACTS.owner_proprietor}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#302343] mt-1">
            Resident Records &amp; Excel Management
          </h1>
          <p className="text-xs text-[#766D7C] max-w-2xl leading-relaxed">
            Manage all enrolled residents, review personal and financial statements, export Excel/CSV reports, and bulk upload resident lists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-4 h-4 text-[#FFFFFF]" />
            <span>Upload Resident Excel/CSV</span>
          </button>

          {/* Export Dropdown / Menu */}
          <div className="relative group">
            <button
              className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#E9E1ED] text-[#302343] hover:border-[#79618E] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-4 h-4 text-[#C6A46A]" />
              <span>Download Excel/CSV</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#FFFFFF] border border-[#E9E1ED] rounded-xl shadow-lg p-2 space-y-1 hidden group-hover:block z-20">
              <button
                onClick={handleDownloadPersonalDetails}
                className="w-full text-left px-3 py-2 text-xs font-medium text-[#302343] hover:bg-[#F8F4FA] rounded-lg flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-[#79618E]" />
                <span>Personal Details (.csv)</span>
              </button>
              <button
                onClick={handleDownloadFinancialDetails}
                className="w-full text-left px-3 py-2 text-xs font-medium text-[#302343] hover:bg-[#F8F4FA] rounded-lg flex items-center gap-2"
              >
                <DollarSign className="w-3.5 h-3.5 text-[#C6A46A]" />
                <span>Financial Ledger (.csv)</span>
              </button>
              <button
                onClick={handleDownloadMasterSheet}
                className="w-full text-left px-3 py-2 text-xs font-medium text-[#302343] hover:bg-[#F8F4FA] rounded-lg flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#79618E]" />
                <span>Complete Master Sheet (.csv)</span>
              </button>
              <div className="border-t border-[#E9E1ED] pt-1">
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full text-left px-3 py-1.5 text-[11px] font-mono text-[#766D7C] hover:text-[#302343] hover:bg-[#F8F4FA] rounded-lg flex items-center gap-2"
                >
                  <Download className="w-3 h-3 text-[#C6A46A]" />
                  <span>Sample Upload Template</span>
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/admin/admissions"
            className="px-3.5 py-2 rounded-xl bg-[#302343] hover:bg-[#45335C] text-[#FFFFFF] font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-[#C6A46A]" /> New Admission
          </Link>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E9E1ED] space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Total Enrolled</p>
          <p className="font-serif text-2xl font-bold text-[#302343]">{residents.length}</p>
          <p className="text-[10px] text-[#79618E] font-mono">Branch 1 Exclusive</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E9E1ED] space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">College Students</p>
          <p className="font-serif text-2xl font-bold text-[#302343]">
            {residents.filter(r => r.category === 'student').length}
          </p>
          <p className="text-[10px] text-[#C6A46A] font-mono">3, 4 &amp; 5 Sharing</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E9E1ED] space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Working Women / RGIA</p>
          <p className="font-serif text-2xl font-bold text-[#302343]">
            {residents.filter(r => r.category === 'airport_employee').length}
          </p>
          <p className="text-[10px] text-[#79618E] font-mono">Airport Shifts</p>
        </div>
        <div className="card-editorial p-4 bg-[#FFFFFF] border border-[#E9E1ED] space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase text-[#766D7C]">Active Occupancy</p>
          <p className="font-serif text-2xl font-bold text-[#302343]">
            {residents.filter(r => r.status === 'active').length}
          </p>
          <p className="text-[10px] text-emerald-600 font-mono">Verified Residents</p>
        </div>
      </div>

      {/* Toolbar & Filters (Royal Lavender & Ivory surface) */}
      <div className="bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#766D7C] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Resident ID (e.g. VG1-1-00001), full name, or phone number..."
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#302343] placeholder-[#766D7C] focus:outline-none focus:border-[#79618E]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-semibold text-xs transition-colors"
          >
            Search Directory
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E9E1ED]">
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#302343] mb-1">
              Filter by Resident Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
            >
              <option value="all">All Categories (Students &amp; Professionals)</option>
              <option value="student">🎓 College Students</option>
              <option value="airport_employee">✈️ RGIA Airport Staff / Working Women</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-[#302343] mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-lg px-3 py-2 text-xs text-[#302343] focus:outline-none focus:border-[#79618E]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Residents</option>
              <option value="inactive">Checked-Out / Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Directory Table & Resident Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table Column */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-[#F8F4FA] border-b border-[#E9E1ED] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#302343]">
              Enrolled Residents ({residents.length})
            </span>
            <span className="text-[11px] font-mono text-[#766D7C]">
              Branch 1 • Non-AC Accommodation
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#766D7C]">
              Loading resident directory...
            </div>
          ) : residents.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#766D7C]">
              No residents found matching your search. Try uploading a CSV or adding a new admission.
            </div>
          ) : (
            <div className="divide-y divide-[#E9E1ED]">
              {residents.map((r) => {
                const isSelected = selectedResident?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedResident(r)}
                    className={`p-4 sm:p-5 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#D9C8E8]/20 border-l-4 border-[#79618E]'
                        : 'hover:bg-[#F8F4FA]/60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#302343]">{r.full_name}</span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F8F4FA] text-[#302343] border border-[#E9E1ED]">
                          {r.resident_id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.category === 'student'
                            ? 'bg-[#D9C8E8]/40 text-[#79618E] border border-[#D9C8E8]'
                            : 'bg-[#C6A46A]/20 text-[#302343] border border-[#C6A46A]/30'
                        }`}>
                          {r.category === 'student' ? '🎓 Student' : '✈️ Airport Staff'}
                        </span>
                      </div>

                      <p className="text-xs text-[#766D7C]">
                        Floor {r.current_floor_number} • Room {r.current_room_number} (Bed {r.current_bed_number}) • Phone: <span className="font-mono text-[#302343] font-medium">+91 {r.phone}</span>
                      </p>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-xs font-mono font-bold text-[#302343]">₹{r.agreed_monthly_rent.toLocaleString('en-IN')}/mo</p>
                        <p className="text-[10px] text-[#766D7C] font-mono">Anchor: {r.billing_anchor_day}th</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#766D7C]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Resident Profile Sidebar */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E9E1ED] rounded-2xl p-6 shadow-xs space-y-6">
          {selectedResident ? (
            <div className="space-y-6">
              <div className="border-b border-[#E9E1ED] pb-4">
                <span className="font-mono text-xs font-bold text-[#79618E] bg-[#D9C8E8]/30 border border-[#D9C8E8] px-2 py-0.5 rounded">
                  {selectedResident.resident_id}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#302343] mt-2">
                  {selectedResident.full_name}
                </h3>
                <p className="text-xs text-[#766D7C] font-mono mt-0.5">
                  Admitted: {selectedResident.admission_date}
                </p>
              </div>

              {/* Physical Location */}
              <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED] text-xs space-y-2 text-[#332C38]">
                <p className="font-mono font-bold text-[#302343] uppercase text-[10px] tracking-wider">
                  Assigned Living Quarters
                </p>
                <p><strong>Hostel:</strong> Varahi Girls Hostel (Branch 1)</p>
                <p><strong>Floor:</strong> Floor {selectedResident.current_floor_number}</p>
                <p><strong>Room &amp; Bed:</strong> Room {selectedResident.current_room_number} (Bed {selectedResident.current_bed_number})</p>
                <p><strong>Sharing Type:</strong> Non-AC Room</p>
              </div>

              {/* Contact Info */}
              <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED] text-xs space-y-2 text-[#332C38]">
                <p className="font-mono font-bold text-[#302343] uppercase text-[10px] tracking-wider">
                  Contact &amp; Guardian Info
                </p>
                <p><strong>Resident Mobile:</strong> +91 {selectedResident.phone}</p>
                <p><strong>Email:</strong> {selectedResident.email || 'N/A'}</p>
                <p><strong>Emergency:</strong> {selectedResident.emergency_contact_name} ({selectedResident.emergency_contact_relation}) - +91 {selectedResident.emergency_contact_phone}</p>
                {selectedResident.student_college_name && (
                  <p><strong>College:</strong> {selectedResident.student_college_name} ({selectedResident.student_course})</p>
                )}
                {selectedResident.employee_company && (
                  <p><strong>Company:</strong> {selectedResident.employee_company} ({selectedResident.employee_designation})</p>
                )}
              </div>

              {/* Financial Snapshot */}
              <div className="bg-[#F8F4FA] p-4 rounded-xl border border-[#E9E1ED] text-xs space-y-2 text-[#332C38]">
                <p className="font-mono font-bold text-[#302343] uppercase text-[10px] tracking-wider">
                  Financial Ledger
                </p>
                <div className="flex justify-between">
                  <span>Monthly Tariff:</span>
                  <strong className="font-mono text-[#302343]">₹{selectedResident.agreed_monthly_rent.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span className="font-mono">₹{selectedResident.security_deposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Advance Credit:</span>
                  <span className="font-mono">₹{selectedResident.advance_balance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-[#E9E1ED] pt-1">
                  <span>Outstanding Balance:</span>
                  <strong className={`font-mono ${selectedResident.outstanding_balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ₹{selectedResident.outstanding_balance.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/admin/operations?resident_id=${selectedResident.id}`}
                  className="w-full py-2.5 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  Transfer / Checkout Actions
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#766D7C]">
              Select a resident from the directory to inspect details.
            </div>
          )}
        </div>
      </div>

      {/* EXCEL / CSV UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-[#302343]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E9E1ED] shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E9E1ED] pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#79618E]" />
                <h3 className="font-serif text-lg font-bold text-[#302343]">
                  Bulk Upload Resident Details (Excel / CSV)
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#766D7C] hover:text-[#302343] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#766D7C] leading-relaxed">
              Upload a comma-separated (`.csv`) or spreadsheet export file containing resident details. You can download the sample template below, fill in your residents, and upload.
            </p>

            {/* Template Download Prompt */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F4FA] border border-[#E9E1ED]">
              <div>
                <p className="text-xs font-bold text-[#302343]">Need the formatted column layout?</p>
                <p className="text-[11px] text-[#766D7C]">Download the verified Excel template with sample rows.</p>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="btn-ghost-luxury py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#C6A46A]" />
                <span>Download Template</span>
              </button>
            </div>

            {/* File Dropzone / Upload button */}
            <div className="border-2 border-dashed border-[#E9E1ED] rounded-xl p-6 text-center space-y-3 bg-[#F8F4FA]/50 hover:bg-[#F8F4FA] transition-colors">
              <Upload className="w-8 h-8 mx-auto text-[#79618E]" />
              <div>
                <p className="text-xs font-bold text-[#302343]">Choose CSV File from Computer</p>
                <p className="text-[11px] text-[#766D7C]">Accepts .csv files exported from Excel, Sheets, or ERP</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, text/csv"
                onChange={handleFileUpload}
                className="hidden"
                id="resident-csv-file"
              />
              <label
                htmlFor="resident-csv-file"
                className="inline-block px-4 py-2 rounded-xl bg-[#79618E] hover:bg-[#302343] text-[#FFFFFF] text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Select File
              </label>
            </div>

            {/* Raw Text Input Alternative */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-[#302343]">
                Or Paste CSV Text Directly:
              </label>
              <textarea
                rows={4}
                value={csvRawText}
                onChange={(e) => {
                  setCsvRawText(e.target.value);
                  parseCsvText(e.target.value);
                }}
                placeholder="Full Name,Phone,Email,Category,Floor,Room,Bed,Monthly Rent..."
                className="w-full bg-[#F8F4FA] border border-[#E9E1ED] rounded-xl p-3 text-xs font-mono text-[#302343] placeholder-[#766D7C] focus:outline-none focus:border-[#79618E]"
              />
            </div>

            {/* Parsed Rows Preview */}
            {parsedRows.length > 0 && (
              <div className="space-y-2 border-t border-[#E9E1ED] pt-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#302343]">
                    Preview Parsed Rows ({parsedRows.length})
                  </span>
                  <span className="text-emerald-700 font-bold">
                    {parsedRows.filter(r => r._isValid).length} Valid • {parsedRows.filter(r => !r._isValid).length} Errors
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-[#E9E1ED] rounded-lg divide-y divide-[#E9E1ED] text-xs">
                  {parsedRows.map((row, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between gap-2 bg-[#FFFFFF]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#302343]">{row.full_name || 'Missing Name'}</span>
                          <span className="font-mono text-[11px] text-[#766D7C]">+91 {row.phone}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F8F4FA] text-[#79618E] font-mono">
                            Room {row.current_room_number} (Bed {row.current_bed_number})
                          </span>
                        </div>
                        <p className="text-[10px] text-[#766D7C] font-mono">
                          Rent: ₹{row.agreed_monthly_rent} • Deposit: ₹{row.security_deposit} • Category: {row.category}
                        </p>
                      </div>

                      <div>
                        {row._isValid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> {row._error}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback message */}
            {importFeedback && (
              <div className={`p-3 rounded-xl border text-xs ${
                importFeedback.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <p className="font-bold">{importFeedback.message}</p>
                {importFeedback.errors && importFeedback.errors.length > 0 && (
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                    {importFeedback.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E1ED]">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="btn-ghost-luxury py-2 px-4 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={parsedRows.length === 0 || importing || parsedRows.filter(r => r._isValid).length === 0}
                onClick={handleConfirmImport}
                className="px-5 py-2 rounded-xl bg-[#79618E] hover:bg-[#302343] disabled:opacity-50 text-[#FFFFFF] text-xs font-bold transition-all shadow-xs flex items-center gap-2"
              >
                {importing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm &amp; Import to Directory</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
