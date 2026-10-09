# Relfor Inventory & Donation Allocation System

A production-ready inventory and donation allocation management system developed for **Relfor Foundation** as a Service Learning technical project.

The system is designed to help the foundation manage incoming relief donations, monitor live warehouse inventory, process resource requirements submitted by partner NGOs, execute atomic allocations without negative inventory risks, record physical distributions with receipts, and audit full lifecycle history.

---

## Key Features

* **Centralized Inventory Tracking:** Live stock visibility across multiple relief categories (`FOOD`, `MEDICAL`, `CLOTHING`, `SHELTER`, `EDUCATION`, `HYGIENE`, `OTHER`) with real-time stock status calculations (`AVAILABLE`, `LOW_STOCK`, `OUT_OF_STOCK`).
* **Donation Intake:** Direct registration of goods received from individual, corporate, and foundation donors with automatic inventory increments.
* **NGO Requirement Requests:** NGOs submit prioritized relief requests (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) with organization-level data scoping.
* **Atomic Allocation Engine:** High-integrity resource allocation engine supporting both partial and full fulfillment. Guaranteed invariants prevent negative inventory and ensure transaction rollback on invalid multi-item batches.
* **Distribution & Proof of Delivery:** Logging of physical handovers to authorized recipients with delivery receipts and automatic request completion.
* **Operational Analytics & Audit Trail:** Interactive analytics dashboard, stock health alerts, filtering, and CSV export.
* **Role-Based Access Control:** Secure JWT authentication with role-based authorization for **Admin**, **Staff**, and **NGO** users.

---

## Development Team

Developed collaboratively by three team members:

### Ansh Saini
Primary responsibilities:
* System architecture & technical documentation
* Transactional allocation engine & business logic invariants
* Backend foundation & inventory service
* Integration testing & business logic stress test suite
* Production containerization, Docker configuration & deployment guides

### Aditya Singh
Primary responsibilities:
* Frontend architecture (React 18 + Vite SPA)
* Component design, UI/UX tokens & responsive navigation
* Operational metrics dashboard & visualizer components
* Frontend integration & automated UI testing
* End-user operational guide & demo presentation guide

### Aayush Kumar Meena
Primary responsibilities:
* Relational database schema design & seed datasets (PostgreSQL)
* Authentication service & role-based route guards
* Resource catalog & donation management modules
* Requirement requests & reporting services

---

## Technical Architecture

* **Frontend:** React 18, Vite 5, Tailwind CSS / Utility CSS, Nginx reverse proxy.
* **Backend:** Python (FastAPI), Uvicorn ASGI, Pydantic v2 validation, SQLAlchemy 2.0 ORM.
* **Database:** PostgreSQL 16 with check constraints, foreign key cascades, and timestamp triggers.
* **Testing:** Pytest (41 automated tests covering unit, integration, and stress cases) & Node.js UI test suite.
* **Deployment:** Multi-stage production Dockerfiles with Docker Compose orchestration.

---

## Quick Start (Local Development)

### 1. Database Setup
Ensure PostgreSQL is running locally, or start using Docker:
```bash
docker-compose up -d postgres
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment:
# Windows: .\venv\Scripts\activate
# Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# In the project root directory:
npm install
npm run dev
```
Frontend accessible at: `http://localhost:5173`

---

## Technical Documentation Index

* **[Architecture Specification](docs/architecture.md):** 3-tier architecture, component diagram, and data flow.
* **[REST API Documentation](docs/api.md):** Complete endpoints, payloads, role guards, and error responses.
* **[Database Schema Documentation](docs/database.md):** Entity relationship diagrams, schema definitions, and constraints.
* **[Testing & QA Documentation](docs/testing.md):** Test coverage, invariant verification, and instructions.
* **[Production Deployment Guide](docs/deployment.md):** Docker Compose and cloud deployment guides (Vercel + Render + PostgreSQL).
* **[End-User Operational Guide](docs/user-guide.md):** Step-by-step user guide for Relfor Foundation staff.
* **[Final Acceptance Test Report](docs/final-test-report.md):** Full end-to-end acceptance run verification report.
