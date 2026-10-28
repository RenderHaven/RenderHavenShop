from pydantic import BaseModel, ConfigDict
from src.db.models.enums import CategoryType, DiscountType

class CategoryCreate(BaseModel):
    name: str
    type: CategoryType
    parent_id: int | None = None
    description: str | None = None
    discount: float | None = None
    discount_type: DiscountType | None = None

class CategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    c_id: int
    parent_id: int | None
    name: str
    description: str | None
    banner_url: str | None
    type: CategoryType
    discount: float | None
    discount_type: DiscountType | None
    is_active: int
