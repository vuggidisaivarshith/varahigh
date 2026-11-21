export type Gender = 'male' | 'female';
export type CustomerCategory = 'student' | 'airport_employee';
export type EnquiryStatus = 'new' | 'contacted' | 'visited' | 'approved' | 'rejected';
export type UserRole = 'owner' | 'branch_manager' | 'accountant' | 'warden' | 'resident';
export type RoomSharing = '1_sharing' | '2_sharing' | '3_sharing' | '4_sharing';
export type BedStatus = 'vacant' | 'occupied' | 'reserved' | 'maintenance';
export type ResidentStatus = 'active' | 'inactive' | 'suspended';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ComplaintCategory = 'plumbing' | 'electrical' | 'wifi' | 'food' | 'cleaning' | 'noise' | 'other';
export type BranchCode = 1 | 2 | 3 | 4 | 5;
export type InvoiceStatus = 'draft' | 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'online_upi' | 'online_card' | 'online_razorpay' | 'cash' | 'direct_upi' | 'bank_transfer';

export interface Branch {
  id: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  name: string;
  gender_category: 'boys' | 'girls';
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  contact_phone: string;
  contact_email: string;
  total_floors: number;
  facilities: string[];
  images: string[];
  status: 'active' | 'inactive';
  description: string;
  key_highlights: string[];
  starting_price_per_month: number;
  distance_from_rgia: string;
}

export interface Floor {
  id: string;
  branch_id: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  floor_number: number;
  floor_name: string;
}

export interface Room {
  id: string;
  branch_id: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  floor_id: string;
  floor_number: number;
  room_number: string;
  room_type: RoomSharing;
  bed_capacity: number;
  has_ac: boolean;
  has_attached_bathroom: boolean;
  monthly_rate_per_bed: number;
  sharing_type?: string;
  capacity?: number;
}

export interface Bed {
  id: string;
  room_id: string;
  room_number: string;
  floor_number: number;
  branch_code: 1 | 2 | 3 | 4 | 5;
  bed_number: string;
  status: BedStatus;
  current_resident_id?: string;
  current_resident_name?: string;
}

export interface Enquiry {
  id?: string;
  category: CustomerCategory;
  full_name: string;
  phone: string;
  email?: string;
  gender: Gender;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  preferred_branch_id: string;
  room_sharing_preference: RoomSharing;
  expected_joining_date: string;
  student_college_name?: string;
  student_course?: string;
  student_year?: string;
  student_parent_phone?: string;
  employee_company?: string;
  employee_designation?: string;
  employee_shift_timing?: string;
  employee_id_number?: string;
  status: EnquiryStatus;
  internal_remarks?: string;
  converted_resident_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Resident {
  id: string;
  resident_id: string; // Format: DV[BRANCH]-[FLOOR]-[SERIAL] e.g. DV1-1-00001
  initial_branch_code: 1 | 2 | 3 | 4 | 5;
  initial_floor_number: number;
  sequence_number: number;
  category: CustomerCategory;
  full_name: string;
  phone: string;
  email?: string;
  gender: Gender;
  password_hash?: string;
  aadhaar_last_four?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  admission_date: string;
  billing_anchor_day: number;
  agreed_monthly_rent: number;
  status: ResidentStatus;
  
  // Current active stay information
  current_branch_code: 1 | 2 | 3 | 4 | 5;
  current_floor_number: number;
  current_room_number: string;
  current_bed_id: string;
  current_bed_number: string;

  // Student specific
  student_college_name?: string;
  student_course?: string;
  student_year?: string;

  // Airport Employee specific
  employee_company?: string;
  employee_designation?: string;
  employee_shift_timing?: string;
  employee_id_number?: string;

  // Financial Balances Summary
  outstanding_balance: number;
  advance_balance: number;
  security_deposit: number;
  next_payment_due_date: string;

  created_at: string;
  updated_at: string;
}

export interface StayRecord {
  id: string;
  resident_id: string;
  devi_resident_id: string;
  resident_name: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  floor_number: number;
  room_number: string;
  bed_number: string;
  check_in_date: string;
  check_out_date?: string;
  is_current: boolean;
  remarks?: string;
}

export interface ResidentInvoice {
  id: string;
  invoice_number: string;
  resident_id: string;
  devi_resident_id: string;
  branch_code: BranchCode;
  billing_period_start: string;
  billing_period_end: string;
  rent_amount: number;
  advance_adjusted: number;
  total_payable: number;
  amount_paid: number;
  balance_due: number;
  due_date: string;
  status: InvoiceStatus;
}

export interface ResidentPayment {
  id: string;
  receipt_number: string;
  resident_id: string;
  devi_resident_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  transaction_reference: string;
  status: 'verified' | 'pending';
  invoice_number?: string;
}

export interface Complaint {
  id: string;
  ticket_number?: string;
  resident_id: string;
  devi_resident_id: string;
  resident_name: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  room_number: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  status: ComplaintStatus;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export type NotificationChannel = 'whatsapp' | 'email' | 'sms';

export type NotificationTemplate =
  | 'admission_welcome'
  | 'invoice_generated'
  | 'payment_reminder'
  | 'payment_receipt'
  | 'overdue_escalation'
  | 'transfer_confirmed'
  | 'checkout_settlement'
  | 'complaint_update'
  | 'broadcast_announcement';

export interface NotificationRecord {
  id: string;
  resident_id: string;
  devi_resident_id: string;
  channel: NotificationChannel;
  template: NotificationTemplate;
  title: string;
  body: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_at: string;
  delivered_at?: string;
  recipient_target: string;
}

