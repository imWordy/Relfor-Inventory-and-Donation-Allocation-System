from fastapi import status
import uuid

def test_create_organization_admin_success(client, admin_headers):
    payload = {
        "name": "Seva Children Shelter",
        "type": "SHELTER",
        "registration_number": "SHELTER/2026/01",
        "contact_person": "Pooja Sharma",
        "phone": "+91 98765 43210",
        "email": "seva@shelter.org",
        "address": "45 MG Road, Pune",
        "is_verified": True
    }
    resp = client.post("/organizations", json=payload, headers=admin_headers)
    assert resp.status_code == status.HTTP_201_CREATED
    data = resp.json()
    assert data["name"] == "Seva Children Shelter"
    assert data["type"] == "SHELTER"
    assert data["contact_person"] == "Pooja Sharma"
    assert "id" in data

def test_create_duplicate_organization_fails(client, admin_headers):
    payload = {
        "name": "Aman Community Care",
        "type": "COMMUNITY_GROUP",
        "contact_person": "Aman Verma",
        "phone": "+91 98888 11111",
        "email": "aman@care.org",
        "address": "12 Station Rd"
    }
    resp1 = client.post("/organizations", json=payload, headers=admin_headers)
    assert resp1.status_code == status.HTTP_201_CREATED

    resp2 = client.post("/organizations", json=payload, headers=admin_headers)
    assert resp2.status_code == status.HTTP_409_CONFLICT
    assert "already exists" in resp2.json()["detail"]

def test_ngo_user_cannot_create_organization(client, ngo_headers):
    payload = {
        "name": "Unauthorized NGO Attempt",
        "type": "NGO",
        "contact_person": "Ravi",
        "phone": "+91 90000 00000",
        "email": "unauth@ngo.org",
        "address": "Some street"
    }
    resp = client.post("/organizations", json=payload, headers=ngo_headers)
    assert resp.status_code == status.HTTP_403_FORBIDDEN

def test_list_and_filter_organizations(client, admin_headers, ngo_headers):
    # List organizations is accessible to authenticated users
    resp = client.get("/organizations", headers=ngo_headers)
    assert resp.status_code == status.HTTP_200_OK
    assert len(resp.json()) >= 1  # includes seeded org

    # Filter by type
    filter_resp = client.get("/organizations?type=NGO", headers=admin_headers)
    assert filter_resp.status_code == status.HTTP_200_OK
    for org in filter_resp.json():
        assert org["type"] == "NGO"

def test_get_and_update_organization(client, staff_headers):
    create_resp = client.post("/organizations", json={
        "name": "Old Age Harmony Home",
        "type": "OTHER",
        "contact_person": "Sunita Sen",
        "phone": "+91 91111 22222",
        "email": "harmony@home.org",
        "address": "Plot 9, Green Avenue"
    }, headers=staff_headers)
    assert create_resp.status_code == status.HTTP_201_CREATED
    org_id = create_resp.json()["id"]

    # Get by ID
    get_resp = client.get(f"/organizations/{org_id}", headers=staff_headers)
    assert get_resp.status_code == status.HTTP_200_OK
    assert get_resp.json()["name"] == "Old Age Harmony Home"

    # Update
    update_resp = client.put(f"/organizations/{org_id}", json={
        "contact_person": "Sunita Sen Gupta",
        "phone": "+91 91111 33333"
    }, headers=staff_headers)
    assert update_resp.status_code == status.HTTP_200_OK
    assert update_resp.json()["contact_person"] == "Sunita Sen Gupta"
    assert update_resp.json()["phone"] == "+91 91111 33333"
