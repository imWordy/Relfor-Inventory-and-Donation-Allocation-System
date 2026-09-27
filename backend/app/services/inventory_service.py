from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from app.models.resource import Resource
from app.schemas.inventory import StockStatus, InventoryItemResponse

def calculate_status(current_stock: int, minimum_stock: int) -> StockStatus:
    if current_stock <= 0:
        return StockStatus.OUT_OF_STOCK
    elif current_stock <= minimum_stock:
        return StockStatus.LOW_STOCK
    else:
        return StockStatus.AVAILABLE

def get_inventory_item(resource: Resource) -> InventoryItemResponse:
    # Rule: never expose negative inventory
    available_quantity = max(0, resource.current_stock)
    status = calculate_status(available_quantity, resource.minimum_stock)
    
    return InventoryItemResponse(
        resource_id=resource.id,
        name=resource.name,
        category=resource.category,
        unit=resource.unit,
        minimum_stock=resource.minimum_stock,
        available_quantity=available_quantity,
        status=status
    )

def list_inventory(
    db: Session,
    category: Optional[str] = None,
    stock_status: Optional[StockStatus] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Resource)
    
    if category:
        query = query.filter(Resource.category == category)
        
    if search:
        query = query.filter(
            or_(
                Resource.name.ilike(f"%{search}%"),
                Resource.description.ilike(f"%{search}%")
            )
        )
        
    resources = query.offset(skip).limit(limit).all()
    
    inventory_items = [get_inventory_item(r) for r in resources]
    
    if stock_status:
        inventory_items = [item for item in inventory_items if item.status == stock_status]
        
    return inventory_items

def get_inventory_by_resource(db: Session, resource_id: str):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        return None
    return get_inventory_item(resource)
