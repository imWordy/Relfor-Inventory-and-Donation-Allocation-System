import uuid
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Uuid, func, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class AllocationItem(Base):
    __tablename__ = "allocation_items"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    allocation_id = Column(Uuid, ForeignKey("allocations.id", ondelete="CASCADE"), nullable=False)
    request_item_id = Column(Uuid, ForeignKey("request_items.id", ondelete="RESTRICT"), nullable=False)
    resource_id = Column(Uuid, ForeignKey("resources.id", ondelete="RESTRICT"), nullable=False)
    allocated_quantity = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("allocation_id", "request_item_id", name="uq_allocation_request_item"),
    )

    allocation = relationship("Allocation", back_populates="items")
    request_item = relationship("RequestItem")
    resource = relationship("Resource")
