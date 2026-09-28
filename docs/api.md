# API Documentation

This document describes the API contract for the Allocation and Request APIs required by the frontend.

## Allocations API

### 1. Create Allocation
Creates an allocation, reserving inventory for a request.

**Endpoint:** `POST /allocations`
**Authorization:** Required (Admin or Staff)

**Request Body:**
```json
{
  "request_id": "uuid",
  "notes": "optional notes",
  "items": [
    {
      "request_item_id": "uuid",
      "resource_id": "uuid",
      "allocated_quantity": 10
    }
  ]
}
```

**Response (201 Created):**
Returns the Allocation object with nested items.

**Common Errors:**
- `400 Bad Request`: Insufficient inventory, duplicate items, invalid request status.
- `404 Not Found`: Request or Resource not found.

### 2. Get Allocation
**Endpoint:** `GET /allocations/{id}`
**Authorization:** Required (Admin, Staff, or owning NGO)

**Response (200 OK):**
Returns the Allocation object.

### 3. List Allocations
**Endpoint:** `GET /allocations`
**Query Params:** `status_filter`, `request_id`, `skip`, `limit`
**Authorization:** Required

**Response (200 OK):**
Returns a list of Allocation objects.

### 4. Cancel Allocation
**Endpoint:** `POST /allocations/{id}/cancel`
**Authorization:** Required (Admin or Staff)
**Behavior:** Cancels the allocation and returns the reserved stock back to the inventory.

---

## Distributions API

### 1. Record Distribution
**Endpoint:** `POST /distributions`
**Authorization:** Required (Admin or Staff)

**Request Body:**
```json
{
  "allocation_id": "uuid",
  "received_by": "John Doe",
  "receiver_contact": "555-1234",
  "notes": "Handed over at warehouse"
}
```

**Response (201 Created):**
Returns the created Distribution object.

---

## Conclusion
The frontend should implement against these endpoints using standard JSON requests and expecting HTTP status codes as described.
