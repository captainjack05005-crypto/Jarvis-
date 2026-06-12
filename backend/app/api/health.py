"""Health check endpoints."""

from fastapi import APIRouter, status
from datetime import datetime

router = APIRouter(tags=["health"])


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check() -> dict:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness_check() -> dict:
    """Readiness check endpoint."""
    return {
        "status": "ready",
        "timestamp": datetime.utcnow().isoformat(),
    }
