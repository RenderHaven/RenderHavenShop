"""Seed categories, products and items from seed.json.

Run from backend/app:
    uv run python scripts/seed.py

Image urls are stored as-is (no cloudinary upload). Rows that already
exist (matched by name) are skipped, so the script is safe to re-run.
"""
import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select
from src.db.database import SessionLocal, create_database, engine
from src.db.models import Category, Items, Product
from src.domains.categories.repo import CategoryRepo
from src.domains.products.repo import ProductRepo
from src.domains.items.repo import ItemRepo

SEED_FILE = Path(__file__).parent / "seed.json"


async def find_by_name(db, model, name: str):
    result = await db.execute(select(model).where(model.name == name))
    return result.scalars().first()


async def seed():
    data = json.loads(SEED_FILE.read_text())
    await create_database()

    async with SessionLocal() as db:
        category_repo = CategoryRepo(db)
        product_repo = ProductRepo(db)
        item_repo = ItemRepo(db)

        category_ids = {}
        for category in data["categories"]:
            existing = await find_by_name(db, Category, category["name"])
            if existing:
                print(f"skip category  {category['name']}")
            else:
                existing = await category_repo.create(**category)
                print(f"add  category  {category['name']}")
            category_ids[category["name"]] = existing.c_id

        for product in data["products"]:
            if await find_by_name(db, Product, product["name"]):
                print(f"skip product   {product['name']}")
                continue

            items = product.pop("items")
            categories = product.pop("categories")
            created = await product_repo.create(
                category_ids=[category_ids[name] for name in categories], **product
            )
            print(f"add  product   {product['name']}")

            for item in items:
                if await find_by_name(db, Items, item["name"]):
                    continue
                images = item.pop("images")
                await item_repo.create(images, p_id=created.p_id, **item)
                print(f"add  item        {item['name']}")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
