from sqlalchemy.orm import AsyncSession, declarative_base
from sqlalchemy import create_async_engine, create_engine
from src.config import settings
from typing import AsyncGenerator

database_url = settings.DATABASE_URL

engine = create_async_engine(database_url, echo=True)

SessionLocal = AsyncSession(engine, expire_on_commit=False,autoflush=False)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()