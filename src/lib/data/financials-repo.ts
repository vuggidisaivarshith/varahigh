import {
  Resident,
  ResidentInvoice,
  ResidentPayment,
  PaymentMethod,
  BranchCode
} from '@/types/database';
import { getResidents, getResidentById } from './residents-repo';
import { DEVI_BRANCHES } from './branches';
import crypto from 'crypto';

// Extended Financial Entities
export interface FinancialInvoice extends ResidentInvoice {
  resident_name: string;
  room_number: string;
  additional_charges: number;
  notes?: string;
  created_at: string;
}

export interface FinancialPayment extends ResidentPayment {
  resident_name: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  room_number: string;
  collector_name: string;
  collector_id?: string;
  remarks?: string;
  reversal_of_id?: string;
  is_reversed?: boolean;
  created_at: string;
}

export interface AdvanceEntry {
  id: string;
  resident_id: string;
  devi_resident_id: string;
  resident_name: string;
  type: 'credit' | 'debit_invoice' | 'refund';
  amount: number;
  balance_after: number;
  reference_invoice_id?: string;
  description: string;
  date: string;
}

export interface DepositEntry {
  id: string;
  resident_id: string;
  devi_resident_id: string;
  resident_name: string;
  type: 'deposit_received' | 'damage_deduction' | 'utility_deduction' | 'refund';
  amount: number;
  balance_after: number;
  remarks: string;
  date: string;
}

// Stores
let invoicesStore: FinancialInvoice[] = [
  {
    id: 'inv-101',
    invoice_number: 'INV-2026-001',
    resident_id: 'res-001',
    devi_resident_id: 'DV1-1-00001',
    resident_name: 'Aditya Sai Krishna',
    branch_code: 1,
    room_number: '102',
    billing_period_start: '2026-11-01',
    billing_period_end: '2026-11-30',
    rent_amount: 7000,
    additional_charges: 0,
    advance_adjusted: 0,
    total_payable: 7000,
    amount_paid: 7000,
    balance_due: 0,
    due_date: '2026-11-01',
    status: 'paid',
    created_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 'inv-102',
    invoice_number: 'INV-2026-002',
    resident_id: 'res-002',
    devi_resident_id: 'DV2-2-00002',
    resident_name: 'Sumanth Nair',
    branch_code: 2,
    room_number: '201',
    billing_period_start: '2026-11-15',
    billing_period_end: '2026-12-14',
    rent_amount: 8500,
    additional_charges: 0,
    advance_adjusted: 0,
    total_payable: 8500,
    amount_paid: 8500,
    balance_due: 0,
    due_date: '2026-11-15',
    status: 'paid',
    created_at: '2026-11-15T08:00:00Z',
  },
  {
    id: 'inv-103',
    invoice_number: 'INV-2026-003',
    resident_id: 'res-003',
    devi_resident_id: 'DV5-1-00003',
    resident_name: 'Pooja Hegde',
    branch_code: 5,
    room_number: '101',
    billing_period_start: '2026-11-10',
    billing_period_end: '2026-12-09',
    rent_amount: 9000,
    additional_charges: 0,
    advance_adjusted: 0,
    total_payable: 9000,
    amount_paid: 9000,
    balance_due: 0,
    due_date: '2026-11-10',
    status: 'paid',
    created_at: '2026-11-10T08:00:00Z',
  },
  {
    id: 'inv-104',
    invoice_number: 'INV-2026-004',
    resident_id: 'res-001',
    devi_resident_id: 'DV1-1-00001',
    resident_name: 'Aditya Sai Krishna',
    branch_code: 1,
    room_number: '102',
    billing_period_start: '2026-12-01',
    billing_period_end: '2026-12-31',
    rent_amount: 7000,
    additional_charges: 0,
    advance_adjusted: 1500,
    total_payable: 7000,
    amount_paid: 0,
    balance_due: 5500,
    due_date: '2026-12-01',
    status: 'unpaid',
    created_at: '2026-11-20T08:00:00Z',
  }
];

let paymentsStore: FinancialPayment[] = [
  {
    id: 'pay-101',
    receipt_number: 'RCPT-2026-001',
    resident_id: 'res-001',
    devi_resident_id: 'DV1-1-00001',
    resident_name: 'Aditya Sai Krishna',
    branch_code: 1,
    room_number: '102',
    amount: 7000,
    payment_method: 'online_upi',
    payment_date: '2026-11-01',
    transaction_reference: 'UPI/632145698741/HDFC',
    status: 'verified',
    collector_name: 'Razorpay Auto-Settlement',
    invoice_number: 'INV-2026-001',
    created_at: '2026-11-01T10:00:00Z',
  },
  {
    id: 'pay-102',
    receipt_number: 'RCPT-2026-002',
    resident_id: 'res-002',
    devi_resident_id: 'DV2-2-00002',
    resident_name: 'Sumanth Nair',
    branch_code: 2,
    room_number: '201',
    amount: 8500,
    payment_method: 'direct_upi',
    payment_date: '2026-11-15',
    transaction_reference: 'UPI/998844332211/SBI',
    status: 'verified',
    collector_name: 'E. Bharath Chandra (Proprietor)',
    invoice_number: 'INV-2026-002',
    created_at: '2026-11-15T11:00:00Z',
  },
  {
    id: 'pay-103',
    receipt_number: 'RCPT-2026-003',
    resident_id: 'res-003',
    devi_resident_id: 'DV5-1-00003',
    resident_name: 'Pooja Hegde',
    branch_code: 5,
    room_number: '101',
    amount: 9000,
    payment_method: 'online_upi',
    payment_date: '2026-11-10',
    transaction_reference: 'UPI/120934875612/ICICI',
    status: 'verified',
    collector_name: 'Razorpay Auto-Settlement',
    invoice_number: 'INV-2026-003',
    created_at: '2026-11-10T14:00:00Z',
  }
];

let advanceLedgerStore: AdvanceEntry[] = [
  {
    id: 'adv-001',
    resident_id: 'res-001',
    devi_resident_id: 'DV1-1-00001',
    resident_name: 'Aditya Sai Krishna',
    type: 'credit',
    amount: 3000,
    balance_after: 3000,
    description: 'Initial advance rent deposit paid at admission',
    date: '2026-11-01',
  },
  {
    id: 'adv-002',
    resident_id: 'res-001',
    devi_resident_id: 'DV1-1-00001',
    resident_name: 'Aditya Sai Krishna',
    type: 'debit_invoice',
    amount: 1500,
    balance_after: 1500,
    reference_invoice_id: 'inv-104',
    description: 'Partial advance utilized toward Invoice INV-2026-004',
    date: '2026-11-20',
  }
];

let depositLedgerStore: DepositEntry[] = [
  {
    id: 'dep-001',
    resident_id: 'res-001',
    devi_resident_id: 'DV1-1-00001',
    resident_name: 'Aditya Sai Krishna',
    type: 'deposit_received',
    amount: 10000,
    balance_after: 10000,
    remarks: 'Refundable security deposit received at admission. Held in refundable deposit account.',
    date: '2026-11-01',
  },
  {
    id: 'dep-002',
    resident_id: 'res-002',
    devi_resident_id: 'DV2-2-00002',
    resident_name: 'Sumanth Nair',
    type: 'deposit_received',
    amount: 12000,
    balance_after: 12000,
    remarks: 'Refundable security deposit received at admission.',
    date: '2026-11-15',
  },
  {
    id: 'dep-003',
    resident_id: 'res-003',
    devi_resident_id: 'DV5-1-00003',
    resident_name: 'Pooja Hegde',
    type: 'deposit_received',
    amount: 15000,
    balance_after: 15000,
    remarks: 'Refundable security deposit received at admission.',
    date: '2026-11-10',
  }
];

function formatDateParts(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// Helper: Calculate individual joining-date billing period with month-end safety
export function calculateNextBillingPeriod(
  admissionDateStr: string,
  targetMonthOffset: number = 0
): { start: string; end: string; dueDate: string; period_start: string; period_end: string } {
  const parts = admissionDateStr.split('-');
  const origYear = parseInt(parts[0], 10);
  const origMonth = parseInt(parts[1], 10); // 1-12
  const anchorDay = parseInt(parts[2], 10);

  // Month arithmetic
  const totalMonths = (origMonth - 1) + targetMonthOffset;
  const targetYear = origYear + Math.floor(totalMonths / 12);
  const targetMonthIndex = ((totalMonths % 12) + 12) % 12; // 0-11
  const targetMonth = targetMonthIndex + 1; // 1-12

  // Month-end safety for start date
  const maxDaysThisMonth = new Date(targetYear, targetMonth, 0).getDate();
  const validStartDay = Math.min(anchorDay, maxDaysThisMonth);
  const startStr = formatDateParts(targetYear, targetMonth, validStartDay);

  // Next cycle start date
  const nextTotalMonths = totalMonths + 1;
  const nextYear = origYear + Math.floor(nextTotalMonths / 12);
  const nextMonthIndex = ((nextTotalMonths % 12) + 12) % 12;
  const nextMonth = nextMonthIndex + 1;
  const maxDaysNextMonth = new Date(nextYear, nextMonth, 0).getDate();
  const validNextStartDay = Math.min(anchorDay, maxDaysNextMonth);

  // End date is 1 day before the next cycle start
  const nextCycleDate = new Date(nextYear, nextMonthIndex, validNextStartDay);
  nextCycleDate.setDate(nextCycleDate.getDate() - 1);
  const endYear = nextCycleDate.getFullYear();
  const endMonth = nextCycleDate.getMonth() + 1;
  const endDay = nextCycleDate.getDate();
  const endStr = formatDateParts(endYear, endMonth, endDay);

  return {
    start: startStr,
    end: endStr,
    period_start: startStr,
    period_end: endStr,
    dueDate: startStr,
  };
}

// ----------------- Core Financial Functions -----------------

// Generate monthly recurring invoice for a resident
export function generateResidentInvoice(
  residentId: string,
  optionsOrCharges: number | { additional_charges?: number; notes?: string; apply_advance?: boolean } = 0,
  notesArg?: string
): { success: boolean; error?: string; invoice?: FinancialInvoice } {
  const resident = getResidentById(residentId);
  if (!resident) {
    return { success: false, error: 'Resident not found.' };
  }

  const additionalCharges = typeof optionsOrCharges === 'number'
    ? optionsOrCharges
    : optionsOrCharges.additional_charges || 0;
  const notes = typeof optionsOrCharges === 'object' && optionsOrCharges.notes
    ? optionsOrCharges.notes
    : notesArg;

  // Count existing invoices for this resident to determine next period offset
  const residentInvoices = invoicesStore.filter((i) => i.resident_id === resident.id);
  const period = calculateNextBillingPeriod(resident.admission_date, residentInvoices.length);

  // Check if invoice for this period already exists
  const exists = residentInvoices.some((i) => i.billing_period_start === period.start);
  if (exists) {
    return {
      success: false,
      error: `An invoice for period starting ${period.start} already exists for resident ${resident.resident_id}. Duplicate prevented.`,
    };
  }

  const rent = resident.agreed_monthly_rent;
  const total = rent + additionalCharges;

  // Auto-apply advance balance if available
  let advanceAdjusted = 0;
  if (resident.advance_balance > 0) {
    advanceAdjusted = Math.min(resident.advance_balance, total);
    resident.advance_balance -= advanceAdjusted;

    advanceLedgerStore.unshift({
      id: `adv-${Date.now()}`,
      resident_id: resident.id,
      devi_resident_id: resident.resident_id,
      resident_name: resident.full_name,
      type: 'debit_invoice',
      amount: advanceAdjusted,
      balance_after: resident.advance_balance,
      description: `Advance automatically utilized for recurring invoice`,
      date: new Date().toISOString().split('T')[0],
    });
  }

  const balanceDue = total - advanceAdjusted;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoicesStore.length + 1).padStart(3, '0')}`;

  const newInvoice: FinancialInvoice = {
    id: `inv-${Date.now()}`,
    invoice_number: invoiceNumber,
    resident_id: resident.id,
    devi_resident_id: resident.resident_id,
    resident_name: resident.full_name,
    branch_code: resident.current_branch_code,
    room_number: resident.current_room_number,
    billing_period_start: period.start,
    billing_period_end: period.end,
    rent_amount: rent,
    additional_charges: additionalCharges,
    advance_adjusted: advanceAdjusted,
    total_payable: total,
    amount_paid: 0,
    balance_due: balanceDue,
    due_date: period.dueDate,
    status: balanceDue === 0 ? 'paid' : 'unpaid',
    notes,
    created_at: new Date().toISOString(),
  };

  invoicesStore.unshift(newInvoice);
  resident.outstanding_balance += balanceDue;

  return { success: true, invoice: newInvoice };
}

// Process Payment (Online or Offline Cash / Direct UPI)
export interface ProcessPaymentInput {
  resident_id: string;
  amount: number;
  payment_method: 'online_razorpay' | 'online_cashfree' | 'online_upi' | 'direct_upi' | 'cash' | 'bank_transfer';
  transaction_reference?: string;
  collector_name: string;
  collector_id?: string;
  verification_status?: 'verified' | 'pending';
  invoice_id?: string;
  remarks?: string;
}

export function recordPayment(input: ProcessPaymentInput): {
  success: boolean;
  error?: string;
  payment?: FinancialPayment;
} {
  const resident = getResidentById(input.resident_id);
  if (!resident) {
    return { success: false, error: 'Resident not found.' };
  }

  if (input.amount <= 0) {
    return { success: false, error: 'Payment amount must be greater than zero.' };
  }

  const receiptNumber = `RCPT-${new Date().getFullYear()}-${String(paymentsStore.length + 1).padStart(3, '0')}`;
  const paymentDate = new Date().toISOString().split('T')[0];
  const ref = input.transaction_reference || `TXN-${Date.now()}`;

  let remainingPayment = input.amount;

  // Allocate payment to unpaid/partially paid invoices
  const residentInvoices = invoicesStore
    .filter((i) => i.resident_id === resident.id && i.status !== 'paid' && i.status !== 'cancelled')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  if (input.invoice_id) {
    const specificInv = invoicesStore.find((i) => i.id === input.invoice_id);
    if (specificInv && specificInv.balance_due > 0) {
      const settleAmount = Math.min(remainingPayment, specificInv.balance_due);
      specificInv.amount_paid += settleAmount;
      specificInv.balance_due -= settleAmount;
      if (specificInv.balance_due === 0) specificInv.status = 'paid';
      else specificInv.status = 'partially_paid';

      remainingPayment -= settleAmount;
      resident.outstanding_balance = Math.max(0, resident.outstanding_balance - settleAmount);
    }
  } else {
    // Cascade to oldest unpaid invoices
    for (const inv of residentInvoices) {
      if (remainingPayment <= 0) break;
      const settleAmount = Math.min(remainingPayment, inv.balance_due);
      inv.amount_paid += settleAmount;
      inv.balance_due -= settleAmount;
      if (inv.balance_due === 0) inv.status = 'paid';
      else inv.status = 'partially_paid';

      remainingPayment -= settleAmount;
      resident.outstanding_balance = Math.max(0, resident.outstanding_balance - settleAmount);
    }
  }

  // Any excess payment automatically flows to resident's Advance Rent Credit ledger!
  if (remainingPayment > 0) {
    resident.advance_balance += remainingPayment;
    advanceLedgerStore.unshift({
      id: `adv-${Date.now()}`,
      resident_id: resident.id,
      devi_resident_id: resident.resident_id,
      resident_name: resident.full_name,
      type: 'credit',
      amount: remainingPayment,
      balance_after: resident.advance_balance,
      description: `Excess payment credited to advance rent from Receipt ${receiptNumber}`,
      date: paymentDate,
    });
  }

  const newPayment: FinancialPayment = {
    id: `pay-${Date.now()}`,
    receipt_number: receiptNumber,
    resident_id: resident.id,
    devi_resident_id: resident.resident_id,
    resident_name: resident.full_name,
    branch_code: resident.current_branch_code,
    room_number: resident.current_room_number,
    amount: input.amount,
    payment_method: input.payment_method as any,
    payment_date: paymentDate,
    transaction_reference: ref,
    status: input.verification_status || 'verified',
    collector_name: input.collector_name,
    collector_id: input.collector_id,
    remarks: input.remarks,
    invoice_number: residentInvoices[0]?.invoice_number || 'ADVANCE-DIRECT',
    created_at: new Date().toISOString(),
  };

  paymentsStore.unshift(newPayment);

  return { success: true, payment: newPayment };
}

// Payment Reversal / Adjustment (Never delete financial records)
export function reversePayment(
  paymentId: string,
  reversalReason: string,
  actorName: string
): { success: boolean; error?: string; reversalPayment?: FinancialPayment } {
  const originalPayment = paymentsStore.find((p) => p.id === paymentId);
  if (!originalPayment) {
    return { success: false, error: 'Original payment record not found.' };
  }
  if (originalPayment.is_reversed) {
    return { success: false, error: 'This payment has already been reversed.' };
  }

  const resident = getResidentById(originalPayment.resident_id);
  if (!resident) {
    return { success: false, error: 'Resident not found.' };
  }

  originalPayment.is_reversed = true;

  // Re-instate outstanding balance
  resident.outstanding_balance += originalPayment.amount;

  const reversalReceipt = `REV-${new Date().getFullYear()}-${String(paymentsStore.length + 1).padStart(3, '0')}`;
  const reversalPayment: FinancialPayment = {
    id: `rev-${Date.now()}`,
    receipt_number: reversalReceipt,
    resident_id: resident.id,
    devi_resident_id: resident.resident_id,
    resident_name: resident.full_name,
    branch_code: originalPayment.branch_code,
    room_number: originalPayment.room_number,
    amount: -originalPayment.amount,
    payment_method: originalPayment.payment_method,
    payment_date: new Date().toISOString().split('T')[0],
    transaction_reference: `REVERSAL-FOR-${originalPayment.receipt_number}`,
    status: 'verified',
    collector_name: actorName,
    remarks: `Reversal of Receipt ${originalPayment.receipt_number}. Reason: ${reversalReason}`,
    reversal_of_id: originalPayment.id,
    created_at: new Date().toISOString(),
  };

  paymentsStore.unshift(reversalPayment);

  return { success: true, reversalPayment };
}

// Security Deposit Deduction or Refund
export function recordDepositTransaction(
  residentIdOrInput: string | { resident_id: string; type: 'damage_deduction' | 'utility_deduction' | 'refund'; amount: number; remarks: string },
  typeArg?: 'damage_deduction' | 'utility_deduction' | 'refund',
  amountArg?: number,
  remarksArg?: string
): { success: boolean; error?: string; entry?: DepositEntry } {
  const residentId = typeof residentIdOrInput === 'string' ? residentIdOrInput : residentIdOrInput.resident_id;
  const type = typeof residentIdOrInput === 'object' ? residentIdOrInput.type : typeArg!;
  const amount = typeof residentIdOrInput === 'object' ? residentIdOrInput.amount : amountArg!;
  const remarks = typeof residentIdOrInput === 'object' ? residentIdOrInput.remarks : remarksArg || '';

  const resident = getResidentById(residentId);
  if (!resident) {
    return { success: false, error: 'Resident not found.' };
  }

  if (amount <= 0) {
    return { success: false, error: 'Amount must be greater than zero.' };
  }

  if (amount > resident.security_deposit) {
    return {
      success: false,
      error: `Transaction amount (₹${amount}) exceeds available deposit balance (₹${resident.security_deposit}).`,
    };
  }

  resident.security_deposit -= amount;

  const newEntry: DepositEntry = {
    id: `dep-${Date.now()}`,
    resident_id: resident.id,
    devi_resident_id: resident.resident_id,
    resident_name: resident.full_name,
    type,
    amount,
    balance_after: resident.security_deposit,
    remarks,
    date: new Date().toISOString().split('T')[0],
  };

  depositLedgerStore.unshift(newEntry);
  return { success: true, entry: newEntry };
}

// ----------------- Getters & Aggregations -----------------

export function getInvoices(filters?: {
  branchCode?: number;
  residentId?: string;
  status?: string;
}): FinancialInvoice[] {
  let result = invoicesStore;
  if (filters?.branchCode) {
    result = result.filter((i) => i.branch_code === filters.branchCode);
  }
  if (filters?.residentId) {
    result = result.filter(
      (i) => i.resident_id === filters.residentId || i.devi_resident_id === filters.residentId
    );
  }
  if (filters?.status && filters.status !== 'all') {
    result = result.filter((i) => i.status === filters.status);
  }
  return result;
}

export function getPayments(filters?: {
  branchCode?: number;
  residentId?: string;
  method?: string;
  status?: string;
}): FinancialPayment[] {
  let result = paymentsStore;
  if (filters?.branchCode) {
    result = result.filter((p) => p.branch_code === filters.branchCode);
  }
  if (filters?.residentId) {
    result = result.filter(
      (p) => p.resident_id === filters.residentId || p.devi_resident_id === filters.residentId
    );
  }
  if (filters?.method && filters.method !== 'all') {
    result = result.filter((p) => p.payment_method === filters.method);
  }
  if (filters?.status && filters.status !== 'all') {
    result = result.filter((p) => p.status === filters.status);
  }
  return result;
}

export function getAdvanceLedger(residentId?: string): AdvanceEntry[] {
  if (residentId) {
    return advanceLedgerStore.filter(
      (a) => a.resident_id === residentId || a.devi_resident_id === residentId
    );
  }
  return advanceLedgerStore;
}

export function getDepositLedger(residentId?: string): DepositEntry[] {
  if (residentId) {
    return depositLedgerStore.filter(
      (d) => d.resident_id === residentId || d.devi_resident_id === residentId
    );
  }
  return depositLedgerStore;
}

// Financial Analytics Dashboard Metrics
export interface FinancialOverviewSummary {
  total_invoiced: number;
  total_collected: number;
  total_outstanding_dues: number;
  total_advance_held: number;
  total_security_deposits: number;
  collections_by_method: {
    online_upi: number;
    direct_upi: number;
    cash: number;
    bank_transfer: number;
  };
  payment_method_breakdown?: {
    online_upi: number;
    direct_upi: number;
    cash: number;
    bank_transfer: number;
  };
  branch_summaries: {
    branch_code: 1 | 2 | 3 | 4 | 5;
    branch_name: string;
    invoiced: number;
    collected: number;
    outstanding: number;
  }[];
}

export function getFinancialOverview(): FinancialOverviewSummary {
  const activeInvoices = invoicesStore.filter((i) => i.status !== 'cancelled');
  const verifiedPayments = paymentsStore.filter((p) => p.status === 'verified' && !p.is_reversed);

  const totalInvoiced = activeInvoices.reduce((acc, i) => acc + i.total_payable, 0);
  const totalCollected = verifiedPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalOutstanding = activeInvoices.reduce((acc, i) => acc + i.balance_due, 0);

  const residents = getResidents();
  const totalAdvance = residents.reduce((acc, r) => acc + (r.advance_balance || 0), 0);
  const totalDeposits = residents.reduce((acc, r) => acc + (r.security_deposit || 0), 0);

  const methodBreakdown = {
    online_upi: verifiedPayments
      .filter((p) => p.payment_method === 'online_upi' || p.payment_method === 'online_razorpay')
      .reduce((acc, p) => acc + p.amount, 0),
    direct_upi: verifiedPayments
      .filter((p) => p.payment_method === 'direct_upi')
      .reduce((acc, p) => acc + p.amount, 0),
    cash: verifiedPayments
      .filter((p) => p.payment_method === 'cash')
      .reduce((acc, p) => acc + p.amount, 0),
    bank_transfer: verifiedPayments
      .filter((p) => p.payment_method === 'bank_transfer')
      .reduce((acc, p) => acc + p.amount, 0),
  };

  const branchSummaries = DEVI_BRANCHES.map((b) => {
    const bInvoices = activeInvoices.filter((i) => i.branch_code === b.branch_code);
    const bPayments = verifiedPayments.filter((p) => p.branch_code === b.branch_code);

    return {
      branch_code: b.branch_code,
      branch_name: b.name,
      invoiced: bInvoices.reduce((acc, i) => acc + i.total_payable, 0),
      collected: bPayments.reduce((acc, p) => acc + p.amount, 0),
      outstanding: bInvoices.reduce((acc, i) => acc + i.balance_due, 0),
    };
  });

  return {
    total_invoiced: totalInvoiced,
    total_collected: totalCollected,
    total_outstanding_dues: totalOutstanding,
    total_advance_held: totalAdvance,
    total_security_deposits: totalDeposits,
    collections_by_method: methodBreakdown,
    payment_method_breakdown: methodBreakdown,
    branch_summaries: branchSummaries,
  };
}


// ----------------- Expenses Management -----------------
export interface ExpenseEntry {
  id: string;
  expense_voucher_no: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  category: 'maintenance' | 'utilities' | 'food_groceries' | 'diesel_generator' | 'staff_salary' | 'laundry' | 'internet' | 'cleaning';
  amount: number;
  date: string;
  payment_method: 'cash' | 'direct_upi' | 'bank_transfer';
  vendor_name: string;
  recorded_by: string;
  receipt_ref: string;
  notes?: string;
  created_at: string;
}

let expensesStore: ExpenseEntry[] = [
  {
    id: 'exp-001',
    expense_voucher_no: 'EXP-2026-001',
    branch_code: 1,
    category: 'food_groceries',
    amount: 14500,
    date: '2026-11-18',
    payment_method: 'direct_upi',
    vendor_name: 'Shamshabad Wholesale Rice & Provisions',
    recorded_by: 'E. BHARATH CHANDRA',
    receipt_ref: 'UPI/9912048512/PROV',
    notes: 'Weekly fresh vegetables, rice, and cooking ingredients for Devi Mansion mess',
    created_at: '2026-11-18T10:00:00Z',
  },
  {
    id: 'exp-002',
    expense_voucher_no: 'EXP-2026-002',
    branch_code: 1,
    category: 'diesel_generator',
    amount: 4500,
    date: '2026-11-19',
    payment_method: 'cash',
    vendor_name: 'HPCL Fuel Station Shamshabad',
    recorded_by: 'V. Ramesh Babu',
    receipt_ref: 'CASH-FUEL-4500',
    notes: '50 Litres Diesel for 45 kVA generator backup',
    created_at: '2026-11-19T14:30:00Z',
  },
  {
    id: 'exp-003',
    expense_voucher_no: 'EXP-2026-003',
    branch_code: 2,
    category: 'internet',
    amount: 3200,
    date: '2026-11-15',
    payment_method: 'direct_upi',
    vendor_name: 'Airtel Broadband RGIA',
    recorded_by: 'K. Sridhar Rao',
    receipt_ref: 'UPI/7718293041/AIRTEL',
    notes: 'Monthly 300 Mbps commercial fiber internet plan',
    created_at: '2026-11-15T09:00:00Z',
  },
];

export function getExpenses(branchCode?: number): ExpenseEntry[] {
  if (branchCode) {
    return expensesStore.filter((e) => e.branch_code === branchCode);
  }
  return expensesStore;
}

export function recordExpense(data: Omit<ExpenseEntry, 'id' | 'expense_voucher_no' | 'created_at'>): ExpenseEntry {
  const count = expensesStore.length + 1;
  const voucher = `EXP-2026-${String(count).padStart(3, '0')}`;
  const entry: ExpenseEntry = {
    ...data,
    id: `exp-${Date.now()}`,
    expense_voucher_no: voucher,
    created_at: new Date().toISOString(),
  };
  expensesStore.unshift(entry);
  return entry;
}

// ----------------- Cash Reconciliation -----------------
export interface CashReconciliationEntry {
  id: string;
  reconciliation_ref: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  date: string;
  opening_cash: number;
  cash_collected: number;
  cash_expenses: number;
  closing_cash_calculated: number;
  closing_cash_actual: number;
  variance: number;
  verified_by: string;
  status: 'balanced' | 'variance_flagged';
  remarks?: string;
  created_at: string;
}

let cashReconciliationsStore: CashReconciliationEntry[] = [
  {
    id: 'recon-001',
    reconciliation_ref: 'CR-2026-001',
    branch_code: 1,
    date: '2026-11-19',
    opening_cash: 5000,
    cash_collected: 14000,
    cash_expenses: 4500,
    closing_cash_calculated: 14500,
    closing_cash_actual: 14500,
    variance: 0,
    verified_by: 'E. BHARATH CHANDRA',
    status: 'balanced',
    remarks: 'Daily counter cash drawer physical count matches exactly.',
    created_at: '2026-11-19T21:00:00Z',
  },
];

export function getCashReconciliations(branchCode?: number): CashReconciliationEntry[] {
  if (branchCode) {
    return cashReconciliationsStore.filter((c) => c.branch_code === branchCode);
  }
  return cashReconciliationsStore;
}

export function recordCashReconciliation(data: Omit<CashReconciliationEntry, 'id' | 'reconciliation_ref' | 'created_at' | 'variance' | 'closing_cash_calculated' | 'status'>): CashReconciliationEntry {
  const calculated = data.opening_cash + data.cash_collected - data.cash_expenses;
  const variance = data.closing_cash_actual - calculated;
  const count = cashReconciliationsStore.length + 1;
  const entry: CashReconciliationEntry = {
    ...data,
    id: `recon-${Date.now()}`,
    reconciliation_ref: `CR-2026-${String(count).padStart(3, '0')}`,
    closing_cash_calculated: calculated,
    variance: variance,
    status: variance === 0 ? 'balanced' : 'variance_flagged',
    created_at: new Date().toISOString(),
  };
  cashReconciliationsStore.unshift(entry);
  return entry;
}

// ----------------- Unified Transaction Ledger -----------------
export interface UnifiedTransaction {
  id: string;
  reference_no: string;
  resident_id?: string;
  devi_resident_id?: string;
  resident_name?: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  amount: number;
  transaction_type: 'rent_receipt' | 'advance_credit' | 'advance_refund' | 'deposit_received' | 'deposit_deduction' | 'deposit_refund' | 'adjustment_reversal' | 'branch_expense';
  payment_method: string;
  date: string;
  verification_status: 'verified' | 'pending' | 'reversed';
  recording_staff: string;
  category: 'revenue' | 'advance_liability' | 'deposit_liability' | 'refund' | 'expense' | 'reversal';
  notes?: string;
}

export function getAllTransactions(filters?: {
  branch_code?: number;
  transaction_type?: string;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}): UnifiedTransaction[] {
  const transactions: UnifiedTransaction[] = [];

  // 1. Payments Ledger
  paymentsStore.forEach((p) => {
    transactions.push({
      id: p.id,
      reference_no: p.receipt_number,
      resident_id: p.resident_id,
      devi_resident_id: p.devi_resident_id,
      resident_name: p.resident_name,
      branch_code: p.branch_code,
      amount: p.amount,
      transaction_type: p.reversal_of_id ? 'adjustment_reversal' : 'rent_receipt',
      payment_method: p.payment_method,
      date: p.payment_date,
      verification_status: p.is_reversed ? 'reversed' : (p.status as any),
      recording_staff: p.collector_name,
      category: p.reversal_of_id ? 'reversal' : 'revenue',
      notes: p.remarks || `Payment for Invoice ${p.invoice_number || 'rent'}`,
    });
  });

  // 2. Advance Ledger entries
  advanceLedgerStore.forEach((adv) => {
    if (adv.type === 'credit') {
      transactions.push({
        id: adv.id,
        reference_no: `ADV-CR-${adv.id}`,
        resident_id: adv.resident_id,
        devi_resident_id: adv.devi_resident_id,
        resident_name: adv.resident_name,
        branch_code: 1, // mapped to resident's branch
        amount: adv.amount,
        transaction_type: 'advance_credit',
        payment_method: 'direct_upi',
        date: adv.date,
        verification_status: 'verified',
        recording_staff: 'Central Accounts Desk',
        category: 'advance_liability',
        notes: adv.description,
      });
    }
  });

  // 3. Security Deposits entries
  depositLedgerStore.forEach((dep) => {
    transactions.push({
      id: dep.id,
      reference_no: `DEP-${dep.id}`,
      resident_id: dep.resident_id,
      devi_resident_id: dep.devi_resident_id,
      resident_name: dep.resident_name,
      branch_code: 1,
      amount: dep.amount,
      transaction_type: dep.type === 'deposit_received' ? 'deposit_received' : (dep.type === 'damage_deduction' ? 'deposit_deduction' : 'deposit_refund'),
      payment_method: 'direct_upi',
      date: dep.date,
      verification_status: 'verified',
      recording_staff: 'Central Accounts Desk',
      category: dep.type === 'deposit_received' ? 'deposit_liability' : (dep.type === 'refund' ? 'refund' : 'revenue'),
      notes: dep.remarks,
    });
  });

  // 4. Expenses
  expensesStore.forEach((exp) => {
    transactions.push({
      id: exp.id,
      reference_no: exp.expense_voucher_no,
      branch_code: exp.branch_code,
      amount: exp.amount,
      transaction_type: 'branch_expense',
      payment_method: exp.payment_method,
      date: exp.date,
      verification_status: 'verified',
      recording_staff: exp.recorded_by,
      category: 'expense',
      notes: `${exp.vendor_name} — ${exp.notes || exp.category}`,
    });
  });

  // Sort by date descending
  let result = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (filters) {
    if (filters.branch_code) {
      result = result.filter((t) => t.branch_code === filters.branch_code);
    }
    if (filters.transaction_type && filters.transaction_type !== 'all') {
      result = result.filter((t) => t.transaction_type === filters.transaction_type);
    }
    if (filters.payment_method && filters.payment_method !== 'all') {
      result = result.filter((t) => t.payment_method === filters.payment_method);
    }
    if (filters.start_date) {
      result = result.filter((t) => t.date >= filters.start_date!);
    }
    if (filters.end_date) {
      result = result.filter((t) => t.date <= filters.end_date!);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.reference_no.toLowerCase().includes(q) ||
          (t.devi_resident_id && t.devi_resident_id.toLowerCase().includes(q)) ||
          (t.resident_name && t.resident_name.toLowerCase().includes(q)) ||
          (t.notes && t.notes.toLowerCase().includes(q))
      );
    }
  }

  return result;
}

// ----------------- Visitors Record -----------------
export interface VisitorRecord {
  id: string;
  gate_pass_no: string;
  resident_id: string;
  devi_resident_id: string;
  resident_name: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  visitor_name: string;
  visitor_phone: string;
  relation: string;
  visit_date: string;
  in_time: string;
  out_time?: string;
  purpose: string;
  status: 'checked_in' | 'checked_out';
  created_at: string;
}

let visitorsStore: VisitorRecord[] = [
  {
    id: 'vis-001',
    gate_pass_no: 'GP-2026-001',
    resident_id: 'res-001',
    devi_resident_id: 'DV1-1-00001',
    resident_name: 'Aditya Sai Krishna',
    branch_code: 1,
    visitor_name: 'Satyanarayana (Father)',
    visitor_phone: '9849111220',
    relation: 'Father',
    visit_date: '2026-11-19',
    in_time: '14:30',
    out_time: '17:00',
    purpose: 'Family visit & tuition fee deposit',
    status: 'checked_out',
    created_at: '2026-11-19T14:30:00Z',
  },
];

export function getVisitors(branchCode?: number): VisitorRecord[] {
  if (branchCode) {
    return visitorsStore.filter((v) => v.branch_code === branchCode);
  }
  return visitorsStore;
}

export function recordVisitor(data: Omit<VisitorRecord, 'id' | 'gate_pass_no' | 'created_at'>): VisitorRecord {
  const count = visitorsStore.length + 1;
  const entry: VisitorRecord = {
    ...data,
    id: `vis-${Date.now()}`,
    gate_pass_no: `GP-2026-${String(count).padStart(3, '0')}`,
    created_at: new Date().toISOString(),
  };
  visitorsStore.unshift(entry);
  return entry;
}

export function checkoutVisitor(visitorId: string, outTime: string): boolean {
  const v = visitorsStore.find((x) => x.id === visitorId);
  if (!v) return false;
  v.out_time = outTime;
  v.status = 'checked_out';
  return true;
}

// ----------------- Reminders Item -----------------
export interface ReminderItem {
  id: string;
  branch_code: 1 | 2 | 3 | 4 | 5;
  title: string;
  category: 'rent_due' | 'safety_inspection' | 'diesel_refill' | 'water_filter' | 'pest_control' | 'license_renewal';
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed';
  assigned_to: string;
  created_at: string;
}

let remindersStore: ReminderItem[] = [
  {
    id: 'rem-001',
    branch_code: 1,
    title: 'RO Water Filter Membrane Inspection & Filter Replacement',
    category: 'water_filter',
    due_date: '2026-11-25',
    priority: 'high',
    status: 'pending',
    assigned_to: 'V. Ramesh Babu',
    created_at: '2026-11-15T08:00:00Z',
  },
  {
    id: 'rem-002',
    branch_code: 2,
    title: 'Diesel Generator Fuel Level Top-up & Oil Check',
    category: 'diesel_refill',
    due_date: '2026-11-23',
    priority: 'medium',
    status: 'pending',
    assigned_to: 'M. Anand Kumar',
    created_at: '2026-11-18T09:00:00Z',
  },
  {
    id: 'rem-003',
    branch_code: 5,
    title: 'CCTV Camera #8 Check & Door Sensor Diagnostics',
    category: 'safety_inspection',
    due_date: '2026-11-22',
    priority: 'urgent',
    status: 'pending',
    assigned_to: 'P. Sunitha Reddy',
    created_at: '2026-11-20T10:00:00Z',
  },
];

export function getReminders(branchCode?: number): ReminderItem[] {
  if (branchCode) {
    return remindersStore.filter((r) => r.branch_code === branchCode);
  }
  return remindersStore;
}

export function createReminder(data: Omit<ReminderItem, 'id' | 'created_at'>): ReminderItem {
  const item: ReminderItem = {
    ...data,
    id: `rem-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  remindersStore.unshift(item);
  return item;
}

export function toggleReminder(id: string): boolean {
  const item = remindersStore.find((r) => r.id === id);
  if (!item) return false;
  item.status = item.status === 'pending' ? 'completed' : 'pending';
  return true;
}

// ----------------- Audit Logs -----------------
export interface AuditLogItem {
  id: string;
  timestamp: string;
  staff_name: string;
  staff_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address?: string;
}

let auditLogsStore: AuditLogItem[] = [
  {
    id: 'aud-001',
    timestamp: '2026-11-20T18:15:00Z',
    staff_name: 'E. BHARATH CHANDRA',
    staff_role: 'owner',
    action: 'REVERSE_PAYMENT',
    entity_type: 'PAYMENT',
    entity_id: 'pay-101',
    details: 'Executed non-destructive ledger reversal for payment entry pay-101 with verified reversal trace.',
    ip_address: '106.51.24.12',
  },
  {
    id: 'aud-002',
    timestamp: '2026-11-20T14:30:00Z',
    staff_name: 'K. Sridhar Rao',
    staff_role: 'accountant',
    action: 'RECORD_OFFLINE_PAYMENT',
    entity_type: 'PAYMENT',
    entity_id: 'pay-102',
    details: 'Recorded ₹8,500 direct UPI collection for resident Sumanth Nair (DV2-2-00002).',
    ip_address: '106.51.24.15',
  },
  {
    id: 'aud-003',
    timestamp: '2026-11-19T11:00:00Z',
    staff_name: 'V. Ramesh Babu',
    staff_role: 'branch_manager',
    action: 'NEW_ADMISSION',
    entity_type: 'RESIDENT',
    entity_id: 'res-001',
    details: 'Confirmed admission for student Aditya Sai Krishna with ID DV1-1-00001 in Room 102 Bed A.',
    ip_address: '106.51.24.18',
  },
];

export function getAuditLogs(): AuditLogItem[] {
  return auditLogsStore;
}

export function logAuditEvent(data: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem {
  const log: AuditLogItem = {
    ...data,
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  auditLogsStore.unshift(log);
  return log;
}
