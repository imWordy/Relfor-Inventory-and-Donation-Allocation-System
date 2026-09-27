from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_staff_or_admin
from app.models.user import User
from app.schemas.donation import DonationCreate, DonationResponse
from app.services import donation_service

router = APIRouter(prefix="/donations", tags=["Donations"])

@router.post(
    "",
    response_model=DonationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record inventory intake donation (Admin/Staff only)"
)
def create_donation(
    donation_in: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return donation_service.create_donation(db=db, donation_in=donation_in, current_user=current_user)

@router.get(
    "",
    response_model=List[DonationResponse],
    summary="List donations"
)
def list_donations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return donation_service.list_donations(db=db, skip=skip, limit=limit)
