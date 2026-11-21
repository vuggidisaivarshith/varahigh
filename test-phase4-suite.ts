// test-phase4-suite.ts
import {
  sendNotification,
  getNotifications,
  renderNotificationContent,
  NotificationTemplate
} from './src/lib/data/notifications-repo';
import {
  getStaffMembers,
  createStaffMember,
  updateStaffStatus
} from './src/lib/data/staff-repo';
import { getResidents } from './src/lib/data/residents-repo';

console.log('========================================================');
console.log('🧪 DEVI HOSTELS — PHASE 4 AUTOMATION & NOTIFICATIONS SUITE');
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

async function runTests() {
  // TEST 1: Template Rendering Engine
  console.log('--- TEST GROUP 1: Notification Template Formatter ---');
  const welcomeMsg = renderNotificationContent('admission_welcome', {
    resident_name: 'K. Ananya Reddy',
    devi_resident_id: 'VG1-1-00001',
    branch_name: 'Varahi Girls Hostel — Branch 1',
    room_number: '102',
    bed_number: 'A'
  });
  assert(welcomeMsg.title.includes('Welcome'), 'Welcome template generates correct title');
  assert(welcomeMsg.body.includes('VG1-1-00001'), 'Welcome template embeds permanent Resident ID');
  assert(welcomeMsg.body.includes('E. Bharath Chandra'), 'Welcome template includes Proprietor E. Bharath Chandra');

  const overdueMsg = renderNotificationContent('overdue_escalation', {
    resident_name: 'K. Ananya Reddy',
    devi_resident_id: 'VG1-1-00001',
    amount: 7000,
    days_overdue: 7
  });
  assert(overdueMsg.body.includes('7 Days Past Due') || overdueMsg.title.includes('7 Days Past Due'), 'Overdue template includes overdue day counter');

  // TEST 2: Multi-Channel Dispatch (WhatsApp, Email, SMS)
  console.log('\n--- TEST GROUP 2: Multi-Channel Dispatch Engine ---');
  const resident = getResidents()[0];
  const dispatchResult = await sendNotification({
    resident_id: resident.id,
    template: 'invoice_generated',
    channels: ['whatsapp', 'email', 'sms'],
    custom_data: {
      invoice_number: 'INV-2026-TEST',
      amount: 7000,
      due_date: '2026-12-15'
    }
  });

  assert(dispatchResult.success, 'Dispatched multi-channel notifications successfully');
  assert(dispatchResult.records.length === 3, 'Created records for all 3 requested channels (WhatsApp, Email, SMS)');
  assert(dispatchResult.records.every(r => r.status === 'delivered'), 'Delivery simulation logs status as delivered');

  // Check notifications query
  const residentNotifs = getNotifications({ residentId: resident.resident_id });
  assert(residentNotifs.length >= 3, 'Retrieved resident notification log');

  // TEST 3: Staff Management & RBAC Matrix
  console.log('\n--- TEST GROUP 3: Staff Management & RBAC Permissions ---');
  const initialStaff = getStaffMembers();
  assert(initialStaff.length >= 3, 'Initial staff store seeded with core staff members');

  const owner = initialStaff.find(s => s.role === 'owner');
  assert(owner?.full_name === 'E. Bharath Chandra', 'Owner identified as E. Bharath Chandra');
  assert(Boolean(owner?.assigned_branch_codes.includes(1)), 'Owner holds authorization across Branch 1');

  // Create a new branch manager
  const createStaffRes = createStaffMember({
    full_name: 'Chandra Shekar',
    email: 'chandra.staff@varahigirlshostel.com',
    phone: '+91 94940 99999',
    role: 'branch_manager',
    assigned_branch_codes: [1]
  });
  assert(createStaffRes.success, 'Created new Branch Manager staff member');
  assert(createStaffRes.staff?.role === 'branch_manager', 'Role set to branch_manager');
  assert(Boolean(createStaffRes.staff?.assigned_branch_codes.includes(1)), 'Assigned to Branch 1');

  // Status toggle
  const toggleRes = updateStaffStatus(createStaffRes.staff!.id, 'inactive');
  assert(toggleRes.success, 'Successfully deactivated staff member');
  const updatedStaff = getStaffMembers({ status: 'inactive' });
  assert(updatedStaff.some(s => s.id === createStaffRes.staff!.id), 'Staff status updated to inactive');

  // TEST 4: Full System Health Check
  console.log('\n--- TEST GROUP 4: System Metrics & Health Check ---');
  const allResidents = getResidents();
  const activeCount = allResidents.filter(r => r.status === 'active').length;
  assert(activeCount > 0, 'Active resident count is verified and healthy');

  console.log('\n========================================================');
  console.log(`🎯 TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('========================================================\n');
}

runTests().catch(console.error);
