from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from uuid import UUID
from typing import Optional
from datetime import datetime

VALID_ORG_TYPES = {"NGO", "SHELTER", "ORPHANAGE", "COMMUNITY_GROUP", "DISASTER_RELIEF", "OTHER"}

class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    type: str = Field(default="NGO")
    registration_number: Optional[str] = Field(default=None, max_length=100)
    contact_person: str = Field(..., min_length=1, max_length=150)
    phone: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    address: str = Field(..., min_length=1)
    is_verified: bool = True

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        v_upper = v.upper().strip()
        if v_upper not in VALID_ORG_TYPES:
            raise ValueError(f"Invalid organization type. Must be one of: {', '.join(sorted(VALID_ORG_TYPES))}")
        return v_upper

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    type: Optional[str] = None
    registration_number: Optional[str] = Field(default=None, max_length=100)
    contact_person: Optional[str] = Field(default=None, min_length=1, max_length=150)
    phone: Optional[str] = Field(default=None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(default=None, min_length=1)
    is_verified: Optional[bool] = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_upper = v.upper().strip()
        if v_upper not in VALID_ORG_TYPES:
            raise ValueError(f"Invalid organization type. Must be one of: {', '.join(sorted(VALID_ORG_TYPES))}")
        return v_upper

class OrganizationResponse(BaseModel):
    id: UUID
    name: str
    type: str
    registration_number: Optional[str] = None
    contact_person: str
    phone: str
    email: str
    address: str
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
