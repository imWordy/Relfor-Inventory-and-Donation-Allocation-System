from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.inventory import InventoryItemResponse, StockStatus
from app.services import inventory_service

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get(
    "",
    response_model=List[InventoryItemResponse],
    summary="List current inventory"
)
def list_inventory(
    category: Optional[str] = Query(None, description="Filter by resource category"),
    stock_status: Optional[StockStatus] = Query(None, description="Filter by stock status"),
    search: Optional[str] = Query(None, description="Search by resource name"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return inventory_service.list_inventory(
        db=db, category=category, stock_status=stock_status, search=search, skip=skip, limit=limit
    )

@router.get(
    "/{resource_id}",
    response_model=InventoryItemResponse,
    summary="Get inventory details for a specific resource"
)
def get_inventory(
    resource_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = inventory_service.get_inventory_by_resource(db=db, resource_id=resource_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    return item
