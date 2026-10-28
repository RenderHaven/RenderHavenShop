from fastapi import APIRouter
from .categories import router as categories_router
from .products import router as products_router
from .items import router as items_router

api_router = APIRouter()
api_router.include_router(categories_router)
api_router.include_router(products_router)
api_router.include_router(items_router)
