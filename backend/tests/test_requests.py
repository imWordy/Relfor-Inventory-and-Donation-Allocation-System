from fastapi import status
import uuid

def test_create_request_as_ngo(client, ngo_headers, admin_headers):
    # Create resource first
    r_resp = client.post("/resources", json={
        "name": "Basmati Rice 25kg",
        "category": "FOOD",
        "unit": "bags",
        "minimum_stock": 10
    }, headers=admin_headers)
    assert r_resp.status_code == status.HTTP_201_CREATED
    res_id = r_resp.json()["id"]

    # NGO creates request
    payload = {
        "priority": "HIGH",
        "notes": "Flood relief demand",
        "items": [
            {"resource_id": res_id, "requested_quantity": 50}
        ]
    }
    req_resp = client.post("/requests", json=payload, headers=ngo_headers)
    assert req_resp.status_code == status.HTTP_201_CREATED
    req_data = req_resp.json()
    assert req_data["priority"] == "HIGH"
    assert req_data["status"] == "PENDING"
    assert len(req_data["items"]) == 1
    assert req_data["items"][0]["requested_quantity"] == 50
    assert req_data["items"][0]["allocated_quantity"] == 0

def test_create_request_duplicate_resource_fails(client, ngo_headers, admin_headers):
    r_resp = client.post("/resources", json={
        "name": "Salt Packets 1kg",
        "category": "FOOD",
        "unit": "packets",
        "minimum_stock": 5
    }, headers=admin_headers)
    res_id = r_resp.json()["id"]

    payload = {
        "priority": "MEDIUM",
        "items": [
            {"resource_id": res_id, "requested_quantity": 10},
            {"resource_id": res_id, "requested_quantity": 20}
        ]
    }
    resp = client.post("/requests", json=payload, headers=ngo_headers)
    assert resp.status_code == status.HTTP_400_BAD_REQUEST
    assert "Duplicate resource" in resp.json()["detail"]

def test_list_and_get_requests(client, ngo_headers, admin_headers):
    r_resp = client.post("/resources", json={
        "name": "Thermal Blankets",
        "category": "CLOTHING",
        "unit": "pieces",
        "minimum_stock": 20
    }, headers=admin_headers)
    res_id = r_resp.json()["id"]

    req_resp = client.post("/requests", json={
        "priority": "URGENT",
        "items": [{"resource_id": res_id, "requested_quantity": 30}]
    }, headers=ngo_headers)
    req_id = req_resp.json()["id"]

    # List requests
    list_resp = client.get("/requests", headers=ngo_headers)
    assert list_resp.status_code == status.HTTP_200_OK
    assert any(r["id"] == req_id for r in list_resp.json())

    # Get single request
    get_resp = client.get(f"/requests/{req_id}", headers=ngo_headers)
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["id"] == req_id
