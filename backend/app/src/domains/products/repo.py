import uuid
from sqlalchemy import select
from src.db.models import Product, ProdctCategory

class ProductRepo:

    def __init__(self, db):
        self.db = db

    async def get_all(self, active_only: bool = True):
        stmt = select(Product)
        if active_only:
            stmt = stmt.where(Product.is_active == 1)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, p_id: uuid.UUID):
        return await self.db.get(Product, p_id)

    async def get_by_category(self, c_id: int):
        result = await self.db.execute(
            select(Product)
            .join(ProdctCategory, ProdctCategory.p_id == Product.p_id)
            .where(ProdctCategory.c_id == c_id, Product.is_active == 1)
        )
        return result.scalars().all()

    async def create(self, category_ids: list[int], **data):
        product = Product(p_id=uuid.uuid4(), **data)
        self.db.add(product)
        for c_id in category_ids:
            self.db.add(ProdctCategory(id=uuid.uuid4(), p_id=product.p_id, c_id=c_id))
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def update_thumbnail(self, product: Product, thumbnail_url: str):
        product.thumbnail_url = thumbnail_url
        await self.db.commit()
        await self.db.refresh(product)
        return product
