from pydantic import BaseModel, Field, ConfigDict, field_validator
from uuid import UUID
from typing import Optional
from datetime import datetime, date

VALID_CONDITIONS = {"NEW", "GOOD", "FAIR"}

class DonationCreate(BaseModel):
    donor_id: UUID
    resource_id: UUID
    quantity: int = Field(..., gt=0)
    condition: str = Field(default="NEW")
    expiry_date: Optional[date] = None
    notes: Optional[str] = None

    @field_validator("condition")
    @classmethod
    def validate_condition(cls, v: str) -> str:
        v_upper = v.upper().strip()
        if v_upper not in VALID_CONDITIONS:
            raise ValueError(f"Invalid condition. Must be one of: {', '.join(sorted(VALID_CONDITIONS))}")
        return v_upper

class DonationResponse(BaseModel):
    id: UUID
    donor_id: UUID
    resource_id: UUID
    quantity: int
    condition: str
    donation_date: datetime
    expiry_date: Optional[date] = None
    notes: Optional[str] = None
    received_by_user_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
