from pydantic import BaseModel, Field, ConfigDict, field_validator
from uuid import UUID
from typing import Optional, List
from datetime import datetime

VALID_ALLOCATION_STATUSES = {"PENDING_DISTRIBUTION", "DISTRIBUTED", "CANCELLED"}

class AllocationItemBase(BaseModel):
    request_item_id: UUID
    resource_id: UUID
    allocated_quantity: int = Field(..., gt=0)

class AllocationItemCreate(AllocationItemBase):
    pass

class AllocationItemResponse(BaseModel):
    id: UUID
    allocation_id: UUID
    request_item_id: UUID
    resource_id: UUID
    allocated_quantity: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AllocationCreate(BaseModel):
    request_id: UUID
    notes: Optional[str] = None
    items: List[AllocationItemCreate] = Field(..., min_length=1)

class AllocationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_upper = v.upper().strip()
        if v_upper not in VALID_ALLOCATION_STATUSES:
            raise ValueError(f"Invalid allocation status. Must be one of: {', '.join(sorted(VALID_ALLOCATION_STATUSES))}")
        return v_upper

class AllocationResponse(BaseModel):
    id: UUID
    request_id: UUID
    allocated_by_user_id: UUID
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[AllocationItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
