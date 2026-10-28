from src.media.service import MediaService
from .models import CategoryCreate
from .repo import CategoryRepo

class CategoryService:
    def __init__(self, db):
        self.repo = CategoryRepo(db)
        self.media = MediaService()

    async def get_categories(self):
        return await self.repo.get_all()

    async def get_category(self, c_id: int):
        return await self.repo.get_by_id(c_id)

    async def get_subcategories(self, parent_id: int):
        return await self.repo.get_children(parent_id)

    async def add_category(self, data: CategoryCreate, banner: bytes):
        banner_url = await self.media.upload_image(banner, folder="categories")
        return await self.repo.create(**data.model_dump(), banner_url=banner_url)

    async def add_banner(self, c_id: int, file: bytes):
        category = await self.repo.get_by_id(c_id)
        if not category:
            return None
        url = await self.media.upload_image(file, folder="categories")
        return await self.repo.update_banner(category, url)
