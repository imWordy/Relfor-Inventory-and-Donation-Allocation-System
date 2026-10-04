export const SYSTEM_USERS = [
  {
    id: 'USR-ADMIN-01',
    name: 'Aditya Singh',
    email: 'aditya@relfor.org',
    role: 'ADMIN',
    title: 'System Owner & UI Architect',
    avatar: 'AS',
    color: '#ef4444',
    organizationId: null,
    organizationName: null,
    permissions: ['ALL_ACCESS', 'USER_MGMT', 'SYSTEM_CONFIG', 'AUDIT_LOGS']
  },
  {
    id: 'USR-STAFF-01',
    name: 'Ansh Sharma',
    email: 'ansh@relfor.org',
    role: 'STAFF',
    title: 'Allocation Engine & Operations Lead',
    avatar: 'AN',
    color: '#10b981',
    organizationId: null,
    organizationName: null,
    permissions: ['INVENTORY_WRITE', 'DONATION_WRITE', 'ALLOCATION_EXECUTE', 'DISTRIBUTION_WRITE']
  },
  {
    id: 'USR-STAFF-02',
    name: 'Aayush Kumar',
    email: 'aayush@relfor.org',
    role: 'STAFF',
    title: 'Database & Inventory Manager',
    avatar: 'AY',
    color: '#06b6d4',
    organizationId: null,
    organizationName: null,
    permissions: ['INVENTORY_WRITE', 'DONATION_WRITE', 'REPORTS_EXPORT']
  },
  {
    id: 'USR-NGO-01',
    name: 'Priya Sharma',
    email: 'priya@hopeshelter.org',
    role: 'NGO',
    title: 'Director — Hope Children Shelter',
    avatar: 'PS',
    color: '#8b5cf6',
    organizationId: 'ORG-01',
    organizationName: 'Hope Children Shelter',
    permissions: ['REQUEST_CREATE', 'MY_REQUESTS_READ', 'MY_DISTRIBUTIONS_READ']
  },
  {
    id: 'USR-NGO-02',
    name: 'Rahul Verma',
    email: 'rahul@dra-india.org',
    role: 'NGO',
    title: 'Field Lead — Disaster Relief Alliance',
    avatar: 'RV',
    color: '#ec4899',
    organizationId: 'ORG-02',
    organizationName: 'Disaster Relief Alliance',
    permissions: ['REQUEST_CREATE', 'MY_REQUESTS_READ', 'MY_DISTRIBUTIONS_READ']
  }
];

export const INITIAL_TEAM_MEMBERS = [
  {
    name: 'Aditya Singh',
    role: 'Frontend, UI/UX, Dashboard, Integration Owner',
    hours: 68,
    isCurrentUser: true,
    steps: [
      { id: 1, name: 'Step 1 — Team Ideation', phase: 'Phase 0', hours: 2, status: 'COMPLETED' },
      { id: 15, name: 'Step 15 — React Application Foundation', phase: 'Phase 13', hours: 3, status: 'COMPLETED' },
      { id: 16, name: 'Step 16 — Login + Role-Based Navigation', phase: 'Phase 14', hours: 3, status: 'COMPLETED' },
      { id: 17, name: 'Step 17 — Inventory Page UI', phase: 'Phase 15', hours: 5, status: 'COMPLETED' },
      { id: 18, name: 'Step 18 — Donation Page UI', phase: 'Phase 16', hours: 4, status: 'COMPLETED' },
      { id: 19, name: 'Step 19 — Organization Page UI', phase: 'Phase 17', hours: 3, status: 'COMPLETED' },
      { id: 20, name: 'Step 20 — Requirement Request Interface', phase: 'Phase 18', hours: 5, status: 'COMPLETED' },
      { id: 21, name: 'Step 21 — Allocation Interface', phase: 'Phase 19', hours: 4, status: 'COMPLETED' },
      { id: 22, name: 'Step 22 — Distribution Interface', phase: 'Phase 20', hours: 4, status: 'COMPLETED' },
      { id: 23, name: 'Step 23 — Operational Dashboard', phase: 'Phase 21', hours: 5, status: 'COMPLETED' },
      { id: 25, name: 'Step 25 — Reports UI', phase: 'Phase 23', hours: 3, status: 'COMPLETED' },
      { id: 27, name: 'Step 28 — UI Testing & Frontend QA', phase: 'Phase 26', hours: 3, status: 'COMPLETED' },
      { id: 32, name: 'Step 32 — User Guide Documentation', phase: 'Phase 29', hours: 2, status: 'COMPLETED' },
      { id: 33, name: 'Step 33 — Final System Test', phase: 'Phase 30', hours: 2, status: 'COMPLETED' },
      { id: 34, name: 'Step 34 — Repository Cleanup', phase: 'Phase 31', hours: 1, status: 'COMPLETED' }
    ]
  },
  {
    name: 'Ansh',
    role: 'Architecture, Allocation Engine, Integration, Deployment',
    hours: 62,
    isCurrentUser: false,
    steps: [
      { id: 2, name: 'Step 2 — Workflow & Architecture Design', phase: 'Phase 1', hours: 4, status: 'COMPLETED' },
      { id: 5, name: 'Step 5 — FastAPI Backend Setup', phase: 'Phase 4', hours: 3, status: 'COMPLETED' },
      { id: 8, name: 'Step 8 — Inventory Service', phase: 'Phase 6', hours: 4, status: 'COMPLETED' },
      { id: 12, name: 'Step 12 — Allocation Engine Logic', phase: 'Phase 10', hours: 7, status: 'COMPLETED' },
      { id: 13, name: 'Step 13 — Allocation API Contract', phase: 'Phase 11', hours: 3, status: 'COMPLETED' },
      { id: 14, name: 'Step 14 — Distribution Backend Module', phase: 'Phase 12', hours: 3, status: 'COMPLETED' },
      { id: 26, name: 'Step 27 — Business Logic Stress Testing', phase: 'Phase 25', hours: 5, status: 'COMPLETED' },
      { id: 30, name: 'Step 30 — Cloud Deployment', phase: 'Phase 28', hours: 3, status: 'COMPLETED' }
    ]
  },
  {
    name: 'Aayush',
    role: 'Database, Backend Modules, Auth & Security, Reports',
    hours: 66,
    isCurrentUser: false,
    steps: [
      { id: 3, name: 'Step 3 — Database Schema (PostgreSQL)', phase: 'Phase 2', hours: 4, status: 'COMPLETED' },
      { id: 4, name: 'Step 4 — Database Environment & Seed Data', phase: 'Phase 3', hours: 3, status: 'COMPLETED' },
      { id: 6, name: 'Step 6 — Authentication & Role Auth', phase: 'Phase 5', hours: 4, status: 'COMPLETED' },
      { id: 7, name: 'Step 7 — Resource Management API', phase: 'Phase 6', hours: 4, status: 'COMPLETED' },
      { id: 9, name: 'Step 9 — Donation Module API', phase: 'Phase 7', hours: 5, status: 'COMPLETED' },
      { id: 10, name: 'Step 10 — Organization CRUD API', phase: 'Phase 8', hours: 3, status: 'COMPLETED' },
      { id: 11, name: 'Step 11 — Requirement Request Module', phase: 'Phase 9', hours: 4, status: 'COMPLETED' },
      { id: 24, name: 'Step 24 — Reporting Backend & CSV API', phase: 'Phase 22', hours: 5, status: 'COMPLETED' }
    ]
  }
];

export const INITIAL_RESOURCES = [
  { id: 'RES-101', name: 'Emergency Food Kits (Dry Rations)', category: 'Food & Groceries', unit: 'kits', currentStock: 450, minStock: 100, status: 'AVAILABLE', updated: '2026-09-28' },
  { id: 'RES-102', name: 'Thermal Blankets', category: 'Shelter & Bedding', unit: 'pieces', currentStock: 80, minStock: 150, status: 'LOW_STOCK', updated: '2026-09-28' },
  { id: 'RES-103', name: 'First Aid Hygiene Kits', category: 'Medical & Hygiene', unit: 'kits', currentStock: 25, minStock: 50, status: 'LOW_STOCK', updated: '2026-09-28' },
  { id: 'RES-104', name: 'Drinking Water Containers (20L)', category: 'Water & Sanitation', unit: 'canisters', currentStock: 320, minStock: 80, status: 'AVAILABLE', updated: '2026-09-28' },
  { id: 'RES-105', name: 'Solar Emergency Lanterns', category: 'Equipment & Supplies', unit: 'units', currentStock: 120, minStock: 40, status: 'AVAILABLE', updated: '2026-09-27' },
  { id: 'RES-106', name: 'Infant Nutrition Formula', category: 'Food & Groceries', unit: 'cans', currentStock: 0, minStock: 30, status: 'OUT_OF_STOCK', updated: '2026-09-28' }
];

export const INITIAL_DONATIONS = [
  { id: 'DON-501', donorName: 'Global Relief Trust', resourceId: 'RES-101', resourceName: 'Emergency Food Kits (Dry Rations)', quantity: 200, condition: 'NEW / SEALED', date: '2026-09-28', expiryDate: '2027-09-28', notes: 'Pallet load A-4' },
  { id: 'DON-502', donorName: 'Apex Corporate CSR', resourceId: 'RES-104', resourceName: 'Drinking Water Containers (20L)', quantity: 150, condition: 'NEW', date: '2026-09-27', expiryDate: 'N/A', notes: 'Direct factory delivery' },
  { id: 'DON-503', donorName: 'Care Life Foundation', resourceId: 'RES-102', resourceName: 'Thermal Blankets', quantity: 80, condition: 'LIKE NEW', date: '2026-09-26', expiryDate: 'N/A', notes: 'Winter aid drive batch 1' }
];

export const INITIAL_ORGANIZATIONS = [
  { id: 'ORG-01', name: 'Hope Children Shelter', type: 'NGO', contactPerson: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya@hopeshelter.org', city: 'Mumbai', activeRequests: 2, verified: true },
  { id: 'ORG-02', name: 'Disaster Relief Alliance', type: 'FIELD_PARTNER', contactPerson: 'Rahul Verma', phone: '+91 98123 45678', email: 'rahul@dra-india.org', city: 'Pune', activeRequests: 1, verified: true },
  { id: 'ORG-03', name: 'Seva Welfare Trust', type: 'COMMUNITY_CENTER', contactPerson: 'Amit Patel', phone: '+91 99000 11223', email: 'info@sevawelfare.org', city: 'Nagpur', activeRequests: 0, verified: true }
];

export const INITIAL_REQUESTS = [
  { 
    id: 'REQ-901', 
    orgId: 'ORG-01', 
    orgName: 'Hope Children Shelter', 
    priority: 'HIGH', 
    status: 'PARTIALLY_ALLOCATED', 
    createdDate: '2026-09-27',
    notes: 'Urgent need for seasonal shelter support',
    items: [
      { resourceId: 'RES-101', resourceName: 'Emergency Food Kits (Dry Rations)', requestedQty: 100, allocatedQty: 100 },
      { resourceId: 'RES-102', resourceName: 'Thermal Blankets', requestedQty: 120, allocatedQty: 40 }
    ]
  },
  { 
    id: 'REQ-902', 
    orgId: 'ORG-02', 
    orgName: 'Disaster Relief Alliance', 
    priority: 'CRITICAL', 
    status: 'PENDING', 
    createdDate: '2026-09-28',
    notes: 'Flood relief deployment in Western zone',
    items: [
      { resourceId: 'RES-104', resourceName: 'Drinking Water Containers (20L)', requestedQty: 80, allocatedQty: 0 },
      { resourceId: 'RES-103', resourceName: 'First Aid Hygiene Kits', requestedQty: 50, allocatedQty: 0 }
    ]
  }
];

export const INITIAL_DISTRIBUTIONS = [
  { id: 'DIST-301', allocationId: 'ALLOC-801', reqId: 'REQ-901', orgName: 'Hope Children Shelter', resourceName: 'Emergency Food Kits (Dry Rations)', quantity: 100, distDate: '2026-09-28', receivedBy: 'Priya Sharma (Director)', status: 'COMPLETED', notes: 'Handed over at Central Warehouse' }
];
