from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str ="HS256"

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    ROOT_ASSET_FOLDER: str = "renderhavenshop"

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }

settings = Settings()
