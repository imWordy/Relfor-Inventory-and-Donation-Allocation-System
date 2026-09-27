import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Uuid, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    request_id = Column(Uuid, ForeignKey("requests.id", ondelete="RESTRICT"), nullable=False)
    allocated_by_user_id = Column(Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    status = Column(String(30), nullable=False, default="PENDING_DISTRIBUTION")  # PENDING_DISTRIBUTION, DISTRIBUTED, CANCELLED
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    request = relationship("Request", back_populates="allocations")
    allocated_by = relationship("User")
    items = relationship("AllocationItem", back_populates="allocation", cascade="all, delete-orphan")
    distribution = relationship("Distribution", back_populates="allocation", uselist=False)
