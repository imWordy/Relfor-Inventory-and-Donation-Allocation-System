# Relfor Inventory & Donation Allocation System
# Presentation & Live Demonstration Walkthrough Guide

**Author:** Aditya Singh (Frontend & Presentation Lead)  
**Session Scope:** Evaluation Presentation, Live System Walkthrough, & Viva Defense  
**Estimated Demo Duration:** 10–12 Minutes

---

## 1. Executive Summary & Problem Context (2 Minutes)

- **The Challenge**: Humanitarian relief foundations handle high-volume, irregular donations during disasters. Traditional manual spreadsheets cause stock discrepancies, unfair allocation, delays in delivery, and loss of audit traceability.
- **The Solution**: Relfor is a responsive, multi-persona web application backed by an automated transactional allocation engine. It connects donors, warehouse operations, and beneficiary NGOs in a unified, deterministic pipeline.

---

## 2. Live Demonstration Script (8 Minutes)

### Step 1: Multi-Role Persona Switcher & Authentication (1 Min)
- **Action**: Open application home screen.
- **Narrative**: *"Notice our streamlined RBAC authentication interface. Rather than typing test credentials each time, our developer workbench lets evaluators inspect three distinct user personas: System Admin, Operations Staff, and Partner NGO."*
- **Verification**: Switch between `Admin`, `Staff`, and `NGO` to demonstrate how the navigation bar dynamically adjusts access permissions.

### Step 2: Dashboard Overview & Real-Time KPI Meters (1 Min)
- **Action**: Log in as `Staff` and view the operational dashboard.
- **Narrative**: *"The dashboard aggregates four real-time operational metrics: total warehouse stock units, open NGO requests, pending allocations, and fulfilled distributions. Low-stock warning badges instantly highlight critical supplies like pediatric medicine and rice sacks."*

### Step 3: Recording an Incoming Donation (1.5 Mins)
- **Action**: Navigate to `Donations` -> click `Record New Donation`.
- **Narrative**: *"Let's record 100 units of Paracetamol donated by Apex Healthcare Corp."*
- **Verification**:
  - Show initial stock: 250 units.
  - Submit donation of 100 units.
  - Navigate to `Inventory` -> observe stock immediately incremented to 350 units.
  - Highlight the immutable entry generated in the Donation Ledger.

### Step 4: NGO Submitting a Critical Requirement Request (1.5 Mins)
- **Action**: Switch persona to `Partner NGO (Hope Relief Network)` -> navigate to `Requests`.
- **Narrative**: *"Our verified partner NGO submits an urgent disaster relief request for 150 units of Paracetamol with `CRITICAL` priority."*
- **Verification**:
  - Submit multi-item request.
  - Observe request entering `PENDING_REVIEW` status.
  - Emphasize that NGO cannot self-allocate stock; authority remains with foundation staff.

### Step 5: Transactional Allocation & Partial Fulfillment (1.5 Mins)
- **Action**: Switch back to `Staff` -> navigate to `Allocations`.
- **Narrative**: *"The staff allocation portal highlights pending requests ordered by priority. When staff initiates allocation, our engine evaluates available stock against requested amount using the rule $\min(\text{requested}, \text{available})$. In cases of stock shortage, it performs clean partial allocation without risking negative stock levels."*
- **Verification**:
  - Confirm allocation of 150 units.
  - Verify inventory updates to $350 - 150 = 200$ units remaining.
  - Request state transitions to `ALLOCATED`.

### Step 6: Warehouse Dispatch & Distribution Receipt (1 Min)
- **Action**: Navigate to `Distributions` -> click `Confirm Handover`.
- **Narrative**: *"When NGO transport arrives, warehouse staff verifies the handover code, logs the receiver identification, and confirms delivery."*
- **Verification**: Status transitions to `DISTRIBUTED` and dispatch certification is logged.

### Step 7: Reports & CSV Export Audit Trail (0.5 Min)
- **Action**: Navigate to `Reports` -> Select `Allocation Audit Report` -> click `Export CSV`.
- **Narrative**: *"All transactions can be downloaded as RFC-compliant CSV files for statutory donor reporting and compliance audits."*

---

## 3. Architecture & Technical Talking Points

- **Frontend Architecture**: React 18 with modern component-driven modularity, responsive CSS tokens, zero external UI framework bloat, sub-second route transitions, and responsive mobile breakpoints.
- **State Engine**: High-fidelity transactional state machine supporting both local mock prototyping and live REST API communication with FastAPI backend.
- **Robustness**: Form input validation, resilient loading states, defensive fallback UI, and zero negative-inventory invariants.
