/**
 * Automated UI & Business Invariant Test Suite
 * Step 28 / Phase 26: Frontend QA & Logic Validation
 * Owner: Aditya Singh
 */

import {
  SYSTEM_USERS,
  INITIAL_RESOURCES,
  INITIAL_DONATIONS,
  INITIAL_ORGANIZATIONS,
  INITIAL_REQUESTS,
  INITIAL_DISTRIBUTIONS
} from '../data/mockData.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('==================================================');
console.log('  Relfor UI & Invariant Test Suite (Aditya QA)');
console.log('==================================================\n');

// 1. Role-Based Persona Integrity
console.log('[1] Testing Persona & Role Definitions:');
assert(SYSTEM_USERS.length >= 3, 'Sample users count is at least 3');
assert(SYSTEM_USERS.some(u => u.role === 'ADMIN'), 'Admin role persona is present');
assert(SYSTEM_USERS.some(u => u.role === 'STAFF'), 'Staff role persona is present');
assert(SYSTEM_USERS.some(u => u.role === 'NGO'), 'NGO role persona is present');

// 2. Inventory Invariants
console.log('\n[2] Testing Inventory Data Integrity:');
assert(INITIAL_RESOURCES.length > 0, 'Inventory items exist');
const negativeStock = INITIAL_RESOURCES.filter(item => item.currentStock < 0);
assert(negativeStock.length === 0, 'No inventory items have negative stock');

// 3. Allocation Engine Invariant Simulation
console.log('\n[3] Testing Transactional Allocation Rule min(requested, available):');
const testCases = [
  { requested: 100, available: 70, expectedAllocated: 70, expectedRemaining: 30 },
  { requested: 50, available: 100, expectedAllocated: 50, expectedRemaining: 0 },
  { requested: 80, available: 0, expectedAllocated: 0, expectedRemaining: 80 },
];

testCases.forEach((tc, idx) => {
  const allocated = Math.min(tc.requested, tc.available);
  const remaining = tc.requested - allocated;
  assert(
    allocated === tc.expectedAllocated && remaining === tc.expectedRemaining,
    `Case ${idx + 1}: Req=${tc.requested}, Avail=${tc.available} -> Alloc=${allocated}, Rem=${remaining}`
  );
});

// 4. Distribution Flow Verification
console.log('\n[4] Testing Distribution State Validation:');
assert(INITIAL_DISTRIBUTIONS.length > 0, 'Distributions exist');
assert(
  INITIAL_DISTRIBUTIONS.every(d => d.quantity > 0),
  'All distributions have positive distributed quantities'
);

// 5. Donation Ledger Verification
console.log('\n[5] Testing Donation Ledger:');
assert(INITIAL_DONATIONS.length > 0, 'Donations exist');
assert(
  INITIAL_DONATIONS.every(d => d.quantity > 0 && d.donorName),
  'All donations possess valid donor and quantity'
);

// 6. Organization Directory Verification
console.log('\n[6] Testing Organization Directory:');
assert(INITIAL_ORGANIZATIONS.length > 0, 'Organizations exist');
assert(
  INITIAL_ORGANIZATIONS.every(o => o.name && o.type),
  'All organizations have valid name and type'
);

console.log('\n==================================================');
console.log(`  Tests Passed: ${passed} | Tests Failed: ${failed}`);
console.log('==================================================');

if (failed > 0) {
  process.exit(1);
}
