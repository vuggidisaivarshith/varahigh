import {
  Resident,
  StayRecord,
  ResidentInvoice,
  ResidentPayment,
  Complaint,
  CustomerCategory,
  Gender
} from '@/types/database';
import { allocateBed, releaseBed, getBedById } from './inventory-repo';
import { hashPassword } from '@/lib/auth/password';

// Central sequence counter
let currentResidentSequence = 100;

// Central stores
let residentsStore: Resident[] = [];
let staysStore: StayRecord[] = [];
let invoicesStore: ResidentInvoice[] = [];
let paymentsStore: ResidentPayment[] = [];
let complaintsStore: Complaint[] = [];

// Helper to generate atomic VARAHI Resident ID
export function generateVarahiResidentId(branchCode: number = 1, floorNumber: number = 1): {
  residentId: string;
  sequenceNumber: number;
} {
  currentResidentSequence += 1;
  const seqStr = String(currentResidentSequence).padStart(5, '0');
  const residentId = `VG1-${floorNumber}-${seqStr}`;
  return { residentId, sequenceNumber: currentResidentSequence };
}

export const generateDeviResidentId = generateVarahiResidentId;

// Seed initial realistic residents
function seedInitialResidents() {
  if (residentsStore.length > 0) return;

  // Resident 1: Student in Branch 1 Floor 1 Room 102 Bed A
  const r1BedId = 'bed-1-102-A';
  const r1Id = 'res-001';
  const r1VarahiId = 'VG1-1-00001';
  allocateBed(r1BedId, r1Id, 'K. Ananya Reddy');

  residentsStore.push({
    id: r1Id,
    resident_id: r1VarahiId,
    initial_branch_code: 1,
    initial_floor_number: 1,
    sequence_number: 1,
    category: 'student',
    full_name: 'K. Ananya Reddy',
    phone: '9849111222',
    email: 'ananya.reddy@gmail.com',
    gender: 'female',
    password_hash: hashPassword('VarahiResident@2026!'),
    aadhaar_last_four: '4589',
    emergency_contact_name: 'Satyanarayana Reddy',
    emergency_contact_phone: '9849111220',
    emergency_contact_relation: 'Father',
    admission_date: '2026-11-01',
    billing_anchor_day: 1,
    agreed_monthly_rent: 7500,
    status: 'active',
    current_branch_code: 1,
    current_floor_number: 1,
    current_room_number: '102',
    current_bed_id: r1BedId,
    current_bed_number: '102-A',
    student_college_name: 'Vardhaman College of Engineering',
    student_course: 'B.Tech Computer Science & AI',
    student_year: '2nd Year',
    outstanding_balance: 0,
    advance_balance: 1500,
    security_deposit: 10000,
    next_payment_due_date: '2026-12-01',
    created_at: '2026-11-01T10:00:00Z',
    updated_at: '2026-11-01T10:00:00Z',
  });

  staysStore.push({
    id: 'stay-001',
    resident_id: r1Id,
    devi_resident_id: r1VarahiId,
    resident_name: 'K. Ananya Reddy',
    branch_code: 1,
    floor_number: 1,
    room_number: '102',
    bed_number: '102-A',
    check_in_date: '2026-11-01',
    is_current: true,
    remarks: 'Initial admission check-in',
  });

  invoicesStore.push({
    id: 'inv-101',
    invoice_number: 'INV-2026-001',
    resident_id: r1Id,
    devi_resident_id: r1VarahiId,
    branch_code: 1,
    billing_period_start: '2026-11-01',
    billing_period_end: '2026-11-30',
    rent_amount: 7500,
    advance_adjusted: 0,
    total_payable: 7500,
    amount_paid: 7500,
    balance_due: 0,
    due_date: '2026-11-01',
    status: 'paid',
  });

  paymentsStore.push({
    id: 'pay-101',
    receipt_number: 'RCPT-2026-001',
    resident_id: r1Id,
    devi_resident_id: r1VarahiId,
    amount: 7500,
    payment_method: 'online_upi',
    payment_date: '2026-11-01',
    transaction_reference: 'UPI/632145698741/HDFC',
    status: 'verified',
    invoice_number: 'INV-2026-001',
  });

  complaintsStore.push({
    id: 'comp-101',
    resident_id: r1Id,
    devi_resident_id: r1VarahiId,
    resident_name: 'K. Ananya Reddy',
    branch_code: 1,
    room_number: '102',
    category: 'wifi',
    title: 'Study room mesh Wi-Fi signal drop on 1st floor',
    description: 'During online lab submissions in the evening, speed dropped to 5 Mbps.',
    status: 'resolved',
    resolution_notes: 'Replaced secondary mesh extender on Floor 1 corridor. Speed verified at 95 Mbps.',
    created_at: '2026-11-05T14:30:00Z',
    updated_at: '2026-11-06T10:00:00Z',
  });

  // Resident 2: Aviation Staff in Branch 1 Floor 2 Room 201 Bed A
  const r2BedId = 'bed-1-201-A';
  const r2Id = 'res-002';
  const r2VarahiId = 'VG1-2-00002';
  allocateBed(r2BedId, r2Id, 'Pooja Hegde');

  residentsStore.push({
    id: r2Id,
    resident_id: r2VarahiId,
    initial_branch_code: 1,
    initial_floor_number: 2,
    sequence_number: 2,
    category: 'airport_employee',
    full_name: 'Pooja Hegde',
    phone: '9701234567',
    email: 'pooja.h@airindia.in',
    gender: 'female',
    password_hash: hashPassword('VarahiResident@2026!'),
    aadhaar_last_four: '6621',
    emergency_contact_name: 'Vinod Hegde',
    emergency_contact_phone: '9701234560',
    emergency_contact_relation: 'Brother',
    admission_date: '2026-11-10',
    billing_anchor_day: 10,
    agreed_monthly_rent: 9000,
    status: 'active',
    current_branch_code: 1,
    current_floor_number: 2,
    current_room_number: '201',
    current_bed_id: r2BedId,
    current_bed_number: '201-A',
    employee_company: 'Air India',
    employee_designation: 'Senior Cabin Attendant',
    employee_shift_timing: 'Rotational Flight Shifts',
    employee_id_number: 'AI-RGIA-9921',
    outstanding_balance: 0,
    advance_balance: 0,
    security_deposit: 15000,
    next_payment_due_date: '2026-12-10',
    created_at: '2026-11-10T12:00:00Z',
    updated_at: '2026-11-10T12:00:00Z',
  });

  staysStore.push({
    id: 'stay-002',
    resident_id: r2Id,
    devi_resident_id: r2VarahiId,
    resident_name: 'Pooja Hegde',
    branch_code: 1,
    floor_number: 2,
    room_number: '201',
    bed_number: '201-A',
    check_in_date: '2026-11-10',
    is_current: true,
  });

  invoicesStore.push({
    id: 'inv-102',
    invoice_number: 'INV-2026-002',
    resident_id: r2Id,
    devi_resident_id: r2VarahiId,
    branch_code: 1,
    billing_period_start: '2026-11-10',
    billing_period_end: '2026-12-09',
    rent_amount: 9000,
    advance_adjusted: 0,
    total_payable: 9000,
    amount_paid: 9000,
    balance_due: 0,
    due_date: '2026-11-10',
    status: 'paid',
  });

  paymentsStore.push({
    id: 'pay-102',
    receipt_number: 'RCPT-2026-002',
    resident_id: r2Id,
    devi_resident_id: r2VarahiId,
    amount: 9000,
    payment_method: 'online_upi',
    payment_date: '2026-11-10',
    transaction_reference: 'UPI/120934875612/ICICI',
    status: 'verified',
    invoice_number: 'INV-2026-002',
  });

  // Resident 3: Airport Ground Operations in Branch 1 Floor 1
  const r3BedId = 'bed-1-101-A';
  const r3Id = 'res-003';
  const r3VarahiId = 'VG1-1-00003';
  allocateBed(r3BedId, r3Id, 'S. Priyanka');

  residentsStore.push({
    id: r3Id,
    resident_id: r3VarahiId,
    initial_branch_code: 1,
    initial_floor_number: 1,
    sequence_number: 3,
    category: 'airport_employee',
    full_name: 'S. Priyanka',
    phone: '9876500111',
    email: 'priyanka.s@indigo.in',
    gender: 'female',
    password_hash: hashPassword('VarahiResident@2026!'),
    aadhaar_last_four: '8912',
    emergency_contact_name: 'S. Rajeswari',
    emergency_contact_phone: '9876500119',
    emergency_contact_relation: 'Mother',
    admission_date: '2026-11-15',
    billing_anchor_day: 15,
    agreed_monthly_rent: 8500,
    status: 'active',
    current_branch_code: 1,
    current_floor_number: 1,
    current_room_number: '101',
    current_bed_id: r3BedId,
    current_bed_number: '101-A',
    employee_company: 'IndiGo Airlines (InterGlobe)',
    employee_designation: 'Ground Operations Lead',
    employee_shift_timing: 'Rotational Day & Night Shifts',
    employee_id_number: '6E-HYD-5541',
    outstanding_balance: 0,
    advance_balance: 0,
    security_deposit: 12000,
    next_payment_due_date: '2026-12-15',
    created_at: '2026-11-15T09:00:00Z',
    updated_at: '2026-11-15T09:00:00Z',
  });

  staysStore.push({
    id: 'stay-003',
    resident_id: r3Id,
    devi_resident_id: r3VarahiId,
    resident_name: 'S. Priyanka',
    branch_code: 1,
    floor_number: 1,
    room_number: '101',
    bed_number: '101-A',
    check_in_date: '2026-11-15',
    is_current: true,
  });

  invoicesStore.push({
    id: 'inv-103',
    invoice_number: 'INV-2026-003',
    resident_id: r3Id,
    devi_resident_id: r3VarahiId,
    branch_code: 1,
    billing_period_start: '2026-11-15',
    billing_period_end: '2026-12-14',
    rent_amount: 8500,
    advance_adjusted: 0,
    total_payable: 8500,
    amount_paid: 8500,
    balance_due: 0,
    due_date: '2026-11-15',
    status: 'paid',
  });

  paymentsStore.push({
    id: 'pay-103',
    receipt_number: 'RCPT-2026-003',
    resident_id: r3Id,
    devi_resident_id: r3VarahiId,
    amount: 8500,
    payment_method: 'direct_upi',
    payment_date: '2026-11-15',
    transaction_reference: 'UPI/998844332211/SBI',
    status: 'verified',
    invoice_number: 'INV-2026-003',
  });
}

// Initialize seed
seedInitialResidents();

// ----------------- Queries -----------------

export function getResidents(filters?: {
  branchCode?: number;
  category?: CustomerCategory;
  status?: string;
  search?: string;
}): Resident[] {
  seedInitialResidents();
  let result = residentsStore;

  if (filters?.branchCode) {
    result = result.filter((r) => r.current_branch_code === filters.branchCode);
  }
  if (filters?.category) {
    result = result.filter((r) => r.category === filters.category);
  }
  if (filters?.status && filters.status !== 'all') {
    result = result.filter((r) => r.status === filters.status);
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.full_name.toLowerCase().includes(s) ||
        r.resident_id.toLowerCase().includes(s) ||
        r.phone.includes(s) ||
        (r.student_college_name && r.student_college_name.toLowerCase().includes(s)) ||
        (r.employee_company && r.employee_company.toLowerCase().includes(s))
    );
  }

  return result;
}

export function getResidentById(idOrResidentId: string): Resident | undefined {
  seedInitialResidents();
  const searchKey = idOrResidentId.trim().toUpperCase();
  return residentsStore.find(
    (r) =>
      r.id === idOrResidentId ||
      r.resident_id.toUpperCase() === searchKey ||
      (searchKey === 'DV1-1-00001' && r.id === 'res-001') ||
      (searchKey === 'DV2-2-00002' && r.id === 'res-002') ||
      (searchKey === 'DV5-1-00003' && r.id === 'res-003')
  );
}

export function getResidentByPhone(phone: string): Resident | undefined {
  seedInitialResidents();
  const clean = phone.replace(/\D/g, '');
  return residentsStore.find((r) => r.phone.replace(/\D/g, '') === clean);
}

export function getResidentStays(residentId: string): StayRecord[] {
  seedInitialResidents();
  return staysStore.filter((s) => s.resident_id === residentId || s.devi_resident_id === residentId);
}

export function getResidentInvoices(residentId: string): ResidentInvoice[] {
  seedInitialResidents();
  return invoicesStore.filter((i) => i.resident_id === residentId || i.devi_resident_id === residentId);
}

export function getResidentPayments(residentId: string): ResidentPayment[] {
  seedInitialResidents();
  return paymentsStore.filter((p) => p.resident_id === residentId || p.devi_resident_id === residentId);
}

export function getComplaints(residentId?: string): Complaint[] {
  seedInitialResidents();
  if (residentId) {
    return complaintsStore.filter((c) => c.resident_id === residentId || c.devi_resident_id === residentId);
  }
  return complaintsStore;
}

export function createComplaint(complaintData: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>): Complaint {
  seedInitialResidents();
  const newComplaint: Complaint = {
    ...complaintData,
    id: `comp-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  complaintsStore.unshift(newComplaint);
  return newComplaint;
}

export function updateComplaintStatus(
  complaintId: string,
  status: Complaint['status'],
  resolutionNotes?: string
): Complaint | null {
  seedInitialResidents();
  const idx = complaintsStore.findIndex((c) => c.id === complaintId);
  if (idx !== -1) {
    complaintsStore[idx] = {
      ...complaintsStore[idx],
      status,
      resolution_notes: resolutionNotes || complaintsStore[idx].resolution_notes,
      updated_at: new Date().toISOString(),
    };
    return complaintsStore[idx];
  }
  return null;
}

// ----------------- Core Operations -----------------

export interface ConfirmAdmissionInput {
  full_name: string;
  phone: string;
  email?: string;
  gender: Gender;
  category: CustomerCategory;
  branch_code: 1 | 2 | 3 | 4 | 5;
  floor_number: number;
  room_number: string;
  bed_id: string;
  admission_date: string;
  agreed_monthly_rent: number;
  security_deposit: number;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  student_college_name?: string;
  student_course?: string;
  student_year?: string;
  employee_company?: string;
  employee_designation?: string;
  employee_shift_timing?: string;
  employee_id_number?: string;
}

// Confirms admission: generates atomic ID, marks bed occupied, creates stay & initial invoice
export function confirmAdmission(input: ConfirmAdmissionInput): {
  success: boolean;
  error?: string;
  resident?: Resident;
} {
  seedInitialResidents();

  // Validate bed
  const bed = getBedById(input.bed_id);
  if (!bed) {
    return { success: false, error: 'Target bed not found in inventory.' };
  }
  if (bed.status === 'occupied') {
    return {
      success: false,
      error: `Bed ${bed.bed_number} is already occupied by another resident. Double allocation prevented.`,
    };
  }

  // Check phone uniqueness
  const cleanPhone = input.phone.replace(/\D/g, '');
  const existingResident = residentsStore.find((r) => r.phone.replace(/\D/g, '') === cleanPhone);
  if (existingResident) {
    return {
      success: false,
      error: `A resident with phone ${input.phone} already exists (Resident ID: ${existingResident.resident_id}).`,
    };
  }

  // Generate permanent DEVI Resident ID
  const { residentId: deviId, sequenceNumber } = generateDeviResidentId(
    input.branch_code,
    input.floor_number
  );

  const internalId = `res-${Date.now()}`;

  // Allocate bed
  const alloc = allocateBed(input.bed_id, internalId, input.full_name);
  if (!alloc.success) {
    return { success: false, error: alloc.error };
  }

  // Determine billing anchor day from admission date
  const admDate = new Date(input.admission_date);
  const billingAnchorDay = admDate.getDate();

  // Calculate next due date (1 month after admission)
  const nextDueDate = new Date(admDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + 1);

  const newResident: Resident = {
    id: internalId,
    resident_id: deviId,
    initial_branch_code: input.branch_code,
    initial_floor_number: input.floor_number,
    sequence_number: sequenceNumber,
    category: input.category,
    full_name: input.full_name,
    phone: cleanPhone,
    email: input.email,
    gender: input.gender,
    password_hash: hashPassword('DeviResident@2026!'), // Default initial password
    emergency_contact_name: input.emergency_contact_name,
    emergency_contact_phone: input.emergency_contact_phone,
    emergency_contact_relation: input.emergency_contact_relation,
    admission_date: input.admission_date,
    billing_anchor_day: billingAnchorDay,
    agreed_monthly_rent: input.agreed_monthly_rent,
    status: 'active',
    current_branch_code: input.branch_code,
    current_floor_number: input.floor_number,
    current_room_number: input.room_number,
    current_bed_id: input.bed_id,
    current_bed_number: bed.bed_number,
    student_college_name: input.student_college_name,
    student_course: input.student_course,
    student_year: input.student_year,
    employee_company: input.employee_company,
    employee_designation: input.employee_designation,
    employee_shift_timing: input.employee_shift_timing,
    employee_id_number: input.employee_id_number,
    outstanding_balance: input.agreed_monthly_rent, // Initial rent due
    advance_balance: 0,
    security_deposit: input.security_deposit || 10000,
    next_payment_due_date: input.admission_date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  residentsStore.unshift(newResident);

  // Record stay
  staysStore.unshift({
    id: `stay-${Date.now()}`,
    resident_id: internalId,
    devi_resident_id: deviId,
    resident_name: input.full_name,
    branch_code: input.branch_code,
    floor_number: input.floor_number,
    room_number: input.room_number,
    bed_number: bed.bed_number,
    check_in_date: input.admission_date,
    is_current: true,
    remarks: 'Admission check-in',
  });

  // Generate initial invoice
  const invNumber = `INV-${new Date().getFullYear()}-${String(invoicesStore.length + 1).padStart(3, '0')}`;
  const periodEnd = new Date(admDate);
  periodEnd.setDate(periodEnd.getDate() + 29);

  invoicesStore.unshift({
    id: `inv-${Date.now()}`,
    invoice_number: invNumber,
    resident_id: internalId,
    devi_resident_id: deviId,
    branch_code: input.branch_code,
    billing_period_start: input.admission_date,
    billing_period_end: periodEnd.toISOString().split('T')[0],
    rent_amount: input.agreed_monthly_rent,
    advance_adjusted: 0,
    total_payable: input.agreed_monthly_rent,
    amount_paid: 0,
    balance_due: input.agreed_monthly_rent,
    due_date: input.admission_date,
    status: 'unpaid',
  });

  return { success: true, resident: newResident };
}

// Executes a room or branch transfer while permanently PRESERVING the original Resident ID
export function transferResident(
  residentId: string,
  newBranchCode: 1 | 2 | 3 | 4 | 5,
  newFloorNumber: number,
  newRoomNumber: string,
  newBedId: string,
  reason?: string
): { success: boolean; error?: string; resident?: Resident } {
  seedInitialResidents();

  const resident = getResidentById(residentId);
  if (!resident) {
    return { success: false, error: 'Resident not found.' };
  }

  const targetBed = getBedById(newBedId);
  if (!targetBed) {
    return { success: false, error: 'Destination bed not found in inventory.' };
  }
  if (targetBed.status === 'occupied') {
    return {
      success: false,
      error: `Destination bed ${targetBed.bed_number} is already occupied. Double allocation prevented.`,
    };
  }

  // 1. Release old bed
  releaseBed(resident.current_bed_id);

  // 2. Allocate new bed
  const alloc = allocateBed(newBedId, resident.id, resident.full_name);
  if (!alloc.success) {
    return { success: false, error: alloc.error };
  }

  // 3. Close current stay record
  const currentStay = staysStore.find(
    (s) => s.resident_id === resident.id && s.is_current
  );
  if (currentStay) {
    currentStay.is_current = false;
    currentStay.check_out_date = new Date().toISOString().split('T')[0];
  }

  // 4. Create new stay record
  staysStore.unshift({
    id: `stay-${Date.now()}`,
    resident_id: resident.id,
    devi_resident_id: resident.resident_id, // Preserved!
    resident_name: resident.full_name,
    branch_code: newBranchCode,
    floor_number: newFloorNumber,
    room_number: newRoomNumber,
    bed_number: targetBed.bed_number,
    check_in_date: new Date().toISOString().split('T')[0],
    is_current: true,
    remarks: reason || 'Transfer executed',
  });

  // 5. Update resident active location
  resident.current_branch_code = newBranchCode;
  resident.current_floor_number = newFloorNumber;
  resident.current_room_number = newRoomNumber;
  resident.current_bed_id = newBedId;
  resident.current_bed_number = targetBed.bed_number;
  resident.updated_at = new Date().toISOString();

  return { success: true, resident };
}

// Executes checkout: frees bed, closes stay, updates status to inactive
export function checkoutResident(
  residentId: string,
  settlementNotes?: string
): { success: boolean; error?: string } {
  seedInitialResidents();

  const resident = getResidentById(residentId);
  if (!resident) {
    return { success: false, error: 'Resident not found.' };
  }

  // Free bed
  releaseBed(resident.current_bed_id);

  // Close stay
  const currentStay = staysStore.find(
    (s) => s.resident_id === resident.id && s.is_current
  );
  if (currentStay) {
    currentStay.is_current = false;
    currentStay.check_out_date = new Date().toISOString().split('T')[0];
    currentStay.remarks = settlementNotes || 'Checkout executed';
  }

  // Set status
  resident.status = 'inactive';
  resident.updated_at = new Date().toISOString();

  return { success: true };
}

export interface BulkResidentInput {
  full_name: string;
  phone: string;
  email?: string;
  category?: CustomerCategory;
  gender?: Gender;
  aadhaar_last_four?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  admission_date?: string;
  agreed_monthly_rent?: number;
  current_floor_number?: number;
  current_room_number?: string;
  current_bed_number?: string;
  student_college_name?: string;
  student_course?: string;
  student_year?: string;
  employee_company?: string;
  employee_designation?: string;
  security_deposit?: number;
  advance_balance?: number;
  outstanding_balance?: number;
}

export function bulkImportResidents(rows: BulkResidentInput[]): {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  residents: Resident[];
} {
  seedInitialResidents();
  const errors: string[] = [];
  const newlyCreated: Resident[] = [];
  let skipped = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowIdx = i + 1;

    if (!row.full_name || !row.full_name.trim()) {
      errors.push(`Row ${rowIdx}: Missing full name.`);
      skipped++;
      continue;
    }

    const cleanPhone = (row.phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.push(`Row ${rowIdx} (${row.full_name}): Invalid phone number "${row.phone}".`);
      skipped++;
      continue;
    }

    // Check existing phone
    const existing = residentsStore.find((r) => r.phone.replace(/\D/g, '') === cleanPhone);
    if (existing) {
      errors.push(`Row ${rowIdx} (${row.full_name}): Resident with phone ${cleanPhone} already exists (${existing.resident_id}).`);
      skipped++;
      continue;
    }

    const floor = Number(row.current_floor_number) || 1;
    const room = String(row.current_room_number || `${floor}01`);
    const bedNo = String(row.current_bed_number || `${room}-A`);
    const bedId = `bed-1-${room}-${bedNo.split('-').pop() || 'A'}`;

    const { residentId, sequenceNumber } = generateVarahiResidentId(1, floor);
    const internalId = `res-${Date.now()}-${i}`;
    const admDate = row.admission_date || new Date().toISOString().split('T')[0];
    const rent = Number(row.agreed_monthly_rent) || 5500;
    const deposit = Number(row.security_deposit) || 3000;
    const advance = Number(row.advance_balance) || 0;
    const outstanding = Number(row.outstanding_balance) || 0;

    const newRes: Resident = {
      id: internalId,
      resident_id: residentId,
      initial_branch_code: 1,
      initial_floor_number: floor,
      sequence_number: sequenceNumber,
      category: row.category === 'airport_employee' ? 'airport_employee' : 'student',
      full_name: row.full_name.trim(),
      phone: cleanPhone,
      email: row.email || `${cleanPhone}@varahigirlshostel.com`,
      gender: 'female',
      password_hash: hashPassword('VarahiResident@2026!'),
      aadhaar_last_four: row.aadhaar_last_four || '0000',
      emergency_contact_name: row.emergency_contact_name || 'Guardian',
      emergency_contact_phone: (row.emergency_contact_phone || cleanPhone).replace(/\D/g, ''),
      emergency_contact_relation: row.emergency_contact_relation || 'Parent',
      admission_date: admDate,
      billing_anchor_day: new Date(admDate).getDate() || 1,
      agreed_monthly_rent: rent,
      status: 'active',
      current_branch_code: 1,
      current_floor_number: floor,
      current_room_number: room,
      current_bed_id: bedId,
      current_bed_number: bedNo,
      student_college_name: row.student_college_name || (row.category !== 'airport_employee' ? 'Shamshabad Degree College' : undefined),
      student_course: row.student_course || (row.category !== 'airport_employee' ? 'Degree' : undefined),
      student_year: row.student_year || '1st Year',
      employee_company: row.employee_company,
      employee_designation: row.employee_designation,
      outstanding_balance: outstanding,
      advance_balance: advance,
      security_deposit: deposit,
      next_payment_due_date: admDate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    residentsStore.unshift(newRes);
    newlyCreated.push(newRes);

    staysStore.unshift({
      id: `stay-${Date.now()}-${i}`,
      resident_id: internalId,
      devi_resident_id: residentId,
      resident_name: newRes.full_name,
      branch_code: 1,
      floor_number: floor,
      room_number: room,
      bed_number: bedNo,
      check_in_date: admDate,
      is_current: true,
      remarks: 'Bulk import from Excel/CSV sheet',
    });
  }

  return {
    success: newlyCreated.length > 0,
    imported: newlyCreated.length,
    skipped,
    errors,
    residents: newlyCreated,
  };
}
