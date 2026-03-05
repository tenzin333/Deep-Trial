from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    gemini_api_key: str
    openai_api_key: str
    groq_api_key: str
    debug: bool = False
    jwt_expiry_hours: int
    similarity_threshold: float
    
    allow_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )
    

@lru_cache
def get_settings():
    return Settings()