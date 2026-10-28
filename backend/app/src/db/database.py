from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker,AsyncSession
from src.config import settings
from typing import AsyncGenerator

database_url = settings.DATABASE_URL

# app is async, so force the asyncpg driver for plain postgres urls
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)



engine = create_async_engine(database_url, echo=True)

SessionLocal = async_sessionmaker(engine, expire_on_commit=False, autoflush=False)

class Base(DeclarativeBase):
    pass

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

async def create_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)