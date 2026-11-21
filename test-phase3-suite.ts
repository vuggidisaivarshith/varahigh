// test-phase3-suite.ts
import {
  generateResidentInvoice,
  recordPayment,
  reversePayment,
  recordDepositTransaction,
  getFinancialOverview,
  getInvoices,
  getPayments,
  getAdvanceLedger,
  getDepositLedger,
  calculateNextBillingPeriod
} from './src/lib/data/financials-repo';
import { getResidents, getResidentById } from './src/lib/data/residents-repo';

console.log('========================================================');
console.log('🧪 DEVI HOSTELS — PHASE 3 FINANCIAL AUTOMATION TEST SUITE');
console.log('========================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    process.exitCode = 1;
  }
}

// TEST 1: Joining-date billing period calculation & Month-End Safety
console.log('--- TEST GROUP 1: Joining-Date Billing Calculations ---');
const nov15_1 = calculateNextBillingPeriod('2026-11-15', 0);
assert(
  nov15_1.period_start === '2026-11-15' && nov15_1.period_end === '2026-12-14',
  'Nov 15 cycle 0 spans 2026-11-15 to 2026-12-14'
);

const nov15_2 = calculateNextBillingPeriod('2026-11-15', 1);
assert(
  nov15_2.period_start === '2026-12-15' && nov15_2.period_end === '2027-01-14',
  'Nov 15 cycle 1 spans 2026-12-15 to 2027-01-14'
);

// Test Month-End rule (e.g., joined on 31st January)
const jan31_0 = calculateNextBillingPeriod('2026-01-31', 0);
assert(
  jan31_0.period_start === '2026-01-31' && jan31_0.period_end === '2026-02-27',
  'Jan 31 cycle 0 clamps end date to Feb 27 (day before Feb 28)'
);

const jan31_1 = calculateNextBillingPeriod('2026-01-31', 1);
assert(
  jan31_1.period_start === '2026-02-28' && jan31_1.period_end === '2026-03-30',
  'Jan 31 cycle 1 clamps Feb 28 to March 30 without cumulative date drift'
);

// TEST 2: Recurring Invoice Generation & Advance Adjustment
console.log('\n--- TEST GROUP 2: Recurring Invoice Generation & Advance Offset ---');
const resident = getResidents()[0]; // Rajesh Kumar DV1-1-00001
const initialAdvance = resident.advance_balance;

const newInvoiceResult = generateResidentInvoice(resident.id, {
  additional_charges: 0,
  apply_advance: true,
  notes: 'Automated Cycle 2 Generation'
});

assert(newInvoiceResult.success, 'Generated recurring invoice successfully');
const inv = newInvoiceResult.invoice!;
assert(inv.devi_resident_id === resident.resident_id, 'Invoice tagged with permanent Resident ID');
assert(inv.branch_code === 1, 'Invoice branch matches Branch 1');
assert(inv.rent_amount === resident.agreed_monthly_rent, 'Rent matches agreed monthly rent');

// TEST 3: Payment Collection & Ledger Recording
console.log('\n--- TEST GROUP 3: Omnichannel Payment Collection ---');
const payResult = recordPayment({
  resident_id: resident.id,
  amount: 4000,
  payment_method: 'cash',
  collector_name: 'Branch Manager Ramesh',
  collector_id: 'STAFF-001',
  transaction_reference: 'CASH-REC-TEST-001',
  remarks: 'Partial rent cash payment received at counter'
});

assert(payResult.success, 'Recorded offline cash payment');
const payment = payResult.payment!;
assert(payment.receipt_number.startsWith('RCPT-2026-'), 'Receipt number sequence format matches RCPT-2026-XXX');
assert(payment.amount === 4000, 'Payment amount logged as 4000');
assert(payment.status === 'verified', 'Payment auto-verified for authorized staff');

// TEST 4: Accounting Reversal (Non-destructive)
console.log('\n--- TEST GROUP 4: Accounting Reversals (Immutable Non-destructive) ---');
const reversalResult = reversePayment(payment.id, 'Entry error: Cash handed back to resident', 'ACCOUNTANT-01');
assert(reversalResult.success, 'Successfully reversed payment');
const allPayments = getPayments({ residentId: resident.id });
const originalP = allPayments.find(p => p.id === payment.id);
assert(originalP?.is_reversed === true, 'Original payment marked as is_reversed = true without deletion');
const reversalEntry = allPayments.find(p => p.reversal_of_id === payment.id);
assert(reversalEntry !== undefined, 'Counter-reversal entry written to the ledger');

// TEST 5: Security Deposit Escrow & Deductions
console.log('\n--- TEST GROUP 5: Security Deposit Escrow & Checkout Deductions ---');
const depInitial = resident.security_deposit;
const deductResult = recordDepositTransaction({
  resident_id: resident.id,
  type: 'damage_deduction',
  amount: 500,
  remarks: 'Room door lock replacement fee'
});

assert(deductResult.success, 'Deducted damage charge from deposit escrow');
assert(deductResult.entry?.balance_after === depInitial - 500, 'Security deposit decreased by 500');
const updatedResident = getResidentById(resident.id);
assert(updatedResident?.security_deposit === depInitial - 500, 'Resident profile security deposit balance updated');

// TEST 6: Financial Overview & Branch Aggregation
console.log('\n--- TEST GROUP 6: Financial Overview & Branch Summaries ---');
const overview = getFinancialOverview();
assert(overview.total_invoiced > 0, 'Overview gross invoiced is positive');
assert(overview.total_collected > 0, 'Overview total collected is positive');
assert(overview.branch_summaries.length >= 1, 'Overview aggregates Varahi Girls Hostel Branch 1');
assert(overview.payment_method_breakdown !== undefined, 'Payment method breakdown computed');

console.log('\n========================================================');
console.log(`🎯 TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('========================================================\n');
