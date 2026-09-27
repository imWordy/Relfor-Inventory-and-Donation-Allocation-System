from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_staff_or_admin
from app.models.user import User
from app.schemas.resource import ResourceCreate, ResourceUpdate, ResourceResponse
from app.services import resource_service

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.post(
    "",
    response_model=ResourceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new resource catalog item"
)
def create_resource(
    resource_in: ResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return resource_service.create_resource(db=db, resource_in=resource_in)

@router.get(
    "",
    response_model=List[ResourceResponse],
    summary="List and filter resources"
)
def list_resources(
    category: Optional[str] = Query(None, description="Filter by resource category"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return resource_service.list_resources(
        db=db, category=category, search=search, skip=skip, limit=limit
    )

@router.get(
    "/{resource_id}",
    response_model=ResourceResponse,
    summary="Get resource by ID"
)
def get_resource(
    resource_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return resource_service.get_resource(db=db, resource_id=resource_id)

@router.put(
    "/{resource_id}",
    response_model=ResourceResponse,
    summary="Update an existing resource"
)
def update_resource(
    resource_id: UUID,
    resource_in: ResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return resource_service.update_resource(
        db=db, resource_id=resource_id, resource_in=resource_in
    )

@router.patch(
    "/{resource_id}",
    response_model=ResourceResponse,
    summary="Partially update an existing resource"
)
def patch_resource(
    resource_id: UUID,
    resource_in: ResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return resource_service.update_resource(
        db=db, resource_id=resource_id, resource_in=resource_in
    )
