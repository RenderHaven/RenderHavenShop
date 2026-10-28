from uuid import UUID
from src.media.service import MediaService
from .models import ProductCreate
from .repo import ProductRepo

class ProductService:
    def __init__(self, db):
        self.repo = ProductRepo(db)
        self.media = MediaService()

    async def get_products(self):
        return await self.repo.get_all()

    async def get_product(self, p_id: UUID):
        return await self.repo.get_by_id(p_id)

    async def get_products_by_category(self, c_id: int):
        return await self.repo.get_by_category(c_id)

    async def add_product(self, data: ProductCreate, thumbnail: bytes):
        thumbnail_url = await self.media.upload_image(thumbnail, folder="products")
        return await self.repo.create(**data.model_dump(), thumbnail_url=thumbnail_url)

    async def add_thumbnail(self, p_id: UUID, file: bytes):
        product = await self.repo.get_by_id(p_id)
        if not product:
            return None
        url = await self.media.upload_image(file, folder="products")
        return await self.repo.update_thumbnail(product, url)
