from sqlalchemy import select
from src.db.models import Category

class CategoryRepo:

    def __init__(self, db):
        self.db = db

    async def get_all(self, active_only: bool = True):
        stmt = select(Category)
        if active_only:
            stmt = stmt.where(Category.is_active == 1)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, c_id: int):
        return await self.db.get(Category, c_id)

    async def get_children(self, parent_id: int):
        result = await self.db.execute(
            select(Category).where(Category.parent_id == parent_id, Category.is_active == 1)
        )
        return result.scalars().all()

    async def create(self, **data):
        category = Category(**data)
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def update_banner(self, category: Category, banner_url: str):
        category.banner_url = banner_url
        await self.db.commit()
        await self.db.refresh(category)
        return category
