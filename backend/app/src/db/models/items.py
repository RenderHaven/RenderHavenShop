from sqlalchemy import UUID, Column, ForeignKey, String, Float, Integer,Enum as SQLAEnum
from sqlalchemy.orm import relationship
from .enums import DiscountType
from src.db.database import Base

class Items(Base):
    __tablename__ = "items"

    i_id= Column(UUID,primary_key=True,index=True)
    p_id = Column(UUID,ForeignKey("products.p_id"),nullable=False)
    name = Column(String,nullable=False)
    description = Column(String,nullable=True)
    price = Column(Float,nullable=False)
    stock = Column(Integer,nullable=False)
    discount = Column(Float,nullable=True)
    discount_type = Column(SQLAEnum(DiscountType), nullable=True)
    is_active = Column(Integer,nullable=False,default=1)

    cart_count = Column(Integer,nullable=False,default=0)

    product = relationship("Product", back_populates="items")
    images = relationship("Images", back_populates="item")

class Images(Base):
    __tablename__ = "item_images"

    id= Column(UUID,primary_key=True,index=True)
    i_id = Column(UUID,ForeignKey("items.i_id"),nullable=False)
    url = Column(String,nullable=False)

    item = relationship("Items", back_populates="images")

