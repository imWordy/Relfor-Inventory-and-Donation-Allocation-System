# Comprehensive REST API Specification

This document provides complete documentation of all REST API endpoints implemented in the **Relfor Inventory & Donation Allocation System**.

---

## Base URL
* **Development:** `http://localhost:8000`
* **Production:** Configured via `VITE_API_BASE_URL` (e.g. `https://api.relfor.org`)

## Authentication & Headers
All protected endpoints require a Bearer token in the `Authorization` header:
```http
Authorization: Bearer <jwt_access_token>
```

---

## 1. System Health

### `GET /health`
* **Access:** Public
* **Description:** Healthcheck endpoint for monitoring, Docker, and reverse proxies.
* **Response (200 OK):**
  ```json
  {
    "status": "healthy",
    "service": "Relfor Inventory & Donation Allocation API"
  }
  ```

---

## 2. Authentication & Users

### `POST /auth/login`
* **Access:** Public
* **Description:** Authenticates a user and returns a signed JWT token.
* **Request Body:**
  ```json
  {
    "email": "staff@relfor.org",
    "password": "Password123!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "user": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "staff@relfor.org",
      "name": "Staff Member",
      "role": "STAFF",
      "organization_id": null
    }
  }
  ```
* **Errors:** `401 Unauthorized` for invalid email or password.

### `GET /auth/me`
* **Access:** Authenticated (Any role)
* **Description:** Returns the profile of the currently logged-in user.
* **Response (200 OK):** Returns User object.

---

## 3. Resource Catalog

### `GET /resources`
* **Access:** Authenticated
* **Query Parameters:** `category`, `search`, `skip` (default 0), `limit` (default 100)
* **Response (200 OK):** Array of Resource objects.

### `POST /resources`
* **Access:** Admin or Staff
* **Request Body:**
  ```json
  {
    "name": "High-Protein Biscuits",
    "category": "FOOD",
    "unit": "cartons",
    "description": "Emergency nutrition biscuits",
    "minimum_stock": 50
  }
  ```
* **Response (201 Created):** Created Resource object.
* **Errors:** `400 Bad Request` (duplicate name), `422 Unprocessable Content` (invalid category or negative stock).

### `GET /resources/{id}`
* **Access:** Authenticated
* **Response (200 OK):** Resource details by ID.

### `PUT /resources/{id}`
* **Access:** Admin or Staff
* **Response (200 OK):** Updated Resource object.

---

## 4. Inventory Service

### `GET /inventory`
* **Access:** Authenticated
* **Query Parameters:** `category`, `stock_status` (`AVAILABLE`, `LOW_STOCK`, `OUT_OF_STOCK`), `search`, `skip`, `limit`
* **Response (200 OK):**
  ```json
  [
    {
      "resource_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Emergency Tents",
      "category": "SHELTER",
      "unit": "units",
      "minimum_stock": 10,
      "available_quantity": 45,
      "status": "AVAILABLE"
    }
  ]
  ```

### `GET /inventory/{resource_id}`
* **Access:** Authenticated
* **Response (200 OK):** Real-time stock status and available quantity for specified resource.

---

## 5. Donations Intake

### `POST /donations`
* **Access:** Admin or Staff
* **Request Body:**
  ```json
  {
    "donor_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "resource_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "quantity": 100,
    "condition": "NEW",
    "notes": "Direct delivery from warehouse"
  }
  ```
* **Response (201 Created):** Recorded Donation record with auto-incremented resource stock.

### `GET /donations`
* **Access:** Authenticated
* **Query Parameters:** `donor_id`, `resource_id`, `skip`, `limit`
* **Response (200 OK):** Array of historical donations.

---

## 6. Requirement Requests (NGO)

### `POST /requests`
* **Access:** NGO or Staff or Admin
* **Request Body:**
  ```json
  {
    "priority": "HIGH",
    "notes": "Flood relief in District 4",
    "items": [
      {
        "resource_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "requested_quantity": 50
      }
    ]
  }
  ```
* **Response (201 Created):** Created Request record with status `PENDING`.

### `GET /requests`
* **Access:** Authenticated (NGO users automatically scoped to their organization)
* **Query Parameters:** `status` (`PENDING`, `PARTIALLY_ALLOCATED`, `ALLOCATED`, `COMPLETED`, `CANCELLED`), `priority`, `skip`, `limit`
* **Response (200 OK):** List of requests.

### `GET /requests/{id}`
* **Access:** Authenticated (Scoped by organization for NGO)
* **Response (200 OK):** Request with nested request items and allocation history.

---

## 7. Allocation Engine

### `POST /allocations`
* **Access:** Admin or Staff
* **Description:** Atomically calculates and executes stock allocation for a pending request.
* **Request Body:**
  ```json
  {
    "request_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "notes": "Batch 1 partial delivery",
    "items": [
      {
        "request_item_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "resource_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "allocated_quantity": 30
      }
    ]
  }
  ```
* **Response (201 Created):** Created Allocation object.
* **Validation & Integrity Invariants:**
  * Rejects duplicate items within the payload (`400 Bad Request`).
  * Rejects allocation if quantity exceeds remaining needed quantity (`400 Bad Request`).
  * Rejects allocation if current stock is insufficient (`400 Bad Request`).
  * Executes atomic rollback if any item in a multi-item batch fails.
  * Transitions request status to `ALLOCATED` or `PARTIALLY_ALLOCATED`.

### `GET /allocations`
* **Access:** Authenticated (Scoped by organization for NGO)
* **Query Parameters:** `status` (`PENDING_DISTRIBUTION`, `DISTRIBUTED`, `CANCELLED`), `request_id`, `skip`, `limit`
* **Response (200 OK):** List of allocation records.

### `GET /allocations/{id}`
* **Access:** Authenticated
* **Response (200 OK):** Allocation detail by ID.

### `POST /allocations/{id}/cancel`
* **Access:** Admin or Staff
* **Description:** Cancels an un-distributed allocation, refunds deducted stock back to current inventory, and recalculates request status.
* **Response (200 OK):** Cancelled allocation object.
* **Errors:** `400 Bad Request` if already distributed or cancelled.

---

## 8. Distributions & Delivery Receipts

### `POST /distributions`
* **Access:** Admin or Staff
* **Description:** Records physical handover of an allocated batch to a recipient.
* **Request Body:**
  ```json
  {
    "allocation_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "received_by": "Dr. Sarah Rao",
    "receiver_contact": "+91 99887 76655",
    "notes": "Delivered to emergency medical post"
  }
  ```
* **Response (201 Created):** Distribution record with receipt details.
* **Workflow:**
  * Transitions allocation status to `DISTRIBUTED`.
  * If all allocations for the parent request are distributed, transitions parent request status to `COMPLETED`.

### `GET /distributions`
* **Access:** Authenticated (Scoped by organization for NGO)
* **Query Parameters:** `skip`, `limit`
* **Response (200 OK):** List of all distribution records with delivery timestamps.

### `GET /distributions/{id}`
* **Access:** Authenticated
* **Response (200 OK):** Single distribution receipt details.
