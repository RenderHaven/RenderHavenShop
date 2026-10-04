from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.db.database import create_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_database() 
    yield

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health():
    return {"status": "healthy"}