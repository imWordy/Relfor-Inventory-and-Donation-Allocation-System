from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_staff_or_admin
from app.models.user import User
from app.schemas.request import RequestCreate, RequestUpdate, RequestResponse
from app.services import request_service

router = APIRouter(prefix="/requests", tags=["Requests"])

@router.post(
    "",
    response_model=RequestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new resource request"
)
def create_request(
    request_in: RequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return request_service.create_request(db=db, request_in=request_in, current_user=current_user)

@router.get(
    "",
    response_model=List[RequestResponse],
    summary="List requests"
)
def list_requests(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by request status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return request_service.list_requests(
        db=db, current_user=current_user, status_filter=status_filter, priority=priority, skip=skip, limit=limit
    )

@router.get(
    "/{request_id}",
    response_model=RequestResponse,
    summary="Get request details by ID"
)
def get_request(
    request_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return request_service.get_request(db=db, request_id=request_id, current_user=current_user)

@router.patch(
    "/{request_id}",
    response_model=RequestResponse,
    summary="Update request status or notes (Admin/Staff only)"
)
def update_request(
    request_id: UUID,
    request_in: RequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return request_service.update_request(
        db=db, request_id=request_id, request_in=request_in, current_user=current_user
    )
