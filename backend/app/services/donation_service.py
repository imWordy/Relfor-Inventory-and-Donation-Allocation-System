from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional, List

from app.models.donation import Donation, Donor
from app.models.resource import Resource
from app.models.user import User
from app.schemas.donation import DonationCreate

def create_donation(db: Session, donation_in: DonationCreate, current_user: User) -> Donation:
    donor = db.query(Donor).filter(Donor.id == donation_in.donor_id).first()
    if not donor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Donor with ID '{donation_in.donor_id}' not found"
        )

    resource = db.query(Resource).filter(Resource.id == donation_in.resource_id).first()
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource with ID '{donation_in.resource_id}' not found"
        )

    # Create donation record
    db_donation = Donation(
        donor_id=donation_in.donor_id,
        resource_id=donation_in.resource_id,
        quantity=donation_in.quantity,
        condition=donation_in.condition,
        expiry_date=donation_in.expiry_date,
        notes=donation_in.notes.strip() if donation_in.notes else None,
        received_by_user_id=current_user.id,
    )
    db.add(db_donation)

    # Increase inventory stock immediately
    resource.current_stock += donation_in.quantity

    db.commit()
    db.refresh(db_donation)
    return db_donation

def list_donations(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[Donation]:
    return db.query(Donation).order_by(Donation.donation_date.desc()).offset(skip).limit(limit).all()
