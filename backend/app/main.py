"""FastAPI application factory and configuration."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import logging.config

from app.core.config import get_settings
from app.api import auth, chat, health
from app.core.database import Base, get_async_engine

# Configure logging
logging_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        },
    },
    "loggers": {
        "app": {"handlers": ["default"], "level": "INFO"},
    },
}
logging.config.dictConfig(logging_config)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Startup
    logger.info("Starting JARVIS application")
    engine = await get_async_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created/verified")
    yield
    # Shutdown
    logger.info("Shutting down JARVIS application")
    await engine.dispose()


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Production-ready AI Assistant API",
        lifespan=lifespan,
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_credentials,
        allow_methods=settings.cors_methods,
        allow_headers=settings.cors_headers,
    )

    # Add trusted host middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1"],
    )

    # Include routers
    app.include_router(health.router)
    app.include_router(auth.router, prefix=settings.api_prefix)
    app.include_router(chat.router, prefix=settings.api_prefix)

    @app.get("/")
    async def root():
        return {
            "message": "Welcome to JARVIS API",
            "version": settings.app_version,
            "docs": "/docs",
        }

    logger.info(f"JARVIS API initialized - Version {settings.app_version}")
    return app


app = create_app()
