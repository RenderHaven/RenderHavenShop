from uuid import UUID
from typing import Annotated
from fastapi import APIRouter, Form, HTTPException, UploadFile
from src.db.database import SessionLocal
from src.db.models.enums import DiscountType
from src.domains.products.models import ProductCreate, ProductRead
from src.domains.products.service import ProductService
from src.domains.items.models import ItemRead
from src.domains.items.service import ItemService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[ProductRead])
async def get_products():
    async with SessionLocal() as db:
        return await ProductService(db).get_products()

@router.get("/{p_id}", response_model=ProductRead)
async def get_product(p_id: UUID):
    async with SessionLocal() as db:
        product = await ProductService(db).get_product(p_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{p_id}/items", response_model=list[ItemRead])
async def get_product_items(p_id: UUID):
    async with SessionLocal() as db:
        return await ItemService(db).get_items_by_product(p_id)

@router.post("/", response_model=ProductRead, status_code=201)
async def add_product(
    name: Annotated[str, Form()],
    thumbnail: UploadFile,
    discount: Annotated[float | None, Form()] = None,
    discount_type: Annotated[DiscountType | None, Form()] = None,
    category_ids: Annotated[list[str], Form()] = [],
):
    # swagger sends "" for an empty list item and may send "1,2" in one field
    ids = [c.strip() for value in category_ids for c in value.split(",") if c.strip()]
    if not all(c.isdigit() for c in ids):
        raise HTTPException(status_code=422, detail="category_ids must be integers")
    data = ProductCreate(
        name=name, discount=discount, discount_type=discount_type,
        category_ids=[int(c) for c in ids],
    )
    async with SessionLocal() as db:
        return await ProductService(db).add_product(data, await thumbnail.read())

@router.post("/{p_id}/thumbnail", response_model=ProductRead)
async def add_thumbnail(p_id: UUID, file: UploadFile):
    async with SessionLocal() as db:
        product = await ProductService(db).add_thumbnail(p_id, await file.read())
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
