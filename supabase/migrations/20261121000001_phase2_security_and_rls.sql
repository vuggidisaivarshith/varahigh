-- =====================================================================
-- DEVI HOSTELS — PHASE 2 & 3: SECURITY, RLS & PRODUCTION SCHEMA HARDENING
-- Location: Shamshabad, Hyderabad, Telangana, India
-- Proprietor: MARPINA PRADEEP
-- =====================================================================

-- 1. FIX & UPDATE VERIFIED BRANCH INFORMATION
UPDATE public.branches
SET name = 'DEVI MANSION — Devi Luxury Boys Hostel (The Boys Town)',
    address_line1 = 'Street Number 8, Rallaguda Road, Madhura Nagar',
    address_line2 = 'Near RGIA Airport Hub, Shamshabad',
    contact_phone = '+91 99898 97705',
    contact_email = 'devimansion@devihostels.com',
    facilities = ARRAY[
        'Free In-House Fitness Gym',
        'Dedicated Vehicle Parking (Bikes & Cars)',
        'Attached Bathrooms with 24/7 Hot Water Geysers',
        'High-Speed Unlimited Fiber Wi-Fi',
        '3-Times Homely Buffet Meals (South & North Indian)',
        '24/7 CCTV & Security Guard Surveillance',
        'Daily Professional Room Cleaning',
        'RO Purified Drinking Water',
        'Power Backup & Inverter Protection',
        'Automatic Washing Machines & Laundry Zone',
        'Spacious Lockable Wardrobe & Study Desk'
    ]
WHERE branch_code = 1;

UPDATE public.branches
SET contact_phone = '+91 99898 97705'
WHERE branch_code IN (2, 3, 4, 5);

-- 2. ENFORCE PERMANENT RESIDENT ID REGEX CONSTRAINT
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_devi_resident_id_format'
    ) THEN
        ALTER TABLE public.residents
        ADD CONSTRAINT check_devi_resident_id_format
        CHECK (resident_id ~ '^DV[1-5]-[1-6]-[0-9]{5,}$');
    END IF;
END $$;

-- 3. CREATE CASH RECONCILIATIONS TABLE
CREATE TABLE IF NOT EXISTS public.cash_reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_code INT NOT NULL CHECK (branch_code BETWEEN 1 AND 5),
    reconciliation_date DATE NOT NULL,
    opening_cash NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cash_collected NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cash_expenses NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    expected_closing_cash NUMERIC(10,2) NOT NULL,
    actual_closing_cash NUMERIC(10,2) NOT NULL,
    variance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    audited_by TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_code, reconciliation_date)
);

-- 4. CREATE MAINTENANCE & REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.maintenance_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_code INT NOT NULL CHECK (branch_code BETWEEN 1 AND 5),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('water_filter', 'ac_service', 'fire_safety', 'pest_control', 'generator', 'general')),
    due_date DATE NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    assigned_to TEXT NOT NULL,
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE SECURE OTP STORAGE TABLE
CREATE TABLE IF NOT EXISTS public.resident_otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    hashed_otp TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    consumed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_phone_created ON public.resident_otp_codes(phone, created_at DESC);

-- =====================================================================
-- 6. COMPREHENSIVE ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all remaining sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_reminders ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current auth user is an active staff member with specific roles
CREATE OR REPLACE FUNCTION public.is_authorized_staff(required_roles TEXT[] DEFAULT ARRAY['owner', 'branch_manager', 'accountant', 'warden'])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.profile_id = auth.uid()
        AND ur.role = ANY(required_roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if current auth user is assigned to a specific branch or is global owner
CREATE OR REPLACE FUNCTION public.can_manage_branch(target_branch_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.profile_id = auth.uid()
        AND (ur.role = 'owner' OR ur.branch_id = target_branch_id OR ur.branch_id IS NULL)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLICIES: RESIDENTS TABLE
DROP POLICY IF EXISTS "Staff full resident access" ON public.residents;
CREATE POLICY "Staff full resident access" ON public.residents
    FOR ALL
    USING (public.is_authorized_staff(ARRAY['owner', 'branch_manager', 'accountant', 'warden']));

DROP POLICY IF EXISTS "Resident self view" ON public.residents;
CREATE POLICY "Resident self view" ON public.residents
    FOR SELECT
    USING (profile_id = auth.uid());

-- POLICIES: INVOICES TABLE
DROP POLICY IF EXISTS "Staff full invoice access" ON public.invoices;
CREATE POLICY "Staff full invoice access" ON public.invoices
    FOR ALL
    USING (public.is_authorized_staff(ARRAY['owner', 'branch_manager', 'accountant']));

DROP POLICY IF EXISTS "Resident self invoices" ON public.invoices;
CREATE POLICY "Resident self invoices" ON public.invoices
    FOR SELECT
    USING (resident_id IN (SELECT id FROM public.residents WHERE profile_id = auth.uid()));

-- POLICIES: PAYMENTS TABLE
DROP POLICY IF EXISTS "Staff full payments access" ON public.payments;
CREATE POLICY "Staff full payments access" ON public.payments
    FOR ALL
    USING (public.is_authorized_staff(ARRAY['owner', 'branch_manager', 'accountant']));

DROP POLICY IF EXISTS "Resident self payments" ON public.payments;
CREATE POLICY "Resident self payments" ON public.payments
    FOR SELECT
    USING (resident_id IN (SELECT id FROM public.residents WHERE profile_id = auth.uid()));

-- POLICIES: ADVANCE TRANSACTIONS
DROP POLICY IF EXISTS "Staff advance ledger" ON public.advance_transactions;
CREATE POLICY "Staff advance ledger" ON public.advance_transactions
    FOR ALL
    USING (public.is_authorized_staff(ARRAY['owner', 'accountant']));

DROP POLICY IF EXISTS "Resident self advance" ON public.advance_transactions;
CREATE POLICY "Resident self advance" ON public.advance_transactions
    FOR SELECT
    USING (resident_id IN (SELECT id FROM public.residents WHERE profile_id = auth.uid()));

-- POLICIES: SECURITY DEPOSITS
DROP POLICY IF EXISTS "Staff deposit ledger" ON public.security_deposits;
CREATE POLICY "Staff deposit ledger" ON public.security_deposits
    FOR ALL
    USING (public.is_authorized_staff(ARRAY['owner', 'accountant']));

DROP POLICY IF EXISTS "Resident self deposit" ON public.security_deposits;
CREATE POLICY "Resident self deposit" ON public.security_deposits
    FOR SELECT
    USING (resident_id IN (SELECT id FROM public.residents WHERE profile_id = auth.uid()));

-- POLICIES: COMPLAINTS
DROP POLICY IF EXISTS "Staff full complaints" ON public.complaints;
CREATE POLICY "Staff full complaints" ON public.complaints
    FOR ALL
    USING (public.is_authorized_staff(ARRAY['owner', 'branch_manager', 'warden']));

DROP POLICY IF EXISTS "Resident self complaints" ON public.complaints;
CREATE POLICY "Resident self complaints" ON public.complaints
    FOR ALL
    USING (resident_id IN (SELECT id FROM public.residents WHERE profile_id = auth.uid()));

-- POLICIES: AUDIT LOGS (Owner only)
DROP POLICY IF EXISTS "Owner audit logs view" ON public.audit_logs;
CREATE POLICY "Owner audit logs view" ON public.audit_logs
    FOR SELECT
    USING (public.is_authorized_staff(ARRAY['owner']));

-- POLICIES: CASH RECONCILIATIONS
DROP POLICY IF EXISTS "Staff cash reconciliation" ON public.cash_reconciliations;
CREATE POLICY "Staff cash reconciliation" ON public.cash_reconciliations
    FOR ALL
    USING (public.is_authorized_staff(ARRAY['owner', 'accountant']));

-- POLICIES: MAINTENANCE REMINDERS
DROP POLICY IF EXISTS "Staff reminders" ON public.maintenance_reminders;
CREATE POLICY "Staff reminders" ON public.maintenance_reminders
    FOR ALL
    USING (public.is_authorized_staff(ARRAY['owner', 'branch_manager', 'warden']));

-- =====================================================================
-- 7. ATOMIC ADMISSION STORED FUNCTION (Guarantees Permanent ID & Bed Lock)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.confirm_resident_admission(
    p_branch_code INT,
    p_floor_number INT,
    p_full_name TEXT,
    p_phone TEXT,
    p_category TEXT,
    p_gender TEXT,
    p_room_id UUID,
    p_bed_id UUID,
    p_admission_date DATE,
    p_monthly_rent NUMERIC,
    p_security_deposit NUMERIC,
    p_emerg_name TEXT,
    p_emerg_phone TEXT,
    p_emerg_relation TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_next_seq BIGINT;
    v_resident_id TEXT;
    v_new_resident_uuid UUID;
    v_branch_uuid UUID;
BEGIN
    -- 1. Ensure bed is vacant
    IF NOT EXISTS (SELECT 1 FROM public.beds WHERE id = p_bed_id AND status = 'vacant') THEN
        RAISE EXCEPTION 'Selected bed is no longer vacant.';
    END IF;

    -- 2. Fetch branch UUID
    SELECT id INTO v_branch_uuid FROM public.branches WHERE branch_code = p_branch_code;

    -- 3. Atomic sequence increment
    UPDATE public.resident_id_sequences
    SET current_number = current_number + 1,
        updated_at = NOW()
    WHERE id = 1
    RETURNING current_number INTO v_next_seq;

    -- 4. Construct permanent Resident ID: DV[BRANCH]-[FLOOR]-[5-digit serial]
    v_resident_id := 'DV' || p_branch_code || '-' || p_floor_number || '-' || LPAD(v_next_seq::TEXT, 5, '0');

    -- 5. Insert Resident record
    INSERT INTO public.residents (
        resident_id,
        initial_branch_code,
        initial_floor_number,
        sequence_number,
        category,
        full_name,
        phone,
        gender,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relation,
        admission_date,
        billing_anchor_day,
        agreed_monthly_rent,
        status
    ) VALUES (
        v_resident_id,
        p_branch_code,
        p_floor_number,
        v_next_seq,
        p_category,
        p_full_name,
        p_phone,
        p_gender,
        p_emerg_name,
        p_emerg_phone,
        p_emerg_relation,
        p_admission_date,
        EXTRACT(DAY FROM p_admission_date)::INT,
        p_monthly_rent,
        'active'
    ) RETURNING id INTO v_new_resident_uuid;

    -- 6. Lock Bed
    UPDATE public.beds
    SET status = 'occupied',
        updated_at = NOW()
    WHERE id = p_bed_id;

    -- 7. Create Stay Record
    INSERT INTO public.stays (
        resident_id,
        branch_id,
        room_id,
        bed_id,
        check_in_date,
        is_current
    ) VALUES (
        v_new_resident_uuid,
        v_branch_uuid,
        p_room_id,
        p_bed_id,
        p_admission_date,
        TRUE
    );

    -- 8. Create Security Deposit Ledger Entry
    INSERT INTO public.security_deposits (
        resident_id,
        total_deposit_paid,
        current_deposit_balance,
        status
    ) VALUES (
        v_new_resident_uuid,
        p_security_deposit,
        p_security_deposit,
        'held'
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'resident_id', v_resident_id,
        'uuid', v_new_resident_uuid,
        'sequence', v_next_seq
    );
END;
$$ LANGUAGE plpgsql;
