# Testing & Quality Assurance Documentation

This document describes the automated test architecture, testing tiers, test coverage, and execution instructions for the **Relfor Inventory & Donation Allocation System**.

---

## 1. Testing Strategy & Tiers

The system implements automated testing across multiple tiers to verify end-to-end correctness, data integrity, and strict business logic invariants:

```text
┌────────────────────────────────────────────────────────┐
│               End-to-End User Flow Tests               │
│   (docs/final-test-report.md, src/tests/ui-test.js)    │
├────────────────────────────────────────────────────────┤
│          Business Logic Stress & Invariant Tests       │
│           (backend/tests/test_stress_business_logic.py)│
├────────────────────────────────────────────────────────┤
│             Module API & Service Integration Tests     │
│   (backend/tests/test_allocations_distributions.py,    │
│    test_inventory.py, test_requests.py, etc.)          │
├────────────────────────────────────────────────────────┤
│            Core Unit & Authentication Tests            │
│       (backend/tests/test_auth.py, test_health.py)     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Backend Automated Test Suites (`backend/tests/`)

All backend tests run via `pytest` utilizing an in-memory SQLite database (`sqlite:///:memory:`) configured with isolated table creation, rollbacks, and pre-seeded role credentials in `conftest.py`.

### Test Files Breakdown:
1. **`test_health.py`:**
   * Verifies API server liveness and service metadata.
2. **`test_auth.py`:**
   * User login with valid credentials (JWT token issuance).
   * Password verification with bcrypt hashing.
   * Invalid password / non-existent user 401 handling.
   * Protected route authorization (Admin, Staff, NGO token headers).
   * Scoped profile retrieval (`GET /auth/me`).
3. **`test_resources.py`:**
   * Catalog CRUD operations and category validation (`FOOD`, `MEDICAL`, `SHELTER`, etc.).
   * Check constraint validation: non-negative minimum stock (`minimum_stock >= 0`).
   * Duplicate resource name rejection (`400 Bad Request`).
4. **`test_inventory.py`:**
   * Stock status computation (`AVAILABLE`, `LOW_STOCK`, `OUT_OF_STOCK`).
   * Non-negative inventory exposure guarantee (`available_quantity >= 0`).
   * Category and text search query filtering.
5. **`test_requests.py`:**
   * NGO requirement request submission with multiple items and priority levels.
   * Organization scoping: NGOs can only access their own requests.
6. **`test_allocations_distributions.py`:**
   * End-to-end primary flow: Donation intake -> stock increase -> request -> partial allocation -> stock decrement -> distribution receipt -> full allocation -> completion.
   * Insufficient stock failure handling.
   * Allocation cancellation with automatic inventory refund.
7. **`test_stress_business_logic.py` (Step 27):**
   * **Zero stock allocation rejection:** Guarantees 0 stock cannot be reserved.
   * **Competing requests contention:** Concurrent/competing requests cannot drive stock below 0.
   * **Invalid quantities:** Rejects over-allocations, zero, and negative quantities.
   * **Duplicate items:** Rejects payloads with duplicate `request_item_id`.
   * **Role security:** Rejects NGO role attempts to allocate or distribute (403 Forbidden).
   * **Atomic multi-item rollback:** Rolls back first item's stock deduction if a subsequent item in the batch fails.
   * **Cancellation idempotency:** Blocks double-cancellation or cancelling already distributed goods.

---

## 3. How to Run Backend Tests

From the project root directory:

```bash
# Activate Python virtual environment
cd backend
source venv/bin/activate       # On Linux/macOS
# or: .\venv\Scripts\activate   # On Windows

# Run all test suites
pytest

# Run with verbose output
pytest -v

# Run only stress tests
pytest tests/test_stress_business_logic.py -v
```

### Current Test Suite Result:
* **Total Tests:** 41 passed
* **Failures:** 0
* **Execution Time:** ~27 seconds

---

## 4. Frontend & UI Automated Verification (`src/tests/`)

Aditya implemented automated UI verification scripts in `src/tests/ui-test.js` covering:
* Navigation between views (Dashboard, Inventory, Donations, Requests, Allocations, Distributions, Reports).
* Role-based UI visibility (NGO restricted from Staff actions).
* Responsive layout rendering and empty states.
* Modal dialogues and receipt generators.

To execute frontend UI tests:
```bash
npm run test  # Or execute node src/tests/ui-test.js
```

---

## 5. End-to-End Final Acceptance Verification

The complete end-to-end scenario from login to CSV export was executed and documented in:
* [`docs/final-test-report.md`](final-test-report.md)
* [`docs/presentation-demo-guide.md`](presentation-demo-guide.md)
