from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from typing import Optional
from datetime import datetime

class DistributionCreate(BaseModel):
    allocation_id: UUID
    received_by: str = Field(..., min_length=1, max_length=150)
    receiver_contact: Optional[str] = Field(default=None, max_length=50)
    notes: Optional[str] = None

class DistributionResponse(BaseModel):
    id: UUID
    allocation_id: UUID
    distributed_by_user_id: UUID
    distribution_date: datetime
    received_by: str
    receiver_contact: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
