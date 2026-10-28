from sqlalchemy import Column,  String, UUID, ForeignKey 
from sqlalchemy.orm import  relationship
from src.db.database import Base

class Variation(Base):
    __tablename__ = "variations"

    v_id = Column(UUID, primary_key=True, index=True)
    key = Column(String, nullable=False)
    description = Column(String, nullable=True)
    value = Column(String, nullable=False)