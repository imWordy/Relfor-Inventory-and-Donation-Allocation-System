from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_staff_or_admin
from app.models.user import User
from app.schemas.distribution import DistributionCreate, DistributionResponse
from app.services import distribution_service

router = APIRouter(prefix="/distributions", tags=["Distributions"])

@router.post(
    "",
    response_model=DistributionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record resource distribution / handover receipt (Admin/Staff only)"
)
def create_distribution(
    dist_in: DistributionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return distribution_service.create_distribution(db=db, dist_in=dist_in, current_user=current_user)

@router.get(
    "",
    response_model=List[DistributionResponse],
    summary="List distribution records"
)
def list_distributions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return distribution_service.list_distributions(
        db=db, current_user=current_user, skip=skip, limit=limit
    )

@router.get(
    "/{distribution_id}",
    response_model=DistributionResponse,
    summary="Get distribution record by ID"
)
def get_distribution(
    distribution_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return distribution_service.get_distribution(db=db, distribution_id=distribution_id, current_user=current_user)
