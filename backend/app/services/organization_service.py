from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional, List

from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationUpdate

def create_organization(db: Session, org_in: OrganizationCreate) -> Organization:
    clean_name = org_in.name.strip()
    existing = db.query(Organization).filter(
        func.lower(Organization.name) == clean_name.lower()
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Organization with name '{clean_name}' already exists"
        )

    db_org = Organization(
        name=clean_name,
        type=org_in.type,
        registration_number=org_in.registration_number.strip() if org_in.registration_number else None,
        contact_person=org_in.contact_person.strip(),
        phone=org_in.phone.strip(),
        email=str(org_in.email).strip().lower(),
        address=org_in.address.strip(),
        is_verified=org_in.is_verified,
    )
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    return db_org

def get_organization(db: Session, organization_id: UUID) -> Organization:
    org = db.query(Organization).filter(Organization.id == organization_id).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Organization with ID '{organization_id}' not found"
        )
    return org

def list_organizations(
    db: Session,
    type_filter: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Organization]:
    query = db.query(Organization)

    if type_filter:
        query = query.filter(func.upper(Organization.type) == type_filter.upper().strip())

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Organization.name.ilike(search_term),
                Organization.contact_person.ilike(search_term),
                Organization.email.ilike(search_term),
                Organization.registration_number.ilike(search_term)
            )
        )

    return query.order_by(Organization.name.asc()).offset(skip).limit(limit).all()

def update_organization(db: Session, organization_id: UUID, org_in: OrganizationUpdate) -> Organization:
    db_org = get_organization(db, organization_id)
    update_data = org_in.model_dump(exclude_unset=True)

    if "name" in update_data and update_data["name"] is not None:
        clean_name = update_data["name"].strip()
        existing = db.query(Organization).filter(
            func.lower(Organization.name) == clean_name.lower(),
            Organization.id != organization_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Organization with name '{clean_name}' already exists"
            )
        db_org.name = clean_name

    if "type" in update_data and update_data["type"] is not None:
        db_org.type = update_data["type"]

    if "registration_number" in update_data:
        db_org.registration_number = update_data["registration_number"].strip() if update_data["registration_number"] else None

    if "contact_person" in update_data and update_data["contact_person"] is not None:
        db_org.contact_person = update_data["contact_person"].strip()

    if "phone" in update_data and update_data["phone"] is not None:
        db_org.phone = update_data["phone"].strip()

    if "email" in update_data and update_data["email"] is not None:
        db_org.email = str(update_data["email"]).strip().lower()

    if "address" in update_data and update_data["address"] is not None:
        db_org.address = update_data["address"].strip()

    if "is_verified" in update_data and update_data["is_verified"] is not None:
        db_org.is_verified = update_data["is_verified"]

    db.commit()
    db.refresh(db_org)
    return db_org
