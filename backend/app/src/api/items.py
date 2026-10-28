from uuid import UUID
from typing import Annotated
from fastapi import APIRouter, Form, HTTPException, UploadFile
from src.db.database import SessionLocal
from src.db.models.enums import DiscountType
from src.domains.items.models import ItemCreate, ItemRead
from src.domains.items.service import ItemService

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=list[ItemRead])
async def get_items():
    async with SessionLocal() as db:
        return await ItemService(db).get_items()

@router.get("/{i_id}", response_model=ItemRead)
async def get_item(i_id: UUID):
    async with SessionLocal() as db:
        item = await ItemService(db).get_item(i_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=ItemRead, status_code=201)
async def add_item(
    p_id: Annotated[UUID, Form()],
    name: Annotated[str, Form()],
    price: Annotated[float, Form()],
    images: list[UploadFile],
    stock: Annotated[int, Form()] = 0,
    description: Annotated[str | None, Form()] = None,
    discount: Annotated[float | None, Form()] = None,
    discount_type: Annotated[DiscountType | None, Form()] = None,
):
    data = ItemCreate(
        p_id=p_id, name=name, price=price, stock=stock, description=description,
        discount=discount, discount_type=discount_type,
    )
    async with SessionLocal() as db:
        return await ItemService(db).add_item(data, [await image.read() for image in images])

@router.post("/{i_id}/images", response_model=ItemRead)
async def add_item_image(i_id: UUID, file: UploadFile):
    async with SessionLocal() as db:
        item = await ItemService(db).add_image(i_id, await file.read())
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
