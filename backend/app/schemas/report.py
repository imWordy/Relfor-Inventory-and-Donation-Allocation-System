from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Optional, List
from datetime import datetime, date

class InventoryReportItem(BaseModel):
    resource_id: UUID
    name: str
    category: str
    unit: str
    current_stock: int
    minimum_stock: int
    status: str  # AVAILABLE, LOW_STOCK, OUT_OF_STOCK

    model_config = ConfigDict(from_attributes=True)

class InventoryReportResponse(BaseModel):
    total_resources: int
    total_units_in_stock: int
    low_stock_count: int
    out_of_stock_count: int
    items: List[InventoryReportItem]

class DonationReportItem(BaseModel):
    donation_id: UUID
    donor_name: str
    donor_type: str
    resource_name: str
    category: str
    quantity: int
    unit: str
    condition: str
    donation_date: datetime

    model_config = ConfigDict(from_attributes=True)

class DonationReportResponse(BaseModel):
    total_donations: int
    total_quantity_donated: int
    items: List[DonationReportItem]

class AllocationReportItem(BaseModel):
    allocation_id: UUID
    request_id: UUID
    organization_name: str
    resource_name: str
    allocated_quantity: int
    unit: str
    status: str
    allocated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AllocationReportResponse(BaseModel):
    total_allocations: int
    total_quantity_allocated: int
    items: List[AllocationReportItem]

class DistributionReportItem(BaseModel):
    distribution_id: UUID
    allocation_id: UUID
    organization_name: str
    received_by: str
    receiver_contact: Optional[str] = None
    distribution_date: datetime
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DistributionReportResponse(BaseModel):
    total_distributions: int
    items: List[DistributionReportItem]

class PendingRequestReportItem(BaseModel):
    request_id: UUID
    organization_name: str
    priority: str
    status: str
    resource_name: str
    requested_quantity: int
    allocated_quantity: int
    remaining_quantity: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PendingRequestReportResponse(BaseModel):
    total_pending_requests: int
    items: List[PendingRequestReportItem]
