from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Relfor Inventory & Donation Allocation API"
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/relfor"
    
    SECRET_KEY: str = "relfor_development_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
