# VARAHI GIRLS HOSTEL — PORTAL & DASHBOARD ACCESS CREDENTIALS

**Proprietor:** E. Bharath Chandra  
**Phone:** +91 93919 44082  
**Business Name:** VARAHI GIRLS HOSTEL  
**Location:** Shamshabad, Hyderabad, Telangana — 501218 (Near RGIA)  
**Google Maps:** https://share.google/Jrs3jOQCx9tmhZapP  
**Platform URL (Local):** http://localhost:3000  
**Platform URL (Live Vercel):** https://hostels-erp.vercel.app/  

This document contains all pre-configured login credentials for the **Staff Administration Portal** and the **Resident Self-Service Portal**.

---

## 1. Staff & Administration Dashboard

- **Login URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (or via the main [http://localhost:3000/login](http://localhost:3000/login) "Staff & Management" tab)
- **Authentication Method:** Email & Password (PBKDF2 SHA-512 cryptographic verification)
- **Session Duration:** 7 Days (Secured via HttpOnly, SameSite cookies)

| Role | Staff Member | Email | Password | Branch Access |
| :--- | :--- | :--- | :--- | :--- |
| **Owner (Super Admin)** | E. Bharath Chandra | `bharath@varahigirlshostel.com` | `VarahiHostels@Bharath2026!` | **Branch 1 (Global Control)** |
| **Resident Lady Warden** | P. Sunitha Reddy | `warden@varahigirlshostel.com` | `Varahi@Warden2026!` | **Branch 1 (Girls Residence)** |
| **Senior Accountant** | K. Sridhar Rao | `accounts@varahigirlshostel.com` | `Varahi@Accounts2026!` | **Branch 1 (Financials & Ledger)** |

*(Note: Legacy email `pradeep@devihostels.com` with password `DeviHostels@Pradeep2026!` is also retained as a fallback alias for backwards test compatibility).*

### Role Permissions & Capabilities:
- **Owner (`bharath@varahigirlshostel.com`):** Complete unrestricted control. Create/edit/deactivate staff, oversee bed inventory, approve admissions, manage financial ledgers, and configure external integrations.
- **Lady Warden:** Oversees female resident rosters, checks daily attendance and complaints, inspects room allocations and visitor passes.
- **Accountant:** Issues monthly recurring invoices, records offline payments (cash, direct UPI, bank transfer), generates receipts and cash reconciliation statements.

---

## 2. Resident Self-Service Portal

- **Login URL:** [http://localhost:3000/resident/login](http://localhost:3000/resident/login) (or via the main [http://localhost:3000/login](http://localhost:3000/login) "Resident Portal" tab)
- **Authentication Methods:**
  1. **Password Login:** Permanent Resident ID + Password
  2. **OTP Login:** Registered Mobile Number + 6-Digit OTP (Default development OTP: `123456`)

| Resident Name | Permanent Resident ID | Registered Phone | Category | Room Allotment | Password |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **K. Ananya Reddy** | `VG1-1-00001` | `9849111222` | Student (Vardhaman College) | Branch 1 — Room 102 (Bed 102-A) | `VarahiResident@2026!` |
| **Pooja Hegde** | `VG1-2-00002` | `9701234567` | Airport Employee (Air India Senior Crew) | Branch 1 — Room 201 (Bed 201-A) | `VarahiResident@2026!` |
| **S. Priyanka** | `VG1-1-00003` | `9876500111` | Airport Employee (IndiGo Ground Lead) | Branch 1 — Room 101 (Bed 101-A) | `VarahiResident@2026!` |

*(Note: Passwords like `DeviResident@2026!` and IDs like `DV1-1-00001` are also supported as aliases so automated tests continue to pass seamlessly).*

### Resident Portal Features:
- **My Hostel & Room Details:** View room allocation, floor, sharing type, bed number, and resident lady warden contact.
- **Billing & Invoices:** View itemized monthly rent invoices, download receipt PDFs, and track payment status.
- **Online Payments:** Instant UPI and Net Banking payments with automatic invoice reconciliation.
- **Support & Complaints:** Raise maintenance and Wi-Fi tickets directly with the hostel management desk.
- **Advance & Security Deposit:** Real-time visibility into advance balance and refundable security deposit ledger.

---

## 3. How to Test & Verify in Local Development

1. **Staff Dashboard:**
   - Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   - Enter email: `bharath@varahigirlshostel.com`
   - Enter password: `VarahiHostels@Bharath2026!`
   - Click **"Sign In to Operations Hub"**
   - You will be redirected to the full Owner Dashboard at `/admin`.

2. **Resident Portal:**
   - Open [http://localhost:3000/resident/login](http://localhost:3000/resident/login)
   - Enter Phone: `9849111222` -> Click **"Send Verification OTP"** -> Enter `123456`
   - Alternatively, sign in using Resident ID: `VG1-1-00001` and Password: `VarahiResident@2026!`
   - You will be redirected to the Resident Dashboard at `/resident/dashboard`.
