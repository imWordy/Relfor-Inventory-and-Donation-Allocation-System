import csv
import io
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List, Dict, Any
from datetime import datetime, date

from app.models.resource import Resource
from app.models.donation import Donation, Donor
from app.models.allocation import Allocation
from app.models.allocation_item import AllocationItem
from app.models.distribution import Distribution
from app.models.request import Request
from app.models.request_item import RequestItem
from app.models.organization import Organization
from app.schemas.report import (
    InventoryReportResponse,
    InventoryReportItem,
    DonationReportResponse,
    DonationReportItem,
    AllocationReportResponse,
    AllocationReportItem,
    DistributionReportResponse,
    DistributionReportItem,
    PendingRequestReportResponse,
    PendingRequestReportItem,
)

def get_inventory_report(
    db: Session,
    category: Optional[str] = None,
    status_filter: Optional[str] = None
) -> InventoryReportResponse:
    query = db.query(Resource)
    if category:
        query = query.filter(func.upper(Resource.category) == category.upper().strip())

    resources = query.order_by(Resource.name.asc()).all()

    items: List[InventoryReportItem] = []
    low_stock = 0
    out_of_stock = 0
    total_units = 0

    for r in resources:
        if r.current_stock == 0:
            st = "OUT_OF_STOCK"
            out_of_stock += 1
        elif r.current_stock <= r.minimum_stock:
            st = "LOW_STOCK"
            low_stock += 1
        else:
            st = "AVAILABLE"

        if status_filter and st != status_filter.upper().strip():
            continue

        total_units += r.current_stock
        items.append(
            InventoryReportItem(
                resource_id=r.id,
                name=r.name,
                category=r.category,
                unit=r.unit,
                current_stock=r.current_stock,
                minimum_stock=r.minimum_stock,
                status=st,
            )
        )

    return InventoryReportResponse(
        total_resources=len(items),
        total_units_in_stock=total_units,
        low_stock_count=low_stock,
        out_of_stock_count=out_of_stock,
        items=items,
    )

def generate_inventory_csv(report: InventoryReportResponse) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Resource ID", "Resource Name", "Category", "Unit", "Current Stock", "Minimum Stock", "Status"])
    for item in report.items:
        writer.writerow([
            str(item.resource_id),
            item.name,
            item.category,
            item.unit,
            item.current_stock,
            item.minimum_stock,
            item.status,
        ])
    return output.getvalue()

def get_donation_report(
    db: Session,
    category: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> DonationReportResponse:
    query = db.query(Donation).join(Donor).join(Resource)

    if category:
        query = query.filter(func.upper(Resource.category) == category.upper().strip())
    if start_date:
        query = query.filter(Donation.donation_date >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.filter(Donation.donation_date <= datetime.combine(end_date, datetime.max.time()))

    donations = query.order_by(Donation.donation_date.desc()).all()

    items: List[DonationReportItem] = []
    total_qty = 0
    for d in donations:
        total_qty += d.quantity
        items.append(
            DonationReportItem(
                donation_id=d.id,
                donor_name=d.donor.name,
                donor_type=d.donor.type,
                resource_name=d.resource.name,
                category=d.resource.category,
                quantity=d.quantity,
                unit=d.resource.unit,
                condition=d.condition,
                donation_date=d.donation_date,
            )
        )

    return DonationReportResponse(
        total_donations=len(items),
        total_quantity_donated=total_qty,
        items=items,
    )

def generate_donation_csv(report: DonationReportResponse) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Donation ID", "Donor Name", "Donor Type", "Resource Name", "Category", "Quantity", "Unit", "Condition", "Donation Date"])
    for item in report.items:
        writer.writerow([
            str(item.donation_id),
            item.donor_name,
            item.donor_type,
            item.resource_name,
            item.category,
            item.quantity,
            item.unit,
            item.condition,
            item.donation_date.isoformat(),
        ])
    return output.getvalue()

def get_allocation_report(
    db: Session,
    status_filter: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> AllocationReportResponse:
    query = db.query(AllocationItem).join(Allocation).join(Request).join(Organization).join(Resource)

    if status_filter:
        query = query.filter(func.upper(Allocation.status) == status_filter.upper().strip())
    if start_date:
        query = query.filter(Allocation.created_at >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.filter(Allocation.created_at <= datetime.combine(end_date, datetime.max.time()))

    alloc_items = query.order_by(Allocation.created_at.desc()).all()

    items: List[AllocationReportItem] = []
    total_qty = 0
    for ai in alloc_items:
        total_qty += ai.allocated_quantity
        items.append(
            AllocationReportItem(
                allocation_id=ai.allocation_id,
                request_id=ai.allocation.request_id,
                organization_name=ai.allocation.request.organization.name,
                resource_name=ai.resource.name,
                allocated_quantity=ai.allocated_quantity,
                unit=ai.resource.unit,
                status=ai.allocation.status,
                allocated_at=ai.allocation.created_at,
            )
        )

    return AllocationReportResponse(
        total_allocations=len(items),
        total_quantity_allocated=total_qty,
        items=items,
    )

def generate_allocation_csv(report: AllocationReportResponse) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Allocation ID", "Request ID", "Organization", "Resource Name", "Allocated Quantity", "Unit", "Status", "Allocated Date"])
    for item in report.items:
        writer.writerow([
            str(item.allocation_id),
            str(item.request_id),
            item.organization_name,
            item.resource_name,
            item.allocated_quantity,
            item.unit,
            item.status,
            item.allocated_at.isoformat(),
        ])
    return output.getvalue()

def get_distribution_report(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> DistributionReportResponse:
    query = db.query(Distribution).join(Allocation).join(Request).join(Organization)

    if start_date:
        query = query.filter(Distribution.distribution_date >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.filter(Distribution.distribution_date <= datetime.combine(end_date, datetime.max.time()))

    distributions = query.order_by(Distribution.distribution_date.desc()).all()

    items: List[DistributionReportItem] = []
    for dist in distributions:
        items.append(
            DistributionReportItem(
                distribution_id=dist.id,
                allocation_id=dist.allocation_id,
                organization_name=dist.allocation.request.organization.name,
                received_by=dist.received_by,
                receiver_contact=dist.receiver_contact,
                distribution_date=dist.distribution_date,
                notes=dist.notes,
            )
        )

    return DistributionReportResponse(
        total_distributions=len(items),
        items=items,
    )

def generate_distribution_csv(report: DistributionReportResponse) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Distribution ID", "Allocation ID", "Organization", "Received By", "Contact", "Distribution Date", "Notes"])
    for item in report.items:
        writer.writerow([
            str(item.distribution_id),
            str(item.allocation_id),
            item.organization_name,
            item.received_by,
            item.receiver_contact or "",
            item.distribution_date.isoformat(),
            item.notes or "",
        ])
    return output.getvalue()

def get_pending_requests_report(
    db: Session,
    priority: Optional[str] = None
) -> PendingRequestReportResponse:
    query = db.query(RequestItem).join(Request).join(Organization).join(Resource).filter(
        Request.status.in_(["PENDING", "PARTIALLY_ALLOCATED"])
    )

    if priority:
        query = query.filter(func.upper(Request.priority) == priority.upper().strip())

    req_items = query.order_by(Request.created_at.desc()).all()

    items: List[PendingRequestReportItem] = []
    for ri in req_items:
        items.append(
            PendingRequestReportItem(
                request_id=ri.request_id,
                organization_name=ri.request.organization.name,
                priority=ri.request.priority,
                status=ri.request.status,
                resource_name=ri.resource.name,
                requested_quantity=ri.requested_quantity,
                allocated_quantity=ri.allocated_quantity,
                remaining_quantity=ri.requested_quantity - ri.allocated_quantity,
                created_at=ri.request.created_at,
            )
        )

    return PendingRequestReportResponse(
        total_pending_requests=len(items),
        items=items,
    )

def generate_pending_requests_csv(report: PendingRequestReportResponse) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Request ID", "Organization", "Priority", "Status", "Resource Name", "Requested Quantity", "Allocated Quantity", "Remaining Quantity", "Created At"])
    for item in report.items:
        writer.writerow([
            str(item.request_id),
            item.organization_name,
            item.priority,
            item.status,
            item.resource_name,
            item.requested_quantity,
            item.allocated_quantity,
            item.remaining_quantity,
            item.created_at.isoformat(),
        ])
    return output.getvalue()
