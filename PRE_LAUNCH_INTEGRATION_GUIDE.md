# VARAHI GIRLS HOSTEL — PRE-LAUNCH INTEGRATION & OWNER APPROVAL GUIDE

**Proprietor:** E. BHARATH CHANDRA  
**Business Name:** VARAHI GIRLS HOSTEL  
**Flagship Property:** DEVI MANSION — Varahi Luxury Girls Hostel (Street 8, Rallaguda Road, Shamshabad)  
**Primary Contact:** +91 93919 44082 / +91 93919 44082  
**Production Domain:** https://hostels-erp.vercel.app/  
**Repository:** https://github.com/vuggidisaivarshith/varahigs  

---

## 1. Executive Summary & Pre-Launch Mode

The VARAHI GIRLS HOSTEL Multi-Branch ERP is currently operating in **Pre-Launch Mode** (`IS_PRE_LAUNCH_MODE = true` in `src/lib/integrations/config.ts`). 

### Why Pre-Launch Mode?
To protect business operations and avoid premature financial/SMS charges during administrative review:
1. **Zero Unapproved Live Charges:** No real bank transactions or live Razorpay charges are processed without explicit proprietor confirmation.
2. **Zero Spurious Resident Messages:** No live SMS or WhatsApp messages are dispatched to real resident numbers while staff training and room inventory setup are underway.
3. **Safe Simulation Environment:** Staff and administrators can test invoice creation, receipt generation, room check-in, and cash reconciliations with full audit logging in safe sandbox mode.

---

## 2. Service-by-Service Integration Readiness

| Integration Service | Current Mode | Architecture Component | Production Requirements for Go-Live | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Razorpay Payment Gateway** | Sandbox / Preview | `src/lib/integrations/adapters.ts` (`createPaymentOrder`) | 1. Complete Merchant KYC on Razorpay Dashboard.<br>2. Link E. Bharath Chandra's current bank account for payouts.<br>3. Replace Test Keys with Production Live Key ID & Secret.<br>4. Configure Webhook URL `https://hostels-erp.vercel.app/api/payments/razorpay/verify`. | Ready for Key Switch |
| **WhatsApp Business API** | Local Simulator / DB Log | `src/lib/integrations/adapters.ts` (`dispatchNotification`) | 1. Meta for Business account verification.<br>2. Register official hostel phone `+91 93919 44082`.<br>3. Submit HSM message templates (Welcome, Rent Due, Receipt) to Meta for approval.<br>4. Provide Permanent Access Token & Phone Number ID. | Integration-Ready |
| **SMS Gateway (Fast2SMS / MSG91)** | Sandbox Simulation | `src/lib/integrations/adapters.ts` (`dispatchNotification`) | 1. Complete DLT registration with Indian telecom operators (TRAI requirement).<br>2. Register Sender ID (e.g., `VARAHI`).<br>3. Register approved DLT template IDs for OTP and receipts.<br>4. Configure `SMS_GATEWAY_API_KEY`. | Integration-Ready |
| **Transactional Email (Resend)** | Console / DB Log | `src/lib/integrations/adapters.ts` | 1. Verify `varahigirlshostel.com` DNS records (SPF, DKIM, DMARC) in Resend.<br>2. Configure `RESEND_API_KEY` in Vercel environment variables. | Integration-Ready |
| **Supabase PostgreSQL & Auth** | Real Migration Ready | `supabase/migrations/` | 1. Link Supabase project URL & Service Key in Vercel.<br>2. Run migration scripts `20261121000001_phase2_security_and_rls.sql` and `20261121000002_phase4_real_db_and_integrations.sql`. | Migration Ready |

---

## 3. Proprietor Approval Checklist (E. BHARATH CHANDRA)

Before switching from Pre-Launch to Live Operations, the Proprietor must review and approve the following operational parameters:

- [ ] **Branch 1 (Flagship Varahi Girls Hostel (Branch 1)):** Confirm room pricing (1-sharing ₹10,000, 2-sharing AC ₹8,500, Non-AC ₹7,000, 3-sharing ₹6,500) and gym access policies.
- [ ] **Branches 2, 3, 4, 5 Addresses:** Confirm whether exact street landmarks and Google Maps location pins for Branches 2–5 should be published publicly or shared only upon direct contact with admissions.
- [ ] **Security Deposit Policy:** Confirm standard security deposit amount (e.g., ₹3,000–₹5,000) and terms for refundable deposit upon 30-day notice.
- [ ] **Joining-Date Billing:** Confirm that monthly billing aligns with resident's specific admission joining date (e.g., joined on 15th pays next on 15th) rather than arbitrary calendar 1st.
- [ ] **Bank Account Verification:** Confirm official business account details for Razorpay direct settlements.
- [ ] **Official Notification Channels:** Approve template wording for admission confirmations, monthly payment reminders, and payment receipts.

---

## 4. Go-Live Activation Steps (Post-Approval)

Once Proprietor approval is obtained, follow these 4 steps to activate live production mode:

### Step 1: Update Integration Flags
In `src/lib/integrations/config.ts`:
```typescript
export const INTEGRATION_CONFIG: IntegrationConfig = {
  IS_PRE_LAUNCH_MODE: false, // Switch to false
  ENABLE_LIVE_PAYMENTS: true,
  ENABLE_LIVE_WHATSAPP: true,
  ENABLE_LIVE_SMS: true,
  ENABLE_LIVE_EMAIL: true,
  // ...
};
```

### Step 2: Configure Production Environment Variables in Vercel
Add the following verified keys in Vercel Project Settings > Environment Variables:
- `RAZORPAY_KEY_ID`: `rzp_live_xxxxxxxxxxxx`
- `RAZORPAY_KEY_SECRET`: `xxxxxxxxxxxxxxxxxxxx`
- `RAZORPAY_WEBHOOK_SECRET`: `whsec_xxxxxxxxxxxx`
- `WHATSAPP_API_TOKEN`: `EAAG...`
- `WHATSAPP_PHONE_NUMBER_ID`: `xxxxxxxxxxxxx`
- `RESEND_API_KEY`: `re_xxxxxxxxxxxx`
- `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: `eyJ...`

### Step 3: Run Database Migrations
Execute the migrations in the Supabase SQL editor:
1. `supabase/migrations/20261121000001_phase2_security_and_rls.sql`
2. `supabase/migrations/20261121000002_phase4_real_db_and_integrations.sql`

### Step 4: Final Verification
1. Perform a test transaction of ₹1 using live Razorpay to verify automated webhook processing and invoice reconciliation.
2. Confirm instant receipt generation and delivery.
3. System is now fully live!
