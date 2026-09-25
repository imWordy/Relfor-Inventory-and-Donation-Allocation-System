# Problem Statement

## Existing Problem
Relfor Foundation receives donated resources that need to be distributed to NGOs and beneficiaries. Currently, the process of identifying available resources, tracking quantities, matching requirements with inventory, and maintaining allocation records is manual and difficult. This leads to duplicate allocations, untracked distributions, difficulty identifying pending requirements, and manual errors in inventory counts.

## Proposed Solution
A centralized web-based Relfor Inventory & Donation Allocation System. The system connects Donations → Inventory → Requirements → Allocations → Distributions → History. It ensures reliable resource tracking and provides role-based access for Admins, Staff, and NGOs to manage the entire lifecycle.

## Stakeholders
- Relfor Foundation Administrators
- Relfor Foundation Staff
- NGOs and Beneficiary Representatives
- Donors (indirectly)

## User Roles
- **Admin**: Full access to the system, user management, and configuration.
- **Staff**: Day-to-day operations, recording donations, processing requirements, and distributions.
- **NGO / Beneficiary Representative**: Restricted access to view profile, submit requests, and check allocation status.

## Core Workflows
1. **Donation Intake**: Record new incoming resources and update inventory.
2. **Requirement Submission**: NGOs request resources they need.
3. **Allocation**: Staff matches inventory against requests and allocates (partially or fully).
4. **Distribution**: Actual handover of resources is recorded.
5. **Reporting**: Dashboard and historical tracking of all movements.

## Assumptions
- Each resource type has a defined unit of measurement.
- NGOs only have access to view and manage their own requests.
- Foundation staff makes the final decision on priority and allocation amount.
