-- =====================================================================
-- VARAHI GIRLS HOSTEL — PHASE 1 INITIAL DATABASE MIGRATION
-- Multi-Branch Centralized Hostel Management & Accounting Schema
-- Location: Shamshabad, Hyderabad, Telangana, India
-- Owner: E. BHARATH CHANDRA
-- =====================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (Extends Supabase auth.users or standalone profile)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BRANCHES (5 Centralized Branches)
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_code INT UNIQUE NOT NULL CHECK (branch_code BETWEEN 1 AND 5),
    name TEXT NOT NULL,
    gender_category TEXT NOT NULL CHECK (gender_category IN ('boys', 'girls')),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL DEFAULT 'Shamshabad, Hyderabad',
    state TEXT NOT NULL DEFAULT 'Telangana',
    pincode TEXT NOT NULL DEFAULT '501218',
    contact_phone TEXT NOT NULL DEFAULT '+91 93919 44082',
    contact_email TEXT DEFAULT 'contact@varahigirlshostel.com',
    total_floors INT NOT NULL DEFAULT 4 CHECK (total_floors BETWEEN 1 AND 10),
    facilities TEXT[] DEFAULT ARRAY[
        'High-Speed Wi-Fi',
        '3-Times Homely South & North Indian Food',
        '24/7 CCTV & Security Guard',
        '24/7 Water & Hot Water Geysers',
        'Daily Room Housekeeping',
        'RO Purified Drinking Water',
        'Power Backup / Inverter',
        'Automatic Washing Machines',
        'Study Table & Individual Wardrobe'
    ],
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER ROLES (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'branch_manager', 'accountant', 'warden', 'resident')),
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL, -- NULL indicates global privileges (e.g. Owner/Superadmin)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, role, branch_id)
);

-- 4. FLOORS
CREATE TABLE IF NOT EXISTS public.floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    floor_number INT NOT NULL CHECK (floor_number BETWEEN 0 AND 10),
    floor_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, floor_number)
);

-- 5. ROOMS
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    floor_id UUID NOT NULL REFERENCES public.floors(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    room_type TEXT NOT NULL CHECK (room_type IN ('1_sharing', '2_sharing', '3_sharing', '4_sharing')),
    has_ac BOOLEAN DEFAULT FALSE,
    has_attached_bathroom BOOLEAN DEFAULT TRUE,
    monthly_rate_per_bed NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, room_number)
);

-- 6. BEDS
CREATE TABLE IF NOT EXISTS public.beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    bed_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'reserved', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, bed_number)
);

-- 7. ENQUIRIES (Multi-step admission enquiry)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('student', 'airport_employee')),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    emergency_contact_relation TEXT NOT NULL,
    preferred_branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    room_sharing_preference TEXT NOT NULL,
    expected_joining_date DATE NOT NULL,
    -- Student specific
    student_college_name TEXT,
    student_course TEXT,
    student_year TEXT,
    student_parent_phone TEXT,
    -- Airport employee specific
    employee_company TEXT,
    employee_designation TEXT,
    employee_shift_timing TEXT,
    employee_id_number TEXT,
    -- Management status
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'visited', 'approved', 'rejected')),
    internal_remarks TEXT,
    converted_resident_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RESIDENT ID SEQUENCES (Atomic generation of permanent resident serials)
CREATE TABLE IF NOT EXISTS public.resident_id_sequences (
    id INT PRIMARY KEY DEFAULT 1,
    current_number BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.resident_id_sequences (id, current_number)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- 9. RESIDENTS
CREATE TABLE IF NOT EXISTS public.residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id TEXT UNIQUE NOT NULL, -- DV[BRANCH]-[FLOOR]-[UNIQUE_NUMBER]
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    initial_branch_code INT NOT NULL CHECK (initial_branch_code BETWEEN 1 AND 5),
    initial_floor_number INT NOT NULL CHECK (initial_floor_number BETWEEN 1 AND 6),
    sequence_number BIGINT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('student', 'airport_employee')),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    emergency_contact_relation TEXT NOT NULL,
    admission_date DATE NOT NULL,
    billing_anchor_day INT NOT NULL CHECK (billing_anchor_day BETWEEN 1 AND 31),
    agreed_monthly_rent NUMERIC(10,2) NOT NULL CHECK (agreed_monthly_rent > 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RESIDENT DOCUMENTS
CREATE TABLE IF NOT EXISTS public.resident_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('aadhaar', 'college_id', 'airport_id', 'pan', 'passport', 'other')),
    document_url TEXT NOT NULL,
    document_number TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STAYS (Physical branch/room/bed allocation history)
CREATE TABLE IF NOT EXISTS public.stays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    bed_id UUID NOT NULL REFERENCES public.beds(id) ON DELETE RESTRICT,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. INVOICES (Monthly joining-date based recurring bills)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE RESTRICT,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    rent_amount NUMERIC(10,2) NOT NULL,
    additional_charges NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    advance_adjusted NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_payable NUMERIC(10,2) NOT NULL,
    amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('draft', 'unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled')),
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. INVOICE ITEMS
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PAYMENTS (Omnichannel payment receipts)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number TEXT UNIQUE NOT NULL,
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE RESTRICT,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('online_razorpay', 'online_cashfree', 'cash', 'direct_upi', 'bank_transfer')),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_reference TEXT,
    verified_by UUID REFERENCES public.profiles(id),
    verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PAYMENT ALLOCATIONS (Links payment to invoice settlements)
CREATE TABLE IF NOT EXISTS public.payment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    allocated_amount NUMERIC(10,2) NOT NULL CHECK (allocated_amount > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. ADVANCE TRANSACTIONS (Independent advance rent credit ledger)
CREATE TABLE IF NOT EXISTS public.advance_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit_invoice_adjustment', 'refund')),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(10,2) NOT NULL,
    reference_id TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. SECURITY DEPOSITS (Independent refundable security deposit ledger)
CREATE TABLE IF NOT EXISTS public.security_deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID UNIQUE NOT NULL REFERENCES public.residents(id) ON DELETE RESTRICT,
    total_deposit_paid NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    deductions_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    refunded_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    current_deposit_balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'partially_refunded', 'settled_refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. DEPOSIT TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.deposit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deposit_id UUID NOT NULL REFERENCES public.security_deposits(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit_paid', 'damage_deduction', 'utility_deduction', 'refund')),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(10,2) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. PAYMENT GATEWAY ORDERS
CREATE TABLE IF NOT EXISTS public.payment_gateway_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_name TEXT NOT NULL CHECK (gateway_name IN ('razorpay', 'cashfree')),
    order_id TEXT UNIQUE NOT NULL,
    invoice_id UUID REFERENCES public.invoices(id),
    resident_id UUID NOT NULL REFERENCES public.residents(id),
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed')),
    gateway_payment_id TEXT,
    gateway_signature TEXT,
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. NOTIFICATION LOGS
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms')),
    recipient TEXT NOT NULL,
    template_name TEXT NOT NULL,
    payload JSONB,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. EXPENSE CATEGORIES & EXPENSES
CREATE TABLE IF NOT EXISTS public.expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.expense_categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    paid_to TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. COMPLAINTS & MAINTENANCE
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    category TEXT NOT NULL CHECK (category IN ('plumbing', 'electrical', 'wifi', 'food', 'cleaning', 'noise', 'other')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. VISITORS REGISTER
CREATE TABLE IF NOT EXISTS public.visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE RESTRICT,
    visitor_name TEXT NOT NULL,
    visitor_phone TEXT NOT NULL,
    relation TEXT NOT NULL,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    check_out_time TIMESTAMPTZ,
    purpose TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. NOTICES (Branch and Central Announcements)
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE, -- NULL = All Branches
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_urgent BOOLEAN DEFAULT FALSE,
    posted_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    changes JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- SEED INITIAL 5 BRANCHES WITH SPECIFIED CODES
-- =====================================================================

INSERT INTO public.branches (branch_code, name, gender_category, address_line1, address_line2, city, state, pincode, contact_phone, total_floors)
VALUES 
    (1, 'DEVI Hostels — Boys Hostel Branch 1', 'boys', 'Main Airport Approach Road, Near Shamshabad Bus Station', 'Opp. HP Petrol Bunk', 'Shamshabad, Hyderabad', 'Telangana', '501218', '+91 93919 44082', 4),
    (2, 'DEVI Hostels — Boys Hostel Branch 2', 'boys', 'Plot 45, Airport Staff Enclave, Near RGIA Cargo Circle', 'Beside Airline Crew Quarters', 'Shamshabad, Hyderabad', 'Telangana', '501218', '+91 93919 44082', 4),
    (3, 'DEVI Hostels — Boys Hostel Branch 3', 'boys', 'Rallaguda Main Road, Near Vardhaman Engineering College Junction', 'Near Shamshabad Flyover', 'Shamshabad, Hyderabad', 'Telangana', '501218', '+91 93919 44082', 4),
    (4, 'DEVI Hostels — Boys Hostel Branch 4', 'boys', 'Madhura Nagar, Aviation Transit Zone', 'Near Shamshabad Police Station', 'Shamshabad, Hyderabad', 'Telangana', '501218', '+91 93919 44082', 4),
    (5, 'DEVI Hostels — Girls Hostel Branch 1', 'girls', 'Gated High-Security Avenue, Near RGIA Airport Road', 'Dedicated Bio-Metric Entrance & CCTV Monitoring', 'Shamshabad, Hyderabad', 'Telangana', '501218', '+91 93919 44082', 5)
ON CONFLICT (branch_code) DO UPDATE 
SET name = EXCLUDED.name,
    gender_category = EXCLUDED.gender_category,
    address_line1 = EXCLUDED.address_line1,
    contact_phone = EXCLUDED.contact_phone;

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Branches & Rooms are publicly readable for website display and enquiry
CREATE POLICY "Public branches read" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Public floors read" ON public.floors FOR SELECT USING (true);
CREATE POLICY "Public rooms read" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Public beds read" ON public.beds FOR SELECT USING (true);

-- Anyone can submit an admission enquiry
CREATE POLICY "Public enquiry insert" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Staff can view all enquiries
CREATE POLICY "Staff enquiry view" ON public.enquiries FOR SELECT USING (
    auth.role() = 'authenticated'
);

-- Staff can update enquiry status
CREATE POLICY "Staff enquiry update" ON public.enquiries FOR UPDATE USING (
    auth.role() = 'authenticated'
);
