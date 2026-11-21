import { Enquiry } from '@/types/database';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

// Initial pre-seeded enquiries for demonstration & verification
let inMemoryEnquiries: Enquiry[] = [
  {
    id: 'enq-001-student',
    category: 'student',
    full_name: 'Sneha Reddy',
    phone: '9849123456',
    email: 'sneha.reddy@gmail.com',
    gender: 'female',
    emergency_contact_name: 'Suresh Reddy',
    emergency_contact_phone: '9849123450',
    emergency_contact_relation: 'Father',
    preferred_branch_id: 'b1-girls-branch-1',
    room_sharing_preference: '2_sharing',
    expected_joining_date: '2026-12-01',
    student_college_name: 'Vardhaman College of Engineering',
    student_course: 'B.Tech Computer Science',
    student_year: '2nd Year',
    student_parent_phone: '9849123450',
    status: 'new',
    internal_remarks: 'Enquired about 2-sharing room with AC. Visiting this weekend.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'enq-002-airport',
    category: 'airport_employee',
    full_name: 'Ananya Deshmukh',
    phone: '9876543210',
    email: 'ananya.d@indigo.in',
    gender: 'female',
    emergency_contact_name: 'Sunita Deshmukh',
    emergency_contact_phone: '9876543219',
    emergency_contact_relation: 'Mother',
    preferred_branch_id: 'b1-girls-branch-1',
    room_sharing_preference: '2_sharing',
    expected_joining_date: '2026-11-28',
    employee_company: 'IndiGo Airlines (InterGlobe Aviation)',
    employee_designation: 'Cabin Crew / Flight Attendant',
    employee_shift_timing: 'Rotational Day & Night Shifts',
    employee_id_number: '6E-45892',
    status: 'contacted',
    internal_remarks: 'Spoke with applicant. Requested high security enclave with quiet room for day sleep.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'enq-003-airport',
    category: 'airport_employee',
    full_name: 'K. Sravani',
    phone: '9988776655',
    email: 'sravani.k@aisats.in',
    gender: 'female',
    emergency_contact_name: 'K. Venkat Rao',
    emergency_contact_phone: '9988776600',
    emergency_contact_relation: 'Father',
    preferred_branch_id: 'b1-girls-branch-1',
    room_sharing_preference: '3_sharing',
    expected_joining_date: '2026-12-05',
    employee_company: 'AISATS Ground Handling RGIA',
    employee_designation: 'Customer Service Lead',
    employee_shift_timing: 'Flight Rotational Shift',
    employee_id_number: 'AISATS-HYD-992',
    status: 'visited',
    internal_remarks: 'Visited Varahi Girls Hostel room 204. Confirmed room preference.',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

export async function getEnquiries(): Promise<Enquiry[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Enquiry[];
      }
    } catch {
      // fallback to memory
    }
  }
  return inMemoryEnquiries;
}

export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>): Promise<Enquiry> {
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: enquiry.status || 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('enquiries')
        .insert([newEnquiry])
        .select()
        .single();
      if (!error && data) {
        return data as Enquiry;
      }
    } catch {
      // continue to memory fallback
    }
  }

  inMemoryEnquiries.unshift(newEnquiry);
  return newEnquiry;
}

export async function updateEnquiryStatus(
  id: string,
  status: Enquiry['status'],
  internal_remarks?: string
): Promise<Enquiry | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const updateData: Partial<Enquiry> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (internal_remarks !== undefined) {
        updateData.internal_remarks = internal_remarks;
      }

      const { data, error } = await supabase
        .from('enquiries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Enquiry;
      }
    } catch {
      // continue to memory update
    }
  }

  const index = inMemoryEnquiries.findIndex((e) => e.id === id);
  if (index !== -1) {
    inMemoryEnquiries[index] = {
      ...inMemoryEnquiries[index],
      status,
      internal_remarks: internal_remarks !== undefined ? internal_remarks : inMemoryEnquiries[index].internal_remarks,
      updated_at: new Date().toISOString(),
    };
    return inMemoryEnquiries[index];
  }
  return null;
}
