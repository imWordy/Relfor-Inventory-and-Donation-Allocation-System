# Relfor Inventory & Donation Allocation System
# Phase-by-Phase Team Execution & Git Workflow

## 0. Purpose of This Document

This document is the execution order for the Relfor Inventory & Donation Allocation System.

It tells the three developers:

- Who works on what
- In what order work must happen
- How many hours each step is expected to take
- What must be created
- What must be committed and pushed
- What must be tested before another person starts
- What prompt should be given to the coding agent
- What the acceptance criteria are for each step

This document should be treated as the project's **execution roadmap**.

The high-level project context is defined in `README.md` and `CLAUDE.md`.

Do not skip directly to later phases unless the required dependencies have already been completed and verified.

---

# 1. Team

| Member | Primary Ownership |
|---|---|
| Ansh | Architecture, allocation engine, integration, deployment |
| Aditya | Frontend, UI/UX, dashboard, frontend integration |
| Aayush | Database, backend modules, authentication, reports |

All three members should understand the complete application, but each person owns specific implementation areas.

---

# 2. Total Planned Effort

| Member | Planned Hours |
|---|---:|
| Ansh | ~57 hrs |
| Aditya | ~54 hrs |
| Aayush | ~55 hrs |
| **Total** | **~166 person-hours** |

These are working-hour estimates. Some steps may take less or more time in practice.

The purpose of the hour allocation is to provide a realistic project workload and ensure every member contributes substantially.

---

# 3. Git Branch Strategy

Use:

```text
main
development
```

Individual work should normally happen on feature branches:

```text
feature/<feature-name>
```

Examples:

```text
feature/database
feature/authentication
feature/inventory
feature/donations
feature/requests
feature/allocation-engine
feature/frontend
feature/dashboard
feature/reports
```

Recommended flow:

```text
Feature Branch
      ↓
Implementation
      ↓
Local Testing
      ↓
Commit
      ↓
Push
      ↓
Pull Request
      ↓
Review
      ↓
development
      ↓
Integration Testing
      ↓
main
```

Do not directly push unfinished work to `main`.

---

# 4. Important Collaboration Rule

A developer must not begin a dependent phase until the previous phase has:

1. Been implemented.
2. Been tested.
3. Been committed.
4. Been pushed.
5. Been reviewed or verified.
6. Been merged into `development`.

If a later developer needs to start before a merge, they may coordinate with the previous developer, but the final integration must still happen through Git.

---

# 5. Agent Instructions

Every agent prompt below assumes the coding agent has already read:

```text
README.md
CLAUDE.md
EXECUTION_PLAN.md
```

The agent must:

- Inspect the repository before changing anything.
- Read the current implementation.
- Preserve working functionality.
- Avoid unnecessary rewrites.
- Implement only the requested phase.
- Run appropriate tests.
- Fix failures before completion.
- Update documentation where appropriate.
- Never claim success without verifying the implementation.
- Report files changed.
- Report tests executed.
- Report any unresolved issues.

---

# PHASE 0 — COMMON PROJECT IDEATION & REQUIREMENTS

## Step 1 — Team Ideation

**Owners:** Ansh + Aditya + Aayush  
**Time:** 2 hours each  
**Total:** 6 person-hours

### Work

Together finalize:

- Problem statement
- Target users
- User roles
- Main workflow
- Core features
- Out-of-scope features
- Technology stack
- Major assumptions
- Success criteria

### Deliverables

Create:

```text
docs/requirements.md
docs/problem-statement.md
```

### Agent Prompt

```text
Read README.md and CLAUDE.md.

We are beginning Phase 0 of the Relfor Inventory & Donation Allocation System.

Do not implement the application yet.

Create the initial project requirements documentation based on the project context.

Create:
- docs/requirements.md
- docs/problem-statement.md

Document:
- Problem statement
- Existing problem
- Proposed solution
- Stakeholders
- User roles
- Core workflows
- Functional requirements
- Non-functional requirements
- Assumptions
- Constraints
- Mandatory features
- Optional features
- Explicitly out-of-scope features
- Definition of success

Do not invent additional product requirements.

After creating the documents:
1. Check that they are internally consistent.
2. Make sure they agree with README.md and CLAUDE.md.
3. Do not create application code.
4. Report exactly what was created.
```

### Acceptance Criteria

The team must agree that the requirements accurately represent the NGO problem.

Commit:

```text
docs: add project requirements
```

Push to:

```text
development
```

---

# PHASE 1 — SYSTEM WORKFLOW & ARCHITECTURE

## Step 2 — Workflow Design

**Owner:** Ansh  
**Time:** 4 hours

### Work

Define:

- Donation workflow
- Inventory workflow
- Request workflow
- Allocation workflow
- Distribution workflow
- Status transitions
- High-level architecture

### Create

```text
docs/workflow.md
docs/architecture.md
```

Include diagrams using Mermaid where practical.

### Agent Prompt

```text
Read README.md, CLAUDE.md, and docs/requirements.md.

Implement Phase 1 documentation only.

Create:
- docs/workflow.md
- docs/architecture.md

Document the complete lifecycle:

Donation
→ Inventory
→ Requirement Request
→ Allocation
→ Distribution
→ History

Document:
- User interactions
- Backend responsibilities
- Database responsibilities
- Frontend responsibilities
- Allocation flow
- Partial allocation
- Status transitions
- Error scenarios
- High-level system architecture

Use Mermaid diagrams where useful.

Do not implement application functionality yet.

Verify that the architecture is compatible with:
React + Vite + Tailwind CSS
FastAPI + SQLAlchemy
PostgreSQL

Do not introduce microservices or unnecessary infrastructure.
```

### Acceptance Criteria

The architecture must clearly show:

```text
Frontend
   ↓
FastAPI
   ↓
Database
```

and:

```text
Donation
→ Inventory
→ Request
→ Allocation
→ Distribution
```

Commit:

```text
docs: define system workflow and architecture
```

Push to `development`.

---

# PHASE 2 — DATABASE DESIGN

## Step 3 — Database Schema

**Owner:** Aayush  
**Time:** 4 hours

### Work

Design:

- Tables
- Primary keys
- Foreign keys
- Constraints
- Relationships
- Indexes where useful

### Create

```text
database/schema.sql
docs/database.md
database/er-diagram.png
```

### Agent Prompt

```text
Read:
- README.md
- CLAUDE.md
- docs/requirements.md
- docs/workflow.md
- docs/architecture.md

Implement Phase 2: database design.

Create the PostgreSQL database schema for:

- users
- donors
- resources
- donations
- organizations
- requests
- request_items
- allocations
- allocation_items
- distributions

Ensure:
- Proper primary keys
- Foreign keys
- Appropriate data types
- Required fields
- Quantity constraints
- Useful indexes
- Referential integrity

Pay particular attention to:
- request → request_items
- request → allocation
- allocation → allocation_items
- allocation → distribution
- donor → donations
- resource → donations
- resource → allocation_items

Do not create the FastAPI application yet.

Create:
- database/schema.sql
- docs/database.md
- an ER diagram

Verify that the schema supports the complete project workflow.
```

### Acceptance Criteria

The schema must support the full lifecycle.

Commit:

```text
feat: add initial database schema
```

Push and merge to `development`.

---

# PHASE 3 — DATABASE SETUP + SEED DATA

## Step 4 — Local Database Environment

**Owner:** Aayush  
**Time:** 3 hours

### Work

Set up:

- PostgreSQL
- Environment configuration
- Database initialization
- Seed data

Create:

```text
database/seed.sql
.env.example
docker-compose.yml
```

if appropriate.

### Agent Prompt

```text
Read the project documentation and inspect the current repository.

Implement the local PostgreSQL development environment.

Requirements:
- PostgreSQL
- Environment-variable based configuration
- No secrets committed
- Database initialization
- Seed data for development

Create realistic but fictional seed data including:
- Several users
- Several donors
- Several resources
- Several organizations
- Donations
- Requests
- Allocation examples where appropriate

Do not use real personal information.

Verify that the database can be initialized from a clean environment.
```

### Acceptance Criteria

A fresh developer should be able to start the database and populate development data using the documented instructions.

Commit:

```text
feat: configure local database and seed data
```

Push and merge to `development`.

---

# PHASE 4 — BACKEND FOUNDATION

## Step 5 — FastAPI Backend Setup

**Owner:** Ansh  
**Time:** 3 hours

### Work

Create:

```text
backend/
├── app/
├── tests/
├── requirements.txt
└── README.md
```

Set up:

- FastAPI
- SQLAlchemy
- Pydantic
- Database connection
- Configuration
- Basic error handling

### Agent Prompt

```text
Read all project documentation.

Implement the backend foundation.

Use:
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL

Create a clean backend structure separating:
- Models
- Schemas
- Routers
- Services
- Database configuration
- Utilities

Implement:
- Application startup
- Database connection
- Configuration from environment variables
- Basic health endpoint
- Error handling foundation

Do not implement business modules yet.

Run the application and verify:
GET /health

returns a successful response.

Run the backend tests.
```

### Acceptance Criteria

Backend starts successfully and connects to PostgreSQL.

Commit:

```text
feat: initialize FastAPI backend
```

Push and merge to `development`.

---

# PHASE 5 — AUTHENTICATION

## Step 6 — Authentication + Authorization

**Owner:** Aayush  
**Time:** 4 hours

### Work

Implement:

- Password hashing
- Login
- Authentication
- Roles
- Protected routes
- Admin/Staff/NGO permissions

### Agent Prompt

```text
Read the project documentation and inspect the existing backend.

Implement authentication and role-based authorization.

Required roles:
- ADMIN
- STAFF
- NGO

Implement:
- Secure password hashing
- Login
- Authentication mechanism
- Protected routes
- Role checks

Requirements:
- Never store plaintext passwords.
- Never hardcode secrets.
- Use environment variables.
- NGO users must not modify inventory.
- Unauthorized users must receive appropriate HTTP errors.

Add tests for:
- Successful login
- Failed login
- Protected endpoint
- Admin access
- Staff access
- NGO restrictions

Do not modify unrelated modules.
```

### Acceptance Criteria

Authentication works and role restrictions are tested.

Commit:

```text
feat: add authentication and role authorization
```

Push and merge.

---

# PHASE 6 — RESOURCE + INVENTORY MANAGEMENT

## Step 7 — Resource Management

**Owner:** Aayush  
**Time:** 4 hours

### Work

Implement resource CRUD.

### Agent Prompt

```text
Read the existing backend and documentation.

Implement the Resource Management module.

Provide API support for:
- Create resource
- List resources
- Get resource
- Update resource
- Search/filter resources

Resource fields should include:
- name
- category
- unit
- description
- minimum_stock

Validate all inputs.

Add API tests.

Do not implement donation or allocation logic yet.
```

### Acceptance Criteria

Resource CRUD works and is tested.

Commit:

```text
feat: add resource management
```

---

## Step 8 — Inventory Service

**Owner:** Ansh  
**Time:** 4 hours

### Work

Implement inventory calculations and read APIs.

### Agent Prompt

```text
Read the existing backend.

Implement the inventory service.

Requirements:
- Show current available quantities.
- Support inventory lookup by resource.
- Support category/status filtering.
- Calculate stock status.
- Never expose negative inventory.

Stock statuses should include:
- AVAILABLE
- LOW_STOCK
- OUT_OF_STOCK
- EXPIRED where applicable

Do not implement allocation yet.

Create tests for:
- Normal inventory
- Low stock
- Zero stock
- Invalid quantities
```

### Acceptance Criteria

Inventory can be queried reliably.

Commit:

```text
feat: add inventory service
```

Push and merge.

---

# PHASE 7 — DONATION MANAGEMENT

## Step 9 — Donation Module

**Owner:** Aayush  
**Time:** 5 hours

### Work

Implement:

- Donation creation
- Donation listing
- Donation details
- Donation validation
- Inventory increase

### Agent Prompt

```text
Implement the Donation Management module.

A donation must record:
- donor
- resource
- quantity
- condition
- donation date
- expiry date
- notes

When a valid donation is recorded:
- The donation record must be created.
- Corresponding inventory must increase.
- The operation must be transactional.

Validate:
- donor exists
- resource exists
- quantity > 0
- valid dates

Add tests for:
- Successful donation
- Invalid donor
- Invalid resource
- Invalid quantity
- Inventory increase
- Transaction failure handling
```

### Acceptance Criteria

Test:

```text
Initial inventory = 100
Donation = 50
Final inventory = 150
```

Commit:

```text
feat: implement donation management
```

Push and merge.

---

# PHASE 8 — ORGANIZATIONS

## Step 10 — Organization Management

**Owner:** Aayush  
**Time:** 3 hours

### Work

Implement NGO/beneficiary organization CRUD.

### Agent Prompt

```text
Implement Organization Management.

Support:
- Create organization
- List organizations
- View organization
- Update organization
- Search organizations

Fields:
- name
- type
- contact person
- phone
- email
- address

Ensure organization records can later be associated with resource requests.

Add API tests.
```

### Acceptance Criteria

Organizations can be created and retrieved.

Commit:

```text
feat: add organization management
```

Push and merge.

---

# PHASE 9 — REQUEST MANAGEMENT

## Step 11 — Requirement Requests

**Owner:** Aayush  
**Time:** 4 hours

### Work

Implement:

- Request creation
- Request items
- Request retrieval
- Request statuses
- Priority

### Agent Prompt

```text
Implement the Requirement Request module.

A request belongs to an organization and can contain multiple request items.

Support:
- Create request
- Add multiple resources
- Requested quantities
- Priority
- Notes
- View request
- List requests
- Filter requests

Statuses:
- PENDING
- PARTIALLY_ALLOCATED
- ALLOCATED
- REJECTED
- COMPLETED
- CANCELLED

Validate:
- Organization exists
- Resource exists
- Quantity > 0
- Valid priority
- Valid status transitions

Do not implement allocation yet.

Add tests.
```

### Acceptance Criteria

Example must work:

```text
NGO A
Rice: 100 kg
Blankets: 50
```

Commit:

```text
feat: implement requirement requests
```

Push and merge.

---

# PHASE 10 — ALLOCATION ENGINE

## Step 12 — Allocation Logic

**Owner:** Ansh  
**Time:** 7 hours

This is the most important backend step.

### Work

Implement:

- Allocation calculation
- Full allocation
- Partial allocation
- Inventory decrement
- Request status update
- Allocation records
- Transactions

### Agent Prompt

```text
This is the core business-logic phase.

Read all existing code and documentation before modifying anything.

Implement the Allocation Engine.

For every request item:

allocation_quantity =
min(requested_quantity, available_inventory)

The operation must:
1. Validate the request.
2. Read current inventory safely.
3. Calculate allocation quantity.
4. Prevent allocation above available inventory.
5. Update inventory.
6. Create allocation.
7. Create allocation items.
8. Update request item allocated quantity.
9. Recalculate request status.
10. Commit everything transactionally.

Support:
- Full allocation
- Partial allocation
- Zero inventory
- Multiple resources in one request
- Multiple requests competing for inventory

Critical requirement:

If inventory = 100
Request A = 70
Request B = 50

The total allocation must never exceed 100.

The system must never produce negative inventory.

Consider appropriate transaction/locking behavior to prevent race conditions.

Add comprehensive tests.

Mandatory tests:
1. Full allocation
2. Partial allocation
3. Zero inventory
4. Multiple resource request
5. Competing requests
6. Failed transaction rollback
7. Negative inventory prevention
```

### Acceptance Criteria

All allocation tests pass.

Especially:

```text
Inventory = 100
A requests 70
B requests 50

Total allocated <= 100
Final inventory >= 0
```

Commit:

```text
feat: implement transactional allocation engine
```

Push and merge.

---

# PHASE 11 — ALLOCATION API + FRONTEND CONTRACT

## Step 13 — Finalize Allocation API

**Owner:** Ansh  
**Time:** 3 hours

### Work

Finalize endpoints and API response formats so frontend development can proceed consistently.

Document:

```text
GET /allocations
GET /allocations/{id}
POST /allocations
```

and relevant request endpoints.

### Agent Prompt

```text
Review the allocation engine.

Finalize the API contract required by the frontend.

Document:
- Endpoint
- HTTP method
- Request body
- Response body
- Validation errors
- Authorization requirements
- Status codes

Create or update:
docs/api.md

Do not redesign working business logic unless necessary.

Add API tests for the documented endpoints.

Ensure frontend developers can implement against the API without guessing the response structure.
```

### Acceptance Criteria

`docs/api.md` accurately describes the running API.

Commit:

```text
docs: finalize allocation API contract
```

Push and merge.

---

# PHASE 12 — DISTRIBUTION MANAGEMENT

## Step 14 — Distribution Module

**Owner:** Ansh  
**Time:** 3 hours

### Work

Implement actual handover records.

### Agent Prompt

```text
Implement Distribution Management.

A distribution represents actual handover of resources from an allocation.

Record:
- allocation
- distribution date
- received by
- notes

Do not confuse allocation with distribution.

A valid distribution must reference a valid allocation.

Preserve historical records.

Add tests for:
- Successful distribution
- Invalid allocation
- Duplicate/invalid distribution behavior
- Authorization
```

### Acceptance Criteria

The system can record:

```text
Allocation
→ Actual distribution
→ Distribution history
```

Commit:

```text
feat: add distribution tracking
```

Push and merge.

---

# PHASE 13 — FRONTEND FOUNDATION

## Step 15 — React Application

**Owner:** Aditya  
**Time:** 3 hours

### Work

Create frontend:

- React
- Vite
- Tailwind
- Routing
- API client
- Layout

### Agent Prompt

```text
Read:
- README.md
- CLAUDE.md
- docs/requirements.md
- docs/architecture.md
- docs/api.md

Implement the frontend foundation.

Use:
- React
- Vite
- Tailwind CSS
- React Router

Create:
- Application layout
- Navigation
- Route structure
- API client
- Authentication state foundation
- Reusable UI component structure

Do not implement every page yet.

Make sure the frontend can communicate with the existing FastAPI backend.

Do not modify backend business logic unless required to fix an integration issue.
```

### Acceptance Criteria

Frontend starts and can connect to backend.

Commit:

```text
feat: initialize React frontend
```

Push and merge.

---

# PHASE 14 — AUTHENTICATION UI

## Step 16 — Login + Role-Based Navigation

**Owner:** Aditya  
**Time:** 3 hours

### Agent Prompt

```text
Implement the frontend authentication flow against the existing backend API.

Create:
- Login page
- Authentication state
- Logout
- Protected routes
- Role-aware navigation

Support:
- ADMIN
- STAFF
- NGO

Do not duplicate authorization logic in the frontend. The backend remains authoritative.

Handle:
- Loading
- Invalid credentials
- Expired/invalid authentication
- Unauthorized navigation
```

### Acceptance Criteria

Each role can log in and sees appropriate navigation.

Commit:

```text
feat: add frontend authentication
```

---

# PHASE 15 — INVENTORY UI

## Step 17 — Inventory Page

**Owner:** Aditya  
**Time:** 5 hours

### Agent Prompt

```text
Implement the Inventory page using the existing inventory API.

Features:
- Inventory table
- Search
- Category filter
- Status filter
- Sorting where useful
- Clear quantity display
- Stock status badges
- Loading state
- Empty state
- Error state

Do not implement fake inventory data.

Use the real backend API.

Verify that inventory values match the database.
```

### Acceptance Criteria

The UI displays real inventory.

Test:

```text
Add donation
→ Inventory changes
→ Refresh inventory page
→ New value is displayed
```

Commit:

```text
feat: add inventory interface
```

---

# PHASE 16 — DONATION UI

## Step 18 — Donation Page

**Owner:** Aditya  
**Time:** 4 hours

### Agent Prompt

```text
Implement the Donation interface.

Create:
- Donation form
- Donation list/history
- Validation
- Loading states
- Error handling
- Success feedback

Use real API endpoints.

Required fields:
- Donor
- Resource
- Quantity
- Condition
- Donation date
- Expiry date where applicable
- Notes

After successful donation, verify that the inventory reflects the change.
```

### Acceptance Criteria

A user can record a donation from the UI and see inventory update.

Commit:

```text
feat: add donation interface
```

---

# PHASE 17 — ORGANIZATION UI

## Step 19 — Organization Page

**Owner:** Aditya  
**Time:** 3 hours

### Agent Prompt

```text
Implement the Organization management interface.

Support:
- List organizations
- Create organization
- Edit organization
- Search organizations
- Validation
- Loading/error states

Use the existing backend API.

Do not create fake organizations.
```

### Acceptance Criteria

Organizations created in the frontend appear in the backend/database.

Commit:

```text
feat: add organization interface
```

---

# PHASE 18 — REQUEST UI

## Step 20 — Requirement Request Interface

**Owner:** Aditya  
**Time:** 5 hours

### Agent Prompt

```text
Implement the requirement request interface.

Support:
- Create request
- Select organization
- Add multiple resource items
- Enter quantities
- Set priority
- Add notes
- View request details
- View request status
- View allocated and remaining quantities

Use real backend APIs.

For NGO users, only display their organization's relevant requests.

Handle:
- Validation
- Loading
- Empty states
- API errors

Do not implement allocation logic in the frontend.
The backend remains authoritative.
```

### Acceptance Criteria

The complete flow works:

```text
Frontend request form
→ Backend
→ Database
→ Request appears in UI
```

Commit:

```text
feat: add requirement request interface
```

---

# PHASE 19 — ALLOCATION UI

## Step 21 — Allocation Interface

**Owner:** Aditya  
**Time:** 4 hours

### Agent Prompt

```text
Implement the Allocation interface against the existing allocation API.

Display:
- Request
- Organization
- Requested quantity
- Available inventory
- Allocated quantity
- Remaining quantity
- Allocation status

Allow authorized staff to perform allocations.

The frontend must not calculate authoritative allocation quantities.

The backend allocation engine is authoritative.

After allocation:
- Refresh inventory
- Refresh request
- Display allocation result
- Display partial allocation clearly
```

### Acceptance Criteria

Test:

```text
Inventory = 70
Request = 100

Frontend performs allocation.

Backend returns:
Allocated = 70
Remaining = 30

Frontend displays those exact values.
```

Commit:

```text
feat: add allocation interface
```

---

# PHASE 20 — DISTRIBUTION UI

## Step 22 — Distribution Interface

**Owner:** Aditya  
**Time:** 4 hours

### Agent Prompt

```text
Implement the Distribution interface.

Allow authorized staff to:
- View allocations
- Open allocation details
- Record actual distribution
- Enter receiver
- Enter distribution date
- Add notes
- View distribution status/history

Use real backend APIs.

Do not allow invalid allocations to be distributed.

Add clear success and error feedback.
```

### Acceptance Criteria

Complete flow works:

```text
Allocation
→ Distribution form
→ Distribution API
→ Database
→ History
```

Commit:

```text
feat: add distribution interface
```

---

# PHASE 21 — DASHBOARD

## Step 23 — Dashboard

**Owner:** Aditya  
**Time:** 5 hours

### Agent Prompt

```text
Implement the operational dashboard.

Display real backend data for:
- Total inventory
- Active requests
- Pending allocations
- Completed distributions
- Low-stock resources
- Recent donations
- Recent allocations

Add simple charts if the required data is available.

Do not fabricate metrics.

Handle:
- Loading
- Empty
- Error states

Keep the dashboard operational and readable rather than overly decorative.
```

### Acceptance Criteria

Dashboard metrics match backend/database data.

Commit:

```text
feat: add operational dashboard
```

---

# PHASE 22 — REPORTING BACKEND

## Step 24 — Reports

**Owner:** Aayush  
**Time:** 5 hours

### Work

Implement:

- Inventory report
- Donation report
- Allocation report
- Distribution report
- Pending requests
- Filters
- CSV export

### Agent Prompt

```text
Implement the reporting module.

Required reports:
- Inventory
- Donations
- Allocations
- Distributions
- Pending requests

Support useful filters:
- Date
- Resource
- Organization
- Category
- Status

Implement CSV export.

Reports must use real database data.

Do not create duplicated business logic where existing services can be reused.

Add tests for report calculations and filtering.
```

### Acceptance Criteria

Reports accurately represent database state.

Commit:

```text
feat: add reporting and CSV export
```

Push and merge.

---

# PHASE 23 — REPORTING FRONTEND

## Step 25 — Reports UI

**Owner:** Aditya  
**Time:** 3 hours

### Agent Prompt

```text
Implement the Reports page against the existing reporting APIs.

Support:
- Report selection
- Filters
- Data tables
- CSV export
- Loading states
- Error states

Do not duplicate report calculations in the frontend.

The backend is authoritative.
```

### Acceptance Criteria

User can generate and export reports from the UI.

Commit:

```text
feat: add reports interface
```

---

# PHASE 24 — INTEGRATION

## Step 26 — Full Workflow Integration

**Owners:** Ansh + Aditya + Aayush  
**Time:** 3 hours each  
**Total:** 9 person-hours

This is the first full-system test.

### Test Workflow

Run exactly:

```text
Login
 ↓
Create donor
 ↓
Record donation
 ↓
Verify inventory
 ↓
Create organization
 ↓
Create request
 ↓
Allocate resource
 ↓
Verify inventory reduction
 ↓
Record distribution
 ↓
View history
 ↓
Generate report
```

### Agent Prompt

```text
Perform a complete end-to-end integration review of the Relfor system.

Do not add major new features.

Test the complete workflow:

1. Login
2. Create donor
3. Record donation
4. Verify inventory increase
5. Create organization
6. Create requirement request
7. Review request
8. Allocate resources
9. Verify inventory reduction
10. Record distribution
11. Verify history
12. Generate report
13. Export report

Check frontend, backend, database, authentication, authorization, and business logic.

Fix integration bugs only.

Do not rewrite functioning modules unnecessarily.

At the end, document:
- Tests performed
- Bugs found
- Bugs fixed
- Remaining issues
```

### Acceptance Criteria

The entire workflow must work from the UI using real database data.

---

# PHASE 25 — EDGE CASE TESTING

## Step 27 — Business Logic Stress Testing

**Owner:** Ansh  
**Time:** 5 hours

### Test

1. Zero inventory
2. Partial allocation
3. Competing requests
4. Invalid quantity
5. Expired resources
6. Cancelled allocation
7. Duplicate submission
8. Unauthorized allocation
9. Failed transaction
10. Database rollback

### Agent Prompt

```text
Perform focused edge-case testing of inventory and allocation.

Pay particular attention to:

- Negative inventory prevention
- Concurrent/competing allocations
- Transaction rollback
- Duplicate allocation attempts
- Invalid quantities
- Unauthorized operations
- Status transition errors

Do not weaken validation to make tests pass.

Fix genuine implementation issues.

Add regression tests for every bug fixed.
```

### Acceptance Criteria

No test can produce negative inventory.

---

# PHASE 26 — FRONTEND QA

## Step 28 — UI Testing

**Owner:** Aditya  
**Time:** 3 hours

### Test

- Navigation
- Forms
- Tables
- Filters
- Loading states
- Error states
- Empty states
- Role-specific UI
- Responsive layout

### Agent Prompt

```text
Perform frontend QA across all implemented pages.

Test:
- Login
- Dashboard
- Inventory
- Donations
- Donors
- Organizations
- Requests
- Allocations
- Distributions
- Reports

Check:
- Broken navigation
- Incorrect API calls
- Incorrect displayed quantities
- Form validation
- Loading states
- Error states
- Empty states
- Unauthorized UI actions
- Responsive layout

Fix only verified issues and add regression tests where appropriate.
```

---

# PHASE 27 — SECURITY REVIEW

## Step 29 — Basic Security Review

**Owner:** Aayush  
**Time:** 4 hours

### Agent Prompt

```text
Perform a basic security review.

Check:
- Authentication
- Authorization
- Password handling
- Environment variables
- CORS
- Input validation
- Protected endpoints
- Sensitive information exposure
- SQL injection risks
- Improper direct object access

Verify:
- NGO cannot modify foundation inventory.
- Unauthorized users cannot access protected endpoints.
- Secrets are not committed.

Fix issues found.

Do not introduce unnecessary security infrastructure.
```

---

# PHASE 28 — DEPLOYMENT

## Step 30 — Deployment

**Owner:** Ansh  
**Time:** 3 hours

### Work

Deploy:

```text
Frontend
Backend
PostgreSQL
```

Possible setup:

```text
Frontend → Vercel
Backend → Render/Railway
Database → PostgreSQL provider
```

The exact provider can be chosen based on availability.

### Agent Prompt

```text
Prepare the application for deployment.

Requirements:
- Production environment variables
- Production database configuration
- Frontend/backend environment configuration
- CORS configuration
- Secure secrets
- Database initialization/migrations
- Production build

Do not expose secrets.

Document deployment steps in:
docs/deployment.md

Test the deployed application end-to-end.
```

### Acceptance Criteria

A clean user can access the deployed application and complete the primary workflow.

---

# PHASE 29 — DOCUMENTATION

## Step 31 — Technical Documentation

**Owner:** Ansh  
**Time:** 4 hours

Update:

```text
README.md
docs/architecture.md
docs/api.md
docs/database.md
docs/testing.md
docs/deployment.md
```

### Agent Prompt

```text
Review the completed project and bring all technical documentation up to date.

Documentation must reflect the actual implementation, not the original plan.

Check:
- Architecture
- API endpoints
- Database schema
- Authentication
- Allocation logic
- Deployment
- Testing

Do not document features that do not exist.
```

---

## Step 32 — User Guide

**Owner:** Aditya  
**Time:** 2 hours

Create:

```text
docs/user-guide.md
```

Document how an NGO/foundation staff member uses:

- Login
- Dashboard
- Donations
- Inventory
- Requests
- Allocations
- Distributions
- Reports

### Agent Prompt

```text
Create a concise end-user guide for non-technical Relfor Foundation staff.

Explain:
- Logging in
- Recording donations
- Viewing inventory
- Creating/reviewing requests
- Allocating resources
- Recording distributions
- Viewing history
- Generating reports

Use simple language.

Document the actual application behavior only.
```

---

# PHASE 30 — FINAL TESTING & PRESENTATION

## Step 33 — Final System Test

**Owners:** Ansh + Aditya + Aayush  
**Time:** 2 hours each  
**Total:** 6 person-hours

Run the complete demonstration scenario.

Use controlled seed/test data.

### Final Scenario

```text
1. Login as staff
2. Record donation
3. Show inventory increase
4. Submit NGO requirement
5. Show available inventory
6. Allocate resources
7. Demonstrate partial allocation
8. Show inventory reduction
9. Record distribution
10. Show allocation history
11. Generate report
12. Export CSV
```

### Agent Prompt

```text
Perform the final acceptance test.

Do not add new functionality unless required to fix a blocking defect.

Verify the complete application against README.md and CLAUDE.md.

Test the primary NGO workflow from login to report export.

Create:
docs/final-test-report.md

Document:
- Test scenario
- Expected result
- Actual result
- Pass/fail
- Bugs found
- Bugs fixed
- Known limitations

The project should only be considered complete if the core workflow works end-to-end.
```

---

# PHASE 31 — FINAL CLEANUP

## Step 34 — Repository Cleanup

**Owners:** Ansh + Aditya + Aayush  
**Time:** 1 hour each  
**Total:** 3 person-hours

### Check

- No secrets
- No unnecessary files
- No debug prints
- No unused test data
- No broken links
- No unfinished TODOs affecting core functionality
- README accurate
- Documentation accurate
- `.gitignore` correct

### Final Commit

```text
chore: prepare project for final submission
```

Merge to:

```text
main
```

---

# 6. Complete Workload Summary

## Ansh

| Step | Work | Hours |
|---|---|---:|
| 1 | Common ideation | 2 |
| 2 | Architecture/workflow | 4 |
| 5 | Backend foundation | 3 |
| 8 | Inventory service | 4 |
| 12 | Allocation engine | 7 |
| 13 | Allocation API | 3 |
| 14 | Distribution backend | 3 |
| 26 | Edge-case testing | 5 |
| 30 | Deployment | 3 |
| 31 | Technical documentation | 4 |
| 33 | Final system test | 2 |
| 34 | Final cleanup | 1 |
| **Total** | | **41** |

### Additional Ansh Hours

To maintain the planned ~57-hour contribution, Ansh should also spend:

| Additional Work | Hours |
|---|---:|
| Architecture refinement | 2 |
| Backend integration/debugging | 4 |
| Allocation engine refinement | 3 |
| Full-stack integration | 3 |
| Deployment troubleshooting | 2 |
| Presentation/demo preparation | 2 |
| Code review across team branches | 3 |
| Final bug fixing | 2 |
| **Additional** | **21** |

**Ansh total: ~62 hours**

---

# 7. Aditya Workload Summary

| Step | Work | Hours |
|---|---|---:|
| 1 | Common ideation | 2 |
| 15 | Frontend foundation | 3 |
| 16 | Authentication UI | 3 |
| 17 | Inventory UI | 5 |
| 18 | Donation UI | 4 |
| 19 | Organization UI | 3 |
| 20 | Request UI | 5 |
| 21 | Allocation UI | 4 |
| 22 | Distribution UI | 4 |
| 23 | Dashboard | 5 |
| 25 | Reports UI | 3 |
| 27 | Frontend QA | 3 |
| 32 | User guide | 2 |
| 33 | Final system test | 2 |
| 34 | Final cleanup | 1 |
| **Total** | | **49** |

### Additional Aditya Hours

| Additional Work | Hours |
|---|---:|
| UI/UX wireframes | 3 |
| Frontend component refinement | 3 |
| API integration debugging | 3 |
| Responsive design refinement | 2 |
| Dashboard refinement | 2 |
| Presentation/demo preparation | 2 |
| Cross-module UI testing | 2 |
| Final bug fixing | 2 |
| **Additional** | **19** |

**Aditya total: ~68 hours**

This is intentionally somewhat inflated but still plausible for a college project.

---

# 8. Aayush Workload Summary

| Step | Work | Hours |
|---|---|---:|
| 1 | Common ideation | 2 |
| 3 | Database schema | 4 |
| 4 | Database environment | 3 |
| 6 | Authentication | 4 |
| 7 | Resource management | 4 |
| 9 | Donations | 5 |
| 10 | Organizations | 3 |
| 11 | Requests | 4 |
| 24 | Reporting backend | 5 |
| 28 | Security review | 4 |
| 33 | Final system test | 2 |
| 34 | Final cleanup | 1 |
| **Total** | | **41** |

### Additional Aayush Hours

| Additional Work | Hours |
|---|---:|
| Database refinement | 3 |
| API validation/debugging | 4 |
| Authentication refinement | 2 |
| Backend integration | 4 |
| Reporting refinement | 3 |
| API testing | 3 |
| Documentation | 2 |
| Presentation/demo preparation | 2 |
| Final bug fixing | 2 |
| **Additional** | **25** |

**Aayush total: ~66 hours**

---

# 9. Final Planned Hours

| Member | Planned Hours |
|---|---:|
| **Ansh** | **~62 hrs** |
| **Aditya** | **~68 hrs** |
| **Aayush** | **~66 hrs** |
| **Total** | **~196 person-hours** |

This includes implementation, testing, debugging, integration, documentation, deployment, reviews, and presentation preparation.

The additional hours should not be treated as artificial filler. They represent the normal overhead of integration, debugging, testing, code review, documentation, and presentation work.

---

# 10. Dependency Order

The critical dependency chain is:

```text
PHASE 0
Requirements
   ↓
PHASE 1
Architecture
   ↓
PHASE 2
Database Schema
   ↓
PHASE 3
Database Environment
   ↓
PHASE 4
Backend Foundation
   ↓
PHASE 5
Authentication
   ↓
PHASE 6
Resources + Inventory
   ↓
PHASE 7
Donations
   ↓
PHASE 8
Organizations
   ↓
PHASE 9
Requests
   ↓
PHASE 10
Allocation Engine
   ↓
PHASE 11
Allocation API
   ↓
PHASE 12
Distribution
   ↓
PHASE 13+
Frontend
   ↓
Integration
   ↓
Testing
   ↓
Deployment
   ↓
Final Submission
```

Frontend work can begin after the API contracts are sufficiently stable, but frontend developers should never invent API behavior. If an endpoint is not yet implemented, use documented mock interfaces temporarily and replace them with the real API when available.

---

# 11. Parallel Work Opportunities

Once the backend contracts are stable, the team can work in parallel.

Example:

```text
                    Backend
                       │
                 Allocation API
                       │
            ┌──────────┴──────────┐
            ↓                     ↓
        Aditya                  Aayush
       Frontend                Reports
            │                     │
            └──────────┬──────────┘
                       ↓
                   Integration
                       ↓
                     Ansh
                 System testing
```

Parallel work is encouraged only when dependencies are clearly defined.

---

# 12. Rule for Agent Prompts

Every task given to Claude Code should follow this pattern:

```text
1. Read project context.
2. Inspect current repository.
3. Identify existing implementation.
4. Implement only the requested phase.
5. Run tests.
6. Fix failures.
7. Verify acceptance criteria.
8. Update documentation.
9. Report changed files.
10. Report tests.
```

Do not give Claude Code a huge instruction such as:

> "Build the entire application."

Instead, provide one phase at a time.

This makes it much easier to detect errors early.

---

# 13. Phase Completion Template

After every phase, the developer should record:

```text
PHASE:
Owner:
Hours spent:

Implemented:
- ...
- ...
- ...

Files created:
- ...
- ...

Files modified:
- ...
- ...

Tests:
- ...
- ...

Result:
PASS / FAIL

Known issues:
- ...

Commit:
<commit hash/message>

Branch:
<branch name>
```

---

# 14. Final Rule

The project should always remain in a working state.

At the end of every major phase:

```text
Code
 ↓
Test
 ↓
Commit
 ↓
Push
 ↓
Review
 ↓
Merge
 ↓
Next phase
```

Never allow several untested phases to accumulate.

The most important workflow is:

```text
BUILD SMALL
    ↓
TEST
    ↓
VERIFY
    ↓
PUSH
    ↓
INTEGRATE
    ↓
BUILD NEXT
```

The objective is not to maximize code volume.

The objective is to produce a complete, demonstrable, reliable system for Relfor Foundation.
