from fastapi import status

def test_inventory_report_and_csv_export(client, admin_headers, staff_headers, ngo_headers):
    # Create test resources
    client.post("/resources", json={
        "name": "Soyabean Oil 1L",
        "category": "FOOD",
        "unit": "liters",
        "minimum_stock": 50
    }, headers=admin_headers)

    # NGO cannot access reports
    resp_ngo = client.get("/reports/inventory", headers=ngo_headers)
    assert resp_ngo.status_code == status.HTTP_403_FORBIDDEN

    # Staff gets JSON report
    resp_json = client.get("/reports/inventory", headers=staff_headers)
    assert resp_json.status_code == status.HTTP_200_OK
    data = resp_json.json()
    assert "total_resources" in data
    assert "total_units_in_stock" in data
    assert len(data["items"]) >= 1

    # Staff gets CSV export
    resp_csv = client.get("/reports/inventory/export", headers=staff_headers)
    assert resp_csv.status_code == status.HTTP_200_OK
    assert resp_csv.headers["content-type"] == "text/csv; charset=utf-8"
    csv_text = resp_csv.text
    assert "Resource Name" in csv_text
    assert "Soyabean Oil 1L" in csv_text

def test_donation_report_and_csv_export(client, admin_headers, staff_headers, db_session):
    from app.models.donation import Donor
    donor = Donor(name="Philanthropy Trust", type="FOUNDATION")
    db_session.add(donor)
    db_session.commit()

    r_resp = client.post("/resources", json={
        "name": "Winter Jackets",
        "category": "CLOTHING",
        "unit": "pieces",
        "minimum_stock": 10
    }, headers=admin_headers)
    res_id = r_resp.json()["id"]

    client.post("/donations", json={
        "donor_id": str(donor.id),
        "resource_id": res_id,
        "quantity": 30,
        "condition": "NEW"
    }, headers=staff_headers)

    # JSON report
    resp = client.get("/reports/donations", headers=admin_headers)
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["total_quantity_donated"] >= 30

    # CSV export
    csv_resp = client.get("/reports/donations/export", headers=admin_headers)
    assert csv_resp.status_code == status.HTTP_200_OK
    assert "Winter Jackets" in csv_resp.text
    assert "Philanthropy Trust" in csv_resp.text

def test_allocation_and_distribution_reports(client, admin_headers, staff_headers, ngo_headers, db_session):
    from app.models.donation import Donor
    donor = Donor(name="City Rotary", type="COMMUNITY_GROUP")
    db_session.add(donor)
    db_session.commit()

    r_resp = client.post("/resources", json={
        "name": "Glucose Packets",
        "category": "FOOD",
        "unit": "boxes"
    }, headers=admin_headers)
    res_id = r_resp.json()["id"]

    client.post("/donations", json={
        "donor_id": str(donor.id),
        "resource_id": res_id,
        "quantity": 100,
        "condition": "NEW"
    }, headers=staff_headers)

    req_resp = client.post("/requests", json={
        "priority": "HIGH",
        "items": [{"resource_id": res_id, "requested_quantity": 40}]
    }, headers=ngo_headers)
    req_id = req_resp.json()["id"]
    req_item_id = req_resp.json()["items"][0]["id"]

    alloc_resp = client.post("/allocations", json={
        "request_id": req_id,
        "items": [{"request_item_id": req_item_id, "resource_id": res_id, "allocated_quantity": 40}]
    }, headers=staff_headers)
    alloc_id = alloc_resp.json()["id"]

    # Allocation report
    alloc_rep_resp = client.get("/reports/allocations", headers=staff_headers)
    assert alloc_rep_resp.status_code == status.HTTP_200_OK
    assert any(item["allocation_id"] == alloc_id for item in alloc_rep_resp.json()["items"])

    alloc_csv_resp = client.get("/reports/allocations/export", headers=staff_headers)
    assert alloc_csv_resp.status_code == status.HTTP_200_OK
    assert "Glucose Packets" in alloc_csv_resp.text

    # Record distribution
    client.post("/distributions", json={
        "allocation_id": alloc_id,
        "received_by": "Deepak Patel"
    }, headers=staff_headers)

    # Distribution report
    dist_rep_resp = client.get("/reports/distributions", headers=staff_headers)
    assert dist_rep_resp.status_code == status.HTTP_200_OK
    assert any(item["received_by"] == "Deepak Patel" for item in dist_rep_resp.json()["items"])

    dist_csv_resp = client.get("/reports/distributions/export", headers=staff_headers)
    assert dist_csv_resp.status_code == status.HTTP_200_OK
    assert "Deepak Patel" in dist_csv_resp.text
