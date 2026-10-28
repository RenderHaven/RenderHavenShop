import uuid
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.db.models import Items
from src.db.models.items import Images

class ItemRepo:

    def __init__(self, db):
        self.db = db

    async def get_all(self, active_only: bool = True):
        stmt = select(Items).options(selectinload(Items.images))
        if active_only:
            stmt = stmt.where(Items.is_active == 1)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, i_id: uuid.UUID):
        result = await self.db.execute(
            select(Items).options(selectinload(Items.images)).where(Items.i_id == i_id)
        )
        return result.scalar_one_or_none()

    async def get_by_product(self, p_id: uuid.UUID):
        result = await self.db.execute(
            select(Items)
            .options(selectinload(Items.images))
            .where(Items.p_id == p_id, Items.is_active == 1)
        )
        return result.scalars().all()

    async def create(self, image_urls: list[str], **data):
        item = Items(i_id=uuid.uuid4(), **data)
        self.db.add(item)
        for url in image_urls:
            self.db.add(Images(id=uuid.uuid4(), i_id=item.i_id, url=url))
        await self.db.commit()
        return await self.get_by_id(item.i_id)

    async def add_image(self, i_id: uuid.UUID, url: str):
        self.db.add(Images(id=uuid.uuid4(), i_id=i_id, url=url))
        await self.db.commit()
        # expire so selectinload picks up the new image
        self.db.expire_all()
        return await self.get_by_id(i_id)
