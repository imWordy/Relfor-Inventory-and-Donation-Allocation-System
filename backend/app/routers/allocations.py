from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_staff_or_admin
from app.models.user import User
from app.schemas.allocation import AllocationCreate, AllocationResponse
from app.services import allocation_service

router = APIRouter(prefix="/allocations", tags=["Allocations"])

@router.post(
    "",
    response_model=AllocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Allocate inventory to a request (Admin/Staff only)"
)
def create_allocation(
    alloc_in: AllocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """
    Creates an allocation.
    Validates requested items, safely reads inventory, limits allocation,
    updates request states, and commits all changes transactionally.
    """
    return allocation_service.create_allocation(db=db, alloc_in=alloc_in, current_user=current_user)

@router.get(
    "",
    response_model=List[AllocationResponse],
    summary="List allocations"
)
def list_allocations(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by allocation status"),
    request_id: Optional[UUID] = Query(None, description="Filter by request ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return allocation_service.list_allocations(
        db=db, current_user=current_user, status_filter=status_filter, request_id=request_id, skip=skip, limit=limit
    )

@router.get(
    "/{allocation_id}",
    response_model=AllocationResponse,
    summary="Get allocation by ID"
)
def get_allocation(
    allocation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return allocation_service.get_allocation(db=db, allocation_id=allocation_id, current_user=current_user)

@router.post(
    "/{allocation_id}/cancel",
    response_model=AllocationResponse,
    summary="Cancel allocation and return reserved stock (Admin/Staff only)"
)
def cancel_allocation(
    allocation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return allocation_service.cancel_allocation(db=db, allocation_id=allocation_id, current_user=current_user)
