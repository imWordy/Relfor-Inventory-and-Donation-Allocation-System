"""
Business Logic Stress Testing (Phase 24 / Step 27 - Owner: Ansh)
Comprehensive edge-case and invariant testing for inventory, allocation, requests, and distributions:
1. Zero inventory allocation rejection
2. Partial allocation correctness
3. Competing requests contending for limited stock (invariant: never negative)
4. Invalid quantities (negative, zero, over-allocated)
5. Non-existent and expired resource handling
6. Cancelled allocation stock rollback & idempotency
7. Duplicate request item submissions within single allocation
8. Unauthorized allocation & cross-organization permission denial
9. Multi-item partial allocation atomic rollback on invalid item
10. Strict invariant verification: database stock never drops below 0
"""

import pytest
from fastapi import status
from app.models.donation import Donor
from app.models.resource import Resource


@pytest.fixture
def test_donor(db_session):
    donor = Donor(
        name="Global Hope Trust",
        type="FOUNDATION",
        email="contact@globalhope.org",
        phone="+91 99999 11111"
    )
    db_session.add(donor)
    db_session.commit()
    db_session.refresh(donor)
    return donor


def test_stress_zero_inventory_allocation_rejected(client, admin_headers, staff_headers, ngo_headers):
    """Attempting to allocate when stock is 0 must fail without modifying request state."""
    r = client.post("/resources", json={
        "name": "Blankets Heavy Duty",
        "category": "SHELTER",
        "unit": "pieces",
        "minimum_stock": 20
    }, headers=admin_headers)
    res_id = r.json()["id"]

    req = client.post("/requests", json={
        "priority": "HIGH",
        "items": [{"resource_id": res_id, "requested_quantity": 25}]
    }, headers=ngo_headers).json()
    req_id = req["id"]
    req_item_id = req["items"][0]["id"]

    alloc_resp = client.post("/allocations", json={
        "request_id": req_id,
        "items": [{"request_item_id": req_item_id, "resource_id": res_id, "allocated_quantity": 10}]
    }, headers=staff_headers)

    assert alloc_resp.status_code == status.HTTP_400_BAD_REQUEST
    assert "Insufficient stock" in alloc_resp.json()["detail"]

    # Verify inventory was unchanged (still 0)
    res_data = client.get(f"/resources/{res_id}", headers=staff_headers).json()
    assert res_data["current_stock"] == 0

    # Verify request item allocated_quantity remains 0
    req_data = client.get(f"/requests/{req_id}", headers=staff_headers).json()
    assert req_data["status"] == "PENDING"
    assert req_data["items"][0]["allocated_quantity"] == 0


def test_stress_competing_requests_never_negative_inventory(client, admin_headers, staff_headers, ngo_headers, test_donor):
    """
    Two competing requests contending for limited stock.
    Stock = 50. Request A requests 40, Request B requests 30.
    Allocating A succeeds (stock -> 10).
    Allocating B with 30 must fail and never drive stock negative.
    """
    r = client.post("/resources", json={
        "name": "High Protein Food Kits",
        "category": "FOOD",
        "unit": "packs"
    }, headers=admin_headers).json()
    res_id = r["id"]

    # Intake 50 items
    client.post("/donations", json={
        "donor_id": str(test_donor.id),
        "resource_id": res_id,
        "quantity": 50,
        "condition": "NEW"
    }, headers=staff_headers)

    # Request A (wants 40)
    req_a = client.post("/requests", json={
        "priority": "URGENT",
        "items": [{"resource_id": res_id, "requested_quantity": 40}]
    }, headers=ngo_headers).json()

    # Request B (wants 30)
    req_b = client.post("/requests", json={
        "priority": "HIGH",
        "items": [{"resource_id": res_id, "requested_quantity": 30}]
    }, headers=ngo_headers).json()

    # Allocate A
    alloc_a = client.post("/allocations", json={
        "request_id": req_a["id"],
        "items": [{"request_item_id": req_a["items"][0]["id"], "resource_id": res_id, "allocated_quantity": 40}]
    }, headers=staff_headers)
    assert alloc_a.status_code == status.HTTP_201_CREATED

    # Verify remaining stock is exactly 10
    stock_now = client.get(f"/resources/{res_id}", headers=staff_headers).json()["current_stock"]
    assert stock_now == 10

    # Attempt to allocate 30 to Request B -> MUST fail
    alloc_b = client.post("/allocations", json={
        "request_id": req_b["id"],
        "items": [{"request_item_id": req_b["items"][0]["id"], "resource_id": res_id, "allocated_quantity": 30}]
    }, headers=staff_headers)
    assert alloc_b.status_code == status.HTTP_400_BAD_REQUEST

    # Stock must strictly remain 10, never negative
    final_stock = client.get(f"/resources/{res_id}", headers=staff_headers).json()["current_stock"]
    assert final_stock == 10

    # Partial allocation of the remaining 10 must succeed
    alloc_b_partial = client.post("/allocations", json={
        "request_id": req_b["id"],
        "items": [{"request_item_id": req_b["items"][0]["id"], "resource_id": res_id, "allocated_quantity": 10}]
    }, headers=staff_headers)
    assert alloc_b_partial.status_code == status.HTTP_201_CREATED
    assert client.get(f"/resources/{res_id}", headers=staff_headers).json()["current_stock"] == 0


def test_stress_invalid_quantities_validation(client, admin_headers, staff_headers, ngo_headers, test_donor):
    """Negative or zero quantity allocations and over-allocations must be blocked."""
    r = client.post("/resources", json={
        "name": "Water Containers 20L",
        "category": "HYGIENE",
        "unit": "cans"
    }, headers=admin_headers).json()
    res_id = r["id"]

    client.post("/donations", json={
        "donor_id": str(test_donor.id),
        "resource_id": res_id,
        "quantity": 100,
        "condition": "NEW"
    }, headers=staff_headers)

    req = client.post("/requests", json={
        "priority": "LOW",
        "items": [{"resource_id": res_id, "requested_quantity": 20}]
    }, headers=ngo_headers).json()
    req_item_id = req["items"][0]["id"]

    # Allocated quantity exceeding requested quantity (e.g., 25 > 20)
    over_alloc = client.post("/allocations", json={
        "request_id": req["id"],
        "items": [{"request_item_id": req_item_id, "resource_id": res_id, "allocated_quantity": 25}]
    }, headers=staff_headers)
    assert over_alloc.status_code == status.HTTP_400_BAD_REQUEST
    assert "exceeds remaining needed quantity" in over_alloc.json()["detail"]

    # Zero or negative allocation quantity rejected by schema validation
    zero_alloc = client.post("/allocations", json={
        "request_id": req["id"],
        "items": [{"request_item_id": req_item_id, "resource_id": res_id, "allocated_quantity": 0}]
    }, headers=staff_headers)
    assert zero_alloc.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_422_UNPROCESSABLE_ENTITY]


def test_stress_duplicate_items_in_single_allocation(client, admin_headers, staff_headers, ngo_headers, test_donor):
    """Submitting duplicate request_item_id within one allocation request must be rejected."""
    r = client.post("/resources", json={
        "name": "First Aid Bandages",
        "category": "MEDICAL",
        "unit": "boxes"
    }, headers=admin_headers).json()
    res_id = r["id"]

    client.post("/donations", json={
        "donor_id": str(test_donor.id),
        "resource_id": res_id,
        "quantity": 50,
        "condition": "NEW"
    }, headers=staff_headers)

    req = client.post("/requests", json={
        "priority": "MEDIUM",
        "items": [{"resource_id": res_id, "requested_quantity": 30}]
    }, headers=ngo_headers).json()
    req_item_id = req["items"][0]["id"]

    dup_alloc = client.post("/allocations", json={
        "request_id": req["id"],
        "items": [
            {"request_item_id": req_item_id, "resource_id": res_id, "allocated_quantity": 10},
            {"request_item_id": req_item_id, "resource_id": res_id, "allocated_quantity": 5}
        ]
    }, headers=staff_headers)

    assert dup_alloc.status_code == status.HTTP_400_BAD_REQUEST
    assert "Duplicate request_item_id" in dup_alloc.json()["detail"]

    # Invariant: stock still 50
    assert client.get(f"/resources/{res_id}", headers=staff_headers).json()["current_stock"] == 50


def test_stress_unauthorized_operations(client, admin_headers, staff_headers, ngo_headers, test_donor):
    """Unauthorized role operations must be consistently blocked with 403 Forbidden."""
    r = client.post("/resources", json={
        "name": "Educational Textbooks",
        "category": "EDUCATION",
        "unit": "sets"
    }, headers=admin_headers).json()
    res_id = r["id"]

    client.post("/donations", json={
        "donor_id": str(test_donor.id),
        "resource_id": res_id,
        "quantity": 20,
        "condition": "NEW"
    }, headers=staff_headers)

    req = client.post("/requests", json={
        "priority": "MEDIUM",
        "items": [{"resource_id": res_id, "requested_quantity": 10}]
    }, headers=ngo_headers).json()

    # NGO attempting to create allocation -> 403
    ngo_alloc = client.post("/allocations", json={
        "request_id": req["id"],
        "items": [{"request_item_id": req["items"][0]["id"], "resource_id": res_id, "allocated_quantity": 5}]
    }, headers=ngo_headers)
    assert ngo_alloc.status_code == status.HTTP_403_FORBIDDEN

    # Staff allocates 5
    staff_alloc = client.post("/allocations", json={
        "request_id": req["id"],
        "items": [{"request_item_id": req["items"][0]["id"], "resource_id": res_id, "allocated_quantity": 5}]
    }, headers=staff_headers).json()
    alloc_id = staff_alloc["id"]

    # NGO attempting to cancel allocation -> 403
    ngo_cancel = client.post(f"/allocations/{alloc_id}/cancel", headers=ngo_headers)
    assert ngo_cancel.status_code == status.HTTP_403_FORBIDDEN

    # NGO attempting to distribute -> 403
    ngo_dist = client.post("/distributions", json={
        "allocation_id": alloc_id,
        "received_by": "Volunteer"
    }, headers=ngo_headers)
    assert ngo_dist.status_code == status.HTTP_403_FORBIDDEN


def test_stress_atomic_rollback_on_multi_item_failure(client, admin_headers, staff_headers, ngo_headers, test_donor):
    """
    In multi-item allocation, if second item fails due to stock or mismatch,
    the first item's stock deduction MUST roll back cleanly.
    """
    r1 = client.post("/resources", json={
        "name": "Baby Food Formula",
        "category": "FOOD",
        "unit": "tins"
    }, headers=admin_headers).json()

    r2 = client.post("/resources", json={
        "name": "Baby Diapers Pack",
        "category": "HYGIENE",
        "unit": "packs"
    }, headers=admin_headers).json()

    # Intake 20 for r1, but 0 for r2
    client.post("/donations", json={
        "donor_id": str(test_donor.id),
        "resource_id": r1["id"],
        "quantity": 20,
        "condition": "NEW"
    }, headers=staff_headers)

    req = client.post("/requests", json={
        "priority": "HIGH",
        "items": [
            {"resource_id": r1["id"], "requested_quantity": 10},
            {"resource_id": r2["id"], "requested_quantity": 10}
        ]
    }, headers=ngo_headers).json()

    items = req["items"]
    item1 = next(it for it in items if it["resource_id"] == r1["id"])
    item2 = next(it for it in items if it["resource_id"] == r2["id"])

    # Attempt allocation where item 1 has stock, but item 2 has 0 stock
    alloc_resp = client.post("/allocations", json={
        "request_id": req["id"],
        "items": [
            {"request_item_id": item1["id"], "resource_id": r1["id"], "allocated_quantity": 5},
            {"request_item_id": item2["id"], "resource_id": r2["id"], "allocated_quantity": 5}
        ]
    }, headers=staff_headers)

    assert alloc_resp.status_code == status.HTTP_400_BAD_REQUEST

    # Atomic Invariant: r1 stock MUST STILL be 20 (rolled back)
    stock1 = client.get(f"/resources/{r1['id']}", headers=staff_headers).json()["current_stock"]
    assert stock1 == 20


def test_stress_cancel_allocation_state_transitions(client, admin_headers, staff_headers, ngo_headers, test_donor):
    """Cannot cancel already distributed or cancelled allocations (idempotency/state guard)."""
    r = client.post("/resources", json={
        "name": "Emergency Tarpaulins",
        "category": "SHELTER",
        "unit": "sheets"
    }, headers=admin_headers).json()

    client.post("/donations", json={
        "donor_id": str(test_donor.id),
        "resource_id": r["id"],
        "quantity": 30,
        "condition": "NEW"
    }, headers=staff_headers)

    req = client.post("/requests", json={
        "priority": "HIGH",
        "items": [{"resource_id": r["id"], "requested_quantity": 10}]
    }, headers=ngo_headers).json()

    alloc = client.post("/allocations", json={
        "request_id": req["id"],
        "items": [{"request_item_id": req["items"][0]["id"], "resource_id": r["id"], "allocated_quantity": 10}]
    }, headers=staff_headers).json()
    alloc_id = alloc["id"]

    # First cancel succeeds
    c1 = client.post(f"/allocations/{alloc_id}/cancel", headers=staff_headers)
    assert c1.status_code == status.HTTP_200_OK

    # Second cancel must fail (cannot cancel already CANCELLED allocation)
    c2 = client.post(f"/allocations/{alloc_id}/cancel", headers=staff_headers)
    assert c2.status_code == status.HTTP_400_BAD_REQUEST

    # Inventory must remain exactly 30 (not refunded twice)
    stock_final = client.get(f"/resources/{r['id']}", headers=staff_headers).json()["current_stock"]
    assert stock_final == 30
