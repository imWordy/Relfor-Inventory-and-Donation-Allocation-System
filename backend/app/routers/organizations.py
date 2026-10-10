from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_staff_or_admin
from app.models.user import User
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationResponse
from app.services import organization_service

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.post(
    "",
    response_model=OrganizationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new beneficiary organization (Admin/Staff only)"
)
def create_organization(
    org_in: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return organization_service.create_organization(db=db, org_in=org_in)

@router.get(
    "",
    response_model=List[OrganizationResponse],
    summary="List and filter organizations"
)
def list_organizations(
    type_filter: Optional[str] = Query(None, alias="type", description="Filter by organization type"),
    search: Optional[str] = Query(None, description="Search by name, contact person, email, or reg number"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return organization_service.list_organizations(
        db=db, type_filter=type_filter, search=search, skip=skip, limit=limit
    )

@router.get(
    "/{organization_id}",
    response_model=OrganizationResponse,
    summary="Get organization details by ID"
)
def get_organization(
    organization_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return organization_service.get_organization(db=db, organization_id=organization_id)

@router.put(
    "/{organization_id}",
    response_model=OrganizationResponse,
    summary="Update organization details (Admin/Staff only)"
)
def update_organization(
    organization_id: UUID,
    org_in: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return organization_service.update_organization(
        db=db, organization_id=organization_id, org_in=org_in
    )
