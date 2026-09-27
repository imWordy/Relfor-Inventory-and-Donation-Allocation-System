from pydantic import BaseModel, Field, ConfigDict, field_validator
from uuid import UUID
from typing import Optional, List
from datetime import datetime

VALID_PRIORITIES = {"LOW", "MEDIUM", "HIGH", "URGENT"}
VALID_STATUSES = {"PENDING", "PARTIALLY_ALLOCATED", "ALLOCATED", "COMPLETED", "REJECTED", "CANCELLED"}

class RequestItemBase(BaseModel):
    resource_id: UUID
    requested_quantity: int = Field(..., gt=0)

class RequestItemCreate(RequestItemBase):
    pass

class RequestItemResponse(BaseModel):
    id: UUID
    request_id: UUID
    resource_id: UUID
    requested_quantity: int
    allocated_quantity: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RequestCreate(BaseModel):
    organization_id: Optional[UUID] = None  # If NGO user, auto-inferred from their org
    priority: str = Field(default="MEDIUM")
    notes: Optional[str] = None
    items: List[RequestItemCreate] = Field(..., min_length=1)

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        v_upper = v.upper().strip()
        if v_upper not in VALID_PRIORITIES:
            raise ValueError(f"Invalid priority. Must be one of: {', '.join(sorted(VALID_PRIORITIES))}")
        return v_upper

class RequestUpdate(BaseModel):
    priority: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_upper = v.upper().strip()
        if v_upper not in VALID_PRIORITIES:
            raise ValueError(f"Invalid priority. Must be one of: {', '.join(sorted(VALID_PRIORITIES))}")
        return v_upper

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_upper = v.upper().strip()
        if v_upper not in VALID_STATUSES:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(sorted(VALID_STATUSES))}")
        return v_upper

class RequestResponse(BaseModel):
    id: UUID
    organization_id: UUID
    requested_by_user_id: UUID
    priority: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[RequestItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
