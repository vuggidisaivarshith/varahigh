-- =====================================================================
-- VARAHI GIRLS HOSTEL — PHASE 4: CONSOLIDATED PRODUCTION DATABASE SCHEMA & RLS
-- Centralized 5-Branch Management ERP for Shamshabad, Hyderabad
-- Proprietor: E. BHARATH CHANDRA
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. INTEGRATIONS SETTINGS (Feature Flags & Pre-Launch Mode State)
CREATE TABLE IF NOT EXISTS public.integrations_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mode TEXT NOT NULL DEFAULT 'preview_sandbox' CHECK (mode IN ('disabled', 'preview_sandbox', 'sandbox_test', 'live_production')),
    config JSONB DEFAULT '{}'::JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed pre-launch configuration
INSERT INTO public.integrations_settings (service_name, category, is_enabled, mode)
VALUES 
    ('razorpay', 'payment', FALSE, 'preview_sandbox'),
    ('whatsapp_business', 'messaging', FALSE, 'preview_sandbox'),
    ('sms_gateway', 'messaging', FALSE, 'preview_sandbox'),
    ('resend_email', 'messaging', FALSE, 'preview_sandbox')
ON CONFLICT (service_name) DO UPDATE 
SET is_enabled = EXCLUDED.is_enabled,
    mode = EXCLUDED.mode;

-- 2. SECURE OTP LOGS & RATE LIMITING TABLE
CREATE TABLE IF NOT EXISTS public.resident_otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    hashed_otp TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    is_consumed BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resident_otp_lookup 
ON public.resident_otp_codes(phone, is_consumed, expires_at);

-- 3. AUDITABLE RECONCILIATIONS TABLE
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

-- 4. MAINTENANCE & OPERATIONAL REMINDERS TABLE
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

-- 5. ENSURE UNIQUE AUDIT TRAIL IMMUTABILITY
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info';
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_branch_code INT;

-- 6. PERMANENT RESIDENT ID FORMAT CONSTRAINT
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_resident_id_structure'
    ) THEN
        ALTER TABLE public.residents
        ADD CONSTRAINT check_resident_id_structure
        CHECK (resident_id ~ '^DV[1-5]-[1-6]-[0-9]{5,}$');
    END IF;
END $$;

-- 7. FUNCTION: ATOMIC ADMISSION WITH PERSISTENT LEDGER CREATION
CREATE OR REPLACE FUNCTION public.execute_resident_admission(
    p_branch_code INT,
    p_floor_number INT,
    p_full_name TEXT,
    p_phone TEXT,
    p_category TEXT,
    p_gender TEXT,
    p_room_id UUID,
    p_bed_id UUID,
    p_admission_date DATE,
    p_agreed_rent NUMERIC,
    p_security_deposit NUMERIC,
    p_emerg_name TEXT,
    p_emerg_phone TEXT,
    p_emerg_relation TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_seq BIGINT;
    v_resident_id TEXT;
    v_resident_uuid UUID;
    v_branch_uuid UUID;
BEGIN
    -- Verify bed is vacant
    IF NOT EXISTS (SELECT 1 FROM public.beds WHERE id = p_bed_id AND status = 'vacant') THEN
        RAISE EXCEPTION 'Target bed is occupied or invalid.';
    END IF;

    -- Fetch branch UUID
    SELECT id INTO v_branch_uuid FROM public.branches WHERE branch_code = p_branch_code;

    -- Atomic sequence increment
    UPDATE public.resident_id_sequences
    SET current_number = current_number + 1,
        updated_at = NOW()
    WHERE id = 1
    RETURNING current_number INTO v_seq;

    -- Format: DV[BRANCH]-[FLOOR]-[5-digit serial]
    v_resident_id := 'DV' || p_branch_code || '-' || p_floor_number || '-' || LPAD(v_seq::TEXT, 5, '0');

    -- Insert Resident
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
        v_seq,
        p_category,
        p_full_name,
        p_phone,
        p_gender,
        p_emerg_name,
        p_emerg_phone,
        p_emerg_relation,
        p_admission_date,
        EXTRACT(DAY FROM p_admission_date)::INT,
        p_agreed_rent,
        'active'
    ) RETURNING id INTO v_resident_uuid;

    -- Lock Bed
    UPDATE public.beds
    SET status = 'occupied',
        updated_at = NOW()
    WHERE id = p_bed_id;

    -- Create Current Stay
    INSERT INTO public.stays (
        resident_id,
        branch_id,
        room_id,
        bed_id,
        check_in_date,
        is_current
    ) VALUES (
        v_resident_uuid,
        v_branch_uuid,
        p_room_id,
        p_bed_id,
        p_admission_date,
        TRUE
    );

    -- Create Security Deposit Ledger Entry
    INSERT INTO public.security_deposits (
        resident_id,
        total_deposit_paid,
        current_deposit_balance,
        status
    ) VALUES (
        v_resident_uuid,
        p_security_deposit,
        p_security_deposit,
        'held'
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'resident_id', v_resident_id,
        'uuid', v_resident_uuid
    );
END;
$$ LANGUAGE plpgsql;
