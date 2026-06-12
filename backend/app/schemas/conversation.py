"""Conversation and message schemas."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class MessageCreate(BaseModel):
    """Message creation schema."""

    content: str = Field(..., min_length=1, max_length=4000)


class MessageResponse(BaseModel):
    """Message response schema."""

    id: str
    conversation_id: str
    role: str
    content: str
    tokens_used: int
    processing_time: float
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    """Conversation creation schema."""

    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None


class ConversationUpdate(BaseModel):
    """Conversation update schema."""

    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    is_archived: Optional[int] = None


class ConversationResponse(BaseModel):
    """Conversation response schema."""

    id: str
    user_id: str
    title: Optional[str]
    description: Optional[str]
    is_archived: int
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    """Chat request schema for sending messages."""

    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Chat response schema."""

    conversation_id: str
    user_message: MessageResponse
    assistant_message: MessageResponse
    conversation: ConversationResponse
