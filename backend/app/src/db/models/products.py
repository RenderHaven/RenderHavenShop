from sqlalchemy.orm import  relationship
from sqlalchemy import Column, Integer, String, Float, ForeignKey,UUID,ARRAY,Enum as SQLAEnum 
from .enums import DiscountType
from src.db.database import Base

class Product(Base):
    __tablename__ = "products"

    p_id = Column(UUID, primary_key=True, index=True)
    name = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    is_active = Column(Integer, nullable=False, default=1)

    discount = Column(Float, nullable=True)
    discount_type = Column(SQLAEnum(DiscountType), nullable=True)

    items = relationship("Items", back_populates="product")

class ProdctCategory(Base):
    __tablename__ = "product_categories"

    id = Column(UUID, primary_key=True, index=True)
    p_id = Column(UUID, ForeignKey("products.p_id"), nullable=False)
    c_id = Column(Integer, ForeignKey("categories.c_id"), nullable=False)

    product = relationship("Product", backref="product_categories")
    category = relationship("Category", backref="product_categories")

class ProductItemVariation(Base):
    __tablename__ = "product_item_variations"

    id = Column(UUID, primary_key=True, index=True)
    p_id = Column(UUID, ForeignKey("products.p_id"), nullable=False)
    i_id = Column(UUID, ForeignKey("items.i_id"), nullable=False)
    v_ids = Column(ARRAY(UUID), nullable=False)
    

    product = relationship("Product", backref="product_item_variations")
    item = relationship("Items", backref="product_item_variations")