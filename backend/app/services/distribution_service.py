from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional, List

from app.models.distribution import Distribution
from app.models.allocation import Allocation
from app.models.request import Request
from app.models.user import User
from app.schemas.distribution import DistributionCreate

def create_distribution(db: Session, dist_in: DistributionCreate, current_user: User) -> Distribution:
    alloc = db.query(Allocation).filter(Allocation.id == dist_in.allocation_id).first()
    if not alloc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Allocation with ID '{dist_in.allocation_id}' not found"
        )

    if alloc.status != "PENDING_DISTRIBUTION":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot distribute allocation with status '{alloc.status}'. Only PENDING_DISTRIBUTION allocations can be distributed."
        )

    existing = db.query(Distribution).filter(Distribution.allocation_id == alloc.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Distribution already recorded for this allocation"
        )

    db_dist = Distribution(
        allocation_id=alloc.id,
        distributed_by_user_id=current_user.id,
        received_by=dist_in.received_by.strip(),
        receiver_contact=dist_in.receiver_contact.strip() if dist_in.receiver_contact else None,
        notes=dist_in.notes.strip() if dist_in.notes else None,
    )
    db.add(db_dist)

    # Update allocation status to DISTRIBUTED
    alloc.status = "DISTRIBUTED"

    # Check if request can now be COMPLETED
    req = alloc.request
    all_fulfilled = all(item.allocated_quantity >= item.requested_quantity for item in req.items)
    # Check if all allocations for this request are DISTRIBUTED
    all_allocs_distributed = all(a.status == "DISTRIBUTED" for a in req.allocations if a.status != "CANCELLED")

    if all_fulfilled and all_allocs_distributed:
        req.status = "COMPLETED"

    db.commit()
    db.refresh(db_dist)
    return db_dist

def get_distribution(db: Session, distribution_id: UUID, current_user: User) -> Distribution:
    dist = db.query(Distribution).filter(Distribution.id == distribution_id).first()
    if not dist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Distribution with ID '{distribution_id}' not found"
        )
    if current_user.role == "NGO" and dist.allocation.request.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted: cannot access distribution of another organization"
        )
    return dist

def list_distributions(
    db: Session,
    current_user: User,
    skip: int = 0,
    limit: int = 100
) -> List[Distribution]:
    query = db.query(Distribution).join(Allocation).join(Request)

    if current_user.role == "NGO":
        query = query.filter(Request.organization_id == current_user.organization_id)

    return query.order_by(Distribution.created_at.desc()).offset(skip).limit(limit).all()
