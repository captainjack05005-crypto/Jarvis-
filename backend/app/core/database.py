"""Database connection and session management."""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
import logging

from app.core.config import get_settings

logger = logging.getLogger(__name__)

Base = declarative_base()


async def get_async_engine():
    """Create async SQLAlchemy engine."""
    settings = get_settings()
    
    # Convert postgresql:// to postgresql+asyncpg://
    database_url = settings.database_url.replace(
        "postgresql://", "postgresql+asyncpg://"
    )
    
    engine = create_async_engine(
        database_url,
        echo=settings.database_echo,
        pool_size=settings.database_pool_size,
        max_overflow=settings.database_max_overflow,
        pool_pre_ping=True,
        poolclass=NullPool,
    )
    return engine


async def get_async_session_factory():
    """Create async session factory."""
    engine = await get_async_engine()
    return sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )


async def get_db() -> AsyncSession:
    """Get database session for dependency injection."""
    engine = await get_async_engine()
    async_session = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with async_session() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {str(e)}")
            raise
        finally:
            await session.close()
