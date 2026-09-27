from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional, List

from app.models.allocation import Allocation
from app.models.allocation_item import AllocationItem
from app.models.request import Request
from app.models.request_item import RequestItem
from app.models.resource import Resource
from app.models.user import User
from app.schemas.allocation import AllocationCreate, AllocationUpdate

def create_allocation(db: Session, alloc_in: AllocationCreate, current_user: User) -> Allocation:
    req = db.query(Request).filter(Request.id == alloc_in.request_id).first()
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Request with ID '{alloc_in.request_id}' not found"
        )

    if req.status in ["COMPLETED", "CANCELLED", "REJECTED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot allocate resources to a request with status '{req.status}'"
        )

    # Map existing request items by ID
    req_items_map = {item.id: item for item in req.items}

    # Validate items and inventory
    allocation_item_records = []
    seen_request_items = set()

    for item_in in alloc_in.items:
        if item_in.request_item_id in seen_request_items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Duplicate request_item_id '{item_in.request_item_id}' in allocation"
            )
        seen_request_items.add(item_in.request_item_id)

        req_item = req_items_map.get(item_in.request_item_id)
        if not req_item:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Request item '{item_in.request_item_id}' does not belong to request '{req.id}'"
            )

        if req_item.resource_id != item_in.resource_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Resource ID '{item_in.resource_id}' does not match request item resource '{req_item.resource_id}'"
            )

        # Check requested vs already allocated
        remaining_needed = req_item.requested_quantity - req_item.allocated_quantity
        if item_in.allocated_quantity > remaining_needed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Allocated quantity ({item_in.allocated_quantity}) exceeds remaining needed quantity ({remaining_needed}) for resource {item_in.resource_id}"
            )

        # Check current stock
        res = db.query(Resource).filter(Resource.id == item_in.resource_id).first()
        if not res:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resource '{item_in.resource_id}' not found"
            )

        if item_in.allocated_quantity > res.current_stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{res.name}'. Available: {res.current_stock}, requested allocation: {item_in.allocated_quantity}"
            )

        # Deduct current stock and update allocated quantity on request item
        res.current_stock -= item_in.allocated_quantity
        req_item.allocated_quantity += item_in.allocated_quantity

        allocation_item_records.append((req_item, item_in.allocated_quantity))

    db_alloc = Allocation(
        request_id=req.id,
        allocated_by_user_id=current_user.id,
        status="PENDING_DISTRIBUTION",
        notes=alloc_in.notes.strip() if alloc_in.notes else None,
    )
    db.add(db_alloc)
    db.flush()

    for req_item, qty in allocation_item_records:
        alloc_item = AllocationItem(
            allocation_id=db_alloc.id,
            request_item_id=req_item.id,
            resource_id=req_item.resource_id,
            allocated_quantity=qty,
        )
        db.add(alloc_item)

    # Update request status: ALLOCATED or PARTIALLY_ALLOCATED
    all_fulfilled = all(item.allocated_quantity >= item.requested_quantity for item in req.items)
    any_allocated = any(item.allocated_quantity > 0 for item in req.items)

    if all_fulfilled:
        req.status = "ALLOCATED"
    elif any_allocated:
        req.status = "PARTIALLY_ALLOCATED"

    db.commit()
    db.refresh(db_alloc)
    return db_alloc

def get_allocation(db: Session, allocation_id: UUID, current_user: User) -> Allocation:
    alloc = db.query(Allocation).filter(Allocation.id == allocation_id).first()
    if not alloc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Allocation with ID '{allocation_id}' not found"
        )
    if current_user.role == "NGO" and alloc.request.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted: cannot access allocation of another organization"
        )
    return alloc

def list_allocations(
    db: Session,
    current_user: User,
    status_filter: Optional[str] = None,
    request_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Allocation]:
    query = db.query(Allocation).join(Request)

    if current_user.role == "NGO":
        query = query.filter(Request.organization_id == current_user.organization_id)

    if status_filter:
        query = query.filter(func.upper(Allocation.status) == status_filter.upper().strip())

    if request_id:
        query = query.filter(Allocation.request_id == request_id)

    return query.order_by(Allocation.created_at.desc()).offset(skip).limit(limit).all()

def cancel_allocation(db: Session, allocation_id: UUID, current_user: User) -> Allocation:
    alloc = get_allocation(db, allocation_id, current_user)
    if alloc.status != "PENDING_DISTRIBUTION":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel allocation with status '{alloc.status}'"
        )

    # Return stock to inventory and revert request item allocated quantity
    for item in alloc.items:
        res = db.query(Resource).filter(Resource.id == item.resource_id).first()
        if res:
            res.current_stock += item.allocated_quantity
        req_item = db.query(RequestItem).filter(RequestItem.id == item.request_item_id).first()
        if req_item:
            req_item.allocated_quantity = max(0, req_item.allocated_quantity - item.allocated_quantity)

    alloc.status = "CANCELLED"

    # Recalculate request status
    req = alloc.request
    all_fulfilled = all(item.allocated_quantity >= item.requested_quantity for item in req.items)
    any_allocated = any(item.allocated_quantity > 0 for item in req.items)

    if all_fulfilled and len(req.items) > 0:
        req.status = "ALLOCATED"
    elif any_allocated:
        req.status = "PARTIALLY_ALLOCATED"
    else:
        req.status = "PENDING"

    db.commit()
    db.refresh(alloc)
    return alloc
