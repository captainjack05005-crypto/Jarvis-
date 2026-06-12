"""Application configuration settings."""

from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "JARVIS"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True

    # API Configuration
    api_prefix: str = "/api/v1"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Database
    database_url: str = "postgresql://user:password@localhost:5432/jarvis_db"
    database_echo: bool = False
    database_pool_size: int = 5
    database_max_overflow: int = 10

    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4"
    openai_temperature: float = 0.7
    openai_max_tokens: int = 2048

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_cache_expire: int = 3600  # 1 hour

    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]
    cors_credentials: bool = True
    cors_methods: List[str] = ["*"]
    cors_headers: List[str] = ["*"]

    # JWT
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # Conversation
    max_conversation_history: int = 50
    system_prompt: str = "You are JARVIS, an intelligent AI assistant designed to help with various tasks."

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()
