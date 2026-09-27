import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, Uuid, func
from app.core.database import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String(150), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # FOOD, MEDICAL, CLOTHING, SHELTER, EDUCATION, HYGIENE, OTHER
    unit = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    minimum_stock = Column(Integer, nullable=False, default=0)
    current_stock = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
