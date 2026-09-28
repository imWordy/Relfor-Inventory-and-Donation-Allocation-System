-- ============================================================================
-- Relfor Inventory & Donation Allocation System
-- Phase 2: Database Schema DDL
-- Database: PostgreSQL 14+
-- ============================================================================

-- Enable pgcrypto extension for UUID generation if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Trigger Function: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. ORGANIZATIONS TABLE
-- Represents beneficiary organizations (NGOs, orphanages, shelters, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('NGO', 'SHELTER', 'ORPHANAGE', 'COMMUNITY_GROUP', 'DISASTER_RELIEF', 'OTHER')),
    registration_number VARCHAR(100),
    contact_person VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. USERS TABLE
-- Stores system users with role-based access (ADMIN, STAFF, NGO)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'NGO')),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_ngo_user_org CHECK (
        (role = 'NGO' AND organization_id IS NOT NULL) OR
        (role IN ('ADMIN', 'STAFF'))
    )
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. DONORS TABLE
-- Records individual, corporate, or institutional donors
-- ============================================================================
CREATE TABLE IF NOT EXISTS donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('INDIVIDUAL', 'CORPORATE', 'FOUNDATION', 'GOVERNMENT', 'OTHER')),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_donors_updated_at
BEFORE UPDATE ON donors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. RESOURCES TABLE
-- Catalog of relief items and current inventory counts
-- ============================================================================
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('FOOD', 'MEDICAL', 'CLOTHING', 'SHELTER', 'EDUCATION', 'HYGIENE', 'OTHER')),
    unit VARCHAR(50) NOT NULL, -- e.g., kg, packets, boxes, pieces, sets, liters
    description TEXT,
    minimum_stock INTEGER NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
    current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_resources_updated_at
BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. DONATIONS TABLE
-- Tracks intake of resources from donors into inventory
-- ============================================================================
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE RESTRICT,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    condition VARCHAR(30) NOT NULL CHECK (condition IN ('NEW', 'GOOD', 'FAIR')),
    donation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE,
    notes TEXT,
    received_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_donations_updated_at
BEFORE UPDATE ON donations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. REQUESTS TABLE
-- Resource requirement requests submitted by or for organizations
-- ============================================================================
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    requested_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PARTIALLY_ALLOCATED', 'ALLOCATED', 'COMPLETED', 'REJECTED', 'CANCELLED')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_requests_updated_at
BEFORE UPDATE ON requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. REQUEST_ITEMS TABLE
-- Line items within a requirement request specifying quantity needed
-- ============================================================================
CREATE TABLE IF NOT EXISTS request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
    requested_quantity INTEGER NOT NULL CHECK (requested_quantity > 0),
    allocated_quantity INTEGER NOT NULL DEFAULT 0 CHECK (allocated_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_allocated_le_requested CHECK (allocated_quantity <= requested_quantity),
    CONSTRAINT uq_request_resource UNIQUE (request_id, resource_id)
);

CREATE TRIGGER trg_request_items_updated_at
BEFORE UPDATE ON request_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. ALLOCATIONS TABLE
-- Represents decision to assign available inventory to fulfill a request
-- ============================================================================
CREATE TABLE IF NOT EXISTS allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE RESTRICT,
    allocated_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_DISTRIBUTION' CHECK (status IN ('PENDING_DISTRIBUTION', 'DISTRIBUTED', 'CANCELLED')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_allocations_updated_at
BEFORE UPDATE ON allocations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. ALLOCATION_ITEMS TABLE
-- Line items detailing the specific resource quantities allocated
-- ============================================================================
CREATE TABLE IF NOT EXISTS allocation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID NOT NULL REFERENCES allocations(id) ON DELETE CASCADE,
    request_item_id UUID NOT NULL REFERENCES request_items(id) ON DELETE RESTRICT,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
    allocated_quantity INTEGER NOT NULL CHECK (allocated_quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_allocation_request_item UNIQUE (allocation_id, request_item_id)
);

CREATE TRIGGER trg_allocation_items_updated_at
BEFORE UPDATE ON allocation_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. DISTRIBUTIONS TABLE
-- Records actual physical handover of resources from an allocation
-- ============================================================================
CREATE TABLE IF NOT EXISTS distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID NOT NULL UNIQUE REFERENCES allocations(id) ON DELETE RESTRICT,
    distributed_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    distribution_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    received_by VARCHAR(150) NOT NULL,
    receiver_contact VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_distributions_updated_at
BEFORE UPDATE ON distributions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PERFORMANCE & LOOKUP INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);

CREATE INDEX IF NOT EXISTS idx_donors_name ON donors(name);
CREATE INDEX IF NOT EXISTS idx_donors_type ON donors(type);

CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_name ON resources(name);

CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_resource ON donations(resource_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);

CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);

CREATE INDEX IF NOT EXISTS idx_requests_org ON requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_requests_user ON requests(requested_by_user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_priority ON requests(priority);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at);

CREATE INDEX IF NOT EXISTS idx_request_items_request ON request_items(request_id);
CREATE INDEX IF NOT EXISTS idx_request_items_resource ON request_items(resource_id);

CREATE INDEX IF NOT EXISTS idx_allocations_request ON allocations(request_id);
CREATE INDEX IF NOT EXISTS idx_allocations_user ON allocations(allocated_by_user_id);
CREATE INDEX IF NOT EXISTS idx_allocations_status ON allocations(status);

CREATE INDEX IF NOT EXISTS idx_allocation_items_allocation ON allocation_items(allocation_id);
CREATE INDEX IF NOT EXISTS idx_allocation_items_request_item ON allocation_items(request_item_id);
CREATE INDEX IF NOT EXISTS idx_allocation_items_resource ON allocation_items(resource_id);

CREATE INDEX IF NOT EXISTS idx_distributions_allocation ON distributions(allocation_id);
CREATE INDEX IF NOT EXISTS idx_distributions_user ON distributions(distributed_by_user_id);
CREATE INDEX IF NOT EXISTS idx_distributions_date ON distributions(distribution_date);
