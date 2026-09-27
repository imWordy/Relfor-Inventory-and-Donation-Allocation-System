from fastapi import status

def test_login_success(client):
    response = client.post(
        "/auth/login",
        json={"email": "admin@relfor.org", "password": "AdminPass123!"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "admin@relfor.org"
    assert data["user"]["role"] == "ADMIN"

def test_login_invalid_password(client):
    response = client.post(
        "/auth/login",
        json={"email": "admin@relfor.org", "password": "WrongPassword!"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Invalid email or password"

def test_login_nonexistent_user(client):
    response = client.post(
        "/auth/login",
        json={"email": "nobody@relfor.org", "password": "Password123!"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Invalid email or password"

def test_login_inactive_user(client):
    response = client.post(
        "/auth/login",
        json={"email": "inactive@relfor.org", "password": "InactivePass123!"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Inactive user account" in response.json()["detail"]

def test_auth_me_success(client, admin_headers):
    response = client.get("/auth/me", headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "admin@relfor.org"
    assert data["role"] == "ADMIN"

def test_auth_me_missing_token(client):
    response = client.get("/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_auth_me_invalid_token(client):
    response = client.get("/auth/me", headers={"Authorization": "Bearer invalid_garbage_token"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_role_authorization_admin_and_staff(client, admin_headers, staff_headers):
    # Both Admin and Staff can query protected profiles
    res_admin = client.get("/auth/me", headers=admin_headers)
    assert res_admin.status_code == status.HTTP_200_OK
    assert res_admin.json()["role"] == "ADMIN"

    res_staff = client.get("/auth/me", headers=staff_headers)
    assert res_staff.status_code == status.HTTP_200_OK
    assert res_staff.json()["role"] == "STAFF"

def test_ngo_user_profile(client, ngo_headers):
    res_ngo = client.get("/auth/me", headers=ngo_headers)
    assert res_ngo.status_code == status.HTTP_200_OK
    data = res_ngo.json()
    assert data["email"] == "ngo@testngo.org"
    assert data["role"] == "NGO"
    assert data["organization_id"] is not None
