import uuid
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Uuid, func, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class RequestItem(Base):
    __tablename__ = "request_items"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    request_id = Column(Uuid, ForeignKey("requests.id", ondelete="CASCADE"), nullable=False)
    resource_id = Column(Uuid, ForeignKey("resources.id", ondelete="RESTRICT"), nullable=False)
    requested_quantity = Column(Integer, nullable=False)
    allocated_quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("request_id", "resource_id", name="uq_request_resource"),
    )

    request = relationship("Request", back_populates="items")
    resource = relationship("Resource")
