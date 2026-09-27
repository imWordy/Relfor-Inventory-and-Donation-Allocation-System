from pydantic import BaseModel, Field, ConfigDict, field_validator
from uuid import UUID
from typing import Optional, Literal
from datetime import datetime

VALID_CATEGORIES = {"FOOD", "MEDICAL", "CLOTHING", "SHELTER", "EDUCATION", "HYGIENE", "OTHER"}

class ResourceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    category: str
    unit: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    minimum_stock: int = Field(default=0, ge=0)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        v_upper = v.upper().strip()
        if v_upper not in VALID_CATEGORIES:
            raise ValueError(f"Invalid category. Must be one of: {', '.join(sorted(VALID_CATEGORIES))}")
        return v_upper

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    category: Optional[str] = None
    unit: Optional[str] = Field(default=None, min_length=1, max_length=50)
    description: Optional[str] = None
    minimum_stock: Optional[int] = Field(default=None, ge=0)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_upper = v.upper().strip()
        if v_upper not in VALID_CATEGORIES:
            raise ValueError(f"Invalid category. Must be one of: {', '.join(sorted(VALID_CATEGORIES))}")
        return v_upper

class ResourceResponse(BaseModel):
    id: UUID
    name: str
    category: str
    unit: str
    description: Optional[str] = None
    minimum_stock: int
    current_stock: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
