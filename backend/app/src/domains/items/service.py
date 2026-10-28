from uuid import UUID
from src.media.service import MediaService
from .models import ItemCreate
from .repo import ItemRepo

class ItemService:
    def __init__(self, db):
        self.repo = ItemRepo(db)
        self.media = MediaService()

    async def get_items(self):
        return await self.repo.get_all()

    async def get_item(self, i_id: UUID):
        return await self.repo.get_by_id(i_id)

    async def get_items_by_product(self, p_id: UUID):
        return await self.repo.get_by_product(p_id)

    async def add_item(self, data: ItemCreate, images: list[bytes]):
        image_urls = [await self.media.upload_image(image, folder="items") for image in images]
        return await self.repo.create(image_urls, **data.model_dump())

    async def add_image(self, i_id: UUID, file: bytes):
        item = await self.repo.get_by_id(i_id)
        if not item:
            return None
        url = await self.media.upload_image(file, folder="items")
        return await self.repo.add_image(i_id, url)
