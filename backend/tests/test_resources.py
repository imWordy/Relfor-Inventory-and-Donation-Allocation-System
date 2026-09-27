from fastapi import status
import uuid

def test_create_resource_admin_success(client, admin_headers):
    payload = {
        "name": "Sona Masoori Rice",
        "category": "FOOD",
        "unit": "kg",
        "description": "25kg non-perishable bags",
        "minimum_stock": 500
    }
    response = client.post("/resources", json=payload, headers=admin_headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Sona Masoori Rice"
    assert data["category"] == "FOOD"
    assert data["unit"] == "kg"
    assert data["minimum_stock"] == 500
    assert data["current_stock"] == 0
    assert "id" in data

def test_create_resource_staff_success(client, staff_headers):
    payload = {
        "name": "First Aid Medical Kit",
        "category": "MEDICAL",
        "unit": "boxes",
        "description": "Standard trauma and wound care kit",
        "minimum_stock": 50
    }
    response = client.post("/resources", json=payload, headers=staff_headers)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["name"] == "First Aid Medical Kit"

def test_create_resource_ngo_forbidden(client, ngo_headers):
    payload = {
        "name": "Unauthorized NGO Item",
        "category": "FOOD",
        "unit": "kg",
        "minimum_stock": 10
    }
    # NGO users are forbidden from creating or modifying resources
    response = client.post("/resources", json=payload, headers=ngo_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Operation not permitted" in response.json()["detail"]

def test_create_resource_unauthenticated(client):
    payload = {
        "name": "Anonymous Item",
        "category": "FOOD",
        "unit": "kg"
    }
    response = client.post("/resources", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_create_duplicate_resource_name(client, admin_headers):
    payload = {
        "name": "Woolen Blankets",
        "category": "CLOTHING",
        "unit": "pieces",
        "minimum_stock": 100
    }
    res1 = client.post("/resources", json=payload, headers=admin_headers)
    assert res1.status_code == status.HTTP_201_CREATED

    # Attempt to create duplicate name
    res2 = client.post("/resources", json=payload, headers=admin_headers)
    assert res2.status_code == status.HTTP_409_CONFLICT
    assert "already exists" in res2.json()["detail"]

def test_create_resource_invalid_category(client, admin_headers):
    payload = {
        "name": "Electronics Kit",
        "category": "INVALID_CAT",
        "unit": "boxes"
    }
    response = client.post("/resources", json=payload, headers=admin_headers)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_create_resource_negative_minimum_stock(client, admin_headers):
    payload = {
        "name": "Tarpaulin Sheets",
        "category": "SHELTER",
        "unit": "pieces",
        "minimum_stock": -5
    }
    response = client.post("/resources", json=payload, headers=admin_headers)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_list_and_filter_resources(client, admin_headers, ngo_headers):
    # Seed items
    client.post("/resources", json={"name": "Rice Grain", "category": "FOOD", "unit": "kg"}, headers=admin_headers)
    client.post("/resources", json={"name": "Wheat Flour", "category": "FOOD", "unit": "kg"}, headers=admin_headers)
    client.post("/resources", json={"name": "Bandages", "category": "MEDICAL", "unit": "boxes"}, headers=admin_headers)

    # NGO user can list resources (needed for submitting requirement requests)
    res_all = client.get("/resources", headers=ngo_headers)
    assert res_all.status_code == status.HTTP_200_OK
    assert len(res_all.json()) >= 3

    # Filter by category
    res_food = client.get("/resources?category=FOOD", headers=ngo_headers)
    assert res_food.status_code == status.HTTP_200_OK
    for item in res_food.json():
        assert item["category"] == "FOOD"

    # Search keyword
    res_search = client.get("/resources?search=Bandage", headers=ngo_headers)
    assert res_search.status_code == status.HTTP_200_OK
    assert len(res_search.json()) == 1
    assert res_search.json()[0]["name"] == "Bandages"

def test_get_resource_by_id(client, admin_headers, ngo_headers):
    create_res = client.post(
        "/resources",
        json={"name": "Notebook Kits", "category": "EDUCATION", "unit": "sets", "minimum_stock": 20},
        headers=admin_headers
    )
    res_id = create_res.json()["id"]

    # Retrieve by ID
    get_res = client.get(f"/resources/{res_id}", headers=ngo_headers)
    assert get_res.status_code == status.HTTP_200_OK
    assert get_res.json()["name"] == "Notebook Kits"

    # 404 for non-existent ID
    random_id = str(uuid.uuid4())
    not_found = client.get(f"/resources/{random_id}", headers=ngo_headers)
    assert not_found.status_code == status.HTTP_404_NOT_FOUND

def test_update_resource_staff_success(client, staff_headers):
    create_res = client.post(
        "/resources",
        json={"name": "Hygiene Pack", "category": "HYGIENE", "unit": "packets", "minimum_stock": 50},
        headers=staff_headers
    )
    res_id = create_res.json()["id"]

    # Update resource
    update_res = client.put(
        f"/resources/{res_id}",
        json={"name": "Family Hygiene Pack", "minimum_stock": 100},
        headers=staff_headers
    )
    assert update_res.status_code == status.HTTP_200_OK
    assert update_res.json()["name"] == "Family Hygiene Pack"
    assert update_res.json()["minimum_stock"] == 100

def test_update_resource_ngo_forbidden(client, admin_headers, ngo_headers):
    create_res = client.post(
        "/resources",
        json={"name": "Shelter Tents", "category": "SHELTER", "unit": "sets"},
        headers=admin_headers
    )
    res_id = create_res.json()["id"]

    # NGO attempt to update must be rejected
    update_res = client.put(
        f"/resources/{res_id}",
        json={"name": "Hacked Tents"},
        headers=ngo_headers
    )
    assert update_res.status_code == status.HTTP_403_FORBIDDEN
