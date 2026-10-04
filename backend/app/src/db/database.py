from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker,AsyncSession
from src.config import settings
from typing import AsyncGenerator

database_url = settings.DATABASE_URL

Base = declarative_base()

engine = create_async_engine(database_url, echo=True)

SessionLocal = async_sessionmaker(engine, expire_on_commit=False, autoflush=False)



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