import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Uuid, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Distribution(Base):
    __tablename__ = "distributions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    allocation_id = Column(Uuid, ForeignKey("allocations.id", ondelete="RESTRICT"), unique=True, nullable=False)
    distributed_by_user_id = Column(Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    distribution_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    received_by = Column(String(150), nullable=False)
    receiver_contact = Column(String(50), nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    allocation = relationship("Allocation", back_populates="distribution")
    distributed_by = relationship("User")
