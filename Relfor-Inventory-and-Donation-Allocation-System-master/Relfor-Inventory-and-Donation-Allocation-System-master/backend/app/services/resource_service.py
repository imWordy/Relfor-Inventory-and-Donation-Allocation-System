from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional, List

from app.models.resource import Resource
from app.schemas.resource import ResourceCreate, ResourceUpdate

def create_resource(db: Session, resource_in: ResourceCreate) -> Resource:
    clean_name = resource_in.name.strip()
    existing = db.query(Resource).filter(
        func.lower(Resource.name) == clean_name.lower()
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Resource with name '{clean_name}' already exists"
        )

    db_resource = Resource(
        name=clean_name,
        category=resource_in.category,
        unit=resource_in.unit.strip(),
        description=resource_in.description.strip() if resource_in.description else None,
        minimum_stock=resource_in.minimum_stock,
        current_stock=0,
    )
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

def get_resource(db: Session, resource_id: UUID) -> Resource:
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource with ID '{resource_id}' not found"
        )
    return resource

def list_resources(
    db: Session,
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[Resource]:
    query = db.query(Resource)

    if category:
        query = query.filter(func.upper(Resource.category) == category.upper().strip())

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Resource.name.ilike(search_term),
                Resource.description.ilike(search_term)
            )
        )

    return query.order_by(Resource.name.asc()).offset(skip).limit(limit).all()

def update_resource(db: Session, resource_id: UUID, resource_in: ResourceUpdate) -> Resource:
    db_resource = get_resource(db, resource_id)

    update_data = resource_in.model_dump(exclude_unset=True)

    if "name" in update_data and update_data["name"] is not None:
        clean_name = update_data["name"].strip()
        existing = db.query(Resource).filter(
            func.lower(Resource.name) == clean_name.lower(),
            Resource.id != resource_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Resource with name '{clean_name}' already exists"
            )
        db_resource.name = clean_name

    if "category" in update_data and update_data["category"] is not None:
        db_resource.category = update_data["category"]

    if "unit" in update_data and update_data["unit"] is not None:
        db_resource.unit = update_data["unit"].strip()

    if "description" in update_data:
        db_resource.description = update_data["description"].strip() if update_data["description"] else None

    if "minimum_stock" in update_data and update_data["minimum_stock"] is not None:
        db_resource.minimum_stock = update_data["minimum_stock"]

    db.commit()
    db.refresh(db_resource)
    return db_resource
