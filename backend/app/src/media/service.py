import asyncio
import cloudinary
import cloudinary.uploader
from src.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

class MediaService:

    async def upload_image(self, file: bytes, folder: str) -> str:
        # cloudinary sdk is sync, run it off the event loop
        result = await asyncio.to_thread(
            cloudinary.uploader.upload, file, folder=f"{settings.ROOT_ASSET_FOLDER}/{folder}", resource_type="image"
        )
        return result["secure_url"]

    async def delete_image(self, public_id: str) -> None:
        await asyncio.to_thread(cloudinary.uploader.destroy, public_id)
