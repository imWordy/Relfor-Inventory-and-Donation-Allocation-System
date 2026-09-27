# System Workflow

## Complete Lifecycle
Donation → Inventory → Requirement Request → Allocation → Distribution → History

### 1. Donation Workflow
- Donor brings resources.
- Staff records donor info, resource type, quantity, condition, and dates.
- Inventory is incremented.

### 2. Inventory Workflow
- Acts as the central source of truth for available resources.
- Supports search, filter, and stock status tracking (Available, Low Stock, Out of Stock, Expired).
- Cannot fall below zero.

### 3. Request Workflow
- NGO logs in and submits a requirement request for specific resources and quantities.
- Request is marked as PENDING.

### 4. Allocation Workflow
- Staff reviews PENDING requests.
- Staff attempts to allocate from Inventory.
- If Inventory >= Requested: Full Allocation.
- If Inventory < Requested: Partial Allocation (inventory exhausted, request remains partially fulfilled).
- Inventory is decremented transactionally.

### 5. Distribution Workflow
- Physical handover of resources occurs.
- Staff records the distribution against the allocation record.
- Finalizes the request status as COMPLETED.

## Status Transitions
- **Requests**: PENDING → PARTIALLY_ALLOCATED → ALLOCATED → COMPLETED (or REJECTED/CANCELLED)
- **Allocations**: DRAFT → APPROVED → PARTIALLY_FULFILLED → FULFILLED → CANCELLED

## Error Scenarios
- **Insufficient Inventory**: System prevents allocation beyond available stock.
- **Unauthorized Access**: NGOs attempting to modify inventory are rejected.
