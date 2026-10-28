from typing import Annotated
from fastapi import APIRouter, Form, HTTPException, UploadFile
from src.db.database import SessionLocal
from src.db.models.enums import CategoryType, DiscountType
from src.domains.categories.models import CategoryCreate, CategoryRead
from src.domains.categories.service import CategoryService
from src.domains.products.models import ProductRead
from src.domains.products.service import ProductService

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=list[CategoryRead])
async def get_categories():
    async with SessionLocal() as db:
        return await CategoryService(db).get_categories()

@router.get("/{c_id}", response_model=CategoryRead)
async def get_category(c_id: int):
    async with SessionLocal() as db:
        category = await CategoryService(db).get_category(c_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.get("/{c_id}/subcategories", response_model=list[CategoryRead])
async def get_subcategories(c_id: int):
    async with SessionLocal() as db:
        return await CategoryService(db).get_subcategories(c_id)

@router.get("/{c_id}/products", response_model=list[ProductRead])
async def get_category_products(c_id: int):
    async with SessionLocal() as db:
        return await ProductService(db).get_products_by_category(c_id)

@router.post("/", response_model=CategoryRead, status_code=201)
async def add_category(
    name: Annotated[str, Form()],
    type: Annotated[CategoryType, Form()],
    banner: UploadFile,
    parent_id: Annotated[int | None, Form()] = None,
    description: Annotated[str | None, Form()] = None,
    discount: Annotated[float | None, Form()] = None,
    discount_type: Annotated[DiscountType | None, Form()] = None,
):
    data = CategoryCreate(
        name=name, type=type, parent_id=parent_id, description=description,
        discount=discount, discount_type=discount_type,
    )
    async with SessionLocal() as db:
        return await CategoryService(db).add_category(data, await banner.read())

@router.post("/{c_id}/banner", response_model=CategoryRead)
async def add_banner(c_id: int, file: UploadFile):
    async with SessionLocal() as db:
        category = await CategoryService(db).add_banner(c_id, await file.read())
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category
