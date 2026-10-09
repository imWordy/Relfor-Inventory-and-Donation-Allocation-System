# Relfor Inventory & Donation Allocation System
# End-User Operational Guide

**Author:** Aditya Singh (Frontend & Operations Lead)  
**Target Audience:** Foundation Staff, Operations Officers, and Partner NGO Coordinators  
**System Version:** v1.0.0 (Production Release)

---

## 1. Introduction & Core Concept

The **Relfor Inventory & Donation Allocation System** is an end-to-end humanitarian logistics platform designed to:
- Track incoming physical donations with complete auditability.
- Manage real-time warehouse inventory across consumable, medical, ration, and equipment categories.
- Process formal requirement requests submitted by verified partner NGOs.
- Run deterministic, fair-share allocation algorithms matching verified stock against active community needs.
- Log physical handovers and distributions with signature verifications and receiver receipts.
- Export transaction logs and compliance audit reports in standard CSV format.

---

## 2. Access Roles & Persona Overview

The system enforces strict role-based access control (RBAC):

| Role | Target User | Key Capabilities |
|:---|:---|:---|
| **ADMIN** | Executive Director / System Admin | Full access across all modules, configuration, audits, user permissions. |
| **STAFF** | Warehouse & Operations Staff | Inventory updates, donation logging, allocation execution, physical distribution sign-off. |
| **NGO** | Verified Partner Organization Lead | Submit requirement requests, view request status, track allocated and dispatched items. |

---

## 3. Step-by-Step User Workflows

### 3.1 Authentication & Login
1. Navigate to the application URL in any modern web browser.
2. If unauthenticated, the **Authentication Portal** appears.
3. Enter your registered email address and password.
4. Quick Persona Selection: For demonstration or testing, click any persona button (**Admin**, **Warehouse Staff**, or **Partner NGO**) to instantly auto-fill credentials.
5. Click **Sign In to Portal**. Your role-gated navigation bar will dynamically adjust to your permissions.

---

### 3.2 Operational Dashboard
1. The **Dashboard** is the operational home page.
2. View real-time KPI counters:
   - **Total Active Inventory**: Total unit count across all warehouse shelves.
   - **Open Requirement Requests**: Active requests awaiting allocation.
   - **Allocations Pending Dispatch**: Items packaged and scheduled for pickup.
   - **Completed Handouts**: Cumulative quantity successfully distributed.
3. **Low-Stock Alert Banners**: Highlight items below reserve thresholds (e.g., Rice, Paracetamol, PPE Kits).
4. **Recent Activity Feed**: Provides an immediate chronological stream of recent donations, allocations, and deliveries.

---

### 3.3 Inventory Management
1. Select **Inventory** from the navigation menu (Staff/Admin).
2. Use the **Search bar** to find items by SKU, name, or location.
3. Filter items by **Category** (Food, Medical, Shelter, Education, Sanitation) or **Stock Status** (`AVAILABLE`, `LOW_STOCK`, `OUT_OF_STOCK`).
4. Click on any row to view stock breakdown, reserved quantities, and warehouse shelf coordinates.

---

### 3.4 Recording Incoming Donations
1. Navigate to **Donations**.
2. Click **Record New Donation**.
3. Complete the donation receipt form:
   - **Donor Name / Organization**: Select an existing registered donor or create a new entry.
   - **Resource Item**: Choose the item being donated.
   - **Quantity**: Enter positive integer quantity.
   - **Condition**: Select `NEW`, `EXCELLENT`, or `GOOD`.
   - **Date Received**: Defaults to current timestamp.
   - **Expiry Date**: Required for perishable rations or medical supplies.
4. Click **Submit Donation**.
5. The transaction immediately updates warehouse inventory levels and creates an immutable receipt entry in the Donation Ledger.

---

### 3.5 Partner NGO Directory
1. Navigate to **Organizations**.
2. View verified partner NGOs, contact persons, regional operating zones, and verification statuses.
3. Staff/Admin can register new partner NGOs by providing organization legal name, registration number, contact phone, and operating address.

---

### 3.6 Submitting Requirement Requests (NGO Workflow)
1. Log in with **NGO** credentials or switch to the NGO persona.
2. Navigate to **Requests** and click **Create Requirement Request**.
3. Select priority level:
   - `NORMAL`: Standard periodic replenishment.
   - `HIGH`: Imminent regional shortage.
   - `CRITICAL`: Urgent disaster relief or emergency response.
4. Add line items by selecting required resources and quantities.
5. Provide delivery location details and justification notes.
6. Click **Submit Request**. The request enters `SUBMITTED` status and becomes visible to foundation allocation staff.

---

### 3.7 Transactional Resource Allocation
1. Log in as **STAFF** or **ADMIN** and navigate to **Allocations**.
2. Review pending requests organized by priority (`CRITICAL` first).
3. Select an active request to inspect the required vs. available inventory comparison table.
4. The system executes the authoritative deterministic allocation:
   $$\text{Allocated Quantity} = \min(\text{Requested Quantity}, \text{Available Stock})$$
5. If stock is insufficient, the allocation is cleanly flagged as **Partial Allocation**, updating remaining backlog.
6. Click **Execute & Confirm Allocation**.
7. Inventory is automatically reserved, and the request advances to `ALLOCATED` status.

---

### 3.8 Physical Distribution & Handover
1. Navigate to **Distributions**.
2. View allocations awaiting warehouse dispatch or pickup.
3. When the NGO representative arrives:
   - Verify the allocation release code.
   - Enter the **Receiver Name** and identification credential.
   - Confirm handover date and physical goods verification.
4. Click **Confirm Distribution & Complete Handover**.
5. The system marks the allocation as `DISTRIBUTED`, closes the transaction, and issues a final dispatch certificate.

---

### 3.9 Reports & Compliance CSV Export
1. Navigate to **Reports**.
2. Select report type:
   - **Inventory Balance Report**: Stock on hand, reserve levels, valuation.
   - **Donation Audit Ledger**: Cumulative incoming donations by donor and date.
   - **Allocation Summary**: Breakdown of allocated items per NGO and priority.
   - **Distribution Delivery History**: Signed dispatch records.
3. Apply date range filters or category filters.
4. Click **Export CSV** to download standard RFC-4180 CSV files suitable for external audits, grant filings, or management reporting.

---

## 4. Frequently Asked Questions & Troubleshooting

**Q: Can an NGO modify an allocation directly?**  
A: No. Role-based restrictions ensure only authorized foundation Staff and Admins can execute allocation and distribution transactions.

**Q: How are partial allocations handled when stock runs out?**  
A: The system allocates what is currently available, marks the line item as `PARTIALLY_FULFILLED`, and retains the unfulfilled remainder in pending status for future donation cycles.

**Q: What should I do if a network error occurs while submitting a form?**  
A: The application includes client-side transaction caches. Refresh the view or re-submit; duplicate protection guarantees idempotent transaction records.
