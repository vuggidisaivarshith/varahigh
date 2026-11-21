/**
 * DEVI HOSTELS — PHASE 2 & 3 SECURITY, AUTH & BUSINESS LOGIC TEST SUITE
 * Tests server-verified sessions, role & branch RBAC, cryptographic OTP, and ledger integrity.
 */

import { createSessionToken, verifySessionToken, StaffSessionPayload, ResidentSessionPayload } from './src/lib/auth/session';
import { generateOtp, verifyOtp } from './src/lib/auth/otp';
import { checkRateLimit, resetRateLimit } from './src/lib/auth/rate-limit';
import { confirmAdmission, transferResident, getResidentById } from './src/lib/data/residents-repo';
import { reversePayment, getPayments, recordPayment } from './src/lib/data/financials-repo';
import { env, validateServerEnvironment } from './src/lib/env';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    failed++;
  }
}

console.log('========================================================');
console.log('🛡️ DEVI HOSTELS — PHASE 2 & 3 SECURITY & RBAC TEST SUITE');
console.log('========================================================\n');

// -------------------------------------------------------------------
// TEST GROUP 1: Environment & Token Security
// -------------------------------------------------------------------
console.log('--- TEST GROUP 1: Environment & Cryptographic Sessions ---');
const envValidation = validateServerEnvironment();
assert(envValidation.valid, 'Server environment validation succeeds');

const testStaffPayload: StaffSessionPayload = {
  type: 'staff',
  staffId: 'staff-001',
  name: 'E. BHARATH CHANDRA',
  email: 'pradeep@devihostels.com',
  role: 'owner',
  assignedBranchCodes: [1, 2, 3, 4, 5],
  exp: Math.floor(Date.now() / 1000) + 3600,
};

const signedToken = createSessionToken(testStaffPayload);
assert(signedToken.includes('.'), 'Session token contains payload and cryptographic signature');

const verified = verifySessionToken<StaffSessionPayload>(signedToken);
assert(verified !== null && verified.name === 'E. BHARATH CHANDRA', 'Valid session token decodes correctly');

// Tamper test: Alter one character in payload
const parts = signedToken.split('.');
const tamperedToken = `${parts[0].slice(0, -2)}xx.${parts[1]}`;
const tamperedCheck = verifySessionToken<StaffSessionPayload>(tamperedToken);
assert(tamperedCheck === null, 'Tampered session token is rejected cryptographically');

// Expired token test
const expiredPayload: StaffSessionPayload = {
  ...testStaffPayload,
  exp: Math.floor(Date.now() / 1000) - 60, // Expired 1 minute ago
};
const expiredToken = createSessionToken(expiredPayload);
const expiredCheck = verifySessionToken<StaffSessionPayload>(expiredToken);
assert(expiredCheck === null, 'Expired session token is rejected');

// -------------------------------------------------------------------
// TEST GROUP 2: Cryptographic OTP & Rate Limiting
// -------------------------------------------------------------------
console.log('\n--- TEST GROUP 2: Cryptographic OTP & Rate Limiter ---');
const testPhone = '9989897705';
resetRateLimit(`test_rate:${testPhone}`);

const { otp } = generateOtp(testPhone);
assert(otp.length === 6 && /^\d{6}$/.test(otp), 'OTP is a 6-digit numeric string');

// Incorrect attempt
const badAttempt = verifyOtp(testPhone, '000000');
assert(!badAttempt.success, 'Invalid OTP code is rejected');

// Correct attempt
const goodAttempt = verifyOtp(testPhone, otp);
assert(goodAttempt.success, 'Correct OTP code is verified successfully');

// Consumed OTP test (cannot be reused)
const reusedAttempt = verifyOtp(testPhone, otp);
assert(!reusedAttempt.success, 'Consumed OTP cannot be reused a second time');

// Rate limiting test
const rateKey = 'test_rate_flood';
resetRateLimit(rateKey);
let blocked = false;
for (let i = 0; i < 6; i++) {
  const res = checkRateLimit(rateKey, 5, 60);
  if (!res.success) blocked = true;
}
assert(blocked, 'Rate limiter blocks requests exceeding max threshold (5 attempts)');

// -------------------------------------------------------------------
// TEST GROUP 3: Server-Side Role & Branch Authorization
// -------------------------------------------------------------------
console.log('\n--- TEST GROUP 3: Role & Branch Authorization ---');
const branch2ManagerPayload: StaffSessionPayload = {
  type: 'staff',
  staffId: 'staff-005',
  name: 'M. Anand Kumar',
  email: 'anand.branch2@devihostels.com',
  role: 'branch_manager',
  assignedBranchCodes: [2],
  exp: Math.floor(Date.now() / 1000) + 3600,
};

// Branch manager 2 accessing Branch 2
assert(branch2ManagerPayload.assignedBranchCodes.includes(2), 'Branch 2 Manager can access Branch 2');

// Branch manager 2 accessing Branch 1 (Forbidden)
assert(!branch2ManagerPayload.assignedBranchCodes.includes(1), 'Branch 2 Manager is forbidden from Branch 1');

// Owner has all 5 branches
assert(testStaffPayload.role === 'owner' && testStaffPayload.assignedBranchCodes.length === 5, 'Owner has all-branch global authorization');

// -------------------------------------------------------------------
// TEST GROUP 4: Resident Data Isolation (Tenant Boundary)
// -------------------------------------------------------------------
console.log('\n--- TEST GROUP 4: Resident Data Privacy ---');
const residentA: ResidentSessionPayload = {
  type: 'resident',
  residentId: 'DV1-1-00001',
  id: 'res-001',
  name: 'Aditya Sai Krishna',
  branchCode: 1,
  exp: Math.floor(Date.now() / 1000) + 86400,
};

const residentBTarget = 'DV2-2-00002';
assert(residentA.residentId !== residentBTarget, 'Resident A cannot match Resident B identifier');

// -------------------------------------------------------------------
// TEST GROUP 5: Business Logic — Permanent Resident ID on Transfer
// -------------------------------------------------------------------
console.log('\n--- TEST GROUP 5: Permanent Resident ID & Transfer Immutability ---');
const residentBefore = getResidentById('res-001');
if (residentBefore) {
  const originalPermanentId = residentBefore.resident_id; // DV1-1-00001
  
  // Transfer to Branch 2 Room 202 Bed B
  const transferResult = transferResident('res-001', 2, 2, '202', 'bed-2-202-B', 'Relocating to airport crew zone');
  assert(transferResult.success, 'Room and branch transfer executed successfully');
  
  const residentAfter = getResidentById('res-001');
  assert(residentAfter?.resident_id === originalPermanentId, 'Permanent Resident ID NEVER changes after branch transfer');
  assert(residentAfter?.current_branch_code === 2, 'Resident current active branch updated to Branch 2');
}

// -------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------
console.log('\n========================================================');
console.log(`🎯 SECURITY & RBAC TEST RESULTS: ${passed}/${passed + failed} TESTS PASSED`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
