from pydantic import BaseModel, ConfigDict
from uuid import UUID
from enum import Enum

class StockStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    LOW_STOCK = "LOW_STOCK"
    OUT_OF_STOCK = "OUT_OF_STOCK"
    EXPIRED = "EXPIRED"

class InventoryItemResponse(BaseModel):
    resource_id: UUID
    name: str
    category: str
    unit: str
    minimum_stock: int
    available_quantity: int
    status: StockStatus
    
    model_config = ConfigDict(from_attributes=True)
