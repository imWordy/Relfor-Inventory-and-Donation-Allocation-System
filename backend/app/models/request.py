import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Uuid, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Request(Base):
    __tablename__ = "requests"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    organization_id = Column(Uuid, ForeignKey("organizations.id", ondelete="RESTRICT"), nullable=False)
    requested_by_user_id = Column(Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    priority = Column(String(20), nullable=False, default="MEDIUM")  # LOW, MEDIUM, HIGH, URGENT
    status = Column(String(30), nullable=False, default="PENDING")  # PENDING, PARTIALLY_ALLOCATED, ALLOCATED, COMPLETED, REJECTED, CANCELLED
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    organization = relationship("Organization")
    requested_by = relationship("User")
    items = relationship("RequestItem", back_populates="request", cascade="all, delete-orphan")
    allocations = relationship("Allocation", back_populates="request")
