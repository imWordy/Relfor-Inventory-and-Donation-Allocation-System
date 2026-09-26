from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Relfor Inventory & Donation Allocation API"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/relfor"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
