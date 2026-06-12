"""Authentication endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
import logging

from app.core.database import get_db
from app.core.config import get_settings
from app.core.security import create_access_token
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.user_service import UserService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Register a new user."""
    try:
        user = await UserService.register_user(db, user_data)
        return UserResponse.from_orm(user)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """Authenticate user and return JWT token."""
    try:
        user = await UserService.authenticate_user(
            db,
            credentials.username,
            credentials.password,
        )

        access_token_expires = timedelta(
            minutes=get_settings().access_token_expire_minutes
        )
        access_token = create_access_token(
            data={"sub": user.id},
            expires_delta=access_token_expires,
        )

        logger.info(f"User logged in: {user.username}")

        return TokenResponse(
            access_token=access_token,
            expires_in=get_settings().access_token_expire_minutes * 60,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    current_user: dict = Depends(UserService.get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Get current authenticated user."""
    try:
        user = await UserService.get_user_by_id(db, current_user["user_id"])
        return UserResponse.from_orm(user)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user"
        )
