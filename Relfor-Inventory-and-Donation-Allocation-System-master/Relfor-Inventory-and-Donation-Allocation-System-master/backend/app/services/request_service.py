from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional, List

from app.models.request import Request
from app.models.request_item import RequestItem
from app.models.resource import Resource
from app.models.user import User
from app.models.organization import Organization
from app.schemas.request import RequestCreate, RequestUpdate

def create_request(db: Session, request_in: RequestCreate, current_user: User) -> Request:
    # Determine organization_id
    if current_user.role == "NGO":
        if not current_user.organization_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User does not belong to any organization"
            )
        org_id = current_user.organization_id
    else:
        if not request_in.organization_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="organization_id is required for Admin/Staff created requests"
            )
        org_id = request_in.organization_id

    # Verify organization exists
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization with ID '{org_id}' not found"
        )

    # Validate items and avoid duplicate resource IDs in same request
    seen_resources = set()
    for item in request_in.items:
        if item.resource_id in seen_resources:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Duplicate resource '{item.resource_id}' in request items"
            )
        seen_resources.add(item.resource_id)

        resource = db.query(Resource).filter(Resource.id == item.resource_id).first()
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resource with ID '{item.resource_id}' not found"
            )

    db_request = Request(
        organization_id=org_id,
        requested_by_user_id=current_user.id,
        priority=request_in.priority,
        status="PENDING",
        notes=request_in.notes.strip() if request_in.notes else None,
    )
    db.add(db_request)
    db.flush()

    for item in request_in.items:
        req_item = RequestItem(
            request_id=db_request.id,
            resource_id=item.resource_id,
            requested_quantity=item.requested_quantity,
            allocated_quantity=0,
        )
        db.add(req_item)

    db.commit()
    db.refresh(db_request)
    return db_request

def get_request(db: Session, request_id: UUID, current_user: User) -> Request:
    db_request = db.query(Request).filter(Request.id == request_id).first()
    if not db_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Request with ID '{request_id}' not found"
        )
    # NGO users can only view requests from their organization
    if current_user.role == "NGO" and db_request.organization_id != current_user.organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted: cannot access requests of another organization"
        )
    return db_request

def list_requests(
    db: Session,
    current_user: User,
    status_filter: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Request]:
    query = db.query(Request)

    if current_user.role == "NGO":
        query = query.filter(Request.organization_id == current_user.organization_id)

    if status_filter:
        query = query.filter(func.upper(Request.status) == status_filter.upper().strip())

    if priority:
        query = query.filter(func.upper(Request.priority) == priority.upper().strip())

    return query.order_by(Request.created_at.desc()).offset(skip).limit(limit).all()

def update_request(db: Session, request_id: UUID, request_in: RequestUpdate, current_user: User) -> Request:
    db_request = get_request(db, request_id, current_user)

    update_data = request_in.model_dump(exclude_unset=True)
    if "priority" in update_data and update_data["priority"] is not None:
        db_request.priority = update_data["priority"]

    if "status" in update_data and update_data["status"] is not None:
        db_request.status = update_data["status"]

    if "notes" in update_data:
        db_request.notes = update_data["notes"].strip() if update_data["notes"] else None

    db.commit()
    db.refresh(db_request)
    return db_request
