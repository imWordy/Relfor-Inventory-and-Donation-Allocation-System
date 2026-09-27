from fastapi import status
import uuid

def test_full_allocation_and_distribution_flow(client, admin_headers, staff_headers, ngo_headers, db_session):
    # 1. Create a donor directly in DB for intake
    from app.models.donation import Donor
    donor = Donor(
        name="Global Relief Foundation",
        type="FOUNDATION",
        email="info@globalrelief.org",
        phone="+91 88888 22222",
        address="Sector 5, Relief Road"
    )
    db_session.add(donor)
    db_session.commit()

    # 2. Create resource catalog item
    r_resp = client.post("/resources", json={
        "name": "Emergency Medical Kit",
        "category": "MEDICAL",
        "unit": "boxes",
        "minimum_stock": 10
    }, headers=admin_headers)
    assert r_resp.status_code == status.HTTP_201_CREATED
    resource_id = r_resp.json()["id"]

    # 3. Add inventory stock via donation intake
    don_resp = client.post("/donations", json={
        "donor_id": str(donor.id),
        "resource_id": resource_id,
        "quantity": 100,
        "condition": "NEW",
        "notes": "Direct shipment from donor"
    }, headers=staff_headers)
    assert don_resp.status_code == status.HTTP_201_CREATED

    # Verify resource stock increased to 100
    res_check = client.get(f"/resources/{resource_id}", headers=staff_headers)
    assert res_check.json()["current_stock"] == 100

    # 4. NGO submits a request for 60 kits
    req_resp = client.post("/requests", json={
        "priority": "HIGH",
        "notes": "Need for community health clinic",
        "items": [{"resource_id": resource_id, "requested_quantity": 60}]
    }, headers=ngo_headers)
    assert req_resp.status_code == status.HTTP_201_CREATED
    req_data = req_resp.json()
    req_id = req_data["id"]
    req_item_id = req_data["items"][0]["id"]

    # 5. NGO tries to allocate resources directly -> 403 Forbidden
    alloc_payload = {
        "request_id": req_id,
        "notes": "Partial allocation batch 1",
        "items": [
            {
                "request_item_id": req_item_id,
                "resource_id": resource_id,
                "allocated_quantity": 40
            }
        ]
    }
    ngo_alloc_resp = client.post("/allocations", json=alloc_payload, headers=ngo_headers)
    assert ngo_alloc_resp.status_code == status.HTTP_403_FORBIDDEN

    # 6. Staff allocates 40 kits (Partial Allocation)
    staff_alloc_resp = client.post("/allocations", json=alloc_payload, headers=staff_headers)
    assert staff_alloc_resp.status_code == status.HTTP_201_CREATED
    alloc1_data = staff_alloc_resp.json()
    alloc1_id = alloc1_data["id"]
    assert alloc1_data["status"] == "PENDING_DISTRIBUTION"

    # Verify inventory was decremented from 100 to 60
    res_after_alloc = client.get(f"/resources/{resource_id}", headers=staff_headers)
    assert res_after_alloc.json()["current_stock"] == 60

    # Verify request status changed to PARTIALLY_ALLOCATED
    req_check1 = client.get(f"/requests/{req_id}", headers=staff_headers)
    assert req_check1.json()["status"] == "PARTIALLY_ALLOCATED"
    assert req_check1.json()["items"][0]["allocated_quantity"] == 40

    # 7. Staff distributes batch 1 (handover receipt)
    dist1_payload = {
        "allocation_id": alloc1_id,
        "received_by": "Volunteer Arjun",
        "receiver_contact": "+91 91234 56789",
        "notes": "Received in good condition"
    }
    dist_resp1 = client.post("/distributions", json=dist1_payload, headers=staff_headers)
    assert dist_resp1.status_code == status.HTTP_201_CREATED
    assert dist_resp1.json()["received_by"] == "Volunteer Arjun"

    # Verify allocation status is now DISTRIBUTED
    alloc_check1 = client.get(f"/allocations/{alloc1_id}", headers=staff_headers)
    assert alloc_check1.json()["status"] == "DISTRIBUTED"

    # 8. Staff allocates remaining 20 kits (Full Allocation)
    alloc2_payload = {
        "request_id": req_id,
        "notes": "Batch 2 final fulfillment",
        "items": [
            {
                "request_item_id": req_item_id,
                "resource_id": resource_id,
                "allocated_quantity": 20
            }
        ]
    }
    staff_alloc_resp2 = client.post("/allocations", json=alloc2_payload, headers=staff_headers)
    assert staff_alloc_resp2.status_code == status.HTTP_201_CREATED
    alloc2_id = staff_alloc_resp2.json()["id"]

    # Verify inventory decremented from 60 to 40
    res_after_alloc2 = client.get(f"/resources/{resource_id}", headers=staff_headers)
    assert res_after_alloc2.json()["current_stock"] == 40

    # Request is now ALLOCATED
    req_check2 = client.get(f"/requests/{req_id}", headers=staff_headers)
    assert req_check2.json()["status"] == "ALLOCATED"
    assert req_check2.json()["items"][0]["allocated_quantity"] == 60

    # 9. Distribute batch 2
    dist2_payload = {
        "allocation_id": alloc2_id,
        "received_by": "Dr. Sarah Rao",
        "receiver_contact": "+91 99887 76655",
        "notes": "Final batch delivered"
    }
    dist_resp2 = client.post("/distributions", json=dist2_payload, headers=staff_headers)
    assert dist_resp2.status_code == status.HTTP_201_CREATED

    # Verify request status transitioned to COMPLETED
    req_final = client.get(f"/requests/{req_id}", headers=staff_headers)
    assert req_final.json()["status"] == "COMPLETED"

def test_allocation_insufficient_stock_fails(client, admin_headers, staff_headers, ngo_headers):
    # Resource with 0 stock
    r_resp = client.post("/resources", json={
        "name": "Water Purification Tabs",
        "category": "HYGIENE",
        "unit": "strips",
        "minimum_stock": 50
    }, headers=admin_headers)
    res_id = r_resp.json()["id"]

    # Request
    req_resp = client.post("/requests", json={
        "priority": "MEDIUM",
        "items": [{"resource_id": res_id, "requested_quantity": 100}]
    }, headers=ngo_headers)
    req_id = req_resp.json()["id"]
    req_item_id = req_resp.json()["items"][0]["id"]

    # Attempt allocation when stock is 0
    alloc_resp = client.post("/allocations", json={
        "request_id": req_id,
        "items": [{"request_item_id": req_item_id, "resource_id": res_id, "allocated_quantity": 20}]
    }, headers=staff_headers)
    assert alloc_resp.status_code == status.HTTP_400_BAD_REQUEST
    assert "Insufficient stock" in alloc_resp.json()["detail"]

def test_cancel_allocation_reverts_stock_and_status(client, admin_headers, staff_headers, ngo_headers, db_session):
    from app.models.donation import Donor
    donor = Donor(name="CSR Corp", type="CORPORATE")
    db_session.add(donor)
    db_session.commit()

    r_resp = client.post("/resources", json={
        "name": "Emergency Tents",
        "category": "SHELTER",
        "unit": "units"
    }, headers=admin_headers)
    res_id = r_resp.json()["id"]

    client.post("/donations", json={
        "donor_id": str(donor.id),
        "resource_id": res_id,
        "quantity": 10,
        "condition": "NEW"
    }, headers=staff_headers)

    req_resp = client.post("/requests", json={
        "priority": "HIGH",
        "items": [{"resource_id": res_id, "requested_quantity": 5}]
    }, headers=ngo_headers)
    req_id = req_resp.json()["id"]
    req_item_id = req_resp.json()["items"][0]["id"]

    # Allocate
    alloc_resp = client.post("/allocations", json={
        "request_id": req_id,
        "items": [{"request_item_id": req_item_id, "resource_id": res_id, "allocated_quantity": 5}]
    }, headers=staff_headers)
    alloc_id = alloc_resp.json()["id"]

    # Stock is now 5
    assert client.get(f"/resources/{res_id}", headers=staff_headers).json()["current_stock"] == 5

    # Cancel allocation
    cancel_resp = client.post(f"/allocations/{alloc_id}/cancel", headers=staff_headers)
    assert cancel_resp.status_code == status.HTTP_200_OK
    assert cancel_resp.json()["status"] == "CANCELLED"

    # Stock returned to 10
    assert client.get(f"/resources/{res_id}", headers=staff_headers).json()["current_stock"] == 10

    # Request reverted to PENDING
    req_reverted = client.get(f"/requests/{req_id}", headers=staff_headers)
    assert req_reverted.json()["status"] == "PENDING"
    assert req_reverted.json()["items"][0]["allocated_quantity"] == 0
