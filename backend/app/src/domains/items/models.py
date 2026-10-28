from uuid import UUID
from pydantic import BaseModel, ConfigDict
from src.db.models.enums import DiscountType

class ItemCreate(BaseModel):
    p_id: UUID
    name: str
    price: float
    stock: int = 0
    description: str | None = None
    discount: float | None = None
    discount_type: DiscountType | None = None

class ItemImageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    url: str

class ItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    i_id: UUID
    p_id: UUID
    name: str
    description: str | None
    price: float
    stock: int
    discount: float | None
    discount_type: DiscountType | None
    is_active: int
    images: list[ItemImageRead] = []
