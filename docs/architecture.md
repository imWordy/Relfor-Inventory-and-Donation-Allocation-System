# System Architecture

## High-Level System Architecture

```mermaid
graph TD
    UI[React UI] --> |REST API| API[FastAPI Backend]
    API --> |SQLAlchemy| DB[(PostgreSQL Database)]

    subgraph Frontend
        UI_Dash[Dashboard]
        UI_Inv[Inventory]
        UI_Don[Donations]
        UI_Req[Requests]
    end
    UI --> UI_Dash
    UI --> UI_Inv
    UI --> UI_Don
    UI --> UI_Req

    subgraph Backend Services
        Auth[Authentication]
        ResMgmt[Resource Management]
        InvSvc[Inventory Service]
        AllocEng[Allocation Engine]
    end
    API --> Auth
    API --> ResMgmt
    API --> InvSvc
    API --> AllocEng
```

## Component Responsibilities

### Frontend (React + Vite + Tailwind CSS)
- Provides a clean, responsive UI for Admin, Staff, and NGOs.
- Handles user interactions, form submissions, and data visualization.

### Backend (Python + FastAPI)
- Exposes RESTful endpoints for frontend consumption.
- Implements core business logic, validation, and role-based access control.
- **Allocation Engine**: Handles the transactional logic of deducting inventory and fulfilling requests (including partial fulfillment rules).

### Database (PostgreSQL)
- Relational data storage for Users, Donors, Resources, Inventory, Requests, and Allocations.
- Enforces data integrity (e.g., constraints to prevent negative inventory).
