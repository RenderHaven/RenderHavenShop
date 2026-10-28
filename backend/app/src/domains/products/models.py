from uuid import UUID
from pydantic import BaseModel, ConfigDict
from src.db.models.enums import DiscountType

class ProductCreate(BaseModel):
    name: str
    discount: float | None = None
    discount_type: DiscountType | None = None
    category_ids: list[int] = []

class ProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    p_id: UUID
    name: str
    thumbnail_url: str | None
    discount: float | None
    discount_type: DiscountType | None
    is_active: int
