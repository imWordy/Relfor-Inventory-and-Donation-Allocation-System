-- ============================================================================
-- Relfor Inventory & Donation Allocation System
-- Phase 3: Database Seed Data
-- ============================================================================

-- Clean up any existing data in reverse order of foreign key dependencies
DELETE FROM distributions;
DELETE FROM allocation_items;
DELETE FROM allocations;
DELETE FROM request_items;
DELETE FROM requests;
DELETE FROM donations;
DELETE FROM resources;
DELETE FROM donors;
DELETE FROM users;
DELETE FROM organizations;

-- ============================================================================
-- 1. ORGANIZATIONS
-- ============================================================================
INSERT INTO organizations (id, name, type, registration_number, contact_person, phone, email, address, is_verified) VALUES
('11111111-0000-0000-0000-000000000001', 'Care India Relief Foundation', 'NGO', 'MH/2018/0014291', 'Meera Sen', '+91 98201 11223', 'meera@careindia.org', 'Plot 42, Sector 18, Vashi, Navi Mumbai, MH', TRUE),
('11111111-0000-0000-0000-000000000002', 'Hope Children Orphanage', 'ORPHANAGE', 'MH/2015/0009812', 'Rajesh Gupta', '+91 98202 22334', 'rajesh@hopeorphanage.org', '12 Anand Nagar, Kothrud, Pune, MH', TRUE),
('11111111-0000-0000-0000-000000000003', 'Shelter for All Society', 'SHELTER', 'MH/2020/0034112', 'Anita Sharma', '+91 98203 33445', 'anita@shelterforall.org', '88 Camp Area, Pune Cantonment, Pune, MH', TRUE),
('11111111-0000-0000-0000-000000000004', 'Uttarakhand Disaster Relief Unit', 'DISASTER_RELIEF', 'UK/2021/0004521', 'Vikram Singh', '+91 98204 44556', 'vikram@ukrelief.org', 'Hill View Compound, Dehradun, UK', TRUE),
('11111111-0000-0000-0000-000000000005', 'Jan Kalyan Community Center', 'COMMUNITY_GROUP', 'MH/2019/0021334', 'Sunita Verma', '+91 98205 55667', 'sunita@jankalyan.org', 'Station Road, Hadapsar, Pune, MH', TRUE);

-- ============================================================================
-- 2. USERS
-- Default test password for all seeded users: Password123!
-- Bcrypt hash: $2b$12$e80yV8B59oK8/9qGfRrq3.V4zJ1R941Wj59mZ8W8yK9x0nN0lH1eW
-- ============================================================================
INSERT INTO users (id, email, password_hash, full_name, role, organization_id, is_active) VALUES
('22222222-0000-0000-0000-000000000001', 'admin@relfor.org', '$2b$12$e80yV8B59oK8/9qGfRrq3.V4zJ1R941Wj59mZ8W8yK9x0nN0lH1eW', 'Foundation Admin', 'ADMIN', NULL, TRUE),
('22222222-0000-0000-0000-000000000002', 'ansh@relfor.org', '$2b$12$e80yV8B59oK8/9qGfRrq3.V4zJ1R941Wj59mZ8W8yK9x0nN0lH1eW', 'Ansh Saini', 'STAFF', NULL, TRUE),
('22222222-0000-0000-0000-000000000003', 'aayush@relfor.org', '$2b$12$e80yV8B59oK8/9qGfRrq3.V4zJ1R941Wj59mZ8W8yK9x0nN0lH1eW', 'Aayush Kumar', 'STAFF', NULL, TRUE),
('22222222-0000-0000-0000-000000000004', 'meera@careindia.org', '$2b$12$e80yV8B59oK8/9qGfRrq3.V4zJ1R941Wj59mZ8W8yK9x0nN0lH1eW', 'Meera Sen', 'NGO', '11111111-0000-0000-0000-000000000001', TRUE),
('22222222-0000-0000-0000-000000000005', 'rajesh@hopeorphanage.org', '$2b$12$e80yV8B59oK8/9qGfRrq3.V4zJ1R941Wj59mZ8W8yK9x0nN0lH1eW', 'Rajesh Gupta', 'NGO', '11111111-0000-0000-0000-000000000002', TRUE),
('22222222-0000-0000-0000-000000000006', 'anita@shelterforall.org', '$2b$12$e80yV8B59oK8/9qGfRrq3.V4zJ1R941Wj59mZ8W8yK9x0nN0lH1eW', 'Anita Sharma', 'NGO', '11111111-0000-0000-0000-000000000003', TRUE),
('22222222-0000-0000-0000-000000000007', 'vikram@ukrelief.org', '$2b$12$e80yV8B59oK8/9qGfRrq3.V4zJ1R941Wj59mZ8W8yK9x0nN0lH1eW', 'Vikram Singh', 'NGO', '11111111-0000-0000-0000-000000000004', TRUE);

-- ============================================================================
-- 3. DONORS
-- ============================================================================
INSERT INTO donors (id, name, type, email, phone, address) VALUES
('33333333-0000-0000-0000-000000000001', 'Tata Philanthropy Trust', 'CORPORATE', 'contact@tatatrusts.org', '+91 22 6665 8282', 'Bombay House, Homi Mody Street, Mumbai, MH'),
('33333333-0000-0000-0000-000000000002', 'Infosys Foundation Relief Wing', 'FOUNDATION', 'foundation@infosys.com', '+91 80 2852 0261', 'Electronics City, Hosur Road, Bangalore, KA'),
('33333333-0000-0000-0000-000000000003', 'Dr. Rameshwar Dayal', 'INDIVIDUAL', 'r.dayal@medcare.org', '+91 94120 44551', 'Civil Lines, Jaipur, RJ'),
('33333333-0000-0000-0000-000000000004', 'Apex Healthcare CSR Division', 'CORPORATE', 'csr@apexhealthcare.in', '+91 11 4152 7700', 'Barakhamba Road, Connaught Place, New Delhi'),
('33333333-0000-0000-0000-000000000005', 'Priya and Anand Nair', 'INDIVIDUAL', 'anand.nair@gmail.com', '+91 98450 11992', 'Indiranagar, Bangalore, KA');

-- ============================================================================
-- 4. RESOURCES (INVENTORY CATALOG)
-- ============================================================================
INSERT INTO resources (id, name, category, unit, description, minimum_stock, current_stock) VALUES
('44444444-0000-0000-0000-000000000001', 'Sona Masoori Rice', 'FOOD', 'kg', 'Premium non-basmati rice packed in 25kg bags', 500, 1250),
('44444444-0000-0000-0000-000000000002', 'Toor Dal (Pulses)', 'FOOD', 'kg', 'Unpolished protein-rich pigeon peas', 200, 450),
('44444444-0000-0000-0000-000000000003', 'Fortified Cooking Oil', 'FOOD', 'liters', 'Vitamin A and D fortified refined sunflower oil in 5L cans', 100, 320),
('44444444-0000-0000-0000-000000000004', 'First Aid Emergency Kits', 'MEDICAL', 'boxes', 'Includes antiseptics, sterile bandages, gauze, tape, scissors', 50, 85),
('44444444-0000-0000-0000-000000000005', 'Paracetamol and Essential Medical Pack', 'MEDICAL', 'packets', 'Over-the-counter pain, fever and oral rehydration salts', 100, 250),
('44444444-0000-0000-0000-000000000006', 'Thermal Woolen Blankets', 'CLOTHING', 'pieces', 'Double-layer winter relief fleece blankets', 150, 280),
('44444444-0000-0000-0000-000000000007', 'Heavy-Duty Tarpaulin Sheets (12x18ft)', 'SHELTER', 'pieces', 'Waterproof UV-resistant polyethylene shelter covers', 40, 65),
('44444444-0000-0000-0000-000000000008', 'Student Educational Kits', 'EDUCATION', 'sets', 'Stationery, notebooks, geometry box, and school bag', 100, 175),
('44444444-0000-0000-0000-000000000009', 'Sanitary and Hygiene Care Packets', 'HYGIENE', 'packets', 'Soaps, sanitary pads, toothbrushes, toothpaste, sanitizers', 150, 390),
('44444444-0000-0000-0000-000000000010', 'Water Purification Tablets (100 tabs)', 'HYGIENE', 'boxes', 'Chlorine dioxide water purification tablets for emergency potable water', 80, 140);

-- ============================================================================
-- 5. DONATIONS
-- ============================================================================
INSERT INTO donations (id, donor_id, resource_id, quantity, condition, donation_date, expiry_date, notes, received_by_user_id) VALUES
('55555555-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 1000, 'NEW', CURRENT_TIMESTAMP - INTERVAL '20 days', NULL, 'Monsoon relief consignment', '22222222-0000-0000-0000-000000000002'),
('55555555-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000002', 500, 'NEW', CURRENT_TIMESTAMP - INTERVAL '20 days', NULL, 'High quality pulses batch', '22222222-0000-0000-0000-000000000002'),
('55555555-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000006', 330, 'NEW', CURRENT_TIMESTAMP - INTERVAL '15 days', NULL, 'Winter drive donation from CSR initiative', '22222222-0000-0000-0000-000000000003'),
('55555555-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000004', 105, 'NEW', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE + INTERVAL '365 days', 'First response medical supplies', '22222222-0000-0000-0000-000000000003'),
('55555555-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000007', 100, 'NEW', CURRENT_TIMESTAMP - INTERVAL '8 days', NULL, 'Waterproof emergency tarpaulins', '22222222-0000-0000-0000-000000000002'),
('55555555-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000008', 225, 'NEW', CURRENT_TIMESTAMP - INTERVAL '5 days', NULL, 'School kit contribution for underprivileged students', '22222222-0000-0000-0000-000000000003');

-- ============================================================================
-- 6. REQUESTS & 7. REQUEST_ITEMS
-- ============================================================================
-- Request 1: Care India Relief - Fully Allocated & Completed (Distributed)
INSERT INTO requests (id, organization_id, requested_by_user_id, priority, status, notes, created_at) VALUES
('66666666-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000004', 'URGENT', 'COMPLETED', 'Emergency flash flood relief packet for 50 families', CURRENT_TIMESTAMP - INTERVAL '12 days');

INSERT INTO request_items (id, request_id, resource_id, requested_quantity, allocated_quantity) VALUES
('77777777-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 200, 200),
('77777777-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000006', 50, 50);

-- Request 2: Hope Children Orphanage - Fully Allocated (Pending Handover)
INSERT INTO requests (id, organization_id, requested_by_user_id, priority, status, notes, created_at) VALUES
('66666666-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000005', 'HIGH', 'ALLOCATED', 'Term start requirements for resident children', CURRENT_TIMESTAMP - INTERVAL '6 days');

INSERT INTO request_items (id, request_id, resource_id, requested_quantity, allocated_quantity) VALUES
('77777777-0000-0000-0000-000000000003', '66666666-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000008', 50, 50),
('77777777-0000-0000-0000-000000000004', '66666666-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000002', 50, 50);

-- Request 3: Uttarakhand Disaster Relief - Partially Allocated (Inventory Constraint Example)
INSERT INTO requests (id, organization_id, requested_by_user_id, priority, status, notes, created_at) VALUES
('66666666-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000007', 'URGENT', 'PARTIALLY_ALLOCATED', 'Landslide displacement camp immediate assistance', CURRENT_TIMESTAMP - INTERVAL '3 days');

INSERT INTO request_items (id, request_id, resource_id, requested_quantity, allocated_quantity) VALUES
('77777777-0000-0000-0000-000000000005', '66666666-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000007', 50, 35),
('77777777-0000-0000-0000-000000000006', '66666666-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000004', 40, 20);

-- Request 4: Shelter for All Society - Fresh PENDING Request
INSERT INTO requests (id, organization_id, requested_by_user_id, priority, status, notes, created_at) VALUES
('66666666-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 'MEDIUM', 'PENDING', 'Monthly ration requirements for night shelter residents', CURRENT_TIMESTAMP - INTERVAL '1 day');

INSERT INTO request_items (id, request_id, resource_id, requested_quantity, allocated_quantity) VALUES
('77777777-0000-0000-0000-000000000007', '66666666-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000001', 150, 0),
('77777777-0000-0000-0000-000000000008', '66666666-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000003', 50, 0),
('77777777-0000-0000-0000-000000000009', '66666666-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000006', 40, 0);

-- ============================================================================
-- 8. ALLOCATIONS & 9. ALLOCATION_ITEMS
-- ============================================================================
-- Allocation 1 for Request 1 (Completed & Distributed)
INSERT INTO allocations (id, request_id, allocated_by_user_id, status, notes, created_at) VALUES
('88888888-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'DISTRIBUTED', 'Approved in full for flood relief', CURRENT_TIMESTAMP - INTERVAL '11 days');

INSERT INTO allocation_items (id, allocation_id, request_item_id, resource_id, allocated_quantity) VALUES
('99999999-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 200),
('99999999-0000-0000-0000-000000000002', '88888888-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000006', 50);

-- Allocation 2 for Request 2 (Ready for Pickup)
INSERT INTO allocations (id, request_id, allocated_by_user_id, status, notes, created_at) VALUES
('88888888-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', 'PENDING_DISTRIBUTION', 'Allocated and packed at Central Warehouse', CURRENT_TIMESTAMP - INTERVAL '5 days');

INSERT INTO allocation_items (id, allocation_id, request_item_id, resource_id, allocated_quantity) VALUES
('99999999-0000-0000-0000-000000000003', '88888888-0000-0000-0000-000000000002', '77777777-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000008', 50),
('99999999-0000-0000-0000-000000000004', '88888888-0000-0000-0000-000000000002', '77777777-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000002', 50);

-- Allocation 3 for Request 3 (Partial fulfillment due to available stock)
INSERT INTO allocations (id, request_id, allocated_by_user_id, status, notes, created_at) VALUES
('88888888-0000-0000-0000-000000000003', '66666666-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000002', 'PENDING_DISTRIBUTION', 'Partial allocation due to remaining stock reserve', CURRENT_TIMESTAMP - INTERVAL '2 days');

INSERT INTO allocation_items (id, allocation_id, request_item_id, resource_id, allocated_quantity) VALUES
('99999999-0000-0000-0000-000000000005', '88888888-0000-0000-0000-000000000003', '77777777-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000007', 35),
('99999999-0000-0000-0000-000000000006', '88888888-0000-0000-0000-000000000003', '77777777-0000-0000-0000-000000000006', '44444444-0000-0000-0000-000000000004', 20);

-- ============================================================================
-- 10. DISTRIBUTIONS
-- ============================================================================
INSERT INTO distributions (id, allocation_id, distributed_by_user_id, distribution_date, received_by, receiver_contact, notes) VALUES
('aaaaaaaa-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - INTERVAL '10 days', 'Meera Sen', '+91 98201 11223', 'Handed over at Central Foundation Warehouse, Pune. Receipt #DIST-2026-001 signed.');
