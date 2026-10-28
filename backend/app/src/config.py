from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str ="HS256"

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }

settings = Settings()