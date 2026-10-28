from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.db.database import create_database
import src.db.models
from src.api import api_router
from src.core.openapi import setup_openapi

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_database() 
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(api_router)
setup_openapi(app)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "healthy"}