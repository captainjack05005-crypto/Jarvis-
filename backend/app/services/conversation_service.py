"""Conversation service for managing chat sessions."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
import logging
from typing import List, Optional

from app.models.conversation import Conversation, Message
from app.models.user import User
from app.schemas.conversation import ConversationCreate, ConversationUpdate

logger = logging.getLogger(__name__)


class ConversationService:
    """Service for conversation-related operations."""

    @staticmethod
    async def create_conversation(
        db: AsyncSession,
        user_id: str,
        conversation_data: ConversationCreate,
    ) -> Conversation:
        """Create a new conversation."""
        # Verify user exists
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        conversation = Conversation(
            user_id=user_id,
            title=conversation_data.title,
            description=conversation_data.description,
        )
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)

        logger.info(f"Conversation created: {conversation.id}")
        return conversation

    @staticmethod
    async def get_conversation(
        db: AsyncSession,
        conversation_id: str,
        user_id: str,
    ) -> Conversation:
        """Get a conversation by ID."""
        result = await db.execute(
            select(Conversation)
            .where(
                (Conversation.id == conversation_id) &
                (Conversation.user_id == user_id)
            )
            .options(selectinload(Conversation.messages))
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
        return conversation

    @staticmethod
    async def get_user_conversations(
        db: AsyncSession,
        user_id: str,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Conversation]:
        """Get all conversations for a user."""
        result = await db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def update_conversation(
        db: AsyncSession,
        conversation_id: str,
        user_id: str,
        conversation_data: ConversationUpdate,
    ) -> Conversation:
        """Update a conversation."""
        conversation = await ConversationService.get_conversation(
            db, conversation_id, user_id
        )

        update_data = conversation_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(conversation, key, value)

        await db.commit()
        await db.refresh(conversation)

        logger.info(f"Conversation updated: {conversation.id}")
        return conversation

    @staticmethod
    async def delete_conversation(
        db: AsyncSession,
        conversation_id: str,
        user_id: str,
    ) -> None:
        """Delete a conversation."""
        conversation = await ConversationService.get_conversation(
            db, conversation_id, user_id
        )
        await db.delete(conversation)
        await db.commit()

        logger.info(f"Conversation deleted: {conversation.id}")

    @staticmethod
    async def add_message(
        db: AsyncSession,
        conversation_id: str,
        role: str,
        content: str,
        tokens_used: int = 0,
        processing_time: float = 0.0,
    ) -> Message:
        """Add a message to a conversation."""
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            tokens_used=tokens_used,
            processing_time=processing_time,
        )
        db.add(message)
        await db.commit()
        await db.refresh(message)

        logger.info(f"Message added to conversation {conversation_id}")
        return message

    @staticmethod
    async def get_conversation_history(
        db: AsyncSession,
        conversation_id: str,
        user_id: str,
        limit: int = 50,
    ) -> List[Message]:
        """Get message history for a conversation."""
        conversation = await ConversationService.get_conversation(
            db, conversation_id, user_id
        )

        result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        return result.scalars().all()
