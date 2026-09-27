import uuid
from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, Uuid, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Donor(Base):
    __tablename__ = "donors"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)  # INDIVIDUAL, CORPORATE, FOUNDATION, GOVERNMENT, OTHER
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    donations = relationship("Donation", back_populates="donor")


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    donor_id = Column(Uuid, ForeignKey("donors.id", ondelete="RESTRICT"), nullable=False)
    resource_id = Column(Uuid, ForeignKey("resources.id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(Integer, nullable=False)
    condition = Column(String(30), nullable=False)  # NEW, GOOD, FAIR
    donation_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expiry_date = Column(Date, nullable=True)
    notes = Column(String, nullable=True)
    received_by_user_id = Column(Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    donor = relationship("Donor", back_populates="donations")
    resource = relationship("Resource")
    received_by = relationship("User")
