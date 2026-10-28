from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Float, ForeignKey,Enum as SQLAEnum
from .enums import CategoryType, DiscountType,CategoryType
from src.db.database import Base

class Category(Base):
    __tablename__ = "categories"

    c_id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("categories.c_id"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    banner_url = Column(String, nullable=True)

    type = Column(SQLAEnum(CategoryType), nullable=False)

    discount = Column(Float, nullable=True)
    discount_type = Column(SQLAEnum(DiscountType), nullable=True)

    is_active = Column(Integer, nullable=False, default=1)

    parent = relationship("Category", remote_side=[c_id], back_populates="subcategories")
    subcategories = relationship("Category", back_populates="parent", cascade="all, delete-orphan")
