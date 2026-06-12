"""User service for managing user accounts."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
import logging

from app.models.user import User
from app.core.security import hash_password, verify_password
from app.schemas.user import UserRegister, UserLogin

logger = logging.getLogger(__name__)


class UserService:
    """Service for user-related operations."""

    @staticmethod
    async def register_user(
        db: AsyncSession,
        user_data: UserRegister
    ) -> User:
        """Register a new user."""
        # Check if username already exists
        result = await db.execute(
            select(User).where(User.username == user_data.username)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )

        # Check if email already exists
        result = await db.execute(
            select(User).where(User.email == user_data.email)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        new_user = User(
            username=user_data.username,
            email=user_data.email,
            full_name=user_data.full_name,
        )
        new_user.set_password(user_data.password)

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        logger.info(f"User registered: {new_user.username}")
        return new_user

    @staticmethod
    async def get_user_by_username(
        db: AsyncSession,
        username: str
    ) -> User:
        """Get user by username."""
        result = await db.execute(
            select(User).where(User.username == username)
        )
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user

    @staticmethod
    async def get_user_by_id(
        db: AsyncSession,
        user_id: str
    ) -> User:
        """Get user by ID."""
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user

    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        username: str,
        password: str
    ) -> User:
        """Authenticate a user."""
        user = await UserService.get_user_by_username(db, username)
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        return user
